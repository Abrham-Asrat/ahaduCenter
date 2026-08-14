// src/components/electronics/ProductInfo.jsx
import React from 'react';

/**
 * ProductInfo Component
 * 
 * Displays product information: brand, title, rating, price, description, 
 * highlights, action buttons, and trust badges.
 * 
 * Props:
 * - product: Object with all product details
 * 
 * Features:
 * - Price block with discount badge
 * - Description and highlights list
 * - Buy Now, Contact Seller, Wishlist buttons
 * - Trust badges (Warranty, Secure Payment, Returns)
 */
const ProductInfo = ({ product }) => {
    return (
        <div className="flex flex-col justify-start">
            {/* Brand */}
            <span className="text-xs text-secondary tracking-widest uppercase mb-2">
                {product.brand}
            </span>

            {/* Product title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white">
                {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
                <div className="flex text-secondary text-sm">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                        </span>
                    ))}
                </div>
                <span className="text-sm text-on-surface-variant ml-2">
                    {product.rating} ({product.reviews} reviews)
                </span>
            </div>

            {/* Price block */}
            <div className="glass-panel p-6 rounded-xl mb-6 border-l-4 border-l-primary flex flex-col gap-2">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl text-primary font-bold">${product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span className="text-on-surface-variant line-through">${product.originalPrice.toLocaleString()}</span>
                    )}
                    {product.discount && (
                        <span className="bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full text-xs ml-auto">
                            -{product.discount}%
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-primary text-sm">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    In Stock & Ready to Ship
                </div>
            </div>

            {/* Description and highlights */}
            <div className="text-on-surface-variant mb-6">
                <p className="mb-4 leading-relaxed">{product.description}</p>
                <ul className="space-y-2">
                    {product.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-[20px]">check</span>
                            <span className="text-white">{highlight}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <button className="flex-1 bg-primary-container text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Buy Now
                </button>
                <button className="flex-1 bg-transparent border border-secondary/50 text-secondary font-semibold py-3 px-6 rounded-lg hover:bg-secondary/10 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">forum</span>
                    Contact Seller
                </button>
                <button className="glass-panel p-3 rounded-lg text-on-surface-variant hover:text-error hover:border-error/50 transition-all w-12 h-12 flex items-center justify-center">
                    <span className="material-symbols-outlined">favorite</span>
                </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="material-symbols-outlined text-2xl">verified</span>
                    <span className="text-xs text-on-surface-variant">2 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                    <span className="text-xs text-on-surface-variant">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="material-symbols-outlined text-2xl">replay</span>
                    <span className="text-xs text-on-surface-variant">30-Day Returns</span>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;