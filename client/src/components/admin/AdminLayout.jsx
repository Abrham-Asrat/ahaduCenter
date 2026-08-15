// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * AdminLayout Component
 * 
 * Shared layout for all admin pages.
 * Features:
 * - Fixed sidebar (desktop expanded, mobile drawer)
 * - Fixed topbar with search, notifications, dark mode, avatar
 * - Full navigation links to all 10 admin management modules
 */
const AdminLayout = ({ children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const location = useLocation();

    // Sidebar navigation items
    const navItems = [
        { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
        { label: 'Movies', icon: 'movie', path: '/admin/movies' },
        { label: 'Electronics', icon: 'devices', path: '/admin/electronics' },
        { label: 'Books', icon: 'menu_book', path: '/admin/books' },
    ];

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
                className={`bg-surface-container/90 backdrop-blur-xl h-screen w-64 fixed left-0 top-0 border-r border-white/10 shadow-2xl flex flex-col py-6 px-3 z-50 transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:w-64`}
            >
                {/* Brand */}
                <div className="flex items-center gap-3 mb-6 px-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg font-black">
                        <span className="material-symbols-outlined text-black">storefront</span>
                    </div>
                    <div>
                        <h1 className="font-heading text-lg font-bold text-white leading-tight">Ahadu Center</h1>
                        <p className="text-xs text-primary font-semibold">Admin Terminal</p>
                    </div>
                </div>


                {/* Navigation */}
                <nav className="flex flex-col gap-1 flex-grow overflow-y-auto no-scrollbar pr-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setIsDrawerOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-xs uppercase tracking-wider font-bold ${isActive(item.path)
                                    ? 'text-primary bg-primary/10 border-l-4 border-primary shadow-sm'
                                    : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer nav */}
                <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/10">

                    <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 transition-all text-xs uppercase tracking-wider font-bold">
                        <span className="material-symbols-outlined text-lg">logout</span>
                        <span>Exit Admin</span>
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
                    <div className="hidden md:flex items-center gap-3 glass-panel rounded-xl px-3 py-2 w-96 border border-white/10">
                        <span className="material-symbols-outlined text-on-surface-variant text-base">search</span>
                        <input
                            type="text"
                            placeholder="Search admin records, commands..."
                            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            System Active
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-surface-container-high border border-white/10 flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-primary/20 to-secondary/20">
                            AD
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