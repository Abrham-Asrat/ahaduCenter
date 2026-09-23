import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const collectionCards = [
    {
        title: 'Cinematic picks',
        subtitle: 'Award-winning stories and cult classics',
        href: '/movies',
        image:
            "url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80')",
        className: 'md:col-span-2 md:row-span-2 min-h-[360px] md:min-h-[440px]',
        badge: 'New arrivals',
    },
    {
        title: 'Smart tech',
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

const BentoGrid = () => {
    return (
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-20">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-emerald-300">Explore</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                        Curated collections
                    </h2>
                </div>
                <p className="max-w-xl text-sm text-slate-300 sm:text-base">
                    Browse our hand-selected favorites across entertainment, technology, and stories.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {collectionCards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.href}
                        className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 shadow-[0_20px_55px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1 ${card.className}`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: card.image }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/50 to-transparent" />
                        <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
                            <span className="mb-3 inline-flex w-fit rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-emerald-200">
                                {card.badge}
                            </span>
                            <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                            <p className="mt-2 max-w-xs text-sm text-slate-200/90">{card.subtitle}</p>
                        </div>
                    </Link>
                ))}

                <Link
                    to="/register"
                    className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[28px] border border-emerald-400/20 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),transparent_35%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(6,14,24,1))] p-6 shadow-[0_20px_55px_rgba(16,185,129,0.12)] transition-transform duration-300 hover:-translate-y-1 md:col-span-2 xl:col-span-1"
                >
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">Community</p>
                        <h3 className="mt-4 text-2xl font-semibold text-white">Join the club</h3>
                    </div>
                    <p className="mt-4 max-w-sm text-sm text-slate-300">
                        Get early access to exclusive drops, member pricing, and standout picks.
                    </p>
                    <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
                        Get started
                        <ArrowRight size={16} />
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default BentoGrid;
