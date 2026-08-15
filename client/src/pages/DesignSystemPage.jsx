// src/pages/DesignSystemPage.jsx
import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * DesignSystemPage Component
 * 
 * Displays the complete design system for Ahadu Center.
 * Includes:
 * - Color palette with primary, secondary, background, surface colors
 * - Typography samples (Poppins headings, Inter body)
 * - Buttons (primary, secondary, ghost, danger)
 * - Badges and chips
 * - Form controls (inputs, selects, checkboxes, toggles)
 * - Card examples (product card, movie card)
 * 
 * This page is a reference for developers and designers.
 */
const DesignSystemPage = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Ahadu Center Design System</h1>
          <p className="text-lg text-on-surface-variant">Comprehensive UI/UX guidelines and components.</p>
          <div className="mt-4 inline-block bg-secondary/10 px-4 py-1 rounded-full border border-secondary/30">
            <span className="text-xs uppercase tracking-widest text-secondary">v1.0</span>
          </div>
        </header>

        {/* Color Palette Section */}
        <section className="mb-16">
          <SectionTitle title="Color Palette" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Background */}
            <ColorSwatch
              colorHex="#0B0F19"
              name="Background"
              className="bg-[#0B0F19] border border-white/10"
            />
            {/* Surface */}
            <ColorSwatch
              colorHex="#151B28"
              name="Surface"
              className="bg-[#151B28] border border-white/10"
            />
            {/* Primary Emerald */}
            <ColorSwatch
              colorHex="#10B981"
              name="Emerald (Primary)"
              className="bg-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            />
            {/* Secondary Gold */}
            <ColorSwatch
              colorHex="#D4AF37"
              name="Gold (Secondary)"
              className="bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            />
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16">
          <SectionTitle title="Typography" />
          <div className="glass-panel rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Headings (Poppins) */}
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <p className="text-xs uppercase text-on-surface-variant mb-2">Headline XL - Poppins</p>
                <h1 className="text-5xl font-bold text-white">Cinematic Presence</h1>
              </div>
              <div className="border-b border-white/10 pb-4">
                <p className="text-xs uppercase text-on-surface-variant mb-2">Headline LG - Poppins</p>
                <h2 className="text-3xl font-bold text-white">Premium Galleries</h2>
              </div>
              <div>
                <p className="text-xs uppercase text-on-surface-variant mb-2">Headline MD - Poppins</p>
                <h3 className="text-2xl font-semibold text-white">Section Headers</h3>
              </div>
            </div>

            {/* Body (Inter) */}
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <p className="text-xs uppercase text-on-surface-variant mb-2">Body LG - Inter</p>
                <p className="text-lg text-on-surface-variant">For immersive, longer-form reading experiences.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <p className="text-xs uppercase text-on-surface-variant mb-2">Body MD - Inter</p>
                <p className="text-base text-on-surface-variant">Standard text for descriptions and UI elements.</p>
              </div>
              <div>
                <p className="text-xs uppercase text-on-surface-variant mb-2">Label Caps - Inter</p>
                <span className="text-xs uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Status Badge
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <SectionTitle title="Buttons" />
          <div className="glass-panel rounded-xl p-6 flex flex-wrap gap-4">
            <button className="bg-[#10B981] text-white px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all">
              Primary Action
            </button>
            <button className="bg-transparent border border-[#D4AF37] text-[#D4AF37] px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all">
              Secondary Outline
            </button>
            <button className="bg-transparent text-on-surface hover:text-[#10B981] px-6 py-2 rounded-lg transition-colors">
              Ghost Button
            </button>
            <button className="bg-error/20 text-error border border-error/50 px-6 py-2 rounded-lg hover:bg-error/30 transition-all">
              Danger
            </button>
            <button className="bg-surface-variant text-on-surface-variant px-6 py-2 rounded-lg opacity-50 cursor-not-allowed">
              Disabled
            </button>
          </div>
        </section>

        {/* Badges & Chips Section */}
        <section className="mb-16">
          <SectionTitle title="Badges & Chips" />
          <div className="glass-panel rounded-xl p-6 flex flex-wrap gap-4">
            <span className="bg-[#10B981]/15 text-[#10B981] text-xs uppercase px-3 py-1 rounded-full border border-[#10B981]/30">
              Available
            </span>
            <span className="bg-[#D4AF37]/15 text-[#D4AF37] text-xs uppercase px-3 py-1 rounded-full border border-[#D4AF37]/30">
              Coming Soon
            </span>
            <span className="bg-surface-variant text-on-surface text-xs uppercase px-3 py-1 rounded-full border border-white/10">
              Used - Good
            </span>
            <span className="bg-error/15 text-error text-xs uppercase px-3 py-1 rounded-full border border-error/30">
              Out of Stock
            </span>
          </div>
        </section>

        {/* Form Controls Section */}
        <section className="mb-16">
          <SectionTitle title="Form Controls" />
          <div className="glass-panel rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text input */}
            <div>
              <label className="block text-xs uppercase text-on-surface-variant mb-2">Text Input</label>
              <input
                type="text"
                placeholder="Enter value..."
                className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Select */}
            <div>
              <label className="block text-xs uppercase text-on-surface-variant mb-2">Select</label>
              <select className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-all">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-[#0B0F19] text-primary focus:ring-primary" />
              <span className="text-on-surface-variant">Checkbox Example</span>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-3">
              <ToggleExample />
              <span className="text-on-surface-variant">Toggle Switch</span>
            </div>
          </div>
        </section>

        {/* Card Examples Section */}
        <section className="mb-16">
          <SectionTitle title="Card Examples" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Card */}
            <div className="glass-panel rounded-xl overflow-hidden hover:border-primary/50 transition-all">
              <div className="h-48 bg-surface-container relative">
                <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-md text-primary text-xs px-2 py-1 rounded-full border border-primary/30">
                  NEW
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">Quantum Drive X1</h3>
                  <span className="text-lg font-bold text-secondary">$299</span>
                </div>
                <p className="text-sm text-on-surface-variant">
                  Next-generation storage with instantaneous transfer rates.
                </p>
                <button className="mt-4 bg-primary/20 text-primary border border-primary/50 text-sm py-2 px-4 rounded-lg hover:bg-primary hover:text-black transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Movie Card */}
            <div className="glass-panel rounded-xl overflow-hidden hover:border-secondary/50 transition-all flex h-32">
              <div className="w-24 h-full bg-surface-container shrink-0 border-r border-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">movie</span>
              </div>
              <div className="p-4 flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-lg font-semibold text-white">Starlight Protocol</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant mt-1">
                    <span className="material-symbols-outlined text-sm text-secondary">star</span>
                    <span className="text-sm">4.8</span>
                    <span className="text-sm">2h 15m</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="bg-surface-variant text-on-surface-variant text-xs px-2 py-1 rounded">Sci-Fi</span>
                  <span className="bg-surface-variant text-on-surface-variant text-xs px-2 py-1 rounded">Action</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

/**
 * SectionTitle Component
 * Displays a consistent section header with gold underline.
 */
const SectionTitle = ({ title }) => (
  <h2 className="text-3xl font-bold text-white border-b-2 border-secondary inline-block pb-2 mb-8">
    {title}
  </h2>
);

/**
 * ColorSwatch Component
 * Displays a color block with hex code and name.
 */
const ColorSwatch = ({ colorHex, name, className }) => (
  <div>
    <div className={`h-32 rounded-xl ${className} border border-white/10 shadow-lg`} />
    <div className="mt-2">
      <p className="text-lg font-semibold text-white">{name}</p>
      <p className="text-sm text-on-surface-variant">{colorHex}</p>
    </div>
  </div>
);

/**
 * ToggleExample Component
 * Simple toggle switch with state.
 */
const ToggleExample = () => {
  const [checked, setChecked] = React.useState(true);
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-surface-variant'
        }`}
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''
          }`}
      />
    </button>
  );
};

export default DesignSystemPage;