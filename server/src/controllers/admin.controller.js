'use strict';

/**
 * admin.controller.js
 *
 * Handles all admin-only endpoints:
 *   - Dashboard stats & recent items
 *   - Book, Movie, Product CRUD
 *   - Movie request management
 *   - Contact submission listing
 */

const Book              = require('../models/Book.js');
const Movie             = require('../models/Movie.js');
const Product           = require('../models/Product.js');
const User              = require('../models/User.js');
const Order             = require('../models/Order.js');
const Borrowing         = require('../models/Borrowing.js');
const MovieRequest      = require('../models/MovieRequest.js');
const ContactSubmission = require('../models/ContactSubmission.js');
const { paginate }      = require('../../utils/paginate.js');
const { createNotification } = require('../services/notification.service.js');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getAdminBooks = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.q?.trim()) filter.$text = { $search: req.query.q.trim() };
    if (req.query.language?.trim()) {
      filter.language = new RegExp(`^${escapeRegex(req.query.language.trim())}$`, 'i');
    }
    return res.status(200).json(await paginate(Book, filter, {
      page: req.query.page,
      limit: req.query.limit,
      sort: { createdAt: -1 },
    }));
  } catch (err) {
    next(err);
  }
};

const getAdminMovies = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.q?.trim()) filter.$text = { $search: req.query.q.trim() };
    if (req.query.genre?.trim()) {
      filter.genres = { $elemMatch: { $regex: new RegExp(`^${escapeRegex(req.query.genre.trim())}$`, 'i') } };
    }
    return res.status(200).json(await paginate(Movie, filter, {
      page: req.query.page,
      limit: req.query.limit,
      sort: { createdAt: -1 },
    }));
  } catch (err) {
    next(err);
  }
};

const getAdminProducts = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.q?.trim()) filter.$text = { $search: req.query.q.trim() };
    if (req.query.category?.trim()) {
      filter.category = new RegExp(`^${escapeRegex(req.query.category.trim())}$`, 'i');
    }
    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      filter.price = {};
      if (req.query.minPrice !== undefined) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice !== undefined) filter.price.$lte = Number(req.query.maxPrice);
    }
    return res.status(200).json(await paginate(Product, filter, {
      page: req.query.page,
      limit: req.query.limit,
      sort: { createdAt: -1 },
    }));
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const [
      totalMovies,
      totalBooks,
      totalProducts,
      totalUsers,
      totalOrders,
      totalBorrowings,
    ] = await Promise.all([
      Movie.countDocuments(),
      Book.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Borrowing.countDocuments(),
    ]);

    return res.status(200).json({
      totalMovies,
      totalBooks,
      totalProducts,
      totalUsers,
      totalOrders,
      totalBorrowings,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/recent ─────────────────────────────────────────────────────
const getRecent = async (req, res, next) => {
  try {
    const [recentMovies, recentBooks, recentProducts] = await Promise.all([
      Movie.find().sort({ createdAt: -1 }).limit(5).select('_id title createdAt').lean(),
      Book.find().sort({ createdAt: -1 }).limit(5).select('_id title createdAt').lean(),
      Product.find().sort({ createdAt: -1 }).limit(5).select('_id name createdAt').lean(),
    ]);

    return res.status(200).json({ recentMovies, recentBooks, recentProducts });
  } catch (err) {
    next(err);
  }
};

// ── Book CRUD ─────────────────────────────────────────────────────────────────

const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    return res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.status(200).json({ message: 'Book deleted' });
  } catch (err) {
    next(err);
  }
};

// ── Movie CRUD ────────────────────────────────────────────────────────────────

const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    return res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    return res.status(200).json(movie);
  } catch (err) {
    next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    return res.status(200).json({ message: 'Movie deleted' });
  } catch (err) {
    next(err);
  }
};

// ── Product CRUD ──────────────────────────────────────────────────────────────

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

// ── Movie Requests ────────────────────────────────────────────────────────────

const VALID_REQUEST_STATUSES = ['Pending', 'Available', 'Fulfilled'];

const getAllMovieRequests = async (req, res, next) => {
  try {
    const requests = await MovieRequest.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

const updateMovieRequestStatus = async (req, res, next) => {
  try {
    const request = await MovieRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Movie request not found' });
    }

    const { status } = req.body;
    if (!VALID_REQUEST_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${VALID_REQUEST_STATUSES.join(', ')}`,
      });
    }

    request.status = status;
    await request.save();

    // Fire-and-forget notification to the requesting user
    try {
      await createNotification({
        userId:      request.userId,
        type:        'Movies',
        title:       'Movie Request Updated',
        description: `Your request for "${request.title}" is now ${status}.`,
      });
    } catch (notifErr) {
      console.error('[updateMovieRequestStatus] Notification failed:', notifErr.message);
    }

    return res.status(200).json(request);
  } catch (err) {
    next(err);
  }
};

// ── Contact Submissions ───────────────────────────────────────────────────────

const getContactSubmissions = async (req, res, next) => {
  try {
    const result = await paginate(
      ContactSubmission,
      {},
      {
        sort:  { createdAt: -1 },
        page:  req.query.page,
        limit: req.query.limit,
      }
    );
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getRecent,
  getAdminBooks,
  getAdminMovies,
  getAdminProducts,
  createBook,
  updateBook,
  deleteBook,
  createMovie,
  updateMovie,
  deleteMovie,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllMovieRequests,
  updateMovieRequestStatus,
  getContactSubmissions,
};
