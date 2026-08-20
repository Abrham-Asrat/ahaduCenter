'use strict';

/**
 * Integration Property-Based Test: Cross-Domain Search Type Filter Isolation
 * (Property 20)
 *
 * **Validates: Requirements 13.3**
 *
 * Uses mongodb-memory-server + supertest + fast-check.
 *
 * Property 20: for any `q` combined with `type` in ["movie", "book", "product"]
 *   → every result in res.body.data has `type` matching the specified filter only
 *
 * Strategy:
 *   - Seed one Book, one Movie, and one Product, each containing the fixed
 *     search term "TestSearchItem" in their primary searchable field
 *     (title for Book & Movie, name for Product).
 *   - Use fc.constantFrom('movie', 'book', 'product') as the type arbitrary
 *     so that each of the three filter values is exercised.
 *   - For each sampled type, query GET /api/search?q=TestSearchItem&type=<type>
 *     and assert that every item in res.body.data has a `type` field equal to
 *     the capitalised counterpart of the filter value.
 */

// Feature: ahadu-center-backend, Property 20: cross-domain search type filter isolation

// ── Mock nodemailer before any require of the app ────────────────────────────
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
process.env.JWT_SECRET = 'test-secret-search';

const app = require('../../app');
const Book    = mongoose.model('Book');
const Movie   = mongoose.model('Movie');
const Product = mongoose.model('Product');
const request = supertest(app);

// ── MongoMemoryServer lifecycle ───────────────────────────────────────────────

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: { startupTimeout: 60000 },
  });
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  // Ensure text indexes are created for all three models before $text queries run
  await Promise.all([
    Book.createIndexes(),
    Movie.createIndexes(),
    Product.createIndexes(),
  ]);
}, 90000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Clear all three collections between tests
beforeEach(async () => {
  await Book.deleteMany({});
  await Movie.deleteMany({});
  await Product.deleteMany({});
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Capitalise the first letter of a string (e.g. "movie" → "Movie").
 * This mirrors the mapping done by the search controller.
 */
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Seed one document of each domain, all containing SEARCH_TERM in the field
 * that is indexed for full-text search:
 *   Book    → title (index: title, author, isbn)
 *   Movie   → title (index: title, director)
 *   Product → name  (index: name, brand, category)
 */
const SEARCH_TERM = 'TestSearchItem';

async function seedAllDomains() {
  await Book.create({
    title:           `${SEARCH_TERM} Book`,
    author:          'Seed Author',
    availableCopies: 1,
    totalCopies:     1,
  });

  await Movie.create({
    title:    `${SEARCH_TERM} Movie`,
    director: 'Seed Director',
    rating:   4,
  });

  await Product.create({
    name:  `${SEARCH_TERM} Product`,
    brand: 'Seed Brand',
    price: 9.99,
  });
}

// ── Property 20: Type Filter Isolation ───────────────────────────────────────

describe(
  'Property 20: search type filter isolates results to the requested domain only',
  () => {
    // Feature: ahadu-center-backend, Property 20: cross-domain search type filter isolation
    it(
      'Property 20: GET /api/search?q=<term>&type=<type> returns only items whose type matches the filter',
      async () => {
        // Seed data once; the property lambda does NOT delete between runs
        // because fc.constantFrom cycles through all three values in 3 runs
        // and the seeded data must be present for every run.
        await seedAllDomains();

        await fc.assert(
          fc.asyncProperty(
            // Arbitrary: one of the three valid type filter values
            fc.constantFrom('movie', 'book', 'product'),
            async (filterType) => {
              const res = await request
                .get(`/api/search?q=${encodeURIComponent(SEARCH_TERM)}&type=${filterType}`);

              if (res.status !== 200) {
                throw new Error(
                  `GET /api/search?q=${SEARCH_TERM}&type=${filterType} failed ` +
                  `with ${res.status}: ${JSON.stringify(res.body)}`
                );
              }

              const items = res.body.data;

              if (!Array.isArray(items)) {
                throw new Error(
                  `Expected res.body.data to be an array, got: ${JSON.stringify(res.body)}`
                );
              }

              // Must have at least one result (we seeded a matching item per domain)
              if (items.length === 0) {
                throw new Error(
                  `Expected at least one result for type="${filterType}" ` +
                  `with q="${SEARCH_TERM}", but got an empty array`
                );
              }

              // Core property: every returned item's `type` must equal the
              // capitalised filter value (e.g. "movie" → "Movie")
              const expectedType = capitalise(filterType);

              for (const item of items) {
                if (item.type !== expectedType) {
                  throw new Error(
                    `Item with title "${item.title}" has type "${item.type}" ` +
                    `but filter was type="${filterType}" (expected "${expectedType}")`
                  );
                }
              }

              return true;
            }
          ),
          { numRuns: 3 } // one run per type value (3 possible values)
        );
      }
    );
  }
);
