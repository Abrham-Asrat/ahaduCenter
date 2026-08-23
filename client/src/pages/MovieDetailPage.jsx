// src/pages/MovieDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMovie,
  fetchMovies,
  fetchMovieReviews,
  createMovieReview,
} from '../redux/slices/movieSlice';
import Navbar from '../components/common/Navbar';
import MovieDetailHero from '../components/movie/MovieDetailHero';
import CastSection from '../components/movie/CastSection';
import ScreenshotsSection from '../components/movie/ScreenshotsSection';
import TrailerSection from '../components/movie/TrailerSection';
import MovieInfoSidebar from '../components/movie/MovieInfoSidebar';
import RelatedMoviesCarousel from '../components/movie/RelatedMoviesCarousel';
import ReviewsCommentsSection from '../components/common/ReviewsCommentsSection';
import Footer from '../components/common/Footer';

/**
 * MovieDetailPage Component
 *
 * Dispatches fetchMovie(id) on mount using URL param :id.
 * When selectedMovie is loaded and has genres, dispatches fetchMovies({ genres })
 * to populate RelatedMoviesCarousel (excluding the current movie).
 * Wires ReviewsCommentsSection to fetchMovieReviews / createMovieReview.
 */
const MovieDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────────────────────────────
  const { selectedMovie, movies, reviews, loading, error } = useSelector((s) => s.movie);
  const { token } = useSelector((s) => s.auth);

  // Derive stable movie ID from selectedMovie (handles both _id and id shapes)
  const selectedMovieId = selectedMovie?._id || selectedMovie?.id || null;

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Fetch movie and reviews on mount / id change ─────────────────────────────
  useEffect(() => {
    if (id) {
      dispatch(fetchMovie(id));
      dispatch(fetchMovieReviews({ id, params: { page: 1, limit: 20 } }));
    }
  }, [dispatch, id]);

  // ── Fetch related movies when selectedMovie is available ─────────────────────
  useEffect(() => {
    if (selectedMovie && selectedMovie.genres && selectedMovie.genres.length > 0) {
      dispatch(fetchMovies({ genres: selectedMovie.genres[0], limit: 10 }));
    }
  }, [dispatch, selectedMovieId]);

  // ── Review submit handler ────────────────────────────────────────────────────
  const handleSubmitReview = async ({ rating, comment }) => {
    await dispatch(createMovieReview({ id, payload: { rating, comment } })).unwrap();
  };

  // ── Map selectedMovie to the shape expected by child components ──────────────
  const movieId = selectedMovieId;

  const movie = selectedMovie
    ? {
        id: movieId,
        title: selectedMovie.title,
        bannerUrl:
          selectedMovie.bannerImage ||
          selectedMovie.bannerUrl ||
          selectedMovie.posterImage ||
          selectedMovie.posterUrl ||
          '',
        posterUrl:
          selectedMovie.posterImage ||
          selectedMovie.posterUrl ||
          selectedMovie.bannerImage ||
          selectedMovie.bannerUrl ||
          '',
        year: selectedMovie.year || selectedMovie.releaseYear,
        country: selectedMovie.country,
        runtime: selectedMovie.runtime,
        quality: selectedMovie.quality || '4K',
        language: selectedMovie.language,
        subtitles: selectedMovie.subtitles,
        genres: selectedMovie.genres || [],
        rating: selectedMovie.rating || 0,
        director: selectedMovie.director,
        writers: Array.isArray(selectedMovie.writers)
          ? selectedMovie.writers.join(', ')
          : selectedMovie.writers,
        studio: selectedMovie.studio,
        releaseDate: selectedMovie.releaseDate,
        trailerUrl: selectedMovie.trailerUrl,
        description: selectedMovie.description || selectedMovie.synopsis || '',
        cast: (selectedMovie.cast || []).map((c, i) => ({
          id: c._id || c.id || i,
          name: c.name,
          role: c.role || c.character,
          photoUrl:
            c.photoUrl ||
            c.photo ||
            c.image ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(c.name || 'Actor')}`,
        })),
        screenshots: selectedMovie.screenshots || selectedMovie.images || [],
        trailerThumbnail:
          selectedMovie.trailerThumbnail ||
          selectedMovie.thumbnailUrl ||
          selectedMovie.posterImage ||
          selectedMovie.posterUrl ||
          '',
      }
    : null;

  // ── Related movies: exclude current movie, map to carousel shape ─────────────
  const relatedMovies = movies
    .filter((m) => (m._id || m.id) !== id && (m._id || m.id) !== movieId)
    .slice(0, 8)
    .map((m) => ({
      id: m._id || m.id,
      title: m.title,
      posterUrl: m.posterImage || m.posterUrl || m.bannerImage || m.bannerUrl || '',
      year: m.year || m.releaseYear,
      rating: m.rating || 0,
    }));

  // ── Map Redux reviews to ReviewsCommentsSection shape ────────────────────────
  const mappedReviews = reviews.map((r) => ({
    id: r._id || r.id,
    name: r.user?.name || r.name || 'Ahadu Member',
    avatar:
      r.user?.avatar ||
      r.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        r.user?.name || 'User'
      )}`,
    rating: r.rating,
    date: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : r.date || '',
    comment: r.comment,
    helpfulCount: r.helpfulCount || 0,
    liked: false,
  }));

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  const DetailSkeleton = () => (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-[60vh] bg-surface-container" />
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="h-40 bg-surface-container rounded-xl" />
          <div className="h-32 bg-surface-container rounded-xl" />
          <div className="h-48 bg-surface-container rounded-xl" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-80 bg-surface-container rounded-xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col relative animate-fade-in">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-primary/40 animate-bounce">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Trailer Modal */}
      {isTrailerOpen && movie && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-surface-container rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">movie</span>
                <h3 className="text-xl font-bold text-white">{movie.title} - Official Trailer</h3>
              </div>
              <button
                onClick={() => setIsTrailerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="relative w-full pt-[56.25%] bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={movie.trailerUrl}
                title={movie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Lightbox Modal */}
      {selectedScreenshot && (
        <div
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh] rounded-xl overflow-hidden border border-white/20 shadow-2xl">
            <img src={selectedScreenshot} alt="Full screenshot" className="w-full h-full object-contain" />
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow pt-[80px]">
        {/* Error state */}
        {error && !loading && !movie && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-red-400 text-5xl">error</span>
            <p className="text-red-300 text-lg font-medium">{error}</p>
            <button
              onClick={() => dispatch(fetchMovie(id))}
              className="px-6 py-2 bg-primary text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !movie && <DetailSkeleton />}

        {/* Main content */}
        {movie && (
          <>
            {/* Hero Banner */}
            <MovieDetailHero movie={movie} onShowToast={showToast} />

            {/* Two-column layout */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
              {/* Left column: main content */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                {/* Storyline */}
                <div className="glass-panel p-6 rounded-xl">
                  <h2 className="text-2xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">auto_stories</span>
                    <span>Storyline</span>
                  </h2>
                  <p className="text-lg text-on-surface-variant leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                {/* Cast */}
                {movie.cast && movie.cast.length > 0 && (
                  <CastSection cast={movie.cast} />
                )}

                {/* Screenshots */}
                {movie.screenshots && movie.screenshots.length > 0 && (
                  <ScreenshotsSection
                    screenshots={movie.screenshots}
                    onSelectScreenshot={(url) => setSelectedScreenshot(url)}
                  />
                )}

                {/* Trailer */}
                {movie.trailerThumbnail && (
                  <TrailerSection
                    thumbnailUrl={movie.trailerThumbnail}
                    onPlayTrailer={() => setIsTrailerOpen(true)}
                  />
                )}
              </div>

              {/* Right column: sticky sidebar */}
              <div className="lg:col-span-4">
                <MovieInfoSidebar movie={movie} />
              </div>
            </section>

            {/* Movie Reviews & Comments */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
              <ReviewsCommentsSection
                title="Viewer Reviews & Discussions"
                initialReviews={mappedReviews}
                onSubmitReview={token ? handleSubmitReview : null}
                isAuthenticated={!!token}
              />
            </div>

            {/* You Might Also Like */}
            {relatedMovies.length > 0 && (
              <RelatedMoviesCarousel movies={relatedMovies} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MovieDetailPage;
