import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookService } from '../../services/bookService';

// ── 10.2: fetchBooks thunk ────────────────────────────────────────────────────
// Server envelope: { data: [...], totalCount, page, totalPages, limit }
export const fetchBooks = createAsyncThunk(
  'book/fetchBooks',
  async (params, { rejectWithValue }) => {
    try {
      return await bookService.getBooks(params);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 10.3: fetchBook thunk ─────────────────────────────────────────────────────
export const fetchBook = createAsyncThunk(
  'book/fetchBook',
  async (id, { rejectWithValue }) => {
    try {
      return await bookService.getBook(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 10.4: borrowBook thunk ────────────────────────────────────────────────────
export const borrowBook = createAsyncThunk(
  'book/borrowBook',
  async (id, { rejectWithValue }) => {
    try {
      return await bookService.borrowBook(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 10.5: reserveBook thunk ───────────────────────────────────────────────────
export const reserveBook = createAsyncThunk(
  'book/reserveBook',
  async (id, { rejectWithValue }) => {
    try {
      return await bookService.reserveBook(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 10.6: fetchBookReviews thunk ──────────────────────────────────────────────
export const fetchBookReviews = createAsyncThunk(
  'book/fetchBookReviews',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      return await bookService.getBookReviews(id, params);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 10.7: createBookReview thunk ──────────────────────────────────────────────
export const createBookReview = createAsyncThunk(
  'book/createBookReview',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await bookService.createBookReview(id, payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 10.1: Initial state ───────────────────────────────────────────────────────
const initialState = {
  books:        [],
  selectedBook: null,
  reviews:      [],
  loading:      false,
  error:        null,
  pagination: {
    totalItems:  0,
    totalPages:  0,
    currentPage: 1,
    limit:       12,
  },
};

// ── Slice ─────────────────────────────────────────────────────────────────────
export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {},
  // ── 10.8: pending / rejected wiring + fulfilled cases ─────────────────────
  extraReducers: (builder) => {
    // Helper to collect all thunks for pending/rejected wiring
    const thunks = [
      fetchBooks,
      fetchBook,
      borrowBook,
      reserveBook,
      fetchBookReviews,
      createBookReview,
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

    // 10.2: fetchBooks — map server envelope to slice state
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      state.loading       = false;
      state.books         = action.payload.data;
      state.pagination    = {
        totalItems:  action.payload.totalCount,
        totalPages:  action.payload.totalPages,
        currentPage: action.payload.page,
        limit:       action.payload.limit,
      };
    });

    // 10.3: fetchBook — set selectedBook
    builder.addCase(fetchBook.fulfilled, (state, action) => {
      state.loading      = false;
      state.selectedBook = action.payload;
    });

    // 10.4: borrowBook — return payload for page to display (no state mutation needed)
    builder.addCase(borrowBook.fulfilled, (state) => {
      state.loading = false;
    });

    // 10.5: reserveBook — return payload for page to display (no state mutation needed)
    builder.addCase(reserveBook.fulfilled, (state) => {
      state.loading = false;
    });

    // 10.6: fetchBookReviews — set reviews
    builder.addCase(fetchBookReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });

    // 10.7: createBookReview — append new review to reviews array
    builder.addCase(createBookReview.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = [...state.reviews, action.payload];
    });
  },
});

export default bookSlice.reducer;
