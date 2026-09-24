import { ArrowRight, MonitorSmartphone, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const collectionCards = [
    {
        title: 'Cinematic Masterpieces',
        subtitle: 'Award-winning stories and cult classics',
        href: '/movies',
        image:
            "url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80')",
        className: 'md:col-span-2 md:row-span-2 min-h-[360px] md:min-h-[440px]',
        badge: 'New arrivals',
    },
    {
        title: 'Next-gen tech',
        subtitle: 'Upgrade your setup',
        href: '/electronics',
        image:
            "url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80')",
        className: 'min-h-[220px] md:min-h-[260px]',
        badge: 'Trending',
    },
    {
        title: 'Bestsellers',
        subtitle: 'Stories that stay with you',
        href: '/books',
        image:
            "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=80')",
        className: 'min-h-[220px] md:min-h-[260px]',
        badge: 'Editor choice',
    },
];

const features = [
    {
        title: 'Curated quality',
        description: 'Every title is selected for quality, style, and long-term value.',
        icon: Sparkles,
    },
    {
        title: 'Seamless discovery',
        description: 'Browse movies, books, and devices without friction or clutter.',
        icon: MonitorSmartphone,
    },
    {
        title: 'Smart recommendations',
        description: 'Explore collections built around your interests and habits.',
        icon: TrendingUp,
    },
    {
        title: 'Trust & comfort',
        description: 'A polished shopping journey with secure, dependable service.',
        icon: ShieldCheck,
    },
];

const BentoGrid = () => {
    return (
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-20 lg:pb-24">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">Explore</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                        Curated collections
                    </h2>
                </div>
                <p className="max-w-xl text-sm text-on-surface-variant sm:text-base">
                    Browse our hand-selected favorites across entertainment, technology, and stories.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {collectionCards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.href}
                        className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-card-surface/60 shadow-[0_20px_55px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1 ${card.className}`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: card.image }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/50 to-transparent" />
                        <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
                            <span className="mb-3 inline-flex w-fit rounded-full border border-white/10 bg-dark-bg/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-primary">
                                {card.badge}
                            </span>
                            <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                            <p className="mt-2 max-w-xs text-sm text-on-surface-variant">{card.subtitle}</p>
                        </div>
                    </Link>
                ))}

                <Link
                    to="/register"
                    className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[28px] border border-primary/20 bg-gradient-premium p-6 shadow-[0_20px_55px_rgba(16,185,129,0.12)] transition-transform duration-300 hover:-translate-y-1 md:col-span-2 xl:col-span-1"
                >
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Community</p>
                        <h3 className="mt-4 text-2xl font-semibold text-white">Join the Community</h3>
                    </div>
                    <p className="mt-4 max-w-sm text-sm text-on-surface-variant">
                        Get early access to exclusive drops, member pricing, and standout picks.
                    </p>
                    <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                        Get started
                        <ArrowRight size={16} />
                    </div>
                </Link>
            </div>

            <div className="mt-14">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">Why us</p>
                        <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
                            Designed for modern discovery
                        </h3>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {features.map(({ title, description, icon: Icon }, index) => (
                        <div
                            key={title}
                            className="group rounded-[24px] border border-white/10 bg-card-surface/50 p-5 backdrop-blur-sm shadow-[0_20px_40px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 animate-fade-up"
                            style={{ animationDelay: `${index * 120}ms` }}
                        >
                            <div className="mb-4 inline-flex rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary transition-transform duration-300 group-hover:scale-110">
                                <Icon size={22} />
                            </div>
                            <h4 className="text-xl font-semibold text-white">{title}</h4>
                            <p className="mt-3 text-sm leading-6 text-on-surface-variant">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
