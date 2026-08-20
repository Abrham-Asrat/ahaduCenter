# AhaduCenter — Server

Node.js + Express REST API for the AhaduCenter platform. Backed by MongoDB via Mongoose and tested with Jest + fast-check (property-based testing).

All API routes are prefixed with `/api`. Authentication uses JWT Bearer tokens.

---

## Tech Stack

| Concern | Library |
|---------|---------|
| HTTP Framework | Express 4 |
| ODM | Mongoose 8 |
| Auth | jsonwebtoken + bcryptjs |
| Validation | express-validator |
| File Uploads | multer |
| Email | nodemailer |
| Environment | dotenv |
| CORS | cors |
| Testing | Jest 29 + fast-check + Supertest + mongodb-memory-server |

---

## Getting Started

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ahadu_center
JWT_SECRET=your_strong_secret_here
OVERDUE_FEE_PER_DAY=1
RESERVATION_FEE=50
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_pass
CLIENT_ORIGIN=http://localhost:5173
```

### Run

```bash
npm run dev     # development (nodemon)
npm start       # production
```

### Tests

```bash
npm test        # all 84 tests (serial — uses --runInBand)
```

---

## Project Structure

```
server/
├── src/
│   ├── app.js               # Express app setup (no listen)
│   ├── config/              # Database connection
│   ├── controllers/         # Route handler functions
│   ├── middleware/          # Auth, validation, error handling, uploads
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── services/            # Notification and upload service helpers
│   ├── utils/               # JWT, paginate, overdue fee helpers
│   ├── validators/          # express-validator rule chains
│   └── __tests__/
│       ├── unit/            # Pure function and middleware unit tests
│       └── integration/     # HTTP + DB integration tests
├── uploads/                 # Uploaded files (served at /uploads)
├── server.js                # Entry point — calls app.listen()
├── jest.config.js
├── .env
└── .env.example
```

---

## API Overview

All routes are mounted under `/api`:

| Domain | Base Path |
|--------|-----------|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Books | `/api/books` |
| Borrowings | `/api/borrowings` |
| Movies | `/api/movies` |
| Movie Requests | `/api/movie-requests` |
| Products | `/api/products` |
| Orders | `/api/orders` |
| Reviews | nested under `/api/books/:id/reviews`, `/api/movies/:id/reviews` |
| Wishlist | `/api/users/me/wishlist` |
| Notifications | `/api/users/me/notifications`, `/api/notifications` |
| Search | `/api/search` |
| Uploads | `/api/uploads` |
| Contact | `/api/contact` |
| Admin | `/api/admin` |

See the [design document](../.kiro/specs/ahadu-center-backend/design.md) for the full route table.

---

## Detailed Directory Docs

- [src/controllers/](src/controllers/README.md)
- [src/models/](src/models/README.md)
- [src/middleware/](src/middleware/README.md)
- [src/routes/](src/routes/README.md)
- [src/services/](src/services/README.md)
- [src/utils/](src/utils/README.md)
- [src/validators/](src/validators/README.md)
- [src/__tests__/](src/__tests__/README.md)
