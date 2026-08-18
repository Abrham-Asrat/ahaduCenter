const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/** Allowed MIME types for uploaded images */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** 5 MB file size limit */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * diskStorage: writes files to ./uploads/ with a UUID-based filename.
 * The original file extension is preserved.
 */
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

/**
 * fileFilter: accepts only image/jpeg, image/png, image/webp.
 * Rejects other MIME types by passing an error object that carries
 * a custom `status` so the error handler can return HTTP 415.
 */
const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error('Unsupported media type. Only JPEG, PNG, and WebP images are accepted.');
    err.status = 415;
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

/**
 * Wraps a multer single-field upload and converts multer errors to the
 * appropriate HTTP status codes before passing to the next error handler.
 *
 * - MulterError LIMIT_FILE_SIZE → 413 Payload Too Large
 * - fileFilter rejection (status 415)  → 415 Unsupported Media Type
 * - Other multer / unexpected errors   → forwarded to global error handler
 *
 * @param {string} fieldName - The multipart field name
 * @returns {Function} Express middleware
 */
const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Maximum allowed size is 5 MB.' });
    }

    if (err && err.status === 415) {
      return res.status(415).json({ error: err.message });
    }

    next(err);
  });
};

module.exports = { upload, uploadSingle };
