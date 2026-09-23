import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HomeFeatured from '../components/home/HomeFeatured';
import HomeHero from '../components/home/HomeHero';

const renderWithRouter = (component: ReactNode) =>
  render(<MemoryRouter>{component}</MemoryRouter>);

describe('homepage interactions', () => {
  it('exposes both hero calls to action on mobile and desktop', () => {
    renderWithRouter(<HomeHero />);

    expect(screen.getAllByRole('link', { name: /explore catalog/i })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: /sign up free/i })).toHaveLength(2);
  });

  it('routes featured actions to their matching catalog areas', () => {
    renderWithRouter(<HomeFeatured />);

    expect(screen.getByRole('link', { name: /watch/i })).toHaveAttribute('href', '/movies');
    expect(screen.getByRole('link', { name: /get book/i })).toHaveAttribute('href', '/books');
    expect(screen.getByRole('link', { name: /order/i })).toHaveAttribute('href', '/electronics');
    expect(screen.getByRole('link', { name: /borrow/i })).toHaveAttribute('href', '/books');
    expect(screen.getByRole('link', { name: /view all featured/i })).toHaveAttribute('href', '/search');
  });
});
