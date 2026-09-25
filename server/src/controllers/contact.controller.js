'use strict';

/**
 * contact.controller.js
 *
 * Handles contact form submission and admin listing endpoints.
 *
 * Requirements covered:
 *   13.1 — POST /api/contact          (submitContact)
 *   13.2 — GET  /api/admin/contacts   (listContacts — mounted via admin routes)
 */

const ContactSubmission = require('../models/ContactSubmission');
const { paginate }      = require('../utils/paginate');
const nodemailer        = require('nodemailer');

let transporter;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Requirement 13.1
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    await ContactSubmission.create({ name, email, subject, message });

    const recipient = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
    if (!recipient) {
      throw new Error('Contact email recipient is not configured');
    }

    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: recipient,
      replyTo: email,
      subject: `Contact form: ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        '',
        message,
      ].join('\n'),
    });

    return res.status(201).json({
      message: 'Message received. We will get back to you shortly.',
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/contacts ───────────────────────────────────────────────────
// Requirement 13.2
const listContacts = async (req, res, next) => {
  try {
    const result = await paginate(ContactSubmission, {}, {
      sort:  { createdAt: -1 },
      page:  req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContact, listContacts };
