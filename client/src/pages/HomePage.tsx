import Footer from '../components/common/Footer';
import HomeCategories from '../components/home/HomeCategories';
import HomeFeatured from '../components/home/HomeFeatured';
import HomeHero from '../components/home/HomeHero';
import HomeProcess from '../components/home/HomeProcess';
import HomeStats from '../components/home/HomeStats';
import HomeTestimonials from '../components/home/HomeTestimonials';
import Navbar from '../components/common/Navbar';

const HomePage = () => {
  return (
    <div className="bg-background text-on-surface antialiased selection:bg-primary/30 selection:text-on-primary-container">
      <Navbar />
      <main className="w-full bg-background">
        <HomeHero />
        <HomeStats />
        <HomeCategories />
        <HomeFeatured />
        <HomeProcess />
        <HomeTestimonials />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;