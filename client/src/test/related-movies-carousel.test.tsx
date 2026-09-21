/**
 * Property-based tests for RelatedMoviesCarousel card links (Task 9.1)
 *
 * **Validates: Requirements 3.2**
 *
 * Property 1: Related carousel cards always link to the correct route pattern
 *   For any array of movie objects with arbitrary id values, every rendered
 *   anchor's href must match `/movies/{movie.id}`.
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as fc from 'fast-check';

import RelatedMoviesCarousel from '../components/movie/RelatedMoviesCarousel';

// ─────────────────────────────────────────────────────────────────────────────
// Arbitraries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a single movie object.
 * `id` can be any integer or string — we use integer IDs to mirror real data.
 */
const movieArbitrary = fc.record({
  id: fc.oneof(
    fc.integer({ min: 1, max: 99999 }),
    fc.uuid()
  ),
  title: fc.string({ minLength: 1, maxLength: 60 }),
  posterUrl: fc.constant('https://example.com/poster.jpg'),
  year: fc.integer({ min: 1900, max: 2100 }).map(String),
  rating: fc.float({ min: 0, max: 10, noNaN: true }).map(r => r.toFixed(1)),
});

/**
 * Generates a non-empty array of movie objects with unique IDs.
 * Using uniqueArray ensures no duplicate ids (which would cause duplicate React keys).
 */
const moviesArrayArbitrary = fc
  .uniqueArray(movieArbitrary, {
    minLength: 1,
    maxLength: 20,
    selector: (m) => String(m.id),
  });

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────
const renderCarousel = (movies) =>
  render(
    <MemoryRouter>
      <RelatedMoviesCarousel movies={movies} />
    </MemoryRouter>
  );

// ─────────────────────────────────────────────────────────────────────────────
// Property 1: Every card anchor href matches /movies/{movie.id}
// Validates: Requirements 3.2
// ─────────────────────────────────────────────────────────────────────────────
describe('RelatedMoviesCarousel card links (Property 1 — Validates: Requirements 3.2)', () => {
  it('every card anchor href matches /movies/{movie.id} for any array of movies', () => {
    fc.assert(
      fc.property(moviesArrayArbitrary, (movies) => {
        const { container, unmount } = renderCarousel(movies);

        // All anchor elements rendered by the carousel
        const anchors = Array.from(container.querySelectorAll('a'));

        // There must be exactly one anchor per movie
        expect(anchors).toHaveLength(movies.length);

        // Each anchor href must match the correct route pattern
        movies.forEach((movie) => {
          const expectedHref = `/movies/${movie.id}`;
          const matchingAnchor = anchors.find(
            (a) => a.getAttribute('href') === expectedHref
          );
          expect(
            matchingAnchor,
            `Expected an anchor with href="${expectedHref}" but none was found. ` +
            `Available hrefs: ${anchors.map((a) => a.getAttribute('href')).join(', ')}`
          ).not.toBeNull();
        });

        unmount();
      }),
      { numRuns: 20 }
    );
  });

  it('no card produces an href that does not match the /movies/:id pattern', () => {
    fc.assert(
      fc.property(moviesArrayArbitrary, (movies) => {
        const { container, unmount } = renderCarousel(movies);

        const anchors = Array.from(container.querySelectorAll('a'));
        const movieIdSet = new Set(movies.map((m) => String(m.id)));

        anchors.forEach((anchor) => {
          const href = anchor.getAttribute('href') ?? '';
          // href must start with /movies/
          expect(href).toMatch(/^\/movies\//);

          // The id segment must correspond to one of the provided movies
          const idSegment = href.replace('/movies/', '');
          expect(movieIdSet.has(idSegment)).toBe(true);
        });

        unmount();
      }),
      { numRuns: 20 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Snapshot / smoke: empty movies array renders no anchors
// ─────────────────────────────────────────────────────────────────────────────
describe('RelatedMoviesCarousel edge cases', () => {
  it('renders no anchors when movies array is empty', () => {
    const { container } = renderCarousel([]);
    const anchors = container.querySelectorAll('a');
    expect(anchors).toHaveLength(0);
  });
});
