'use strict';

/** Small deterministic-shape random helpers used by all seeders. */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(values) {
  return values[randomInt(0, values.length - 1)];
}

function randomDateWithin(days) {
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;
  return new Date(randomInt(start, end));
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

module.exports = { randomInt, pick, randomDateWithin, slugify };
