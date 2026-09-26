import Footer from '../components/common/Footer';
import HomeCategories from '../components/home/HomeCategories';
import HomeFeatured from '../components/home/HomeFeatured';
import HomeHero from '../components/home/HomeHero';

import HomeStats from '../components/home/HomeStats';
import HomeTestimonials from '../components/home/HomeTestimonials';
import HomeReveal from '../components/home/HomeReveal';
import Navbar from '../components/common/Navbar';

const HomePage = () => {
  return (
    <div className="bg-background text-on-surface antialiased selection:bg-primary/30 selection:text-on-primary-container">
      <Navbar />
      <main className="w-full bg-background pb-20 md:pb-0">
        <HomeReveal>
          <HomeHero />
        </HomeReveal>
        <HomeReveal delay={80}>
          <HomeStats />
        </HomeReveal>
        <HomeReveal delay={120}>
          <HomeCategories />
        </HomeReveal>
        <HomeReveal delay={160}>
          <HomeFeatured />
        </HomeReveal>
        <HomeReveal delay={200}>
          <HomeTestimonials />
        </HomeReveal>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;