// src/pages/BorrowingHistoryPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

/**
 * BorrowingHistoryPage Component
 * 
 * Displays user's borrowed books with status, due dates, and fees.
 */
const BorrowingHistoryPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Borrowing data
  const [borrowings, setBorrowings] = useState([
    {
      id: 1,
      title: 'Quantum Mechanics & Design',
      author: 'Dr. Elena Vance',
      coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
      borrowDate: 'Oct 12, 2024',
      dueDate: 'Oct 26, 2024',
      status: 'Active',
      renewalsLeft: 1,
    },
    {
      id: 2,
      title: 'The Architecture of Silence',
      author: 'Marcus Thorne',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      borrowDate: 'Sep 01, 2024',
      dueDate: 'Sep 15, 2024',
      status: 'Overdue',
      renewalsLeft: 0,
      fee: '$12.50',
    },
    {
      id: 3,
      title: 'Modern Typographic Principles',
      author: 'Sarah Jenkins',
      coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
      borrowDate: 'Aug 10, 2024',
      dueDate: 'Aug 22, 2024',
      returnDate: 'Aug 22, 2024',
      status: 'Returned',
      renewalsLeft: 0,
    },
  ]);

  const filters = ['All', 'Currently Borrowed', 'Overdue', 'Returned'];

  const filteredBorrowings = activeFilter === 'All'
    ? borrowings
    : borrowings.filter((b) => {
      if (activeFilter === 'Currently Borrowed') return b.status === 'Active';
      return b.status === activeFilter;
    });

  const totalFees = borrowings.reduce((sum, b) => {
    if (b.fee) return sum + parseFloat(b.fee.replace('$', ''));
    return sum;
  }, 0);

  const handleReturn = (id, title) => {
    setBorrowings(borrowings.map(b => b.id === id ? { ...b, status: 'Returned', returnDate: 'Today' } : b));
    showToast(`"${title}" returned successfully! Thank you.`);
  };

  const handleRenew = (id, title) => {
    setBorrowings(borrowings.map(b => b.id === id ? { ...b, dueDate: 'Nov 09, 2024', renewalsLeft: b.renewalsLeft - 1 } : b));
    showToast(`Lending period renewed for "${title}". New due date: Nov 09, 2024.`);
  };

  const handlePayFees = () => {
    setBorrowings(borrowings.map(b => ({ ...b, fee: null })));
    showToast('Outstanding fees paid in full!');
  };

  const handleBorrowAgain = (title) => {
    showToast(`Borrow request for "${title}" resubmitted!`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-primary/15 text-primary border-primary/20';
      case 'Overdue':
        return 'bg-error/15 text-error border-error/20';
      case 'Returned':
        return 'bg-surface-variant text-on-surface-variant border-white/10';
      default:
        return 'bg-white/5 text-on-surface-variant border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Borrowing History</h1>
            <p className="text-lg text-on-surface-variant">Track your borrowed books, due dates, and return status.</p>
          </div>
          <button
            onClick={() => showToast('Standard borrowing policy: 14 days lending period, 2 renewals permitted.')}
            className="text-secondary hover:text-secondary-fixed transition-colors text-xs uppercase tracking-wider flex items-center gap-2 font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">policy</span>
            Borrowing Policy
          </button>
        </header>

        {/* Overdue warning */}
        {totalFees > 0 && (
          <div className="glass-panel rounded-2xl p-6 mb-8 border-l-4 border-l-error flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-error">warning</span>
              <div>
                <h3 className="text-xl font-bold text-white">Outstanding Fees</h3>
                <p className="text-on-surface-variant text-sm">You have overdue items with pending library fees.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-3xl font-extrabold text-error">${totalFees.toFixed(2)}</span>
              <button
                onClick={handlePayFees}
                className="bg-primary text-black px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
              >
                Pay Fees
              </button>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${activeFilter === filter
                ? 'bg-primary text-black font-extrabold shadow-lg'
                : 'glass-panel text-on-surface-variant border border-white/10 hover:border-primary hover:text-primary'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredBorrowings.length === 0 ? (
          <div className="glass-panel rounded-2xl text-center py-16 border border-white/10">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">menu_book</span>
            <h2 className="text-2xl font-bold text-white mt-4">No borrowing history</h2>
            <p className="text-on-surface-variant mt-2 text-sm">When you borrow books, they'll appear here.</p>
          </div>
        ) : (
          /* Borrowing cards */
          <div className="flex flex-col gap-6">
            {filteredBorrowings.map((borrowing) => (
              <div
                key={borrowing.id}
                className={`glass-panel rounded-2xl p-6 flex flex-col sm:flex-row gap-6 transition-all duration-300 border border-white/10 ${borrowing.status === 'Returned' ? 'opacity-70 hover:opacity-100' : ''
                  }`}
              >
                {/* Book cover */}
                <div className={`w-24 sm:w-32 flex-shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-lg ${borrowing.status === 'Returned' ? 'grayscale' : ''
                  }`}>
                  <img src={borrowing.coverUrl} alt={borrowing.title} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-white">{borrowing.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 border ${getStatusBadge(borrowing.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${borrowing.status === 'Active' ? 'bg-primary' :
                          borrowing.status === 'Overdue' ? 'bg-error' : 'bg-on-surface-variant'
                          }`} />
                        {borrowing.status}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm mb-4 font-medium">By {borrowing.author}</p>
                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                      <div>
                        <span className="block text-xs uppercase font-bold text-on-surface-variant/70 mb-1">Borrow Date</span>
                        <span className="text-white font-semibold">{borrowing.borrowDate}</span>
                      </div>
                      {borrowing.returnDate ? (
                        <div>
                          <span className="block text-xs uppercase font-bold text-on-surface-variant/70 mb-1">Returned On</span>
                          <span className="text-on-surface-variant font-semibold">{borrowing.returnDate}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="block text-xs uppercase font-bold text-on-surface-variant/70 mb-1">Due Date</span>
                          <span className={`font-bold ${borrowing.status === 'Overdue' ? 'text-error' : 'text-white'}`}>
                            {borrowing.dueDate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4 justify-end">
                    <button
                      onClick={() => navigate(`/books/${borrowing.id}`)}
                      className="p-2.5 rounded-xl glass-panel text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    {borrowing.status === 'Active' && (
                      <>
                        <button
                          onClick={() => handleReturn(borrowing.id, borrowing.title)}
                          className="border border-secondary text-secondary px-4 py-2 rounded-xl hover:bg-secondary/10 transition-all text-xs font-bold uppercase cursor-pointer"
                        >
                          Return
                        </button>
                        {borrowing.renewalsLeft > 0 && (
                          <button
                            onClick={() => handleRenew(borrowing.id, borrowing.title)}
                            className="border border-primary text-primary px-4 py-2 rounded-xl hover:bg-primary/10 transition-all text-xs font-bold uppercase cursor-pointer"
                          >
                            Renew ({borrowing.renewalsLeft} left)
                          </button>
                        )}
                      </>
                    )}
                    {borrowing.status === 'Overdue' && (
                      <button
                        onClick={() => handleReturn(borrowing.id, borrowing.title)}
                        className="border border-secondary text-secondary px-4 py-2 rounded-xl hover:bg-secondary/10 transition-all text-xs font-bold uppercase cursor-pointer"
                      >
                        Return
                      </button>
                    )}
                    {borrowing.status === 'Returned' && (
                      <button
                        onClick={() => handleBorrowAgain(borrowing.title)}
                        className="border border-primary text-primary px-4 py-2 rounded-xl hover:bg-primary/10 transition-all text-xs font-bold uppercase cursor-pointer"
                      >
                        Borrow Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BorrowingHistoryPage;