const { body, query } = require('express-validator');
const { paginationRules } = require('./common.validators');

/**
 * bookQueryRules
 *
 * Validation rules for GET /api/books (list/search endpoint):
 *   - q        : optional search term, trimmed
 *   - language : optional language filter, trimmed
 *   - page     : optional integer >= 1  (from paginationRules)
 *   - limit    : optional integer 1–100 (from paginationRules)
 */
const bookQueryRules = [
  query('q')
    .optional()
    .trim(),

  query('language')
    .optional()
    .trim(),

  ...paginationRules,
];

/**
 * bookBodyRules
 *
 * Validation rules for admin create/update book endpoints:
 *   POST   /api/admin/books
 *   PUT    /api/admin/books/:id
 *
 * Required fields:
 *   - title  : non-empty string, trimmed
 *   - author : non-empty string, trimmed
 *
 * Optional fields (validated for correct type when present):
 *   - publisher       : string, trimmed
 *   - year            : integer >= 0
 *   - isbn            : string, trimmed
 *   - description     : string, trimmed
 *   - pages           : integer >= 1
 *   - publicationDate : string
 *   - dimensions      : string
 *   - about           : string
 *   - authorInfo      : string
 *   - borrowingPolicy : string
 *   - location        : string
 *   - coverUrl        : string (URL)
 *   - availability    : one of 'Available', 'Borrowed', 'Reserved'
 *   - availableCopies : integer >= 0
 *   - totalCopies     : integer >= 1
 *   - format          : string (e.g. 'Hardcover', 'Paperback')
 *   - language        : string, trimmed
 *   - price           : number >= 0
 *   - category        : string, trimmed
 */
const bookBodyRules = [
  // --- Required fields ---
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('Title is required')
    .trim()
    .notEmpty()
    .withMessage('Title must not be empty'),

  body('author')
    .exists({ checkFalsy: true })
    .withMessage('Author is required')
    .trim()
    .notEmpty()
    .withMessage('Author must not be empty'),

  // --- Optional string fields ---
  body('publisher')
    .optional()
    .trim()
    .isString()
    .withMessage('Publisher must be a string'),

  body('isbn')
    .optional()
    .trim()
    .isString()
    .withMessage('ISBN must be a string'),

  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),

  body('publicationDate')
    .optional()
    .isString()
    .withMessage('Publication date must be a string'),

  body('dimensions')
    .optional()
    .isString()
    .withMessage('Dimensions must be a string'),

  body('about')
    .optional()
    .isString()
    .withMessage('About must be a string'),

  body('authorInfo')
    .optional()
    .isString()
    .withMessage('Author info must be a string'),

  body('borrowingPolicy')
    .optional()
    .isString()
    .withMessage('Borrowing policy must be a string'),

  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),

  body('coverUrl')
    .optional()
    .isString()
    .withMessage('Cover URL must be a string'),

  body('format')
    .optional()
    .isString()
    .withMessage('Format must be a string'),

  body('language')
    .optional()
    .trim()
    .isString()
    .withMessage('Language must be a string'),

  body('category')
    .optional()
    .trim()
    .isString()
    .withMessage('Category must be a string'),

  // --- Optional numeric fields ---
  body('year')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Year must be a non-negative integer')
    .toInt(),

  body('pages')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Pages must be a positive integer')
    .toInt(),

  body('availableCopies')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available copies must be a non-negative integer')
    .toInt(),

  body('totalCopies')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total copies must be a positive integer')
    .toInt(),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number')
    .toFloat(),

  // --- Optional enum field ---
  body('availability')
    .optional()
    .isIn(['Available', 'Borrowed', 'Reserved'])
    .withMessage('Availability must be one of: Available, Borrowed, Reserved'),
];

module.exports = {
  bookQueryRules,
  bookBodyRules,
};
