import { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleSend = () => {
    setNewsletterSent(true);
  };

  return (
    <footer className="relative overflow-hidden bg-surface-container-lowest dark:bg-surface-container-lowest w-full rounded-t-xl border-t border-white/5 mt-20 mb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 px-4 sm:px-8 lg:px-20 py-12 sm:py-14 lg:py-16 max-w-7xl mx-auto">
        <div className="footer-reveal sm:col-span-2 lg:col-span-1">
          <div className="text-2xl font-bold text-on-surface mb-4 transition-colors duration-300 hover:text-primary">Ahadu Center</div>
          <p className="max-w-xs text-sm leading-6 text-on-surface-variant">© 2024 Ahadu Center. All rights reserved.</p>
        </div>
        <div className="footer-reveal flex flex-col gap-2" style={{ '--footer-delay': '100ms' }}>
          <h4 className="font-bold text-white mb-3">Legal</h4>
          <Link to="/contact" className="footer-link text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Privacy Policy
          </Link>
          <Link to="/contact" className="footer-link text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Terms of Service
          </Link>
        </div>
        <div className="footer-reveal flex flex-col gap-2" style={{ '--footer-delay': '200ms' }}>
          <h4 className="font-bold text-white mb-3">Support</h4>
          <Link to="/contact" className="footer-link text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Help Center
          </Link>
          <Link to="/contact" className="footer-link text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Contact Us
          </Link>
        </div>
        <div className="footer-reveal flex flex-col gap-2" style={{ '--footer-delay': '300ms' }}>
          <h4 className="font-bold text-white mb-3">Stay Updated</h4>
          <a href="#newsletter" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Newsletter
          </a>
          {newsletterSent ? (
            <p className="mt-3 text-sm text-green-400 font-medium animate-fade-in" role="status">
              Thanks for subscribing!
            </p>
          ) : (
            <div id="newsletter" className="mt-3 flex w-full max-w-sm">
              <input
                aria-label="Email address"
                className="min-w-0 flex-1 bg-[#0B0F19] border border-white/10 rounded-l-md px-3 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white"
                placeholder="Email address"
                type="email"
              />
              <button aria-label="Subscribe to newsletter" className="btn-primary min-w-12 rounded-r-md px-3" onClick={handleSend}>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
