// src/pages/ElectronicsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import Navbar from '../components/common/Navbar';
import ElectronicsHero from '../components/electronics/ElectronicsHero';
import CategoryPills from '../components/electronics/CategoryPills';
import ElectronicsFilters from '../components/electronics/ElectronicsFilters';
import ProductCard from '../components/electronics/ProductCard';
import Pagination from '../components/common/Pagination';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

/**
 * ElectronicsPage Component
 *
 * Main page for the Electronics Marketplace module.
 * Wired to Redux store — dispatches fetchProducts on mount and on filter/sort/page change.
 */
const ElectronicsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────────────────────────────
  const { products, loading, error, pagination } = useSelector((s) => s.product);

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Featured');
  const [filterState, setFilterState] = useState({
    conditions: [],
    brands: [],
    searchQuery: '',
    maxPrice: 3000,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [toastMessage, setToastMessage] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = ['All', 'Laptops', 'Smartphones', 'Audio', 'Accessories'];

  // ── Build query params from local filter/sort/page state ─────────────────────
  const buildParams = useCallback(() => {
    const params = { page: currentPage, limit: 12 };

    if (activeCategory && activeCategory !== 'All') params.category = activeCategory;
    if (filterState.searchQuery) params.search = filterState.searchQuery;
    if (filterState.conditions && filterState.conditions.length > 0)
      params.condition = filterState.conditions.join(',');
    if (filterState.brands && filterState.brands.length > 0)
      params.brand = filterState.brands.join(',');
    if (filterState.maxPrice && filterState.maxPrice < 3000)
      params.maxPrice = filterState.maxPrice;

    // Sort param mapping
    if (sortOption === 'Price: Low to High') params.sort = 'price_asc';
    else if (sortOption === 'Price: High to Low') params.sort = 'price_desc';
    else if (sortOption === 'Rating') params.sort = 'rating';
    // 'Featured' is the default — no sort param needed

    return params;
  }, [activeCategory, filterState, sortOption, currentPage]);

  // ── Fetch on mount and whenever category/filters/sort/page change ─────────────
  useEffect(() => {
    dispatch(fetchProducts(buildParams()));
  }, [dispatch, buildParams]);

  // ── Control change handlers ───────────────────────────────────────────────────
  const handleFilterChange = (newFilters) => {
    setFilterState((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const catalogEl = document.getElementById('electronics-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRetry = () => {
    dispatch(fetchProducts(buildParams()));
  };

  const handleAddToCart = (product) => {
    showToast(`"${product.name}" reserved for in-store inquiry! Visit our physical location.`);
  };

  const handleCompare = (product) => {
    showToast(`"${product.name}" added to product comparison!`);
    setTimeout(() => navigate('/compare'), 1200);
  };

  const handleToggleWishlist = (product, isSaved) => {
    const productId = product._id || product.id;
    if (isSaved) {
      setWishlistIds((prev) => [...prev, productId]);
      showToast(`"${product.name}" saved to wishlist!`);
    } else {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast(`"${product.name}" removed from wishlist.`);
    }
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setFilterState({ conditions: [], brands: [], searchQuery: '', maxPrice: 3000 });
    setSortOption('Featured');
    setCurrentPage(1);
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────────
  const SkeletonCard = () => (
    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden animate-pulse">
      <div className="aspect-square bg-surface-container" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 bg-surface-container rounded w-1/3" />
        <div className="h-4 bg-surface-container rounded w-3/4" />
        <div className="h-4 bg-surface-container rounded w-1/2" />
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

      <main className="flex-grow pt-24 pb-16">
        {/* Hero banner */}
        <ElectronicsHero />

        {/* Catalog Section Header */}
        <div id="electronics-catalog" className="max-w-7xl mx-auto px-6 mb-6">
          <CategoryPills categories={categories} onCategoryChange={handleCategoryChange} />
        </div>

        {/* Main content: sidebar + grid */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8">

          {/* Sidebar filters (desktop) */}
          <aside className="hidden md:block w-64 shrink-0">
            <ElectronicsFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Product grid area */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="glass-panel p-4 rounded-xl flex flex-wrap justify-between items-center gap-4 mb-6 border border-white/10">
              <span className="text-on-surface-variant text-sm font-medium">
                {loading ? (
                  <span className="inline-block w-36 h-4 bg-surface-container rounded animate-pulse" />
                ) : (
                  <>
                    Showing <strong className="text-white">{products.length}</strong> of{' '}
                    <strong className="text-white">{pagination.totalItems}</strong> products
                  </>
                )}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-on-surface-variant text-sm font-medium">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="bg-background border border-white/10 text-white text-sm rounded-lg focus:border-primary py-1.5 pl-3 pr-8 outline-none cursor-pointer"
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="glass-panel rounded-xl border border-red-500/30 bg-red-500/5 p-5 mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-400">error</span>
                  <p className="text-sm text-red-300">
                    {typeof error === 'string' ? error : 'Failed to load products. Please try again.'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 && !error ? (
              /* Empty state */
              <div className="glass-panel rounded-2xl p-12 text-center border border-white/10 my-8">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-3">
                  devices_off
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
                <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any electronics matching your current search and filter criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all text-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Product grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product._id || product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard
                      product={product}
                      isWishlisted={wishlistIds.includes(product._id || product.id)}
                      onAddToCart={handleAddToCart}
                      onCompare={handleCompare}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  </div>
                ))}
              </div>
            )}

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

            {/* Mobile floating filter button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="md:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-black font-bold shadow-2xl flex items-center justify-center gap-2 border border-primary/50"
            >
              <span className="material-symbols-outlined">tune</span>
              <span className="text-xs uppercase tracking-wider font-extrabold">Filters</span>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end md:hidden">
          <div className="w-full max-w-xs bg-background h-full p-6 overflow-y-auto border-l border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Filter Tech</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-on-surface-variant hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <ElectronicsFilters onFilterChange={handleFilterChange} />
            </div>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full bg-primary text-black font-bold py-3 rounded-xl mt-6 uppercase text-xs tracking-wider"
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

export default ElectronicsPage;
