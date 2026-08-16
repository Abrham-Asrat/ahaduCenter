import React, { useState, useMemo } from 'react';
import Navbar from '../components/common/Navbar';
import MovieHero from '../components/movie/MovieHero';
import SubNav from '../components/common/SubNav';
import MovieFilters from '../components/movie/MovieFilters';
import MovieCard from '../components/movie/MovieCard';
import Pagination from '../components/common/Pagination';
import Footer from '../components/common/Footer';

const ALL_MOVIES = [
  {
    id: 1,
    title: 'Echoes of Eden',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    rating: 8.8,
    quality: '4K',
    availability: 'Available',
    genres: ['Sci-Fi', 'Adventure'],
    year: 2024,
    country: 'Ethiopia',
    type: 'Movie',
    tab: 'Featured',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 2,
    title: 'Neon Drifters',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    rating: 7.9,
    quality: 'HD',
    availability: 'Coming Soon',
    genres: ['Action', 'Thriller'],
    year: 2023,
    country: 'USA',
    type: 'Movie',
    tab: 'Coming Soon',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 3,
    title: 'The Silent Horizon',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    rating: 9.1,
    quality: '4K',
    availability: 'Available',
    genres: ['Drama'],
    year: 2024,
    country: 'UK',
    type: 'Movie',
    tab: 'Trending',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 4,
    title: 'Quantum Paradox',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    rating: 8.7,
    quality: '4K',
    availability: 'Available',
    genres: ['Sci-Fi'],
    year: 2024,
    country: 'USA',
    type: 'Movie',
    tab: 'Latest',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 5,
    title: 'Abyssinia Chronicles',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    rating: 9.3,
    quality: '4K',
    availability: 'Available',
    genres: ['Drama', 'Action'],
    year: 2024,
    country: 'Ethiopia',
    type: 'TV Series',
    tab: 'Trending',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 6,
    title: 'Cyber City 2099',
    posterUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=600&q=80',
    rating: 8.1,
    quality: 'HD',
    availability: 'Available',
    genres: ['Sci-Fi', 'Action'],
    year: 2023,
    country: 'Japan',
    type: 'TV Series',
    tab: 'Recently Added',
  },
  {
    id: 7,
    title: 'Shadows of Lalibela',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    rating: 8.9,
    quality: '4K',
    availability: 'Available',
    genres: ['Drama', 'Thriller'],
    year: 2024,
    country: 'Ethiopia',
    type: 'Movie',
    tab: 'Featured',
  },
  {
    id: 8,
    title: 'Solaris Vanguard',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    rating: 7.6,
    quality: 'HD',
    availability: 'Coming Soon',
    genres: ['Sci-Fi'],
    year: 2025,
    country: 'Korea',
    type: 'Movie',
    tab: 'Coming Soon',
  },
];

const MovieCenterPage = () => {
  const [filters, setFilters] = useState({ genres: [], contentType: 'All', searchQuery: '', country: 'All' });
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

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

  const handlePlayTrailer = (movie) => {
    setActiveTrailer(movie);
  };

  const handleToggleBookmark = (movie, isSaved) => {
    setBookmarkedIds((prev) =>
      isSaved ? [...prev, movie.id] : prev.filter((id) => id !== movie.id)
    );
    showToast(isSaved ? `"${movie.title}" saved to Wishlist!` : `"${movie.title}" removed from Wishlist.`);
  };

  // Filter movies dynamically
  const filteredMovies = useMemo(() => {
    return ALL_MOVIES.filter((movie) => {
      // Tab filter
      if (activeTab !== 'All') {
        if (activeTab === 'Latest' && movie.year < 2024) return false;
        if (activeTab === 'Trending' && movie.rating < 8.5) return false;
        if (activeTab === 'Coming Soon' && movie.availability !== 'Coming Soon') return false;
        if (activeTab === 'Featured' && movie.tab !== 'Featured') return false;
        if (activeTab === 'Recently Added' && movie.id % 2 !== 0) return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(query);
        const matchesGenre = movie.genres.some((g) => g.toLowerCase().includes(query));
        if (!matchesTitle && !matchesGenre) return false;
      }

      // Country filter
      if (filters.country && filters.country !== 'All') {
        if (movie.country !== filters.country) return false;
      }

      // Content Type filter
      if (filters.contentType && filters.contentType !== 'All') {
        if (movie.type !== filters.contentType) return false;
      }

      // Genre filter
      if (filters.genres && filters.genres.length > 0) {
        const hasGenre = filters.genres.some((g) => movie.genres.includes(g));
        if (!hasGenre) return false;
      }

      return true;
    });
  }, [filters, activeTab]);

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / itemsPerPage));
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(start, start + itemsPerPage);
  }, [filteredMovies, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative">
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
                src={activeTrailer.trailerUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                title={activeTrailer.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow pt-[80px]">
        <MovieHero />
        <SubNav onTabChange={handleTabChange} />

        <div id="movie-catalog" className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-6 flex justify-between items-center">
            <p className="text-sm text-on-surface-variant font-medium">
              Showing <span className="text-white font-bold">{filteredMovies.length}</span> movies
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
                <div className="hidden md:flex justify-between items-center mb-6">
                  <p className="text-sm text-on-surface-variant font-medium">
                    Showing <span className="text-white font-bold">{filteredMovies.length}</span> results
                  </p>
                </div>

                {paginatedMovies.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {paginatedMovies.map((movie, index) => (
                      <div key={movie.id} className="animate-fade-in hover:-translate-y-1 transition-transform duration-200" style={{ animationDelay: `${index * 0.05}s` }}>
                        <MovieCard
                          movie={movie}
                          onPlayTrailer={handlePlayTrailer}
                          onToggleBookmark={handleToggleBookmark}
                          isBookmarked={bookmarkedIds.includes(movie.id)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel p-12 text-center rounded-2xl my-8">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
                    <h3 className="text-xl font-bold text-white mb-2">No Movies Found</h3>
                    <p className="text-on-surface-variant max-w-md mx-auto mb-6">
                      We couldn't find any movies matching your current filter criteria. Try clearing some filters.
                    </p>
                    <button
                      onClick={() => setFilters({ genres: [], contentType: 'All', searchQuery: '', country: 'All' })}
                      className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
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
