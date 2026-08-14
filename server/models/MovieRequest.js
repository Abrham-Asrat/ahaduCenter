const mongoose = require('mongoose');

const MovieRequestSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('MovieRequest', MovieRequestSchema);
