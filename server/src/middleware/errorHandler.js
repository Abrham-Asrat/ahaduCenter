/**
 * Global Express error handler (4-argument signature required by Express).
 * Must be mounted LAST in app.js after all other middleware and routes.
 *
 * Handles known Mongoose / MongoDB error types with specific HTTP status codes:
 *   - mongoose ValidationError    -> 422 Unprocessable Entity
 *   - mongoose CastError          -> 400 Bad Request  (invalid ObjectId etc.)
 *   - MongoDB duplicate key 11000 -> 409 Conflict
 *   - All other errors            -> 500 Internal Server Error
 *
 * Stack traces are NEVER exposed in the response body.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  console.error('[errorHandler]', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({ error: 'Validation failed', errors });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for field '${err.path}'` });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] ?? 'field';
    return res.status(409).json({ error: `Duplicate value for '${field}'` });
  }

  return res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
