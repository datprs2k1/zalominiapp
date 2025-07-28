import { useEffect, useState } from 'react';
// Import components
import HeroSection from './hero-section';
import FeaturedServices from './featured-services';
import FeaturedDepartents from './featured-departents';
import HealthNews from './health-news';
import SearchBarComponent from '@/components/search-bar-component';
import { SPACING, BORDER_RADIUS, combineClasses } from '@/styles/medical-design-system';

function HomePage() {
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    // Ensure layout is stable before showing content
    const timer = setTimeout(() => {
      setIsLayoutReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLayoutReady) {
    return (
      <main className="min-h-screen w-full py-4">
        <div className="animate-pulse space-y-4 px-4 max-w-md mx-auto">
          <div className="h-12 border-2 border-blue-200 rounded-2xl"></div>
          <div className="h-48 border-2 border-gray-200 rounded-3xl"></div>
          <div className="space-y-3">
            <div className="h-32 border-2 border-blue-100 rounded-2xl"></div>
            <div className="h-32 border-2 border-green-100 rounded-2xl"></div>
            <div className="h-32 border-2 border-teal-100 rounded-2xl"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gray-50">
      {/* Streamlined Content Block */}
      <div className={combineClasses('medical-unified-block', SPACING.padding.section, 'pb-6 max-w-md mx-auto')}>
        <div
          className={combineClasses(
            'medical-content-container',
            BORDER_RADIUS.cardLarge,
            'border border-gray-100',
            'overflow-hidden',
            'bg-white shadow-sm'
          )}
        >
          {/* Search Bar */}
          <div className="medical-search-section p-3 border-b border-gray-50">
            <SearchBarComponent
              medicalContext="general"
              placeholder="Tìm kiếm dịch vụ y tế, bác sĩ, chuyên khoa..."
              ariaLabel="Tìm kiếm dịch vụ y tế tại bệnh viện"
            />
          </div>

          {/* Hero Section */}
          <div className="medical-hero-section">
            <HeroSection />
          </div>

          {/* Featured Services Section */}
          <div className="medical-services-section pt-3 px-3" role="region" aria-labelledby="featured-services-heading">
            <FeaturedServices />
          </div>

          {/* Featured Departments Section */}
          <div
            className="medical-departments-section pt-3 px-3"
            role="region"
            aria-labelledby="featured-departments-heading"
          >
            <FeaturedDepartents />
          </div>

          {/* Health News Section */}
          <div className="medical-news-section pt-3 px-3 pb-3" role="region" aria-labelledby="health-news-heading">
            <HealthNews />
          </div>

          {/* Development Demo Section - Only show in development */}
          {import.meta.env.DEV && (
            <div className="medical-demo-section pt-4 border-t border-gray-100 mt-4">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">🚀 Development Demo</h3>
                <a
                  href="/demo/transitions"
                  className="inline-flex items-center px-3 py-2 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Page Transitions & Loading Demo
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clean Medical UI Styling */}
      <style>
        {`
        /* Simplified animations with better performance */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Unified block animation */
        .medical-unified-block {
          opacity: 0;
          animation: fadeInUp 0.5s ease-out forwards;
        }

        /* Simplified container transitions */
        .medical-content-container {
          transition: all 0.2s ease-out;
        }

        .medical-content-container:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
        }

        /* Clean section separation */
        .medical-services-section,
        .medical-departments-section,
        .medical-news-section {
          position: relative;
        }

        .medical-services-section:before,
        .medical-departments-section:before {
          content: "";
          height: 1px;
          position: absolute;
          top: 0;
          left: 12px;
          right: 12px;
          border-top: 1px solid #F3F4F6;
        }

        /* Clean scrollbar hiding */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Medical color variables */
        :root {
          --medical-primary: #0066CC;
          --medical-primary-dark: #004499;
          --medical-secondary: #00AA44;
          --medical-secondary-dark: #008833;
        }

        /* Clean responsive design */
        @media (max-width: 768px) {
          /* Disable hover effects on mobile */
          .medical-content-container:hover {
            transform: none;
            border-color: #D1D5DB;
          }
        }

        /* Accessibility enhancements */
        @media (prefers-reduced-motion: reduce) {
          .medical-unified-block,
          .medical-content-container {
            animation: none;
            opacity: 1;
            transform: none;
          }
          
          .medical-services-section:before,
          .medical-departments-section:before,
          .medical-news-section:before {
            opacity: 0;
          }
        }

        /* Focus states for accessibility */
        .medical-content-container:focus-within {
          outline: 2px solid var(--medical-primary);
          outline-offset: 2px;
        }
        `}
      </style>
    </main>
  );
}

export default HomePage;
