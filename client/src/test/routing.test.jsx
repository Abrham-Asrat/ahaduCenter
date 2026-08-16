/**
 * Tests for routing fixes (Task 1.1)
 * Validates: Requirements 1.1, 1.2, 1.3
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

import App from '../App';
import ElectronicsPage from '../pages/ElectronicsPage';

/**
 * Helper: renders App inside MemoryRouter at a given initial route,
 * wrapped in Redux Provider.
 */
function renderApp(initialEntry = '/') {
  return render(
    <Provider store={store}>
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
describe('ElectronicsPage compare navigation (Requirement 1.3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls navigate with /compare (not /electronics/compare) when compare is triggered', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ElectronicsPage />
        </MemoryRouter>
      </Provider>
    );

    // Find all "Compare" buttons and click the first one
    const compareButtons = screen.getAllByRole('button', { name: /compare/i });
    expect(compareButtons.length).toBeGreaterThan(0);

    fireEvent.click(compareButtons[0]);

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
