'use strict';

const express = require('express');
const router = express.Router();

const {
  registerRules,
  googleLoginRules,
  adminLoginRules,
  forgotPasswordRules,
  resetPasswordRules,
  verifyEmailRules,
  resendVerificationRules,
} = require('../validators/auth.validators');
const validate = require('../../middleware/validate');
const {
  register,
  googleLogin,
  adminLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} = require('../controllers/auth.controller');

// POST /api/auth/register
// Requirement 2.1, 2.2
router.post('/register', registerRules, validate, register);

// POST /api/auth/google
router.post('/google', googleLoginRules, validate, googleLogin);

// POST /api/auth/admin-login
router.post('/admin-login', adminLoginRules, validate, adminLogin);

// POST /api/auth/forgot-password
// Requirement 2.5, 2.6
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);

// POST /api/auth/reset-password
// Requirement 2.7, 2.8
router.post('/reset-password', resetPasswordRules, validate, resetPassword);

// GET /api/auth/verify-email?token=...
router.get('/verify-email', verifyEmailRules, validate, verifyEmail);

// POST /api/auth/resend-verification
router.post('/resend-verification', resendVerificationRules, validate, resendVerification);

module.exports = router;
