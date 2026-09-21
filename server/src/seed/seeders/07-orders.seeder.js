'use strict';

/** Seeds pickup orders with product snapshots and live order statuses. */

const Order = require('../../models/Order');
const { randomInt, randomDateWithin } = require('../utils/random');

async function seedOrders(ctx) {
  const statuses = ['Processing', 'Processing', 'Processing', 'Processing', 'Processing', 'Processing', 'Processing', 'Processing', 'Processing', 'Processing', 'Ready', 'Ready', 'Ready', 'Ready', 'Ready', 'Ready', 'Ready', 'Ready', 'Ready', 'Ready', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Cancelled', 'Cancelled'];
  const records = Array.from({ length: ctx.counts.orders }, (_, index) => {
    const products = [ctx.products[index % ctx.products.length], ctx.products[(index + 7) % ctx.products.length]].slice(0, randomInt(1, 2));
    const items = products.map((product) => ({
      productId: product._id, productName: product.name, productImage: product.images[0], quantity: randomInt(1, 3),
    }));
    const createdAt = randomDateWithin(180);
    return {
      userId: ctx.users[(index + 1) % ctx.users.length]._id,
      items, status: statuses[index % statuses.length], createdAt, updatedAt: new Date(),
      storeLocation: 'Ahadu Center Hub, Bole Road, Addis Ababa, Ethiopia',
    };
  });
  const orders = await Order.create(records);
  ctx.orders = orders;
  return orders;
}

module.exports = seedOrders;
