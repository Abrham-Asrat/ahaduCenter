// src/components/common/BentoGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BentoGrid Component
 * 
 * Displays a bento-style grid of curated collections.
 * Features:
 * - Movies (large card spanning 2 columns)
 * - Electronics (single card)
 * - Books (single card)
 * - Join the Community (spans 2 columns)
 * 
 * Responsive:
 * - 1 column on mobile
 * - 3 columns on desktop
 */
const BentoGrid = () => {
    return (
        <section className="py-12 px-4 sm:px-8 lg:px-20 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Curated Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Movies large card */}
                <Link to="/movies" className="md:col-span-2 glass-border-gradient rounded-xl overflow-hidden group relative min-h-[400px] cursor-pointer">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151B28] via-[#151B28]/50 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-8">
                        <span className="text-xs uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded w-fit mb-2">
                            Featured
                        </span>
                        <h3 className="text-2xl font-semibold text-white mb-2">Cinematic Masterpieces</h3>
                        <p className="text-on-surface-variant max-w-md">
                            Immerse yourself in our hand-picked selection of award-winning films and blockbuster hits.
                        </p>
                    </div>
                </Link>

                {/* Electronics card */}
                <Link to="/electronics" className="glass-border-gradient rounded-xl overflow-hidden group relative min-h-[400px] cursor-pointer">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151B28] via-[#151B28]/50 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-semibold text-white mb-2">Next-Gen Tech</h3>
                        <p className="text-sm text-on-surface-variant">Elevate your setup.</p>
                    </div>
                </Link>

                {/* Books card */}
                <Link to="/books" className="glass-border-gradient rounded-xl overflow-hidden group relative min-h-[300px] md:col-span-1 cursor-pointer">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151B28] via-[#151B28]/50 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-semibold text-white mb-2">Bestsellers</h3>
                        <p className="text-sm text-on-surface-variant">Expand your mind.</p>
                    </div>
                </Link>

                {/* Community card */}
                <Link to="/register" className="md:col-span-2 glass-border-gradient rounded-xl p-6 flex items-center justify-between group glow-hover cursor-pointer">
                    <div>
                        <h4 className="text-2xl font-semibold text-white">Join the Community</h4>
                        <p className="text-sm text-on-surface-variant">Get access to exclusive drops.</p>
                    </div>
                    <span className="btn-primary rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                </Link>
            </div>
        </section>
    );
};

export default BentoGrid;
