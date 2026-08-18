'use strict';

/**
 * upload.routes.js
 *
 * Routes for file upload.
 *
 * POST /api/uploads — authenticated admin-only file upload
 */

const { Router } = require('express');
const authenticate        = require('../../middleware/authenticate');
const requireRole         = require('../../middleware/requireRole');
const { uploadSingle }    = require('../../middleware/upload');
const { uploadFile }      = require('../controllers/upload.controller');

const router = Router();

// POST /api/uploads
// Requires: valid JWT (authenticate), admin role (requireRole), multipart file (uploadSingle)
router.post('/', authenticate, requireRole('admin'), uploadSingle('file'), uploadFile);

module.exports = router;
