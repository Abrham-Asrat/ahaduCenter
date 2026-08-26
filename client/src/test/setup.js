import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ─── Global service mocks ─────────────────────────────────────────────────────
// All services make real HTTP calls via axios. Mock them globally so tests run
// without a backend and without network errors.

vi.mock('../services/contactService', () => ({
  contactService: {
    submitContact: vi.fn().mockResolvedValue({ message: 'ok' }),
  },
}));

vi.mock('../services/userService', () => ({
  userService: {
    getProfile: vi.fn().mockResolvedValue({ user: { name: 'Test User', email: 'test@example.com' } }),
    updateProfile: vi.fn().mockResolvedValue({ user: { name: 'Test User', email: 'test@example.com' } }),
    uploadAvatar: vi.fn().mockResolvedValue({ avatarUrl: 'https://example.com/avatar.jpg' }),
    getUserStats: vi.fn().mockResolvedValue({ favorites: 0, purchases: 0, borrowed: 0, requests: 0 }),
    getUserActivity: vi.fn().mockResolvedValue([]),
    getBorrowingHistory: vi.fn().mockResolvedValue([]),
    renewBorrowing: vi.fn().mockResolvedValue({}),
    returnBook: vi.fn().mockResolvedValue({}),
    getWishlist: vi.fn().mockResolvedValue([]),
    addToWishlist: vi.fn().mockResolvedValue({}),
    removeFromWishlist: vi.fn().mockResolvedValue({}),
    getNotifications: vi.fn().mockResolvedValue([]),
    markNotificationRead: vi.fn().mockResolvedValue({}),
    markAllNotificationsRead: vi.fn().mockResolvedValue({}),
    deleteAllNotifications: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('../services/orderService', () => ({
  orderService: {
    placeOrder: vi.fn().mockResolvedValue({}),
    getOrder: vi.fn().mockResolvedValue(null),
    getOrderHistory: vi.fn().mockResolvedValue({
      data: [],
      page: 1,
      totalPages: 10,
      totalCount: 10,
    }),
  },
}));

vi.mock('../services/searchService', () => ({
  searchService: {
    search: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../services/movieService', () => ({
  movieService: {
    getMovies: vi.fn().mockResolvedValue({ data: [], totalPages: 1 }),
    getMovie: vi.fn().mockResolvedValue(null),
    getMovieReviews: vi.fn().mockResolvedValue([]),
    createMovieReview: vi.fn().mockResolvedValue({}),
    submitMovieRequest: vi.fn().mockResolvedValue({}),
    getUserMovieRequests: vi.fn().mockResolvedValue([]),
    cancelMovieRequest: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('../services/bookService', () => ({
  bookService: {
    getBooks: vi.fn().mockResolvedValue({ data: [], totalPages: 1 }),
    getBook: vi.fn().mockResolvedValue(null),
    borrowBook: vi.fn().mockResolvedValue({}),
    reserveBook: vi.fn().mockResolvedValue({}),
    getBookReviews: vi.fn().mockResolvedValue([]),
    createBookReview: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn().mockResolvedValue({ token: 'fake-token', user: { name: 'Test', email: 'test@example.com', role: 'user' } }),
    register: vi.fn().mockResolvedValue({ token: 'fake-token', user: { name: 'Test', email: 'test@example.com', role: 'user' } }),
    forgotPassword: vi.fn().mockResolvedValue({ message: 'ok' }),
    resetPassword: vi.fn().mockResolvedValue({ message: 'ok' }),
  },
}));

vi.mock('../services/adminService', () => ({
  adminService: {
    getStats: vi.fn().mockResolvedValue({}),
    getRecentActivity: vi.fn().mockResolvedValue([]),
    getAdminBooks: vi.fn().mockResolvedValue([]),
    createBook: vi.fn().mockResolvedValue({}),
    updateBook: vi.fn().mockResolvedValue({}),
    deleteBook: vi.fn().mockResolvedValue({}),
    getAdminMovies: vi.fn().mockResolvedValue([]),
    createMovie: vi.fn().mockResolvedValue({}),
    updateMovie: vi.fn().mockResolvedValue({}),
    deleteMovie: vi.fn().mockResolvedValue({}),
    getAdminProducts: vi.fn().mockResolvedValue([]),
    createProduct: vi.fn().mockResolvedValue({}),
    updateProduct: vi.fn().mockResolvedValue({}),
    deleteProduct: vi.fn().mockResolvedValue({}),
    getMovieRequests: vi.fn().mockResolvedValue([]),
    updateMovieRequestStatus: vi.fn().mockResolvedValue({}),
    getContactSubmissions: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../services/productService', () => ({
  productService: {
    getProducts: vi.fn().mockResolvedValue({ data: [], totalCount: 0, page: 1, totalPages: 1, limit: 12 }),
    getProduct: vi.fn().mockResolvedValue(null),
  },
}));
