# Implementation Plan: AhaduCenter Backend API

## Overview

This plan implements the full AhaduCenter Node.js/Express REST API backend across 15 phases, progressing from project scaffold and core infrastructure through all service domains (Auth, Books, Movies, Electronics, Reviews, Wishlist, Notifications, Search, Uploads, Contact, Admin) and finishing with a comprehensive property-based and unit test suite using Jest + fast-check.

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["0.1", "0.2"],
      "description": "Project scaffold and environment setup"
    },
    {
      "wave": 2,
      "tasks": ["1.1", "1.2", "1.3", "1.4"],
      "description": "Core infrastructure — DB, utilities, middleware, app bootstrap",
      "dependsOn": ["0.1", "0.2"]
    },
    {
      "wave": 3,
      "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"],
      "description": "All Mongoose data models",
      "dependsOn": ["1.1"]
    },
    {
      "wave": 4,
      "tasks": ["3.1", "3.2", "3.3"],
      "description": "Authentication — validators, controller, routes",
      "dependsOn": ["1.2", "1.3", "2.1"]
    },
    {
      "wave": 5,
      "tasks": ["4.1", "4.2", "4.3"],
      "description": "User profile and dashboard",
      "dependsOn": ["3.1", "3.2", "3.3", "2.1", "2.2", "2.3", "2.4", "2.5"]
    },
    {
      "wave": 6,
      "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5", "6.1", "6.2", "6.3", "6.4", "7.1", "7.2", "7.3", "7.4", "7.5"],
      "description": "Book, Movie, and Electronics domains — catalog, borrowing, orders",
      "dependsOn": ["1.2", "1.3", "2.2", "2.3", "2.4", "4.2"]
    },
    {
      "wave": 7,
      "tasks": ["8.1", "8.2", "8.3"],
      "description": "Reviews",
      "dependsOn": ["2.5", "5.2", "6.2"]
    },
    {
      "wave": 8,
      "tasks": ["9.1", "9.2"],
      "description": "Wishlist",
      "dependsOn": ["2.5", "1.3"]
    },
    {
      "wave": 9,
      "tasks": ["10.1", "10.2", "10.3", "10.4"],
      "description": "Notifications service, controller, routes, and side-effect wiring",
      "dependsOn": ["2.5", "5.3", "7.4", "6.3"]
    },
    {
      "wave": 10,
      "tasks": ["11.1", "11.2"],
      "description": "Cross-domain search",
      "dependsOn": ["2.2", "2.3", "2.4"]
    },
    {
      "wave": 11,
      "tasks": ["12.1", "12.2", "12.3"],
      "description": "File uploads",
      "dependsOn": ["1.3"]
    },
    {
      "wave": 12,
      "tasks": ["13.1", "13.2", "13.3"],
      "description": "Contact form",
      "dependsOn": ["1.3"]
    },
    {
      "wave": 13,
      "tasks": ["14.1", "14.2", "14.3", "14.4", "14.5"],
      "description": "Admin dashboard stats, content CRUD, movie requests, contacts",
      "dependsOn": ["5.2", "5.3", "5.4", "6.2", "6.3", "7.2", "7.4", "10.1"]
    },
    {
      "wave": 14,
      "tasks": ["15.1", "15.2", "15.3", "15.4", "15.5", "15.6", "15.7", "15.8", "15.9", "15.10", "15.11", "15.12", "15.13", "15.14"],
      "description": "Full test suite — unit and property-based tests",
      "dependsOn": ["14.1", "14.2", "14.3", "14.4", "14.5"]
    }
  ]
}
```

## Tasks

- [x] 0.1 Initialize server project & install dependencies
  - Create `server/` directory at project root
  - Run `npm init -y` inside `server/`
  - Install runtime dependencies: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `express-validator`, `multer`, `nodemailer`, `dotenv`, `cors`, `uuid`
  - Install dev dependencies: `nodemon`, `jest`, `fast-check`, `supertest`, `mongodb-memory-server`
  - Create `server/jest.config.js` with `testEnvironment: 'node'`, `testMatch: ['**/__tests__/**/*.test.js']`
  - Add npm scripts to `package.json`: `start`, `dev` (nodemon), `test` (jest)

- [x] 0.2 Configure environment files & entry point
  - Create `server/.env.example` with all required keys: `PORT`, `MONGO_URI`, `JWT_SECRET`, `OVERDUE_FEE_PER_DAY`, `RESERVATION_FEE`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `CLIENT_ORIGIN`
  - Create `server/.env` (not committed) with development values
  - Create `server/server.js` — loads dotenv, imports `app`, calls `app.listen(PORT)`
  - Verify `server/.gitignore` excludes `.env`, `node_modules`, `uploads/`

- [x] 1.1 MongoDB connection config
  - Create `server/src/config/db.js`
  - Export `connectDB()` — calls `mongoose.connect(process.env.MONGO_URI)`, logs success, throws on failure
  - Import and call `connectDB()` in `server.js` before `app.listen()`

- [x] 1.2 Utility helpers
  - Create `server/src/utils/jwt.js` — export `sign(payload)` (24 h expiry, signs with `JWT_SECRET`) and `verify(token)`
  - Create `server/src/utils/paginate.js` — export `async paginate(model, filter, { page, limit, sort, select, populate })` returning `{ data, totalCount, page, totalPages, limit }` per Requirement 19.2
  - Create `server/src/utils/overdue.js` — export `calculateOverdueFee(dueDate, now = new Date())` per the linear fee formula in the design

- [x] 1.3 Middleware
  - Create `server/src/middleware/authenticate.js` — reads `Authorization: Bearer <token>`, verifies JWT via `utils/jwt.js`, attaches `req.user = { id, role }`, returns 401 on failure
  - Create `server/src/middleware/requireRole.js` — factory `requireRole(role)`, returns 403 if `req.user.role !== role`
  - Create `server/src/middleware/validate.js` — runs `validationResult(req)`, returns 422 with structured `{ errors: [{ field, message }] }` on failure
  - Create `server/src/middleware/upload.js` — configures `multer` with `diskStorage` (UUID filename), file filter (jpeg/png/webp only), 5 MB limit; returns 413 on size exceeded, 415 on wrong MIME
  - Create `server/src/middleware/errorHandler.js` — Express 4-arg error handler; handles Mongoose `ValidationError` (422), `CastError` (400), duplicate key `code 11000` (409), all others (500); never exposes stack trace

- [x] 1.4 Express app setup
  - Create `server/src/app.js`
  - Apply middleware: `cors({ origin: process.env.CLIENT_ORIGIN, methods: [...], allowedHeaders: [...] })`, `express.json()`, static `/uploads` serving
  - Handle OPTIONS preflight with HTTP 204 (via `cors` `preflightContinue: false`)
  - Mount router stubs for all 13 route namespaces under `/api` (stubs return 501 until routes are implemented)
  - Mount `errorHandler` as last middleware
  - Export `app` for use in `server.js` and tests

- [x] 2.1 User model
  - Create `server/src/models/User.js` with schema exactly matching the design document (name, email, passwordHash, phone, avatarUrl, role, resetToken, resetTokenExpiresAt, timestamps)
  - Email field has `unique: true` index

- [x] 2.2 Book, Borrowing, Reservation models
  - Create `server/src/models/Book.js` — schema per design including text index on `title`, `author`, `isbn`
  - Create `server/src/models/Borrowing.js` — schema per design (userId, bookId, borrowDate, dueDate, returnDate, status, renewalsLeft, fee)
  - Create `server/src/models/Reservation.js` — schema per design (userId, bookId, status, reservationDate)

- [x] 2.3 Movie, MovieRequest models
  - Create `server/src/models/Movie.js` — schema per design including nested `CastMemberSchema` and text index on `title`, `director`
  - Create `server/src/models/MovieRequest.js` — schema per design (userId, title, type, year, genre, details, status)

- [x] 2.4 Product, Order models
  - Create `server/src/models/Product.js` — schema per design including `specifications: Map`, text index on `name`, `brand`, `category`
  - Create `server/src/models/Order.js` — schema per design including nested `OrderItemSchema`, default `storeLocation`, default `operatingHours`

- [x] 2.5 Review, WishlistItem, Notification, ContactSubmission models
  - Create `server/src/models/Review.js` — schema per design; compound unique index on `{ userId, itemId }`
  - Create `server/src/models/WishlistItem.js` — schema per design; compound unique index on `{ userId, itemId }`
  - Create `server/src/models/Notification.js` — schema per design
  - Create `server/src/models/ContactSubmission.js` — schema per design

- [x] 3.1 Auth validators
  - Create `server/src/validators/auth.validators.js`
  - `registerRules`: email (valid format, normalise), password (8–128 chars), name (1–100 chars, trim); all required
  - `loginRules`: email, password — presence checks only
  - `forgotPasswordRules`: email presence check
  - `resetPasswordRules`: token (non-empty), newPassword (8–128 chars)

- [x] 3.2 Auth controller
  - Create `server/src/controllers/auth.controller.js`
  - `register`: validate uniqueness → bcrypt hash password → create User → sign JWT → respond 201
  - `login`: find user by email → compare password hash → sign JWT → respond 200 with `{ token, id, name, email, role }`
  - `forgotPassword`: find user (silently ignore not-found) → generate `crypto.randomBytes(32).toString('hex')` token → store with 1-hour expiry → send via nodemailer → respond 200 with constant message regardless of email existence (Requirements 2.5, 2.6)
  - `resetPassword`: find user by token where `resetTokenExpiresAt > now` → hash new password → clear token fields → respond 200

- [x] 3.3 Auth routes
  - Create `server/src/routes/auth.routes.js`
  - POST `/register` → `registerRules`, `validate`, `register`
  - POST `/login` → `loginRules`, `validate`, `login`
  - POST `/forgot-password` → `forgotPasswordRules`, `validate`, `forgotPassword`
  - POST `/reset-password` → `resetPasswordRules`, `validate`, `resetPassword`
  - Mount in `app.js` at `/api/auth`

- [x] 4.1 User validators
  - Create `server/src/validators/common.validators.js` — `objectIdParam(field)` validator (returns 400 for invalid ObjectId), `paginationRules` (page >= 1, limit 1–100, both integers)
  - Create `server/src/validators/user.validators.js` — `updateProfileRules`: optional name (1–100 chars, trim), optional email (valid format), optional phone (trim); at least one field required

- [x] 4.2 User controller
  - Create `server/src/controllers/user.controller.js`
  - `getProfile`: return `id, name, email, phone, avatarUrl, memberSince (createdAt), role`
  - `updateProfile`: patch allowed fields; check email uniqueness if changed; respond 200 with updated user; 409 on duplicate email; 422 on no valid fields
  - `uploadAvatar`: multer single-file → `upload.service.getFileUrl` → update `avatarUrl` → respond 200 `{ avatarUrl }`
  - `getStats`: parallel count queries — WishlistItem, Order, Borrowing, MovieRequest for current user → respond `{ favorites, purchases, borrowed, movieRequests }`
  - `getActivity`: aggregate last 10 events across Borrowing, Order, MovieRequest → map to `{ type, title, date, status }` → sort by date desc

- [x] 4.3 User routes
  - Create `server/src/routes/user.routes.js`
  - All routes protected with `authenticate`
  - GET `/me` → `getProfile`
  - PUT `/me` → `updateProfileRules`, `validate`, `updateProfile`
  - POST `/me/avatar` → `upload.single('avatar')`, `uploadAvatar`
  - GET `/me/stats` → `getStats`
  - GET `/me/activity` → `getActivity`
  - GET `/me/borrowings` → `getBorrowingHistory` (from borrowing controller)
  - GET `/me/orders` → `getOrderHistory` (from order controller)
  - GET `/me/movie-requests` → `getUserMovieRequests` (from movieRequest controller)
  - GET `/me/wishlist` → `getWishlist`
  - POST `/me/wishlist` → `addToWishlist`
  - DELETE `/me/wishlist/:itemId` → `removeFromWishlist`
  - GET `/me/notifications` → `getNotifications`
  - POST `/me/notifications/read-all` → `markAllRead`
  - DELETE `/me/notifications` → `deleteAllNotifications`
  - Mount in `app.js` at `/api/users`

- [x] 5.1 Book validators
  - Create `server/src/validators/book.validators.js`
  - `bookQueryRules`: optional `q` (trim), optional `language` (trim), `paginationRules`
  - `bookBodyRules` (admin create/update): title, author required (non-empty, trim); optional fields typed correctly

- [x] 5.2 Book catalog controller
  - Create `server/src/controllers/book.controller.js`
  - `listBooks`: build filter (text search on `q`, language filter) → `paginate(Book, filter, opts)` → respond with paginated envelope
  - `getBook`: populate related books (same category, limit 10, exclude self) → respond 200; 404 if not found
  - Validate ObjectId params via `objectIdParam` middleware; return 400 on malformed id

- [x] 5.3 Borrowing controller
  - Create `server/src/controllers/borrowing.controller.js`
  - `borrowBook`: check `availableCopies > 0` and no existing active borrowing for same user+book → create Borrowing (dueDate = today + 14 days, renewalsLeft = 2) → decrement `availableCopies` → call `createNotification` (type: "Books") → respond 201
  - `returnBook`: check status Active/Overdue → set status Returned, returnDate today → increment `availableCopies` → respond 200
  - `renewBorrowing`: check status Active and renewalsLeft > 0 → extend dueDate +14 days, decrement renewalsLeft → respond 200
  - `getBorrowingHistory`: fetch all Borrowings for user (populate book title, author, coverUrl) → resolve overdue on read → respond with list
  - Overdue-on-read: when fetching, if status === "Active" && dueDate < now → set status "Overdue", compute fee via `calculateOverdueFee`, save → return updated record

- [x] 5.4 Reservation controller
  - Add `reserveBook` to `server/src/controllers/book.controller.js`
  - Create Reservation (userId, bookId, status: "Reserved", reservationDate today) → respond 201

- [x] 5.5 Book & borrowing routes
  - Create `server/src/routes/book.routes.js`
  - GET `/` → `bookQueryRules`, `validate`, `listBooks`
  - GET `/:id` → `objectIdParam('id')`, `validate`, `getBook`
  - GET `/:id/reviews` → `objectIdParam('id')`, `paginationRules`, `validate`, `listReviews`
  - POST `/:id/reviews` → `authenticate`, `objectIdParam('id')`, `reviewRules`, `validate`, `createReview`
  - POST `/:id/borrow` → `authenticate`, `objectIdParam('id')`, `validate`, `borrowBook`
  - POST `/:id/reserve` → `authenticate`, `objectIdParam('id')`, `validate`, `reserveBook`
  - Create `server/src/routes/borrowing.routes.js`
  - POST `/:id/renew` → `authenticate`, `objectIdParam('id')`, `validate`, `renewBorrowing`
  - POST `/:id/return` → `authenticate`, `objectIdParam('id')`, `validate`, `returnBook`
  - Mount in `app.js` at `/api/books` and `/api/borrowings`

- [x] 6.1 Movie validators
  - Create `server/src/validators/movie.validators.js`
  - `movieQueryRules`: optional `q` (trim), optional `genre` (trim), `paginationRules`
  - `movieBodyRules` (admin): title required (non-empty, trim); optional typed fields
  - `movieRequestRules`: title required (1–200 chars, trim)

- [x] 6.2 Movie catalog controller
  - Create `server/src/controllers/movie.controller.js`
  - `listMovies`: build filter (text search on `q`, genre array-contains filter) → `paginate` → respond
  - `getMovie`: populate related movies (shared genre, limit 10, exclude self) → respond 200; 404 if not found

- [x] 6.3 MovieRequest controller
  - Create `server/src/controllers/movieRequest.controller.js`
  - `submitMovieRequest`: trim title; reject if empty → create record (status: "Pending") → respond 201
  - `getUserMovieRequests`: fetch all MovieRequests for user → respond (empty array if none)
  - `cancelMovieRequest`: verify ownership (403), verify status Pending (400), verify exists (404) → delete → respond 200

- [x] 6.4 Movie & movieRequest routes
  - Create `server/src/routes/movie.routes.js`
  - GET `/` → `movieQueryRules`, `validate`, `listMovies`
  - GET `/:id` → `objectIdParam('id')`, `validate`, `getMovie`
  - GET `/:id/reviews` → `objectIdParam('id')`, `paginationRules`, `validate`, `listReviews`
  - POST `/:id/reviews` → `authenticate`, `objectIdParam('id')`, `reviewRules`, `validate`, `createReview`
  - Create `server/src/routes/movieRequest.routes.js`
  - POST `/` → `authenticate`, `movieRequestRules`, `validate`, `submitMovieRequest`
  - DELETE `/:id` → `authenticate`, `objectIdParam('id')`, `validate`, `cancelMovieRequest`
  - Mount in `app.js` at `/api/movies` and `/api/movie-requests`

- [x] 7.1 Product validators
  - Create `server/src/validators/product.validators.js`
  - `productQueryRules`: optional `q`, optional `category`, optional `minPrice`/`maxPrice` (numeric >= 0), `paginationRules`
  - `productBodyRules` (admin): name, price required; optional typed fields

- [x] 7.2 Product catalog controller
  - Create `server/src/controllers/product.controller.js`
  - `listProducts`: build filter (text search on `q`, category match, price range with `$gte`/`$lte`) → `paginate` → respond
  - `getProduct`: populate similar products (same category, limit 10, exclude self) → respond 200; 404 if not found

- [x] 7.3 Order validators
  - Create `server/src/validators/order.validators.js`
  - `orderBodyRules`: `items` array non-empty; each item: `productId` valid ObjectId, `quantity` integer 1–99

- [x] 7.4 Order controller
  - Create `server/src/controllers/order.controller.js`
  - `placeOrder`: enrich items with product snapshots (price, name, image) → compute subtotal = sum(price × qty) → totalPayableAtStore = subtotal + `RESERVATION_FEE` (default 50 ETB) → create Order (status: "Processing") → call `createNotification` (type: "Electronics") → respond 201
  - `getOrder`: verify ownership or admin role (403 otherwise); 404 if not found → respond with full order document
  - `getOrderHistory`: fetch all Orders for user ordered by createdAt desc → respond with list (`id`, `date`, `status`, `items`, `itemCount`, `total`)

- [x] 7.5 Product & order routes
  - Create `server/src/routes/product.routes.js`
  - GET `/` → `productQueryRules`, `validate`, `listProducts`
  - GET `/:id` → `objectIdParam('id')`, `validate`, `getProduct`
  - Create `server/src/routes/order.routes.js`
  - POST `/` → `authenticate`, `orderBodyRules`, `validate`, `placeOrder`
  - GET `/:id` → `authenticate`, `objectIdParam('id')`, `validate`, `getOrder`
  - Mount in `app.js` at `/api/products` and `/api/orders`

- [x] 8.1 Review validators
  - Create `server/src/validators/review.validators.js`
  - `reviewRules`: `rating` (integer 1–5, required), `comment` (1–2000 chars, trim, required)

- [x] 8.2 Review controller
  - Create `server/src/controllers/review.controller.js`
  - `listReviews`: paginate Review documents filtered by `itemId` + `itemType`; populate `userId` → `name` for `userName` field; respond with paginated envelope
  - `createReview`: verify item exists (404 if not) → save Review → recompute aggregate rating via `$avg` aggregation → update parent item's `rating` and `reviewCount` → respond 201; 409 on duplicate (compound index violation); 422 on invalid rating

- [x] 8.3 Review routes
  - Review endpoints are wired inside `book.routes.js` and `movie.routes.js` (handled in tasks 5.5 and 6.4)
  - Ensure `listReviews` and `createReview` correctly derive `itemType` from the mounting context

- [x] 9.1 Wishlist controller
  - Create `server/src/controllers/wishlist.controller.js`
  - `getWishlist`: fetch all WishlistItems for user; for each item populate full data from appropriate collection (Movie/Book/Product) → build response with `id, type, title, imageUrl, rating, category, price, availability, link`
  - `addToWishlist`: validate `itemId` (ObjectId) and `itemType` (Movie|Book|Product); check item exists → save WishlistItem → respond 201 with `addedAt`; 409 on duplicate
  - `removeFromWishlist`: find WishlistItem by `{ userId, itemId: params.itemId }` → delete → respond 200; 404 if not found

- [x] 9.2 Wishlist routes
  - Wishlist routes are wired inside `user.routes.js` (already referenced in task 4.3)
  - Ensure wishlist controller is imported and all handler functions are connected

- [x] 10.1 Notification service
  - Create `server/src/services/notification.service.js`
  - Export `async createNotification({ userId, type, title, description })`
  - Wrap Mongoose operations in `try/catch`; log errors but never rethrow so upstream operations are never rolled back (Requirement 12.9)

- [x] 10.2 Notification controller
  - Create `server/src/controllers/notification.controller.js`
  - `getNotifications`: fetch user's notifications ordered by timestamp desc; support optional `type` query filter; validate type enum (400 on unrecognised); respond with list or empty array
  - `markOneRead`: find notification by id, verify ownership → set `isRead: true` → respond 200; 404 if not found or wrong owner
  - `markAllRead`: `updateMany({ userId, isRead: false }, { isRead: true })` → respond 200
  - `deleteAllNotifications`: `deleteMany({ userId })` → respond 200

- [x] 10.3 Notification routes
  - Notification list/mark-all-read/delete-all are mounted inside `user.routes.js` (task 4.3)
  - Create `server/src/routes/notification.routes.js` for `PATCH /:id/read` → `authenticate`, `objectIdParam('id')`, `validate`, `markOneRead`
  - Mount in `app.js` at `/api/notifications`

- [x] 10.4 Wire notification side-effects
  - In `borrowing.controller.js` `borrowBook`: call `createNotification` after Borrowing created (Requirement 12.8)
  - In `order.controller.js` `placeOrder`: call `createNotification` after Order created (Requirement 12.7)
  - In `admin.controller.js` `updateMovieRequestStatus`: call `createNotification` after status update (Requirement 12.9)
  - Confirm all three wired calls are inside try/catch blocks that do not roll back the primary operation

- [x] 11.1 Search controller
  - Create `server/src/controllers/search.controller.js`
  - `search`: validate `q` (non-empty, 1–200 chars, required → 400 if absent/empty); validate `type` if present (movie|book|product → 400 on unrecognised); validate price params if present
  - Run `Promise.all([Book.find(...), Movie.find(...), Product.find(...)])` filtered by `q`; skip domains excluded by `type` filter; apply `minPrice`/`maxPrice` to Product query only
  - Tag each result with `type` field; merge arrays; apply optional `sort: "newest"` (sort merged array by `createdAt` desc); paginate via slice; respond with standard envelope per Requirement 19.2

- [x] 11.2 Search routes
  - Create `server/src/routes/search.routes.js`
  - GET `/` → `searchQueryRules`, `validate`, `search`
  - Mount in `app.js` at `/api/search`

- [x] 12.1 Upload service
  - Create `server/src/services/upload.service.js`
  - Export `getFileUrl(filename)` → returns `/uploads/<filename>` path string
  - The `uploads/` directory is created automatically by multer diskStorage

- [x] 12.2 Upload controller
  - Create `server/src/controllers/upload.controller.js`
  - `uploadFile`: ensure file was received (400 if missing) → call `getFileUrl(req.file.filename)` → respond 201 `{ url }`

- [x] 12.3 Upload routes
  - Create `server/src/routes/upload.routes.js`
  - POST `/` → `authenticate`, `requireRole('admin')`, `upload.single('file')`, `uploadFile`
  - Mount in `app.js` at `/api/uploads`

- [x] 13.1 Contact validators
  - Create `server/src/validators/contact.validators.js`
  - `contactRules`: name (non-empty, trim), email (valid format), subject (non-empty, trim), message (non-empty, trim); all required → 422 on failure

- [x] 13.2 Contact controller
  - Create `server/src/controllers/contact.controller.js`
  - `submitContact`: create ContactSubmission → respond 201 `{ message: "Message received. We will get back to you shortly." }`
  - `listContacts`: `paginate(ContactSubmission, {}, { sort: { createdAt: -1 } })` → respond with paginated envelope

- [x] 13.3 Contact routes
  - Create `server/src/routes/contact.routes.js`
  - POST `/` → `contactRules`, `validate`, `submitContact`
  - Mount in `app.js` at `/api/contact`
  - Admin contact list endpoint is mounted under admin routes (task 14.4)

- [x] 14.1 Admin controller — stats & recent
  - Create `server/src/controllers/admin.controller.js`
  - `getStats`: `Promise.all` of six `countDocuments()` calls (Movie, Book, Product, User, Order, Borrowing) → respond `{ totalMovies, totalBooks, totalProducts, totalUsers, totalOrders, totalBorrowings }`
  - `getRecent`: three parallel queries → `Model.find().sort({ createdAt: -1 }).limit(5).select('id title/name createdAt')` → respond `{ recentMovies, recentBooks, recentProducts }`

- [x] 14.2 Admin content CRUD
  - In `admin.controller.js`:
  - `createBook`, `updateBook`, `deleteBook` — create / findByIdAndUpdate / findByIdAndDelete; respond 201/200; 404 on missing
  - `createMovie`, `updateMovie`, `deleteMovie` — same pattern
  - `createProduct`, `updateProduct`, `deleteProduct` — same pattern

- [x] 14.3 Admin movie-request management
  - In `admin.controller.js`:
  - `getAllMovieRequests`: fetch all MovieRequests, populate userId → name; respond with list
  - `updateMovieRequestStatus`: find by id (404 if missing), validate status value → update status → call `createNotification` for requesting user → respond 200

- [x] 14.4 Admin contact submissions
  - In `admin.controller.js`:
  - `getContactSubmissions`: `paginate(ContactSubmission, {}, { sort: { createdAt: -1 } })` → respond with paginated envelope

- [x] 14.5 Admin routes
  - Create `server/src/routes/admin.routes.js`
  - All routes prefixed with `authenticate`, `requireRole('admin')`
  - GET `/stats` → `getStats`
  - GET `/recent` → `getRecent`
  - POST `/books` → `bookBodyRules`, `validate`, `createBook`
  - PUT `/books/:id` → `objectIdParam('id')`, `bookBodyRules`, `validate`, `updateBook`
  - DELETE `/books/:id` → `objectIdParam('id')`, `validate`, `deleteBook`
  - POST `/movies` → `movieBodyRules`, `validate`, `createMovie`
  - PUT `/movies/:id` → `objectIdParam('id')`, `movieBodyRules`, `validate`, `updateMovie`
  - DELETE `/movies/:id` → `objectIdParam('id')`, `validate`, `deleteMovie`
  - POST `/products` → `productBodyRules`, `validate`, `createProduct`
  - PUT `/products/:id` → `objectIdParam('id')`, `productBodyRules`, `validate`, `updateProduct`
  - DELETE `/products/:id` → `objectIdParam('id')`, `validate`, `deleteProduct`
  - GET `/movie-requests` → `getAllMovieRequests`
  - PATCH `/movie-requests/:id/status` → `objectIdParam('id')`, `validate`, `updateMovieRequestStatus`
  - GET `/contacts` → `paginationRules`, `validate`, `getContactSubmissions`
  - Mount in `app.js` at `/api/admin`

- [x] 15.1 PBT: Overdue fee is linear (Property 13)
  - Create `server/src/__tests__/unit/overdue.test.js`
  - Use `fast-check` with `fc.integer({ min: 0, max: 3650 })` to generate N overdue days
  - Assert `calculateOverdueFee(dueDate, now) === N * OVERDUE_FEE_PER_DAY` for all N >= 0
  - Assert fee === 0 when dueDate is in the future
  - **Validates: Requirements 5.8**

- [x] 15.2 PBT: Pagination metadata invariant (Property 9)
  - Create `server/src/__tests__/unit/paginate.test.js`
  - Use `fast-check` with `fc.integer({ min: 1, max: 500 })` for totalCount, `fc.integer({ min: 1, max: 100 })` for limit, valid page values
  - Assert `totalPages === Math.ceil(totalCount / limit)` (and 0 when totalCount is 0)
  - Assert `data.length <= limit`
  - Assert returned `page` matches requested `page`
  - **Validates: Requirements 4.4, 6.4, 8.5, 19.2**

- [x] 15.3 PBT: Upload filenames are unique (Property 18)
  - Create `server/src/__tests__/unit/upload.service.test.js`
  - Generate 1000 filenames via the upload service (UUID-based)
  - Assert all are distinct (no collisions in the generated set)
  - **Validates: Requirements 14.5**

- [x] 15.4 PBT: Order subtotal and total correctness (Property 16)
  - Create `server/src/__tests__/unit/order.total.test.js`
  - Use `fast-check` with arrays of `{ price: fc.float({ min: 0, max: 10000 }), quantity: fc.integer({ min: 1, max: 99 }) }`
  - Assert `subtotal === sum(price * qty)` and `totalPayableAtStore === subtotal + RESERVATION_FEE`
  - **Validates: Requirements 9.1**

- [x] 15.5 Integration PBT: Auth round trip (Properties 1, 2, 3)
  - Create `server/src/__tests__/integration/auth.test.js`
  - Use `mongodb-memory-server` + supertest
  - **Property 1**: valid (email, password, name) → register → login → HTTP 200 + JWT + correct `name`, `email`, `role: "user"`
  - **Property 2**: after register, `User.findOne().passwordHash` must not equal the plaintext password
  - **Property 3**: `POST /api/auth/forgot-password` with any email string always returns HTTP 200 `{ message: "Reset instructions sent" }`
  - **Validates: Requirements 2.1, 2.3, 2.6, 2.9**

- [x] 15.6 Integration PBT: User profile update round trip (Property 4)
  - Create `server/src/__tests__/integration/user.test.js`
  - Use `mongodb-memory-server` + supertest; register and login first to obtain JWT
  - **Property 4**: for any valid `{ name, email, phone }` payload → `PUT /api/users/me` → `GET /api/users/me` → returned fields match sent fields
  - **Validates: Requirements 3.2**

- [x] 15.7 Integration PBT: Book filter, borrow, return, renew (Properties 5, 10, 11, 12)
  - Create `server/src/__tests__/integration/book.filter.test.js`
  - **Property 5**: for any non-empty `q` → every returned book's title, author, or isbn contains `q` (case-insensitive)
  - **Property 10**: borrow creates Borrowing with dueDate = borrowDate + 14 days, renewalsLeft = 2, status = Active; book.availableCopies decremented by 1
  - **Property 11**: borrow then return → availableCopies restored to original value
  - **Property 12**: for any active Borrowing with renewalsLeft > 0 → renew → dueDate += 14 days, renewalsLeft -= 1
  - **Validates: Requirements 4.2, 5.1, 5.5, 5.7**

- [x] 15.8 Integration PBT: Movie search filter (Property 6)
  - Create `server/src/__tests__/integration/movie.filter.test.js`
  - **Property 6**: for any non-empty `q` → every returned movie's title, director, or genres array contains `q` (case-insensitive)
  - **Validates: Requirements 6.2**

- [x] 15.9 Integration PBT: Product search & price filter (Properties 7, 8)
  - Create `server/src/__tests__/integration/product.filter.test.js`
  - **Property 7**: for any non-empty `q` → every returned product's name, brand, or category contains `q` (case-insensitive)
  - **Property 8**: for any `minPrice`/`maxPrice` combination → every returned product has price within the specified range
  - **Validates: Requirements 8.2, 8.4**

- [x] 15.10 Integration PBT: Aggregate review rating is arithmetic mean (Property 17)
  - Create `server/src/__tests__/integration/review.rating.test.js`
  - **Property 17**: for any sequence of N ratings (integers 1–5) submitted for the same Book or Movie → parent item's `rating` equals the arithmetic mean of all submitted ratings after each new review
  - **Validates: Requirements 10.3, 10.7**

- [x] 15.11 Integration PBT: Movie request title preservation & whitespace rejection (Properties 14, 15)
  - Create `server/src/__tests__/integration/movieRequest.test.js`
  - **Property 14**: for any trimmed title (1–200 chars) → created record has `status: "Pending"` and `title === trimmedInput`
  - **Property 15**: for any whitespace-only string as title → HTTP 400, no record created
  - **Validates: Requirements 7.1, 7.7, 18.5**

- [x] 15.12 Integration PBT: Cross-domain search type filter isolation (Property 20)
  - Create `server/src/__tests__/integration/search.test.js`
  - **Property 20**: for any `q` combined with `type` in ["movie", "book", "product"] → every result in the response has `type` matching the specified filter only
  - **Validates: Requirements 13.3**

- [x] 15.13 Integration PBT: String inputs are trimmed before persistence (Property 19)
  - Create `server/src/__tests__/integration/validation.trim.test.js`
  - **Property 19**: for any string with arbitrary leading/trailing whitespace → persisted value equals the trimmed string; if trimming yields an empty required field → HTTP 422 is returned
  - **Validates: Requirements 18.5**

- [x] 15.14 Unit tests — JWT helpers, middleware guards, validation shapes
  - Create `server/src/__tests__/unit/jwt.test.js` — sign/verify round trip; expired token throws/returns error
  - Write middleware tests covering: authenticate returns 401 on missing/invalid/expired JWT; requireRole returns 403 on wrong role; validate returns 422 with `{ errors: [{ field, message }] }` structure; errorHandler returns 500 without stack trace, 400 for CastError, 409 for duplicate key error
  - Cover CORS preflight: OPTIONS request from `CLIENT_ORIGIN` → HTTP 204 with correct CORS headers

## Notes

- All API endpoints are prefixed with `/api`
- Authentication uses JWT Bearer tokens; tokens expire after 24 hours
- All list endpoints follow the standard pagination envelope: `{ data, totalCount, page, totalPages, limit }`
- Overdue status is resolved on read, not via a background scheduler
- Notification creation failures must never roll back the primary operation (order, borrowing, movie request status change)
- The `server/uploads/` directory is served as static assets at `/uploads` without authentication
- Integration tests use `mongodb-memory-server` — no real MongoDB connection is required during CI
- Property-based tests  klj use `fast-check` configured with `numRuns: 100` minimum iterations per property
- Each PBT task comment format: `// Feature: ahadu-center-backend, Property N: <description>`
