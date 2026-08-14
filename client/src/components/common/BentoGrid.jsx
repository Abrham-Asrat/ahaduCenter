// src/components/common/BentoGrid.jsx
import React from 'react';

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
        <section className="py-12 px-20 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Curated Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Movies large card */}
                <div className="md:col-span-2 glass-border-gradient rounded-xl overflow-hidden group relative min-h-[400px]">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIHvSxlN360wcVtxV1tPdTP0oWJ7AfLyAbtzokP4ZGDeapUDZ4_4wpX_NNLzP7xDNrlcIgvzpdvLguZKakTE76brKm9BpsC5vEYvM0t6HcsD3uXjqyMmL1vBnDg90XsVI1RhlozTI8HMSzTXzXW_a4BQzCUsjo0XWlakhg1aHJkKWeMSquj-ZV0fXu4fPhar4P7HNjgmj1KFd1WTvbKEYlRXQih8abcmT6U843Hfp-pjWTZEYlBJAs5w')",
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
                </div>

                {/* Electronics card */}
                <div className="glass-border-gradient rounded-xl overflow-hidden group relative min-h-[400px]">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnCvJUYMrDO3hvxg-9IP1QRulJjis-98ADMVxWWl9QdPeCeyxzt5pS42hLPEDHNDCpeLDB40DMwFjqc8hcxJwWg20H9ZtRiXyZdJtvg3htYiuaLTpQwqlN08E_AxfyAQWxwu39SF78EkDWa6hzobMUYaqW2Le8Sp7DZyf5hkyJxtm5InDgTmKwj1d8vHbPd1VB7erErUSeWw96v_nCSO3igWTY0IgUUctesWR1DXFvNfPU71gi-5_XAw')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151B28] via-[#151B28]/50 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-semibold text-white mb-2">Next-Gen Tech</h3>
                        <p className="text-sm text-on-surface-variant">Elevate your setup.</p>
                    </div>
                </div>

                {/* Books card */}
                <div className="glass-border-gradient rounded-xl overflow-hidden group relative min-h-[300px] md:col-span-1">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzRKp_0-_vCPBpIj-Hlsxd8xhUaGGQgaUr6eCDoHkgM-u1bo7gJGhF5AQUBV5_282H9UX-8WpgEpXPEcL7UCTFjk9_PyHfDhnLg0zeXsSIj2grKqEBIhQgxy0RAfq4qWSIpYs5Yubt9q-sGKme4v3PVAvFuornji37Ur-Qxk151UdNX9olUW7gtRnevJyghRMyqlGiUrZdgprZpQ2JmFpqfqkW_G9u6qbRyCJlEjwf-nS6PNWpM_q6_g')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151B28] via-[#151B28]/50 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-semibold text-white mb-2">Bestsellers</h3>
                        <p className="text-sm text-on-surface-variant">Expand your mind.</p>
                    </div>
                </div>

                {/* Community card */}
                <div className="md:col-span-2 glass-border-gradient rounded-xl p-6 flex items-center justify-between group glow-hover">
                    <div>
                        <h4 className="text-2xl font-semibold text-white">Join the Community</h4>
                        <p className="text-sm text-on-surface-variant">Get access to exclusive drops.</p>
                    </div>
                    <button className="btn-primary rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;