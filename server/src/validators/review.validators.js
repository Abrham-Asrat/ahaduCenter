const { body } = require('express-validator');

/**
 * reviewRules
 *
 * Validation rules for POST /api/books/:id/reviews and
 * POST /api/movies/:id/reviews (submit review endpoints):
 *
 * Required fields:
 *   - rating  : integer between 1 and 5 (inclusive)
 *   - comment : string of 1–2000 characters (trimmed)
 *
 * Validates: Requirements 10.3, 10.4, 10.5
 */
const reviewRules = [
  // Validate that 'rating' is present and is an integer between 1 and 5
  body('rating')
    .exists({ checkNull: true })
    .withMessage('rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('rating must be an integer between 1 and 5')
    .toInt(),

  // Validate that 'comment' is present, trimmed, and between 1–2000 characters
  body('comment')
    .exists({ checkNull: true })
    .withMessage('comment is required')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('comment must be between 1 and 2000 characters'),
];

module.exports = {
  reviewRules,
};
