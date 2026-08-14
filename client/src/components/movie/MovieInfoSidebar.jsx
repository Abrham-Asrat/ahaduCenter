// src/components/movie/MovieInfoSidebar.jsx
import React from 'react';

/**
 * MovieInfoSidebar Component
 * 
 * Sticky sidebar with poster, rating, and movie details.
 * 
 * Props:
 * - movie: Object containing movie data
 * 
 * Features:
 * - Poster with rating badge
 * - Info list: director, writers, studio, release date
 * - Sticky positioning on desktop
 */
const MovieInfoSidebar = ({ movie }) => {
    return (
        <div className="sticky top-[100px] flex flex-col gap-6">
            {/* Movie Details Card */}
            <div className="glass-panel p-6 rounded-xl flex flex-col gap-4">
                {/* Poster */}
                <div className="w-full aspect-[2/3] rounded-lg overflow-hidden border border-white/10 shadow-lg relative">
                    <img
                        className="w-full h-full object-cover"
                        src={movie.posterUrl}
                        alt={movie.title}
                    />
                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 bg-primary-container text-white px-3 py-1 rounded flex items-center gap-2 shadow-lg">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                        </span>
                        <span className="text-sm font-bold">{movie.rating}/10</span>
                    </div>
                </div>

                {/* Info List */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-on-surface-variant text-sm">Director</span>
                        <span className="text-white text-sm">{movie.director}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-on-surface-variant text-sm">Writers</span>
                        <span className="text-white text-sm text-right">{movie.writers}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-on-surface-variant text-sm">Studio</span>
                        <span className="text-white text-sm">{movie.studio}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                        <span className="text-on-surface-variant text-sm">Release</span>
                        <span className="text-white text-sm">{movie.releaseDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieInfoSidebar;