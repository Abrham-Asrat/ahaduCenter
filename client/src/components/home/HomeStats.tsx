import { stats } from './homeData';

const HomeStats = () => {
  return (
   <section className="relative z-20 bg-surface-container-lowest px-3 py-4 sm:px-6 md:-mt-4 md:py-6 lg:px-12">
  <div className="mx-auto max-w-7xl rounded-2xl bg-surface-container p-3 shadow-xl sm:p-4 md:p-6 lg:p-8">
    <div className="grid grid-cols-2 gap-2 text-center sm:gap-3 md:grid-cols-4 md:gap-6 lg:gap-8">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="flex min-w-0 flex-col items-center gap-1 rounded-xl bg-surface-container-low p-3 animate-fade-up md:bg-transparent md:p-0"
          style={{ animationDelay: `${index * 70}ms` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl md:hidden">{stat.icon}</span>
            <span className="text-xl font-extrabold leading-tight text-primary sm:text-2xl md:text-[34px]">
              {stat.value}
            </span>
          </div>
          <span className="break-words text-[10px] font-semibold uppercase leading-tight tracking-[0.06em] text-on-surface-variant sm:text-[11px] md:text-sm md:normal-case md:tracking-normal">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>
  );
};

export default HomeStats;
