import Navbar from '../components/common/Navbar';
import HeroSection from '../components/common/HeroSection';
import BentoGrid from '../components/common/BentoGrid';
import Footer from '../components/common/Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-dark-bg text-white flex flex-col animate-fade-in">
      <main className="flex-grow  md:pb-0">
        <HeroSection />
        <BentoGrid />
      </main>
      <Footer />
    </div>
    </>
  );
};

export default HomePage;