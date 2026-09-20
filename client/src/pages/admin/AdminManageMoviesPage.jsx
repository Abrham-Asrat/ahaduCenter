// src/pages/admin/AdminManageMoviesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  fetchAdminMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../../redux/slices/adminSlice';

const AdminManageMoviesPage = () => {
    const dispatch = useDispatch();
    const { movies, loading, error } = useSelector((s) => s.admin);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All Genres');
    const [selectedCountry, setSelectedCountry] = useState('All Countries');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [showModal, setShowModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [actionError, setActionError] = useState(null);

    useEffect(() => {
        dispatch(fetchAdminMovies());
    }, [dispatch]);

    const filteredMovies = movies.filter((m) => {
        const title = m.title || '';
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
        const genreStr = Array.isArray(m.genres) ? m.genres[0] : '';
        const matchesGenre = selectedGenre === 'All Genres' || genreStr === selectedGenre;
        const matchesCountry = selectedCountry === 'All Countries' || (m.country || 'USA') === selectedCountry;
        const matchesStatus = selectedStatus === 'All Status' || (m.releaseDate ? 'Available' : 'Coming Soon') === selectedStatus;
        return matchesSearch && matchesGenre && matchesCountry && matchesStatus;
    });

    const handleAdd = () => { setActionError(null); setEditingMovie(null); setShowModal(true); };
    const handleEdit = (movie) => { setActionError(null); setEditingMovie(movie); setShowModal(true); };
    const handleDelete = async (id) => {
        if (confirm('Delete this movie?')) {
            setActionError(null);
            try {
                await dispatch(deleteMovie(id)).unwrap();
            } catch (err) {
                setActionError(typeof err === 'string' ? err : 'Failed to delete movie');
            }
        }
    };
    const handleSave = async (formData) => {
        setActionError(null);
        try {
            if (editingMovie) {
                const targetId = editingMovie._id || editingMovie.id;
                await dispatch(updateMovie({ id: targetId, payload: formData })).unwrap();
            } else {
                await dispatch(createMovie(formData)).unwrap();
            }
            setShowModal(false);
        } catch (err) {
            setActionError(typeof err === 'string' ? err : 'Failed to save movie');
        }
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Manage Movies</h2>
                    <p className="text-on-surface-variant">Add, edit, delete, and organize movie content.</p>
                </div>
                <button onClick={handleAdd} className="bg-primary text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] font-bold transition-all self-start sm:self-auto">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New Movie
                </button>
            </div>

            {(error || actionError) && (
                <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-3">
                    <span className="material-symbols-outlined flex-shrink-0">error</span>
                    <span>{actionError || error}</span>
                </div>
            )}

            {/* Toolbar */}
            <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="flex items-center bg-background rounded-lg px-3 py-2 border border-white/10 flex-1 max-w-md w-full">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg mr-2">search</span>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by title..." className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 transition-all duration-200" />
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer transition-all duration-200">
                        <option>All Genres</option><option>Sci-Fi</option><option>Drama</option><option>Action</option><option>Thriller</option><option>Comedy</option>
                    </select>
                    <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer transition-all duration-200">
                        <option>All Countries</option><option>Ethiopia</option><option>USA</option><option>UK</option><option>Japan</option><option>Korea</option>
                    </select>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none cursor-pointer transition-all duration-200">
                        <option>All Status</option><option>Available</option><option>Coming Soon</option>
                    </select>
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block glass-panel rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="py-3 px-4 w-12"><input type="checkbox" className="rounded" /></th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Poster</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Title / Director</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Genre</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Country</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Year</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant">Status</th>
                                <th className="py-3 px-4 text-xs uppercase text-on-surface-variant text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMovies.map((movie) => (
                                <tr key={movie._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-3 px-4"><input type="checkbox" className="rounded" /></td>
                                    <td className="py-3 px-4">
                                        <img src={movie.posterUrl} alt={movie.title} className="w-10 h-14 object-cover rounded border border-white/10" />
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-semibold text-white">{movie.title}</div>
                                        <div className="text-xs text-on-surface-variant">{movie.director || '—'}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-secondary/10 border border-secondary/30 rounded text-xs uppercase text-secondary">{movie.genres?.[0] || '—'}</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-on-surface-variant">{movie.country}</td>
                                    <td className="py-3 px-4 text-sm text-on-surface-variant">{movie.year}</td>
                                    <td className="py-3 px-4">
                                        {movie.releaseDate ? (
                                            <span className="px-2 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs uppercase text-primary flex items-center gap-1 w-fit">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Available
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-secondary/10 border border-secondary/30 rounded-full text-xs uppercase text-secondary flex items-center gap-1 w-fit">
                                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Coming Soon
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(movie)} className="p-1.5 text-on-surface-variant hover:text-primary" title="Edit">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(movie._id)} className="p-1.5 text-on-surface-variant hover:text-error" title="Delete">
                                                <span className="material-symbols-outlined text-lg">delete</span>
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
                {filteredMovies.map((movie) => (
                    <div key={movie._id} className="glass-panel rounded-xl overflow-hidden">
                        <div className="aspect-[2/3] w-full relative">
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2">
                                {movie.releaseDate
                                    ? <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs border border-primary/30">ACTIVE</span>
                                    : <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs border border-secondary/30">SOON</span>}
                            </div>
                        </div>
                        <div className="p-4 min-w-0">
                            <h3 className="text-base font-semibold text-white truncate">{movie.title}</h3>
                            <p className="text-sm text-on-surface-variant mt-1 truncate">{movie.genres?.[0] || '—'} • {movie.year}</p>
                            <div className="flex justify-between items-center mt-3 min-w-0">
                                <span className="text-sm text-secondary">{movie.rating ? `★ ${movie.rating}` : '—'}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(movie)} className="p-1 text-on-surface-variant hover:text-primary">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(movie._id)} className="p-1 text-on-surface-variant hover:text-error">
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

            {showModal && <MovieModal movie={editingMovie} onClose={() => setShowModal(false)} onSave={handleSave} />}
        </AdminLayout>
    );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* MovieModal                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
const MovieModal = ({ movie, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: movie?.title || '',
        director: movie?.director || '',
        cast: movie?.cast || [],
        description: movie?.description || '',
        genres: movie?.genres || ['Action'],
        country: movie?.country || 'Ethiopia',
        year: movie?.year || new Date().getFullYear(),
        runtime: movie?.runtime || '',
        rating: movie?.rating || '',
        trailerUrl: movie?.trailerUrl || '',
    });

    const [photoPreviews, setPhotoPreviews] = useState(movie?.posterUrl ? [movie.posterUrl] : []);
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
        onSave({
            ...formData,
            genres: Array.isArray(formData.genres) ? formData.genres : [formData.genres],
            cast: typeof formData.cast === 'string' ? formData.cast.split(',').map((name) => ({ name: name.trim() })).filter((member) => member.name) : formData.cast,
            posterUrl: photoPreviews[0] || movie?.posterUrl || '',
            screenshots: photoPreviews.slice(1),
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
                        <span className="material-symbols-outlined text-primary">movie</span>
                        {movie ? 'Edit Movie' : 'Add New Movie'}
                    </h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">

                    {/* Photo Upload */}
                    <div>
                        <label className={labelCls}>Poster & Screenshots <span className="text-on-surface-variant/50 normal-case font-normal">(optional, up to 5)</span></label>
                        <div className="flex flex-wrap gap-3 mb-3">
                            {photoPreviews.map((src, idx) => (
                                <div key={idx} className="relative w-20 h-28 rounded-lg overflow-hidden border border-white/20 group">
                                    <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white text-xs">close</span>
                                    </button>
                                    {idx === 0 && <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-primary/80 text-black font-bold py-0.5">POSTER</span>}
                                </div>
                            ))}
                            {photoPreviews.length < 5 && (
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-28 rounded-lg border-2 border-dashed border-white/20 hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                                    <span className="text-[10px] font-semibold">Add Photo</span>
                                </button>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
                        <p className="text-xs text-on-surface-variant/60">First image becomes the poster. Max 5 photos.</p>
                    </div>

                    {/* Title & Director */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Title <span className="text-error">*</span></label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputCls} placeholder="Movie title" required />
                        </div>
                        <div>
                            <label className={labelCls}>Director</label>
                            <input type="text" name="director" value={formData.director} onChange={handleChange} className={inputCls} placeholder="Director name" />
                        </div>
                    </div>

                    {/* Cast */}
                    <div>
                        <label className={labelCls}>Cast</label>
                            <input type="text" name="cast" value={Array.isArray(formData.cast) ? formData.cast.map((member) => member.name).join(', ') : formData.cast} onChange={handleChange} className={inputCls} placeholder="e.g. Actor A, Actor B, Actor C" />
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelCls}>Synopsis</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Brief synopsis of the movie..." />
                    </div>

                    {/* Genre, Country, Year, Duration */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <label className={labelCls}>Genre</label>
                            <select name="genres" value={formData.genres[0] || ''} onChange={(e) => setFormData((prev) => ({ ...prev, genres: [e.target.value] }))} className={inputCls}>
                                <option>Action</option><option>Drama</option><option>Sci-Fi</option><option>Thriller</option><option>Comedy</option><option>Horror</option><option>Romance</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Country</label>
                            <select name="country" value={formData.country} onChange={handleChange} className={inputCls}>
                                <option>Ethiopia</option><option>USA</option><option>UK</option><option>Japan</option><option>Korea</option><option>France</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Year</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputCls} placeholder="2024" />
                        </div>
                        <div>
                            <label className={labelCls}>Duration (min)</label>
                            <input type="text" name="runtime" value={formData.runtime} onChange={handleChange} className={inputCls} placeholder="2h 15m" />
                        </div>
                    </div>

                    {/* Type, Rating, Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className={labelCls}>Type</label>
                            <input type="text" value="Movie" readOnly className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Rating (0–10)</label>
                            <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="10" step="0.1" className={inputCls} placeholder="8.5" />
                        </div>
                        <div>
                            <label className={labelCls}>Status</label>
                            <input type="text" name="releaseDate" value={formData.releaseDate || ''} onChange={handleChange} className={inputCls} placeholder="YYYY-MM-DD" />
                        </div>
                    </div>

                    {/* Trailer URL */}
                    <div>
                        <label className={labelCls}>Trailer URL (YouTube embed)</label>
                        <input type="url" name="trailerUrl" value={formData.trailerUrl} onChange={handleChange} className={inputCls} placeholder="https://www.youtube.com/embed/..." />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-5 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-secondary text-secondary hover:bg-secondary/10 transition-all font-semibold">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-primary text-black font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
                        {movie ? 'Save Changes' : 'Add Movie'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminManageMoviesPage;
