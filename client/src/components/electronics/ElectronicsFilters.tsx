import { Search, SlidersHorizontal } from 'lucide-react';

interface ElectronicsFiltersProps {
  onFilterChange?: (next: {
    conditions?: string[];
    brands?: string[];
    searchQuery?: string;
    maxPrice?: number;
  }) => void;
}

const ElectronicsFilters = ({ onFilterChange }: ElectronicsFiltersProps) => {
  const handleSearch = (value: string) => {
    onFilterChange?.({ searchQuery: value });
  };

  const handleCondition = (condition: string) => {
    onFilterChange?.({ conditions: [condition] });
  };

  const handleBrand = (brand: string) => {
    onFilterChange?.({ brands: [brand] });
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-card-surface/60 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.25)]">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <SlidersHorizontal size={18} className="text-primary" />
        <h3 className="text-lg font-semibold text-white">Filters</h3>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-light-gray">Search</label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-surface-container px-3 py-2">
            <Search size={16} className="text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search devices"
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-on-surface-variant"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-light-gray">Condition</label>
          <div className="space-y-2 text-sm text-on-surface-variant">
            {['New', 'Used', 'Refurbished'].map((condition) => (
              <button
                key={condition}
                type="button"
                onClick={() => handleCondition(condition)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-surface-container px-3 py-2 text-left hover:border-primary/40"
              >
                <span>{condition}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-light-gray">Popular brands</label>
          <div className="space-y-2 text-sm text-on-surface-variant">
            {['Apple', 'Samsung', 'Sony', 'Dell'].map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => handleBrand(brand)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-surface-container px-3 py-2 text-left hover:border-primary/40"
              >
                <span>{brand}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectronicsFilters;
