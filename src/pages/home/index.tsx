import SearchBar from '../search/search-bar';
import HomeIcon from '@/components/icons/home';
import ExploreIcon from '@/components/icons/explore';
import ProfileIcon from '@/components/icons/profile';
import { useNavigate } from 'react-router-dom';

// Import components
import HeroSection from './hero-section';
import QuickActions from './quick-actions';
import FeaturedServices from './featured-services';
import FeaturedDepartents from './featured-departents';
import HealthNews from './health-news';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="pb-24">
        {/* Hero Section - Full Width */}
        <HeroSection />

        {/* Content Sections - With improved spacing and consistent layout */}
        <div className="mx-auto px-4">
          {/* Featured Services Section */}
          <section className="mt-6">
            <FeaturedServices />
          </section>

          {/* Featured Departments Section */}
          <section className="mt-6">
            <FeaturedDepartents />
          </section>

          {/* Health News Section */}
          <section className="mt-6 mb-8">
            <HealthNews />
          </section>
        </div>
      </div>

      {/* Custom styling for enhanced UI */}
      <style>
        {`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #0D47A1 0%, #1565C0 100%);
        }
      `}
      </style>
    </div>
  );
}

export default HomePage;
