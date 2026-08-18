'use strict';

/**
 * movie.routes.js
 *
 * Mounts all /api/movies endpoints.
 *
 * Requirements covered:
 *   6.1–6.4  — GET /              (listMovies with movieQueryRules + pagination)
 *   6.5–6.6  — GET /:id           (getMovie with objectIdParam)
 *   10.2, 10.8 — GET /:id/reviews (listReviews — wired when review controller exists)
 *   10.4     — POST /:id/reviews  (createReview — wired when review controller exists)
 */

const express = require('express');
const router = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate = require('../../middleware/authenticate');
const validate     = require('../../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { movieQueryRules } = require('../validators/movie.validators');
const { objectIdParam, paginationRules } = require('../validators/common.validators');

// ── Review validators (not yet implemented — will be added in task 8.1) ───────
let reviewRules = [];
try {
  ({ reviewRules } = require('../validators/review.validators'));
} catch (_) {
  // review.validators.js not yet created; reviewRules defaults to [] (no-op)
}

// ── Controllers ───────────────────────────────────────────────────────────────
const { listMovies, getMovie } = require('../controllers/movie.controller');

// ── Review controller (not yet implemented — will be added in task 8.2) ───────
const notImplemented = (_req, res) =>
  res.status(501).json({ error: 'Reviews not yet implemented' });

let listReviews = notImplemented;
let createReview = notImplemented;
try {
  ({ listReviews, createReview } = require('../controllers/review.controller'));
} catch (_) {
  // review.controller.js not yet created; handlers fall back to notImplemented
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/movies
// Requirements 6.1, 6.2, 6.3, 6.4
router.get('/', movieQueryRules, validate, listMovies);

// GET /api/movies/:id
// Requirements 6.5, 6.6
router.get('/:id', objectIdParam('id'), validate, getMovie);

// GET /api/movies/:id/reviews
// Requirements 10.2, 10.8
router.get('/:id/reviews', objectIdParam('id'), paginationRules, validate, listReviews);

// POST /api/movies/:id/reviews
// Requirements 10.4
router.post('/:id/reviews', authenticate, objectIdParam('id'), ...reviewRules, validate, createReview);

module.exports = router;
