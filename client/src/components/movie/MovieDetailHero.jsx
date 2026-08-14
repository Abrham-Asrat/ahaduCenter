// src/components/movie/MovieDetailHero.jsx
import React from 'react';

/**
 * MovieDetailHero Component
 * 
 * Hero banner for the movie detail page.
 * Features:
 * - Full-width background cover image
 * - Gradient overlay for readability
 * - Movie title (large, uppercase)
 * - Metadata row: year, country, runtime, quality, language, subtitles
 * - Genre chips (gold)
 * - Action buttons: Request Movie, Save, Share
 * 
 * Props:
 * - movie: Object containing movie details
 */
const MovieDetailHero = ({ movie }) => {
    return (
        <section
            className="relative w-full h-[400px] bg-cover bg-center"
            style={{ backgroundImage: `url('${movie.bannerUrl}')` }}
        >
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent" />

            {/* Content container */}
            <div className="absolute bottom-0 left-0 w-full px-4 md:px-8 pb-8 max-w-7xl mx-auto left-1/2 -translate-x-1/2">
                <div className="flex flex-col gap-2">
                    {/* Movie Title */}
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest uppercase">
                        {movie.title}
                    </h1>

                    {/* Metadata row */}
                    <div className="flex flex-wrap items-center gap-3 text-gray-300 text-sm">
                        <span>{movie.year}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 opacity-50" />
                        <span>{movie.country}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 opacity-50" />
                        <span>{movie.runtime}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 opacity-50" />
                        <span className="border border-gray-300/30 px-1 rounded text-xs">{movie.quality}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 opacity-50" />
                        <span>{movie.language}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 opacity-50" />
                        <span>{movie.subtitles}</span>
                    </div>

                    {/* Genre chips and action buttons */}
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        {/* Genre chips */}
                        <div className="flex gap-2">
                            {movie.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 rounded bg-secondary/15 text-secondary text-xs uppercase tracking-widest border border-secondary/30"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 ml-auto md:ml-6">
                            {/* Request Movie - primary button */}
                            <button className="flex items-center gap-2 bg-primary-container text-white px-4 py-2 rounded emerald-glow transition-all">
                                <span className="material-symbols-outlined">play_arrow</span>
                                <span className="font-semibold">Request Movie</span>
                            </button>

                            {/* Save button */}
                            <button className="flex items-center gap-2 border border-secondary/50 text-secondary px-3 py-2 rounded gold-glow transition-all bg-transparent">
                                <span className="material-symbols-outlined">bookmark</span>
                                <span className="hidden md:inline text-sm">Save</span>
                            </button>

                            {/* Share button */}
                            <button className="flex items-center gap-2 border border-secondary/50 text-secondary px-3 py-2 rounded gold-glow transition-all bg-transparent">
                                <span className="material-symbols-outlined">share</span>
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