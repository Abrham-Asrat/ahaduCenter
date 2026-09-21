// Stores book catalog, detail, and borrowing request state.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookService } from '../../services/bookService';
import type { Book, BookQuery, PaginationState, Review } from '../../types';

interface BookState {
  books: Book[];
  currentBook: Book | null;
  selectedBook: Book | null;
  reviews: Review[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// ── Book Thunks ──
export const fetchBooks = createAsyncThunk(
  'book/fetchBooks',
  async (params: BookQuery = {}, { rejectWithValue }) => {
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
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await bookService.getBook(id);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch book');
    }
  }
);

export const borrowBook = createAsyncThunk(
  'book/borrowBook',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const data = await bookService.borrowBook(bookId);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to borrow book');
    }
  }
);

export const reserveBook = createAsyncThunk(
  'book/reserveBook',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const data = await bookService.reserveBook(bookId);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to reserve book');
    }
  }
);

export const fetchBookReviews = createAsyncThunk(
  'book/fetchBookReviews',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const data = await bookService.getBookReviews(bookId);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch reviews');
    }
  }
);

export const createBookReview = createAsyncThunk(
  'book/createBookReview',
  async ({ bookId, review }: { bookId: string; review: { rating: number; comment: string } }, { rejectWithValue }) => {
    try {
      const data = await bookService.createBookReview(bookId, review);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to create review');
    }
  }
);

const initialState: BookState = {
  books: [],
  currentBook: null,
  selectedBook: null,
  reviews: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    totalItems: 0,
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
          state.pagination = payload.pagination || {
            page: payload.page ?? 1,
            limit: payload.limit ?? state.pagination.limit,
            total: payload.totalCount ?? 0,
            totalPages: payload.totalPages ?? 0,
          };
        } else if (payload.books && Array.isArray(payload.books)) {
          state.books = payload.books;
          state.pagination = payload.pagination || {
            page: payload.page ?? 1,
            limit: payload.limit ?? state.pagination.limit,
            total: payload.totalCount ?? 0,
            totalPages: payload.totalPages ?? 0,
          };
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
        state.selectedBook = action.payload;
      })
      .addCase(fetchBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Borrow Book
      .addCase(borrowBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(borrowBook.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(borrowBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reserve Book
      .addCase(reserveBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reserveBook.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(reserveBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Book Reviews
      .addCase(fetchBookReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = Array.isArray(action.payload)
          ? action.payload
          : (action.payload?.data ?? []);
      })
      .addCase(fetchBookReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Book Review
      .addCase(createBookReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.reviews && Array.isArray(state.reviews)) {
          state.reviews.push(action.payload);
        }
      })
      .addCase(createBookReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookSlice.reducer;
