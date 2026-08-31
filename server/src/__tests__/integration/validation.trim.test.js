'use strict';

/**
 * Integration Property-Based Tests: String Inputs Are Trimmed Before Persistence
 * (Property 19)
 *
 * **Validates: Requirements 18.5**
 *
 * Uses mongodb-memory-server + supertest + fast-check.
 *
 * Property 19a: for any string with arbitrary leading/trailing whitespace sent
 *   as the `name` field to POST /api/auth/register → the persisted value equals
 *   the trimmed string (verified via GET /api/users/me)
 *
 * Property 19b: for any string with arbitrary leading/trailing whitespace sent
 *   as the `name`, `subject`, `message` fields to POST /api/contact → HTTP 201
 *   is returned and the DB record contains trimmed values
 *
 * Property 19c: sending a name composed only of spaces to
 *   POST /api/auth/register → HTTP 422 returned (empty after trim = invalid)
 */

// ── Mock nodemailer before any require of the app ─────────────────────────────
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
process.env.JWT_SECRET = 'test-secret-trim';

const app = require('../../app');
const User = mongoose.model('User');
const ContactSubmission = mongoose.model('ContactSubmission');
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

// ── Arbitraries ────────────────────────────────────────────────────────────────

/**
 * Generates a non-empty string (1–50 chars, trimmed length >= 1) padded with
 * leading and trailing spaces so the raw value differs from the trimmed value.
 */
const paddedStringArb = fc
  .string({ minLength: 1, maxLength: 50 })
  .filter((s) => s.trim().length > 0 && s.trim().length <= 50)
  .map((s) => '  ' + s + '  ');

/**
 * Generates a string composed entirely of space characters (1–50 spaces).
 * After trimming, this yields an empty string — which must be rejected (422).
 */
const spacesOnlyArb = fc.stringOf(
  fc.constantFrom(' '),
  { minLength: 1, maxLength: 50 }
);

/**
 * Generates a unique email for each registration to avoid uniqueness conflicts.
 */
const uniqueEmailArb = fc
  .nat({ max: 999999 })
  .map((n) => `trim.test.${n}@example.com`);

// ── Property 19a: User registration — name is trimmed before persistence ───────

describe(
  'Property 19a: POST /api/auth/register name with leading/trailing spaces → persisted name equals trimmed value',
  () => {
    // Feature: ahadu-center-backend, Property 19: string inputs trimmed before persistence (user registration)
    it(
      'Property 19a: registered name persisted as trimmed string, verified via GET /api/users/me',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            paddedStringArb,
            uniqueEmailArb,
            async (paddedName, email) => {
              // Clean slate for each run
              await User.deleteMany({});

              const password = 'Password123!';
              const trimmedName = paddedName.trim();

              // Step 1 — Register with a padded name
              const registerRes = await request
                .post('/api/auth/register')
                .send({ email, password, name: paddedName });

              if (registerRes.status !== 201) {
                throw new Error(
                  `Register failed with ${registerRes.status}: ${JSON.stringify(registerRes.body)} (name: ${JSON.stringify(paddedName)})`
                );
              }

              // Step 2 — Login to get a token
              const loginRes = await request
                .post('/api/auth/login')
                .send({ email, password });

              if (loginRes.status !== 200) {
                throw new Error(
                  `Login failed with ${loginRes.status}: ${JSON.stringify(loginRes.body)}`
                );
              }

              const token = loginRes.body.token;

              // Step 3 — GET /api/users/me and verify name equals trimmed input
              const meRes = await request
                .get('/api/users/me')
                .set('Authorization', `Bearer ${token}`);

              if (meRes.status !== 200) {
                throw new Error(
                  `GET /api/users/me failed with ${meRes.status}: ${JSON.stringify(meRes.body)}`
                );
              }

              const persistedName = meRes.body.name;

              // Persisted name must equal the trimmed input (Requirement 18.5)
              if (persistedName !== trimmedName) {
                throw new Error(
                  `Expected persisted name ${JSON.stringify(trimmedName)}, got ${JSON.stringify(persistedName)} (raw input: ${JSON.stringify(paddedName)})`
                );
              }

              return true;
            }
          ),
          { numRuns: 20 }
        );
      }
    );
  }
);

// ── Property 19b: Contact form — name/subject/message trimmed before persistence

describe(
  'Property 19b: POST /api/contact with padded name/subject/message → 201 and DB record has trimmed values',
  () => {
    beforeEach(async () => {
      await ContactSubmission.deleteMany({});
    });

    // Feature: ahadu-center-backend, Property 19: string inputs trimmed before persistence (contact form)
    it(
      'Property 19b: contact submission persisted with trimmed name, subject, and message',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            paddedStringArb,
            paddedStringArb,
            paddedStringArb,
            async (paddedName, paddedSubject, paddedMessage) => {
              // Clean slate for each run
              await ContactSubmission.deleteMany({});

              const trimmedName    = paddedName.trim();
              const trimmedSubject = paddedSubject.trim();
              const trimmedMessage = paddedMessage.trim();

              // POST /api/contact with padded field values
              const res = await request
                .post('/api/contact')
                .send({
                  name:    paddedName,
                  email:   'contact.trim@example.com',
                  subject: paddedSubject,
                  message: paddedMessage,
                });

              // Must return HTTP 201 (Requirement 13.1)
              if (res.status !== 201) {
                throw new Error(
                  `POST /api/contact failed with ${res.status}: ${JSON.stringify(res.body)} (name: ${JSON.stringify(paddedName)})`
                );
              }

              // Verify the DB record contains trimmed values (Requirement 18.5)
              const submission = await ContactSubmission.findOne({});

              if (!submission) {
                throw new Error('ContactSubmission not found in DB after successful POST');
              }

              if (submission.name !== trimmedName) {
                throw new Error(
                  `DB name: expected ${JSON.stringify(trimmedName)}, got ${JSON.stringify(submission.name)} (raw: ${JSON.stringify(paddedName)})`
                );
              }

              if (submission.subject !== trimmedSubject) {
                throw new Error(
                  `DB subject: expected ${JSON.stringify(trimmedSubject)}, got ${JSON.stringify(submission.subject)} (raw: ${JSON.stringify(paddedSubject)})`
                );
              }

              if (submission.message !== trimmedMessage) {
                throw new Error(
                  `DB message: expected ${JSON.stringify(trimmedMessage)}, got ${JSON.stringify(submission.message)} (raw: ${JSON.stringify(paddedMessage)})`
                );
              }

              return true;
            }
          ),
          { numRuns: 20 }
        );
      }
    );
  }
);

// ── Property 19c: Spaces-only name → HTTP 422 (empty after trim) ───────────────

describe(
  'Property 19c: POST /api/auth/register with spaces-only name → HTTP 422',
  () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });

    // Feature: ahadu-center-backend, Property 19: empty-after-trim required field yields HTTP 422
    it(
      'Property 19c: name composed only of spaces is rejected with 422',
      async () => {
        await fc.assert(
          fc.asyncProperty(spacesOnlyArb, async (spacesName) => {
            const res = await request
              .post('/api/auth/register')
              .send({
                email:    'spaces.only@example.com',
                password: 'Password123!',
                name:     spacesName,
              });

            // Must return HTTP 422 (Requirement 18.5 — empty after trim is invalid)
            if (res.status !== 422) {
              throw new Error(
                `Expected 422 for spaces-only name, got ${res.status}: ${JSON.stringify(res.body)} (name: ${JSON.stringify(spacesName)})`
              );
            }

            return true;
          }),
          { numRuns: 10 }
        );
      }
    );
  }
);
