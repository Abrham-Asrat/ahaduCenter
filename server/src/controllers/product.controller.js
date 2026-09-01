'use strict';

/**
 * product.controller.js
 *
 * Handles all /api/products catalog endpoints.
 *
 * Requirements covered:
 *   8.1 — GET /api/products           (listProducts) — paginated list
 *   8.2 — q text search               (listProducts)
 *   8.3 — category filter             (listProducts)
 *   8.4 — price range filter          (listProducts)
 *   8.5 — pagination                  (listProducts)
 *   8.6 — GET /api/products/:id       (getProduct)  — full doc + similar products
 *   8.7 — 404 on missing product      (getProduct)
 */

const Product    = require('../models/Product.js');
const { paginate } = require('../../utils/paginate.js');

// ── GET /api/products ──────────────────────────────────────────────────────────
// Requirements 8.1, 8.2, 8.3, 8.4, 8.5
const listProducts = async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice, page, limit } = req.query;

    // Build filter
    const filter = {};

    if (q && q.trim()) {
      // MongoDB text search on the compound text index (name, brand, category)
      // (Requirement 8.2)
      filter.$text = { $search: q.trim() };
    }

    if (category && category.trim()) {
      // Case-insensitive category match (Requirement 8.3)
      filter.category = { $regex: new RegExp(`^${escapeRegex(category.trim())}$`, 'i') };
    }

    // Price range filter — only add conditions that are actually specified
    // (Requirement 8.4)
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Pagination options — defaults and bounds are enforced by productQueryRules +
    // the paginate helper, but sensible defaults are applied here as well.
    const opts = {
      page:   page  || 1,
      limit:  limit || 20,
      sort:   { createdAt: -1 },
      select: 'name brand category condition images price originalPrice discount rating reviewCount inStock',
    };

    const result = await paginate(Product, filter, opts);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/products/:id ──────────────────────────────────────────────────────
// Requirements 8.6, 8.7
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Populate similar products: same category, up to 10, excluding this product
    // (Requirement 8.6)
    let similarProducts = [];
    if (product.category) {
      similarProducts = await Product.find({
        category: product.category,
        _id:      { $ne: product._id },
      })
        .limit(10)
        .select('name brand category images price originalPrice discount rating reviewCount inStock')
        .lean();
    }

    return res.status(200).json({
      ...product,
      similarProducts,
    });
  } catch (err) {
    next(err);
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Escapes special regex characters in a user-supplied string so it can be
 * safely embedded in a RegExp pattern without altering semantics.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { listProducts, getProduct };
