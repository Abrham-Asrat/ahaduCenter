'use strict';

/**
 * user.controller.js
 *
 * Handles all /api/users/me* endpoints.
 *
 * Requirements covered:
 *   3.1 — GET  /api/users/me         (getProfile)
 *   3.2, 3.3, 3.9 — PUT  /api/users/me  (updateProfile)
 *   3.4, 3.8 — POST /api/users/me/avatar (uploadAvatar)
 *   3.5 — GET  /api/users/me/stats   (getStats)
 *   3.6 — GET  /api/users/me/activity (getActivity)
 */

const User         = require('../models/User.js');
const WishlistItem = require('../models/WishlistItem.js');
const Order        = require('../models/Order.js');
const Borrowing    = require('../models/Borrowing.js');
const MovieRequest = require('../models/MovieRequest.js');
const { getFileUrl } = require('../services/upload.service.js');

// ── GET /api/users/me ─────────────────────────────────────────────────────────
// Requirement 3.1
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      'name email phone avatarUrl role createdAt'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id:          user._id.toString(),
      name:        user.name,
      email:       user.email,
      phone:       user.phone,
      avatarUrl:   user.avatarUrl,
      memberSince: user.createdAt,
      role:        user.role,
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/users/me ─────────────────────────────────────────────────────────
// Requirements 3.2, 3.3, 3.9
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    // Build only the fields that were provided
    const updates = {};
    if (name  !== undefined) updates.name  = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (email !== undefined) updates.email = email.toLowerCase().trim();

    // Guard: if no valid fields remain after processing, respond 422
    if (Object.keys(updates).length === 0) {
      return res.status(422).json({
        error: 'No valid fields provided',
        errors: [{ field: 'body', message: 'At least one of name, email, or phone must be provided' }],
      });
    }

    // Check email uniqueness only when email is being changed (Requirement 3.3)
    if (updates.email) {
      const existing = await User.findOne({
        email: updates.email,
        _id: { $ne: req.user.id },
      });
      if (existing) {
        return res.status(409).json({ error: 'Email is already in use by another account' });
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true, select: 'name email phone avatarUrl role createdAt' }
    );

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id:          updated._id.toString(),
      name:        updated.name,
      email:       updated.email,
      phone:       updated.phone,
      avatarUrl:   updated.avatarUrl,
      memberSince: updated.createdAt,
      role:        updated.role,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/users/me/avatar ─────────────────────────────────────────────────
// Requirements 3.4, 3.8
const uploadAvatar = async (req, res, next) => {
  try {
    // Multer places the uploaded file on req.file
    if (!req.file) {
      return res.status(400).json({ error: 'No image file was provided' });
    }

    let avatarUrl;
    try {
      avatarUrl = getFileUrl(req.file.filename);
    } catch (uploadErr) {
      // Upload service failure → 502 (Requirement 3.8)
      return res.status(502).json({ error: 'Upload failed. Please try again.' });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { avatarUrl } },
      { new: true, select: 'avatarUrl' }
    );

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ avatarUrl: updated.avatarUrl });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/me/stats ───────────────────────────────────────────────────
// Requirement 3.5
const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Run all count queries in parallel for efficiency
    const [favorites, purchases, borrowed, movieRequests] = await Promise.all([
      WishlistItem.countDocuments({ userId }),
      Order.countDocuments({ userId }),
      Borrowing.countDocuments({ userId }),
      MovieRequest.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      favorites,
      purchases,
      borrowed,
      movieRequests,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/me/activity ────────────────────────────────────────────────
// Requirement 3.6
const getActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch recent records from each domain in parallel
    // We fetch more than needed to have enough after merging & sorting
    const FETCH_LIMIT = 10;

    const [borrowings, orders, movieRequestsList] = await Promise.all([
      Borrowing.find({ userId })
        .sort({ createdAt: -1 })
        .limit(FETCH_LIMIT)
        .populate({ path: 'bookId', select: 'title' })
        .lean(),

      Order.find({ userId })
        .sort({ createdAt: -1 })
        .limit(FETCH_LIMIT)
        .lean(),

      MovieRequest.find({ userId })
        .sort({ createdAt: -1 })
        .limit(FETCH_LIMIT)
        .lean(),
    ]);

    // Map each domain's records to a unified activity shape
    const borrowingEvents = borrowings.map((b) => ({
      type:   'Borrowing',
      title:  b.bookId ? b.bookId.title : 'Unknown Book',
      date:   b.createdAt,
      status: mapBorrowingStatus(b.status),
    }));

    const orderEvents = orders.map((o) => ({
      type:   'Order',
      title:  buildOrderTitle(o),
      date:   o.createdAt,
      status: mapOrderStatus(o.status),
    }));

    const movieRequestEvents = movieRequestsList.map((mr) => ({
      type:   'MovieRequest',
      title:  mr.title,
      date:   mr.createdAt,
      status: mapMovieRequestStatus(mr.status),
    }));

    // Merge all events, sort by date descending, take top 10
    const allEvents = [...borrowingEvents, ...orderEvents, ...movieRequestEvents]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    return res.status(200).json(allEvents);
  } catch (err) {
    next(err);
  }
};

// ── Status mapping helpers ────────────────────────────────────────────────────

/**
 * Maps a Borrowing status to the unified activity status.
 * Valid unified statuses: "completed" | "pending" | "cancelled"
 * @param {string} status
 * @returns {string}
 */
function mapBorrowingStatus(status) {
  switch (status) {
    case 'Returned': return 'completed';
    case 'Active':   return 'pending';
    case 'Overdue':  return 'pending';
    default:         return 'pending';
  }
}

/**
 * Maps an Order status to the unified activity status.
 * @param {string} status
 * @returns {string}
 */
function mapOrderStatus(status) {
  switch (status) {
    case 'Completed':  return 'completed';
    case 'Cancelled':  return 'cancelled';
    case 'Processing': return 'pending';
    case 'Ready':      return 'pending';
    default:           return 'pending';
  }
}

/**
 * Maps a MovieRequest status to the unified activity status.
 * @param {string} status
 * @returns {string}
 */
function mapMovieRequestStatus(status) {
  switch (status) {
    case 'Fulfilled':  return 'completed';
    case 'Available':  return 'completed';
    case 'Pending':    return 'pending';
    default:           return 'pending';
  }
}

/**
 * Builds a human-readable title for an Order.
 * Uses the first item name or falls back to a generic label.
 * @param {object} order
 * @returns {string}
 */
function buildOrderTitle(order) {
  if (order.items && order.items.length > 0) {
    const first = order.items[0].productName || 'Product';
    const extra = order.items.length > 1 ? ` +${order.items.length - 1} more` : '';
    return `${first}${extra}`;
  }
  return 'Order';
}

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  getStats,
  getActivity,
};
