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

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Requirement 13.1
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    await ContactSubmission.create({ name, email, subject, message });

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
