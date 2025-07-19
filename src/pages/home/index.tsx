import SearchBar from '../search/search-bar';
import HomeIcon from '@/components/icons/home';
import ExploreIcon from '@/components/icons/explore';
import ProfileIcon from '@/components/icons/profile';
import { useNavigate } from 'react-router-dom';

// Import only components we actually use
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
        {' '}
        {/* Added bottom padding to accommodate the fixed navigation */}
        {/* Hero Section - Full Width */}
        <HeroSection />
        {/* Search Bar - With improved visual separation */}
        {/* <div className="bg-white shadow-md border-b border-gray-200 px-4 py-4 -mt-2 mb-6">
          <SearchBar className="mx-0" />
        </div> */}
        {/* Content Sections - With improved spacing */}
        <div className="mx-auto px-4 sm:px-6">
          {/* Quick Actions Section */}
          {/* <section className="mb-10">
            <QuickActions />
          </section> */}

          {/* Featured Services Section */}
          <section className="mb-6">
            <FeaturedServices />
          </section>

          {/* Featured Departments Section */}
          <section className="mb-6">
            <FeaturedDepartents />
          </section>

          {/* Health News Section */}
          <section className="mb-6">
            <HealthNews />
          </section>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
