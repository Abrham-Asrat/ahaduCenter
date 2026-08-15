// src/components/electronics/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * ProductCard Component
 * 
 * Displays a single electronics product in a grid.
 * 
 * Props:
 * - product: Object { id, name, brand, imageUrl, condition, price, originalPrice, rating }
 * - onAddToCart: Function
 * - onCompare: Function
 * - onToggleWishlist: Function
 */
const ProductCard = ({ product, onAddToCart, onCompare, onToggleWishlist, isWishlisted: initialWishlisted = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);

  const conditionStyles = {
    New: 'bg-primary-container/20 text-primary border-primary/30',
    Used: 'bg-secondary-container/20 text-secondary border-secondary/30',
    Refurbished: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  };

  const badgeClass = conditionStyles[product.condition] || conditionStyles.New;

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompare) onCompare(product);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isWishlisted;
    setIsWishlisted(next);
    if (onToggleWishlist) onToggleWishlist(product, next);
  };

  return (
    <Link to={`/electronics/${product.id}`} className="block h-full group">
      <div className="glass-panel rounded-xl p-4 relative group glow-hover transition-all duration-300 flex flex-col h-full cursor-pointer border border-white/10 hover:-translate-y-1 shadow-lg">

        {/* Condition badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`${badgeClass} text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold border backdrop-blur-md`}>
            {product.condition}
          </span>
        </div>

        {/* Wishlist floating button */}
        <button
          onClick={handleWishlistClick}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full glass-panel flex items-center justify-center transition-all ${isWishlisted ? 'text-error border-error/40 bg-error/15' : 'text-on-surface-variant hover:text-error hover:border-error/30'
            }`}
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>

        {/* Product image container */}
        <div className="aspect-square bg-surface-container rounded-lg mb-4 overflow-hidden relative flex items-center justify-center p-2">
          <img
            className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-500"
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
          />
        </div>

        {/* Product info */}
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <span className="text-secondary text-xs tracking-widest uppercase font-semibold block mb-1">
              {product.brand}
            </span>
            <h3 className="text-white font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-primary font-extrabold text-xl">${product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-on-surface-variant line-through text-xs ml-2">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center text-secondary text-xs font-bold bg-surface-container px-2 py-0.5 rounded border border-white/5">
                  <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span>{product.rating}</span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCartClick}
                className="bg-primary/20 border border-primary/40 hover:bg-primary text-primary hover:text-black py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
              >
                <span className="material-symbols-outlined text-sm">shopping_cart</span>
                Add to Cart
              </button>
              <button
                onClick={handleCompareClick}
                className="bg-surface-variant border border-white/10 hover:border-secondary hover:text-secondary text-on-surface-variant py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">compare_arrows</span>
                Compare
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;