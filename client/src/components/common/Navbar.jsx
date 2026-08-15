import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container/80 dark:bg-surface-container-low/80 backdrop-blur-xl border-b border-white/10 shadow-xl">
      <div className="flex justify-between items-center px-6 py-2 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="font-heading text-2xl font-bold text-primary">
          AhaduCenter
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/movies" className="text-primary font-bold border-b-2 border-primary pb-1">
            Movies
          </Link>
          <Link to="/electronics" className="text-on-surface-variant hover:text-primary transition-colors duration-300">
            Electronics
          </Link>
          <Link to="/books" className="text-on-surface-variant hover:text-primary transition-colors duration-300">
            Books
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <button className="scale-95 active:scale-90 transition-transform text-on-surface-variant hover:text-primary duration-300 md:hidden">
            <span className="material-symbols-outlined">search</span>
          </button>
          <div className="hidden md:flex gap-2">
            <Link to="/login"><button className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold">
              Sign In
            </button></Link>
            <Link to="/register"><button className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">
              Sign Up
            </button></Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;