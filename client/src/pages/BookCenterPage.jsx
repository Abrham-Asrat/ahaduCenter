// src/pages/BookCenterPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import SubNav from '../components/common/SubNav';
import BookFilters from '../components/book/BookFilters';
import BookCard from '../components/book/BookCard';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

/**
 * BookCenterPage Component
 * 
 * Main page for the Book Center module.
 */
const BookCenterPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [sortOption, setSortOption] = useState('Newest Arrivals');
  const [filterState, setFilterState] = useState({
    searchQuery: '',
    availability: [],
    format: [],
    language: 'All Languages',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = [
    'All Categories',
    'Education',
    'Technology',
    'Business',
    'Science',
    'Arts & Humanities',
  ];

  // Rich mock book dataset with clean Unsplash images
  const [books] = useState([
    {
      id: 1,
      title: 'Advanced Algorithm Design',
      author: 'Dr. Sarah Jenkins',
      category: 'Technology',
      coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
      availability: 'Borrow',
      format: 'Hardcover',
      language: 'English',
      rating: 4.9,
    },
    {
      id: 2,
      title: 'UI/UX Principles & Systems',
      author: 'Marcus Chen',
      category: 'Arts & Humanities',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      availability: 'Reserve',
      format: 'Digital (eBook)',
      language: 'English',
      waitlist: 3,
      rating: 4.7,
    },
    {
      id: 3,
      title: 'Quantum Computing Fundamentals',
      author: 'Elena Rostova',
      category: 'Science',
      coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
      availability: 'Buy',
      format: 'Paperback',
      language: 'English',
      price: 85,
      rating: 4.8,
    },
    {
      id: 4,
      title: 'Neural Networks Applied',
      author: 'David Kim',
      category: 'Technology',
      coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
      availability: 'Borrow',
      format: 'Hardcover',
      language: 'English',
      rating: 4.6,
    },
    {
      id: 5,
      title: 'Modern Business Leadership',
      author: 'Abebe Bikila',
      category: 'Business',
      coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      availability: 'Borrow',
      format: 'Paperback',
      language: 'Amharic',
      rating: 4.9,
    },
    {
      id: 6,
      title: 'Pedagogy & Classroom Systems',
      author: 'Prof. Helen Taylor',
      category: 'Education',
      coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      availability: 'Buy',
      format: 'Hardcover',
      language: 'English',
      price: 65,
      rating: 4.5,
    },
    {
      id: 7,
      title: 'Ethiopian Classical Art & History',
      author: 'Tadesse Worku',
      category: 'Arts & Humanities',
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      availability: 'Reserve',
      format: 'Paperback',
      language: 'Amharic',
      waitlist: 5,
      rating: 4.8,
    },
    {
      id: 8,
      title: 'Astrophysics for Modern Thinkers',
      author: 'Dr. Michael Vance',
      category: 'Science',
      coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
      availability: 'Borrow',
      format: 'Digital (eBook)',
      language: 'English',
      rating: 4.9,
    },
  ]);

  const handleFilterChange = (newFilters) => {
    setFilterState((prev) => ({ ...prev, ...newFilters }));
  };

  const handleQuickAction = (book) => {
    if (book.availability === 'Borrow') {
      showToast(`Borrow request for "${book.title}" initiated!`);
    } else if (book.availability === 'Reserve') {
      showToast(`Reserved place on waitlist for "${book.title}"!`);
    } else if (book.availability === 'Buy') {
      showToast(`Inquiry sent for "${book.title}". Visit our store for physical purchase!`);
      setTimeout(() => navigate('/contact'), 1000);
    }
  };

  // Filter books
  const filteredBooks = books.filter((b) => {
    // Category
    if (activeCategory !== 'All Categories' && b.category !== activeCategory) return false;
    // Search
    if (
      filterState.searchQuery &&
      !b.title.toLowerCase().includes(filterState.searchQuery.toLowerCase()) &&
      !b.author.toLowerCase().includes(filterState.searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Availability
    if (filterState.availability.length > 0 && !filterState.availability.includes(b.availability)) {
      return false;
    }
    // Format
    if (filterState.format.length > 0 && !filterState.format.includes(b.format)) {
      return false;
    }
    // Language
    if (filterState.language !== 'All Languages' && b.language !== filterState.language) {
      return false;
    }

    return true;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === 'Highest Rated') return b.rating - a.rating;
    if (sortOption === 'Most Popular') return (b.waitlist || 0) - (a.waitlist || 0);
    return a.id - b.id; // Newest Arrivals
  });

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

      {/* Sub-navigation for categories */}
      <div className="pt-20">
        <SubNav
          tabs={categories}
          onTabChange={setActiveCategory}
        />
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-6 pt-8 pb-20 md:pb-8">
        {/* Hero banner compact */}
        <div className="relative w-full rounded-2xl overflow-hidden glass-panel p-8 border border-white/10 flex items-center justify-between min-h-[160px] mb-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5 opacity-50" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
          <div className="relative z-10 max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Book Center <span className="text-primary border-b-2 border-secondary pb-1 inline-block">Collection</span>
            </h1>
            <p className="text-on-surface-variant text-sm">
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
          <aside className="hidden md:block w-60 flex-shrink-0">
            <BookFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Book grid area */}
          <div className="flex-1">
            {/* Grid controls */}
            <div className="flex justify-between items-center glass-panel p-3.5 rounded-xl border border-white/10 mb-6">
              <span className="text-sm text-on-surface-variant font-medium">
                Showing <strong className="text-white">{sortedBooks.length}</strong> of {books.length} titles
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-on-surface-variant font-medium">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-background border border-white/10 text-sm text-primary rounded-lg py-1 px-3 outline-none cursor-pointer font-semibold"
                >
                  <option>Newest Arrivals</option>
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Book grid */}
            {sortedBooks.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center border border-white/10 my-8">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-3">
                  menu_book
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">No Books Found</h3>
                <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
                  We couldn't find any books matching your selected filters.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('All Categories');
                    setFilterState({ searchQuery: '', availability: [], format: [], language: 'All Languages' });
                  }}
                  className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all text-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedBooks.map((book, index) => (
                  <div key={book.id} className="animate-fade-in hover:-translate-y-1 transition-transform duration-200" style={{ animationDelay: `${index * 0.05}s` }}>
                    <BookCard book={book} onQuickAction={handleQuickAction} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile floating filter button */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-black font-bold shadow-2xl flex items-center justify-center gap-2 border border-primary/50"
        onClick={() => setShowMobileFilters(true)}
      >
        <span className="material-symbols-outlined">tune</span>
        <span className="text-xs uppercase tracking-wider font-extrabold">Filters</span>
      </button>

      {/* Mobile filter modal */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end">
          <div className="bg-background w-full rounded-t-2xl p-6 border-t border-white/10 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Filter Books</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <BookFilters onFilterChange={handleFilterChange} />
            <button
              className="w-full mt-6 bg-primary text-black font-bold py-3 rounded-xl uppercase text-xs tracking-wider"
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