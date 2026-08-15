// src/pages/admin/AdminManageMoviesPage.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * AdminManageMoviesPage Component
 * 
 * Allows admins to view, add, edit, delete movies.
 * 
 * Features:
 * - Search and filter toolbar
 * - Desktop: table with checkboxes, poster, title, genre, country, year, type, status, actions
 * - Tablet/Mobile: card grid with poster, title, genre, status, edit/delete actions
 * - Add/Edit modal with form fields
 * - Pagination
 * 
 * State:
 * - movies: Array of movie objects
 * - searchQuery: String
 * - showModal: Boolean
 * - editingMovie: Object or null
 */
const AdminManageMoviesPage = () => {
    // Movie data
    const [movies, setMovies] = useState([
        {
            id: 1,
            title: 'Inception',
            posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=400&q=80',
            genre: 'Sci-Fi',
            country: 'USA',
            year: 2024,
            type: 'Feature Film',
            status: 'Available',
            rating: 8.4,
        },
        {
            id: 2,
            title: 'Interstellar',
            posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80',
            genre: 'Drama',
            country: 'UK',
            year: 2023,
            type: 'Feature Film',
            status: 'Coming Soon',
            rating: 7.9,
        },
        {
            id: 3,
            title: 'The Matrix',
            posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
            genre: 'Action',
            country: 'Japan',
            year: 2025,
            type: 'Short Film',
            status: 'Available',
            rating: 8.0,
        },
    ]);

    // UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All Genres');
    const [selectedCountry, setSelectedCountry] = useState('All Countries');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [showModal, setShowModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter movies by search query, genre, country, status
    const filteredMovies = movies.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'All Genres' || movie.genre === selectedGenre;
        const matchesCountry = selectedCountry === 'All Countries' || movie.country === selectedCountry;
        const matchesStatus = selectedStatus === 'All Status' || movie.status === selectedStatus;
        return matchesSearch && matchesGenre && matchesCountry && matchesStatus;
    });

    // Handle add new movie button
    const handleAdd = () => {
        setEditingMovie(null);
        setShowModal(true);
    };

    // Handle edit button
    const handleEdit = (movie) => {
        setEditingMovie(movie);
        setShowModal(true);
    };

    // Handle delete button
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this movie?')) {
            setMovies(movies.filter((m) => m.id !== id));
        }
    };

    // Handle save from modal
    const handleSave = (formData) => {
        if (editingMovie) {
            // Update existing
            setMovies(movies.map((m) => (m.id === editingMovie.id ? { ...m, ...formData } : m)));
        } else {
            // Add new
            const newMovie = {
                id: movies.length + 1,
                ...formData,
                posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80',
            };
            setMovies([...movies, newMovie]);
        }
        setShowModal(false);
    };

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Manage Movies</h2>
                    <p className="text-lg text-on-surface-variant">Add, edit, delete, and organize movie content.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-primary text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] font-bold transition-all"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New Movie
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
                        placeholder="Search movies by title..."
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
                    >
                        <option>All Genres</option>
                        <option>Sci-Fi</option>
                        <option>Drama</option>
                        <option>Action</option>
                        <option>Thriller</option>
                    </select>
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
                    >
                        <option>All Countries</option>
                        <option>Ethiopia</option>
                        <option>USA</option>
                        <option>UK</option>
                        <option>Japan</option>
                    </select>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer"
                    >
                        <option>All Status</option>
                        <option>Available</option>
                        <option>Coming Soon</option>
                    </select>
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block glass-panel rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="py-3 px-4 w-12"><input type="checkbox" className="rounded" /></th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Poster</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Title</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Genre</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Country</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Year</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Type</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Status</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMovies.map((movie) => (
                                <tr key={movie.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4"><input type="checkbox" className="rounded" /></td>
                                    <td className="py-3 px-4">
                                        <img src={movie.posterUrl} alt={movie.title} className="w-12 h-16 object-cover rounded border border-white/10" />
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-white">{movie.title}</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-secondary/10 border border-secondary/30 rounded text-xs uppercase text-secondary">
                                            {movie.genre}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-on-surface-variant">{movie.country}</td>
                                    <td className="py-3 px-4 text-sm text-on-surface-variant">{movie.year}</td>
                                    <td className="py-3 px-4 text-sm text-on-surface-variant">{movie.type}</td>
                                    <td className="py-3 px-4">
                                        {movie.status === 'Available' ? (
                                            <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs uppercase text-primary flex items-center gap-1 w-fit">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                Available
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-secondary/10 border border-secondary/30 rounded-full text-xs uppercase text-secondary flex items-center gap-1 w-fit">
                                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                                Coming Soon
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button onClick={() => handleEdit(movie)} className="p-1 text-on-surface-variant hover:text-primary transition-colors mr-1" title="Edit">
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(movie.id)} className="p-1 text-on-surface-variant hover:text-error transition-colors" title="Delete">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile/Tablet cards */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMovies.map((movie) => (
                    <div key={movie.id} className="glass-panel rounded-xl overflow-hidden relative">
                        <div className="aspect-[2/3] w-full relative">
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2">
                                {movie.status === 'Available' ? (
                                    <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs border border-primary/30">ACTIVE</span>
                                ) : (
                                    <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs border border-secondary/30">DRAFT</span>
                                )}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white truncate">{movie.title}</h3>
                            <p className="text-sm text-on-surface-variant mt-1">{movie.genre} • {movie.year}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-secondary">{movie.rating ? `${movie.rating}/5` : '-'}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(movie)} className="p-1 text-on-surface-variant hover:text-primary">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(movie.id)} className="p-1 text-on-surface-variant hover:text-error">
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
                <button className="w-10 h-10 rounded-lg glass-panel text-white hover:text-primary">12</button>
                <button className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <MovieModal
                    movie={editingMovie}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </AdminLayout>
    );
};

/**
 * MovieModal Component (internal)
 * Displays add/edit form in a modal.
 */
const MovieModal = ({ movie, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: movie?.title || '',
        description: '',
        genre: movie?.genre || 'Action',
        country: movie?.country || 'USA',
        year: movie?.year || new Date().getFullYear(),
        type: movie?.type || 'Feature Film',
        status: movie?.status || 'Available',
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
            <div className="glass-panel w-full max-w-2xl rounded-xl shadow-2xl border border-white/20 flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-2xl font-bold text-white">{movie ? 'Edit Movie' : 'Add New Movie'}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Movie Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="Enter title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-on-surface-variant mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                            placeholder="Enter synopsis..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Country</label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                            >
                                <option>USA</option>
                                <option>UK</option>
                                <option>Japan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-on-surface-variant mb-2">Year</label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border border-secondary text-secondary hover:bg-secondary/10 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 rounded-lg bg-primary text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
                    >
                        Save Movie
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminManageMoviesPage;