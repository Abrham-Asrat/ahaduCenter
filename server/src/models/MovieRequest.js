'use strict';

/**
 * MovieRequest.js
 *
 * Mongoose model for user-submitted movie requests.
 *
 * Users can request movies or series that are not yet in the catalog.
 * `requestedAt` is derived from the `createdAt` timestamp added by
 * the `{ timestamps: true }` option.
 *
 * Schema per design document (section "Data Models → MovieRequest").
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const MovieRequestSchema = new Schema({
  userId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true, trim: true, maxlength: 200 },
  type:    { type: String },         // e.g. "Movie", "Series"
  year:    { type: Number },
  genre:   { type: String },
  details: { type: String },
  status:  { type: String, enum: ['Pending', 'Available', 'Fulfilled'], default: 'Pending' },
}, { timestamps: true });
// requestedAt is derived from createdAt

module.exports = mongoose.model('MovieRequest', MovieRequestSchema);
