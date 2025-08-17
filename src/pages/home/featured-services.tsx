import ArrowRightIcon from '@/components/icons/arrow-right';
import Section from '@/components/section';
import { useAtomValue } from 'jotai';
import { servicesAtom } from '@/services/post';
import { useNavigate } from 'react-router-dom';
import TransitionLink from '@/components/transition-link';
import { useEffect, useState } from 'react';

const POST_ATOM_PARAMS = { per_page: 4 };

interface FeaturedServicesProps {
  className?: string;
}

export default function FeaturedServices({ className }: FeaturedServicesProps) {
  const data = useAtomValue(servicesAtom(POST_ATOM_PARAMS));
  const posts = (data as any) || [];
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!data || posts.length === 0);

  // Handle loading state
  useEffect(() => {
    setIsLoading(!data || posts.length === 0);
  }, [data, posts.length]);

  // Add loading skeletons
  const renderSkeletons = () => {
    return (
      <>
        {/* Mobile skeleton - Enhanced for better mobile UX */}
        <div className="flex gap-3 overflow-x-auto pb-3 px-4 hide-scrollbar scroll-snap-x md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`mobile-skeleton-${index}`}
              className="flex-shrink-0 w-[300px] xs:w-[280px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-snap-align animate-pulse"
            >
              <div className="w-full h-[180px] xs:h-[160px] bg-gray-200"></div>
              <div className="p-5 xs:p-4">
                <div className="h-6 xs:h-5 bg-gray-300 rounded w-3/4 mb-4 xs:mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-5 xs:mb-4"></div>
                <div className="h-12 xs:h-10 bg-medical-200 rounded-lg w-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop skeleton - Responsive grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5 md:overflow-x-visible md:pb-0 px-4 md:px-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`desktop-skeleton-${index}`}
              className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="w-full h-[160px] bg-gray-200"></div>
              <div className="flex flex-col flex-1 p-4">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="mt-auto h-10 bg-medical-200 rounded-lg w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  // Custom service icon for section title
  const ServiceIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-medical-600"
    >
      <path
        d="M19.5 12.5C19.5 11.12 20.62 10 22 10V9C22 5 21 4 17 4H7C3 4 2 5 2 9V9.5C3.38 9.5 4.5 10.62 4.5 12C4.5 13.38 3.38 14.5 2 14.5V15C2 19 3 20 7 20H17C21 20 22 19 22 15C20.62 15 19.5 13.88 19.5 12.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 4V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 5"
      />
    </svg>
  );

  return (
    <Section
      className={`pt-4 pb-3 xs:pt-3 xs:pb-2 ${className ?? ''}`}
      title="Dịch vụ nổi bật"
      subtitle="Khám phá các dịch vụ y tế chất lượng cao"
      viewMore="/services"
      icon={<ServiceIcon />}
      variant="medical"
      gradient={true}
      pattern={true}
      animation={true}
      compact={true}
      mobileOptimized={true}
      size="md"
    >
      {isLoading ? (
        renderSkeletons()
      ) : (
        <>
          {/* Mobile: Enhanced horizontal scroll with better touch targets */}
          <div className="flex gap-3 overflow-x-auto pb-3 px-4 hide-scrollbar scroll-snap-x md:hidden">
            {posts.map((post) => (
              <TransitionLink
                key={post.id}
                to={`/service/${post.id}`}
                className="flex-shrink-0 w-[300px] xs:w-[280px] bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2 cursor-pointer text-left hover:shadow-md hover:-translate-y-1 active:scale-95 overflow-hidden scroll-snap-align touch-manipulation"
                aria-label={`Xem dịch vụ ${post.title.rendered}`}
              >
                <div className="relative">
                  <img
                    src={post?._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                    alt={post.title.rendered}
                    className="w-full h-[180px] xs:h-[160px] object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Enhanced badge with better mobile visibility */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-medical-500 text-white text-xs font-medium px-3 py-1.5 xs:px-2 xs:py-1 rounded-lg shadow-md">
                      Nổi bật
                    </span>
                  </div>
                </div>

                <div className="p-5 xs:p-4">
                  <div
                    className="text-gray-900 text-xl xs:text-lg font-bold mb-3 xs:mb-2 line-clamp-2 leading-tight group-hover:text-medical-600 transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  {post.excerpt?.rendered && (
                    <div
                      className="text-gray-600 text-base xs:text-sm mb-5 xs:mb-4 line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                  )}
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-4 xs:py-3 rounded-lg bg-medical-500 text-white text-base xs:text-sm font-semibold hover:bg-medical-600 active:scale-95 transition-all duration-200 shadow-sm min-h-[48px] touch-manipulation">
                    Xem chi tiết
                    <ArrowRightIcon width={18} height={18} color="white" className="xs:w-4 xs:h-4" />
                  </button>
                </div>
              </TransitionLink>
            ))}
          </div>

          {/* Desktop: Responsive grid layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5 md:overflow-x-visible md:pb-0 px-4 md:px-1">
            {posts.map((post) => (
              <TransitionLink
                key={post.id}
                to={`/service/${post.id}`}
                className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2 cursor-pointer text-left hover:shadow-md hover:-translate-y-1 active:scale-95 overflow-hidden touch-manipulation"
                aria-label={`Xem dịch vụ ${post.title.rendered}`}
              >
                <div className="relative">
                  <img
                    src={post?._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                    alt={post.title.rendered}
                    className="w-full h-[160px] object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Enhanced badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-medical-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-sm">
                      Nổi bật
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-4">
                  <div
                    className="text-gray-900 text-lg font-bold mb-2 line-clamp-2 leading-tight group-hover:text-medical-600 transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  {post.excerpt?.rendered && (
                    <div
                      className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                  )}
                  <button className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-medical-500 text-white text-sm font-semibold hover:bg-medical-600 active:scale-95 transition-all duration-200 shadow-sm min-h-[44px] touch-manipulation">
                    Xem chi tiết
                    <ArrowRightIcon width={16} height={16} color="white" />
                  </button>
                </div>
              </TransitionLink>
            ))}
          </div>
        </>
      )}

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-snap-x {
          scroll-snap-type: x mandatory;
        }
        .scroll-snap-align {
          scroll-snap-align: start;
        }

        /* Enhanced mobile optimizations */
        @media (max-width: 360px) {
          .xs\\:w-\\[280px\\] {
            width: 280px;
          }
          .xs\\:h-\\[160px\\] {
            height: 160px;
          }
          .xs\\:p-4 {
            padding: 1rem;
          }
          .xs\\:mb-2 {
            margin-bottom: 0.5rem;
          }
          .xs\\:mb-3 {
            margin-bottom: 0.75rem;
          }
          .xs\\:mb-4 {
            margin-bottom: 1rem;
          }
          .xs\\:py-3 {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          .xs\\:text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
          .xs\\:text-sm {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
          .xs\\:w-4 {
            width: 1rem;
          }
          .xs\\:h-4 {
            height: 1rem;
          }
          .xs\\:px-2 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          .xs\\:py-1 {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
          }
          .xs\\:pt-3 {
            padding-top: 0.75rem;
          }
          .xs\\:pb-2 {
            padding-bottom: 0.5rem;
          }
        }

        /* Touch optimization */
        .touch-manipulation {
          touch-action: manipulation;
        }

        /* Better focus states for mobile accessibility */
        @media (max-width: 768px) {
          button:focus,
          a:focus {
            outline: 2px solid #2196F3;
            outline-offset: 2px;
          }
        }
      `}</style>
    </Section>
  );
}
