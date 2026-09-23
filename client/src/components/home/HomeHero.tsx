import { Link } from 'react-router-dom';

const HomeHero = () => {
  return (
    <section className="relative overflow-hidden bg-surface-container-lowest">
      <div className="flex flex-col items-center px-6 pb-8 py-4 text-center md:hidden">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-surface-container-high px-4 text-[12px] font-semibold text-primary shadow-sm">
          <span>🇪🇹</span>
          <span>From Mizan Teferi with Love</span>
        </div>
        <h1 className="mb-3 max-w-[340px] text-[36px] font-extrabold leading-[44px] tracking-[-0.02em] text-on-surface">
          Movies. Books. Electronics.{' '}
          <span className="bg-gradient-to-r from-primary via-primary-fixed to-secondary bg-clip-text text-transparent">All in One Place.</span>
        </h1>
        <p className="mb-6 max-w-[320px] text-base leading-6 text-on-surface-variant">Discover, borrow, and shop from the heart of Mizan Teferi.</p>
        <div className="mb-8 flex w-full flex-col gap-2">
          <Link to="/movies" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold text-on-primary-container shadow-[0_8px_24px_rgba(245,158,11,0.28)] active:scale-[0.98]">
            <span>Explore Catalog</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </Link>
          <Link to="/register" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-surface-container-highest px-6 text-base font-semibold text-on-surface transition-colors hover:bg-surface-bright active:scale-[0.98]">
            <span>Sign Up Free</span>
            <span className="material-symbols-outlined text-lg">person_add</span>
          </Link>
        </div>
        <div className="w-full max-w-[350px] rounded-2xl bg-surface-container-high p-4 text-left shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6)]">
          <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Top Spotlight Curations</span>
            </div>
            <span className="rounded-full bg-surface-container px-2 py-0.5 text-[11px] font-bold text-primary">Addis Hub</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { title: 'Gondar Epic', type: 'Film', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80', icon: 'movie', color: 'bg-primary text-on-primary' },
              { title: 'Lore & Tales', type: 'Literature', image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=500&q=80', icon: 'menu_book', color: 'bg-tertiary-container text-on-tertiary-container' },
              { title: 'Zenith Pro', type: 'Audio', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80', icon: 'headphones', color: 'bg-secondary-container text-on-secondary-container' },
            ].map((item) => (
              <div key={item.title} className="flex min-w-0 flex-col items-center rounded-xl bg-surface-container-lowest p-2 text-center">
                <div className="relative mb-1.5 aspect-[2/3] w-full overflow-hidden rounded-lg">
                  <img className="h-full w-full object-cover" src={item.image} alt={item.title} />
                  <span className={`absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full ${item.color}`}><span className="material-symbols-outlined text-[13px]">{item.icon}</span></span>
                </div>
                <span className="w-full truncate text-[11px] font-bold text-on-surface">{item.title}</span>
                <span className="text-[11px] font-semibold text-primary">{item.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative hidden min-h-[calc(100vh-80px)] items-center px-6 pb-20 md:flex lg:px-12 lg:pb-28">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-32 right-10 h-[540px] w-[540px] rounded-full bg-secondary/10 blur-[130px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffc174_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="z-10 flex flex-col items-start gap-4 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-high/70 px-3.5 py-1.5 backdrop-blur-md shadow-sm">
              <span className="text-sm">🇪🇹</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary">From the Heart of Mizan Teferi</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-on-surface sm:text-5xl lg:text-[56px] lg:leading-[64px] lg:tracking-[-0.03em]">
              Movies. Books. Electronics. <br />
              <span className="bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
                All in One Place.
              </span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant lg:text-[18px] lg:leading-[28px]">
              Discover, borrow, and shop — from the heart of Mizan Teferi. An authentic cultural sanctuary where indigenous storytelling harmonizes with world-class gear.
            </p>

            <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
              <Link to="/movies" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-lg font-bold text-on-primary-container shadow-[0_12px_36px_-8px_rgba(245,158,11,0.4)] transition-all duration-200 hover:scale-[1.02]">
                <span>Explore Catalog</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-container-high px-8 py-3.5 text-lg font-semibold text-tertiary-fixed shadow-sm transition-all duration-200 hover:bg-surface-bright">
                <span>Sign Up Free</span>
                <span className="material-symbols-outlined text-lg">person_add</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5 overflow-hidden">
                {['ቲ', 'ዳ', 'አ'].map((letter, index) => (
                  <div
                    key={letter}
                    className={`flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-surface-container-lowest text-[11px] font-bold ${index === 0
                      ? 'bg-surface-container-high text-primary'
                      : index === 1
                        ? 'bg-secondary-container text-on-secondary'
                        : 'bg-primary text-on-primary-container'
                      }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: 'FILL 1' }}>
                      star
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium text-on-surface-variant">
                  4.9/5 from 3,200+ members in Bole, Piassa & Kazanchis
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex h-[520px] items-center justify-center lg:col-span-5">
            <div className="absolute inset-x-8 inset-y-12 -rotate-3 rounded-3xl bg-gradient-to-tr from-primary/20 to-secondary/15 blur-2xl" />

            <div className="absolute right-4 top-0 z-10 w-64 rotate-6 overflow-hidden rounded-2xl bg-surface-container-high p-3 shadow-2xl transition-all duration-300 hover:rotate-2 hover:scale-105 sm:right-12">
              <div className="relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-xl bg-surface-container-lowest p-4">
                <img
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80"
                  alt="Cinematic poster"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
                      4K Premiere
                    </span>
                    <span className="flex items-center gap-1 text-xs text-secondary-fixed">
                      <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: 'FILL 1' }}>
                        star
                      </span>
                      9.4
                    </span>
                  </div>
                  <span className="text-lg font-bold text-on-surface">Echoes of Entoto</span>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">Cinema • 2h 08m</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-2 left-0 z-20 w-72 -rotate-6 rounded-2xl bg-surface-container-high p-4 shadow-2xl transition-all duration-300 hover:-rotate-0 hover:scale-105 sm:left-4">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-container-lowest">
                  <img
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"
                    alt="Headphones"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-secondary-fixed-dim" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-secondary-fixed">In Stock • Addis Escrow</span>
                  </div>
                  <span className="block truncate text-lg font-bold text-on-surface">Zenith Pro Studio ANC</span>
                  <span className="font-bold text-primary">ETB 14,800</span>
                </div>
              </div>
            </div>

            <div className="relative z-30 w-72 rounded-2xl bg-surface-container-highest p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-[1.03]">
              <div className="relative flex h-[360px] flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-5">
                <img
                  className="absolute inset-0 h-full w-full object-cover opacity-60"
                  src="https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=1200&q=80"
                  alt="Rare book"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/80 via-transparent to-surface-container-lowest/95" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="rounded-full bg-tertiary/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-tertiary-fixed">
                    Archival Relic
                  </span>
                  <span className="material-symbols-outlined text-xl text-primary">bookmark</span>
                </div>
                <div className="relative z-10 flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Ancient Wisdom Series</span>
                  <h3 className="text-xl font-black text-on-surface">Fetha Nagast</h3>
                  <p className="text-sm text-on-surface-variant">
                    The Law of Kings. Collector bilingual Ge'ez & English annotated translation.
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-primary">ETB 2,650</span>
                    <span className="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface">
                      Borrow or Buy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
