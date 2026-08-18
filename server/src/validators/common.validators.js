const { param, query } = require('express-validator');
const mongoose = require('mongoose');

/**
 * objectIdParam(field)
 *
 * Factory that returns a single express-validator rule validating that the
 * named route *parameter* is a valid MongoDB ObjectId.  Returns HTTP 400 via
 * the `validate` middleware when the value is invalid.
 *
 * Usage:
 *   router.get('/:id', objectIdParam('id'), validate, controller)
 *
 * @param {string} field - The name of the route parameter to validate.
 * @returns {import('express-validator').ValidationChain}
 */
const objectIdParam = (field) =>
  param(field)
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(`${field} must be a valid ObjectId`);
      }
      return true;
    });

/**
 * paginationRules
 *
 * A reusable array of express-validator rules for the `page` and `limit`
 * query parameters that are shared across all paginated list endpoints:
 *
 *   - page  : optional integer >= 1  (defaults handled by controllers)
 *   - limit : optional integer 1–100 (defaults handled by controllers)
 *
 * Returns HTTP 400 (via validate middleware) when either value is out of range
 * or non-integer.
 */
const paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be an integer >= 1')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100')
    .toInt(),
];

module.exports = {
  objectIdParam,
  paginationRules,
};
