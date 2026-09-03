// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { searchService } from '../services/searchService';

/**
 * SearchResultsPage Component
 * 
 * Displays global search results across all three modules (Movies, Electronics, Books).
 * Includes full filtering, sorting, tab switching, and card navigation.
 */
const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';

  // State
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('Relevance');
  const [selectedGenres, setSelectedGenres] = useState(['Sci-Fi', 'Action', 'Drama']);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // API Data State
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch search results whenever searchQuery or activeTab changes
  useEffect(() => {
    let cancelled = false;
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setTotalCount(0);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const typeParam = activeTab === 'movies' ? 'movie' : activeTab === 'electronics' ? 'product' : activeTab === 'books' ? 'book' : undefined;
        const res = await searchService.search({
          q: searchQuery,
          type: typeParam,
          sort: sortBy === 'Newest' ? 'newest' : undefined,
          minPrice: priceMin ? parseFloat(priceMin) : undefined,
          maxPrice: priceMax ? parseFloat(priceMax) : undefined,
        });

        if (!cancelled) {
          const list = Array.isArray(res) ? res : (res?.data ?? []);
          setResults(list);
          setTotalCount(res?.totalCount ?? list.length);
        }
      } catch (err) {
        if (!cancelled) {
          setError(typeof err === 'string' ? err : 'Search failed. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchResults();
    return () => { cancelled = true; };
  }, [searchQuery, activeTab, sortBy, priceMin, priceMax]);

  // Toggle Genre filter selection
  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setPriceMin('');
    setPriceMax('');
  };

  // Local filtering for genres if movie
  const filteredResults = useMemo(() => {
    return results.filter((item) => {
      const type = item.type || item.itemType;
      if ((type === 'Movie' || type === 'movie') && selectedGenres.length > 0) {
        if (item.category && !selectedGenres.includes(item.category)) return false;
      }
      return true;
    });
  }, [results, selectedGenres]);

  // Tab counts derived from current results
  const counts = useMemo(() => {
    return {
      all: results.length,
      movies: results.filter((i) => (i.type || i.itemType)?.toLowerCase() === 'movie').length,
      electronics: results.filter((i) => {
        const t = (i.type || i.itemType)?.toLowerCase();
        return t === 'product' || t === 'electronics';
      }).length,
      books: results.filter((i) => (i.type || i.itemType)?.toLowerCase() === 'book').length,
    };
  }, [results]);

  const tabs = [
    { key: 'all', label: 'All Results', count: counts.all },
    { key: 'movies', label: 'Movies', count: counts.movies },
    { key: 'electronics', label: 'Electronics', count: counts.electronics },
    { key: 'books', label: 'Books', count: counts.books },
  ];

  const genres = ['Sci-Fi', 'Action', 'Drama'];

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in">

      <main className="flex-grow  pb-4 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-6">
        {/* Search Context Bar */}
        <header className="glass-panel p-4 md:p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {searchQuery ? (
                <>Showing results for <span className="text-primary">"{searchQuery}"</span></>
              ) : (
                <>All Catalog Items</>
              )}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Found {filteredResults.length} matching item{filteredResults.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-on-surface-variant">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container border border-white/10 rounded-lg py-2 pl-4 pr-10 text-white text-sm focus:outline-none focus:border-primary cursor-pointer"
            >
              <option>Relevance</option>
              <option>Newest</option>
              <option>Price (Low to High)</option>
            </select>
          </div>
        </header>

        {/* Error banner (preserves previous results while showing error) */}
        {error && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/10 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab.key
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-white'
                }`}
            >
              {tab.label}{' '}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-white/5 text-on-surface-variant'
                  }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Main content: filters + results */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Filter Sidebar (desktop) */}
          <aside className="hidden md:block w-64 flex-shrink-0 glass-panel rounded-xl p-5 flex flex-col gap-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-xl font-semibold text-white">Filters</h2>
              <button
                onClick={handleClearFilters}
                className="text-xs uppercase text-primary hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Genre filter */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">movie</span>
                Movie Genres
              </h3>
              <div className="flex flex-col gap-2 pl-2">
                {genres.map((genre) => (
                  <label key={genre} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreToggle(genre)}
                      className="form-checkbox bg-surface-container border-white/20 text-primary rounded focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Electronics price filter */}
            <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">devices</span>
                Electronics Price
              </h3>
              <div className="flex flex-col gap-2 pl-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min (ETB)"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-primary outline-none"
                  />
                  <span className="text-on-surface-variant">-</span>
                  <input
                    type="number"
                    placeholder="Max (ETB)"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-grow w-full">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-panel rounded-xl h-64 animate-pulse bg-white/5" />
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="glass-panel rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
                <h3 className="text-xl font-bold text-white mb-2">No Matching Results Found</h3>
                <p className="text-on-surface-variant text-sm mb-6 max-w-md">
                  Try adjusting your search keywords, clearing active category filters, or browsing our primary catalogs below.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-primary text-black font-bold text-xs uppercase px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResults.map((result) => {
                  const id = result.id || result._id;
                  const type = result.type || result.itemType || 'Item';
                  const title = result.title || result.name || 'Untitled';
                  const img = result.imageUrl || result.posterUrl || result.coverUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80';
                  const link = result.link || (type === 'Movie' ? `/movies/${id}` : type === 'Book' ? `/books/${id}` : `/electronics/${id}`);

                  return (
                    <article
                      key={id}
                      onClick={() => navigate(link)}
                      className="glass-panel rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all group cursor-pointer flex flex-col h-full"
                    >
                      {/* Card image */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url('${img}')` }}
                        />
                        {/* Type badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2 py-1 rounded text-xs uppercase font-bold flex items-center gap-1 ${type === 'Movie'
                              ? 'bg-surface/90 text-primary border border-primary/30'
                              : type === 'Product' || type === 'Electronics'
                                ? 'bg-surface/90 text-secondary border border-secondary/30'
                                : 'bg-surface/90 text-tertiary border border-tertiary/30'
                              }`}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {type === 'Movie' ? 'movie' : type === 'Product' || type === 'Electronics' ? 'devices' : 'menu_book'}
                            </span>
                            {type}
                          </span>
                        </div>
                        {/* Rating badge */}
                        {result.rating != null && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-secondary/90 text-black px-2 py-1 rounded text-xs font-bold">
                              {result.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {title}
                        </h3>
                        <p className="text-sm text-on-surface-variant line-clamp-3 flex-grow">{result.description}</p>
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                          <span className="text-xs uppercase text-on-surface-variant">{result.category || type}</span>
                          <Link
                            to={link}
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary hover:text-primary-fixed transition-colors flex items-center gap-1 text-xs uppercase font-extrabold"
                          >
                            {type === 'Product' || type === 'Electronics' ? 'View Tech' : 'Details'}
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter button */}
      <button
        className="md:hidden fixed bottom-20 right-6 z-40 p-4 rounded-full bg-surface-container border border-primary/30 text-primary shadow-lg cursor-pointer"
        onClick={() => setShowFilters(true)}
      >
        <span className="material-symbols-outlined">tune</span>
      </button>

      {/* Mobile filter bottom sheet */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="relative bg-surface-container-highest w-full rounded-t-xl p-6 pb-8 shadow-lg z-10">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Filters</h2>
              <button onClick={handleClearFilters} className="text-primary text-sm font-bold">Reset</button>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">Price Range ($)</h3>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-1/2 bg-surface border border-white/10 rounded p-2 text-white outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-1/2 bg-surface border border-white/10 rounded p-2 text-white outline-none"
                />
              </div>
            </div>

            <button
              className="w-full bg-primary text-black font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      <Footer />

    </div>
    </>
  );
};

export default SearchResultsPage;