// src/components/movie/ScreenshotsSection.jsx
import React from 'react';

/**
 * ScreenshotsSection Component
 * 
 * Displays a grid of movie screenshots.
 * 
 * Props:
 * - screenshots: Array of image URLs
 * - onSelectScreenshot: Callback function when a screenshot is clicked
 */
const ScreenshotsSection = ({ screenshots, onSelectScreenshot }) => {
    return (
        <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">photo_library</span>
                    <span>Screenshots</span>
                </span>
                <span className="text-xs text-on-surface-variant font-medium">Click image to enlarge</span>
            </h2>
            <div className="grid grid-cols-2 gap-3.5">
                {screenshots.map((url, index) => (
                    <div
                        key={index}
                        onClick={() => onSelectScreenshot && onSelectScreenshot(url)}
                        className="rounded-lg overflow-hidden border border-white/10 h-32 md:h-48 group cursor-pointer relative shadow-md hover:border-primary/40 transition-all"
                    >
                        <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScreenshotsSection;