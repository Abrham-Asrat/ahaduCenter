const jwt = require('jsonwebtoken');

/**
 * Signs a JWT with the given payload.
 * Expires in 24 hours, signed with JWT_SECRET env var.
 * @param {Object} payload - e.g. { id: string, role: string }
 * @returns {string} signed JWT
 */
const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 * @returns {Object} decoded payload
 */
const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { sign, verify };
