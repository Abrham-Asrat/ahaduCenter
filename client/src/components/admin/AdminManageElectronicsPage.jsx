// src/pages/admin/AdminManageElectronicsPage.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * AdminManageElectronicsPage Component
 * 
 * Allows admins to manage electronics inventory (CRUD).
 * 
 * Features:
 * - Search by name/SKU/brand
 * - Filters: category, condition, brand
 * - Desktop table with product details, price, stock, status, actions
 * - Mobile/tablet card grid
 * - Add/Edit modal with form fields
 * - Pagination
 * 
 * State:
 * - products: Array of product objects
 * - searchQuery: String
 * - showModal: Boolean
 * - editingProduct: Object or null
 */
const AdminManageElectronicsPage = () => {
    // Product data
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'AuraBook Pro 16"',
            sku: 'AB-16-M3-1TB',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaniux9GWXXuHOrx3HAWl9vQURfKwpZtHmgEGV3ffb_1iGFIJdCasbJDU1ZNy942E9vb2lPgmGtlrY8X5uKKl6ysnSb3XwKqMijbeTOc0BRPK_KFoOUiCMQRRnMPihRV4ZXTlBlZNoncedH7qygkJw8CZ7vDPukfuQ5-JIOuCS-h5o6U1mpU3EMO9cadIb4NjRqmTOl0d8lA3jTJ4KKh52VOXAgxurRiNwKvkU0sAgkwVfCclXv80g_A',
            category: 'Laptops',
            condition: 'New',
            brand: 'AuraTech',
            price: 2499,
            originalPrice: null,
            stock: 42,
            status: 'In Stock',
        },
        {
            id: 2,
            name: 'NovaPhone Z5 Fold',
            sku: 'NP-Z5-512G',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfPVeoOj9geNM8nroF94pyWA-396GRS4CfxOn0AEECoXwQjxea1bwt7qmMQAf9ExYENGZlVqM5wQel24XQKBa6SU1n6BXr-5dbVTtZqBkD-3Mg9Z6JPC-BfCditCClCEKmm7uW39jXvIm-ZwZUhEOrFpEaSyU6MZOnRsXLuBGs0n2WDOYybBZ2yDnpyfXeAKIwig3CteYCUgmwYoYPp87nQ6RxmxSNv7R4CjrVdC6qYJ-EjvBYVnRSEg',
            category: 'Smartphones',
            condition: 'Refurbished',
            brand: 'NovaSystems',
            price: 1299,
            originalPrice: 1599,
            stock: 8,
            status: 'Low Stock',
        },
        {
            id: 3,
            name: 'SonicWave Elite',
            sku: 'SW-E-ANC-BLK',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3ZP7Iun0e-A-FhQzc-oQ95xlpW7XrzJ9VMzFWF363A7oS49aEhmhKgZhWpUYp2_c2BHMwx3AfmXgGESmFdKL_HsX25uRxdQ7I3-BhEDkj2G-2AgPqdR_uaRWnVuEcBd_nALtVOlooL7pQk2ebnKM3n3cuqtT8R8DDd4DuWnoFNNMrYs9yHu7r0CiQREeQBavgG0XA691pdpMylamH0ESvp4nkJcxuAJcvV_a3rXAKtFL1alfKWZGmDQ',
            category: 'Audio',
            condition: 'New',
            brand: 'SonicWave',
            price: 349,
            originalPrice: null,
            stock: 0,
            status: 'Out of Stock',
        },
    ]);

    // UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Filter products by search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle add new product
    const handleAdd = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    // Handle edit button
    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    // Handle delete button
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter((p) => p.id !== id));
        }
    };

    // Handle save from modal
    const handleSave = (formData) => {
        if (editingProduct) {
            setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p)));
        } else {
            const newProduct = {
                id: products.length + 1,
                ...formData,
                imageUrl: 'https://via.placeholder.com/300x300?text=New+Product',
            };
            setProducts([...products, newProduct]);
        }
        setShowModal(false);
    };

    // Status badge styles
    const getStatusBadge = (status) => {
        switch (status) {
            case 'In Stock':
                return 'bg-primary/10 text-primary border-primary/20';
            case 'Low Stock':
                return 'bg-secondary/10 text-secondary border-secondary/20';
            case 'Out of Stock':
                return 'bg-error/10 text-error border-error/20';
            default:
                return 'bg-white/5 text-on-surface border-white/10';
        }
    };

    // Condition badge styles
    const getConditionBadge = (condition) => {
        switch (condition) {
            case 'New':
                return 'bg-white/5 text-on-surface border-white/10';
            case 'Refurbished':
                return 'bg-secondary/10 text-secondary border-secondary/20';
            default:
                return 'bg-white/5 text-on-surface border-white/10';
        }
    };

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Manage Electronics Inventory</h2>
                    <p className="text-lg text-on-surface-variant">Add, edit, delete, and organize electronics products.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-primary text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New Product
                </button>
            </div>

            {/* Toolbar */}
            <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="flex items-center bg-background rounded-lg px-3 py-2 border border-white/10 flex-1 max-w-md">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg mr-2">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, SKU, or brand..."
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <select className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                        <option>All Categories</option>
                        <option>Laptops</option>
                        <option>Smartphones</option>
                        <option>Audio</option>
                    </select>
                    <select className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                        <option>All Conditions</option>
                        <option>New</option>
                        <option>Refurbished</option>
                    </select>
                    <select className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                        <option>All Brands</option>
                        <option>AuraTech</option>
                        <option>NovaSystems</option>
                        <option>SonicWave</option>
                    </select>
                    <button className="text-secondary hover:text-secondary-fixed text-sm flex items-center">
                        <span className="material-symbols-outlined text-sm mr-1">filter_alt_off</span>
                        Reset
                    </button>
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block glass-panel rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="py-3 px-4 w-12"><input type="checkbox" className="rounded" /></th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Product</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Category</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Condition</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Brand</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant text-right">Price</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant text-center">Stock</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant text-center">Status</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-3 px-4"><input type="checkbox" className="rounded" /></td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded bg-surface border border-white/10 overflow-hidden shrink-0">
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white group-hover:text-primary transition-colors">{product.name}</div>
                                                <div className="text-on-surface-variant text-xs font-mono">SKU: {product.sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-on-surface-variant">{product.category}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-xs border ${getConditionBadge(product.condition)}`}>
                                            {product.condition}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-on-surface-variant">{product.brand}</td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="text-primary font-semibold">${product.price.toLocaleString()}</div>
                                        {product.originalPrice && (
                                            <div className="text-secondary text-xs line-through">${product.originalPrice.toLocaleString()}</div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${product.status === 'In Stock' ? 'bg-primary' : product.status === 'Low Stock' ? 'bg-secondary' : 'bg-error'
                                                }`} />
                                            <span>{product.stock}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs border ${getStatusBadge(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(product)} className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-primary/10">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-error/10">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile/Tablet cards */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="glass-panel rounded-xl overflow-hidden relative">
                        <div className="h-48 relative overflow-hidden bg-background">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 rounded text-xs border ${getStatusBadge(product.status)}`}>
                                    {product.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs uppercase text-on-surface-variant">{product.category}</span>
                                <span className="text-lg font-bold text-secondary">${product.price.toLocaleString()}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-3">{product.name}</h3>
                            <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                <span className="text-xs text-on-surface-variant">SKU: {product.sku}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(product)} className="p-1 text-on-surface-variant hover:text-primary">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="p-1 text-on-surface-variant hover:text-error">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center gap-2">
                <button className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 rounded-lg bg-primary text-white font-bold">1</button>
                <button className="w-10 h-10 rounded-lg glass-panel text-white hover:text-primary">2</button>
                <button className="w-10 h-10 rounded-lg glass-panel text-white hover:text-primary">3</button>
                <span className="text-on-surface-variant">...</span>
                <button className="w-10 h-10 rounded-lg glass-panel text-white hover:text-primary">10</button>
                <button className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </AdminLayout>
    );
};

/**
 * ProductModal Component (internal)
 * Displays add/edit form in a modal.
 */
const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        sku: product?.sku || '',
        category: product?.category || 'Laptops',
        condition: product?.condition || 'New',
        brand: product?.brand || 'AuraTech',
        price: product?.price || 0,
        stock: product?.stock || 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newStatus = formData.stock > 10 ? 'In Stock' : formData.stock > 0 ? 'Low Stock' : 'Out of Stock';
        onSave({ ...formData, status: newStatus });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-2xl rounded-xl shadow-2xl border border-white/20 flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-2xl font-bold text-white">{product ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                            placeholder="Enter product name" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">SKU</label>
                            <input type="text" name="sku" value={formData.sku} onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                placeholder="SKU" required />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Brand</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                placeholder="Brand" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                                <option>Laptops</option>
                                <option>Smartphones</option>
                                <option>Audio</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Condition</label>
                            <select name="condition" value={formData.condition} onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                                <option>New</option>
                                <option>Refurbished</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                required />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                required />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border border-secondary text-secondary hover:bg-secondary/10">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-primary text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        Save Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminManageElectronicsPage;