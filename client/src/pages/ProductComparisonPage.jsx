// src/pages/ProductComparisonPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * ProductComparisonPage Component
 * 
 * Displays a side-by-side comparison of selected electronics products.
 */
const ProductComparisonPage = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Products being compared (dummy data)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Quantum Phone X Pro',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
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
      name: 'Visionary Display 34" Curved',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
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
      name: 'Sonic Pro Max Headphones',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      rating: '4.8 (256 reviews)',
      price: '$349',
      brand: 'Auraline',
      condition: 'Refurbished',
      specs: 'Active Noise Cancellation, 40hr Battery, Hi-Res Audio, Bluetooth 5.3',
      warranty: '1 Year Limited',
      availability: 'In Stock',
    },
  ]);

  const removeProduct = (id) => {
    const p = products.find((item) => item.id === id);
    setProducts(products.filter((p) => p.id !== id));
    if (p) showToast(`Removed "${p.name}" from comparison.`);
  };

  const clearAll = () => {
    setProducts([]);
    showToast('Cleared comparison list.');
  };

  const handleBuyNow = (product) => {
    showToast(`Redirecting to checkout for "${product.name}"...`);
    setTimeout(() => navigate('/order-confirmation'), 1000);
  };

  const handleWishlist = (product) => {
    showToast(`"${product.name}" saved to wishlist!`);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative animate-fade-in">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Compare Products</h1>
            <p className="text-lg text-on-surface-variant">Compare specifications and prices of selected electronics.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/electronics" className="text-secondary hover:text-secondary-fixed transition-colors flex items-center gap-2 text-xs uppercase tracking-wider font-bold">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Electronics
            </Link>
            {products.length > 0 && (
              <button
                onClick={clearAll}
                className="text-error hover:bg-error/10 border border-error/30 px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Clear Comparison
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="glass-panel rounded-2xl text-center py-16 px-6 border border-white/10">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">compare_arrows</span>
            <h2 className="text-2xl font-bold text-white mt-4">No products to compare</h2>
            <p className="text-on-surface-variant mt-2 max-w-md mx-auto">Add products from the Electronics Marketplace to compare their specs side-by-side.</p>
            <Link to="/electronics" className="inline-block mt-6 bg-primary text-black font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
              Browse Electronics
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop & Tablet comparison table */}
            <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="p-4 w-1/5 bg-surface-container-high/90 border-b border-r border-white/10">
                        <span className="text-lg font-bold text-white">Features</span>
                      </th>
                      {products.map((product) => (
                        <th key={product.id} className="p-4 border-b border-white/10 w-1/5 align-top">
                          <div className="relative group">
                            {/* Remove button */}
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="absolute top-2 right-2 text-error p-1 rounded-full hover:bg-error/20 transition-colors cursor-pointer"
                              title="Remove from comparison"
                            >
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                            {/* Product card */}
                            <div className="bg-surface-container-low rounded-xl overflow-hidden border border-white/10 p-3">
                              <div className="h-32 w-full mb-3 overflow-hidden rounded-lg">
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <h3 className="text-base font-bold text-white leading-tight mb-1">{product.name}</h3>
                              <div className="flex items-center gap-1 text-secondary mb-2">
                                <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="text-xs text-on-surface-variant">{product.rating}</span>
                              </div>
                              <span className="text-xl font-extrabold text-primary">{product.price}</span>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Brand */}
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 bg-surface-container-high/90 border-b border-r border-white/10 text-xs font-bold uppercase text-on-surface-variant">Brand</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-4 border-b border-white/10 font-semibold">{product.brand}</td>
                      ))}
                    </tr>
                    {/* Condition */}
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 bg-surface-container-high/90 border-b border-r border-white/10 text-xs font-bold uppercase text-on-surface-variant">Condition</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-4 border-b border-white/10">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${product.condition === 'New'
                              ? 'bg-primary/15 text-primary border border-primary/30'
                              : 'bg-secondary/15 text-secondary border border-secondary/30'
                            }`}>
                            {product.condition}
                          </span>
                        </td>
                      ))}
                    </tr>
                    {/* Key Specs */}
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 bg-surface-container-high/90 border-b border-r border-white/10 text-xs font-bold uppercase text-on-surface-variant">Key Specs</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-4 border-b border-white/10 text-sm text-on-surface-variant">{product.specs}</td>
                      ))}
                    </tr>
                    {/* Warranty */}
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 bg-surface-container-high/90 border-b border-r border-white/10 text-xs font-bold uppercase text-on-surface-variant">Warranty</td>
                      {products.map((product) => (
                        <td key={product.id} className="p-4 border-b border-white/10 text-sm font-medium">{product.warranty}</td>
                      ))}
                    </tr>
                    {/* Availability */}
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 bg-surface-container-high/90 border-b border-r border-white/10 text-xs font-bold uppercase text-on-surface-variant">Availability</td>
                      {products.map((product) => (
                        <td key={product.id} className={`p-4 border-b border-white/10 text-sm font-bold ${product.availability === 'In Stock' ? 'text-primary' : 'text-error'
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
                              <button
                                onClick={() => handleBuyNow(product)}
                                className="w-full bg-primary text-black py-2.5 rounded-lg text-xs uppercase font-extrabold tracking-wider hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">shopping_bag</span>
                                Buy Now
                              </button>
                            ) : (
                              <button
                                onClick={() => showToast(`Subscribed to back-in-stock alerts for "${product.name}".`)}
                                className="w-full bg-surface-variant text-on-surface-variant border border-white/10 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider hover:text-white cursor-pointer"
                              >
                                Notify Me
                              </button>
                            )}
                            <button
                              onClick={() => handleWishlist(product)}
                              className="w-full border border-white/20 text-white py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
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
            </div>

            {/* Mobile horizontal scroll */}
            <div className="md:hidden glass-panel rounded-2xl overflow-hidden border border-white/10 flex">
              {/* Sticky labels */}
              <div className="sticky left-0 z-20 w-32 flex-shrink-0 bg-surface-container-high border-r border-white/10 flex flex-col">
                <div className="h-40 border-b border-white/10 p-3 flex items-end">
                  <span className="text-xs uppercase font-bold text-on-surface-variant">Features</span>
                </div>
                <div className="h-14 flex items-center px-3 border-b border-white/10 text-xs font-bold">Brand</div>
                <div className="h-14 flex items-center px-3 border-b border-white/10 bg-surface-container/30 text-xs font-bold">Condition</div>
                <div className="h-14 flex items-center px-3 border-b border-white/10 text-xs font-bold">Specs</div>
                <div className="h-14 flex items-center px-3 border-b border-white/10 bg-surface-container/30 text-xs font-bold">Warranty</div>
                <div className="h-14 flex items-center px-3 border-b border-white/10 text-xs font-bold">Availability</div>
                <div className="h-28 p-3" />
              </div>

              {/* Product columns */}
              <div className="flex overflow-x-auto">
                {products.map((product) => (
                  <div key={product.id} className="w-[200px] flex-shrink-0 flex flex-col border-r border-white/10">
                    <div className="h-40 border-b border-white/10 p-3 flex flex-col items-center relative">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="absolute top-2 right-2 text-on-surface-variant hover:text-error"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 mb-2">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-xs font-bold text-white text-center leading-tight">{product.name}</h3>
                      <span className="text-primary font-bold text-sm mt-1">{product.price}</span>
                    </div>
                    <div className="h-14 flex items-center justify-center px-2 border-b border-white/10 text-xs">{product.brand}</div>
                    <div className="h-14 flex items-center justify-center px-2 border-b border-white/10 bg-surface-container/30 text-xs font-bold">{product.condition}</div>
                    <div className="h-14 flex items-center justify-center px-2 border-b border-white/10 text-[10px] text-on-surface-variant text-center">{product.specs}</div>
                    <div className="h-14 flex items-center justify-center px-2 border-b border-white/10 bg-surface-container/30 text-xs text-center">{product.warranty}</div>
                    <div className={`h-14 flex items-center justify-center px-2 border-b border-white/10 text-xs font-bold ${product.availability === 'In Stock' ? 'text-primary' : 'text-error'
                      }`}>
                      {product.availability}
                    </div>
                    <div className="h-28 p-3 flex flex-col gap-2">
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="w-full bg-primary text-black py-1.5 rounded text-xs font-bold uppercase"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => handleWishlist(product)}
                        className="w-full border border-white/20 text-white py-1.5 rounded text-xs uppercase"
                      >
                        Wishlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductComparisonPage;