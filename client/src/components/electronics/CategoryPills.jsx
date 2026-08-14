// src/components/electronics/CategoryPills.jsx
import React, { useState } from 'react';

/**
 * CategoryPills Component
 * 
 * Horizontal scrollable category filter pills.
 * 
 * Props:
 * - categories: Array of category names
 * - onCategoryChange: Callback when category changes
 * 
 * State:
 * - activeCategory: Currently selected category
 */
const CategoryPills = ({ categories, onCategoryChange }) => {
    const [activeCategory, setActiveCategory] = useState(categories[0] || 'All');

    const handleClick = (category) => {
        setActiveCategory(category);
        if (onCategoryChange) {
            onCategoryChange(category);
        }
    };

    return (
        <div className="w-full overflow-x-auto no-scrollbar">
            <div className="flex gap-3 whitespace-nowrap pb-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleClick(category)}
                        className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${activeCategory === category
                                ? 'bg-primary-container/20 border border-primary text-primary'
                                : 'glass-panel text-on-surface-variant hover:text-white'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryPills;