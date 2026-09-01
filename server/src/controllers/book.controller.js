'use strict';

/**
 * book.controller.js
 *
 * Handles all /api/books endpoints.
 *
 * Requirements covered:
 *   4.1 — GET /api/books         (listBooks)
 *   4.2 — q text search          (listBooks)
 *   4.3 — language filter         (listBooks)
 *   4.4 — pagination              (listBooks)
 *   4.5 — GET /api/books/:id      (getBook)  — full doc + related books
 *   4.6 — 404 on missing book     (getBook)
 *   4.7 — 400 on invalid page/limit (via paginationRules + validate middleware)
 *   5.4 — POST /api/books/:id/reserve (reserveBook)
 */

const Book       = require('../models/Book.js');
const Reservation = require('../models/Reservation.js');
const { paginate } = require('../../utils/paginate.js');

// ── GET /api/books ─────────────────────────────────────────────────────────────
// Requirements 4.1, 4.2, 4.3, 4.4
const listBooks = async (req, res, next) => {
  try {
    const { q, language, page, limit } = req.query;

    // Build filter
    const filter = {};

    if (q && q.trim()) {
      // MongoDB text search on the compound text index (title, author, isbn)
      filter.$text = { $search: q.trim() };
    }

    if (language && language.trim()) {
      // Case-insensitive language match (Requirement 4.3)
      filter.language = { $regex: new RegExp(`^${escapeRegex(language.trim())}$`, 'i') };
    }

    // Pagination options — defaults and bounds are enforced by paginationRules +
    // the paginate helper itself, but we apply sensible defaults here too.
    const opts = {
      page:   page  || 1,
      limit:  limit || 20,
      sort:   { createdAt: -1 },
      select: 'title author publisher year isbn rating reviewCount availableCopies coverUrl availability format language price category',
    };

    const result = await paginate(Book, filter, opts);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/books/:id ────────────────────────────────────────────────────────
// Requirements 4.5, 4.6
const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).lean();

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Populate related books: same category, up to 10, excluding this book
    // (Requirement 4.5)
    let relatedBooks = [];
    if (book.category) {
      relatedBooks = await Book.find({
        category: book.category,
        _id:      { $ne: book._id },
      })
        .limit(10)
        .select('title author coverUrl rating availability language category')
        .lean();
    }

    return res.status(200).json({
      ...book,
      relatedBooks,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/books/:id/reserve ────────────────────────────────────────────────
// Requirement 5.3 / Task 5.4
const reserveBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;

    // Verify the book exists (404 if not)
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const reservation = await Reservation.create({
      userId,
      bookId,
      status:          'Reserved',
      reservationDate: new Date(),
    });

    return res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Escapes special regex characters in a user-supplied string so it can be
 * safely embedded in a RegExp pattern without altering semantics.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { listBooks, getBook, reserveBook };
