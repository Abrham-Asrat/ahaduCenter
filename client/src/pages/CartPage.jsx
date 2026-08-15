// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * CartPage Component
 * 
 * Displays items selected for In-Store Pick-Up Reservation.
 * Note: Ahadu Center is an in-person physical store & library hub.
 * No online payment method is required.
 */
const CartPage = () => {
  const navigate = useNavigate();

  // Cart items state
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Alpha Pro DSLR X-1 Camera',
      brand: 'Lumiere Tech',
      condition: 'Brand New',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
      price: 2499,
      quantity: 1,
    },
    {
      id: 2,
      name: 'SonicWave Studio Pro Headphones',
      brand: 'Acoustica',
      condition: 'Refurbished',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      price: 349,
      quantity: 2,
    },
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedPromo === 'PROMO100' ? 100 : 0;
  const total = subtotal - discount;

  // Update quantity
  const updateQuantity = (id, delta) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Apply promo code
  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'PROMO100') {
      setAppliedPromo('PROMO100');
    } else {
      setAppliedPromo(null);
      alert('Invalid promo code');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">In-Store Pick-Up Cart</h1>
          <p className="text-on-surface-variant text-base">
            Items reserved here will be held at our physical address for in-person inspection and payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Cart items */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="glass-panel rounded-2xl text-center py-16 px-6 border border-white/10">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">shopping_cart</span>
                <h2 className="text-2xl font-bold text-white mt-4">Your pick-up cart is empty</h2>
                <p className="text-on-surface-variant mt-2 text-sm">Add some products or books to reserve for pick-up.</p>
                <Link to="/electronics" className="inline-block mt-6 bg-primary text-black font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all">
                  Browse Tech Marketplace
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center border border-white/10 shadow-lg">
                  {/* Product image */}
                  <div className="w-32 h-32 flex-shrink-0 bg-surface-container rounded-xl overflow-hidden border border-white/10">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Product info */}
                  <div className="flex-grow flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${item.condition === 'Brand New'
                            ? 'bg-primary/15 text-primary border border-primary/30'
                            : 'bg-secondary/15 text-secondary border border-secondary/30'
                          }`}>
                          {item.condition}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-2">{item.name}</h3>
                        <p className="text-xs text-on-surface-variant font-medium">{item.brand}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="text-2xl font-extrabold text-primary">${item.price.toLocaleString()}</div>
                      <div className="flex items-center gap-2 bg-surface-container-high rounded-xl p-1 border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-white hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="text-white w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-white hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Promo code */}
            {cartItems.length > 0 && (
              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm"
                  placeholder="In-Store Voucher Code"
                />
                <button
                  onClick={applyPromo}
                  className="border border-secondary text-secondary px-6 py-3 rounded-xl hover:bg-secondary/10 transition-colors uppercase text-xs font-bold tracking-wider cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-4">
              <div className="glass-panel rounded-2xl p-6 sticky top-24 flex flex-col gap-4 border border-white/10 shadow-xl">
                <h2 className="text-2xl font-bold text-white pb-3 border-b border-white/10">Reservation Summary</h2>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Estimated Subtotal</span>
                    <span className="text-white font-bold">${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Voucher Discount</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-on-surface-variant pb-2 border-b border-white/10">
                    <span>In-Store Pick-Up Fee</span>
                    <span className="text-primary font-bold">FREE</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-between items-end">
                  <span className="text-lg font-bold text-white">Total Payable at Store</span>
                  <span className="text-3xl font-extrabold text-secondary">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-primary text-black font-extrabold rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider"
                >
                  Proceed to Pick-Up Reservation
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant justify-center pt-2 border-t border-white/10">
                  <span className="material-symbols-outlined text-primary text-sm">verified</span>
                  In-Person Inspection &amp; Warranty Guarantee
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;