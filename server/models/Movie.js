const mongoose = require('mongoose');

const { Schema } = mongoose;

const CastMemberSchema = new Schema(
  {
    name:     { type: String, required: true },
    role:     { type: String },
    photoUrl: { type: String },
  },
  { _id: false }
);

const MovieSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

MovieSchema.index({ title: 'text', director: 'text' });

module.exports = mongoose.model('Movie', MovieSchema);
