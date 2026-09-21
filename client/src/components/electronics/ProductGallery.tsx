// src/components/electronics/ProductGallery.jsx
import React from 'react';

/**
 * ProductGallery Component
 * 
 * Displays the main product image with a badge and thumbnail strip.
 * 
 * Props:
 * - product: Object { images: [url], condition: 'New'|'Used'|'Refurbished' }
 * 
 * Features:
 * - Main image with hover zoom
 * - Condition badge at top-left
 * - Horizontal thumbnail strip (clickable, changes main image)
 * - Responsive aspect ratio (square on mobile, 4:3 on desktop)
 */
const ProductGallery = ({ product }) => {
    // State for selected image index
    const [selectedImage, setSelectedImage] = React.useState(0);

    return (
        <div className="flex flex-col gap-4">
            {/* Main image container */}
            <div className="glass-panel rounded-xl overflow-hidden relative group aspect-square md:aspect-[4/3] flex items-center justify-center">
                {/* Condition badge */}
                <div className="absolute top-3 left-3 z-10 bg-primary-container/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs uppercase flex items-center gap-1 backdrop-blur-md">
                    <span className="material-symbols-outlined text-sm">new_releases</span>
                    {product.condition}
                </div>

                {/* Main image */}
                <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={product.images[selectedImage]}
                    alt={product.name}
                />

                {/* Ambient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent opacity-60 pointer-events-none" />
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {product.images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 glass-panel rounded-lg overflow-hidden p-1 transition-all ${selectedImage === index
                                ? 'border border-primary opacity-100'
                                : 'opacity-60 hover:opacity-100 border border-transparent'
                            }`}
                    >
                        <img className="w-full h-full object-cover rounded-md" src={img} alt={`Thumbnail ${index + 1}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;