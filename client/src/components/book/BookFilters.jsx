// src/components/book/BookFilters.jsx
import React, { useState } from 'react';

/**
 * BookFilters Component
 * 
 * Sidebar filter panel for the Book Center.
 * 
 * Props:
 * - onFilterChange: Callback when filters change
 */
const BookFilters = ({ onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availability, setAvailability] = useState([]);
  const [format, setFormat] = useState([]);
  const [language, setLanguage] = useState('All Languages');

  const notifyChange = (query, avail, fmt, lang) => {
    if (onFilterChange) {
      onFilterChange({ searchQuery: query, availability: avail, format: fmt, language: lang });
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    notifyChange(val, availability, format, language);
  };

  const toggleAvailability = (value) => {
    const updated = availability.includes(value)
      ? availability.filter((v) => v !== value)
      : [...availability, value];
    setAvailability(updated);
    notifyChange(searchQuery, updated, format, language);
  };

  const toggleFormat = (value) => {
    const updated = format.includes(value)
      ? format.filter((v) => v !== value)
      : [...format, value];
    setFormat(updated);
    notifyChange(searchQuery, availability, updated, language);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setAvailability([]);
    setFormat([]);
    setLanguage('All Languages');
    notifyChange('', [], [], 'All Languages');
  };

  const hasActiveFilters = searchQuery !== '' || availability.length > 0 || format.length > 0 || language !== 'All Languages';

  return (
    <div className="sticky top-32 glass-panel rounded-2xl p-5 flex flex-col gap-6 border border-white/10 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-xl font-bold text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-secondary hover:underline font-semibold cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search filter */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          Search Book / Author
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Title or author..."
            className="w-full bg-surface-container border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-primary outline-none"
          />
          <span className="material-symbols-outlined text-on-surface-variant text-lg absolute left-2.5 top-2.5 pointer-events-none">
            search
          </span>
        </div>
      </div>

      {/* Availability filter */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3 font-semibold">Availability</h4>
        <div className="flex flex-col gap-2">
          {['Borrow', 'Reserve', 'Buy'].map((option) => (
            <label key={option} className="flex items-center gap-3 text-sm text-white cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={availability.includes(option)}
                onChange={() => toggleAvailability(option)}
                className="w-4 h-4 rounded bg-surface border-white/20 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="group-hover:text-primary transition-colors">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Format filter */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3 font-semibold">Format</h4>
        <div className="flex flex-col gap-2">
          {['Hardcover', 'Paperback', 'Digital (eBook)'].map((option) => (
            <label key={option} className="flex items-center gap-3 text-sm text-white cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={format.includes(option)}
                onChange={() => toggleFormat(option)}
                className="w-4 h-4 rounded bg-surface border-white/20 text-secondary focus:ring-secondary cursor-pointer"
              />
              <span className="group-hover:text-secondary transition-colors">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Language filter */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3 font-semibold">Language</h4>
        <select
          value={language}
          onChange={(e) => {
            const val = e.target.value;
            setLanguage(val);
            notifyChange(searchQuery, availability, format, val);
          }}
          className="w-full bg-surface-container border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-primary outline-none cursor-pointer"
        >
          <option>All Languages</option>
          <option>English</option>
          <option>Amharic</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>
    </div>
  );
};

export default BookFilters;