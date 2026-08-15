const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest w-full rounded-t-xl border-t border-white/5 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-20 py-12 max-w-7xl mx-auto">
        <div>
          <div className="text-2xl font-bold text-on-surface mb-6">NexusGlobal</div>
          <p className="text-sm text-on-surface-variant">© 2024 NexusGlobal. All rights reserved.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-3">Legal</h4>
          <a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Terms of Service
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-3">Support</h4>
          <a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Help Center
          </a>
          <a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Contact Us
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-white mb-3">Stay Updated</h4>
          <a href="#" className="text-sm text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100">
            Newsletter
          </a>
          <div className="mt-3 flex">
            <input
              className="bg-[#0B0F19] border border-white/10 rounded-l-md px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white w-full"
              placeholder="Email address"
              type="email"
            />
            <button className="btn-primary px-3 rounded-r-md">
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;