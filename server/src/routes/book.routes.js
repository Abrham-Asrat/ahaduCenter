'use strict';

/**
 * book.routes.js
 *
 * Mounts all /api/books endpoints.
 *
 * Requirements covered:
 *   4.1–4.4  — GET /          (listBooks with bookQueryRules + pagination)
 *   4.5–4.6  — GET /:id       (getBook with objectIdParam)
 *   5.1–5.2  — POST /:id/borrow   (borrowBook — auth required)
 *   5.3      — POST /:id/reserve  (reserveBook — auth required)
 *   10.1–10.2 — GET  /:id/reviews (stub 501 — review controller not yet implemented)
 *   10.3     — POST /:id/reviews  (stub 501 — review controller not yet implemented)
 */

const express = require('express');
const router = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate = require('../../middleware/authenticate');
const validate     = require('../../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { bookQueryRules } = require('../validators/book.validators');
const { objectIdParam, paginationRules } = require('../validators/common.validators');

// ── Controllers ───────────────────────────────────────────────────────────────
const { listBooks, getBook, reserveBook } = require('../controllers/book.controller');
const { borrowBook } = require('../controllers/borrowing.controller');

// ── Inline stub for review endpoints (not yet implemented) ───────────────────
const notImplemented = (_req, res) =>
  res.status(501).json({ error: 'Reviews not yet implemented' });

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/books
// Requirements 4.1, 4.2, 4.3, 4.4
router.get('/', bookQueryRules, validate, listBooks);

// GET /api/books/:id
// Requirements 4.5, 4.6
router.get('/:id', objectIdParam('id'), validate, getBook);

// GET /api/books/:id/reviews  (stub — review controller not yet implemented)
// Requirements 10.1, 10.8
router.get('/:id/reviews', objectIdParam('id'), paginationRules, validate, notImplemented);

// POST /api/books/:id/reviews  (stub — review validators/controller not yet implemented)
// Requirements 10.3
router.post('/:id/reviews', authenticate, objectIdParam('id'), validate, notImplemented);

// POST /api/books/:id/borrow
// Requirements 5.1, 5.2, 5.10
router.post('/:id/borrow', authenticate, objectIdParam('id'), validate, borrowBook);

// POST /api/books/:id/reserve
// Requirement 5.3
router.post('/:id/reserve', authenticate, objectIdParam('id'), validate, reserveBook);

module.exports = router;
