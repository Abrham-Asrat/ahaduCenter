# Implementation Plan: Complete i18n Component Translations

## Overview

This plan systematically translates all 70 remaining React components in the AhaduCenter application to support full bilingual functionality (English and Amharic). The implementation builds on existing i18n infrastructure with 352 pre-defined translation keys, following a priority-based approach starting with critical user flows (home, authentication) before moving to feature-specific components (movies, books, electronics) and administrative interfaces.

## Tasks

- [x] 1. Validate existing i18n infrastructure
  - Verify i18n configuration in src/i18n/config.ts is operational
  - Run `npm run validate:i18n` to confirm 352 keys exist in both en.json and am.json
  - Verify language detection flow (localStorage → navigator.language → 'en' fallback)
  - Confirm Redux languageSlice integration is functional
  - Document any missing translation keys that need to be added
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Translate Home Page components (Priority 2)
  - [x] 2.1 Translate HomeHero.tsx
    - Import and setup useTranslation hook
    - Replace hero section text with translation keys from "home.hero.*" namespace
    - Translate CTA button labels (Explore Catalog, Sign Up Free)
    - Verify badge and subtitle text uses translation keys
    - _Requirements: 2.1, 2.7_
  
  - [x] 2.2 Translate HomeStats.tsx
    - Import useTranslation hook
    - Replace all stat labels with "home.stats.*" keys
    - Translate section header
    - Handle number formatting if needed
    - _Requirements: 2.2_
  
  - [x] 2.3 Translate HomeCategories.tsx
    - Import useTranslation hook
    - Replace category names and descriptions with "home.categories.*" keys
    - Translate "View All" links and section headers
    - Verify department labels use translation keys
    - _Requirements: 2.3_
  
  - [x] 2.4 Translate HomeFeatured.tsx
    - Import useTranslation hook
    - Replace featured section headers with "home.featured.*" keys
    - Translate navigation labels and "See More" buttons
    - Handle empty states if present
    - _Requirements: 2.4_
  
  - [x] 2.5 Translate HomeTestimonials.tsx
    - Import useTranslation hook
    - Replace section header with "home.testimonials.*" keys
    - Translate navigation button aria-labels for accessibility
    - Note: Testimonial content itself is dynamic and not translated
    - _Requirements: 2.5_

- [~] 3. Checkpoint - Verify home page translations
  - Switch between English and Amharic using language switcher
  - Verify all home page text changes correctly
  - Check for layout issues (text overflow, alignment)
  - Run validation script: `npm run validate:i18n`
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Translate Authentication components (Priority 3)
  - [x] 4.1 Translate LoginPage.tsx
    - Import useTranslation hook
    - Replace page title and form labels with "auth.login.*" keys
    - Translate input placeholders (email, password)
    - Translate button labels (Sign In, Forgot Password)
    - Translate error messages and link text
    - Translate social login button text (Sign in with Google)
    - Add aria-labels for accessibility
    - _Requirements: 3.1, 3.6, 3.7_
  
  - [x] 4.2 Translate RegisterPage.tsx
    - Import useTranslation hook
    - Replace all form labels with "auth.register.*" keys
    - Translate input placeholders
    - Translate password strength indicators
    - Translate terms and conditions checkbox text
    - Translate submit button and validation messages
    - Translate login link text
    - _Requirements: 3.2, 3.6, 3.7_
  
  - [x] 4.3 Translate ForgotPasswordPage.tsx
    - Import useTranslation hook
    - Replace page title with "auth.forgotPassword.*" keys
    - Translate instructions text
    - Translate email input label and placeholder
    - Translate submit button and success/error messages
    - Translate "Back to login" link
    - _Requirements: 3.3, 3.8_
  
  - [x] 4.4 Translate VerifyEmailPage.tsx
    - Import useTranslation hook
    - Replace page title with "auth.verifyEmail.*" keys
    - Translate verification status messages
    - Translate action buttons (Resend Email, Go to Login)
    - Translate error messages
    - _Requirements: 3.4_
  
  - [x] 4.5 Translate AdminLoginPage.tsx
    - Import useTranslation hook
    - Replace admin login title with "auth.adminLogin.*" keys
    - Translate all form elements similar to LoginPage
    - Translate admin-specific messaging
    - _Requirements: 3.5, 3.7_

- [~] 5. Checkpoint - Verify authentication flow translations
  - Test login, registration, and password reset flows in both languages
  - Verify all error messages display in the active language
  - Check accessibility (screen reader compatibility)
  - Run validation script: `npm run validate:i18n`
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Translate Movie feature components (Priority 4)
  - [x] 6.1 Translate MovieCard.tsx
    - Import useTranslation hook
    - Replace metadata labels with "movies.card.*" keys (Duration, Genre, Rating)
    - Translate action buttons (Request Movie, View Details)
    - Translate status badges (Available, Requested)
    - _Requirements: 4.1, 4.7, 4.8_
  
  - [x] 6.2 Translate MovieFilters.tsx
    - Import useTranslation hook
    - Replace filter section headers with "movies.filters.*" keys
    - Translate filter options (if hardcoded)
    - Translate "Clear Filters" and "Apply" buttons
    - Translate sort options (Latest, Most Popular, Title A-Z)
    - _Requirements: 4.3, 4.7_
  
  - [x] 6.3 Translate MovieCenterPage.tsx
    - Import useTranslation hook
    - Replace page title with "movies.center.*" keys
    - Translate section headers (Featured Movies, New Releases)
    - Translate empty state message (No movies available)
    - Translate search placeholder
    - Translate breadcrumb navigation
    - _Requirements: 4.4_
  
  - [x] 6.4 Translate MovieDetailPage.tsx
    - Import useTranslation hook
    - Replace tab labels with "movies.detail.*" keys
    - Translate metadata labels (Director, Release Year, Duration, Language)
    - Translate action buttons (Request, Add to Wishlist, Share)
    - Translate review section headers
    - _Requirements: 4.5_
  
  - [x] 6.5 Translate MovieDetailHero.tsx
    - Import useTranslation hook
    - Replace hero section content with "movies.detail.*" keys
    - Translate any overlay text or labels
    - _Requirements: 4.2_
  
  - [x] 6.6 Translate MovieInfoSidebar.tsx and CastSection.tsx
    - Import useTranslation hook in both components
    - Replace sidebar metadata labels with "movies.detail.*" keys
    - Translate cast section header
    - _Requirements: 4.2, 4.5_
  
  - [x] 6.7 Translate RelatedMoviesCarousel.tsx
    - Import useTranslation hook
    - Replace carousel header with "movies.detail.*" keys
    - Translate navigation aria-labels
    - _Requirements: 4.2_
  
  - [x] 6.8 Translate MovieRequestPage.tsx
    - Import useTranslation hook
    - Replace form fields with "movies.request.*" keys
    - Translate instructions and submit button
    - Translate success/error messages
    - _Requirements: 4.6_

- [~] 7. Checkpoint - Verify movie feature translations
  - Browse movies and apply filters in both languages
  - View movie details and request a movie in both languages
  - Verify all metadata and buttons display correctly
  - Run validation script: `npm run validate:i18n`
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Translate Book feature components (Priority 5)
  - [x] 8.1 Translate BookCard.tsx
    - Import useTranslation hook
    - Replace author label with "books.card.*" keys (By)
    - Translate availability status (Available, Borrowed)
    - Translate action buttons (Borrow, View Details)
    - _Requirements: 5.1_
  
  - [x] 8.2 Translate BookCoverCard.tsx
    - Import useTranslation hook
    - Replace overlay text with "books.card.*" keys
    - _Requirements: 5.2_
  
  - [-] 8.3 Translate BookFilters.tsx
    - Import useTranslation hook
    - Replace filter categories with "books.filters.*" keys
    - Translate Clear/Apply buttons
    - Translate sort options
    - _Requirements: 5.4_
  
  - [x] 8.4 Translate BookCenterPage.tsx
    - Import useTranslation hook
    - Replace page title with "books.center.*" keys
    - Translate section headers and navigation
    - Translate empty state messages
    - Translate search placeholder
    - _Requirements: 5.5_
  
  - [x] 8.5 Translate BookDetailPage.tsx
    - Import useTranslation hook
    - Replace book information labels with "books.detail.*" keys
    - Translate action buttons
    - Translate tabs if present
    - _Requirements: 5.6_
  
  - [-] 8.6 Translate BookInfoSection.tsx and BookDetailTabs.tsx
    - Import useTranslation hook in both components
    - Replace details and tab labels with "books.detail.*" keys
    - _Requirements: 5.3_
  
  - [x] 8.7 Translate RelatedBooks.tsx
    - Import useTranslation hook
    - Replace section header with "books.detail.*" keys
    - _Requirements: 5.3_
  
  - [-] 8.8 Translate BookConfirmPage.tsx
    - Import useTranslation hook
    - Replace confirmation details with "books.confirm.*" keys
    - Translate action buttons
    - _Requirements: 5.7_
  
  - [-] 8.9 Translate BorrowingHistoryPage.tsx
    - Import useTranslation hook
    - Replace page title with "books.history.*" keys
    - Translate table headers (Book Title, Borrowed Date, Return Date, Status)
    - Translate status values (Active, Returned, Overdue)
    - Translate empty state (No borrowing history)
    - Translate filter options (All, Active, Returned)
    - Add date formatting using formatShortDate utility
    - _Requirements: 5.8, 15.1, 15.2, 15.3_

- [~] 9. Checkpoint - Verify book feature translations
  - Browse books and apply filters in both languages
  - Borrow a book and view borrowing history in both languages
  - Verify dates are formatted correctly for each locale
  - Run validation script: `npm run validate:i18n`
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Translate Electronics feature components (Priority 6)
  - [x] 10.1 Translate ProductCard.tsx
    - Import useTranslation hook
    - Replace price label with "electronics.card.*" keys
    - Translate stock status (In Stock, Out of Stock)
    - Translate action buttons (Add to Cart, View Details)
    - Translate discount badge (Sale)
    - _Requirements: 6.1_
  
  - [x] 10.2 Translate ElectronicsFilters.tsx
    - Import useTranslation hook
    - Replace filter options with "electronics.filters.*" keys
    - _Requirements: 6.3_
  
  - [x] 10.3 Translate ElectronicsPage.tsx
    - Import useTranslation hook
    - Replace page title with "electronics.page.*" keys
    - Translate category tabs (All, Laptops, Phones, Accessories)
    - Translate sort options and banner text
    - _Requirements: 6.4_
  
  - [x] 10.4 Translate ProductDetailPage.tsx
    - Import useTranslation hook
    - Replace tabs and labels with "electronics.detail.*" keys
    - Translate purchase actions
    - _Requirements: 6.5_
  
  - [x] 10.5 Translate ProductInfo.tsx, ProductGallery.tsx, and ProductSpecs.tsx
    - Import useTranslation hook in all three components
    - Replace spec labels with "electronics.specs.*" keys
    - Translate spec section title (Technical Specifications)
    - Translate spec labels (Brand, Model, Warranty, Color, Weight, Dimensions)
    - _Requirements: 6.2, 6.8_
  
  - [x] 10.6 Translate SimilarProducts.tsx
    - Import useTranslation hook
    - Replace recommendation header with "electronics.detail.*" keys
    - _Requirements: 6.9_
  
  - [-] 10.7 Translate ProductComparisonPage.tsx
    - Import useTranslation hook
    - Replace comparison criteria with "electronics.comparison.*" keys
    - Translate all comparison labels
    - _Requirements: 6.6_
  
  - [-] 10.8 Translate OrderConfirmationPage.tsx
    - Import useTranslation hook
    - Replace page title with "electronics.orderConfirmation.*" keys
    - Translate success message
    - Translate order details labels (Order Number, Date, Total Amount)
    - Translate action buttons (View Order, Continue Shopping)
    - Translate email notification message
    - Add date formatting using formatShortDate utility
    - _Requirements: 6.7, 15.1_

- [~] 11. Checkpoint - Verify electronics feature translations
  - Browse products and view specifications in both languages
  - Complete order flow and view confirmation in both languages
  - Verify all labels and actions display correctly
  - Run validation script: `npm run validate:i18n`
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Translate Common components (Priority 7)
  - [x] 12.1 Translate ReviewsCommentsSection.tsx
    - Import useTranslation hook
    - Replace section header with "reviews.*" keys
    - Translate sort options (Most Recent, Highest Rated)
    - Translate action buttons (Write Review, Load More)
    - Translate empty state (No reviews yet. Be the first to review!)
    - Translate review form labels (Rating, Comment, Submit)
    - _Requirements: 7.1_
  
  - [x] 12.2 Translate Pagination.tsx
    - Import useTranslation hook
    - Replace navigation labels with "common.pagination.*" keys
    - Translate page info (Page {{current}} of {{total}})
    - Add aria-labels (Go to page {{page}}, Previous page, Next page)
    - _Requirements: 7.2_
  
  - [x] 12.3 Translate Filters.tsx and SortingFilter.tsx
    - Import useTranslation hook in both components
    - Replace filter controls with "filters.*" keys
    - Translate sort label (Sort by)
    - Translate sort options (Newest First, Oldest First, Name A-Z, Name Z-A, Price Low to High, Price High to Low)
    - _Requirements: 7.3, 7.4_
  
  - [x] 12.4 Translate MobileFilterButton.tsx
    - Import useTranslation hook
    - Replace button label with "filters.mobileButton.*" keys
    - Translate active filter count ({{count}} active)
    - Add aria-label (Open filters)
    - _Requirements: 7.3_
  
  - [x] 12.5 Translate SubNav.tsx and HeroSection.tsx
    - Import useTranslation hook in both components
    - Replace navigation and hero text with appropriate namespace keys
    - Handle any breadcrumb navigation
    - _Requirements: 7.5_
  
  - [x] 12.6 Translate BentoGrid.tsx
    - Import useTranslation hook
    - Replace any grid labels or empty states
    - _Requirements: 7.5_
  
  - [x] 12.7 Translate ScrollToTop.tsx
    - Import useTranslation hook
    - Add aria-label for button (Scroll to top)
    - Add title attribute if present
    - _Requirements: 7.5_

- [ ] 13. Translate Dashboard and User pages (Priority 8)
  - [-] 13.1 Translate UserDashboardPage.tsx
    - Import useTranslation hook and useSelector for language
    - Replace welcome message with "dashboard.*" keys (Welcome back, {{name}}!)
    - Translate section headers (Recent Activity, Quick Actions, Your Statistics)
    - Translate quick action labels (Borrow Book, Request Movie, Browse Electronics)
    - Translate stats labels (Books Borrowed, Movies Watched, Orders Placed)
    - Translate empty state (No recent activity)
    - Add date formatting for recent activity timestamps
    - _Requirements: 8.1, 8.5, 15.1, 15.2_
  
  - [-] 13.2 Translate WishlistPage.tsx
    - Import useTranslation hook
    - Replace page title with "wishlist.*" keys
    - Translate tab labels (All, Movies, Books, Electronics)
    - Translate action buttons (Remove, Move to Cart)
    - Translate empty state (Your wishlist is empty)
    - Translate item count ({{count}} items)
    - _Requirements: 8.2, 8.6_
  
  - [-] 13.3 Translate NotificationsPage.tsx
    - Import useTranslation hook and useSelector for language
    - Replace page title with "notifications.*" keys
    - Translate filter tabs (All, Unread, Read)
    - Translate action buttons (Mark as Read, Delete)
    - Translate empty state (No notifications)
    - Translate time labels (Just now, {{count}} hours ago, {{count}} days ago)
    - Add date formatting for notification timestamps
    - _Requirements: 8.3, 15.1, 15.2_
  
  - [x] 13.4 Translate ContactPage.tsx
    - Import useTranslation hook
    - Replace form fields with "contact.*" keys
    - Translate instructions and submit button
    - Translate success/error messages
    - _Requirements: 8.4_

- [~] 14. Checkpoint - Verify dashboard translations
  - View dashboard and wishlist in both languages
  - Check notifications and contact form in both languages
  - Verify date/time formatting is locale-aware
  - Run validation script: `npm run validate:i18n`
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Translate Admin interface components (Priority 9)
  - [~] 15.1 Translate AdminDashboardPage.tsx
    - Import useTranslation hook
    - Replace dashboard title with "admin.dashboard.*" keys
    - Translate metric labels (Total Users, Active Requests, Revenue, Pending Approvals)
    - Translate section headers (Recent Orders, Popular Items, User Activity)
    - Translate action buttons (View All, Export Report)
    - _Requirements: 9.1, 9.6_
  
  - [~] 15.2 Translate AdminManageMoviesPage.tsx
    - Import useTranslation hook
    - Replace page title with "admin.movies.*" keys
    - Translate table headers (Title, Genre, Year, Status, Requests, Actions)
    - Translate action buttons (Add Movie, Edit, Delete, Approve Request)
    - Translate status badges (Active, Inactive, Pending)
    - Translate search placeholder (Search movies...)
    - Translate confirmation dialogs (Are you sure you want to delete this movie?)
    - _Requirements: 9.2, 9.6, 9.7_
  
  - [~] 15.3 Translate AdminManageBooksPage.tsx
    - Import useTranslation hook
    - Replace page title with "admin.books.*" keys
    - Translate table headers (book-specific fields)
    - Translate action buttons and confirmation dialogs
    - Translate search placeholder
    - _Requirements: 9.3, 9.6, 9.7_
  
  - [~] 15.4 Translate AdminManageElectronicsPage.tsx
    - Import useTranslation hook
    - Replace page title with "admin.electronics.*" keys
    - Translate table headers (product-specific fields)
    - Translate action buttons and confirmation dialogs
    - Translate search placeholder
    - _Requirements: 9.4, 9.6, 9.7_
  
  - [~] 15.5 Translate AdminLayout.tsx
    - Import useTranslation hook
    - Replace admin navigation with "admin.*" keys
    - Translate all admin header text
    - _Requirements: 9.5_

- [ ] 16. Translate Utility pages (Priority 10)
  - [~] 16.1 Translate SearchResultsPage.tsx
    - Import useTranslation hook
    - Replace page title with "search.*" keys
    - Translate result count ({{count}} results for '{{query}}')
    - Translate no results message (No results found for '{{query}}')
    - Translate suggestions (Try different keywords or browse categories)
    - Translate filter section title (Refine Results)
    - Translate sort options
    - _Requirements: 10.1, 10.4_
  
  - [~] 16.2 Translate NotFoundPage.tsx
    - Import useTranslation hook
    - Replace error code and main message with "errors.notFound.*" keys
    - Translate description (The page you're looking for doesn't exist or has been moved)
    - Translate action buttons (Go Home, Browse Movies, Browse Books)
    - _Requirements: 10.2_
  
  - [~] 16.3 Handle loading and error states across all components
    - Verify all loading states use "common.loading" keys
    - Verify all error states use "errors.*" namespace keys
    - Add missing error message translations
    - _Requirements: 10.3, 10.4, 10.5, 7.6, 7.7_

- [~] 17. Final validation and quality assurance
  - Run validation script: `npm run validate:i18n` to verify key structure consistency
  - Verify all 352 translation keys are used correctly across components
  - Check for any remaining hardcoded strings using grep/search
  - Test language switching across all major user flows
  - Verify accessibility attributes are properly translated
  - Check for layout issues in both languages
  - Document any new translation keys that were added
  - Update I18N_IMPLEMENTATION_REPORT.md with final statistics
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 18.1, 18.2, 18.3, 18.4, 18.5_

- [~] 18. Final checkpoint - Complete testing
  - Perform end-to-end testing in English
  - Perform end-to-end testing in Amharic
  - Verify all critical user flows (auth, browsing, ordering, admin) work in both languages
  - Verify date and number formatting is correct for each locale
  - Run full regression test suite
  - Verify bundle size is acceptable
  - Ensure all tests pass, confirm with user that implementation is complete.

## Notes

- All components already have translation keys defined in en.json and am.json (352 keys total)
- No new translation keys should be created unless absolutely necessary
- All components should use the `useTranslation()` hook pattern
- Date formatting should use `formatShortDate` or `formatLongDate` from `@/utils/i18nFormat`
- Accessibility attributes (aria-label, title) must also be translated
- Components should maintain existing functionality, props, and styling
- Checkpoint tasks provide natural breaks to verify work and catch issues early
- Dynamic content from databases (movie titles, book descriptions) should NOT be translated in components
- Focus on translating only UI labels, buttons, placeholders, and error messages

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"] },
    { "id": 2, "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5"] },
    { "id": 3, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5"] },
    { "id": 4, "tasks": ["6.6", "6.7", "6.8"] },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5"] },
    { "id": 6, "tasks": ["8.6", "8.7", "8.8", "8.9"] },
    { "id": 7, "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5"] },
    { "id": 8, "tasks": ["10.6", "10.7", "10.8"] },
    { "id": 9, "tasks": ["12.1", "12.2", "12.3", "12.4", "12.5"] },
    { "id": 10, "tasks": ["12.6", "12.7"] },
    { "id": 11, "tasks": ["13.1", "13.2", "13.3", "13.4"] },
    { "id": 12, "tasks": ["15.1", "15.2", "15.3", "15.4", "15.5"] },
    { "id": 13, "tasks": ["16.1", "16.2", "16.3"] },
    { "id": 14, "tasks": ["17"] }
  ]
}
```
