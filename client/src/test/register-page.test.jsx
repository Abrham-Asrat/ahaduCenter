/**
 * Tests for RegisterPage — Task 15.1
 * Validates: Requirements 5.8
 *
 * Verifies that:
 * 1. Submitting the registration form shows a success toast with "Account created".
 * 2. After 1500 ms, navigate('/login') is called (verified with fake timers).
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

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

import RegisterPage from '../pages/RegisterPage';

/** Render RegisterPage with MemoryRouter (needed for <Link> components). */
function renderPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  );
}

/**
 * Fill all required form fields and check the terms checkbox,
 * then submit the form.
 */
function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/full name/i), {
    target: { value: 'Test User' },
  });
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { value: 'password123' },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: 'password123' },
  });

  // Check the terms checkbox
  fireEvent.click(screen.getByLabelText(/i agree to the/i));

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 5.8 — RegisterPage form submit: toast + navigate
// ─────────────────────────────────────────────────────────────────────────────

describe('RegisterPage submit (Requirement 5.8)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a success toast containing "Account created" after form submission', () => {
    renderPage();
    fillAndSubmit();

    // Toast should be visible immediately after submit
    expect(screen.getByText(/account created/i)).toBeInTheDocument();
  });

  it('calls navigate("/login") after 1500 ms', () => {
    renderPage();
    fillAndSubmit();

    // navigate should NOT have been called immediately
    expect(mockNavigate).not.toHaveBeenCalledWith('/login');

    // Advance timers by 1500 ms — the setTimeout in handleSubmit fires
    vi.advanceTimersByTime(1500);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('does not navigate before 1500 ms have elapsed', () => {
    renderPage();
    fillAndSubmit();

    // Advance only 1499 ms — should not have navigated yet
    vi.advanceTimersByTime(1499);

    expect(mockNavigate).not.toHaveBeenCalledWith('/login');
  });
});
