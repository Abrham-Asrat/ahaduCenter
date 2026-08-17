// src/pages/admin/AdminManageElectronicsPage.jsx
import React, { useState, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminManageElectronicsPage = () => {
    const [products, setProducts] = useState([
        { id: 1, name: 'AuraBook Pro 16"', sku: 'AB-16-M3-1TB', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80', category: 'Laptops', condition: 'New', brand: 'AuraTech', price: 2499, originalPrice: null, stock: 42, status: 'In Stock', description: 'Professional-grade laptop with M3 chip and 1TB storage.', specifications: 'M3 Pro · 18GB RAM · 1TB SSD · 16" Liquid Retina' },
        { id: 2, name: 'NovaPhone Z5 Fold', sku: 'NP-Z5-512G', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', category: 'Smartphones', condition: 'Refurbished', brand: 'NovaSystems', price: 1299, originalPrice: 1599, stock: 8, status: 'Low Stock', description: 'Foldable smartphone with 512GB storage.', specifications: 'Snapdragon 8 Gen 2 · 12GB RAM · 512GB · 7.6" AMOLED' },
        { id: 3, name: 'SonicWave Elite Headphones', sku: 'SW-E-ANC-BLK', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', category: 'Audio', condition: 'New', brand: 'SonicWave', price: 349, originalPrice: null, stock: 0, status: 'Out of Stock', description: 'Active noise-cancelling headphones with 40h battery.', specifications: 'ANC · 40hr Battery · Hi-Res Audio · Bluetooth 5.3' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [conditionFilter, setConditionFilter] = useState('All Conditions');
    const [brandFilter, setBrandFilter] = useState('All Brands');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All Categories' || p.category === categoryFilter;
        const matchesCondition = conditionFilter === 'All Conditions' || p.condition === conditionFilter;
        const matchesBrand = brandFilter === 'All Brands' || p.brand === brandFilter;
        return matchesSearch && matchesCategory && matchesCondition && matchesBrand;
    });

    const handleResetFilters = () => { setSearchQuery(''); setCategoryFilter('All Categories'); setConditionFilter('All Conditions'); setBrandFilter('All Brands'); };
    const handleAdd = () => { setEditingProduct(null); setShowModal(true); };
    const handleEdit = (p) => { setEditingProduct(p); setShowModal(true); };
    const handleDelete = (id) => { if (confirm('Delete this product?')) setProducts(products.filter((p) => p.id !== id)); };
    const handleSave = (formData) => {
        if (editingProduct) {
            setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p)));
        } else {
            setProducts([...products, { id: Date.now(), ...formData }]);
        }
        setShowModal(false);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'In Stock': return 'bg-primary/10 text-primary border-primary/20';
            case 'Low Stock': return 'bg-secondary/10 text-secondary border-secondary/20';
            case 'Out of Stock': return 'bg-error/10 text-error border-error/20';
            default: return 'bg-white/5 text-on-surface border-white/10';
        }
    };

    const getConditionBadge = (condition) => condition === 'Refurbished' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-white/5 text-on-surface border-white/10';

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Manage Electronics</h2>
                    <p className="text-on-surface-variant">Add, edit, delete, and organize electronics products.</p>
                </div>
                <button onClick={handleAdd} className="bg-primary text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer self-start sm:self-auto">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New Product
                </button>
            </div>

            {/* Toolbar */}
            <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="flex items-center bg-background rounded-lg px-3 py-2 border border-white/10 flex-1 max-w-md w-full">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg mr-2">search</span>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, SKU, or brand..." className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 transition-all duration-200" />
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer transition-all duration-200">
                        <option>All Categories</option><option>Laptops</option><option>Smartphones</option><option>Audio</option><option>Accessories</option><option>Cameras</option>
                    </select>
                    <select value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer transition-all duration-200">
                        <option>All Conditions</option><option>New</option><option>Refurbished</option><option>Used</option>
                    </select>
                    <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer transition-all duration-200">
                        <option>All Brands</option><option>AuraTech</option><option>NovaSystems</option><option>SonicWave</option>
                    </select>
                    <button onClick={handleResetFilters} className="text-secondary hover:text-secondary-fixed text-sm flex items-center cursor-pointer font-semibold">
                        <span className="material-symbols-outlined text-sm mr-1">filter_alt_off</span>Reset
                    </button>
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block glass-panel rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="py-3 px-4 w-12"><input type="checkbox" className="rounded" /></th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Product</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Category</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Condition</th>
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
                                        <span className={`px-2 py-1 rounded text-xs border ${getConditionBadge(product.condition)}`}>{product.condition}</span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="text-primary font-semibold">${product.price.toLocaleString()}</div>
                                        {product.originalPrice && <div className="text-secondary text-xs line-through">${product.originalPrice.toLocaleString()}</div>}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${product.status === 'In Stock' ? 'bg-primary' : product.status === 'Low Stock' ? 'bg-secondary' : 'bg-error'}`} />
                                            <span>{product.stock}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs border ${getStatusBadge(product.status)}`}>{product.status}</span>
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

            {/* Mobile cards */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="glass-panel rounded-xl overflow-hidden">
                        <div className="h-40 relative overflow-hidden bg-background">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 rounded text-xs border ${getStatusBadge(product.status)}`}>{product.status}</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-1 min-w-0">
                                <span className="text-xs uppercase text-on-surface-variant truncate">{product.category}</span>
                                <span className="text-base font-bold text-secondary shrink-0 ml-2">${product.price.toLocaleString()}</span>
                            </div>
                            <h3 className="text-base font-semibold text-white mb-2 truncate">{product.name}</h3>
                            <div className="flex items-center justify-between border-t border-white/10 pt-3 min-w-0">
                                <span className="text-xs text-on-surface-variant truncate min-w-0 mr-2">SKU: {product.sku}</span>
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
            <div className="flex justify-center items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {[1, 2, 3].map((n) => (
                    <button key={n} onClick={() => setCurrentPage(n)} className={`w-10 h-10 rounded-lg font-bold ${currentPage === n ? 'bg-primary text-white' : 'glass-panel text-white hover:text-primary'}`}>{n}</button>
                ))}
                <button onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            {showModal && <ProductModal product={editingProduct} onClose={() => setShowModal(false)} onSave={handleSave} />}
        </AdminLayout>
    );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* ProductModal                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        sku: product?.sku || '',
        brand: product?.brand || '',
        category: product?.category || 'Laptops',
        condition: product?.condition || 'New',
        description: product?.description || '',
        specifications: product?.specifications || '',
        price: product?.price || '',
        originalPrice: product?.originalPrice || '',
        stock: product?.stock || 0,
        warrantyMonths: product?.warrantyMonths || '',
    });

    const [photoPreviews, setPhotoPreviews] = useState(product?.imageUrl ? [product.imageUrl] : []);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const newPreviews = files.map((f) => URL.createObjectURL(f));
        setPhotoPreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
    };

    const removePhoto = (idx) => setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));

    const handleSubmit = (e) => {
        e.preventDefault();
        const stock = Number(formData.stock);
        const newStatus = stock > 10 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock';
        onSave({
            ...formData,
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
            stock,
            status: newStatus,
            imageUrl: photoPreviews[0] || product?.imageUrl || '',
            photos: photoPreviews,
        });
    };

    const inputCls = "w-full bg-background border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 placeholder-gray-500";
    const labelCls = "block text-xs uppercase text-on-surface-variant font-semibold mb-1.5 tracking-wider";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6">
            <div className="glass-panel animate-slide-up w-full max-w-2xl rounded-2xl shadow-2xl border border-white/20 flex flex-col max-h-[92vh] overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">devices</span>
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">

                    {/* Photo Upload */}
                    <div>
                        <label className={labelCls}>Product Photos <span className="text-on-surface-variant/50 normal-case font-normal">(optional, up to 5)</span></label>
                        <div className="flex flex-wrap gap-3 mb-3">
                            {photoPreviews.map((src, idx) => (
                                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 group">
                                    <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white text-xs">close</span>
                                    </button>
                                    {idx === 0 && <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-primary/80 text-black font-bold py-0.5">MAIN</span>}
                                </div>
                            ))}
                            {photoPreviews.length < 5 && (
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-lg border-2 border-dashed border-white/20 hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                                    <span className="text-[10px] font-semibold">Add</span>
                                </button>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
                        <p className="text-xs text-on-surface-variant/60">First image is the main product photo. Max 5.</p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className={labelCls}>Product Name <span className="text-error">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="Enter product name" required />
                    </div>

                    {/* SKU & Brand */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>SKU <span className="text-error">*</span></label>
                            <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={inputCls} placeholder="e.g. AB-16-M3-1TB" required />
                        </div>
                        <div>
                            <label className={labelCls}>Brand <span className="text-error">*</span></label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputCls} placeholder="Brand name" required />
                        </div>
                    </div>

                    {/* Category & Condition */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                                <option>Laptops</option><option>Smartphones</option><option>Audio</option><option>Accessories</option><option>Cameras</option><option>Tablets</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Condition</label>
                            <select name="condition" value={formData.condition} onChange={handleChange} className={inputCls}>
                                <option>New</option><option>Refurbished</option><option>Used</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Brief product description..." />
                    </div>

                    {/* Specifications */}
                    <div>
                        <label className={labelCls}>Key Specifications</label>
                        <textarea name="specifications" value={formData.specifications} onChange={handleChange} rows={2} className={`${inputCls} resize-none`} placeholder="e.g. M3 Pro · 18GB RAM · 1TB SSD · 16in display" />
                    </div>

                    {/* Price, Original Price, Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className={labelCls}>Price ($) <span className="text-error">*</span></label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className={inputCls} placeholder="0.00" required />
                        </div>
                        <div>
                            <label className={labelCls}>Original Price ($)</label>
                            <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} min="0" step="0.01" className={inputCls} placeholder="Leave blank if no discount" />
                        </div>
                        <div>
                            <label className={labelCls}>Stock Qty <span className="text-error">*</span></label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" className={inputCls} required />
                        </div>
                    </div>

                    {/* Warranty */}
                    <div>
                        <label className={labelCls}>Warranty (months)</label>
                        <input type="number" name="warrantyMonths" value={formData.warrantyMonths} onChange={handleChange} min="0" className={inputCls} placeholder="e.g. 12" />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-5 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-secondary text-secondary hover:bg-secondary/10 transition-all font-semibold">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
                        {product ? 'Save Changes' : 'Add Product'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminManageElectronicsPage;
