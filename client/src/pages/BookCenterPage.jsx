// src/pages/BookCenterPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/slices/bookSlice';
import Navbar from '../components/common/Navbar';
import SubNav from '../components/common/SubNav';
import BookFilters from '../components/book/BookFilters';
import BookCard from '../components/book/BookCard';
import Pagination from '../components/common/Pagination';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

/**
 * BookCenterPage Component
 *
 * Main page for the Book Center module.
 * Wired to Redux store — dispatches fetchBooks on mount and on filter/page change.
 */
const BookCenterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Redux state ──────────────────────────────────────────────────────────────
  const { books, loading, error, pagination } = useSelector((s) => s.book);

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [sortOption, setSortOption] = useState('Newest Arrivals');
  const [filterState, setFilterState] = useState({
    searchQuery: '',
    availability: [],
    format: [],
    language: 'All Languages',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = [
    'All Categories',
    'Education',
    'Technology',
    'Business',
    'Science',
    'Arts & Humanities',
  ];

  // ── Build query params from local filter/sort state ──────────────────────────
  const buildParams = useCallback(() => {
    const params = { page: currentPage, limit: 12 };

    if (activeCategory !== 'All Categories') params.category = activeCategory;
    if (filterState.searchQuery) params.search = filterState.searchQuery;
    if (filterState.availability.length === 1) params.availability = filterState.availability[0].toLowerCase();
    if (filterState.language !== 'All Languages') params.language = filterState.language;
    if (filterState.format.length === 1) params.format = filterState.format[0];

    // Map UI sort labels to API sort values
    if (sortOption === 'Highest Rated') params.sort = 'rating';
    else if (sortOption === 'Most Popular') params.sort = 'popular';
    else params.sort = 'newest';

    return params;
  }, [activeCategory, filterState, sortOption, currentPage]);

  // ── Fetch on mount and whenever filters / page change ────────────────────────
  useEffect(() => {
    dispatch(fetchBooks(buildParams()));
  }, [dispatch, buildParams]);

  // Reset to page 1 when filters/sort change (but not when currentPage changes)
  const handleFilterChange = (newFilters) => {
    setFilterState((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    dispatch(fetchBooks(buildParams()));
  };

  const handleQuickAction = (book) => {
    if (book.availability === 'available') {
      navigate(`/book-confirm?action=borrow&id=${book._id || book.id}`);
    } else if (book.availability === 'reserved' || book.availability === 'borrowed') {
      navigate(`/book-confirm?action=reserve&id=${book._id || book.id}`);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  const SkeletonCard = () => (
    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-surface-container" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-surface-container rounded w-3/4" />
        <div className="h-3 bg-surface-container rounded w-1/2" />
        <div className="h-8 bg-surface-container rounded mt-2" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col relative animate-fade-in">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sub-navigation for categories */}
      <div className="pt-20">
        <SubNav
          tabs={categories}
          onTabChange={handleCategoryChange}
        />
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-6 pt-8 pb-20 md:pb-8">
        {/* Hero banner compact */}
        <div className="relative w-full rounded-2xl overflow-hidden glass-panel p-8 border border-white/10 flex items-center justify-between min-h-[160px] mb-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5 opacity-50" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
          <div className="relative z-10 max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Book Center <span className="text-primary border-b-2 border-secondary pb-1 inline-block">Collection</span>
            </h1>
            <p className="text-on-surface-variant text-sm">
              Explore thousands of premium titles across technical, educational, and creative disciplines.
            </p>
          </div>
          <div className="relative z-10 hidden lg:block">
            <span className="material-symbols-outlined text-6xl text-white/10">auto_stories</span>
          </div>
        </div>

        {/* Main content: sidebar + grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden md:block w-60 flex-shrink-0">
            <BookFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Book grid area */}
          <div className="flex-1">
            {/* Grid controls */}
            <div className="flex justify-between items-center glass-panel p-3.5 rounded-xl border border-white/10 mb-6">
              <span className="text-sm text-on-surface-variant font-medium">
                {loading ? (
                  <span className="inline-block w-32 h-4 bg-surface-container rounded animate-pulse" />
                ) : (
                  <>
                    Showing <strong className="text-white">{books.length}</strong> of{' '}
                    <strong className="text-white">{pagination.totalItems}</strong> titles
                  </>
                )}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-on-surface-variant font-medium">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="bg-background border border-white/10 text-sm text-primary rounded-lg py-1 px-3 outline-none cursor-pointer font-semibold"
                >
                  <option>Newest Arrivals</option>
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="glass-panel rounded-xl border border-red-500/30 bg-red-500/5 p-5 mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-400">error</span>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/40 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Book grid — skeleton while loading */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : books.length === 0 && !error ? (
              <div className="glass-panel rounded-2xl p-12 text-center border border-white/10 my-8">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-3">
                  menu_book
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">No Books Found</h3>
                <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any books matching your selected filters.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('All Categories');
                    setFilterState({ searchQuery: '', availability: [], format: [], language: 'All Languages' });
                    setCurrentPage(1);
                  }}
                  className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all text-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {books.map((book, index) => (
                    <div
                      key={book._id || book.id}
                      className="animate-fade-in hover:-translate-y-1 transition-transform duration-200"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <BookCard book={book} onQuickAction={handleQuickAction} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile floating filter button */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-black font-bold shadow-2xl flex items-center justify-center gap-2 border border-primary/50"
        onClick={() => setShowMobileFilters(true)}
      >
        <span className="material-symbols-outlined">tune</span>
        <span className="text-xs uppercase tracking-wider font-extrabold">Filters</span>
      </button>

      {/* Mobile filter modal */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end">
          <div className="bg-background w-full rounded-t-2xl p-6 border-t border-white/10 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Filter Books</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <BookFilters onFilterChange={handleFilterChange} />
            <button
              className="w-full mt-6 bg-primary text-black font-bold py-3 rounded-xl uppercase text-xs tracking-wider"
              onClick={() => setShowMobileFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookCenterPage;
