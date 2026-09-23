import { Link } from 'react-router-dom';
import { navItems } from './homeData';

const HomeHeader = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-surface/85 shadow-[0_1px_12px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 lg:px-12">
        <div className="flex items-center gap-6">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/80 to-secondary shadow-[0_0_24px_rgba(245,158,11,0.28)]">
              <span className="text-lg font-black text-surface-container-lowest">አ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-on-surface">
                Ahadu<span className="text-primary">Center</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                <span>🇪🇹</span> Mizan Teferi
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-surface-container-lowest/60 p-1 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant transition-all duration-200 hover:bg-surface-container hover:text-on-surface"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden flex-1 max-w-md items-center px-4 md:flex">
          <div className="flex w-full items-center rounded-full bg-surface-container-low px-4 py-2 shadow-inner transition-all duration-200 focus-within:bg-surface-container">
            <span className="material-symbols-outlined mr-2 text-[20px] text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search movies, books, gear..."
              className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
            />
            <button
              type="button"
              className="mr-2 rounded-full bg-surface-container-high px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-fixed"
            >
              All
            </button>
            <div className="flex items-center gap-1 rounded bg-surface-container-highest px-1.5 py-1 text-[10px] font-bold text-on-surface-variant">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" aria-label="Wishlist" className="relative flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-all duration-200 hover:bg-surface-container hover:text-on-surface">
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container text-[9px] font-bold text-on-secondary">
              3
            </span>
          </button>
          <button type="button" aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-all duration-200 hover:bg-surface-container hover:text-on-surface">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <div className="hidden h-6 w-px bg-surface-container-highest sm:block" />
          <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant transition-all duration-200 hover:bg-surface-container-low hover:text-on-surface sm:inline-flex">
            Sign In
          </Link>
          <Link to="/register" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary-container shadow-[0_8px_24px_rgba(245,158,11,0.25)] transition-all duration-200 hover:bg-surface-tint">
            Sign Up
          </Link>
          <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="material-symbols-outlined text-[18px] text-on-primary">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
