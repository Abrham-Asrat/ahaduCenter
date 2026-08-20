# Requirements Document

## Introduction

This feature connects the AhaduCenter React frontend to the existing Node.js/Express backend. All client pages currently render hardcoded mock arrays and use localStorage-based fake authentication. The backend exposes fully implemented REST routes for auth, books, borrowings, movies, movie-requests, products, orders, notifications, search, contact, user profile, wishlist, upload, and admin management. This integration replaces every mock dataset and fake auth flow with real API calls through the existing service layer and Redux Toolkit slices, configures MongoDB with seed data, and establishes correct client-server communication settings.

---

## Glossary

- **API**: The Express REST API running on port 5000 with base path `/api`.
- **Client**: The Vite/React 18 single-page application running on port 5173.
- **Redux_Store**: The Redux Toolkit store configured in `client/src/redux/store.js`.
- **Service_Layer**: The per-domain Axios service files (`authService.js`, `bookService.js`, `movieService.js`, `productService.js`, `orderService.js`, `userService.js`, `adminService.js`, `searchService.js`, `contactService.js`).
- **JWT**: JSON Web Token issued by the server on login/register and stored client-side for authenticated requests under the `token` localStorage key.
- **Seed_Script**: A Node.js script at `server/src/seed.js` that inserts default documents into MongoDB so the application works immediately after first install.
- **Admin_User**: A user document with `role: 'admin'` created by the seed script.
- **Mock_Data**: Hardcoded JavaScript arrays or object literals inside component or page files that substitute for real API responses.
- **Redux_Slice**: A `createSlice` / `createAsyncThunk` unit in `client/src/redux/slices/` that manages domain state and async API calls.
- **Protected_Route**: A React Router route that redirects unauthenticated users to `/login`.
- **Admin_Route**: A React Router route that redirects non-admin users to `/login` when unauthenticated, or to `/` when authenticated but not admin.
- **CORS**: Cross-Origin Resource Sharing configuration on the Express server.
- **Env_Var**: An environment variable loaded via `dotenv` (server) or `import.meta.env` (client).

---

## Requirements

### Requirement 1: Environment and Communication Configuration

**User Story:** As a developer, I want the client and server to be correctly configured so that API calls succeed in both local and production environments without manual URL changes.

#### Acceptance Criteria

1. THE Client SHALL read the API base URL from the `VITE_API_BASE_URL` environment variable defined in `client/.env`.
2. THE API (`api.js`) SHALL use `VITE_API_BASE_URL` as the Axios `baseURL`; IF `VITE_API_BASE_URL` is absent or empty, THEN the `baseURL` SHALL default to `http://localhost:5000/api`.
3. WHEN a JWT token is present in `localStorage` under the key `token` and an outgoing request is being made, THE API SHALL attach an `Authorization: Bearer <token>` header to that request via the Axios request interceptor.
4. THE Server SHALL allow CORS requests from the origin specified by `CLIENT_ORIGIN`, and SHALL permit the HTTP methods GET, POST, PUT, PATCH, DELETE, and OPTIONS, and SHALL handle OPTIONS preflight requests.
5. WHEN `CLIENT_ORIGIN` is not set, THE Server SHALL default to allowing `http://localhost:5173`.
6. THE Server `.env` file SHALL contain `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `OVERDUE_FEE_PER_DAY`, and `RESERVATION_FEE` variables; IF any of these required variables is absent at startup, THEN THE Server SHALL log an error identifying the missing variable name and exit with a non-zero code.
7. THE Client `.env` file SHALL contain `VITE_API_BASE_URL=http://localhost:5000/api`.

---

### Requirement 2: Database Seed Data

**User Story:** As a developer, I want the database to be populated with default data so that the application is functional immediately after setup without requiring manual data entry.

#### Acceptance Criteria

1. IF an Admin_User with email `admin@ahaducenter.com` does not exist in the database, THEN THE Seed_Script SHALL create one with password `admin123` (bcrypt-hashed) and `role: 'admin'`.
2. IF a user with email `user@ahaducenter.com` does not exist in the database, THEN THE Seed_Script SHALL create one with password `user123` (bcrypt-hashed) and `role: 'user'`.
3. IF the books collection is empty, THEN THE Seed_Script SHALL insert at least 8 sample Book documents spanning at least 3 distinct categories, 2 distinct languages, and all 3 availability states (available, borrowed, reserved).
4. IF the movies collection is empty, THEN THE Seed_Script SHALL insert at least 8 sample Movie documents spanning at least 3 distinct genres and 2 distinct countries.
5. IF the products collection is empty, THEN THE Seed_Script SHALL insert at least 6 sample Product documents spanning at least 3 distinct categories (e.g. Laptops, Audio, Accessories).
6. WHEN the seed script is run more than once, THE Seed_Script SHALL skip insertion for any collection that already contains documents, preventing duplicate data.
7. THE Seed_Script SHALL be executable via `npm run seed` defined in `server/package.json`.
8. WHEN the seed script completes, THE Seed_Script SHALL log a per-collection summary showing the count of created documents and the names of skipped collections.
9. IF the database connection fails during the seed script, THEN THE Seed_Script SHALL log the error and exit with a non-zero code.

---

### Requirement 3: Authentication Service and Redux Integration

**User Story:** As a user, I want my login, registration, and password-reset actions to communicate with the real backend so that my account is persisted across sessions.

#### Acceptance Criteria

1. THE `authService` SHALL implement a `login(email, password)` function that sends `POST /api/auth/login` and returns the server response.
2. THE `authService` SHALL implement a `register(name, email, password)` function that sends `POST /api/auth/register` and returns the server response.
3. THE `authService` SHALL implement a `forgotPassword(email)` function that sends `POST /api/auth/forgot-password` and returns the server response.
4. THE `authService` SHALL implement a `resetPassword(token, newPassword)` function that sends `POST /api/auth/reset-password` and returns the server response.
5. THE `authSlice` SHALL define a `loginThunk` async thunk that calls `authService.login`, stores the returned JWT from `response.body.token` in `localStorage` under the key `token`, and sets `auth.user` (containing `name`, `email`, and `role`) and `auth.token` in the Redux_Store.
6. THE `authSlice` SHALL define a `registerThunk` async thunk that calls `authService.register`, stores the JWT on success, and sets `auth.user` and `auth.token` in the Redux_Store.
7. THE `authSlice` SHALL define a `logoutAction` that removes the token from `localStorage` and clears `auth.user` and `auth.token` to `null`.
8. WHEN the Client application initialises and a token is present in `localStorage`, THE `authSlice` SHALL rehydrate `auth.token` from `localStorage` and set `auth.user` from the decoded token payload containing `name`, `email`, and `role`.
9. WHEN the Client application initialises and no token is present in `localStorage`, THE `authSlice` SHALL set `auth.user` and `auth.token` to `null`.
10. THE `LoginPage` SHALL remove all hardcoded credential quick-fill buttons and localStorage fake-auth logic, replacing form submission with a dispatch of `loginThunk`.
11. THE `RegisterPage` SHALL dispatch `registerThunk` on valid form submission.
12. THE `ForgotPasswordPage` SHALL call `authService.forgotPassword` on form submission; WHEN the request completes without a network or API error, THE page SHALL display a success message; IF the request fails with a network or API error, THE page SHALL display the error message.
13. IF the login or register thunk fails, THEN THE `authSlice` SHALL set `auth.error` to the server error message and THE `LoginPage` or `RegisterPage` SHALL display that message.

---

### Requirement 4: Protected and Admin Route Guards

**User Story:** As a site owner, I want unauthenticated users to be redirected to login and non-admin users to be blocked from admin pages so that sensitive pages are protected.

#### Acceptance Criteria

1. IF `auth.token` is absent in the Redux_Store when a protected route is accessed, THEN THE `ProtectedRoute` component SHALL redirect to `/login`.
2. IF `auth.token` is absent in the Redux_Store when an admin route is accessed, THEN THE `AdminRoute` component SHALL redirect to `/login`; IF `auth.token` is present but `auth.user.role` is not `'admin'`, THEN THE `AdminRoute` SHALL redirect to `/`.
3. THE `/account`, `/wishlist`, `/purchase-history`, `/borrowing-history`, `/movie-request`, `/notifications`, and `/book-confirm` routes SHALL be wrapped with `ProtectedRoute`.
4. THE `/admin`, `/admin/movies`, `/admin/books`, and `/admin/electronics` routes SHALL be wrapped with `AdminRoute`.
5. IF `auth.token` is absent, THEN THE `Navbar` SHALL display Sign In and Register links; IF `auth.token` is present, THEN THE `Navbar` SHALL display the user avatar and a logout button, and SHALL NOT display Sign In or Register links.
6. WHEN the Redux_Store is initialising (during token rehydration), THE `ProtectedRoute` and `AdminRoute` components SHALL render a loading state instead of immediately redirecting, to prevent a flash-redirect before auth state is resolved.
7. WHEN a user clicks logout, THE Client SHALL dispatch `logoutAction`, which removes the token from `localStorage`, clears `auth.user` and `auth.token`, and redirects to `/`.

---

### Requirement 5: Book Service and Redux Slice

**User Story:** As a user, I want the Book Center to display real books from the database so that I can browse, borrow, reserve, and review actual catalog entries.

#### Acceptance Criteria

1. THE `bookService` SHALL implement `getBooks(params)` that sends `GET /api/books` with query parameters for search, category, availability, format, language, sort, page, and limit.
2. THE `bookService` SHALL implement `getBook(id)` that sends `GET /api/books/:id`.
3. THE `bookService` SHALL implement `borrowBook(id)` that sends `POST /api/books/:id/borrow` with the auth header.
4. THE `bookService` SHALL implement `reserveBook(id)` that sends `POST /api/books/:id/reserve` with the auth header.
5. THE `bookService` SHALL implement `getBookReviews(id, params)` that sends `GET /api/books/:id/reviews`.
6. THE `bookService` SHALL implement `createBookReview(id, payload)` that sends `POST /api/books/:id/reviews` with the auth header.
7. THE `bookSlice` SHALL define `fetchBooks`, `fetchBook`, `borrowBook`, `reserveBook`, `fetchBookReviews`, and `createBookReview` async thunks backed by the corresponding `bookService` functions.
8. THE `bookSlice` SHALL maintain `books`, `selectedBook`, `reviews`, `loading`, `error`, and `pagination` fields in its state, where `pagination` contains `totalItems`, `totalPages`, `currentPage`, and `limit`.
9. WHEN `BookCenterPage` mounts, THE page SHALL dispatch `fetchBooks` with default parameters and read books from the Redux_Store, replacing all hardcoded book arrays.
10. WHEN `BookDetailPage` mounts, THE page SHALL dispatch `fetchBook(id)` using the URL param `:id`, replacing the hardcoded book object.
11. WHEN a user clicks Borrow or Reserve on a book, THE `BookDetailPage` SHALL dispatch the corresponding thunk and display the server response message; IF no message is returned, THE page SHALL display a human-readable fallback.
12. WHEN `BookDetailPage` mounts, THE `ReviewsCommentsSection` SHALL dispatch `fetchBookReviews(id)` to load reviews; WHEN an authenticated user submits the review form, THE section SHALL dispatch `createBookReview(id, payload)`.
13. WHEN a user interacts with pagination controls on `BookCenterPage`, THE page SHALL dispatch `fetchBooks` with the updated `page` and `limit` parameters.

---

### Requirement 6: Movie Service and Redux Slice

**User Story:** As a user, I want the Movie Center to show real movies from the database so that I can browse, filter, and review actual titles.

#### Acceptance Criteria

1. THE `movieService` SHALL implement `getMovies(params)` that sends `GET /api/movies` with query parameters for search, genres, country, type, sort, page, and limit.
2. THE `movieService` SHALL implement `getMovie(id)` that sends `GET /api/movies/:id`.
3. THE `movieService` SHALL implement `getMovieReviews(id, params)` that sends `GET /api/movies/:id/reviews`.
4. THE `movieService` SHALL implement `createMovieReview(id, payload)` that sends `POST /api/movies/:id/reviews` with the auth header.
5. THE `movieSlice` SHALL define `fetchMovies`, `fetchMovie`, `fetchMovieReviews`, and `createMovieReview` async thunks backed by the corresponding `movieService` functions.
6. THE `movieSlice` SHALL maintain `movies`, `selectedMovie`, `reviews`, `loading`, `error`, and `pagination` fields in its state.
7. WHEN `MovieCenterPage` mounts or when a filter, tab, or page control changes, THE page SHALL dispatch `fetchMovies` with the current filter parameters, replacing the hardcoded `ALL_MOVIES` array.
8. WHEN `MovieDetailPage` mounts, THE page SHALL dispatch `fetchMovie(id)` using the URL param `:id`, replacing the hardcoded movie object and related movies.
9. WHEN `selectedMovie` is loaded and contains a `genres` array, THE `RelatedMoviesCarousel` SHALL dispatch `fetchMovies` filtered by the first genre of `selectedMovie`, excluding the current movie from results.
10. WHEN `MovieDetailPage` mounts, THE `ReviewsCommentsSection` SHALL dispatch `fetchMovieReviews(id)` to load reviews; WHEN an authenticated user submits the review form, THE section SHALL dispatch `createMovieReview(id, payload)` and display the server error message on failure.

---

### Requirement 7: Movie Request Service

**User Story:** As an authenticated user, I want to submit and cancel movie requests that are persisted in the database so that admins can see and action them.

#### Acceptance Criteria

1. THE `movieService` SHALL implement `submitMovieRequest(payload)` that sends `POST /api/movie-requests` with the auth header.
2. THE `movieService` SHALL implement `getUserMovieRequests()` that sends `GET /api/users/me/movie-requests` with the auth header.
3. THE `movieService` SHALL implement `cancelMovieRequest(id)` that sends `DELETE /api/movie-requests/:id` with the auth header.
4. WHEN `MovieRequestPage` mounts, THE page SHALL call `getUserMovieRequests`, display a loading indicator while the request is in-flight, and replace the hardcoded `requests` array with the API response; IF the call fails, THE page SHALL display an error message.
5. WHEN a user submits the request form, THE `MovieRequestPage` SHALL call `submitMovieRequest`; IF the call succeeds, THE page SHALL re-fetch and display the updated request list; IF the call fails, THE page SHALL display the server error message without clearing the form.
6. WHEN a user clicks cancel on a request with status `pending`, THE `MovieRequestPage` SHALL call `cancelMovieRequest`; IF the call succeeds, THE page SHALL remove the entry from the displayed list; IF the call fails, THE page SHALL display the server error message and retain the entry.

---

### Requirement 8: Product Service and Redux Slice

**User Story:** As a user, I want the Electronics Hub to display real products from the database so that I can browse, filter, and place in-store pick-up orders.

#### Acceptance Criteria

1. THE `productService` SHALL implement `getProducts(params)` that sends `GET /api/products` with query parameters for search, category, condition, brand, maxPrice, sort, page, and limit.
2. THE `productService` SHALL implement `getProduct(id)` that sends `GET /api/products/:id`.
3. THE `productSlice` SHALL define `fetchProducts` and `fetchProduct` async thunks backed by the corresponding `productService` functions.
4. THE `productSlice` SHALL maintain `products`, `selectedProduct`, `loading`, `error`, and `pagination` fields in its state, where `pagination` contains `totalItems`, `totalPages`, `currentPage`, and `limit`.
5. WHEN `ElectronicsPage` mounts or when a filter or sort control changes, THE page SHALL dispatch `fetchProducts` with the current parameters, replacing the hardcoded `products` array.
6. WHEN `ProductDetailPage` mounts, THE page SHALL dispatch `fetchProduct(id)` using the URL param `:id`, replacing the hardcoded product object.
7. WHEN `selectedProduct` is loaded and contains a `category` field, THE `SimilarProducts` component SHALL dispatch `fetchProducts` filtered by that category, excluding the current product from results.
8. WHEN a user interacts with pagination controls on `ElectronicsPage`, THE page SHALL dispatch `fetchProducts` with the updated `page` and `limit` parameters.

---

### Requirement 9: Order Service

**User Story:** As an authenticated user, I want to place and view in-store pick-up orders that are stored in the database so that the admin and I can track them.

#### Acceptance Criteria

1. THE `orderService` SHALL implement `placeOrder(payload)` that sends `POST /api/orders` with the auth header and a body containing `productId` and `quantity`.
2. THE `orderService` SHALL implement `getOrder(id)` that sends `GET /api/orders/:id` with the auth header.
3. THE `orderService` SHALL implement `getOrderHistory()` that sends `GET /api/users/me/orders` with the auth header.
4. WHEN a user clicks the confirm pick-up button on `ProductDetailPage`, THE Client SHALL call `orderService.placeOrder` with the selected product ID and quantity; IF the call succeeds, THE Client SHALL navigate to `OrderConfirmationPage` with the returned order data.
5. IF `placeOrder` returns an error, THEN THE `ProductDetailPage` SHALL display the server error message and keep the confirm button enabled for retry; IF the call is in-flight, THE button SHALL be disabled with a loading indicator.
6. WHEN `OrderConfirmationPage` mounts, THE page SHALL display server-returned order data (order ID, items, total) from navigation state or from `orderService.getOrder(id)`, replacing any hardcoded reservation object.
7. WHEN `PurchaseHistoryPage` mounts, THE page SHALL call `orderService.getOrderHistory` and display real orders with server-returned pagination data, replacing the hardcoded `orders` array.

---

### Requirement 10: User Profile Service

**User Story:** As an authenticated user, I want my dashboard to display real profile data, stats, and recent activity fetched from the server.

#### Acceptance Criteria

1. THE `userService` SHALL implement `getProfile()` that sends `GET /api/users/me` with the auth header.
2. THE `userService` SHALL implement `updateProfile(payload)` that sends `PUT /api/users/me` with the auth header.
3. THE `userService` SHALL implement `uploadAvatar(formData)` that sends `POST /api/users/me/avatar` with a `multipart/form-data` content type and the auth header.
4. THE `userService` SHALL implement `getUserStats()` that sends `GET /api/users/me/stats` with the auth header.
5. THE `userService` SHALL implement `getUserActivity()` that sends `GET /api/users/me/activity` with the auth header.
6. WHEN `UserDashboardPage` mounts, THE page SHALL call `getProfile`, `getUserStats`, and `getUserActivity` concurrently, replacing the hardcoded `user`, `stats`, and `activities` objects with the API responses; WHILE any call is pending, THE page SHALL show a loading skeleton.
7. WHEN the user submits the profile edit form, THE `UserDashboardPage` SHALL call `userService.updateProfile`; IF the call succeeds, THE page SHALL update the displayed profile data with the server response; IF the call fails, THE page SHALL display the server error message.
8. WHEN an avatar file is selected and the upload form is submitted, THE `UserDashboardPage` SHALL call `userService.uploadAvatar`; IF the call succeeds, THE page SHALL update the displayed avatar URL with the server response; IF the call fails, THE page SHALL display the server error message.

---

### Requirement 11: Borrowing History Service

**User Story:** As an authenticated user, I want my borrowing history page to show real borrowing records from the database so that I can track active loans, renewals, and returns.

#### Acceptance Criteria

1. THE `userService` SHALL implement `getBorrowingHistory()` that sends `GET /api/users/me/borrowings` with the auth header.
2. THE `userService` SHALL implement `renewBorrowing(borrowingId)` that sends `POST /api/borrowings/:id/renew` with the auth header.
3. THE `userService` SHALL implement `returnBook(borrowingId)` that sends `POST /api/borrowings/:id/return` with the auth header.
4. WHEN `BorrowingHistoryPage` mounts, THE page SHALL call `getBorrowingHistory`, display a loading indicator while in-flight, and replace the hardcoded `borrowings` array with the API response.
5. WHEN a user clicks Renew on an active borrowing, THE `BorrowingHistoryPage` SHALL call `userService.renewBorrowing`; IF the call succeeds, THE page SHALL update the record's due date and renewals count from the server response; IF the call fails, THE page SHALL display the server error message and retain the original record.
6. WHEN a user clicks Return on an active borrowing, THE `BorrowingHistoryPage` SHALL call `userService.returnBook`; IF the call succeeds, THE page SHALL update the record's status to `Returned` in the displayed list; IF the call fails, THE page SHALL display the server error message and retain the original status.

---

### Requirement 12: Wishlist Service and Redux Slice

**User Story:** As an authenticated user, I want my wishlist to be persisted on the server so that saved items appear across devices and sessions.

#### Acceptance Criteria

1. THE `userService` SHALL implement `getWishlist()` that sends `GET /api/users/me/wishlist` with the auth header.
2. THE `userService` SHALL implement `addToWishlist(payload)` that sends `POST /api/users/me/wishlist` with the auth header and a body containing `itemId` and `itemType`.
3. THE `userService` SHALL implement `removeFromWishlist(itemId)` that sends `DELETE /api/users/me/wishlist/:itemId` with the auth header.
4. THE `wishlistSlice` SHALL define `fetchWishlist`, `addWishlistItem`, and `removeWishlistItem` async thunks backed by the corresponding `userService` functions.
5. THE `wishlistSlice` SHALL maintain `items`, `loading`, and `error` fields; WHEN any thunk is pending, `loading` SHALL be `true`; WHEN a thunk is fulfilled, `loading` SHALL be `false` and `items` SHALL reflect the server response; WHEN a thunk is rejected, `loading` SHALL be `false` and `error` SHALL be set to the error message.
6. WHEN `WishlistPage` mounts, THE page SHALL dispatch `fetchWishlist` and replace the hardcoded `wishlistItems` array with the API response.
7. WHEN a user clicks the bookmark/wishlist icon on `MovieCard`, `BookCard`, or `ProductCard`, THE Client SHALL immediately update `wishlistSlice.items` optimistically before the server response; WHEN the `addWishlistItem` or `removeWishlistItem` thunk is rejected, THE Client SHALL roll back the optimistic update and set `error` to the rejection message.
8. WHEN any `wishlistSlice` thunk is rejected, THE `error` field SHALL be set to the server error message, `loading` SHALL return to `false`, and no permanent state change from that thunk SHALL persist.

---

### Requirement 13: Notifications Service and Redux Slice

**User Story:** As an authenticated user, I want to see real notifications from the server so that I am informed about my bookings, orders, and system events.

#### Acceptance Criteria

1. THE `userService` SHALL implement `getNotifications()` that sends `GET /api/users/me/notifications` with the auth header.
2. THE `userService` SHALL implement `markNotificationRead(id)` that sends `PATCH /api/notifications/:id/read` with the auth header.
3. THE `userService` SHALL implement `markAllNotificationsRead()` that sends `POST /api/users/me/notifications/read-all` with the auth header.
4. THE `userService` SHALL implement `deleteAllNotifications()` that sends `DELETE /api/users/me/notifications` with the auth header.
5. THE `notificationSlice` SHALL define `fetchNotifications`, `markOneRead`, `markAllRead`, and `clearAll` async thunks backed by the corresponding `userService` functions.
6. THE `notificationSlice` SHALL maintain `notifications`, `unreadCount`, `loading`, and `error` fields; `unreadCount` SHALL equal the count of notifications in `notifications` where `read` is `false`; WHEN `fetchNotifications` is fulfilled, `unreadCount` SHALL be recalculated from the returned array.
7. WHEN `NotificationsPage` mounts, THE page SHALL dispatch `fetchNotifications`; IF the call fails, THE page SHALL display an error message with a retry action.
8. WHEN a user clicks a single notification item, THE `NotificationsPage` SHALL dispatch `markOneRead(id)`; IF the call succeeds, THE notification's `read` field SHALL be set to `true` in the store and `unreadCount` decremented; IF the call fails, THE page SHALL display an error message.
9. WHEN a user clicks "Mark All as Read", THE `NotificationsPage` SHALL dispatch `markAllRead`; IF the call succeeds, all `read` fields in `notifications` SHALL be set to `true` and `unreadCount` set to `0`; IF the call fails, THE page SHALL display the server error message and retain the previous state.
10. WHEN a user clicks "Clear All", THE `NotificationsPage` SHALL dispatch `clearAll`; IF the call succeeds, `notifications` SHALL be set to `[]` and `unreadCount` to `0`; IF the call fails, THE page SHALL display the server error message and retain the previous state.
11. IF `auth.token` is present in the Redux_Store, THE `Navbar` SHALL read `notificationSlice.unreadCount` and display the count badge; WHEN `unreadCount` is `0`, THE badge SHALL not be visible.

---

### Requirement 14: Search Service

**User Story:** As a user, I want the global search to query the real database across all content types so that results reflect actual catalog contents.

#### Acceptance Criteria

1. THE `searchService` SHALL implement `search(params)` that sends `GET /api/search` with query parameters `q`, `type`, `page`, and `limit`, where `limit` defaults to `20` when not provided.
2. WHEN `SearchResultsPage` mounts and the URL contains a `q` parameter, THE page SHALL call `searchService.search` with that `q` value, replacing the hardcoded `allResults` array.
3. WHEN the URL `q` parameter changes (e.g. the user performs a new search), THE `SearchResultsPage` SHALL call `searchService.search` with the new `q` value.
4. WHEN the user selects the "All" tab, THE `SearchResultsPage` SHALL call `searchService.search` without a `type` parameter; WHEN "Movies" is selected, with `type=movie`; WHEN "Books" is selected, with `type=book`; WHEN "Electronics" is selected, with `type=product`.
5. IF the search API returns an error, THEN THE `SearchResultsPage` SHALL display an error message; IF results were previously loaded, THEN THE page SHALL retain those results; IF no results were previously loaded, THE page SHALL show an empty error state.
6. WHEN the search API returns zero results, THE `SearchResultsPage` SHALL display an empty state message distinct from the error state.

---

### Requirement 15: Contact Service

**User Story:** As a user, I want my contact form submission to be saved on the server so that the admin can review messages.

#### Acceptance Criteria

1. THE `contactService` SHALL implement `submitContact(payload)` that sends `POST /api/contact` with a body containing `name`, `email`, `subject`, and `message`.
2. WHEN a user submits the contact form, THE `ContactPage` SHALL call `contactService.submitContact`; WHILE the request is in-flight, THE submit button SHALL be disabled with a loading indicator.
3. IF the contact submission succeeds, THEN THE `ContactPage` SHALL display the success card and SHALL NOT display any error message.
4. IF the contact submission fails, THEN THE `ContactPage` SHALL display the server error message (or "Something went wrong. Please try again." if no message is returned) inside the form area, SHALL retain the user's entered form data, and SHALL NOT display the success card.

---

### Requirement 16: Admin Service and Redux Slice

**User Story:** As an admin, I want the admin pages to load real data from the database and persist CRUD operations so that catalog management is reflected immediately.

#### Acceptance Criteria

1. THE `adminService` SHALL implement `getStats()` that sends `GET /api/admin/stats` with the auth header.
2. THE `adminService` SHALL implement `getRecentActivity()` that sends `GET /api/admin/recent` with the auth header.
3. THE `adminService` SHALL implement `createBook(payload)`, `updateBook(id, payload)`, and `deleteBook(id)` that send the corresponding `POST`, `PUT`, and `DELETE` requests to `/api/admin/books` with the auth header.
4. THE `adminService` SHALL implement `createMovie(payload)`, `updateMovie(id, payload)`, and `deleteMovie(id)` that send the corresponding requests to `/api/admin/movies` with the auth header.
5. THE `adminService` SHALL implement `createProduct(payload)`, `updateProduct(id, payload)`, and `deleteProduct(id)` that send the corresponding requests to `/api/admin/products` with the auth header.
6. THE `adminService` SHALL implement `getMovieRequests()` that sends `GET /api/admin/movie-requests` and `updateMovieRequestStatus(id, status)` that sends `PATCH /api/admin/movie-requests/:id` with the auth header.
7. THE `adminService` SHALL implement `getContactSubmissions()` that sends `GET /api/admin/contacts` with the auth header.
8. THE `adminSlice` SHALL define async thunks for each `adminService` function listed above.
9. THE `adminSlice` SHALL maintain `stats`, `recentActivity`, `books`, `movies`, `products`, `movieRequests`, `contactSubmissions`, `loading`, and `error` fields in its state.
10. WHEN `AdminDashboardPage` mounts, THE page SHALL dispatch `fetchAdminStats` and `fetchRecentActivity`, replacing hardcoded stats and recent additions with data from `adminSlice.stats` and `adminSlice.recentActivity`.
11. WHEN `AdminManageBooksPage` mounts, THE page SHALL dispatch a thunk to fetch books from the API and replace the hardcoded `books` array; WHEN an admin creates, updates, or deletes a book, THE page SHALL call the corresponding `adminService` function and update the list in the Redux_Store without a full page reload.
12. WHEN `AdminManageMoviesPage` mounts, THE page SHALL follow the same pattern as `AdminManageBooksPage` for movies.
13. WHEN `AdminManageElectronicsPage` mounts, THE page SHALL follow the same pattern as `AdminManageBooksPage` for products.
14. IF any admin CRUD operation fails, THEN THE admin page SHALL display the server error message and retain the previous list state.

---

### Requirement 17: Book Confirm Page Integration

**User Story:** As a user, I want the Book Confirm page to perform real borrow or reserve API calls so that my actions are recorded in the system.

#### Acceptance Criteria

1. WHEN `BookConfirmPage` mounts, THE page SHALL read the `?action=` and `?id=` query parameters to determine the operation type and book ID.
2. WHEN `BookConfirmPage` mounts, THE page SHALL dispatch `fetchBook(id)` to load real book data, replacing the hardcoded book object; WHILE the book is loading, THE page SHALL display a loading skeleton.
3. WHEN the user confirms a borrow action, THE `BookConfirmPage` SHALL call `bookService.borrowBook(id)`.
4. WHEN the user confirms a reserve action, THE `BookConfirmPage` SHALL call `bookService.reserveBook(id)`.
5. IF an API call returns a non-2xx response or a network error occurs, THEN THE `BookConfirmPage` SHALL display the error message, keep the confirmation form visible, and enable the confirm button for retry.
6. IF the API call succeeds, THEN THE `BookConfirmPage` SHALL display the success state with server-returned details (e.g. due date for borrow, reservation expiry for reserve).

---

### Requirement 18: Error Handling and Loading States

**User Story:** As a user, I want to see loading indicators and clear error messages when API calls are in progress or fail so that I understand the state of the application.

#### Acceptance Criteria

1. WHILE an async thunk is pending, THE corresponding page or component SHALL display a loading skeleton or spinner in place of the content area.
2. IF an API call returns a non-2xx response, THEN THE Redux_Slice SHALL set its `error` field to the server error message extracted from `response.data.error` or `response.data.message`, or to a human-readable fallback string when neither field is present.
3. WHEN `error` is set in a slice after a thunk completes, THE corresponding page SHALL render an error banner or inline error with a retry action; the error banner SHALL NOT be rendered while a thunk is still pending.
4. THE API (`api.js`) SHALL implement an Axios response interceptor that intercepts 401 responses, dispatches `logoutAction`, and redirects to `/login`.
5. THE API (`api.js`) SHALL implement an Axios response interceptor that extracts `response.data.error` or `response.data.message` from non-2xx responses and re-throws the extracted string so Redux thunks and service callers receive a consistent error format.
