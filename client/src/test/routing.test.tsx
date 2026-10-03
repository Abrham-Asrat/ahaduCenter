/**
 * Tests for routing fixes (Task 1.1)
 * Validates: Requirements 1.1, 1.2, 1.3
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Use vi.hoisted so mockNavigate is available when vi.mock factory runs
const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import App from '../App';
import ElectronicsPage from '../pages/ElectronicsPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import NotFoundPage from '../pages/NotFoundPage';
import i18n from '../i18n/config';

/**
 * Helper: renders App inside MemoryRouter at a given initial route,
 * wrapped in Redux Provider.
 */
const mockAuthStore = configureStore({
  reducer: {
    auth: () => ({
      user: { _id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
      token: 'fake-token',
      initialized: true,
    }),
    notification: () => ({ notifications: [], unreadCount: 0, loading: false }),
    wishlist: () => ({ items: [] }),
    product: () => ({ products: [], loading: false }),
    language: () => ({ language: 'en' }),
  },
});

function renderApp(initialEntry = '/') {
  return render(
    <Provider store={mockAuthStore}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 1.1 — /notifications route renders NotificationsPage
// ─────────────────────────────────────────────────────────────────────────────
describe('Route /notifications (Requirement 1.1)', () => {
  it('renders NotificationsPage content when navigating to /notifications', () => {
    renderApp('/notifications');

    // NotificationsPage has an <h1> with "Notifications"
    expect(screen.getByRole('heading', { name: /^notifications$/i })).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 1.2 — /order-confirmation route renders OrderConfirmationPage
// ─────────────────────────────────────────────────────────────────────────────
describe('Route /order-confirmation (Requirement 1.2)', () => {
  it('renders OrderConfirmationPage content when navigating to /order-confirmation', () => {
    renderApp('/order-confirmation');

    // OrderConfirmationPage has "In-Store Pick-Up Reserved!" heading
    expect(
      screen.getByRole('heading', { name: /in-store pick-up reserved/i })
    ).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 1.3 — ElectronicsPage handleCompare navigates to /compare
// ─────────────────────────────────────────────────────────────────────────────

const mockStore = configureStore({
  reducer: {
    product: () => ({
      products: [{ _id: '1', id: '1', name: 'Product 1', brand: 'Brand A', price: 100, condition: 'New' }],
      loading: false,
      error: null,
      pagination: { totalPages: 1 },
    }),
    auth: () => ({ user: null }),
    wishlist: () => ({ items: [] }),
    language: () => ({ language: 'en' }),
  },
});

describe('ElectronicsPage compare navigation (Requirement 1.3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls navigate with /compare (not /electronics/compare) when compare is triggered', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <ElectronicsPage />
        </MemoryRouter>
      </Provider>
    );

    // Find all "Compare" buttons and click the first one
    const compareButtons = screen.getAllByRole('button', { name: /compare/i });
    expect(compareButtons.length).toBeGreaterThan(0);
    const firstCompareButton = compareButtons[0];
    if (!firstCompareButton) throw new Error('Compare button was not rendered');

    fireEvent.click(firstCompareButton);

    // navigate('/compare') is called after a 1200ms setTimeout inside handleCompare
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/compare');
      },
      { timeout: 2000 }
    );

    // Ensure the old incorrect path is never used
    expect(mockNavigate).not.toHaveBeenCalledWith('/electronics/compare');
  });
});

describe('Utility page translations', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('am');
  });

  it('renders translated search sort labels and result headings in Amharic', () => {
    render(
      <Provider store={mockAuthStore}>
        <MemoryRouter initialEntries={['/search?q=ተከታታይ']}>
          <SearchResultsPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /ለ\s*"ተከታታይ"\s*.*ውጤቶች/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /ተዛማጅነት/i })).toBeInTheDocument();
  });

  it('renders translated not-found copy instead of generic search results text', () => {
    render(
      <Provider store={mockAuthStore}>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /ገጹ አልተገኘም/i })).toBeInTheDocument();
    expect(screen.getByText(/የሚፈልጉት ገጽ አልተገኘም/i)).toBeInTheDocument();
  });
});
