/**
 * Property-based tests for staggered animation delays (Task 23.1)
 *
 * **Property 6: Staggered animation delay matches index**
 *
 * For each rendered card at index i, `style.animationDelay` must equal
 * `${i * 0.05}s`.
 *
 * **Validates: Requirements 12.1, 12.2, 12.3**
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as fc from 'fast-check';

import { store } from '../redux/store';
import ElectronicsPage from '../pages/ElectronicsPage';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: render a page inside the required providers
// ─────────────────────────────────────────────────────────────────────────────
function renderPage(PageComponent, route = '/') {
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <PageComponent />
      </MemoryRouter>
    </Provider>
  );
  return container;
}

/**
 * Returns all DOM elements that have a non-empty `animationDelay` inline style,
 * in document order.  These are the staggered card wrappers.
 */
function getStaggeredElements(container) {
  return Array.from(container.querySelectorAll('[style]')).filter(
    (el) => el.style.animationDelay !== ''
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Focused staggered-animation component
//
// A minimal component that mirrors the staggering pattern used in the catalog
// pages: `style={{ animationDelay: `${index * 0.05}s` }}` on each wrapper.
// Used for the fast-check property test to avoid importing heavy page components
// in a tight loop.
// ─────────────────────────────────────────────────────────────────────────────
function StaggeredList({ items }) {
  return (
    <div data-testid="staggered-list">
      {items.map((item, index) => (
        <div
          key={item.id}
          data-testid="staggered-item"
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Arbitraries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate an array of N items (1 ≤ N ≤ 8, matching the ElectronicsPage mock
 * data size) with unique integer ids.
 */
const itemsArbitrary = fc.integer({ min: 1, max: 8 }).chain((n) =>
  fc
    .uniqueArray(fc.integer({ min: 1, max: 99999 }), { minLength: n, maxLength: n })
    .map((ids) => ids.map((id, i) => ({ id, label: `Item ${i + 1}` })))
);

// ─────────────────────────────────────────────────────────────────────────────
// Property 6 (focused component): delay at index i === `${i * 0.05}s`
// Validates: Requirements 12.1, 12.2, 12.3
// ─────────────────────────────────────────────────────────────────────────────
describe(
  'Property 6: Staggered animation delay matches index — focused component (Validates: Requirements 12.1, 12.2, 12.3)',
  () => {
    it('every item at index i has animationDelay === `${i * 0.05}s`', () => {
      fc.assert(
        fc.property(itemsArbitrary, (items) => {
          const { getAllByTestId, unmount } = render(<StaggeredList items={items} />);

          const elements = getAllByTestId('staggered-item');

          // Length guard
          expect(elements).toHaveLength(items.length);

          // Each element's animationDelay must match the formula
          elements.forEach((el, i) => {
            const expectedDelay = `${i * 0.05}s`;
            expect(el.style.animationDelay).toBe(expectedDelay);
          });

          unmount();
        }),
        { numRuns: 100 }
      );
    });

    it('first item always has animationDelay === "0s"', () => {
      fc.assert(
        fc.property(itemsArbitrary, (items) => {
          const { getAllByTestId, unmount } = render(<StaggeredList items={items} />);
          const elements = getAllByTestId('staggered-item');
          expect(elements[0].style.animationDelay).toBe('0s');
          unmount();
        }),
        { numRuns: 50 }
      );
    });

    it('consecutive delays differ by exactly 0.05s', () => {
      fc.assert(
        fc.property(itemsArbitrary, (items) => {
          if (items.length < 2) return true;

          const { getAllByTestId, unmount } = render(<StaggeredList items={items} />);
          const elements = getAllByTestId('staggered-item');

          for (let i = 1; i < elements.length; i++) {
            const prevDelay = parseFloat(elements[i - 1].style.animationDelay);
            const currDelay = parseFloat(elements[i].style.animationDelay);
            expect(currDelay - prevDelay).toBeCloseTo(0.05, 10);
          }

          unmount();
        }),
        { numRuns: 50 }
      );
    });
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Property 6 (ElectronicsPage): verify real page implementation
// Validates: Requirements 12.3
// ─────────────────────────────────────────────────────────────────────────────
describe('Property 6: ElectronicsPage staggered delays (Validates: Requirements 12.3)', () => {
  it('all staggered card wrappers in ElectronicsPage follow the index * 0.05s formula', () => {
    const container = renderPage(ElectronicsPage, '/electronics');

    const staggeredEls = getStaggeredElements(container);

    // ElectronicsPage has 8 hardcoded products — all should be visible unfiltered
    expect(staggeredEls.length).toBeGreaterThan(0);

    staggeredEls.forEach((el, i) => {
      const expectedDelay = `${i * 0.05}s`;
      expect(el.style.animationDelay).toBe(expectedDelay);
    });

    cleanup();
  });

  it('ElectronicsPage renders 8 products unfiltered', () => {
    const container = renderPage(ElectronicsPage, '/electronics');
    const staggeredEls = getStaggeredElements(container);
    expect(staggeredEls.length).toBe(8);
    cleanup();
  });

  it('ElectronicsPage first card wrapper always has animationDelay "0s"', () => {
    const container = renderPage(ElectronicsPage, '/electronics');
    const staggeredEls = getStaggeredElements(container);
    expect(staggeredEls.length).toBeGreaterThan(0);
    expect(staggeredEls[0].style.animationDelay).toBe('0s');
    cleanup();
  });

  it('ElectronicsPage last card (index 7) has animationDelay matching the formula', () => {
    const container = renderPage(ElectronicsPage, '/electronics');
    const staggeredEls = getStaggeredElements(container);
    expect(staggeredEls.length).toBe(8);
    // Use the same formula as the implementation to avoid floating-point mismatch
    expect(staggeredEls[7].style.animationDelay).toBe(`${7 * 0.05}s`);
    cleanup();
  });
});
