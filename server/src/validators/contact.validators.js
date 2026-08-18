'use strict';

/**
 * contact.validators.js
 *
 * Validation rules for the contact form submission endpoint.
 *
 * Requirements covered:
 *   13.1 — POST /api/contact  (contactRules → 422 on failure)
 */

const { body } = require('express-validator');

/**
 * contactRules
 *
 * Validation rules for POST /api/contact:
 *   - name    : required, trimmed, non-empty
 *   - email   : required, valid email format
 *   - subject : required, trimmed, non-empty
 *   - message : required, trimmed, non-empty
 *
 * The `validate` middleware converts failures into a 422 response.
 */
const contactRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required'),
];

module.exports = { contactRules };
