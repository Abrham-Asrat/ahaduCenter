// src/components/book/BookInfoSection.jsx
import React from 'react';

/**
 * BookInfoSection Component
 * 
 * Displays book metadata and action buttons.
 * 
 * Props:
 * - book: Object { title, author, publisher, year, isbn, rating, reviews, description, availableCopies, location, price }
 * 
 * Features:
 * - Author with label
 * - Title
 * - Rating, ISBN, publisher info
 * - Description in glass panel
 * - Status card with available copies and location
 * - Action buttons: Borrow Now, Reserve, Buy
 */
const BookInfoSection = ({ book }) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Header info */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gold tracking-widest bg-secondary/10 px-2 py-1 rounded">
                        {book.author.toUpperCase()}
                    </span>
                    <span className="text-on-surface-variant/50">•</span>
                    <span className="text-sm text-on-surface-variant">
                        {book.publisher}, {book.year}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">{book.title}</h1>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-secondary">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {i < Math.floor(book.rating) ? 'star' : 'star_half'}
                            </span>
                        ))}
                    </div>
                    <span className="text-sm text-on-surface-variant">{book.rating} ({book.reviews} Reviews)</span>
                    <span className="text-on-surface-variant/30">|</span>
                    <span className="text-sm text-on-surface-variant">ISBN: {book.isbn}</span>
                </div>
            </div>

            {/* Description */}
            <div className="glass-panel p-6 rounded-xl">
                <p className="text-lg text-on-surface-variant leading-relaxed">{book.description}</p>
            </div>

            {/* Action section with status */}
            <div className="glass-panel p-6 rounded-xl flex flex-col gap-4 border-l-4 border-l-primary">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wider text-on-surface-variant">Current Status</span>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-xl font-semibold text-white">
                                Available Copies: <span className="text-primary">{book.availableCopies}</span>
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs uppercase tracking-wider text-on-surface-variant block mb-1">Library Location</span>
                        <span className="text-white">{book.location}</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 mt-2">
                    <button className="bg-primary text-white px-8 py-3 rounded hover:bg-emerald-600 transition-all font-semibold flex-1 flex justify-center items-center gap-2">
                        <span className="material-symbols-outlined">auto_stories</span>
                        Borrow Now
                    </button>
                    <button className="bg-transparent border border-secondary text-secondary px-8 py-3 rounded hover:bg-secondary/10 transition-all font-semibold flex-1 flex justify-center items-center gap-2">
                        <span className="material-symbols-outlined">calendar_month</span>
                        Reserve
                    </button>
                    <button className="bg-surface-container-high text-white px-8 py-3 rounded hover:bg-surface-container-highest transition-all border border-white/10 flex-none flex justify-center items-center gap-2">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        Buy ${book.price}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookInfoSection;