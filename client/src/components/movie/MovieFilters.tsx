// src/components/movie/MovieFilters.jsx
import React, { useState } from 'react';

/**
 * MovieFilters Component
 * 
 * Sidebar filter panel for movies.
 * 
 * Props:
 * - onFilterChange: Callback function triggered when any filter updates
 */
const MovieFilters = ({ onFilterChange }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [contentType, setContentType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Adventure'];
  const contentTypes = ['All', 'Movie', 'TV Series'];
  const countries = ['All', 'Ethiopia', 'USA', 'UK', 'Korea', 'Japan'];

  const triggerChange = (updated) => {
    if (onFilterChange) {
      onFilterChange({
        genres: selectedGenres,
        contentType,
        searchQuery,
        country: selectedCountry,
        ...updated,
      });
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    triggerChange({ searchQuery: val });
  };

  const handleGenreChange = (genre) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updated);
    triggerChange({ genres: updated });
  };

  const handleContentTypeChange = (type) => {
    setContentType(type);
    triggerChange({ contentType: type });
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    triggerChange({ country });
  };

  const handleClearAll = () => {
    setSelectedGenres([]);
    setContentType('All');
    setSearchQuery('');
    setSelectedCountry('All');
    triggerChange({
      genres: [],
      contentType: 'All',
      searchQuery: '',
      country: 'All',
    });
  };

  const hasActiveFilters = selectedGenres.length > 0 || contentType !== 'All' || searchQuery !== '' || selectedCountry !== 'All';

  return (
    <div className="glass-panel rounded-xl p-6 sticky top-[150px] shadow-xl">
      {/* Filters Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">tune</span>
          <h2 className="text-xl font-bold text-white">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-secondary hover:underline cursor-pointer font-semibold transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          Search Title
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search movies..."
            className="w-full bg-surface-container border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-primary outline-none transition-all"
          />
          <span className="material-symbols-outlined text-on-surface-variant text-lg absolute left-2.5 top-2.5 pointer-events-none">
            search
          </span>
        </div>
      </div>

      {/* Country Filter */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          Country
        </label>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
        >
          {countries.map((c) => (
            <option key={c} value={c} className="bg-surface-container-high text-white">
              {c === 'All' ? 'All Countries' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Genre Filter Group */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3 font-semibold">
          Genre
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {genres.map((genre) => (
            <label key={genre} className="flex items-center gap-2.5 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreChange(genre)}
                className="w-4 h-4 rounded bg-surface-dim border-white/20 text-primary focus:ring-primary focus:ring-offset-background group-hover:border-primary transition-colors cursor-pointer"
              />
              <span className="text-sm text-on-surface group-hover:text-primary transition-colors">
                {genre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Content Type Filter Group */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3 font-semibold">
          Content Type
        </h3>
        <div className="space-y-2">
          {contentTypes.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group select-none">
              <input
                type="radio"
                name="type"
                checked={contentType === type}
                onChange={() => handleContentTypeChange(type)}
                className="w-4 h-4 bg-surface-dim border-white/20 text-secondary focus:ring-secondary group-hover:border-secondary transition-colors cursor-pointer"
              />
              <span className="text-sm text-on-surface group-hover:text-secondary transition-colors">
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