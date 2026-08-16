// src/components/book/BookCoverCard.jsx
import React, { useState } from 'react';

/**
 * BookCoverCard Component
 *
 * Displays the book cover with:
 * - Availability badge (top-left)
 * - Hover overlay with zoom toggle (scale-110 applied when zoomed)
 * - Action icons below: Share, Save (bookmark toggle), QR
 * - Inline toast notifications (3 s auto-dismiss)
 *
 * Props:
 * - book: Object { coverUrl, title, availability }
 */
const BookCoverCard = ({ book }) => {
    const [isSaved, setIsSaved] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!');
        } catch {
            showToast('Copy not supported in this browser');
        }
    };

    const handleSave = () => {
        setIsSaved((prev) => !prev);
    };

    const handleZoom = () => {
        setIsZoomed((prev) => !prev);
    };

    const handleQR = () => {
        showToast('QR Code coming soon');
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Cover container with hover zoom */}
            <div className="relative glass-panel rounded-lg p-3 w-full aspect-[2/3] overflow-hidden group">
                <img
                    src={book.coverUrl}
                    alt={book.title}
                    className={`w-full h-full object-cover rounded shadow-2xl transition-transform duration-300${isZoomed ? ' scale-110' : ''}`}
                />

                {/* Availability badge */}
                <div className="absolute top-4 left-4 bg-primary-container/90 backdrop-blur text-white px-3 py-1 rounded-sm text-xs uppercase shadow-lg border border-white/20">
                    {book.availability}
                </div>

                {/* Hover overlay with zoom button */}
                <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                        aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
                        onClick={handleZoom}
                        className="w-12 h-12 rounded-full bg-surface-container-highest border border-white/20 flex items-center justify-center text-white hover:text-primary hover:border-primary transition-all shadow-xl"
                    >
                        <span className="material-symbols-outlined text-3xl">
                            {isZoomed ? 'zoom_out' : 'zoom_in'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Action icons row */}
            <div className="flex justify-center gap-6 py-2">
                {/* Share */}
                <button
                    aria-label="Share"
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:border-primary/50 transition-all">
                        <span className="material-symbols-outlined">share</span>
                    </div>
                    <span className="text-xs">Share</span>
                </button>

                {/* Save */}
                <button
                    aria-label={isSaved ? 'Unsave' : 'Save'}
                    onClick={handleSave}
                    className={`flex flex-col items-center gap-1 transition-colors group ${isSaved ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                >
                    <div className={`w-10 h-10 rounded-full glass-panel flex items-center justify-center transition-all ${isSaved ? 'border-primary/50' : 'group-hover:border-primary/50'}`}>
                        <span className="material-symbols-outlined">
                            {isSaved ? 'bookmark_added' : 'bookmark'}
                        </span>
                    </div>
                    <span className="text-xs">Save</span>
                </button>

                {/* QR */}
                <button
                    aria-label="QR Code"
                    onClick={handleQR}
                    className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:border-primary/50 transition-all">
                        <span className="material-symbols-outlined">qr_code</span>
                    </div>
                    <span className="text-xs">QR</span>
                </button>
            </div>

            {/* Toast notification */}
            {toastMessage && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-8 right-8 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce"
                >
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span className="text-sm font-semibold">{toastMessage}</span>
                </div>
            )}
        </div>
    );
};

export default BookCoverCard;
