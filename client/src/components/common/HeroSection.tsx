import { ArrowRight, Play, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShaderHero from './ShaderHero';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden bg-dark-bg">
            <div className="absolute inset-0 -z-20 bg-dark-bg" />
            <div className="absolute inset-0 -z-10 opacity-90">
                <ShaderHero />
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-premium" />

            <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
                <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
                    <div className="order-2 flex flex-col justify-center lg:order-1">
                        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-primary animate-pulse-soft">
                            <Sparkles size={14} />
                            Curated for every mood
                        </div>

                        <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                            Discover your
                            <span className="mt-2 block text-primary">
                                next obsession
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-7 text-on-surface-variant sm:text-lg">
                            Explore premium movies, cutting-edge tech, and bestselling books in one beautifully curated destination built for discovery.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={() => navigate('/books')}
                                className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Explore now
                                <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={() => navigate('/movies')}
                                className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <Play size={16} className="fill-current" />
                                Watch picks
                            </button>
                        </div>

                        <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 sm:gap-4">
                            {[
                                { value: '2.5k+', label: 'Curated titles' },
                                { value: '4.9/5', label: 'Reader rating' },
                                { value: '24h', label: 'Fast delivery' },
                            ].map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-white/10 bg-card-surface/70 p-3 shadow-lg shadow-slate-950/20 backdrop-blur-sm animate-fade-up"
                                    style={{ animationDelay: `${index * 120}ms` }}
                                >
                                    <div className="text-xl font-bold text-white sm:text-2xl">{stat.value}</div>
                                    <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-light-gray">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-1 flex items-center justify-center lg:order-2">
                        <div className="relative w-full max-w-[520px]">
                            <div className="floating-card absolute -left-8 top-8 hidden rotate-[-12deg] rounded-2xl border border-white/10 bg-card-surface/80 p-2 shadow-2xl shadow-slate-950/40 backdrop-blur-md sm:block">
                                <div className="w-32 overflow-hidden rounded-xl bg-surface-container">
                                    <img
                                        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"
                                        alt="Movie poster"
                                        className="h-40 w-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-card-surface/60 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.75)] backdrop-blur-xl">
                                <div className="overflow-hidden rounded-[24px]">
                                    <img
                                        src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80"
                                        alt="Premium lifestyle product display"
                                        className="h-[380px] w-full object-cover sm:h-[430px] lg:h-[500px]"
                                    />
                                </div>

                                <div className="absolute bottom-6 left-6 rounded-2xl border border-white/10 bg-dark-bg/80 p-3 backdrop-blur-md">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Star size={14} className="fill-current" />
                                        <span className="text-xs font-medium uppercase tracking-[0.2em]">Featured</span>
                                    </div>
                                    <div className="mt-2 text-lg font-semibold text-white">Tech Picks</div>
                                </div>
                            </div>

                            <div className="floating-card-delay absolute -right-4 bottom-8 rotate-[10deg] rounded-2xl border border-white/10 bg-card-surface/80 p-2 shadow-2xl shadow-slate-950/40 backdrop-blur-md sm:block">
                                <div className="w-28 overflow-hidden rounded-xl bg-surface-container">
                                    <img
                                        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
                                        alt="Book cover"
                                        className="h-36 w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;