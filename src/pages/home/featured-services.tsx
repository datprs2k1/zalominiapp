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
        {/* Mobile skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-2 px-1 hide-scrollbar scroll-snap-x md:hidden">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`mobile-skeleton-${index}`}
              className="flex-shrink-0 w-[60vw] h-[90vw] max-w-[340px] max-h-[510px] rounded-3xl shadow-md bg-white border border-gray-100 overflow-hidden relative scroll-snap-align animate-pulse"
            >
              <div className="w-full h-full bg-gray-200"></div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                <div className="h-6 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
                <div className="h-10 bg-blue-300 rounded-xl w-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop skeleton */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-5 md:overflow-x-visible md:pb-0 px-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`desktop-skeleton-${index}`}
              className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[220px] animate-pulse"
            >
              <div className="w-full aspect-[4/3] bg-gray-200"></div>
              <div className="flex flex-col flex-1 p-3 md:p-4">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="mt-auto h-8 bg-blue-300 rounded-lg w-full"></div>
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
      className="text-blue-600"
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
      className={`pt-3 pb-2 ${className ?? ''}`}
      title="Dịch vụ nổi bật"
      viewMore="/services"
      isCard
      icon={<ServiceIcon />}
      accentColor="blue"
    >
      {isLoading ? (
        renderSkeletons()
      ) : (
        <>
          {/* Mobile: Reel style scroll-snap */}
          <div className="flex gap-4 overflow-x-auto pb-2 px-1 hide-scrollbar scroll-snap-x md:hidden">
            {posts.map((post) => (
              <TransitionLink
                key={post.id}
                to={`/service/${post.id}`}
                className="flex-shrink-0 w-[60vw] h-[90vw] max-w-[340px] max-h-[510px] rounded-3xl shadow-md bg-white border border-gray-100 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-left active:scale-95 overflow-hidden relative scroll-snap-align"
                aria-label={`Xem dịch vụ ${post.title.rendered}`}
              >
                <div className="relative w-full h-full">
                  <img
                    src={post?._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                    alt={post.title.rendered}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>

                  <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col">
                    {/* Badge */}
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3 border border-white/30">
                      Dịch vụ nổi bật
                    </span>

                    <div
                      className="text-white text-[1.1rem] font-bold mb-3 line-clamp-2 tracking-wide leading-tight drop-shadow group-hover:translate-y-0 transform transition-transform duration-300"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <span className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-base font-semibold active:scale-95 text-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                      Xem chi tiết
                      <ArrowRightIcon width={20} height={20} color="white" />
                    </span>
                  </div>
                </div>
              </TransitionLink>
            ))}
          </div>

          {/* Desktop: grid layout */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-5 md:overflow-x-visible md:pb-0 px-1">
            {posts.map((post) => (
              <TransitionLink
                key={post.id}
                to={`/service/${post.id}`}
                className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-left active:scale-95 overflow-hidden min-h-[220px] hover:shadow-md hover:-translate-y-1"
                aria-label={`Xem dịch vụ ${post.title.rendered}`}
              >
                <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={post?._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                    alt={post.title.rendered}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-0"></div>

                  {/* Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-blue-500/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
                      Nổi bật
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-3 md:p-4">
                  <div
                    className="text-blue-700 text-base font-bold mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  {post.excerpt?.rendered && (
                    <div
                      className="hidden md:block text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                  )}
                  <span className="mt-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold active:scale-95 text-center shadow-sm group-hover:shadow-md transition-all">
                    Xem chi tiết
                    <ArrowRightIcon width={16} height={16} color="white" />
                  </span>
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
      `}</style>
    </Section>
  );
}
