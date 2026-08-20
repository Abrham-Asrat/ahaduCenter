import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movieService } from '../../services/movieService';

// ── 13.2: fetchMovies thunk ───────────────────────────────────────────────────
// Server envelope: { data: [...], totalCount, page, totalPages, limit }
export const fetchMovies = createAsyncThunk(
  'movie/fetchMovies',
  async (params, { rejectWithValue }) => {
    try {
      return await movieService.getMovies(params);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 13.3: fetchMovie thunk ────────────────────────────────────────────────────
export const fetchMovie = createAsyncThunk(
  'movie/fetchMovie',
  async (id, { rejectWithValue }) => {
    try {
      return await movieService.getMovie(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 13.4: fetchMovieReviews thunk ─────────────────────────────────────────────
export const fetchMovieReviews = createAsyncThunk(
  'movie/fetchMovieReviews',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      return await movieService.getMovieReviews(id, params);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 13.5: createMovieReview thunk ─────────────────────────────────────────────
export const createMovieReview = createAsyncThunk(
  'movie/createMovieReview',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await movieService.createMovieReview(id, payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 13.1: Initial state ───────────────────────────────────────────────────────
const initialState = {
  movies:        [],
  selectedMovie: null,
  reviews:       [],
  loading:       false,
  error:         null,
  pagination: {
    totalItems:  0,
    totalPages:  0,
    currentPage: 1,
    limit:       12,
  },
};

// ── Slice ─────────────────────────────────────────────────────────────────────
export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {},
  // ── 13.6: pending / rejected wiring + fulfilled cases ─────────────────────
  extraReducers: (builder) => {
    // Collect all thunks for pending/rejected wiring
    const thunks = [
      fetchMovies,
      fetchMovie,
      fetchMovieReviews,
      createMovieReview,
    ];

    thunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error   = null;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error   = action.payload;
        });
    });

    // ── Fulfilled cases ──────────────────────────────────────────────────────

    // 13.2: fetchMovies — map server envelope to slice state
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.loading    = false;
      state.movies     = action.payload.data;
      state.pagination = {
        totalItems:  action.payload.totalCount,
        totalPages:  action.payload.totalPages,
        currentPage: action.payload.page,
        limit:       action.payload.limit,
      };
    });

    // 13.3: fetchMovie — set selectedMovie
    builder.addCase(fetchMovie.fulfilled, (state, action) => {
      state.loading       = false;
      state.selectedMovie = action.payload;
    });

    // 13.4: fetchMovieReviews — set reviews
    builder.addCase(fetchMovieReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });

    // 13.5: createMovieReview — append new review to reviews array
    builder.addCase(createMovieReview.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = [...state.reviews, action.payload];
    });
  },
});

export default movieSlice.reducer;
