'use strict';

/**
 * borrowing.routes.js
 *
 * Mounts all /api/borrowings endpoints.
 *
 * Requirements covered:
 *   5.5–5.6  — POST /:id/renew   (renewBorrowing — auth required)
 *   5.7      — POST /:id/return  (returnBook — auth required)
 */

const express = require('express');
const router = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate = require('../middleware/authenticate');
const validate     = require('../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { objectIdParam } = require('../validators/common.validators');

// ── Controllers ───────────────────────────────────────────────────────────────
const { renewBorrowing, returnBook } = require('../controllers/borrowing.controller');

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/borrowings/:id/renew
// Requirements 5.5, 5.6
router.post('/:id/renew', authenticate, objectIdParam('id'), validate, renewBorrowing);

// POST /api/borrowings/:id/return
// Requirement 5.7
router.post('/:id/return', authenticate, objectIdParam('id'), validate, returnBook);

module.exports = router;
