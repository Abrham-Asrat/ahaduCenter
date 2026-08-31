module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFiles: ['./jest.setup.js'],
  testTimeout: 180000, // 3 minutes for MongoMemoryServer startup
};
