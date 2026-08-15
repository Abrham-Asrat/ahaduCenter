// src/pages/admin/AdminManageUsersPage.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * AdminManageUsersPage Component
 * 
 * Allows admins to manage user accounts, roles, and permissions.
 * 
 * Features:
 * - Sub-tabs: Customers (user list) and Permissions (role-permission matrix)
 * - Search bar, role filter, status filter
 * - Desktop table with user details and actions
 * - Mobile card list
 * - Add/Edit user modal
 * - Pagination
 * 
 * State:
 * - activeTab: 'customers' | 'permissions'
 * - users: Array of user objects
 * - searchQuery: String
 * - showModal: Boolean
 * - editingUser: Object or null
 */
const AdminManageUsersPage = () => {
    // Active sub-tab
    const [activeTab, setActiveTab] = useState('customers');

    // User data
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Eleanor Vance',
            email: 'eleanor.v@example.com',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhZbxoMEZyXWw4Be0Y9meM5jitFgmp2cr_T1wlzKJ-pi7bah3Uk6EyoKItonPcW5_p_hO5JFI9a5H0-9qqvPdsMciUGZgNVaQynGYwm9_nTf9_Db1UGH-VZQ3hqd1br01DpFzExdftQ0J339q5Sp-ELYJLpPrNO6zZWayNInoRM4MZYUfvpC6btY8h0UYfj6A1FQ24WxYHlDih_Q1riU-vzn4hYQrICSQVK_TJ35tHi9Z1KhsIG6uoJA',
            role: 'Admin',
            status: 'Active',
            joinedDate: 'Oct 12, 2023',
            lastActive: '2 hours ago',
            initials: null,
        },
        {
            id: 2,
            name: 'Marcus Reed',
            email: 'm.reed@example.com',
            avatarUrl: null,
            role: 'Moderator',
            status: 'Suspended',
            joinedDate: 'Nov 05, 2023',
            lastActive: '4 days ago',
            initials: 'MR',
        },
        {
            id: 3,
            name: 'Julian Black',
            email: 'julian.b@example.com',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkU5y2o0WFzWfE5yqovV9vSNxmfPnvAE_aeL3SEh_4bPoDfiBDvFwvagTh3888FPGldTr19Y-wrRN8MKxpcOhXKDpkRNOfxuxM2Tg6dcGA3lyx8QpdBk-4sp5F_VqhTwsOArbTdpbt1Z7vhDeRRbRamMQOYzxHEATuxnJpF8QdQJjpn-4LnOb5D0-gUzuoQBhVlfZNv58hTqGRD-c7oLiaLgYEBwUxeThhX9HIqv-XCznavcJ2TXe1aQ',
            role: 'Customer',
            status: 'Active',
            joinedDate: 'Jan 18, 2024',
            lastActive: 'Just now',
            initials: null,
        },
    ]);

    // UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Permissions matrix data (simplified)
    const permissions = [
        { label: 'Manage Content', icon: 'edit_document', roles: { Admin: true, Moderator: true, Customer: false } },
        { label: 'Invite Users', icon: 'group_add', roles: { Admin: true, Moderator: false, Customer: false } },
        { label: 'View Reports', icon: 'visibility', roles: { Admin: true, Moderator: true, Customer: true } },
        { label: 'System Settings', icon: 'settings_applications', roles: { Admin: true, Moderator: false, Customer: false } },
        { label: 'Delete Records', icon: 'delete_forever', roles: { Admin: true, Moderator: false, Customer: false } },
    ];

    // Filter users by search
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle add new user
    const handleAdd = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    // Handle edit
    const handleEdit = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    // Handle delete/deactivate
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter((u) => u.id !== id));
        }
    };

    // Handle toggle status (suspend/activate)
    const handleToggleStatus = (id) => {
        setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u)));
    };

    // Handle save from modal
    const handleSave = (formData) => {
        if (editingUser) {
            setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
        } else {
            const newUser = {
                id: users.length + 1,
                ...formData,
                avatarUrl: null,
                initials: formData.name.split(' ').map((n) => n[0]).join(''),
                joinedDate: 'Just now',
                lastActive: 'Just now',
            };
            setUsers([...users, newUser]);
        }
        setShowModal(false);
    };

    // Role badge styles
    const getRoleBadge = (role) => {
        switch (role) {
            case 'Admin':
                return 'bg-secondary/15 text-secondary border-secondary/30';
            case 'Moderator':
                return 'bg-tertiary/15 text-tertiary border-tertiary/30';
            case 'Customer':
                return 'bg-white/10 text-on-surface-variant border-white/20';
            default:
                return 'bg-white/5 text-on-surface-variant border-white/10';
        }
    };

    // Status badge styles
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-primary/15 text-primary border-primary/30';
            case 'Suspended':
                return 'bg-error/15 text-error border-error/30';
            default:
                return 'bg-white/5 text-on-surface-variant border-white/10';
        }
    };

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Manage Users</h2>
                    <p className="text-lg text-on-surface-variant">View, manage, and assign roles and permissions.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-primary text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
                >
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Add New User
                </button>
            </div>

            {/* Sub-navigation tabs */}
            <div className="flex border-b border-white/10 mb-6">
                <button
                    onClick={() => setActiveTab('customers')}
                    className={`px-6 py-3 text-xs uppercase tracking-wider transition-colors ${activeTab === 'customers'
                            ? 'text-primary border-b-2 border-primary font-semibold'
                            : 'text-on-surface-variant hover:text-white'
                        }`}
                >
                    Customers
                </button>
                <button
                    onClick={() => setActiveTab('permissions')}
                    className={`px-6 py-3 text-xs uppercase tracking-wider transition-colors ${activeTab === 'permissions'
                            ? 'text-primary border-b-2 border-primary font-semibold'
                            : 'text-on-surface-variant hover:text-white'
                        }`}
                >
                    Permissions
                </button>
            </div>

            {activeTab === 'customers' ? (
                <>
                    {/* Toolbar */}
                    <div className="glass-panel rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between mb-6">
                        <div className="flex-1 min-w-[250px] relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users by name or email..."
                                className="w-full bg-background border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <select className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                                <option>All Roles</option>
                                <option>Admin</option>
                                <option>Moderator</option>
                                <option>Customer</option>
                            </select>
                            <select className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                                <option>All Statuses</option>
                                <option>Active</option>
                                <option>Suspended</option>
                            </select>
                            <button className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-on-surface-variant hover:text-white hover:border-white/30 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                Joined Date
                            </button>
                        </div>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block glass-panel rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="p-4 w-12"><input type="checkbox" className="rounded" /></th>
                                        <th className="p-4 text-xs uppercase text-on-surface-variant">User</th>
                                        <th className="p-4 text-xs uppercase text-on-surface-variant">Role</th>
                                        <th className="p-4 text-xs uppercase text-on-surface-variant">Status</th>
                                        <th className="p-4 text-xs uppercase text-on-surface-variant">Joined Date</th>
                                        <th className="p-4 text-xs uppercase text-on-surface-variant">Last Active</th>
                                        <th className="p-4 text-xs uppercase text-on-surface-variant text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="p-4"><input type="checkbox" className="rounded" /></td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {user.avatarUrl ? (
                                                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center border border-white/20 text-white font-semibold">
                                                            {user.initials}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-white">{user.name}</div>
                                                        <div className="text-xs text-on-surface-variant mt-0.5">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs border ${getRoleBadge(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs border ${getStatusBadge(user.status)}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-on-surface-variant">{user.joinedDate}</td>
                                            <td className="p-4 text-sm text-on-surface-variant">{user.lastActive}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(user)} className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-white/5" title="Edit">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button onClick={() => handleToggleStatus(user.id)} className="p-1.5 text-on-surface-variant hover:text-secondary rounded hover:bg-white/5" title={user.status === 'Active' ? 'Suspend' : 'Activate'}>
                                                        <span className="material-symbols-outlined text-lg">{user.status === 'Active' ? 'block' : 'check_circle'}</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(user.id)} className="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-error/10" title="Delete">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-xs text-on-surface-variant">Showing 1 to {filteredUsers.length} of {filteredUsers.length} entries</span>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg glass-panel text-on-surface-variant hover:text-primary">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">1</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg glass-panel text-white hover:text-primary text-sm">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg glass-panel text-white hover:text-primary text-sm">3</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg glass-panel text-on-surface-variant hover:text-primary">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden flex flex-col gap-4">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="glass-panel rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center border border-white/10 text-white font-semibold">
                                            {user.initials}
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-white font-semibold">{user.name}</div>
                                        <div className="text-sm text-on-surface-variant">{user.email}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2 py-1 rounded text-xs uppercase border ${getStatusBadge(user.status)}`}>
                                        {user.status}
                                    </span>
                                    <button onClick={() => handleEdit(user)} className="text-on-surface-variant hover:text-primary">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                /* Permissions tab */
                <div className="glass-panel rounded-xl p-6">
                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Role-Permission Matrix</h3>
                        <button className="text-primary hover:text-primary-fixed text-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">save</span>
                            Save Changes
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Permission</th>
                                    <th className="py-3 px-4 text-xs uppercase text-on-surface-variant text-center">Admin</th>
                                    <th className="py-3 px-4 text-xs uppercase text-on-surface-variant text-center">Moderator</th>
                                    <th className="py-3 px-4 text-xs uppercase text-on-surface-variant text-center">Customer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.map((perm) => (
                                    <tr key={perm.label} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-on-surface-variant text-lg">{perm.icon}</span>
                                            {perm.label}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <input type="checkbox" defaultChecked={perm.roles.Admin} className="w-4 h-4 rounded accent-emerald-500" />
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <input type="checkbox" defaultChecked={perm.roles.Moderator} className="w-4 h-4 rounded accent-emerald-500" />
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <input type="checkbox" defaultChecked={perm.roles.Customer} className="w-4 h-4 rounded accent-emerald-500" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 p-3 bg-surface-container-low border border-white/5 rounded-lg flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary text-lg">info</span>
                        <p className="text-sm text-on-surface-variant">
                            Changes made to the role-permission matrix take effect immediately for all active sessions upon saving.
                        </p>
                    </div>
                </div>
            )}

            {/* Modal for Add/Edit User */}
            {showModal && (
                <UserModal
                    user={editingUser}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </AdminLayout>
    );
};

/**
 * UserModal Component (internal)
 */
const UserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'Customer',
        status: user?.status || 'Active',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-md rounded-xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-xl font-bold text-white">{user ? 'Edit User' : 'Add New User'}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                            placeholder="Enter name" required />
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                            placeholder="Enter email" required />
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                            <option>Customer</option>
                            <option>Moderator</option>
                            <option>Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                            <option>Active</option>
                            <option>Suspended</option>
                        </select>
                    </div>
                </form>

                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border border-secondary text-secondary hover:bg-secondary/10">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-primary text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        Save User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminManageUsersPage;