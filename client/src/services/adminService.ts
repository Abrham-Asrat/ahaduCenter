// API operations for administrator dashboards and content management.
import API from './api';

type AdminParams = Record<string, unknown>;
type AdminPayload = Record<string, unknown>;

export const adminService = {
  // ── Dashboard ──
  getStats: () => API.get('/admin/stats').then((r) => r.data),
  getRecentActivity: () => API.get('/admin/recent').then((r) => r.data),

  // ── Books CRUD ──
  getAdminBooks: (params: AdminParams = {}) => API.get('/admin/books', { params }).then((r) => r.data),
  createBook: (payload: AdminPayload) => API.post('/admin/books', payload).then((r) => r.data),
  updateBook: (id: string, payload: AdminPayload) => API.put(`/admin/books/${id}`, payload).then((r) => r.data),
  deleteBook: (id: string) => API.delete(`/admin/books/${id}`).then((r) => r.data),

  // ── Movies CRUD ──
  getAdminMovies: (params: AdminParams = {}) => API.get('/admin/movies', { params }).then((r) => r.data),
  createMovie: (payload: AdminPayload) => API.post('/admin/movies', payload).then((r) => r.data),
  updateMovie: (id: string, payload: AdminPayload) => API.put(`/admin/movies/${id}`, payload).then((r) => r.data),
  deleteMovie: (id: string) => API.delete(`/admin/movies/${id}`).then((r) => r.data),

  // ── Products CRUD ──
  getAdminProducts: (params: AdminParams = {}) => API.get('/admin/products', { params }).then((r) => r.data),
  createProduct: (payload: AdminPayload) => API.post('/admin/products', payload).then((r) => r.data),
  updateProduct: (id: string, payload: AdminPayload) => API.put(`/admin/products/${id}`, payload).then((r) => r.data),
  deleteProduct: (id: string) => API.delete(`/admin/products/${id}`).then((r) => r.data),

  // ── Movie Requests ──
  getMovieRequests: () => API.get('/admin/movie-requests').then((r) => r.data),
  updateMovieRequestStatus: (id: string, status: string) =>
    API.patch(`/admin/movie-requests/${id}/status`, { status }).then((r) => r.data),

  // ── Contact Submissions ──
  getContactSubmissions: () => API.get('/admin/contacts').then((r) => r.data),
};
