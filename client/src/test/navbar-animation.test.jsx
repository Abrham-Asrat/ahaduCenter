/**
 * Tests for Navbar dropdown animation class fix (Task 4.1)
 * Validates: Requirements 10.1
 *
 * Asserts that the profile dropdown container uses `animate-fade-in` (kebab-case)
 * and NOT `animate-fadeIn` (camelCase), per the CSS class defined in index.css.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate — Navbar calls it internally
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

import Navbar from '../components/common/Navbar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

/**
 * Build a minimal Redux store that simulates a logged-in user.
 * Navbar renders the avatar button when auth.token is truthy.
 */
function buildLoggedInStore() {
  return configureStore({
    reducer: {
      auth: (
        state = {
          user: { name: 'Alex Mercer', email: 'alex@example.com', role: 'user' },
          token: 'fake-token',
          loading: false,
          error: null,
          initialized: true,
        },
        _action
      ) => state,
      notification: (
        state = { notifications: [], unreadCount: 0, loading: false, error: null },
        _action
      ) => state,
    },
  });
}

/**
 * Helper: renders Navbar inside MemoryRouter + Redux Provider.
 * The store simulates a logged-in user so the avatar button appears.
 */
function renderNavbar() {
  return render(
    <Provider store={buildLoggedInStore()}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 10.1 — Navbar profile dropdown uses animate-fade-in (kebab-case)
// ─────────────────────────────────────────────────────────────────────────────
describe('Navbar profile dropdown animation class (Requirement 10.1)', () => {
  beforeEach(() => {
  });

  it('dropdown container has class animate-fade-in after opening', () => {
    renderNavbar();

    // Find the avatar button (title="User Profile Menu") and click it to open the dropdown
    const avatarButton = screen.getByTitle('User Profile Menu');
    fireEvent.click(avatarButton);

    // The dropdown renders "Alex Mercer" in the header — use that to find the dropdown root
    const userName = screen.getByText('Alex Mercer');
    // Walk up to the dropdown container div (the one with the animation class)
    // The dropdown is the closest ancestor that has the animate-* class
    const dropdown = userName.closest('.animate-fade-in');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveClass('animate-fade-in');
  });

  it('dropdown container does NOT have class animate-fadeIn (camelCase)', () => {
    renderNavbar();

    const avatarButton = screen.getByTitle('User Profile Menu');
    fireEvent.click(avatarButton);

    // The camelCase class should not appear anywhere in the dropdown
    const userName = screen.getByText('Alex Mercer');
    const dropdown = userName.closest('.animate-fade-in');

    expect(dropdown).not.toHaveClass('animate-fadeIn');
  });
});
