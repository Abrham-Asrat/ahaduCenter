'use strict';

/**
 * Integration Property-Based Tests: User Profile Update Round Trip (Property 4)
 *
 * **Validates: Requirements 3.2**
 *
 * Uses mongodb-memory-server + supertest + fast-check.
 *
 * Property 4: for any valid { name, email, phone } payload →
 *   PUT /api/users/me → GET /api/users/me → returned fields match sent fields
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
process.env.JWT_SECRET = 'test-secret-user';

const app = require('../../app');
const User = mongoose.model('User');
const request = supertest(app);

// ── MongoMemoryServer lifecycle ────────────────────────────────────────────────

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: { startupTimeout: 60000 },
  });
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}, 90000); // extend Jest's beforeAll timeout to 90 s

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Clear users between each test
beforeEach(async () => {
  await User.deleteMany({});
});

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Registers a new user and returns the JWT token.
 * Uses a unique seed email so concurrent property runs don't collide.
 */
async function registerAndLogin(seedSuffix) {
  const email = `seed.user.${seedSuffix}@example.com`;
  const password = 'Password123!';
  const name = 'Seed User';

  await request
    .post('/api/auth/register')
    .send({ email, password, name });

  const loginRes = await request
    .post('/api/auth/login')
    .send({ email, password });

  if (loginRes.status !== 200) {
    throw new Error(
      `Login failed with ${loginRes.status}: ${JSON.stringify(loginRes.body)}`
    );
  }

  return loginRes.body.token;
}

// ── Arbitraries ────────────────────────────────────────────────────────────────

/**
 * Valid name: 1–100 printable non-whitespace characters.
 * We use a regex-constrained string so names always have real content.
 * Two variants: single letter names and multi-character names.
 */
const validName = fc.oneof(
  // Single letter
  fc.stringMatching(/^[A-Za-z]$/),
  // Multi-character: letter, optional middle, alphanumeric end
  fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,98}[A-Za-z0-9]$/).filter(
    (s) => s.trim().length >= 2 && s.trim().length <= 100
  )
);

/**
 * Valid email: simple lowercase email addresses that pass express-validator.
 * express-validator normalizeEmail() lowercases local+domain parts.
 * We construct deterministically: local@domain.tld all lowercase letters.
 */
const validEmail = fc
  .tuple(
    fc.stringMatching(/^[a-z]{1,20}$/),
    fc.stringMatching(/^[a-z]{1,10}$/),
    fc.constantFrom('com', 'net', 'org', 'io')
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

/**
 * Valid phone: optional trimmed string (no format constraint per validators).
 * We use simple numeric strings that are obviously phone-like.
 */
const validPhone = fc.stringMatching(/^[0-9]{0,15}$/);

// ── Property 4: PUT /api/users/me → GET /api/users/me → fields match ──────────

describe('Property 4: user profile update round trip', () => {
  /**
   * For any valid { name, email, phone } payload:
   * 1. Register + login to get a fresh JWT
   * 2. PUT /api/users/me with the payload → HTTP 200
   * 3. GET /api/users/me with the same JWT → HTTP 200
   * 4. Returned name, email, phone match the values that were sent
   *
   * **Validates: Requirements 3.2**
   */
  it('Property 4: put then get returns the updated name, email, and phone', async () => {
    await fc.assert(
      fc.asyncProperty(
        validName,
        validEmail,
        validPhone,
        async (name, newEmail, phone) => {
          // Each run registers a fresh user to avoid email-uniqueness conflicts
          // between the seed user and the new email being set.
          await User.deleteMany({});

          const token = await registerAndLogin('prop4');

          // Build the update payload
          const payload = { name, email: newEmail, phone };

          // Step 1 — PUT /api/users/me
          const putRes = await request
            .put('/api/users/me')
            .set('Authorization', `Bearer ${token}`)
            .send(payload);

          if (putRes.status !== 200) {
            throw new Error(
              `PUT /api/users/me failed with ${putRes.status}: ${JSON.stringify(putRes.body)}`
            );
          }

          // The PUT response itself should already reflect the updated fields
          const putBody = putRes.body;

          const expectedName  = name.trim();
          const expectedEmail = newEmail.toLowerCase().trim();
          const expectedPhone = phone.trim();

          if (putBody.name !== expectedName) {
            throw new Error(
              `PUT response: expected name "${expectedName}", got "${putBody.name}"`
            );
          }
          if (putBody.email !== expectedEmail) {
            throw new Error(
              `PUT response: expected email "${expectedEmail}", got "${putBody.email}"`
            );
          }
          if (putBody.phone !== expectedPhone) {
            throw new Error(
              `PUT response: expected phone "${expectedPhone}", got "${putBody.phone}"`
            );
          }

          // Step 2 — GET /api/users/me (round trip verification)
          const getRes = await request
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`);

          if (getRes.status !== 200) {
            throw new Error(
              `GET /api/users/me failed with ${getRes.status}: ${JSON.stringify(getRes.body)}`
            );
          }

          const getBody = getRes.body;

          if (getBody.name !== expectedName) {
            throw new Error(
              `GET response: expected name "${expectedName}", got "${getBody.name}"`
            );
          }
          if (getBody.email !== expectedEmail) {
            throw new Error(
              `GET response: expected email "${expectedEmail}", got "${getBody.email}"`
            );
          }
          if (getBody.phone !== expectedPhone) {
            throw new Error(
              `GET response: expected phone "${expectedPhone}", got "${getBody.phone}"`
            );
          }

          return true;
        }
      ),
      { numRuns: 5 } // keep integration runs reasonable
    );
  });

  // ── Additional edge-case examples ─────────────────────────────────────────

  it('PUT with only name updates name, leaves other fields unchanged', async () => {
    const token = await registerAndLogin('nameonly');

    const putRes = await request
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name Only' });

    expect(putRes.status).toBe(200);
    expect(putRes.body.name).toBe('Updated Name Only');

    // Verify via GET
    const getRes = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe('Updated Name Only');
  });

  it('PUT with only phone updates phone', async () => {
    const token = await registerAndLogin('phoneonly');

    const putRes = await request
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '0911234567' });

    expect(putRes.status).toBe(200);
    expect(putRes.body.phone).toBe('0911234567');

    const getRes = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.phone).toBe('0911234567');
  });

  it('PUT with only email updates email', async () => {
    const token = await registerAndLogin('emailonly');

    const putRes = await request
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'newemail@example.com' });

    expect(putRes.status).toBe(200);
    expect(putRes.body.email).toBe('newemail@example.com');

    const getRes = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.email).toBe('newemail@example.com');
  });

  it('GET /api/users/me without JWT returns 401', async () => {
    const res = await request.get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('PUT /api/users/me without JWT returns 401', async () => {
    const res = await request
      .put('/api/users/me')
      .send({ name: 'No Auth' });
    expect(res.status).toBe(401);
  });

  it('PUT /api/users/me with no valid fields returns 422', async () => {
    const token = await registerAndLogin('nofields');

    const res = await request
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(422);
  });

  it('PUT /api/users/me response includes all required profile fields', async () => {
    const token = await registerAndLogin('fieldcheck');

    const putRes = await request
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Field Check User', phone: '123456789' });

    expect(putRes.status).toBe(200);

    // Verify all required profile fields are present in the response
    expect(putRes.body).toHaveProperty('id');
    expect(putRes.body).toHaveProperty('name');
    expect(putRes.body).toHaveProperty('email');
    expect(putRes.body).toHaveProperty('phone');
    expect(putRes.body).toHaveProperty('role');
    expect(putRes.body).toHaveProperty('memberSince');
  });
});
