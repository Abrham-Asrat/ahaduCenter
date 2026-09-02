import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movieService } from '../../services/movieService';

// ── Movie Thunks ──
export const fetchMovies = createAsyncThunk(
  'movie/fetchMovies',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await movieService.getMovies(params);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch movies');
    }
  }
);

export const fetchMovie = createAsyncThunk(
  'movie/fetchMovie',
  async (id, { rejectWithValue }) => {
    try {
      const data = await movieService.getMovie(id);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch movie');
    }
  }
);

export const fetchMovieReviews = createAsyncThunk(
  'movie/fetchMovieReviews',
  async (movieId, { rejectWithValue }) => {
    try {
      const data = await movieService.getMovieReviews(movieId);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch reviews');
    }
  }
);

export const createMovieReview = createAsyncThunk(
  'movie/createMovieReview',
  async ({ movieId, review }, { rejectWithValue }) => {
    try {
      const data = await movieService.createMovieReview(movieId, review);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to create review');
    }
  }
);

const initialState = {
  movies: [],
  currentMovie: null,
  reviews: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        // Handle different response formats
        if (Array.isArray(payload)) {
          state.movies = payload;
        } else if (payload.data && Array.isArray(payload.data)) {
          state.movies = payload.data;
          if (payload.pagination) {
            state.pagination = payload.pagination;
          }
        } else if (payload.movies && Array.isArray(payload.movies)) {
          state.movies = payload.movies;
          if (payload.pagination) {
            state.pagination = payload.pagination;
          }
        }
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Movie
      .addCase(fetchMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Movie Reviews
      .addCase(fetchMovieReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMovieReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Movie Review
      .addCase(createMovieReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMovieReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.reviews && Array.isArray(state.reviews)) {
          state.reviews.push(action.payload);
        }
      })
      .addCase(createMovieReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default movieSlice.reducer;
