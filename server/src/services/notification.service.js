const Notification = require('../models/Notification');

/**
 * Creates a notification for a user. Failures are caught and logged
 * but do NOT propagate — callers are not affected if this fails.
 *
 * @param {Object} params
 * @param {string|import('mongoose').Types.ObjectId} params.userId
 * @param {'Books'|'Movies'|'Electronics'|'General'} params.type
 * @param {string} params.title
 * @param {string} [params.description]
 */
async function createNotification({ userId, type, title, description }) {
  try {
    await Notification.create({ userId, type, title, description });
  } catch (err) {
    // Log the error but never rethrow — upstream operations must not be rolled back (Req 12.9)
    console.error('[NotificationService] Failed to create notification:', err.message);
  }
}

module.exports = { createNotification };
