// src/pages/MovieRequestPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { movieService } from '../services/movieService';

const MovieRequestPage = () => {
  const location = useLocation();

  // Toast state
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'
  const [selectedRequestModal, setSelectedRequestModal] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Pre-fill title if coming from MovieDetail query string (e.g. ?movie=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const movieParam = params.get('movie');
    if (movieParam) {
      setFormData((prev) => ({ ...prev, title: movieParam }));
    }
  }, [location.search]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'Movie',
    year: '',
    genre: '',
    details: '',
  });

  // Request history state
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Cancel state — track which request ids are being cancelled
  const [cancellingIds, setCancellingIds] = useState(new Set());

  // Fetch user's movie requests on mount
  const fetchRequests = async () => {
    setLoadingRequests(true);
    setFetchError(null);
    try {
      const data = await movieService.getUserMovieRequests();
      // API may return { data: [...] } or a raw array
      setRequests(Array.isArray(data) ? data : (data?.data ?? []));
    } catch (err) {
      setFetchError(typeof err === 'string' ? err : 'Failed to load your requests.');
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title.trim(),
      type: formData.type,
      year: formData.year || undefined,
      genre: formData.genre || undefined,
      details: formData.details || undefined,
    };

    setSubmitting(true);
    setSubmitError(null);
    try {
      await movieService.submitMovieRequest(payload);
      // Clear form on success and re-fetch the list
      setFormData({ title: '', type: 'Movie', year: '', genre: '', details: '' });
      showToast(`Request for "${payload.title}" submitted successfully!`, 'success');
      await fetchRequests();
    } catch (err) {
      // Show server error without clearing form
      const message = typeof err === 'string' ? err : 'Failed to submit request. Please try again.';
      setSubmitError(message);
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (reqId, title) => {
    setCancellingIds((prev) => new Set(prev).add(reqId));
    try {
      await movieService.cancelMovieRequest(reqId);
      // Remove entry on success
      setRequests((prev) => prev.filter((r) => (r._id ?? r.id) !== reqId));
      showToast(`Request for "${title}" was canceled.`, 'success');
    } catch (err) {
      // Show error, retain entry
      const message = typeof err === 'string' ? err : 'Failed to cancel request. Please try again.';
      showToast(message, 'error');
    } finally {
      setCancellingIds((prev) => {
        const next = new Set(prev);
        next.delete(reqId);
        return next;
      });
    }
  };

  const handleScrollToHistory = () => {
    const el = document.getElementById('my-requests');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Normalise a request record so the UI always uses .id, .date, .status consistently
  const normaliseRequest = (r) => ({
    ...r,
    id: r._id ?? r.id,
    date: r.date
      ? r.date
      : r.createdAt
      ? new Date(r.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—',
    status: r.status
      ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
      : 'Pending',
  });

  // Status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-primary/15 text-primary border-primary/30';
      case 'Pending':
        return 'bg-secondary/15 text-secondary border-secondary/30';
      case 'Fulfilled':
        return 'bg-surface-variant text-on-surface-variant border-white/10';
      default:
        return 'bg-white/5 text-on-surface-variant border-white/10';
    }
  };

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative animate-fade-in">

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border animate-bounce ${
            toastType === 'error'
              ? 'bg-error/90 text-white border-error/60'
              : 'bg-primary-container text-white border-primary/40'
          }`}
        >
          <span className="material-symbols-outlined text-xl">
            {toastType === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-surface-container rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                <span>Request Details</span>
              </h3>
              <button
                onClick={() => setSelectedRequestModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Request ID:</span>
                <span className="font-semibold text-white">#{selectedRequestModal.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Title:</span>
                <span className="font-semibold text-white">{selectedRequestModal.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Type & Year:</span>
                <span className="text-white">{selectedRequestModal.type} ({selectedRequestModal.year})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Genre:</span>
                <span className="text-white">{selectedRequestModal.genre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status:</span>
                <span className={`px-2 py-0.5 rounded text-xs border ${getStatusBadge(selectedRequestModal.status)}`}>
                  {selectedRequestModal.status}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <span className="text-on-surface-variant block mb-1">Additional Details:</span>
                <p className="text-gray-300 bg-background/60 p-3 rounded-lg text-xs leading-relaxed">
                  {selectedRequestModal.details}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedRequestModal(null)}
              className="w-full mt-5 bg-surface-variant text-white py-2 rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow  max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Request a Movie</h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Can't find a movie or series? Let us know and we'll try to get it for you.
            </p>
          </div>
          <button
            onClick={handleScrollToHistory}
            className="border border-secondary text-secondary px-6 py-2.5 rounded-lg hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all text-xs uppercase tracking-wider flex items-center gap-2 font-bold"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            View My Requests ({loadingRequests ? '…' : requests.length})
          </button>
        </div>

        {/* Request form */}
        <div className="glass-panel rounded-xl p-6 max-w-[600px] mb-12 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">add_circle</span>
            <span>Tell Us What You're Looking For</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase text-on-surface-variant mb-2 font-semibold">
                Movie/Series Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Enter full title (e.g. Inception)"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-on-surface-variant mb-2 font-semibold">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none cursor-pointer"
                >
                  <option>Movie</option>
                  <option>TV Series</option>
                  <option>Mini Series</option>
                  <option>Season Collection</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase text-on-surface-variant mb-2 font-semibold">Release Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none"
                  placeholder="e.g. 2024"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase text-on-surface-variant mb-2 font-semibold">Genre</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none cursor-pointer"
              >
                <option value="">Select a genre</option>
                <option>Sci-Fi</option>
                <option>Action</option>
                <option>Drama</option>
                <option>Thriller</option>
                <option>Horror</option>
                <option>Comedy</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-on-surface-variant mb-2 font-semibold">Additional Details</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows="3"
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none resize-none"
                placeholder="Any specific actors, directors, audio language, or quality requirement?"
              />
            </div>
            {submitError && (
              <div className="flex items-center gap-2 text-error text-sm bg-error/10 border border-error/30 rounded-lg px-4 py-2.5">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{submitError}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-black py-3 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-[1.01] active:scale-95 transition-all text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  Submitting…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">send</span>
                  Submit Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* History */}
        <div id="my-requests">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold text-white">My Previous Requests</h3>
            <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
              {loadingRequests ? '…' : requests.length} Total
            </span>
          </div>
          <div className="glass-panel rounded-xl overflow-hidden shadow-2xl">
            {/* Loading state */}
            {loadingRequests && (
              <div className="flex items-center justify-center gap-3 py-16 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-2xl text-primary">progress_activity</span>
                <span className="text-sm">Loading your requests…</span>
              </div>
            )}

            {/* Fetch error state */}
            {!loadingRequests && fetchError && (
              <div className="flex flex-col items-center gap-3 py-16 text-center px-6">
                <span className="material-symbols-outlined text-4xl text-error">error</span>
                <p className="text-error font-semibold">{fetchError}</p>
                <button
                  onClick={fetchRequests}
                  className="text-xs text-primary underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loadingRequests && !fetchError && requests.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-center px-6">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">movie_filter</span>
                <p className="text-on-surface-variant text-sm">You haven't made any requests yet.</p>
              </div>
            )}

            {/* Desktop table */}
            {!loadingRequests && !fetchError && requests.length > 0 && (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-white/10">
                    <th className="px-4 py-3.5 text-xs uppercase text-on-surface-variant font-semibold">Request ID</th>
                    <th className="px-4 py-3.5 text-xs uppercase text-on-surface-variant font-semibold">Title</th>
                    <th className="px-4 py-3.5 text-xs uppercase text-on-surface-variant font-semibold">Type</th>
                    <th className="px-4 py-3.5 text-xs uppercase text-on-surface-variant font-semibold">Date</th>
                    <th className="px-4 py-3.5 text-xs uppercase text-on-surface-variant font-semibold">Status</th>
                    <th className="px-4 py-3.5 text-xs uppercase text-on-surface-variant font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((rawRequest) => {
                    const request = normaliseRequest(rawRequest);
                    const isCancelling = cancellingIds.has(request.id);
                    return (
                    <tr key={request.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-on-surface-variant font-mono">#{request.id}</td>
                      <td className="px-4 py-3 font-semibold text-white">{request.title}</td>
                      <td className="px-4 py-3">
                        <span className="bg-surface-variant px-2.5 py-1 rounded text-xs font-medium text-white">{request.type}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{request.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max border ${getStatusBadge(request.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${request.status === 'Available' ? 'bg-primary' :
                              request.status === 'Pending' ? 'bg-secondary' : 'bg-on-surface-variant'
                            }`} />
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedRequestModal(request)}
                          title="View Request Details"
                          className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded hover:bg-white/10 mr-1"
                        >
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </button>
                        {request.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelRequest(request.id, request.title)}
                            disabled={isCancelling}
                            title="Cancel Request"
                            className="text-on-surface-variant hover:text-error transition-colors p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCancelling ? (
                              <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                            ) : (
                              <span className="material-symbols-outlined text-xl">close</span>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            )}

            {/* Mobile cards */}
            {!loadingRequests && !fetchError && requests.length > 0 && (
            <div className="md:hidden flex flex-col gap-3 p-4">
              {requests.map((rawRequest) => {
                const request = normaliseRequest(rawRequest);
                const isCancelling = cancellingIds.has(request.id);
                return (
                <div key={request.id} className="bg-surface-container-low rounded-lg p-4 border border-white/5 shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-semibold">{request.title}</h4>
                      <p className="text-sm text-on-surface-variant">{request.type} • {request.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                    <p className="text-xs text-on-surface-variant font-mono">#{request.id}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedRequestModal(request)}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Details
                      </button>
                      {request.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelRequest(request.id, request.title)}
                          disabled={isCancelling}
                          className="text-xs text-error font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCancelling ? 'Cancelling…' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
};

export default MovieRequestPage;