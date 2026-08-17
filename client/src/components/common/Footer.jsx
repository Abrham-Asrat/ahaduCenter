import { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleSend = () => {
    setNewsletterSent(true);
  };

  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest w-full rounded-t-xl border-t border-white/5 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 sm:px-8 lg:px-20 py-12 max-w-7xl mx-auto">
        <div>
          <div className="text-2xl font-bold text-on-surface mb-6">Ahadu Center</div>
          <p className="text-sm text-on-surface-variant">© 2024 Ahadu Center. All rights reserved.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-3">Legal</h4>
          <Link to="/contact" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Privacy Policy
          </Link>
          <Link to="/contact" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Terms of Service
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-3">Support</h4>
          <Link to="/contact" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Help Center
          </Link>
          <Link to="/contact" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Contact Us
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-3">Stay Updated</h4>
          <a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Newsletter
          </a>
          {newsletterSent ? (
            <p className="mt-3 text-sm text-green-400 font-medium">
              Thanks for subscribing!
            </p>
          ) : (
            <div className="mt-3 flex">
              <input
                className="bg-[#0B0F19] border border-white/10 rounded-l-md px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white w-full"
                placeholder="Email address"
                type="email"
              />
              <button className="btn-primary px-3 rounded-r-md" onClick={handleSend}>
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
