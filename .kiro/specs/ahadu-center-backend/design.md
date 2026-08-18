# Design Document — AhaduCenter Backend API

## Overview

AhaduCenter is a multi-domain cultural and commercial center platform based in Addis Ababa, Ethiopia. The backend is a **Node.js/Express REST API** backed by **MongoDB** (via Mongoose), serving a React + Redux frontend. It covers three distinct service domains — Movie Center, Book Center, and Electronics Hub — plus cross-cutting concerns including authentication, notifications, wishlist, reviews, file uploads, and admin management.

All API routes are prefixed with `/api`. Authentication is JWT-based with Bearer tokens. File uploads use `multer` for multipart handling, storing files in a local `/uploads` directory served as static assets.

### Technology Choices

| Concern | Library / Tool | Rationale |
|---|---|---|
| HTTP Framework | Express 4.x | Minimal, well-understood, large ecosystem |
| ODM | Mongoose 8.x | Schema validation, middleware hooks, populate |
| Auth | `jsonwebtoken` + `bcryptjs` | Industry-standard JWT signing; bcryptjs for pure-JS bcrypt |
| Validation | `express-validator` | Chainable, field-level validation with structured error output |
| File Uploads | `multer` | De-facto Express multipart handler |
| Password Reset Tokens | `crypto` (Node built-in) | Cryptographically random bytes, no extra dependency |
| Email | `nodemailer` | Password reset emails |
| Environment | `dotenv` | Loads `.env` into `process.env` |
| CORS | `cors` | Express CORS middleware |
| Testing (unit/property) | `jest` + `fast-check` | Jest as test runner; fast-check for property-based tests |
| Dev | `nodemon` | Auto-restart on file changes |

---

## Architecture

The server follows a **layered MVC-style architecture** with clear separation of routing, business logic, and data access.

```
Express App
   │
   ├── Middleware Layer
   │     ├── cors()
   │     ├── express.json()
   │     ├── /uploads static serving
   │     ├── authenticate (JWT verification)
   │     └── requireRole (authorization)
   │
   ├── Router Layer  (/api/*)
   │     ├── /auth
   │     ├── /users
   │     ├── /books
   │     ├── /movies
   │     ├── /products
   │     ├── /orders
   │     ├── /reviews  (sub-routed from books/movies)
   │     ├── /movie-requests
   │     ├── /borrowings
   │     ├── /search
   │     ├── /uploads
   │     ├── /contact
   │     └── /admin
   │
   ├── Controller Layer
   │     One controller per service domain
   │
   ├── Service Layer  (optional thin helpers)
   │     notification.service.js, upload.service.js
   │
   └── Model Layer (Mongoose schemas)
```

### Request Lifecycle

```
Client → CORS preflight check → express.json() → Route match
  → [authenticate middleware if protected]
  → [requireRole middleware if admin-only]
  → [express-validator checks]
  → Controller function
  → Mongoose query
  → JSON response / error handler
```

---

## Folder Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js                  # Mongoose connect
│   ├── middleware/
│   │   ├── authenticate.js        # JWT verification
│   │   ├── requireRole.js         # Role-based access guard
│   │   ├── validate.js            # express-validator error formatter
│   │   ├── upload.js              # multer configuration
│   │   └── errorHandler.js        # Global 500 handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Borrowing.js
│   │   ├── Reservation.js
│   │   ├── Movie.js
│   │   ├── MovieRequest.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   ├── WishlistItem.js
│   │   ├── Notification.js
│   │   └── ContactSubmission.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── book.routes.js
│   │   ├── movie.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   ├── borrowing.routes.js
│   │   ├── movieRequest.routes.js
│   │   ├── review.routes.js
│   │   ├── search.routes.js
│   │   ├── upload.routes.js
│   │   ├── contact.routes.js
│   │   └── admin.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── book.controller.js
│   │   ├── movie.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── borrowing.controller.js
│   │   ├── movieRequest.controller.js
│   │   ├── review.controller.js
│   │   ├── search.controller.js
│   │   ├── upload.controller.js
│   │   ├── contact.controller.js
│   │   ├── notification.controller.js
│   │   ├── wishlist.controller.js
│   │   └── admin.controller.js
│   ├── services/
│   │   ├── notification.service.js  # createNotification() helper
│   │   └── upload.service.js        # generateFilename(), storeFile()
│   ├── validators/
│   │   ├── auth.validators.js
│   │   ├── book.validators.js
│   │   ├── movie.validators.js
│   │   ├── product.validators.js
│   │   ├── order.validators.js
│   │   ├── review.validators.js
│   │   └── common.validators.js     # pagination, objectId
│   ├── utils/
│   │   ├── paginate.js              # reusable pagination helper
│   │   ├── overdue.js               # overdue fee calculation
│   │   └── jwt.js                   # sign/verify helpers
│   └── app.js                       # Express app setup (no listen)
├── server.js                        # Entry point — calls app.listen()
├── uploads/                         # Served as static at /uploads
├── .env
├── .env.example
├── package.json
└── jest.config.js
```

---

## Components and Interfaces

### Middleware

#### `authenticate.js`
Reads `Authorization: Bearer <token>` header, verifies the JWT, and attaches `req.user = { id, role }`. Returns HTTP 401 if missing, expired, or invalid.

```js
// Usage: router.get('/protected', authenticate, controller)
```

#### `requireRole.js`
Factory middleware that checks `req.user.role`. Returns HTTP 403 if the role does not match.

```js
// Usage: router.post('/admin/books', authenticate, requireRole('admin'), controller)
```

#### `validate.js`
Runs `validationResult(req)` after `express-validator` chains. If errors exist, responds with HTTP 422 and a structured body:

```json
{
  "errors": [
    { "field": "email", "message": "Must be a valid email address" }
  ]
}
```

#### `upload.js`
Configures `multer` with:
- Storage: `diskStorage` writing to `./uploads/` with a UUID-based filename
- File filter: accept only `image/jpeg`, `image/png`, `image/webp`
- Limits: `fileSize: 5 * 1024 * 1024` (5 MB)

Returns HTTP 413 on size exceeded, HTTP 415 on wrong MIME type (via custom `fileFilter`).

#### `errorHandler.js`
Express 4-argument error handler. Catches any error passed via `next(err)`, logs it server-side, and responds with HTTP 500 + `{ error: "Internal server error" }` without exposing the stack trace.

### Services

#### `notification.service.js`

```js
/**
 * Creates a notification for a user. Failures are caught and logged
 * but do NOT propagate — callers are not affected if this fails.
 */
async function createNotification({ userId, type, title, description })
```

Called by order, borrowing, and movieRequest controllers after the primary operation succeeds.

#### `upload.service.js`

```js
/** Returns a URL path like /uploads/<uuid>.<ext> */
function getFileUrl(filename)
```

### Utility: `paginate.js`

Reusable helper for all list endpoints:

```js
/**
 * @param {Model} model  - Mongoose model
 * @param {Object} filter - Mongoose query filter
 * @param {Object} options - { page, limit, sort, select, populate }
 * @returns { data, totalCount, page, totalPages, limit }
 */
async function paginate(model, filter, options)
```

Applies `filter` for `totalCount`, then chains `.skip((page-1)*limit).limit(limit).sort(sort)`.

### Utility: `overdue.js`

```js
/**
 * Calculates overdue fee in ETB (Ethiopian Birr).
 * @param {Date} dueDate
 * @param {Date} [now=new Date()]
 * @returns {number} fee — 0 if not overdue
 */
function calculateOverdueFee(dueDate, now = new Date())
```

`daysOverdue = max(0, floor((now - dueDate) / 86400000))`
`fee = daysOverdue * Number(process.env.OVERDUE_FEE_PER_DAY ?? 1)`

---

## Data Models

### User

```js
const UserSchema = new Schema({
  name:         { type: String, required: true, trim: true, maxlength: 100 },
  email:        { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone:        { type: String, trim: true, default: null },
  avatarUrl:    { type: String, default: null },
  role:         { type: String, enum: ['user', 'admin'], default: 'user' },
  resetToken:           { type: String, default: null },
  resetTokenExpiresAt:  { type: Date,   default: null },
}, { timestamps: true });
// memberSince derived from createdAt
```

### Book

```js
const BookSchema = new Schema({
  title:           { type: String, required: true, trim: true },
  author:          { type: String, required: true, trim: true },
  publisher:       { type: String, trim: true },
  year:            { type: Number },
  isbn:            { type: String, trim: true },
  description:     { type: String, trim: true },
  pages:           { type: Number },
  publicationDate: { type: String },
  dimensions:      { type: String },
  about:           { type: String },
  authorInfo:      { type: String },
  borrowingPolicy: { type: String },
  location:        { type: String },
  coverUrl:        { type: String },
  availability:    { type: String, enum: ['Available', 'Borrowed', 'Reserved'], default: 'Available' },
  availableCopies: { type: Number, default: 1, min: 0 },
  totalCopies:     { type: Number, default: 1 },
  format:          { type: String },          // e.g. "Hardcover", "Paperback"
  language:        { type: String, trim: true },
  price:           { type: Number, default: 0 },
  category:        { type: String, trim: true },
  rating:          { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:     { type: Number, default: 0 },
}, { timestamps: true });

BookSchema.index({ title: 'text', author: 'text', isbn: 'text' });
```

### Borrowing

```js
const BorrowingSchema = new Schema({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId:      { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowDate:  { type: Date, default: Date.now },
  dueDate:     { type: Date, required: true },
  returnDate:  { type: Date, default: null },
  status:      { type: String, enum: ['Active', 'Returned', 'Overdue'], default: 'Active' },
  renewalsLeft:{ type: Number, default: 2 },
  fee:         { type: Number, default: 0 },
}, { timestamps: true });
```

### Reservation

```js
const ReservationSchema = new Schema({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId:          { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  status:          { type: String, enum: ['Reserved', 'Cancelled', 'Fulfilled'], default: 'Reserved' },
  reservationDate: { type: Date, default: Date.now },
}, { timestamps: true });
```

### Movie

```js
const CastMemberSchema = new Schema({
  name:     { type: String, required: true },
  role:     { type: String },
  photoUrl: { type: String },
}, { _id: false });

const MovieSchema = new Schema({
  title:            { type: String, required: true, trim: true },
  year:             { type: Number },
  country:          { type: String },
  runtime:          { type: String },               // e.g. "2h 15m"
  quality:          { type: String },               // e.g. "4K", "HD"
  language:         { type: String },
  genres:           [{ type: String }],
  rating:           { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:      { type: Number, default: 0 },
  releaseDate:      { type: String },
  posterUrl:        { type: String },
  bannerUrl:        { type: String },
  subtitles:        [{ type: String }],
  director:         { type: String },
  writers:          [{ type: String }],
  studio:           { type: String },
  trailerUrl:       { type: String },
  trailerThumbnail: { type: String },
  description:      { type: String },
  cast:             [CastMemberSchema],
  screenshots:      [{ type: String }],
}, { timestamps: true });

MovieSchema.index({ title: 'text', director: 'text' });
```

### MovieRequest

```js
const MovieRequestSchema = new Schema({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, trim: true, maxlength: 200 },
  type:        { type: String },         // e.g. "Movie", "Series"
  year:        { type: Number },
  genre:       { type: String },
  details:     { type: String },
  status:      { type: String, enum: ['Pending', 'Available', 'Fulfilled'], default: 'Pending' },
}, { timestamps: true });
// requestedAt derived from createdAt
```

### Product

```js
const ProductSchema = new Schema({
  name:          { type: String, required: true, trim: true },
  brand:         { type: String, trim: true },
  category:      { type: String, trim: true },
  condition:     { type: String, enum: ['New', 'Used', 'Refurbished'], default: 'New' },
  images:        [{ type: String }],
  description:   { type: String },
  highlights:    [{ type: String }],
  specifications:{ type: Map, of: String },   // key-value map
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  discount:      { type: Number, default: 0, min: 0, max: 100 },
  rating:        { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:   { type: Number, default: 0 },
  inStock:       { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.index({ name: 'text', brand: 'text', category: 'text' });
```

### Order

```js
const OrderItemSchema = new Schema({
  productId:   { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String },
  productImage:{ type: String },
  price:       { type: Number },
  quantity:    { type: Number, min: 1, max: 99 },
}, { _id: false });

const OrderSchema = new Schema({
  userId:             { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items:              [OrderItemSchema],
  subtotal:           { type: Number, required: true },
  reservationFee:     { type: Number, required: true },
  totalPayableAtStore:{ type: Number, required: true },
  status:             { type: String, enum: ['Processing', 'Ready', 'Completed', 'Cancelled'], default: 'Processing' },
  storeLocation:      {
    type: String,
    default: 'Ahadu Center Hub, Bole Road (Next to Friendship HyperMarket), Addis Ababa, Ethiopia'
  },
  operatingHours:     { type: String, default: 'Mon-Sat 9:00 AM – 8:00 PM' },
}, { timestamps: true });
```

### Review

```js
const ReviewSchema = new Schema({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemId:     { type: Schema.Types.ObjectId, required: true },
  itemType:   { type: String, enum: ['Book', 'Movie'], required: true },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  comment:    { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
}, { timestamps: true });

ReviewSchema.index({ userId: 1, itemId: 1 }, { unique: true }); // prevents duplicate reviews
```

### WishlistItem

```js
const WishlistItemSchema = new Schema({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemId:   { type: Schema.Types.ObjectId, required: true },
  itemType: { type: String, enum: ['Movie', 'Book', 'Product'], required: true },
  addedAt:  { type: Date, default: Date.now },
}, { timestamps: false });

WishlistItemSchema.index({ userId: 1, itemId: 1 }, { unique: true });
```

### Notification

```js
const NotificationSchema = new Schema({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:        { type: String, enum: ['Books', 'Movies', 'Electronics', 'General'], required: true },
  title:       { type: String, required: true },
  description: { type: String },
  isRead:      { type: Boolean, default: false },
  timestamp:   { type: Date, default: Date.now },
}, { timestamps: false });
```

### ContactSubmission

```js
const ContactSubmissionSchema = new Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
}, { timestamps: true });
```

---

## API Route Organization

All routes are mounted in `app.js` under `/api`:

```js
app.use('/api/auth',           authRouter);
app.use('/api/users',          userRouter);
app.use('/api/books',          bookRouter);
app.use('/api/movies',         movieRouter);
app.use('/api/products',       productRouter);
app.use('/api/orders',         orderRouter);
app.use('/api/borrowings',     borrowingRouter);
app.use('/api/movie-requests', movieRequestRouter);
app.use('/api/search',         searchRouter);
app.use('/api/uploads',        uploadRouter);
app.use('/api/contact',        contactRouter);
app.use('/api/admin',          adminRouter);
app.use('/api/notifications',  notificationRouter);
```

### Route Table

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | /api/auth/register | — | — | Register user |
| POST | /api/auth/login | — | — | Login |
| POST | /api/auth/forgot-password | — | — | Request password reset |
| POST | /api/auth/reset-password | — | — | Confirm password reset |
| GET | /api/users/me | ✓ | user | Get own profile |
| PUT | /api/users/me | ✓ | user | Update profile |
| POST | /api/users/me/avatar | ✓ | user | Upload avatar |
| GET | /api/users/me/stats | ✓ | user | Dashboard stats |
| GET | /api/users/me/activity | ✓ | user | Recent activity |
| GET | /api/users/me/borrowings | ✓ | user | Borrowing history |
| GET | /api/users/me/orders | ✓ | user | Order history |
| GET | /api/users/me/movie-requests | ✓ | user | Movie requests |
| GET | /api/users/me/wishlist | ✓ | user | Get wishlist |
| POST | /api/users/me/wishlist | ✓ | user | Add to wishlist |
| DELETE | /api/users/me/wishlist/:itemId | ✓ | user | Remove from wishlist |
| GET | /api/users/me/notifications | ✓ | user | Get notifications |
| POST | /api/users/me/notifications/read-all | ✓ | user | Mark all read |
| DELETE | /api/users/me/notifications | ✓ | user | Delete all notifications |
| PATCH | /api/notifications/:id/read | ✓ | user | Mark one notification read |
| GET | /api/books | — | — | List books (paginated) |
| GET | /api/books/:id | — | — | Book detail |
| GET | /api/books/:id/reviews | — | — | Book reviews |
| POST | /api/books/:id/reviews | ✓ | user | Submit book review |
| POST | /api/books/:id/borrow | ✓ | user | Borrow book |
| POST | /api/books/:id/reserve | ✓ | user | Reserve book |
| GET | /api/movies | — | — | List movies (paginated) |
| GET | /api/movies/:id | — | — | Movie detail |
| GET | /api/movies/:id/reviews | — | — | Movie reviews |
| POST | /api/movies/:id/reviews | ✓ | user | Submit movie review |
| GET | /api/products | — | — | List products (paginated) |
| GET | /api/products/:id | — | — | Product detail |
| POST | /api/orders | ✓ | user | Place order |
| GET | /api/orders/:id | ✓ | user | Get order detail |
| POST | /api/borrowings/:id/renew | ✓ | user | Renew borrowing |
| POST | /api/borrowings/:id/return | ✓ | user | Return book |
| POST | /api/movie-requests | ✓ | user | Submit movie request |
| DELETE | /api/movie-requests/:id | ✓ | user | Cancel movie request |
| GET | /api/search | — | — | Cross-domain search |
| POST | /api/uploads | ✓ | admin | Upload image file |
| POST | /api/contact | — | — | Submit contact form |
| GET | /api/admin/stats | ✓ | admin | Platform stats |
| GET | /api/admin/recent | ✓ | admin | Recent additions |
| POST | /api/admin/books | ✓ | admin | Create book |
| PUT | /api/admin/books/:id | ✓ | admin | Update book |
| DELETE | /api/admin/books/:id | ✓ | admin | Delete book |
| POST | /api/admin/movies | ✓ | admin | Create movie |
| PUT | /api/admin/movies/:id | ✓ | admin | Update movie |
| DELETE | /api/admin/movies/:id | ✓ | admin | Delete movie |
| POST | /api/admin/products | ✓ | admin | Create product |
| PUT | /api/admin/products/:id | ✓ | admin | Update product |
| DELETE | /api/admin/products/:id | ✓ | admin | Delete product |
| GET | /api/admin/movie-requests | ✓ | admin | All movie requests |
| PATCH | /api/admin/movie-requests/:id/status | ✓ | admin | Update request status |
| GET | /api/admin/contacts | ✓ | admin | Contact submissions |

---

## Key Algorithms

### JWT Signing and Verification (`utils/jwt.js`)

```js
const sign   = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
const verify = (token)   => jwt.verify(token,  process.env.JWT_SECRET);
```

Payload shape: `{ id: ObjectId.toString(), role: 'user' | 'admin' }`.

### Password Reset Flow

1. `POST /api/auth/forgot-password` — generate `crypto.randomBytes(32).toString('hex')`, store as `resetToken` on User with `resetTokenExpiresAt = Date.now() + 3600000` (1 hour). Send token via `nodemailer`.
2. `POST /api/auth/reset-password` — find User by `resetToken` where `resetTokenExpiresAt > Date.now()`. Hash new password, clear `resetToken` and `resetTokenExpiresAt`.

### Aggregate Rating Recomputation

On every new review creation, the parent item's `rating` and `reviewCount` are updated atomically using MongoDB `$inc` and the computed new average:

```js
// After saving a new review:
const agg = await Review.aggregate([
  { $match: { itemId: itemObjectId, itemType } },
  { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
]);
const { avg, count } = agg[0];
await Model.findByIdAndUpdate(itemId, { rating: avg, reviewCount: count });
```

### Overdue Status Resolution

Borrowing records are not continuously updated by a background job. Instead, overdue status is **resolved on read**: any time a Borrowing document is fetched with `status: "Active"` and `dueDate < now`, the controller sets `status: "Overdue"` and saves before returning. This avoids a background scheduler while keeping status accurate at read time.

### Cross-Domain Search

`GET /api/search?q=<term>` runs three queries in parallel via `Promise.all`:

```js
const [books, movies, products] = await Promise.all([
  Book.find({ $text: { $search: q } }, ...),
  Movie.find({ $text: { $search: q } }, ...),
  Product.find({ $text: { $search: q } }, ...),
]);
```

Results are merged into a unified array, each tagged with `type`, then paginated using the standard envelope. When `type` filter is present, only one of the three queries fires.

### Order Total Computation

```js
// Enriches items with product snapshot data, computes totals
const RESERVATION_FEE = Number(process.env.RESERVATION_FEE ?? 50); // ETB

const enrichedItems = await Promise.all(items.map(async ({ productId, quantity }) => {
  const product = await Product.findById(productId);
  if (!product) throw new NotFoundError(`Product ${productId} not found`);
  return { productId, productName: product.name, productImage: product.images[0], price: product.price, quantity };
}));

const subtotal = enrichedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
const totalPayableAtStore = subtotal + RESERVATION_FEE;
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

This backend is a suitable candidate for property-based testing in several areas: JWT auth round trips, pure computation functions (overdue fees, order totals, aggregate ratings), input validation (search filters, price ranges, pagination math), and data-invariant logic (borrow/return cycles). The property-based testing library used is **`fast-check`**, run with Jest as the test runner, configured to execute a minimum of 100 iterations per property.

---

### Property 1: Auth Registration Round Trip

*For any* valid registration payload (valid email, password of length 8–128, name of length 1–100), registering and then logging in with the same credentials should return HTTP 200 with a JWT and the correct `name`, `email`, and `role: "user"`.

**Validates: Requirements 2.1, 2.3**

---

### Property 2: Passwords Are Never Stored in Plaintext

*For any* valid registration payload, after the User document is persisted, the `passwordHash` field in MongoDB should not equal the plaintext password provided at registration.

**Validates: Requirements 2.9**

---

### Property 3: Forgot-Password Always Returns the Same Response

*For any* email string (registered or not), `POST /api/auth/forgot-password` should always return HTTP 200 with `{ message: "Reset instructions sent" }` — the response must not vary based on whether the email exists in the database.

**Validates: Requirements 2.6**

---

### Property 4: User Profile Update Round Trip

*For any* valid profile update payload (non-empty name, valid email, optional phone), after a successful `PUT /api/users/me`, a subsequent `GET /api/users/me` should return the updated values for all fields that were included in the update.

**Validates: Requirements 3.2**

---

### Property 5: Book Search Filter Correctness

*For any* non-empty search term `q`, every book returned by `GET /api/books?q=<term>` should have at least one of its `title`, `author`, or `isbn` fields containing `q` as a case-insensitive substring. No returned book should fail this predicate.

**Validates: Requirements 4.2**

---

### Property 6: Movie Search Filter Correctness

*For any* non-empty search term `q`, every movie returned by `GET /api/movies?q=<term>` should have at least one of its `title`, `director`, or `genres` fields containing `q` as a case-insensitive substring.

**Validates: Requirements 6.2**

---

### Property 7: Product Search Filter Correctness

*For any* non-empty search term `q`, every product returned by `GET /api/products?q=<term>` should have at least one of its `name`, `brand`, or `category` fields containing `q` as a case-insensitive substring.

**Validates: Requirements 8.2**

---

### Property 8: Product Price Filter Correctness

*For any* combination of `minPrice` and/or `maxPrice` query parameters, every product returned by `GET /api/products` should have a `price` that is greater than or equal to `minPrice` (if provided) and less than or equal to `maxPrice` (if provided). No product outside the specified range should appear in the results.

**Validates: Requirements 8.4**

---

### Property 9: Pagination Metadata Invariant

*For any* paginated list endpoint called with valid `page` and `limit` parameters and a known `totalCount` of matching items: the response envelope must satisfy `totalPages = ceil(totalCount / limit)` (or `0` when `totalCount = 0`), `data.length <= limit`, and `page` in the response matches the requested page. This holds across all domains (books, movies, products, search, reviews, contacts).

**Validates: Requirements 4.4, 6.4, 8.5, 19.2**

---

### Property 10: Borrow Creates Correct Record

*For any* book with `availableCopies > 0` and any authenticated user, a successful `POST /api/books/:id/borrow` must create a Borrowing record where: `dueDate = borrowDate + 14 days`, `renewalsLeft = 2`, `status = "Active"`, and the book's `availableCopies` is decremented by exactly 1.

**Validates: Requirements 5.1**

---

### Property 11: Borrow-Return Round Trip Preserves Available Copies

*For any* book, borrowing it and then immediately returning it (with no other concurrent operations) should leave `availableCopies` unchanged from its value before the borrow. The return-then-fetch sequence must satisfy `newAvailableCopies = originalAvailableCopies`.

**Validates: Requirements 5.7**

---

### Property 12: Renewal Extends Due Date by Exactly 14 Days and Decrements Renewals Left

*For any* active Borrowing record with `renewalsLeft > 0`, after a successful `POST /api/borrowings/:id/renew`: the new `dueDate` should equal the old `dueDate` plus exactly 14 calendar days, and `renewalsLeft` should equal the previous value minus 1.

**Validates: Requirements 5.5**

---

### Property 13: Overdue Fee Calculation Is Linear

*For any* Borrowing whose `dueDate` is N calendar days in the past (N ≥ 0), the computed `fee` must equal `N × OVERDUE_FEE_PER_DAY`. For borrowings not yet overdue (N = 0), the fee must be 0. This is a pure function and is tested directly against `utils/overdue.js`.

**Validates: Requirements 5.8**

---

### Property 14: Movie Request Title Preservation and Initial Status

*For any* non-empty string title of length 1–200 (after trimming), a successful `POST /api/movie-requests` must create a record with `status: "Pending"` and a `title` field that exactly equals the trimmed input title.

**Validates: Requirements 7.1**

---

### Property 15: Whitespace-Only Titles Are Rejected

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines), `POST /api/movie-requests` with that string as `title` must return HTTP 400 and must not create any record. This tests that the trim-then-validate logic (Requirement 18.5) works correctly with the title validation.

**Validates: Requirements 7.7, 18.5**

---

### Property 16: Order Subtotal and Total Computation Correctness

*For any* valid `items` array of `{ productId, quantity }` pairs where each product exists and each quantity is in range 1–99, the Order created by `POST /api/orders` must satisfy: `subtotal = Σ(product.price × quantity)` and `totalPayableAtStore = subtotal + RESERVATION_FEE`. These must hold for all possible combinations of product prices and quantities.

**Validates: Requirements 9.1**

---

### Property 17: Aggregate Review Rating Is the Arithmetic Mean

*For any* sequence of N review ratings (each an integer 1–5) submitted for the same Book or Movie, after all reviews are persisted, the item's `rating` field must equal the arithmetic mean of those N ratings rounded to at most two decimal places. Adding a new review must re-compute the mean over all existing reviews including the new one.

**Validates: Requirements 10.3, 10.7**

---

### Property 18: Upload Filenames Are Unique

*For any* two distinct successful upload operations, the generated filenames (and therefore the returned URLs) must differ. Since filenames are derived from UUID v4, collisions are astronomically unlikely; this is verified by generating many filenames in the `upload.service.js` unit test and asserting all are distinct.

**Validates: Requirements 14.5**

---

### Property 19: String Inputs Are Trimmed Before Persistence

*For any* string input to a creation or update endpoint (book title, movie title, product name, user name, contact form fields), the value persisted in MongoDB must equal the input string with leading and trailing whitespace removed. If trimming makes a required field empty, the request must be rejected with HTTP 422.

**Validates: Requirements 18.5**

---

### Property 20: Cross-Domain Search Type Filter Isolation

*For any* non-empty search query `q` combined with a `type` filter of `movie`, `book`, or `product`, every result returned by `GET /api/search?q=<q>&type=<type>` must have a `type` field matching the specified filter — no results from other domains should appear.

**Validates: Requirements 13.3**

---

## Error Handling

### Error Response Shape

All error responses use a consistent JSON shape:

```json
{
  "error": "Human-readable message",
  "errors": [                          // only for 422 validation errors
    { "field": "email", "message": "Must be a valid email address" }
  ]
}
```

### HTTP Status Code Usage

| Status | When |
|--------|------|
| 200 | Successful GET, PUT, PATCH, DELETE (with body) |
| 201 | Successful resource creation (POST) |
| 204 | CORS preflight OPTIONS response |
| 400 | Client error: malformed IDs, invalid page/limit, business-rule violations |
| 401 | Missing, expired, or invalid JWT |
| 403 | Valid JWT but insufficient role |
| 404 | Resource not found (entity or page out of range) |
| 409 | Conflict (duplicate email, duplicate review, already borrowed, item already in wishlist) |
| 413 | File too large |
| 415 | Unsupported media type (file upload) |
| 422 | Validation errors (missing fields, wrong types, failed business constraints) |
| 500 | Unhandled internal server error |
| 502 | Upstream service failure (e.g., upload service failure during avatar upload) |

### Global Error Handler

All controller functions are wrapped with `async`/`await` and pass errors to `next(err)`. The global error handler at the bottom of `app.js`:

```js
app.use((err, req, res, next) => {
  console.error(err);  // server-side logging only
  if (err.name === 'ValidationError') {
    return res.status(422).json({ error: 'Validation failed', errors: formatMongooseErrors(err) });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate entry' });
  }
  res.status(500).json({ error: 'Internal server error' });
});
```

Stack traces are never sent to the client.

### Notification Failure Isolation

The `notification.service.js` wraps all Mongoose operations in a `try/catch` and logs failures without re-throwing. This ensures that order placement, book borrowing, and movie request status updates are never rolled back due to a notification failure (Requirement 12.9).

---

## Testing Strategy

### Dual Testing Approach

Both unit/example tests and property-based tests are used. They are complementary:

- **Unit tests** cover specific scenarios, edge cases, error conditions, and integration paths.
- **Property tests** verify universal invariants that hold across all valid inputs, finding edge cases that hand-written tests might miss.

### Property-Based Testing Setup

**Library**: `fast-check` (already present in `client/package.json`; also added to `server/package.json`)  
**Runner**: Jest  
**Minimum iterations**: 100 per property (`numRuns: 100` in `fc.assert`)

Each property test is tagged with a comment:

```js
// Feature: ahadu-center-backend, Property 13: Overdue fee calculation is linear
```

### Test File Organization

```
server/
├── src/
│   └── __tests__/
│       ├── unit/
│       │   ├── overdue.test.js          # P13 — pure function, fast-check
│       │   ├── paginate.test.js         # P9 — pure math, fast-check
│       │   ├── upload.service.test.js   # P18 — filename uniqueness
│       │   └── order.total.test.js      # P16 — subtotal computation
│       ├── integration/
│       │   ├── auth.test.js             # P1, P2, P3 — with in-memory MongoDB
│       │   ├── user.test.js             # P4
│       │   ├── book.filter.test.js      # P5, P10, P11, P12
│       │   ├── movie.filter.test.js     # P6
│       │   ├── product.filter.test.js   # P7, P8
│       │   ├── review.rating.test.js    # P17
│       │   ├── movieRequest.test.js     # P14, P15
│       │   ├── search.test.js           # P20
│       │   └── validation.trim.test.js  # P19
```

### Property Test Configuration

```js
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterFramework: ['./src/__tests__/setup.js'],
};
```

Integration tests use **`mongodb-memory-server`** (`@shelf/jest-mongodb`) to spin up an in-memory MongoDB instance. No real database or network calls are required during CI.

### Unit Test Focus (Non-Property)

Unit tests cover:
- JWT sign/verify helpers (`utils/jwt.js`)
- Express-validator chain behavior (all validator files)
- CORS preflight handling (1 example each)
- 404 for non-existent resource IDs
- 409 for conflict scenarios (duplicate email, duplicate review, already borrowed)
- 401/403 for auth/role guards
- 400 for malformed ObjectIds

### Coverage Targets

- Controller functions: ≥ 80% line coverage
- Utility functions: 100% line coverage
- Middleware: ≥ 90% line coverage
