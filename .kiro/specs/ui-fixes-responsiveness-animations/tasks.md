# Implementation Plan: UI Fixes, Responsiveness & Animations

## Overview

Each task touches 1–5 files and can be executed independently. Tasks are ordered so that foundational fixes (routing, CSS) come first, then component-level wiring, then page-level wiring, and finally cross-cutting animation polish. Tasks marked `*` are optional test tasks; all others must be implemented.

---

## Tasks

- [x] 1. Add missing routes and fix incorrect navigate targets in `App.jsx` and `ElectronicsPage.jsx`
  - In `src/App.jsx`: import `NotificationsPage` and `OrderConfirmationPage`, add `<Route path="/notifications">` and `<Route path="/order-confirmation">`.
  - In `src/pages/ElectronicsPage.jsx`: change `navigate('/electronics/compare')` → `navigate('/compare')` inside `handleCompare`.
  - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.1 Write example tests for routing fixes
    - Render `App` in a `MemoryRouter` at `/notifications` and assert `NotificationsPage` content is visible.
    - Render `App` at `/order-confirmation` and assert `OrderConfirmationPage` content is visible.
    - Render `ElectronicsPage`, simulate compare click, assert `navigate` was called with `/compare`.
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Fix navigate targets in `BookInfoSection.jsx` and `ProductComparisonPage.jsx`
  - In `src/components/book/BookInfoSection.jsx`: change `navigate('/checkout')` → `navigate('/book-confirm')`.
  - In `src/pages/ProductComparisonPage.jsx`: find the checkout navigate call and change it to `navigate('/order-confirmation')`.
  - _Requirements: 1.4, 1.5_

  - [x] 2.1 Write example tests for checkout navigation fixes
    - Render `BookInfoSection` with mock book prop, click "Buy", assert `navigate` called with `/book-confirm`.
    - Render `ProductComparisonPage`, click checkout button, assert `navigate` called with `/order-confirmation`.
    - _Requirements: 1.4, 1.5_

- [-] 3. Fix CSS: add `animate-fadeIn` alias, `skeleton-shimmer`, and `@keyframes shimmer` to `index.css`
  - After the existing `.animate-slide-up` rule in `src/index.css`, add:
    - `.animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }` (alias for legacy camelCase references)
    - `@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`
    - `.skeleton-shimmer { background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%); background-size: 200% 100%; animation: shimmer 1.6s infinite linear; }`
  - _Requirements: 10.2, 10.3_

- [x] 4. Fix `Navbar.jsx`: rename `animate-fadeIn` → `animate-fade-in` in profile dropdown
  - In `src/components/common/Navbar.jsx`, locate the profile dropdown `<div>` that uses `animate-fadeIn` and change it to `animate-fade-in`.
  - _Requirements: 10.1_

  - [x] 4.1 Write example test for Navbar dropdown animation class
    - Render `Navbar`, open profile dropdown, assert the dropdown container has class `animate-fade-in` and NOT `animate-fadeIn`.
    - _Requirements: 10.1_

- [x] 5. Fix `HeroSection.jsx`: responsive padding and functional buttons
  - Change outer `<section>` padding from `px-20` to `px-4 sm:px-8 lg:px-20`.
  - Import `useNavigate` from `react-router-dom`.
  - Wire "Explore Now" button: `onClick={() => navigate('/books')}`.
  - Wire "Latest Arrivals" button: `onClick={() => navigate('/electronics')}`.
  - _Requirements: 2.1, 2.2, 8.1, 8.4, 8.5_

  - [x] 5.1 Write example tests for HeroSection
    - Assert the `<section>` has class `px-4` and `lg:px-20`.
    - Simulate "Explore Now" click; assert `navigate` called with `/books`.
    - Simulate "Latest Arrivals" click; assert `navigate` called with `/electronics`.
    - _Requirements: 2.1, 2.2, 8.1_

- [x] 6. Fix `BentoGrid.jsx`: responsive padding and navigation for all cards
  - Change outer `<section>` padding from `px-20` to `px-4 sm:px-8 lg:px-20`.
  - Import `Link` from `react-router-dom`.
  - Wrap the Movies card `<div>` in `<Link to="/movies">` (preserve inner classes and content).
  - Wrap the Electronics card `<div>` in `<Link to="/electronics">`.
  - Wrap the Books card `<div>` in `<Link to="/books">`.
  - Change the "Join the Community" card: wrap in `<Link to="/register">` or navigate the button `onClick`.
  - _Requirements: 2.3, 2.4, 2.5, 2.6, 8.2, 8.4, 8.5_

  - [x] 6.1 Write example tests for BentoGrid
    - Assert outer section has `px-4` and `lg:px-20` classes.
    - Assert Movies card has an ancestor `<a>` with `href="/movies"`.
    - Assert Electronics card has `href="/electronics"`, Books card has `href="/books"`.
    - Assert "Join the Community" element navigates to `/register`.
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 8.2_

- [x] 7. Fix `Footer.jsx`: responsive padding, branding, newsletter, and Quick Links
  - Change grid container padding from `px-20` to `px-4 sm:px-8 lg:px-20`.
  - Replace all instances of "NexusGlobal" with "Ahadu Center" (brand name div and copyright paragraph).
  - Add `newsletterSent` boolean state. Conditionally render the email input+button row OR an inline success message.
  - Wire "Help Center" and "Contact Us" `<a href="#">` → `<Link to="/contact">`.
  - _Requirements: 6.1, 6.2, 7.1, 8.3, 8.4, 8.5_

  - [x] 7.1 Write example tests for Footer
    - Assert text "Ahadu Center" is present; assert "NexusGlobal" is absent.
    - Assert outer grid has `px-4` and `lg:px-20`.
    - Simulate "Send" click; assert success message appears and input disappears.
    - Assert "Help Center" link has `href="/contact"`.
    - _Requirements: 6.1, 6.2, 7.1, 8.3_

- [-] 8. Fix `RelatedBooks.jsx`: implement prev/next carousel scroll
  - Import `useRef` from React.
  - Add `const scrollRef = useRef(null)` and attach to the scrollable container div.
  - Implement `const scroll = (dir) => { scrollRef.current?.scrollBy({ left: dir === 'next' ? 220 : -220, behavior: 'smooth' }); }`.
  - Wire prev button: `onClick={() => scroll('prev')}`, next button: `onClick={() => scroll('next')}`.
  - _Requirements: 3.1_

- [x] 9. Fix `RelatedMoviesCarousel.jsx`: wrap cards in `<Link>`
  - Import `Link` from `react-router-dom`.
  - Wrap each card `<div>` in `<Link to={`/movies/${movie.id}`}>` (add `cursor-pointer`, remove cursor-pointer from inner div if present).
  - _Requirements: 3.2_

  - [x] 9.1 Write property test for RelatedMoviesCarousel card links
    - **Property 1: Related carousel cards always link to the correct route pattern**
    - Using fast-check: generate an array of movie objects (arbitrary `id` values); render `RelatedMoviesCarousel`; assert every anchor's `href` matches `/movies/{movie.id}`.
    - **Validates: Requirements 3.2**

- [x] 10. Fix `SimilarProducts.jsx`: wrap cards in `<Link>`
  - Import `Link` from `react-router-dom`.
  - Wrap each card `<div>` in `<Link to={`/electronics/${product.id}`}>`.
  - _Requirements: 3.3_

  - [x] 10.1 Write property test for SimilarProducts card links
    - **Property 2: SimilarProducts cards always link to the correct route pattern**
    - Using fast-check: generate an array of product objects with arbitrary `id` values; render `SimilarProducts`; assert every anchor `href` matches `/electronics/{product.id}`.
    - **Validates: Requirements 3.3**

- [x] 11. Fix `BookCoverCard.jsx`: implement Share, Save, Zoom, and QR button behaviors
  - Add state: `isSaved`, `isZoomed`, `toastMessage` (with `showToast` helper, 3 s auto-dismiss).
  - Share: `navigator.clipboard.writeText(window.location.href)` wrapped in try/catch, `showToast('Link copied!')`.
  - Save: toggle `isSaved`; change icon between `bookmark` (unsaved) and a filled variant / highlighted color (saved).
  - Zoom: toggle `isZoomed`; apply `scale-110` class to the cover `<img>` when zoomed.
  - QR: `showToast('QR Code coming soon')`.
  - Render toast at the bottom of the component JSX.
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 11.1 Write property tests for BookCoverCard toggle behaviors
    - **Property 3: BookCoverCard Save toggle is an involution**
    - Render `BookCoverCard`; click Save twice; assert `isSaved` returns to initial `false`.
    - **Property 4: BookCoverCard Zoom toggle is an involution**
    - Render `BookCoverCard`; click Zoom twice; assert `isZoomed` returns to initial `false`.
    - **Validates: Requirements 4.2, 4.3**

  - [x] 11.2 Write example tests for BookCoverCard Share and QR
    - Mock `navigator.clipboard.writeText`; click Share; assert it was called and toast shows.
    - Click QR button; assert toast "QR Code coming soon" is rendered.
    - _Requirements: 4.1, 4.4_

- [-] 12. Fix `WishlistPage.jsx`: wire ADD ITEMS button and add entrance animation
  - Wire "ADD ITEMS" button: `onClick={() => navigate('/books')}` (import `useNavigate` if not already present — it is).
  - Add `animate-fade-in` to the outermost `<div className="min-h-screen ...">`.
  - _Requirements: 5.1, 11.1_

- [x] 13. Fix `PurchaseHistoryPage.jsx`: wire all action buttons, add pagination state, mobile layout, entrance animation
  - Add `toastMessage` state and `showToast` helper.
  - Wire "Export History" button: `onClick={() => window.print()}`.
  - Wire "Track Order" button: `onClick={() => showToast('Tracking coming soon')}`.
  - Wire "Buy Again" button: `onClick={() => showToast('Added to wishlist')}`.
  - Wire "View Details" button: `onClick={() => showToast('Details coming soon')}`.
  - Add `currentPage` state (initial `1`). Pagination prev: `setCurrentPage(p => Math.max(1, p - 1))`. Next: `setCurrentPage(p => p + 1)`. Page number buttons: `setCurrentPage(n)`. Highlight active page.
  - Ensure order card uses `flex-col md:flex-row` (already present; verify and fix if needed).
  - Add `animate-fade-in` to outermost `<div>`.
  - Render toast.
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 9.1, 11.1_

  - [x] 13.1 Write property test for pagination increment
    - **Property 5: Pagination next always increments page by one**
    - Using fast-check: generate integer N in range [1, 20]; render `PurchaseHistoryPage`; set `currentPage` to N via interaction; click next; assert `currentPage` is N + 1.
    - **Validates: Requirements 5.6**

- [-] 14. Fix `NotificationsPage.jsx`: wire Load More button and add entrance animation
  - Wire "Load More" button: `onClick={() => showToast('No more notifications')}`. Add `toastMessage` state and `showToast` helper (or reuse existing pattern in the file).
  - Add `animate-fade-in` to outermost `<div>`.
  - _Requirements: 5.7, 11.1_

- [x] 15. Fix `RegisterPage.jsx`: wire form submit with toast + redirect, add entrance animation
  - Import `useNavigate` from `react-router-dom`.
  - In `handleSubmit`, after `e.preventDefault()`:
    - Add `toastMessage` state and `showToast` helper.
    - Call `showToast('Account created successfully!')`.
    - Call `setTimeout(() => navigate('/login'), 1500)`.
  - Add `animate-fade-in` to the outermost `<div className="min-h-screen ...">`.
  - Render toast (position: `fixed top-20 right-6 z-50`).
  - _Requirements: 5.8, 11.1_

  - [x] 15.1 Write example test for RegisterPage submit
    - Render `RegisterPage`, fill out all required fields, submit the form.
    - Assert toast with "Account created" text is rendered.
    - Assert `navigate('/login')` is called after 1500 ms (use fake timers).
    - _Requirements: 5.8_

- [x] 16. Fix `ContactPage.jsx`: replace `alert()` with inline success state and add entrance animation
  - Add `isSubmitted` boolean state.
  - In `handleSubmit`: remove `alert()`; call `setIsSubmitted(true)` and reset `formData`.
  - In JSX: when `isSubmitted` is `true`, render a styled success card (e.g., a green-bordered panel with a checkmark icon and "Message sent successfully!" text + "Send Another" reset button). When `false`, render the form.
  - Apply the `animate-fade-in` class to both the success card and the page container.
  - _Requirements: 5.9, 11.1_

  - [x] 16.1 Write example test for ContactPage submit
    - Render `ContactPage`, fill required fields, submit.
    - Assert success message is visible and the form is no longer rendered.
    - Assert `alert` was NOT called.
    - _Requirements: 5.9_

- [x] 17. Fix `UserDashboardPage.jsx`: wire sidebar navigation items and add entrance animation
  - Update the `navItems` array: replace `to="#"` fallback logic with the correct `item.path` value on the `<Link>`:
    - Favorites → `/wishlist`
    - Purchase History → `/purchase-history`
    - Borrowing History → `/borrowing-history`
    - Movie Requests → `/movie-request`
  - Add two new entries to `navItems`: `{ label: 'Notifications', icon: 'notifications', path: '/notifications' }` and `{ label: 'Contact', icon: 'contact_support', path: '/contact' }`.
  - Fix the Link `to` prop: use `item.path` instead of the ternary `item.label === 'Logout' ? '/' : '#'`.
  - Add `animate-fade-in` to the outermost page `<div>`.
  - Add `animate-slide-up` to the Edit Profile modal's inner panel `<div>`.
  - _Requirements: 5.10, 11.1, 13.3_

  - [x] 17.1 Write example tests for UserDashboardPage sidebar navigation
    - Render `UserDashboardPage`, assert "Favorites" link has `href="/wishlist"`.
    - Assert "Purchase History" has `href="/purchase-history"`.
    - Assert "Borrowing History" has `href="/borrowing-history"`.
    - _Requirements: 5.10_

- [x] 18. Fix `AdminLayout.jsx`: add controlled search state
  - Add `const [searchQuery, setSearchQuery] = useState('')` and handler `const handleSearch = (e) => { setSearchQuery(e.target.value); console.log('Admin search:', e.target.value); }`.
  - Bind `value={searchQuery}` and `onChange={handleSearch}` to the `<input>` in the topbar search div.
  - _Requirements: 6.3_

- [x] 19. Fix `AdminManageBooksPage.jsx`: controlled filter selects and pagination state
  - Wire the three filter `<select>` elements to use controlled state (`categoryFilter`, `languageFilter`, `availabilityFilter` with matching `onChange` handlers). The `categoryFilter` and `searchQuery` states already exist — add `availabilityFilter` state with initial value `'All Availability'`.
  - Add `currentPage` state (initial `1`) and wire pagination buttons: prev → `setCurrentPage(p => Math.max(1, p-1))`, next → increment, page number → `setCurrentPage(n)`, active page highlighted with `bg-primary`.
  - Verify mobile card view is legible at 320 px: add `min-w-0` and `truncate` to text elements inside the card if missing.
  - Add `animate-slide-up` to the `BookModal` inner panel.
  - _Requirements: 6.4, 6.5, 9.3_

- [x] 20. Fix `AdminManageMoviesPage.jsx` and `AdminManageElectronicsPage.jsx`: pagination state and mobile polish
  - For each file:
    - Add `currentPage` state and wire pagination buttons (prev, next, page numbers) identically to Task 19.
    - Ensure mobile card view uses `min-w-0` and `truncate` on long text.
    - Add `animate-slide-up` to their modal inner panels.
  - _Requirements: 6.5, 9.3_

- [x] 21. Checkpoint — ensure all routing, button wiring, and branding fixes are working
  - Ensure all tests pass, ask the user if questions arise.

- [x] 22. Add page entrance animations to remaining pages
  - Add `animate-fade-in` class to the outermost container `<div>` of each of the following pages (those not already covered by earlier tasks):
    - `src/pages/LoginPage.jsx`
    - `src/pages/ForgotPasswordPage.jsx`
    - `src/pages/SearchResultsPage.jsx`
    - `src/pages/MovieRequestPage.jsx`
    - `src/pages/BookConfirmPage.jsx`
    - `src/pages/OrderConfirmationPage.jsx`
    - `src/pages/ProductComparisonPage.jsx`
    - `src/pages/admin/AdminDashboardPage.jsx`
  - _Requirements: 11.1_
  - [~] 22.1 Write property test for page entrance animation class
    - **Property 7: Page entrance animation class is always present**
    - For each of the 15 pages listed in Requirement 11.1, render the page component (wrapping in MemoryRouter where needed), query the outermost `<div>`, assert it has CSS class `animate-fade-in`.
    - **Validates: Requirements 11.1**

- [x] 23. Add staggered animation delays to catalog grid items
  - In `src/pages/BookCenterPage.jsx`: in the `.map()` that renders book cards, add `className="animate-fade-in"` and `style={{ animationDelay: \`${index * 0.05}s\` }}` to each card wrapper element.
  - In `src/pages/MovieCenterPage.jsx`: same treatment for movie cards.
  - In `src/pages/ElectronicsPage.jsx`: add `className="animate-fade-in"` and `style={{ animationDelay: \`${index * 0.05}s\` }}` to each `<ProductCard>` wrapper `<div>` in the sorted product grid.
  - _Requirements: 12.1, 12.2, 12.3_

  - [~] 23.1 Write property test for staggered animation delays
    - **Property 6: Staggered animation delay matches index**
    - Using fast-check: generate an array of N mock items (N between 1 and 20); render `BookCenterPage` (or a focused test component) with those items; for each rendered card at index i, assert `style.animationDelay === \`${i * 0.05}s\``.
    - **Validates: Requirements 12.1, 12.2, 12.3**

- [~] 24. Add hover lift classes to clickable cards
  - Audit the following components and add `hover:-translate-y-1 transition-transform duration-200` to clickable cards that do not already have a `hover:-translate-y` or `hover:scale` transform:
    - `src/pages/BookCenterPage.jsx` — book card elements
    - `src/pages/MovieCenterPage.jsx` — movie card elements
    - `src/components/book/RelatedBooks.jsx` — related book cards
    - `src/components/movie/RelatedMoviesCarousel.jsx` — carousel card wrappers
    - `src/components/electronics/SimilarProducts.jsx` — similar product cards
  - _Requirements: 13.1_

- [~] 25. Add `transition-all duration-200` to form inputs and `animate-slide-up` to modals
  - Verify every `<input>`, `<textarea>`, and `<select>` in `ContactPage`, `RegisterPage`, and the `UserDashboardPage` edit modal has `transition-all duration-200` in its className. Add it where missing.
  - Add `animate-slide-up` to the modal panel in `UserDashboardPage` (`<div className="glass-panel w-full max-w-md rounded-2xl ...">`).
  - Add `animate-slide-up` to the `BookModal` panel in `AdminManageBooksPage` (handled in Task 19; verify here).
  - _Requirements: 13.2, 13.3_

- [~] 26. Fix `BorrowingHistoryPage.jsx`: horizontal scroll wrapper and entrance animation
  - Wrap the borrowing records list (the `<div className="flex flex-col gap-6">` containing the borrowing cards) in an `overflow-x-auto` container so content scrolls horizontally on very narrow screens rather than overflowing.
  - Add `animate-fade-in` to the outermost page `<div>`.
  - _Requirements: 9.2, 11.1_

- [~] 27. Final checkpoint — ensure all tests pass and animations are visible
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP delivery.
- Tasks 1–7 address the highest-priority issues (broken navigation and routing) and should be completed first.
- Each task references specific requirements for full traceability.
- The property-based tests require `fast-check` (`npm install --save-dev fast-check` in `client/`).
- All toast implementations follow the existing pattern already used in `WishlistPage`, `BorrowingHistoryPage`, and `ElectronicsPage` — no new utility is needed.
- Animation classes (`animate-fade-in`, `animate-slide-up`) are already defined in `index.css`; they only need to be applied to page containers.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "3", "8", "9", "10", "11"] },
    { "wave": 2, "tasks": ["2", "4", "5", "6", "7", "12", "13", "14", "15", "16", "17", "18"] },
    { "wave": 3, "tasks": ["19", "20"] },
    { "wave": 4, "tasks": ["21"] },
    { "wave": 5, "tasks": ["22", "23", "24", "25", "26"] },
    { "wave": 6, "tasks": ["27"] }
  ]
}
```

- Wave 1: Foundational routing, CSS, and independent catalog component fixes.
- Wave 2: Dependent wiring tasks across page components and admin layout.
- Wave 3: Admin manage pages (depend on AdminLayout fix in wave 2).
- Wave 4: Checkpoint after all wiring is complete.
- Wave 5: Animation polish across all pages.
- Wave 6: Final checkpoint.
