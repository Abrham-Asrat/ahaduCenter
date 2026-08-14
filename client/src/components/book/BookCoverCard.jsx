// src/components/book/BookCoverCard.jsx
import React from 'react';

/**
 * BookCoverCard Component
 * 
 * Displays the book cover with:
 * - Availability badge (top-left)
 * - Hover overlay with zoom icon
 * - Action icons below: Share, Save, QR
 * 
 * Props:
 * - book: Object { coverUrl, title, availability }
 */
const BookCoverCard = ({ book }) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Cover container with hover zoom */}
            <div className="relative glass-panel rounded-lg p-3 w-full aspect-[2/3] overflow-hidden group">
                <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover rounded shadow-2xl"
                />

                {/* Availability badge */}
                <div className="absolute top-4 left-4 bg-primary-container/90 backdrop-blur text-white px-3 py-1 rounded-sm text-xs uppercase shadow-lg border border-white/20">
                    {book.availability}
                </div>

                {/* Hover overlay with zoom button */}
                <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full bg-surface-container-highest border border-white/20 flex items-center justify-center text-white hover:text-primary hover:border-primary transition-all shadow-xl">
                        <span className="material-symbols-outlined text-3xl">zoom_in</span>
                    </button>
                </div>
            </div>

            {/* Action icons row */}
            <div className="flex justify-center gap-6 py-2">
                {/* Share */}
                <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors group">
                    <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:border-primary/50 transition-all">
                        <span className="material-symbols-outlined">share</span>
                    </div>
                    <span className="text-xs">Share</span>
                </button>
                {/* Save */}
                <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors group">
                    <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:border-primary/50 transition-all">
                        <span className="material-symbols-outlined">bookmark</span>
                    </div>
                    <span className="text-xs">Save</span>
                </button>
                {/* QR */}
                <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors group">
                    <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:border-primary/50 transition-all">
                        <span className="material-symbols-outlined">qr_code</span>
                    </div>
                    <span className="text-xs">QR</span>
                </button>
            </div>
        </div>
    );
};

export default BookCoverCard;
