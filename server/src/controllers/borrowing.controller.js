'use strict';

/**
 * borrowing.controller.js
 *
 * Handles all borrowing-related endpoints.
 *
 * Requirements covered:
 *   5.1  — POST /api/books/:id/borrow       (borrowBook)
 *   5.2  — 409 when availableCopies === 0   (borrowBook)
 *   5.4  — GET  /api/users/me/borrowings    (getBorrowingHistory)
 *   5.5  — POST /api/borrowings/:id/renew   (renewBorrowing)
 *   5.6  — 400 when renewalsLeft === 0      (renewBorrowing)
 *   5.7  — POST /api/borrowings/:id/return  (returnBook)
 *   5.8  — Overdue-on-read with fee calc    (getBorrowingHistory + resolveOverdue)
 *   5.10 — 409 when user already has active borrowing for same book (borrowBook)
 *   12.8 — createNotification side-effect on borrow (borrowBook)
 */

const Book      = require('../models/Book.js');
const Borrowing = require('../models/Borrowing.js');
const { calculateOverdueFee } = require('../../utils/overdue.js');

// Notification service (Requirement 12.8)
const { createNotification } = require('../services/notification.service.js');

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Checks a single Borrowing record for overdue status and, if found, updates
 * the document in-place (sets status to "Overdue", computes fee, saves).
 * Returns the (possibly mutated and saved) document.
 *
 * @param {import('mongoose').Document} borrowing - A Mongoose Borrowing document
 * @returns {Promise<import('mongoose').Document>}
 */
async function resolveOverdue(borrowing) {
  if (borrowing.status === 'Active' && borrowing.dueDate < new Date()) {
    borrowing.status = 'Overdue';
    borrowing.fee    = calculateOverdueFee(borrowing.dueDate);
    await borrowing.save();
  }
  return borrowing;
}

// ── POST /api/books/:id/borrow ────────────────────────────────────────────────
// Requirements 5.1, 5.2, 5.10, 12.8
const borrowBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;

    // Fetch the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Requirement 5.2 — no copies available
    if (book.availableCopies <= 0) {
      return res.status(409).json({ error: 'No copies are currently available for borrowing' });
    }

    // Requirement 5.10 — user already has an active borrowing for this book
    const existing = await Borrowing.findOne({
      userId,
      bookId,
      status: { $in: ['Active', 'Overdue'] },
    });
    if (existing) {
      return res.status(409).json({ error: 'You already have an active borrowing for this book' });
    }

    // Calculate due date: today + 14 days (Requirement 5.1)
    const borrowDate = new Date();
    const dueDate    = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);

    // Create the Borrowing record (Requirement 5.1)
    const borrowing = await Borrowing.create({
      userId,
      bookId,
      borrowDate,
      dueDate,
      status:       'Active',
      renewalsLeft: 2,
      fee:          0,
    });

    // Decrement availableCopies atomically (Requirement 5.1)
    await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: -1 } });

    // Fire-and-forget notification — failure MUST NOT roll back the borrow
    // (Requirements 12.8, 12.9)
    try {
      await createNotification({
        userId,
        type:        'Books',
        title:       'Book Borrowed',
        description: `You have borrowed "${book.title}". It is due on ${dueDate.toDateString()}.`,
      });
    } catch (notifErr) {
      console.error('[borrowBook] Notification creation failed:', notifErr.message);
    }

    return res.status(201).json(borrowing);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/borrowings/:id/return ──────────────────────────────────────────
// Requirement 5.7
const returnBook = async (req, res, next) => {
  try {
    const borrowingId = req.params.id;
    const userId      = req.user.id;

    const borrowing = await Borrowing.findById(borrowingId);

    if (!borrowing) {
      return res.status(404).json({ error: 'Borrowing record not found' });
    }

    // Ensure the borrowing belongs to the requesting user
    if (borrowing.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Only Active or Overdue borrowings can be returned (Requirement 5.7)
    if (borrowing.status !== 'Active' && borrowing.status !== 'Overdue') {
      return res.status(400).json({ error: 'Only active or overdue borrowings can be returned' });
    }

    // Resolve overdue before marking returned (keeps fee accurate)
    await resolveOverdue(borrowing);

    borrowing.status     = 'Returned';
    borrowing.returnDate = new Date();
    await borrowing.save();

    // Increment availableCopies atomically (Requirement 5.7)
    await Book.findByIdAndUpdate(borrowing.bookId, { $inc: { availableCopies: 1 } });

    return res.status(200).json(borrowing);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/borrowings/:id/renew ────────────────────────────────────────────
// Requirements 5.5, 5.6
const renewBorrowing = async (req, res, next) => {
  try {
    const borrowingId = req.params.id;
    const userId      = req.user.id;

    const borrowing = await Borrowing.findById(borrowingId);

    if (!borrowing) {
      return res.status(404).json({ error: 'Borrowing record not found' });
    }

    // Ensure the borrowing belongs to the requesting user
    if (borrowing.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Requirement 5.6 — cannot renew when renewalsLeft is 0
    if (borrowing.renewalsLeft <= 0) {
      return res.status(400).json({ error: 'No renewals remaining for this borrowing' });
    }

    // Must be Active to renew (Requirement 5.5)
    if (borrowing.status !== 'Active') {
      return res.status(400).json({ error: 'Only active borrowings can be renewed' });
    }

    // Extend dueDate by 14 days and decrement renewalsLeft (Requirement 5.5)
    const newDueDate = new Date(borrowing.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);

    borrowing.dueDate      = newDueDate;
    borrowing.renewalsLeft = borrowing.renewalsLeft - 1;
    await borrowing.save();

    return res.status(200).json(borrowing);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/me/borrowings ──────────────────────────────────────────────
// Requirements 5.4, 5.8
const getBorrowingHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all Borrowings for this user, populating book fields required by
    // the frontend (Requirement 5.4: title, author, coverUrl)
    const borrowings = await Borrowing.find({ userId })
      .populate('bookId', 'title author coverUrl')
      .sort({ createdAt: -1 })
      .lean(false); // need full Mongoose docs so we can save() overdue records

    // Resolve overdue-on-read for every still-Active record that is past its
    // due date (Requirement 5.8)
    const resolved = await Promise.all(borrowings.map(resolveOverdue));

    // Transform the populated documents into the shape expected by the client
    // (Requirement 5.4)
    const data = resolved.map((b) => ({
      _id:         b._id,
      bookId:      b.bookId?._id ?? b.bookId,
      title:       b.bookId?.title  ?? null,
      author:      b.bookId?.author ?? null,
      coverUrl:    b.bookId?.coverUrl ?? null,
      borrowDate:  b.borrowDate,
      dueDate:     b.dueDate,
      returnDate:  b.returnDate,
      status:      b.status,
      renewalsLeft:b.renewalsLeft,
      fee:         b.fee,
    }));

    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { borrowBook, returnBook, renewBorrowing, getBorrowingHistory };
