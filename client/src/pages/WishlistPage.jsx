// src/pages/WishlistPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * WishlistPage Component
 * 
 * Displays all items saved by the user across Movies, Electronics, and Books.
 * 
 * Features:
 * - Filter tabs: All Items, Movies, Electronics, Books
 * - Wishlist cards with type badge and hover actions
 * - Quick actions: delete, request/buy/borrow, view details
 * - Responsive grid (1 col mobile, 2 tablet, 3-4 desktop)
 * 
 * State:
 * - activeTab: 'all' | 'movies' | 'electronics' | 'books'
 */
const WishlistPage = () => {
  // Active filter tab
  const [activeTab, setActiveTab] = useState('all');

  // Tabs data with counts
  const tabs = [
    { key: 'all', label: 'All Items', count: 12 },
    { key: 'movies', label: 'Movies', count: 5 },
    { key: 'electronics', label: 'Electronics', count: 4 },
    { key: 'books', label: 'Books', count: 3 },
  ];

  // Dummy wishlist items
  const wishlistItems = [
    {
      id: 1,
      type: 'Movie',
      title: 'Interstellar',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5r_rp9BocBJQsxHRmAB-uqJCxQNyMd7ipnkcBdAtVDEIjy72-9RecHJQfQf1wwtQpPD6Yk4FjmVQuMpWEIA7wjK-nSIqEkGP-YSPURWuWtVa9FJelxVvBIc0IfzA9WxHRDJhbkc-fs0u1X7cu46G5qTTtoyr7axJ14zNO0NcsKi-nCkjoGw0MzCKMAutxaNRdqJBx0SkpEwvtt6d-BMcT0P1-wDZq4x6RMA-clwDU_Bi0vGxR9VqiDA',
      rating: '8.7',
      category: 'Sci-Fi',
      price: null,
      status: 'Available',
      actionLabel: 'Request',
    },
    {
      id: 2,
      type: 'Electronics',
      title: 'Quantum Laptop M2',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZhhHXge6NDlwEUWI_bmqqjW956cjsjagJDimCyd8UI19s1MlIYW4KaS954kiyAUychRDIM3Aajffv9yYSJP5h8Z0LGLaEWoJiazXqs_vKZLkEE3BXf07VtPL8ucR2K3GYJ3XXOF0I9L19gRyddgfeLv2KNpj7NKAr_fe6X2c9lgPoU7PEX_phz7tlCMfJdnM_AUeKNcfDM1PmP6K28dKL35cma3HokY1nwqUMzWxUuDWFvmj9I5qc2Q',
      rating: '5.0',
      category: 'Tech',
      price: '$1,299.00',
      status: 'Brand New',
      actionLabel: 'Buy Now',
    },
    {
      id: 3,
      type: 'Book',
      title: 'The Glass Hotel',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALLc4dNH9UmLrhsAN1JtmwPr7V06tqVLyUwnNCq7wEmiHxyCSBvxBrR9hAS_cB3WdleYHlaaqweVEicZ_PoKljcBSOuN4Uo4x3iUEYanA8J0S6cjZzeU5E0wYqncE_tFsiPDRXTSHPL3uHJtMatrZ4s4siGYqVi8j1KjrnK7ZfTZ9VhvDqXXlZS4apF08q5FVvcTEVkAhVpFm_KDQSoQHmuh2oytZ7SbPgnhFqBgouWV4EOAQWxIAPkw',
      rating: null,
      category: 'Emily St. John Mandel',
      price: null,
      status: 'Available to Borrow',
      actionLabel: 'Borrow',
    },
    {
      id: 4,
      type: 'Movie',
      title: 'Blade Runner 2049',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxwb72t-2zp119yINMURiv3_fjM8XAGsBcgMRULnzhncEWtk9R11QGxfFPb2ogbtwtFyd50tH8bf-MIWPje_GX_47Z8mhVPlFg2Yw8L5Vf3fk3XMWCGGscWI07ytCxJL7qK5ZwvWBF6etNStjUCdFcJEtnV_UOXKirgwQcmAYWfU9jw1lUb5Xoi-AqqwT27SaWEeMbWlKryV_JVexw-tkKTSia3Jl01FzSTOdMSZuoI7GUZ7w7_qY3g',
      rating: '8.0',
      category: 'Sci-Fi / Thriller',
      price: null,
      status: 'Available',
      actionLabel: 'Request',
    },
  ];

  // Filter items based on active tab
  const filteredItems = activeTab === 'all'
    ? wishlistItems
    : wishlistItems.filter(item => {
      if (activeTab === 'movies') return item.type === 'Movie';
      if (activeTab === 'electronics') return item.type === 'Electronics';
      if (activeTab === 'books') return item.type === 'Book';
      return true;
    });

  // Determine action icon based on type
  const getActionIcon = (type) => {
    switch (type) {
      case 'Movie': return 'add';
      case 'Electronics': return 'shopping_cart';
      case 'Book': return 'book';
      default: return 'add';
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">MY WISHLIST</h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Your saved movies, electronics, and books in one place.
            </p>
          </div>
          <button className="border border-primary text-primary px-6 py-2 rounded hover:bg-primary/10 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            ADD ITEMS
          </button>
        </div>

        {/* Filter tabs */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md py-4 mb-8 border-b border-white/5 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${activeTab === tab.key
                    ? 'bg-primary text-black font-semibold'
                    : 'bg-surface-container text-on-surface-variant border border-white/5 hover:border-white/20'
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Wishlist grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-lg overflow-hidden group relative transition-transform duration-300 hover:scale-[1.02] hover:border-secondary/50 flex flex-col h-full"
            >
              {/* Image container */}
              <div className="relative h-64 w-full bg-surface-container-highest overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.imageUrl}')` }}
                />
                {/* Type badge */}
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">
                    {item.type === 'Movie' ? 'movie' : item.type === 'Electronics' ? 'devices' : 'book'}
                  </span>
                  <span className="text-xs uppercase text-on-surface-variant">
                    {item.type === 'Electronics' ? 'TECH' : item.type.toUpperCase()}
                  </span>
                </div>
                {/* Rating or status badge */}
                {item.type === 'Movie' && (
                  <div className="absolute top-3 right-3 bg-secondary/90 text-black px-2 py-1 rounded text-xs font-bold">
                    {item.rating}
                  </div>
                )}
                {item.type === 'Electronics' && (
                  <div className="absolute top-3 right-3 bg-secondary/20 border border-secondary/50 text-secondary text-xs px-2 py-1 rounded">
                    {item.status}
                  </div>
                )}
                {item.type === 'Book' && (
                  <div className="absolute top-3 right-3 bg-primary/20 border border-primary/30 text-primary text-xs px-2 py-1 rounded">
                    In Stock
                  </div>
                )}

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-white hover:text-error hover:border-error transition-colors">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">{getActionIcon(item.type)}</span>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-white hover:text-primary hover:border-primary transition-colors">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </div>
              </div>

              {/* Card content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-white truncate mb-2">{item.title}</h3>

                {/* Movie: genre and rating */}
                {item.type === 'Movie' && (
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <span className="text-sm text-on-surface-variant">{item.category}</span>
                    <div className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-sm">star</span>
                      <span className="text-sm font-semibold">{item.rating}</span>
                    </div>
                  </div>
                )}
                {item.type === 'Movie' && (
                  <div className="mt-2 bg-primary/15 text-primary text-xs py-1 px-2 rounded inline-block w-fit">
                    {item.status}
                  </div>
                )}

                {/* Electronics: price and rating */}
                {item.type === 'Electronics' && (
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <span className="font-bold text-white">{item.price}</span>
                    <div className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-sm">star</span>
                      <span className="text-sm font-semibold">{item.rating}</span>
                    </div>
                  </div>
                )}

                {/* Book: author and status */}
                {item.type === 'Book' && (
                  <>
                    <p className="text-sm text-on-surface-variant mb-2">{item.category}</p>
                    <div className="mt-auto pt-3 border-t border-white/5">
                      <span className="bg-surface-container-high text-white text-xs py-1 px-2 rounded inline-block">
                        {item.status}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">favorite_border</span>
            <h2 className="text-2xl font-bold text-white mt-4">Your wishlist is empty</h2>
            <p className="text-on-surface-variant mt-2">Save items you like to find them here later.</p>
            <div className="flex gap-4 justify-center mt-6">
              <Link to="/movies" className="bg-primary text-black px-6 py-2 rounded hover:shadow-lg transition-all">Browse Movies</Link>
              <Link to="/electronics" className="border border-secondary text-secondary px-6 py-2 rounded hover:bg-secondary/10 transition-all">Shop Electronics</Link>
              <Link to="/books" className="border border-white/20 text-white px-6 py-2 rounded hover:bg-white/5 transition-all">Explore Books</Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;