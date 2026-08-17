import Navbar from '../components/common/Navbar';
import HeroSection from '../components/common/HeroSection';
import BentoGrid from '../components/common/BentoGrid';
import Footer from '../components/common/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col animate-fade-in">
      <Navbar />
      <main className="flex-grow pt-[80px] pb-20 md:pb-0">
        <HeroSection />
        <BentoGrid />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;