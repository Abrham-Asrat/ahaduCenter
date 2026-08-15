// src/pages/MovieRequestPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/**
 * MovieRequestPage Component
 * 
 * Allows users to request movies/TV series not currently available.
 * 
 * Features:
 * - Request form: title, type, release year, genre, additional details
 * - Genre chips (clickable toggle)
 * - Submit button adds request to history
 * - History section showing previous requests with status badges
 * 
 * State:
 * - formData: { title, type, year, genre, details }
 * - requests: Array of previous requests
 */
const MovieRequestPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'Movie',
    year: '',
    genre: '',
    details: '',
  });

  // Request history state
  const [requests, setRequests] = useState([
    {
      id: 'REQ-8942',
      title: 'Dune: Part Two',
      type: 'Movie',
      date: 'Oct 24, 2024',
      status: 'Pending',
    },
    {
      id: 'REQ-8810',
      title: 'Severance S02',
      type: 'TV Series',
      date: 'Oct 15, 2024',
      status: 'Available',
    },
    {
      id: 'REQ-8755',
      title: 'Oppenheimer',
      type: 'Movie',
      date: 'Sep 12, 2024',
      status: 'Fulfilled',
    },
  ]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title,
      type: formData.type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending',
    };
    setRequests([newRequest, ...requests]);
    // Reset form
    setFormData({ title: '', type: 'Movie', year: '', genre: '', details: '' });
  };

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
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Request a Movie</h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Can't find a movie or series? Let us know and we'll try to get it for you.
            </p>
          </div>
          <button className="border border-secondary text-secondary px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all text-xs uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">history</span>
            View My Requests
          </button>
        </div>

        {/* Request form */}
        <div className="glass-panel rounded-xl p-6 max-w-[600px] mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Tell Us What You're Looking For</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase text-on-surface-variant mb-2">Movie/Series Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Enter full title"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-on-surface-variant mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                >
                  <option>Movie</option>
                  <option>TV Series</option>
                  <option>Mini Series</option>
                  <option>Season Collection</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase text-on-surface-variant mb-2">Release Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                  placeholder="e.g. 2024"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase text-on-surface-variant mb-2">Genre</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
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
              <label className="block text-xs uppercase text-on-surface-variant mb-2">Additional Details</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows="3"
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary outline-none resize-none"
                placeholder="Any specific actors, directors, or language requirements?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-black py-3 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* History */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold text-white">My Previous Requests</h3>
            <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full text-xs uppercase">
              {requests.length} Total
            </span>
          </div>
          <div className="glass-panel rounded-xl overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-high border-b border-white/10">
                    <th className="px-4 py-3 text-xs uppercase text-on-surface-variant">Request ID</th>
                    <th className="px-4 py-3 text-xs uppercase text-on-surface-variant">Title</th>
                    <th className="px-4 py-3 text-xs uppercase text-on-surface-variant">Type</th>
                    <th className="px-4 py-3 text-xs uppercase text-on-surface-variant">Date</th>
                    <th className="px-4 py-3 text-xs uppercase text-on-surface-variant">Status</th>
                    <th className="px-4 py-3 text-xs uppercase text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-on-surface-variant">#{request.id}</td>
                      <td className="px-4 py-3 font-semibold text-white">{request.title}</td>
                      <td className="px-4 py-3">
                        <span className="bg-surface-variant px-2 py-1 rounded text-xs">{request.type}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{request.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-max border ${getStatusBadge(request.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${request.status === 'Available' ? 'bg-primary' :
                              request.status === 'Pending' ? 'bg-secondary' : 'bg-on-surface-variant'
                            }`} />
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-on-surface-variant hover:text-white transition-colors mr-2">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                        {request.status === 'Pending' && (
                          <button className="text-on-surface-variant hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-3 p-4">
              {requests.map((request) => (
                <div key={request.id} className="bg-surface-container-low rounded-lg p-4 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-semibold">{request.title}</h4>
                      <p className="text-sm text-on-surface-variant">{request.type} • {request.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">#{request.id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieRequestPage;