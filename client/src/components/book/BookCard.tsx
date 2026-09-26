import { useState } from 'react';
import { ArrowRight, BookOpen, Heart, Star } from 'lucide-react';
import type { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onQuickAction?: (book: Book) => void;
}

const BookCard = ({ book, onQuickAction }: BookCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const image = book.coverUrl || book.coverImage || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80';
  const status = book.availability === 'available' ? 'Available' : 'Borrowed';

  return (
    <article className="h-full overflow-hidden rounded-2xl border border-white/10 bg-card-surface/60 p-2 shadow-[0_20px_45px_rgba(15,23,42,0.25)] transition-transform duration-300 hover:-translate-y-1 sm:rounded-[26px] sm:p-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl sm:rounded-[20px]">
        <img src={image} alt={book.title} className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-dark-bg/80 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-primary sm:left-3 sm:top-3 sm:text-[10px] sm:tracking-[0.14em]">
          {status}
        </div>

      </div>

      <div className="mt-3 flex flex-col gap-2 px-1 pb-1 sm:mt-4 sm:gap-3">


        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[9px] uppercase tracking-[0.1em] text-light-gray sm:text-xs sm:tracking-[0.18em]">
          <span className="min-w-0 max-w-full truncate">{book.category || 'Featured'}</span>

          <button
            type="button"
            onClick={() => setIsLiked((liked) => !liked)}
            className="flex items-center justify-center  border-none  text-white sm:right-3 sm:top-3"
            aria-label={isLiked ? `Remove ${book.title} from wishlist` : `Save ${book.title} to wishlist`}
          >
            <Heart size={16} className={isLiked ? 'fill-primary text-primary' : ''} />
          </button>

        </div>



        <div className="min-w-0">
          <h3 className="break-words text-base font-semibold leading-tight text-white sm:text-lg">{book.title}</h3>
          <p className="mt-1 break-words text-xs text-on-surface-variant sm:text-sm">{book.author || 'Ahadu Press'}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant sm:gap-2 sm:text-sm">
            <Star size={14} className="fill-primary text-primary" />
            <span>{book.rating ?? 4.8}</span>
            <span>•</span>
            <span className="break-words">{book.reviews ?? 128} reviews</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-stretch gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div>

            <div className="text-xs text-on-surface-variant sm:text-sm">{book.availableCopies ?? 3} copies</div>
          </div>

          <button
            type="button"
            onClick={() => onQuickAction?.(book)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-2.5 py-2 text-xs font-semibold text-slate-950 transition-opacity hover:opacity-90 sm:w-auto sm:gap-2 sm:px-3 sm:text-sm"
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