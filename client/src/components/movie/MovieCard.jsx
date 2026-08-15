// src/components/movie/MovieCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * MovieCard Component
 * 
 * Displays a single movie in a grid/carousel.
 * 
 * Props:
 * - movie: Object containing movie data { id, title, posterUrl, rating, availability, genres, year }
 * - onPlayTrailer: Optional callback function when play trailer is clicked
 * - onToggleBookmark: Optional callback function when bookmark is clicked
 */
const MovieCard = ({ movie, onPlayTrailer, onToggleBookmark, isBookmarked: initialBookmarked = false }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const handlePlayTrailer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlayTrailer) {
      onPlayTrailer(movie);
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    if (onToggleBookmark) {
      onToggleBookmark(movie, newState);
    }
  };

  return (
    <Link to={`/movies/${movie.id}`} className="block h-full group">
      <div className="glass-panel rounded-lg overflow-hidden cursor-pointer transition-all duration-300 glow-hover relative flex flex-col h-full hover:-translate-y-1">

        {/* Poster Container - maintains 2:3 aspect ratio */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-container">

          {/* Movie Poster Image - scales up on hover */}
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
          />

          {/* Top-right badges (e.g., 4K quality) */}
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            {movie.quality && (
              <span className="bg-secondary-container/90 text-secondary-fixed backdrop-blur-sm px-2 py-0.5 rounded text-xs font-semibold shadow-lg border border-secondary/30">
                {movie.quality}
              </span>
            )}
          </div>

          {/* Top-left rating badge with star icon */}
          <div className="absolute top-2 left-2 flex gap-1 z-10">
            <span className="bg-surface-container-highest/90 text-on-surface border border-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-xs flex items-center gap-1 shadow-lg font-semibold">
              <span className="material-symbols-outlined text-[14px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              {movie.rating}
            </span>
          </div>

          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm z-20">

            {/* Play Trailer button */}
            <button
              onClick={handlePlayTrailer}
              title="Play Trailer"
              className="w-11 h-11 rounded-full bg-primary-container text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.8)]"
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              title={isBookmarked ? "Remove from Wishlist" : "Save to Wishlist"}
              className={`w-11 h-11 rounded-full glass-panel flex items-center justify-center hover:scale-110 active:scale-95 transition-all ${isBookmarked
                  ? 'text-secondary border-secondary bg-secondary/20 shadow-[0_0_15px_rgba(233,195,73,0.5)]'
                  : 'text-on-surface hover:text-secondary hover:border-secondary'
                }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                {isBookmarked ? 'bookmark' : 'bookmark_add'}
              </span>
            </button>
          </div>
        </div>

        {/* Card Content - title, genre, year, availability */}
        <div className="p-3.5 flex flex-col flex-grow justify-between bg-surface-container-low/40">
          <div>
            <h4 className="text-[15px] font-semibold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
              {movie.title}
            </h4>

            <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-1">
              {movie.genres?.join(' • ')} • {movie.year}
            </p>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border ${movie.availability === 'Available'
                ? 'bg-primary-container/20 text-primary border-primary/30'
                : 'bg-secondary-container/20 text-secondary border-secondary/30'
              }`}>
              {movie.availability?.toUpperCase() || 'AVAILABLE'}
            </span>
            {movie.country && (
              <span className="text-[11px] text-on-surface-variant font-medium">
                {movie.country}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;