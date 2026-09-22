'use strict';

/** Clears seeded collections in reverse dependency order. */

const User = require('../models/User');
const Book = require('../models/Book');
const Movie = require('../models/Movie');
const Product = require('../models/Product');
const Borrowing = require('../models/Borrowing');
const Reservation = require('../models/Reservation');
const MovieRequest = require('../models/MovieRequest');
const Order = require('../models/Order');
const Review = require('../models/Review');
const WishlistItem = require('../models/WishlistItem');
const Notification = require('../models/Notification');
const ContactSubmission = require('../models/ContactSubmission');

const COLLECTIONS = {
  users: User,
  books: Book,
  movies: Movie,
  products: Product,
  borrowings: Borrowing,
  reservations: Reservation,
  movieRequests: MovieRequest,
  orders: Order,
  reviews: Review,
  wishlists: WishlistItem,
  notifications: Notification,
  contacts: ContactSubmission,
};

const CLEAR_ORDER = ['contacts', 'notifications', 'wishlists', 'reviews', 'orders', 'movieRequests', 'reservations', 'borrowings', 'products', 'movies', 'books', 'users'];

async function clearOne(name) {
  const Model = COLLECTIONS[name];
  if (!Model) throw new Error(`Unknown seed collection: ${name}`);
  const result = await Model.deleteMany({});
  return result.deletedCount;
}

async function clearAll() {
  const counts = {};
  for (const name of CLEAR_ORDER) counts[name] = await clearOne(name);
  return counts;
}

module.exports = { COLLECTIONS, CLEAR_ORDER, clearOne, clearAll };
