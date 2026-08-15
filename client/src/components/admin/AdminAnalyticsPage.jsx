// src/pages/admin/AdminAnalyticsPage.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * AdminAnalyticsPage Component
 * 
 * Displays analytics and reports.
 * 
 * Features:
 * - Date range selector (placeholder)
 * - Export Report button
 * - Tabs: Overview, Revenue, Visitors, Popular Items
 * - Stats cards (Total Revenue, Visitors, Orders, Borrows)
 * - Charts (Revenue Over Time, Visitors Over Time) using CSS/SVG mockups
 * - Top items lists (Movies, Products, Books)
 * 
 * State:
 * - activeTab: Currently selected tab
 * - dateRange: Selected date range
 */
const AdminAnalyticsPage = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [dateRange, setDateRange] = useState('Last 30 Days');

    // Stats data
    const stats = [
        { label: 'Total Revenue', value: '$124,500', icon: 'payments', color: 'text-primary', bg: 'bg-primary/10', change: '+12%', trend: 'up' },
        { label: 'Total Visitors', value: '45.2K', icon: 'group', color: 'text-secondary', bg: 'bg-secondary/10', change: null, trend: null },
        { label: 'Total Orders', value: '1,280', icon: 'shopping_cart', color: 'text-tertiary', bg: 'bg-tertiary/10', change: null, trend: null },
        { label: 'Total Borrows', value: '840', icon: 'auto_stories', color: 'text-purple-400', bg: 'bg-purple-400/10', change: null, trend: null },
    ];

    // Top items data
    const topMovies = [
        { rank: 1, title: 'Neon Horizon', views: '12.5k views', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD7T-OHHAIhXcq8p98t1NSSLfDtA9rKFZGUzgUbzxxxSpYrxtJzmyhh24CjjU0jljN_TcUi7sg_AXyNSTkYxV-_6u36N99zZrospI6SCKxq48lxXqKka_vgDyNjz0H3OutsS4x2AriBAHVmpSZcZsL3QyC5jMIrrd5iS2n-RyhSCP9YusTYF46p_6o2rzZ07zlR_0Kj9kRDTr3r3AABV0ip30OGhoK-cwnEL4YhPiJjXgHi-Vqhi2N_g' },
        { rank: 2, title: 'Void Walker', views: '9.2k views', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-ble_5oxuQSet0H6fPKsIkDjeCYzpOW-mewOlwe08neqVdVdfqLGFcSlPQm6Sf_36BfPpXq93dzAcldEmbx6GjCLhCqihcyOJDrrrqm2QMAQhTKiGkBq3iFBXAlzRFOv4P-FsY5Ofs7y0BdLR1cDtvCbRYjc235PSWUqwJrGPQgagD1TKwbybRMsYCt8qipRXPq3SG-ZCqJ67MRFSBABIDdMhjEoJsV9H8w3iH1W2UKxACAu5My1Zcg' },
        { rank: 3, title: 'Emerald Blade', views: '8.7k views', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHCubPJhmBKJeZB1jZiVkaIXkmk2Vn7AFhd38s0QfD0y6bB80Xex7Wl_mOOEaxi5hZ5uJWHh6tUITBLsPN7NSxQvlCr33G7fdCzvgPCi6vHAurfWtHGmH59vGZcoBEI9-KbHthALkpdIMw4QLbJRFNaA72ptkcNsGPWLARLswR3_QRaga3jEDe7QaHfgoVxAIN-0sWWUbNxgIg2K5Da5_PPkLZa6-ILDBjma8GbkGbYgmJzOtsXgcnOA' },
    ];

    const topProducts = [
        { rank: 1, title: 'Quantum Phone X', sales: '450 units', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkOLS615QW-ojebZO6DPHfdgtEE2NL6wwnMq1ygu0aCYI3T5uQmxo7E_OCB6y7nj0ZoqnndUNaPrwgGMWVULNmtVMnaKcQrASRnxOhU0U1buTDw5rE3IJ34a4fL3eddzVPDYMiyu8DXfRULQQZk7TTp-GKtVZLlTBl4qmBIeVQquqE4cS-WF0abrbscEZUOGWTXhGRCti7oWcjXf8-YFCGSypv9u3HpfvFYyTi_6O1zAOT8uLRE45gww' },
        { rank: 2, title: 'Sonic Pro Max', sales: '320 units', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBzFZUur1RjOxJ6VGkfD2B0cduQRfNbwOml8LNqL3WITeinVty8cA5RHqkFGJ4VCAEF-78Ba4AkwCLd0FrYLhqTOBT3btS8fq51yL8d57O0T8zjBs_QxUG-65NbFi54eCWmDqW-v1spQP6AeJHlyAwWTiAnQA_W6pSmB0E1ytcBsjiMBCw8FkYToQx5xw6Ebz_zo6sVdrWZpypLGgwSE_LrCOfposkJjy1tL6UyksKQFLJPGvgt5pRJg' },
        { rank: 3, title: 'Visionary Display', sales: '180 units', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX9vcHX9Vr2KYhLvqDEAu9OUMCZ-zOhtcWEsxH-Dxlho5gznjUIV5fmSiDaXtRpg-EHHCfDwfq2eWr5cOMIECW0WS1kMv8qg6HhQ7kJKzgJoQ_5jRpEha9eDjYP9JxUpRlSb4ezyAAOJLiODMVAO2XOGZm8Cc80UGAGwn3MNANjs9zO6pBAZ0ot6wxwmeiazgUp3-2JmSsxHI927ZqbpcqHEAM6XWy0S3vC6nCqFslYeQ9JFdFGlc65w' },
    ];

    const topBooks = [
        { rank: 1, title: 'The Golden Ratio', borrowed: '210 borrowed', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwKM4Af1LP9j0jXRTrQK6wURGiUdAB0TQh52J4T8smHrNM7JuLKX4Go2WfcvMelnwTTGnpGT2-ktyxKmRWkEZyzeLxl8O0p8MpWQQ6_iFbXv_IC_rK-ODaA0S11ChSpO5qY0EwjFFNZy6fWNSx9hyjZbqXjvFzd8VAPccpfXk24TPfx8O1c7Z_P2IOjbZXxtTlqHRNbmeLb_J1ir_HAZ3Q5ddeecSYaC_ti_Dd-ow_pSXN73shRT8F0w' },
        { rank: 2, title: 'Distant Shores', borrowed: '185 borrowed', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfqip6eM7M49rwbiomsmuBOKGsR8HzU62NKUoLLHk3Z_IsSoQ_xwHdR0-0LRf_Q1ViYtM5jeAuYR0BDq5ja_VNIH9oz-LGNEQEF4PLMKDKX9TITBLRKSZA0vkACaOZKsmPG5qrY9TSgkmu6D7SUvgP-qDMvmTmhpdrTQiqnZ8R8yhmgEwx9ZGnbgrJr8VWpvoWlKHDGO8aAKVK587S6vPeQUeS584fQjm-G9O2JWdw0UfbwyyLOm91-g' },
        { rank: 3, title: 'Silent Growth', borrowed: '150 borrowed', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDrRTrmL3QCL5FQAFRWV8d6rsqd9l_gkL6asc9aX17oM1OkYLYN3BSUYC6KYm6j34ISzlXIAG0ZC6JqfwvFIFnGsXkBhyMCXDrkDN03a-MldBqYU926OL8MgU3L3UHrE8NArdL-jZwGgwFsDEjOjJJI6ZMO9jeU7bAqABnAevBJ97gptqaPmLfAI0liiCAHMUJdKTlK9vX1Vzi8t1eG0Uv49SAVu3L8Vz2uELMSQaWtE_P8qQjShUNDg' },
    ];

    const tabs = ['Overview', 'Revenue', 'Visitors', 'Popular Items'];

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Analytics &amp; Reports</h2>
                    <p className="text-lg text-on-surface-variant">Track performance, revenue, and user engagement.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary outline-none"
                    >
                        <option>Last 30 Days</option>
                        <option>Last 7 Days</option>
                        <option>This Year</option>
                        <option>All Time</option>
                    </select>
                    <button className="bg-primary text-black px-6 py-2 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export Report
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-white/10 mb-8 overflow-x-auto hide-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === tab
                                ? 'text-primary border-b-2 border-primary font-semibold'
                                : 'text-on-surface-variant hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="glass-panel rounded-xl p-6 hover:border-primary/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-on-surface-variant">{stat.label}</span>
                            <span className={`material-symbols-outlined ${stat.color} ${stat.bg} p-2 rounded-full`}>{stat.icon}</span>
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold text-white">{stat.value}</span>
                            {stat.change && (
                                <span className={`text-sm flex items-center ${stat.trend === 'up' ? 'text-primary' : 'text-error'}`}>
                                    <span className="material-symbols-outlined text-sm">
                                        {stat.trend === 'up' ? 'arrow_upward' : 'arrow_downward'}
                                    </span>
                                    {stat.change}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue chart */}
                <div className="glass-panel rounded-xl p-6 h-80 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6">Revenue Over Time</h3>
                    <div className="flex-1 flex items-end gap-3 border-b border-l border-white/10 px-4 pb-3">
                        {[20, 40, 35, 60, 80, 95].map((height, index) => (
                            <div
                                key={index}
                                className="flex-1 bg-gradient-to-t from-primary/30 to-transparent rounded-t-sm border-t border-primary relative"
                                style={{ height: `${height}%` }}
                            >
                                <div className="absolute -top-2 -right-1 w-2 h-2 rounded-full bg-primary" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-on-surface-variant">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                </div>

                {/* Visitors chart */}
                <div className="glass-panel rounded-xl p-6 h-80 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6">Visitors Over Time</h3>
                    <div className="flex-1 flex items-end justify-between border-b border-l border-white/10 px-6 pb-3">
                        {[30, 50, 45, 70, 85].map((height, index) => (
                            <div
                                key={index}
                                className="w-[12%] bg-secondary/80 rounded-t-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-on-surface-variant">
                        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span>
                    </div>
                </div>
            </div>

            {/* Top items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Movies */}
                <div className="glass-panel rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Top Movies</h3>
                    <div className="flex flex-col gap-4">
                        {topMovies.map((movie) => (
                            <div key={movie.rank} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <span className="text-lg font-bold text-secondary w-6 text-center">{movie.rank}</span>
                                <div className="w-12 h-16 bg-surface-container rounded overflow-hidden">
                                    <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{movie.title}</p>
                                    <p className="text-sm text-on-surface-variant">{movie.views}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="glass-panel rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Top Products</h3>
                    <div className="flex flex-col gap-4">
                        {topProducts.map((product) => (
                            <div key={product.rank} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <span className="text-lg font-bold text-secondary w-6 text-center">{product.rank}</span>
                                <div className="w-16 h-12 bg-surface-container rounded overflow-hidden">
                                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{product.title}</p>
                                    <p className="text-sm text-on-surface-variant">{product.sales}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Books */}
                <div className="glass-panel rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Top Books</h3>
                    <div className="flex flex-col gap-4">
                        {topBooks.map((book) => (
                            <div key={book.rank} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <span className="text-lg font-bold text-secondary w-6 text-center">{book.rank}</span>
                                <div className="w-12 h-16 bg-surface-container rounded overflow-hidden">
                                    <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{book.title}</p>
                                    <p className="text-sm text-on-surface-variant">{book.borrowed}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAnalyticsPage;