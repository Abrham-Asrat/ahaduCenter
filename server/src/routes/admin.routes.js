'use strict';

/**
 * admin.routes.js
 *
 * All routes are protected by authenticate + requireRole('admin').
 *
 * Mounts at /api/admin
 */

const express = require('express');
const router  = express.Router();

// ── Middleware ────────────────────────────────────────────────────────────────
const authenticate  = require('../../middleware/authenticate');
const requireRole   = require('../../middleware/requireRole');
const validate      = require('../../middleware/validate');

// ── Validators ────────────────────────────────────────────────────────────────
const { objectIdParam, paginationRules } = require('../validators/common.validators');
const { bookBodyRules }                  = require('../validators/book.validators');
const { movieBodyRules }                 = require('../validators/movie.validators');
const { productBodyRules }               = require('../validators/product.validators');

// ── Controller ────────────────────────────────────────────────────────────────
const {
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
} = require('../controllers/admin.controller');

// ── Auth guards (applied to all routes below) ─────────────────────────────────
router.use(authenticate, requireRole('admin'));

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/stats',  getStats);
router.get('/recent', getRecent);

// ── Books ─────────────────────────────────────────────────────────────────────
router.get(   '/books',     paginationRules,                        validate, getAdminBooks);
router.post(  '/books',     bookBodyRules,                          validate, createBook);
router.put(   '/books/:id', objectIdParam('id'), bookBodyRules,     validate, updateBook);
router.delete('/books/:id', objectIdParam('id'),                    validate, deleteBook);

// ── Movies ────────────────────────────────────────────────────────────────────
router.get(   '/movies',     paginationRules,                        validate, getAdminMovies);
router.post(  '/movies',     movieBodyRules,                        validate, createMovie);
router.put(   '/movies/:id', objectIdParam('id'), movieBodyRules,   validate, updateMovie);
router.delete('/movies/:id', objectIdParam('id'),                   validate, deleteMovie);

// ── Products ──────────────────────────────────────────────────────────────────
router.get(   '/products',     paginationRules,                        validate, getAdminProducts);
router.post(  '/products',     productBodyRules,                      validate, createProduct);
router.put(   '/products/:id', objectIdParam('id'), productBodyRules, validate, updateProduct);
router.delete('/products/:id', objectIdParam('id'),                   validate, deleteProduct);

// ── Movie Requests ────────────────────────────────────────────────────────────
router.get(  '/movie-requests',             getAllMovieRequests);
router.patch('/movie-requests/:id/status',  objectIdParam('id'), validate, updateMovieRequestStatus);

// ── Contact Submissions ───────────────────────────────────────────────────────
router.get('/contacts', paginationRules, validate, getContactSubmissions);

module.exports = router;
