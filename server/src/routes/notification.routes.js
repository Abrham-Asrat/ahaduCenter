'use strict';

/**
 * notification.routes.js
 *
 * Routes for /api/notifications
 *
 * Requirements covered:
 *   12.3, 12.4  — PATCH /:id/read  (markOneRead — auth required, objectIdParam)
 */

const express = require('express');

const router = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate = require('../../middleware/authenticate');
const validate     = require('../../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { objectIdParam } = require('../validators/common.validators');

// ── Controllers ───────────────────────────────────────────────────────────────
const { markOneRead } = require('../controllers/notification.controller');

// PATCH /api/notifications/:id/read
// Requirements 12.3, 12.4
router.patch('/:id/read', authenticate, objectIdParam('id'), validate, markOneRead);

module.exports = router;
