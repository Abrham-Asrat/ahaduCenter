const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
