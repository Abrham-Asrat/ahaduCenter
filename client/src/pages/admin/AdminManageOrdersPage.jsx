// src/pages/admin/AdminManageOrdersPage.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * AdminManageOrdersPage Component
 * 
 * Allows admins to manage electronics orders.
 * 
 * Features:
 * - Search and filter toolbar
 * - Desktop table with order details
 * - Detail modal with status timeline, items, financials
 * - Mobile card list with bottom sheet
 * - Status badges: Processing, Shipped, Delivered, Cancelled
 * 
 * State:
 * - orders: Array of order objects
 * - searchQuery: String
 * - selectedOrder: Order object or null (for detail modal)
 */
const AdminManageOrdersPage = () => {
  // Orders data
  const [orders, setOrders] = useState([
    {
      id: '#AC-2024-00123',
      customer: 'Alex Mercer',
      email: 'alex@example.com',
      initials: 'AM',
      date: 'Oct 24, 2024',
      status: 'Processing',
      payment: 'Credit Card',
      cardLast4: '4242',
      subtotal: 1399.00,
      shipping: 25.00,
      tax: 75.00,
      total: 1499.00,
      items: [
        { name: 'Lumina 4K Pro Lens', sku: 'LM-4K-PRO-01', quantity: 1, price: 1250.00 },
        { name: 'Quantum Wireless Pad', sku: 'QW-PAD-02', quantity: 1, price: 149.00 },
      ],
      address: '1024 Silicon Avenue, Suite 400\nSan Francisco, CA 94107\nUnited States',
    },
    {
      id: '#AC-2024-00122',
      customer: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      initials: 'SJ',
      date: 'Oct 23, 2024',
      status: 'Delivered',
      payment: 'PayPal',
      cardLast4: null,
      subtotal: 224.50,
      shipping: 0,
      tax: 25.00,
      total: 249.50,
      items: [
        { name: 'Quantum Mechanical Keyboard', sku: 'QM-KB-03', quantity: 1, price: 224.50 },
      ],
      address: '456 Oak Street\nPortland, OR 97201',
    },
    {
      id: '#AC-2024-00120',
      customer: 'Marcus Reed',
      email: 'm.reed@example.com',
      initials: 'MR',
      date: 'Oct 21, 2024',
      status: 'Cancelled',
      payment: 'Credit Card',
      cardLast4: '7890',
      subtotal: 399.00,
      shipping: 0,
      tax: 0,
      total: 399.00,
      items: [
        { name: 'SonicPulse Headphones', sku: 'SP-ANC-04', quantity: 1, price: 399.00 },
      ],
      address: '789 Pine Avenue\nSeattle, WA 98101',
    },
  ]);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders by search
  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-secondary/15 text-secondary border-secondary/30';
      case 'Delivered':
        return 'bg-primary/15 text-primary border-primary/30';
      case 'Cancelled':
        return 'bg-error/15 text-error border-error/30';
      default:
        return 'bg-white/5 text-on-surface-variant border-white/10';
    }
  };

  // Update order status
  const updateStatus = (id, newStatus) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    setSelectedOrder(null);
  };

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Manage Orders</h2>
          <p className="text-lg text-on-surface-variant">Track, update, and manage customer electronics orders.</p>
        </div>
        <button className="border border-secondary text-secondary px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all text-xs uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">download</span>
          Export Orders
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass-panel rounded-xl p-4 flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full lg:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, Customer..."
            className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
            <option>All Statuses</option>
            <option>Processing</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <select className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
            <option>All Payments</option>
            <option>Credit Card</option>
            <option>PayPal</option>
          </select>
          <button className="text-secondary hover:text-secondary-fixed text-sm underline underline-offset-4 transition-colors">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 w-12"><input type="checkbox" className="rounded" /></th>
                <th className="p-4 text-xs uppercase text-on-surface-variant">Order ID</th>
                <th className="p-4 text-xs uppercase text-on-surface-variant">Customer</th>
                <th className="p-4 text-xs uppercase text-on-surface-variant">Items</th>
                <th className="p-4 text-xs uppercase text-on-surface-variant text-right">Total</th>
                <th className="p-4 text-xs uppercase text-on-surface-variant">Payment</th>
                <th className="p-4 text-xs uppercase text-on-surface-variant">Date</th>
                <th className="p-4 text-xs uppercase text-on-surface-variant text-center">Status</th>
                <th className="p-4 text-xs uppercase text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-4 font-semibold text-white">{order.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-white font-semibold text-sm">
                        {order.initials}
                      </div>
                      <div>
                        <div className="text-white">{order.customer}</div>
                        <div className="text-xs text-on-surface-variant">{order.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 2).map((item, i) => (
                        <div key={i} className="w-8 h-8 rounded bg-surface border border-white/20 flex items-center justify-center text-xs overflow-hidden">
                          <span className="material-symbols-outlined text-sm">devices</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="w-8 h-8 rounded bg-surface-container-high border border-white/20 flex items-center justify-center text-xs text-on-surface-variant">
                          +{order.items.length - 2}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-primary text-right">${order.total.toFixed(2)}</td>
                  <td className="p-4 text-sm text-on-surface-variant">{order.payment}</td>
                  <td className="p-4 text-sm text-on-surface-variant">{order.date}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs uppercase border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-white/5" title="View">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button className="p-1.5 text-on-surface-variant hover:text-secondary rounded hover:bg-white/5" title="Edit">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-white/5" title="Print">
                        <span className="material-symbols-outlined text-lg">print</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm text-on-surface-variant">Showing 1 to {filteredOrders.length} of {filteredOrders.length} orders</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-sm font-semibold">1</button>
            <button className="w-8 h-8 rounded-lg glass-panel text-white hover:text-primary text-sm">2</button>
            <button className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="glass-panel rounded-xl p-4" onClick={() => setSelectedOrder(order)}>
            <div className="flex justify-between items-start mb-3">
              <span className="font-semibold text-white">{order.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs uppercase border ${getStatusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center text-white font-semibold">
                {order.initials}
              </div>
              <div>
                <p className="text-white font-semibold">{order.customer}</p>
                <p className="text-xs text-on-surface-variant">{order.items.length} items • {order.date}</p>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-3">
              <span className="text-primary font-bold">${order.total.toFixed(2)}</span>
              <button className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-surface-container-high w-full md:w-[700px] md:rounded-xl rounded-t-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Order Details</h3>
                <p className="text-sm text-on-surface-variant">{selectedOrder.id} • {selectedOrder.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs uppercase border ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
                <button onClick={() => setSelectedOrder(null)} className="text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer & shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-4">
                  <h4 className="text-xs uppercase text-on-surface-variant mb-3">Customer Information</h4>
                  <p className="text-white font-semibold">{selectedOrder.customer}</p>
                  <p className="text-sm text-on-surface-variant">{selectedOrder.email}</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <h4 className="text-xs uppercase text-on-surface-variant mb-3">Shipping Address</h4>
                  <address className="text-sm text-on-surface-variant not-italic leading-relaxed whitespace-pre-line">
                    {selectedOrder.address}
                  </address>
                </div>
              </div>

              {/* Status timeline */}
              <div>
                <h4 className="text-xs uppercase text-on-surface-variant mb-4">Order Status</h4>
                <div className="flex items-center justify-between">
                  {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index <= 1 ? 'bg-primary text-black' : 'bg-surface border border-white/20 text-white/20'
                          }`}>
                          {index < 1 ? '✓' : index + 1}
                        </div>
                        <span className={`text-xs ${index <= 1 ? 'text-primary' : 'text-white/40'}`}>{step}</span>
                      </div>
                      {index < 3 && <div className="flex-1 h-0.5 bg-white/10 mx-2" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs uppercase text-on-surface-variant mb-3">Order Items</h4>
                <div className="border border-white/10 rounded-lg divide-y divide-white/5">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4">
                      <div className="w-12 h-12 rounded bg-surface flex items-center justify-center border border-white/10">
                        <span className="material-symbols-outlined text-on-surface-variant">devices</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.name}</p>
                        <p className="text-sm text-on-surface-variant">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment summary */}
              <div className="border-t border-white/10 pt-4">
                <div className="space-y-2 max-w-xs ml-auto">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Shipping</span>
                    <span>${selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                    <span className="text-white">Total</span>
                    <span className="text-primary">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={() => setSelectedOrder(null)} className="px-6 py-2 rounded-lg border border-secondary text-secondary hover:bg-secondary/10">
                Close
              </button>
              {selectedOrder.status === 'Processing' && (
                <button
                  onClick={() => updateStatus(selectedOrder.id, 'Delivered')}
                  className="px-6 py-2 rounded-lg bg-primary text-black hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminManageOrdersPage;