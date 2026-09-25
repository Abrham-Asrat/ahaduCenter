import { useState, type ChangeEvent } from 'react';

export type FilterGroup = {
  key: string;
  label: string;
  options: string[];
  defaultValue?: string;
  multiSelect?: boolean;
};

export type FilterValues = {
  searchQuery: string;
  [key: string]: string | string[];
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
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      groups.map((group) => [
        group.key,
        group.multiSelect ? [] : [group.defaultValue ?? group.options[0] ?? ''],
      ])
    )
  );
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const triggerChange = (values: Record<string, string[]>, nextSearchQuery = searchQuery) => {
    const filters = groups.reduce<Record<string, string[]>>((result, group) => {
      const valuesForGroup = values[group.key] ?? [];
      const defaultValue = group.defaultValue ?? group.options[0] ?? '';
      result[group.key] = group.multiSelect
        ? valuesForGroup
        : valuesForGroup[0] === defaultValue
          ? []
          : valuesForGroup;
      return result;
    }, {});

    onFilterChange?.({ ...filters, searchQuery: nextSearchQuery });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    triggerChange(selectedValues, value);
  };

  const handleSelectChange = (group: FilterGroup, event: ChangeEvent<HTMLSelectElement>) => {
    const values = { ...selectedValues, [group.key]: [event.target.value] };
    setSelectedValues(values);
    triggerChange(values);
  };

  const handleMultiSelectChange = (group: FilterGroup, option: string) => {
    const currentValues = selectedValues[group.key] ?? [];
    const nextValues = currentValues.includes(option)
      ? currentValues.filter((value) => value !== option)
      : [...currentValues, option];
    const values = { ...selectedValues, [group.key]: nextValues };
    setSelectedValues(values);
    triggerChange(values);
  };

  const handleClearAll = () => {
    const defaults = Object.fromEntries(
      groups.map((group) => [
        group.key,
        group.multiSelect ? [] : [group.defaultValue ?? group.options[0] ?? ''],
      ])
    );
    setSearchQuery('');
    setSelectedValues(defaults);
    setOpenGroup(null);
    triggerChange(defaults, '');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    groups.some((group) => {
      const values = selectedValues[group.key] ?? [];
      return group.multiSelect
        ? values.length > 0
        : values[0] !== (group.defaultValue ?? group.options[0] ?? '');
    });

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

      {groups.map((group) => {
        const values = selectedValues[group.key] ?? [];
        const selectedLabel = values.length === 0 ? `Select ${group.label}` : `${values.length} Selected (${values.join(', ')})`;

        return (
          <div className="mb-6 relative" key={group.key}>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
              {group.label}
            </label>
            {group.multiSelect ? (
              <>
                <button
                  type="button"
                  onClick={() => setOpenGroup((current) => (current === group.key ? null : group.key))}
                  className="w-full flex items-center justify-between bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer transition-all"
                >
                  <span className="truncate">{selectedLabel}</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">
                    {openGroup === group.key ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {openGroup === group.key && (
                  <div className="absolute z-20 left-0 right-0 mt-2 bg-surface-container border border-white/10 rounded-lg p-2 space-y-1 max-h-48 overflow-y-auto shadow-2xl backdrop-blur-md">
                    {group.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2.5 cursor-pointer select-none hover:bg-white/5 p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={values.includes(option)}
                          onChange={() => handleMultiSelectChange(group, option)}
                          className="w-4 h-4 rounded bg-surface-dim border-white/20 text-primary focus:ring-primary focus:ring-offset-background cursor-pointer"
                        />
                        <span className="text-sm text-on-surface">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <select
                value={values[0] ?? group.options[0] ?? ''}
                onChange={(event) => handleSelectChange(group, event)}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
              >
                {group.options.map((option) => (
                  <option key={option} value={option} className="bg-surface-container-high text-white">
                    {option === (group.defaultValue ?? group.options[0]) ? `All ${group.label}` : option}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Filters;
