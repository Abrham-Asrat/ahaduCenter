'use strict';

/**
 * product.routes.js
 *
 * Mounts all /api/products endpoints.
 *
 * Requirements covered:
 *   8.1–8.5  — GET /        (listProducts with productQueryRules + pagination)
 *   8.6–8.7  — GET /:id     (getProduct with objectIdParam)
 */

const express = require('express');
const router  = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const validate = require('../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { productQueryRules } = require('../validators/product.validators');
const { objectIdParam }     = require('../validators/common.validators');

// ── Controllers ───────────────────────────────────────────────────────────────
const { listProducts, getProduct } = require('../controllers/product.controller');

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/products
// Requirements 8.1, 8.2, 8.3, 8.4, 8.5
router.get('/', productQueryRules, validate, listProducts);

// GET /api/products/:id
// Requirements 8.6, 8.7
router.get('/:id', objectIdParam('id'), validate, getProduct);

module.exports = router;
