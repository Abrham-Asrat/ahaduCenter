// src/components/electronics/ProductSpecs.jsx
import React, { useState } from 'react';

/**
 * ProductSpecs Component
 * 
 * Displays specifications and description with tabs on desktop and accordion on mobile.
 * 
 * Props:
 * - specifications: Object of key-value pairs
 * - description: String
 * 
 * State:
 * - activeTab: 'specifications' | 'description' | 'shipping' (for desktop)
 * - expandedSection: which accordion section is open (for mobile)
 */
const ProductSpecs = ({ specifications, description }) => {
    const [activeTab, setActiveTab] = useState('specifications');
    const [expandedSection, setExpandedSection] = useState('specifications');

    // Toggle accordion on mobile
    const toggleAccordion = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div>
            {/* Desktop tabs - hidden on mobile */}
            <div className="hidden md:flex border-b border-white/10 mb-6">
                <button
                    onClick={() => setActiveTab('specifications')}
                    className={`px-8 py-3 font-semibold text-lg ${activeTab === 'specifications'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-on-surface-variant hover:text-white'
                        }`}
                >
                    Specifications
                </button>
                <button
                    onClick={() => setActiveTab('description')}
                    className={`px-8 py-3 font-semibold text-lg ${activeTab === 'description'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-on-surface-variant hover:text-white'
                        }`}
                >
                    Description
                </button>
                <button
                    onClick={() => setActiveTab('shipping')}
                    className={`px-8 py-3 font-semibold text-lg ${activeTab === 'shipping'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-on-surface-variant hover:text-white'
                        }`}
                >
                    Shipping & Returns
                </button>
            </div>

            {/* Desktop tab content */}
            <div className="hidden md:block">
                {activeTab === 'specifications' && (
                    <div className="glass-panel p-8 rounded-xl">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-white">
                            {Object.entries(specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-on-surface-variant">{key}</span>
                                    <span className="font-semibold">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'description' && (
                    <div className="glass-panel p-8 rounded-xl">
                        <p className="text-on-surface-variant leading-relaxed">{description}</p>
                    </div>
                )}
                {activeTab === 'shipping' && (
                    <div className="glass-panel p-8 rounded-xl">
                        <p className="text-on-surface-variant leading-relaxed">
                            Free shipping on orders over ETB 500. 30-day return policy. Items ship within 24 hours.
                        </p>
                    </div>
                )}
            </div>

            {/* Mobile accordions - visible only on mobile */}
            <div className="md:hidden flex flex-col gap-2">
                {/* Specifications accordion */}
                <div className="glass-panel rounded-lg overflow-hidden">
                    <button
                        className="w-full flex justify-between items-center p-4 text-left"
                        onClick={() => toggleAccordion('specifications')}
                    >
                        <span className="font-semibold">Specifications</span>
                        <span className={`material-symbols-outlined transition-transform ${expandedSection === 'specifications' ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                    {expandedSection === 'specifications' && (
                        <div className="px-4 pb-4 text-sm text-on-surface-variant flex flex-col gap-2">
                            {Object.entries(specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="opacity-70">{key}</span>
                                    <span className="text-white">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Description accordion */}
                <div className="glass-panel rounded-lg overflow-hidden">
                    <button
                        className="w-full flex justify-between items-center p-4 text-left"
                        onClick={() => toggleAccordion('description')}
                    >
                        <span className="font-semibold">Description</span>
                        <span className={`material-symbols-outlined transition-transform ${expandedSection === 'description' ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                    {expandedSection === 'description' && (
                        <div className="px-4 pb-4 text-sm text-on-surface-variant">
                            {description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductSpecs;