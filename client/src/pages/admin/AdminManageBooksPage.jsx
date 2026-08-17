// src/pages/admin/AdminManageBooksPage.jsx
import React, { useState, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminManageBooksPage = () => {
    const [activeTab, setActiveTab] = useState('Inventory');
    const [books, setBooks] = useState([
        {
            id: 1,
            title: 'The Quantum Thief',
            author: 'Hannu Rajaniemi',
            coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
            category: 'Sci-Fi',
            language: 'EN',
            totalCopies: 12,
            availableCopies: 8,
            status: 'Available',
            isbn: '978-0-575-08895-0',
            description: 'A far-future heist novel set in a post-singularity solar system.',
        },
        {
            id: 2,
            title: 'Design Systems',
            author: 'Alla Kholmatova',
            coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
            category: 'Design',
            language: 'EN',
            totalCopies: 5,
            availableCopies: 1,
            status: 'Limited',
            isbn: '978-3-945749-58-6',
            description: 'A practical guide to creating design languages for digital products.',
        },
        {
            id: 3,
            title: 'Fikir Eske Mekabir',
            author: 'Haddis Alemayehu',
            coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
            category: 'Classic',
            language: 'AM',
            totalCopies: 20,
            availableCopies: 0,
            status: 'Out of Stock',
            isbn: '',
            description: 'One of the greatest Ethiopian novels, a timeless classic.',
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, title }
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [languageFilter, setLanguageFilter] = useState('All Languages');
    const [availabilityFilter, setAvailabilityFilter] = useState('All Availability');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All Categories' || book.category === categoryFilter;
        const matchesLanguage = languageFilter === 'All Languages' || book.language === languageFilter;
        const matchesAvailability = availabilityFilter === 'All Availability' || book.status === availabilityFilter;
        return matchesSearch && matchesCategory && matchesLanguage && matchesAvailability;
    });

    const handleResetFilters = () => {
        setSearchQuery('');
        setCategoryFilter('All Categories');
        setLanguageFilter('All Languages');
        setAvailabilityFilter('All Availability');
        setCurrentPage(1);
    };

    const handleAdd = () => { setEditingBook(null); setShowModal(true); };
    const handleEdit = (book) => { setEditingBook(book); setShowModal(true); };
    const handleDelete = (id) => {
        const book = books.find((b) => b.id === id);
        setDeleteConfirm({ id, title: book?.title || 'this book' });
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            setBooks(books.filter((b) => b.id !== deleteConfirm.id));
            setDeleteConfirm(null);
        }
    };

    const handleSave = (formData) => {
        if (editingBook) {
            setBooks(books.map((b) => (b.id === editingBook.id ? { ...b, ...formData } : b)));
        } else {
            setBooks([...books, { id: Date.now(), ...formData }]);
        }
        setShowModal(false);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Available': return 'bg-primary/15 text-primary border-primary/20';
            case 'Limited': return 'bg-secondary/15 text-secondary border-secondary/20';
            case 'Out of Stock': return 'bg-error/15 text-error border-error/20';
            default: return 'bg-white/5 text-on-surface border-white/10';
        }
    };

    const tabs = ['Inventory', 'Borrowing Records', 'Reservations', 'Sales'];

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Manage Books</h2>
                    <p className="text-on-surface-variant">Manage inventory, borrowing, reservations, and sales.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-primary text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer self-start sm:self-auto"
                >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    Add New Book
                </button>
            </div>

            {/* Sub-navigation tabs */}
            <div className="glass-panel rounded-xl overflow-hidden mb-6">
                <div className="flex border-b border-white/10 overflow-x-auto hide-scrollbar bg-black/20">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-xs uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab ? 'text-primary border-b-2 border-primary bg-white/5 font-semibold' : 'text-on-surface-variant hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'Inventory' ? (
                    <div className="p-4 md:p-6 flex flex-col gap-6">
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="relative flex-1 max-w-md">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search title, author, ISBN..."
                                    className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                                />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none transition-all duration-200">
                                    <option>All Categories</option>
                                    <option>Sci-Fi</option>
                                    <option>Design</option>
                                    <option>Classic</option>
                                    <option>Fiction</option>
                                    <option>Non-Fiction</option>
                                </select>
                                <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none transition-all duration-200">
                                    <option>All Availability</option>
                                    <option>Available</option>
                                    <option>Limited</option>
                                    <option>Out of Stock</option>
                                </select>
                                <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none transition-all duration-200">
                                    <option>All Languages</option>
                                    <option>English</option>
                                    <option>Amharic</option>
                                </select>
                                <button onClick={handleResetFilters} className="text-secondary hover:text-secondary-fixed text-sm flex items-center cursor-pointer font-semibold">
                                    <span className="material-symbols-outlined text-sm mr-1">filter_alt_off</span>
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto border border-white/5 rounded-lg">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-black/20 text-xs uppercase text-on-surface-variant">
                                        <th className="p-3 w-10"><input type="checkbox" className="rounded" /></th>
                                        <th className="p-3">Cover</th>
                                        <th className="p-3">Title / Author</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3">Lang</th>
                                        <th className="p-3 text-right">Stock</th>
                                        <th className="p-3 text-center">Status</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBooks.map((book) => (
                                        <tr key={book.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="p-3"><input type="checkbox" className="rounded" /></td>
                                            <td className="p-3">
                                                <div className="w-10 h-14 rounded overflow-hidden bg-surface-variant border border-white/10">
                                                    {book.coverUrl ? (
                                                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                                            <span className="material-symbols-outlined">menu_book</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="font-semibold text-white">{book.title}</div>
                                                <div className="text-xs text-on-surface-variant">{book.author}</div>
                                            </td>
                                            <td className="p-3 text-on-surface-variant">{book.category}</td>
                                            <td className="p-3 text-on-surface-variant">{book.language}</td>
                                            <td className="p-3 text-right">{book.totalCopies} / <span className="text-primary font-bold">{book.availableCopies}</span></td>
                                            <td className="p-3 text-center">
                                                <span className={`inline-block px-2 py-1 rounded text-xs uppercase border ${getStatusBadge(book.status)}`}>{book.status}</span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(book)} className="p-1.5 text-on-surface-variant hover:text-primary" title="Edit">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(book.id)} className="p-1.5 text-on-surface-variant hover:text-error" title="Delete">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden grid grid-cols-1 gap-4">
                            {filteredBooks.map((book) => (
                                <div key={book.id} className="glass-panel rounded-xl p-4 flex gap-4 items-start">
                                    <div className="w-16 h-24 rounded overflow-hidden bg-surface-container border border-white/5 flex-shrink-0">
                                        {book.coverUrl ? (
                                            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                                <span className="material-symbols-outlined">menu_book</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-white font-semibold truncate pr-2">{book.title}</h3>
                                            <span className={`px-2 py-1 rounded text-xs uppercase border flex-shrink-0 ${getStatusBadge(book.status)}`}>{book.status}</span>
                                        </div>
                                        <p className="text-sm text-on-surface-variant mb-2 truncate">{book.author}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-on-surface-variant">{book.availableCopies}/{book.totalCopies} Copies</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(book)} className="p-1 text-on-surface-variant hover:text-primary">
                                                    <span className="material-symbols-outlined">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(book.id)} className="p-1 text-on-surface-variant hover:text-error">
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-4 flex-wrap gap-3">
                            <span className="text-sm text-on-surface-variant">Showing {filteredBooks.length} entries</span>
                            <div className="flex gap-2">
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
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">construction</span>
                        <h3 className="text-xl font-bold text-white mb-2">{activeTab} — Coming Soon</h3>
                        <p className="text-sm">This tab will be implemented in a future phase.</p>
                    </div>
                )}
            </div>

            {showModal && <BookModal book={editingBook} onClose={() => setShowModal(false)} onSave={handleSave} />}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="glass-panel animate-slide-up w-full max-w-sm rounded-2xl border border-error/30 p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-error text-3xl">delete_forever</span>
                            <h3 className="text-lg font-bold text-white">Delete Book?</h3>
                        </div>
                        <p className="text-sm text-on-surface-variant">
                            Are you sure you want to delete <span className="text-white font-semibold">"{deleteConfirm.title}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all font-semibold text-sm">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="px-5 py-2 rounded-xl bg-error text-white font-bold hover:bg-error/80 transition-all text-sm">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* BookModal                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
const BookModal = ({ book, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: book?.title || '',
        author: book?.author || '',
        isbn: book?.isbn || '',
        description: book?.description || '',
        publisher: book?.publisher || '',
        year: book?.year || new Date().getFullYear(),
        category: book?.category || 'Fiction',
        language: book?.language || 'EN',
        totalCopies: book?.totalCopies || 1,
        availableCopies: book?.availableCopies || 1,
        price: book?.price || '',
        location: book?.location || '',
    });

    const [photos, setPhotos] = useState(book?.coverUrl ? [book.coverUrl] : []);
    const [photoPreviews, setPhotoPreviews] = useState(book?.coverUrl ? [book.coverUrl] : []);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const newPreviews = files.map((f) => URL.createObjectURL(f));
        setPhotoPreviews((prev) => [...prev, ...newPreviews]);
        setPhotos((prev) => [...prev, ...newPreviews]);
    };

    const removePhoto = (idx) => {
        setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
        setPhotos((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const copies = Number(formData.availableCopies);
        const total = Number(formData.totalCopies);
        const status = copies === 0 ? 'Out of Stock' : copies < total / 2 ? 'Limited' : 'Available';
        onSave({
            ...formData,
            totalCopies: total,
            availableCopies: copies,
            status,
            coverUrl: photoPreviews[0] || book?.coverUrl || '',
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
                        <span className="material-symbols-outlined text-primary">menu_book</span>
                        {book ? 'Edit Book' : 'Add New Book'}
                    </h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">

                    {/* Photo Upload */}
                    <div>
                        <label className={labelCls}>Cover & Photos <span className="text-on-surface-variant/50 normal-case font-normal">(optional, up to 5)</span></label>
                        <div className="flex flex-wrap gap-3 mb-3">
                            {photoPreviews.map((src, idx) => (
                                <div key={idx} className="relative w-20 h-28 rounded-lg overflow-hidden border border-white/20 group">
                                    <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(idx)}
                                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-white text-xs">close</span>
                                    </button>
                                    {idx === 0 && (
                                        <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-primary/80 text-black font-bold py-0.5">COVER</span>
                                    )}
                                </div>
                            ))}
                            {photoPreviews.length < 5 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-20 h-28 rounded-lg border-2 border-dashed border-white/20 hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                                    <span className="text-[10px] font-semibold">Add Photo</span>
                                </button>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
                        <p className="text-xs text-on-surface-variant/60">First image becomes the cover. Max 5 photos.</p>
                    </div>

                    {/* Title & Author */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Title <span className="text-error">*</span></label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputCls} placeholder="Book title" required />
                        </div>
                        <div>
                            <label className={labelCls}>Author <span className="text-error">*</span></label>
                            <input type="text" name="author" value={formData.author} onChange={handleChange} className={inputCls} placeholder="Author name" required />
                        </div>
                    </div>

                    {/* ISBN & Publisher */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>ISBN</label>
                            <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} className={inputCls} placeholder="e.g. 978-0-000-00000-0" />
                        </div>
                        <div>
                            <label className={labelCls}>Publisher</label>
                            <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} className={inputCls} placeholder="Publisher name" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelCls}>Description / Synopsis</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Brief description of the book..." />
                    </div>

                    {/* Category, Language, Year */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className={labelCls}>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                                <option>Fiction</option>
                                <option>Non-Fiction</option>
                                <option>Sci-Fi</option>
                                <option>Design</option>
                                <option>Classic</option>
                                <option>Biography</option>
                                <option>History</option>
                                <option>Technology</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Language</label>
                            <select name="language" value={formData.language} onChange={handleChange} className={inputCls}>
                                <option value="EN">English</option>
                                <option value="AM">Amharic</option>
                                <option value="FR">French</option>
                                <option value="AR">Arabic</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Year Published</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputCls} placeholder="e.g. 2024" />
                        </div>
                    </div>

                    {/* Copies & Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className={labelCls}>Total Copies <span className="text-error">*</span></label>
                            <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} min="0" className={inputCls} required />
                        </div>
                        <div>
                            <label className={labelCls}>Available Copies <span className="text-error">*</span></label>
                            <input type="number" name="availableCopies" value={formData.availableCopies} onChange={handleChange} min="0" className={inputCls} required />
                        </div>
                        <div>
                            <label className={labelCls}>Price (ETB)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className={inputCls} placeholder="Leave blank if free" />
                        </div>
                    </div>

                    {/* Shelf Location */}
                    <div>
                        <label className={labelCls}>Shelf Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputCls} placeholder="e.g. Shelf A2 — Row 3" />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-5 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-secondary text-secondary hover:bg-secondary/10 transition-all font-semibold">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
                        {book ? 'Save Changes' : 'Add Book'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminManageBooksPage;
