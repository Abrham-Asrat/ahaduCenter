// src/pages/BookDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
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
 * Uses useParams to get book ID from URL.
 * 
 * Layout:
 * - Breadcrumbs (hidden on mobile)
 * - Two-column: Cover (left) + Info (right) on desktop
 * - Mobile: Cover centered, info below
 * - Tabs (desktop) / Accordions (mobile)
 * - Related books carousel
 * - Sticky bottom action bar (mobile only)
 */
const BookDetailPage = () => {
  const { id } = useParams();

  // Dummy book data
  const book = {
    id: parseInt(id),
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
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5o355OqHT96LU45ge-auf_AYpDlsg-_1mFGtJ2TwwWEyE7kdbHGNY5_GsZ4gmfvFEjey3oVYf5avZ9Wb1C-DzDg8ZuikQO7nJqQQWSlvIeyRnGvsfDueb95rDdSB-5F_3KkBbmxh32oQZXYPydTe9HjyP8ESQT72o4ebeKxfb7lR5-d9zIz69fLqMgcAI0DFf9nLIeOfgs9y1N8V5wLsGwhBeHsKZsKYD1IUxtkY8x5UZpq1WQg5sew',
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
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf-tHwKufhY6IkfH2h4Rx82zYD7BRrmqBSX_Rw3oRD5HD4deODsLPNWwPYRUPP310_PwQVm2PeqQSLleO4hMGnrgw7oYrKn3bi_bElzXarZlx-4FALajcyt-IiR8-Ykz3jbXZoRkccRKmQHO_LKYyV6Czavw9VH8OxfMtsazzt7wovSZt0kCkk3XXtFpiWMPzSTlnyQu-5hj-kC-8d_4dmGarI6EPVaZvphLb2kbYnUzwMzTu76qrS8Q',
      price: 29.99,
    },
    {
      id: 202,
      title: 'Quantum Computing Basics',
      author: 'Sarah Chen',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANYbTqizhNePFWGX3daocu1tDHPkCdDEHFdLz5V74JB4yl6NyNAw0R3cgPr30kFRSjwnw2CSTyB_6pxAXN8lcBfwNu0zD9pOhPVygijek2cstGkq9G9Sk334KCCGb4lCxGjkHTDIdugC84O3A19wf-L9_PWXPeIDgeWNSC8gsPlxvOl5qI2AXq_fEAoK_tvY4bZiFLPx82oUEaKDOGmp44PX4wXkLp2xKec4l0jZSIaidTyVCBTNNN1g',
      price: 34.99,
    },
    {
      id: 203,
      title: 'The Golden Ratio',
      author: 'Marcus Aurelius',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBJ7oYB0lhoW6pYtbdBBkNrVGDfqhVarONqaBoBOhkoU9W-PJBEiOhlNpKPiKfMQgYgQdV_Zm4b7IdXI0bHQfHArYf_ycQf1ytNsfKPN7lZ7l58loRsKT3QBo3uhN1GHoeqdD80fuoxtSx6D-GtYX34oMq2LOvZCR2shRJ-b-kOSUvBy3dLoEdO67ZyU-kkD9zG9Cw9GOfkyUzxBCGCKRRVchD-L9z0A-ZMARk5f_paJTpUI19MBsmMQ',
      price: 19.99,
    },
    {
      id: 204,
      title: 'Urban Futures',
      author: 'David M. Wright',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeKXEZ4Tg7_yDFeEimx0im7HAsRBB0Equ30X9mzkoP0hccXj4bbzrvMRz48mKVmFRSDJFi0D8bFpHzI_J13bKW6FPXZ-IPepxDVFctd6elK5DVpiFpYF2oSsIeN2ZZErtCPuu1Xr4NDaI3ZI1yeiIae0sC3ERJCYghaAJtOd72lI-bcUTwSPS-yOkFWSEl-ZFvL1jFrUhbZ9lcHJ26eEojM_eJ2hjB1vjFQ5eAFwO9--oQUp-zVh-iEA',
      price: 27.50,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-sm text-on-surface-variant mb-6">
          <a href="/books" className="hover:text-primary transition-colors">Books</a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <a href="#" className="hover:text-primary transition-colors">Technology & Engineering</a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-white">{book.title}</span>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Left column: cover */}
          <div className="md:col-span-4">
            <BookCoverCard book={book} />
          </div>

          {/* Right column: info and tabs */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <BookInfoSection book={book} />
            <BookDetailTabs book={book} />
          </div>
        </div>

        {/* Related books */}
        <RelatedBooks books={relatedBooks} />
      </main>

      {/* Mobile sticky bottom action bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full glass-panel border-t border-white/10 p-4 z-40 rounded-t-xl shadow-lg">
        <div className="flex flex-col gap-3">
          <button className="bg-primary text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">book</span>
            Borrow Now
          </button>
          <button className="bg-transparent border border-secondary text-secondary py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">bookmark_add</span>
            Reserve
          </button>
        </div>
      </div>

      {/* Add bottom padding for mobile so content isn't hidden */}
      <div className="md:hidden h-32" />

      <Footer />
    </div>
  );
};

export default BookDetailPage;