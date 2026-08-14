// src/components/book/BookFilters.jsx
import React, { useState } from 'react';

/**
 * BookFilters Component
 * 
 * Sidebar filter panel for the Book Center.
 * 
 * State:
 * - availability: Array of selected availability options
 * - format: Array of selected formats
 * - language: String (selected language)
 * 
 * Props:
 * - onFilterChange: Callback when filters change
 */
const BookFilters = ({ onFilterChange }) => {
  // State for selected filters
  const [availability, setAvailability] = useState([]);
  const [format, setFormat] = useState([]);
  const [language, setLanguage] = useState('English');

  // Handle checkbox toggle for availability
  const toggleAvailability = (value) => {
    const updated = availability.includes(value)
      ? availability.filter((v) => v !== value)
      : [...availability, value];
    setAvailability(updated);
    notifyChange(updated, format, language);
  };

  // Handle checkbox toggle for format
  const toggleFormat = (value) => {
    const updated = format.includes(value)
      ? format.filter((v) => v !== value)
      : [...format, value];
    setFormat(updated);
    notifyChange(availability, updated, language);
  };

  // Notify parent of filter changes
  const notifyChange = (avail, fmt, lang) => {
    if (onFilterChange) {
      onFilterChange({ availability: avail, format: fmt, language: lang });
    }
  };

  return (
    <div className="sticky top-32 glass-panel rounded-xl p-5 flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-semibold text-white mb-4">Filters</h3>
        <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent mb-4" />
      </div>

      {/* Availability filter */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">Availability</h4>
        <div className="flex flex-col gap-2">
          {['Available to Borrow', 'Reserve Only', 'Buy'].map((option) => (
            <label key={option} className="flex items-center gap-3 text-sm text-white cursor-pointer group">
              <input
                type="checkbox"
                checked={availability.includes(option)}
                onChange={() => toggleAvailability(option)}
                className="form-checkbox text-primary rounded focus:ring-primary group-hover:border-primary transition-colors"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Format filter */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">Format</h4>
        <div className="flex flex-col gap-2">
          {['Hardcover', 'Paperback', 'Digital (eBook)'].map((option) => (
            <label key={option} className="flex items-center gap-3 text-sm text-white cursor-pointer group">
              <input
                type="checkbox"
                checked={format.includes(option)}
                onChange={() => toggleFormat(option)}
                className="form-checkbox text-secondary rounded focus:ring-secondary group-hover:border-secondary transition-colors"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Language filter */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">Language</h4>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            notifyChange(availability, format, e.target.value);
          }}
          className="w-full bg-surface-container border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
        </select>
      </div>
    </div>
  );
};

export default BookFilters;