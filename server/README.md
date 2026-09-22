# AhaduCenter - Server

Express and Mongoose API for the AhaduCenter client.

![Express](https://img.shields.io/badge/Express-4-000000) ![Mongoose](https://img.shields.io/badge/Mongoose-8-880000) ![MongoDB](https://img.shields.io/badge/MongoDB-supported-47a248) ![Jest](https://img.shields.io/badge/tests-Jest-c21325)

## Technology

| Area | Implementation |
| --- | --- |
| Runtime | Node.js, CommonJS |
| API | Express 4, express-validator, multer, cors |
| Persistence | MongoDB, Mongoose 8 |
| Auth | jsonwebtoken, bcryptjs, Google Identity Services support |
| Email | Nodemailer |
| Tests | Jest, Supertest, fast-check, mongodb-memory-server |

## Prerequisites

Node.js 18 or newer, npm, and a local MongoDB instance or MongoDB Atlas database.

## Getting started

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

`npm run dev` uses Node's watch mode. `npm start` runs `node server.js` for production-style startup.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start with Node watch mode |
| `npm start` | Start the server |
| `npm test` | Run Jest serially |
| `npm run seed` | Seed collections that are empty |
| `npm run seed:fresh` | Clear and reseed |
| `npm run seed:clear` | Clear seed collections without reseeding |
| `npm run seed:users` | Seed only users |
| `npm run seed:prod` | Production-mode seed command; requires explicit seed safeguards |
| `npm run migrate:stock` | Run the stock quantity migration |
| `npm run migrate:indexes` | Run the typed unique-index migration |

## Environment variables

`server.js` requires the first five variables below at startup.

| Name | Required | Description | Example |
| --- | --- | --- | --- |
| `PORT` | Yes | HTTP port | `5000` |
| `MONGO_URI` | Yes | MongoDB connection URI | `mongodb://localhost:27017/ahadu_center` |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs | `<strong-secret>` |
| `CLIENT_ORIGIN` | Yes | Comma-separated CORS allowlist | `http://localhost:5173` |
| `CLIENT_URL` | Yes | Frontend URL used in verification links | `http://localhost:5173` |
| `OVERDUE_FEE_PER_DAY` | No | Overdue fee; default `1` | `1` |
| `RESERVATION_FEE` | No | Reservation fee; default `50` | `50` |
| `EMAIL_HOST` | No | Nodemailer SMTP host | `smtp.mailtrap.io` |
| `EMAIL_PORT` | No | SMTP port; code fallback is `587` | `2525` |
| `EMAIL_USER` | No | SMTP username | `user` |
| `EMAIL_PASS` | No | SMTP password | `<secret>` |
| `EMAIL_FROM` | No | Sender identity; falls back to `EMAIL_USER` | `AhaduCenter <no-reply@example.com>` |
| `GOOGLE_CLIENT_ID` | No | Required for Google auth operations | `...apps.googleusercontent.com` |
| `MONGO_SEED_URI` | No | Seed database override | `mongodb://localhost:27017/ahadu_seed` |
| `SEED_USERS` ... `SEED_CONTACTS` | No | Per-resource seed counts | `12` |

Use `.env.example` as the complete template. Seed count names correspond to `SEED_USERS`, `SEED_BOOKS`, `SEED_MOVIES`, `SEED_PRODUCTS`, `SEED_BORROWINGS`, `SEED_MOVIEREQUESTS`, `SEED_ORDERS`, `SEED_REVIEWS`, `SEED_WISHLISTS`, `SEED_NOTIFICATIONS`, and `SEED_CONTACTS`.

## Project structure

```text
server.js                 Configuration, required-env checks, DB connection, listen
config/db.js              Mongoose connection
src/app.js                Express middleware and route mounting
src/controllers/          Request handlers
src/middleware/            Auth, role, validation, upload, and errors
src/models/                Mongoose schemas
src/routes/                API route definitions
src/services/              Domain services
src/utils/                 Shared server helpers
src/validators/            express-validator rules
src/seed/                  CLI seed runner and seeders
src/migrations/            One-off migration scripts
src/__tests__/             Jest tests
```

## Authentication and authorization

Registration and Google authentication produce a JWT containing the user ID and role. Clients send `Authorization: Bearer <token>` to protected routes. `authenticate` verifies the token and loads the user; `requireRole('admin')` protects the admin router. Tokens expire after 24 hours. There is no refresh-token endpoint. The model currently permits `user` and `admin` roles only.

## API reference

All API paths are prefixed with `/api`. Protected endpoints require a bearer token; admin endpoints also require the `admin` role.

### Auth and users

| Method | Path | Auth | Body/query |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | `email`, `name` |
| POST | `/api/auth/google`, `/api/auth/google/register` | Public | `credential` |
| POST | `/api/auth/admin-login` | Public | `email`, `password` |
| POST | `/api/auth/forgot-password` | Public | `email` |
| POST | `/api/auth/reset-password` | Public | `token`, `newPassword` |
| GET | `/api/auth/verify-email` | Public | query `token` |
| POST | `/api/auth/resend-verification` | Public | `email` |
| GET/PUT | `/api/users/me` | User | PUT: `name`, `email` |
| GET | `/api/users/me/stats`, `/activity`, `/borrowings`, `/movie-requests`, `/wishlist` | User | None |
| GET | `/api/users/me/orders` | User | `page`, `limit` |
| GET | `/api/users/me/notifications` | User | `type` |
| POST/DELETE | `/api/users/me/wishlist`, `/api/users/me/wishlist/:itemId` | User | POST: `itemId`, `itemType` |
| POST/DELETE | `/api/users/me/notifications/read-all`, `/api/users/me/notifications` | User | None |

### Catalog, borrowing, orders, and utility routes

| Method | Path | Auth | Body/query |
| --- | --- | --- | --- |
| GET | `/api/books`, `/api/movies`, `/api/products` | Public | Catalog filters plus `page`, `limit` |
| GET | `/api/books/:id`, `/api/movies/:id`, `/api/products/:id` | Public | Path `id` |
| GET/POST | `/api/books/:id/reviews`, `/api/movies/:id/reviews` | GET public; POST user | POST: `rating`, `comment`; GET: `page`, `limit` |
| POST | `/api/books/:id/borrow`, `/api/books/:id/reserve` | User | Path `id` |
| POST | `/api/borrowings/:id/renew`, `/api/borrowings/:id/return` | User | Path `id` |
| POST/DELETE | `/api/movie-requests`, `/api/movie-requests/:id` | User | POST: `title`, optional `type`, `year`, `genre`, `details` |
| POST/GET | `/api/orders`, `/api/orders/:id` | User | POST: `items[{productId,quantity}]` |
| PATCH | `/api/notifications/:id/read` | User | Path `id` |
| GET | `/api/search` | Public | `q`, `type`, price range, `page`, `limit`, `sort` |
| POST | `/api/contact` | Public | `name`, `email`, `subject`, `message` |
| POST | `/api/uploads` | Admin | multipart field `file` |

### Admin

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/admin/stats`, `/api/admin/recent` | Admin |
| GET/POST | `/api/admin/books`, `/api/admin/movies`, `/api/admin/products` | Admin |
| PUT/DELETE | `/api/admin/books/:id`, `/api/admin/movies/:id`, `/api/admin/products/:id` | Admin |
| GET | `/api/admin/movie-requests`, `/api/admin/contacts` | Admin |
| PATCH | `/api/admin/movie-requests/:id/status` | Admin |

Example request:

```bash
curl "$API_URL/api/books?q=history&page=1&limit=10"
curl -X POST "$API_URL/api/books/BOOK_ID/borrow" \
	-H "Authorization: Bearer $TOKEN"
curl -X POST "$API_URL/api/orders" -H "Authorization: Bearer $TOKEN" \
	-H "Content-Type: application/json" \
	-d '{"items":[{"productId":"PRODUCT_ID","quantity":1}]}'
```

Responses are JSON objects or arrays produced by the corresponding controller. Exact response shapes should be treated as controller contracts; there is no generated OpenAPI document in the repository.

## Data models

All models use MongoDB ObjectIds. The main relationships and notable constraints are:

| Model | Key fields | Relationships and indexes |
| --- | --- | --- |
| `User` | name, email, passwordHash, role, verification/reset fields | Unique email; role `user\|admin` |
| `Book` | title, author, availability, copies, rating, metadata | Text index: title/author/isbn |
| `Movie` | title, cast, genres, rating, media metadata | Text index: title/director |
| `Product` | name, price, stock, condition, specifications | Text index: name/brand/category |
| `Order` | userId, items, status, store details | User/Product references in embedded items |
| `Borrowing` | userId, bookId, dates, status, renewalsLeft | Partial unique active borrowing index |
| `Reservation` | userId, bookId, status, reservationDate | Partial unique active reservation index |
| `WishlistItem` | userId, itemId, itemType, addedAt | Unique user/item/type index |
| `Review` | userId, itemId, itemType, rating, comment | Unique user/item/type index; Book/Movie item types |
| `MovieRequest` | userId, title, type, year, genre, status | User reference; status Pending/Available/Fulfilled |
| `Notification` | userId, type, title, description, isRead | User reference; timestamps disabled |
| `ContactSubmission` | name, email, subject, message | Email normalized; no custom index |

Example document:

```json
{
	"title": "Example book",
	"author": "Example author",
	"availability": "Available",
	"availableCopies": 1,
	"rating": 0
}
```

## Testing

```bash
npm test
npx jest src/__tests__/some.test.js --runInBand
npx jest --coverage --runInBand
```

Tests use Jest, Supertest, fast-check, and mongodb-memory-server where applicable. The repository contains unit and integration-style tests, but no separate package scripts for each category.

## Seeding

```bash
npm run seed
npm run seed:fresh
npm run seed:clear
npm run seed:users
node src/seed/index.js --only=books,movies --count=10
```

The runner skips populated collections unless `--fresh` is used and refuses `NODE_ENV=production` without `--force`. Default accounts are `admin@ahadu.test / Admin@123` and `demo@ahadu.test / Demo@123`. The requested `staff` account is not created because the role enum has no staff value. Never use the sample credentials or destructive seed commands against production data.

## Security

Passwords are hashed with bcryptjs. JWT secrets must be supplied through environment variables and tokens expire after 24 hours. CORS uses the comma-separated `CLIENT_ORIGIN` allowlist. Input is validated with express-validator and uploads use multer. No rate-limiting or Mongo sanitization middleware is installed in the inspected dependency set.

## Deployment

```bash
npm install
npm start
```

Set all required production environment variables, use MongoDB Atlas or another managed MongoDB deployment, and place a TLS-capable reverse proxy in front of Express when appropriate. No production hosting or nginx server configuration for the API is included.

## Detailed directory docs

- [Controllers](src/controllers/README.md)
- [Middleware](src/middleware/README.md)
- [Routes](src/routes/README.md)
- [Services](src/services/README.md)
- [Validators](src/validators/README.md)
- [Tests](src/__tests__/README.md)
- [Utilities](utils/README.md)
- [Seeding](src/seed/README.md)

## Related docs

- [Monorepo README](../README.md)
- [Client README](../client/README.md)

## TODO

- Add an OpenAPI document with authoritative response schemas.
- Add deployment-specific reverse-proxy and hosting instructions.
- Add a security contact and CI badge URLs.
# AhaduCenter Server

Express and Mongoose API for the AhaduCenter client. Start the API with `npm start` after configuring `server/.env` from `.env.example`.

## Seeding the Database

### Quick start

```bash
cd server
npm run seed:fresh
```

### Scripts

| Command | Purpose |
|---|---|
| `npm run seed` | Seed empty collections without clearing existing data |
| `npm run seed:fresh` | Clear seed collections and seed them again for development |
| `npm run seed:clear` | Clear seed collections only |
| `npm run seed:users` | Seed users only |
| `npm run seed:prod -- --force` | Production seed, only with explicit `--force` |

### Default test accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@ahadu.test` | `Admin@123` |
| User | `demo@ahadu.test` | `Demo@123` |

### Environment variables

```dotenv
MONGO_SEED_URI=
SEED_USERS=12
SEED_BOOKS=40
SEED_MOVIES=40
SEED_PRODUCTS=30
SEED_BORROWINGS=60
SEED_ORDERS=35
```

`MONGO_SEED_URI` is optional and overrides `MONGO_URI` for seed operations. Use `--only=users,books` or `--count=25` for targeted runs. See `src/seed/README.md` for live-schema mappings.

### Warning

Never run `seed:fresh` against production. The runner refuses production unless `--force` is supplied.
