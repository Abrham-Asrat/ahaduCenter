// src/pages/admin/AdminDashboardPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * AdminDashboardPage Component
 * 
 * Main admin dashboard overview page.
 * 
 * Features:
 * - Fixed sidebar navigation (desktop: expanded, mobile: slide-in drawer)
 * - Topbar with search, notifications, dark mode toggle, avatar
 * - Stats cards (Revenue, Visitors, Orders, Borrowed Books)
 * - Charts (Revenue over time, Visitor traffic)
 * - Recent transactions table
 * - Popular items (Top Movies, Top Electronics)
 * 
 * Responsive:
 * - Desktop: Sidebar expanded (64px icons only on tablet via CSS)
 * - Mobile: Sidebar hidden, hamburger opens drawer
 * - Charts stack, tables become scrollable
 */
const AdminDashboardPage = () => {
  // State for mobile drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Toggle drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Navigation items
  const navItems = [
    { label: 'Analytics', icon: 'monitoring', active: true },
    { label: 'Movies', icon: 'movie' },
    { label: 'Electronics', icon: 'devices' },
    { label: 'Books', icon: 'menu_book' },
    { label: 'Users', icon: 'group' },
  ];

  // Stats data
  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+12%', icon: 'attach_money', color: 'text-primary', glow: 'bg-primary/10' },
    { label: 'Visitors', value: '45.2k', change: '+5%', icon: 'group', color: 'text-secondary', glow: 'bg-secondary/10' },
    { label: 'Orders', value: '892', change: '+8%', icon: 'shopping_cart', color: 'text-tertiary', glow: 'bg-tertiary/10' },
    { label: 'Borrowed Books', value: '340', change: '+15%', icon: 'menu_book', color: 'text-tertiary', glow: 'bg-tertiary/10' },
  ];

  // Recent transactions
  const transactions = [
    { id: '#TRX-8921', user: 'Elena Rostova', category: 'Electronics', amount: '$1,299.00', status: 'Completed', statusColor: 'bg-primary/15 text-primary border-primary/30' },
    { id: '#TRX-8922', user: 'Marcus Chen', category: 'Books', amount: 'The Glass Hotel', status: 'Active', statusColor: 'bg-secondary/15 text-secondary border-secondary/30' },
    { id: '#TRX-8923', user: 'Sarah Jenkins', category: 'Movies', amount: 'Dune: Part Two', status: 'Pending', statusColor: 'bg-surface-bright text-on-surface-variant border-white/10' },
  ];

  // Popular items
  const topMovies = [
    { name: 'Interstellar', count: '1.2k' },
    { name: 'Inception', count: '980' },
  ];
  const topElectronics = [
    { name: 'Quantum Laptop', count: '450' },
    { name: 'Neural Headset', count: '310' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex overflow-x-hidden">
      {/* Mobile overlay for drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleDrawer}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-surface-container/80 backdrop-blur-xl h-screen w-64 fixed left-0 top-0 border-r border-white/10 shadow-xl flex flex-col py-6 px-3 z-50 transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:w-64 lg:w-64`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 px-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-white">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-primary">Ahadu Center</h1>
            <p className="text-xs text-on-surface-variant">Admin Terminal</p>
          </div>
        </div>

        {/* Generate Report CTA */}
        <button className="w-full bg-primary text-white text-xs uppercase tracking-wider py-2 rounded-lg mb-6 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Generate Report
        </button>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to="#"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${item.active
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

      {/* Main content wrapper */}
      <div className="flex-1 md:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4 md:px-8">
          {/* Hamburger (mobile) */}
          <button
            className="md:hidden text-on-surface-variant hover:text-primary p-2"
            onClick={toggleDrawer}
          >
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
        <main className="p-6 lg:p-8 flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Dashboard Overview</h2>
              <p className="text-lg text-on-surface-variant">System metrics and recent activity across all categories.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="glass-panel flex items-center gap-2 px-4 py-2 rounded-lg hover:border-primary transition-all">
                <span className="material-symbols-outlined text-primary">calendar_month</span>
                <span>Last 30 Days</span>
                <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </button>
              <button className="border border-secondary text-secondary text-xs uppercase px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all">
                <span className="material-symbols-outlined text-sm">download</span>
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-xl p-6 relative overflow-hidden hover:border-primary/50 transition-all">
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-xl ${stat.glow}`} />
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-white/5">
                    <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4 relative z-10">
                  <p className="text-sm text-on-surface-variant mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area chart */}
            <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Revenue Over Time</h3>
                <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">more_horiz</span>
              </div>
              <div className="flex-grow bg-gradient-to-t from-primary/10 to-transparent border-b-2 border-primary rounded-lg relative min-h-[200px]" />
              <div className="flex justify-between mt-3 text-sm text-on-surface-variant">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>

            {/* Bar chart */}
            <div className="glass-panel rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Visitor Traffic</h3>
                <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary">more_horiz</span>
              </div>
              <div className="flex items-end justify-between flex-grow min-h-[200px] px-2 pb-2">
                <div className="w-[15%] bg-secondary/60 h-[40%] rounded-t hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all" />
                <div className="w-[15%] bg-secondary/70 h-[65%] rounded-t hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all" />
                <div className="w-[15%] bg-secondary/50 h-[30%] rounded-t hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all" />
                <div className="w-[15%] bg-secondary h-[85%] rounded-t hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all" />
                <div className="w-[15%] bg-secondary/70 h-[50%] rounded-t hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all" />
              </div>
              <div className="flex justify-between mt-3 text-sm text-on-surface-variant">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions + Popular Items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions table */}
            <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
                <button className="text-primary text-sm hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase text-on-surface-variant">
                      <th className="pb-3 font-semibold">Transaction ID</th>
                      <th className="pb-3 font-semibold">User</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Amount/Item</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                        <td className="py-3 text-white font-mono text-sm">{tx.id}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden flex items-center justify-center text-secondary font-bold">
                              {tx.user.charAt(0)}
                            </div>
                            <span className="text-white">{tx.user}</span>
                          </div>
                        </td>
                        <td className="py-3 text-on-surface-variant">{tx.category}</td>
                        <td className="py-3 text-white">{tx.amount}</td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full text-xs uppercase border ${tx.statusColor}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular items */}
            <div className="flex flex-col gap-6">
              <div className="glass-panel rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">movie</span>
                  Top Movies
                </h4>
                <ul className="flex flex-col gap-3">
                  {topMovies.map((movie, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">{index + 1}. {movie.name}</span>
                      <span className="text-primary font-bold text-sm">{movie.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-panel rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">devices</span>
                  Top Electronics
                </h4>
                <ul className="flex flex-col gap-3">
                  {topElectronics.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-sm text-on-surface-variant">{index + 1}. {item.name}</span>
                      <span className="text-secondary font-bold text-sm">{item.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;