// src/components/book/BookCard.jsx
import React from 'react';

/**
 * BookCard Component
 * 
 * Displays a single book in a grid.
 * 
 * Props:
 * - book: Object { id, title, author, coverUrl, availability, price, waitlist, type }
 *   availability: 'Borrow' | 'Reserve' | 'Buy' | 'Multiple'
 * 
 * Features:
 * - Book cover with hover zoom
 * - Availability badge (top-right) with color coding:
 *     Borrow → emerald, Reserve → gold, Buy → neutral gray
 * - Title and author
 * - Status/price row with quick action button
 * - Hover lift effect and glow
 */
const BookCard = ({ book }) => {
  // Badge styles based on availability type
  const badgeStyles = {
    Borrow: 'bg-primary/20 border border-primary/50 text-primary',
    Reserve: 'bg-secondary/20 border border-secondary/50 text-secondary',
    Buy: 'bg-white/10 border border-white/20 text-white',
    Multiple: 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/20 text-white',
  };

  // Quick action button styles
  const actionButtonStyles = {
    Borrow: 'hover:bg-primary hover:text-black hover:border-primary',
    Reserve: 'hover:bg-secondary hover:text-black hover:border-secondary',
    Buy: 'hover:bg-white hover:text-black hover:border-white',
    Multiple: 'hover:bg-primary hover:text-black hover:border-primary',
  };

  // Quick action icon
  const actionIcon = {
    Borrow: 'add',
    Reserve: 'bookmark',
    Buy: 'shopping_bag',
    Multiple: 'more_horiz',
  };

  const badgeClass = badgeStyles[book.availability] || badgeStyles.Borrow;
  const buttonClass = actionButtonStyles[book.availability] || actionButtonStyles.Borrow;
  const icon = actionIcon[book.availability] || 'add';

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col group glow-hover transition-all duration-300 hover:-translate-y-1">
      {/* Book cover container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-container-low">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          src={book.coverUrl}
          alt={book.title}
        />
        {/* Availability badge */}
        <div className="absolute top-2 right-2">
          <span className={`${badgeClass} backdrop-blur-sm px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider shadow-md`}>
            {book.availability}
          </span>
        </div>
      </div>

      {/* Book info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-white mb-1 line-clamp-2 group-hover:text-secondary transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-on-surface-variant mb-4 truncate">{book.author}</p>

        {/* Status / price and action button */}
        <div className="mt-auto flex justify-between items-center">
          {/* Display availability status or price */}
          {book.availability === 'Buy' ? (
            <span className="text-sm font-semibold text-white">${book.price}</span>
          ) : book.availability === 'Reserve' ? (
            <span className="text-sm text-secondary">Waitlist: {book.waitlist || 0}</span>
          ) : (
            <span className="text-sm text-primary">Available</span>
          )}

          {/* Quick action button */}
          <button
            className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all ${buttonClass}`}
            aria-label={`${book.availability} ${book.title}`}
          >
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;