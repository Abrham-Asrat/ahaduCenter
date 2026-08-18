'use strict';

/**
 * movieRequest.routes.js
 *
 * Mounts all /api/movie-requests endpoints.
 *
 * Requirements covered:
 *   7.1, 7.7  — POST /    (submitMovieRequest — auth required, movieRequestRules)
 *   7.3–7.6   — DELETE /:id (cancelMovieRequest — auth required, objectIdParam)
 */

const express = require('express');
const router = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate = require('../../middleware/authenticate');
const validate     = require('../../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { movieRequestRules } = require('../validators/movie.validators');
const { objectIdParam } = require('../validators/common.validators');

// ── Controllers ───────────────────────────────────────────────────────────────
const {
  submitMovieRequest,
  cancelMovieRequest,
} = require('../controllers/movieRequest.controller');

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/movie-requests
// Requirements 7.1, 7.7
router.post('/', authenticate, movieRequestRules, validate, submitMovieRequest);

// DELETE /api/movie-requests/:id
// Requirements 7.3, 7.4, 7.5, 7.6
router.delete('/:id', authenticate, objectIdParam('id'), validate, cancelMovieRequest);

module.exports = router;
