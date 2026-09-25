// src/pages/BookCenterPage.jsx
import { useState, useEffect, useCallback } from 'react';
import MobileFilterButton from '../components/common/MobileFilterButton';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBooks } from '../redux/slices/bookSlice';
import Navbar from '../components/common/Navbar';
import SubNav from '../components/common/SubNav';
import Filters, { type FilterGroup, type FilterValues } from '../components/common/Filters';
import BookCard from '../components/book/BookCard';
import Pagination from '../components/common/Pagination';
import { useNavigate } from 'react-router-dom';
import type { Book, BookQuery } from '../types';

/**
 * BookCenterPage Component
 *
 * Main page for the Book Center module.
 * Wired to Redux store — dispatches fetchBooks on mount and on filter/page change.
 */
const BookCenterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ── Redux state ──────────────────────────────────────────────────────────────
  const { books, loading, error, pagination } = useAppSelector((s) => s.book);

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('All Categories');
  
  const [filterState, setFilterState] = useState<{
    searchQuery: string;
    availability: string[];
    format: string[];
    language: string;
  }>({
    searchQuery: '',
    availability: [],
    format: [],
    language: 'All Languages',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = [
    'All Categories',
    'Fiction',
    'History',
    'Biography',
    'Technology',
    'Business',
    'Science',
    'Language',
  ];

  const filterGroups: FilterGroup[] = [
    { key: 'availability', label: 'Availability', options: ['All', 'Available', 'Reserved'] },
    { key: 'language', label: 'Languages', options: ['All Languages', 'English', 'Amharic'] },
  ];

  // ── Build query params from local filter/sort state ──────────────────────────
  const buildParams = useCallback((): BookQuery => {
    const params: BookQuery = { page: currentPage, limit: 12 };

    if (activeCategory !== 'All Categories') params.category = activeCategory;
    if (filterState.searchQuery) params.q = filterState.searchQuery;
    if (filterState.availability.length > 0) params.availability = filterState.availability.join(',');
    if (filterState.language !== 'All Languages') params.language = filterState.language;
    if (filterState.format.length > 0) params.format = filterState.format.join(',');



    return params;
  }, [activeCategory, filterState,currentPage]);

  // ── Fetch on mount and whenever filters / page change ────────────────────────
  useEffect(() => {
    dispatch(fetchBooks(buildParams()));
  }, [dispatch, buildParams]);

  // Reset to page 1 when filters/sort change (but not when currentPage changes)
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilterState((prev) => ({
      ...prev,
      searchQuery: newFilters.searchQuery,
      availability: Array.isArray(newFilters.availability) ? newFilters.availability : [],
      language:
        Array.isArray(newFilters.language) && newFilters.language.length > 0
          ? newFilters.language[0] ?? 'All Languages'
          : 'All Languages',
    }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    dispatch(fetchBooks(buildParams()));
  };

  const handleQuickAction = (book: Book) => {
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
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-on-background flex flex-col relative animate-fade-in pb-20 md:pb-0">

        {/* Sub-navigation for categories */}

        <main className="mx-auto w-full max-w-7xl flex-grow px-3 pt-4 sm:px-6 sm:pt-6 lg:px-8 md:pb-8">
          {/* Hero banner compact */}
          <SubNav
            tabs={categories}
            onTabChange={handleCategoryChange}
          />

          {/* Main content: sidebar + grid */}
          <div className="flex min-w-0 flex-col gap-5 md:flex-row md:gap-8">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden md:block w-60 flex-shrink-0">
              <Filters
                groups={filterGroups}
                searchLabel="Search Title"
                searchPlaceholder="Search Books..."
                onFilterChange={handleFilterChange}
              />
            </aside>

            {/* Book grid area */}
            <div className="flex-1 pt-2">
              

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
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
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
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
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
        <MobileFilterButton
          onClick={() => setShowMobileFilters((visible) => !visible)}
        />

        {/* Mobile filter modal */}
        {showMobileFilters && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end animate-filter-backdrop" onClick={() => setShowMobileFilters(false)}>
            <div
              className="bg-background w-full rounded-t-2xl p-6 border-t border-white/10 max-h-[85vh] overflow-y-auto animate-filter-sheet"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Filter Books</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-on-surface-variant hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <Filters
                groups={filterGroups}
                searchLabel="Search Title"
                searchPlaceholder="Search Books..."
                onFilterChange={handleFilterChange}
              />
              <button
                className="w-full mt-6 bg-primary text-black font-bold py-3 rounded-xl uppercase text-xs tracking-wider"
                onClick={() => setShowMobileFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

      </div>

    </>
  );
};

export default BookCenterPage;
