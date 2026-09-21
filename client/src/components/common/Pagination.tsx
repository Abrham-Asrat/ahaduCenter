// src/components/common/Pagination.jsx
import React from 'react';

/**
 * Pagination Component
 * 
 * Reusable pagination controls for lists and grids.
 * 
 * Props:
 * - currentPage: Number (current active page)
 * - totalPages: Number (total number of pages)
 * - onPageChange: Function (callback when page changes)
 * 
 * Features:
 * - Previous/Next arrows
 * - Page number buttons
 * - Ellipsis for large page ranges
 * - Active page highlighted with primary color
 */
const Pagination = ({ currentPage = 1, totalPages = 5, onPageChange }) => {

  // Generate page numbers array (simplified - just show 1-3 + ellipsis + last)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [1, 2, 3, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded glass-panel flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {/* Page numbers */}
      {pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="text-on-surface-variant">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded text-sm transition-all ${currentPage === page
                ? 'bg-primary-container text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'glass-panel text-on-surface-variant hover:text-on-surface hover:border-white/30'
              }`}
          >
            {page}
          </button>
        )
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded glass-panel flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;