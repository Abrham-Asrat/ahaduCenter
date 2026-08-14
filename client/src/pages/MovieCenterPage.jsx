import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import MovieHero from '../components/movie/MovieHero';
import SubNav from '../components/common/SubNav';
import MovieFilters from '../components/movie/MovieFilters';
import MovieCard from '../components/movie/MovieCard';
import Pagination from '../components/common/Pagination';
import Footer from '../components/common/Footer';

const MovieCenterPage = () => {
  const [filters, setFilters] = useState({ genres: [], contentType: 'All' });
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const movies = [
    {
      id: 1,
      title: 'Starlight Protocol',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      rating: 8.4,
      quality: '4K',
      availability: 'Available',
      genres: ['Sci-Fi'],
      year: 2024,
    },
    {
      id: 2,
      title: 'Neon Drifters',
      posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      rating: 7.9,
      quality: 'HD',
      availability: 'Coming Soon',
      genres: ['Action'],
      year: 2023,
    },
    {
      id: 3,
      title: 'The Silent Horizon',
      posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
      rating: 9.1,
      quality: '4K',
      availability: 'Available',
      genres: ['Drama'],
      year: 2024,
    },
    {
      id: 4,
      title: 'Quantum Paradox',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      rating: 8.7,
      quality: '4K',
      availability: 'Available',
      genres: ['Sci-Fi'],
      year: 2024,
    },
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-[80px]">
        <MovieHero />
        <SubNav onTabChange={handleTabChange} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <MovieFilters onFilterChange={handleFilterChange} />
          </aside>

          <div className="flex-grow">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieCenterPage;
