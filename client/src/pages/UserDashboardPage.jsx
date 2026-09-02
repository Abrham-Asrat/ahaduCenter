// src/pages/UserDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { userService } from '../services/userService';

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

// ── Loading Skeleton helpers ──────────────────────────────────────────────────

const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse bg-white/10 rounded-lg ${className}`} />
);

const ProfileHeaderSkeleton = () => (
  <section className="w-full rounded-xl overflow-hidden glass-panel mb-8 relative bg-gradient-premium">
    <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent z-0" />
    <div className="relative z-10 px-6 py-8 flex flex-col md:flex-row items-center gap-6">
      <SkeletonBlock className="w-32 h-32 rounded-full flex-shrink-0" />
      <div className="flex-grow flex flex-col gap-3 w-full">
        <SkeletonBlock className="h-10 w-56" />
        <SkeletonBlock className="h-5 w-80" />
        <SkeletonBlock className="h-9 w-44 mt-2 rounded-xl" />
      </div>
    </div>
  </section>
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="glass-panel rounded-xl p-4 flex flex-col gap-2">
        <SkeletonBlock className="h-4 w-20" />
        <SkeletonBlock className="h-10 w-12" />
      </div>
    ))}
  </div>
);

const ActivitySkeleton = () => (
  <section className="glass-panel rounded-xl p-6 flex flex-col gap-4">
    <SkeletonBlock className="h-7 w-40 mb-1" />
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-surface-container-high/50 border border-white/5">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-4 w-48" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </div>
        <SkeletonBlock className="h-6 w-20 rounded-full" />
      </div>
    ))}
  </section>
);

// ── Utility: derive icon/color from activity type ─────────────────────────────

const getActivityMeta = (activity) => {
  const type = activity.type || '';
  if (type === 'movie_request' || activity.title?.toLowerCase().includes('request')) {
    return {
      icon: 'movie',
      iconColor: 'text-secondary bg-secondary/10 border-secondary/20',
      statusColor: 'bg-secondary/15 text-secondary border-secondary/30',
    };
  }
  if (type === 'order' || type === 'purchase' || activity.title?.toLowerCase().includes('purchase')) {
    return {
      icon: 'shopping_cart',
      iconColor: 'text-primary bg-primary/10 border-primary/20',
      statusColor: 'bg-primary/15 text-primary border-primary/30',
    };
  }
  if (type === 'borrowing' || activity.title?.toLowerCase().includes('borrow')) {
    return {
      icon: 'menu_book',
      iconColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
      statusColor: 'bg-tertiary/15 text-tertiary border-tertiary/30',
    };
  }
  // default
  return {
    icon: 'history',
    iconColor: 'text-primary bg-primary/10 border-primary/20',
    statusColor: 'bg-primary/15 text-primary border-primary/30',
  };
};

// ── Main Component ────────────────────────────────────────────────────────────

const UserDashboardPage = () => {
  // ── Data state ──
  const [user, setUser] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [activities, setActivities] = useState([]);

  // ── UI state ──
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // ── Avatar upload state ──
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState(null);
  const avatarFileInputRef = React.useRef(null);

  // ── Fetch all three concurrently on mount ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profile, stats, activityData] = await Promise.all([
          userService.getProfile(),
          userService.getUserStats(),
          userService.getUserActivity(),
        ]);

        if (cancelled) return;

        // Normalise profile — API returns the user document
        const profileUser = profile?.user ?? profile;
        setUser(profileUser);
        setEditForm({
          name: profileUser?.name ?? '',
          email: profileUser?.email ?? '',
          phone: profileUser?.phone ?? '',
        });

        // Normalise stats — API may return wrapped or flat object
        setStatsData(stats?.stats ?? stats);

        // Normalise activity — API may return { activities: [...] } or plain array
        const list = activityData?.activities ?? activityData;
        setActivities(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!cancelled) {
          setError(typeof err === 'string' ? err : 'Failed to load dashboard data. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { cancelled = true; };
  }, []);

  // ── Derived display values ─────────────────────────────────────────────────
  const displayName = user?.name ?? '';
  const displayEmail = user?.email ?? '';
  const displayPhone = user?.phone ?? '';
  const displayMemberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : (user?.memberSince ?? '');
  const displayInitials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join('');
  const avatarUrl = user?.avatarUrl ?? user?.avatar ?? null;

  // ── Stats cards derived from statsData ──────────────────────────────────────
  const stats = [
    {
      label: 'Favorites',
      value: statsData?.favorites ?? statsData?.wishlistCount ?? 0,
      icon: 'favorite',
      color: 'text-primary',
    },
    {
      label: 'Purchases',
      value: statsData?.purchases ?? statsData?.orderCount ?? 0,
      icon: 'shopping_cart',
      color: 'text-primary',
    },
    {
      label: 'Borrowed',
      value: statsData?.borrowed ?? statsData?.borrowingCount ?? 0,
      icon: 'menu_book',
      color: 'text-primary',
    },
    {
      label: 'Requests',
      value: statsData?.requests ?? statsData?.movieRequestCount ?? 0,
      icon: 'movie',
      color: 'text-primary',
    },
  ];

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await userService.updateProfile({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
      });
      // Normalise — API may return { user: {...} } or the user object directly
      const updatedUser = response?.user ?? response;
      setUser((prev) => ({ ...prev, ...updatedUser }));
      setIsEditModalOpen(false);
      setToastMessage('Profile updated successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      setSaveError(typeof err === 'string' ? err : 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSaveError(null);
  };

  // ── Avatar upload handler ──────────────────────────────────────────────────
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the file input so the same file can be re-selected after an error
    e.target.value = '';

    setIsUploadingAvatar(true);
    setAvatarUploadError(null);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await userService.uploadAvatar(formData);
      // Normalise — API may return { avatarUrl: '...' } or { user: { avatarUrl: '...' } }
      const newAvatarUrl =
        response?.avatarUrl ??
        response?.user?.avatarUrl ??
        response?.user?.avatar ??
        response?.avatar ??
        null;
      if (newAvatarUrl) {
        setUser((prev) => ({ ...prev, avatarUrl: newAvatarUrl, avatar: newAvatarUrl }));
      }
      setToastMessage('Avatar updated successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      setAvatarUploadError(typeof err === 'string' ? err : 'Failed to upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // ── Sidebar nav ────────────────────────────────────────────────────────────
  const navItems = [
    { label: 'Overview', icon: 'dashboard', active: true, path: '/account' },
    { label: 'Favorites', icon: 'favorite', path: '/wishlist' },
    { label: 'Purchase History', icon: 'receipt_long', path: '/purchase-history' },
    { label: 'Borrowing History', icon: 'library_books', path: '/borrowing-history' },
    { label: 'Movie Requests', icon: 'movie', path: '/movie-request' },
    { label: 'Notifications', icon: 'notifications', path: '/notifications' },
    { label: 'Contact', icon: 'contact_support', path: '/contact' },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-background text-on-background flex flex-col animate-fade-in">

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8">

        {/* ── Error Banner ── */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="ml-auto text-xs underline font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Profile Header ── */}
        {loading ? (
          <ProfileHeaderSkeleton />
        ) : (
          <section className="w-full rounded-xl overflow-hidden glass-panel mb-8 relative bg-gradient-premium">
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent z-0" />
            <div className="relative z-10 px-6 py-8 flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full border-2 border-primary flex items-center justify-center bg-surface-container shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="font-heading text-3xl font-bold text-primary">{displayInitials}</span>
                  )}
                </div>
                {/* Avatar upload button */}
                <button
                  type="button"
                  onClick={() => {
                    setAvatarUploadError(null);
                    avatarFileInputRef.current?.click();
                  }}
                  disabled={isUploadingAvatar}
                  title="Change avatar"
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-black flex items-center justify-center shadow-lg border-2 border-background cursor-pointer hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploadingAvatar ? (
                    <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-base">photo_camera</span>
                  )}
                </button>
                {/* Hidden file input */}
                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>

              {/* User info */}
              <div className="flex-grow text-center md:text-left flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{displayName}</h1>
                <p className="text-lg text-on-surface-variant">
                  {displayEmail}
                  {displayMemberSince && (
                    <>
                      <span className="mx-2 opacity-50">|</span>
                      Member since {displayMemberSince}
                    </>
                  )}
                </p>
                {/* Avatar upload error */}
                {avatarUploadError && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-error/10 border border-error/30 text-error text-sm max-w-sm mx-auto md:mx-0">
                    <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                    <span>{avatarUploadError}</span>
                    <button
                      type="button"
                      onClick={() => setAvatarUploadError(null)}
                      className="ml-auto flex-shrink-0 text-error/70 hover:text-error cursor-pointer"
                      title="Dismiss"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
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
        )}

        {/* ── Dashboard Layout: Sidebar + Main ── */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Navigation */}
          <aside className="w-full md:w-1/4 flex-shrink-0">
            <nav className="glass-panel rounded-xl p-4 flex flex-col gap-2 sticky top-[120px]">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                    item.danger
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
            {loading ? (
              <StatsSkeleton />
            ) : (
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
            )}

            {/* Recent Activity */}
            {loading ? (
              <ActivitySkeleton />
            ) : (
              <section className="glass-panel rounded-xl p-6 flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-3">
                  Recent Activity
                </h2>
                {activities.length === 0 ? (
                  <p className="text-on-surface-variant text-sm py-4 text-center">No recent activity found.</p>
                ) : (
                  <div className="flex flex-col gap-3 mt-2">
                    {activities.map((activity, index) => {
                      const meta = getActivityMeta(activity);
                      return (
                        <div
                          key={activity._id ?? index}
                          className="flex items-center justify-between p-4 rounded-lg bg-surface-container-high/50 border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${meta.iconColor}`}>
                              <span className="material-symbols-outlined text-sm">{meta.icon}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white font-semibold">{activity.title ?? activity.description ?? 'Activity'}</span>
                              <span className="text-sm text-on-surface-variant">
                                {activity.date
                                  ? activity.date
                                  : activity.createdAt
                                  ? new Date(activity.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })
                                  : ''}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs uppercase border ${meta.statusColor}`}>
                            {activity.status ?? 'Info'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

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

      {/* ── Edit Profile Modal ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit</span>
                Edit Profile Information
              </h3>
              <button onClick={handleCloseEditModal} className="text-on-surface-variant hover:text-error cursor-pointer">
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-on-surface-variant font-bold mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none text-sm transition-all duration-200"
                  disabled={isSaving}
                />
              </div>

              {/* ── Inline error inside modal ── */}
              {saveError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">
                  <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                  <span>{saveError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-secondary text-secondary font-bold text-xs uppercase cursor-pointer hover:bg-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-primary text-black font-extrabold text-xs uppercase cursor-pointer hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving && (
                    <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  )}
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Toast notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-black font-extrabold px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          {toastMessage}
        </div>
      )}

      <Footer />
    </div>
    </>
  );
};

export default UserDashboardPage;
