// src/pages/OrderConfirmationPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * OrderConfirmationPage Component
 * 
 * Displays order confirmation after successful purchase.
 * 
 * Features:
 * - Success header with checkmark and order number
 * - Order summary (date, payment method, shipping)
 * - Items ordered with thumbnails, quantities, prices
 * - Financial breakdown (subtotal, tax, shipping, total)
 * - Shipping address
 * - Action buttons: Track Order, View Purchase History, Continue Shopping
 */
const OrderConfirmationPage = () => {
  const navigate = useNavigate();

  // Dummy order data
  const order = {
    id: '#AC-2024-00123',
    date: 'Oct 26, 2024',
    paymentMethod: 'Credit Card (**** 4242)',
    shippingMethod: 'Express Home Delivery',
    customerName: 'Alex Mercer',
    address: '123 Nova Core Drive, Suite 4B\nNeo-Tokyo District\nSan Francisco, CA 94105\nUnited States',
    items: [
      {
        id: 1,
        name: 'Lumina 4K Pro Lens',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWItQr7_U7OCGAjcogOFSMnRqu7LfH4lF0uwoXw3au_N4kwj3VSAD71fe9NDA9VpHsQi69tJtnOCnh_l_pnnfJxpwISMHjbAnQNjGnI5E_jP4hR5I8Y_smgYIvi1u2esqwUte-UCzVFEBKSvlAnDguOU9OL4wzb0K4APFaCEGJ64q7MUiVg-xJcales6d94kPist8lBI3pYHWIdB1u05kW5DxG0vPCNyiKFE4uT8NF_M-Tfsier8raOA',
        quantity: 1,
        price: 1200.00,
      },
      {
        id: 2,
        name: 'Sonic Veil Headphones',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQPxW1FhgI6JJJqnOtsN_RDMPrzA4o8tepXQZfo1bOn3pW_Bwa8OExWknISPuyevt4_nQ4teHyd1_SHqSBpiKtKI0SeOlzthGgIWgrXDllLgTrx37iYfFtf5U7mLo499kTf2aVIVi21Meg5l5bdG4xEEPc3vSwbcP4uTTivPLj99Oa2jaZ5qDZoqvhHTtzy-yJ3VyqgjsU5bsar3Medb3uuwjaeiOz6ij-sEXZ_ARc8SEO4M2jC7k2aw',
        quantity: 1,
        price: 250.00,
      },
    ],
    subtotal: 1450.00,
    tax: 0.00,
    shipping: 10.00,
    total: 1460.00,
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center px-4 py-12">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        {/* Success Header */}
        <header className="text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-4">
            <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-on-surface-variant">
            Thank you for your purchase. Your order number is{' '}
            <span className="text-primary font-bold">{order.id}</span>.
          </p>
        </header>

        {/* Main content grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Order details & address */}
          <div className="md:col-span-1 flex flex-col gap-6">
            {/* Order summary */}
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-on-surface-variant">Date</span>
                  <span className="text-white">{order.date}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-on-surface-variant">Payment Method</span>
                  <span className="text-white">{order.paymentMethod}</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="text-white text-right">{order.shippingMethod}</span>
                </li>
              </ul>
            </div>

            {/* Shipping address */}
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant">location_on</span>
                Address
              </h2>
              <address className="text-sm text-on-surface-variant not-italic leading-relaxed">
                <strong className="text-white block mb-1">{order.customerName}</strong>
                {order.address.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </address>
            </div>
          </div>

          {/* Right column: Items & financials */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Items list */}
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Items Ordered</h2>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-6 border-b border-white/5 last:border-none last:pb-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-surface-container-high">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <p className="text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="glass-panel rounded-xl p-6">
              <div className="w-full max-w-sm ml-auto space-y-3">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant border-b border-white/10 pb-3">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-3xl font-bold text-primary">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <button className="bg-primary text-black px-6 py-3 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">local_shipping</span>
            Track Order
          </button>
          <button
            onClick={() => navigate('/purchase-history')}
            className="border border-secondary text-secondary px-6 py-3 rounded-lg hover:bg-secondary/10 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            View Purchase History
          </button>
          <button
            onClick={() => navigate('/electronics')}
            className="text-on-surface-variant hover:text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">shopping_bag</span>
            Continue Shopping
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;