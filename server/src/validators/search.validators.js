'use strict';

/**
 * search.validators.js
 *
 * express-validator rules for the GET /api/search endpoint.
 */

const { query } = require('express-validator');
const { paginationRules } = require('./common.validators');

/**
 * searchQueryRules
 *
 * Validation chain for search query parameters.
 * Note: `q` presence/length validation is handled by the controller so that
 * it can return HTTP 400 (the validate middleware returns 422).  Here we only
 * trim it to normalise whitespace before the controller receives it.
 */
const searchQueryRules = [
  // q: trim only — controller enforces required / length
  query('q')
    .optional()
    .trim(),

  // type: must be one of the recognised content types
  query('type')
    .optional()
    .isIn(['movie', 'book', 'product'])
    .withMessage("type must be 'movie', 'book', or 'product'"),

  // minPrice: non-negative float
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a non-negative number')
    .toFloat(),

  // maxPrice: non-negative float
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a non-negative number')
    .toFloat(),

  // Spread shared pagination rules (page, limit)
  ...paginationRules,
];

module.exports = { searchQueryRules };
