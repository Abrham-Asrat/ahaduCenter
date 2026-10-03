import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HomeFeatured from '../components/home/HomeFeatured';
import HomeHero from '../components/home/HomeHero';
import { store } from '../redux/store';
import '../i18n/config';

const renderWithRouter = (component: ReactNode) =>
  render(
    <Provider store={store}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>,
  );

describe('homepage interactions', () => {
  it('exposes both hero calls to action on mobile and desktop', () => {
    renderWithRouter(<HomeHero />);

    expect(screen.getAllByRole('link', { name: /explore catalog/i })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: /sign up free/i })).toHaveLength(2);
  });

  it('routes featured actions to their matching catalog areas', () => {
    renderWithRouter(<HomeFeatured />);

    expect(screen.getAllByRole('link', { name: /watch/i }).every((link) => link.getAttribute('href') === '/movies')).toBe(true);
    expect(screen.getAllByRole('link', { name: /get book/i }).every((link) => link.getAttribute('href') === '/books')).toBe(true);
    expect(screen.getAllByRole('link', { name: /order/i }).every((link) => link.getAttribute('href') === '/electronics')).toBe(true);
    expect(screen.getByRole('link', { name: /view all featured/i })).toHaveAttribute('href', '/search');
  });
});
