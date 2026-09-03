'use strict';

/**
 * search.controller.js
 *
 * Handles cross-content full-text search across Books, Movies, and Products.
 *
 * GET /api/search?q=...&type=...&minPrice=...&maxPrice=...&sort=...&page=...&limit=...
 */

/**
 * Safely require a Mongoose model. Returns null if the model module cannot
 * be loaded (e.g. not yet registered during early startup / testing).
 *
 * @param {string} modelPath - Module path relative to this file.
 * @returns {import('mongoose').Model|null}
 */
function safeRequire(modelPath) {
  try {
    return require(modelPath);
  } catch {
    return null;
  }
}

/**
 * search
 *
 * Query params:
 *   q          {string}  required, 1–200 chars — full-text search term
 *   type       {string}  optional — 'movie' | 'book' | 'product'
 *   minPrice   {number}  optional, >= 0
 *   maxPrice   {number}  optional, >= 0
 *   sort       {string}  optional — 'newest'
 *   page       {number}  optional, default 1
 *   limit      {number}  optional, default 20
 */
const search = async (req, res, next) => {
  try {
    const { q, type, minPrice, maxPrice, sort } = req.query;

    // ── Validate q ────────────────────────────────────────────────────────────
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'q is required and must be a non-empty string' });
    }
    const trimmedQ = q.trim();
    if (trimmedQ.length > 200) {
      return res.status(400).json({ error: 'q must be 200 characters or fewer' });
    }

    // ── Validate type ─────────────────────────────────────────────────────────
    const validTypes = ['movie', 'book', 'product'];
    if (type !== undefined && !validTypes.includes(type)) {
      return res.status(400).json({ error: `type must be one of: ${validTypes.join(', ')}` });
    }

    // ── Validate minPrice / maxPrice ──────────────────────────────────────────
    let parsedMinPrice;
    let parsedMaxPrice;

    if (minPrice !== undefined) {
      parsedMinPrice = parseFloat(minPrice);
      if (isNaN(parsedMinPrice) || parsedMinPrice < 0) {
        return res.status(400).json({ error: 'minPrice must be a non-negative number' });
      }
    }

    if (maxPrice !== undefined) {
      parsedMaxPrice = parseFloat(maxPrice);
      if (isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
        return res.status(400).json({ error: 'maxPrice must be a non-negative number' });
      }
    }

    // ── Load models ───────────────────────────────────────────────────────────
    const Book    = safeRequire('../models/Book');
    const Movie   = safeRequire('../models/Movie');
    const Product = safeRequire('../models/Product');

    // ── Build query promises ──────────────────────────────────────────────────
    const textFilter = { $text: { $search: trimmedQ } };

    const bookPromise = (!type || type === 'book') && Book
      ? Book.find(textFilter)
          .select('title description coverUrl rating category createdAt')
          .lean()
      : Promise.resolve([]);

    const moviePromise = (!type || type === 'movie') && Movie
      ? Movie.find(textFilter)
          .select('title description posterUrl rating genres createdAt')
          .lean()
      : Promise.resolve([]);

    // Build product filter with optional price range
    let productFilter = { ...textFilter };
    if (parsedMinPrice !== undefined || parsedMaxPrice !== undefined) {
      productFilter.price = {};
      if (parsedMinPrice !== undefined) productFilter.price.$gte = parsedMinPrice;
      if (parsedMaxPrice !== undefined) productFilter.price.$lte = parsedMaxPrice;
    }

    const productPromise = (!type || type === 'product') && Product
      ? Product.find(productFilter)
          .select('name description images rating category price createdAt')
          .lean()
      : Promise.resolve([]);

    // ── Run queries in parallel ───────────────────────────────────────────────
    const [books, movies, products] = await Promise.all([
      bookPromise,
      moviePromise,
      productPromise,
    ]);

    // ── Map to unified shape ──────────────────────────────────────────────────
    const mappedBooks = books.map((b) => ({
      id:          b._id,
      type:        'Book',
      title:       b.title,
      description: b.description,
      imageUrl:    b.coverUrl || null,
      rating:      b.rating,
      category:    b.category || null,
      price:       null,
      link:        `/books/${b._id}`,
      createdAt:   b.createdAt,
    }));

    const mappedMovies = movies.map((m) => ({
      id:          m._id,
      type:        'Movie',
      title:       m.title,
      description: m.description,
      imageUrl:    m.posterUrl || null,
      rating:      m.rating,
      category:    (m.genres && m.genres.length > 0) ? m.genres[0] : null,
      price:       null,
      link:        `/movies/${m._id}`,
      createdAt:   m.createdAt,
    }));

    const mappedProducts = products.map((p) => ({
      id:          p._id,
      type:        'Product',
      title:       p.name,
      description: p.description,
      imageUrl:    (p.images && p.images.length > 0) ? p.images[0] : null,
      rating:      p.rating,
      category:    p.category || null,
      price:       p.price,
      link:        `/electronics/${p._id}`,
      createdAt:   p.createdAt,
    }));

    // ── Merge results ─────────────────────────────────────────────────────────
    let merged = [...mappedBooks, ...mappedMovies, ...mappedProducts];

    // ── Sort ──────────────────────────────────────────────────────────────────
    if (sort === 'newest') {
      merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // ── Paginate ──────────────────────────────────────────────────────────────
    const page       = parseInt(req.query.page, 10)  || 1;
    const limit      = parseInt(req.query.limit, 10) || 20;
    const totalCount = merged.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const startIdx   = (page - 1) * limit;
    const data       = merged.slice(startIdx, startIdx + limit);

    return res.json({ data, totalCount, page, totalPages, limit });
  } catch (err) {
    next(err);
  }
};

module.exports = { search };
