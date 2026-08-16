/**
 * Tests for Footer branding, responsive padding, newsletter, and Quick Links (Task 7.1)
 * Validates: Requirements 6.1, 6.2, 7.1, 8.3
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Footer from '../components/common/Footer';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: render Footer inside a MemoryRouter (needed for <Link>)
// ─────────────────────────────────────────────────────────────────────────────
const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 7.1 — Branding: "Ahadu Center" present, "NexusGlobal" absent
// ─────────────────────────────────────────────────────────────────────────────
describe('Footer branding (Requirement 7.1)', () => {
  it('displays "Ahadu Center" as the brand name', () => {
    renderFooter();
    // There should be at least one element with the brand text
    const brandElements = screen.getAllByText(/Ahadu Center/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });

  it('displays "Ahadu Center" in the copyright notice', () => {
    renderFooter();
    expect(screen.getByText(/© 2024 Ahadu Center/i)).toBeInTheDocument();
  });

  it('does NOT display "NexusGlobal" anywhere in the footer', () => {
    renderFooter();
    const nexusElements = screen.queryAllByText(/NexusGlobal/i);
    expect(nexusElements).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 8.3 — Responsive padding classes on grid container
// ─────────────────────────────────────────────────────────────────────────────
describe('Footer responsive padding (Requirement 8.3)', () => {
  it('grid container has px-4 class for mobile padding', () => {
    const { container } = renderFooter();
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid.className).toContain('px-4');
  });

  it('grid container has lg:px-20 class for desktop padding', () => {
    const { container } = renderFooter();
    const grid = container.querySelector('.grid');
    expect(grid.className).toContain('lg:px-20');
  });

  it('grid container does NOT have the old bare px-20 class', () => {
    const { container } = renderFooter();
    const grid = container.querySelector('.grid');
    const classes = grid.className.split(/\s+/);
    expect(classes).not.toContain('px-20');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 6.1 — Newsletter "Send" shows success message, hides input
// ─────────────────────────────────────────────────────────────────────────────
describe('Footer newsletter subscription (Requirement 6.1)', () => {
  it('shows email input and Send button before submission', () => {
    renderFooter();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    // The send button contains the material icon text or is accessible via its container
    const sendButton = screen.getByRole('button');
    expect(sendButton).toBeInTheDocument();
  });

  it('shows success message after clicking Send', () => {
    renderFooter();
    const sendButton = screen.getByRole('button');
    fireEvent.click(sendButton);
    expect(screen.getByText(/thanks for subscribing/i)).toBeInTheDocument();
  });

  it('hides the email input after clicking Send', () => {
    renderFooter();
    const sendButton = screen.getByRole('button');
    fireEvent.click(sendButton);
    expect(screen.queryByPlaceholderText(/email address/i)).not.toBeInTheDocument();
  });

  it('hides the Send button after clicking it', () => {
    renderFooter();
    const sendButton = screen.getByRole('button');
    fireEvent.click(sendButton);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 6.2 — Quick Links "Help Center" and "Contact Us" → /contact
// ─────────────────────────────────────────────────────────────────────────────
describe('Footer Quick Links navigation (Requirement 6.2)', () => {
  it('"Help Center" link has href="/contact"', () => {
    renderFooter();
    const helpLink = screen.getByRole('link', { name: /help center/i });
    expect(helpLink).toBeInTheDocument();
    expect(helpLink).toHaveAttribute('href', '/contact');
  });

  it('"Contact Us" link has href="/contact"', () => {
    renderFooter();
    const contactLink = screen.getByRole('link', { name: /contact us/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contact');
  });
});
