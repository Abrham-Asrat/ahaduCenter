'use strict';

/**
 * user.routes.js
 *
 * All routes for /api/users — protected with authenticate middleware.
 *
 * Fully implemented handlers:
 *   GET    /me               → getProfile
 *   PUT    /me               → updateProfileRules, validate, updateProfile
 *   POST   /me/avatar        → uploadSingle('avatar'), uploadAvatar
 *   GET    /me/stats         → getStats
 *   GET    /me/activity      → getActivity
 *
 * Stub handlers (501 Not Implemented) — to be replaced when the respective
 * controllers are implemented in later tasks:
 *   GET    /me/borrowings                → getBorrowingHistory  (task 5.3)
 *   GET    /me/orders                    → getOrderHistory      (task 7.4)
 *   GET    /me/movie-requests            → getUserMovieRequests (task 6.3)
 *   GET    /me/wishlist                  → getWishlist          (task 9.1)
 *   POST   /me/wishlist                  → addToWishlist        (task 9.1)
 *   DELETE /me/wishlist/:itemId          → removeFromWishlist   (task 9.1)
 *   GET    /me/notifications             → getNotifications     (task 10.2)
 *   POST   /me/notifications/read-all   → markAllRead          (task 10.2)
 *   DELETE /me/notifications             → deleteAllNotifications (task 10.2)
 */

const express = require('express');

const router = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate   = require('../../middleware/authenticate');
const validate       = require('../../middleware/validate');
const { uploadSingle } = require('../../middleware/upload');

// ── Validators ────────────────────────────────────────────────────────────────
const { updateProfileRules } = require('../validators/user.validators');

// ── User controller (implemented) ────────────────────────────────────────────
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  getStats,
  getActivity,
} = require('../controllers/user.controller');

// ── Borrowing controller (task 5.3) ───────────────────────────────────────────
const { getBorrowingHistory } = require('../controllers/borrowing.controller');

// ── MovieRequest controller (task 6.3) ────────────────────────────────────────
const { getUserMovieRequests } = require('../controllers/movieRequest.controller');

// ── Stub handler for controllers not yet implemented ─────────────────────────
const notImplemented = (_req, res) =>
  res.status(501).json({ error: 'Not yet implemented' });

// ── Apply authenticate to all routes in this router ──────────────────────────
router.use(authenticate);

// ── Profile routes ────────────────────────────────────────────────────────────

// GET /api/users/me — Requirement 3.1
router.get('/me', getProfile);

// PUT /api/users/me — Requirements 3.2, 3.3, 3.9
router.put('/me', updateProfileRules, validate, updateProfile);

// POST /api/users/me/avatar — Requirements 3.4, 3.8
router.post('/me/avatar', uploadSingle('avatar'), uploadAvatar);

// GET /api/users/me/stats — Requirement 3.5
router.get('/me/stats', getStats);

// GET /api/users/me/activity — Requirement 3.6
router.get('/me/activity', getActivity);

// ── Borrowing history (task 5.3) ──────────────────────────────────────────────
// GET /api/users/me/borrowings — Requirement 5.4
router.get('/me/borrowings', getBorrowingHistory);

// ── Order history (stub — task 7.4) ──────────────────────────────────────────
// GET /api/users/me/orders — Requirement 9.3
router.get('/me/orders', notImplemented);

// ── Movie requests (task 6.3) ─────────────────────────────────────────────────
// GET /api/users/me/movie-requests — Requirement 7.2
router.get('/me/movie-requests', getUserMovieRequests);

// ── Wishlist routes (stub — task 9.1) ─────────────────────────────────────────
// GET /api/users/me/wishlist — Requirement 11.1
router.get('/me/wishlist', notImplemented);

// POST /api/users/me/wishlist — Requirement 11.2
router.post('/me/wishlist', notImplemented);

// DELETE /api/users/me/wishlist/:itemId — Requirement 11.4
router.delete('/me/wishlist/:itemId', notImplemented);

// ── Notification routes (stub — task 10.2) ────────────────────────────────────
// GET /api/users/me/notifications — Requirement 12.1
router.get('/me/notifications', notImplemented);

// POST /api/users/me/notifications/read-all — Requirement 12.5
router.post('/me/notifications/read-all', notImplemented);

// DELETE /api/users/me/notifications — Requirement 12.6
router.delete('/me/notifications', notImplemented);

module.exports = router;
