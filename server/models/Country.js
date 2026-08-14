const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Country', CountrySchema);
