import { useState, useRef, useEffect, type ChangeEvent } from 'react';

type MovieFilterState = {
  genres: string[];
  contentType: string;
  searchQuery: string;
  country: string;
};

interface MovieFiltersProps {
  onFilterChange?: (filters: MovieFilterState) => void;
}

/**
 * MovieFilters Component
 * 
 * Sidebar filter panel for movies.
 * 
 * Props:
 * - onFilterChange: Callback function triggered when any filter updates
 */
const MovieFilters = ({ onFilterChange }: MovieFiltersProps) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  // const [contentType, setContentType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedContent, setSelectedContent] = useState('All');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  const genreDropdownRef = useRef<HTMLDivElement>(null);

  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Adventure'];
  const contents = ['All', 'Movie', 'TV Series'];
  const countries = ['All', 'Ethiopia', 'USA', 'UK', 'Korea', 'Japan'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const triggerChange = (updated: Partial<MovieFilterState>) => {
    if (onFilterChange) {
      onFilterChange({
        genres: selectedGenres,
        contentType: selectedContent,
        searchQuery,
        country: selectedCountry,
        ...updated,
      });
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    triggerChange({ searchQuery: val });
  };

  const handleGenreChange = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updated);
    triggerChange({ genres: updated });
  };

  const handleContentTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const contentType = e.target.value;
    setSelectedContent(contentType);
    triggerChange({ contentType });
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    triggerChange({ country });
  };


  const handleClearAll = () => {
    setSelectedGenres([]);
    // setContentType('All');
    setSearchQuery('');
    setSelectedCountry('All');
    setSelectedContent("All");
    setIsGenreDropdownOpen(false);
    triggerChange({
      genres: [],
      contentType: 'All',
      searchQuery: '',
      country: 'All',
    });
  };

  const hasActiveFilters = selectedGenres.length > 0 || selectedContent !== 'All' || searchQuery !== '' || selectedCountry !== 'All';

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

      {/* Dropdown Menu with Checkboxes */}
      <div className="mb-6 relative" ref={genreDropdownRef}>
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          Genre
        </label>

        {/* Dropdown Trigger Button */}
        <button
          type="button"
          onClick={() => setIsGenreDropdownOpen((prev) => !prev)}
          className="w-full flex items-center justify-between bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer transition-all"
        >
          <span className="truncate">
            {selectedGenres.length === 0
              ? 'Select Genres'
              : `${selectedGenres.length} Selected (${selectedGenres.join(', ')})`}
          </span>
          <span
            className="material-symbols-outlined text-on-surface-variant text-sm transition-transform duration-200"
            style={{ transform: isGenreDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            expand_more
          </span>
        </button>

        {/* Dropdown Options List with Checkboxes */}
        {isGenreDropdownOpen && (
          <div className="absolute z-20 left-0 right-0 mt-2 bg-surface-container border border-white/10 rounded-lg p-2 space-y-1 max-h-48 overflow-y-auto shadow-2xl backdrop-blur-md">
            {genres.map((genre) => (
              <label
                key={genre}
                className="flex items-center gap-2.5 cursor-pointer group select-none hover:bg-white/5 p-2 rounded transition-colors"
              >
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
        )}
      </div>

      {/* Content Type Filter Group */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          Content Type
        </label>
        <select
          value={selectedContent}
          onChange={handleContentTypeChange}
          className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
        >
          {contents.map((c) => (
            <option key={c} value={c} className="bg-surface-container-high text-white">
              {c === 'All' ? 'All Types' : c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MovieFilters;