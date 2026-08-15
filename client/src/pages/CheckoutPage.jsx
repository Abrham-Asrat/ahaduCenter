// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * CheckoutPage Component
 * 
 * In-Store Pick-Up & Reservation Checkout.
 * Note: Ahadu Center is an in-person physical store & library hub.
 * No online payment method is required. Users reserve items to pay and collect at our physical address.
 */
const CheckoutPage = () => {
  const navigate = useNavigate();

  // Reservation Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupDate: 'Today',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    console.log('Pick-up reservation confirmed:', formData);
    navigate('/order-confirmation');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header with stepper */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            In-Store Pick-Up Reservation
          </h1>
          <p className="text-on-surface-variant text-base">
            No online payment needed! Reserve your items online, then visit our physical store to inspect, pay, and collect your order.
          </p>

          {/* Stepper */}
          <div className="flex items-center justify-between max-w-2xl relative mt-6">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-variant -z-10" />
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className="w-8 h-8 rounded-full bg-primary text-black font-bold flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="text-xs uppercase font-bold text-primary">Cart</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className="w-8 h-8 rounded-full border-2 border-primary text-primary flex items-center justify-center font-bold">
                <span className="text-sm font-bold">2</span>
              </div>
              <span className="text-xs uppercase font-bold text-primary">Reservation</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className="w-8 h-8 rounded-full border-2 border-surface-variant text-surface-variant flex items-center justify-center">
                <span className="text-sm">3</span>
              </div>
              <span className="text-xs uppercase text-surface-variant font-medium">Pick-Up Pass</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleConfirmReservation} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer Info & Pick-up Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Customer Pick-Up Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-on-surface-variant mb-2 font-bold">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none text-sm"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-on-surface-variant mb-2 font-bold">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none text-sm"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-on-surface-variant mb-2 font-bold">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none text-sm"
                      placeholder="Enter email for confirmation"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-on-surface-variant mb-2 font-bold">Phone Number (Required for Pick-up SMS)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none text-sm"
                      placeholder="+251 9... / Phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-on-surface-variant mb-2 font-bold">Expected Pick-up Date</label>
                  <select
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none text-sm cursor-pointer"
                  >
                    <option value="Today">Today (Within operating hours)</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Within 3 Days">Within 3 Days</option>
                    <option value="This Weekend">This Weekend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase text-on-surface-variant mb-2 font-bold">Special Requests or Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none text-sm"
                    placeholder="E.g., Please test the device display before I arrive..."
                  />
                </div>
              </div>
            </div>

            {/* Physical Store Location Details */}
            <div className="glass-panel rounded-2xl p-6 border border-secondary/30 bg-secondary/5 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-2xl">storefront</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Our Physical Address</h3>
                  <p className="text-sm text-on-surface-variant mb-3">
                    Ahadu Center Hub &amp; Marketplace<br />
                    Bole Road (Next to Friendship HyperMarket), Addis Ababa, Ethiopia
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-secondary">schedule</span>
                      <span>Mon - Sat: 8:30 AM - 8:00 PM</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-secondary">call</span>
                      <span>+251 911 123 456</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: In-Store Payment Info & Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* In-Store Payment Notice (No Online Payment) */}
            <div className="glass-panel rounded-2xl p-6 border border-primary/30 bg-primary/5 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">payments</span>
                In-Store Payment Only
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                You will <strong>NOT</strong> be charged online. Payment is completed in person when you inspect and collect your items at our physical address.
              </p>
              <div className="space-y-2 text-xs text-white bg-background/50 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span>Cash, Telebirr, or CBE Mobile Transfer accepted at store cashier</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span>Free inspection &amp; warranty verification before payment</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
                Reservation Cost Summary
              </h3>
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-on-surface-variant">Estimated Subtotal</span>
                <span className="text-white font-bold">$2,499.00</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10 text-sm">
                <span className="text-on-surface-variant">In-Store Reservation Fee</span>
                <span className="text-primary font-bold">FREE</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-lg font-bold text-white">Amount Payable at Store</span>
                <span className="text-2xl font-extrabold text-secondary">$2,499.00</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-primary text-black font-extrabold rounded-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs"
            >
              Confirm Reservation &amp; Get Pick-Up Code
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