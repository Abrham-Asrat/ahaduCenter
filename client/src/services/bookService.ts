// API operations for book catalog, borrowing, reservations, and reviews.
import API from './api';

export const bookService = {
  // GET /api/books?q=&category=&availability=&format=&language=&page=&limit=
  getBooks: (params: object = {}) =>
    API.get('/books', { params }).then((r) => r.data),

  // GET /api/books/:id
  getBook: (id: string) =>
    API.get(`/books/${id}`).then((r) => r.data),

  // POST /api/books/:id/borrow  (auth required)
  borrowBook: (id: string) =>
    API.post(`/books/${id}/borrow`).then((r) => r.data),

  // POST /api/books/:id/reserve  (auth required)
  reserveBook: (id: string) =>
    API.post(`/books/${id}/reserve`).then((r) => r.data),

  // GET /api/books/:id/reviews?page=&limit=
  getBookReviews: (id: string, params: object = {}) =>
    API.get(`/books/${id}/reviews`, { params }).then((r) => r.data),

  // POST /api/books/:id/reviews  { rating, comment }  (auth required)
  createBookReview: (id: string, payload: unknown) =>
    API.post(`/books/${id}/reviews`, payload).then((r) => r.data),
};
