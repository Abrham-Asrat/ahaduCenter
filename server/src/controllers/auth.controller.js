'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/User.js');
const { sign } = require('../../utils/jwt.js');

// ── Nodemailer transporter (lazy-created so env vars are available at runtime)
let _transporter = null;
function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return _transporter;
}

// ── POST /api/auth/register ────────────────────────────────────────────────────
// Requirement 2.1, 2.2, 2.9, 2.10
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check for duplicate email (Requirement 2.2)
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // Hash password — never store plaintext (Requirement 2.9)
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with default role "user"
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    // Sign JWT with { id, role }, 24h expiry (Requirement 2.10)
    const token = sign({ id: user._id.toString(), role: user.role });

    return res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────────
// Requirement 2.3, 2.4
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Sign JWT (Requirement 2.10)
    const token = sign({ id: user._id.toString(), role: user.role });

    // Respond with token + user fields (Requirement 2.3)
    return res.status(200).json({
      token,
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/forgot-password ────────────────────────────────────────────
// Requirement 2.5, 2.6
const forgotPassword = async (req, res, next) => {
  // Always respond with the same message regardless of whether the email exists.
  // This prevents user enumeration (Requirement 2.6).
  const CONSTANT_RESPONSE = { message: 'Reset instructions sent' };

  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      // Generate cryptographically random token (Requirement 2.5)
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      user.resetToken = resetToken;
      user.resetTokenExpiresAt = resetTokenExpiresAt;
      await user.save();

      // Send email (best-effort; failures should not change the HTTP response)
      try {
        const transporter = getTransporter();
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'AhaduCenter — Password Reset',
          text: [
            'You requested a password reset for your AhaduCenter account.',
            '',
            `Your reset token is: ${resetToken}`,
            '',
            'This token expires in 1 hour.',
            '',
            'If you did not request this, please ignore this email.',
          ].join('\n'),
        });
      } catch (mailErr) {
        // Log but do not expose or propagate email errors
        console.error('[forgotPassword] Email send failed:', mailErr.message);
      }
    }

    // Always respond with 200 and the constant message (Requirement 2.5 & 2.6)
    return res.status(200).json(CONSTANT_RESPONSE);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/reset-password ─────────────────────────────────────────────
// Requirement 2.7, 2.8, 2.9
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Find user whose resetToken matches and has not expired (Requirement 2.7)
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      // Token is invalid or expired (Requirement 2.8)
      return res
        .status(400)
        .json({ error: 'Reset token is invalid or has expired' });
    }

    // Hash new password — never store plaintext (Requirement 2.9)
    user.passwordHash = await bcrypt.hash(newPassword, 12);

    // Invalidate token fields
    user.resetToken = null;
    user.resetTokenExpiresAt = null;

    await user.save();

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
