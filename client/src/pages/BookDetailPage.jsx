// src/pages/BookDetailPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BookCoverCard from '../components/book/BookCoverCard';
import BookInfoSection from '../components/book/BookInfoSection';
import BookDetailTabs from '../components/book/BookDetailTabs';
import RelatedBooks from '../components/book/RelatedBooks';
import Footer from '../components/common/Footer';

/**
 * BookDetailPage Component
 * 
 * Main page for displaying a single book's details.
 */
const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dummy book data
  const book = {
    id: parseInt(id) || 1,
    title: 'The Architecture of Tomorrow: Building the Void',
    author: 'Dr. Elara Vance',
    publisher: 'Nexus Press',
    year: 2024,
    isbn: '978-1-23456-789-0',
    rating: 4.8,
    reviews: 124,
    description: 'An exploration into the next century of structural design. Dr. Vance delves into the integration of glassmorphic aesthetics, sustainable energy cores, and the psychological impact of deep-space habitats.',
    availableCopies: 3,
    location: 'Level 4, Section B-12',
    price: 24.99,
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    availability: 'Available to Borrow',
    format: 'Hardcover',
    pages: 412,
    language: 'English',
    publicationDate: 'Oct 14, 2024',
    dimensions: '6 x 1.2 x 9 inches',
    about: `Format: Hardcover, 412 pages. Language: English. Publication Date: Oct 14, 2024. Dimensions: 6 x 1.2 x 9 inches.`,
    authorInfo: 'Dr. Elara Vance is a leading visionary in structural macro-engineering. Formerly heading the Global Design Initiative, their work focuses on integrating organic aesthetics with extreme-durable materials.',
    borrowingPolicy: 'Standard lending period is 14 days. Renewals are permitted twice unless the item is reserved by another member. Overdue fees apply at standard institutional rates.',
  };

  // Dummy related books
  const relatedBooks = [
    {
      id: 201,
      title: 'Digital Systems Design',
      author: 'J. K. Thornton',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      price: 29.99,
    },
    {
      id: 202,
      title: 'Quantum Computing Basics',
      author: 'Sarah Chen',
      coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
      price: 34.99,
    },
    {
      id: 203,
      title: 'The Golden Ratio in Design',
      author: 'Marcus Aurelius',
      coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
      price: 19.99,
    },
    {
      id: 204,
      title: 'Urban Futures & Ecosystems',
      author: 'David M. Wright',
      coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
      price: 27.50,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col relative">
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
          <a href="/books" className="hover:text-primary transition-colors">Technology & Engineering</a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-white font-semibold">{book.title}</span>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Left column: cover */}
          <div className="md:col-span-4">
            <BookCoverCard book={book} />
          </div>

          {/* Right column: info and tabs */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <BookInfoSection book={book} onShowToast={showToast} />
            <BookDetailTabs book={book} />
          </div>
        </div>

        {/* Related books */}
        <RelatedBooks books={relatedBooks} />
      </main>

      {/* Mobile sticky bottom action bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full glass-panel border-t border-white/10 p-4 z-40 rounded-t-2xl shadow-2xl">
        <div className="flex gap-3">
          <button
            onClick={() => showToast(`Borrow request submitted for "${book.title}"!`)}
            className="flex-1 bg-primary text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase"
          >
            <span className="material-symbols-outlined">book</span>
            Borrow Now
          </button>
          <button
            onClick={() => showToast(`Reserved place on waitlist for "${book.title}".`)}
            className="flex-1 bg-transparent border border-secondary text-secondary py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase"
          >
            <span className="material-symbols-outlined">bookmark_add</span>
            Reserve
          </button>
        </div>
      </div>

      {/* Add bottom padding for mobile so content isn't hidden */}
      <div className="md:hidden h-28" />

      <Footer />
    </div>
  );
};

export default BookDetailPage;