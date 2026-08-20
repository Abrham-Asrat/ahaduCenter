# Design Document: Full-Stack Integration

## Overview

This document describes the technical design for connecting the AhaduCenter React frontend to the existing Node.js/Express backend. The frontend currently renders hardcoded mock arrays and uses fake localStorage-based authentication. This integration replaces every mock dataset and fake auth flow with real API calls routed through a structured service layer, Redux Toolkit slices, and route guard components.

The backend is fully implemented and unchanged by this work. All changes are on the client side, plus a database seed script on the server.

---

## Architecture

### Client–Server Communication

```
┌─────────────────────────────────────────────────────────┐
│                    React SPA (port 5173)                 │
│                                                         │
│  Page Component                                         │
│       │ useSelector / useDispatch                       │
│       ▼                                                 │
│  Redux Slice (createAsyncThunk)                         │
│       │ calls                                           │
│       ▼                                                 │
│  Service Layer (authService, bookService, …)            │
│       │ axios call via                                  │
│       ▼                                                 │
│  api.js  ──── request interceptor (attach Bearer token) │
│       │                                                 │
│       ▼                                                 │
│  response interceptor ◄── 401 → logoutAction + /login  │
│  response interceptor ◄── non-2xx → extract error str  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/JSON over CORS
┌───────────────────────▼─────────────────────────────────┐
│               Express API (port 5000)                    │
│               Base path: /api                            │
│                                                          │
│  Routes → Controllers → Mongoose Models → MongoDB        │
│                                                          │
│  Auth middleware verifies JWT on protected routes        │
└──────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action (click / form submit)
    │
    ▼
Page dispatches Redux thunk
    │
    ▼
Thunk calls Service function  ──►  api.js Axios instance
    │                                   │
    │                         Request interceptor:
    │                         attach Authorization header
    │                                   │
    │                         ◄── HTTP response
    │                         Response interceptor:
    │                         extract error string on non-2xx
    │                         dispatch logoutAction on 401
    │
    ▼
Thunk receives data / error
    │
    ├── fulfilled → Redux state updated (books, user, etc.)
    └── rejected  → Redux state error field set
                        │
                        ▼
                  Page re-renders via useSelector
                  (shows data, skeleton, or error banner)
```

### Technology Stack

| Layer | Technology | Status |
|---|---|---|
| Frontend framework | React 18 + Vite | Existing |
| Routing | React Router v6 | Existing |
| State management | Redux Toolkit | Existing (slices are stubs) |
| HTTP client | Axios | Existing |
| Token decode | `jwt-decode` | **To be installed** |
| Backend | Node.js + Express 4 | Existing, complete |
| Database | MongoDB + Mongoose 8 | Existing, complete |
| Auth | JWT (jsonwebtoken) | Existing, complete |
| Testing (client) | Vitest + fast-check | Existing |
| Testing (server) | Jest + fast-check | Existing |

> Install `jwt-decode` on the client: `npm install jwt-decode@^4.0.0`

---

## Client Folder Structure

### Files to Create

```
client/src/
  components/common/
    ProtectedRoute.jsx          ← new route guard
    AdminRoute.jsx              ← new route guard
  services/
    contactService.js           ← new (no stub exists)
server/src/
  seed.js                       ← new seed script
```

### Files to Modify

```
client/src/
  services/
    api.js                      ← add correct baseURL + both interceptors
    authService.js              ← implement all 4 functions
    bookService.js              ← implement all 6 functions
    movieService.js             ← implement all 7 functions
    productService.js           ← implement 2 functions
    orderService.js             ← implement 3 functions
    userService.js              ← implement all 14 functions
    adminService.js             ← implement all 13 functions
    searchService.js            ← implement search function
  redux/slices/
    authSlice.js                ← full implementation
    bookSlice.js                ← full implementation
    movieSlice.js               ← full implementation
    productSlice.js             ← full implementation
    wishlistSlice.js            ← full implementation (optimistic updates)
    notificationSlice.js        ← full implementation
    adminSlice.js               ← full implementation
  App.jsx                       ← wrap routes with ProtectedRoute / AdminRoute
  components/common/
    Navbar.jsx                  ← replace fake localStorage auth with Redux state
  pages/
    LoginPage.jsx               ← dispatch loginThunk, remove fake auth
    RegisterPage.jsx            ← dispatch registerThunk
    ForgotPasswordPage.jsx      ← call authService.forgotPassword
    BookCenterPage.jsx          ← dispatch fetchBooks
    BookDetailPage.jsx          ← dispatch fetchBook, borrow/reserve thunks
    BookConfirmPage.jsx         ← dispatch fetchBook, call borrow/reserve
    MovieCenterPage.jsx         ← dispatch fetchMovies
    MovieDetailPage.jsx         ← dispatch fetchMovie
    MovieRequestPage.jsx        ← submitMovieRequest / getUserMovieRequests
    ElectronicsPage.jsx         ← dispatch fetchProducts
    ProductDetailPage.jsx       ← dispatch fetchProduct, placeOrder
    OrderConfirmationPage.jsx   ← read order from nav state or getOrder
    PurchaseHistoryPage.jsx     ← getOrderHistory
    BorrowingHistoryPage.jsx    ← getBorrowingHistory, renew, return
    UserDashboardPage.jsx       ← getProfile, getUserStats, getUserActivity
    WishlistPage.jsx            ← dispatch fetchWishlist
    NotificationsPage.jsx       ← dispatch fetchNotifications + actions
    SearchResultsPage.jsx       ← searchService.search
    ContactPage.jsx             ← contactService.submitContact
  pages/admin/
    AdminDashboardPage.jsx      ← dispatch fetchAdminStats, fetchRecentActivity
    AdminManageBooksPage.jsx    ← full admin book CRUD
    AdminManageMoviesPage.jsx   ← full admin movie CRUD
    AdminManageElectronicsPage.jsx ← full admin product CRUD
server/
  package.json                  ← add "seed" script
```

---

## `api.js` — Complete Axios Design

```js
// client/src/services/api.js
import axios from 'axios';
import { store } from '../redux/store';
import { logoutAction } from '../redux/slices/authSlice';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// ── Request interceptor ──────────────────────────────────────────────────────
// Attaches the JWT from localStorage to every outgoing request.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: error normalisation ─────────────────────────────────
// Extracts a human-readable string from non-2xx responses and re-throws it so
// all callers (thunks and plain service functions) receive a consistent error
// format — never an AxiosError object with nested response data.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data;
      // 401 — token expired or invalid
      if (error.response.status === 401) {
        store.dispatch(logoutAction());
        window.location.href = '/login';
        return Promise.reject('Session expired. Please log in again.');
      }
      // All other non-2xx: extract the server's error message
      const message =
        data?.error || data?.message || `Request failed (${error.response.status})`;
      return Promise.reject(message);
    }
    // Network error (no response received)
    return Promise.reject('Network error. Please check your connection.');
  }
);

export default API;
```

**Design notes:**

- `store` is imported directly (not via a React hook) so the interceptor can dispatch outside the component tree. This is safe because `store.js` does not import `api.js`, breaking any circular dependency.
- `window.location.href` is used for the 401 redirect instead of React Router's `navigate` because the interceptor lives outside a React component. This triggers a full navigation, which also clears any stale in-memory state.
- The request interceptor re-reads `localStorage` on every call so token changes (login/logout) are reflected immediately without restarting the instance.

---

## Environment Configuration

### `client/.env`

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```

### `server/.env` (required variables)

```dotenv
PORT=5000
MONGO_URI=mongodb://localhost:27017/ahaducenter
JWT_SECRET=replace_with_a_long_random_string
CLIENT_ORIGIN=http://localhost:5173
OVERDUE_FEE_PER_DAY=5
RESERVATION_FEE=10
```

### Server startup validation

Add to `server/server.js` (or a dedicated `config/env.js`) before any route or DB setup:

```js
const REQUIRED_VARS = [
  'PORT', 'MONGO_URI', 'JWT_SECRET',
  'CLIENT_ORIGIN', 'OVERDUE_FEE_PER_DAY', 'RESERVATION_FEE',
];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[startup] Missing required env variables: ${missing.join(', ')}`);
  process.exit(1);
}
```

---

## Seed Script Design

**File:** `server/src/seed.js`

### Structure

```
connect to MongoDB
  │
  for each domain (users, books, movies, products):
  │   check if collection is empty
  │   if empty  → insert sample documents, log count
  │   if not    → log "skipped"
  │
disconnect
exit(0)
```

### `server/package.json` addition

```json
"scripts": {
  "seed": "node src/seed.js"
}
```

### Sample Data Shapes

**Users (2 documents)**

```js
// admin user
{
  name: 'Admin User',
  email: 'admin@ahaducenter.com',
  password: await bcrypt.hash('admin123', 10),
  role: 'admin',
}

// regular user
{
  name: 'Demo User',
  email: 'user@ahaducenter.com',
  password: await bcrypt.hash('user123', 10),
  role: 'user',
}
```

**Books (8 documents — minimum)**

Each document must cover:
- At least 3 distinct `category` values: `Fiction`, `Science`, `History`
- At least 2 distinct `language` values: `English`, `Amharic`
- All 3 `availability` states: `available`, `borrowed`, `reserved`

```js
{
  title: String,
  author: String,
  isbn: String,          // unique
  category: String,
  language: String,
  coverImage: String,    // URL or placeholder path
  description: String,
  availability: 'available' | 'borrowed' | 'reserved',
  publishedYear: Number,
  totalCopies: Number,
  availableCopies: Number,
}
```

**Movies (8 documents — minimum)**

- At least 3 distinct `genres`: `Drama`, `Action`, `Documentary`
- At least 2 distinct `country` values: `Ethiopia`, `USA`

```js
{
  title: String,
  genres: [String],
  country: String,
  releaseYear: Number,
  director: String,
  cast: [String],
  synopsis: String,
  posterImage: String,
  type: 'film' | 'series',
  rating: Number,        // 0–10
}
```

**Products (6 documents — minimum)**

- At least 3 distinct `category` values: `Laptops`, `Audio`, `Accessories`

```js
{
  name: String,
  brand: String,
  category: String,
  price: Number,
  condition: 'new' | 'used',
  stock: Number,
  description: String,
  images: [String],
  specs: Object,         // free-form key-value pairs
}
```

### Seed Script Logic

```js
// server/src/seed.js  (pseudocode outline)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Book from './models/Book.js';
import Movie from './models/Movie.js';
import Product from './models/Product.js';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[seed] Connected to MongoDB');

    const results = {};

    // Users — check by email to prevent duplicates on re-run
    const adminExists = await User.findOne({ email: 'admin@ahaducenter.com' });
    const userExists  = await User.findOne({ email: 'user@ahaducenter.com' });
    if (!adminExists || !userExists) {
      const created = [];
      if (!adminExists) created.push({ /* admin shape */ });
      if (!userExists)  created.push({ /* user shape */ });
      await User.insertMany(created);
      results.users = `created ${created.length}`;
    } else {
      results.users = 'skipped';
    }

    // Books — check by collection count
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      await Book.insertMany(BOOKS_SEED_DATA);  // array of 8+
      results.books = `created ${BOOKS_SEED_DATA.length}`;
    } else {
      results.books = 'skipped';
    }

    // Movies
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      await Movie.insertMany(MOVIES_SEED_DATA);
      results.movies = `created ${MOVIES_SEED_DATA.length}`;
    } else {
      results.movies = 'skipped';
    }

    // Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(PRODUCTS_SEED_DATA);
      results.products = `created ${PRODUCTS_SEED_DATA.length}`;
    } else {
      results.products = 'skipped';
    }

    console.log('[seed] Summary:', results);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[seed] Error:', err);
    process.exit(1);
  }
}

seed();
```

---

## Service Layer Design

All service functions use the `API` Axios instance from `api.js`. The instance handles auth headers automatically via its request interceptor, so service files never set `Authorization` manually.

### `authService.js`

```js
import API from './api';

export const authService = {
  // POST /api/auth/login  { email, password }
  // Returns: { token, user: { name, email, role } }
  login: (email, password) =>
    API.post('/auth/login', { email, password }).then((r) => r.data),

  // POST /api/auth/register  { name, email, password }
  // Returns: { token, user: { name, email, role } }
  register: (name, email, password) =>
    API.post('/auth/register', { name, email, password }).then((r) => r.data),

  // POST /api/auth/forgot-password  { email }
  // Returns: { message: '...' }
  forgotPassword: (email) =>
    API.post('/auth/forgot-password', { email }).then((r) => r.data),

  // POST /api/auth/reset-password  { token, newPassword }
  // Returns: { message: '...' }
  resetPassword: (token, newPassword) =>
    API.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),
};
```

### `bookService.js`

```js
import API from './api';

export const bookService = {
  // GET /api/books?search=&category=&availability=&format=&language=&sort=&page=&limit=
  getBooks: (params = {}) =>
    API.get('/books', { params }).then((r) => r.data),

  // GET /api/books/:id
  getBook: (id) =>
    API.get(`/books/${id}`).then((r) => r.data),

  // POST /api/books/:id/borrow  (auth required)
  borrowBook: (id) =>
    API.post(`/books/${id}/borrow`).then((r) => r.data),

  // POST /api/books/:id/reserve  (auth required)
  reserveBook: (id) =>
    API.post(`/books/${id}/reserve`).then((r) => r.data),

  // GET /api/books/:id/reviews?page=&limit=
  getBookReviews: (id, params = {}) =>
    API.get(`/books/${id}/reviews`, { params }).then((r) => r.data),

  // POST /api/books/:id/reviews  { rating, comment }  (auth required)
  createBookReview: (id, payload) =>
    API.post(`/books/${id}/reviews`, payload).then((r) => r.data),
};
```

### `movieService.js`

```js
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
```

### `productService.js`

```js
import API from './api';

export const productService = {
  // GET /api/products?search=&category=&condition=&brand=&maxPrice=&sort=&page=&limit=
  getProducts: (params = {}) =>
    API.get('/products', { params }).then((r) => r.data),

  // GET /api/products/:id
  getProduct: (id) =>
    API.get(`/products/${id}`).then((r) => r.data),
};
```

### `orderService.js`

```js
import API from './api';

export const orderService = {
  // POST /api/orders  { productId, quantity }  (auth required)
  placeOrder: (payload) =>
    API.post('/orders', payload).then((r) => r.data),

  // GET /api/orders/:id  (auth required)
  getOrder: (id) =>
    API.get(`/orders/${id}`).then((r) => r.data),

  // GET /api/users/me/orders  (auth required)
  getOrderHistory: () =>
    API.get('/users/me/orders').then((r) => r.data),
};
```

### `userService.js`

```js
import API from './api';

export const userService = {
  // ── Profile ────────────────────────────────────────────────────────────────

  // GET /api/users/me
  getProfile: () =>
    API.get('/users/me').then((r) => r.data),

  // PUT /api/users/me  { name, email, ... }
  updateProfile: (payload) =>
    API.put('/users/me', payload).then((r) => r.data),

  // POST /api/users/me/avatar  multipart/form-data  { avatar: File }
  uploadAvatar: (formData) =>
    API.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  // GET /api/users/me/stats
  getUserStats: () =>
    API.get('/users/me/stats').then((r) => r.data),

  // GET /api/users/me/activity
  getUserActivity: () =>
    API.get('/users/me/activity').then((r) => r.data),

  // ── Borrowings ─────────────────────────────────────────────────────────────

  // GET /api/users/me/borrowings
  getBorrowingHistory: () =>
    API.get('/users/me/borrowings').then((r) => r.data),

  // POST /api/borrowings/:id/renew
  renewBorrowing: (borrowingId) =>
    API.post(`/borrowings/${borrowingId}/renew`).then((r) => r.data),

  // POST /api/borrowings/:id/return
  returnBook: (borrowingId) =>
    API.post(`/borrowings/${borrowingId}/return`).then((r) => r.data),

  // ── Wishlist ───────────────────────────────────────────────────────────────

  // GET /api/users/me/wishlist
  getWishlist: () =>
    API.get('/users/me/wishlist').then((r) => r.data),

  // POST /api/users/me/wishlist  { itemId, itemType }
  addToWishlist: (payload) =>
    API.post('/users/me/wishlist', payload).then((r) => r.data),

  // DELETE /api/users/me/wishlist/:itemId
  removeFromWishlist: (itemId) =>
    API.delete(`/users/me/wishlist/${itemId}`).then((r) => r.data),

  // ── Notifications ─────────────────────────────────────────────────────────

  // GET /api/users/me/notifications
  getNotifications: () =>
    API.get('/users/me/notifications').then((r) => r.data),

  // PATCH /api/notifications/:id/read
  markNotificationRead: (id) =>
    API.patch(`/notifications/${id}/read`).then((r) => r.data),

  // POST /api/users/me/notifications/read-all
  markAllNotificationsRead: () =>
    API.post('/users/me/notifications/read-all').then((r) => r.data),

  // DELETE /api/users/me/notifications
  deleteAllNotifications: () =>
    API.delete('/users/me/notifications').then((r) => r.data),
};
```

### `adminService.js`

```js
import API from './api';

export const adminService = {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  getStats:          ()            => API.get('/admin/stats').then((r) => r.data),
  getRecentActivity: ()            => API.get('/admin/recent').then((r) => r.data),

  // ── Books ──────────────────────────────────────────────────────────────────
  getAdminBooks:  ()              => API.get('/admin/books').then((r) => r.data),
  createBook:     (payload)       => API.post('/admin/books', payload).then((r) => r.data),
  updateBook:     (id, payload)   => API.put(`/admin/books/${id}`, payload).then((r) => r.data),
  deleteBook:     (id)            => API.delete(`/admin/books/${id}`).then((r) => r.data),

  // ── Movies ─────────────────────────────────────────────────────────────────
  getAdminMovies: ()              => API.get('/admin/movies').then((r) => r.data),
  createMovie:    (payload)       => API.post('/admin/movies', payload).then((r) => r.data),
  updateMovie:    (id, payload)   => API.put(`/admin/movies/${id}`, payload).then((r) => r.data),
  deleteMovie:    (id)            => API.delete(`/admin/movies/${id}`).then((r) => r.data),

  // ── Products ───────────────────────────────────────────────────────────────
  getAdminProducts: ()            => API.get('/admin/products').then((r) => r.data),
  createProduct:    (payload)     => API.post('/admin/products', payload).then((r) => r.data),
  updateProduct:    (id, payload) => API.put(`/admin/products/${id}`, payload).then((r) => r.data),
  deleteProduct:    (id)          => API.delete(`/admin/products/${id}`).then((r) => r.data),

  // ── Movie Requests ─────────────────────────────────────────────────────────
  getMovieRequests: ()            => API.get('/admin/movie-requests').then((r) => r.data),
  updateMovieRequestStatus: (id, status) =>
    API.patch(`/admin/movie-requests/${id}`, { status }).then((r) => r.data),

  // ── Contact Submissions ────────────────────────────────────────────────────
  getContactSubmissions: ()       => API.get('/admin/contacts').then((r) => r.data),
};
```

### `searchService.js`

```js
import API from './api';

export const searchService = {
  // GET /api/search?q=&type=&page=&limit=
  // type: 'movie' | 'book' | 'product' | undefined (all)
  // limit defaults to 20 when not provided
  search: ({ q, type, page, limit = 20 } = {}) =>
    API.get('/search', { params: { q, type, page, limit } }).then((r) => r.data),
};
```

### `contactService.js` (new file)

```js
// client/src/services/contactService.js
import API from './api';

export const contactService = {
  // POST /api/contact  { name, email, subject, message }
  // No auth required
  submitContact: (payload) =>
    API.post('/contact', payload).then((r) => r.data),
};
```

---

## Redux Slice Design

### `authSlice.js`

```js
// Initialisation: run once when the module loads (before any component mounts)
// to rehydrate auth state from localStorage without requiring a dispatch.
const token = localStorage.getItem('token');
let user = null;
if (token) {
  try {
    const decoded = jwtDecode(token); // { id, name, email, role, iat, exp }
    // Reject expired tokens
    if (decoded.exp * 1000 > Date.now()) {
      user = { name: decoded.name, email: decoded.email, role: decoded.role };
    } else {
      localStorage.removeItem('token');
    }
  } catch {
    localStorage.removeItem('token');
  }
}
```

**Initial state:**

```js
{
  user: null,           // { name, email, role } | null
  token: null,          // JWT string | null
  loading: false,
  error: null,
  initialized: true,    // always true after the synchronous rehydration above
}
```

> `initialized` is set synchronously during module load (not via an async action), so ProtectedRoute never needs to wait for a thunk to complete.

**Thunks:**

```js
// loginThunk
// payload: { email, password }
// On success: stores token in localStorage, sets user + token in state
// On failure: rejectWithValue(errorString from interceptor)
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      return data; // { token, user }
    } catch (err) {
      return rejectWithValue(err); // err is already a string from the interceptor
    }
  }
);

// registerThunk — same pattern as loginThunk
export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.register(name, email, password);
      localStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
```

**Reducers:**

```js
reducers: {
  logoutAction: (state) => {
    localStorage.removeItem('token');
    state.user  = null;
    state.token = null;
    state.error = null;
  },
  clearAuthError: (state) => { state.error = null; },
},
extraReducers: (builder) => {
  builder
    // loginThunk
    .addCase(loginThunk.pending,    (state) => { state.loading = true;  state.error = null; })
    .addCase(loginThunk.fulfilled,  (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user  = action.payload.user;
    })
    .addCase(loginThunk.rejected,   (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    })
    // registerThunk — same pattern
    .addCase(registerThunk.pending,   (state) => { state.loading = true;  state.error = null; })
    .addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user  = action.payload.user;
    })
    .addCase(registerThunk.rejected,  (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    });
},
```

---

### `bookSlice.js`

**Initial state:**

```js
{
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
}
```

**Thunks:**

| Thunk | Service call | On fulfilled |
|---|---|---|
| `fetchBooks(params)` | `bookService.getBooks(params)` | set `books`, update `pagination` from `{ totalCount, page, totalPages, limit }` |
| `fetchBook(id)` | `bookService.getBook(id)` | set `selectedBook` |
| `borrowBook(id)` | `bookService.borrowBook(id)` | return payload (page shows message) |
| `reserveBook(id)` | `bookService.reserveBook(id)` | return payload |
| `fetchBookReviews(id, params)` | `bookService.getBookReviews(id, params)` | set `reviews` |
| `createBookReview(id, payload)` | `bookService.createBookReview(id, payload)` | append to `reviews` |

**Pagination mapping** (consistent across book, movie, product slices):

```js
// Server envelope: { data: [...], totalCount, page, totalPages, limit }
.addCase(fetchBooks.fulfilled, (state, action) => {
  state.loading         = false;
  state.books           = action.payload.data;
  state.pagination = {
    totalItems:  action.payload.totalCount,
    totalPages:  action.payload.totalPages,
    currentPage: action.payload.page,
    limit:       action.payload.limit,
  };
})
```

---

### `movieSlice.js`

**Initial state:**

```js
{
  movies:        [],
  selectedMovie: null,
  reviews:       [],
  loading:       false,
  error:         null,
  pagination: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 12 },
}
```

**Thunks:** `fetchMovies(params)`, `fetchMovie(id)`, `fetchMovieReviews(id, params)`, `createMovieReview(id, payload)` — same pattern as bookSlice.

---

### `productSlice.js`

**Initial state:**

```js
{
  products:        [],
  selectedProduct: null,
  loading:         false,
  error:           null,
  pagination: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 12 },
}
```

**Thunks:** `fetchProducts(params)`, `fetchProduct(id)`.

---

### `wishlistSlice.js` — Optimistic Updates

**Initial state:**

```js
{
  items:   [],
  loading: false,
  error:   null,
}
```

**Thunks and optimistic update pattern:**

```js
// addWishlistItem
export const addWishlistItem = createAsyncThunk(
  'wishlist/add',
  async (payload, { rejectWithValue }) => {
    try {
      return await userService.addToWishlist(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// removeWishlistItem
export const removeWishlistItem = createAsyncThunk(
  'wishlist/remove',
  async (itemId, { rejectWithValue }) => {
    try {
      await userService.removeFromWishlist(itemId);
      return itemId;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
```

```js
// Optimistic update via local state snapshot in extraReducers:
let snapshotBeforeAdd = [];

extraReducers: (builder) => {
  builder
    .addCase(fetchWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.items   = action.payload.data ?? action.payload;
    })
    // Optimistic add
    .addCase(addWishlistItem.pending, (state, action) => {
      snapshotBeforeAdd = [...state.items];
      state.loading = true;
      // Immediately push a temporary item so the UI updates instantly
      state.items.push({ _id: 'optimistic', ...action.meta.arg });
    })
    .addCase(addWishlistItem.fulfilled, (state, action) => {
      state.loading = false;
      // Replace optimistic item with real server-returned item
      state.items   = action.payload.data ?? action.payload;
    })
    .addCase(addWishlistItem.rejected, (state, action) => {
      state.loading = false;
      state.error   = action.payload;
      state.items   = snapshotBeforeAdd; // rollback
    })
    // Optimistic remove (remove immediately, restore on failure)
    .addCase(removeWishlistItem.pending, (state, action) => {
      snapshotBeforeAdd = [...state.items];
      state.loading = true;
      state.items   = state.items.filter((i) => i._id !== action.meta.arg);
    })
    .addCase(removeWishlistItem.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(removeWishlistItem.rejected, (state, action) => {
      state.loading = false;
      state.error   = action.payload;
      state.items   = snapshotBeforeAdd; // rollback
    })
}
```

> **Note on snapshot storage:** The `snapshotBeforeAdd` variable is module-scoped. For concurrent operations, a more robust approach would store the snapshot in `action.meta.arg` by using `prepareOptimistic` or a thunk-level variable. For this application's single-user context, the module-level snapshot is sufficient.

---

### `notificationSlice.js`

**Initial state:**

```js
{
  notifications: [],   // { _id, message, isRead, createdAt, type, ... }[]
  unreadCount:   0,
  loading:       false,
  error:         null,
}
```

**Helper:**

```js
const countUnread = (notifications) => notifications.filter((n) => !n.isRead).length;
```

**Thunks:** `fetchNotifications()`, `markOneRead(id)`, `markAllRead()`, `clearAll()`

**extraReducers:**

```js
.addCase(fetchNotifications.fulfilled, (state, action) => {
  state.loading       = false;
  state.notifications = action.payload.data ?? action.payload;
  state.unreadCount   = countUnread(state.notifications);
})
.addCase(markOneRead.fulfilled, (state, action) => {
  state.loading = false;
  const n = state.notifications.find((n) => n._id === action.payload._id);
  if (n) n.isRead = true;
  state.unreadCount = countUnread(state.notifications);
})
.addCase(markAllRead.fulfilled, (state) => {
  state.loading = false;
  state.notifications.forEach((n) => { n.isRead = true; });
  state.unreadCount = 0;
})
.addCase(clearAll.fulfilled, (state) => {
  state.loading       = false;
  state.notifications = [];
  state.unreadCount   = 0;
})
```

---

### `adminSlice.js`

**Initial state:**

```js
{
  stats:               null,
  recentActivity:      [],
  books:               [],
  movies:              [],
  products:            [],
  movieRequests:       [],
  contactSubmissions:  [],
  loading:             false,
  error:               null,
}
```

**Thunks** (all backed by `adminService`):

| Thunk | Service call | Fulfilled update |
|---|---|---|
| `fetchAdminStats()` | `getStats()` | `state.stats` |
| `fetchRecentActivity()` | `getRecentActivity()` | `state.recentActivity` |
| `fetchAdminBooks()` | `getAdminBooks()` | `state.books` |
| `createBook(payload)` | `createBook(payload)` | push to `state.books` |
| `updateBook({id, payload})` | `updateBook(id, payload)` | replace item in `state.books` |
| `deleteBook(id)` | `deleteBook(id)` | filter out from `state.books` |
| `fetchAdminMovies()` | `getAdminMovies()` | `state.movies` |
| `createMovie(payload)` | `createMovie(payload)` | push to `state.movies` |
| `updateMovie({id, payload})` | `updateMovie(id, payload)` | replace item in `state.movies` |
| `deleteMovie(id)` | `deleteMovie(id)` | filter out from `state.movies` |
| `fetchAdminProducts()` | `getAdminProducts()` | `state.products` |
| `createProduct(payload)` | `createProduct(payload)` | push to `state.products` |
| `updateProduct({id, payload})` | `updateProduct(id, payload)` | replace item in `state.products` |
| `deleteProduct(id)` | `deleteProduct(id)` | filter out from `state.products` |
| `fetchMovieRequests()` | `getMovieRequests()` | `state.movieRequests` |
| `updateMovieRequestStatus({id, status})` | `updateMovieRequestStatus(id, status)` | replace item in `state.movieRequests` |
| `fetchContactSubmissions()` | `getContactSubmissions()` | `state.contactSubmissions` |

All thunks use the same `rejectWithValue(err)` pattern.

---

## Components and Interfaces

### Route Guard Components

### `ProtectedRoute.jsx`

```jsx
// client/src/components/common/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const { token, initialized } = useSelector((s) => s.auth);

  if (!initialized) {
    // Auth state is being rehydrated (token decode in progress).
    // Return a neutral loading screen to avoid a flash-redirect.
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

> Because `initialized` is set **synchronously** during `authSlice.js` module load (not via an async thunk), the loading state shown here is purely defensive — in practice `initialized` will already be `true` by the time the first render occurs. It guards against any future async rehydration path.

### `AdminRoute.jsx`

```jsx
// client/src/components/common/AdminRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const { token, user, initialized } = useSelector((s) => s.auth);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
}
```

### `App.jsx` Route Wrapping

```jsx
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute     from './components/common/AdminRoute';

// Protected routes (authenticated users only)
<Route element={<ProtectedRoute />}>
  <Route path="/account"           element={<UserDashboardPage />} />
  <Route path="/wishlist"          element={<WishlistPage />} />
  <Route path="/purchase-history"  element={<PurchaseHistoryPage />} />
  <Route path="/borrowing-history" element={<BorrowingHistoryPage />} />
  <Route path="/movie-request"     element={<MovieRequestPage />} />
  <Route path="/notifications"     element={<NotificationsPage />} />
  <Route path="/book-confirm"      element={<BookConfirmPage />} />
</Route>

// Admin routes (admin role only)
<Route element={<AdminRoute />}>
  <Route path="/admin"              element={<AdminDashboardPage />} />
  <Route path="/admin/movies"       element={<AdminManageMoviesPage />} />
  <Route path="/admin/books"        element={<AdminManageBooksPage />} />
  <Route path="/admin/electronics"  element={<AdminManageElectronicsPage />} />
</Route>
```

---

## Page Integration Summary

### Auth Pages

| Page | Remove | Replace with |
|---|---|---|
| `LoginPage` | Fake localStorage `ahadu_logged_in` writes, quick-fill credential buttons | `dispatch(loginThunk({ email, password }))` on form submit; show `auth.error` on failure |
| `RegisterPage` | Any mock user creation | `dispatch(registerThunk({ name, email, password }))` on form submit |
| `ForgotPasswordPage` | Mock success flash | `authService.forgotPassword(email)`; show success message on resolve, error string on reject |

### Books

| Page | Remove | Replace with |
|---|---|---|
| `BookCenterPage` | Hardcoded `BOOKS` array | `dispatch(fetchBooks(params))` on mount and filter/page change; read from `book.books` |
| `BookDetailPage` | Hardcoded book object | `dispatch(fetchBook(id))` on mount; `dispatch(borrowBook(id))` / `dispatch(reserveBook(id))` on button click |
| `BookConfirmPage` | Hardcoded book/action data | Read `?action=` and `?id=` query params; `dispatch(fetchBook(id))`; call `bookService.borrowBook` or `bookService.reserveBook` on confirm |

### Movies

| Page | Remove | Replace with |
|---|---|---|
| `MovieCenterPage` | Hardcoded `ALL_MOVIES` array | `dispatch(fetchMovies(params))` on mount and filter/tab/page change |
| `MovieDetailPage` | Hardcoded movie object and related array | `dispatch(fetchMovie(id))`; `RelatedMoviesCarousel` dispatches `fetchMovies({ genres: selectedMovie.genres[0], excludeId: id })` |
| `MovieRequestPage` | Hardcoded `requests` array | `movieService.getUserMovieRequests()` on mount; `movieService.submitMovieRequest(payload)` on form submit; `movieService.cancelMovieRequest(id)` on cancel |

### Electronics

| Page | Remove | Replace with |
|---|---|---|
| `ElectronicsPage` | Hardcoded `products` array | `dispatch(fetchProducts(params))` on mount and filter/page change |
| `ProductDetailPage` | Hardcoded product object and similar items | `dispatch(fetchProduct(id))`; `SimilarProducts` dispatches `fetchProducts({ category })`; confirm pick-up calls `orderService.placeOrder` then navigates to `/order-confirmation` |

### Orders / User

| Page | Remove | Replace with |
|---|---|---|
| `OrderConfirmationPage` | Hardcoded reservation object | Read order from React Router navigation state (`location.state.order`); if absent, call `orderService.getOrder(id)` |
| `PurchaseHistoryPage` | Hardcoded `orders` array | `orderService.getOrderHistory()` on mount |
| `BorrowingHistoryPage` | Hardcoded `borrowings` array | `userService.getBorrowingHistory()` on mount; renew/return call respective userService functions |
| `UserDashboardPage` | Hardcoded `user`, `stats`, `activities` | Concurrent `Promise.all([getProfile(), getUserStats(), getUserActivity()])` on mount |
| `WishlistPage` | Hardcoded `wishlistItems` array | `dispatch(fetchWishlist())` on mount; read from `wishlist.items` |
| `NotificationsPage` | Hardcoded `notifications` array | `dispatch(fetchNotifications())` on mount; dispatch mark/clear actions on user interaction |

### Admin

| Page | Remove | Replace with |
|---|---|---|
| `AdminDashboardPage` | Hardcoded stats objects | `dispatch(fetchAdminStats())` + `dispatch(fetchRecentActivity())` concurrently on mount |
| `AdminManageBooksPage` | Hardcoded books array | `dispatch(fetchAdminBooks())` on mount; create/update/delete dispatch corresponding admin thunks |
| `AdminManageMoviesPage` | Hardcoded movies array | Same pattern for movies |
| `AdminManageElectronicsPage` | Hardcoded products array | Same pattern for products |

### Other

| Page | Remove | Replace with |
|---|---|---|
| `SearchResultsPage` | Hardcoded `allResults` array | `searchService.search({ q, type, page })` when URL `?q=` changes |
| `ContactPage` | Mock success state | `contactService.submitContact(payload)`; show success card on resolve, inline error on reject |

---

## Navbar Integration

Replace all localStorage-based auth (`ahadu_logged_in`, `auth-change` event) with Redux state:

```jsx
// In Navbar.jsx
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../redux/slices/authSlice';

const dispatch = useDispatch();
const { token, user }   = useSelector((s) => s.auth);
const { unreadCount }   = useSelector((s) => s.notification);

// Logout
const handleLogout = () => {
  dispatch(logoutAction());
  navigate('/');
};

// Conditional rendering
{token ? (
  /* show avatar dropdown using `user.name`, `user.email` */
  /* show notification bell with badge when unreadCount > 0 */
) : (
  /* show Sign In / Sign Up links */
)}
```

The `isLoggedIn` local state, `ahadu_logged_in` localStorage key, `setUserEmail`, and the `auth-change` window event are all removed.

**Notification badge:**

```jsx
{unreadCount > 0 && (
  <Link to="/notifications" className="relative">
    <span className="material-symbols-outlined">notifications</span>
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white rounded-full text-[10px] flex items-center justify-center font-bold">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  </Link>
)}
```

---

## Data Models

This section describes the data shapes that flow between the API and the Redux store. The backend Mongoose schemas are already defined; these shapes reflect the JSON serialised form as seen by the client.

### Auth token payload (decoded by `jwt-decode`)

```ts
interface TokenPayload {
  id:    string;   // MongoDB ObjectId as string
  name:  string;
  email: string;
  role:  'user' | 'admin';
  iat:   number;   // issued-at (Unix seconds)
  exp:   number;   // expiry (Unix seconds)
}
```

### Login / Register response envelope

```ts
interface AuthResponse {
  token: string;           // JWT
  user: {
    name:  string;
    email: string;
    role:  'user' | 'admin';
  };
}
```

### Paginated response envelope (books, movies, products, search)

```ts
interface PaginatedResponse<T> {
  data:        T[];
  totalCount:  number;
  page:        number;
  totalPages:  number;
  limit:       number;
}
```

### Redux store shape (client-side state)

```ts
interface RootState {
  auth: {
    user:        { name: string; email: string; role: string } | null;
    token:       string | null;
    loading:     boolean;
    error:       string | null;
    initialized: boolean;
  };
  book: {
    books:        Book[];
    selectedBook: Book | null;
    reviews:      Review[];
    loading:      boolean;
    error:        string | null;
    pagination:   Pagination;
  };
  movie: {
    movies:        Movie[];
    selectedMovie: Movie | null;
    reviews:       Review[];
    loading:       boolean;
    error:         string | null;
    pagination:    Pagination;
  };
  product: {
    products:        Product[];
    selectedProduct: Product | null;
    loading:         boolean;
    error:           string | null;
    pagination:      Pagination;
  };
  wishlist: {
    items:   WishlistItem[];
    loading: boolean;
    error:   string | null;
  };
  notification: {
    notifications: Notification[];
    unreadCount:   number;
    loading:       boolean;
    error:         string | null;
  };
  admin: {
    stats:              AdminStats | null;
    recentActivity:     ActivityItem[];
    books:              Book[];
    movies:             Movie[];
    products:           Product[];
    movieRequests:      MovieRequest[];
    contactSubmissions: ContactSubmission[];
    loading:            boolean;
    error:              string | null;
  };
}

interface Pagination {
  totalItems:  number;
  totalPages:  number;
  currentPage: number;
  limit:       number;
}
```

### Book document (client-side shape)

```ts
interface Book {
  _id:              string;
  title:            string;
  author:           string;
  isbn:             string;
  category:         string;
  language:         string;
  coverImage:       string;
  description:      string;
  availability:     'available' | 'borrowed' | 'reserved';
  publishedYear:    number;
  totalCopies:      number;
  availableCopies:  number;
}
```

### Movie document (client-side shape)

```ts
interface Movie {
  _id:         string;
  title:       string;
  genres:      string[];
  country:     string;
  releaseYear: number;
  director:    string;
  cast:        string[];
  synopsis:    string;
  posterImage: string;
  type:        'film' | 'series';
  rating:      number;
}
```

### Product document (client-side shape)

```ts
interface Product {
  _id:         string;
  name:        string;
  brand:       string;
  category:    string;
  price:       number;
  condition:   'new' | 'used';
  stock:       number;
  description: string;
  images:      string[];
  specs:       Record<string, string | number>;
}
```

### Notification document

```ts
interface Notification {
  _id:       string;
  message:   string;
  isRead:    boolean;
  type:      string;
  createdAt: string; // ISO date string
}
```

### Review document

```ts
interface Review {
  _id:       string;
  user:      { _id: string; name: string };
  rating:    number;   // 1–5
  comment:   string;
  createdAt: string;
}
```

### WishlistItem document

```ts
interface WishlistItem {
  _id:      string;
  itemId:   string;
  itemType: 'book' | 'movie' | 'product';
  item:     Book | Movie | Product; // populated by server
}
```

---

## Error Handling

All async thunks wrap service calls in `try/catch` and call `rejectWithValue(err)`. Because `api.js` interceptors convert all non-2xx AxiosErrors into plain strings before the thunk catches them, `err` is always a string at this point.

```js
export const fetchBooks = createAsyncThunk(
  'book/fetchBooks',
  async (params, { rejectWithValue }) => {
    try {
      return await bookService.getBooks(params);
    } catch (err) {
      return rejectWithValue(err); // err is a plain string
    }
  }
);
```

### Slice error field

In `extraReducers`, rejected cases read from `action.payload` (the `rejectWithValue` string), not from `action.error.message`:

```js
.addCase(fetchBooks.rejected, (state, action) => {
  state.loading = false;
  state.error   = action.payload ?? 'Something went wrong. Please try again.';
})
```

### Page pattern

```jsx
const { books, loading, error } = useSelector((s) => s.book);

useEffect(() => {
  dispatch(fetchBooks({}));
}, [dispatch]);

if (loading) return <BookListSkeleton />;
if (error)   return <ErrorBanner message={error} onRetry={() => dispatch(fetchBooks({}))} />;
return <BookGrid books={books} />;
```

**`ErrorBanner` component pattern:**

```jsx
function ErrorBanner({ message, onRetry }) {
  return (
    <div className="rounded-xl bg-error/10 border border-error/30 p-4 flex items-center justify-between">
      <p className="text-error text-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="ml-4 text-xs font-bold text-error underline">
          Retry
        </button>
      )}
    </div>
  );
}
```

### Loading skeleton pattern

Each domain page exports a skeleton component that mirrors the real layout with neutral placeholder blocks:

```jsx
function BookListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-surface-variant animate-pulse h-64" />
      ))}
    </div>
  );
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The client uses **Vitest + fast-check** (already installed) for property-based tests. Each property test must run a minimum of 100 iterations.

Tag format for each test: `// Feature: full-stack-integration, Property N: <title>`

---

### Property 1: Auth request interceptor attaches Bearer token

*For any* non-empty token string stored in `localStorage` under the key `token`, when an Axios request is dispatched through `api.js`, the `Authorization` header of that request must equal `"Bearer " + token`.

**Validates: Requirements 1.3**

---

### Property 2: loginThunk sets token and user in Redux state

*For any* valid login response object containing a JWT `token` and a `user` object with `name`, `email`, and `role`, when `loginThunk` is fulfilled with that response, `auth.token` in the Redux store must equal the response token, and `auth.user.email` must equal the submitted email.

**Validates: Requirements 3.5**

---

### Property 3: loginThunk persists token to localStorage

*For any* fulfilled `loginThunk`, `localStorage.getItem('token')` must return a value strictly equal to `auth.token` in the Redux store.

**Validates: Requirements 3.5**

> *Reflection note:* Properties 2 and 3 both validate the loginThunk fulfillment path. They are kept separate because they test distinct invariants — Redux state correctness vs. localStorage persistence side effect. Together they subsume a "token stored and state set" combined property without one implying the other.

---

### Property 4: registerThunk sets token and user

*For any* valid registration response object with a JWT `token` and user data, when `registerThunk` is fulfilled, `auth.token` and `auth.user` must be set in the Redux store and `localStorage` must contain the token.

**Validates: Requirements 3.6**

---

### Property 5: logoutAction clears all auth state

*For any* prior auth state in which `auth.token` is a non-null string and `localStorage` has a token under the key `token`, after `logoutAction` is dispatched, `auth.token` must be `null`, `auth.user` must be `null`, and `localStorage.getItem('token')` must return `null`.

**Validates: Requirements 3.7**

---

### Property 6: Failed auth thunk sets auth.error to the rejection string

*For any* error string returned as a rejection value from `loginThunk` or `registerThunk`, `auth.error` in the Redux store must equal that exact string after the thunk completes.

**Validates: Requirements 3.13**

---

### Property 7: Pagination invariant for book, movie, and product slices

*For any* paginated API response `{ data, totalCount, page, totalPages, limit }` where `limit > 0` and `totalCount >= 0`, after the corresponding `fetchBooks`, `fetchMovies`, or `fetchProducts` thunk is fulfilled, the slice's `pagination.totalPages` must equal `Math.ceil(totalCount / limit)` (or `0` when `totalCount === 0`).

**Validates: Requirements 5.8, 6.6, 8.4**

---

### Property 8: Search results pagination invariant

*For any* search API response `{ data, totalCount, page, totalPages, limit }`, the `totalPages` value returned by the server must satisfy the same invariant: `Math.ceil(totalCount / limit)` when `totalCount > 0`, and `0` when `totalCount === 0`.

**Validates: Requirements 14.1**

> *Reflection note:* Property 8 is kept distinct from Property 7 because the search response is not funneled through a Redux slice — it is consumed directly by `SearchResultsPage`. The property validates the server contract rather than slice state.

---

### Property 9: Wishlist optimistic rollback on rejected add

*For any* wishlist state (any array of items) before an `addWishlistItem` dispatch, when that thunk is rejected, the `wishlist.items` array in the Redux store must be strictly equal (same length and same item IDs) to the snapshot taken before the optimistic update was applied.

**Validates: Requirements 12.7**

---

### Property 10: notificationSlice unreadCount derivation

*For any* array of notification objects with varying `isRead` values, after `fetchNotifications` is fulfilled with that array, `notificationSlice.unreadCount` must equal `notifications.filter(n => !n.isRead).length`.

**Validates: Requirements 13.6**

---

### Property 11: markAllRead sets all notifications to read

*For any* notifications array (with any mix of read/unread items), after `markAllRead` is fulfilled, every notification in `notificationSlice.notifications` must have `isRead === true` and `notificationSlice.unreadCount` must be `0`.

**Validates: Requirements 13.6, 13.9**

---

### Property 12: clearAll empties notifications

*For any* prior notifications state, after `clearAll` is fulfilled, `notificationSlice.notifications` must be an empty array and `notificationSlice.unreadCount` must be `0`.

**Validates: Requirements 13.10**

---

### Property 13: Response interceptor extracts error string

*For any* non-2xx HTTP response object where `response.data` contains an `error` or `message` field (or neither), the Axios response interceptor must re-throw a plain string: `data.error` if present, otherwise `data.message` if present, otherwise a non-empty fallback string. The thrown value must never be an AxiosError object.

**Validates: Requirements 18.2, 18.5**

---

### Property 14: 401 response triggers logout and state reset

*For any* 401 HTTP response received by the Axios response interceptor, `logoutAction` must be dispatched, resulting in `auth.token === null`, `auth.user === null`, and `localStorage.getItem('token') === null`.

**Validates: Requirements 18.4**

---

## Testing Strategy

### Dual approach

Unit and property tests are complementary. Property tests cover the logic layer (slice reducers, interceptors, service contracts) with randomized inputs. Integration tests cover page-level behavior with mocked API responses.

### Property tests (Vitest + fast-check)

Location: `client/src/__tests__/properties/`

Each property maps to one `test` block tagged with:
```js
// Feature: full-stack-integration, Property N: <title>
```

Each uses `fc.assert(fc.property(...), { numRuns: 100 })`.

**Generators to define:**

- `fc.record({ token: fc.string({ minLength: 10 }), user: fc.record({ name: fc.string(), email: fc.emailAddress(), role: fc.constantFrom('user', 'admin') }) })` — login/register response
- `fc.array(fc.record({ _id: fc.uuid(), isRead: fc.boolean(), message: fc.string(), createdAt: fc.date() }))` — notifications
- `fc.record({ data: fc.array(fc.anything()), totalCount: fc.nat(), page: fc.nat({ min: 1 }), totalPages: fc.nat(), limit: fc.nat({ min: 1, max: 100 }) })` — paginated response
- `fc.string({ minLength: 1 })` — error strings
- `fc.record({ data: fc.oneof(fc.constant(null), fc.record({ error: fc.string() }), fc.record({ message: fc.string() })) })` — error response bodies

### Unit tests (Vitest + Testing Library)

Location: `client/src/__tests__/unit/`

Focus areas:
- ProtectedRoute: renders spinner when `initialized=false`, redirects when no token, renders children when token present
- AdminRoute: redirects to `/` when role is not admin
- Each page: mounts with mocked store, verifies dispatch is called on mount
- authService, bookService, etc.: verify correct axios method + path (mock `api.js`)

### Integration tests

Location: `client/src/__tests__/integration/`

Use `msw` (Mock Service Worker) or manual Axios mocks to simulate the full request/response cycle per page, verifying that data from the mock API populates the rendered DOM.

### What is NOT property-tested

- Seed script — smoke/integration tests only (one-time DB state)
- Admin CRUD pages — example-based tests (finite set of create/update/delete cases)
- Page layout and visual rendering — snapshot tests or manual review
- CORS configuration — integration/smoke test against the running server
