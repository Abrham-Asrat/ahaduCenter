'use strict';

/**
 * review.controller.js
 *
 * Handles review endpoints for Books and Movies.
 *
 * Routes wire these handlers under:
 *   GET  /api/books/:id/reviews   (itemType = 'Book')
 *   POST /api/books/:id/reviews   (itemType = 'Book')
 *   GET  /api/movies/:id/reviews  (itemType = 'Movie')
 *   POST /api/movies/:id/reviews  (itemType = 'Movie')
 *
 * The mounting route sets `req.itemType` before calling these handlers.
 *
 * Requirements covered:
 *   10.1 — GET /api/books/:id/reviews   (listReviews)
 *   10.2 — GET /api/movies/:id/reviews  (listReviews)
 *   10.3 — POST /api/books/:id/reviews  (createReview)
 *   10.4 — POST /api/movies/:id/reviews (createReview)
 *   10.5 — 422 on rating outside 1–5   (handled by reviewRules middleware)
 *   10.6 — 409 on duplicate review     (createReview)
 *   10.7 — aggregate rating update     (createReview)
 *   10.8 — pagination                  (listReviews)
 *   10.9 — 401 without JWT             (authenticate middleware)
 *   10.10 — 404 for non-existent item  (createReview)
 */

const Review   = require('../../models/Review');
const Book     = require('../../models/Book');
const { paginate } = require('../../utils/paginate');

// Lazy-load Movie model to avoid circular dependency issues when Movie.js
// may not yet exist during early development phases.
function getMovieModel() {
  // eslint-disable-next-line global-require
  return require('../../models/Movie');
}

/**
 * Resolves the parent Mongoose model based on itemType.
 * Returns null for unrecognised types.
 *
 * @param {'Book'|'Movie'} itemType
 * @returns {import('mongoose').Model|null}
 */
function resolveModel(itemType) {
  if (itemType === 'Book')  return Book;
  if (itemType === 'Movie') return getMovieModel();
  return null;
}

// ── GET /api/books/:id/reviews  OR  GET /api/movies/:id/reviews ──────────────
// Requirements 10.1, 10.2, 10.8
//
// Paginates Review documents filtered by itemId + itemType.
// Populates userId → name for userName in each result row.
//
const listReviews = async (req, res, next) => {
  try {
    const itemId   = req.params.id;
    const itemType = req.itemType; // Set by the mounting route middleware

    const filter = { itemId, itemType };

    const { page, limit } = req.query;

    const result = await paginate(Review, filter, {
      page:     page  || 1,
      limit:    limit || 20,
      sort:     { createdAt: -1 },
      populate: { path: 'userId', select: 'name' },
    });

    // Map populated userId document to a flat userName field on each review
    const data = result.data.map((review) => {
      const obj = review.toObject ? review.toObject() : { ...review };
      obj.userName = obj.userId?.name ?? null;
      obj.userId   = obj.userId?._id ?? obj.userId;
      return obj;
    });

    return res.status(200).json({ ...result, data });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/books/:id/reviews  OR  POST /api/movies/:id/reviews ────────────
// Requirements 10.3, 10.4, 10.5, 10.6, 10.7, 10.10
//
// Verifies the parent item exists, saves a new Review, recomputes aggregate
// rating via $avg aggregation, and updates the parent item's rating +
// reviewCount.
//
const createReview = async (req, res, next) => {
  try {
    const itemId   = req.params.id;
    const itemType = req.itemType; // Set by the mounting route middleware
    const userId   = req.user.id;
    const { rating, comment } = req.body;

    // Resolve the parent model (Book or Movie)
    const ParentModel = resolveModel(itemType);
    if (!ParentModel) {
      return res.status(400).json({ error: `Unsupported itemType: ${itemType}` });
    }

    // Verify the parent item exists — 404 if not (Requirement 10.10)
    const parentItem = await ParentModel.findById(itemId);
    if (!parentItem) {
      const label = itemType === 'Book' ? 'Book' : 'Movie';
      return res.status(404).json({ error: `${label} not found` });
    }

    // Create the review.
    // A compound unique index { userId, itemId } on ReviewSchema will throw
    // a Mongoose duplicate-key error (code 11000) on duplicate submissions —
    // this is caught below and mapped to HTTP 409 (Requirement 10.6).
    // rating range 1–5 is enforced by reviewRules validators and the schema
    // min/max — a validation error from Mongoose is mapped to 422 (Req 10.5).
    let review;
    try {
      review = await Review.create({
        userId,
        itemId,
        itemType,
        rating,
        comment,
      });
    } catch (createErr) {
      // Duplicate review — compound index violation (Requirement 10.6)
      if (createErr.code === 11000) {
        return res.status(409).json({ error: 'You have already reviewed this item' });
      }

      // Mongoose ValidationError on rating/comment (Requirement 10.5)
      if (createErr.name === 'ValidationError') {
        return res.status(422).json({ error: createErr.message });
      }

      throw createErr;
    }

    // Recompute aggregate rating via $avg (Requirement 10.7, Design: "Aggregate Rating Recomputation")
    const agg = await Review.aggregate([
      { $match: { itemId: parentItem._id, itemType } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (agg.length > 0) {
      const { avg, count } = agg[0];
      await ParentModel.findByIdAndUpdate(itemId, {
        rating:      Math.round(avg * 10) / 10, // round to 1 decimal place
        reviewCount: count,
      });
    }

    return res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

module.exports = { listReviews, createReview };
