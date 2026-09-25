import { useState, type ChangeEvent } from 'react';

type BooksFilterState = {
  availability: string[];
  languages: string[];
  searchQuery: string;
};

interface BooksFiltersProps {
  onFilterChange?: (filters: BooksFilterState) => void;
}

/**
 * Books Filters Component
 * 
 * Sidebar filter panel for Books s.
 * 
 * Props:
 * - onFilterChange: Callback function triggered when any filter updates
 */
const BooksFilters = ({ onFilterChange }: BooksFiltersProps) => {
  // const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  // const [contentType, setContentType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedavailability, setSelectedavailability] = useState('All');
  const [selectedlanguages, setSelectedlanguages] = useState('All');


  const languagesType = ['All','Engilish', 'Amharic'];
  const availability = ['Available', 'Reserved'];

  const triggerChange = (updated: Partial<BooksFilterState>) => {
    if (onFilterChange) {
      onFilterChange({
        availability: selectedavailability === 'All' ? [] : [selectedavailability],
        languages: selectedlanguages === 'All' ? [] : [selectedlanguages],
        searchQuery,
       
        ...updated,
      });
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    triggerChange({ searchQuery: val });
  };

  const handleBrandChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const languages = e.target.value;
    setSelectedlanguages(languages);
    triggerChange({ languages: languages === 'All' ? [] : [languages] });
  };

  const handleavailabilityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const availability = e.target.value;
    setSelectedavailability(availability);
    triggerChange({ availability: availability === 'All' ? [] : [availability] });
  };



  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedavailability('All');
    setSelectedlanguages('All');
   
    triggerChange({
      availability: [],
      languages: [],
      searchQuery: '',
      
    });
  };

  const hasActiveFilters = selectedavailability !== 'All' || searchQuery !== '' || selectedlanguages !== '';

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
            placeholder="Search Books s..."
            className="w-full bg-surface-container border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-primary outline-none transition-all"
          />
          <span className="material-symbols-outlined text-on-surface-variant text-lg absolute left-2.5 top-2.5 pointer-events-none">
            search
          </span>
        </div>
      </div>

      {/* availability Filter */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          availability
        </label>
        <select
          value={selectedavailability}
          onChange={handleavailabilityChange}
          className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
        >
          {availability.map((c) => (
            <option key={c} value={c} className="bg-surface-container-high text-white">
              {c === 'All' ? 'All' : c}
            </option>
          ))}
        </select>
      </div>


      {/* Content Type Filter Group */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          Languages
        </label>
        <select
          value={selectedlanguages}
          onChange={handleBrandChange}
          className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
        >
          {languagesType.map((c) => (
            <option key={c} value={c} className="bg-surface-container-high text-white">
              {c === 'All' ? 'All Types' : c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BooksFilters;