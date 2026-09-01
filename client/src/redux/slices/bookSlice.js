import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookService } from '../../services/bookService';

// ── Book Thunks ──
export const fetchBooks = createAsyncThunk(
  'book/fetchBooks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await bookService.getBooks(params);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch books');
    }
  }
);

export const fetchBook = createAsyncThunk(
  'book/fetchBook',
  async (id, { rejectWithValue }) => {
    try {
      const data = await bookService.getBook(id);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch book');
    }
  }
);

const initialState = {
  books: [],
  currentBook: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        // Handle different response formats
        if (Array.isArray(payload)) {
          state.books = payload;
        } else if (payload.data && Array.isArray(payload.data)) {
          state.books = payload.data;
          if (payload.pagination) {
            state.pagination = payload.pagination;
          }
        } else if (payload.books && Array.isArray(payload.books)) {
          state.books = payload.books;
          if (payload.pagination) {
            state.pagination = payload.pagination;
          }
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Book
      .addCase(fetchBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookSlice.reducer;
