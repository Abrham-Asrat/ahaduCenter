// src/pages/SearchResultsPage.jsx
import React, { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

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

  // Sample comprehensive search items dataset
  const allResults = [
    {
      id: 1,
      type: 'Movie',
      title: 'Interstellar',
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      rating: '8.7 / 10',
      category: 'Sci-Fi',
      link: '/movies/1',
      date: '2024-01-15',
      priceValue: 0
    },
    {
      id: 2,
      type: 'Electronics',
      title: 'Quantum Laptop M2',
      description: 'Next-generation computing power housed in a sleek, obsidian aluminum chassis with OLED display.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      rating: '4.9 / 5',
      category: 'High-Tech',
      price: '$1,299',
      priceValue: 1299,
      link: '/electronics/1',
      date: '2024-03-10'
    },
    {
      id: 3,
      type: 'Book',
      title: 'The Glass Hotel',
      description: 'Author: Emily St. John Mandel. A captivating novel exploring money, beauty, and moral compromise.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      rating: '4.6 / 5',
      category: 'Hardcover',
      link: '/books/1',
      date: '2023-11-20',
      priceValue: 0
    },
    {
      id: 4,
      type: 'Movie',
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task.',
      imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
      rating: '8.8 / 10',
      category: 'Sci-Fi',
      link: '/movies/2',
      date: '2024-02-01',
      priceValue: 0
    },
    {
      id: 5,
      type: 'Electronics',
      title: 'CyberSound Headphones Pro',
      description: 'Active noise cancelling wireless headphones with 40-hour battery life and spatial audio.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      rating: '4.8 / 5',
      category: 'Audio',
      price: '$349',
      priceValue: 349,
      link: '/electronics/2',
      date: '2024-02-15'
    },
    {
      id: 6,
      type: 'Book',
      title: 'Dune Chronicles',
      description: 'Author: Frank Herbert. The epic masterwork of sci-fi set on the desert planet Arrakis.',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      rating: '4.9 / 5',
      category: 'Sci-Fi',
      link: '/books/2',
      date: '2024-01-05',
      priceValue: 0
    }
  ];

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

  // Dynamically filter results
  const filteredResults = useMemo(() => {
    return allResults.filter((item) => {
      // 1. Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      // 2. Tab Filter
      if (activeTab === 'movies' && item.type !== 'Movie') return false;
      if (activeTab === 'electronics' && item.type !== 'Electronics') return false;
      if (activeTab === 'books' && item.type !== 'Book') return false;

      // 3. Genre Filter (for movies)
      if (item.type === 'Movie' && selectedGenres.length > 0) {
        if (!selectedGenres.includes(item.category)) return false;
      }

      // 4. Price Filter (for electronics)
      if (item.type === 'Electronics') {
        if (priceMin && item.priceValue < parseFloat(priceMin)) return false;
        if (priceMax && item.priceValue > parseFloat(priceMax)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'Price (Low to High)') return (a.priceValue || 0) - (b.priceValue || 0);
      return 0; // Default relevance
    });
  }, [searchQuery, activeTab, selectedGenres, priceMin, priceMax, sortBy]);

  // Tab counts
  const counts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = (item) => {
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    };

    const baseList = allResults.filter(matchesSearch);
    return {
      all: baseList.length,
      movies: baseList.filter((i) => i.type === 'Movie').length,
      electronics: baseList.filter((i) => i.type === 'Electronics').length,
      books: baseList.filter((i) => i.type === 'Book').length,
    };
  }, [searchQuery]);

  const tabs = [
    { key: 'all', label: 'All Results', count: counts.all },
    { key: 'movies', label: 'Movies', count: counts.movies },
    { key: 'electronics', label: 'Electronics', count: counts.electronics },
    { key: 'books', label: 'Books', count: counts.books },
  ];

  const genres = ['Sci-Fi', 'Action', 'Drama'];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-6">
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

        {/* Tabs */}
        <div className="flex border-b border-white/10 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {tab.label}{' '}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-white/5 text-on-surface-variant'
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
                    placeholder="Min ($)"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-primary outline-none"
                  />
                  <span className="text-on-surface-variant">-</span>
                  <input
                    type="number"
                    placeholder="Max ($)"
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
            {filteredResults.length === 0 ? (
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
                {filteredResults.map((result) => (
                  <article
                    key={result.id}
                    onClick={() => navigate(result.link)}
                    className="glass-panel rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all group cursor-pointer flex flex-col h-full"
                  >
                    {/* Card image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url('${result.imageUrl}')` }}
                      />
                      {/* Type badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 rounded text-xs uppercase font-bold flex items-center gap-1 ${
                            result.type === 'Movie'
                              ? 'bg-surface/90 text-primary border border-primary/30'
                              : result.type === 'Electronics'
                              ? 'bg-surface/90 text-secondary border border-secondary/30'
                              : 'bg-surface/90 text-tertiary border border-tertiary/30'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {result.type === 'Movie' ? 'movie' : result.type === 'Electronics' ? 'devices' : 'menu_book'}
                          </span>
                          {result.type}
                        </span>
                      </div>
                      {/* Rating badge */}
                      {result.rating && (
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
                        {result.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant line-clamp-3 flex-grow">{result.description}</p>
                      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs uppercase text-on-surface-variant">{result.category}</span>
                        <Link
                          to={result.link}
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary hover:text-primary-fixed transition-colors flex items-center gap-1 text-xs uppercase font-extrabold"
                        >
                          {result.type === 'Electronics' ? 'View Tech' : 'Details'}
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter button (floating, placed bottom-20 to avoid bottom nav overlay) */}
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
  );
};

export default SearchResultsPage;