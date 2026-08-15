// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * CartPage Component
 * 
 * Displays shopping cart with items, quantity controls, promo code, and order summary.
 * 
 * Features:
 * - Cart items with image, name, brand, condition badge, price
 * - Quantity increase/decrease controls
 * - Remove item button
 * - Promo code input with apply button
 * - Order summary (subtotal, discount, shipping, tax, total)
 * - Proceed to Checkout button
 * 
 * State:
 * - cartItems: Array of { id, name, brand, imageUrl, condition, price, quantity }
 * - promoCode: String
 */
const CartPage = () => {
  const navigate = useNavigate();

  // Cart items state
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Alpha Pro DSLR X-1',
      brand: 'Lumiere Tech',
      condition: 'Brand New',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnOBonH2beYWsnRCNi4bWcopLUJpx-YvtowT3DX75SioUCv1mrLVfAyRkizerku4uwYsRsS_2rRIHzUK4TC92XeqtsmUYOT62S_pHaFvxrOWZdJ1CLW7hyaNxkzl63MrWaTeLF97xcLL8smROV3q6sVHUFedhvM9QbvHXCQS8YtEhbWmTp2K8YCko-JtZTfU4tvN_mHscVGEWcNOg1ghe9pLuWp6mfpldtNj6kPVy_-k-DZVZtCqKb4Q',
      price: 2499,
      quantity: 1,
    },
    {
      id: 2,
      name: 'SonicWave Studio Pro',
      brand: 'Acoustica',
      condition: 'Refurbished',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC67sQH4AyE-z2eU1PiMnmv8CkWSTYltmpyt40HEHnRqunEisbZLKiQzYd0oxwLq6YGUO7DWJPzNbgn8MrokEbFeLOIHLtqsVClNoebfU9GAl92shhHunQlzG4Nd9hVJQJCkXTfbcxBxYt9ozWDqdawPYj4OyCQi1WKrUD4qqUInTSZmek_whhZwdxYuHYcxyP8A8K9Qb9y0IpgXUgyczuyei_dhF2JK0AZvqSnGxF6F49ccyclh8Ka4g',
      price: 349,
      quantity: 2,
    },
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Discount (if promo applied)
  const discount = appliedPromo === 'PROMO100' ? 100 : 0;
  // Tax (8% of subtotal after discount)
  const tax = (subtotal - discount) * 0.08;
  // Total
  const total = subtotal - discount + tax;

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
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Cart items */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">shopping_cart</span>
                <h2 className="text-2xl font-bold text-white mt-4">Your cart is empty</h2>
                <p className="text-on-surface-variant mt-2">Add some products to get started.</p>
                <Link to="/electronics" className="inline-block mt-6 bg-primary text-black px-6 py-2 rounded hover:shadow-lg transition-all">
                  Shop Electronics
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="glass-panel rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center">
                  {/* Product image */}
                  <div className="w-32 h-32 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden border border-white/5">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Product info */}
                  <div className="flex-grow flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-xs uppercase px-2 py-1 rounded ${item.condition === 'Brand New'
                            ? 'bg-primary/15 text-primary'
                            : 'bg-secondary/15 text-secondary'
                          }`}>
                          {item.condition}
                        </span>
                        <h3 className="text-xl font-semibold text-white mt-2">{item.name}</h3>
                        <p className="text-sm text-on-surface-variant">{item.brand}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-2"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="text-xl font-bold text-primary">${item.price.toLocaleString()}</div>
                      <div className="flex items-center gap-2 bg-surface-container-high rounded-lg p-1 border border-white/5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-white hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-white hover:text-primary transition-colors"
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
                  className="flex-grow bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Promo Code"
                />
                <button
                  onClick={applyPromo}
                  className="border border-secondary text-secondary px-6 py-2 rounded-lg hover:bg-secondary/10 transition-colors uppercase text-sm tracking-wider"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-4">
              <div className="glass-panel rounded-xl p-6 sticky top-24 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-white pb-3 border-b border-white/10">Order Summary</h2>
                <div className="flex flex-col gap-3 text-lg">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Discount (PROMO100)</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="text-primary">Free</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                  <span className="text-xl font-semibold text-white">Total</span>
                  <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant justify-center">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Secure Checkout Guarantee
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