// src/pages/SearchResultsPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * SearchResultsPage Component
 * 
 * Displays global search results across all three modules (Movies, Electronics, Books).
 * 
 * Features:
 * - Search context bar showing query and result count
 * - Tabs: All Results, Movies, Electronics, Books
 * - Filter sidebar (desktop) / bottom sheet (mobile)
 * - Mixed result cards with type badges
 * - Pagination
 * 
 * State:
 * - activeTab: Current tab ('all', 'movies', 'electronics', 'books')
 * - showFilters: Boolean for mobile filter bottom sheet
 * - sortBy: Sort option
 * 
 * Responsive:
 * - Desktop: 2-column layout (filters left, results right)
 * - Tablet: Filters optional, grid 2 columns
 * - Mobile: Filters in bottom sheet, grid 2 columns, sticky search bar
 */
const SearchResultsPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('all');
  // State for mobile filter sheet
  const [showFilters, setShowFilters] = useState(false);
  // State for sort option
  const [sortBy, setSortBy] = useState('Relevance');

  // Dummy search query (in production, from URL params or state)
  const searchQuery = 'Interstellar';

  // Tabs data
  const tabs = [
    { key: 'all', label: 'All Results', count: 120 },
    { key: 'movies', label: 'Movies', count: 35 },
    { key: 'electronics', label: 'Electronics', count: 42 },
    { key: 'books', label: 'Books', count: 43 },
  ];

  // Dummy search results
  const results = [
    {
      id: 1,
      type: 'Movie',
      title: 'Interstellar',
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNRuFgGEjiJOYXqcUfY_zVeJHj5w28By01-KLPsN5dWxsfC4G4StKfJ0L5z2VOSIF5nk6IZ7HzhjRkgBSFm5Bcp9sHUVjlc5NQ1_R43UgDOBizr5DGCA-dwbIRcqKEatHPqCyjC18AgDXti5xxjZB-GDlux82U6LJ3itYtNS8jxu6264d9mvGIsPFWZDLSKgAxts079YKxCuk51L2Ggr7Wo2l5v-5FR2m6DGSJeQD04Y1h-AXWbYwZWQ',
      rating: '8.7 / 10',
      category: 'Sci-Fi',
      price: null,
    },
    {
      id: 2,
      type: 'Electronics',
      title: 'Quantum Laptop M2',
      description: 'Next-generation computing power housed in a sleek, obsidian chassis.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz2hFNx554fzOcIAPJILsk9q7nE8Qqgi69xLQlr6NJhhTUHiKrNeSoB9cEIVel7xdrXbatucZ6ZBNgCK27HSxsWdTHNjdisUA97FvW2eQY0yalXGXFw-pypQ8GuvGO8tfKOxvZeTKTMwShDDuG5HFclb1BRiyYv0pnhlQoMswtz22Uatz7CA67Dn4b93CEvA8dTTitKwohB7jq1Z4_j3vb0B1kBj-XAu_eFMfaKOieJ3IDLH_DTIHJMg',
      rating: null,
      category: 'Tech',
      price: '$1,299',
    },
    {
      id: 3,
      type: 'Book',
      title: 'The Glass Hotel',
      description: 'Author: Emily St. John Mandel. A captivating novel exploring money, beauty, white-collar crime, ghosts, and moral compromise.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3USe80i_IRWQ6oCuG17AGr0gJKpdX_5VBM47M_fxk8YNW4IM1VF2AhkS51w6LjcIW-ZAoik5u5gnhXMdRD6RH4OL18tCQhagk7JIRuwjigNFFkV4uTZaUebzHt-N7opZ0pvvesq32tLe5WpW9iqqNZffnZustOwahrNNWh9Da88XUqhIQYyvmFHlGBJ9kUL6omF_7VJYLUU1ejuPioJGXhJ6mMJYlxX3M9haeuT23lMAyXPD1-ImL2A',
      rating: null,
      category: 'Hardcover',
      price: null,
    },
  ];

  // Filter options
  const genres = ['Sci-Fi', 'Action', 'Drama'];
  const categories = ['Movies', 'Electronics', 'Books'];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-6">
        {/* Search Context Bar */}
        <header className="glass-panel p-4 md:p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Showing results for <span className="text-primary">"{searchQuery}"</span>
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">About 120 results found</p>
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
              <option>Rating (High to Low)</option>
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
              className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {tab.label}{' '}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-white/5 text-on-surface-variant'
              }`}>
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
              <button className="text-xs uppercase text-primary hover:text-primary-fixed transition-colors">
                Clear All
              </button>
            </div>

            {/* Genre filter */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">movie</span>
                Movies
              </h3>
              <div className="flex flex-col gap-2 pl-2">
                <h4 className="text-xs uppercase text-on-surface-variant mt-2">Genre</h4>
                {genres.map((genre) => (
                  <label key={genre} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked={genre === 'Sci-Fi'}
                      className="form-checkbox bg-surface-container border-white/20 text-primary rounded focus:ring-primary group-hover:border-primary transition-colors"
                    />
                    <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Electronics filter */}
            <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">devices</span>
                Electronics
              </h3>
              <div className="flex flex-col gap-2 pl-2">
                <h4 className="text-xs uppercase text-on-surface-variant mt-2">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Min"
                    className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-on-surface-variant">-</span>
                  <input
                    type="text"
                    placeholder="Max"
                    className="w-full bg-surface-container border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Apply button */}
            <button className="w-full bg-primary text-white py-2 rounded-lg uppercase tracking-wider text-xs hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
              Apply Filters
            </button>
          </aside>

          {/* Results Grid */}
          <div className="flex-grow w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((result) => (
                <article key={result.id} className="glass-panel rounded-xl overflow-hidden hover:border-secondary/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all group cursor-pointer flex flex-col h-full">
                  {/* Card image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${result.imageUrl}')` }}
                    />
                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded text-xs uppercase flex items-center gap-1 ${
                        result.type === 'Movie'
                          ? 'bg-surface/90 text-primary border border-primary/30'
                          : result.type === 'Electronics'
                          ? 'bg-surface/90 text-secondary border border-secondary/30'
                          : 'bg-surface/90 text-tertiary border border-tertiary/30'
                      }`}>
                        <span className="material-symbols-outlined text-sm">
                          {result.type === 'Movie' ? 'movie' : result.type === 'Electronics' ? 'devices' : 'book'}
                        </span>
                        {result.type}
                      </span>
                    </div>
                    {/* Rating badge (only for movies) */}
                    {result.rating && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-secondary/90 text-black px-2 py-1 rounded text-xs font-bold">
                          {result.rating}
                        </span>
                      </div>
                    )}
                    {/* Stock badge for books */}
                    {result.type === 'Book' && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-1 rounded text-xs uppercase">
                          In Stock
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
                      {result.price ? (
                        <button className="border border-secondary text-secondary hover:bg-secondary/10 px-3 py-1 rounded text-xs uppercase transition-all">
                          View Product
                        </button>
                      ) : (
                        <Link to={result.type === 'Movie' ? '/movies/1' : '/books/1'} className="text-primary hover:text-primary-fixed transition-colors flex items-center gap-1 text-xs uppercase">
                          Details
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center items-center gap-2">
              <button className="w-10 h-10 rounded glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded bg-primary text-white font-bold">1</button>
              <button className="w-10 h-10 rounded glass-panel text-white hover:text-primary transition-colors">2</button>
              <button className="w-10 h-10 rounded glass-panel text-white hover:text-primary transition-colors">3</button>
              <span className="text-on-surface-variant px-2">...</span>
              <button className="w-10 h-10 rounded glass-panel text-white hover:text-primary transition-colors">12</button>
              <button className="w-10 h-10 rounded glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile filter button (floating) */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full bg-surface-container border border-primary/30 text-primary shadow-lg"
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
              <button className="text-on-surface-variant hover:text-white text-sm">Reset</button>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">Price Range</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Min"
                  className="w-1/2 bg-surface border border-white/10 rounded p-2 text-white focus:border-primary focus:ring-0"
                />
                <input
                  type="text"
                  placeholder="Max"
                  className="w-1/2 bg-surface border border-white/10 rounded p-2 text-white focus:border-primary focus:ring-0"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">Availability</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-full text-sm">In Stock</span>
                <span className="px-3 py-1.5 bg-surface border border-white/10 text-on-surface-variant rounded-full text-sm">Pre-order</span>
              </div>
            </div>

            <button
              className="w-full bg-primary text-white text-xs uppercase tracking-widest py-3 rounded hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
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