'use strict';

/**
 * movie.routes.js
 *
 * Mounts all /api/movies endpoints.
 *
 * Requirements covered:
 *   6.1–6.4  — GET /              (listMovies with movieQueryRules + pagination)
 *   6.5–6.6  — GET /:id           (getMovie with objectIdParam)
 *   10.2, 10.8 — GET /:id/reviews (listReviews)
 *   10.4     — POST /:id/reviews  (createReview — auth required)
 */

const express = require('express');
const router = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate = require('../middleware/authenticate');
const validate     = require('../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { movieQueryRules } = require('../validators/movie.validators');
const { reviewRules }     = require('../validators/review.validators');
const { objectIdParam, paginationRules } = require('../validators/common.validators');

// ── Controllers ───────────────────────────────────────────────────────────────
const { listMovies, getMovie } = require('../controllers/movie.controller');
const { listReviews, createReview } = require('../controllers/review.controller');

// ── Middleware: inject itemType for review handlers ───────────────────────────
const setMovieItemType = (_req, res, next) => { _req.itemType = 'Movie'; next(); };

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/movies
// Requirements 6.1, 6.2, 6.3, 6.4
router.get('/', movieQueryRules, validate, listMovies);

// GET /api/movies/:id
// Requirements 6.5, 6.6
router.get('/:id', objectIdParam('id'), validate, getMovie);

// GET /api/movies/:id/reviews
// Requirements 10.2, 10.8
router.get('/:id/reviews', objectIdParam('id'), paginationRules, validate, setMovieItemType, listReviews);

// POST /api/movies/:id/reviews
// Requirements 10.4, 10.5, 10.6
router.post('/:id/reviews', authenticate, objectIdParam('id'), ...reviewRules, validate, setMovieItemType, createReview);

module.exports = router;
