const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
