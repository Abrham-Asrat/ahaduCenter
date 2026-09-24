// API operations for movies, reviews, and movie requests.
import API from './api';

export const movieService = {
  // GET /api/movies?q=&genre=&country=&page=&limit=
  getMovies: (params: object = {}) =>
    API.get('/movies', { params }).then((r) => r.data),

  // GET /api/movies/:id
  getMovie: (id: string) =>
    API.get(`/movies/${id}`).then((r) => r.data),

  // GET /api/movies/:id/reviews?page=&limit=
  getMovieReviews: (id: string, params: object = {}) =>
    API.get(`/movies/${id}/reviews`, { params }).then((r) => r.data),

  // POST /api/movies/:id/reviews  { rating, comment }  (auth required)
  createMovieReview: (id: string, payload: unknown) =>
    API.post(`/movies/${id}/reviews`, payload).then((r) => r.data),

  // POST /api/movie-requests  { title, year, reason, ... }  (auth required)
  submitMovieRequest: (payload: unknown) =>
    API.post('/movie-requests', payload).then((r) => r.data),

  // GET /api/users/me/movie-requests  (auth required)
  getUserMovieRequests: () =>
    API.get('/users/me/movie-requests').then((r) => r.data),

  // DELETE /api/movie-requests/:id  (auth required)
  cancelMovieRequest: (id: string) =>
    API.delete(`/movie-requests/${id}`).then((r) => r.data),
};
