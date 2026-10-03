import { useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

type ElectronicsFilterState = {
  conditions: string[];
  brands: string[];
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
};

const MIN_PRICE = 0;
const MAX_PRICE = 150000;
const PRICE_STEP = 1000;

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
  const { t } = useTranslation();
  // const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  // const [contentType, setContentType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConditions, setSelectedConditions] = useState('All');
  const [selectedBrands, setSelectedBrands] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: MIN_PRICE, max: MAX_PRICE });

  const brandType = [t('filters.all', { label: '' }).trim() || 'All', 'Apple', 'Dell', 'Samsung', 'Hp', 'sony'];
  const conditions = [
    t('filters.all', { label: '' }).trim() || 'All',
    t('electronics.conditionNew'),
    t('electronics.conditionUsed'),
    t('electronics.conditionRefurbished')
  ];

  const triggerChange = (updated: Partial<ElectronicsFilterState>) => {
    if (onFilterChange) {
      onFilterChange({
        conditions: selectedConditions === 'All' ? [] : [selectedConditions],
        brands: selectedBrands === 'All' ? [] : [selectedBrands],
        searchQuery,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
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

  const handlePriceChange = (kind: 'min' | 'max', value: number) => {
    const nextRange = kind === 'min'
      ? { min: Math.min(value, priceRange.max - PRICE_STEP), max: priceRange.max }
      : { min: priceRange.min, max: Math.max(value, priceRange.min + PRICE_STEP) };
    setPriceRange(nextRange);
    triggerChange({ minPrice: nextRange.min, maxPrice: nextRange.max });
  };


  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedConditions('All');
    setSelectedBrands('All');
    setPriceRange({ min: MIN_PRICE, max: MAX_PRICE });
    triggerChange({
      conditions: [],
      brands: [],
      searchQuery: '',
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
    });
  };

  const hasActiveFilters = selectedConditions !== 'All' || searchQuery !== '' || selectedBrands !== 'All' || priceRange.min > MIN_PRICE || priceRange.max < MAX_PRICE;

  return (
    <div className="glass-panel rounded-xl p-6 sticky top-[150px] shadow-xl">
      {/* Filters Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">tune</span>
          <h2 className="text-xl font-bold text-white">{t('filters.filters')}</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-secondary hover:underline cursor-pointer font-semibold transition-colors"
          >
            {t('filters.clearFilters')}
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          {t('books.searchLabel')}
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('nav.searchPlaceholder')}
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
          {t('filters.condition')}
        </label>
        <select
          value={selectedConditions}
          onChange={handleConditionsChange}
          className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
        >
          {conditions.map((c) => (
            <option key={c} value={c} className="bg-surface-container-high text-white">
              {c}
            </option>
          ))}
        </select>
      </div>



      {/* Content Type Filter Group */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          {t('filters.brand')}
        </label>
        <select
          value={selectedBrands}
          onChange={handleBrandChange}
          className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
        >
          {brandType.map((c) => (
            <option key={c} value={c} className="bg-surface-container-high text-white">
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">
          {t('filters.priceRange')}
        </label>
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-white" aria-live="polite">
          <span>${priceRange.min.toLocaleString()}</span>
          <span>${priceRange.max.toLocaleString()}</span>
        </div>
        <div className="relative h-6" style={{ '--price-min': `${(priceRange.min / MAX_PRICE) * 100}%`, '--price-max': `${(priceRange.max / MAX_PRICE) * 100}%` } as React.CSSProperties}>
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/15" />
          <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary" style={{ left: `var(--price-min)`, right: `calc(100% - var(--price-max))` }} />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={PRICE_STEP}
            value={priceRange.min}
            onChange={(event) => handlePriceChange('min', event.currentTarget.valueAsNumber)}
            aria-label={t('filters.minimumPrice')}
            className="price-range-slider"
            style={{ zIndex: priceRange.min > MAX_PRICE / 2 ? 5 : 3 }}
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={PRICE_STEP}
            value={priceRange.max}
            onChange={(event) => handlePriceChange('max', event.currentTarget.valueAsNumber)}
            aria-label={t('filters.maximumPrice')}
            className="price-range-slider"
            style={{ zIndex: priceRange.max < MAX_PRICE / 2 ? 5 : 4 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ElectionicsFilters;