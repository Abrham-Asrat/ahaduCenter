'use strict';

/** Seeds wishlist items across books, movies, and products for ten users. */

const WishlistItem = require('../../models/WishlistItem');
const { randomInt, randomDateWithin } = require('../utils/random');

async function seedWishlists(ctx) {
  const userCount = Math.min(ctx.counts.wishlists, ctx.users.length);
  const records = [];
  for (let userIndex = 0; userIndex < userCount; userIndex += 1) {
    const itemCount = randomInt(2, 8);
    for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
      const typeIndex = itemIndex % 3;
      const itemType = ['Book', 'Movie', 'Product'][typeIndex];
      const source = typeIndex === 0 ? ctx.books : typeIndex === 1 ? ctx.movies : ctx.products;
      records.push({ userId: ctx.users[userIndex]._id, itemId: source[(userIndex * 3 + itemIndex) % source.length]._id, itemType, addedAt: randomDateWithin(90) });
    }
  }
  const items = await WishlistItem.create(records);
  ctx.wishlists = items;
  return items;
}

module.exports = seedWishlists;
