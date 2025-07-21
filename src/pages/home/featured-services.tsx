import ArrowRightIcon from '@/components/icons/arrow-right';
import Section from '@/components/section';
import { useAtomValue } from 'jotai';
import { servicesAtom } from '@/services/post';
import TransitionLink from '@/components/transition-link';
import { memo, useCallback, useEffect, useState } from 'react';

const POST_ATOM_PARAMS = { per_page: 4 };

interface FeaturedServicesProps {
  className?: string;
}

// Define types for our components
interface ServiceCardProps {
  post: any;
}

interface SkeletonCardProps {
  isMobile: boolean;
}

// Memoize service card components for better performance
const ServiceCardMobile = memo(({ post }: ServiceCardProps) => (
  <TransitionLink
    to={`/service/${post.id}`}
    className="flex-shrink-0 w-[220px] rounded-xl bg-white overflow-hidden relative scroll-snap-align shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98]"
    aria-label={`Xem dịch vụ ${post.title.rendered}`}
  >
    <div className="relative">
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={post?._embedded?.['wp:featuredmedia']?.[0]?.source_url}
          alt=""
          className="w-full h-full object-cover object-center"
          loading="lazy"
          width="220"
          height="220"
        />

        {/* Badge */}
        <div className="absolute top-2 left-2">
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">
            24/7
          </div>
        </div>
      </div>

      <div className="p-3 pb-4 bg-white">
        <div
          className="text-blue-900 font-bold mb-3 leading-snug line-clamp-2 h-10"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        <button className="mt-auto w-full flex items-center justify-center rounded-lg px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:from-blue-700 hover:to-blue-600 transition-all">
          <span>Xem chi tiết</span>
          <ArrowRightIcon width={16} height={16} color="white" className="ml-2" />
        </button>
      </div>
    </div>
  </TransitionLink>
));

const ServiceCardDesktop = memo(({ post }: ServiceCardProps) => (
  <TransitionLink
    to={`/service/${post.id}`}
    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
    aria-label={`Xem dịch vụ ${post.title.rendered}`}
  >
    <div className="relative w-full aspect-square overflow-hidden">
      <img
        src={post?._embedded?.['wp:featuredmedia']?.[0]?.source_url}
        alt=""
        className="w-full h-full object-cover object-center"
        loading="lazy"
        width="220"
        height="220"
      />

      {/* Badge */}
      <div className="absolute top-2 left-2">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">
          24/7
        </div>
      </div>
    </div>
    <div className="flex flex-col p-3 pb-4">
      <div
        className="text-blue-900 font-bold mb-3 leading-snug line-clamp-2 h-10"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      <button className="mt-auto w-full flex items-center justify-center rounded-lg px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:from-blue-700 hover:to-blue-600 transition-all">
        <span>Xem chi tiết</span>
        <ArrowRightIcon width={16} height={16} color="white" className="ml-2" />
      </button>
    </div>
  </TransitionLink>
));

// Create skeleton component
const SkeletonCard = memo(({ isMobile }: SkeletonCardProps) => (
  <div
    className={`flex-shrink-0 ${isMobile ? 'w-[220px]' : 'w-full'} rounded-xl bg-white overflow-hidden animate-pulse shadow-sm border border-gray-100`}
  >
    <div className="w-full aspect-square bg-gray-200"></div>
    <div className="p-3 pb-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-10 bg-blue-100 rounded w-full"></div>
    </div>
  </div>
));

export default function FeaturedServices({ className }: FeaturedServicesProps) {
  const data = useAtomValue(servicesAtom(POST_ATOM_PARAMS));
  const posts = data || [];
  const [isLoading, setIsLoading] = useState(!data || posts.length === 0);

  // Handle loading state
  useEffect(() => {
    setIsLoading(!data || posts.length === 0);
  }, [data, posts.length]);

  // Create a memoized skeleton renderer
  const renderSkeletons = useCallback(
    () => (
      <>
        {/* Mobile skeleton */}
        <div className="flex gap-3 overflow-x-auto pb-4 px-1 hide-scrollbar scroll-snap-x md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={`mobile-skeleton-${index}`} isMobile={true} />
          ))}
        </div>

        {/* Desktop skeleton */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:overflow-x-visible md:pb-0 px-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={`desktop-skeleton-${index}`} isMobile={false} />
          ))}
        </div>
      </>
    ),
    []
  );

  // Custom service icon for section title
  const ServiceIcon = memo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-600"
    >
      <path d="M14 3.634V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1.634a9.996 9.996 0 0 0-4.866 5.869.999.999 0 0 0 .143.929c.32.423.919.538 1.374.3a5.998 5.998 0 0 1 8.698 0c.455.238 1.054.124 1.374-.3a.999.999 0 0 0 .143-.929A9.996 9.996 0 0 0 14 3.634Z" />
      <path d="M12 15v6a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-5.5a2.5 2.5 0 0 0-4-2Z" />
      <path d="M6 15v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5.5a2.5 2.5 0 0 1 4-2Z" />
    </svg>
  ));

  return (
    <Section
      className={`pt-2 ${className ?? ''}`}
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
          {/* Mobile: Card layout with full image */}
          <div className="flex gap-3 overflow-x-auto pb-4 px-1 hide-scrollbar scroll-snap-x md:hidden">
            {posts.map((post) => (
              <ServiceCardMobile key={post.id} post={post} />
            ))}
          </div>

          {/* Desktop: Responsive grid layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:overflow-x-visible md:pb-0 px-1">
            {posts.map((post) => (
              <ServiceCardDesktop key={post.id} post={post} />
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
