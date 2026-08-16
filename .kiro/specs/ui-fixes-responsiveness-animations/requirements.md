# Requirements Document

## Introduction

Ahadu Center is a React + Vite + Tailwind CSS single-page application with no real backend — all data is mocked locally. A UI audit identified six categories of issues: missing routes, non-functional buttons/links, a wrong brand name in the footer, hardcoded padding values that break small screens, missing entrance and hover animations, and incomplete CSS utilities. This feature addresses every finding so that all pages are fully navigable, responsive at 320 px+, and animated consistently.

## Glossary

- **App**: The React application defined in `src/App.jsx` using React Router v6.
- **Router**: React Router v6 `<Routes>` / `<Route>` tree in `App.jsx`.
- **Toast**: A temporary in-page notification rendered as a floating pill; no external library required.
- **animate-fade-in**: CSS utility class defined in `index.css` that plays the `fadeIn` keyframe (opacity 0 → 1, translateY 8 px → 0, 0.4 s).
- **animate-slide-up**: CSS utility class defined in `index.css` that plays the `slideUp` keyframe (opacity 0 → 1, translateY 16 px → 0, 0.5 s).
- **skeleton-shimmer**: CSS utility class to be added to `index.css` for a horizontal shimmer loading effect.
- **Page container**: The outermost `<div>` element of a page component that wraps Navbar + main + Footer.
- **Staggered animation**: Applying `style={{ animationDelay: \`${index * 0.05}s\` }}` to each item in a list/grid so items animate in sequence.

---

## Requirements

### Requirement 1: Routing — Missing and Incorrect Routes

**User Story:** As a user, I want every navigation link to reach the correct page, so that I can access all features of the site without hitting a 404 or landing on the wrong page.

#### Acceptance Criteria

1. WHEN the Router is initialised, THE App SHALL include a `<Route path="/notifications">` that renders `NotificationsPage`.
2. WHEN the Router is initialised, THE App SHALL include a `<Route path="/order-confirmation">` that renders `OrderConfirmationPage`.
3. WHEN a user triggers the compare action on `ElectronicsPage`, THE App SHALL navigate to `/compare` (not `/electronics/compare`).
4. WHEN a user clicks "Buy" in `BookInfoSection`, THE App SHALL navigate to `/book-confirm` (not `/checkout`).
5. WHEN a user clicks the checkout action in `ProductComparisonPage`, THE App SHALL navigate to `/order-confirmation` (not `/checkout`).

---

### Requirement 2: Non-Functional Buttons — Home Page Components

**User Story:** As a visitor on the home page, I want every button and collection card to navigate to the correct section, so that I can explore movies, electronics, and books without dead ends.

#### Acceptance Criteria

1. WHEN a user clicks "Explore Now" in `HeroSection`, THE App SHALL navigate to `/books`.
2. WHEN a user clicks "Latest Arrivals" in `HeroSection`, THE App SHALL navigate to `/electronics`.
3. WHEN a user clicks the Movies card in `BentoGrid`, THE App SHALL navigate to `/movies`.
4. WHEN a user clicks the Electronics card in `BentoGrid`, THE App SHALL navigate to `/electronics`.
5. WHEN a user clicks the Books card in `BentoGrid`, THE App SHALL navigate to `/books`.
6. WHEN a user clicks "Join the Community" in `BentoGrid`, THE App SHALL navigate to `/register`.

---

### Requirement 3: Non-Functional Buttons — Catalog Carousels

**User Story:** As a user browsing detail pages, I want carousel navigation and card links to work, so that I can discover related content.

#### Acceptance Criteria

1. WHEN a user clicks the prev/next arrows in `RelatedBooks`, THE RelatedBooks SHALL scroll its carousel container left or right by one card width.
2. WHEN a user clicks a card in `RelatedMoviesCarousel`, THE App SHALL navigate to `/movies/:id` for that movie.
3. WHEN a user clicks a card in `SimilarProducts`, THE App SHALL navigate to `/electronics/:id` for that product.

---

### Requirement 4: Non-Functional Buttons — Book Detail Actions

**User Story:** As a user on a book detail page, I want the Share, Save, Zoom, and QR buttons to produce visible feedback, so that I know my action was registered.

#### Acceptance Criteria

1. WHEN a user clicks the Share button in `BookCoverCard`, THE BookCoverCard SHALL copy the current page URL to the clipboard using `navigator.clipboard.writeText` and show a toast confirming the copy.
2. WHEN a user clicks the Save (Bookmark) button in `BookCoverCard`, THE BookCoverCard SHALL toggle a saved/unsaved visual state (filled vs outline icon) without calling any API.
3. WHEN a user clicks the Zoom button in `BookCoverCard`, THE BookCoverCard SHALL toggle a zoomed/unzoomed visual state on the cover image without calling any API.
4. WHEN a user clicks the QR button in `BookCoverCard`, THE BookCoverCard SHALL display a toast with the message "QR Code coming soon".

---

### Requirement 5: Non-Functional Buttons — User Pages

**User Story:** As a logged-in user, I want all action buttons on my personal pages to respond with navigation or feedback, so that I can manage my account without broken interactions.

#### Acceptance Criteria

1. WHEN a user clicks "ADD ITEMS" on `WishlistPage`, THE App SHALL navigate to `/books`.
2. WHEN a user clicks "Export History" on `PurchaseHistoryPage`, THE PurchaseHistoryPage SHALL trigger `window.print()`.
3. WHEN a user clicks "Track Order" on `PurchaseHistoryPage`, THE PurchaseHistoryPage SHALL display a toast "Tracking coming soon".
4. WHEN a user clicks "Buy Again" on `PurchaseHistoryPage`, THE PurchaseHistoryPage SHALL display a toast "Added to wishlist".
5. WHEN a user clicks "View Details" on `PurchaseHistoryPage`, THE PurchaseHistoryPage SHALL display a toast "Details coming soon".
6. WHEN a user clicks the pagination prev/next buttons on `PurchaseHistoryPage`, THE PurchaseHistoryPage SHALL update a `currentPage` state and reflect the active page in the UI.
7. WHEN a user clicks "Load More" on `NotificationsPage` and there are no additional items, THE NotificationsPage SHALL display a toast "No more notifications".
8. WHEN a user submits the registration form on `RegisterPage`, THE RegisterPage SHALL display a success toast and navigate to `/login` after 1500 ms.
9. WHEN a user submits the contact form on `ContactPage`, THE ContactPage SHALL replace the native `alert()` call with an inline styled success message (same pattern as `ForgotPasswordPage`).
10. WHEN a user clicks a sidebar nav item in `UserDashboardPage`, THE App SHALL navigate to the correct route: Favorites → `/wishlist`, Purchase History → `/purchase-history`, Borrowing History → `/borrowing-history`, Movie Requests → `/movie-request`.

---

### Requirement 6: Non-Functional Buttons — Footer and Admin

**User Story:** As a user or administrator, I want footer links and admin controls to work correctly, so that I can access all pages and manage content without dead-end interactions.

#### Acceptance Criteria

1. WHEN a user clicks the "Send" button in the Footer newsletter input, THE Footer SHALL display an inline success message replacing the input row.
2. WHEN a user clicks a Quick Links item in the Footer (Help Center, Contact Us), THE App SHALL navigate to `/contact`.
3. WHEN an admin types in the search input in `AdminLayout`, THE AdminLayout SHALL update a controlled `searchQuery` state and call `console.log` with the current value.
4. WHEN an admin changes the Category or Language filter select in `AdminManageBooksPage`, THE AdminManageBooksPage SHALL update the corresponding controlled state (`categoryFilter`, `languageFilter`) and re-filter the book list.
5. WHEN an admin clicks a pagination prev/next or page-number button on any admin page (`AdminManageBooksPage`, `AdminManageMoviesPage`, `AdminManageElectronicsPage`), THE admin page SHALL update a `currentPage` state and reflect the active page visually.

---

### Requirement 7: Branding Fix

**User Story:** As a site visitor, I want the footer to display the correct brand name, so that the site identity is consistent.

#### Acceptance Criteria

1. WHEN the Footer is rendered, THE Footer SHALL display "Ahadu Center" as the brand name and copyright notice instead of "NexusGlobal".

---

### Requirement 8: Responsiveness — Hardcoded Padding

**User Story:** As a mobile user, I want page sections to use responsive padding, so that content is not clipped or excessively indented on small screens.

#### Acceptance Criteria

1. WHEN `HeroSection` is rendered on a screen narrower than 640 px, THE HeroSection SHALL use `px-4` horizontal padding (not `px-20`).
2. WHEN `BentoGrid` is rendered on a screen narrower than 640 px, THE BentoGrid SHALL use `px-4` horizontal padding (not `px-20`).
3. WHEN `Footer` is rendered on a screen narrower than 640 px, THE Footer SHALL use `px-4` horizontal padding (not `px-20`).
4. WHILE the viewport is between 640 px and 1023 px, THE HeroSection, BentoGrid, and Footer SHALL use `sm:px-8` horizontal padding.
5. WHILE the viewport is 1024 px or wider, THE HeroSection, BentoGrid, and Footer SHALL use `lg:px-20` horizontal padding.

---

### Requirement 9: Responsiveness — Page-Specific Layout

**User Story:** As a mobile user browsing history and admin pages, I want tables and cards to adapt to small screens, so that all content is readable without horizontal overflow.

#### Acceptance Criteria

1. WHEN `PurchaseHistoryPage` is rendered on a screen narrower than 640 px, THE PurchaseHistoryPage SHALL stack order cards vertically with no horizontal overflow.
2. WHEN `BorrowingHistoryPage` is rendered on a screen narrower than 640 px, THE BorrowingHistoryPage SHALL wrap the borrowing table in an `overflow-x-auto` container so it scrolls horizontally.
3. WHEN `AdminManageBooksPage`, `AdminManageMoviesPage`, or `AdminManageElectronicsPage` are rendered on a 320 px screen, THE admin pages SHALL display the mobile card view and not clip or overflow the card content.

---

### Requirement 10: Animations — CSS Fixes

**User Story:** As a developer, I want animation class names to be consistent across CSS and JSX, so that animations work without runtime errors.

#### Acceptance Criteria

1. WHEN the Navbar profile dropdown is rendered, THE Navbar SHALL reference `animate-fade-in` (kebab-case) instead of `animate-fadeIn` (camelCase).
2. WHEN `index.css` is loaded, THE stylesheet SHALL define `.animate-fadeIn` as an alias pointing to the same `fadeIn` keyframe as `.animate-fade-in`, so legacy references continue to work.
3. WHEN `index.css` is loaded, THE stylesheet SHALL define a `.skeleton-shimmer` utility class with a `@keyframes shimmer` animation that produces a horizontal gradient sweep effect.

---

### Requirement 11: Animations — Page Entrance

**User Story:** As a user navigating the site, I want pages to fade or slide in smoothly on load, so that transitions feel polished rather than jarring.

#### Acceptance Criteria

1. WHEN any of the following pages finish mounting — `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ContactPage`, `WishlistPage`, `BorrowingHistoryPage`, `PurchaseHistoryPage`, `NotificationsPage`, `UserDashboardPage`, `SearchResultsPage`, `MovieRequestPage`, `BookConfirmPage`, `OrderConfirmationPage`, `ProductComparisonPage`, `AdminDashboardPage` — THE page container SHALL have the `animate-fade-in` class applied.

---

### Requirement 12: Animations — Staggered Grid Items

**User Story:** As a user browsing catalog pages, I want grid items to animate in sequentially, so that the page feels dynamic and alive.

#### Acceptance Criteria

1. WHEN `BookCenterPage` renders its list of book cards, THE BookCenterPage SHALL apply `style={{ animationDelay: \`${index * 0.05}s\` }}` to each card element.
2. WHEN `MovieCenterPage` renders its list of movie cards, THE MovieCenterPage SHALL apply `style={{ animationDelay: \`${index * 0.05}s\` }}` to each card element.
3. WHEN `ElectronicsPage` renders its list of product cards, THE ElectronicsPage SHALL apply `style={{ animationDelay: \`${index * 0.05}s\` }}` to each product card element.

---

### Requirement 13: Animations — Interactive Micro-Interactions

**User Story:** As a user interacting with cards and form inputs, I want subtle hover lift effects and smooth focus transitions, so that the interface feels responsive and high quality.

#### Acceptance Criteria

1. WHEN a user hovers over a clickable card that does not already have a translate transform on hover, THE card element SHALL apply `hover:-translate-y-1 transition-transform duration-200`.
2. WHEN a user focuses a form input in any page, THE input SHALL apply `transition-all duration-200` so the border/ring change is smooth.
3. WHEN a modal opens, THE modal container element SHALL have the `animate-slide-up` class so it slides up into view.
