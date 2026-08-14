// src/components/movie/MovieFilters.jsx
import React, { useState } from 'react';

/**
 * MovieFilters Component
 * 
 * Sidebar filter panel for movies.
 * 
 * State:
 * - selectedGenres: Array of selected genre strings
 * - contentType: Selected content type (All, Movie, TV Series)
 * 
 * Features:
 * - Sticky positioning so filters stay visible while scrolling
 * - Checkbox filters for genres
 * - Radio button filters for content type
 * - Apply button to trigger filtering
 */
const MovieFilters = ({ onFilterChange }) => {
  // State for selected genres
  const [selectedGenres, setSelectedGenres] = useState([]);
  // State for content type
  const [contentType, setContentType] = useState('All');

  // Available genres
  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi'];

  // Available content types
  const contentTypes = ['All', 'Movie', 'TV Series'];

  // Handle genre checkbox change
  const handleGenreChange = (genre) => {
    let updatedGenres;
    if (selectedGenres.includes(genre)) {
      // Remove genre if already selected
      updatedGenres = selectedGenres.filter((g) => g !== genre);
    } else {
      // Add genre if not selected
      updatedGenres = [...selectedGenres, genre];
    }
    setSelectedGenres(updatedGenres);

    // Notify parent component
    if (onFilterChange) {
      onFilterChange({ genres: updatedGenres, contentType });
    }
  };

  // Handle content type radio change
  const handleContentTypeChange = (type) => {
    setContentType(type);
    if (onFilterChange) {
      onFilterChange({ genres: selectedGenres, contentType: type });
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 sticky top-[150px]">
      {/* Filters Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Filters</h2>
        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
          tune
        </span>
      </div>

      {/* Genre Filter Group */}
      <div className="mb-8">
        <h3 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">
          Genre
        </h3>
        <div className="space-y-2">
          {genres.map((genre) => (
            <label key={genre} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreChange(genre)}
                className="form-checkbox bg-surface-dim border-white/20 text-primary-container rounded focus:ring-primary-container focus:ring-offset-background group-hover:border-primary-container transition-colors"
              />
              <span className="text-sm text-white group-hover:text-primary transition-colors">
                {genre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Content Type Filter Group */}
      <div className="mb-8">
        <h3 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">
          Content Type
        </h3>
        <div className="space-y-2">
          {contentTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="type"
                checked={contentType === type}
                onChange={() => handleContentTypeChange(type)}
                className="form-radio bg-surface-dim border-white/20 text-secondary rounded-full focus:ring-secondary focus:ring-offset-background group-hover:border-secondary transition-colors"
              />
              <span className="text-sm text-white group-hover:text-secondary transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieFilters;