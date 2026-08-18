'use strict';

/**
 * upload.service.js
 *
 * Thin service layer for file upload URL generation.
 * Multer's diskStorage handles physical file storage; this service
 * builds the publicly-accessible URL path for a stored file.
 *
 * Requirement 14.5 (upload file URL)
 */

/**
 * Returns the public URL path for a stored upload file.
 *
 * @param {string} filename - The filename as written to disk by multer
 *   (e.g. "550e8400-e29b-41d4-a716-446655440000.jpg")
 * @returns {string} URL path like "/uploads/<filename>"
 */
function getFileUrl(filename) {
  return `/uploads/${filename}`;
}

module.exports = { getFileUrl };
