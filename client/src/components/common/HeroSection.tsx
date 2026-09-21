// src/components/common/HeroSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShaderHero from './ShaderHero';

/**
 * HeroSection Component
 * 
 * Main hero banner for the home page.
 * Features:
 * - WebGL shader background (via ShaderHero)
 * - Gradient overlay for text readability
 * - Left column: headline, subtext, CTA buttons
 * - Right column: floating glass cards with images (hidden on mobile)
 * 
 * Responsive:
 * - Full width, min 80vh height
 * - Single column on mobile, two columns on desktop
 */
const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <section className="relative min-h-[80vh] flex items-center px-4 sm:px-8 lg:px-20 py-12 overflow-hidden">
            {/* Shader background canvas */}
            <div className="absolute inset-0 w-full h-full -z-10">
                <ShaderHero />
            </div>
            {/* Gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent -z-10" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                {/* Left column - text content */}
                <div className="flex flex-col justify-center space-y-6">
                    <h1 className="font-heading text-5xl md:text-6xl font-bold text-white leading-tight">
                        Your Gateway to <br />
                        <span className="text-primary">Movies, Tech &amp; Books</span>
                    </h1>
                    <p className="text-lg text-on-surface-variant max-w-md">
                        Experience a cinematic journey through premium entertainment, cutting-edge technology, and profound literature.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => navigate('/books')} className="btn-primary px-8 py-3 rounded-lg font-bold">Explore Now</button>
                        <button onClick={() => navigate('/electronics')} className="btn-secondary px-8 py-3 rounded-lg font-bold">Latest Arrivals</button>
                    </div>
                </div>

                {/* Right column - floating glass cards (hidden on mobile) */}
                <div className="hidden md:flex relative justify-center items-center h-[500px]">
                    {/* Movie poster card */}
                    <div className="absolute glass-border-gradient rounded-xl p-3 w-48 h-64 transform -rotate-6 -translate-x-12 translate-y-8 glow-hover transition-all duration-500 hover:scale-105 hover:z-20">
                        <img
                            className="w-full h-full object-cover rounded-lg"
                            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"
                            alt="Movie poster"
                        />
                    </div>
                    {/* Laptop product card */}
                    <div className="absolute glass-border-gradient rounded-xl p-3 w-56 h-40 z-10 glow-hover transition-all duration-500 hover:scale-105">
                        <img
                            className="w-full h-full object-cover rounded-lg"
                            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80"
                            alt="Laptop"
                        />
                    </div>
                    {/* Book cover card */}
                    <div className="absolute glass-border-gradient rounded-xl p-3 w-40 h-56 transform rotate-12 translate-x-16 translate-y-12 glow-hover transition-all duration-500 hover:scale-105 hover:z-20">
                        <img
                            className="w-full h-full object-cover rounded-lg"
                            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
                            alt="Book"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;