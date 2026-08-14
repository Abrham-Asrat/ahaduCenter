const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
