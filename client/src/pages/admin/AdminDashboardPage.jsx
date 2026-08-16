// src/pages/admin/AdminDashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * AdminDashboardPage Component
 * 
 * Simplified admin dashboard overview page focusing purely on inventory.
 */
const AdminDashboardPage = () => {

  // Stats data
  const stats = [
    { label: 'Total Movies', value: '450', icon: 'movie', color: 'text-primary', glow: 'bg-primary/10' },
    { label: 'Total Electronics', value: '120', icon: 'devices', color: 'text-secondary', glow: 'bg-secondary/10' },
    { label: 'Total Books', value: '890', icon: 'menu_book', color: 'text-tertiary', glow: 'bg-tertiary/10' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Inventory Overview</h2>
            <p className="text-lg text-on-surface-variant">Manage the Ahadu Center physical store catalog.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-white/10 hover:border-primary/50 transition-all shadow-xl">
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-xl ${stat.glow}`} />
              <div className="flex justify-between items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center border border-white/5">
                  <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                </div>
              </div>
              <div className="mt-4 relative z-10">
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-white">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <Link to="/admin/movies" className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-white/10 hover:border-primary hover:bg-primary/5 transition-all shadow-xl cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-primary mb-3">add_circle</span>
              <h3 className="text-xl font-bold text-white">Manage Movies</h3>
              <p className="text-sm text-on-surface-variant mt-2">Add, edit, or remove movies from the catalog.</p>
            </Link>

            <Link to="/admin/electronics" className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-white/10 hover:border-secondary hover:bg-secondary/5 transition-all shadow-xl cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-secondary mb-3">devices</span>
              <h3 className="text-xl font-bold text-white">Manage Electronics</h3>
              <p className="text-sm text-on-surface-variant mt-2">Add, edit, or remove tech products.</p>
            </Link>

            <Link to="/admin/books" className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-white/10 hover:border-tertiary hover:bg-tertiary/5 transition-all shadow-xl cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-tertiary mb-3">menu_book</span>
              <h3 className="text-xl font-bold text-white">Manage Books</h3>
              <p className="text-sm text-on-surface-variant mt-2">Add, edit, or remove books from the library.</p>
            </Link>
        </div>

        {/* Recent Additions Preview */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-white mb-6">Recent Additions</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Movies */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">movie</span>
                Movies
              </h4>
              <ul className="flex flex-col gap-3">
                <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white">Inception</span>
                  <span className="text-on-surface-variant text-xs">Added Today</span>
                </li>
                <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white">Interstellar</span>
                  <span className="text-on-surface-variant text-xs">Added Yesterday</span>
                </li>
              </ul>
            </div>

            {/* Electronics */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary">devices</span>
                Electronics
              </h4>
              <ul className="flex flex-col gap-3">
                <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white">Quantum Laptop X</span>
                  <span className="text-on-surface-variant text-xs">Added Today</span>
                </li>
                <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white">Neural Headset Pro</span>
                  <span className="text-on-surface-variant text-xs">Added 2 days ago</span>
                </li>
              </ul>
            </div>

            {/* Books */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-tertiary">menu_book</span>
                Books
              </h4>
              <ul className="flex flex-col gap-3">
                <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white">The Great Gatsby</span>
                  <span className="text-on-surface-variant text-xs">Added Today</span>
                </li>
                <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white">1984</span>
                  <span className="text-on-surface-variant text-xs">Added 5 days ago</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;