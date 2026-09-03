const { verify } = require('../../utils/jwt');

/**
 * Authenticate middleware.
 * Reads `Authorization: Bearer <token>`, verifies the JWT via utils/jwt.js,
 * and attaches `req.user = { id, role }` for downstream handlers.
 * Returns HTTP 401 if the header is missing, malformed, expired, or invalid.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verify(token);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
