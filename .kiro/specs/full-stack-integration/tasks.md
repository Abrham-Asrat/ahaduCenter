# Implementation Plan: Full-Stack Integration

## Overview

These tasks wire the AhaduCenter React frontend to the existing Express/MongoDB backend. Work is ordered so that foundational infrastructure (environment, Axios, seed data, auth) is completed before domain-specific service/slice/page work, and property-based tests are written last once the implementation is stable.

## Tasks

- [x] 1. Install jwt-decode dependency on the client
  - [x] 1.1 Run `npm install jwt-decode@^4.0.0` inside `client/`
  - [x] 1.2 Verify `jwt-decode` appears in `client/package.json` dependencies

- [x] 2. Environment and CORS configuration
  - [x] 2.1 Write `VITE_API_BASE_URL=http://localhost:5000/api` into `client/.env` (create if missing)
  - [x] 2.2 Create or update `server/.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `OVERDUE_FEE_PER_DAY`, and `RESERVATION_FEE`
  - [x] 2.3 Add startup validation to `server/src/server.js` (or dedicated `config/env.js`) that logs missing required env vars and calls `process.exit(1)` when any are absent
  - [x] 2.4 Configure CORS in `server/src/server.js` to allow the origin from `CLIENT_ORIGIN` (defaulting to `http://localhost:5173`), permit GET/POST/PUT/PATCH/DELETE/OPTIONS, and handle OPTIONS preflight

- [x] 3. `api.js` — Axios instance with both interceptors
  - [x] 3.1 Set `baseURL` to `import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'`
  - [x] 3.2 Add the request interceptor: read `localStorage.getItem('token')` and attach `Authorization: Bearer <token>` when a token is present
  - [x] 3.3 Add the response interceptor: on non-2xx responses extract `data.error || data.message || fallback` and re-throw as a plain string; on 401 additionally dispatch `logoutAction` and redirect to `/login`

- [ ] 4. Database seed script
  - [x] 4.1 Create `server/src/seed.js` that imports `mongoose`, `bcryptjs`, `dotenv`, and the `User`, `Book`, `Movie`, `Product` models
  - [x] 4.2 Implement idempotent user seeding: check by email; if admin `admin@ahaducenter.com` or regular user `user@ahaducenter.com` does not exist, create them with bcrypt-hashed passwords (`admin123` / `user123`) and the correct `role` field
  - [x] 4.3 Implement idempotent book seeding: if `Book.countDocuments()` is 0, insert at least 8 book documents covering at least 3 distinct categories, 2 distinct languages, and all 3 availability states (`available`, `borrowed`, `reserved`)
  - [x] 4.4 Implement idempotent movie seeding: if `Movie.countDocuments()` is 0, insert at least 8 movie documents covering at least 3 distinct genres and 2 distinct countries
  - [x] 4.5 Implement idempotent product seeding: if `Product.countDocuments()` is 0, insert at least 6 product documents covering at least 3 distinct categories (Laptops, Audio, Accessories)
  - [x] 4.6 Log a per-collection summary (`created N` / `skipped`) when the seed script completes successfully
  - [x] 4.7 Wrap everything in a `try/catch`; on DB connection failure or insertion error log the error and call `process.exit(1)`
  - [x] 4.8 Add `"seed": "node src/seed.js"` to `server/package.json` scripts

- [x] 5. Authentication service (`authService.js`)
  - [x] 5.1 Implement `login(email, password)` → `POST /api/auth/login`
  - [x] 5.2 Implement `register(name, email, password)` → `POST /api/auth/register`
  - [x] 5.3 Implement `forgotPassword(email)` → `POST /api/auth/forgot-password`
  - [x] 5.4 Implement `resetPassword(token, newPassword)` → `POST /api/auth/reset-password`

- [x] 6. Auth Redux slice (`authSlice.js`)
  - [x] 6.1 On module load, synchronously rehydrate from `localStorage`: decode the token with `jwtDecode`, reject expired tokens, set the `user` object (`name`, `email`, `role`) and `token` string, or set both to `null` if absent/expired/invalid; set `initialized: true`
  - [x] 6.2 Implement `loginThunk`: call `authService.login`, store token in `localStorage`, return `{ token, user }` on success; call `rejectWithValue(err)` on failure
  - [x] 6.3 Implement `registerThunk`: same pattern as `loginThunk` using `authService.register`
  - [x] 6.4 Implement `logoutAction` reducer: remove token from `localStorage`, set `auth.user` and `auth.token` to `null`, clear `auth.error`
  - [x] 6.5 Wire `extraReducers` for `loginThunk` and `registerThunk`: pending → `loading: true, error: null`; fulfilled → `loading: false, token, user`; rejected → `loading: false, error: action.payload`

- [x] 7. Auth page wiring
  - [x] 7.1 `LoginPage.jsx` — remove fake localStorage auth logic and hardcoded credential quick-fill buttons; dispatch `loginThunk({ email, password })` on form submit; display `auth.error` on failure
  - [x] 7.2 `RegisterPage.jsx` — dispatch `registerThunk({ name, email, password })` on valid form submit; display `auth.error` on failure
  - [x] 7.3 `ForgotPasswordPage.jsx` — call `authService.forgotPassword(email)` on form submit; show a success message on resolve; show the error string on reject

- [x] 8. Route guard components and App.jsx wiring
  - [x] 8.1 Create `client/src/components/common/ProtectedRoute.jsx`: read `{ token, initialized }` from `s.auth`; render loading spinner while `!initialized`; redirect to `/login` when no token; render `<Outlet />` otherwise
  - [x] 8.2 Create `client/src/components/common/AdminRoute.jsx`: same guard logic plus redirect to `/` when token is present but `user.role !== 'admin'`
  - [x] 8.3 Update `App.jsx`: wrap `/account`, `/wishlist`, `/purchase-history`, `/borrowing-history`, `/movie-request`, `/notifications`, and `/book-confirm` with `<ProtectedRoute />`
  - [x] 8.4 Update `App.jsx`: wrap `/admin`, `/admin/movies`, `/admin/books`, and `/admin/electronics` with `<AdminRoute />`
  - [x] 8.5 Update `Navbar.jsx`: replace all localStorage `ahadu_logged_in` / `auth-change` logic with `useSelector((s) => s.auth)` and `useSelector((s) => s.notification)`; show Sign In / Register when no token; show avatar dropdown and logout button when token is present; dispatch `logoutAction` and navigate to `/` on logout; show notification badge when `unreadCount > 0`

- [x] 9. Book service (`bookService.js`)
  - [x] 9.1 Implement `getBooks(params)` → `GET /api/books` with query params
  - [x] 9.2 Implement `getBook(id)` → `GET /api/books/:id`
  - [x] 9.3 Implement `borrowBook(id)` → `POST /api/books/:id/borrow`
  - [x] 9.4 Implement `reserveBook(id)` → `POST /api/books/:id/reserve`
  - [x] 9.5 Implement `getBookReviews(id, params)` → `GET /api/books/:id/reviews`
  - [x] 9.6 Implement `createBookReview(id, payload)` → `POST /api/books/:id/reviews`

- [x] 10. Book Redux slice (`bookSlice.js`)
  - [x] 10.1 Define initial state: `books: [], selectedBook: null, reviews: [], loading: false, error: null, pagination: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 12 }`
  - [x] 10.2 Implement `fetchBooks(params)` thunk → `bookService.getBooks`; on fulfilled map server envelope `{ data, totalCount, page, totalPages, limit }` to slice state
  - [x] 10.3 Implement `fetchBook(id)` thunk → `bookService.getBook`; on fulfilled set `selectedBook`
  - [x] 10.4 Implement `borrowBook(id)` thunk → `bookService.borrowBook`; on fulfilled return payload for page to display
  - [x] 10.5 Implement `reserveBook(id)` thunk → `bookService.reserveBook`; on fulfilled return payload
  - [x] 10.6 Implement `fetchBookReviews(id, params)` thunk → `bookService.getBookReviews`; on fulfilled set `reviews`
  - [x] 10.7 Implement `createBookReview(id, payload)` thunk → `bookService.createBookReview`; on fulfilled append to `reviews`
  - [x] 10.8 Wire all pending/rejected cases: pending → `loading: true`; rejected → `loading: false, error: action.payload`

- [x] 11. Book page wiring
  - [x] 11.1 `BookCenterPage.jsx` — dispatch `fetchBooks` with default params on mount; dispatch again on filter/page change; replace hardcoded book array with `book.books` from store; use `book.pagination` for pagination controls; show loading skeleton while `book.loading`; show error banner with retry on `book.error`
  - [x] 11.2 `BookDetailPage.jsx` — dispatch `fetchBook(id)` on mount using URL param; dispatch `borrowBook` / `reserveBook` thunks on button click; show server response message or fallback; wire `ReviewsCommentsSection` to dispatch `fetchBookReviews(id)` on mount and `createBookReview(id, payload)` on authenticated review submit
  - [x] 11.3 `BookConfirmPage.jsx` — read `?action=` and `?id=` query params; dispatch `fetchBook(id)` on mount; call `bookService.borrowBook(id)` or `bookService.reserveBook(id)` on confirm; display loading skeleton while loading; on success show server-returned details (due date / reservation expiry); on error display error message and keep form visible for retry

- [x] 12. Movie service (`movieService.js`)
  - [x] 12.1 Implement `getMovies(params)` → `GET /api/movies`
  - [x] 12.2 Implement `getMovie(id)` → `GET /api/movies/:id`
  - [x] 12.3 Implement `getMovieReviews(id, params)` → `GET /api/movies/:id/reviews`
  - [x] 12.4 Implement `createMovieReview(id, payload)` → `POST /api/movies/:id/reviews`
  - [x] 12.5 Implement `submitMovieRequest(payload)` → `POST /api/movie-requests`
  - [x] 12.6 Implement `getUserMovieRequests()` → `GET /api/users/me/movie-requests`
  - [x] 12.7 Implement `cancelMovieRequest(id)` → `DELETE /api/movie-requests/:id`

- [x] 13. Movie Redux slice (`movieSlice.js`)
  - [x] 13.1 Define initial state: `movies: [], selectedMovie: null, reviews: [], loading: false, error: null, pagination: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 12 }`
  - [x] 13.2 Implement `fetchMovies(params)` thunk; on fulfilled map paginated envelope to slice state
  - [x] 13.3 Implement `fetchMovie(id)` thunk; on fulfilled set `selectedMovie`
  - [x] 13.4 Implement `fetchMovieReviews(id, params)` thunk; on fulfilled set `reviews`
  - [x] 13.5 Implement `createMovieReview(id, payload)` thunk; on fulfilled append to `reviews`
  - [x] 13.6 Wire all pending/rejected cases

- [x] 14. Movie page wiring
  - [x] 14.1 `MovieCenterPage.jsx` — dispatch `fetchMovies` with current filter/tab/page params on mount and on every control change; replace hardcoded `ALL_MOVIES` array; show loading/error states
  - [x] 14.2 `MovieDetailPage.jsx` — dispatch `fetchMovie(id)` on mount; wire `RelatedMoviesCarousel` to dispatch `fetchMovies({ genres: selectedMovie.genres[0] })` when `selectedMovie` is loaded, excluding the current movie; wire `ReviewsCommentsSection` to `fetchMovieReviews` / `createMovieReview`
  - [x] 14.3 `MovieRequestPage.jsx` — call `movieService.getUserMovieRequests()` on mount; replace hardcoded `requests` array; show loading indicator while in-flight; call `submitMovieRequest` on form submit (re-fetch on success, show error without clearing form on failure); call `cancelMovieRequest` on cancel click (remove entry on success, show error and retain entry on failure)

- [x] 15. Product service (`productService.js`)
  - [x] 15.1 Implement `getProducts(params)` → `GET /api/products`
  - [x] 15.2 Implement `getProduct(id)` → `GET /api/products/:id`

- [x] 16. Product Redux slice (`productSlice.js`)
  - [x] 16.1 Define initial state: `products: [], selectedProduct: null, loading: false, error: null, pagination: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 12 }`
  - [x] 16.2 Implement `fetchProducts(params)` thunk; on fulfilled map paginated envelope to slice state
  - [x] 16.3 Implement `fetchProduct(id)` thunk; on fulfilled set `selectedProduct`
  - [x] 16.4 Wire all pending/rejected cases

- [x] 17. Product page wiring
  - [x] 17.1 `ElectronicsPage.jsx` — dispatch `fetchProducts` with current filter/sort/page params on mount and on every control change; replace hardcoded products array; show loading/error states
  - [x] 17.2 `ProductDetailPage.jsx` — dispatch `fetchProduct(id)` on mount; wire `SimilarProducts` to dispatch `fetchProducts({ category: selectedProduct.category })` when `selectedProduct` is loaded, excluding the current product

- [x] 18. Order service (`orderService.js`)
  - [x] 18.1 Implement `placeOrder(payload)` → `POST /api/orders` with `{ productId, quantity }`
  - [x] 18.2 Implement `getOrder(id)` → `GET /api/orders/:id`
  - [x] 18.3 Implement `getOrderHistory()` → `GET /api/users/me/orders`

- [x] 19. Order page wiring
  - [x] 19.1 `ProductDetailPage.jsx` (order flow) — on confirm pick-up button click call `orderService.placeOrder`; disable button with loading indicator while in-flight; on success navigate to `/order-confirmation` passing returned order data via `location.state`; on failure display server error and re-enable button
  - [x] 19.2 `OrderConfirmationPage.jsx` — read order from `location.state.order`; if absent call `orderService.getOrder(id)` using route param; display real order ID, items, and total; replace hardcoded reservation object
  - [x] 19.3 `PurchaseHistoryPage.jsx` — call `orderService.getOrderHistory()` on mount; replace hardcoded orders array with API response; display real pagination data

- [x] 20. User profile service (`userService.js` — profile methods)
  - [x] 20.1 Implement `getProfile()` → `GET /api/users/me`
  - [x] 20.2 Implement `updateProfile(payload)` → `PUT /api/users/me`
  - [x] 20.3 Implement `uploadAvatar(formData)` → `POST /api/users/me/avatar` with `Content-Type: multipart/form-data`
  - [x] 20.4 Implement `getUserStats()` → `GET /api/users/me/stats`
  - [x] 20.5 Implement `getUserActivity()` → `GET /api/users/me/activity`

- [ ] 21. User dashboard page wiring (`UserDashboardPage.jsx`)
  - [x] 21.1 On mount call `Promise.all([getProfile(), getUserStats(), getUserActivity()])` concurrently; replace hardcoded `user`, `stats`, and `activities` objects; show loading skeleton while any call is pending
  - [ ] 21.2 On profile edit form submit call `userService.updateProfile`; update displayed profile with server response on success; display error on failure
  - [~] 21.3 On avatar file select and upload form submit call `userService.uploadAvatar`; update displayed avatar URL on success; display error on failure

- [ ] 22. Borrowing history service (`userService.js` — borrowing methods)
  - [x] 22.1 Implement `getBorrowingHistory()` → `GET /api/users/me/borrowings`
  - [~] 22.2 Implement `renewBorrowing(borrowingId)` → `POST /api/borrowings/:id/renew`
  - [~] 22.3 Implement `returnBook(borrowingId)` → `POST /api/borrowings/:id/return`

- [ ] 23. Borrowing history page wiring (`BorrowingHistoryPage.jsx`)
  - [~] 23.1 Call `getBorrowingHistory()` on mount; replace hardcoded `borrowings` array; show loading indicator while in-flight
  - [~] 23.2 On Renew click call `userService.renewBorrowing(id)`; on success update record's due date and renewal count from response; on failure show error and retain original record
  - [~] 23.3 On Return click call `userService.returnBook(id)`; on success update record status to `Returned`; on failure show error and retain original status

- [ ] 24. Wishlist service (`userService.js` — wishlist methods)
  - [~] 24.1 Implement `getWishlist()` → `GET /api/users/me/wishlist`
  - [~] 24.2 Implement `addToWishlist(payload)` → `POST /api/users/me/wishlist` with `{ itemId, itemType }`
  - [~] 24.3 Implement `removeFromWishlist(itemId)` → `DELETE /api/users/me/wishlist/:itemId`

- [ ] 25. Wishlist Redux slice (`wishlistSlice.js`)
  - [~] 25.1 Define initial state: `items: [], loading: false, error: null`
  - [~] 25.2 Implement `fetchWishlist` thunk → `userService.getWishlist`; on fulfilled set `items`
  - [~] 25.3 Implement `addWishlistItem` thunk → `userService.addToWishlist`; in pending case snapshot current items and immediately push an optimistic entry; in fulfilled case replace items with server response; in rejected case restore snapshot and set error
  - [~] 25.4 Implement `removeWishlistItem` thunk → `userService.removeFromWishlist`; in pending case snapshot current items and immediately filter out the target id; in fulfilled case set `loading: false`; in rejected case restore snapshot and set error
  - [~] 25.5 Wire all pending/rejected cases for `fetchWishlist`

- [ ] 26. Wishlist page wiring
  - [~] 26.1 `WishlistPage.jsx` — dispatch `fetchWishlist()` on mount; replace hardcoded `wishlistItems` array with `wishlist.items` from store; show loading/error states
  - [~] 26.2 `BookCard.jsx`, `MovieCard.jsx`, `ProductCard.jsx` — wire wishlist bookmark/icon to dispatch `addWishlistItem` or `removeWishlistItem` with `{ itemId, itemType }` as appropriate

- [ ] 27. Notifications service (`userService.js` — notification methods)
  - [~] 27.1 Implement `getNotifications()` → `GET /api/users/me/notifications`
  - [~] 27.2 Implement `markNotificationRead(id)` → `PATCH /api/notifications/:id/read`
  - [~] 27.3 Implement `markAllNotificationsRead()` → `POST /api/users/me/notifications/read-all`
  - [~] 27.4 Implement `deleteAllNotifications()` → `DELETE /api/users/me/notifications`

- [ ] 28. Notification Redux slice (`notificationSlice.js`)
  - [~] 28.1 Define initial state: `notifications: [], unreadCount: 0, loading: false, error: null`
  - [~] 28.2 Implement `fetchNotifications` thunk; on fulfilled set `notifications` and recalculate `unreadCount` from `notifications.filter(n => !n.isRead).length`
  - [~] 28.3 Implement `markOneRead(id)` thunk; on fulfilled set `isRead: true` on the matching notification and decrement `unreadCount`; on rejected set error and preserve previous state
  - [~] 28.4 Implement `markAllRead` thunk; on fulfilled set all `isRead: true` and `unreadCount: 0`; on rejected set error and preserve state
  - [~] 28.5 Implement `clearAll` thunk; on fulfilled set `notifications: []` and `unreadCount: 0`; on rejected set error and preserve state
  - [~] 28.6 Wire all pending cases: `loading: true`

- [ ] 29. Notifications page wiring
  - [~] 29.1 `NotificationsPage.jsx` — dispatch `fetchNotifications()` on mount; replace hardcoded notifications array; show loading state; show error banner with retry on failure
  - [~] 29.2 On single notification click dispatch `markOneRead(id)`; on failure show error
  - [~] 29.3 On "Mark All as Read" click dispatch `markAllRead`; on failure show error and retain previous state
  - [~] 29.4 On "Clear All" click dispatch `clearAll`; on failure show error and retain previous state

- [ ] 30. Search service (`searchService.js`)
  - [~] 30.1 Implement `search({ q, type, page, limit = 20 })` → `GET /api/search` with query params `q`, `type`, `page`, `limit`

- [ ] 31. Search page wiring (`SearchResultsPage.jsx`)
  - [~] 31.1 On mount and whenever URL `?q=` changes, call `searchService.search({ q, type, page })`; replace hardcoded `allResults` array
  - [~] 31.2 On tab selection pass `type=movie|book|product` or omit for "All"; on failure display error banner while preserving any previously loaded results; on empty results show empty-state message distinct from error

- [ ] 32. Contact service (`contactService.js`)
  - [~] 32.1 Create `client/src/services/contactService.js`
  - [~] 32.2 Implement `submitContact(payload)` → `POST /api/contact` with `{ name, email, subject, message }`

- [ ] 33. Contact page wiring (`ContactPage.jsx`)
  - [~] 33.1 On form submit call `contactService.submitContact`; disable submit button with loading indicator while in-flight
  - [~] 33.2 On success show the success card and hide any error
  - [~] 33.3 On failure show server error message (or `"Something went wrong. Please try again."` fallback) inside the form area, retain user's form data, do not show the success card

- [ ] 34. Admin service (`adminService.js`)
  - [~] 34.1 Implement dashboard methods: `getStats()` → `GET /api/admin/stats`; `getRecentActivity()` → `GET /api/admin/recent`
  - [~] 34.2 Implement book CRUD: `getAdminBooks()` → `GET /api/admin/books`; `createBook(payload)` → `POST /api/admin/books`; `updateBook(id, payload)` → `PUT /api/admin/books/:id`; `deleteBook(id)` → `DELETE /api/admin/books/:id`
  - [~] 34.3 Implement movie CRUD: `getAdminMovies()`, `createMovie`, `updateMovie`, `deleteMovie` — same pattern for `/api/admin/movies`
  - [~] 34.4 Implement product CRUD: `getAdminProducts()`, `createProduct`, `updateProduct`, `deleteProduct` — same pattern for `/api/admin/products`
  - [~] 34.5 Implement movie requests methods: `getMovieRequests()` → `GET /api/admin/movie-requests`; `updateMovieRequestStatus(id, status)` → `PATCH /api/admin/movie-requests/:id`
  - [~] 34.6 Implement `getContactSubmissions()` → `GET /api/admin/contacts`

- [ ] 35. Admin Redux slice (`adminSlice.js`)
  - [~] 35.1 Define initial state: `stats: null, recentActivity: [], books: [], movies: [], products: [], movieRequests: [], contactSubmissions: [], loading: false, error: null`
  - [~] 35.2 Implement `fetchAdminStats` and `fetchRecentActivity` thunks
  - [~] 35.3 Implement book thunks: `fetchAdminBooks`, `createBook`, `updateBook`, `deleteBook`; on fulfilled `createBook` push to `state.books`; on fulfilled `updateBook` replace the item; on fulfilled `deleteBook` filter out
  - [~] 35.4 Implement movie thunks: `fetchAdminMovies`, `createMovie`, `updateMovie`, `deleteMovie` — same fulfilled patterns
  - [~] 35.5 Implement product thunks: `fetchAdminProducts`, `createProduct`, `updateProduct`, `deleteProduct` — same fulfilled patterns
  - [~] 35.6 Implement `fetchMovieRequests` and `updateMovieRequestStatus` thunks
  - [~] 35.7 Implement `fetchContactSubmissions` thunk
  - [~] 35.8 Wire all pending/rejected cases: `loading: true` / `loading: false, error: action.payload`

- [ ] 36. Admin page wiring
  - [~] 36.1 `AdminDashboardPage.jsx` — dispatch `fetchAdminStats` and `fetchRecentActivity` concurrently on mount; replace hardcoded stats and recent additions with `admin.stats` and `admin.recentActivity`; show loading/error states
  - [~] 36.2 `AdminManageBooksPage.jsx` — dispatch `fetchAdminBooks` on mount; replace hardcoded book list with `admin.books`; on create dispatch `createBook`; on edit dispatch `updateBook`; on delete dispatch `deleteBook`; on any failure display server error and retain previous list
  - [~] 36.3 `AdminManageMoviesPage.jsx` — same pattern as books, using movie thunks and `admin.movies`
  - [~] 36.4 `AdminManageElectronicsPage.jsx` — same pattern as books, using product thunks and `admin.products`

- [ ] 37. Property-based tests — Auth slice (Properties 2, 3, 4, 5, 6)
  - [~] 37.1 Write property test for Property 2: loginThunk sets token and user in Redux state
  - [~] 37.2 Write property test for Property 3: loginThunk persists token to localStorage
  - [~] 37.3 Write property test for Property 4: registerThunk sets token and user
  - [~] 37.4 Write property test for Property 5: logoutAction clears all auth state
  - [~] 37.5 Write property test for Property 6: failed auth thunk sets auth.error to the rejection string

- [ ] 38. Property-based tests — API interceptors (Properties 1, 13, 14)
  - [~] 38.1 Write property test for Property 1: auth request interceptor attaches Bearer token
  - [~] 38.2 Write property test for Property 13: response interceptor extracts error string
  - [~] 38.3 Write property test for Property 14: 401 response triggers logout and state reset

- [ ] 39. Property-based tests — Pagination and slices (Properties 7, 8, 9, 10, 11, 12)
  - [~] 39.1 Write property test for Property 7: pagination invariant for book, movie, and product slices
  - [~] 39.2 Write property test for Property 8: search results pagination invariant
  - [~] 39.3 Write property test for Property 9: wishlist optimistic rollback on rejected add
  - [~] 39.4 Write property test for Property 10: notificationSlice unreadCount derivation
  - [~] 39.5 Write property test for Property 11: markAllRead sets all notifications to read
  - [~] 39.6 Write property test for Property 12: clearAll empties notifications


## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2", "4"] },
    { "wave": 2, "tasks": ["3"] },
    { "wave": 3, "tasks": ["5", "6"] },
    { "wave": 4, "tasks": ["7", "8", "9", "12", "15", "18", "20", "22", "24", "27", "30", "32", "34"] },
    { "wave": 5, "tasks": ["10", "13", "16", "25", "28", "35"] },
    { "wave": 6, "tasks": ["11", "14", "17", "19", "21", "23", "26", "29", "31", "33", "36"] },
    { "wave": 7, "tasks": ["37", "38", "39"] }
  ],
  "dependencies": {
    "3":  ["2"],
    "5":  ["3"],
    "6":  ["1", "5"],
    "7":  ["6"],
    "8":  ["6"],
    "9":  ["3"],
    "10": ["9"],
    "11": ["10"],
    "12": ["3"],
    "13": ["12"],
    "14": ["13"],
    "15": ["3"],
    "16": ["15"],
    "17": ["16"],
    "18": ["3"],
    "19": ["18"],
    "20": ["3"],
    "21": ["20"],
    "22": ["3"],
    "23": ["22"],
    "24": ["3"],
    "25": ["24"],
    "26": ["25"],
    "27": ["3"],
    "28": ["27"],
    "29": ["28"],
    "30": ["3"],
    "31": ["30"],
    "32": ["3"],
    "33": ["32"],
    "34": ["3"],
    "35": ["34"],
    "36": ["35"],
    "37": ["6"],
    "38": ["3", "6"],
    "39": ["10", "13", "16", "25", "28"]
  }
}
```

## Notes

- All service functions must use the `API` Axios instance from `api.js`; they must never set the `Authorization` header manually (the request interceptor handles it).
- Redux thunks must always wrap service calls in `try/catch` and call `rejectWithValue(err)` so that `err` (already a plain string from the interceptor) is stored in `action.payload` and not `action.error.message`.
- The `authSlice` rehydration from `localStorage` is **synchronous** (runs at module load time), so `initialized` is always `true` by first render. The loading spinner in `ProtectedRoute` / `AdminRoute` is defensive, not expected to trigger in normal use.
- Optimistic updates in `wishlistSlice` use a module-level snapshot variable. This is safe for single-user sessions; a more robust approach could store the snapshot as thunk metadata.
- `contactService.js` is a new file (no stub exists); all other service files are stubs that need their functions implemented.
- The seed script must be idempotent — re-running it must not create duplicate documents.
- Property tests live in `client/src/__tests__/properties/` and use Vitest + fast-check with `numRuns: 100`. Each test must be tagged with `// Feature: full-stack-integration, Property N: <title>`.
           