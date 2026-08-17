// src/pages/ProductDetailPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ProductGallery from '../components/electronics/ProductGallery';
import ProductInfo from '../components/electronics/ProductInfo';
import ProductSpecs from '../components/electronics/ProductSpecs';
import SimilarProducts from '../components/electronics/SimilarProducts';
import Footer from '../components/common/Footer';

/**
 * ProductDetailPage Component
 * 
 * Main page for displaying a single electronics product.
 */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dummy product data
  const product = {
    id: parseInt(id) || 1,
    name: 'Quantum UltraBook X Pro',
    brand: 'AHADUTECH',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.8,
    reviews: 124,
    price: 1499,
    originalPrice: 1799,
    discount: 15,
    description: 'Engineered for elite creators and professionals. The Quantum UltraBook X Pro delivers uncompromising high-performance computing housed within a hyper-thin, aerospace-grade chassis.',
    highlights: [
      'Intel Core i9 14th Gen Processor',
      '32GB LPDDR5x Ultra-fast RAM',
      '1TB NVMe PCIe 4.0 SSD',
      '16" 4K OLED Touch Display (120Hz)',
    ],
    specifications: {
      'Processor': 'Intel Core i9-14900HX (24-Core)',
      'Graphics': 'NVIDIA RTX 4080 (12GB GDDR6)',
      'Memory': '32GB LPDDR5x 7467MHz',
      'Storage': '1TB NVMe PCIe 4.0 SSD',
      'Display': '16" 4K OLED (3840x2400), 120Hz',
      'Battery': '99.9Whr (Up to 14 hrs)',
      'Connectivity': 'Wi-Fi 7, Bluetooth 5.4, Thunderbolt 4',
      'Weight & Dimensions': '1.8kg | 355 x 245 x 16.9 mm',
    },
  };

  // Dummy similar products
  const similarProducts = [
    {
      id: 101,
      name: 'AuraSync 34" Curved OLED Monitor',
      brand: 'AURA VISUALS',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
      price: 899,
    },
    {
      id: 102,
      name: 'Tactile Pro Low-Profile Mechanical Keyboard',
      brand: 'AHADUTECH',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
      price: 149,
    },
    {
      id: 103,
      name: 'Silence 400 Wireless Headphones',
      brand: 'SONICAURA',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      price: 249,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col relative animate-fade-in">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-8 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow pt-24 pb-12">
        {/* Breadcrumbs (desktop) */}
        <div className="max-w-7xl mx-auto px-6 mb-6 hidden md:flex items-center gap-2 text-sm text-on-surface-variant">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <a href="/electronics" className="hover:text-primary transition-colors">Electronics</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-white font-semibold">{product.name}</span>
        </div>

        {/* Product hero section */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>
          {/* Info */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} onShowToast={showToast} />
          </div>
        </div>

        {/* Specs tabs/accordion */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <ProductSpecs specifications={product.specifications} description={product.description} />
        </div>

        {/* Similar products */}
        <div className="max-w-7xl mx-auto px-6">
          <SimilarProducts products={similarProducts} />
        </div>
      </main>

      {/* Mobile fixed bottom action bar */}
      <div className="md:hidden fixed bottom-0 w-full glass-panel border-t border-white/10 p-4 z-40 pb-6 rounded-t-2xl shadow-2xl">
        <div className="flex gap-3">
          <button
            onClick={() => showToast('Opening seller chat inquiry...')}
            className="w-12 h-12 flex-shrink-0 rounded-xl border border-secondary/50 text-secondary flex items-center justify-center bg-surface-container/50 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          <button
            onClick={() => {
              showToast(`Inquiry sent for "${product.name}". Visit our Addis Ababa store for physical pick-up!`);
              setTimeout(() => navigate('/contact'), 1000);
            }}
            className="flex-1 bg-primary text-black font-extrabold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform uppercase tracking-wider text-xs"
          >
            <span className="material-symbols-outlined">storefront</span>
            Visit Store to Pick Up
          </button>
        </div>
      </div>

      {/* Add bottom padding for mobile so content isn't hidden behind fixed bar */}
      <div className="md:hidden h-20" />

      <Footer />
    </div>
  );
};

export default ProductDetailPage;