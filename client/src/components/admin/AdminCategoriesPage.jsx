// src/pages/admin/AdminCategoriesPage.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * AdminCategoriesPage Component
 * 
 * Allows admins to manage categories and countries across modules.
 * 
 * Features:
 * - Sub-navigation tabs: Movie Categories, Countries, Electronics Categories, Book Categories
 * - Desktop table with category details and actions
 * - Mobile card list
 * - Add/Edit modal
 * - Search and reset toolbar
 * - Pagination
 * 
 * State:
 * - activeTab: Currently selected tab
 * - categories: Array of category objects
 * - searchQuery: String
 * - showModal: Boolean
 * - editingCategory: Object or null
 */
const AdminCategoriesPage = () => {
    // Active sub-tab
    const [activeTab, setActiveTab] = useState('Movie Categories');

    // Categories data (dummy)
    const [categories, setCategories] = useState([
        {
            id: 1,
            name: 'Action',
            description: 'High-energy, fast-paced films involving physical stunts and chases.',
            assigned: '1,245',
            status: 'Active',
            icon: 'movie',
        },
        {
            id: 2,
            name: 'Sci-Fi',
            description: 'Futuristic concepts, advanced technology, space exploration, and extraterrestrial life.',
            assigned: '892',
            status: 'Active',
            icon: 'science',
        },
        {
            id: 3,
            name: 'Classic Drama',
            description: 'Older dramatic films with significant historical or cultural value.',
            assigned: '0',
            status: 'Inactive',
            icon: 'theater_comedy',
        },
    ]);

    // UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Tabs
    const tabs = ['Movie Categories', 'Countries', 'Electronics Categories', 'Book Categories'];

    // Filter categories by search
    const filteredCategories = categories.filter(
        (cat) =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle add new
    const handleAdd = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    // Handle edit
    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter((c) => c.id !== id));
        }
    };

    // Handle save
    const handleSave = (formData) => {
        if (editingCategory) {
            setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...formData } : c)));
        } else {
            const newCategory = {
                id: categories.length + 1,
                ...formData,
                assigned: '0',
                icon: 'category',
            };
            setCategories([...categories, newCategory]);
        }
        setShowModal(false);
    };

    // Status badge
    const getStatusBadge = (status) => {
        return status === 'Active'
            ? 'bg-primary/15 text-primary border-primary/20'
            : 'bg-white/10 text-on-surface-variant border-white/10';
    };

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Categories &amp; Countries</h2>
                    <p className="text-lg text-on-surface-variant">Manage categories and countries used across the platform.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-primary text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New
                </button>
            </div>

            {/* Sub-navigation tabs */}
            <div className="flex overflow-x-auto hide-scrollbar border-b border-white/10 mb-6 gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === tab
                                ? 'text-primary border-b-2 border-primary font-semibold bg-primary/5'
                                : 'text-on-surface-variant hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full sm:w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full bg-background border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <button className="text-secondary hover:text-secondary-fixed text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                    Reset
                </button>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block glass-panel rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 w-12"><input type="checkbox" className="rounded" /></th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant">Category Name</th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant">Description</th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant text-center">Assigned</th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant text-center">Status</th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((cat) => (
                                <tr key={cat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="p-4"><input type="checkbox" className="rounded" /></td>
                                    <td className="p-4 font-semibold text-white">{cat.name}</td>
                                    <td className="p-4 text-on-surface-variant max-w-xs truncate">{cat.description}</td>
                                    <td className="p-4 text-center">
                                        <span className="px-2 py-1 rounded bg-primary/15 text-primary text-xs font-semibold">
                                            {cat.assigned}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs border ${getStatusBadge(cat.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${cat.status === 'Active' ? 'bg-primary' : 'bg-on-surface-variant'}`} />
                                            {cat.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(cat)} className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-white/5" title="Edit">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-error/10" title="Delete">
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
                <div className="border-t border-white/10 p-4 flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Showing 1 to {filteredCategories.length} of {filteredCategories.length} entries</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-white/10 rounded text-on-surface-variant hover:bg-white/5">Previous</button>
                        <button className="px-3 py-1 border border-primary bg-primary/20 text-primary rounded">1</button>
                        <button className="px-3 py-1 border border-white/10 rounded text-on-surface-variant hover:bg-white/5">2</button>
                        <button className="px-3 py-1 border border-white/10 rounded text-on-surface-variant hover:bg-white/5">3</button>
                        <button className="px-3 py-1 border border-white/10 rounded text-on-surface-variant hover:bg-white/5">Next</button>
                    </div>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
                {filteredCategories.map((cat) => (
                    <div key={cat.id} className="glass-panel rounded-xl p-4 flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-secondary">{cat.icon}</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                                <p className="text-sm text-on-surface-variant mt-1">{cat.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-0.5 rounded text-xs bg-primary/15 text-primary border border-primary/20">
                                        {cat.assigned} Assigned
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs border ${getStatusBadge(cat.status)}`}>
                                        {cat.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleEdit(cat)} className="text-on-surface-variant hover:text-primary p-2">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </AdminLayout>
    );
};

/**
 * CategoryModal Component (internal)
 */
const CategoryModal = ({ category, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
        status: category?.status || 'Active',
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
                    <h3 className="text-xl font-bold text-white">{category ? 'Edit Category' : 'Add Category'}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Category Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                            placeholder="Enter name" required />
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none resize-none"
                            placeholder="Enter description" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                </form>

                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border border-secondary text-secondary hover:bg-secondary/10">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-primary text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoriesPage;