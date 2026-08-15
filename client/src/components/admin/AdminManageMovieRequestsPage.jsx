// src/pages/admin/AdminManageMovieRequestsPage.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

/**
 * AdminManageMovieRequestsPage Component
 * 
 * Allows admins to review and manage user-submitted movie requests.
 * 
 * Features:
 * - Search and filter toolbar
 * - Desktop table with request details and actions
 * - Detail modal/slide-over with user info and admin notes
 * - Approve/Reject buttons
 * - Status badges: Pending, Reviewing, Available, Rejected
 * 
 * State:
 * - requests: Array of request objects
 * - searchQuery: String
 * - selectedRequest: Request object or null (for detail modal)
 */
const AdminManageMovieRequestsPage = () => {
    // Requests data
    const [requests, setRequests] = useState([
        {
            id: '#RQ-8042',
            title: 'Dune: Part Two',
            type: 'Movie',
            year: 2024,
            user: 'Elena Rostova',
            userInitials: 'ER',
            userEmail: 'elena.r@example.com',
            date: 'Oct 24, 2024',
            status: 'Reviewing',
            description: 'The highly anticipated sequel directed by Denis Villeneuve.',
        },
        {
            id: '#RQ-8041',
            title: 'Foundation',
            type: 'Series',
            year: 2024,
            user: 'Marcus Reed',
            userInitials: 'MR',
            userEmail: 'marcus.r@example.com',
            date: 'Oct 24, 2024',
            status: 'Pending',
            description: 'Season 3 of the Apple TV+ sci-fi series.',
        },
        {
            id: '#RQ-8038',
            title: 'Oppenheimer',
            type: 'Movie',
            year: 2023,
            user: 'Sarah Chen',
            userInitials: 'SC',
            userEmail: 'sarah.c@example.com',
            date: 'Oct 22, 2024',
            status: 'Available',
            description: 'Christopher Nolan biographical thriller.',
        },
        {
            id: '#RQ-8035',
            title: 'Unreleased Marvel Camrip',
            type: 'Movie',
            year: 2024,
            user: 'John Doe',
            userInitials: 'JD',
            userEmail: 'john.d@example.com',
            date: 'Oct 21, 2024',
            status: 'Rejected',
            description: 'Request rejected due to copyright/quality concerns.',
        },
    ]);

    // UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminNote, setAdminNote] = useState('');

    // Filter requests by search
    const filteredRequests = requests.filter(
        (r) =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Status badge styles
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-secondary/15 text-secondary border-secondary/30';
            case 'Reviewing':
                return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
            case 'Available':
                return 'bg-primary/15 text-primary border-primary/30';
            case 'Rejected':
                return 'bg-error/15 text-error border-error/30';
            default:
                return 'bg-white/5 text-on-surface-variant border-white/10';
        }
    };

    // Handle approve
    const handleApprove = (id) => {
        setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'Available' } : r)));
        setSelectedRequest(null);
    };

    // Handle reject
    const handleReject = (id) => {
        setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r)));
        setSelectedRequest(null);
    };

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Movie Requests</h2>
                    <p className="text-lg text-on-surface-variant">Review and manage user-submitted movie and series requests.</p>
                </div>
                <button className="border border-secondary text-secondary px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Export Requests
                </button>
            </div>

            {/* Toolbar */}
            <div className="glass-panel rounded-xl p-4 flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full lg:w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, ID, or user..."
                        className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <select className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                        <option>All Statuses</option>
                        <option>Pending</option>
                        <option>Reviewing</option>
                        <option>Available</option>
                        <option>Rejected</option>
                    </select>
                    <select className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                        <option>All Types</option>
                        <option>Movie</option>
                        <option>Series</option>
                    </select>
                    <button className="text-secondary hover:text-secondary-fixed text-sm underline underline-offset-4 transition-colors">
                        Reset Filters
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
                                <th className="p-4 text-xs uppercase text-on-surface-variant">Request ID</th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant">Title</th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant">Type</th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant">Requested By</th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant">Date</th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant">Status</th>
                                <th className="p-4 text-xs uppercase text-on-surface-variant text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="p-4"><input type="checkbox" className="rounded" /></td>
                                    <td className="p-4 font-mono text-sm text-on-surface-variant">{request.id}</td>
                                    <td className="p-4 font-semibold text-white">
                                        {request.title}
                                        <div className="text-xs text-on-surface-variant mt-0.5">Year: {request.year}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-surface-variant/50 text-xs uppercase border border-white/5">
                                            {request.type}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-white font-semibold text-sm">
                                                {request.userInitials}
                                            </div>
                                            <span className="text-sm">{request.user}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-on-surface-variant">{request.date}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs uppercase flex items-center gap-1.5 w-fit border ${getStatusBadge(request.status)}`}>
                                            <span className="material-symbols-outlined text-sm">
                                                {request.status === 'Pending' ? 'schedule' :
                                                    request.status === 'Reviewing' ? 'hourglass_empty' :
                                                        request.status === 'Available' ? 'check_circle' : 'block'}
                                            </span>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedRequest(request)}
                                                className="p-1.5 text-on-surface-variant hover:text-white rounded hover:bg-white/5"
                                                title="View Details"
                                            >
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            {request.status !== 'Available' && request.status !== 'Rejected' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(request.id)}
                                                        className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-primary/10"
                                                        title="Approve"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">check</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request.id)}
                                                        className="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-error/10"
                                                        title="Reject"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Showing 1 to {filteredRequests.length} of {filteredRequests.length} requests</span>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary" disabled>
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary/20 text-primary border border-primary/50 flex items-center justify-center text-sm font-semibold">1</button>
                        <button className="w-8 h-8 rounded-lg glass-panel text-white hover:text-primary text-sm">2</button>
                        <button className="w-8 h-8 rounded-lg glass-panel text-white hover:text-primary text-sm">3</button>
                        <button className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-4">
                {filteredRequests.map((request) => (
                    <div key={request.id} className="glass-panel rounded-xl p-4" onClick={() => setSelectedRequest(request)}>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <span className="text-xs uppercase text-on-surface-variant">{request.id}</span>
                                <h3 className="text-white font-semibold mt-1">{request.title}</h3>
                                <p className="text-sm text-on-surface-variant">
                                    {request.user} • {request.date}
                                </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs uppercase border ${getStatusBadge(request.status)}`}>
                                {request.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
                    <div className="relative bg-surface-container-high w-full md:w-[480px] md:rounded-xl rounded-t-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">Request Details</h3>
                                <p className="text-sm text-on-surface-variant">{selectedRequest.id}</p>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="text-on-surface-variant hover:text-primary">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs uppercase border ${getStatusBadge(selectedRequest.status)}`}>
                                    {selectedRequest.status}
                                </span>
                                <h2 className="text-2xl font-bold text-white mt-3">{selectedRequest.title}</h2>
                                <p className="text-sm text-on-surface-variant mt-1">
                                    {selectedRequest.type} • {selectedRequest.year}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs uppercase text-on-surface-variant mb-2">Description</h4>
                                <p className="text-sm text-on-surface-variant">{selectedRequest.description}</p>
                            </div>

                            <div>
                                <h4 className="text-xs uppercase text-on-surface-variant mb-2">Requester Information</h4>
                                <div className="bg-background rounded-lg p-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center text-white font-semibold">
                                        {selectedRequest.userInitials}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{selectedRequest.user}</p>
                                        <p className="text-xs text-on-surface-variant">{selectedRequest.userEmail}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs uppercase text-on-surface-variant mb-2">Admin Note</h4>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    rows="3"
                                    className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none resize-none"
                                    placeholder="Enter reason for approval or denial..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-white/5 flex flex-col gap-3">
                            {selectedRequest.status !== 'Available' && selectedRequest.status !== 'Rejected' && (
                                <>
                                    <button
                                        onClick={() => handleApprove(selectedRequest.id)}
                                        className="w-full bg-primary text-black py-3 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Approve Request
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedRequest.id)}
                                        className="w-full border border-error text-error py-3 rounded-lg hover:bg-error/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">block</span>
                                        Decline
                                    </button>
                                </>
                            )}
                            {selectedRequest.status === 'Available' && (
                                <div className="text-center text-primary py-3">Request is already approved.</div>
                            )}
                            {selectedRequest.status === 'Rejected' && (
                                <div className="text-center text-error py-3">Request is rejected.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminManageMovieRequestsPage;