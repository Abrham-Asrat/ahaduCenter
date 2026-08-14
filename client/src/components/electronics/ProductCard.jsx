// src/components/electronics/ProductCard.jsx
import React from 'react';

/**
 * ProductCard Component
 * 
 * Displays a single electronics product in a grid.
 * 
 * Props:
 * - product: Object { id, name, brand, imageUrl, condition, price, originalPrice, rating, reviews }
 * 
 * Features:
 * - Condition badge (New/Used/Refurbished) at top-left
 * - Product image with hover zoom
 * - Brand and product name
 * - Price with optional original price (strikethrough)
 * - Rating stars
 * - Hover glow effect (emerald or gold depending on condition)
 */
const ProductCard = ({ product }) => {
  // Determine badge style based on condition
  const conditionStyles = {
    New: 'bg-primary-container/20 text-primary',
    Used: 'bg-secondary-container/20 text-secondary',
    Refurbished: 'bg-blue-500/20 text-blue-300',
  };

  const badgeClass = conditionStyles[product.condition] || conditionStyles.New;

  return (
    <div className="glass-panel rounded-lg p-3 relative group glow-hover transition-all duration-300 flex flex-col h-full cursor-pointer">

      {/* Condition badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className={`${badgeClass} text-xs px-2 py-1 rounded uppercase tracking-wider font-bold`}>
          {product.condition}
        </span>
      </div>

      {/* Product image container */}
      <div className="aspect-square bg-surface-variant rounded-md mb-3 overflow-hidden relative">
        <img
          className="w-full h-full object-cover mix-blend-screen opacity-80 group-hover:scale-105 transition-transform duration-500"
          src={product.imageUrl}
          alt={product.name}
        />
      </div>

      {/* Product info */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          {/* Brand */}
          <p className="text-on-surface-variant text-sm">{product.brand}</p>
          {/* Product name */}
          <h3 className="text-white font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price and rating */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            {/* Current price */}
            <span className="text-primary font-bold text-lg">${product.price.toLocaleString()}</span>
            {/* Original price if discounted */}
            {product.originalPrice && (
              <span className="text-on-surface-variant line-through text-sm ml-2">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {/* Rating stars */}
          {product.rating && (
            <div className="flex text-secondary text-sm">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="text-on-surface-variant ml-1">{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;