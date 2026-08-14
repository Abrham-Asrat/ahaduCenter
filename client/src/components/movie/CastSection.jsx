// src/components/movie/CastSection.jsx
import React from 'react';

/**
 * CastSection Component
 * 
 * Displays a horizontal scrollable list of cast members.
 * 
 * Props:
 * - cast: Array of objects { id, name, role, photoUrl }
 * 
 * Features:
 * - Horizontal scroll on all devices
 * - Circular avatars with border
 * - Name and role below each avatar
 */
const CastSection = ({ cast }) => {
    return (
        <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Cast</h2>
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
                {cast.map((actor) => (
                    <div key={actor.id} className="flex flex-col items-center min-w-[100px]">
                        {/* Actor avatar */}
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 mb-2">
                            <img
                                className="w-full h-full object-cover"
                                src={actor.photoUrl}
                                alt={actor.name}
                            />
                        </div>
                        {/* Actor name */}
                        <span className="text-sm text-white text-center">{actor.name}</span>
                        {/* Role */}
                        <span className="text-xs text-on-surface-variant text-center mt-1">
                            {actor.role}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CastSection;