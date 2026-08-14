// src/components/book/BookDetailTabs.jsx
import React, { useState } from 'react';

/**
 * BookDetailTabs Component
 * 
 * Displays tabbed content on desktop and accordions on mobile.
 * 
 * Props:
 * - book: Object { about, authorInfo, borrowingPolicy, format, pages, language, publicationDate, dimensions }
 * 
 * State:
 * - activeTab: 'about' | 'author' | 'policy' (for desktop)
 * - expandedSection: string | null (for mobile accordion)
 */
const BookDetailTabs = ({ book }) => {
    const [activeTab, setActiveTab] = useState('about');
    const [expandedSection, setExpandedSection] = useState('about');

    // Toggle mobile accordion
    const toggleAccordion = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div>
            {/* Desktop tabs */}
            <div className="hidden md:block">
                <div className="flex border-b border-white/10 gap-8">
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`pb-3 font-semibold text-lg ${activeTab === 'about' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'
                            }`}
                    >
                        About This Book
                    </button>
                    <button
                        onClick={() => setActiveTab('author')}
                        className={`pb-3 font-semibold text-lg ${activeTab === 'author' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'
                            }`}
                    >
                        Author Information
                    </button>
                    <button
                        onClick={() => setActiveTab('policy')}
                        className={`pb-3 font-semibold text-lg ${activeTab === 'policy' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'
                            }`}
                    >
                        Borrowing Policy
                    </button>
                </div>

                {/* Tab content */}
                <div className="py-6">
                    {activeTab === 'about' && (
                        <div className="grid grid-cols-2 gap-6 text-on-surface-variant">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Format</span>
                                <span className="text-white">{book.format}, {book.pages} Pages</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Language</span>
                                <span className="text-white">{book.language}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Publication Date</span>
                                <span className="text-white">{book.publicationDate}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span>Dimensions</span>
                                <span className="text-white">{book.dimensions}</span>
                            </div>
                        </div>
                    )}
                    {activeTab === 'author' && (
                        <p className="text-on-surface-variant leading-relaxed">{book.authorInfo}</p>
                    )}
                    {activeTab === 'policy' && (
                        <p className="text-on-surface-variant leading-relaxed">{book.borrowingPolicy}</p>
                    )}
                </div>
            </div>

            {/* Mobile accordions */}
            <div className="md:hidden flex flex-col gap-4">
                {/* About accordion */}
                <div className="glass-panel rounded-xl overflow-hidden">
                    <button
                        className="w-full px-6 py-4 flex justify-between items-center text-left"
                        onClick={() => toggleAccordion('about')}
                    >
                        <span className="font-semibold text-lg">About This Book</span>
                        <span className={`material-symbols-outlined transition-transform ${expandedSection === 'about' ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                    {expandedSection === 'about' && (
                        <div className="px-6 pb-4 text-on-surface-variant text-sm leading-relaxed">
                            {book.about || `${book.format}, ${book.pages} pages. Published ${book.publicationDate}. Language: ${book.language}.`}
                        </div>
                    )}
                </div>

                {/* Author accordion */}
                <div className="glass-panel rounded-xl overflow-hidden">
                    <button
                        className="w-full px-6 py-4 flex justify-between items-center text-left"
                        onClick={() => toggleAccordion('author')}
                    >
                        <span className="font-semibold text-lg">Author Information</span>
                        <span className={`material-symbols-outlined transition-transform ${expandedSection === 'author' ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                    {expandedSection === 'author' && (
                        <div className="px-6 pb-4 text-on-surface-variant text-sm leading-relaxed">{book.authorInfo}</div>
                    )}
                </div>

                {/* Policy accordion */}
                <div className="glass-panel rounded-xl overflow-hidden">
                    <button
                        className="w-full px-6 py-4 flex justify-between items-center text-left"
                        onClick={() => toggleAccordion('policy')}
                    >
                        <span className="font-semibold text-lg">Borrowing Policy</span>
                        <span className={`material-symbols-outlined transition-transform ${expandedSection === 'policy' ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                    {expandedSection === 'policy' && (
                        <div className="px-6 pb-4 text-on-surface-variant text-sm leading-relaxed">{book.borrowingPolicy}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetailTabs;