'use strict';

const express = require('express');
const router = express.Router();

const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
} = require('../validators/auth.validators');
const validate = require('../../middleware/validate');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

// POST /api/auth/register
// Requirement 2.1, 2.2
router.post('/register', registerRules, validate, register);

// POST /api/auth/login
// Requirement 2.3, 2.4
router.post('/login', loginRules, validate, login);

// POST /api/auth/forgot-password
// Requirement 2.5, 2.6
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);

// POST /api/auth/reset-password
// Requirement 2.7, 2.8
router.post('/reset-password', resetPasswordRules, validate, resetPassword);

module.exports = router;
