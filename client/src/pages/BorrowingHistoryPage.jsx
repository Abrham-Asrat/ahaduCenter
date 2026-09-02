// src/pages/BorrowingHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';

/**
 * BorrowingHistoryPage Component
 * 
 * Displays user's borrowed books with status, due dates, and fees.
 */
const BorrowingHistoryPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchBorrowings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getBorrowingHistory();
      // data may be wrapped or a direct array
      const list = Array.isArray(data) ? data : (data?.borrowings ?? []);
      setBorrowings(list);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to load borrowing history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await userService.getBorrowingHistory();
        if (!cancelled) {
          const list = Array.isArray(data) ? data : (data?.borrowings ?? []);
          setBorrowings(list);
        }
      } catch (err) {
        if (!cancelled) {
          setError(typeof err === 'string' ? err : 'Failed to load borrowing history.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const filters = ['All', 'Currently Borrowed', 'Overdue', 'Returned'];

  const filteredBorrowings = activeFilter === 'All'
    ? borrowings
    : borrowings.filter((b) => {
        if (activeFilter === 'Currently Borrowed') return b.status === 'Active';
        return b.status === activeFilter;
      });

  const totalFees = borrowings.reduce((sum, b) => {
    if (b.fee) {
      const numericFee = typeof b.fee === 'number' ? b.fee : parseFloat(String(b.fee).replace('$', '')) || 0;
      return sum + numericFee;
    }
    return sum;
  }, 0);

  const handleReturn = async (id, title) => {
    setActionLoadingId(id);
    try {
      const updatedRecord = await userService.returnBook(id);
      setBorrowings((prev) =>
        prev.map((b) => {
          const bId = b._id || b.id;
          if (bId === id) {
            return {
              ...b,
              status: updatedRecord?.status ?? 'Returned',
              returnDate: updatedRecord?.returnDate ?? new Date().toISOString(),
            };
          }
          return b;
        })
      );
      showToast(`"${title}" returned successfully! Thank you.`);
    } catch (err) {
      showToast(typeof err === 'string' ? err : 'Failed to return book. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRenew = async (id, title) => {
    setActionLoadingId(id);
    try {
      const updatedRecord = await userService.renewBorrowing(id);
      setBorrowings((prev) =>
        prev.map((b) => {
          const bId = b._id || b.id;
          if (bId === id) {
            return {
              ...b,
              dueDate: updatedRecord?.dueDate ?? b.dueDate,
              renewalsLeft: updatedRecord?.renewalsLeft ?? (b.renewalsLeft - 1),
              status: updatedRecord?.status ?? b.status,
            };
          }
          return b;
        })
      );
      const formattedDueDate = updatedRecord?.dueDate
        ? new Date(updatedRecord.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'new due date';
      showToast(`Lending period renewed for "${title}". New due date: ${formattedDueDate}.`);
    } catch (err) {
      showToast(typeof err === 'string' ? err : 'Failed to renew borrowing. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePayFees = () => {
    setBorrowings(borrowings.map((b) => ({ ...b, fee: 0 })));
    showToast('Outstanding fees paid in full!');
  };

  const handleBorrowAgain = (title, bookId) => {
    if (bookId) {
      navigate(`/books/${bookId}`);
    } else {
      showToast(`Redirecting to book page for "${title}"...`);
      navigate('/books');
    }
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Navbar /> 
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative animate-fade-in">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary">info</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 w-full">
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

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
            <button
              onClick={fetchBorrowings}
              className="ml-auto text-xs underline font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

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
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-primary text-black font-extrabold shadow-lg'
                  : 'glass-panel text-on-surface-variant border border-white/10 hover:border-primary hover:text-primary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row gap-6 animate-pulse">
                <div className="w-24 sm:w-32 aspect-[2/3] rounded-xl bg-white/10" />
                <div className="flex-grow flex flex-col gap-3">
                  <div className="h-6 bg-white/10 rounded w-1/3" />
                  <div className="h-4 bg-white/10 rounded w-1/4" />
                  <div className="h-10 bg-white/10 rounded w-1/2 mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBorrowings.length === 0 ? (
          /* Empty state */
          <div className="glass-panel rounded-2xl text-center py-16 border border-white/10">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">menu_book</span>
            <h2 className="text-2xl font-bold text-white mt-4">No borrowing history</h2>
            <p className="text-on-surface-variant mt-2 text-sm">When you borrow books, they'll appear here.</p>
          </div>
        ) : (
          /* Borrowing cards */
          <div className="overflow-x-auto">
            <div className="flex flex-col gap-6">
              {filteredBorrowings.map((borrowing) => {
                const id = borrowing._id || borrowing.id;
                const bookId = borrowing.bookId?._id || borrowing.bookId;
                const cover = borrowing.coverUrl || borrowing.bookId?.coverUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80';
                const title = borrowing.title || borrowing.bookId?.title || 'Untitled Book';
                const author = borrowing.author || borrowing.bookId?.author || 'Unknown Author';
                const isActionPending = actionLoadingId === id;

                return (
                  <div
                    key={id}
                    className={`glass-panel rounded-2xl p-6 flex flex-col sm:flex-row gap-6 transition-all duration-300 border border-white/10 ${
                      borrowing.status === 'Returned' ? 'opacity-70 hover:opacity-100' : ''
                    }`}
                  >
                    {/* Book cover */}
                    <div className={`w-24 sm:w-32 flex-shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-lg ${
                      borrowing.status === 'Returned' ? 'grayscale' : ''
                    }`}>
                      <img src={cover} alt={title} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-xl font-bold text-white">{title}</h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 border ${getStatusBadge(borrowing.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              borrowing.status === 'Active' ? 'bg-primary' :
                              borrowing.status === 'Overdue' ? 'bg-error' : 'bg-on-surface-variant'
                            }`} />
                            {borrowing.status}
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-sm mb-4 font-medium">By {author}</p>
                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                          <div>
                            <span className="block text-xs uppercase font-bold text-on-surface-variant/70 mb-1">Borrow Date</span>
                            <span className="text-white font-semibold">{formatDate(borrowing.borrowDate)}</span>
                          </div>
                          {borrowing.returnDate ? (
                            <div>
                              <span className="block text-xs uppercase font-bold text-on-surface-variant/70 mb-1">Returned On</span>
                              <span className="text-on-surface-variant font-semibold">{formatDate(borrowing.returnDate)}</span>
                            </div>
                          ) : (
                            <div>
                              <span className="block text-xs uppercase font-bold text-on-surface-variant/70 mb-1">Due Date</span>
                              <span className={`font-bold ${borrowing.status === 'Overdue' ? 'text-error' : 'text-white'}`}>
                                {formatDate(borrowing.dueDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4 justify-end items-center">
                        <button
                          onClick={() => navigate(`/books/${bookId || id}`)}
                          className="p-2.5 rounded-xl glass-panel text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>

                        {borrowing.status === 'Active' && (
                          <>
                            <button
                              onClick={() => handleReturn(id, title)}
                              disabled={isActionPending}
                              className="border border-secondary text-secondary px-4 py-2 rounded-xl hover:bg-secondary/10 transition-all text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                            >
                              {isActionPending ? 'Returning…' : 'Return'}
                            </button>
                            {borrowing.renewalsLeft > 0 && (
                              <button
                                onClick={() => handleRenew(id, title)}
                                disabled={isActionPending}
                                className="border border-primary text-primary px-4 py-2 rounded-xl hover:bg-primary/10 transition-all text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                              >
                                {isActionPending ? 'Renewing…' : `Renew (${borrowing.renewalsLeft} left)`}
                              </button>
                            )}
                          </>
                        )}

                        {borrowing.status === 'Overdue' && (
                          <button
                            onClick={() => handleReturn(id, title)}
                            disabled={isActionPending}
                            className="border border-secondary text-secondary px-4 py-2 rounded-xl hover:bg-secondary/10 transition-all text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
                          >
                            {isActionPending ? 'Returning…' : 'Return'}
                          </button>
                        )}

                        {borrowing.status === 'Returned' && (
                          <button
                            onClick={() => handleBorrowAgain(title, bookId)}
                            className="border border-primary text-primary px-4 py-2 rounded-xl hover:bg-primary/10 transition-all text-xs font-bold uppercase cursor-pointer"
                          >
                            Borrow Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
    </>
  );
};

export default BorrowingHistoryPage;