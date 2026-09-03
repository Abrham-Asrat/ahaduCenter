const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    itemId:   { type: Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ['Book', 'Movie'], required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
  },
  { timestamps: true }
);

// Prevents duplicate reviews from the same user for the same item
ReviewSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
