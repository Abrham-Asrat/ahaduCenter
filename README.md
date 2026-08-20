# AhaduCenter

A full-stack web platform for **Ahadu Center**, a multi-domain cultural and commercial hub in Addis Ababa, Ethiopia. The platform brings together three distinct services under one roof:

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

---

## Documentation

- [Client README](./client/README.md)
- [Server README](./server/README.md)
