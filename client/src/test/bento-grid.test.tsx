/**
 * Tests for BentoGrid responsive padding and card navigation (Task 6.1)
 * Validates: Requirements 2.3, 2.4, 2.5, 2.6, 8.2
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import BentoGrid from '../components/common/BentoGrid';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: render BentoGrid inside a MemoryRouter (required for <Link>)
// ─────────────────────────────────────────────────────────────────────────────
const renderBentoGrid = () =>
  render(
    <MemoryRouter>
      <BentoGrid />
    </MemoryRouter>
  );

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 8.2 — Responsive padding classes on outer <section>
// ─────────────────────────────────────────────────────────────────────────────
describe('BentoGrid responsive padding (Requirement 8.2)', () => {
  it('outer <section> has px-4 class for mobile padding', () => {
    const { container } = renderBentoGrid();
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section.className).toContain('px-4');
  });

  it('outer <section> has lg:px-20 class for desktop padding', () => {
    const { container } = renderBentoGrid();
    const section = container.querySelector('section');
    expect(section.className).toContain('lg:px-20');
  });

  it('outer <section> does NOT have the old bare px-20 class', () => {
    const { container } = renderBentoGrid();
    const section = container.querySelector('section');
    // Split on whitespace and ensure no token equals exactly "px-20"
    const classes = section.className.split(/\s+/);
    expect(classes).not.toContain('px-20');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 2.3 — Movies card navigates to /movies
// ─────────────────────────────────────────────────────────────────────────────
describe('BentoGrid Movies card link (Requirement 2.3)', () => {
  it('Movies card has an ancestor <a> element with href="/movies"', () => {
    renderBentoGrid();
    // The "Cinematic Masterpieces" heading is inside the Movies card
    const heading = screen.getByRole('heading', { name: /cinematic masterpieces/i });
    expect(heading).toBeInTheDocument();

    // Walk up the DOM to find the closest <a> ancestor
    const anchor = heading.closest('a');
    expect(anchor).not.toBeNull();
    expect(anchor).toHaveAttribute('href', '/movies');
  });

  it('Movies card link wraps the card content', () => {
    const { container } = renderBentoGrid();
    const moviesLink = container.querySelector('a[href="/movies"]');
    expect(moviesLink).not.toBeNull();
    expect(moviesLink.textContent).toMatch(/cinematic masterpieces/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 2.4 — Electronics card navigates to /electronics
// ─────────────────────────────────────────────────────────────────────────────
describe('BentoGrid Electronics card link (Requirement 2.4)', () => {
  it('Electronics card has an ancestor <a> element with href="/electronics"', () => {
    renderBentoGrid();
    const heading = screen.getByRole('heading', { name: /next-gen tech/i });
    expect(heading).toBeInTheDocument();

    const anchor = heading.closest('a');
    expect(anchor).not.toBeNull();
    expect(anchor).toHaveAttribute('href', '/electronics');
  });

  it('Electronics card link wraps the card content', () => {
    const { container } = renderBentoGrid();
    const electronicsLink = container.querySelector('a[href="/electronics"]');
    expect(electronicsLink).not.toBeNull();
    expect(electronicsLink.textContent).toMatch(/next-gen tech/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 2.5 — Books card navigates to /books
// ─────────────────────────────────────────────────────────────────────────────
describe('BentoGrid Books card link (Requirement 2.5)', () => {
  it('Books card has an ancestor <a> element with href="/books"', () => {
    renderBentoGrid();
    const heading = screen.getByRole('heading', { name: /bestsellers/i });
    expect(heading).toBeInTheDocument();

    const anchor = heading.closest('a');
    expect(anchor).not.toBeNull();
    expect(anchor).toHaveAttribute('href', '/books');
  });

  it('Books card link wraps the card content', () => {
    const { container } = renderBentoGrid();
    const booksLink = container.querySelector('a[href="/books"]');
    expect(booksLink).not.toBeNull();
    expect(booksLink.textContent).toMatch(/bestsellers/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 2.6 — "Join the Community" navigates to /register
// ─────────────────────────────────────────────────────────────────────────────
describe('BentoGrid "Join the Community" link (Requirement 2.6)', () => {
  it('"Join the Community" heading has an ancestor <a> with href="/register"', () => {
    renderBentoGrid();
    const heading = screen.getByRole('heading', { name: /join the community/i });
    expect(heading).toBeInTheDocument();

    const anchor = heading.closest('a');
    expect(anchor).not.toBeNull();
    expect(anchor).toHaveAttribute('href', '/register');
  });

  it('"Join the Community" card link wraps the entire community card', () => {
    const { container } = renderBentoGrid();
    const registerLink = container.querySelector('a[href="/register"]');
    expect(registerLink).not.toBeNull();
    expect(registerLink.textContent).toMatch(/join the community/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Sanity check — all four navigation links are present in the rendered output
// ─────────────────────────────────────────────────────────────────────────────
describe('BentoGrid all navigation links present', () => {
  it('renders links for /movies, /electronics, /books, and /register', () => {
    const { container } = renderBentoGrid();
    expect(container.querySelector('a[href="/movies"]')).not.toBeNull();
    expect(container.querySelector('a[href="/electronics"]')).not.toBeNull();
    expect(container.querySelector('a[href="/books"]')).not.toBeNull();
    expect(container.querySelector('a[href="/register"]')).not.toBeNull();
  });
});
