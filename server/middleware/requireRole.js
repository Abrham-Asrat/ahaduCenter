/**
 * requireRole factory middleware.
 * Returns a middleware that checks `req.user.role` against the required role.
 * Returns HTTP 403 if the role does not match.
 *
 * Usage: router.post('/admin/books', authenticate, requireRole('admin'), controller)
 *
 * @param {string} role - The role required to access the route
 * @returns {Function} Express middleware
 */
const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  next();
};

module.exports = requireRole;
