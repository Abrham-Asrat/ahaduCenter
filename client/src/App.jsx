import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieCenterPage from './pages/MovieCenterPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ElectronicsPage from './pages/ElectronicsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BookCenterPage from './pages/BookCenterPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import SearchResultsPage from './pages/SearchResultsPage';
import WishlistPage from './pages/WishlistPage';
import ContactPage from './pages/ContactPage';
import AdminManageMoviesPage from './pages/admin/AdminManageMoviesPage';
import AdminManageElectronicsPage from './pages/admin/AdminManageElectronicsPage';
import AdminManageBooksPage from './pages/admin/AdminManageBooksPage';

import DesignSystemPage from './pages/DesignSystemPage';
import ProductComparisonPage from './pages/ProductComparisonPage';
import MovieRequestPage from './pages/MovieRequestPage';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage';
import BorrowingHistoryPage from './pages/BorrowingHistoryPage';
import BookConfirmPage from './pages/BookConfirmPage';
import NotificationsPage from './pages/NotificationsPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MovieCenterPage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/electronics" element={<ElectronicsPage />} />
        <Route path="/electronics/:id" element={<ProductDetailPage />} />
        <Route path="/books" element={<BookCenterPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin routes — require admin role */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/movies" element={<AdminManageMoviesPage />} />
          <Route path="/admin/books" element={<AdminManageBooksPage />} />
          <Route path="/admin/electronics" element={<AdminManageElectronicsPage />} />
        </Route>

        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/compare" element={<ProductComparisonPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />

        {/* Protected routes — require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<UserDashboardPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
          <Route path="/borrowing-history" element={<BorrowingHistoryPage />} />
          <Route path="/movie-request" element={<MovieRequestPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/book-confirm" element={<BookConfirmPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;