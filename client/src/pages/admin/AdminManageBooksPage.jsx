// src/pages/admin/AdminManageBooksPage.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * AdminManageBooksPage Component
 * 
 * Allows admins to manage book inventory, borrowing, reservations, and sales.
 * 
 * Features:
 * - Sub-navigation tabs: Inventory, Borrowing Records, Reservations, Sales
 * - Desktop table with cover, title, author, category, language, stock, status, actions
 * - Mobile/tablet card view
 * - Add/Edit modal with form fields
 * - Pagination
 * 
 * State:
 * - activeTab: Currently selected tab
 * - books: Array of book objects
 * - showModal: Boolean for modal
 * - editingBook: Book being edited or null
 */
const AdminManageBooksPage = () => {
    // Active sub-tab
    const [activeTab, setActiveTab] = useState('Inventory');

    // Book data
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
        },
    ]);

    // UI state
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [languageFilter, setLanguageFilter] = useState('All Languages');
    const [availabilityFilter, setAvailabilityFilter] = useState('All Availability');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter books by search, category, availability, language
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

    const handleExportCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + ["ID,Title,Author,Category,Language,TotalCopies,AvailableCopies,Status", ...books.map(b => `${b.id},"${b.title}","${b.author}",${b.category},${b.language},${b.totalCopies},${b.availableCopies},${b.status}`)].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "books_inventory.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle add new book
    const handleAdd = () => {
        setEditingBook(null);
        setShowModal(true);
    };

    // Handle edit
    const handleEdit = (book) => {
        setEditingBook(book);
        setShowModal(true);
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this book?')) {
            setBooks(books.filter((b) => b.id !== id));
        }
    };

    // Handle save from modal
    const handleSave = (formData) => {
        if (editingBook) {
            setBooks(books.map((b) => (b.id === editingBook.id ? { ...b, ...formData } : b)));
        } else {
            const newBook = {
                id: books.length + 1,
                ...formData,
                coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
            };
            setBooks([...books, newBook]);
        }
        setShowModal(false);
    };

    // Status badge styles
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Available':
                return 'bg-primary/15 text-primary border-primary/20';
            case 'Limited':
                return 'bg-secondary/15 text-secondary border-secondary/20';
            case 'Out of Stock':
                return 'bg-error/15 text-error border-error/20';
            default:
                return 'bg-white/5 text-on-surface border-white/10';
        }
    };

    // Stock dot color
    const getStockDot = (status) => {
        switch (status) {
            case 'Available':
                return 'bg-primary';
            case 'Limited':
                return 'bg-secondary';
            case 'Out of Stock':
                return 'bg-error';
            default:
                return 'bg-on-surface-variant';
        }
    };

    const tabs = ['Inventory', 'Borrowing Records', 'Reservations', 'Sales'];

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Manage Books</h2>
                    <p className="text-lg text-on-surface-variant">Manage inventory, borrowing, reservations, and sales.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="border border-secondary text-secondary px-5 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/10 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export CSV
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-primary text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        Add New Book
                    </button>
                </div>
            </div>

            {/* Sub-navigation tabs */}
            <div className="glass-panel rounded-xl overflow-hidden mb-6">
                <div className="flex border-b border-white/10 overflow-x-auto hide-scrollbar bg-black/20">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-xs uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab
                                    ? 'text-primary border-b-2 border-primary bg-white/5 font-semibold'
                                    : 'text-on-surface-variant hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Only render Inventory tab content for now */}
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
                                    className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                                    <option>All Categories</option>
                                    <option>Sci-Fi</option>
                                    <option>Design</option>
                                    <option>Classic</option>
                                </select>
                                <select
                                    value={availabilityFilter}
                                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                                    <option>All Availability</option>
                                    <option>Available</option>
                                    <option>Limited</option>
                                    <option>Out of Stock</option>
                                </select>
                                <select
                                    value={languageFilter}
                                    onChange={(e) => setLanguageFilter(e.target.value)}
                                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                                    <option>All Languages</option>
                                    <option>English</option>
                                    <option>Amharic</option>
                                </select>
                            </div>
                        </div>

                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto border border-white/5 rounded-lg">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-black/20 text-xs uppercase text-on-surface-variant">
                                        <th className="p-3 w-10"><input type="checkbox" className="rounded" /></th>
                                        <th className="p-3">Cover</th>
                                        <th className="p-3">Title</th>
                                        <th className="p-3">Author</th>
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
                                            <td className="p-3 font-semibold text-white">{book.title}</td>
                                            <td className="p-3 text-on-surface-variant">{book.author}</td>
                                            <td className="p-3 text-on-surface-variant">{book.category}</td>
                                            <td className="p-3 text-on-surface-variant">{book.language}</td>
                                            <td className="p-3 text-right">
                                                {book.totalCopies} / <span className="text-primary font-bold">{book.availableCopies}</span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`inline-block px-2 py-1 rounded text-xs uppercase border ${getStatusBadge(book.status)}`}>
                                                    {book.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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

                        {/* Mobile/Tablet cards */}
                        <div className="md:hidden grid grid-cols-1 gap-4">
                            {filteredBooks.map((book) => (
                                <div key={book.id} className="glass-panel rounded-xl p-4 flex gap-4 items-start relative">
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
                                            <span className={`px-2 py-1 rounded text-xs uppercase border ${getStatusBadge(book.status)}`}>
                                                {book.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-on-surface-variant mb-2 truncate">{book.author}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-on-surface-variant">
                                                {book.availableCopies} / {book.totalCopies} Copies
                                            </span>
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
                        <div className="flex items-center justify-between border-t border-white/10 pt-4">
                            <span className="text-sm text-on-surface-variant">Showing 1 to {filteredBooks.length} of {filteredBooks.length} entries</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                {[1, 2, 3].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setCurrentPage(n)}
                                        className={`w-10 h-10 rounded-lg font-bold ${currentPage === n ? 'bg-primary text-white' : 'glass-panel text-white hover:text-primary'}`}>
                                        {n}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">construction</span>
                        <h3 className="text-xl font-bold text-white mb-2">{activeTab} - Coming Soon</h3>
                        <p className="text-sm">This tab will be fully implemented in a future phase.</p>
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <BookModal
                    book={editingBook}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </AdminLayout>
    );
};

/**
 * BookModal Component (internal)
 * Displays add/edit form for books.
 */
const BookModal = ({ book, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: book?.title || '',
        author: book?.author || '',
        category: book?.category || 'Fiction',
        language: book?.language || 'EN',
        totalCopies: book?.totalCopies || 10,
        availableCopies: book?.availableCopies || 10,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const status =
            formData.availableCopies === 0
                ? 'Out of Stock'
                : formData.availableCopies < formData.totalCopies / 2
                    ? 'Limited'
                    : 'Available';
        onSave({ ...formData, status });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass-panel animate-slide-up w-full max-w-2xl rounded-xl shadow-2xl border border-white/20 flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-2xl font-bold text-white">{book ? 'Edit Book' : 'Add New Book'}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                            placeholder="Enter book title" required />
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Author</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                            placeholder="Enter author name" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                                <option>Fiction</option>
                                <option>Sci-Fi</option>
                                <option>Design</option>
                                <option>Classic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Language</label>
                            <select name="language" value={formData.language} onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                                <option>EN</option>
                                <option>AM</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Total Copies</label>
                            <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Available Copies</label>
                            <input type="number" name="availableCopies" value={formData.availableCopies} onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none" required />
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border border-secondary text-secondary hover:bg-secondary/10">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-primary text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        Save Book
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminManageBooksPage;