const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
