'use strict';

/** Seeds unique book/movie reviews and refreshes parent rating aggregates. */

const Review = require('../../models/Review');
const Book = require('../../models/Book');
const Movie = require('../../models/Movie');
const { randomInt, randomDateWithin } = require('../utils/random');

async function seedReviews(ctx) {
  const bookCount = Math.ceil(ctx.counts.reviews / 2);
  const movieCount = ctx.counts.reviews - bookCount;
  const records = [];
  for (let index = 0; index < bookCount; index += 1) {
    records.push({ userId: ctx.users[index % ctx.users.length]._id, itemId: ctx.books[Math.floor(index / ctx.users.length) % ctx.books.length]._id, itemType: 'Book', rating: randomInt(1, 5), comment: 'A thoughtful and useful addition to the Ahadu Center collection.', createdAt: randomDateWithin(180), updatedAt: new Date() });
  }
  for (let index = 0; index < movieCount; index += 1) {
    records.push({ userId: ctx.users[index % ctx.users.length]._id, itemId: ctx.movies[Math.floor(index / ctx.users.length) % ctx.movies.length]._id, itemType: 'Movie', rating: randomInt(1, 5), comment: 'An engaging selection with a memorable presentation.', createdAt: randomDateWithin(180), updatedAt: new Date() });
  }
  const reviews = await Review.create(records);
  for (const itemType of ['Book', 'Movie']) {
    const Model = itemType === 'Book' ? Book : Movie;
    const ids = [...new Set(reviews.filter((review) => review.itemType === itemType).map((review) => review.itemId.toString()))];
    for (const id of ids) {
      const stats = await Review.aggregate([{ $match: { itemType, itemId: reviews.find((review) => review.itemType === itemType && review.itemId.toString() === id).itemId } }, { $group: { _id: null, rating: { $avg: '$rating' }, count: { $sum: 1 } } }]);
      if (stats[0]) await Model.findByIdAndUpdate(id, { rating: Math.round(stats[0].rating * 10) / 10, reviewCount: stats[0].count });
    }
  }
  ctx.reviews = reviews;
  return reviews;
}

module.exports = seedReviews;
