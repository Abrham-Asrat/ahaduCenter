/**
 * Property-based tests for staggered animation delays (Task 23.1)
 *
 * **Property 6: Staggered animation delay matches index**
 *
 * For each rendered card at index i, `style.animationDelay` must equal
 * `${i * 0.05}s`.  We verify this for BookCenterPage, MovieCenterPage, and
 * ElectronicsPage.
 *
 * **Validates: Requirements 12.1, 12.2, 12.3**
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as fc from 'fast-check';

import { store } from '../redux/store';
import BookCenterPage from '../pages/BookCenterPage';
import MovieCenterPage from '../pages/MovieCenterPage';
import ElectronicsPage from '../pages/ElectronicsPage';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: render a full-page component inside the required providers
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
 * Returns all DOM elements that have an `animationDelay` inline style set,
 * in document order.  These are the staggered card wrappers.
 */
function getStaggeredElements(container) {
  return Array.from(container.querySelectorAll('[style]')).filter((el) => {
    return el.style.animationDelay !== '';
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: focused staggered-animation component
//
// Rather than relying on the full page with its fixed mock data, we also expose
// a small deterministic component that renders N items with the exact same
// staggering formula.  The property test drives N via fast-check.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A minimal component that mirrors the staggering pattern used in the catalog
 * pages:  `style={{ animationDelay: \`${index * 0.05}s\` }}` on each wrapper.
 */
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

/** Generate an array of N items (1 ≤ N ≤ 20) with unique integer ids. */
const itemsArbitrary = fc.integer({ min: 1, max: 20 }).chain((n) =>
  fc
    .uniqueArray(fc.integer({ min: 1, max: 99999 }), { minLength: n, maxLength: n })
    .map((ids) => ids.map((id, i) => ({ id, label: `Item ${i + 1}` })))
);

// ─────────────────────────────────────────────────────────────────────────────
// Property 6 (focused component): delay at index i === `${i * 0.05}s`
// Validates: Requirements 12.1, 12.2, 12.3
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 6: Staggered animation delay matches index — focused component (Validates: Requirements 12.1, 12.2, 12.3)', () => {

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
      { numRuns: 200 }
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
      { numRuns: 100 }
    );
  });

  it('animationDelay values are strictly increasing across items', () => {
    fc.assert(
      fc.property(itemsArbitrary, (items) => {
        // Only meaningful for lists with more than one item
        if (items.length < 2) return true;

        const { getAllByTestId, unmount } = render(<StaggeredList items={items} />);
        const elements = getAllByTestId('staggered-item');

        for (let i = 1; i < elements.length; i++) {
          const prevDelay = parseFloat(elements[i - 1].style.animationDelay);
          const currDelay = parseFloat(elements[i].style.animationDelay);
          expect(currDelay).toBeGreaterThan(prevDelay);
        }

        unmount();
      }),
      { numRuns: 100 }
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
          // Allow for floating-point imprecision with toBeCloseTo
          expect(currDelay - prevDelay).toBeCloseTo(0.05, 10);
        }

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 6 (BookCenterPage): verify real page implementation
// Validates: Requirements 12.1
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 6: BookCenterPage staggered delays (Validates: Requirements 12.1)', () => {

  it('all staggered card wrappers in BookCenterPage follow the index * 0.05s formula', () => {
    const container = renderPage(BookCenterPage, '/books');

    const staggeredEls = getStaggeredElements(container);

    // BookCenterPage has 8 hardcoded books — at least 1 must be visible
    expect(staggeredEls.length).toBeGreaterThan(0);

    staggeredEls.forEach((el, i) => {
      const expectedDelay = `${i * 0.05}s`;
      expect(el.style.animationDelay).toBe(expectedDelay);
    });

    cleanup();
  });

  it('BookCenterPage first card wrapper always has animationDelay "0s"', () => {
    const container = renderPage(BookCenterPage, '/books');
    const staggeredEls = getStaggeredElements(container);
    expect(staggeredEls.length).toBeGreaterThan(0);
    expect(staggeredEls[0].style.animationDelay).toBe('0s');
    cleanup();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 6 (MovieCenterPage): verify real page implementation
// Validates: Requirements 12.2
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 6: MovieCenterPage staggered delays (Validates: Requirements 12.2)', () => {

  it('all staggered card wrappers in MovieCenterPage follow the index * 0.05s formula', () => {
    const container = renderPage(MovieCenterPage, '/movies');

    const staggeredEls = getStaggeredElements(container);

    expect(staggeredEls.length).toBeGreaterThan(0);

    staggeredEls.forEach((el, i) => {
      const expectedDelay = `${i * 0.05}s`;
      expect(el.style.animationDelay).toBe(expectedDelay);
    });

    cleanup();
  });

  it('MovieCenterPage first card wrapper always has animationDelay "0s"', () => {
    const container = renderPage(MovieCenterPage, '/movies');
    const staggeredEls = getStaggeredElements(container);
    expect(staggeredEls.length).toBeGreaterThan(0);
    expect(staggeredEls[0].style.animationDelay).toBe('0s');
    cleanup();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 6 (ElectronicsPage): verify real page implementation
// Validates: Requirements 12.3
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 6: ElectronicsPage staggered delays (Validates: Requirements 12.3)', () => {

  it('all staggered card wrappers in ElectronicsPage follow the index * 0.05s formula', () => {
    const container = renderPage(ElectronicsPage, '/electronics');

    const staggeredEls = getStaggeredElements(container);

    expect(staggeredEls.length).toBeGreaterThan(0);

    staggeredEls.forEach((el, i) => {
      const expectedDelay = `${i * 0.05}s`;
      expect(el.style.animationDelay).toBe(expectedDelay);
    });

    cleanup();
  });

  it('ElectronicsPage first card wrapper always has animationDelay "0s"', () => {
    const container = renderPage(ElectronicsPage, '/electronics');
    const staggeredEls = getStaggeredElements(container);
    expect(staggeredEls.length).toBeGreaterThan(0);
    expect(staggeredEls[0].style.animationDelay).toBe('0s');
    cleanup();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 6 (fast-check over page index): all three pages satisfy the property
// Validates: Requirements 12.1, 12.2, 12.3
// ─────────────────────────────────────────────────────────────────────────────

describe('Property 6 (fast-check over pages): staggered delays hold for all catalog pages', () => {

  const catalogPages = [
    { name: 'BookCenterPage',   Component: BookCenterPage,   route: '/books' },
    { name: 'MovieCenterPage',  Component: MovieCenterPage,  route: '/movies' },
    { name: 'ElectronicsPage',  Component: ElectronicsPage,  route: '/electronics' },
  ];

  it('for any catalog page, every staggered element satisfies delay === index * 0.05s', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: catalogPages.length - 1 }),
        (idx) => {
          const { Component, route } = catalogPages[idx];
          const container = renderPage(Component, route);
          const staggeredEls = getStaggeredElements(container);

          const allCorrect = staggeredEls.every((el, i) => {
            const expected = `${i * 0.05}s`;
            return el.style.animationDelay === expected;
          });

          cleanup();
          return staggeredEls.length > 0 && allCorrect;
        }
      ),
      { numRuns: 30 }
    );
  });
});
