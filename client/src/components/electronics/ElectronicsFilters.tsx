import { useState, type ChangeEvent } from 'react';

type ElectronicsFilterState = {
  conditions: string[];
  brands: string[];
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
};

interface ElectronicsFiltersProps {
  onFilterChange?: (filters: ElectronicsFilterState) => void;
}

/**
 * Electronics Filters Component
 * 
 * Sidebar filter panel for Electronics s.
 * 
 * Props:
 * - onFilterChange: Callback function triggered when any filter updates
 */
const ElectionicsFilters = ({ onFilterChange }: ElectronicsFiltersProps) => {
  // const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  // const [contentType, setContentType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConditions, setSelectedConditions] = useState('All');
  const [selectedBrands, setSelectedBrands] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const brandType = ['All', 'Apple ', 'Dell', 'Samsung', 'Hp', 'sony'];
  const conditions = ['All', 'New', 'Used', 'slightly-used'];

  const triggerChange = (updated: Partial<ElectronicsFilterState>) => {
    if (onFilterChange) {
      onFilterChange({
        conditions: selectedConditions === 'All' ? [] : [selectedConditions],
        brands: selectedBrands === 'All' ? [] : [selectedBrands],
        searchQuery,
        minPrice: minPrice ? Number(minPrice) : 0,
        maxPrice: maxPrice ? Number(maxPrice) : 150000,
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
    const brands = e.target.value;
    setSelectedBrands(brands);
    triggerChange({ brands: brands === 'All' ? [] : [brands] });
  };

  const handleConditionsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const conditions = e.target.value;
    setSelectedConditions(conditions);
    triggerChange({ conditions: conditions === 'All' ? [] : [conditions] });
  };

  const handlePriceChange = (kind: 'min' | 'max', value: string) => {
    if (kind === 'min') setMinPrice(value);
    else setMaxPrice(value);
    triggerChange({
      minPrice: kind === 'min' ? (value ? Number(value) : 0) : minPrice ? Number(minPrice) : 0,
      maxPrice: kind === 'max' ? (value ? Number(value) : 150000) : maxPrice ? Number(maxPrice) : 150000,
    });
  };


  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedConditions('All');
    setSelectedBrands('All');
    setMinPrice('');
    setMaxPrice('');
    triggerChange({
      conditions: [],
      brands: [],
      searchQuery: '',
      minPrice: 0,
      maxPrice: 150000,
    });
  };

  const hasActiveFilters = selectedConditions !== 'All' || searchQuery !== '' || selectedBrands !== 'All' || minPrice !== '' || maxPrice !== '';

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
            placeholder="Search Electronics s..."
            className="w-full bg-surface-container border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-primary outline-none transition-all"
          />
          <span className="material-symbols-outlined text-on-surface-variant text-lg absolute left-2.5 top-2.5 pointer-events-none">
            search
          </span>
        </div>
      </div>

      {/* Conditions Filter */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          Conditions
        </label>
        <select
          value={selectedConditions}
          onChange={handleConditionsChange}
          className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
        >
          {conditions.map((c) => (
            <option key={c} value={c} className="bg-surface-container-high text-white">
              {c === 'All' ? 'All' : c}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" min="0" value={minPrice} onChange={(e) => handlePriceChange('min', e.target.value)} placeholder="Min" aria-label="Minimum price" className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none" />
          <input type="number" min="0" value={maxPrice} onChange={(e) => handlePriceChange('max', e.target.value)} placeholder="Max" aria-label="Maximum price" className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none" />
        </div>
      </div>

      {/* Content Type Filter Group */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          Brands
        </label>
        <select
          value={selectedBrands}
          onChange={handleBrandChange}
          className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
        >
          {brandType.map((c) => (
            <option key={c} value={c} className="bg-surface-container-high text-white">
              {c === 'All' ? 'All Types' : c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ElectionicsFilters;