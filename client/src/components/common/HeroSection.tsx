import { useNavigate } from 'react-router-dom';
import ShaderHero from './ShaderHero';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-4 py-16 lg:px-20">
      <ShaderHero />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-6">
        <h1 className="max-w-2xl text-4xl font-bold text-white sm:text-5xl">
          Movies, books, and electronics in one place.
        </h1>
        <p className="max-w-xl text-lg text-on-surface-variant">
          Discover something new, find a story to borrow, or upgrade your everyday essentials.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="rounded-full bg-primary px-6 py-3 font-bold text-on-primary-container"
          >
            Explore Now
          </button>
          <button
            type="button"
            onClick={() => navigate('/electronics')}
            className="rounded-full border border-secondary px-6 py-3 font-bold text-secondary"
          >
            Latest Arrivals
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
