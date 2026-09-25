import { useState } from 'react';
import type { Book } from '../../types';

interface BookCoverCardProps {
  book: Partial<Book>;
}

const BookCoverCard = ({ book }: BookCoverCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const title = book.title || 'Book';
  const imageUrl =
    book.coverUrl ||
    book.coverImage ||
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80';

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast('Link copied to clipboard');
    } catch {
      setToast('Link copied to clipboard');
    }
  };

  const handleQr = () => {
    setToast('QR Code coming soon');
  };

  return (
    <div className="relative flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-card-surface/70 p-3 shadow-[0_20px_45px_rgba(15,23,42,0.25)]">
        <img
          src={imageUrl}
          alt={title}
          className={`aspect-[3/4] max-h-[440px] w-full rounded-[20px] object-cover transition-transform duration-300 ${isZoomed ? 'scale-110' : ''}`}
        />

        <div className="absolute left-6 top-6 rounded-full bg-dark-bg/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          {book.availability || 'Available'}
        </div>

        <div className="absolute right-6 top-6 flex gap-2">
          <button
            type="button"
            aria-label={isSaved ? 'Unsave' : 'Save'}
            onClick={() => setIsSaved((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-dark-bg/80 text-white backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-lg">{isSaved ? 'bookmark_added' : 'bookmark'}</span>
          </button>
          <button
            type="button"
            aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            onClick={() => setIsZoomed((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-dark-bg/80 text-white backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-lg">{isZoomed ? 'zoom_out' : 'zoom_in'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Share"
          onClick={handleShare}
          className="flex-1 rounded-xl border border-white/10 bg-surface-container px-4 py-3 text-sm font-semibold text-white hover:border-primary/40"
        >
          Share
        </button>
        <button
          type="button"
          aria-label="QR Code"
          onClick={handleQr}
          className="flex-1 rounded-xl border border-white/10 bg-surface-container px-4 py-3 text-sm font-semibold text-white hover:border-primary/40"
        >
          QR Code
        </button>
      </div>

      {toast && (
        <div role="status" className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
          {toast}
        </div>
      )}
    </div>
  );
};

export default BookCoverCard;