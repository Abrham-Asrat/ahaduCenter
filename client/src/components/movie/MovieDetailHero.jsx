// src/components/movie/MovieDetailHero.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * MovieDetailHero Component
 * 
 * Hero banner for the movie detail page.
 * Features:
 * - Full-width background cover image
 * - Gradient overlay for readability
 * - Movie title (large, uppercase)
 * - Metadata row: year, country, runtime, quality, language, subtitles
 * - Genre chips
 * - Action buttons: Request Movie, Save, Share
 */
const MovieDetailHero = ({ movie, onShowToast }) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    const handleRequestClick = () => {
        navigate(`/movie-request?movie=${encodeURIComponent(movie.title)}`);
    };

    const handleSaveClick = () => {
        const next = !isSaved;
        setIsSaved(next);
        if (onShowToast) {
            onShowToast(next ? `"${movie.title}" saved to Wishlist!` : `Removed "${movie.title}" from Wishlist.`);
        }
    };

    const handleShareClick = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
        }
        if (onShowToast) {
            onShowToast("Movie detail link copied to clipboard!");
        }
    };

    return (
        <section
            className="relative w-full h-[420px] bg-cover bg-center"
            style={{ backgroundImage: `url('${movie.bannerUrl}')` }}
        >
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/70 to-transparent" />

            {/* Content container */}
            <div className="absolute bottom-0 left-0 w-full px-4 md:px-8 pb-8 max-w-7xl mx-auto left-1/2 -translate-x-1/2">
                <div className="flex flex-col gap-2">
                    {/* Movie Title */}
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest uppercase drop-shadow-lg">
                        {movie.title}
                    </h1>

                    {/* Metadata row */}
                    <div className="flex flex-wrap items-center gap-3 text-gray-300 text-sm font-medium">
                        <span>{movie.year}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 opacity-50" />
                        <span>{movie.country}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 opacity-50" />
                        <span>{movie.runtime}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 opacity-50" />
                        <span className="border border-secondary/50 text-secondary px-1.5 py-0.5 rounded text-xs font-bold">{movie.quality}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 opacity-50" />
                        <span>{movie.language}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 opacity-50" />
                        <span>{movie.subtitles}</span>
                    </div>

                    {/* Genre chips and action buttons */}
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                        {/* Genre chips */}
                        <div className="flex gap-2">
                            {movie.genres?.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 rounded bg-secondary/15 text-secondary text-xs font-semibold uppercase tracking-widest border border-secondary/30"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2.5 ml-auto md:ml-6">
                            {/* Request Movie - primary button */}
                            <button
                                onClick={handleRequestClick}
                                className="flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-lg emerald-glow hover:scale-105 active:scale-95 transition-all font-semibold shadow-lg"
                            >
                                <span className="material-symbols-outlined text-xl">movie</span>
                                <span>Request Movie</span>
                            </button>

                            {/* Save button */}
                            <button
                                onClick={handleSaveClick}
                                className={`flex items-center gap-2 border px-4 py-2.5 rounded-lg hover:scale-105 active:scale-95 transition-all font-semibold ${isSaved
                                        ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(233,195,73,0.4)]'
                                        : 'border-secondary/50 text-secondary hover:bg-secondary/10'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                                    {isSaved ? 'bookmark' : 'bookmark_add'}
                                </span>
                                <span className="hidden md:inline text-sm">{isSaved ? 'Saved' : 'Save'}</span>
                            </button>

                            {/* Share button */}
                            <button
                                onClick={handleShareClick}
                                className="flex items-center gap-2 border border-white/20 text-white px-4 py-2.5 rounded-lg hover:bg-white/10 hover:scale-105 active:scale-95 transition-all font-semibold"
                            >
                                <span className="material-symbols-outlined text-xl">share</span>
                                <span className="hidden md:inline text-sm">Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MovieDetailHero;