const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
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

// ── Product routes ────────────────────────────────────────────────────────────
const productRouter = require('./routes/product.routes');
app.use('/api/products', productRouter);

// ── Order routes ──────────────────────────────────────────────────────────────
const orderRouter = require('./routes/order.routes');
app.use('/api/orders', orderRouter);

// ── Notification routes ───────────────────────────────────────────────────────
const notificationRouter = require('./routes/notification.routes');
app.use('/api/notifications', notificationRouter);

// ── Search routes ─────────────────────────────────────────────────────────────
const searchRouter = require('./routes/search.routes');
app.use('/api/search', searchRouter);

// ── Route stubs (return 501 until routes are implemented) ────────────────────
// These will be replaced by real routers as each task is implemented.
const stub = (name) => (_req, res) =>
  res.status(501).json({ error: `${name} not yet implemented` });

// ── Upload routes ─────────────────────────────────────────────────────────────
const uploadRouter = require('./routes/upload.routes');
app.use('/api/uploads', uploadRouter);
// ── Contact routes ───────────────────────────────────────────────────────────
const contactRouter = require('./routes/contact.routes');
app.use('/api/contact', contactRouter);

// ── Admin routes ─────────────────────────────────────────────────────────────
const adminRouter = require('./routes/admin.routes');
app.use('/api/admin', adminRouter);

// ── Global error handler (mounted last) ──────────────────────────────────────
const errorHandler = require('../middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
