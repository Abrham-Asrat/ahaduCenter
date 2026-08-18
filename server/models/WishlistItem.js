const mongoose = require('mongoose');
const { Schema } = mongoose;

const WishlistItemSchema = new Schema({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemId:   { type: Schema.Types.ObjectId, required: true },
  itemType: { type: String, enum: ['Movie', 'Book', 'Product'], required: true },
  addedAt:  { type: Date, default: Date.now },
}, { timestamps: false });

// Prevents a user from adding the same item to their wishlist more than once
WishlistItemSchema.index({ userId: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('WishlistItem', WishlistItemSchema);
