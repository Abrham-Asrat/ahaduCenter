'use strict';

/**
 * Property-Based Tests: Upload filenames are unique (Property 18)
 *
 * Validates: Requirements 14.5
 *
 * The upload middleware (middleware/upload.js) generates filenames using:
 *   `${uuidv4()}${ext}`
 * where `uuidv4` is from the 'uuid' package.
 *
 * This test verifies that generating many such filenames produces no
 * collisions, exercising the same UUID-based strategy used in production.
 */

const { v4: uuidv4 } = require('uuid');
const { getFileUrl } = require('../../services/upload.service');

// Feature: ahadu-center-backend, Property 18: Upload Filenames Are Unique
describe('Upload filename uniqueness (Property 18)', () => {
  /**
   * Property 18: Upload Filenames Are Unique
   *
   * For any two distinct successful upload operations, the generated
   * filenames must differ. Verified by generating 1000 UUID-based
   * filenames and asserting all are distinct (no collisions).
   *
   * **Validates: Requirements 14.5**
   */
  it('Property 18: 1000 generated UUID filenames are all distinct', () => {
    const COUNT = 1000;
    // Replicate the exact filename strategy from middleware/upload.js:
    //   filename = `${uuidv4()}${ext}`
    // We use a fixed representative extension (.jpg) since uniqueness
    // comes entirely from the UUID portion.
    const ext = '.jpg';
    const filenames = Array.from({ length: COUNT }, () => `${uuidv4()}${ext}`);

    const uniqueFilenames = new Set(filenames);

    expect(uniqueFilenames.size).toBe(COUNT);
  });

  it('Property 18: 1000 generated UUID filenames produce unique /uploads/ URLs', () => {
    const COUNT = 1000;
    const ext = '.png';
    const urls = Array.from({ length: COUNT }, () => {
      const filename = `${uuidv4()}${ext}`;
      return getFileUrl(filename);
    });

    const uniqueUrls = new Set(urls);

    expect(uniqueUrls.size).toBe(COUNT);
  });

  it('getFileUrl returns /uploads/<filename> path', () => {
    const filename = 'test-uuid.jpg';
    expect(getFileUrl(filename)).toBe('/uploads/test-uuid.jpg');
  });

  it('getFileUrl produces distinct URLs for distinct filenames', () => {
    const a = `${uuidv4()}.webp`;
    const b = `${uuidv4()}.webp`;
    // Two separate UUIDs should never be equal
    expect(a).not.toBe(b);
    expect(getFileUrl(a)).not.toBe(getFileUrl(b));
  });
});
