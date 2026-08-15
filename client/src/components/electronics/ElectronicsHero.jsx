// src/components/electronics/ElectronicsHero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleShopDeals = () => {
    const el = document.getElementById('electronics-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSellTech = () => {
    navigate('/contact?subject=Sell%20Tech');
  };

  return (
    <section className="max-w-7xl mx-auto px-6 mb-8">
      <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center shadow-2xl border border-white/10">

        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 text-xs font-bold uppercase tracking-widest mb-3">
            Verified Quality & Instant Delivery
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tight">
            Electronics Marketplace
          </h1>
          {/* Gold divider */}
          <div className="w-24 h-1.5 bg-secondary mx-auto mb-6 rounded-full" />
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover premium tech, unbeatable deals, and a secure platform to buy, sell, or upgrade your digital lifestyle.
          </p>
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleShopDeals}
              className="bg-primary-container text-white px-8 py-3.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Shop Deals
            </button>
            <button
              onClick={handleSellTech}
              className="border border-white/20 text-white px-8 py-3.5 rounded-full font-bold hover:border-secondary hover:text-secondary hover:bg-secondary/10 hover:shadow-[0_0_20px_rgba(233,195,73,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">sell</span>
              Sell Your Tech
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElectronicsHero;