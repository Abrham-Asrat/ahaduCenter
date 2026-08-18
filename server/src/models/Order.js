'use strict';

/**
 * Order.js
 *
 * Mongoose schema for electronics in-store pick-up orders.
 *
 * Each Order belongs to a User and contains one or more OrderItems,
 * each of which captures a product snapshot (name, image, price) at
 * the time of ordering so the order record remains accurate even if
 * the product catalogue changes later.
 *
 * Requirements covered: 9.1 – 9.6
 */

const { Schema, model } = require('mongoose');

const OrderItemSchema = new Schema(
  {
    productId:    { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName:  { type: String },
    productImage: { type: String },
    price:        { type: Number },
    quantity:     { type: Number, min: 1, max: 99 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId:              { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items:               [OrderItemSchema],
    subtotal:            { type: Number, required: true },
    reservationFee:      { type: Number, required: true },
    totalPayableAtStore: { type: Number, required: true },
    status:              {
      type:    String,
      enum:    ['Processing', 'Ready', 'Completed', 'Cancelled'],
      default: 'Processing',
    },
    storeLocation: {
      type:    String,
      default: 'Ahadu Center Hub, Bole Road (Next to Friendship HyperMarket), Addis Ababa, Ethiopia',
    },
    operatingHours: { type: String, default: 'Mon-Sat 9:00 AM – 8:00 PM' },
  },
  { timestamps: true }
);

module.exports = model('Order', OrderSchema);
