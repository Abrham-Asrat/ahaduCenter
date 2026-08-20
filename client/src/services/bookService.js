import API from './api';

export const bookService = {
  // GET /api/books?search=&category=&availability=&format=&language=&sort=&page=&limit=
  getBooks: (params = {}) =>
    API.get('/books', { params }).then((r) => r.data),

  // GET /api/books/:id
  getBook: (id) =>
    API.get(`/books/${id}`).then((r) => r.data),

  // POST /api/books/:id/borrow  (auth required)
  borrowBook: (id) =>
    API.post(`/books/${id}/borrow`).then((r) => r.data),

  // POST /api/books/:id/reserve  (auth required)
  reserveBook: (id) =>
    API.post(`/books/${id}/reserve`).then((r) => r.data),

  // GET /api/books/:id/reviews?page=&limit=
  getBookReviews: (id, params = {}) =>
    API.get(`/books/${id}/reviews`, { params }).then((r) => r.data),

  // POST /api/books/:id/reviews  { rating, comment }  (auth required)
  createBookReview: (id, payload) =>
    API.post(`/books/${id}/reviews`, payload).then((r) => r.data),
};
