import { useState, type ChangeEvent } from 'react';

export type FilterGroup = {
  key: string;
  label: string;
  options: string[];
  defaultValue?: string;
};

export type FilterValues = Record<string, string[]> & {
  searchQuery: string;
};

interface FiltersProps {
  groups: FilterGroup[];
  onFilterChange?: (filters: FilterValues) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
}

const Filters = ({
  groups,
  onFilterChange,
  searchLabel = 'Search',
  searchPlaceholder = 'Search...',
}: FiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(groups.map((group) => [group.key, group.defaultValue ?? group.options[0] ?? '']))
  );

  const triggerChange = (values: Record<string, string>, nextSearchQuery = searchQuery) => {
    const filters = groups.reduce<Record<string, string[]>>((result, group) => {
      const value = values[group.key];
      result[group.key] = !value || value === group.options[0] ? [] : [value];
      return result;
    }, {});

    onFilterChange?.({ ...filters, searchQuery: nextSearchQuery });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    triggerChange(selectedValues, value);
  };

  const handleGroupChange = (group: FilterGroup, event: ChangeEvent<HTMLSelectElement>) => {
    const values = { ...selectedValues, [group.key]: event.target.value };
    setSelectedValues(values);
    triggerChange(values);
  };

  const handleClearAll = () => {
    const defaults = Object.fromEntries(
      groups.map((group) => [group.key, group.defaultValue ?? group.options[0] ?? ''])
    );
    setSearchQuery('');
    setSelectedValues(defaults);
    triggerChange(defaults, '');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    groups.some((group) => selectedValues[group.key] !== (group.defaultValue ?? group.options[0] ?? ''));

  return (
    <div className="glass-panel rounded-xl p-6 sticky top-[150px] shadow-xl">
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

      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          {searchLabel}
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full bg-surface-container border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-primary outline-none transition-all"
          />
          <span className="material-symbols-outlined text-on-surface-variant text-lg absolute left-2.5 top-2.5 pointer-events-none">
            search
          </span>
        </div>
      </div>

      {groups.map((group) => (
        <div className="mb-6" key={group.key}>
          <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
            {group.label}
          </label>
          <select
            value={selectedValues[group.key] ?? group.options[0] ?? ''}
            onChange={(event) => handleGroupChange(group, event)}
            className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
          >
            {group.options.map((option) => (
              <option key={option} value={option} className="bg-surface-container-high text-white">
                {option === group.options[0] ? `All ${group.label}` : option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default Filters;
