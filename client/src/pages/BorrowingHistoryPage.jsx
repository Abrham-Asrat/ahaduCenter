// src/pages/BorrowingHistoryPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * BorrowingHistoryPage Component
 * 
 * Displays user's borrowed books with status, due dates, and fees.
 * 
 * Features:
 * - Overdue warning card with outstanding fees
 * - Filter tabs: All, Currently Borrowed, Overdue, Returned
 * - Borrowing cards with book cover, title, author, dates, status
 * - Action buttons: Renew, Return, Details, Borrow Again
 * - Load Past History button
 * 
 * State:
 * - activeFilter: Currently selected filter
 * - borrowings: Array of borrowing record objects
 */
const BorrowingHistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  // Borrowing data
  const borrowings = [
    {
      id: 1,
      title: 'Quantum Mechanics & Design',
      author: 'Dr. Elena Vance',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM0vgkkbhESaeowGUK3ilvcruHPrpgS9FF6i2ntvcCs8XevQDM36Esh-HoKQzAhHTgCL7Sl3I00qAE69ksWsraWnsRq-PbYOZ5XwLiHwZq-bqVzjYBsSVkSymEC3KnGMjWeq7X-ldVKZsP_Ij-x1FQo5k0tRqKODqO2JhTguHKvoe79fLNBA5V6KrETPaRWcDB_mSq5St0_d1ePIsss0VlPdTkwLFvINrkRYI8gFnFwllwMRzyI8rfWg',
      borrowDate: 'Oct 12, 2024',
      dueDate: 'Oct 26, 2024',
      status: 'Active',
      renewalsLeft: 1,
    },
    {
      id: 2,
      title: 'The Architecture of Silence',
      author: 'Marcus Thorne',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvqlshd7EMaj51ChTYfSofl8WzXrBCo50cw8kEVX2YyqihwHI-sdnTLz4_IIcAehz4p9bJDJWeKCeWwv4dFQrrYGaiLtMa_mNyDfojvzwmlMJGqraTlhvdL1uTyjfhgzGLwHlQoo-d2vsw0PH767v2wzvkUC28ogWuZV1kLHPtazMWzspKqfnStXOifuDv5sBsZTg79NaQ7xjSrSyslvARm66rcGTi9CipGb6PtCNnsRk2WyXjtWQFvw',
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
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLB7CHCC3VUmUsVIoiMFLFAgfQ3nwTm_Fi0bAZ03F6xT1-YIHDVIuoTv52F00Y6LGsscrxwhbYcVPq87k89uUDicN8yOarrdBFYFgbafb3009AmL7mds7jRy-oLRu3kL7GseeOdILD0ZdhuQ71_JFeMl3gfVFlUk1ikxQ1eJkmAf55z8cqNPlsQqAnJpiT12pbClyXRHPnSyCorVaLuEI5ya90kRpJFQeanmrijuIzM66Ex4WjCksfrg',
      borrowDate: 'Aug 10, 2024',
      dueDate: 'Aug 22, 2024',
      returnDate: 'Aug 22, 2024',
      status: 'Returned',
      renewalsLeft: 0,
    },
  ];

  // Filter tabs
  const filters = ['All', 'Currently Borrowed', 'Overdue', 'Returned'];

  // Filter borrowings
  const filteredBorrowings = activeFilter === 'All'
    ? borrowings
    : borrowings.filter((b) => {
      if (activeFilter === 'Currently Borrowed') return b.status === 'Active';
      return b.status === activeFilter;
    });

  // Calculate total fees
  const totalFees = borrowings.reduce((sum, b) => {
    if (b.fee) return sum + parseFloat(b.fee.replace('$', ''));
    return sum;
  }, 0);

  // Status badge styles
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
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Borrowing History</h1>
            <p className="text-lg text-on-surface-variant">Track your borrowed books, due dates, and return status.</p>
          </div>
          <button className="text-secondary hover:text-secondary-fixed transition-colors text-xs uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">policy</span>
            Borrowing Policy
          </button>
        </header>

        {/* Overdue warning */}
        {totalFees > 0 && (
          <div className="glass-panel rounded-xl p-6 mb-8 border-l-4 border-l-error flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-error">warning</span>
              <div>
                <h3 className="text-xl font-bold text-white">Outstanding Fees</h3>
                <p className="text-on-surface-variant">You have 1 overdue item. Please settle the fees to continue borrowing.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-3xl font-bold text-error">${totalFees.toFixed(2)}</span>
              <button className="bg-primary text-black px-6 py-3 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
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
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all ${activeFilter === filter
                  ? 'bg-primary text-black font-semibold'
                  : 'bg-transparent text-on-surface-variant border border-white/10 hover:border-primary hover:text-primary'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredBorrowings.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">menu_book</span>
            <h2 className="text-2xl font-bold text-white mt-4">No borrowing history</h2>
            <p className="text-on-surface-variant mt-2">When you borrow books, they'll appear here.</p>
          </div>
        ) : (
          /* Borrowing cards */
          <div className="flex flex-col gap-6">
            {filteredBorrowings.map((borrowing) => (
              <div
                key={borrowing.id}
                className={`glass-panel rounded-xl p-6 flex flex-col sm:flex-row gap-6 transition-all duration-300 ${borrowing.status === 'Returned' ? 'opacity-70 hover:opacity-100' : ''
                  }`}
              >
                {/* Book cover */}
                <div className={`w-24 sm:w-32 flex-shrink-0 aspect-[2/3] rounded overflow-hidden ${borrowing.status === 'Returned' ? 'grayscale' : ''
                  }`}>
                  <img src={borrowing.coverUrl} alt={borrowing.title} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-white">{borrowing.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs uppercase flex items-center gap-1 border ${getStatusBadge(borrowing.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${borrowing.status === 'Active' ? 'bg-primary' :
                            borrowing.status === 'Overdue' ? 'bg-error' : 'bg-on-surface-variant'
                          }`} />
                        {borrowing.status}
                      </span>
                    </div>
                    <p className="text-on-surface-variant mb-4">By {borrowing.author}</p>
                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                      <div>
                        <span className="block text-xs uppercase text-on-surface-variant/70 mb-1">Borrow Date</span>
                        <span className="text-white">{borrowing.borrowDate}</span>
                      </div>
                      {borrowing.returnDate ? (
                        <div>
                          <span className="block text-xs uppercase text-on-surface-variant/70 mb-1">Returned On</span>
                          <span className="text-on-surface-variant">{borrowing.returnDate}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="block text-xs uppercase text-on-surface-variant/70 mb-1">Due Date</span>
                          <span className={borrowing.status === 'Overdue' ? 'text-error' : 'text-white'}>
                            {borrowing.dueDate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4 justify-end">
                    <button className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-white transition-colors" title="View Details">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                    {borrowing.status === 'Active' && (
                      <>
                        <button className="border border-secondary text-secondary px-4 py-2 rounded-lg hover:bg-secondary/10 transition-all text-xs uppercase">
                          Return
                        </button>
                        {borrowing.renewalsLeft > 0 && (
                          <button className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-all text-xs uppercase">
                            Renew ({borrowing.renewalsLeft} left)
                          </button>
                        )}
                      </>
                    )}
                    {borrowing.status === 'Overdue' && (
                      <button className="border border-secondary text-secondary px-4 py-2 rounded-lg hover:bg-secondary/10 transition-all text-xs uppercase">
                        Return
                      </button>
                    )}
                    {borrowing.status === 'Returned' && (
                      <button className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-all text-xs uppercase">
                        Borrow Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {filteredBorrowings.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button className="border border-white/20 text-white px-8 py-2 rounded-full hover:bg-white/5 transition-colors text-sm">
              Load Past History
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BorrowingHistoryPage;