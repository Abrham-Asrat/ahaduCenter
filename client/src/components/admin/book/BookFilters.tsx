import { Search, SlidersHorizontal } from 'lucide-react';

interface BookFiltersProps {
  onFilterChange?: (next: {
    searchQuery?: string;
    availability?: string[];
    format?: string[];
    language?: string;
  }) => void;
}

const availabilityOptions = ['available', 'reserved', 'borrowed'];
const formatOptions = ['Hardcover', 'Paperback', 'Ebook', 'Audio'];
const languageOptions = ['All Languages', 'English', 'Amharic', 'French', 'Arabic'];

const BookFilters = ({ onFilterChange }: BookFiltersProps) => {
  const updateSearch = (value: string) => onFilterChange?.({ searchQuery: value });

  const toggleValue = (group: 'availability' | 'format', value: string) => {
    onFilterChange?.({
      [group]: [value],
    } as { availability?: string[]; format?: string[] });
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-card-surface/60 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.25)]">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <SlidersHorizontal size={18} className="text-primary" />
        <h3 className="text-lg font-semibold text-white">Filters</h3>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-light-gray">
            Search
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-surface-container px-3 py-2">
            <Search size={16} className="text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search books"
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-on-surface-variant"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-light-gray">
            Availability
          </label>
          <div className="space-y-2 text-sm text-on-surface-variant">
            {availabilityOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => toggleValue('availability', option)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-surface-container px-3 py-2 text-left hover:border-primary/40"
              >
                <span className="capitalize">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-light-gray">
            Format
          </label>
          <div className="space-y-2 text-sm text-on-surface-variant">
            {formatOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => toggleValue('format', option)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-surface-container px-3 py-2 text-left hover:border-primary/40"
              >
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-light-gray">
            Language
          </label>
          <select
            defaultValue={languageOptions[0]}
            onChange={(e) => onFilterChange?.({ language: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-surface-container px-3 py-2 text-sm text-white outline-none"
          >
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BookFilters;
