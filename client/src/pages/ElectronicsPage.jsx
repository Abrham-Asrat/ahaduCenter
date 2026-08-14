// src/pages/ElectronicsPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import ElectronicsHero from '../components/electronics/ElectronicsHero';
import CategoryPills from '../components/electronics/CategoryPills';
import ElectronicsFilters from '../components/electronics/ElectronicsFilters';
import ProductCard from '../components/electronics/ProductCard';
import Footer from '../components/common/Footer';

/**
 * ElectronicsPage Component
 * 
 * Main page for the Electronics Marketplace module.
 * 
 * State:
 * - filters: Object { conditions: [] }
 * - activeCategory: String
 * 
 * Data:
 * - products: Array of dummy product objects
 * 
 * Layout:
 * - Desktop: Sidebar filters (left) + Product grid (right)
 * - Mobile: Category pills, sort bar, grid (no sidebar)
 */
const ElectronicsPage = () => {
  const [filters, setFilters] = useState({ conditions: [] });
  const [activeCategory, setActiveCategory] = useState('All');

  // Dummy product data
  const products = [
    {
      id: 1,
      name: 'Quantum X Pro Laptop',
      brand: 'AhaduTech',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxAQrjbcLqtgD-z-901AI3L-ly0BGp19Xza6SYhx_v8rbZQB9c3yKANs-N_JUDjSamfmimUn96VSSouedsGmCO6o440ra8R3Gk8WcSk4X_cRBLTDsYmObL-t6zQHf2WX8HoVjZlpaCS6T8Wi8vZ4Xpt9rktCpmw7Jbbn6ORsHU_CR_pYTv4gjNctF9b3jN2NIwQNem8dnYQhhYsdSPNaRWx64JfkkLlmITOd-84mw6NdC3-uAoGRhckw',
      condition: 'New',
      price: 1499,
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Silence 400 Headphones',
      brand: 'SonicAura',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPZi0KjqholvrB4kF9wiTfxozlJx5-HCUdlMaiom48KcXI5BKEGTbMfmAIHzpF93oRVeYLmOjROOswD1vwZP597pNVO1vTqsN1itVyn4jmzKsuxSFIYTwCevBb5QiNZ4VpHAJ7zDw6GGi5ttLN46yCx2xSWE1W9-7QgZ3g-oBX70wiVrxMSBZJbGBbnvaEDjxvn20YbN76G-MxcYgLx2vcA-Q9M6hU7l2JYJaeIhi-N72svtWaNYYYtw',
      condition: 'Used',
      price: 249,
      originalPrice: 349,
      rating: 4.2,
    },
    {
      id: 3,
      name: 'Nexus X-Fold Comm',
      brand: 'NexusGlobal',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_V2Dljo5FoaojpYiBmPKKhiOBgHFPmCBgUaFQN6-Xi95tvLg90OGbAlbXGCpGyQ-CPjYXqj1css65gvdNleaWgjvLmeU4K0_tr_Xxj4WiqT0ai3VBb7h1WlaU-EsdqekCXNLTfOE5F6spFoN4tpOpQZaDVZISPCv1RL3qHOq_UpExXepX9T6Jsj5j1muneZFhNcd8ESJrfLIIpkct_6iBzQJtLTR3XHhuWoxAV4pTnG7a3VRuVroicg',
      condition: 'New',
      price: 1199,
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Command Center Hub',
      brand: 'AhaduTech',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi9-RLZ08eL5mO4z2wG7Dyq-T6DZBuwl4zvj3pIUhQUGWGaH5kXaGPr66Dm6j6n-1bFFS2msHWXWP5UjXjeX06mGX5OlBAAFtAENY7Dsh5_nN6eX8m-QY8SBnNIDLBi_X2WyAYeXP6D5nobZBmWSikVPfM9_9yfvBG6IFaKK9usP8h-kExqMlvX3jJEL6cR3U7bh4gxddAfW9XMdJa2TpkdcDh7Y6Bigzna4Ba5knaKUoV5ODp0ZkXlg',
      condition: 'Refurbished',
      price: 149,
      rating: 4.0,
    },
  ];

  // Categories
  const categories = ['All', 'Laptops', 'Smartphones', 'Audio', 'Accessories'];

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12">
        {/* Hero banner */}
        <ElectronicsHero />

        {/* Category pills */}
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <CategoryPills categories={categories} onCategoryChange={handleCategoryChange} />
        </div>

        {/* Main content: sidebar + grid */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8">

          {/* Sidebar filters (hidden on mobile) */}
          <aside className="hidden md:block w-64 shrink-0">
            <ElectronicsFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Product grid area */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <span className="text-on-surface-variant text-sm">
                Showing 1-{products.length} of {products.length} products
              </span>
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant text-sm">Sort by:</span>
                <select className="bg-surface-variant text-white text-sm rounded focus:ring-1 focus:ring-primary py-1 pl-2 pr-8">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Mobile filter button (floating) */}
            <button className="md:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full bg-surface-container border border-primary/30 text-primary shadow-lg">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ElectronicsPage;