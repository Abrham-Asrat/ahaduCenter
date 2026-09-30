import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ShaderHero from './ShaderHero';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden px-4 py-16 lg:px-20">
      <ShaderHero />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-6">
        <h1 className="max-w-2xl text-4xl font-bold text-white sm:text-5xl">
          {t('common.heroSection.title')}
        </h1>
        <p className="max-w-xl text-lg text-on-surface-variant">
          {t('common.heroSection.subtitle')}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="rounded-full bg-primary px-6 py-3 font-bold text-on-primary-container"
          >
            {t('common.heroSection.exploreNow')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/electronics')}
            className="rounded-full border border-secondary px-6 py-3 font-bold text-secondary"
          >
            {t('common.heroSection.latestArrivals')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
