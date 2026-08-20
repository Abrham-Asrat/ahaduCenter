const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type:        { type: String, enum: ['Books', 'Movies', 'Electronics', 'General'], required: true },
    title:       { type: String, required: true },
    description: { type: String },
    isRead:      { type: Boolean, default: false },
    timestamp:   { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
