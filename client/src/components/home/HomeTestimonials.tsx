import { useTranslation } from 'react-i18next';
import { testimonials } from './homeData';

const HomeTestimonials = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-surface px-6 py-10 md:py-20 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <div className="flex flex-col items-start gap-2 text-left md:items-center md:text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">{t('home.testimonials.badge')}</span>
          <h2 className="text-4xl font-extrabold tracking-[-0.02em] text-on-surface">{t('home.testimonials.title')}</h2>
          <p className="hidden max-w-lg text-base text-on-surface-variant md:block">{t('home.testimonials.subtitle')}</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6">
          {testimonials.map((item, index) => (
            <div
              key={item.author}
              className="flex w-[290px] min-w-0 shrink-0 flex-col justify-between gap-6 rounded-2xl bg-surface-container-high p-4 shadow-md transition-all duration-200 hover:-translate-y-1 animate-fade-up md:w-auto md:p-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className="material-symbols-outlined text-base" style={{ fontVariationSettings: 'FILL 1' }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="text-base leading-relaxed text-on-surface italic">“{item.quote}”</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-container-lowest">
                  <img src={item.image} alt={item.author} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-on-surface">{item.author}</span>
                  <span className="text-xs font-medium text-on-surface-variant">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
