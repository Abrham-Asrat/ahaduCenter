'use strict';

/**
 * Integration Property-Based Tests: Auth Round Trip (Properties 1, 2, 3)
 *
 * **Validates: Requirements 2.1, 2.3, 2.6, 2.9**
 *
 * Uses mongodb-memory-server + supertest + fast-check.
 */

// ── Mock nodemailer before any require of the controller ───────────────────────
jest.mock('nodemailer', () => {
  const sendMail = jest.fn().mockResolvedValue({ messageId: 'test-msg-id' });
  const createTransport = jest.fn().mockReturnValue({ sendMail });
  return { createTransport, __sendMail: sendMail };
});

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const supertest = require('supertest');
const fc = require('fast-check');

// Set env vars BEFORE requiring the app (JWT_SECRET is needed at load time)
process.env.JWT_SECRET = 'test-secret';

const app = require('../../app');
// Get User model from the mongoose registry (already compiled by app.js)
const User = mongoose.model('User');
const request = supertest(app);

// ── MongoMemoryServer lifecycle ────────────────────────────────────────────────

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: { startupTimeout: 120000 },
    binary: { downloadDir: './.mongodb-binaries' },
  });
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}, 150000);

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop(true);
  }
});

// Clear users between each property run
beforeEach(async () => {
  await User.deleteMany({});
});

// ── Arbitraries ────────────────────────────────────────────────────────────────

/**
 * Generates a valid email address.
 * express-validator's normalizeEmail() lowercases the local part and domain.
 * We use fc.emailAddress() which produces RFC-valid emails.
 */
const validEmail = fc.emailAddress();

/**
 * Generates a valid password (8–128 printable ASCII chars, no spaces at
 * boundaries that could confuse trimming, guaranteed non-empty after trim).
 */
const validPassword = fc.string({
  minLength: 8,
  maxLength: 128,
  unit: fc.char({ min: '!', max: '~' }), // printable ASCII, no whitespace
});

/**
 * Generates a valid name (1–100 non-whitespace-only, trimmed length 1-100).
 */
const validName = fc.string({ minLength: 1, maxLength: 100 }).filter(
  (s) => s.trim().length >= 1 && s.trim().length <= 100
);

/**
 * Generates arbitrary non-empty strings to use as email in forgot-password.
 * The validator only requires the field exists (checkFalsy: true).
 */
const arbitraryEmailString = fc
  .string({ minLength: 1, maxLength: 254 })
  .filter((s) => s.trim().length >= 1); // must not be falsy after trim

// ── Property 1: Valid register → login → HTTP 200 + JWT + correct user fields ──

describe(
  'Property 1: register then login returns 200, JWT, and correct user fields',
  () => {
    /**
     * For any valid (email, password, name):
     * 1. POST /api/auth/register succeeds (2xx)
     * 2. POST /api/auth/login with same credentials returns 200
     * 3. Response contains: token (string), name, email (normalised), role "user"
     *
     * **Validates: Requirements 2.1, 2.3**
     */
    it('Property 1: register + login round trip', async () => {
      await fc.assert(
        fc.asyncProperty(validEmail, validPassword, validName, async (email, password, name) => {
          // Clear DB between runs inside the property (numRuns > 1 per test)
          await User.deleteMany({});

          // Step 1 – Register
          const registerRes = await request
            .post('/api/auth/register')
            .send({ email, password, name });

          // Registration must succeed
          if (registerRes.status !== 201) {
            // Unexpected failure — re-throw so fast-check treats it as a violation
            throw new Error(
              `Register failed with ${registerRes.status}: ${JSON.stringify(registerRes.body)}`
            );
          }

          // Step 2 – Login with the same credentials
          const loginRes = await request
            .post('/api/auth/login')
            .send({ email, password });

          // HTTP 200
          if (loginRes.status !== 200) {
            throw new Error(
              `Login failed with ${loginRes.status}: ${JSON.stringify(loginRes.body)}`
            );
          }

          const body = loginRes.body;

          // JWT is present and is a non-empty string
          if (typeof body.token !== 'string' || body.token.length === 0) {
            throw new Error(`token missing or empty: ${JSON.stringify(body)}`);
          }

          // role must be "user"
          if (body.role !== 'user') {
            throw new Error(`Expected role "user", got "${body.role}"`);
          }

          // email in response must be the normalised (lowercase) version
          const expectedEmail = email.toLowerCase().trim();
          if (body.email !== expectedEmail) {
            throw new Error(
              `Expected email "${expectedEmail}", got "${body.email}"`
            );
          }

          // name must be present and non-empty
          if (typeof body.name !== 'string' || body.name.trim().length === 0) {
            throw new Error(`name missing or empty: ${JSON.stringify(body)}`);
          }

          return true;
        }),
        { numRuns: 5 } // keep integration runs reasonable
      );
    });
  }
);

// ── Property 2: passwordHash stored in DB ≠ plaintext password ─────────────────

describe('Property 2: password is stored hashed, not as plaintext', () => {
  /**
   * For any valid (email, password, name):
   * After register, User.findOne({ email }).passwordHash !== plaintext password.
   *
   * **Validates: Requirements 2.9**
   */
  it('Property 2: DB passwordHash differs from plaintext password', async () => {
    await fc.assert(
      fc.asyncProperty(validEmail, validPassword, validName, async (email, password, name) => {
        await User.deleteMany({});

        const registerRes = await request
          .post('/api/auth/register')
          .send({ email, password, name });

        if (registerRes.status !== 201) {
          throw new Error(
            `Register failed with ${registerRes.status}: ${JSON.stringify(registerRes.body)}`
          );
        }

        // Fetch raw DB document
        const normalised = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalised });

        if (!user) {
          throw new Error('User not found in DB after register');
        }

        // passwordHash must not equal the plaintext password
        if (user.passwordHash === password) {
          throw new Error(
            `passwordHash equals plaintext password! hash="${user.passwordHash}"`
          );
        }

        // passwordHash must be a bcrypt hash (starts with $2)
        if (!user.passwordHash.startsWith('$2')) {
          throw new Error(
            `passwordHash does not look like a bcrypt hash: "${user.passwordHash}"`
          );
        }

        return true;
      }),
      { numRuns: 5 }
    );
  });
});

// ── Property 3: forgot-password always returns 200 { message: "Reset instructions sent" } ──

describe(
  'Property 3: forgot-password returns 200 with constant message for any email string',
  () => {
    /**
     * For any non-empty email string (registered or not):
     * POST /api/auth/forgot-password → HTTP 200, body { message: "Reset instructions sent" }
     * The response must not vary based on whether the email exists.
     *
     * **Validates: Requirements 2.6**
     */
    it('Property 3: forgot-password constant response regardless of email', async () => {
      await fc.assert(
        fc.asyncProperty(arbitraryEmailString, async (emailStr) => {
          const res = await request
            .post('/api/auth/forgot-password')
            .send({ email: emailStr });

          if (res.status !== 200) {
            throw new Error(
              `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`
            );
          }

          if (
            !res.body ||
            res.body.message !== 'Reset instructions sent'
          ) {
            throw new Error(
              `Expected { message: "Reset instructions sent" }, got ${JSON.stringify(res.body)}`
            );
          }

          return true;
        }),
        { numRuns: 5 }
      );
    });

    it('Property 3: forgot-password constant response for a registered email', async () => {
      // Also test with an actually registered email to confirm no differentiation
      const email = 'registered@example.com';
      const password = 'Password123!';
      const name = 'Test User';

      await request
        .post('/api/auth/register')
        .send({ email, password, name });

      const res = await request
        .post('/api/auth/forgot-password')
        .send({ email });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Reset instructions sent' });
    });
  }
);
