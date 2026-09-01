'use strict';

/**
 * movieRequest.controller.js
 *
 * Handles all movie-request endpoints.
 *
 * Requirements covered:
 *   7.1 — POST /api/movie-requests          (submitMovieRequest)
 *   7.2 — GET  /api/users/me/movie-requests (getUserMovieRequests)
 *   7.3 — DELETE /api/movie-requests/:id    (cancelMovieRequest)
 *   7.4 — 403 when request does not belong to user  (cancelMovieRequest)
 *   7.5 — 400 when status is not Pending            (cancelMovieRequest)
 *   7.6 — 404 when request does not exist           (cancelMovieRequest)
 *   7.7 — 400/422 when title is absent or empty     (submitMovieRequest)
 */

const MovieRequest = require('../models/MovieRequest.js');

// ── POST /api/movie-requests ──────────────────────────────────────────────────
// Requirements 7.1, 7.7
const submitMovieRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Trim title and reject if empty (Requirement 7.7)
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }

    // Optional fields
    const { type, year, genre, details } = req.body;

    // Create the MovieRequest record with status "Pending" (Requirement 7.1)
    const movieRequest = await MovieRequest.create({
      userId,
      title,
      ...(type    !== undefined && { type }),
      ...(year    !== undefined && { year }),
      ...(genre   !== undefined && { genre }),
      ...(details !== undefined && { details }),
      status: 'Pending',
    });

    return res.status(201).json(movieRequest);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/me/movie-requests ─────────────────────────────────────────
// Requirement 7.2
const getUserMovieRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all MovieRequests for this user — return empty array if none exist
    // (Requirement 7.2)
    const requests = await MovieRequest.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Map to the shape specified by Requirement 7.2
    const data = requests.map((r) => ({
      id:          r._id,
      title:       r.title,
      type:        r.type      ?? null,
      year:        r.year      ?? null,
      genre:       r.genre     ?? null,
      details:     r.details   ?? null,
      requestedAt: r.createdAt,
      status:      r.status,
    }));

    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/movie-requests/:id ────────────────────────────────────────────
// Requirements 7.3, 7.4, 7.5, 7.6
const cancelMovieRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const userId    = req.user.id;

    // Requirement 7.6 — 404 if the request does not exist
    const movieRequest = await MovieRequest.findById(requestId);
    if (!movieRequest) {
      return res.status(404).json({ error: 'Movie request not found' });
    }

    // Requirement 7.4 — 403 if the request does not belong to the requesting user
    if (movieRequest.userId.toString() !== userId) {
      return res.status(403).json({ error: 'You do not have permission to cancel this request' });
    }

    // Requirement 7.5 — 400 if status is not Pending
    if (movieRequest.status !== 'Pending') {
      return res
        .status(400)
        .json({ error: 'Only pending movie requests can be cancelled' });
    }

    // Delete the record (Requirement 7.3)
    await MovieRequest.findByIdAndDelete(requestId);

    return res.status(200).json({ message: 'Movie request cancelled successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitMovieRequest, getUserMovieRequests, cancelMovieRequest };
