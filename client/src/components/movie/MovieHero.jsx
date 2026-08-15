// src/components/movie/MovieHero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * MovieHero Component
 * 
 * Hero banner for the Movie Center page.
 * Features:
 * - Full-width banner with background image
 * - Gradient overlays for text readability
 * - Title "Movie Center"
 * - Two CTA buttons: Request a Movie, Browse by Country
 */
const MovieHero = () => {
    const navigate = useNavigate();

    const handleBrowseClick = () => {
        const catalogEl = document.getElementById('movie-catalog');
        if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden border-b border-white/10">

            {/* Background Image - cinematic theater scene */}
            <div
                className="absolute inset-0 bg-surface-container-low z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/20 to-secondary/10 z-10 mix-blend-overlay" />

            {/* Content Container */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-8">
                {/* Page Title */}
                <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-4">
                    Movie Center
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
                    Immerse yourself in our premium collection of cinematic experiences from around the world.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                    {/* Request a Movie - Primary button */}
                    <button
                        onClick={() => navigate('/movie-request')}
                        className="bg-primary-container text-white px-8 py-3 rounded transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 flex items-center gap-2 font-semibold"
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            movie
                        </span>
                        Request a Movie
                    </button>

                    {/* Browse by Country - Secondary outline button */}
                    <button
                        onClick={handleBrowseClick}
                        className="bg-transparent text-secondary px-8 py-3 rounded border border-secondary transition-all hover:shadow-[0_0_20px_rgba(233,195,73,0.4)] hover:bg-secondary/10 hover:scale-105 active:scale-95 flex items-center gap-2 font-semibold"
                    >
                        <span className="material-symbols-outlined">public</span>
                        Browse by Country
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MovieHero;