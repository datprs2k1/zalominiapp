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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search Bar - Fixed at top for mobile */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100 px-1 py-3">
        <SearchBar className="mx-0" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6 pt-2">
        {/* Hero Section - Full Width */}
        <HeroSection className="mb-4" />

        {/* Content Sections */}
        <div className="px-3">
          <QuickActions />
          <FeaturedServices />
          <FeaturedDepartents />
          <HealthNews />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-2 z-10 shadow-lg">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button className="flex flex-col items-center p-2 w-1/4">
            <HomeIcon active className="h-6 w-6" />
            <span className="text-xs mt-1 text-blue-500 font-medium">Trang chủ</span>
          </button>

          <button onClick={() => navigate('/explore')} className="flex flex-col items-center p-2 w-1/4">
            <ExploreIcon className="h-6 w-6" />
            <span className="text-xs mt-1 text-gray-600">Khám phá</span>
          </button>

          <button onClick={() => navigate('/booking')} className="flex flex-col items-center p-2 w-1/4">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></div>
            </div>
            <span className="text-xs mt-1 text-gray-600">Đặt lịch</span>
          </button>

          <button onClick={() => navigate('/profile')} className="flex flex-col items-center p-2 w-1/4">
            <ProfileIcon className="h-6 w-6" />
            <span className="text-xs mt-1 text-gray-600">Cá nhân</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
