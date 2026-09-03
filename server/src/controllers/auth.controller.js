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

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const sendVerificationEmail = async (user, token) => {
  const clientUrl = process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const verificationUrl = `${clientUrl.replace(/\/$/, '')}/verify-email?token=${encodeURIComponent(token)}`;
  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'AhaduCenter — Verify your email',
    text: [
      `Hello ${user.name},`,
      '',
      'Please verify your AhaduCenter email address by opening this link:',
      verificationUrl,
      '',
      'This link expires in 24 hours and can only be used once.',
    ].join('\n'),
  });
};

const createVerificationToken = () => crypto.randomBytes(32).toString('hex');

const applyVerificationToken = (user) => {
  const token = createVerificationToken();
  user.verificationTokenHash = hashToken(token);
  user.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
};

const verifyGoogleCredential = async (credential) => {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  if (!response.ok) return null;
  const payload = await response.json();
  if (payload.aud !== process.env.GOOGLE_CLIENT_ID || payload.iss !== 'https://accounts.google.com') return null;
  return payload;
};

// ── POST /api/auth/register ────────────────────────────────────────────────────
// Requirement 2.1, 2.2, 2.9, 2.10
const register = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Check for duplicate email (Requirement 2.2)
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // Create user with default role "user"
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      emailVerified: false,
    });

    const verificationToken = applyVerificationToken(user);
    await user.save();

    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (mailErr) {
      console.error('[register] Verification email send failed:', mailErr.message);
    }

    return res.status(201).json({
      message: 'Registration successful. Please verify your email before logging in.',
      verificationRequired: true,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/google ─────────────────────────────────────────────────────
const googleLogin = async (req, res, next) => {
  try {
    const payload = await verifyGoogleCredential(req.body.credential);
    const email = payload?.email?.toLowerCase().trim();

    if (!email || !payload.email_verified) {
      return res.status(401).json({ error: 'Google account email is not verified' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Please register your email before signing in with Google' });
    }
    if (user.emailVerified === false) {
      return res.status(403).json({
        error: 'Please verify your email before logging in',
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email,
      });
    }

    const token = sign({ id: user._id.toString(), role: user.role });
    return res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/admin-login ───────────────────────────────────────────────
const adminLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email.toLowerCase().trim(),
      role: 'admin',
    });

    if (!user || !user.passwordHash || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = sign({ id: user._id.toString(), role: user.role });
    return res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
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
      role: 'admin',
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

// ── GET /api/auth/verify-email ───────────────────────────────────────────────
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({
      verificationTokenHash: hashToken(token),
      verificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Verification token is invalid or has expired' });
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.verificationTokenHash = null;
    user.verificationTokenExpiresAt = null;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/resend-verification ───────────────────────────────────────
const resendVerification = async (req, res, next) => {
  const response = { message: 'If an account requires verification, a new email has been sent.' };

  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
    if (!user || user.emailVerified !== false) {
      return res.status(200).json(response);
    }

    const verificationToken = applyVerificationToken(user);
    await user.save();

    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (mailErr) {
      console.error('[resendVerification] Verification email send failed:', mailErr.message);
    }

    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  googleLogin,
  adminLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
};
