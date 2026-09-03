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
 *   (none remaining)
 */

const express = require('express');

const router = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate   = require('../../middleware/authenticate');
const validate       = require('../../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { updateProfileRules } = require('../validators/user.validators');

// ── User controller (implemented) ────────────────────────────────────────────
const {
  getProfile,
  updateProfile,
  getStats,
  getActivity,
} = require('../controllers/user.controller');

// ── Borrowing controller (task 5.3) ───────────────────────────────────────────
const { getBorrowingHistory } = require('../controllers/borrowing.controller');

// ── Order controller (task 7.4) ────────────────────────────────────────────────
const { getOrderHistory } = require('../controllers/order.controller');

// ── MovieRequest controller (task 6.3) ────────────────────────────────────────
const { getUserMovieRequests } = require('../controllers/movieRequest.controller');

// ── Wishlist controller (task 9.1) ────────────────────────────────────────────
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/wishlist.controller');

// ── Notification controller (task 10.2) ───────────────────────────────────────
const {
  getNotifications,
  markAllRead,
  deleteAllNotifications,
} = require('../controllers/notification.controller');

// ── Apply authenticate to all routes in this router ──────────────────────────
router.use(authenticate);

// ── Profile routes ────────────────────────────────────────────────────────────

// GET /api/users/me — Requirement 3.1
router.get('/me', getProfile);

// PUT /api/users/me — Requirements 3.2, 3.3, 3.9
router.put('/me', updateProfileRules, validate, updateProfile);

// GET /api/users/me/stats — Requirement 3.5
router.get('/me/stats', getStats);

// GET /api/users/me/activity — Requirement 3.6
router.get('/me/activity', getActivity);

// ── Borrowing history (task 5.3) ──────────────────────────────────────────────
// GET /api/users/me/borrowings — Requirement 5.4
router.get('/me/borrowings', getBorrowingHistory);

// ── Order history (task 7.4) ──────────────────────────────────────────────────
// GET /api/users/me/orders — Requirement 9.3
router.get('/me/orders', getOrderHistory);

// ── Movie requests (task 6.3) ─────────────────────────────────────────────────
// GET /api/users/me/movie-requests — Requirement 7.2
router.get('/me/movie-requests', getUserMovieRequests);

// ── Wishlist routes (task 9.1) ────────────────────────────────────────────────
// GET /api/users/me/wishlist — Requirement 11.1
router.get('/me/wishlist', getWishlist);

// POST /api/users/me/wishlist — Requirements 11.2, 11.3, 11.7
router.post('/me/wishlist', addToWishlist);

// DELETE /api/users/me/wishlist/:itemId — Requirements 11.4, 11.5
router.delete('/me/wishlist/:itemId', removeFromWishlist);

// ── Notification routes (task 10.2) ──────────────────────────────────────────
// GET /api/users/me/notifications — Requirement 12.1
router.get('/me/notifications', getNotifications);

// POST /api/users/me/notifications/read-all — Requirement 12.5
router.post('/me/notifications/read-all', markAllRead);

// DELETE /api/users/me/notifications — Requirement 12.6
router.delete('/me/notifications', deleteAllNotifications);

module.exports = router;
