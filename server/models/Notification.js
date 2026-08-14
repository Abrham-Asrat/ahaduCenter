const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
