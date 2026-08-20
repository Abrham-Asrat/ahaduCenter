'use strict';

/**
 * Property-Based Tests: Pagination metadata invariant (Property 9)
 * Validates: Requirements 4.4, 6.4, 8.5, 19.2
 */

const fc = require('fast-check');
const { paginate } = require('../../utils/paginate');

/**
 * Creates a minimal Mongoose model stub that returns a fixed set of documents.
 *
 * The stub implements the chainable query interface used by paginate.js:
 *   model.countDocuments(filter) -> Promise<number>
 *   model.find(filter).sort().skip().limit().select().populate().exec() -> Promise<Array>
 *
 * @param {number} totalCount  - Total documents the model "contains"
 * @param {number} actualLimit - The real limit applied (skip + limit may result in fewer docs)
 */
function makeModelStub(totalCount, actualLimit) {
  // Build a fake chainable query object
  function makeQuery(resultDocs) {
    const q = {
      sort:     () => q,
      skip:     (n) => { q._skip = n; return q; },
      limit:    (n) => { q._limit = n; return q; },
      select:   () => q,
      populate: () => q,
      exec:     () => Promise.resolve(resultDocs.slice(q._skip || 0, (q._skip || 0) + (q._limit || resultDocs.length))),
    };
    q._skip = 0;
    q._limit = resultDocs.length;
    return q;
  }

  // Create totalCount placeholder documents
  const allDocs = Array.from({ length: totalCount }, (_, i) => ({ _id: i }));

  return {
    countDocuments: () => Promise.resolve(totalCount),
    find:           () => makeQuery(allDocs),
  };
}

describe('paginate — Property 9: Pagination metadata invariant', () => {
  /**
   * Property 9 (core): totalPages === Math.ceil(totalCount / limit) for totalCount > 0
   *
   * **Validates: Requirements 4.4, 6.4, 8.5, 19.2**
   */
  it('Property 9: totalPages === ceil(totalCount / limit) for any positive totalCount and limit', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 500 }),  // totalCount
        fc.integer({ min: 1, max: 100 }),  // limit
        async (totalCount, limit) => {
          const model = makeModelStub(totalCount, limit);
          const result = await paginate(model, {}, { page: 1, limit });

          const expectedTotalPages = Math.ceil(totalCount / limit);
          return result.totalPages === expectedTotalPages;
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 9 (edge): totalPages === 0 when totalCount === 0
   *
   * **Validates: Requirements 4.4, 6.4, 8.5, 19.2**
   */
  it('Property 9: totalPages === 0 when totalCount is 0', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }), // limit (any valid limit)
        async (limit) => {
          const model = makeModelStub(0, limit);
          const result = await paginate(model, {}, { page: 1, limit });

          return result.totalPages === 0;
        }
      ),
      { numRuns: 5 }
    );
  });

  /**
   * Property 9: data.length <= limit for any page and limit
   *
   * **Validates: Requirements 4.4, 6.4, 8.5, 19.2**
   */
  it('Property 9: data.length <= limit for any valid page and limit', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 500 }),  // totalCount
        fc.integer({ min: 1, max: 100 }),  // limit
        fc.integer({ min: 1, max: 10 }),   // page
        async (totalCount, limit, page) => {
          const model = makeModelStub(totalCount, limit);
          const result = await paginate(model, {}, { page, limit });

          return result.data.length <= limit;
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property 9: returned page matches the requested page
   *
   * **Validates: Requirements 4.4, 6.4, 8.5, 19.2**
   */
  it('Property 9: returned page matches requested page', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 500 }),  // totalCount
        fc.integer({ min: 1, max: 100 }),  // limit
        fc.integer({ min: 1, max: 10 }),   // page
        async (totalCount, limit, page) => {
          const model = makeModelStub(totalCount, limit);
          const result = await paginate(model, {}, { page, limit });

          // paginate clamps page to max(1, page), so for valid positive integers the
          // returned page must equal the requested page
          return result.page === page;
        }
      ),
      { numRuns: 10 }
    );
  });

  // ---- Concrete example checks ----

  it('returns totalPages = 5 for totalCount=50, limit=10', async () => {
    const model = makeModelStub(50, 10);
    const result = await paginate(model, {}, { page: 1, limit: 10 });
    expect(result.totalPages).toBe(5);
    expect(result.totalCount).toBe(50);
    expect(result.limit).toBe(10);
    expect(result.page).toBe(1);
    expect(result.data.length).toBeLessThanOrEqual(10);
  });

  it('returns totalPages = 1 for totalCount=1, limit=100', async () => {
    const model = makeModelStub(1, 100);
    const result = await paginate(model, {}, { page: 1, limit: 100 });
    expect(result.totalPages).toBe(1);
  });

  it('returns totalPages = 0 and empty data when totalCount = 0', async () => {
    const model = makeModelStub(0, 20);
    const result = await paginate(model, {}, { page: 1, limit: 20 });
    expect(result.totalPages).toBe(0);
    expect(result.totalCount).toBe(0);
    expect(result.data).toHaveLength(0);
  });

  it('returns totalPages = ceil(totalCount / limit) for uneven division', async () => {
    const model = makeModelStub(101, 10);
    const result = await paginate(model, {}, { page: 1, limit: 10 });
    expect(result.totalPages).toBe(Math.ceil(101 / 10)); // 11
  });
});
