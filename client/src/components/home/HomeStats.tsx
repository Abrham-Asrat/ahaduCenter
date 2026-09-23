import { stats } from './homeData';

const HomeStats = () => {
  return (
    <section className="relative z-20 bg-surface-container-lowest px-6 py-4 md:-mt-4 md:py-6 lg:px-12">
      <div className="mx-auto max-w-7xl rounded-2xl bg-surface-container p-4 shadow-xl md:p-6 lg:p-8">
        <div className="grid grid-cols-2 gap-2 text-left md:grid-cols-4 md:gap-6 md:text-center lg:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 rounded-xl bg-surface-container-low p-2 md:flex-col md:gap-1 md:bg-transparent md:p-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl md:hidden">{stat.icon}</span>
                <span className="text-2xl font-extrabold leading-tight text-primary md:text-[34px]">{stat.value}</span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant md:text-sm md:normal-case md:tracking-normal">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
