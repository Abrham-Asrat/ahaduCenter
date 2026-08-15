// src/pages/ElectronicsPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import ElectronicsHero from '../components/electronics/ElectronicsHero';
import CategoryPills from '../components/electronics/CategoryPills';
import ElectronicsFilters from '../components/electronics/ElectronicsFilters';
import ProductCard from '../components/electronics/ProductCard';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

/**
 * ElectronicsPage Component
 * 
 * Main page for the Electronics Marketplace module.
 * Features:
 * - Dynamic category filtering & sidebar criteria (search, brand, price, condition)
 * - Sorting (Featured, Low to High, High to Low, Rating)
 * - Toast notifications for Cart, Wishlist, Compare actions
 * - Mobile filter drawer modal
 */
const ElectronicsPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Featured');
  const [filterState, setFilterState] = useState({
    conditions: [],
    brands: [],
    searchQuery: '',
    maxPrice: 3000,
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Rich mock dataset
  const [products] = useState([
    {
      id: 1,
      name: 'Quantum X Pro Laptop',
      brand: 'AhaduTech',
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      condition: 'New',
      price: 1499,
      originalPrice: 1699,
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Silence 400 Wireless ANC Headphones',
      brand: 'SonicAura',
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      condition: 'Used',
      price: 249,
      originalPrice: 349,
      rating: 4.5,
    },
    {
      id: 3,
      name: 'Nexus X-Fold Comm Smartphone',
      brand: 'NexusGlobal',
      category: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      condition: 'New',
      price: 1199,
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Command Center Hub 10-in-1',
      brand: 'AhaduTech',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=600&q=80',
      condition: 'Refurbished',
      price: 149,
      originalPrice: 199,
      rating: 4.2,
    },
    {
      id: 5,
      name: 'Studio Master Studio Headphones',
      brand: 'SonicAura',
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80',
      condition: 'New',
      price: 399,
      rating: 4.9,
    },
    {
      id: 6,
      name: 'Visionary Ultra Curved Monitor 34"',
      brand: 'Visionary Tech',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
      condition: 'New',
      price: 899,
      originalPrice: 999,
      rating: 4.6,
    },
    {
      id: 7,
      name: 'Auraline Wireless Mechanical Keyboard',
      brand: 'Auraline',
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
      condition: 'Used',
      price: 129,
      originalPrice: 179,
      rating: 4.4,
    },
    {
      id: 8,
      name: 'Quantum SlimBook Air',
      brand: 'AhaduTech',
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
      condition: 'Refurbished',
      price: 899,
      originalPrice: 1099,
      rating: 4.3,
    },
  ]);

  const categories = ['All', 'Laptops', 'Smartphones', 'Audio', 'Accessories'];

  const handleFilterChange = (newFilters) => {
    setFilterState((prev) => ({ ...prev, ...newFilters }));
  };

  const handleAddToCart = (product) => {
    showToast(`"${product.name}" added to shopping cart!`);
  };

  const handleCompare = (product) => {
    showToast(`"${product.name}" added to product comparison!`);
    setTimeout(() => navigate('/electronics/compare'), 1200);
  };

  const handleToggleWishlist = (product, isSaved) => {
    if (isSaved) {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast(`"${product.name}" saved to wishlist!`);
    } else {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`"${product.name}" removed from wishlist.`);
    }
  };

  // Filter products dynamically
  const filteredProducts = products.filter((p) => {
    // Category
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    // Search query
    if (
      filterState.searchQuery &&
      !p.name.toLowerCase().includes(filterState.searchQuery.toLowerCase()) &&
      !p.brand.toLowerCase().includes(filterState.searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Condition
    if (filterState.conditions.length > 0 && !filterState.conditions.includes(p.condition)) {
      return false;
    }
    // Brand
    if (filterState.brands.length > 0 && !filterState.brands.includes(p.brand)) {
      return false;
    }
    // Max price
    if (p.price > filterState.maxPrice) return false;

    return true;
  });

  // Sort products dynamically
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Price: Low to High') return a.price - b.price;
    if (sortOption === 'Price: High to Low') return b.price - a.price;
    if (sortOption === 'Rating') return b.rating - a.rating;
    return a.id - b.id; // Featured
  });

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col relative">
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
          <CategoryPills categories={categories} onCategoryChange={setActiveCategory} />
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
                Showing <strong className="text-white">{sortedProducts.length}</strong> of {products.length} products
              </span>
              <div className="flex items-center gap-3">
                <span className="text-on-surface-variant text-sm font-medium">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-background border border-white/10 text-white text-sm rounded-lg focus:border-primary py-1.5 pl-3 pr-8 outline-none cursor-pointer"
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            {sortedProducts.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center border border-white/10 my-8">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-3">
                  devices_off
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
                <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
                  We couldn't find any electronics matching your current search and filter criteria.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('All');
                    setFilterState({ conditions: [], brands: [], searchQuery: '', maxPrice: 3000 });
                  }}
                  className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all text-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onAddToCart={handleAddToCart}
                    onCompare={handleCompare}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
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