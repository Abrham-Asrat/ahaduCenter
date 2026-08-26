/**
 * Tests for PurchaseHistoryPage — Task 13.1
 *
 * **Validates: Requirements 5.6**
 *
 * Property 5: Pagination next always increments page by one
 *   For any current page N ≥ 1, clicking the next button SHALL result in a
 *   current page of N + 1.
 *
 * Approach:
 *   The component starts at currentPage = 1. We generate N in [1, 5] using
 *   fast-check, click "Next page" N times to reach page N + 1, then assert
 *   the displayed page indicator shows N + 1.
 */

import React from 'react';
import { describe, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as fc from 'fast-check';

import { store } from '../redux/store';
import PurchaseHistoryPage from '../pages/PurchaseHistoryPage';

vi.mock('../services/orderService', () => ({
  orderService: {
    getOrderHistory: vi.fn().mockResolvedValue({
      data: [{ _id: '1', status: 'Delivered', totalPrice: 10, createdAt: new Date().toISOString(), items: [] }],
      page: 1,
      totalPages: 10,
      totalCount: 10,
    }),
  },
}));

/** Render PurchaseHistoryPage with all required providers. */
function renderPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <PurchaseHistoryPage />
      </MemoryRouter>
    </Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Property 5: Pagination next always increments page by one
// Validates: Requirements 5.6
// ─────────────────────────────────────────────────────────────────────────────

describe('PurchaseHistoryPage pagination — Property 5 (Validates: Requirements 5.6)', () => {
  it('clicking next N times results in page N+1 being displayed', () => {
    fc.assert(
      fc.property(
        // Generate N in [1, 5]: click next N times starting from page 1
        // to arrive at page N+1.
        fc.integer({ min: 1, max: 5 }),
        (n) => {
          act(() => { renderPage(); });

          const nextButton = screen.getByRole('button', { name: /next page/i });

          // Click next N times — page advances from 1 to n+1
          act(() => {
            for (let i = 0; i < n; i++) {
              fireEvent.click(nextButton);
            }
          });

          // The page indicator should now read "(n+1) OF 10"
          const expectedText = `${n + 1} OF 10`;
          const pageIndicator = screen.getByText(expectedText);
          expect(pageIndicator).toBeInTheDocument();

          cleanup();
        }
      ),
      // numRuns: 5 — one run per value in [1,5]; keeping it low because
      // each run mounts/unmounts the full page component tree.
      { numRuns: 5 }
    );
  }, 30000);

  it('each individual next click increments the displayed page by exactly one', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        (n) => {
          act(() => { renderPage(); });

          const nextButton = screen.getByRole('button', { name: /next page/i });

          // Advance to page n first (click n-1 times)
          if (n > 1) {
            act(() => {
              for (let i = 0; i < n - 1; i++) {
                fireEvent.click(nextButton);
              }
            });
          }

          // Confirm we are on page n
          expect(screen.getByText(`${n} OF 10`)).toBeInTheDocument();

          // One more click → should display page n+1
          act(() => { fireEvent.click(nextButton); });
          expect(screen.getByText(`${n + 1} OF 10`)).toBeInTheDocument();

          cleanup();
        }
      ),
      // numRuns: 5 — low to avoid timeout; [1,5] has only 5 distinct values
      { numRuns: 5 }
    );
  }, 30000);
});
