# AhaduCenter

A full-stack web platform for **Ahadu Center**, a multi-domain cultural and commercial hub in Addis Ababa, Ethiopia. The platform brings together three distinct services under one roof:

## Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Technology](#tech-stack)
- [Environment](#environment)
- [Scripts](#scripts)
- [Testing](#testing)
- [Contributing](#contributing)
- [License and Contact](#license-and-contact)

## Features

- Catalog browsing for movies, books, and electronics
- Book borrowing, reservations, renewals, and history
- Orders with in-store pickup workflows
- Email verification and Google Identity Services authentication
- Member wishlists, reviews, notifications, and protected account routes
- Role-protected administration screens and REST endpoints

- 🎬 **Movie Center** — browse the film catalog and request new titles
- 📚 **Book Center** — library with borrowing, reservation, and renewal
- 🖥️ **Electronics Hub** — product catalog with in-store pick-up orders

---

## Project Structure

```
AhaduCenter/
├── client/          # React + Redux frontend (Vite)
├── server/          # Node.js + Express REST API (MongoDB)
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Clone and install

```bash
git clone <repo-url>
cd AhaduCenter

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 2. Configure environment

```bash
# In server/
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and email credentials
```

The frontend uses `client/.env` with `VITE_API_BASE_URL` and `VITE_GOOGLE_CLIENT_ID`. The backend uses `server/.env`; see [server/.env.example](./server/.env.example) for the complete list.

### 3. Run in development

```bash
# Terminal 1 — API server (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — React dev server (http://localhost:5173)
cd client && npm run dev
```

### 4. Run tests

```bash
# Client (Vitest)
cd client && npm test

# Server (Jest + property-based tests)
cd server && npm test
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React Router 6, Tailwind CSS |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Testing (client) | Vitest, Testing Library |
| Testing (server) | Jest, fast-check (property-based), Supertest, mongodb-memory-server |

## Environment

Environment files are intentionally ignored by Git. Copy the relevant examples before development:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Do not commit credentials, JWT secrets, or email passwords.

## Scripts

Client scripts are run from `client/`:

```bash
npm run dev
npm run build
npm run preview
npm test
```

Server scripts are run from `server/`:

```bash
npm run dev
npm start
npm test
npm run seed
```

The client `lint` script is present, but ESLint is not currently installed or configured in the repository.

## Testing

```bash
cd client && npm test
cd server && npm test
```

Backend integration tests use `mongodb-memory-server` and may download a MongoDB test binary on first run.

## Contributing

Keep changes focused, preserve existing API behavior, add tests for behavior changes, and update the relevant README or environment example when configuration changes. Run the applicable client and server checks before opening a pull request.

## License and Contact

No license file or canonical author/contact metadata is currently included. Add those details before publishing the project externally.

---

## Documentation

- [Client README](./client/README.md)
- [Server README](./server/README.md)
