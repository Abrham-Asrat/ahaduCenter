'use strict';

/**
 * Pagination helper retained for the utility unit-test contract.
 * Production controllers currently import the equivalent helper from
 * `server/utils/paginate.js`; these two locations should be consolidated in a
 * separate compatibility-aware change.
 *
 * @param {import('mongoose').Model} model - Mongoose model to query
 * @param {Object} filter - Mongoose query filter object
 * @param {Object} options - Pagination and query options
 * @returns {Promise<{data: Array, totalCount: number, page: number, totalPages: number, limit: number}>}
 */
async function paginate(model, filter = {}, options = {}) {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };

  const totalCount = await model.countDocuments(filter);
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / limit);

  let query = model.find(filter).sort(sort).skip(skip).limit(limit);

  if (options.select) {
    query = query.select(options.select);
  }

  if (options.populate) {
    if (Array.isArray(options.populate)) {
      options.populate.forEach((populateOption) => {
        query = query.populate(populateOption);
      });
    } else {
      query = query.populate(options.populate);
    }
  }

  const data = await query.exec();
  return { data, totalCount, page, totalPages, limit };
}

module.exports = { paginate };