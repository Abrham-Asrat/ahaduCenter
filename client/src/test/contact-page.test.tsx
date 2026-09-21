/**
 * Tests for ContactPage — Task 16.1
 * Validates: Requirements 5.9
 *
 * Verifies that:
 * 1. Submitting the contact form renders the success message "Message sent successfully!".
 * 2. The form (submit button) is no longer rendered after submission.
 * 3. window.alert is NOT called during form submission.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

import ContactPage from '../pages/ContactPage';

/** Render ContactPage inside a MemoryRouter + Redux Provider (needed for Navbar). */
function renderPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    </Provider>
  );
}

/**
 * Fill all required fields (name, email, subject, message) and submit the form.
 * Returns a promise that resolves once the async submit handler completes
 * (i.e. the success state is visible).
 */
async function fillAndSubmit() {
  fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
    target: { name: 'name', value: 'John Doe' },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { name: 'email', value: 'john@example.com' },
  });
  // Select the subject dropdown — pick "General Inquiry"
  fireEvent.change(screen.getByRole('combobox'), {
    target: { name: 'subject', value: 'general' },
  });
  fireEvent.change(screen.getByPlaceholderText(/how can we assist/i), {
    target: { name: 'message', value: 'Hello, I have a question.' },
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 5.9 — ContactPage form submit: inline success state, no alert()
// ─────────────────────────────────────────────────────────────────────────────

describe('ContactPage submit (Requirement 5.9)', () => {
  let alertSpy;

  beforeEach(() => {
    // Spy on window.alert to ensure it is never called
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('shows success message "Message sent successfully!" after form submission', async () => {
    renderPage();
    await fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByText(/message sent successfully!/i)).toBeInTheDocument()
    );
  });

  it('hides the form (submit button is gone) after successful submission', async () => {
    renderPage();
    await fillAndSubmit();

    // The "Send Message" submit button should no longer be in the document
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /send message/i })).not.toBeInTheDocument()
    );
  });

  it('does NOT call window.alert() on form submission', async () => {
    renderPage();
    await fillAndSubmit();

    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('re-renders the form when "Send Another" button is clicked', async () => {
    renderPage();
    await fillAndSubmit();

    // Wait for the success state to appear
    const sendAnotherBtn = await screen.findByRole('button', { name: /send another/i });

    // Click the reset button
    fireEvent.click(sendAnotherBtn);

    // Form should be back
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
    );
    // Success message should be gone
    expect(screen.queryByText(/message sent successfully!/i)).not.toBeInTheDocument();
  });
});
