'use strict';

/**
 * search.routes.js
 *
 * Mounts the cross-content search endpoint.
 *
 * GET /api/search  →  validate query params → search controller
 */

const { Router } = require('express');
const { searchQueryRules } = require('../validators/search.validators');
const validate             = require('../middleware/validate');
const { search }           = require('../controllers/search.controller');

const router = Router();

// GET /api/search
router.get('/', searchQueryRules, validate, search);

module.exports = router;
