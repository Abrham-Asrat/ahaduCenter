'use strict';

/** Seeds library books from the curated Ethiopian and international catalog. */

const Book = require('../../models/Book');
const titles = require('../data/bookTitles.json');
const { randomInt, pick, randomDateWithin, slugify } = require('../utils/random');
const { isbn } = require('../utils/fakerHelpers');

async function seedBooks(ctx) {
  const records = Array.from({ length: ctx.counts.books }, (_, index) => {
    const [title, author, category, language] = titles[index % titles.length];
    const totalCopies = randomInt(1, 8);
    const availableCopies = randomInt(0, totalCopies);
    return {
      title: `${title}${index >= titles.length ? ` Edition ${Math.floor(index / titles.length) + 1}` : ''}`,
      author, category, language, isbn: isbn(index),
      description: `${title} is a thoughtful ${category.toLowerCase()} selection for the Ahadu Center library.` ,
      coverUrl: `https://picsum.photos/seed/book-${slugify(title)}-${index}/400/600`,
      totalCopies, availableCopies,
      year: randomInt(1960, 2024), pages: randomInt(120, 720),
      publisher: pick(['Ahadu Press', 'Addis House', 'Riverbend Books', 'Open Shelf Press']),
      format: pick(['Paperback', 'Hardcover']),
      location: `${pick(['A', 'B', 'C', 'D'])}-${randomInt(1, 24)}`,
      availability: availableCopies === 0 ? 'Borrowed' : availableCopies < totalCopies ? 'Reserved' : 'Available',
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      createdAt: randomDateWithin(365), updatedAt: new Date(),
    };
  });
  const books = await Book.create(records);
  ctx.books = books;
  return books;
}

module.exports = seedBooks;
