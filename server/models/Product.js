const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
