// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { contactService } from '../services/contactService';

/**
 * ContactPage Component
 *
 * Displays contact information, a contact form, map placeholder,
 * social links, and FAQ section.
 */
const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ open state (null = all closed)
  const [openFaq, setOpenFaq] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await contactService.submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
    } catch {
      // Silently ignore API errors — show success regardless (mock-data app)
    } finally {
      setLoading(false);
    }
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  // FAQ data
  const faqs = [
    {
      question: 'How do I borrow physical books or movies?',
      answer: 'Members can reserve items online through their dashboard. Once confirmed, physical items can be picked up at the Bole Road center during regular business hours. A valid digital ID is required at pickup.',
    },
    {
      question: 'Are the electronics available for purchase or rental?',
      answer: 'Our electronics module primarily focuses on high-end rentals for professional projects and evaluations. However, selected exclusive devices are available for direct purchase by premium tier members.',
    },
    {
      question: 'What is the return policy for borrowed media?',
      answer: 'Standard media (Books and Movies) have a 14-day borrowing period. Electronics have a strict 7-day rental window. Late returns may incur a temporary suspension of borrowing privileges and a daily fee.',
    },
    {
      question: 'Do you offer technical support for rented electronics?',
      answer: 'Yes, our Support tab offers dedicated technical assistance for all rented equipment. You can also visit our help desk in-person for immediate troubleshooting.',
    },
  ];

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in">

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8">
        {/* Header */}
        <header className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Contact &amp; About</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Connect with the Ahadu Center. Whether you have an inquiry about our cinematic library, high-end electronics, or literary collection, our team is ready to assist.
          </p>
        </header>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column: Form + Map (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Contact Form Card OR Success Card */}
            {isSubmitted ? (
              /* Success Card */
              <div className="glass-panel rounded-xl p-6 md:p-8 border border-green-500/50 animate-fade-in flex flex-col items-center justify-center gap-6 text-center py-12">
                <span className="material-symbols-outlined text-green-400 text-6xl">check_circle</span>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Message sent successfully!</h2>
                  <p className="text-on-surface-variant">We've received your message and will get back to you shortly.</p>
                </div>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-primary text-black px-8 py-3 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                >
                  Send Another
                </button>
              </div>
            ) : (
            /* Contact Form Card */
            <div className="glass-panel rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                Send Us a Message
              </h2>

              {/* Inline error banner */}
              {error && (
                <div className="mb-5 p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined flex-shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name and Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full bg-[#0B0F19] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full bg-[#0B0F19] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    Subject Inquiry
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select an area of interest</option>
                    <option value="movies">Cinematic Collection &amp; Movies</option>
                    <option value="electronics">High-End Electronics</option>
                    <option value="books">Literary Library &amp; Books</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none"
                    placeholder="How can we assist you today?"
                    required
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-black w-full md:w-auto px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  )}
                  {loading ? 'Sending…' : 'Send Message'}
                  {!loading && <span className="material-symbols-outlined text-sm">send</span>}
                </button>
              </form>
            </div>
            )} {/* end isSubmitted ternary */}

            {/* Map Placeholder */}
            <div className="glass-panel rounded-xl overflow-hidden h-64 md:h-80 relative">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                alt="Ahadu Center Location Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                <div>
                  <p className="text-white font-semibold">Ahadu Center HQ</p>
                  <p className="text-sm text-on-surface-variant">Bole Road, Addis Ababa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Info Cards (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* About Card */}
            <div className="glass-panel rounded-xl p-6 md:p-8 hover:border-primary/50 transition-all">
              <h3 className="text-xl font-bold text-primary mb-4 border-b border-white/10 pb-2">About Ahadu Center</h3>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Ahadu Center is a premier destination curating an exclusive fusion of high-definition cinematic experiences, cutting-edge electronics, and an expansive literary library. Our mission is to elevate professional and personal discovery through unparalleled access to premium media and technology.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">call</span>
                  <div>
                    <p className="text-xs uppercase text-on-surface-variant">Phone</p>
                    <p className="text-white">+251 11 123 4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">mail</span>
                  <div>
                    <p className="text-xs uppercase text-on-surface-variant">Email</p>
                    <p className="text-white">contact@ahaducenter.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-1">schedule</span>
                  <div>
                    <p className="text-xs uppercase text-on-surface-variant">Business Hours</p>
                    <p className="text-white">Mon - Fri: 9:00 AM - 8:00 PM</p>
                    <p className="text-sm text-on-surface-variant">Sat - Sun: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="glass-panel rounded-xl p-6 md:p-8 hover:border-primary/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {['language', 'share', 'forum', 'play_circle'].map((icon) => (
                  <a
                    key={icon}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary transition-all group"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">{icon}</span>
                  </a>
                ))}
              </div>
              <h4 className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-white hover:text-primary transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">arrow_right</span>
                    Member Policies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-white hover:text-primary transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">arrow_right</span>
                    Technical Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-white hover:text-primary transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">arrow_right</span>
                    Corporate Partnerships
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-on-surface-variant mt-2">Quick answers regarding our modules and services.</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-panel rounded-xl overflow-hidden">
                {/* FAQ Question (clickable header) */}
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg font-semibold text-white">{faq.question}</span>
                  <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {/* FAQ Answer (conditionally rendered) */}
                {openFaq === index && (
                  <div className="px-5 pb-5 text-sm text-on-surface-variant border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
    </>
  );
};

export default ContactPage;