// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * CheckoutPage Component
 * 
 * Displays checkout form with shipping info, payment method, order summary.
 * 
 * Features:
 * - Shipping information form (name, email, phone, address, city, zip)
 * - Payment method radio buttons (Credit Card, Bank Transfer, Cash on Delivery)
 * - Order summary with subtotal, shipping, total
 * - Place Order button
 * 
 * State:
 * - formData: Object with all form fields
 * - paymentMethod: String
 */
const CheckoutPage = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle place order
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // In production, send to API
    console.log('Order placed:', { formData, paymentMethod });
    // Navigate to confirmation
    navigate('/order-confirmation');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header with stepper */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Checkout</h1>
          {/* Stepper */}
          <div className="flex items-center justify-between max-w-2xl relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-variant -z-10" />
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="text-xs uppercase text-primary">Cart</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className="w-8 h-8 rounded-full border-2 border-primary text-primary flex items-center justify-center">
                <span className="text-sm font-bold">2</span>
              </div>
              <span className="text-xs uppercase text-primary">Checkout</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className="w-8 h-8 rounded-full border-2 border-surface-variant text-surface-variant flex items-center justify-center">
                <span className="text-sm">3</span>
              </div>
              <span className="text-xs uppercase text-surface-variant">Success</span>
            </div>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Shipping info */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-on-surface-variant mb-2">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                      className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                      placeholder="Enter first name" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                      className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                      placeholder="Enter last name" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                      placeholder="Enter email" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                      placeholder="Enter phone" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase text-on-surface-variant mb-2">Street Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange}
                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                    placeholder="123 High-Tech Blvd" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase text-on-surface-variant mb-2">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                      className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                      placeholder="City name" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-on-surface-variant mb-2">Postal Code</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange}
                      className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                      placeholder="Zip" required />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment & Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Payment method */}
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="Credit Card"
                    checked={paymentMethod === 'Credit Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div className="flex-grow">
                    <span className="text-lg text-white">Credit Card</span>
                    {paymentMethod === 'Credit Card' && (
                      <div className="mt-3 space-y-3">
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                          placeholder="Card Number"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                            placeholder="MM/YY"
                          />
                          <input
                            type="text"
                            name="cvc"
                            value={formData.cvc}
                            onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                            placeholder="CVC"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="Bank Transfer"
                    checked={paymentMethod === 'Bank Transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-lg text-white flex-grow">Bank Transfer</span>
                  <span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
                </label>

                <label className="flex items-center gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-lg text-white flex-grow">Cash on Delivery</span>
                  <span className="material-symbols-outlined text-on-surface-variant">local_shipping</span>
                </label>
              </div>
            </div>

            {/* Order summary */}
            <div className="glass-panel rounded-xl p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-white font-semibold">$2,499.00</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="text-primary">Free</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-xl font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-secondary">$2,499.00</span>
              </div>
            </div>

            {/* Place order */}
            <button
              type="submit"
              className="w-full py-4 bg-primary text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
            >
              Place Order
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;