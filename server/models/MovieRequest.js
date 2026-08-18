const mongoose = require('mongoose');

const { Schema } = mongoose;

const MovieRequestSchema = new Schema(
  {
    userId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:   { type: String, required: true, trim: true, maxlength: 200 },
    type:    { type: String },         // e.g. "Movie", "Series"
    year:    { type: Number },
    genre:   { type: String },
    details: { type: String },
    status:  { type: String, enum: ['Pending', 'Available', 'Fulfilled'], default: 'Pending' },
  },
  { timestamps: true }
  // requestedAt is derived from createdAt
);

module.exports = mongoose.model('MovieRequest', MovieRequestSchema);
