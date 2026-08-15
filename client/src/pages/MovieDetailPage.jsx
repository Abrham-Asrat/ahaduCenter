// src/pages/MovieDetailPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import MovieDetailHero from '../components/movie/MovieDetailHero';
import CastSection from '../components/movie/CastSection';
import ScreenshotsSection from '../components/movie/ScreenshotsSection';
import TrailerSection from '../components/movie/TrailerSection';
import MovieInfoSidebar from '../components/movie/MovieInfoSidebar';
import RelatedMoviesCarousel from '../components/movie/RelatedMoviesCarousel';
import ReviewsCommentsSection from '../components/common/ReviewsCommentsSection';

const MovieDetailPage = () => {
    const { id } = useParams();

    const [toastMessage, setToastMessage] = useState(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [selectedScreenshot, setSelectedScreenshot] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    // Dummy movie data
    const movie = {
        id: id || 1,
        title: 'Echoes of Eden',
        bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
        year: 2024,
        country: 'Ethiopia',
        runtime: '2h 15m',
        quality: '4K',
        language: 'Amharic',
        subtitles: 'English Subs',
        genres: ['Sci-Fi', 'Adventure'],
        rating: 8.8,
        director: 'Kenji Sato',
        writers: 'Amina Diallo, Marcus Thorne',
        studio: 'Nebula Pictures',
        releaseDate: 'Oct 12, 2024',
        trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        description: 'When a routine exploratory mission goes catastrophically wrong, Commander Elara Vance finds herself stranded on the uncharted, bioluminescent world of Eden-9...',
        cast: [
            { id: 1, name: "Lupita Nyong'o", role: 'Elara Vance', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
            { id: 2, name: 'John Boyega', role: 'Kaelen', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
            { id: 3, name: 'Djimon Hounsou', role: 'The Elder', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
            { id: 4, name: 'Letitia Wright', role: 'Dr. Aris', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
        ],
        screenshots: [
            'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        ],
        trailerThumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    };

    const relatedMovies = [
        { id: 2, title: 'Neon Drifters', posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80', year: 2023, rating: 7.9 },
        { id: 3, title: 'The Silent Horizon', posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80', year: 2024, rating: 9.1 },
        { id: 4, title: 'Quantum Paradox', posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', year: 2024, rating: 8.7 },
        { id: 5, title: 'Abyssinia Chronicles', posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80', year: 2024, rating: 9.3 },
    ];

    return (
        <div className="min-h-screen bg-background text-on-background flex flex-col relative">
            <Navbar />

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-primary/40 animate-bounce">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    <span className="text-sm font-semibold">{toastMessage}</span>
                </div>
            )}

            {/* Trailer Modal */}
            {isTrailerOpen && (
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
                        <CastSection cast={movie.cast} />

                        {/* Screenshots */}
                        <ScreenshotsSection
                            screenshots={movie.screenshots}
                            onSelectScreenshot={(url) => setSelectedScreenshot(url)}
                        />

                        {/* Trailer */}
                        <TrailerSection
                            thumbnailUrl={movie.trailerThumbnail}
                            onPlayTrailer={() => setIsTrailerOpen(true)}
                        />
                    </div>

                    {/* Right column: sticky sidebar */}
                    <div className="lg:col-span-4">
                        <MovieInfoSidebar movie={movie} />
                    </div>
                </section>

                {/* Movie Reviews & Comments */}
                <ReviewsCommentsSection title="Viewer Reviews & Discussions" />

                {/* You Might Also Like */}
                <RelatedMoviesCarousel movies={relatedMovies} />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MovieDetailPage;
