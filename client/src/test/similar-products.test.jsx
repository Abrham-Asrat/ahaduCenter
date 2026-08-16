/**
 * Property-based tests for SimilarProducts card links (Task 10.1)
 *
 * **Validates: Requirements 3.3**
 *
 * Property 2: SimilarProducts cards always link to the correct route pattern
 *   For any array of product objects with arbitrary id values, every rendered
 *   anchor's href must match `/electronics/{product.id}`.
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as fc from 'fast-check';

import SimilarProducts from '../components/electronics/SimilarProducts';

// ─────────────────────────────────────────────────────────────────────────────
// Arbitraries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a single product object.
 * `id` can be any positive integer or UUID string — covers both real-world cases.
 */
const productArbitrary = fc.record({
  id: fc.oneof(
    fc.integer({ min: 1, max: 99999 }),
    fc.uuid()
  ),
  name: fc.string({ minLength: 1, maxLength: 60 }),
  brand: fc.string({ minLength: 1, maxLength: 40 }),
  imageUrl: fc.constant('https://example.com/product.jpg'),
  price: fc.integer({ min: 1, max: 99999 }),
});

/**
 * Generates a non-empty array of product objects with unique IDs.
 * uniqueArray ensures no duplicate ids (which would cause duplicate React keys).
 */
const productsArrayArbitrary = fc.uniqueArray(productArbitrary, {
  minLength: 1,
  maxLength: 20,
  selector: (p) => String(p.id),
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────
const renderSimilarProducts = (products) =>
  render(
    <MemoryRouter>
      <SimilarProducts products={products} />
    </MemoryRouter>
  );

// ─────────────────────────────────────────────────────────────────────────────
// Property 2: Every card anchor href matches /electronics/{product.id}
// Validates: Requirements 3.3
// ─────────────────────────────────────────────────────────────────────────────
describe('SimilarProducts card links (Property 2 — Validates: Requirements 3.3)', () => {
  it('every card anchor href matches /electronics/{product.id} for any array of products', () => {
    fc.assert(
      fc.property(productsArrayArbitrary, (products) => {
        const { container, unmount } = renderSimilarProducts(products);

        // All anchor elements rendered by the component
        const anchors = Array.from(container.querySelectorAll('a'));

        // There must be exactly one anchor per product
        expect(anchors).toHaveLength(products.length);

        // Each product must have a corresponding anchor with the correct href
        products.forEach((product) => {
          const expectedHref = `/electronics/${product.id}`;
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
      { numRuns: 100 }
    );
  });

  it('no card produces an href that does not match the /electronics/:id pattern', () => {
    fc.assert(
      fc.property(productsArrayArbitrary, (products) => {
        const { container, unmount } = renderSimilarProducts(products);

        const anchors = Array.from(container.querySelectorAll('a'));
        const productIdSet = new Set(products.map((p) => String(p.id)));

        anchors.forEach((anchor) => {
          const href = anchor.getAttribute('href') ?? '';
          // href must start with /electronics/
          expect(href).toMatch(/^\/electronics\//);

          // The id segment must correspond to one of the provided products
          const idSegment = href.replace('/electronics/', '');
          expect(productIdSet.has(idSegment)).toBe(true);
        });

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Edge case: empty products array renders no anchors
// ─────────────────────────────────────────────────────────────────────────────
describe('SimilarProducts edge cases', () => {
  it('renders no anchors when products array is empty', () => {
    const { container } = renderSimilarProducts([]);
    const anchors = container.querySelectorAll('a');
    expect(anchors).toHaveLength(0);
  });
});
