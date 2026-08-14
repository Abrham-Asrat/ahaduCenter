// src/pages/MovieDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import MovieDetailHero from '../components/movie/MovieDetailHero';
import CastSection from '../components/movie/CastSection';
import ScreenshotsSection from '../components/movie/ScreenshotsSection';
import TrailerSection from '../components/movie/TrailerSection';
import MovieInfoSidebar from '../components/movie/MovieInfoSidebar';
import RelatedMoviesCarousel from '../components/movie/RelatedMoviesCarousel';
import Footer from '../components/common/Footer';

/**
 * MovieDetailPage Component
 * 
 * Main page for displaying a single movie's details.
 * Uses useParams to get the movie ID from the URL.
 * In production, we would fetch movie data from the backend using the ID.
 * For now, we use dummy data.
 */
const MovieDetailPage = () => {
    // Get movie ID from URL
    const { id } = useParams();

    // Dummy movie data (will be replaced with API call later)
    const movie = {
        title: 'Echoes of Eden',
        bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9jfE68J4cjSrkge16Q8_XajlEfBQWlrP5G7dkbvMolNez54Rm6yoX_KswOHS-6Lccq_8MEsepc5skEpUks81tOXge843qciScL5_0SJfYHT1QHnSmv_Pqm_UY9qmcJKyo_qvXvP_nvO-tqh_n61rjIPFQmWKm5i-E0pkVPRzlzGqsbT_S8Y_UTRCcF2q97k8fwTHgKj2nCzwcOtLSWX45P-nPqH68YzKueYjpCMSyGbTGLplnH4rLNw',
        posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc3V02vhn__liMPxOnRovvnH6sKuy6dN2L4ALfZmZ1ygribVnK7nwvmTjT3nuuEHidpfAQX0ktjhRljfABPBuh9dPbUJ-W--crwRxFA1Ll7kM5S-bnQyY-BR82Bjl22__J3mE0HU5mu73IHthuFgjht4nRk7OmBPTgqQaE3iOyMrQ-7l0_Z5EXBC_qc21o9Bw_5FpdIXFjXeES5Upmy_SDpHahLi3l6NxA1UeB_Sr40jDIUBVTLRrOlg',
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
        description: 'When a routine exploratory mission goes catastrophically wrong, Commander Elara Vance finds herself stranded on the uncharted, bioluminescent world of Eden-9...',
        cast: [
            { id: 1, name: "Lupita Nyong'o", role: 'Elara Vance', photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu1M-N7mKhooYqQtGvPmwDFxv_L4CZIPw6dUl-30OBRSaHQIzaR8PlF2NLPAlNv5S3_51bHBnFo0riBe1A-sG85-MROX5CQ45j5ZWivB24M_VPH5LPzzrAZC1AU9DyztZjZloXQO1mu0KMbr25MczYZDbNk3r4iuwCY_oJro4AgXyMBNJjCY57cYqFxkUi8kooYxfHALcS-nesngMRqIkA2BrjVJFQpDiCZ_h601BOTOAoCh8guP9ahQ' },
            { id: 2, name: 'John Boyega', role: 'Kaelen', photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVJcxRit6b72-9NWLkOw_eOKTveqFXKZ3qoEeS7pfXgh1ThX7Twt4zxKVagL-sFv8A42HtnqvI-MnZtEJ90HCd-HtWRT3OA0zKe15UoWZIMbbw78XAFnJISAM5cO_z3euQnpjojRiL0zKjOqipGZ1iGUc0KF6fmQlFWxey9_M3M_n4e9MhJgaFnE4kgdvCdVqLoe6-92gH7iF7X_uE2qELXgEuIiPg5GP1mB6TpeKios4bqflu7FOLnw' },
            { id: 3, name: 'Djimon Hounsou', role: 'The Elder', photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKp6YwNc5nSyskZE9PQGcIxvLXnjj9bVEWZLST4Wph5PVOeUX_Z_8gHSb_ZIlroyDhdQl5cVluHXpXCiXS-OG5xxXAjjKMJqr793bGh7miK8Px-wNa1HlSenEuI9jVkHTQGVWli7u1UVNNHT4K_P0LTKuaDaY3tM3klUKSXabwa5CUN2CgLGqxAEXrDCEmGfhBre9A940D4Nwk8vrR5Gn-wFie0Ee_XlN73AV--7MzGjQuxg9iOtiKgg' },
            { id: 4, name: 'Letitia Wright', role: 'Dr. Aris', photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjOPNr-gN0dpWzXAxuw8SFjJ5u4matd64gCYTHCuH7Y0G0-Uz8n6BgpcmQU8_eCuT4mi_rQn7B1mkBIBhGADA48Atevhz5jm_El0XW48DZFpKPXkf1v21upfQbwiDUGC2bVbMfU6YdY7BbhBLmdg_pYWS2zIth6Jo4LQSo1QiJqPmVaUB4dz1BCqX2rfhv_mOG-cgX072-QIdGRE8DHk-LvvLHDf8TGFa-NYr7gdg2GRjv6ADLbiFWuw' },
            { id: 5, name: 'Daniel Kaluuya', role: 'Unit 7', photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaLbjhd5ucugj5ZBk62Yzhi6BnKbovctljrpxrOOMYDC2YlCgEm1sn7jYILZlLbnT30lI5bB9yQLUmP0juy2ZU5CYZlo72Qvbmk9iEoQEgUYdgEIpcxeWavQ_nI6ahGJ_PTM6z6_eXfmW7l7bdKyG3P0mHJ3woEHB7Swk_phYJmVfs9U5USk0sZajtgiSazG275W31MUlN-pwqaVlHVJcDFmM3OwJuMlHhs_mxLr2qXmhWtaQtEOszkg' },
        ],
        screenshots: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBTWYE-CZp32u_Q5CxR5i3OsFJHgi3jSzOnbvZotqRioVd1qH6C6J9tU9hEBnq_o-wbg2Oaumy1foI7Xp4a1zwZadh999KJ2xLrPm1r6-xtEjChurnI9Y-bB_FfRYIkjakM6cYhHQr3AUzkMx78y7lFzWjelYqOgelqkF8ICw_JasFZwtBcvsdFqjm3xT65mLwkDwlQ8kd1t1J5LPiLYYHOsHTGr_ZNkOnw6kPXn2SRxz87O_HqGFcrQw',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDNYL7dK8qtzib8i4QU2B-yPiYpDykR5nc7Z78pSpQp-1Frx_6DgF3ui5UuVZWHcpK09MWhmPOxkDDoKocv7eXXe1pzNYVpB4xAdDmiORjkzoFZhBgrztc_6z-ftpRpoZoAud-QzGnM7qnPsKNhHg0yCFIdG6lB12hX-s8GF1vxtRFA6fCBfqC55lXn1J54Wsgg1L1VAvP2nwQu9T-FeoaNd03BHEfRBQwvStKBMP3Z-XuuXVJAYe-sFg',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAunkIMpnWzFSjgij-dhamd-FbvkmBI-kJh3LzDAQIMi5d2T6r3ympdZPPvxxrnpKlxo5qPIUxY8aoZJQztIj6P_inxsXG9VdwiAMO9evrhT_eP2dA41jchXjGEDIiU-5W2HvkwRyhwJrqoIxnOVFQk_pCJfKgd7374hUDDVSAKq1G97dFVTwDzVEgjZPDCeVCnQJqyT27fS52XkJ2wa2RJOs3sPhyb3u4UMcb0f6aVT2gMsSofONHEAA',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCDvtrmj2zQVBeHVcsrOkMHZVHS2zCvgdtXOopgs-uE8T1be80p0uZtFa1Pl8jVzgJJ-0-smYnh3kJDKcWYI8vUYGvic28qZHH6nuXFcmukqDm6YZHjIjVYcYwKbifDGEVw4SSZ6xylb378_lShfK1AoLv96qWWm_7-C7hWuQY-Gr8ZMgbsWQ1YemJyQDTutPXvzeOWISGY3BSYs49K5GJDdwCWk4IZ5KYWyPgj4Wrm8MFYx5reSCeICA',
        ],
        trailerThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSgK0Yrck-D-LtDEvEnLcy8Zs6bwzhEorucHLru-Njnfos5APnMg3olfhZRD3vTy_aewaCh97UDHgqbjHP0cchtLavbL8TJYshseu0Y-_fQIdCfbTQDthOygMMD0kY9CE7-VUupojXelvdges5OsjIazKEXtmqXMUBk26WSi1PrhRwOU63ajkaP7YCnzdj2c5RtBskwmNW0dVf27GAle4l3dDBIPwOVM1Qdh-1qaL694sJ4LNzE-EjkA',
    };

    // Dummy related movies data
    const relatedMovies = [
        { id: 1, title: 'Ringworld', posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRGSMgnm9wd0-b9V1x77Pi63I0p4qJN6KgftuOlykIZ8MLWQETK4Ig2nkPjCOiEtraj525zTV4r6q0Rv4ZqpRAfqCFbVeGwp0WMsuh8C1L8Vqohgp7c4pwP6QcXWmR3lQubLZycxd78pFawzJWP7xd18z4W14eLdgWRFBy0F-kiAxWKvKZEYrdmAjTSy2KHD2Y64xqZ5SgAs6oJTpAFfF8nyv04KgNQPz2HNy6dEQaTDpDoKOwWKIRmg', year: 2025, rating: 8.2 },
        { id: 2, title: 'Neon Descent', posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm7AXOPcOIvecWnh5yZPxIh2HR6rVapH5VZfXETxr_uUpQJNYpmKlNR5Gj7wXUeFUGxkeft0ruY-BAF66WZv7X_7K32arGX-lVXmk3b49Gp-_pMsgltVDUWoJclLiET96IkkRNekYM2WkI_b-C3A_BXnk9lbAPltKGNyZS1Y86XLdpiwSqYy_ePdGp-5cPI-qUXtZE3WoemVdKgURpZGXOScsvhabK9vL75JKSwC3iEoVsZRKDrPXpGg', year: 2023, rating: 7.9 },
        { id: 3, title: 'Void Walker', posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApXVLtyRQOrVdAljp1oJnqvEGjs1M7MOzcFaAkpX6mG4YeUGUX33zUw-7aqwG5MwTiICWee5QHiqq4ZCXzxC4R2R0U7rHk8UXV_fNQ6ZvyfWJNz_uA6zZZUMmfuoRjWM3kuk9o2FRIZd8pAafueDUSlhM9oGILIos4RjgJHQXPj0PZGxV7kaMmU1_GkRKfuXq-YU-jD9-cDpTvAT7-ZS7hRbgudkHPRlAv-RDztyxHHg_cR-FQkTfhxg', year: 2024, rating: 8.5 },
        { id: 4, title: 'Subterra', posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMgXpG732b0jVUdyt7x35hOs3MdlaDFD1_UzKeTZIRQfNMGbW7eUPCColRs21BtoabY-oAnLXVJq4UILVl0CXmk96mw4U7W0Qbdb5RfTcC44IvwLwQMqwykQC9sAYpAhKV-uFw-wOpBmaCTprDOAc5ICZM0-WO3S--QhgfZw74Ql55YSlFXUKQIFPzapuWcYlGKLQsZ3NQAsCRWEYztthtnfDak8TDkrCeqfiVeMYjtomo4x6z52GRJQ', year: 2022, rating: 7.4 },
    ];

    return (
        <div className="min-h-screen bg-background text-on-background flex flex-col">
            {/* Top Navigation */}
            <Navbar />

            <main className="flex-grow pt-[80px]">
                {/* Hero Banner */}
                <MovieDetailHero movie={movie} />

                {/* Two-column layout */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                    {/* Left column: main content */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Storyline */}
                        <div className="glass-panel p-6 rounded-xl">
                            <h2 className="text-2xl font-semibold text-white mb-3">Storyline</h2>
                            <p className="text-lg text-on-surface-variant leading-relaxed">
                                {movie.description}
                            </p>
                        </div>

                        {/* Cast */}
                        <CastSection cast={movie.cast} />

                        {/* Screenshots */}
                        <ScreenshotsSection screenshots={movie.screenshots} />

                        {/* Trailer */}
                        <TrailerSection thumbnailUrl={movie.trailerThumbnail} />
                    </div>

                    {/* Right column: sticky sidebar */}
                    <div className="lg:col-span-4">
                        <MovieInfoSidebar movie={movie} />
                    </div>
                </section>

                {/* You Might Also Like */}
                <RelatedMoviesCarousel movies={relatedMovies} />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MovieDetailPage;