/**
 * Tests for checkout navigation fixes (Task 2.1)
 * Validates: Requirements 1.4, 1.5
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

// Use vi.hoisted so mockNavigate is available when vi.mock factory runs
const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import BookInfoSection from '../components/book/BookInfoSection';
import ProductComparisonPage from '../pages/ProductComparisonPage';

// ─────────────────────────────────────────────────────────────────────────────
// Shared mock book prop for BookInfoSection
// ─────────────────────────────────────────────────────────────────────────────
const mockBook = {
  title: 'Test Book',
  author: 'Test Author',
  publisher: 'Test Publisher',
  year: 2024,
  isbn: '978-0-000-00000-0',
  rating: 4,
  reviews: 42,
  description: 'A test book description.',
  availableCopies: 3,
  location: 'Shelf A1',
  price: 19.99,
};

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 1.4 — BookInfoSection "Buy" navigates to /book-confirm
// ─────────────────────────────────────────────────────────────────────────────
describe('BookInfoSection Buy button (Requirement 1.4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('navigates to /book-confirm (not /checkout) when Buy button is clicked', async () => {
    render(
      <MemoryRouter>
        <BookInfoSection book={mockBook} onShowToast={vi.fn()} />
      </MemoryRouter>
    );

    // The Buy button contains "Buy $" text
    const buyButton = screen.getByRole('button', { name: /buy/i });
    expect(buyButton).toBeInTheDocument();

    fireEvent.click(buyButton);

    // navigate('/book-confirm') is called after a 1000 ms setTimeout inside handleBuy
    vi.runAllTimers();

    expect(mockNavigate).toHaveBeenCalledWith('/book-confirm');
    expect(mockNavigate).not.toHaveBeenCalledWith('/checkout');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 1.5 — ProductComparisonPage "Buy Now" navigates to /order-confirmation
// ─────────────────────────────────────────────────────────────────────────────
describe('ProductComparisonPage checkout navigation (Requirement 1.5)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('navigates to /order-confirmation (not /checkout) when Buy Now is clicked', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductComparisonPage />
        </MemoryRouter>
      </Provider>
    );

    // Find "Buy Now" buttons — at least one product is In Stock
    const buyNowButtons = screen.getAllByRole('button', { name: /buy now/i });
    expect(buyNowButtons.length).toBeGreaterThan(0);

    fireEvent.click(buyNowButtons[0]);

    // navigate('/order-confirmation') is called after a 1000 ms setTimeout inside handleBuyNow
    vi.runAllTimers();

    expect(mockNavigate).toHaveBeenCalledWith('/order-confirmation');
    expect(mockNavigate).not.toHaveBeenCalledWith('/checkout');
  });
});
