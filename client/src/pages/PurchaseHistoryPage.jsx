// src/pages/PurchaseHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { orderService } from '../services/orderService';

/**
 * PurchaseHistoryPage Component
 *
 * Displays user's past purchase orders with status and actions.
 *
 * Features:
 * - Filter tabs: All Orders, Processing, Shipped, Delivered, Cancelled
 * - Order cards with order ID, date, status, items, total
 * - Action buttons: Buy Again, Track Order, View Details
 * - Export History button
 * - Pagination driven by server response (totalPages)
 * - Toast notifications (3 s auto-dismiss)
 * - Loading skeleton while data is in-flight
 * - Error banner with retry on failure
 *
 * State:
 * - orders: Array of order objects from the API
 * - loading: true while the API call is in-flight
 * - error: error string from the API, or null
 * - pagination: { currentPage, totalPages, totalItems } from the server
 * - activeFilter: Currently selected filter (client-side)
 * - toastMessage: Temporary notification text or null
 */
const PurchaseHistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState('All Orders');
  const [toastMessage, setToastMessage] = useState(null);

  // API-driven state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  /** Fetch order history from the API. */
  const fetchOrderHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrderHistory({ page: pagination.currentPage, limit: 10 });
      // The API may return a paginated envelope { data, totalCount, page, totalPages, limit }
      // or a plain array. Handle both shapes gracefully.
      if (Array.isArray(data)) {
        setOrders(data);
        setPagination({ currentPage: 1, totalPages: 1, totalItems: data.length });
      } else {
        setOrders(data.data ?? data.orders ?? []);
        setPagination({
          currentPage: data.page ?? 1,
          totalPages: data.totalPages ?? 1,
          totalItems: data.totalCount ?? data.total ?? 0,
        });
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to load purchase history.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchOrderHistory();
  }, [pagination.currentPage]);

  /** Show a transient toast that auto-dismisses after 3 seconds. */
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter tabs
  const filters = ['All Orders', 'Processing', 'Ready', 'Completed', 'Cancelled'];

  /**
   * Normalise a raw API order object into the shape this component renders.
   * The API order has: _id, status, totalPrice, createdAt, items[{ product, quantity, price }]
   */
  const normaliseOrder = (raw) => {
    const rawItems = raw.items ?? [];
    // Collect up to 3 thumbnail image URLs from the order items.
    const thumbnails = rawItems
      .map((i) => i?.productImage ?? null)
      .filter(Boolean)
      .slice(0, 3);

    // Map API status values to display-friendly strings.
    const statusMap = {
      pending: 'Processing',
      processing: 'Processing',
      ready: 'Ready',
      completed: 'Completed',
      cancelled: 'Cancelled',
      canceled: 'Cancelled',
    };
    const rawStatus = (raw.status ?? '').toLowerCase();
    const displayStatus = statusMap[rawStatus] ?? raw.status ?? 'Processing';

    // Format date
    const date = raw.createdAt
      ? new Date(raw.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—';

    const total = raw.totalPrice ?? raw.totalPayableAtStore ?? 0;

    return {
      id: raw._id ? `#AC-${raw._id.toString().slice(-8).toUpperCase()}` : raw.id ?? '—',
      _id: raw._id ?? raw.id,
      date,
      status: displayStatus,
      total: `ETB ${Number(total).toFixed(2)}`,
      items: thumbnails,
      itemCount: rawItems.length,
    };
  };

  // Normalise all orders from the API.
  const normalisedOrders = orders.map(normaliseOrder);

  // Filter orders based on active filter (client-side, within the loaded page).
  const filteredOrders =
    activeFilter === 'All Orders'
      ? normalisedOrders
      : normalisedOrders.filter((o) => o.status === activeFilter);

  // Status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-primary/15 text-primary border-primary/20';
      case 'Processing':
      case 'Ready':
        return 'bg-secondary/15 text-secondary border-secondary/20';
      case 'Cancelled':
        return 'bg-error/15 text-error border-error/20';
      default:
        return 'bg-white/5 text-on-surface-variant border-white/10';
    }
  };

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in">

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Purchase History</h1>
            <p className="text-lg text-on-surface-variant">Review your past orders for electronics and books.</p>
          </div>
          <button
            onClick={() => window.print()}
            className="border border-secondary text-secondary px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export History
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-primary text-black font-semibold'
                  : 'bg-transparent text-on-surface-variant border border-white/10 hover:border-primary hover:text-primary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading purchase history">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 animate-pulse"
              >
                <div className="flex-1 flex flex-col gap-3 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                  <div className="h-5 bg-white/10 rounded w-1/3" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                  <div className="flex gap-2 mt-2">
                    <div className="w-16 h-16 rounded-lg bg-white/10" />
                    <div className="w-16 h-16 rounded-lg bg-white/10" />
                  </div>
                </div>
                <div className="flex md:flex-col justify-end gap-3 md:w-48">
                  <div className="h-9 bg-white/10 rounded-lg flex-1 md:flex-none" />
                  <div className="h-9 bg-white/10 rounded-lg flex-1 md:flex-none" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="glass-panel rounded-xl p-8 text-center border border-red-500/20">
            <span className="material-symbols-outlined text-5xl text-red-400 mb-4 block">error</span>
            <h2 className="text-xl font-bold text-white mb-2">Could not load purchase history</h2>
            <p className="text-on-surface-variant text-sm mb-6">{error}</p>
            <button
              onClick={fetchOrderHistory}
              className="bg-primary text-black px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content — only shown once loading is done and no error */}
        {!loading && !error && (
          <>
            {/* Empty state */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">receipt_long</span>
                <h2 className="text-2xl font-bold text-white mt-4">No purchase history</h2>
                <p className="text-on-surface-variant mt-2">When you buy electronics or books, they'll show up here.</p>
              </div>
            ) : (
              /* Orders list */
              <div className="flex flex-col gap-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id ?? order.id}
                    className="glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-primary/50 transition-all group relative overflow-hidden"
                  >
                    {/* Ambient glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-all" />

                    {/* Left: order info */}
                    <div className="flex-1 flex flex-col gap-3 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 relative z-10">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs uppercase text-on-surface-variant block mb-1">Order ID</span>
                          <span className="text-lg font-bold text-white">{order.id}</span>
                        </div>
                        <span className={`px-3 py-1 rounded text-xs uppercase border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-on-surface-variant">
                        Placed on {order.date} • Total: {order.total}
                      </div>

                      {/* Item thumbnails */}
                      <div className="flex gap-2 mt-auto pt-2">
                        {order.items.length > 0 ? (
                          order.items.map((img, index) => (
                            <div
                              key={index}
                              className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-background"
                            >
                              <img src={img} alt={`Item ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))
                        ) : (
                          /* Fallback placeholder when no image URLs are available */
                          <div className="w-16 h-16 rounded-lg border border-white/10 bg-background flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-surface-variant/50 text-2xl">shopping_bag</span>
                          </div>
                        )}
                        {order.itemCount > order.items.length && order.items.length > 0 && (
                          <div className="w-16 h-16 rounded-lg border border-white/10 bg-background flex items-center justify-center">
                            <span className="text-sm text-on-surface-variant">+{order.itemCount - order.items.length}</span>
                          </div>
                        )}
                        {order.itemCount > 1 && (
                          <span className="self-end text-xs text-on-surface-variant ml-1">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex md:flex-col justify-end gap-3 md:w-48 shrink-0 relative z-10">
                      {order.status === 'Processing' || order.status === 'Shipped' ? (
                        <button
                          onClick={() => showToast('Tracking coming soon')}
                          className="flex-1 md:flex-none border border-secondary text-secondary px-4 py-2 rounded-lg hover:bg-secondary/10 transition-all text-xs uppercase flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">local_shipping</span>
                          Track Order
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast('Added to wishlist')}
                          className="flex-1 md:flex-none border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-black transition-all text-xs uppercase flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">shopping_bag</span>
                          Buy Again
                        </button>
                      )}
                      <button
                        onClick={() => showToast('Details coming soon')}
                        className="flex-1 md:flex-none border border-white/20 text-white px-4 py-2 rounded-lg hover:border-white/50 transition-all text-xs uppercase flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination — driven by server response */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  aria-label="Previous page"
                  disabled={pagination.currentPage <= 1}
                  onClick={() =>
                    setPagination((p) => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))
                  }
                  className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="text-sm text-white" aria-live="polite">
                  {pagination.currentPage} OF {pagination.totalPages}
                </span>
                <button
                  aria-label="Next page"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      currentPage: Math.min(p.totalPages, p.currentPage + 1),
                    }))
                  }
                  className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Toast notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-8 right-8 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce"
        >
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
    </>
  );
};

export default PurchaseHistoryPage;
