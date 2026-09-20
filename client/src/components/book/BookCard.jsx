// src/components/book/BookCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addWishlistItem, removeWishlistItem } from '../../redux/slices/wishlistSlice';

/**
 * BookCard Component
 * 
 * Displays a single book in a grid.
 * 
 * Props:
 * - book: Object { id, title, author, coverUrl, availability, price, waitlist, type }
 * - onQuickAction: Callback function
 */
const BookCard = ({ book, onQuickAction, isWishlisted: initialWishlisted = false }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((s) => s.wishlist?.items ?? []);
  
  const bookId = book.id || book._id;
  const isWishlisted = wishlistItems.some(
    (item) => item.id === bookId || item.itemId === bookId
  ) || initialWishlisted;

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

  const handleActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAction) onQuickAction(book);
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeWishlistItem(bookId));
    } else {
      dispatch(
        addWishlistItem({
          itemId: bookId,
          itemType: 'Book',
          title: book.title,
          imageUrl: book.coverUrl,
          category: book.category ?? book.author,
        })
      );
    }
  };

  return (
    <Link to={`/books/${bookId}`} className="block h-full group">
      <div className="glass-panel rounded-xl overflow-hidden flex flex-col group glow-hover transition-all duration-300 hover:-translate-y-1 h-full border border-white/10 shadow-lg relative">
        {/* Book cover container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-container-low">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            src={book.coverUrl}
            alt={book.title}
            loading="lazy"
          />
          {/* Availability badge */}
          <div className="absolute top-2 right-2">
            <span className={`${badgeClass} backdrop-blur-md px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider shadow-md`}>
              {book.availability}
            </span>
          </div>

          {/* Bookmark floating button */}
          <button
            onClick={handleBookmarkClick}
            title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full glass-panel flex items-center justify-center transition-all ${
              isWishlisted
                ? 'text-secondary border-secondary bg-secondary/20 shadow-[0_0_15px_rgba(233,195,73,0.5)]'
                : 'text-on-surface hover:text-secondary hover:border-secondary'
            }`}
          >
            <span
              className="material-symbols-outlined text-base"
              style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              {isWishlisted ? 'bookmark' : 'bookmark_add'}
            </span>
          </button>
        </div>

        {/* Book info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-base font-bold text-white mb-1 line-clamp-2 group-hover:text-secondary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-on-surface-variant mb-4 truncate font-medium">{book.author}</p>

          {/* Status / price and action button */}
          <div className="mt-auto flex justify-between items-center pt-2 border-t border-white/5">
            {/* Display availability status or price */}
            {book.availability === 'Buy' ? (
              <span className="text-sm font-extrabold text-white">ETB {book.price}</span>
            ) : book.availability === 'Reserve' ? (
              <span className="text-xs text-secondary font-bold">Waitlist: {book.waitlist || 0}</span>
            ) : (
              <span className="text-xs text-primary font-bold">Available</span>
            )}

            {/* Quick action button */}
            <button
              onClick={handleActionClick}
              className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all ${buttonClass}`}
              aria-label={`${book.availability} ${book.title}`}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;