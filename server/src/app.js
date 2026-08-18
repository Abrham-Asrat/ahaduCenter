const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json());

// ── Static uploads ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Auth routes ───────────────────────────────────────────────────────────────
const authRouter = require('./routes/auth.routes');
app.use('/api/auth', authRouter);

// ── User routes ───────────────────────────────────────────────────────────────
const userRouter = require('./routes/user.routes');
app.use('/api/users', userRouter);

// ── Book routes ───────────────────────────────────────────────────────────────
const bookRouter = require('./routes/book.routes');
app.use('/api/books', bookRouter);

// ── Borrowing routes ──────────────────────────────────────────────────────────
const borrowingRouter = require('./routes/borrowing.routes');
app.use('/api/borrowings', borrowingRouter);

// ── Movie routes ──────────────────────────────────────────────────────────────
const movieRouter = require('./routes/movie.routes');
app.use('/api/movies', movieRouter);

// ── Movie-request routes ──────────────────────────────────────────────────────
const movieRequestRouter = require('./routes/movieRequest.routes');
app.use('/api/movie-requests', movieRequestRouter);

// ── Route stubs (return 501 until routes are implemented) ────────────────────
// These will be replaced by real routers as each task is implemented.
const stub = (name) => (_req, res) =>
  res.status(501).json({ error: `${name} not yet implemented` });
app.use('/api/products',       stub('products'));
app.use('/api/orders',         stub('orders'));
app.use('/api/search',         stub('search'));
app.use('/api/uploads',        stub('uploads'));
app.use('/api/contact',        stub('contact'));
app.use('/api/admin',          stub('admin'));
app.use('/api/notifications',  stub('notifications'));

// ── Global error handler (mounted last) ──────────────────────────────────────
const errorHandler = require('../middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
