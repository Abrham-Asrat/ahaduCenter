// src/pages/ProductComparisonPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * ProductComparisonPage Component
 * 
 * Displays a side-by-side comparison of selected electronics products.
 * 
 * Features:
 * - Product header cards with image, name, rating, price
 * - Remove product button
 * - Comparison rows: Brand, Condition, Key Specs, Warranty, Availability
 * - Action buttons per product (Buy Now, Add to Wishlist)
 * - Responsive: Desktop table with sticky labels, Tablet grid, Mobile horizontal scroll
 * 
 * State:
 * - products: Array of product objects being compared
 */
const ProductComparisonPage = () => {
  // Products being compared (dummy data)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Quantum Phone X',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1GKiBpV9ZGDP7MuxMg0o9CXGOcMid_Emge9ZGU9xlcfNJ1g4q5P2uuOucu3XxgOSHPjkvMe-ztrOjF-l27gaAFprZ8QG4-3V2waih7bd_UmvpR4iB6CbCyAL-OWDpQCGQPBmpiG36YpVs4T9qipLJWmbQ2cw7UcRSDGCx-bSUpJJBrCfHXReOTwWHUrpd32yL9-CU7akxjESjWbAQYtVNpguUzeRmrAigfuNgMm4IjPg44n9pW9m_BA',
      rating: '4.9 (128 reviews)',
      price: '$1,299',
      brand: 'Quantum',
      condition: 'New',
      specs: 'A16 Bionic, 12GB RAM, 512GB Storage, 120Hz OLED',
      warranty: '1 Year Limited',
      availability: 'In Stock',
    },
    {
      id: 2,
      name: 'Visionary Display 32"',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmlHYsThsso5fVHSdMuXr_fG4rcrK57Iq0xKsBaOhxVqFCCbRaj7QcMfHVrH_ew6Sz3e6t0Q86Kq75lw6H-AufLcoogCPCf8-7hiC_vX3AwR9_NmyLpwG0E6GD8Lt5gwyWqxAE7oY0D6TE4gwYnRGJcUT3INqYraOvo8M-7-1QL_5uE2QtFryrnkG7W-U20mM5us2iBloyu84W-kYNvYoQZUGMAemZABJy9HUFX1p6NegQRnS1_YfiEg',
      rating: '4.7 (89 reviews)',
      price: '$899',
      brand: 'Visionary Tech',
      condition: 'New',
      specs: '4K UHD (3840x2160), 144Hz Refresh Rate, 1ms Response, HDR600',
      warranty: '3 Years Premium Panel Guarantee',
      availability: 'Out of Stock',
    },
    {
      id: 3,
      name: 'Sonic Pro Max',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9-nYVsADNFPh8C8OnN4GkKeoHEU3qlbopzFKjE50c1Z5A-pVzMCQ9CSf58YJjRXI0Bw0LLTtPDzFjjifBVJeA9_j4NFy7Ud3LPWxcGYdJvT5QMp5rKPiIaupwXAhu7kbxL59YiAFBEkDVYE2UG-4LjdH0VSJ5bcuSmhYd5hTfaOYC51Xz2WBNDWr0-O6a_Muskr_Yr3O2-TGNFwTtrNi1S9sata0hnM-5j_-BERacRt1Q46-u1Csag',
      rating: '4.8 (256 reviews)',
      price: '$349',
      brand: 'Auraline',
      condition: 'Refurbished',
      specs: 'Active Noise Cancellation, 40hr Battery, Hi-Res Audio, Bluetooth 5.3',
      warranty: '1 Year Limited',
      availability: 'In Stock',
    },
  ]);

  // Remove product from comparison
  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Clear all products
  const clearAll = () => {
    setProducts([]);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Compare Products</h1>
            <p className="text-lg text-on-surface-variant">Compare specifications and prices of selected electronics.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/electronics" className="text-secondary hover:text-secondary-fixed transition-colors flex items-center gap-2 text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Electronics
            </Link>
            <button
              onClick={clearAll}
              className="text-error hover:bg-error/10 px-4 py-2 rounded transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Clear Comparison
            </button>
          </div>
        </div>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">compare_arrows</span>
            <h2 className="text-2xl font-bold text-white mt-4">No products to compare</h2>
            <p className="text-on-surface-variant mt-2">Add products from the Electronics Marketplace to compare them.</p>
            <Link to="/electronics" className="inline-block mt-6 bg-primary text-black px-6 py-2 rounded hover:shadow-lg transition-all">
              Browse Electronics
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop & Tablet comparison table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="p-4 w-1/5 bg-surface-container-high/90 border-b border-r border-white/10">
                      <span className="text-lg font-semibold text-white">Features</span>
                    </th>
                    {products.map((product) => (
                      <th key={product.id} className="p-4 border-b border-white/10 w-1/5 align-top">
                        <div className="relative group">
                          {/* Remove button */}
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-error p-1 rounded-full hover:bg-error/20"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                          {/* Product card */}
                          <div className="bg-surface-container-low rounded-lg overflow-hidden border border-white/5 p-3">
                            <div className="h-32 w-full mb-3 overflow-hidden rounded">
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-lg font-semibold text-white leading-tight mb-1">{product.name}</h3>
                            <div className="flex items-center gap-1 text-secondary mb-2">
                              <span className="material-symbols-outlined text-sm">star</span>
                              <span className="text-sm text-on-surface-variant">{product.rating}</span>
                            </div>
                            <span className="text-xl font-bold text-primary">{product.price}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Brand */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 bg-surface-container-high/90 border-b border-r border-white/10 text-xs uppercase text-on-surface-variant">Brand</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 border-b border-white/10">{product.brand}</td>
                    ))}
                  </tr>
                  {/* Condition */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 bg-surface-container-high/90 border-b border-r border-white/10 text-xs uppercase text-on-surface-variant">Condition</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 border-b border-white/10">
                        <span className={`px-2 py-1 rounded text-xs uppercase ${product.condition === 'New'
                            ? 'bg-primary/15 text-primary'
                            : 'bg-secondary/15 text-secondary'
                          }`}>
                          {product.condition}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Key Specs */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 bg-surface-container-high/90 border-b border-r border-white/10 text-xs uppercase text-on-surface-variant">Key Specs</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 border-b border-white/10 text-sm text-on-surface-variant">{product.specs}</td>
                    ))}
                  </tr>
                  {/* Warranty */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 bg-surface-container-high/90 border-b border-r border-white/10 text-xs uppercase text-on-surface-variant">Warranty</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 border-b border-white/10 text-sm">{product.warranty}</td>
                    ))}
                  </tr>
                  {/* Availability */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 bg-surface-container-high/90 border-b border-r border-white/10 text-xs uppercase text-on-surface-variant">Availability</td>
                    {products.map((product) => (
                      <td key={product.id} className={`p-4 border-b border-white/10 text-sm font-semibold ${product.availability === 'In Stock' ? 'text-primary' : 'text-error'
                        }`}>
                        {product.availability}
                      </td>
                    ))}
                  </tr>
                  {/* Actions */}
                  <tr>
                    <td className="p-4 bg-surface-container-high/90 border-r border-white/10" />
                    {products.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="flex flex-col gap-2">
                          {product.availability === 'In Stock' ? (
                            <button className="w-full bg-primary text-black py-2 rounded-lg text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-sm">shopping_bag</span>
                              Buy Now
                            </button>
                          ) : (
                            <button className="w-full bg-surface-variant text-on-surface-variant py-2 rounded-lg text-xs uppercase tracking-wider cursor-not-allowed" disabled>
                              Notify Me
                            </button>
                          )}
                          <button className="w-full border border-white/20 text-white py-2 rounded-lg text-xs uppercase tracking-wider hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">favorite</span>
                            Add to Wishlist
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile horizontal scroll */}
            <div className="md:hidden flex overflow-x-auto hide-scrollbar snap-x snap-mandatory">
              {/* Sticky labels */}
              <div className="sticky left-0 z-20 w-32 flex-shrink-0 bg-surface-container-high border-r border-white/5 flex flex-col">
                <div className="h-40 border-b border-white/5 p-3 flex items-end">
                  <span className="text-xs uppercase text-on-surface-variant">Features</span>
                </div>
                <div className="h-14 flex items-center px-3 border-b border-white/5 text-sm">Brand</div>
                <div className="h-14 flex items-center px-3 border-b border-white/5 bg-surface-container/30 text-sm">Condition</div>
                <div className="h-14 flex items-center px-3 border-b border-white/5 text-sm">Specs</div>
                <div className="h-14 flex items-center px-3 border-b border-white/5 bg-surface-container/30 text-sm">Warranty</div>
                <div className="h-14 flex items-center px-3 border-b border-white/5 text-sm">Availability</div>
                <div className="h-24 p-3 border-t border-white/5" />
              </div>

              {/* Product columns */}
              {products.map((product) => (
                <div key={product.id} className="w-[200px] flex-shrink-0 snap-start flex flex-col border-r border-white/5">
                  <div className="h-40 border-b border-white/5 p-3 flex flex-col items-center relative">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-2 right-2 text-on-surface-variant hover:text-error"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 mb-2">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-sm font-semibold text-white text-center leading-tight">{product.name}</h3>
                    <span className="text-primary font-bold mt-1">{product.price}</span>
                  </div>
                  <div className="h-14 flex items-center justify-center px-2 border-b border-white/5 text-sm">{product.brand}</div>
                  <div className="h-14 flex items-center justify-center px-2 border-b border-white/5 bg-surface-container/30 text-sm">{product.condition}</div>
                  <div className="h-14 flex items-center justify-center px-2 border-b border-white/5 text-xs text-on-surface-variant">{product.specs}</div>
                  <div className="h-14 flex items-center justify-center px-2 border-b border-white/5 bg-surface-container/30 text-sm">{product.warranty}</div>
                  <div className={`h-14 flex items-center justify-center px-2 border-b border-white/5 text-sm font-semibold ${product.availability === 'In Stock' ? 'text-primary' : 'text-error'
                    }`}>
                    {product.availability}
                  </div>
                  <div className="h-24 p-3 flex flex-col gap-2">
                    <button className="w-full bg-primary text-black py-1.5 rounded text-xs font-semibold">Buy Now</button>
                    <button className="w-full border border-white/20 text-white py-1.5 rounded text-xs">Wishlist</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductComparisonPage;