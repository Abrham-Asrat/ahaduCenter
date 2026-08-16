# Design Document: UI Fixes, Responsiveness & Animations

## Overview

This document describes the implementation approach for all audit findings across six categories: routing, non-functional buttons, branding, responsiveness, animations, and CSS utilities. Every change is confined to the React + Vite + Tailwind CSS frontend (`client/src`). There is no backend involvement. All interactions use local state, `useNavigate`, `<Link>`, `window.print()`, `navigator.clipboard`, and a lightweight inline toast pattern that already exists in several pages.

The work is decomposed by file to keep each task independently executable with minimal merge surface. No new dependencies are introduced.

---

## Architecture

The application uses:
- **React Router v6** — `<Routes>` / `<Route>` in `App.jsx`, `useNavigate` + `<Link>` in components.
- **Tailwind CSS v3** — utility-first. Responsive variants (`sm:`, `lg:`) and animation utilities are defined in `tailwind.config.js` or via `@layer` in `index.css`.
- **index.css** — custom keyframes and utility classes (`animate-fade-in`, `animate-slide-up`). New utilities are added here.
- **Local state (useState)** — all interactivity is purely client-side.

The existing toast pattern used across pages (`PurchaseHistoryPage`, `WishlistPage`, etc.) is:
```jsx
const [toastMessage, setToastMessage] = useState(null);
const showToast = (msg) => {
  setToastMessage(msg);
  setTimeout(() => setToastMessage(null), 3000);
};
// rendered as:
{toastMessage && (
  <div className="fixed bottom-8 right-8 z-50 bg-surface-container border border-primary/50
                  text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
    <span className="material-symbols-outlined text-primary">check_circle</span>
    <span className="text-sm font-semibold">{toastMessage}</span>
  </div>
)}
```
This pattern is replicated wherever a toast is needed in this feature.

---

## Components and Interfaces

### 1. `src/App.jsx`
Add two missing `<Route>` entries:
```jsx
import NotificationsPage   from './pages/NotificationsPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// inside <Routes>:
<Route path="/notifications"      element={<NotificationsPage />} />
<Route path="/order-confirmation" element={<OrderConfirmationPage />} />
```

### 2. `src/index.css`
Three additions after the existing `.animate-slide-up` rule:
```css
/* Legacy alias so animate-fadeIn (camelCase) still works */
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}

/* Skeleton shimmer utility */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.03) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.03) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite linear;
}
```

### 3. `src/components/common/HeroSection.jsx`
- Change outer `<section>` class: `px-20` → `px-4 sm:px-8 lg:px-20`
- Wrap both buttons with `useNavigate`:
  ```jsx
  import { useNavigate } from 'react-router-dom';
  const navigate = useNavigate();
  <button onClick={() => navigate('/books')}   className="btn-primary ...">Explore Now</button>
  <button onClick={() => navigate('/electronics')} className="btn-secondary ...">Latest Arrivals</button>
  ```

### 4. `src/components/common/BentoGrid.jsx`
- Change outer `<section>` class: `px-20` → `px-4 sm:px-8 lg:px-20`
- Wrap each collection card `<div>` with `<Link>` (import from react-router-dom):
  - Movies card → `<Link to="/movies">`
  - Electronics card → `<Link to="/electronics">`
  - Books card → `<Link to="/books">`
- Change the "Join the Community" `<button>` arrow to `<Link to="/register">` or wrap the card in a `<Link>`.
- Add `cursor-pointer` to card wrappers.

### 5. `src/components/common/Footer.jsx`
- Replace `px-20` with `px-4 sm:px-8 lg:px-20` on the grid container.
- Replace `NexusGlobal` with `Ahadu Center` (both in brand name and copyright).
- Add newsletter success state:
  ```jsx
  const [newsletterSent, setNewsletterSent] = useState(false);
  // Replace input+button with: newsletterSent ? <p>Thanks for subscribing!</p> : <form>…</form>
  ```
- Wire Quick Links: Help Center → `<Link to="/contact">`, Contact Us → `<Link to="/contact">`.

### 6. `src/components/common/Navbar.jsx`
- In the profile dropdown JSX, change `animate-fadeIn` → `animate-fade-in`.

### 7. `src/components/book/BookInfoSection.jsx`
- Change `navigate('/checkout')` → `navigate('/book-confirm')`.

### 8. `src/components/book/BookCoverCard.jsx`
Add local state:
```jsx
const [isSaved, setIsSaved] = useState(false);
const [isZoomed, setIsZoomed] = useState(false);
const [toastMessage, setToastMessage] = useState(null);
const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); };
```
- Share button: `onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied to clipboard!'); }}`
- Save button: `onClick={() => setIsSaved(!isSaved)}` — icon switches between `bookmark` and `bookmark_filled` based on `isSaved`.
- Zoom button (overlay): `onClick={() => setIsZoomed(!isZoomed)}` — adds `scale-110` to the cover image when zoomed.
- QR button: `onClick={() => showToast('QR Code coming soon')}`.
- Render toast at bottom of component return.

### 9. `src/components/book/RelatedBooks.jsx`
Add a `useRef` on the scroll container and implement prev/next scroll:
```jsx
const scrollRef = useRef(null);
const scroll = (dir) => {
  const el = scrollRef.current;
  if (el) el.scrollBy({ left: dir === 'next' ? 220 : -220, behavior: 'smooth' });
};
// attach ref to the container div, onClick={() => scroll('prev')} / scroll('next')
```

### 10. `src/components/movie/RelatedMoviesCarousel.jsx`
Wrap each card `<div>` with `<Link to={`/movies/${movie.id}`}>` (import from react-router-dom).

### 11. `src/components/electronics/SimilarProducts.jsx`
Wrap each card `<div>` with `<Link to={`/electronics/${product.id}`}>` (import from react-router-dom). Add `product.name` text below the existing price span so navigation is clear.

### 12. `src/pages/WishlistPage.jsx`
- Wire "ADD ITEMS" button: `onClick={() => navigate('/books')}`.
- Add `animate-fade-in` to the page container `<div>`.

### 13. `src/pages/PurchaseHistoryPage.jsx`
- Add `currentPage` state and `handlePageChange` for prev/next/number pagination.
- Wire "Export History": `onClick={() => window.print()}`.
- Wire "Track Order": `onClick={() => showToast('Tracking coming soon')}`.
- Wire "Buy Again": `onClick={() => showToast('Added to wishlist')}`.
- Wire "View Details": `onClick={() => showToast('Details coming soon')}`.
- Ensure order cards use `flex-col` on mobile (`flex-col md:flex-row`).
- Add `animate-fade-in` to page container.

### 14. `src/pages/NotificationsPage.jsx`
- Wire "Load More": show toast "No more notifications" (all mock data already loaded).
- Add `animate-fade-in` to page container.

### 15. `src/pages/RegisterPage.jsx`
- In `handleSubmit`, after `e.preventDefault()`, call `showToast('Account created! Redirecting…')` then `setTimeout(() => navigate('/login'), 1500)`. Import `useNavigate`.
- Add `animate-fade-in` to page container.

### 16. `src/pages/ContactPage.jsx`
- Replace `alert('Message sent successfully!')` with an inline success state similar to `ForgotPasswordPage`:
  ```jsx
  const [isSubmitted, setIsSubmitted] = useState(false);
  // in handleSubmit: setIsSubmitted(true); setFormData({…}); // reset form
  // In JSX: isSubmitted ? <SuccessCard /> : <form>…</form>
  ```
- Add `animate-fade-in` to page container.

### 17. `src/pages/UserDashboardPage.jsx`
- Fix `navItems` paths: all sidebar links currently point to `"#"`. Wire each to its correct path:
  - Favorites → `/wishlist`
  - Purchase History → `/purchase-history`
  - Borrowing History → `/borrowing-history`
  - Movie Requests → `/movie-request`
- Also fix the `<Link to={item.label === 'Logout' ? '/' : '#'}>` logic to use `item.path`.
- Add notifications link: `{ label: 'Notifications', icon: 'notifications', path: '/notifications' }`.
- Add contact link: `{ label: 'Contact', icon: 'contact_support', path: '/contact' }`.
- Add `animate-fade-in` to page container.

### 18. `src/pages/BorrowingHistoryPage.jsx`
- Wrap the borrowing table/cards in an `overflow-x-auto` container so it scrolls on mobile.
- Add `animate-fade-in` to page container.

### 19. `src/pages/LoginPage.jsx`, `src/pages/ForgotPasswordPage.jsx`, `src/pages/SearchResultsPage.jsx`, `src/pages/MovieRequestPage.jsx`, `src/pages/BookConfirmPage.jsx`, `src/pages/OrderConfirmationPage.jsx`, `src/pages/ProductComparisonPage.jsx`, `src/pages/AdminDashboardPage.jsx`
- Add `animate-fade-in` to each page's outermost container `<div>`.

### 20. `src/pages/BookCenterPage.jsx`, `src/pages/MovieCenterPage.jsx`
- Add `style={{ animationDelay: \`${index * 0.05}s\` }}` to each card rendered in the grid map. Cards should also have `animate-fade-in` class.

### 21. `src/pages/ElectronicsPage.jsx`
- Add `style={{ animationDelay: \`${index * 0.05}s\` }}` and `animate-fade-in` to each `<ProductCard>` wrapper in the grid map.
- Fix `navigate('/electronics/compare')` → `navigate('/compare')` in `handleCompare`.

### 22. `src/components/admin/AdminLayout.jsx`
- Add controlled state to search input:
  ```jsx
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log('Admin search:', e.target.value);
  };
  ```
- Bind `value={searchQuery}` and `onChange={handleSearch}` to the `<input>`.

### 23. `src/pages/admin/AdminManageBooksPage.jsx`
- Fix the three uncontrolled `<select>` elements in the toolbar to use `value` + `onChange`:
  - Category filter: `value={categoryFilter}` `onChange={(e) => setCategoryFilter(e.target.value)}`
  - Language filter: `value={languageFilter}` `onChange={(e) => setLanguageFilter(e.target.value)}`
  - Availability filter: add `availabilityFilter` state and wire it.
- Add `currentPage` state and `handlePageChange` for pagination buttons.

### 24. `src/pages/admin/AdminManageMoviesPage.jsx` and `src/pages/admin/AdminManageElectronicsPage.jsx`
- Add `currentPage` state and wire pagination buttons identically to books page.
- Ensure mobile card view works at 320 px (add `min-w-0` and `truncate` where text overflows).

### 25. Hover lift and form focus transitions (cross-cutting)
- Cards in `BookCenterPage`, `MovieCenterPage`, `ElectronicsPage`, `WishlistPage` that lack `hover:-translate-y-1`: add `hover:-translate-y-1 transition-transform duration-200`.
- All `<input>`, `<textarea>`, `<select>` elements: ensure `transition-all duration-200` is present in the class list (most already have `transition-all`; confirm and patch missing ones in `ContactPage`, `RegisterPage`, `UserDashboardPage` modal).
- Modal containers (`UserDashboardPage` edit modal, `AdminManageBooksPage` BookModal, `AdminManageMoviesPage` modal, `AdminManageElectronicsPage` modal): add `animate-slide-up` class to the inner panel `<div>`.

---

## Data Models

No new data models are introduced. All state is local to components:

| Component | New State | Type |
|---|---|---|
| `Footer` | `newsletterSent` | `boolean` |
| `BookCoverCard` | `isSaved`, `isZoomed`, `toastMessage` | `boolean`, `boolean`, `string\|null` |
| `RelatedBooks` | `scrollRef` | `React.MutableRefObject` |
| `RegisterPage` | `toastMessage` | `string\|null` |
| `ContactPage` | `isSubmitted` | `boolean` |
| `PurchaseHistoryPage` | `currentPage`, `toastMessage` | `number`, `string\|null` |
| `NotificationsPage` | (existing) | — |
| `AdminLayout` | `searchQuery` | `string` |
| `AdminManageBooksPage` | `availabilityFilter`, `currentPage` | `string`, `number` |
| `AdminManageMoviesPage` | `currentPage` | `number` |
| `AdminManageElectronicsPage` | `currentPage` | `number` |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Most requirements in this feature are UI wiring fixes with specific, concrete expected behaviors (navigation targets, class names, button actions). They are best verified with focused example-based tests. However, a small number of requirements have a universal structure that benefits from property-based testing.

### Property 1: Related carousel cards always link to the correct route pattern

*For any* array of movie objects each with a unique `id`, every rendered card in `RelatedMoviesCarousel` SHALL contain an anchor whose `href` matches the pattern `/movies/{id}` for that specific movie.

**Validates: Requirements 3.2**

### Property 2: SimilarProducts cards always link to the correct route pattern

*For any* array of product objects each with a unique `id`, every rendered card in `SimilarProducts` SHALL contain an anchor whose `href` matches the pattern `/electronics/{id}` for that specific product.

**Validates: Requirements 3.3**

### Property 3: BookCoverCard Save toggle is an involution

*For any* initial saved state (true or false), clicking the Save button twice SHALL return the component to its original saved state (i.e., the toggle is its own inverse).

**Validates: Requirements 4.2**

### Property 4: BookCoverCard Zoom toggle is an involution

*For any* initial zoom state (true or false), clicking the Zoom button twice SHALL return the component to its original zoom state.

**Validates: Requirements 4.3**

### Property 5: Pagination next always increments page by one

*For any* current page N ≥ 1, clicking the next button SHALL result in a current page of N + 1.

**Validates: Requirements 5.6**

### Property 6: Staggered animation delay matches index

*For any* list of N items rendered by `BookCenterPage`, `MovieCenterPage`, or `ElectronicsPage`, the item at index i SHALL have an `animationDelay` style of exactly `${i * 0.05}s`.

**Validates: Requirements 12.1, 12.2, 12.3**

### Property 7: Page entrance animation class is always present

*For any* page in the set { LoginPage, RegisterPage, ForgotPasswordPage, ContactPage, WishlistPage, BorrowingHistoryPage, PurchaseHistoryPage, NotificationsPage, UserDashboardPage, SearchResultsPage, MovieRequestPage, BookConfirmPage, OrderConfirmationPage, ProductComparisonPage, AdminDashboardPage }, the outermost container element SHALL have the CSS class `animate-fade-in`.

**Validates: Requirements 11.1**

---

## Error Handling

| Scenario | Handling |
|---|---|
| `navigator.clipboard.writeText` unavailable (HTTP context / old browser) | Wrap in `try/catch`; fall back to `showToast('Copy not supported in this browser')` |
| `window.print()` blocked by browser | No additional handling needed; the browser shows its own dialog |
| Navigation to route that does not exist | Existing `<Route path="*">` renders `NotFoundPage` — no change needed |
| `RelatedBooks` scroll ref not yet attached | Guard with `if (el)` before calling `scrollBy` |

---

## Testing Strategy

This feature consists entirely of UI wiring, CSS fixes, and state management — no business-logic algorithms or parsers. Testing should be:

**Example-based unit tests** (using Vitest + React Testing Library — the project's existing test stack):
- Render each modified component, simulate the user action (click, type), and assert the expected outcome (navigation call, class name, state change, toast content).
- Focus on the highest-risk items: routing fixes, button wiring, branding text.

**Property-based tests** (using fast-check with React Testing Library):
- Property 1 & 2: Generate arrays of items with random IDs; render carousel components; assert all anchor hrefs match the expected pattern.
- Property 3 & 4: Toggle state twice and assert original state restored.
- Property 5: Generate random page numbers; simulate pagination; assert increment.
- Property 6: Generate arrays of random length; render page; assert each item's `animationDelay` matches `index * 0.05`.
- Property 7: Render each page component; assert `animate-fade-in` class is present.

**CSS / snapshot tests** (optional, Vitest + jsdom):
- Assert that `index.css` contains `.animate-fadeIn`, `.skeleton-shimmer`, and `@keyframes shimmer`.

**Manual smoke testing**:
- Open the app at 320 px width and verify all three responsive-padding sections look correct.
- Trigger each page entrance animation by navigating to the page.
- Open admin pages and verify mobile card view at 320 px.

No E2E or screenshot tests are required for this feature.
