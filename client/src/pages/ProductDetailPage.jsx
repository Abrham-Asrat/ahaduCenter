// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/common/Navbar';
import ProductGallery from '../components/electronics/ProductGallery';
import ProductInfo from '../components/electronics/ProductInfo';
import ProductSpecs from '../components/electronics/ProductSpecs';
import SimilarProducts from '../components/electronics/SimilarProducts';
import Footer from '../components/common/Footer';
import { fetchProduct, fetchProducts } from '../redux/slices/productSlice';
import { orderService } from '../services/orderService';

/**
 * ProductDetailPage Component
 *
 * Main page for displaying a single electronics product.
 * - Dispatches fetchProduct(id) on mount using URL param :id
 * - Shows loading skeleton while product.loading, error state if product.error
 * - When selectedProduct is loaded and has a category, dispatches fetchProducts({ category })
 *   and passes results (excluding current product) to SimilarProducts
 */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedProduct, products, loading, error } = useSelector((s) => s.product);

  const [toastMessage, setToastMessage] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /**
   * handlePlaceOrder
   *
   * Called when the user clicks "Reserve for Pick-Up" / "Confirm Pick-Up".
   * Calls orderService.placeOrder directly (no Redux thunk — task 19.1 spec).
   * - Disables the button and shows a loading indicator while in-flight.
   * - On success navigates to /order-confirmation with the returned order in
   *   location.state so OrderConfirmationPage can read it without an extra fetch.
   * - On failure surfaces the server error string and re-enables the button.
   */
  const handlePlaceOrder = async (quantity = 1) => {
    if (!product) return;
    setOrderLoading(true);
    setOrderError(null);
    try {
      const orderData = await orderService.placeOrder({ productId: product.id, quantity });
      navigate('/order-confirmation', { state: { order: orderData } });
    } catch (err) {
      setOrderError(typeof err === 'string' ? err : (err?.message || 'Failed to place order. Please try again.'));
      setOrderLoading(false);
    }
  };

  // Dispatch fetchProduct on mount (or when id changes)
  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [id, dispatch]);

  // When selectedProduct is loaded and has a category, fetch similar products
  useEffect(() => {
    if (selectedProduct && selectedProduct.category) {
      dispatch(fetchProducts({ category: selectedProduct.category }));
    }
  }, [selectedProduct?.category, selectedProduct?._id, dispatch]);

  // ── Map API response to what child components expect ─────────────────────

  /**
   * Build a normalised product object from the API response.
   * The API returns:
   *   { _id, name, brand, condition, images: [], price, originalPrice, discount,
   *     description, highlights: [], specifications: Map, rating, reviewCount, category }
   */
  const buildProductProps = (p) => {
    if (!p) return null;
    // specifications may come back as a plain object or a JS Map-like object;
    // ensure it's a plain object for ProductSpecs
    let specs = {};
    if (p.specifications) {
      if (typeof p.specifications.toJSON === 'function') {
        specs = p.specifications.toJSON();
      } else if (p.specifications instanceof Map) {
        p.specifications.forEach((v, k) => { specs[k] = v; });
      } else {
        specs = { ...p.specifications };
      }
    }

    return {
      id:            p._id || p.id,
      name:          p.name || '',
      brand:         p.brand || '',
      condition:     p.condition || 'New',
      images:        Array.isArray(p.images) && p.images.length > 0 ? p.images : [
        'https://via.placeholder.com/600x400/1d3557/ffffff?text=No+Image',
      ],
      rating:        typeof p.rating === 'number' ? p.rating : 0,
      reviews:       p.reviewCount || 0,
      price:         p.price || 0,
      originalPrice: p.originalPrice || null,
      discount:      p.discount || null,
      description:   p.description || '',
      highlights:    Array.isArray(p.highlights) ? p.highlights : [],
      specifications: specs,
      category:      p.category || '',
    };
  };

  // Map similar products list to what SimilarProducts expects: { id, name, imageUrl, price, brand }
  const buildSimilarProducts = () => {
    const currentId = selectedProduct?._id || selectedProduct?.id;
    return products
      .filter((p) => (p._id || p.id) !== currentId)
      .map((p) => ({
        id:       p._id || p.id,
        name:     p.name || '',
        brand:    p.brand || '',
        imageUrl: Array.isArray(p.images) && p.images.length > 0
          ? p.images[0]
          : 'https://via.placeholder.com/600x400/1d3557/ffffff?text=No+Image',
        price:    p.price || 0,
      }));
  };

  const product = buildProductProps(selectedProduct);
  const similarProducts = buildSimilarProducts();

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderSkeleton = () => (
    <div className="max-w-7xl mx-auto px-6 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-7 bg-surface-variant rounded-xl aspect-square md:aspect-[4/3]" />
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="h-4 w-24 bg-surface-variant rounded" />
          <div className="h-10 w-3/4 bg-surface-variant rounded" />
          <div className="h-6 w-32 bg-surface-variant rounded" />
          <div className="h-24 bg-surface-variant rounded-xl" />
          <div className="h-12 bg-surface-variant rounded-xl" />
          <div className="h-12 bg-surface-variant rounded-xl" />
        </div>
      </div>
      <div className="h-64 bg-surface-variant rounded-xl mb-12" />
    </div>
  );

  const renderError = () => (
    <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center gap-4 text-center">
      <span className="material-symbols-outlined text-5xl text-error">error</span>
      <h2 className="text-2xl font-bold text-white">Failed to load product</h2>
      <p className="text-on-surface-variant">
        {typeof error === 'string' ? error : (error?.message || 'An unexpected error occurred.')}
      </p>
      <button
        onClick={() => navigate('/electronics')}
        className="mt-4 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
      >
        Back to Electronics
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-background text-on-background flex flex-col relative animate-fade-in">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-8 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow">
        {loading && !selectedProduct && renderSkeleton()}
        {!loading && error && renderError()}

        {product && (
          <>
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
                <ProductInfo
                  product={product}
                  onShowToast={showToast}
                  onConfirmPickUp={handlePlaceOrder}
                  orderLoading={orderLoading}
                  orderError={orderError}
                />
              </div>
            </div>

            {/* Specs tabs/accordion */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
              <ProductSpecs
                specifications={product.specifications}
                description={product.description}
              />
            </div>

            {/* Similar products — only render if we have results */}
            {similarProducts.length > 0 && (
              <div className="max-w-7xl mx-auto px-6">
                <SimilarProducts products={similarProducts} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile fixed bottom action bar */}
      {product && (
        <div className="md:hidden fixed bottom-0 w-full glass-panel border-t border-white/10 p-4 z-40 pb-6 rounded-t-2xl shadow-2xl">
          <div className="flex gap-3">
            <button
              onClick={() => showToast('Opening seller chat inquiry...')}
              className="w-12 h-12 flex-shrink-0 rounded-xl border border-secondary/50 text-secondary flex items-center justify-center bg-surface-container/50 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">chat_bubble</span>
            </button>
            <button
              onClick={() => handlePlaceOrder(1)}
              disabled={orderLoading}
              className="flex-1 bg-primary text-black font-extrabold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform uppercase tracking-wider text-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {orderLoading ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                  Placing Order…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">storefront</span>
                  Confirm Pick-Up
                </>
              )}
            </button>
          </div>
          {orderError && (
            <p className="mt-2 text-center text-xs text-error font-semibold">{orderError}</p>
          )}
        </div>
      )}

      {/* Add bottom padding for mobile so content isn't hidden behind fixed bar */}
      <div className="md:hidden h-20" />

      <Footer />
    </div>
    </>
  );
};

export default ProductDetailPage;
