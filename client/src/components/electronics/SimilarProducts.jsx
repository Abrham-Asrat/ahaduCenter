// src/components/electronics/SimilarProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SimilarProducts Component
 * 
 * Displays a horizontal carousel/grid of related products.
 * 
 * Props:
 * - products: Array of product objects { id, name, imageUrl, price }
 */
const SimilarProducts = ({ products }) => {
    return (
        <section className="py-12 border-t border-white/5">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Similar Products</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        to={`/electronics/${product.id}`}
                        className="w-64 flex-shrink-0 glass-panel rounded-xl overflow-hidden snap-start group cursor-pointer hover:border-primary/50 hover:-translate-y-1 transition-all duration-200"
                    >
                        <div className="h-40 w-full relative overflow-hidden bg-surface-container">
                            <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={product.imageUrl}
                                alt={product.name}
                            />
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <span className="text-xs text-on-surface-variant">{product.brand}</span>
                            <span className="text-white font-semibold">{product.name}</span>
                            <span className="text-white font-semibold">${product.price.toLocaleString()}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default SimilarProducts;