import { Link } from 'react-router-dom';
import { featuredItems } from './homeData';

const HomeFeatured = () => {
  return (
    <section className="bg-surface px-6 py-10 md:py-20 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Handpicked</span>
            <h2 className="mt-1 text-[28px] font-extrabold leading-9 tracking-[-0.015em] text-on-surface md:text-4xl">Featured This Week</h2>
            <p className="mt-1 hidden text-base text-on-surface-variant md:block">Hand-picked releases and verified gear trending across Mizan Teferi.</p>
          </div>
          <div className="flex items-center gap-2">
            {['Verified Escrow', 'Telebirr & CBE'].map((tag) => (
              <span key={tag} className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {featuredItems.map((item, index) => (
            <div
              key={item.title}
              className="group flex min-w-0 items-center gap-3 rounded-2xl bg-surface-container-high p-2 shadow-md transition-colors hover:bg-surface-bright md:gap-6 md:p-6 animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-container-lowest md:h-56 md:w-44">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-2 top-2 rounded-full bg-secondary-container px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-on-secondary">
                  {item.type}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-1 md:gap-3">
                <div className="flex min-w-0 flex-col gap-1 md:gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="max-w-[70%] truncate text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-fixed">{item.detail}</span>
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: 'FILL 1' }}>star</span>
                      <span className="text-[11px] font-bold">4.9</span>
                    </div>
                  </div>
                  <h3 className="truncate text-lg font-bold tracking-[-0.015em] text-on-surface transition-colors group-hover:text-primary md:text-[28px]">
                    {item.title}
                  </h3>
                  <p className="truncate text-sm leading-relaxed text-on-surface-variant">{item.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="truncate text-sm font-bold text-primary md:text-lg">{item.price ?? 'Stream Available'}</span>
                  <Link to={item.to} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-bold text-on-primary-container shadow-sm transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:h-auto md:px-5 md:py-2 md:text-sm">
                    {item.type === 'Movie' ? (
                      <>
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: 'FILL 1' }}>play_arrow</span>
                        <span>{item.button}</span>
                      </>
                    ) : item.type === 'Electronics' ? (
                      <>
                        <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                        <span>{item.button}</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">shopping_bag</span>
                        <span>{item.button}</span>
                      </>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2 md:pt-4">
          <Link to="/search" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-surface-container-high px-6 py-3.5 text-base font-bold text-primary transition-all hover:bg-surface-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:w-auto md:rounded-full md:px-10 md:text-lg">
            <span>View All Featured (48+)</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFeatured;
