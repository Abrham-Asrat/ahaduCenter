# AhaduCenter - Client

React and Vite frontend for the AhaduCenter movie, book, and electronics platform.

![React](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-5-646cff) ![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.2-764abc) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6)

## Technology

| Area | Implementation |
| --- | --- |
| UI | React 18, React Router 6, lucide-react |
| Build | Vite 5, TypeScript, PostCSS, Tailwind CSS |
| State | Redux Toolkit, React Redux |
| HTTP | Axios |
| Tests | Vitest, Testing Library, jsdom, fast-check |

## Prerequisites

Node.js 18 or newer and npm. The API server should be running at the URL configured in the client environment.

## Getting started

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The development server is normally available at `http://localhost:5173`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development mode |
| `npm run build` | Create the production bundle in `dist/` |
| `npm run preview` | Preview the production bundle locally |
| `npm run lint` | Run ESLint with zero warnings allowed |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

## Environment

Create `client/.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
# Optional override; this value takes precedence over VITE_API_BASE_URL.
VITE_API_URL=http://localhost:5000/api
```

`src/config/env.ts` defaults both API settings to `http://localhost:5000/api` when omitted. Google sign-in requires a real `VITE_GOOGLE_CLIENT_ID`.

## Project structure

```text
src/
  components/       Shared, common, book, movie, electronics, and admin UI
  config/            Environment resolution
  pages/             Public, protected, and admin route pages
  redux/             Store, typed hooks, and slices
  services/          Axios API client and domain services
  test/              Vitest and Testing Library tests
  __tests__/         Property-based tests
  types/             Shared TypeScript types
  App.tsx            Route definitions and auth bootstrap
  index.css          Global styles and Tailwind entrypoint
```

The requested `assets`, `animations`, and `components/ui` folders are not separate directories in the current tree; use the existing component and global-style locations.

## Routing

| Path | Page | Access |
| --- | --- | --- |
| `/`, `/movies`, `/movies/:id`, `/electronics`, `/electronics/:id`, `/books`, `/books/:id` | Home, movie, product, and book pages | Public |
| `/login`, `/register`, `/verify-email`, `/forgot-password` | Authentication pages | Public |
| `/search`, `/contact`, `/design-system`, `/compare` | Search, contact, design system, comparison | Public |
| `/order-confirmation`, `/order-confirmation/:id` | Order confirmation | Public route |
| `/account`, `/wishlist`, `/purchase-history`, `/borrowing-history`, `/movie-request`, `/notifications`, `/book-confirm` | Member pages | Authenticated |
| `/admin`, `/admin/movies`, `/admin/books`, `/admin/electronics` | Admin dashboard and management | Admin role |
| `*` | Not found | Public |

## Styling and motion

Tailwind scans `index.html` and `src/**/*.{js,ts,jsx,tsx}`. Configured fonts are `Poppins` for headings and `Inter` for body text. Key colors include `dark-bg #0B0F19`, `card-surface #151B28`, `primary #10B981`, `secondary #D4AF37`, `light-gray #A0AEC0`, and the surface/on-surface tokens in `tailwind.config.js`.

The repository does not install or import Framer Motion. Page and component transitions are implemented with existing CSS/classes where present; a dedicated reduced-motion system is not currently declared in the inspected client code.

## Redux state

| Slice | Manages |
| --- | --- |
| `auth` | Current user, token, registration/login, bootstrap, logout |
| `movie` | Movie catalog and movie details |
| `book` | Book catalog, details, borrowing, reservations |
| `product` | Electronics catalog and product details |
| `wishlist` | Wishlist items and mutations |
| `notification` | User notifications |
| `admin` | Admin catalog and dashboard operations |

Use `useAppSelector` and `useAppDispatch` from `src/redux/hooks.ts`; the store exports `RootState` and `AppDispatch` types.

## API layer

`src/services/api.ts` creates an Axios client, reads `VITE_API_URL`/`VITE_API_BASE_URL`, attaches `localStorage.token` as `Authorization: Bearer <token>`, and converts API/network failures to string messages. A non-auth `401` dispatches logout and redirects to `/login`. There is no refresh-token flow.

## Testing

Tests live in `src/test/` and `src/__tests__/`. A new component test can use Testing Library with the existing setup:

```bash
npm test -- src/test/your-feature.test.tsx
npx vitest --coverage
```

No `test:coverage` script is defined; the second command uses the installed V8 coverage provider.

## Responsive design and accessibility

The client uses Tailwind's default responsive utilities and a mobile-first layout approach. The repository does not contain a separate viewport certification matrix, so claims such as “tested from 320px to 1920px” should be added only after that verification is performed. Existing components provide the basis for keyboard focus, semantic controls, and ARIA improvements; review new UI against those requirements.

## Build and deploy

```bash
npm run build
npm run preview
```

Deploy `dist/` to a static host and provide the production API URL at build time through `VITE_API_URL` or `VITE_API_BASE_URL`. Hosting-specific configuration for Vercel or Netlify is not present in this repository.

## Related docs

- [Monorepo README](../README.md)
- [Server README](../server/README.md)