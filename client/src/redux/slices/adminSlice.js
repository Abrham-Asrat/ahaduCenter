import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';

// ── Dashboard Thunks ──
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminService.getStats();
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch admin stats');
    }
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'admin/fetchRecentActivity',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminService.getRecentActivity();
      return Array.isArray(data) ? data : (data?.activities ?? []);
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch recent activity');
    }
  }
);

// ── Book Thunks ──
export const fetchAdminBooks = createAsyncThunk(
  'admin/fetchAdminBooks',
  async (params, { rejectWithValue }) => {
    try {
      const data = await adminService.getAdminBooks(params);
      return Array.isArray(data) ? data : (data?.data ?? data?.books ?? []);
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch admin books');
    }
  }
);

export const createBook = createAsyncThunk(
  'admin/createBook',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await adminService.createBook(payload);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to create book');
    }
  }
);

export const updateBook = createAsyncThunk(
  'admin/updateBook',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await adminService.updateBook(id, payload);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to update book');
    }
  }
);

export const deleteBook = createAsyncThunk(
  'admin/deleteBook',
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deleteBook(id);
      return id;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to delete book');
    }
  }
);

// ── Movie Thunks ──
export const fetchAdminMovies = createAsyncThunk(
  'admin/fetchAdminMovies',
  async (params, { rejectWithValue }) => {
    try {
      const data = await adminService.getAdminMovies(params);
      return Array.isArray(data) ? data : (data?.data ?? data?.movies ?? []);
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch admin movies');
    }
  }
);

export const createMovie = createAsyncThunk(
  'admin/createMovie',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await adminService.createMovie(payload);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to create movie');
    }
  }
);

export const updateMovie = createAsyncThunk(
  'admin/updateMovie',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await adminService.updateMovie(id, payload);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to update movie');
    }
  }
);

export const deleteMovie = createAsyncThunk(
  'admin/deleteMovie',
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deleteMovie(id);
      return id;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to delete movie');
    }
  }
);

// ── Product Thunks ──
export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchAdminProducts',
  async (params, { rejectWithValue }) => {
    try {
      const data = await adminService.getAdminProducts(params);
      return Array.isArray(data) ? data : (data?.data ?? data?.products ?? []);
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch admin products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await adminService.createProduct(payload);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await adminService.updateProduct(id, payload);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deleteProduct(id);
      return id;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to delete product');
    }
  }
);

// ── Movie Request Thunks ──
export const fetchMovieRequests = createAsyncThunk(
  'admin/fetchMovieRequests',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminService.getMovieRequests();
      return Array.isArray(data) ? data : (data?.requests ?? []);
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch movie requests');
    }
  }
);

export const updateMovieRequestStatus = createAsyncThunk(
  'admin/updateMovieRequestStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await adminService.updateMovieRequestStatus(id, status);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to update movie request status');
    }
  }
);

// ── Contact Submission Thunk ──
export const fetchContactSubmissions = createAsyncThunk(
  'admin/fetchContactSubmissions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminService.getContactSubmissions();
      return Array.isArray(data) ? data : (data?.contacts ?? []);
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch contact submissions');
    }
  }
);

const initialState = {
  stats: null,
  recentActivity: [],
  books: [],
  movies: [],
  products: [],
  movieRequests: [],
  contactSubmissions: [],
  loading: false,
  error: null,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Stats
      .addCase(fetchAdminStats.pending, handlePending)
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, handleRejected)

      // Recent Activity
      .addCase(fetchRecentActivity.pending, handlePending)
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, handleRejected)

      // Books
      .addCase(fetchAdminBooks.pending, handlePending)
      .addCase(fetchAdminBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchAdminBooks.rejected, handleRejected)

      .addCase(createBook.pending, handlePending)
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, handleRejected)

      .addCase(updateBook.pending, handlePending)
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const targetId = updated._id || updated.id;
        const index = state.books.findIndex((b) => (b._id || b.id) === targetId);
        if (index !== -1) {
          state.books[index] = updated;
        }
      })
      .addCase(updateBook.rejected, handleRejected)

      .addCase(deleteBook.pending, handlePending)
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.books = state.books.filter((b) => (b._id || b.id) !== id);
      })
      .addCase(deleteBook.rejected, handleRejected)

      // Movies
      .addCase(fetchAdminMovies.pending, handlePending)
      .addCase(fetchAdminMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchAdminMovies.rejected, handleRejected)

      .addCase(createMovie.pending, handlePending)
      .addCase(createMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.push(action.payload);
      })
      .addCase(createMovie.rejected, handleRejected)

      .addCase(updateMovie.pending, handlePending)
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const targetId = updated._id || updated.id;
        const index = state.movies.findIndex((m) => (m._id || m.id) === targetId);
        if (index !== -1) {
          state.movies[index] = updated;
        }
      })
      .addCase(updateMovie.rejected, handleRejected)

      .addCase(deleteMovie.pending, handlePending)
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.movies = state.movies.filter((m) => (m._id || m.id) !== id);
      })
      .addCase(deleteMovie.rejected, handleRejected)

      // Products
      .addCase(fetchAdminProducts.pending, handlePending)
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, handleRejected)

      .addCase(createProduct.pending, handlePending)
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, handleRejected)

      .addCase(updateProduct.pending, handlePending)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const targetId = updated._id || updated.id;
        const index = state.products.findIndex((p) => (p._id || p.id) === targetId);
        if (index !== -1) {
          state.products[index] = updated;
        }
      })
      .addCase(updateProduct.rejected, handleRejected)

      .addCase(deleteProduct.pending, handlePending)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.products = state.products.filter((p) => (p._id || p.id) !== id);
      })
      .addCase(deleteProduct.rejected, handleRejected)

      // Movie Requests
      .addCase(fetchMovieRequests.pending, handlePending)
      .addCase(fetchMovieRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.movieRequests = action.payload;
      })
      .addCase(fetchMovieRequests.rejected, handleRejected)

      .addCase(updateMovieRequestStatus.pending, handlePending)
      .addCase(updateMovieRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const targetId = updated._id || updated.id;
        const index = state.movieRequests.findIndex((r) => (r._id || r.id) === targetId);
        if (index !== -1) {
          state.movieRequests[index] = updated;
        }
      })
      .addCase(updateMovieRequestStatus.rejected, handleRejected)

      // Contact Submissions
      .addCase(fetchContactSubmissions.pending, handlePending)
      .addCase(fetchContactSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.contactSubmissions = action.payload;
      })
      .addCase(fetchContactSubmissions.rejected, handleRejected);
  },
});

export default adminSlice.reducer;
