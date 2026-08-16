// src/components/movie/RelatedMoviesCarousel.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * RelatedMoviesCarousel Component
 * 
 * Horizontal carousel of similar movies.
 * 
 * Props:
 * - movies: Array of movie objects { id, title, posterUrl, year, rating }
 * 
 * Features:
 * - Horizontal scrolling
 * - Movie cards with poster and info overlay
 * - Hover effects
 */
const RelatedMoviesCarousel = ({ movies }) => {
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 border-t border-white/5">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">You Might Also Like</h2>
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4">
                {movies.map((movie) => (
                    <Link
                        key={movie.id}
                        to={`/movies/${movie.id}`}
                        className="min-w-[200px] md:min-w-[250px] glass-panel rounded-xl overflow-hidden group cursor-pointer flex-shrink-0 hover:-translate-y-1 transition-transform duration-200"
                    >
                        <div className="relative w-full aspect-[2/3] overflow-hidden">
                            <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={movie.posterUrl}
                                alt={movie.title}
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#151B28] to-transparent opacity-80" />
                            {/* Movie info */}
                            <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="text-white font-semibold truncate">{movie.title}</h3>
                                <div className="flex justify-between items-center mt-1 text-on-surface-variant text-xs">
                                    <span>{movie.year}</span>
                                    <span className="flex items-center gap-1 text-secondary">
                                        <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            star
                                        </span>
                                        {movie.rating}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RelatedMoviesCarousel;