'use strict';

/**
 * Integration Property-Based Tests: Aggregate Review Rating
 * (Property 17)
 *
 * **Validates: Requirements 10.3, 10.7**
 *
 * Uses mongodb-memory-server + supertest + fast-check.
 *
 * Property 17: for any sequence of N ratings (integers 1–5) submitted for the
 *              same Book or Movie → the parent item's `rating` field equals the
 *              arithmetic mean of all submitted ratings, rounded to 1 decimal
 *              place, after each new review is created.
 *
 * // Feature: ahadu-center-backend, Property 17: aggregate review rating is arithmetic mean
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
process.env.JWT_SECRET = 'test-secret-review-rating';
process.env.OVERDUE_FEE_PER_DAY = '1';

const app = require('../../app');
const Book  = mongoose.model('Book');
const Movie = mongoose.model('Movie');
const User  = mongoose.model('User');
const Review = mongoose.model('Review');
const request = supertest(app);

// ── MongoMemoryServer lifecycle ────────────────────────────────────────────────

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: { startupTimeout: 60000 },
  });
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}, 90000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Clear all relevant collections between tests
beforeEach(async () => {
  await User.deleteMany({});
  await Book.deleteMany({});
  await Movie.deleteMany({});
  await Review.deleteMany({});
});

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Registers a new unique user and returns the JWT token.
 * Each user gets a unique email derived from the provided seed string.
 *
 * @param {string} seed - Unique suffix to make email unique per run.
 * @returns {Promise<string>} JWT token
 */
async function registerAndLogin(seed) {
  const email    = `review.rating.${seed}@example.com`;
  const password = 'Password123!';
  const name     = `Reviewer ${seed}`;

  const regRes = await request.post('/api/auth/register').send({ email, password, name });

  if (regRes.status !== 201) {
    throw new Error(
      `Register failed with ${regRes.status}: ${JSON.stringify(regRes.body)}`
    );
  }

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
 * Seeds a Book document and returns it.
 *
 * @returns {Promise<import('mongoose').Document>}
 */
async function seedBook() {
  return Book.create({
    title:           'Rating Test Book',
    author:          'Rating Author',
    availableCopies: 5,
    totalCopies:     5,
  });
}

/**
 * Seeds a Movie document and returns it.
 *
 * @returns {Promise<import('mongoose').Document>}
 */
async function seedMovie() {
  return Movie.create({
    title: 'Rating Test Movie',
    year:  2024,
  });
}

/**
 * Computes the expected arithmetic mean of an array of numbers,
 * rounded to 1 decimal place — matching the controller's rounding logic:
 *   Math.round(avg * 10) / 10
 *
 * @param {number[]} ratings
 * @returns {number}
 */
function expectedMean(ratings) {
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  const avg = sum / ratings.length;
  return Math.round(avg * 10) / 10;
}

// ── Property 17: Book review rating aggregation ───────────────────────────────

describe(
  'Property 17 (Book): parent book.rating equals arithmetic mean of all submitted ratings',
  () => {
    // Feature: ahadu-center-backend, Property 17: aggregate review rating is arithmetic mean
    it(
      'Property 17: POST /api/books/:id/reviews N times → book.rating = mean(ratings)',
      async () => {
        // Generate a sequence of 2–6 distinct integer ratings (1–5).
        // Each rating in the sequence will come from a separate user because
        // the duplicate-review guard (compound unique index on userId+itemId)
        // rejects a second review from the same user with 409.
        const ratingsArb = fc.array(
          fc.integer({ min: 1, max: 5 }),
          { minLength: 2, maxLength: 6 }
        );

        await fc.assert(
          fc.asyncProperty(
            ratingsArb,
            async (ratings) => {
              // Reset data for each property run
              await User.deleteMany({});
              await Book.deleteMany({});
              await Review.deleteMany({});

              const book = await seedBook();

              // Submit one review per rating value, each from a unique user.
              // We include Date.now() + index to guarantee unique emails even
              // across fast-check shrinking runs.
              for (let i = 0; i < ratings.length; i++) {
                const token = await registerAndLogin(
                  `book-p17-${Date.now()}-${i}`
                );

                const res = await request
                  .post(`/api/books/${book._id}/reviews`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    rating:  ratings[i],
                    comment: `Review number ${i + 1} with rating ${ratings[i]}.`,
                  });

                if (res.status !== 201) {
                  throw new Error(
                    `POST /api/books/${book._id}/reviews failed at index ${i} ` +
                    `with ${res.status}: ${JSON.stringify(res.body)}`
                  );
                }

                // After each review, check that the book's rating has been
                // updated to the mean of all ratings submitted so far.
                const partialRatings = ratings.slice(0, i + 1);
                const expected = expectedMean(partialRatings);

                const bookDoc = await Book.findById(book._id).lean();

                if (bookDoc.rating !== expected) {
                  throw new Error(
                    `After ${i + 1} review(s) with ratings ${JSON.stringify(partialRatings)}, ` +
                    `expected book.rating = ${expected}, got ${bookDoc.rating}`
                  );
                }
              }

              // Final check: rating equals mean of the full sequence
              const finalBook = await Book.findById(book._id).lean();
              const finalExpected = expectedMean(ratings);

              if (finalBook.rating !== finalExpected) {
                throw new Error(
                  `Final book.rating mismatch: ratings=${JSON.stringify(ratings)}, ` +
                  `expected=${finalExpected}, got=${finalBook.rating}`
                );
              }

              return true;
            }
          ),
          { numRuns: 5 } // Creating N users + N reviews per run is expensive
        );
      },
      120000 // generous timeout for DB-heavy property runs
    );
  }
);

// ── Property 17: Movie review rating aggregation ──────────────────────────────

describe(
  'Property 17 (Movie): parent movie.rating equals arithmetic mean of all submitted ratings',
  () => {
    // Feature: ahadu-center-backend, Property 17: aggregate review rating is arithmetic mean
    it(
      'Property 17: POST /api/movies/:id/reviews N times → movie.rating = mean(ratings)',
      async () => {
        const ratingsArb = fc.array(
          fc.integer({ min: 1, max: 5 }),
          { minLength: 2, maxLength: 6 }
        );

        await fc.assert(
          fc.asyncProperty(
            ratingsArb,
            async (ratings) => {
              // Reset data for each property run
              await User.deleteMany({});
              await Movie.deleteMany({});
              await Review.deleteMany({});

              const movie = await seedMovie();

              for (let i = 0; i < ratings.length; i++) {
                const token = await registerAndLogin(
                  `movie-p17-${Date.now()}-${i}`
                );

                const res = await request
                  .post(`/api/movies/${movie._id}/reviews`)
                  .set('Authorization', `Bearer ${token}`)
                  .send({
                    rating:  ratings[i],
                    comment: `Movie review number ${i + 1} with rating ${ratings[i]}.`,
                  });

                if (res.status !== 201) {
                  throw new Error(
                    `POST /api/movies/${movie._id}/reviews failed at index ${i} ` +
                    `with ${res.status}: ${JSON.stringify(res.body)}`
                  );
                }

                // After each review, check movie.rating = mean of ratings so far
                const partialRatings = ratings.slice(0, i + 1);
                const expected = expectedMean(partialRatings);

                const movieDoc = await Movie.findById(movie._id).lean();

                if (movieDoc.rating !== expected) {
                  throw new Error(
                    `After ${i + 1} review(s) with ratings ${JSON.stringify(partialRatings)}, ` +
                    `expected movie.rating = ${expected}, got ${movieDoc.rating}`
                  );
                }
              }

              // Final check
              const finalMovie = await Movie.findById(movie._id).lean();
              const finalExpected = expectedMean(ratings);

              if (finalMovie.rating !== finalExpected) {
                throw new Error(
                  `Final movie.rating mismatch: ratings=${JSON.stringify(ratings)}, ` +
                  `expected=${finalExpected}, got=${finalMovie.rating}`
                );
              }

              return true;
            }
          ),
          { numRuns: 5 } // Creating N users + N reviews per run is expensive
        );
      },
      120000
    );
  }
);
