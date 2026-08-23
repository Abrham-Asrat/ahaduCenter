'use strict';

/**
 * Book.js
 *
 * Mongoose model for library books.
 * Schema per design document (section "Data Models → Book").
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
  title:           { type: String, required: true, trim: true },
  author:          { type: String, required: true, trim: true },
  publisher:       { type: String, trim: true },
  year:            { type: Number },
  isbn:            { type: String, trim: true },
  description:     { type: String, trim: true },
  pages:           { type: Number },
  publicationDate: { type: String },
  dimensions:      { type: String },
  about:           { type: String },
  authorInfo:      { type: String },
  borrowingPolicy: { type: String },
  location:        { type: String },
  coverUrl:        { type: String },
  availability:    { type: String, enum: ['Available', 'Borrowed', 'Reserved'], default: 'Available' },
  availableCopies: { type: Number, default: 1, min: 0 },
  totalCopies:     { type: Number, default: 1 },
  format:          { type: String },       // e.g. "Hardcover", "Paperback"
  language:        { type: String, trim: true },
  price:           { type: Number, default: 0 },
  category:        { type: String, trim: true },
  rating:          { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:     { type: Number, default: 0 },
}, { timestamps: true });

BookSchema.index({ title: 'text', author: 'text', isbn: 'text' }, { language_override: 'dummy_language_override' });

module.exports = mongoose.models.Book || mongoose.model('Book', BookSchema);
