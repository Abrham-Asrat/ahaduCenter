// src/components/movie/ScreenshotsSection.jsx
import React from 'react';

/**
 * ScreenshotsSection Component
 * 
 * Displays a grid of movie screenshots.
 * 
 * Props:
 * - screenshots: Array of image URLs
 * 
 * Features:
 * - Responsive grid (2 columns)
 * - Hover zoom effect
 * - Rounded corners with border
 */
const ScreenshotsSection = ({ screenshots }) => {
    return (
        <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Screenshots</h2>
            <div className="grid grid-cols-2 gap-3">
                {screenshots.map((url, index) => (
                    <div
                        key={index}
                        className="rounded-lg overflow-hidden border border-white/10 h-32 md:h-48 group"
                    >
                        <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScreenshotsSection;