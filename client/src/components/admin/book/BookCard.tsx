import { ArrowRight, BookOpen, Star } from 'lucide-react';
import type { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onQuickAction?: (book: Book) => void;
}

const BookCard = ({ book, onQuickAction }: BookCardProps) => {
  const image = book.coverUrl || book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80';
  const status = book.availability === 'available' ? 'Available' : book.availability === 'reserved' ? 'Reserved' : 'Borrowed';

  return (
    <article className="overflow-hidden rounded-[26px] border border-white/10 bg-card-surface/60 p-3 shadow-[0_20px_45px_rgba(15,23,42,0.25)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-[20px]">
        <img src={image} alt={book.title} className="h-56 w-full object-cover" />
        <div className="absolute left-3 top-3 rounded-full bg-dark-bg/80 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-primary">
          {status}
        </div>
      </div>

      <div className="mt-4 space-y-3 px-1 pb-1">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-light-gray">
          <span>{book.category || 'Featured'}</span>
          <span>{book.format || 'Hardcover'}</span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">{book.title}</h3>
          <p className="mt-1 text-sm text-on-surface-variant">{book.author || 'Ahadu Press'}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-on-surface-variant">
            <Star size={14} className="fill-primary text-primary" />
            <span>{book.rating ?? 4.8}</span>
            <span>•</span>
            <span>{book.reviews ?? 128} reviews</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-bold text-white">ETB {Number(book.price ?? 0).toLocaleString()}</div>
            <div className="text-sm text-on-surface-variant">{book.availableCopies ?? 3} copies</div>
          </div>

          <button
            type="button"
            onClick={() => onQuickAction?.(book)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90"
          >
            <BookOpen size={16} />
            View
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
