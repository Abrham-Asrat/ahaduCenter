const HomeNewsletter = () => {
  return (
    <section className="bg-surface-container-lowest px-6 py-10 md:py-20 lg:px-12">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-primary/70 p-6 text-left shadow-2xl md:p-14 md:text-center">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-on-surface/10 blur-xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-surface-container-lowest/15 blur-xl" />

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-start gap-2 md:items-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-primary-container">Weekly Dispatches</span>
          <h2 className="text-4xl font-black tracking-tight text-surface-container-lowest">Never Miss a Drop</h2>
          <p className="text-sm text-on-primary-container md:text-lg">
            Get weekly updates on new cinema releases, rare book arrivals, and exclusive gadget discounts across Mizan Teferi.
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-6 w-full max-w-md">
          <form className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-lowest/15 p-1.5 backdrop-blur-md md:rounded-full sm:flex-row">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              className="w-full rounded-full bg-surface-container-lowest px-5 py-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
            />
            <button type="submit" className="w-full rounded-full bg-surface-container-lowest px-7 py-3 text-lg font-bold text-on-surface shadow-lg transition-all hover:bg-surface-container-high sm:w-auto">
              Subscribe
            </button>
          </form>
          <span className="mt-3 inline-block text-xs font-medium text-on-primary-container/80">
            No spam. Unsubscribe at any time. We respect your inbox.
          </span>
        </div>
      </div>
    </section>
  );
};

export default HomeNewsletter;
