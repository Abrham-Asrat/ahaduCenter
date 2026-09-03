'use strict';

/**
 * book.routes.js
 *
 * Mounts all /api/books endpoints.
 *
 * Requirements covered:
 *   4.1–4.4  — GET /              (listBooks with bookQueryRules + pagination)
 *   4.5–4.6  — GET /:id           (getBook with objectIdParam)
 *   5.1–5.2  — POST /:id/borrow   (borrowBook — auth required)
 *   5.3      — POST /:id/reserve  (reserveBook — auth required)
 *   10.1     — GET /:id/reviews   (listReviews)
 *   10.3     — POST /:id/reviews  (createReview — auth required)
 */

const express = require('express');
const router = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate = require('../middleware/authenticate');
const validate     = require('../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { bookQueryRules } = require('../validators/book.validators');
const { reviewRules }    = require('../validators/review.validators');
const { objectIdParam, paginationRules } = require('../validators/common.validators');

// ── Controllers ───────────────────────────────────────────────────────────────
const { listBooks, getBook, reserveBook } = require('../controllers/book.controller');
const { borrowBook } = require('../controllers/borrowing.controller');
const { listReviews, createReview } = require('../controllers/review.controller');

// ── Middleware: inject itemType for review handlers ───────────────────────────
const setBookItemType = (_req, res, next) => { _req.itemType = 'Book'; next(); };

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/books
// Requirements 4.1, 4.2, 4.3, 4.4
router.get('/', bookQueryRules, validate, listBooks);

// GET /api/books/:id
// Requirements 4.5, 4.6
router.get('/:id', objectIdParam('id'), validate, getBook);

// GET /api/books/:id/reviews
// Requirements 10.1, 10.8
router.get('/:id/reviews', objectIdParam('id'), paginationRules, validate, setBookItemType, listReviews);

// POST /api/books/:id/reviews
// Requirements 10.3, 10.5, 10.6
router.post('/:id/reviews', authenticate, objectIdParam('id'), ...reviewRules, validate, setBookItemType, createReview);

// POST /api/books/:id/borrow
// Requirements 5.1, 5.2, 5.10
router.post('/:id/borrow', authenticate, objectIdParam('id'), validate, borrowBook);

// POST /api/books/:id/reserve
// Requirement 5.3
router.post('/:id/reserve', authenticate, objectIdParam('id'), validate, reserveBook);

module.exports = router;
