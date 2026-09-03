const { body, query } = require('express-validator');
const { paginationRules } = require('./common.validators');

/**
 * productQueryRules
 *
 * Validation rules for GET /api/products (list/search endpoint):
 *   - q        : optional search term, trimmed
 *   - category : optional category filter, trimmed
 *   - minPrice : optional minimum price, numeric >= 0
 *   - maxPrice : optional maximum price, numeric >= 0
 *   - page     : optional integer >= 1  (from paginationRules)
 *   - limit    : optional integer 1–100 (from paginationRules)
 */
const productQueryRules = [
  query('q')
    .optional()
    .trim(),

  query('category')
    .optional()
    .trim(),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a non-negative number')
    .toFloat(),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a non-negative number')
    .toFloat(),

  ...paginationRules,
];

/**
 * productBodyRules
 *
 * Validation rules for admin create/update product endpoints:
 *   POST   /api/admin/products
 *   PUT    /api/admin/products/:id
 *
 * Required fields:
 *   - name  : non-empty string, trimmed
 *   - price : number >= 0
 *
 * Optional fields (validated for correct type when present):
 *   - brand         : string, trimmed
 *   - category      : string, trimmed
 *   - condition     : one of 'New', 'Used', 'Refurbished'
 *   - images        : array of strings (URLs)
 *   - description   : string
 *   - highlights    : array of strings
 *   - originalPrice : number >= 0
 *   - discount      : number 0–100
 *   - inStock       : boolean
 */
const productBodyRules = [
  // --- Required fields ---
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name must not be empty'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number')
    .toFloat(),

  // --- Optional string fields ---
  body('brand')
    .optional()
    .trim()
    .isString()
    .withMessage('Brand must be a string'),

  body('category')
    .optional()
    .trim()
    .isString()
    .withMessage('Category must be a string'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  // --- Optional array fields ---
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),

  body('images.*')
    .optional()
    .isString()
    .withMessage('Each image must be a string URL'),

  body('highlights')
    .optional()
    .isArray()
    .withMessage('Highlights must be an array'),

  body('highlights.*')
    .optional()
    .isString()
    .withMessage('Each highlight must be a string'),

  // --- Optional numeric fields ---
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a non-negative number')
    .toFloat(),

  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be a number between 0 and 100')
    .toFloat(),

  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer')
    .toInt(),

  // --- Optional enum field ---
  body('condition')
    .optional()
    .isIn(['New', 'Used', 'Refurbished'])
    .withMessage('Condition must be one of: New, Used, Refurbished'),

  // --- Optional boolean field ---
  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean')
    .toBoolean(),
];

module.exports = {
  productQueryRules,
  productBodyRules,
  productCreateRules: [
    body('name').exists({ checkFalsy: true }).withMessage('Name is required'),
    body('price').exists({ checkNull: true }).withMessage('Price is required'),
    ...productBodyRules,
  ],
  productUpdateRules: productBodyRules,
};
