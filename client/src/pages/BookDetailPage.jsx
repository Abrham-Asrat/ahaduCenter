// src/pages/BookDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBook,
  borrowBook,
  reserveBook,
  fetchBookReviews,
  createBookReview,
} from '../redux/slices/bookSlice';
import Navbar from '../components/common/Navbar';
import BookCoverCard from '../components/book/BookCoverCard';
import BookInfoSection from '../components/book/BookInfoSection';
import BookDetailTabs from '../components/book/BookDetailTabs';
import RelatedBooks from '../components/book/RelatedBooks';
import ReviewsCommentsSection from '../components/common/ReviewsCommentsSection';
import Footer from '../components/common/Footer';

/**
 * BookDetailPage Component
 *
 * Displays a single book's details. Dispatches fetchBook(id) on mount.
 * Wires borrow/reserve buttons to Redux thunks and shows server response message.
 * Wires ReviewsCommentsSection to fetchBookReviews / createBookReview.
 */
const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────────────────────────────
  const { selectedBook: book, reviews, loading, error } = useSelector((s) => s.book);
  const { token, user } = useSelector((s) => s.auth);

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState(null);
  const [actionMessage, setActionMessage] = useState(null); // server response after borrow/reserve
  const [actionError, setActionError] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ── Fetch book and reviews on mount / id change ───────────────────────────────
  useEffect(() => {
    if (id) {
      dispatch(fetchBook(id));
      dispatch(fetchBookReviews({ id, params: { page: 1, limit: 20 } }));
    }
  }, [dispatch, id]);

  // ── Borrow handler ───────────────────────────────────────────────────────────
  const handleBorrow = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setActionError(null);
    try {
      const result = await dispatch(borrowBook(id)).unwrap();
      const msg =
        result?.message ||
        result?.data?.message ||
        `Borrow confirmed! Please pick up your book at the library.`;
      setActionMessage(msg);
      showToast(msg);
    } catch (err) {
      const errMsg = typeof err === 'string' ? err : 'Failed to borrow. Please try again.';
      setActionError(errMsg);
      showToast(errMsg);
    }
  };

  // ── Reserve handler ──────────────────────────────────────────────────────────
  const handleReserve = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setActionError(null);
    try {
      const result = await dispatch(reserveBook(id)).unwrap();
      const msg =
        result?.message ||
        result?.data?.message ||
        `Reservation placed! We'll hold the book for you.`;
      setActionMessage(msg);
      showToast(msg);
    } catch (err) {
      const errMsg = typeof err === 'string' ? err : 'Failed to reserve. Please try again.';
      setActionError(errMsg);
      showToast(errMsg);
    }
  };

  // ── Review submit handler ────────────────────────────────────────────────────
  const handleSubmitReview = async ({ rating, comment }) => {
    await dispatch(createBookReview({ id, payload: { rating, comment } })).unwrap();
  };

  // ── Map Redux book to the shape expected by child components ─────────────────
  // The API returns snake_case/camelCase fields; map to what BookInfoSection expects
  const bookData = book
    ? {
        ...book,
        id: book._id || book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher || 'Ahadu Press',
        year: book.publishedYear || book.year,
        isbn: book.isbn,
        rating: book.rating || 0,
        reviews: book.reviewCount || reviews.length || 0,
        description: book.description,
        availableCopies: book.availableCopies ?? book.available_copies ?? 0,
        location: book.location || 'Main Branch',
        price: book.price || 0,
        coverUrl: book.coverImage || book.coverUrl,
        availability: book.availability,
        format: book.format,
        pages: book.pages,
        language: book.language,
        publicationDate: book.publishedYear
          ? String(book.publishedYear)
          : book.publicationDate || '',
        dimensions: book.dimensions || '',
        about: book.about || '',
        authorInfo: book.authorInfo || '',
        borrowingPolicy: book.borrowingPolicy || 'Standard lending period is 14 days.',
      }
    : null;

  // Map Redux reviews to ReviewsCommentsSection shape
  const mappedReviews = reviews.map((r) => ({
    id: r._id || r.id,
    name: r.user?.name || r.name || 'Ahadu Member',
    avatar:
      r.user?.avatar ||
      r.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.user?.name || 'User')}`,
    rating: r.rating,
    date: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : r.date || '',
    comment: r.comment,
    helpfulCount: r.helpfulCount || 0,
    liked: false,
  }));

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  const DetailSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12 animate-pulse">
      <div className="md:col-span-4">
        <div className="w-full aspect-[3/4] bg-surface-container rounded-2xl" />
      </div>
      <div className="md:col-span-8 flex flex-col gap-6">
        <div className="h-8 bg-surface-container rounded w-2/3" />
        <div className="h-5 bg-surface-container rounded w-1/3" />
        <div className="h-24 bg-surface-container rounded" />
        <div className="h-16 bg-surface-container rounded" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col relative animate-fade-in">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-8 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-sm text-on-surface-variant mb-6 font-medium">
          <a href="/books" className="hover:text-primary transition-colors">Books</a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          {bookData && (
            <>
              <a href="/books" className="hover:text-primary transition-colors">
                {bookData.category || 'Category'}
              </a>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-white font-semibold">{bookData.title}</span>
            </>
          )}
        </div>

        {/* Error banner */}
        {error && !loading && (
          <div className="glass-panel rounded-xl border border-red-500/30 bg-red-500/5 p-5 mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Server action feedback banners */}
        {actionMessage && (
          <div className="glass-panel rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">check_circle</span>
            <p className="text-sm text-primary font-medium">{actionMessage}</p>
          </div>
        )}
        {actionError && (
          <div className="glass-panel rounded-xl border border-red-500/30 bg-red-500/5 p-4 mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-sm text-red-300">{actionError}</p>
          </div>
        )}

        {/* Main two-column layout */}
        {loading && !bookData ? (
          <DetailSkeleton />
        ) : bookData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
              {/* Left column: cover */}
              <div className="md:col-span-4">
                <BookCoverCard book={bookData} />
              </div>

              {/* Right column: info and tabs */}
              <div className="md:col-span-8 flex flex-col gap-6">
                <BookInfoSection
                  book={bookData}
                  onShowToast={showToast}
                  onBorrow={handleBorrow}
                  onReserve={handleReserve}
                />
                <BookDetailTabs book={bookData} />
              </div>
            </div>

            {/* Reader Reviews & Comments */}
            <ReviewsCommentsSection
              title="Reader Reviews & Discussion"
              initialReviews={mappedReviews}
              onSubmitReview={token ? handleSubmitReview : null}
              isAuthenticated={!!token}
            />

            {/* Related books — using books from the store as a simple related list */}
            <RelatedBooks books={[]} />
          </>
        ) : null}
      </main>

      {/* Mobile sticky bottom action bar */}
      {bookData && (
        <div className="md:hidden fixed bottom-0 left-0 w-full glass-panel border-t border-white/10 p-4 z-40 rounded-t-2xl shadow-2xl">
          <div className="flex gap-3">
            <button
              onClick={handleBorrow}
              disabled={loading}
              className="flex-1 bg-primary text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase disabled:opacity-50"
            >
              <span className="material-symbols-outlined">book</span>
              Borrow Now
            </button>
            <button
              onClick={handleReserve}
              disabled={loading}
              className="flex-1 bg-transparent border border-secondary text-secondary py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase disabled:opacity-50"
            >
              <span className="material-symbols-outlined">bookmark_add</span>
              Reserve
            </button>
          </div>
        </div>
      )}

      {/* Add bottom padding for mobile so content isn't hidden */}
      <div className="md:hidden h-28" />

      <Footer />
    </div>
  );
};

export default BookDetailPage;
