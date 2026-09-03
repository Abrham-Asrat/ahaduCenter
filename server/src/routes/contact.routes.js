'use strict';

/**
 * contact.routes.js
 *
 * Mounts all public /api/contact endpoints.
 *
 * Requirements covered:
 *   13.1 — POST /  (submitContact — no auth required, contactRules + validate)
 *
 * Note: The admin contact list endpoint (GET /api/admin/contacts) is mounted
 * under the admin router (task 14.4) — it is NOT included here.
 */

const express = require('express');
const router  = express.Router();

// ── Validators ────────────────────────────────────────────────────────────────
const { contactRules } = require('../validators/contact.validators');

// ── Middleware ────────────────────────────────────────────────────────────────
const validate = require('../middleware/validate');

// ── Controllers ───────────────────────────────────────────────────────────────
const { submitContact } = require('../controllers/contact.controller');

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/contact
// Requirement 13.1
router.post('/', contactRules, validate, submitContact);

module.exports = router;
