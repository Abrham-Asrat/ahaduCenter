const { body } = require('express-validator');
const mongoose = require('mongoose');

/**
 * orderBodyRules
 *
 * Validation rules for POST /api/orders (place order endpoint):
 *
 * Required fields:
 *   - items : non-empty array of order items
 *
 * Each item in the array must have:
 *   - productId : valid MongoDB ObjectId (references a Product document)
 *   - quantity  : integer between 1 and 99 (inclusive)
 *
 * Validates: Requirements 9.1, 9.2
 */
const orderBodyRules = [
  // Validate that 'items' is present and is a non-empty array
  body('items')
    .exists({ checkNull: true })
    .withMessage('items is required')
    .isArray({ min: 1 })
    .withMessage('items must be a non-empty array'),

  // Validate each item's productId is a valid ObjectId
  body('items.*.productId')
    .exists({ checkNull: true })
    .withMessage('Each item must have a productId')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Each item productId must be a valid ObjectId');
      }
      return true;
    }),

  // Validate each item's quantity is an integer between 1 and 99
  body('items.*.quantity')
    .exists({ checkNull: true })
    .withMessage('Each item must have a quantity')
    .isInt({ min: 1, max: 99 })
    .withMessage('Each item quantity must be an integer between 1 and 99')
    .toInt(),
];

module.exports = {
  orderBodyRules,
};
