// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * AdminLayout Component
 * 
 * Shared layout for all admin pages.
 * Includes:
 * - Fixed sidebar (desktop expanded, mobile drawer)
 * - Fixed topbar with search, notifications, dark mode, avatar
 * - Main content area (children prop)
 * 
 * Props:
 * - children: React node to render inside main content
 * - activeNav: which sidebar item is active (optional)
 */
const AdminLayout = ({ children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const location = useLocation();

    // Sidebar navigation items
    const navItems = [
        { label: 'Analytics', icon: 'monitoring', path: '/admin' },
        { label: 'Movies', icon: 'movie', path: '/admin/movies' },
        { label: 'Electronics', icon: 'devices', path: '/admin/electronics' },
        { label: 'Books', icon: 'menu_book', path: '/admin/books' },
        { label: 'Users', icon: 'group', path: '/admin/users' },
    ];

    // Determine active item based on current route
    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-background text-on-surface flex overflow-x-hidden">
            {/* Mobile overlay */}
            {isDrawerOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsDrawerOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`bg-surface-container/80 backdrop-blur-xl h-screen w-64 fixed left-0 top-0 border-r border-white/10 shadow-xl flex flex-col py-6 px-3 z-50 transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:w-64`}
            >
                {/* Brand */}
                <div className="flex items-center gap-3 mb-8 px-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">movie</span>
                    </div>
                    <div>
                        <h1 className="font-heading text-xl font-bold text-primary">Ahadu Center</h1>
                        <p className="text-xs text-on-surface-variant">Admin Terminal</p>
                    </div>
                </div>

                {/* CTA */}
                <button className="w-full bg-primary text-white text-xs uppercase tracking-wider py-2 rounded-lg mb-6 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Generate Report
                </button>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 flex-grow">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive(item.path)
                                    ? 'text-primary font-bold bg-white/5 border-r-2 border-primary'
                                    : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer nav */}
                <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/10">
                    <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-white/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined">settings</span>
                        <span>Settings</span>
                    </Link>
                    <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error/10 transition-all">
                        <span className="material-symbols-outlined">logout</span>
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Content wrapper */}
            <div className="flex-1 md:ml-64">
                {/* Topbar */}
                <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4 md:px-8">
                    {/* Hamburger (mobile) */}
                    <button className="md:hidden text-on-surface-variant hover:text-primary p-2" onClick={() => setIsDrawerOpen(true)}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>

                    {/* Search */}
                    <div className="hidden md:flex items-center gap-3 glass-panel rounded-lg px-3 py-2 w-96">
                        <span className="material-symbols-outlined text-on-surface-variant">search</span>
                        <input
                            type="text"
                            placeholder="Search commands, records..."
                            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="relative text-on-surface-variant hover:text-secondary transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <button className="text-on-surface-variant hover:text-secondary transition-colors">
                            <span className="material-symbols-outlined">dark_mode</span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/10 overflow-hidden">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBllpMvYcE2z2D1Cyki_HMSx3Cqh-ySkXAm6aHOYL6z8mMZoxKcbUe04AlvCZ0cXSaAP7Ox2YRVyHxFdtYB1vZjJLWCx6ShsNkdgajwvt5MtrghP2vSoXSwSe8gd0FI4p1ecvyu7wPb9K_1LdezOYFfuTvzdAfhikjZHek-aQye4phDUcsC5Ysu5TpHeINgVP4isrqZp_4bD0Ssia_Mjo2Yu1drhI3GO2fdCX9wq5fQMBBpYneeEpHeiw"
                                alt="Admin Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;