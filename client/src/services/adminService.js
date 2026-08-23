import API from './api';

export const adminService = {
  // ── Dashboard ──
  getStats: () => API.get('/admin/stats').then((r) => r.data),
  getRecentActivity: () => API.get('/admin/recent').then((r) => r.data),

  // ── Books CRUD ──
  getAdminBooks: (params) => API.get('/admin/books', { params }).then((r) => r.data),
  createBook: (payload) => API.post('/admin/books', payload).then((r) => r.data),
  updateBook: (id, payload) => API.put(`/admin/books/${id}`, payload).then((r) => r.data),
  deleteBook: (id) => API.delete(`/admin/books/${id}`).then((r) => r.data),

  // ── Movies CRUD ──
  getAdminMovies: (params) => API.get('/admin/movies', { params }).then((r) => r.data),
  createMovie: (payload) => API.post('/admin/movies', payload).then((r) => r.data),
  updateMovie: (id, payload) => API.put(`/admin/movies/${id}`, payload).then((r) => r.data),
  deleteMovie: (id) => API.delete(`/admin/movies/${id}`).then((r) => r.data),

  // ── Products CRUD ──
  getAdminProducts: (params) => API.get('/admin/products', { params }).then((r) => r.data),
  createProduct: (payload) => API.post('/admin/products', payload).then((r) => r.data),
  updateProduct: (id, payload) => API.put(`/admin/products/${id}`, payload).then((r) => r.data),
  deleteProduct: (id) => API.delete(`/admin/products/${id}`).then((r) => r.data),

  // ── Movie Requests ──
  getMovieRequests: () => API.get('/admin/movie-requests').then((r) => r.data),
  updateMovieRequestStatus: (id, status) =>
    API.patch(`/admin/movie-requests/${id}`, { status }).then((r) => r.data),

  // ── Contact Submissions ──
  getContactSubmissions: () => API.get('/admin/contacts').then((r) => r.data),
};
