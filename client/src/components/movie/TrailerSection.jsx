// src/components/movie/TrailerSection.jsx
import React from 'react';

/**
 * TrailerSection Component
 * 
 * Displays a video placeholder with play button overlay.
 * 
 * Props:
 * - thumbnailUrl: Image URL for the trailer thumbnail
 */
const TrailerSection = ({ thumbnailUrl }) => {
    return (
        <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Trailer</h2>
            <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-black border border-white/10 group cursor-pointer">
                {/* Thumbnail image */}
                <img
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                    src={thumbnailUrl}
                    alt="Trailer thumbnail"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary flex items-center justify-center emerald-glow transition-all">
                        <span className="material-symbols-outlined text-primary text-3xl">play_arrow</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrailerSection;