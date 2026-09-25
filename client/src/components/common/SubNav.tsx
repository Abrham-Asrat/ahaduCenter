// src/components/common/SubNav.jsx
import { useState } from 'react';

type SubNavProps = {
  tabs?: string[];
  onTabChange?: (tab: string) => void;
};

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
const SubNav = ({ tabs, onTabChange }: SubNavProps) => {
  // Default tabs if none provided
  const defaultTabs = ['All', 'Latest', 'Trending', 'Coming Soon', 'Featured', 'Recently Added'];
  const navTabs = tabs || defaultTabs;

  // State to track active tab
  const [activeTab, setActiveTab] = useState(navTabs[0]);

  // Handle tab click
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="sticky top-[4.25rem] z-40 border-b border-white/5 bg-surface-container-lowest backdrop-blur-md">
      <div className="mx-auto max-w-7xl overflow-x-auto px-3 py-2 sm:px-6">
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