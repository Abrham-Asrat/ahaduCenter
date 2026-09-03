'use strict';

/**
 * Reservation.js
 *
 * Mongoose model for book reservations.
 * Schema per design document (section "Data Models → Reservation").
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReservationSchema = new Schema({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId:          { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  status:          { type: String, enum: ['Reserved', 'Cancelled', 'Fulfilled'], default: 'Reserved' },
  reservationDate: { type: Date, default: Date.now },
}, { timestamps: true });

ReservationSchema.index({ userId: 1, bookId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'Reserved' } });

module.exports = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
