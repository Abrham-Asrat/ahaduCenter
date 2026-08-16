/**
 * Tests for HeroSection responsive padding and button navigation (Task 5.1)
 * Validates: Requirements 2.1, 2.2, 8.1
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

// ShaderHero uses WebGL which is not available in jsdom — mock it out
vi.mock('../components/common/ShaderHero', () => ({
  default: () => <canvas data-testid="shader-hero" />,
}));

import HeroSection from '../components/common/HeroSection';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: render HeroSection inside a MemoryRouter
// ─────────────────────────────────────────────────────────────────────────────
const renderHero = () =>
  render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>
  );

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 8.1 — Responsive padding classes on outer <section>
// ─────────────────────────────────────────────────────────────────────────────
describe('HeroSection responsive padding (Requirement 8.1)', () => {
  it('outer <section> has px-4 class for mobile padding', () => {
    const { container } = renderHero();
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section.className).toContain('px-4');
  });

  it('outer <section> has lg:px-20 class for desktop padding', () => {
    const { container } = renderHero();
    const section = container.querySelector('section');
    expect(section.className).toContain('lg:px-20');
  });

  it('outer <section> does NOT have the old bare px-20 class', () => {
    const { container } = renderHero();
    const section = container.querySelector('section');
    // The class list should not contain a standalone "px-20" token
    const classes = section.className.split(/\s+/);
    expect(classes).not.toContain('px-20');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 2.1 — "Explore Now" navigates to /books
// ─────────────────────────────────────────────────────────────────────────────
describe('HeroSection "Explore Now" button (Requirement 2.1)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls navigate with /books when "Explore Now" is clicked', () => {
    renderHero();
    const exploreBtn = screen.getByRole('button', { name: /explore now/i });
    expect(exploreBtn).toBeInTheDocument();
    fireEvent.click(exploreBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/books');
  });

  it('does not navigate to any other path when "Explore Now" is clicked', () => {
    renderHero();
    const exploreBtn = screen.getByRole('button', { name: /explore now/i });
    fireEvent.click(exploreBtn);
    expect(mockNavigate).not.toHaveBeenCalledWith('/electronics');
    expect(mockNavigate).not.toHaveBeenCalledWith('/');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Requirement 2.2 — "Latest Arrivals" navigates to /electronics
// ─────────────────────────────────────────────────────────────────────────────
describe('HeroSection "Latest Arrivals" button (Requirement 2.2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls navigate with /electronics when "Latest Arrivals" is clicked', () => {
    renderHero();
    const latestBtn = screen.getByRole('button', { name: /latest arrivals/i });
    expect(latestBtn).toBeInTheDocument();
    fireEvent.click(latestBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/electronics');
  });

  it('does not navigate to any other path when "Latest Arrivals" is clicked', () => {
    renderHero();
    const latestBtn = screen.getByRole('button', { name: /latest arrivals/i });
    fireEvent.click(latestBtn);
    expect(mockNavigate).not.toHaveBeenCalledWith('/books');
    expect(mockNavigate).not.toHaveBeenCalledWith('/');
  });
});
