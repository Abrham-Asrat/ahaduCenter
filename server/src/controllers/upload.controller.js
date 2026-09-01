'use strict';

/**
 * upload.controller.js
 *
 * Handles file upload endpoint.
 *
 * Requirements covered:
 *   14.1 — POST /api/uploads  (uploadFile)
 *   14.5 — returns public URL for uploaded file
 */

const { getFileUrl } = require('../services/upload.service.js');

/**
 * POST /api/uploads
 *
 * Expects a multipart/form-data request with a `file` field processed
 * by the upload middleware before this handler runs.
 *
 * Responds:
 *   201 { url }  — on success
 *   400 { error: 'No file uploaded' }  — when no file is present
 */
const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const url = getFileUrl(req.file.filename);
  return res.status(201).json({ url });
};

module.exports = { uploadFile };
