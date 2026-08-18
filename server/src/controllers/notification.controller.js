'use strict';

/**
 * notification.controller.js
 *
 * Handles notification-related endpoints:
 *   GET    /api/users/me/notifications         → getNotifications
 *   POST   /api/users/me/notifications/read-all → markAllRead
 *   DELETE /api/users/me/notifications          → deleteAllNotifications
 *   PATCH  /api/notifications/:id/read          → markOneRead
 */

const Notification = require('../models/Notification');

// Valid notification type values (mirrors the schema enum)
const VALID_TYPES = ['Books', 'Movies', 'Electronics', 'General'];

// ── GET /api/users/me/notifications ──────────────────────────────────────────
/**
 * Fetch the authenticated user's notifications ordered by timestamp desc.
 * Supports an optional `type` query parameter to filter by notification type.
 * Returns HTTP 400 if the provided type is not in the allowed enum.
 * Returns an empty array when the user has no matching notifications.
 *
 * Requirement 12.1, 12.2
 */
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    // Validate optional type filter
    if (type !== undefined) {
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({
          error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
        });
      }
    }

    const filter = { userId };
    if (type) {
      filter.type = type;
    }

    const notifications = await Notification.find(filter)
      .sort({ timestamp: -1 })
      .lean();

    return res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/notifications/:id/read ────────────────────────────────────────
/**
 * Mark a single notification as read.
 * Verifies the notification exists and belongs to the requesting user.
 * Returns HTTP 404 if not found or owned by a different user.
 *
 * Requirement 12.3, 12.4
 */
const markOneRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findById(id);

    // 404 if not found or wrong owner
    if (!notification || notification.userId.toString() !== userId) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json(notification);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/users/me/notifications/read-all ─────────────────────────────────
/**
 * Mark all of the authenticated user's unread notifications as read.
 * Responds HTTP 200 even if there are no unread notifications.
 *
 * Requirement 12.5
 */
const markAllRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/users/me/notifications ────────────────────────────────────────
/**
 * Delete all notifications for the authenticated user.
 * Responds HTTP 200 even if the user has no notifications.
 *
 * Requirement 12.6
 */
const deleteAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Notification.deleteMany({ userId });

    return res.status(200).json({ message: 'All notifications deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  markOneRead,
  markAllRead,
  deleteAllNotifications,
};
