// src/components/electronics/ElectronicsFilters.jsx
import React, { useState } from 'react';

/**
 * ElectronicsFilters Component
 * 
 * Sidebar filter panel for electronics products.
 * 
 * State:
 * - selectedConditions: Array of selected conditions (New, Used, Refurbished)
 * 
 * Props:
 * - onFilterChange: Callback when filters change
 */
const ElectronicsFilters = ({ onFilterChange }) => {
    const [selectedConditions, setSelectedConditions] = useState([]);

    const handleConditionChange = (condition) => {
        let updated;
        if (selectedConditions.includes(condition)) {
            updated = selectedConditions.filter((c) => c !== condition);
        } else {
            updated = [...selectedConditions, condition];
        }
        setSelectedConditions(updated);
        if (onFilterChange) {
            onFilterChange({ conditions: updated });
        }
    };

    return (
        <div className="sticky top-32 space-y-6">
            <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-3 mb-6">
                Filters
            </h2>

            {/* Condition filter group */}
            <div>
                <h3 className="text-base font-bold text-white mb-3">Condition</h3>
                <div className="space-y-3">
                    {['New', 'Used', 'Refurbished'].map((condition) => (
                        <label
                            key={condition}
                            className="flex items-center space-x-2 text-on-surface-variant cursor-pointer hover:text-primary transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedConditions.includes(condition)}
                                onChange={() => handleConditionChange(condition)}
                                className="form-checkbox text-primary-container bg-surface border-outline-variant rounded focus:ring-primary focus:ring-offset-background"
                            />
                            <span>{condition}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Additional filters can be added here (price range, brand, etc.) */}
        </div>
    );
};

export default ElectronicsFilters;