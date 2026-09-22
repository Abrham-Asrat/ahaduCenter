'use strict';

/**
 * Production-safe seed runner.
 * Usage: node src/seed/index.js [--fresh|--clear] [--only=users,books] [--count=N] [--force]
 */

const path = require('node:path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { RESOURCE_KEYS, readCounts } = require('./seedConfig');
const { COLLECTIONS, clearAll } = require('./clear');
const { log, success, warn, error } = require('./utils/logger');
const seedUsers = require('./seeders/01-users.seeder');
const seedBooks = require('./seeders/02-books.seeder');
const seedMovies = require('./seeders/03-movies.seeder');
const seedProducts = require('./seeders/04-products.seeder');
const seedBorrowings = require('./seeders/05-borrowings.seeder');
const seedMovieRequests = require('./seeders/06-movie-requests.seeder');
const seedOrders = require('./seeders/07-orders.seeder');
const seedReviews = require('./seeders/08-reviews.seeder');
const seedWishlists = require('./seeders/09-wishlists.seeder');
const seedNotifications = require('./seeders/10-notifications.seeder');
const seedContacts = require('./seeders/11-contacts.seeder');

const SEEDERS = [
  ['users', seedUsers], ['books', seedBooks], ['movies', seedMovies], ['products', seedProducts],
  ['borrowings', seedBorrowings], ['movieRequests', seedMovieRequests], ['orders', seedOrders],
  ['reviews', seedReviews], ['wishlists', seedWishlists], ['notifications', seedNotifications], ['contacts', seedContacts],
];

function parseArgs(argv) {
  const options = { fresh: false, clear: false, force: false, only: null, count: null };
  for (const arg of argv) {
    if (arg === '--fresh') options.fresh = true;
    else if (arg === '--clear') options.clear = true;
    else if (arg === '--force') options.force = true;
    else if (arg.startsWith('--only=')) options.only = arg.slice(7).split(',').filter(Boolean);
    else if (arg.startsWith('--count=')) options.count = arg.slice(8);
    else if (arg) throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function normalizeOnly(only) {
  if (!only) return RESOURCE_KEYS;
  const aliases = { 'movie-requests': 'movieRequests', 'movieRequests': 'movieRequests', wishlist: 'wishlists', notification: 'notifications', contact: 'contacts' };
  const normalized = only.map((name) => aliases[name] || name);
  const invalid = normalized.filter((name) => !RESOURCE_KEYS.includes(name));
  if (invalid.length) throw new Error(`Unknown --only resource(s): ${invalid.join(', ')}`);
  return normalized;
}

async function collectionHasData(resource) {
  const Model = COLLECTIONS[resource];
  return (await Model.estimatedDocumentCount()) > 0;
}

function assertDependencies(resource, ctx) {
  const requirements = {
    books: ['users'], movies: ['users'], products: ['users'], borrowings: ['users', 'books'],
    movieRequests: ['users'], orders: ['users', 'products'], reviews: ['users', 'books', 'movies'],
    wishlists: ['users', 'books', 'movies', 'products'], notifications: ['users'], contacts: [],
  };
  for (const dependency of requirements[resource] || []) {
    if (!ctx[dependency]?.length) throw new Error(`Cannot seed ${resource}: seed ${dependency} first or include it in --only.`);
  }
}

async function printSummary() {
  console.log('\nCollection       Count');
  console.log('----------------------');
  for (const [resource] of SEEDERS) {
    const count = await COLLECTIONS[resource].estimatedDocumentCount();
    console.log(`${resource.padEnd(16)} ${count}`);
  }
  const reservations = await COLLECTIONS.reservations.estimatedDocumentCount();
  console.log(`${'reservations'.padEnd(16)} ${reservations}`);
}

async function run() {
  const options = parseArgs(process.argv.slice(2));
  if (process.env.NODE_ENV === 'production' && !options.force) {
    throw new Error('⛔ Refusing to seed in production without --force.');
  }

  const counts = readCounts(options.count);
  const selected = normalizeOnly(options.only);
  const ctx = { counts, users: [], books: [], movies: [], products: [] };
  const uri = process.env.MONGO_SEED_URI || process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_SEED_URI or MONGO_URI is required.');

  log(`Connecting to seed database ${uri.replace(/\/\/.*@/, '//***@')}`);
  await mongoose.connect(uri);

  if (options.fresh || options.clear) {
    const cleared = await clearAll();
    success(`Cleared collections: ${JSON.stringify(cleared)}`);
  }
  if (options.clear) return;

  for (const [resource, seeder] of SEEDERS) {
    if (!selected.includes(resource)) continue;
    if (!options.fresh && await collectionHasData(resource)) {
      warn(`Skipping ${resource}: collection already contains data.`);
      const Model = COLLECTIONS[resource];
      ctx[resource] = await Model.find({}).limit(counts[resource]).exec();
      continue;
    }
    assertDependencies(resource, ctx);
    try {
      const inserted = await seeder(ctx);
      success(`Seeded ${resource}: ${inserted.length}`);
    } catch (seedError) {
      error(`Seeder failed for ${resource}: ${seedError.message}`);
      throw seedError;
    }
  }

  await printSummary();
  log('Admin credentials: admin@ahadu.test / Admin@123');
  log('Demo credentials: demo@ahadu.test / Demo@123');
  warn('The requested staff account was not created because User.role only permits user/admin.');
}

run()
  .then(() => { success('Seed complete.'); process.exitCode = 0; })
  .catch((seedError) => { error(seedError.message); process.exitCode = 1; })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
