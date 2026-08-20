/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  // Global timeout — 120 s to accommodate MongoMemoryServer startup on slow machines
  testTimeout: 120000,
};
