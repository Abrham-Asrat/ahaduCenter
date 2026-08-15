// src/components/electronics/ProductInfo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ProductInfo Component
 * 
 * Displays product information: brand, title, rating, price, description, 
 * highlights, action buttons, and trust badges.
 * 
 * Props:
 * - product: Object with all product details
 * - onShowToast: Callback function to display toast notification
 */
const ProductInfo = ({ product, onShowToast }) => {
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactMessage, setContactMessage] = useState('');

    const handleBuyNow = () => {
        if (onShowToast) onShowToast(`Added "${product.name}" to cart! Redirecting to checkout...`);
        setTimeout(() => navigate('/checkout'), 1000);
    };

    const handleToggleWishlist = () => {
        const next = !isWishlisted;
        setIsWishlisted(next);
        if (onShowToast) {
            onShowToast(next ? `"${product.name}" saved to wishlist!` : `"${product.name}" removed from wishlist.`);
        }
    };

    const handleSendInquiry = (e) => {
        e.preventDefault();
        setIsContactModalOpen(false);
        setContactMessage('');
        if (onShowToast) onShowToast('Your inquiry has been sent to the seller!');
    };

    return (
        <div className="flex flex-col justify-start">
            {/* Brand */}
            <span className="text-xs text-secondary tracking-widest uppercase mb-2 font-semibold">
                {product.brand}
            </span>

            {/* Product title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
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
                <span className="text-sm text-on-surface-variant ml-2 font-medium">
                    {product.rating} ({product.reviews} reviews)
                </span>
            </div>

            {/* Price block */}
            <div className="glass-panel p-6 rounded-xl mb-6 border-l-4 border-l-primary flex flex-col gap-2 shadow-lg">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl text-primary font-extrabold">${product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span className="text-on-surface-variant line-through font-medium">${product.originalPrice.toLocaleString()}</span>
                    )}
                    {product.discount && (
                        <span className="bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full text-xs font-bold ml-auto">
                            -{product.discount}%
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    In Stock at Physical Store Location
                </div>
            </div>

            {/* Description and highlights */}
            <div className="text-on-surface-variant mb-6">
                <p className="mb-4 leading-relaxed">{product.description}</p>
                <ul className="space-y-2">
                    {product.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-[20px]">check</span>
                            <span className="text-white font-medium">{highlight}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-primary text-black font-extrabold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider"
                >
                    <span className="material-symbols-outlined">storefront</span>
                    Reserve for Pick-Up
                </button>
                <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="flex-1 bg-surface-variant border border-secondary/50 text-secondary font-bold py-3.5 px-6 rounded-xl hover:bg-secondary/10 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider"
                >
                    <span className="material-symbols-outlined">forum</span>
                    Contact Store
                </button>
                <button
                    onClick={handleToggleWishlist}
                    title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                    className={`glass-panel p-3.5 rounded-xl transition-all w-12 h-12 flex items-center justify-center cursor-pointer ${isWishlisted ? 'text-error border-error/50 bg-error/15' : 'text-on-surface-variant hover:text-error'
                        }`}
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>
                        favorite
                    </span>
                </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="material-symbols-outlined text-2xl text-primary">verified</span>
                    <span className="text-xs text-on-surface-variant font-medium">In-Store Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="material-symbols-outlined text-2xl text-secondary">payments</span>
                    <span className="text-xs text-on-surface-variant font-medium">In-Person Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                    <span className="material-symbols-outlined text-2xl text-blue-400">task_alt</span>
                    <span className="text-xs text-on-surface-variant font-medium">Free Inspection</span>
                </div>
            </div>

            {/* Contact Seller Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-white/15 shadow-2xl relative">
                        <button
                            onClick={() => setIsContactModalOpen(false)}
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-white"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-secondary text-3xl">forum</span>
                            <div>
                                <h3 className="text-xl font-bold text-white">Contact Seller</h3>
                                <p className="text-xs text-on-surface-variant">Inquire about {product.name}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSendInquiry} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-on-surface-variant mb-1 font-semibold">Your Inquiry</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    placeholder="Ask about warranty, delivery details, or specifications..."
                                    className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsContactModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-white/10 text-on-surface-variant hover:text-white text-xs uppercase font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-primary text-black text-xs uppercase font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductInfo;