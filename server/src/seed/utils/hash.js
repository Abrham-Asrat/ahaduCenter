'use strict';

/** Password hashing wrapper matching auth.controller.js (bcrypt cost 12). */

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

module.exports = { SALT_ROUNDS, hashPassword };
