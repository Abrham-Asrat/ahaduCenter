// src/pages/NotificationsPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * NotificationsPage Component
 * 
 * Displays all user notifications with filtering and read/unread states.
 * 
 * Features:
 * - Filter tabs: All, Movies, Electronics, Books, Promotions, Orders
 * - Notification cards with type-specific icons and colors
 * - Unread indicator (emerald dot) on unread items
 * - "Mark All as Read" and "Clear All" buttons
 * - Load More button
 * 
 * State:
 * - activeTab: Which filter tab is active
 * - notifications: Array of notification objects (with isRead flag)
 */
const NotificationsPage = () => {
  // Active filter tab
  const [activeTab, setActiveTab] = useState('All');
  // Notifications data (dummy, will be replaced with API)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Electronics',
      title: 'Your Quantum X Pro has shipped',
      description: 'Good news! Your order #8492-EL for the Quantum X Pro Smartphone is on its way. Track your package for real-time updates on delivery.',
      timestamp: '2 hours ago',
      isRead: false,
    },
    {
      id: 2,
      type: 'Movies',
      title: 'New Release: "The Obsidian Enigma"',
      description: 'The highly anticipated sci-fi thriller is now available in stunning 4K HDR. Rent or buy now to experience the cinematic masterpiece.',
      timestamp: '5 hours ago',
      isRead: false,
    },
    {
      id: 3,
      type: 'Books',
      title: 'Author signing event near you',
      description: 'Bestselling author Sarah Jenkins will be at the downtown Lumina Bookstore this Friday. Reserve your spot for the exclusive reading and signing.',
      timestamp: 'Yesterday',
      isRead: true,
    },
    {
      id: 4,
      type: 'Promotions',
      title: 'Exclusive 20% off Premium Electronics',
      description: 'As an Elite member, enjoy a special 20% discount on select premium audio and visual equipment. Offer valid through the weekend.',
      timestamp: 'Oct 12, 2023',
      isRead: true,
    },
    {
      id: 5,
      type: 'System',
      title: 'Security Alert: New login detected',
      description: 'We noticed a new login to your Lumina Elite account from a Mac device in Seattle, WA. If this was you, no action is needed.',
      timestamp: 'Oct 10, 2023',
      isRead: true,
    },
  ]);

  // Filter tabs
  const tabs = ['All', 'Movies', 'Electronics', 'Books', 'Promotions', 'Orders'];

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'All'
    ? notifications
    : notifications.filter(n => {
      if (activeTab === 'Orders') return n.type === 'Electronics' && n.title.includes('shipped') || n.title.includes('Order');
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
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Handle marking individual notification as read (on click)
  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-6">
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
              onClick={clearAll}
              className="flex-1 md:flex-none py-2 px-4 rounded-lg border border-white/10 text-white hover:border-red-400 hover:text-red-400 transition-all text-xs uppercase tracking-wider"
            >
              Clear All
            </button>
            <button
              onClick={markAllAsRead}
              className="flex-1 md:flex-none py-2 px-4 rounded-lg bg-primary text-black text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
            >
              Mark All as Read
            </button>
          </div>
        </section>

        {/* Filter tabs */}
        <section className="w-full overflow-x-auto hide-scrollbar pb-2">
          <div className="flex gap-3 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${activeTab === tab
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'glass-panel text-on-surface-variant hover:text-white hover:border-white/30'
                  }`}
              >
                {tab}
                {tab === 'All' && unreadCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-primary text-black rounded-full text-[10px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Notifications list */}
        <section className="flex flex-col gap-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">notifications_off</span>
              <h2 className="text-2xl font-bold text-white mt-4">No notifications</h2>
              <p className="text-on-surface-variant mt-2">You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const { icon, color, bg } = getTypeStyles(notification.type);
              return (
                <article
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`glass-panel rounded-xl p-5 flex gap-4 items-start relative cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-secondary/30 ${!notification.isRead ? 'border-l-4 border-l-primary bg-white/[0.02]' : ''
                    }`}
                >
                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${bg}`}>
                    <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className={`text-lg font-semibold text-white mb-1 truncate ${!notification.isRead ? '' : 'opacity-70'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-2">
                      {notification.description}
                    </p>
                    <span className="text-xs uppercase text-on-surface-variant/60">{notification.timestamp}</span>
                  </div>
                </article>
              );
            })
          )}

          {/* Load More */}
          {filteredNotifications.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button className="py-3 px-8 rounded-lg border border-secondary/50 text-secondary text-xs uppercase tracking-wider hover:bg-secondary/10 transition-colors">
                Load More
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotificationsPage;