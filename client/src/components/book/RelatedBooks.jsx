// src/components/book/RelatedBooks.jsx
import React from 'react';

/**
 * RelatedBooks Component
 * 
 * Displays a horizontal carousel of related books.
 * 
 * Props:
 * - books: Array of book objects { id, title, author, coverUrl, price }
 */
const RelatedBooks = ({ books }) => {
    return (
        <section className="mt-12 border-t border-white/5 pt-8">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">You May Also Like</h2>
                <div className="flex gap-2">
                    <button className="w-10 h-10 rounded glass-panel flex items-center justify-center text-white hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button className="w-10 h-10 rounded glass-panel flex items-center justify-center text-white hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Horizontal scrollable carousel */}
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
                {books.map((book) => (
                    <div
                        key={book.id}
                        className="min-w-[160px] md:min-w-[200px] flex-shrink-0 glass-panel rounded-xl p-3 snap-start group cursor-pointer hover:border-primary/30 transition-colors"
                    >
                        <div className="aspect-[2/3] w-full rounded overflow-hidden mb-3">
                            <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={book.coverUrl}
                                alt={book.title}
                            />
                        </div>
                        <h3 className="text-base font-semibold text-white truncate group-hover:text-primary transition-colors">
                            {book.title}
                        </h3>
                        <p className="text-sm text-on-surface-variant truncate">{book.author}</p>
                        {book.price && (
                            <p className="text-primary font-semibold mt-1">${book.price}</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RelatedBooks;