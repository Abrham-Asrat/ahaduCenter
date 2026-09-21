'use strict';

/** Seeds five varied notifications for each of the first six users. */

const Notification = require('../../models/Notification');
const { randomDateWithin } = require('../utils/random');

async function seedNotifications(ctx) {
  const users = ctx.users.slice(0, Math.min(6, ctx.users.length));
  const types = ['Books', 'Electronics', 'Movies', 'General', 'Books'];
  const records = users.flatMap((user, userIndex) => types.map((type, index) => ({
    userId: user._id, type, title: ['Borrowing reminder', 'Order ready for pickup', 'Movie request update', 'Welcome to Ahadu Center', 'New library selection'][index],
    description: ['Please check your current borrowing due date.', 'Your electronics order is ready at the Bole hub.', 'Your requested title has received an update.', 'Explore books, movies, and electronics in one place.', 'A new selection has been added to the library.'][index],
    isRead: (userIndex + index) % 3 === 0, timestamp: randomDateWithin(60),
  })));
  const notifications = await Notification.create(records);
  ctx.notifications = notifications;
  return notifications;
}

module.exports = seedNotifications;
