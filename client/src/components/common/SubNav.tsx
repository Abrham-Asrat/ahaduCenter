// src/components/common/SubNav.jsx
import React, { useState } from 'react';

/**
 * SubNav Component
 * 
 * Horizontal scrollable pill navigation for filtering content.
 * 
 * State:
 * - activeTab: Tracks which tab is currently selected
 * 
 * Props:
 * - tabs: Array of tab labels (optional, defaults to movie tabs)
 * - onTabChange: Callback function when tab changes
 * 
 * Features:
 * - Sticky positioning below main header
 * - Horizontal scrolling on mobile
 * - Active tab highlighted with primary color
 */
const SubNav = ({ tabs, onTabChange }) => {
  // Default tabs if none provided
  const defaultTabs = ['All', 'Latest', 'Trending', 'Coming Soon', 'Featured', 'Recently Added'];
  const navTabs = tabs || defaultTabs;

  // State to track active tab
  const [activeTab, setActiveTab] = useState(navTabs[0]);

  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="border-b border-white/5 bg-surface-container-lowest sticky top-[80px] z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3 overflow-x-auto">
        <ul className="flex gap-3 items-center min-w-max">
          {navTabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-2 rounded-full text-sm transition-all ${activeTab === tab
                    ? 'bg-primary-container/20 border border-primary text-primary shadow-[0_0_10px_rgba(78,222,163,0.2)]'
                    : 'bg-surface-variant border border-white/10 text-on-surface-variant hover:text-on-surface hover:border-white/30'
                  }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubNav;