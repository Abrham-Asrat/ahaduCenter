// src/pages/WishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { fetchWishlist, removeWishlistItem } from '../redux/slices/wishlistSlice';

/**
 * WishlistPage Component
 * 
 * Displays all items saved by the user across Movies, Electronics, and Books.
 */
const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: wishlistItems, loading, error } = useSelector((s) => s.wishlist);
  const [activeTab, setActiveTab] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (id, title) => {
    dispatch(removeWishlistItem(id));
    setToastMessage(`Removed "${title}" from wishlist.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (item) => {
    if (item.link) {
      navigate(item.link);
    } else if (item.type === 'Product' || item.type === 'Electronics') {
      navigate('/electronics');
    } else if (item.type === 'Movie') {
      navigate('/movie-request');
    } else {
      navigate('/borrowing-history');
    }
  };

  const tabs = [
    { key: 'all', label: 'All Items', count: wishlistItems.length },
    { key: 'movies', label: 'Movies', count: wishlistItems.filter((i) => i.type === 'Movie').length },
    { key: 'electronics', label: 'Electronics', count: wishlistItems.filter((i) => i.type === 'Product' || i.type === 'Electronics').length },
    { key: 'books', label: 'Books', count: wishlistItems.filter((i) => i.type === 'Book').length },
  ];

  // Filter items based on active tab
  const filteredItems = activeTab === 'all'
    ? wishlistItems
    : wishlistItems.filter((item) => {
        if (activeTab === 'movies') return item.type === 'Movie';
        if (activeTab === 'electronics') return item.type === 'Product' || item.type === 'Electronics';
        if (activeTab === 'books') return item.type === 'Book';
        return true;
      });

  // Determine action icon based on type
  const getActionIcon = (type) => {
    switch (type) {
      case 'Movie': return 'add';
      case 'Product':
      case 'Electronics': return 'devices';
      case 'Book': return 'book';
      default: return 'add';
    }
  };

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-background text-on-background flex flex-col animate-fade-in">

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-primary text-black font-extrabold px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          {toastMessage}
        </div>
      )}

      <main className="flex-grow pt-2 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">MY WISHLIST</h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Your saved movies, electronics, and books in one place.
            </p>
          </div>
          <button onClick={() => navigate('/books')} className="border border-primary text-primary px-6 py-2 rounded hover:bg-primary/10 transition-all flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-sm">add</span>
            ADD ITEMS
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
            <button
              onClick={() => dispatch(fetchWishlist())}
              className="ml-auto text-xs underline font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filter tabs */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md py-4 mb-8 border-b border-white/5 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-primary text-black font-semibold'
                    : 'bg-surface-container text-on-surface-variant border border-white/5 hover:border-white/20'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && wishlistItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-panel rounded-lg h-80 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : (
          /* Wishlist grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const id = item.id || item._id;
              const type = item.type || item.itemType || 'Item';
              const title = item.title || item.name || 'Untitled';
              const img = item.imageUrl || item.posterUrl || item.coverUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80';
              const link = item.link || (type === 'Movie' ? `/movies/${id}` : type === 'Book' ? `/books/${id}` : `/electronics/${id}`);

              return (
                <div
                  key={id}
                  className="glass-panel rounded-lg overflow-hidden group relative transition-transform duration-300 hover:scale-[1.02] hover:border-secondary/50 flex flex-col h-full"
                >
                  {/* Image container */}
                  <div className="relative h-64 w-full bg-surface-container-highest overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${img}')` }}
                    />
                    {/* Type badge */}
                    <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-primary">
                        {type === 'Movie' ? 'movie' : type === 'Product' || type === 'Electronics' ? 'devices' : 'book'}
                      </span>
                      <span className="text-xs uppercase text-on-surface-variant">
                        {type === 'Product' || type === 'Electronics' ? 'TECH' : type.toUpperCase()}
                      </span>
                    </div>

                    {/* Rating or status badge */}
                    {item.rating != null && (
                      <div className="absolute top-3 right-3 bg-secondary/90 text-black px-2 py-1 rounded text-xs font-bold">
                        {item.rating}
                      </div>
                    )}
                    {item.availability && (
                      <div className="absolute top-3 right-3 bg-primary/20 border border-primary/30 text-primary text-xs px-2 py-1 rounded">
                        {item.availability}
                      </div>
                    )}

                    {/* Hover overlay actions */}
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                      <button
                        onClick={() => handleRemove(id, title)}
                        className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-white hover:text-error hover:border-error transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      <button
                        onClick={() => handleAction({ ...item, link })}
                        className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <span className="material-symbols-outlined">{getActionIcon(type)}</span>
                      </button>
                      <Link
                        to={link}
                        className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-white hover:text-primary hover:border-primary transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </Link>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-white truncate mb-2">{title}</h3>

                    {/* Category or Author */}
                    {item.category && (
                      <p className="text-sm text-on-surface-variant mb-2">{item.category}</p>
                    )}

                    {/* Price if available */}
                    {item.price != null && (
                      <div className="mt-auto pt-3 border-t border-white/5 font-bold text-white">
                        {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredItems.length === 0 && (
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
    </>
  );
};

export default WishlistPage;