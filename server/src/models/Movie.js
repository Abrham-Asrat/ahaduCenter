'use strict';

/**
 * Movie.js
 *
 * Mongoose model for the Movie Center catalog.
 *
 * Includes a sub-schema for cast members and a compound text index
 * on `title` and `director` to support full-text search via $text queries.
 *
 * Schema per design document (section "Data Models → Movie").
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Embedded sub-document for a single cast member.
 * `_id` is disabled because cast entries are always accessed
 * as part of the parent Movie document.
 */
const CastMemberSchema = new Schema({
  name:     { type: String, required: true },
  role:     { type: String },
  photoUrl: { type: String },
}, { _id: false });

const MovieSchema = new Schema({
  title:            { type: String, required: true, trim: true },
  year:             { type: Number },
  country:          { type: String },
  runtime:          { type: String },               // e.g. "2h 15m"
  quality:          { type: String },               // e.g. "4K", "HD"
  language:         { type: String },
  genres:           [{ type: String }],
  rating:           { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:      { type: Number, default: 0 },
  releaseDate:      { type: String },
  posterUrl:        { type: String },
  bannerUrl:        { type: String },
  subtitles:        [{ type: String }],
  director:         { type: String },
  writers:          [{ type: String }],
  studio:           { type: String },
  trailerUrl:       { type: String },
  trailerThumbnail: { type: String },
  description:      { type: String },
  cast:             [CastMemberSchema],
  screenshots:      [{ type: String }],
}, { timestamps: true });

// Text index for full-text search on title and director (Requirement 6.2)
MovieSchema.index({ title: 'text', director: 'text' });

module.exports = mongoose.model('Movie', MovieSchema);
