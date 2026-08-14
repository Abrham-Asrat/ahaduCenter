// src/pages/BookCenterPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import SubNav from '../components/common/SubNav';
import BookFilters from '../components/book/BookFilters';
import BookCard from '../components/book/BookCard';
import Footer from '../components/common/Footer';

/**
 * BookCenterPage Component
 * 
 * Main page for the Book Center module.
 * 
 * State:
 * - activeCategory: Current sub-navigation category
 * - filters: Object { availability, format, language }
 * - showMobileFilters: Boolean for mobile filter modal
 * 
 * Layout:
 * - Hero banner compact
 * - Sub-navigation pills for categories
 * - Sidebar filters (desktop) / modal (mobile)
 * - Book grid with responsive columns
 * - Pagination (Load More on mobile)
 */
const BookCenterPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [filters, setFilters] = useState({ availability: [], format: [], language: 'English' });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Categories for sub-nav
  const categories = [
    'All Categories',
    'Education',
    'Technology',
    'Business',
    'Science',
    'Arts & Humanities',
  ];

  // Dummy book data
  const books = [
    {
      id: 1,
      title: 'Advanced Algorithm Design',
      author: 'Dr. Sarah Jenkins',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDviXlIgTsRpq8xPFw_2oyPj3CFJLYQM95KhYvHA4Cfu5WTGYNwjsyl0UwKDCwOY0WS8zr-y3KPsjDc3FQg1UvMbL33fBFAIgUetv0J31X3rt15NHpYH1boqjF59uQ94hHtrctJEDKY8e1unPDP0r1QdYEx52fMc3dMN7GzXxLLT7fRvqSSTgKydL2d9vHNLHnqhpmPqjToKz6c8biG3J6Ijl3W7y3E44RKyO4fWKYqHh1WnYY4YrTxSw',
      availability: 'Borrow',
    },
    {
      id: 2,
      title: 'UI/UX Principles & Systems',
      author: 'Marcus Chen',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_M-GX9Gn1nq2Qzz7KhkdIV8weceYJNmG_Htgsh1nRHQcSLXd23Yj-GxiFMAOR-67czzrWxGuTljsbtYVUS_uxRNG_EIMhg-FBzkI5e4YeCFwe2qcFJVd0LT_RN9_DGkffQl77YykZ8vUcEOxsX2Su-z-92eQUPBygIgZ8DRghPv9Xdg4C9gSvDvZ5uygw0Rw_qNG_pfNyERP5tcBOo_XD-bnMF1zspQJ6xLK5alDYcDE4rl-hOIDJ7w',
      availability: 'Reserve',
      waitlist: 3,
    },
    {
      id: 3,
      title: 'Quantum Computing Fundamentals',
      author: 'Elena Rostova',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0xGQajwb6ORxDRHOQS5WQfIjOCRPX_EavNBb3hu4WEv89c5h_gaJbJNrVOPWvyXED784xowJ6uV7blnHskg_tfcJbhxE-pIgjBvAtOD--jvqbUpoMMqY1ntYjk8smQM2Xgk4Vw76oCKFLEr4tBSCTw1HCwyCkA5n2UE4Oumz6mzP1fhDiE8EWtrETIUBWXovQs9ViwxbEB_wGlU_mbCidqQhv-ySThfy5B5mFYyfBea0ehAiLFzJE6g',
      availability: 'Buy',
      price: 85,
    },
    {
      id: 4,
      title: 'Neural Networks Applied',
      author: 'David Kim',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVL2B3RIhTRfn8uNQpEu0RbzA6DGflgp-1Ny2lv44b_Rn_tx2V-ATxjWYlrkAq79p_FwomrhZq4WMiBKZb2tByQvwAMbwEFrjv6GtpeX1SLk6oX5rb_x6YFNDGh6l5nNjd6Q7YbSrSsnUd9gNASjJ-TZHYXq12IYWcJAEfOmr9EYM8UnvonU1fWX_V-X4nYdv0pg6_T0Ti96YYe36zzO1sQE-9gMUrfMYsaBPXtimlR5JjvwwvYsolEA',
      availability: 'Borrow',
    },
  ];

  // Handle filter changes from sidebar
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Navbar />

      {/* Sub-navigation for categories */}
      <div className="pt-20">
        <SubNav
          tabs={categories}
          onTabChange={setActiveCategory}
        />
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-8">
        {/* Hero banner compact */}
        <div className="relative w-full rounded-2xl overflow-hidden glass-panel p-8 border border-white/10 flex items-center justify-between min-h-[160px] mb-8">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5 opacity-50" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
          <div className="relative z-10 max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Book Center <span className="text-primary border-b-2 border-secondary pb-1 inline-block">Collection</span>
            </h1>
            <p className="text-on-surface-variant">
              Explore thousands of premium titles across technical, educational, and creative disciplines.
            </p>
          </div>
          <div className="relative z-10 hidden lg:block">
            <span className="material-symbols-outlined text-6xl text-white/10">auto_stories</span>
          </div>
        </div>

        {/* Main content: sidebar + grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <BookFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Book grid area */}
          <div className="flex-1">
            {/* Grid controls */}
            <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg border border-white/5 mb-6">
              <span className="text-sm text-on-surface-variant">Showing 1-{books.length} of 240 results</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-on-surface-variant">Sort by:</span>
                <select className="bg-transparent border-none text-sm text-primary cursor-pointer outline-none">
                  <option className="bg-surface-container">Newest Arrivals</option>
                  <option className="bg-surface-container">Most Popular</option>
                  <option className="bg-surface-container">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Book grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination (desktop) */}
            <div className="mt-12 hidden md:flex justify-center items-center gap-2">
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 text-on-surface-variant hover:bg-white/5 hover:text-white transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-black font-semibold">1</button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 text-white hover:bg-white/5 transition-colors">2</button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 text-white hover:bg-white/5 transition-colors">3</button>
              <span className="text-on-surface-variant px-2">...</span>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 text-white hover:bg-white/5 transition-colors">12</button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 text-on-surface-variant hover:bg-white/5 hover:text-white transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            {/* Load more (mobile) */}
            <div className="mt-8 md:hidden flex justify-center">
              <button className="glass-panel text-white px-6 py-3 rounded-full text-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2">
                <span>Load More</span>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile floating filter button */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full bg-surface-container border border-primary/30 text-primary shadow-lg"
        onClick={() => setShowMobileFilters(true)}
      >
        <span className="material-symbols-outlined">tune</span>
      </button>

      {/* Mobile filter modal */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
          <div className="bg-surface-container w-full rounded-t-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Filters</h3>
            <BookFilters onFilterChange={handleFilterChange} />
            <button
              className="w-full mt-4 bg-primary-container text-white py-3 rounded-lg"
              onClick={() => setShowMobileFilters(false)}
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

export default BookCenterPage;