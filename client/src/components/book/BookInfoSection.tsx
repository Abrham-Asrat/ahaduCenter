import { useNavigate } from 'react-router-dom';
import type { Book } from '../../types';

interface BookInfoSectionProps {
  book: Book;
  onBorrow?: () => void;
  onReserve?: () => void;
  onShowToast?: (message: string) => void;
}

const BookInfoSection = ({ book, onBorrow, onReserve, onShowToast }: BookInfoSectionProps) => {
  const navigate = useNavigate();

  const handleBuy = () => {
    onShowToast?.(`Preparing checkout for ${book.title}`);
    window.setTimeout(() => {
      navigate('/book-confirm');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
          <span>{book.category || 'Featured'}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-[-0.04em] text-white">{book.title}</h1>
        <p className="text-xl text-on-surface-variant">by {book.author || 'Ahadu Press'}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
        <span>⭐ {book.rating ?? 4.8}</span>
        <span>{book.reviews ?? 128} reviews</span>
        <span>{book.language || 'English'}</span>
        <span>{book.pages ?? 320} pages</span>
      </div>

      <p className="max-w-2xl text-base leading-7 text-on-surface-variant">
        {book.description ||
          'A thoughtfully curated work that brings together insight, narrative, and everyday discovery for readers in Addis Ababa and beyond.'}
      </p>

      <div className="rounded-2xl border border-white/10 bg-surface-container p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-3xl font-bold text-white">ETB {Number(book.price ?? 0).toLocaleString()}</div>
            <div className="text-sm text-on-surface-variant">{book.availability || 'Available'} • {book.availableCopies ?? 3} copies</div>
          </div>
          <div className="text-right text-sm text-on-surface-variant">
            <div>{book.format || 'Hardcover'}</div>
            <div>{book.publisher || 'Ahadu Press'}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleBuy}
          className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-slate-950 transition-opacity hover:opacity-90"
        >
          Buy ETB {Number(book.price ?? 0).toLocaleString()}
        </button>
        <button
          type="button"
          onClick={onBorrow}
          className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-slate-950 transition-opacity hover:opacity-90"
        >
          Borrow Now
        </button>
        <button
          type="button"
          onClick={onReserve}
          className="rounded-xl border border-primary/40 bg-transparent px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
        >
          Reserve
        </button>
      </div>
    </div>
  );
};

export default BookInfoSection;