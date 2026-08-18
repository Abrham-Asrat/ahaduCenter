const { body } = require('express-validator');

/**
 * Validation rules for POST /api/auth/register
 * - email: valid format, normalised to lowercase
 * - password: 8–128 characters
 * - name: 1–100 characters, trimmed
 * All fields are required.
 */
const registerRules = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters'),

  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
];

/**
 * Validation rules for POST /api/auth/login
 * - email: presence check only
 * - password: presence check only
 */
const loginRules = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required'),

  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
];

/**
 * Validation rules for POST /api/auth/forgot-password
 * - email: presence check only
 */
const forgotPasswordRules = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required'),
];

/**
 * Validation rules for POST /api/auth/reset-password
 * - token: must be a non-empty string
 * - newPassword: 8–128 characters
 */
const resetPasswordRules = [
  body('token')
    .exists({ checkFalsy: true })
    .withMessage('Reset token is required')
    .isString()
    .withMessage('Reset token must be a string')
    .notEmpty()
    .withMessage('Reset token must not be empty'),

  body('newPassword')
    .exists({ checkFalsy: true })
    .withMessage('New password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters'),
];

module.exports = {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
};
