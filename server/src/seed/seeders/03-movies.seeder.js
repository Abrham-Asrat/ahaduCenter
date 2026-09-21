'use strict';

/** Seeds movies with searchable metadata and embedded cast members. */

const Movie = require('../../models/Movie');
const titles = require('../data/movieTitles.json');
const { randomInt, pick, randomDateWithin, slugify } = require('../utils/random');

async function seedMovies(ctx) {
  const records = Array.from({ length: ctx.counts.movies }, (_, index) => {
    const [title, director, country, genre, language] = titles[index % titles.length];
    const actualTitle = `${title}${index >= titles.length ? ` Collection ${Math.floor(index / titles.length) + 1}` : ''}`;
    return {
      title: actualTitle, director, country, language,
      year: randomInt(1980, 2024), runtime: `${randomInt(1, 2)}h ${randomInt(5, 59)}m`,
      quality: pick(['HD', '4K']), genres: [genre, pick(['Drama', 'Adventure', 'Biography', 'Thriller'])],
      description: `${actualTitle} is a curated ${genre.toLowerCase()} film selected for the Ahadu Center cinema catalog.`,
      posterUrl: `https://picsum.photos/seed/movie-${slugify(actualTitle)}-${index}/400/600`,
      bannerUrl: `https://picsum.photos/seed/movie-banner-${index}/1200/500`,
      trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      trailerThumbnail: `https://picsum.photos/seed/movie-trailer-${index}/640/360`,
      cast: [
        { name: `${pick(['Marta', 'Dawit', 'Sara', 'Yonas'])} ${pick(['Kebede', 'Tesfaye', 'Alemu'])}`, role: 'Lead' },
        { name: `${pick(['Liya', 'Samuel', 'Hana', 'Kalkidan'])} ${pick(['Abebe', 'Mamo', 'Bekele'])}`, role: 'Supporting' },
        { name: `${pick(['Nati', 'Ruth', 'Mekdes', 'Tadesse'])} ${pick(['Gebre', 'Kassa', 'Hailu'])}`, role: 'Supporting' },
      ],
      rating: Math.round((3 + Math.random() * 2) * 10) / 10,
      reviewCount: randomInt(10, 5000), createdAt: randomDateWithin(365), updatedAt: new Date(),
    };
  });
  const movies = await Movie.create(records);
  ctx.movies = movies;
  return movies;
}

module.exports = seedMovies;
