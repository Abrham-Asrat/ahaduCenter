# AhaduCenter — Client

React + Redux frontend for the AhaduCenter platform, built with Vite and Tailwind CSS.

---

## Tech Stack

| Concern | Library |
|---------|---------|
| UI Framework | React 18 |
| State Management | Redux Toolkit |
| Routing | React Router DOM 6 |
| HTTP Client | Axios |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Build Tool | Vite 5 |
| Testing | Vitest + Testing Library |

---

## Getting Started

### Install

```bash
npm install
```

### Environment

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Development server

```bash
npm run dev
# → http://localhost:5173
```

### Production build

```bash
npm run build
npm run preview   # preview the built output locally
```

### Lint

```bash
npm run lint
```

### Tests

```bash
npm test          # single run (CI)
npm run test:watch  # watch mode
```

---

## Project Structure

```
client/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── assets/              # Images and icons
│   ├── components/          # Reusable UI components
│   │   ├── admin/           # Admin layout
│   │   ├── book/            # Book-domain components
│   │   ├── common/          # Shared components (Navbar, Footer, etc.)
│   │   ├── electronics/     # Electronics-domain components
│   │   └── movie/           # Movie-domain components
│   ├── pages/               # Route-level page components
│   │   ├── admin/           # Admin dashboard pages
│   │   └── *.jsx            # User-facing pages
│   ├── redux/               # Redux store and slices
│   │   ├── store.js
│   │   └── slices/          # auth, book, movie, product, wishlist, etc.
│   ├── services/            # Axios API service modules
│   ├── test/                # Vitest test files
│   ├── utils/               # Constants, helpers, validators
│   ├── App.jsx              # Root component with routes
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles / Tailwind directives
├── index.html
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Key Directories

### `src/components/`

Domain-scoped UI components. Each sub-folder maps to a service domain:

| Folder | Purpose |
|--------|---------|
| `common/` | Navbar, Footer, HeroSection, Pagination, SubNav, ScrollToTop, etc. |
| `book/` | BookCard, BookFilters, BookDetailTabs, RelatedBooks, etc. |
| `movie/` | MovieCard, MovieHero, CastSection, TrailerSection, etc. |
| `electronics/` | ProductCard, ProductGallery, ProductSpecs, SimilarProducts, etc. |
| `admin/` | AdminLayout wrapper |

### `src/pages/`

One file per route. Admin pages are nested under `pages/admin/`.

| Page | Route |
|------|-------|
| `HomePage` | `/` |
| `BookCenterPage` | `/books` |
| `BookDetailPage` | `/books/:id` |
| `MovieCenterPage` | `/movies` |
| `MovieDetailPage` | `/movies/:id` |
| `ElectronicsPage` | `/electronics` |
| `ProductDetailPage` | `/electronics/:id` |
| `UserDashboardPage` | `/dashboard` |
| `WishlistPage` | `/wishlist` |
| `SearchResultsPage` | `/search` |
| `AdminDashboardPage` | `/admin` |

### `src/redux/slices/`

| Slice | Manages |
|-------|---------|
| `authSlice` | Login, register, JWT token |
| `bookSlice` | Book catalog, borrowings |
| `movieSlice` | Movie catalog, requests |
| `productSlice` | Electronics catalog |
| `wishlistSlice` | User wishlist |
| `notificationSlice` | In-app notifications |
| `adminSlice` | Admin stats and CRUD |

### `src/services/`

Axios service modules — one per API domain. All requests are routed through `services/api.js` which sets the base URL and attaches the JWT `Authorization` header automatically.

---

## Testing

Tests live in `src/test/` and use **Vitest** + **@testing-library/react**.

```bash
npm test          # run all tests once
npm run test:watch  # interactive watch mode
```

Coverage:

```bash
npx vitest run --coverage
```
