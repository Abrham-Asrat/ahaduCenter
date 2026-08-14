import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/common/HeroSection';
import BentoGrid from '../components/common/BentoGrid';
import Footer from '../components/common/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[80px]">
        <HeroSection />
        <BentoGrid />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
