// src/pages/ContactPage.jsx
import { useState, type ChangeEvent, type FormEvent } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { contactService } from '../services/contactService';
import { useTranslation } from 'react-i18next';

/**
 * ContactPage Component
 *
 * Displays contact information, a contact form, map placeholder,
 * social links, and FAQ section.
 */
const ContactPage = () => {
  const { t } = useTranslation();
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ open state (null = all closed)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      setError(t('contact.errorMessage'));
      return;
    } finally {
      setLoading(false);
    }
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  // FAQ data
  const faqs = [
    {
      question: t('contact.faq1Question'),
      answer: t('contact.faq1Answer'),
    },
    {
      question: t('contact.faq2Question'),
      answer: t('contact.faq2Answer'),
    },
    {
      question: t('contact.faq3Question'),
      answer: t('contact.faq3Answer'),
    },
    {
      question: t('contact.faq4Question'),
      answer: t('contact.faq4Answer'),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in px-4 py-4">

        <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8 py-4">
          {/* Header */}

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
                    <h2 className="text-2xl font-bold text-white mb-2">{t('contact.successMessage')}</h2>
                    <p className="text-on-surface-variant">{t('contact.successHint')}</p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-primary text-black px-8 py-3 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                  >
                    {t('contact.sendAnother')}
                  </button>
                </div>
              ) : (
                /* Contact Form Card */
                <div className="glass-panel rounded-xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">mail</span>
                    {t('contact.sendUsMessage')}
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
                          {t('contact.fullName')}
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="w-full bg-[#0B0F19] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                          placeholder={t('contact.namePlaceholder')}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                          {t('contact.emailAddress')}
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="w-full bg-[#0B0F19] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                          placeholder={t('contact.emailPlaceholder')}
                          required
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                        {t('contact.subjectInquiry')}
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
                        <option value="" disabled>{t('contact.subjectPlaceholder')}</option>
                        <option value="movies">{t('contact.subjectMovies')}</option>
                        <option value="electronics">{t('contact.subjectElectronics')}</option>
                        <option value="books">{t('contact.subjectBooks')}</option>
                        <option value="general">{t('contact.subjectGeneral')}</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                        {t('contact.yourMessage')}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="w-full bg-[#0B0F19] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none"
                        placeholder={t('contact.messagePlaceholder')}
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
                      {loading ? t('contact.sending') : t('contact.sendMessage')}
                      {!loading && <span className="material-symbols-outlined text-sm">send</span>}
                    </button>
                  </form>
                </div>
              )} {/* end isSubmitted ternary */}

              {/* Map Placeholder */}
              <div className="glass-panel rounded-xl overflow-hidden h-64 md:h-80 relative">
                <iframe
                  title="Ahadu Center location map"
                  src="https://www.google.com/maps?q=6.9946333,35.590952&z=16&t=k&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 rounded-lg flex flex-wrap items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold">{t('contact.locationName')}</p>
                    <p className="text-sm text-on-surface-variant">{t('contact.locationAddress')}</p>
                  </div>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=6.9946333,35.590952"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                  >
                    <span className="material-symbols-outlined text-base">directions</span>
                    {t('contact.directions')}
                  </a>
                </div>
              </div>
            </div>

            {/* Right column: Info Cards (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* About Card */}
              <div className="glass-panel rounded-xl p-6 md:p-8 hover:border-primary/50 transition-all">
                <h3 className="text-xl font-bold text-primary mb-4 border-b border-white/10 pb-2">{t('contact.about')}</h3>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                  {t('contact.aboutDescription')}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary mt-1">call</span>
                    <div>
                      <p className="text-xs uppercase text-on-surface-variant">{t('contact.phone')}</p>
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
                      <p className="text-xs uppercase text-on-surface-variant">{t('contact.businessHours')}</p>
                      <p className="text-white">{t('contact.weekdayHours')}</p>
                      <p className="text-sm text-on-surface-variant">{t('contact.weekendHours')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="glass-panel rounded-xl p-6 md:p-8 hover:border-primary/50 transition-all">
                <h3 className="text-xl font-bold text-white mb-4">{t('contact.connectWithUs')}</h3>
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