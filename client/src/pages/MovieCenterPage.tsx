// src/pages/MovieCenterPage.jsx
import { useState, useEffect, useCallback } from 'react';
import MobileFilterButton from '../components/common/MobileFilterButton';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMovies } from '../redux/slices/movieSlice';
import Navbar from '../components/common/Navbar';
import SubNav from '../components/common/SubNav';
import Filters, { type FilterGroup, type FilterValues } from '../components/common/Filters';
import MovieCard from '../components/movie/MovieCard';
import Pagination from '../components/common/Pagination';
import type { Movie, MovieQuery } from '../types';
import type { ChangeEvent } from 'react';

/**
 * MovieCenterPage Component
 *
 * Main page for the Movie Center module.
 * Wired to Redux store — dispatches fetchMovies on mount and on filter/tab/page change.
 */
const MovieCenterPage = () => {
  const dispatch = useAppDispatch();

  // ── Redux state ──────────────────────────────────────────────────────────────
  const { movies, loading, error, pagination } = useAppSelector((s) => s.movie);

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<{ genres: string[]; contentType: string; searchQuery: string; country: string }>({
    genres: [],
    contentType: 'All',
    searchQuery: '',
    country: 'All',
  });
  const [activeTab, setActiveTab] = useState('All');
  const [sortOption, setSortOption] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [, setActiveTrailer] = useState<Movie | null>(null);
  const [, setToastMessage] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const filterGroups: FilterGroup[] = [
    { key: 'genres', label: 'Genre', options: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Adventure'], multiSelect: true },
    { key: 'country', label: 'Country', options: ['All', 'Ethiopia', 'USA', 'UK', 'Korea', 'Japan'] },
    { key: 'contentType', label: 'Content Type', options: ['All', 'Movie', 'TV Series'] },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Build query params from local filter/tab state ───────────────────────────
  const buildParams = useCallback((): MovieQuery => {
    const params: MovieQuery = { page: currentPage, limit: 12 };

    // Tab → API param mapping
    if (sortOption === 'High Rated') params.sort = 'rating';
    else if (sortOption === 'Oldest') params.sort = 'oldest';
    else if (activeTab === 'Latest') params.sort = 'latest';
    else if (activeTab === 'Trending') params.sort = 'trending';
    else if (activeTab === 'Coming Soon') params.availability = 'Coming Soon';
    else if (activeTab === 'Featured') params.featured = true;
    else if (activeTab === 'Recently Added') params.sort = 'newest';
    else params.sort = 'newest';

    if (filters.searchQuery) params.q = filters.searchQuery;
    if (filters.country && filters.country !== 'All') params.country = filters.country;
    if (filters.genres && filters.genres.length > 0) params.genre = filters.genres.join(',');
    if (filters.contentType && filters.contentType !== 'All') params.contentType = filters.contentType;

    return params;
  }, [activeTab, filters, sortOption, currentPage]);

  // ── Fetch on mount and whenever tab/filters/page change ──────────────────────
  useEffect(() => {
    dispatch(fetchMovies(buildParams()));
  }, [dispatch, buildParams]);

  // ── Control change handlers ──────────────────────────────────────────────────
  const handleFilterChange = (newFilters: FilterValues) => {
    const contentType = Array.isArray(newFilters.contentType)
      ? newFilters.contentType[0] ?? 'All'
      : 'All';
    const country = Array.isArray(newFilters.country) ? newFilters.country[0] ?? 'All' : 'All';
    setFilters({
      genres: Array.isArray(newFilters.genres) ? newFilters.genres : [],
      contentType,
      searchQuery: newFilters.searchQuery,
      country,
    });
    setCurrentPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const catalogEl = document.getElementById('movie-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRetry = () => {
    dispatch(fetchMovies(buildParams()));
  };

  const handlePlayTrailer = (movie: Movie) => {
    setActiveTrailer(movie);
  };

  const handleToggleBookmark = (movie: Movie, isSaved: boolean) => {
    const movieId = movie.id || movie._id || '';
    setBookmarkedIds((prev) =>
      isSaved ? [...prev, movieId] : prev.filter((id) => id !== movieId)
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
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-on-surface flex flex-col relative animate-fade-in">

        {/* Toast Notification */}
        {/* {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-primary/40 animate-bounce">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )} */}

        {/* Trailer Modal */}
        {/* {activeTrailer && (
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
      )} */}

        {/* <main className="flex-grow md:pb-0"> */}
        <main className="mx-auto w-full max-w-7xl flex-grow px-3 pt-4 sm:px-6 sm:pt-6 lg:px-8 md:pb-8">
          <SubNav onTabChange={handleTabChange} />
          <div className="flex min-w-0 flex-col gap-5 md:flex-row md:gap-8">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden md:block w-60 flex-shrink-0">
              <Filters
                groups={filterGroups}
                searchLabel="Search Title"
                searchPlaceholder="Search movies..."
                onFilterChange={handleFilterChange}
              />
            </aside>

            {/* Catalog Grid */}
            <div className="flex-grow flex flex-col justify-between pt-20">
              <div>
                {/* Desktop results count */}
                <div className="fixed inset-x-3 top-[150px] z-20 hidden items-center justify-between rounded-xl border border-white/10 bg-background/95 p-4 glass-panel backdrop-blur-md md:flex lg:left-[calc(50%-208px)] lg:right-8 xl:left-[calc(50%-336px)] xl:right-[calc(50%-640px)]">
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
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-on-surface-variant font-medium">Sort by:</span>
                    <select value={sortOption} onChange={handleSortChange} className="cursor-pointer rounded-lg border border-white/10 bg-background py-1.5 pl-3 pr-8 text-sm font-semibold text-primary outline-none">
                      <option>Newest</option>
                      <option>Oldest</option>
                      <option>High Rated</option>
                    </select>
                  </div>
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
                          isBookmarked={bookmarkedIds.includes(movie._id || movie.id || '')}
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

        </main>

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

export default MovieCenterPage;
