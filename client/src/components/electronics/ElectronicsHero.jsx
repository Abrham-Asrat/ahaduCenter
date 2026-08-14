// src/components/electronics/ElectronicsHero.jsx
import React from 'react';

/**
 * ElectronicsHero Component
 * 
 * Hero banner for the Electronics Marketplace page.
 * Features:
 * - Glass panel with dotted pattern background
 * - Title "Electronics Marketplace"
 * - Gold divider
 * - Subtitle text
 * - Two CTA buttons: Shop Deals, Sell Your Tech
 */
const ElectronicsHero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-8">
      <div className="glass-panel rounded-xl p-8 relative overflow-hidden flex flex-col items-center text-center">
        
        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Electronics Marketplace
          </h1>
          {/* Gold divider */}
          <div className="w-24 h-1 bg-secondary mx-auto mb-6" />
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
            Discover premium tech, unbeatable deals, and a secure platform to upgrade your digital life.
          </p>
          {/* CTA buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-primary-container text-white px-6 py-3 rounded-full font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
              Shop Deals
            </button>
            <button className="border border-white/20 text-white px-6 py-3 rounded-full font-bold hover:border-secondary hover:text-secondary hover:shadow-[0_0_20px_rgba(233,195,73,0.2)] transition-all">
              Sell Your Tech
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElectronicsHero;