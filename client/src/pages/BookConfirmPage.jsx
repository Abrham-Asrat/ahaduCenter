// src/pages/BookConfirmPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBook } from '../redux/slices/bookSlice';
import { bookService } from '../services/bookService';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * BookConfirmPage Component
 *
 * Handles the confirmation flow for book borrow/reserve actions.
 *
 * URL params:
 *   ?action=borrow|reserve   — action to perform
 *   ?id=<bookId>             — MongoDB id of the book
 *
 * State machine:
 *   idle     → user reviews details, clicks Confirm
 *   loading  → API call in-flight (skeleton/spinner)
 *   success  → server-returned details shown (due date / reservation expiry)
 *   error    → error message shown, form stays visible for retry
 */
const BookConfirmPage = () => {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action') || 'borrow';
  const bookId = searchParams.get('id') || '';

  const dispatch = useDispatch();
  const { selectedBook, loading: bookLoading } = useSelector((s) => s.book);

  // ── Page-level state ─────────────────────────────────────────────────────────
  const [confirmState, setConfirmState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [serverResult, setServerResult] = useState(null);   // server response payload
  const [confirmError, setConfirmError] = useState(null);   // error string

  // ── Fetch book on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    if (bookId) {
      dispatch(fetchBook(bookId));
    }
  }, [dispatch, bookId]);

  // Use the book from Redux store, falling back to a stub if not yet loaded
  const book = selectedBook
    ? {
        id: selectedBook._id || selectedBook.id,
        title: selectedBook.title,
        author: selectedBook.author,
        coverUrl: selectedBook.coverImage || selectedBook.coverUrl || '',
        price: selectedBook.price || 0,
        availability: selectedBook.availability,
      }
    : {
        id: bookId,
        title: 'Loading…',
        author: '',
        coverUrl: '',
        price: 0,
        availability: '',
      };

  // ── Labels ───────────────────────────────────────────────────────────────────
  const actionTitle = {
    borrow: 'Confirm Borrowing',
    reserve: 'Confirm Reservation',
  }[action] || 'Confirm';

  const successTitle = {
    borrow: 'Borrowing Confirmed!',
    reserve: 'Reservation Placed!',
  }[action] || 'Success!';

  // ── Handle confirm ───────────────────────────────────────────────────────────
  const handleConfirm = async (e) => {
    e.preventDefault();
    setConfirmState('loading');
    setConfirmError(null);

    try {
      let result;
      if (action === 'borrow') {
        result = await bookService.borrowBook(book.id);
      } else {
        result = await bookService.reserveBook(book.id);
      }
      setServerResult(result);
      setConfirmState('success');
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Something went wrong. Please try again.';
      setConfirmError(msg);
      setConfirmState('error');
    }
  };

  const handleRetry = () => {
    setConfirmState('idle');
    setConfirmError(null);
    setServerResult(null);
  };

  // ── Loading skeleton (while book details are being fetched) ───────────────────
  const PageSkeleton = () => (
    <div className="w-full max-w-[520px] animate-pulse">
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="h-7 bg-surface-container rounded w-1/2" />
        </div>
        <div className="p-6 flex gap-4 items-center bg-surface-container-low/50">
          <div className="w-20 h-28 bg-surface-container rounded-lg shrink-0" />
          <div className="flex-1 flex flex-col gap-3">
            <div className="h-5 bg-surface-container rounded w-3/4" />
            <div className="h-4 bg-surface-container rounded w-1/2" />
          </div>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="h-10 bg-surface-container rounded" />
          <div className="h-10 bg-surface-container rounded" />
          <div className="h-10 bg-surface-container rounded" />
        </div>
      </div>
    </div>
  );

  // ── Success state ─────────────────────────────────────────────────────────────
  if (confirmState === 'success') {
    // Extract server-returned details (field names vary by backend)
    const dueDate =
      serverResult?.dueDate ||
      serverResult?.data?.dueDate ||
      serverResult?.borrowing?.dueDate ||
      null;
    const expiryDate =
      serverResult?.expiryDate ||
      serverResult?.data?.expiryDate ||
      serverResult?.reservation?.expiresAt ||
      null;
    const pickupLocation =
      serverResult?.pickupLocation ||
      serverResult?.data?.pickupLocation ||
      'Ahadu Center – Main Branch';
    const confirmationId =
      serverResult?._id ||
      serverResult?.data?._id ||
      serverResult?.borrowing?._id ||
      serverResult?.reservation?._id ||
      null;

    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="glass-panel rounded-xl p-8 flex flex-col items-center text-center">
              {/* Check icon */}
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-white mb-3">{successTitle}</h1>

              {/* Server-returned details */}
              <div className="w-full bg-surface-container/50 rounded-xl border border-white/10 p-4 mb-6 text-left flex flex-col gap-3">
                {confirmationId && (
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-xs text-on-surface-variant uppercase tracking-wider">Confirmation ID</span>
                    <span className="text-xs font-mono text-primary">{confirmationId}</span>
                  </div>
                )}
                {action === 'borrow' && dueDate && (
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-on-surface-variant text-sm">Due Date</span>
                    <span className="text-white font-bold text-sm">
                      {new Date(dueDate).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {action === 'reserve' && expiryDate && (
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-on-surface-variant text-sm">Reservation Expires</span>
                    <span className="text-white font-bold text-sm">
                      {new Date(expiryDate).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1">
                  <span className="text-on-surface-variant text-sm">Pickup Location</span>
                  <span className="text-white font-semibold text-sm text-right max-w-[60%]">{pickupLocation}</span>
                </div>
              </div>

              {/* Fallback message when no structured data */}
              {!dueDate && !expiryDate && (
                <p className="text-on-surface-variant text-sm mb-4">
                  {action === 'borrow'
                    ? 'Your borrowing request has been confirmed.'
                    : "Your reservation is placed. We'll hold the book for you."}
                </p>
              )}

              {/* Actions */}
              <div className="w-full flex flex-col gap-3">
                <Link
                  to="/borrowing-history"
                  className="w-full py-3 rounded-lg text-xs uppercase tracking-wider text-primary border border-primary hover:bg-primary/10 transition-colors text-center"
                >
                  View Borrowing History
                </Link>
                <Link
                  to="/books"
                  className="w-full py-3 rounded-lg text-xs uppercase tracking-wider text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors text-center"
                >
                  Back to Book Center
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        {/* Show skeleton while the book is being fetched initially */}
        {bookLoading && !selectedBook ? (
          <PageSkeleton />
        ) : (
          <div className="w-full max-w-[520px]">
            {/* Breadcrumbs */}
            <nav className="mb-4 text-sm text-on-surface-variant flex items-center gap-1">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <Link to="/books" className="hover:text-primary">Books</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="truncate max-w-[140px]">{book.title}</span>
            </nav>

            {/* Error banner (keep form visible for retry) */}
            {confirmState === 'error' && confirmError && (
              <div className="glass-panel rounded-xl border border-red-500/30 bg-red-500/5 p-4 mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-400">error</span>
                  <p className="text-sm text-red-300">{confirmError}</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/40 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Confirmation card */}
            <div className="glass-panel rounded-xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/5">
                <h1 className="text-2xl font-bold text-white">{actionTitle}</h1>
              </div>

              {/* Book summary */}
              <div className="p-6 bg-surface-container-low/50 flex gap-4 items-center">
                <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden border border-white/10">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant/40 text-3xl">
                        menu_book
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{book.title}</h2>
                  <p className="text-on-surface-variant">{book.author}</p>
                  {book.availability && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs uppercase text-primary capitalize">{book.availability}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details section */}
              <form onSubmit={handleConfirm}>
                <div className="p-6 flex flex-col gap-4 border-t border-white/5">
                  {action === 'borrow' && (
                    <>
                      <DetailRow label="Loan Period" value="14 Days" />
                      <DetailRow label="Due Date" value="14 days from pickup" bold />
                      <DetailRow
                        label="Pickup Location"
                        value="Ahadu Center – Main Branch"
                        icon="location_on"
                      />
                      <div className="p-4 bg-surface-container/30 rounded-lg border border-white/5 flex gap-3 items-start">
                        <span className="material-symbols-outlined text-on-surface-variant text-lg mt-0.5">info</span>
                        <div>
                          <p className="text-sm text-on-surface-variant">Renewal Policy</p>
                          <p className="text-sm text-on-surface-variant/75 mt-1">
                            May be renewed once if no pending reservations. Late fees apply at $0.50 per day.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {action === 'reserve' && (
                    <>
                      <DetailRow label="Hold Period" value="3 Days from availability" bold />
                      <DetailRow
                        label="Pickup Location"
                        value="Main Branch – Desk A"
                        icon="location_on"
                      />
                      <div className="p-4 bg-surface-container-low rounded-lg border border-white/5 flex gap-3 items-start">
                        <span className="material-symbols-outlined text-secondary text-lg mt-0.5">info</span>
                        <p className="text-sm text-on-surface-variant">
                          Items are held for 3 days from the reservation date. Unclaimed items will be returned to circulation.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="p-6 flex items-center justify-between border-t border-white/5 bg-surface-container-highest/20">
                  <Link to="/books" className="text-on-surface-variant hover:text-white transition-colors px-4 py-2">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={confirmState === 'loading' || bookLoading}
                    className="bg-primary text-black font-semibold px-8 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {confirmState === 'loading' ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        Processing…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">check_circle</span>
                        {action === 'reserve' ? 'Confirm Reservation' : 'Confirm Borrow'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

/**
 * DetailRow — label/value row with optional icon and bold value.
 */
const DetailRow = ({ label, value, bold, icon }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5">
    <span className="text-on-surface-variant">{label}</span>
    <div className="flex items-center gap-2 text-right">
      {icon && <span className="material-symbols-outlined text-primary text-sm">{icon}</span>}
      <span className={`text-white ${bold ? 'font-bold' : 'font-semibold'}`}>{value}</span>
    </div>
  </div>
);

export default BookConfirmPage;
