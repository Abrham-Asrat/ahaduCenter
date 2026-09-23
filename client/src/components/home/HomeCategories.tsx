import { Link } from 'react-router-dom';
import { categoryCards } from './homeData';

const HomeCategories = () => {
  return (
    <section className="bg-surface-container-lowest px-6 py-10 md:py-20 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Departments</span>
            <h2 className="mt-1 text-[28px] font-extrabold leading-9 tracking-[-0.015em] text-on-surface md:text-4xl">Curated Collections</h2>
          </div>
          <p className="hidden max-w-md text-base text-on-surface-variant md:block">
            A seamless unification of visual cinema, ancestral and contemporary literature, and vetted consumer technology.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          {categoryCards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group relative flex h-52 flex-col justify-between overflow-hidden rounded-2xl bg-surface-container-high p-4 shadow-lg transition-all duration-300 hover:-translate-y-1.5 md:h-[440px] md:rounded-3xl md:p-8"
            >
              <img
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
                src={card.image}
                alt={card.title}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-md backdrop-blur-md md:h-12 md:w-12 md:rounded-2xl">
                  <span className="material-symbols-outlined text-lg md:text-2xl">{card.icon}</span>
                </div>
                <span className="rounded-full bg-surface-container-lowest/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-secondary">
                  {card.tag}
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="text-lg font-extrabold tracking-[-0.015em] text-on-surface transition-colors group-hover:text-primary md:text-[28px]">
                  {card.title}
                </h3>
                <p className="line-clamp-1 text-sm leading-relaxed text-on-surface-variant">{card.description}</p>
                <div className="flex items-center gap-2 pt-3 text-lg font-semibold text-primary transition-all group-hover:gap-3">
                  <span>Explore</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;
