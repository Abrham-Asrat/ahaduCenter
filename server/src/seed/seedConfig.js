'use strict';

/** Seed counts and environment-backed configuration for the CLI runner. */

const DEFAULT_COUNTS = {
  users: 12,
  books: 40,
  movies: 40,
  products: 30,
  borrowings: 60,
  movieRequests: 20,
  orders: 35,
  reviews: 80,
  wishlists: 10,
  notifications: 30,
  contacts: 10,
};

const RESOURCE_KEYS = Object.keys(DEFAULT_COUNTS);

function numberFrom(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function readCounts(cliCount) {
  return RESOURCE_KEYS.reduce((counts, resource) => {
    const envKey = `SEED_${resource.toUpperCase()}`;
    counts[resource] = numberFrom(cliCount ?? process.env[envKey], DEFAULT_COUNTS[resource]);
    return counts;
  }, {});
}

module.exports = { DEFAULT_COUNTS, RESOURCE_KEYS, readCounts };
