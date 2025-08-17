// Import only components we actually use
import HeroSection from './hero-section';
import QuickActions from './quick-actions';
import FeaturedServices from './featured-services';
import FeaturedDepartents from './featured-departents';
import HealthNews from './health-news';

function HomePage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6 pt-2 bg-white">
        {/* Hero Section - Full Width */}

        {/* Content Sections */}
        <QuickActions />
        <HeroSection />
        <FeaturedServices />
        <FeaturedDepartents />
        <HealthNews />
      </div>
    </div>
  );
}

export default HomePage;
