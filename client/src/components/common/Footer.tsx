import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-20 w-full overflow-hidden border-t border-white/5 bg-dark-bg pb-8 pt-14 text-white sm:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.12)_1px,transparent_1px)] bg-[length:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(16,185,129,0.1),rgba(212,175,55,0.03)_35%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-primary via-secondary to-primary shadow-[0_0_16px_rgba(16,185,129,0.4)]" />

      <div className="relative mx-auto px-4 sm:px-8 ">
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 pb-12 md:grid-cols-3 md:gap-x-8 xl:grid-cols-5 xl:gap-8 xl:pb-14">
          <div className="footer-reveal col-span-2 flex min-w-0 flex-col justify-between b gap-8 sm:col-span-1 xl:pr-4" style={{ '--footer-delay': '100ms' } as CSSProperties}>
            <div>
              <Link to="/" aria-label="Ahadu Center home" className="mb-4 inline-flex items-center gap-2 ">
                <span className="flex h-8 w-8 items-center bg-secondarjustify-center rounded-lg bg-gradient-to-br from-primary to-secondary p-px shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  <span className="flex h-full w-full items-center justify-center rounded-[7px] bg-card-surface font-heading text-xs font-black text-white">AC</span>
                </span>
                <span className="bg-gradient-to-r from-primary via-emerald-300 to-secondary bg-clip-text font-heading text-2xl font-bold text-transparent">Ahadu Center</span>
              </Link>
              <p className="mb-5 max-w-xs text-sm font-light leading-relaxed text-light-gray text-center">
                Your gateway to movies, tech, and books, all in one place.
              </p>
              <p className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-light-gray">
                <span aria-hidden="true">ET</span>
                <span>Rooted in Mizan Teferi, built for the world</span>
              </p>
            </div>

          </div>

          <div className="footer-reveal min-w-0" style={{ '--footer-delay': '150ms' } as CSSProperties}>
            <h3 className="mb-5 font-heading text-xs font-bold uppercase tracking-wider text-secondary">Quick links</h3>
            <ul className="space-y-3.5">
              <li><Link to="/" className="footer-link text-sm text-light-gray hover:text-primary">Home <span className="material-symbols-outlined ml-1 text-sm text-primary opacity-0 transition-all group-hover:opacity-100" aria-hidden="true">arrow_forward</span></Link></li>
              <li><Link to="/movies" className="footer-link text-sm text-light-gray hover:text-primary">Movies</Link></li>
              <li><Link to="/books" className="footer-link text-sm text-light-gray hover:text-primary">Books</Link></li>
              <li><Link to="/electronics" className="footer-link text-sm text-light-gray hover:text-primary">Electronics</Link></li>
              <li><Link to="/wishlist" className="footer-link text-sm text-light-gray hover:text-primary">Wishlist</Link></li>
            </ul>
          </div>

          <div className="footer-reveal min-w-0" style={{ '--footer-delay': '200ms' } as CSSProperties}>
            <h3 className="mb-5 font-heading text-xs font-bold uppercase tracking-wider text-secondary">Support</h3>
            <ul className="space-y-3.5">
              <li><Link to="/contact" className="footer-link text-sm text-light-gray hover:text-primary">Help Center</Link></li>
              <li><Link to="/contact" className="footer-link text-sm text-light-gray hover:text-primary">Contact Us</Link></li>
            </ul>
            
          </div>
          <div className="footer-reveal min-w-0" style={{ '--footer-delay': '20ms' } as CSSProperties}>
           
            <h3 className="mb-5 font-heading text-xs font-bold uppercase tracking-wider text-secondary">Company</h3>
            <ul className="space-y-3.5">
              <li><Link to="/contact" className="footer-link text-sm text-light-gray hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="footer-link text-sm text-light-gray hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/contact" className="footer-link text-sm text-light-gray hover:text-primary">Terms of Service</Link></li>
              <li>
                <a href="https://github.com/Abrham-Asrat/ahaduCenter/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="footer-link text-sm text-light-gray hover:text-primary">
                  MIT License
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-reveal min-w-0" style={{ '--footer-delay': '300ms' } as CSSProperties}>
            <h3 className="mb-5 font-heading text-xs font-bold uppercase tracking-wider text-secondary">Stay connected</h3>
            <Link to="/contact" className="mb-6 inline-flex items-center gap-2.5 text-xs text-light-gray transition-colors hover:text-white">
              <span className="material-symbols-outlined text-base text-primary" aria-hidden="true">location_on</span>
              Mizan, Ethiopia
            </Link>


          </div>
        </div>

        <div className="w-full border-t border-white/[0.08]" />
        <p className="fon text-white/50 text-end">&copy; 2026 Ahadu Center. All rights reserved.</p>

      </div>
    </footer>
  );
};

export default Footer;