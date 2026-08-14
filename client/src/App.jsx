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

function App() {
  return (
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
      <Route path="/account" element={<UserDashboardPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
    </Routes>
  );
}

export default App;