// src/components/movie/MovieCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MovieCard Component
 * 
 * Displays a single movie in a grid/carousel.
 * 
 * Props:
 * - movie: Object containing movie data { id, title, posterUrl, rating, availability, genres, year }
 * 
 * Features:
 * - Hover overlay with Play Trailer and Save buttons
 * - Rating badge (top-left) with star icon
 * - Quality/availability badge (top-right)
 * - Responsive image with hover zoom
 * - Glass panel background with glow on hover
 */
const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movies/${movie.id}`} className="glass-panel rounded-lg ...">


      <div className="glass-panel rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 glow-hover relative flex flex-col h-full">

        {/* Poster Container - maintains 2:3 aspect ratio */}
        <div className="relative aspect-[2/3] w-full overflow-hidden">

          {/* Movie Poster Image - scales up on hover */}
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={movie.posterUrl}
            alt={movie.title}
          />

          {/* Top-right badges (e.g., 4K quality) */}
          <div className="absolute top-2 right-2 flex gap-1">
            {movie.quality && (
              <span className="bg-secondary-container/80 text-secondary-fixed backdrop-blur-sm px-2 py-1 rounded text-xs shadow-lg">
                {movie.quality}
              </span>
            )}
          </div>

          {/* Top-left rating badge with star icon */}
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="bg-surface-container-highest/90 text-on-surface border border-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs flex items-center gap-1 shadow-lg">
              {/* Star icon (Material Symbols) */}
              <span className="material-symbols-outlined text-[12px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              {movie.rating}
            </span>
          </div>

          {/* Hover Actions Overlay - appears with backdrop blur */}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">

            {/* Play Trailer button - primary green */}
            <button className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </button>

            {/* Save button - glass panel, turns gold on hover */}
            <button className="w-10 h-10 rounded-full glass-panel text-on-surface hover:text-secondary hover:border-secondary transition-all flex items-center justify-center">
              <span className="material-symbols-outlined">bookmark_add</span>
            </button>
          </div>
        </div>

        {/* Card Content - title, genre, year, availability */}
        <div className="p-3 flex flex-col flex-grow justify-between">
          <div>
            {/* Movie Title - changes to green on hover */}
            <h4 className="text-[16px] font-semibold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
              {movie.title}
            </h4>

            {/* Genre and Year */}
            <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-1">
              {movie.genres.join(' • ')} • {movie.year}
            </p>
          </div>

          {/* Availability Status Badge */}
          <div className="mt-3 flex justify-between items-center">
            <span className={`text-[10px] px-2 py-0.5 rounded border ${movie.availability === 'Available'
                ? 'bg-primary-container/20 text-primary border-primary/30'
                : 'bg-secondary-container/20 text-secondary border-secondary/30'
              }`}>
              {movie.availability.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;