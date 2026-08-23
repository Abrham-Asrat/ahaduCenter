// src/pages/MovieCenterPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../redux/slices/movieSlice';
import Navbar from '../components/common/Navbar';
import MovieHero from '../components/movie/MovieHero';
import SubNav from '../components/common/SubNav';
import MovieFilters from '../components/movie/MovieFilters';
import MovieCard from '../components/movie/MovieCard';
import Pagination from '../components/common/Pagination';
import Footer from '../components/common/Footer';

/**
 * MovieCenterPage Component
 *
 * Main page for the Movie Center module.
 * Wired to Redux store — dispatches fetchMovies on mount and on filter/tab/page change.
 */
const MovieCenterPage = () => {
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────────────────────────────
  const { movies, loading, error, pagination } = useSelector((s) => s.movie);

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    genres: [],
    contentType: 'All',
    searchQuery: '',
    country: 'All',
  });
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Build query params from local filter/tab state ───────────────────────────
  const buildParams = useCallback(() => {
    const params = { page: currentPage, limit: 12 };

    // Tab → API param mapping
    if (activeTab === 'Latest')         params.sort = 'latest';
    else if (activeTab === 'Trending')  params.sort = 'trending';
    else if (activeTab === 'Coming Soon') params.availability = 'Coming Soon';
    else if (activeTab === 'Featured')  params.featured = true;
    else if (activeTab === 'Recently Added') params.sort = 'newest';

    if (filters.searchQuery)                         params.search = filters.searchQuery;
    if (filters.country && filters.country !== 'All') params.country = filters.country;
    if (filters.contentType && filters.contentType !== 'All') params.type = filters.contentType;
    if (filters.genres && filters.genres.length > 0) params.genres = filters.genres.join(',');

    return params;
  }, [activeTab, filters, currentPage]);

  // ── Fetch on mount and whenever tab/filters/page change ──────────────────────
  useEffect(() => {
    dispatch(fetchMovies(buildParams()));
  }, [dispatch, buildParams]);

  // ── Control change handlers ──────────────────────────────────────────────────
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const catalogEl = document.getElementById('movie-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRetry = () => {
    dispatch(fetchMovies(buildParams()));
  };

  const handlePlayTrailer = (movie) => {
    setActiveTrailer(movie);
  };

  const handleToggleBookmark = (movie, isSaved) => {
    setBookmarkedIds((prev) =>
      isSaved ? [...prev, movie.id || movie._id] : prev.filter((id) => id !== (movie.id || movie._id))
    );
    showToast(
      isSaved
        ? `"${movie.title}" saved to Wishlist!`
        : `"${movie.title}" removed from Wishlist.`
    );
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  const SkeletonCard = () => (
    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden animate-pulse">
      <div className="w-full aspect-[2/3] bg-surface-container" />
      <div className="p-3.5 flex flex-col gap-2">
        <div className="h-4 bg-surface-container rounded w-3/4" />
        <div className="h-3 bg-surface-container rounded w-1/2" />
        <div className="h-6 bg-surface-container rounded mt-2" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative animate-fade-in">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-primary/40 animate-bounce">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Trailer Modal */}
      {activeTrailer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-surface-container rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">movie</span>
                <h3 className="text-xl font-bold text-white">{activeTrailer.title} - Official Trailer</h3>
              </div>
              <button
                onClick={() => setActiveTrailer(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="relative w-full pt-[56.25%] bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={activeTrailer.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title={activeTrailer.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow pt-[80px] pb-20 md:pb-0">
        <MovieHero />
        <SubNav onTabChange={handleTabChange} />

        <div id="movie-catalog" className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-6 flex justify-between items-center">
            <p className="text-sm text-on-surface-variant font-medium">
              {loading ? (
                <span className="inline-block w-28 h-4 bg-surface-container rounded animate-pulse" />
              ) : (
                <>
                  Showing <span className="text-white font-bold">{pagination.totalItems}</span> movies
                </>
              )}
            </p>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="bg-surface-container border border-white/10 px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 font-semibold"
            >
              <span className="material-symbols-outlined text-primary">tune</span>
              {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className={`${showMobileFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
              <MovieFilters onFilterChange={handleFilterChange} />
            </aside>

            {/* Catalog Grid */}
            <div className="flex-grow flex flex-col justify-between">
              <div>
                {/* Desktop results count */}
                <div className="hidden md:flex justify-between items-center mb-6">
                  <p className="text-sm text-on-surface-variant font-medium">
                    {loading ? (
                      <span className="inline-block w-36 h-4 bg-surface-container rounded animate-pulse" />
                    ) : (
                      <>
                        Showing <span className="text-white font-bold">{movies.length}</span> of{' '}
                        <span className="text-white font-bold">{pagination.totalItems}</span> results
                      </>
                    )}
                  </p>
                </div>

                {/* Error banner */}
                {error && (
                  <div className="glass-panel rounded-xl border border-red-500/30 bg-red-500/5 p-5 mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-400">error</span>
                      <p className="text-sm text-red-300">
                        {typeof error === 'string' ? error : 'Failed to load movies.'}
                      </p>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/40 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Loading skeleton */}
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : movies.length === 0 && !error ? (
                  /* Empty state */
                  <div className="glass-panel p-12 text-center rounded-2xl my-8">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
                    <h3 className="text-xl font-bold text-white mb-2">No Movies Found</h3>
                    <p className="text-on-surface-variant max-w-md mx-auto mb-6">
                      We couldn&apos;t find any movies matching your current filter criteria. Try clearing some filters.
                    </p>
                    <button
                      onClick={() => {
                        setFilters({ genres: [], contentType: 'All', searchQuery: '', country: 'All' });
                        setActiveTab('All');
                        setCurrentPage(1);
                      }}
                      className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  /* Movie grid */
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {movies.map((movie, index) => (
                      <div
                        key={movie._id || movie.id}
                        className="animate-fade-in hover:-translate-y-1 transition-transform duration-200"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <MovieCard
                          movie={movie}
                          onPlayTrailer={handlePlayTrailer}
                          onToggleBookmark={handleToggleBookmark}
                          isBookmarked={bookmarkedIds.includes(movie._id || movie.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!loading && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieCenterPage;
