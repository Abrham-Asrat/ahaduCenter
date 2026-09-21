// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import {
  fetchNotifications,
  markOneRead,
  markAllRead,
  clearAll,
} from '../redux/slices/notificationSlice';

/**
 * NotificationsPage Component
 * 
 * Displays all user notifications with filtering and read/unread states.
 */
const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading, error } = useSelector((s) => s.notification);

  // Active filter tab
  const [activeTab, setActiveTab] = useState('All');
  // Toast state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Filter tabs
  const tabs = ['All', 'Movies', 'Electronics', 'Books', 'Promotions', 'Orders'];

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'All'
    ? notifications
    : notifications.filter((n) => {
        if (activeTab === 'Orders') {
          return n.type === 'Electronics' && (n.title?.includes('shipped') || n.title?.includes('Order'));
        }
        return n.type === activeTab;
      });

  // Helper: get icon and color based on notification type
  const getTypeStyles = (type) => {
    switch (type) {
      case 'Movies':
        return { icon: 'movie', color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20' };
      case 'Electronics':
        return { icon: 'devices', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' };
      case 'Books':
        return { icon: 'menu_book', color: 'text-tertiary', bg: 'bg-tertiary/10 border-tertiary/20' };
      case 'Promotions':
        return { icon: 'local_offer', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' };
      case 'System':
        return { icon: 'security', color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20' };
      default:
        return { icon: 'notifications', color: 'text-on-surface-variant', bg: 'bg-surface-container border-white/5' };
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllRead()).unwrap();
      showToast('All notifications marked as read.');
    } catch (err) {
      showToast(typeof err === 'string' ? err : 'Failed to mark all as read');
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    try {
      await dispatch(clearAll()).unwrap();
      showToast('All notifications cleared.');
    } catch (err) {
      showToast(typeof err === 'string' ? err : 'Failed to clear notifications');
    }
  };

  // Handle marking individual notification as read (on click)
  const handleNotificationClick = async (id, isRead) => {
    if (isRead) return;
    try {
      await dispatch(markOneRead(id)).unwrap();
    } catch (err) {
      showToast(typeof err === 'string' ? err : 'Failed to mark notification as read');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-background text-on-background flex flex-col animate-fade-in">

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary">info</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-6">
        {/* Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Stay updated on new arrivals, promotions, and your activity.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleClearAll}
              disabled={loading || notifications.length === 0}
              className="flex-1 md:flex-none py-2 px-4 rounded-lg border border-white/10 text-white hover:border-red-400 hover:text-red-400 transition-all text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              Clear All
            </button>
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading || unreadCount === 0}
              className="flex-1 md:flex-none py-2 px-4 rounded-lg bg-primary text-black text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              Mark All as Read
            </button>
          </div>
        </section>

        {/* Error banner */}
        {error && (
          <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
            <button
              onClick={() => dispatch(fetchNotifications())}
              className="ml-auto text-xs underline font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filter tabs */}
        <section className="w-full overflow-x-auto hide-scrollbar pb-2">
          <div className="flex gap-3 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'glass-panel text-on-surface-variant hover:text-white hover:border-white/30'
                }`}
              >
                {tab}
                {tab === 'All' && unreadCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-primary text-black rounded-full text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Loading state */}
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-xl p-5 h-24 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : (
          /* Notifications list */
          <section className="flex flex-col gap-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">notifications_off</span>
                <h2 className="text-2xl font-bold text-white mt-4">No notifications</h2>
                <p className="text-on-surface-variant mt-2">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const id = notification._id || notification.id;
                const { icon, color, bg } = getTypeStyles(notification.type);
                const isRead = notification.isRead;
                const timeText = formatDate(notification.timestamp || notification.createdAt);

                return (
                  <article
                    key={id}
                    onClick={() => handleNotificationClick(id, isRead)}
                    className={`glass-panel rounded-xl p-5 flex gap-4 items-start relative cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-secondary/30 ${
                      !isRead ? 'border-l-4 border-l-primary bg-white/[0.02]' : ''
                    }`}
                  >
                    {/* Unread indicator */}
                    {!isRead && (
                      <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${bg}`}>
                      <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className={`text-lg font-semibold text-white mb-1 truncate ${!isRead ? '' : 'opacity-70'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant line-clamp-2 mb-2">
                        {notification.description}
                      </p>
                      {timeText && (
                        <span className="text-xs uppercase text-on-surface-variant/60">{timeText}</span>
                      )}
                    </div>
                  </article>
                );
              })
            )}

            {/* Load More */}
            {filteredNotifications.length > 0 && (
              <div className="mt-6 flex justify-center">
                <button
                  className="py-3 px-8 rounded-lg border border-secondary/50 text-secondary text-xs uppercase tracking-wider hover:bg-secondary/10 transition-colors cursor-pointer"
                  onClick={() => showToast('No more notifications')}
                >
                  Load More
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
    </>
  );
};

export default NotificationsPage;