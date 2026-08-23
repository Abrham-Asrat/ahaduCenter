// src/pages/OrderConfirmationPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';

/**
 * OrderConfirmationPage Component
 *
 * Displays an In-Store Pick-Up Pass after a successful order.
 * - Primary path: reads `location.state.order` passed from ProductDetailPage.
 * - Fallback path: if no state is present (e.g. user navigates directly to
 *   /order-confirmation/:id), fetches the order from the API using the route param.
 */
const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [order, setOrder] = useState(location.state?.order ?? null);
  const [loading, setLoading] = useState(!!(id && !location.state?.order));
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already got the order from navigation state, nothing to do.
    if (order) return;

    // Fallback: fetch the order using the route param id.
    // If neither state nor id is present, render with empty/fallback values.
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-on-surface-variant text-sm">Loading your order details…</p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center px-4">
        <div className="glass-panel rounded-2xl p-8 max-w-md text-center border border-red-500/20">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-4 block">error</span>
          <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-on-surface-variant text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/electronics')}
            className="bg-primary text-black px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Back to Electronics
          </button>
        </div>
      </div>
    );
  }

  // ── Derive display values from the real order object ─────────────────────────
  const orderId = order?._id ? `#AHADU-${order._id.toString().slice(-6).toUpperCase()}` : '—';
  const items = order?.items ?? [];
  const total = order?.totalPrice ?? order?.totalPayableAtStore ?? 0;

  const storeLocation =
    'Ahadu Center Hub, Bole Road (Next to Friendship HyperMarket), Addis Ababa, Ethiopia';
  const operatingHours =
    'Mon - Sat: 8:30 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM';

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">

        {/* Success Header */}
        <header className="text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_35px_rgba(16,185,129,0.3)] mb-4">
            <span
              className="material-symbols-outlined text-5xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              storefront
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
            In-Store Pick-Up Reserved!
          </h1>
          <p className="text-lg text-on-surface-variant max-w-lg">
            Your items have been reserved at our physical store. Show your Pick-Up Pass
            to the cashier to pay and collect.
          </p>
        </header>

        {/* Digital Pick-Up Pass Badge */}
        <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-surface-container to-background shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary text-black flex items-center justify-center font-black text-2xl shadow-lg">
                <span className="material-symbols-outlined text-3xl">qr_code_2</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-primary font-extrabold block mb-1">
                  In-Store Reservation Pass
                </span>
                <h2 className="text-3xl font-black text-white tracking-wider">
                  {orderId}
                </h2>
              </div>
            </div>

            <div className="text-center md:text-right">
              <span className="bg-primary/20 text-primary border border-primary/40 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider inline-block mb-1">
                Ready for Pick-Up
              </span>
              <p className="text-xs text-on-surface-variant">
                Order ID: <strong>{order?._id ?? '—'}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-on-surface-variant font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">location_on</span>
                Physical Store Address
              </h3>
              <p className="text-sm text-white font-semibold leading-relaxed mb-2">
                {storeLocation}
              </p>
              <p className="text-xs text-on-surface-variant">
                <strong>Operating Hours:</strong> {operatingHours}
              </p>
            </div>

            <div className="bg-background/60 p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
              <span className="text-xs uppercase text-on-surface-variant font-bold mb-1">
                Payment Instructions
              </span>
              <p className="text-xs text-white leading-relaxed">
                Pay in person when you inspect your items at our cashier. Cash, Telebirr,
                or CBE Mobile Transfer are accepted.
              </p>
              <div className="mt-3 flex justify-between items-baseline pt-2 border-t border-white/10">
                <span className="text-xs text-on-surface-variant font-bold">
                  Total Payable at Store:
                </span>
                <span className="text-2xl font-black text-secondary">
                  ${Number(total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reserved Items List */}
        <div className="w-full glass-panel rounded-2xl p-6 border border-white/10 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shopping_bag</span>
            Reserved Items ({items.length})
          </h2>

          {items.length === 0 ? (
            <p className="text-on-surface-variant text-sm">No item details available.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                // Support both populated `product` objects and plain strings/ids.
                const productName =
                  item?.product?.name ?? item?.productName ?? item?.name ?? 'Product';
                const imageUrl =
                  item?.product?.images?.[0] ??
                  item?.imageUrl ??
                  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80';
                const quantity = item?.quantity ?? 1;
                const price = item?.price ?? item?.product?.price ?? 0;

                return (
                  <div
                    key={item?._id ?? item?.id ?? index}
                    className="flex items-center gap-4 pb-4 border-b border-white/5 last:border-none last:pb-0"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-surface-container">
                      <img
                        src={imageUrl}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-white font-bold">{productName}</h3>
                      <p className="text-xs text-on-surface-variant">Quantity: {quantity}</p>
                    </div>
                    <div className="text-lg font-bold text-white">
                      ${Number(price).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row gap-4 justify-center mt-2">
          <button
            onClick={() => window.print()}
            className="bg-primary text-black px-6 py-3.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Save / Print Pick-Up Pass
          </button>
          <button
            onClick={() => navigate('/electronics')}
            className="border border-white/20 text-white px-6 py-3.5 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            Continue Browsing Hub
          </button>
        </div>

      </main>
    </div>
  );
};

export default OrderConfirmationPage;
