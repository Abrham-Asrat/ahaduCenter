const mongoose = require('mongoose');
const { Schema } = mongoose;

const WishlistItemSchema = new Schema(
  {
    userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    itemId:   { type: Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ['Movie', 'Book', 'Product'], required: true },
    addedAt:  { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Prevents the same item from being added to a user's wishlist more than once
WishlistItemSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

module.exports = mongoose.models.WishlistItem || mongoose.model('WishlistItem', WishlistItemSchema);
