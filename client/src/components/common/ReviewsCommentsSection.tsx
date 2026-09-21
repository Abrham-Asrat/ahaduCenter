// src/components/common/ReviewsCommentsSection.jsx
import React, { useState } from 'react';

/**
 * ReviewsCommentsSection Component
 * 
 * Reusable community reviews & comments component for Movie & Book detail pages.
 * 
 * Features:
 * - List existing community reviews with star ratings, dates, and helpful counts
 * - Interactive form to post a new review with 5-star rating selector
 * - Like/Helpful button toggle for existing comments
 * - Community prompt banner to inspire user engagement
 */
/**
 * ReviewsCommentsSection Component
 *
 * Props:
 * - title: string — section heading
 * - initialReviews: array — pre-populated reviews (used for Redux-driven data)
 * - onSubmitReview: async (payload: { rating, comment }) => void — if provided,
 *     called instead of the local optimistic add; errors are caught and shown in toast
 * - isAuthenticated: boolean — when false, hides the submit form
 */
const ReviewsCommentsSection = ({
  title = 'Community Reviews & Comments',
  initialReviews = [],
  onSubmitReview = null,
  isAuthenticated = true,
}) => {
  // Default mock reviews if none provided and no Redux data injected
  const [reviews, setReviews] = useState(
    initialReviews.length > 0
      ? initialReviews
      : [
          {
            id: 1,
            name: 'Sophia Williams',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            rating: 5,
            date: '2 days ago',
            comment: 'Absolute masterpiece! The pacing and visual depth kept me hooked from beginning to end. Highly recommend visiting the physical center for the full experience.',
            helpfulCount: 14,
            liked: false,
          },
          {
            id: 2,
            name: 'Marcus Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            rating: 4,
            date: '1 week ago',
            comment: 'Very impressive collection. I borrowed the physical copy yesterday from the Addis Ababa branch. Great quality and friendly staff!',
            helpfulCount: 8,
            liked: false,
          },
        ]
  );

  // Sync reviews when initialReviews prop changes (e.g., Redux fetch completes)
  React.useEffect(() => {
    if (initialReviews.length > 0) {
      setReviews(initialReviews);
    }
  }, [initialReviews]);

  // Form State
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [toast, setToast] = useState(null);

  // Handle helpful toggle
  const handleLike = (id) => {
    setReviews((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedLiked = !item.liked;
          return {
            ...item,
            liked: updatedLiked,
            helpfulCount: updatedLiked ? item.helpfulCount + 1 : item.helpfulCount - 1,
          };
        }
        return item;
      })
    );
  };

  // Submit new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (onSubmitReview) {
      // Redux-wired path: delegate to parent handler
      try {
        await onSubmitReview({ rating: newRating, comment: commentText.trim() });
        setCommentText('');
        setToast('Thank you! Your review has been published.');
        setTimeout(() => setToast(null), 3000);
      } catch (err) {
        setToast(typeof err === 'string' ? err : 'Failed to submit review. Please try again.');
        setTimeout(() => setToast(null), 4000);
      }
      return;
    }

    // Local-only path (no Redux wiring)
    const newReview = {
      id: Date.now(),
      name: userName.trim() || 'Ahadu Member',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName || 'User')}`,
      rating: newRating,
      date: 'Just now',
      comment: commentText.trim(),
      helpfulCount: 0,
      liked: false,
    };

    setReviews([newReview, ...reviews]);
    setCommentText('');
    setToast('Thank you! Your review has been published.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <section className="mt-12 glass-panel rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
      {/* Toast alert */}
      {toast && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/40 rounded-xl text-primary flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Section Header & Community Call to Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">forum</span>
            {title}
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">
            See what fellow members think and share your own experience!
          </p>
        </div>
        <div className="bg-surface-container/60 border border-white/10 px-4 py-2 rounded-xl text-xs text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-sm">stars</span>
          <span>Average Rating: <strong className="text-white font-bold">4.8 / 5</strong></span>
        </div>
      </div>

      {/* Write a Review Form — only shown to authenticated users */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-surface-container/40 rounded-xl border border-white/10 flex items-center gap-3 text-on-surface-variant text-sm">
          <span className="material-symbols-outlined">lock</span>
          <span>Please <a href="/login" className="text-primary hover:underline">sign in</a> to leave a review.</span>
        </div>
      )}
      <form onSubmit={handleSubmitReview} className={`mb-10 bg-surface-container/40 p-5 rounded-xl border border-white/5 flex flex-col gap-4 ${!isAuthenticated ? 'hidden' : ''}`}>
        <h4 className="text-lg font-bold text-white mb-1">Leave a Review</h4>
        
        {/* Rating Stars Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase text-on-surface-variant font-semibold">Your Rating:</span>
          <div className="flex items-center gap-1 cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setNewRating(star)}
                className="text-xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
              >
                <span className={`material-symbols-outlined ${
                  (hoverRating || newRating) >= star ? 'text-secondary' : 'text-white/20'
                }`}>
                  star
                </span>
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-secondary ml-2">{hoverRating || newRating} / 5</span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your Name (Optional)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="bg-surface-container border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
          />
        </div>

        <textarea
          rows={3}
          required
          placeholder="Share your thoughts about this item to help others..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="bg-surface-container border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary outline-none resize-none"
        />

        <button
          type="submit"
          className="self-end bg-primary text-black font-extrabold text-xs uppercase px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">send</span>
          Post Review
        </button>
      </form>

      {/* Community Reviews List */}
      <div className="flex flex-col gap-6">
        <h4 className="text-lg font-bold text-white">Community Ratings & Reviews ({reviews.length})</h4>
        
        {reviews.map((rev) => (
          <div key={rev.id} className="p-5 rounded-xl bg-surface-container/30 border border-white/5 flex flex-col gap-3 transition-all hover:border-white/10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-primary/30"
                />
                <div>
                  <h5 className="font-bold text-white text-sm">{rev.name}</h5>
                  <span className="text-xs text-on-surface-variant">{rev.date}</span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`material-symbols-outlined text-sm ${
                      s <= rev.rating ? 'text-secondary' : 'text-white/20'
                    }`}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>

            {/* Comment Body */}
            <p className="text-sm text-on-surface-variant leading-relaxed pl-13">
              {rev.comment}
            </p>

            {/* Helpful / Like Button */}
            <div className="flex justify-end items-center mt-1">
              <button
                onClick={() => handleLike(rev.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  rev.liked
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'border-white/10 text-on-surface-variant hover:text-white hover:border-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-sm">thumb_up</span>
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsCommentsSection;
