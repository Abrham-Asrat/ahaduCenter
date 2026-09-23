import { steps } from './homeData';

const HomeProcess = () => {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-surface-container-lowest px-6 py-10 md:py-20 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:gap-14">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Effortless Experience</span>
          <h2 className="text-4xl font-extrabold tracking-[-0.02em] text-on-surface">How It Works</h2>
          <p className="hidden max-w-lg text-base text-on-surface-variant md:block">
            Seamless access to entertainment, literature, and electronics in three simple steps.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          <div className="absolute bottom-8 left-4 top-8 w-0.5 bg-surface-container-highest md:bottom-auto md:left-[18%] md:right-[18%] md:top-10 md:h-0.5 md:w-auto md:border-t-2 md:border-dashed md:border-primary/30" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative z-10 flex items-start gap-4 text-left animate-fade-up md:flex-col md:items-center md:gap-4 md:text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-on-primary-container shadow-lg transition-transform duration-200 group-hover:scale-110 md:h-20 md:w-20 md:bg-surface-container-high md:text-base md:text-primary">
                <span className="hidden absolute -right-1 -top-1 h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-black text-on-primary-container shadow md:flex">
                  {step.number}
                </span>
                <span className="hidden material-symbols-outlined text-3xl text-primary md:block">{step.icon}</span>
              </div>
              <div className="max-w-xs rounded-2xl bg-surface-container p-4 md:bg-transparent md:p-0">
                <div className="mb-1 flex items-center gap-2 text-primary md:justify-center">
                  <span className="material-symbols-outlined text-lg md:hidden">{step.icon}</span>
                  <h3 className="text-lg font-bold text-on-surface md:text-[22px]">{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-on-surface-variant">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeProcess;
