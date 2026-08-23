// Feature: ui-fixes-responsiveness-animations, Property 7: Page entrance animation class is always present

/**
 * Property 7: Page entrance animation class is always present
 *
 * For each of the 15 pages listed in Requirement 11.1, render the page component
 * (wrapping in MemoryRouter + Redux Provider where needed), query the outermost
 * <div>, assert it has CSS class `animate-fade-in`.
 *
 * **Validates: Requirements 11.1**
 */
import React from 'react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as fc from 'fast-check';

// ─── Page imports ──────────────────────────────────────────────────────────────
import LoginPage from '../../pages/LoginPage';
import ForgotPasswordPage from '../../pages/ForgotPasswordPage';
import SearchResultsPage from '../../pages/SearchResultsPage';
import MovieRequestPage from '../../pages/MovieRequestPage';
import BookConfirmPage from '../../pages/BookConfirmPage';
import OrderConfirmationPage from '../../pages/OrderConfirmationPage';
import ProductComparisonPage from '../../pages/ProductComparisonPage';
import AdminDashboardPage from '../../pages/admin/AdminDashboardPage';
import WishlistPage from '../../pages/WishlistPage';
import NotificationsPage from '../../pages/NotificationsPage';
import RegisterPage from '../../pages/RegisterPage';
import ContactPage from '../../pages/ContactPage';
import BorrowingHistoryPage from '../../pages/BorrowingHistoryPage';
import UserDashboardPage from '../../pages/UserDashboardPage';
import PurchaseHistoryPage from '../../pages/PurchaseHistoryPage';

// ─── Mock external services to avoid real HTTP calls ──────────────────────────

vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    forgotPassword: vi.fn(),
  },
}));

vi.mock('../../services/bookService', () => ({
  bookService: {
    borrowBook: vi.fn(),
    reserveBook: vi.fn(),
    getBooks: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../../services/movieService', () => ({
  movieService: {
    getMovies: vi.fn().mockResolvedValue([]),
    getUserMovieRequests: vi.fn().mockResolvedValue([]),
    submitMovieRequest: vi.fn(),
    cancelMovieRequest: vi.fn(),
  },
}));

vi.mock('../../services/orderService', () => ({
  orderService: {
    getOrderHistory: vi.fn().mockResolvedValue([]),
    getOrder: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock('../../services/userService', () => ({
  userService: {
    getProfile: vi.fn().mockResolvedValue({ user: { name: 'Test', email: 'test@test.com' } }),
    getUserStats: vi.fn().mockResolvedValue({}),
    getUserActivity: vi.fn().mockResolvedValue([]),
    getBorrowingHistory: vi.fn().mockResolvedValue([]),
    returnBook: vi.fn(),
    renewBorrowing: vi.fn(),
    updateProfile: vi.fn(),
    uploadAvatar: vi.fn(),
  },
}));

vi.mock('../../services/searchService', () => ({
  searchService: {
    search: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../../services/contactService', () => ({
  contactService: {
    submitContact: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('../../services/adminService', () => ({
  adminService: {
    getStats: vi.fn().mockResolvedValue({}),
    getRecentActivity: vi.fn().mockResolvedValue([]),
  },
}));

// ─── Minimal mock Redux store ──────────────────────────────────────────────────

/**
 * Build a minimal Redux store with all required slices using static reducers.
 * This avoids real API calls while providing the shape components expect.
 */
function buildMockStore() {
  const noop = (state = {}, _action) => state;

  const authInitial = { user: null, token: null, loading: false, error: null, initialized: true };
  const bookInitial = { books: [], selectedBook: null, loading: false, error: null };
  const movieInitial = { movies: [], selectedMovie: null, loading: false, error: null };
  const productInitial = { products: [], selectedProduct: null, loading: false, error: null };
  const wishlistInitial = { items: [], loading: false, error: null };
  const notificationInitial = { notifications: [], unreadCount: 0, loading: false, error: null };
  const adminInitial = { stats: {}, recentActivity: [], loading: false, error: null };

  return configureStore({
    reducer: {
      auth: (state = authInitial, action) => state,
      book: (state = bookInitial, action) => state,
      movie: (state = movieInitial, action) => state,
      product: (state = productInitial, action) => state,
      wishlist: (state = wishlistInitial, action) => state,
      notification: (state = notificationInitial, action) => state,
      admin: (state = adminInitial, action) => state,
    },
  });
}

// ─── Render helper ─────────────────────────────────────────────────────────────

/**
 * Renders a page component wrapped in MemoryRouter + Redux Provider.
 * Returns the container element from React Testing Library.
 */
function renderPage(PageComponent, initialEntry = '/') {
  const mockStore = buildMockStore();
  const { container } = render(
    <Provider store={mockStore}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <PageComponent />
      </MemoryRouter>
    </Provider>
  );
  return container;
}

/**
 * Returns the element to check for `animate-fade-in`.
 *
 * - For most pages the outermost rendered element (container.firstChild) is the
 *   page's root <div> which carries the class.
 * - For AdminDashboardPage, the root is AdminLayout's outer wrapper; the
 *   animate-fade-in lives on the first child div rendered by the page itself
 *   inside AdminLayout's <main>. Use querySelector to locate it.
 */
function getAnimatedElement(container, isAdminPage = false) {
  if (isAdminPage) {
    // AdminDashboardPage renders <AdminLayout> which wraps page content in a <main>.
    // The animate-fade-in class is on the first <div> inside that <main>.
    return container.querySelector('.animate-fade-in');
  }
  return container.firstChild;
}

// ─── Individual page tests (Property 7) ───────────────────────────────────────

describe('Property 7: Page entrance animation class is always present', () => {

  it('LoginPage outermost div has animate-fade-in', () => {
    const container = renderPage(LoginPage, '/login');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('ForgotPasswordPage outermost div has animate-fade-in', () => {
    const container = renderPage(ForgotPasswordPage, '/forgot-password');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('SearchResultsPage outermost div has animate-fade-in', () => {
    const container = renderPage(SearchResultsPage, '/search');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('MovieRequestPage outermost div has animate-fade-in', () => {
    const container = renderPage(MovieRequestPage, '/movie-request');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('BookConfirmPage outermost div has animate-fade-in', () => {
    const container = renderPage(BookConfirmPage, '/book-confirm');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('OrderConfirmationPage outermost div has animate-fade-in', () => {
    const container = renderPage(OrderConfirmationPage, '/order-confirmation');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('ProductComparisonPage outermost div has animate-fade-in', () => {
    const container = renderPage(ProductComparisonPage, '/compare');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('AdminDashboardPage has animate-fade-in on its content div', () => {
    const container = renderPage(AdminDashboardPage, '/admin');
    // AdminDashboardPage wraps children inside AdminLayout; the animate-fade-in
    // class is on the first inner div (page content), not AdminLayout's outer wrapper.
    const el = getAnimatedElement(container, true);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('WishlistPage outermost div has animate-fade-in', () => {
    const container = renderPage(WishlistPage, '/wishlist');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('NotificationsPage outermost div has animate-fade-in', () => {
    const container = renderPage(NotificationsPage, '/notifications');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('RegisterPage outermost div has animate-fade-in', () => {
    const container = renderPage(RegisterPage, '/register');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('ContactPage outermost div has animate-fade-in', () => {
    const container = renderPage(ContactPage, '/contact');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('BorrowingHistoryPage outermost div has animate-fade-in', () => {
    const container = renderPage(BorrowingHistoryPage, '/borrowing-history');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('UserDashboardPage outermost div has animate-fade-in', () => {
    const container = renderPage(UserDashboardPage, '/account');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

  it('PurchaseHistoryPage outermost div has animate-fade-in', () => {
    const container = renderPage(PurchaseHistoryPage, '/purchase-history');
    const el = getAnimatedElement(container);
    expect(el).not.toBeNull();
    expect(el.classList.contains('animate-fade-in')).toBe(true);
  });

});

// ─── Property-based test (fast-check) ─────────────────────────────────────────

/**
 * Property 7 (property-based): For any of the 15 pages, rendering it always
 * yields an element with the animate-fade-in class.
 * We verify this holds by sampling random page indices with fast-check.
 *
 * **Validates: Requirements 11.1**
 */
describe('Property 7 (fast-check): animate-fade-in is always present across all 15 pages', () => {

  const pages = [
    { name: 'LoginPage',             Component: LoginPage,             route: '/login',               isAdmin: false },
    { name: 'ForgotPasswordPage',    Component: ForgotPasswordPage,    route: '/forgot-password',     isAdmin: false },
    { name: 'SearchResultsPage',     Component: SearchResultsPage,     route: '/search',              isAdmin: false },
    { name: 'MovieRequestPage',      Component: MovieRequestPage,      route: '/movie-request',       isAdmin: false },
    { name: 'BookConfirmPage',       Component: BookConfirmPage,       route: '/book-confirm',        isAdmin: false },
    { name: 'OrderConfirmationPage', Component: OrderConfirmationPage, route: '/order-confirmation',  isAdmin: false },
    { name: 'ProductComparisonPage', Component: ProductComparisonPage, route: '/compare',             isAdmin: false },
    { name: 'AdminDashboardPage',    Component: AdminDashboardPage,    route: '/admin',               isAdmin: true  },
    { name: 'WishlistPage',          Component: WishlistPage,          route: '/wishlist',            isAdmin: false },
    { name: 'NotificationsPage',     Component: NotificationsPage,     route: '/notifications',       isAdmin: false },
    { name: 'RegisterPage',          Component: RegisterPage,          route: '/register',            isAdmin: false },
    { name: 'ContactPage',           Component: ContactPage,           route: '/contact',             isAdmin: false },
    { name: 'BorrowingHistoryPage',  Component: BorrowingHistoryPage,  route: '/borrowing-history',   isAdmin: false },
    { name: 'UserDashboardPage',     Component: UserDashboardPage,     route: '/account',             isAdmin: false },
    { name: 'PurchaseHistoryPage',   Component: PurchaseHistoryPage,   route: '/purchase-history',    isAdmin: false },
  ];

  it('every page has animate-fade-in (fast-check over page index)', () => {
    fc.assert(
      fc.property(
        // Generate an index into the pages array
        fc.integer({ min: 0, max: pages.length - 1 }),
        (idx) => {
          const { Component, route, isAdmin } = pages[idx];
          const container = renderPage(Component, route);
          const el = getAnimatedElement(container, isAdmin);
          return el !== null && el.classList.contains('animate-fade-in');
        }
      ),
      { numRuns: 10 }
    );
  });

});
