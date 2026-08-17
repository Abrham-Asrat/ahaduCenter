// src/pages/UserDashboardPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * UserDashboardPage Component
 * 
 * Main user profile dashboard.
 * 
 * Features:
 * - Profile header with avatar, name, email, member since
 * - Edit Profile button
 * - Left sidebar navigation (Overview, Favorites, Purchase History, etc.)
 * - Stats cards (Favorites, Purchases, Borrowed, Requests)
 * - Recent Activity list with status badges
 * - Quick Actions (Browse Movies, Shop Electronics, Explore Books)
 * 
 * Responsive:
 * - Desktop: Two-column layout (sidebar left, content right)
 * - Mobile: Sidebar becomes horizontal scrollable tabs, cards stack
 */
const UserDashboardPage = () => {
  // User profile state
  const [user, setUser] = useState({
    name: 'Alex Mercer',
    email: 'alex.mercer@ahaducenter.com',
    phone: '+251 911 123 456',
    memberSince: 'Jan 2024',
    initials: 'AM',
    avatarUrl: null,
    stats: {
      favorites: 12,
      purchases: 5,
      borrowed: 2,
      requests: 3,
    },
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [toastMessage, setToastMessage] = useState(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      initials: editForm.name.split(' ').map((n) => n[0]).join(''),
    });
    localStorage.setItem('ahadu_user_email', editForm.email);
    window.dispatchEvent(new Event('auth-change'));
    setIsEditModalOpen(false);
    setToastMessage('Profile updated successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sidebar navigation items
  const navItems = [
    { label: 'Overview', icon: 'dashboard', active: true, path: '/account' },
    { label: 'Favorites', icon: 'favorite', path: '/wishlist' },
    { label: 'Purchase History', icon: 'receipt_long', path: '/purchase-history' },
    { label: 'Borrowing History', icon: 'library_books', path: '/borrowing-history' },
    { label: 'Movie Requests', icon: 'movie', path: '/movie-request' },
    { label: 'Notifications', icon: 'notifications', path: '/notifications' },
    { label: 'Contact', icon: 'contact_support', path: '/contact' },
  ];

  // Stats data
  const stats = [
    { label: 'Favorites', value: user.stats.favorites, icon: 'favorite', color: 'text-primary' },
    { label: 'Purchases', value: user.stats.purchases, icon: 'shopping_cart', color: 'text-primary' },
    { label: 'Borrowed', value: user.stats.borrowed, icon: 'menu_book', color: 'text-primary' },
    { label: 'Requests', value: user.stats.requests, icon: 'movie', color: 'text-primary' },
  ];

  // Recent activities data
  const activities = [
    {
      icon: 'movie',
      title: 'Requested Movie: Inception',
      date: 'Oct 24, 2024',
      status: 'Pending',
      statusColor: 'bg-secondary/15 text-secondary border-secondary/30',
      iconColor: 'text-secondary bg-secondary/10 border-secondary/20',
    },
    {
      icon: 'shopping_cart',
      title: 'Purchased: Dell XPS 15',
      date: 'Oct 12, 2024',
      status: 'Completed',
      statusColor: 'bg-primary/15 text-primary border-primary/30',
      iconColor: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      icon: 'menu_book',
      title: 'Borrowed: Clean Code',
      date: 'Sep 28, 2024',
      status: 'Active',
      statusColor: 'bg-tertiary/15 text-tertiary border-tertiary/30',
      iconColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col animate-fade-in">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto w-full px-4 md:px-8">
        {/* Profile Header Banner */}
        <section className="w-full rounded-xl overflow-hidden glass-panel mb-8 relative bg-gradient-premium">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent z-0" />
          <div className="relative z-10 px-6 py-8 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-full border-2 border-primary flex items-center justify-center bg-surface-container shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {/* If avatarUrl exists, show image; otherwise show initials */}
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="font-heading text-3xl font-bold text-primary">{user.initials}</span>
                )}
              </div>
            </div>

            {/* User info */}
            <div className="flex-grow text-center md:text-left flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-lg text-on-surface-variant">
                {user.email} <span className="mx-2 opacity-50">|</span> Member since {user.memberSince}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn-secondary px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-2 mx-auto md:mx-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Profile Information
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Layout: Sidebar + Main */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Navigation */}
          <aside className="w-full md:w-1/4 flex-shrink-0">
            <nav className="glass-panel rounded-xl p-4 flex flex-col gap-2 sticky top-[120px]">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${item.danger
                      ? 'text-error hover:bg-error/10'
                      : item.active
                        ? 'bg-primary/10 text-primary border-l-2 border-primary'
                        : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
                    }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Right Main Area */}
          <div className="w-full md:w-3/4 flex flex-col gap-8">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-panel rounded-xl p-4 flex flex-col gap-2 hover-glow-emerald transition-all cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                    <span className="text-xs uppercase tracking-wider text-on-surface-variant">{stat.label}</span>
                  </div>
                  <span className="text-4xl font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <section className="glass-panel rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-3">
                Recent Activity
              </h2>
              <div className="flex flex-col gap-3 mt-2">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface-container-high/50 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${activity.iconColor}`}>
                        <span className="material-symbols-outlined text-sm">{activity.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-semibold">{activity.title}</span>
                        <span className="text-sm text-on-surface-variant">{activity.date}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs uppercase border ${activity.statusColor}`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h3 className="text-2xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/movies"
                  className="glass-panel rounded-xl p-4 flex items-center gap-4 hover-glow-emerald transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">theaters</span>
                  </div>
                  <span className="font-semibold text-white">Browse Movies</span>
                </Link>
                <Link
                  to="/electronics"
                  className="glass-panel rounded-xl p-4 flex items-center gap-4 hover-glow-emerald transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">devices</span>
                  </div>
                  <span className="font-semibold text-white">Shop Electronics</span>
                </Link>
                <Link
                  to="/books"
                  className="glass-panel rounded-xl p-4 flex items-center gap-4 hover-glow-emerald transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">import_contacts</span>
                  </div>
                  <span className="font-semibold text-white">Explore Books</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit</span>
                Edit Profile Information
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-on-surface-variant hover:text-error cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase text-on-surface-variant font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none text-sm transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-on-surface-variant font-bold mb-2">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none text-sm transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-on-surface-variant font-bold mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none text-sm transition-all duration-200"
                  required
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-secondary text-secondary font-bold text-xs uppercase cursor-pointer hover:bg-secondary/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-black font-extrabold text-xs uppercase cursor-pointer hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-black font-extrabold px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          {toastMessage}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserDashboardPage;