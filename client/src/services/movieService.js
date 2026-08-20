import API from './api';

export const movieService = {
  // GET /api/movies?search=&genres=&country=&type=&sort=&page=&limit=
  getMovies: (params = {}) =>
    API.get('/movies', { params }).then((r) => r.data),

  // GET /api/movies/:id
  getMovie: (id) =>
    API.get(`/movies/${id}`).then((r) => r.data),

  // GET /api/movies/:id/reviews?page=&limit=
  getMovieReviews: (id, params = {}) =>
    API.get(`/movies/${id}/reviews`, { params }).then((r) => r.data),

  // POST /api/movies/:id/reviews  { rating, comment }  (auth required)
  createMovieReview: (id, payload) =>
    API.post(`/movies/${id}/reviews`, payload).then((r) => r.data),

  // POST /api/movie-requests  { title, year, reason, ... }  (auth required)
  submitMovieRequest: (payload) =>
    API.post('/movie-requests', payload).then((r) => r.data),

  // GET /api/users/me/movie-requests  (auth required)
  getUserMovieRequests: () =>
    API.get('/users/me/movie-requests').then((r) => r.data),

  // DELETE /api/movie-requests/:id  (auth required)
  cancelMovieRequest: (id) =>
    API.delete(`/movie-requests/${id}`).then((r) => r.data),
};
