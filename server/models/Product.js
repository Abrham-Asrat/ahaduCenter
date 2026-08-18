const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name:           { type: String, required: true, trim: true },
  brand:          { type: String, trim: true },
  category:       { type: String, trim: true },
  condition:      { type: String, enum: ['New', 'Used', 'Refurbished'], default: 'New' },
  images:         [{ type: String }],
  description:    { type: String },
  highlights:     [{ type: String }],
  specifications: { type: Map, of: String },   // key-value map
  price:          { type: Number, required: true, min: 0 },
  originalPrice:  { type: Number },
  discount:       { type: Number, default: 0, min: 0, max: 100 },
  rating:         { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:    { type: Number, default: 0 },
  inStock:        { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.index({ name: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
