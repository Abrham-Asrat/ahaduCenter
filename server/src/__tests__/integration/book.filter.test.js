'use strict';

/**
 * Integration Property-Based Tests: Book Filter, Borrow, Return, Renew
 * (Properties 5, 10, 11, 12)
 *
 * **Validates: Requirements 4.2, 5.1, 5.5, 5.7**
 *
 * Uses mongodb-memory-server + supertest + fast-check.
 *
 * Property 5:  for any non-empty q → every returned book's title, author, or
 *              isbn contains q (case-insensitive)
 * Property 10: borrow creates Borrowing with dueDate = borrowDate + 14 days,
 *              renewalsLeft = 2, status = Active; book.availableCopies
 *              decremented by 1
 * Property 11: borrow then return → availableCopies restored to original value
 * Property 12: for any active Borrowing with renewalsLeft > 0 → renew →
 *              dueDate += 14 days, renewalsLeft -= 1
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
process.env.JWT_SECRET = 'test-secret-book';
process.env.OVERDUE_FEE_PER_DAY = '1';

const app = require('../../app');
const Book = mongoose.model('Book');
const User = mongoose.model('User');
const Borrowing = mongoose.model('Borrowing');
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
  // Ensure the text index on (title, author, isbn) is created before any
  // $text queries run — MongoMemoryServer does not auto-create indexes.
  await Book.createIndexes();
}, 150000);

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop(true);
  }
});

// Clear all relevant collections between tests
beforeEach(async () => {
  await User.deleteMany({});
  await Book.deleteMany({});
  await Borrowing.deleteMany({});
});

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Registers a new user and returns the JWT token.
 */
async function registerAndLogin(seedSuffix) {
  const email = `booktest.${seedSuffix}@example.com`;
  const password = 'Password123!';
  const name = 'Book Test User';

  await request.post('/api/auth/register').send({ email, password, name });

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

/**
 * Inserts a book directly via Mongoose and ensures the text index is ready.
 */
async function seedBook(fields) {
  return Book.create({
    title: fields.title || 'Default Title',
    author: fields.author || 'Default Author',
    isbn: fields.isbn || '',
    availableCopies: fields.availableCopies !== undefined ? fields.availableCopies : 1,
    totalCopies: fields.totalCopies !== undefined ? fields.totalCopies : 1,
  });
}

// ── Property 5: Book Search Filter Correctness ────────────────────────────────

describe(
  'Property 5: book search filter — every result contains q in title, author, or isbn',
  () => {
    // Feature: ahadu-center-backend, Property 5: book search filter correctness
    it('Property 5: GET /api/books?q=<term> returns only books matching the term', async () => {
      // The book endpoint uses MongoDB $text search. $text search matches on whole
      // words (using the text index on title, author, isbn). We seed a controlled
      // set of books where query terms ARE whole words in one of those fields, so
      // the $text search will find them, and verify the property via a regex check
      // on the returned data.
      //
      // Strategy:
      //   - Pick a fixed set of distinct single-word search terms.
      //   - For each term, seed exactly one "matching" book and one "non-matching"
      //     book.
      //   - Query with the term and assert every returned book contains the term
      //     (case-insensitive) in title, author, or isbn.

      // Words guaranteed to be whole English words for $text search
      const terms = [
        { q: 'Dragon',      matchTitle: 'Dragon Age',     noMatchTitle: 'Unrelated Book One' },
        { q: 'Foundation',  matchAuthor: 'Foundation Asimov', noMatchTitle: 'Random Story Two' },
        { q: 'Dune',        matchTitle: 'Dune Chronicles', noMatchTitle: 'Another Trilogy' },
      ];

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...terms),
          async ({ q, matchTitle, matchAuthor, noMatchTitle }) => {
            await Book.deleteMany({});

            // Seed a matching book
            await seedBook({
              title: matchTitle || `Title with ${q}`,
              author: matchAuthor || 'Some Author',
              isbn: '',
              availableCopies: 2,
              totalCopies: 2,
            });

            // Seed a non-matching book (no occurrence of q)
            await seedBook({
              title: noMatchTitle,
              author: 'Another Author',
              isbn: '',
              availableCopies: 1,
              totalCopies: 1,
            });

            const res = await request.get(`/api/books?q=${encodeURIComponent(q)}`);

            if (res.status !== 200) {
              throw new Error(
                `GET /api/books?q=${q} failed with ${res.status}: ${JSON.stringify(res.body)}`
              );
            }

            const books = res.body.data;

            // If results are empty there is nothing to check; the search may
            // have found 0 results which is valid (no violation of the property).
            // But we do expect at least one since we seeded a matching book.
            if (!Array.isArray(books)) {
              throw new Error(`Expected res.body.data to be an array, got: ${JSON.stringify(res.body)}`);
            }

            const lowerQ = q.toLowerCase();

            for (const book of books) {
              const titleMatch  = book.title  && book.title.toLowerCase().includes(lowerQ);
              const authorMatch = book.author && book.author.toLowerCase().includes(lowerQ);
              const isbnMatch   = book.isbn   && book.isbn.toLowerCase().includes(lowerQ);

              if (!titleMatch && !authorMatch && !isbnMatch) {
                throw new Error(
                  `Book "${book.title}" (author: "${book.author}", isbn: "${book.isbn}") ` +
                  `does not contain search term "${q}" in title, author, or isbn`
                );
              }
            }

            return true;
          }
        ),
        { numRuns: 3 } // limited runs since this seeds/cleans the DB each time
      );
    });
  }
);

// ── Property 10: Borrow Creates Correct Record ────────────────────────────────

describe(
  'Property 10: borrow creates Borrowing with correct dueDate, renewalsLeft, status; availableCopies decremented',
  () => {
    // Feature: ahadu-center-backend, Property 10: borrow creates correct record
    it('Property 10: POST /api/books/:id/borrow creates correct Borrowing record', async () => {
      // Arbitrary: availableCopies can be 1..10 (must be > 0 to allow borrowing)
      const copiesArb = fc.integer({ min: 1, max: 10 });

      await fc.assert(
        fc.asyncProperty(
          copiesArb,
          async (copies) => {
            await User.deleteMany({});
            await Book.deleteMany({});
            await Borrowing.deleteMany({});

            const token = await registerAndLogin(`prop10-${Date.now()}`);

            // Seed a book with the given availableCopies
            const book = await seedBook({
              title: 'Prop Ten Book',
              author: 'Author Ten',
              availableCopies: copies,
              totalCopies: copies,
            });

            const borrowBefore = Date.now();

            const res = await request
              .post(`/api/books/${book._id}/borrow`)
              .set('Authorization', `Bearer ${token}`);

            if (res.status !== 201) {
              throw new Error(
                `POST /api/books/${book._id}/borrow failed with ${res.status}: ${JSON.stringify(res.body)}`
              );
            }

            const borrowAfter = Date.now();
            const body = res.body;

            // status must be Active
            if (body.status !== 'Active') {
              throw new Error(`Expected status "Active", got "${body.status}"`);
            }

            // renewalsLeft must be 2
            if (body.renewalsLeft !== 2) {
              throw new Error(`Expected renewalsLeft 2, got ${body.renewalsLeft}`);
            }

            // dueDate must be exactly borrowDate + 14 days
            const borrowDate = new Date(body.borrowDate);
            const dueDate    = new Date(body.dueDate);
            const diffMs     = dueDate.getTime() - borrowDate.getTime();
            const diffDays   = diffMs / (1000 * 60 * 60 * 24);

            if (Math.round(diffDays) !== 14) {
              throw new Error(
                `Expected dueDate to be borrowDate + 14 days, got diff = ${diffDays} days`
              );
            }

            // borrowDate must be within the test window
            if (borrowDate.getTime() < borrowBefore - 5000 || borrowDate.getTime() > borrowAfter + 5000) {
              throw new Error(
                `borrowDate ${borrowDate.toISOString()} is outside expected test window`
              );
            }

            // Verify availableCopies decremented by 1
            const updatedBook = await Book.findById(book._id).lean();
            if (updatedBook.availableCopies !== copies - 1) {
              throw new Error(
                `Expected availableCopies ${copies - 1}, got ${updatedBook.availableCopies}`
              );
            }

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  }
);

// ── Property 11: Borrow-Return Round Trip Preserves Available Copies ───────────

describe(
  'Property 11: borrow then return restores availableCopies to original value',
  () => {
    // Feature: ahadu-center-backend, Property 11: borrow-return round trip
    it('Property 11: availableCopies after borrow+return equals original availableCopies', async () => {
      const copiesArb = fc.integer({ min: 1, max: 10 });

      await fc.assert(
        fc.asyncProperty(
          copiesArb,
          async (copies) => {
            await User.deleteMany({});
            await Book.deleteMany({});
            await Borrowing.deleteMany({});

            const token = await registerAndLogin(`prop11-${Date.now()}`);

            // Seed book
            const book = await seedBook({
              title: 'Prop Eleven Book',
              author: 'Author Eleven',
              availableCopies: copies,
              totalCopies: copies,
            });

            const originalCopies = copies;

            // Step 1 — Borrow
            const borrowRes = await request
              .post(`/api/books/${book._id}/borrow`)
              .set('Authorization', `Bearer ${token}`);

            if (borrowRes.status !== 201) {
              throw new Error(
                `Borrow failed with ${borrowRes.status}: ${JSON.stringify(borrowRes.body)}`
              );
            }

            const borrowingId = borrowRes.body._id;

            // Verify copies decremented
            const afterBorrow = await Book.findById(book._id).lean();
            if (afterBorrow.availableCopies !== originalCopies - 1) {
              throw new Error(
                `After borrow: expected availableCopies ${originalCopies - 1}, ` +
                `got ${afterBorrow.availableCopies}`
              );
            }

            // Step 2 — Return
            const returnRes = await request
              .post(`/api/borrowings/${borrowingId}/return`)
              .set('Authorization', `Bearer ${token}`);

            if (returnRes.status !== 200) {
              throw new Error(
                `Return failed with ${returnRes.status}: ${JSON.stringify(returnRes.body)}`
              );
            }

            // Verify copies restored
            const afterReturn = await Book.findById(book._id).lean();
            if (afterReturn.availableCopies !== originalCopies) {
              throw new Error(
                `After return: expected availableCopies ${originalCopies}, ` +
                `got ${afterReturn.availableCopies}`
              );
            }

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  }
);

// ── Property 12: Renewal Extends Due Date and Decrements Renewals Left ────────

describe(
  'Property 12: renew extends dueDate by 14 days and decrements renewalsLeft by 1',
  () => {
    // Feature: ahadu-center-backend, Property 12: renewal correctness
    it('Property 12: POST /api/borrowings/:id/renew extends dueDate +14 days and decrements renewalsLeft', async () => {
      // renewalsLeft starts at 2 after borrow; we can renew up to 2 times.
      // We test with renewalCount in [1, 2] to cover both valid renewal scenarios.
      const renewalCountArb = fc.integer({ min: 1, max: 2 });

      await fc.assert(
        fc.asyncProperty(
          renewalCountArb,
          async (renewalCount) => {
            await User.deleteMany({});
            await Book.deleteMany({});
            await Borrowing.deleteMany({});

            const token = await registerAndLogin(`prop12-${Date.now()}`);

            // Seed book with 1 available copy
            const book = await seedBook({
              title: 'Prop Twelve Book',
              author: 'Author Twelve',
              availableCopies: 1,
              totalCopies: 1,
            });

            // Borrow the book
            const borrowRes = await request
              .post(`/api/books/${book._id}/borrow`)
              .set('Authorization', `Bearer ${token}`);

            if (borrowRes.status !== 201) {
              throw new Error(
                `Borrow failed with ${borrowRes.status}: ${JSON.stringify(borrowRes.body)}`
              );
            }

            const borrowingId = borrowRes.body._id;

            // Perform renewalCount renewals, verifying each one
            let prevDueDate    = new Date(borrowRes.body.dueDate);
            let prevRenewalsLeft = borrowRes.body.renewalsLeft; // 2 after initial borrow

            for (let i = 0; i < renewalCount; i++) {
              const renewRes = await request
                .post(`/api/borrowings/${borrowingId}/renew`)
                .set('Authorization', `Bearer ${token}`);

              if (renewRes.status !== 200) {
                throw new Error(
                  `Renew attempt ${i + 1} failed with ${renewRes.status}: ${JSON.stringify(renewRes.body)}`
                );
              }

              const renewBody = renewRes.body;
              const newDueDate     = new Date(renewBody.dueDate);
              const newRenewalsLeft = renewBody.renewalsLeft;

              // dueDate must be exactly prevDueDate + 14 days
              const diffMs   = newDueDate.getTime() - prevDueDate.getTime();
              const diffDays = diffMs / (1000 * 60 * 60 * 24);

              if (Math.round(diffDays) !== 14) {
                throw new Error(
                  `Renewal ${i + 1}: expected dueDate to extend by 14 days, ` +
                  `got diff = ${diffDays} days (prev: ${prevDueDate.toISOString()}, ` +
                  `new: ${newDueDate.toISOString()})`
                );
              }

              // renewalsLeft must be decremented by 1
              if (newRenewalsLeft !== prevRenewalsLeft - 1) {
                throw new Error(
                  `Renewal ${i + 1}: expected renewalsLeft ${prevRenewalsLeft - 1}, ` +
                  `got ${newRenewalsLeft}`
                );
              }

              prevDueDate     = newDueDate;
              prevRenewalsLeft = newRenewalsLeft;
            }

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });

    // Edge case: renew with renewalsLeft = 0 must return 400
    it('renew when renewalsLeft = 0 returns 400', async () => {
      const token = await registerAndLogin(`prop12-edge-${Date.now()}`);

      const book = await seedBook({
        title: 'Edge Case Book',
        author: 'Edge Author',
        availableCopies: 1,
        totalCopies: 1,
      });

      // Borrow
      const borrowRes = await request
        .post(`/api/books/${book._id}/borrow`)
        .set('Authorization', `Bearer ${token}`);
      expect(borrowRes.status).toBe(201);

      const borrowingId = borrowRes.body._id;

      // Exhaust all 2 renewals
      for (let i = 0; i < 2; i++) {
        const renewRes = await request
          .post(`/api/borrowings/${borrowingId}/renew`)
          .set('Authorization', `Bearer ${token}`);
        expect(renewRes.status).toBe(200);
      }

      // Third renewal must fail with 400
      const thirdRenew = await request
        .post(`/api/borrowings/${borrowingId}/renew`)
        .set('Authorization', `Bearer ${token}`);
      expect(thirdRenew.status).toBe(400);
    });
  }
);
