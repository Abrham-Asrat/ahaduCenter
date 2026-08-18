'use strict';

/**
 * movie.controller.js
 *
 * Handles all /api/movies catalog endpoints.
 *
 * Requirements covered:
 *   6.1 — GET /api/movies            (listMovies) — paginated list
 *   6.2 — q text search              (listMovies)
 *   6.3 — genre array-contains filter(listMovies)
 *   6.4 — pagination                 (listMovies)
 *   6.5 — GET /api/movies/:id        (getMovie)  — full doc + related movies
 *   6.6 — 404 on missing movie       (getMovie)
 */

const Movie      = require('../../models/Movie');
const { paginate } = require('../../utils/paginate');

// ── GET /api/movies ─────────────────────────────────────────────────────────
// Requirements 6.1, 6.2, 6.3, 6.4
const listMovies = async (req, res, next) => {
  try {
    const { q, genre, page, limit } = req.query;

    // Build filter
    const filter = {};

    if (q && q.trim()) {
      // MongoDB text search on the compound text index (title, director)
      filter.$text = { $search: q.trim() };
    }

    if (genre && genre.trim()) {
      // Case-insensitive array-contains filter on genres field (Requirement 6.3)
      filter.genres = { $elemMatch: { $regex: new RegExp(`^${escapeRegex(genre.trim())}$`, 'i') } };
    }

    // Pagination options — defaults and bounds are enforced by movieQueryRules +
    // the paginate helper, but sensible defaults are applied here as well.
    const opts = {
      page:   page  || 1,
      limit:  limit || 20,
      sort:   { createdAt: -1 },
      select: 'title posterUrl year country runtime quality language genres rating reviewCount releaseDate',
    };

    const result = await paginate(Movie, filter, opts);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/movies/:id ──────────────────────────────────────────────────────
// Requirements 6.5, 6.6
const getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Populate related movies: share at least one genre, up to 10, exclude self
    // (Requirement 6.5)
    let relatedMovies = [];
    if (movie.genres && movie.genres.length > 0) {
      relatedMovies = await Movie.find({
        genres: { $in: movie.genres },
        _id:    { $ne: movie._id },
      })
        .limit(10)
        .select('title posterUrl year rating genres runtime language')
        .lean();
    }

    return res.status(200).json({
      ...movie,
      relatedMovies,
    });
  } catch (err) {
    next(err);
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Escapes special regex characters in a user-supplied string so it can be
 * safely embedded in a RegExp pattern without altering semantics.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { listMovies, getMovie };
