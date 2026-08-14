// src/pages/ProductDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
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
 * Uses useParams to get product ID from URL.
 * 
 * Layout:
 * - Breadcrumbs (desktop only)
 * - Two columns: Gallery (left, 7 cols) + Info (right, 5 cols)
 * - Full-width specs tabs below
 * - Similar products carousel
 * - Mobile fixed bottom action buttons
 */
const ProductDetailPage = () => {
  const { id } = useParams();

  // Dummy product data
  const product = {
    id: parseInt(id),
    name: 'Quantum UltraBook X Pro',
    brand: 'AHADUTECH',
    condition: 'Brand New',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsHOXXH9FMFbXFNIiikyaycPEtak2eXWt9UKMl1DbSLEe_t1hHHoDudr892DOEZyQHYg2FUnwVybakCjMH8fS-mcm9Uy5IEqR6adg-QDrGAkQkNUX8ANkKZWqUtjz_ZVjwMO9JoKyb5NfBrGjABH-Yb0H5RRi7lOZKkX0VlbwrIKqo6gmxWuocAjOTAxAEHdWmicUMDrBW7hE9JXOd4rY8b8p-xM4-wpQH9RJuU12dtAfLjAhW7Aubag',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBa3i6iJAoLznUqCNHDyZ0uqkrITZ_FnI90b2MS9t8ej4K4nH8Y0voizSsYad-wobdFiiUZPuLv7obQaQ_fWRxPeNAjMq47cfJE6wO4r2oQlVptszaYRJnS3G3fJWTDlnntC8k9rzMqU7mGVd1baXyxPeWJK-YnXaKcvDlTr3LkjvRrP7dkYZe8pFhSxmLMmEkK4eXHDMJmz4S2T0-OSbU6rSGjpxZvBjOo2JPTl-wOuxxSrmQb6osk7w',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDB00adDfUS0xpcqmaZUunqRRj2DhxrFilaT7QhRLPZir5MaWBX5kuJubDuw98SsF-e9EzW_6YCJSRurj7IuGl9dRylq2b68rm64GF-QDplgkXWPlJT8Kk_zHC5HNYHwEYN_rS6IGTlXgqohGswK6WelxdnDmo29TmO4LYhiFmX2KTCdKLMxtI-LUGjWxPytJzMNqMLV-IbN_fKCiMXWfbfwfhpm34QokqgHSf37YYAeU9gXZOj0qL3zw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ2vLJi9f8xp79TBXxMX5itomGsGXOo-ohGiCAcE-62t6kRNcv8xV-DrE1vlFA5a55uhSFpeVt_gniKY0NV3Y1WeEWtRtRLDjrky4fEDoJyK-WiAUpcQOGCGqP_-TrvyFofx30NC4QnW2-MOzR-FnrxnkYHGCR7Wf7uD0HGmaxipDB2BbP2FW6EyovUAEGk2GFzpO0lRfi8n4q4kOg3EZo5a6IfPB3rsyq2Ft96TfHlPrlI9YhOHiozQ',
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
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQTeMXJQZEnw0KS7qQqsDI2juFsa7lsx5p8MvqB-CcRoA9qEMuag5mWdBmlUBnbeHkCa43zo922BLjHiH1OErbdmzBcWe1l5o0hVThuBk5J7UPwEBPKn20LNeun8ElWz07GWRBNb9DX716r-SlzRwUDivoOPtEgYzo6Jd8XOJaZducngXxHMM9mqRjDdOD80V7wc9htNKxo3atd2AaaQLyEWAOhmYE_3xh0DAqhalGK3WkhMF4GgdWqw',
      price: 899,
    },
    {
      id: 102,
      name: 'Tactile Pro Low-Profile Mechanical Keyboard',
      brand: 'AHADUTECH',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsJqNC1ZKnXAwsapsIRVJvhwIPWDdLulifm0Zu3YA0N62mCDlseHiud1MWPAUhEzDruRpXpGZhC8DpGBfXs2ns1aA7K_x-EFH8R0H-1asNIPoeZcJ65PseyDzWwoxnwpnU1iCVNuMVoLZB8d96NJbBJHO96HVACbfXnfsymc7RTpWbtoMVSJu-TycnAyoGY2yOnWq6X-MhHlZ4TwAx2-iIk8h--TMKMFVtevAgMeKLAXE115sB0LVp8g',
      price: 149,
    },
    {
      id: 103,
      name: 'Vision 34" Curved Monitor',
      brand: 'AURA VISUALS',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1mvIFfas5eRL83GDEzeZNadyZbvMBdo19e4Z5GkE5-PuVaY7dcTezBQpEWjF9--yIT6OS6ellA0EaJttwA15jnwGx5SIjI4VH550QjaFJXUzCBFogFS_W7i0FE0lP9D3TnYbMKYTK1MMqxlT-oPEm-7fwCzx93x9ilcDclmmqweREZZf0xCfLvIXabKEXkU77wxf6jo4IKcgD3eM47sVemFeJk6vF5Z_rYBMwDbTDxapkNU7kbFLmAA',
      price: 899,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12">
        {/* Breadcrumbs (desktop) */}
        <div className="max-w-7xl mx-auto px-6 mb-6 hidden md:flex gap-2 text-sm text-on-surface-variant">
          <a href="#" className="hover:text-primary">Home</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <a href="/electronics" className="hover:text-primary">Electronics</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <a href="#" className="hover:text-primary">Laptops</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-white">{product.name}</span>
        </div>

        {/* Product hero section */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>
          {/* Info */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} />
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
      <div className="md:hidden fixed bottom-0 w-full glass-panel border-t border-white/10 p-4 z-40 pb-6 rounded-t-xl">
        <div className="flex gap-3">
          <button className="w-12 h-12 flex-shrink-0 rounded-lg border border-secondary/50 text-secondary flex items-center justify-center bg-surface-container/50">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          <button className="flex-1 bg-primary-container text-white font-semibold rounded-lg flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">shopping_bag</span>
            Buy Now
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