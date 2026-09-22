// src/components/electronics/ElectronicsFilters.jsx
import { useState } from 'react';

type ElectronicsFiltersProps = {
    onFilterChange?: (filters: {
        conditions: string[];
        brands: string[];
        searchQuery: string;
        maxPrice: number;
    }) => void;
};

/**
 * ElectronicsFilters Component
 * 
 * Sidebar filter panel for electronics products.
 * 
 * Props:
 * - onFilterChange: Callback when filters change
 */
const ElectronicsFilters = ({ onFilterChange }: ElectronicsFiltersProps) => {
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState(150000);

    const brands = ['Dell', 'Apple', 'Sony', 'JBL', 'Logitech', 'Lenovo', 'Anker', 'Samsung', 'TP-Link'];

    const triggerChange = (updated: Partial<{ conditions: string[]; brands: string[]; searchQuery: string; maxPrice: number }>) => {
        if (onFilterChange) {
            onFilterChange({
                conditions: selectedConditions,
                brands: selectedBrands,
                searchQuery,
                maxPrice,
                ...updated,
            });
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        triggerChange({ searchQuery: val });
    };

    const handleConditionChange = (condition: string) => {
        const updated = selectedConditions.includes(condition)
            ? selectedConditions.filter((c) => c !== condition)
            : [...selectedConditions, condition];
        setSelectedConditions(updated);
        triggerChange({ conditions: updated });
    };

    const handleBrandChange = (brand: string) => {
        const updated = selectedBrands.includes(brand)
            ? selectedBrands.filter((b) => b !== brand)
            : [...selectedBrands, brand];
        setSelectedBrands(updated);
        triggerChange({ brands: updated });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setMaxPrice(val);
        triggerChange({ maxPrice: val });
    };

    const handleClearAll = () => {
        setSelectedConditions([]);
        setSelectedBrands([]);
        setSearchQuery('');
        setMaxPrice(150000);
        triggerChange({
            conditions: [],
            brands: [],
            searchQuery: '',
            maxPrice: 150000,
        });
    };

    const hasActiveFilters = selectedConditions.length > 0 || selectedBrands.length > 0 || searchQuery !== '' || maxPrice < 150000;

    return (
        <div className="glass-panel p-6 rounded-2xl sticky top-28 space-y-6 shadow-xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">tune</span>
                    <h2 className="text-xl font-bold text-white">Filters</h2>
                </div>
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
                    Search Product
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search tech..."
                        className="w-full bg-surface-container border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-primary outline-none"
                    />
                    <span className="material-symbols-outlined text-on-surface-variant text-lg absolute left-2.5 top-2.5 pointer-events-none">
                        search
                    </span>
                </div>
            </div>

            {/* Condition filter group */}
            <div>
                <h3 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3 font-semibold">Condition</h3>
                <div className="space-y-2">
                    {['New', 'Used', 'Refurbished'].map((condition) => (
                        <label
                            key={condition}
                            className="flex items-center gap-2.5 text-on-surface-variant cursor-pointer group select-none hover:text-white"
                        >
                            <input
                                type="checkbox"
                                checked={selectedConditions.includes(condition)}
                                onChange={() => handleConditionChange(condition)}
                                className="w-4 h-4 rounded bg-surface border-white/20 text-primary focus:ring-primary cursor-pointer"
                            />
                            <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{condition}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Brand filter group */}
            <div>
                <h3 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3 font-semibold">Brand</h3>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <label
                            key={brand}
                            className="flex items-center gap-2.5 text-on-surface-variant cursor-pointer group select-none hover:text-white"
                        >
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandChange(brand)}
                                className="w-4 h-4 rounded bg-surface border-white/20 text-primary focus:ring-primary cursor-pointer"
                            />
                            <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{brand}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price filter */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Max Price</h3>
                    <span className="text-sm font-bold text-primary">ETB {maxPrice.toLocaleString()}</span>
                </div>
                <input
                    type="range"
                    min="100"
                    max="150000"
                    step="1000"
                    value={maxPrice}
                    onChange={handlePriceChange}
                    className="w-full accent-primary cursor-pointer"
                />
            </div>
        </div>
    );
};

export default ElectronicsFilters;