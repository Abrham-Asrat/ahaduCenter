// src/components/movie/TrailerSection.jsx
import React from 'react';

/**
 * TrailerSection Component
 * 
 * Displays a video placeholder with play button overlay.
 * 
 * Props:
 * - thumbnailUrl: Image URL for the trailer thumbnail
 * - onPlayTrailer: Function triggered when play button is clicked
 */
const TrailerSection = ({ thumbnailUrl, onPlayTrailer }) => {
    return (
        <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">play_circle</span>
                <span>Trailer & Video</span>
            </h2>
            <div
                onClick={onPlayTrailer}
                className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-black border border-white/10 group cursor-pointer shadow-xl hover:border-primary/50 transition-all"
            >
                {/* Thumbnail image */}
                <img
                    className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                    src={thumbnailUrl}
                    alt="Trailer thumbnail"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary-container/80 border border-primary flex items-center justify-center emerald-glow group-hover:scale-110 active:scale-95 transition-all shadow-2xl">
                        <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_arrow
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrailerSection;