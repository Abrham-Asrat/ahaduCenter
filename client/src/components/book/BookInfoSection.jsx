// src/components/book/BookInfoSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * BookInfoSection Component
 * 
 * Displays book metadata and action buttons.
 * 
 * Props:
 * - book: Object { title, author, publisher, year, isbn, rating, reviews, description, availableCopies, location, price }
 * - onShowToast: Callback for toast notifications
 */
const BookInfoSection = ({ book, onShowToast }) => {
    const navigate = useNavigate();

    const handleBorrow = () => {
        if (onShowToast) onShowToast(`Borrow request submitted for "${book.title}"! Pick up at ${book.location}.`);
    };

    const handleReserve = () => {
        if (onShowToast) onShowToast(`Reserved place on waitlist for "${book.title}".`);
    };

    const handleBuy = () => {
        if (onShowToast) onShowToast(`Added "${book.title}" to cart! Redirecting to checkout...`);
        setTimeout(() => navigate('/book-confirm'), 1000);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header info */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gold tracking-widest bg-secondary/10 px-2.5 py-1 rounded font-bold uppercase">
                        {book.author}
                    </span>
                    <span className="text-on-surface-variant/50">•</span>
                    <span className="text-sm text-on-surface-variant font-medium">
                        {book.publisher}, {book.year}
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-1 leading-tight">{book.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-secondary">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {i < Math.floor(book.rating) ? 'star' : 'star_half'}
                            </span>
                        ))}
                    </div>
                    <span className="text-sm text-on-surface-variant font-medium">{book.rating} ({book.reviews} Reviews)</span>
                    <span className="text-on-surface-variant/30">|</span>
                    <span className="text-sm text-on-surface-variant font-medium">ISBN: {book.isbn}</span>
                </div>
            </div>

            {/* Description */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">{book.description}</p>
            </div>

            {/* Action section with status */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border-l-4 border-l-primary shadow-xl">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Current Status</span>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-xl font-bold text-white">
                                Available Copies: <span className="text-primary">{book.availableCopies}</span>
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs uppercase tracking-wider text-on-surface-variant block mb-1 font-semibold">Library Location</span>
                        <span className="text-white font-semibold">{book.location}</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 mt-2">
                    <button
                        onClick={handleBorrow}
                        className="bg-primary text-black px-8 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all font-bold flex-1 flex justify-center items-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">auto_stories</span>
                        Borrow Now
                    </button>
                    <button
                        onClick={handleReserve}
                        className="bg-transparent border border-secondary text-secondary px-8 py-3.5 rounded-xl hover:bg-secondary/10 transition-all font-bold flex-1 flex justify-center items-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">calendar_month</span>
                        Reserve
                    </button>
                    <button
                        onClick={handleBuy}
                        className="bg-surface-container-high text-white px-8 py-3.5 rounded-xl hover:bg-surface-container-highest transition-all border border-white/10 flex-none flex justify-center items-center gap-2 font-bold cursor-pointer"
                    >
                        <span className="material-symbols-outlined">shopping_cart</span>
                        Buy ${book.price}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookInfoSection;