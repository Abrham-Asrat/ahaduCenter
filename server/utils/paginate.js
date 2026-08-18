/**
 * Reusable pagination helper for Mongoose models.
 *
 * @param {import('mongoose').Model} model - Mongoose model to query
 * @param {Object} filter - Mongoose query filter object
 * @param {Object} options
 * @param {number}  [options.page=1]     - Current page (1-indexed)
 * @param {number}  [options.limit=20]   - Items per page (max 100)
 * @param {Object}  [options.sort]       - Mongoose sort object, e.g. { createdAt: -1 }
 * @param {string}  [options.select]     - Field projection string
 * @param {string|Object|Array} [options.populate] - Mongoose populate argument(s)
 * @returns {Promise<{ data: Array, totalCount: number, page: number, totalPages: number, limit: number }>}
 */
async function paginate(model, filter = {}, options = {}) {
  const page  = Math.max(1, parseInt(options.page,  10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 20));
  const skip  = (page - 1) * limit;
  const sort  = options.sort  || { createdAt: -1 };

  const totalCount = await model.countDocuments(filter);
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / limit);

  let query = model.find(filter).sort(sort).skip(skip).limit(limit);

  if (options.select) {
    query = query.select(options.select);
  }

  if (options.populate) {
    if (Array.isArray(options.populate)) {
      options.populate.forEach((p) => { query = query.populate(p); });
    } else {
      query = query.populate(options.populate);
    }
  }

  const data = await query.exec();

  return { data, totalCount, page, totalPages, limit };
}

module.exports = { paginate };
