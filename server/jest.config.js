/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  // Run tests serially so MongoMemoryServer instances don't collide
  runInBand: true,
  // Global timeout — 120 s to accommodate MongoMemoryServer startup on slow machines
  testTimeout: 120000,
};
