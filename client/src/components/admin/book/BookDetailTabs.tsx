import type { Book } from '../../types';

interface BookDetailTabsProps {
  book: Book;
}

const BookDetailTabs = ({ book }: BookDetailTabsProps) => {
  return (
    <div className="rounded-[28px] border border-white/10 bg-card-surface/60 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.25)]">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Book Details</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-surface-container p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-light-gray">Publisher</p>
          <p className="mt-2 text-base text-white">{book.publisher || 'Ahadu Press'}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface-container p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-light-gray">Publication Year</p>
          <p className="mt-2 text-base text-white">{book.year || book.publicationDate || '2026'}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface-container p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-light-gray">ISBN</p>
          <p className="mt-2 text-base text-white">{book.isbn || 'N/A'}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface-container p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-light-gray">Location</p>
          <p className="mt-2 text-base text-white">{book.location || 'Main Branch'}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetailTabs;
