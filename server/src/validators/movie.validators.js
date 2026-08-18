const { body, query } = require('express-validator');
const { paginationRules } = require('./common.validators');

/**
 * movieQueryRules
 *
 * Validation rules for GET /api/movies (list/search endpoint):
 *   - q     : optional search term, trimmed
 *   - genre : optional genre filter, trimmed
 *   - page  : optional integer >= 1  (from paginationRules)
 *   - limit : optional integer 1–100 (from paginationRules)
 */
const movieQueryRules = [
  query('q')
    .optional()
    .trim(),

  query('genre')
    .optional()
    .trim(),

  ...paginationRules,
];

/**
 * movieBodyRules
 *
 * Validation rules for admin create/update movie endpoints:
 *   POST   /api/admin/movies
 *   PUT    /api/admin/movies/:id
 *
 * Required fields:
 *   - title : non-empty string, trimmed
 *
 * Optional fields (validated for correct type when present):
 *   - year             : integer >= 0
 *   - country          : string
 *   - runtime          : string (e.g. "2h 15m")
 *   - quality          : string (e.g. "4K", "HD")
 *   - language         : string
 *   - genres           : array of strings
 *   - releaseDate      : string
 *   - posterUrl        : string
 *   - bannerUrl        : string
 *   - subtitles        : array of strings
 *   - director         : string
 *   - writers          : array of strings
 *   - studio           : string
 *   - trailerUrl       : string
 *   - trailerThumbnail : string
 *   - description      : string
 *   - cast             : array of { name, role, photoUrl } objects
 *   - screenshots      : array of strings (URLs)
 */
const movieBodyRules = [
  // --- Required fields ---
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('Title is required')
    .trim()
    .notEmpty()
    .withMessage('Title must not be empty'),

  // --- Optional numeric fields ---
  body('year')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Year must be a non-negative integer')
    .toInt(),

  // --- Optional string fields ---
  body('country')
    .optional()
    .isString()
    .withMessage('Country must be a string'),

  body('runtime')
    .optional()
    .isString()
    .withMessage('Runtime must be a string'),

  body('quality')
    .optional()
    .isString()
    .withMessage('Quality must be a string'),

  body('language')
    .optional()
    .isString()
    .withMessage('Language must be a string'),

  body('releaseDate')
    .optional()
    .isString()
    .withMessage('Release date must be a string'),

  body('posterUrl')
    .optional()
    .isString()
    .withMessage('Poster URL must be a string'),

  body('bannerUrl')
    .optional()
    .isString()
    .withMessage('Banner URL must be a string'),

  body('director')
    .optional()
    .isString()
    .withMessage('Director must be a string'),

  body('studio')
    .optional()
    .isString()
    .withMessage('Studio must be a string'),

  body('trailerUrl')
    .optional()
    .isString()
    .withMessage('Trailer URL must be a string'),

  body('trailerThumbnail')
    .optional()
    .isString()
    .withMessage('Trailer thumbnail must be a string'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  // --- Optional array fields ---
  body('genres')
    .optional()
    .isArray()
    .withMessage('Genres must be an array'),

  body('genres.*')
    .optional()
    .isString()
    .withMessage('Each genre must be a string'),

  body('subtitles')
    .optional()
    .isArray()
    .withMessage('Subtitles must be an array'),

  body('subtitles.*')
    .optional()
    .isString()
    .withMessage('Each subtitle must be a string'),

  body('writers')
    .optional()
    .isArray()
    .withMessage('Writers must be an array'),

  body('writers.*')
    .optional()
    .isString()
    .withMessage('Each writer must be a string'),

  body('screenshots')
    .optional()
    .isArray()
    .withMessage('Screenshots must be an array'),

  body('screenshots.*')
    .optional()
    .isString()
    .withMessage('Each screenshot must be a string'),

  // --- Cast array (nested objects) ---
  body('cast')
    .optional()
    .isArray()
    .withMessage('Cast must be an array'),

  body('cast.*.name')
    .optional()
    .isString()
    .withMessage('Cast member name must be a string')
    .notEmpty()
    .withMessage('Cast member name must not be empty'),

  body('cast.*.role')
    .optional()
    .isString()
    .withMessage('Cast member role must be a string'),

  body('cast.*.photoUrl')
    .optional()
    .isString()
    .withMessage('Cast member photo URL must be a string'),
];

/**
 * movieRequestRules
 *
 * Validation rules for POST /api/movie-requests:
 *   - title   : required, 1–200 characters, trimmed
 *   - type    : optional string (e.g. "Movie", "Series")
 *   - year    : optional integer >= 0
 *   - genre   : optional string
 *   - details : optional string
 */
const movieRequestRules = [
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('Title is required')
    .trim()
    .notEmpty()
    .withMessage('Title must not be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('type')
    .optional()
    .isString()
    .withMessage('Type must be a string'),

  body('year')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Year must be a non-negative integer')
    .toInt(),

  body('genre')
    .optional()
    .isString()
    .withMessage('Genre must be a string'),

  body('details')
    .optional()
    .isString()
    .withMessage('Details must be a string'),
];

module.exports = {
  movieQueryRules,
  movieBodyRules,
  movieRequestRules,
};
