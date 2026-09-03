'use strict';

/**
 * order.routes.js
 *
 * Mounts all /api/orders endpoints.
 *
 * Requirements covered:
 *   9.1–9.2  — POST /        (placeOrder — auth required)
 *   9.4–9.6  — GET  /:id     (getOrder   — auth required)
 */

const express = require('express');
const router  = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate = require('../middleware/authenticate');
const validate     = require('../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { orderBodyRules } = require('../validators/order.validators');
const { objectIdParam }  = require('../validators/common.validators');

// ── Controllers ───────────────────────────────────────────────────────────────
const { placeOrder, getOrder } = require('../controllers/order.controller');

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/orders
// Requirements 9.1, 9.2, 12.7
router.post('/', authenticate, orderBodyRules, validate, placeOrder);

// GET /api/orders/:id
// Requirements 9.4, 9.5, 9.6
router.get('/:id', authenticate, objectIdParam('id'), validate, getOrder);

module.exports = router;
