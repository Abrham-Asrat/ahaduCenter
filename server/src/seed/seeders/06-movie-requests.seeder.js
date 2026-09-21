'use strict';

/** Seeds movie requests mapped to the live Pending/Available/Fulfilled enum. */

const MovieRequest = require('../../models/MovieRequest');
const titles = require('../data/movieTitles.json');
const { randomInt, randomDateWithin } = require('../utils/random');

async function seedMovieRequests(ctx) {
  const statuses = ['Pending', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending', 'Pending', 'Available', 'Available', 'Available', 'Available', 'Available', 'Available', 'Available', 'Available', 'Available', 'Fulfilled', 'Fulfilled', 'Fulfilled'];
  const records = Array.from({ length: ctx.counts.movieRequests }, (_, index) => {
    const source = titles[index % titles.length];
    return {
      userId: ctx.users[index % ctx.users.length]._id,
      title: `${source[0]} Request`, type: 'Movie', year: randomInt(1980, 2025), genre: source[3],
      details: `Requested for the ${source[3].toLowerCase()} collection.`, status: statuses[index % statuses.length] || 'Pending',
      createdAt: randomDateWithin(180), updatedAt: new Date(),
    };
  });
  const requests = await MovieRequest.create(records);
  ctx.movieRequests = requests;
  return requests;
}

module.exports = seedMovieRequests;
