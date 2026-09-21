/**
 * Tests for UserDashboardPage — Task 17.1
 *
 * Validates: Requirements 5.10
 *
 * Assert that sidebar navigation links in UserDashboardPage point to the
 * correct routes:
 *   - "Favorites"          → /wishlist
 *   - "Purchase History"   → /purchase-history
 *   - "Borrowing History"  → /borrowing-history
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from '../redux/store';
import UserDashboardPage from '../pages/UserDashboardPage';

/** Render UserDashboardPage with required providers. */
function renderPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <UserDashboardPage />
      </MemoryRouter>
    </Provider>
  );
}

describe('UserDashboardPage sidebar navigation (Validates: Requirements 5.10)', () => {
  it('Favorites link has href="/wishlist"', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /favorites/i });
    expect(link).toHaveAttribute('href', '/wishlist');
  });

  it('Purchase History link has href="/purchase-history"', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /purchase history/i });
    expect(link).toHaveAttribute('href', '/purchase-history');
  });

  it('Borrowing History link has href="/borrowing-history"', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /borrowing history/i });
    expect(link).toHaveAttribute('href', '/borrowing-history');
  });

  it('Movie Requests link has href="/movie-request"', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /movie requests/i });
    expect(link).toHaveAttribute('href', '/movie-request');
  });

  it('Notifications link has href="/notifications"', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /notifications/i });
    expect(link).toHaveAttribute('href', '/notifications');
  });

  it('Contact link has href="/contact"', () => {
    renderPage();
    // The accessible name includes the Material icon text ("contact_support") and the label.
    // Query all links with href="/contact" and assert at least one has the text "Contact".
    const links = screen.getAllByRole('link').filter((l) => l.getAttribute('href') === '/contact');
    const contactSidebarLink = links.find((l) => l.textContent.includes('Contact'));
    expect(contactSidebarLink).toBeDefined();
    expect(contactSidebarLink).toHaveAttribute('href', '/contact');
  });
});
