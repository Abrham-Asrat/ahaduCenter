// src/pages/PurchaseHistoryPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

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
 * - Pagination
 * 
 * State:
 * - activeFilter: Currently selected filter
 * - orders: Array of order objects
 */
const PurchaseHistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState('All Orders');

  // Orders data
  const orders = [
    {
      id: '#AC-2024-00123',
      date: 'Oct 12, 2024',
      status: 'Completed',
      total: '$1,450.00',
      items: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCRwMwyBGqHj-h2KmyXcW4u7_xpsyuO5Y8C5r-M1P-5b8q3f2xwA5CuB0bcPmdvSZClqV1lMycXy_VCzPRnR5XgyDoEcoxQRl3s546xHxFP52Geu6Kgms6CnGnvYDeeQzo9T9nbhZ87B-oMBT8WQEoSp4VhGsV9ypZHtNYe9p1v3QI5GoP_yhiAPusZdSTlD4Kw3CtBLL2Lc3febKshB1LV9w1hI6oUAlNHCmG5bYhf4NkpM6OOklHSjA',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCy6LDql_OSx5880tpkuTPM7SV0P2m-C_rV4rjmWEgxvOWfoqPzJjpYmKhjRH5XYi3KwoiHbiPBRB-tJoJO265NssN62UeuYS7xw7WZApInxXhHw0pCOqHhEEy95LVeGlgN52XrOj0HUhVHNIfpNkEyNYv77ayBvqV0f0RaEOoASB-vAwySLypdTc02xhvVJzSPkebshj7nqHtoFHXRYmUC25MCM2IJxBx6asNrJoQhy-1W3ndcP_GWWA',
      ],
      itemCount: 3,
    },
    {
      id: '#AC-2024-00128',
      date: 'Oct 24, 2024',
      status: 'Processing',
      total: '$125.50',
      items: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAY_MeypWzVhM2ROCr2bYYK63MrGCHjhNDnmQvqiXHLXPEVKDJZD805q0MW2cWasZB6FxLMsawtzlrjZ728mnD5YR5zwxux7ovdd7w7douU8lOB2XH9sY4_d5xUB-hG0ZfXyVO73Jb209kOzLvZFRHu6HXkytjE1euwgMPF5VgLC9TLljkW4tgb8FC5OyohQLqdSaTLZuq4Z8BNObmfo2CIgy6dNy86YOfA263ZHIejl-lhkYXAdg4GHg',
      ],
      itemCount: 1,
    },
  ];

  // Filter tabs
  const filters = ['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // Filter orders based on active filter
  const filteredOrders = activeFilter === 'All Orders'
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  // Status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'bg-primary/15 text-primary border-primary/20';
      case 'Processing':
      case 'Shipped':
        return 'bg-secondary/15 text-secondary border-secondary/20';
      case 'Cancelled':
        return 'bg-error/15 text-error border-error/20';
      default:
        return 'bg-white/5 text-on-surface-variant border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Purchase History</h1>
            <p className="text-lg text-on-surface-variant">Review your past orders for electronics and books.</p>
          </div>
          <button className="border border-secondary text-secondary px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all text-xs uppercase tracking-wider flex items-center gap-2">
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
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all ${activeFilter === filter
                  ? 'bg-primary text-black font-semibold'
                  : 'bg-transparent text-on-surface-variant border border-white/10 hover:border-primary hover:text-primary'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

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
              <div key={order.id} className="glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-primary/50 transition-all group relative overflow-hidden">
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
                    {order.items.map((img, index) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-background">
                        <img src={img} alt={`Item ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.itemCount > order.items.length && (
                      <div className="w-16 h-16 rounded-lg border border-white/10 bg-background flex items-center justify-center">
                        <span className="text-sm text-on-surface-variant">+{order.itemCount - order.items.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex md:flex-col justify-end gap-3 md:w-48 shrink-0 relative z-10">
                  {order.status === 'Processing' ? (
                    <>
                      <button className="flex-1 md:flex-none border border-secondary text-secondary px-4 py-2 rounded-lg hover:bg-secondary/10 transition-all text-xs uppercase flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">local_shipping</span>
                        Track Order
                      </button>
                    </>
                  ) : (
                    <button className="flex-1 md:flex-none border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-black transition-all text-xs uppercase flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      Buy Again
                    </button>
                  )}
                  <button className="flex-1 md:flex-none border border-white/20 text-white px-4 py-2 rounded-lg hover:border-white/50 transition-all text-xs uppercase flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-sm text-white">1 OF 3</span>
            <button className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PurchaseHistoryPage;