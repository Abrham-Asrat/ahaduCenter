'use strict';

/**
 * Integration Property-Based Tests: Product Search & Price Filter
 * (Properties 7, 8)
 *
 * **Validates: Requirements 8.2, 8.4**
 *
 * Uses mongodb-memory-server + supertest + fast-check.
 *
 * Property 7: for any non-empty q → every returned product's name, brand, or
 *             category contains q (case-insensitive)
 * Property 8: for any minPrice/maxPrice combination → every returned product
 *             has price within the specified range
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

// Set env vars BEFORE requiring the app
process.env.JWT_SECRET = 'test-secret-product';

const app = require('../../app');
const Product = mongoose.model('Product');
const request = supertest(app);

// ── MongoMemoryServer lifecycle ────────────────────────────────────────────────

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: { startupTimeout: 60000 },
  });
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  // Ensure the text index on (name, brand, category) is created before any
  // $text queries run — MongoMemoryServer does not auto-create indexes.
  await Product.createIndexes();
}, 90000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Clear the products collection between tests
beforeEach(async () => {
  await Product.deleteMany({});
});

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Inserts a product directly via Mongoose.
 */
async function seedProduct(fields) {
  return Product.create({
    name:     fields.name     || 'Default Product Name',
    brand:    fields.brand    || 'Default Brand',
    category: fields.category || 'Electronics',
    price:    fields.price    !== undefined ? fields.price : 100,
    inStock:  fields.inStock  !== undefined ? fields.inStock : true,
  });
}

// ── Property 7: Product Search Filter Correctness ────────────────────────────

describe(
  'Property 7: product search filter — every result contains q in name, brand, or category',
  () => {
    // Feature: ahadu-center-backend, Property 7: product search filter correctness
    it('Property 7: GET /api/products?q=<term> returns only products matching the term', async () => {
      // Strategy:
      //   - Pick from a fixed set of distinct single-word search terms, each with
      //     a "match" product (term appears in name, brand, or category) and a
      //     "no-match" product (term does not appear anywhere).
      //   - Seed both, query with the term, and assert every returned product
      //     contains the term (case-insensitive) in name, brand, or category.
      //
      // We use fc.constantFrom so that each run picks one of the pre-defined
      // triples; numRuns: 3 ensures each triple is exercised.

      const triples = [
        {
          q: 'Samsung',
          matchData: { name: 'Samsung Galaxy Phone', brand: 'Samsung', category: 'Phones' },
          noMatchData: { name: 'Wireless Headphones', brand: 'Sony', category: 'Audio' },
        },
        {
          q: 'Laptop',
          matchData: { name: 'Laptop Pro 15', brand: 'Dell', category: 'Laptops' },
          noMatchData: { name: 'Smart Refrigerator', brand: 'LG', category: 'Appliances' },
        },
        {
          q: 'Camera',
          matchData: { name: 'DSLR Camera Kit', brand: 'Canon', category: 'Camera' },
          noMatchData: { name: 'Mechanical Keyboard', brand: 'Logitech', category: 'Peripherals' },
        },
      ];

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...triples),
          async ({ q, matchData, noMatchData }) => {
            await Product.deleteMany({});

            // Seed the matching product
            await seedProduct({
              name:     matchData.name,
              brand:    matchData.brand,
              category: matchData.category,
              price:    199,
            });

            // Seed the non-matching product
            await seedProduct({
              name:     noMatchData.name,
              brand:    noMatchData.brand,
              category: noMatchData.category,
              price:    299,
            });

            const res = await request.get(
              `/api/products?q=${encodeURIComponent(q)}`
            );

            if (res.status !== 200) {
              throw new Error(
                `GET /api/products?q=${q} failed with ${res.status}: ${JSON.stringify(res.body)}`
              );
            }

            const products = res.body.data;

            if (!Array.isArray(products)) {
              throw new Error(
                `Expected res.body.data to be an array, got: ${JSON.stringify(res.body)}`
              );
            }

            const lowerQ = q.toLowerCase();

            for (const product of products) {
              const nameMatch     = product.name     && product.name.toLowerCase().includes(lowerQ);
              const brandMatch    = product.brand    && product.brand.toLowerCase().includes(lowerQ);
              const categoryMatch = product.category && product.category.toLowerCase().includes(lowerQ);

              if (!nameMatch && !brandMatch && !categoryMatch) {
                throw new Error(
                  `Product "${product.name}" (brand: "${product.brand}", category: "${product.category}") ` +
                  `does not contain search term "${q}" in name, brand, or category`
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

// ── Property 8: Price Range Filter Correctness ───────────────────────────────

describe(
  'Property 8: price range filter — every returned product has price within [minPrice, maxPrice]',
  () => {
    // Feature: ahadu-center-backend, Property 8: price range filter correctness
    it('Property 8: GET /api/products?minPrice=X&maxPrice=Y returns only products within the range', async () => {
      // Strategy:
      //   - Generate [minPrice, maxPrice] pairs where minPrice ∈ [0, 500] and
      //     maxPrice ∈ [500, 1000], so the range always has a sensible spread.
      //   - Seed products with prices that are in-range and out-of-range.
      //   - Query with the generated range and assert every returned product
      //     has price >= minPrice && price <= maxPrice.

      await fc.assert(
        fc.asyncProperty(
          fc.tuple(
            fc.float({ min: 0,   max: 500,  noNaN: true }),
            fc.float({ min: 500, max: 1000, noNaN: true })
          ),
          async ([minPrice, maxPrice]) => {
            await Product.deleteMany({});

            // Price exactly at lower bound (in-range)
            await seedProduct({ name: 'In-Range Lower', brand: 'BrandA', category: 'Cat1', price: minPrice });

            // Price exactly at upper bound (in-range)
            await seedProduct({ name: 'In-Range Upper', brand: 'BrandB', category: 'Cat1', price: maxPrice });

            // Price in the middle (in-range), only if range is wide enough
            const midPrice = (minPrice + maxPrice) / 2;
            await seedProduct({ name: 'In-Range Mid', brand: 'BrandC', category: 'Cat1', price: midPrice });

            // Price strictly below lower bound (out-of-range), skip if minPrice is 0
            if (minPrice > 0.01) {
              await seedProduct({
                name: 'Out-Range Below',
                brand: 'BrandD',
                category: 'Cat1',
                price: Math.max(0, minPrice - 1),
              });
            }

            // Price strictly above upper bound (out-of-range)
            await seedProduct({
              name: 'Out-Range Above',
              brand: 'BrandE',
              category: 'Cat1',
              price: maxPrice + 1,
            });

            const res = await request.get(
              `/api/products?minPrice=${minPrice}&maxPrice=${maxPrice}`
            );

            if (res.status !== 200) {
              throw new Error(
                `GET /api/products?minPrice=${minPrice}&maxPrice=${maxPrice} failed ` +
                `with ${res.status}: ${JSON.stringify(res.body)}`
              );
            }

            const products = res.body.data;

            if (!Array.isArray(products)) {
              throw new Error(
                `Expected res.body.data to be an array, got: ${JSON.stringify(res.body)}`
              );
            }

            for (const product of products) {
              if (product.price < minPrice || product.price > maxPrice) {
                throw new Error(
                  `Product "${product.name}" has price ${product.price} which is outside ` +
                  `the requested range [${minPrice}, ${maxPrice}]`
                );
              }
            }

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });

    // Single-bound case: only minPrice
    // Feature: ahadu-center-backend, Property 8: price range filter — minPrice only
    it('Property 8 (minPrice only): GET /api/products?minPrice=X returns only products with price >= X', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.float({ min: 0, max: 500, noNaN: true }),
          async (minPrice) => {
            await Product.deleteMany({});

            // In-range: at and above minPrice
            await seedProduct({ name: 'At Min Price', brand: 'BrandA', category: 'Cat1', price: minPrice });
            await seedProduct({ name: 'Above Min Price', brand: 'BrandB', category: 'Cat1', price: minPrice + 50 });
            await seedProduct({ name: 'Well Above Min', brand: 'BrandC', category: 'Cat1', price: minPrice + 200 });

            // Out-of-range: below minPrice (skip if minPrice is near 0)
            if (minPrice > 0.01) {
              await seedProduct({
                name: 'Below Min Price',
                brand: 'BrandD',
                category: 'Cat1',
                price: Math.max(0, minPrice - 1),
              });
            }

            const res = await request.get(
              `/api/products?minPrice=${minPrice}`
            );

            if (res.status !== 200) {
              throw new Error(
                `GET /api/products?minPrice=${minPrice} failed with ${res.status}: ` +
                `${JSON.stringify(res.body)}`
              );
            }

            const products = res.body.data;

            if (!Array.isArray(products)) {
              throw new Error(
                `Expected res.body.data to be an array, got: ${JSON.stringify(res.body)}`
              );
            }

            for (const product of products) {
              if (product.price < minPrice) {
                throw new Error(
                  `Product "${product.name}" has price ${product.price} which is below ` +
                  `minPrice ${minPrice}`
                );
              }
            }

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });

    // Single-bound case: only maxPrice
    // Feature: ahadu-center-backend, Property 8: price range filter — maxPrice only
    it('Property 8 (maxPrice only): GET /api/products?maxPrice=Y returns only products with price <= Y', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.float({ min: 500, max: 1000, noNaN: true }),
          async (maxPrice) => {
            await Product.deleteMany({});

            // In-range: at and below maxPrice
            await seedProduct({ name: 'At Max Price',    brand: 'BrandA', category: 'Cat1', price: maxPrice });
            await seedProduct({ name: 'Below Max Price', brand: 'BrandB', category: 'Cat1', price: Math.max(0, maxPrice - 50) });
            await seedProduct({ name: 'Well Below Max',  brand: 'BrandC', category: 'Cat1', price: Math.max(0, maxPrice - 200) });

            // Out-of-range: above maxPrice
            await seedProduct({
              name: 'Above Max Price',
              brand: 'BrandD',
              category: 'Cat1',
              price: maxPrice + 1,
            });

            const res = await request.get(
              `/api/products?maxPrice=${maxPrice}`
            );

            if (res.status !== 200) {
              throw new Error(
                `GET /api/products?maxPrice=${maxPrice} failed with ${res.status}: ` +
                `${JSON.stringify(res.body)}`
              );
            }

            const products = res.body.data;

            if (!Array.isArray(products)) {
              throw new Error(
                `Expected res.body.data to be an array, got: ${JSON.stringify(res.body)}`
              );
            }

            for (const product of products) {
              if (product.price > maxPrice) {
                throw new Error(
                  `Product "${product.name}" has price ${product.price} which exceeds ` +
                  `maxPrice ${maxPrice}`
                );
              }
            }

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  }
);
