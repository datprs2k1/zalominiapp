import Section from '@/components/section';
import TransitionLink from '@/components/transition-link';
import { getPosts, postsAtomFamily } from '@/services/post';
import { useEffect, useState, useMemo } from 'react';
import { useAtomValue } from 'jotai';

export function NewsItem({ _embedded, id, title, date }) {
  // Safe access to embedded data with fallbacks
  const featuredMedia = _embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = featuredMedia?.source_url || '/placeholder-image.jpg';

  const terms = _embedded?.['wp:term']?.[0];
  const categoryName = terms?.[0]?.name || 'Uncategorized';

  return (
    <TransitionLink
      to={`/news/${id}`}
      className="flex items-center w-full rounded-xl bg-white shadow-card-medical hover:shadow-card-hover transition-all duration-300 active:scale-98 touch-manipulation"
      role="article"
      aria-label={`Đọc bài viết: ${title?.rendered || 'Untitled'}`}
    >
      {/* Enhanced mobile-optimized image container */}
      <div className="flex-shrink-0 w-24 h-24 sm:w-20 sm:h-20">
        <img
          src={imageUrl}
          className="w-full h-full object-cover object-center rounded-l-xl"
          alt="Hình ảnh bài viết"
          loading="lazy"
          onError={(e) => {
            // Fallback to a default image if the image fails to load
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />
      </div>

      {/* Enhanced mobile-optimized content container */}
      <div className="p-4 sm:p-3 flex-1 min-w-0">
        <div className="flex flex-col gap-2 sm:gap-1">
          {/* Enhanced category badge with better mobile visibility */}
          <span className="inline-block bg-medical-100 text-medical-700 text-xs font-semibold px-2.5 py-1 rounded-full w-fit">
            {categoryName}
          </span>

          {/* Enhanced title with better mobile typography */}
          <h3
            className="text-base sm:text-sm font-bold line-clamp-2 text-gray-800 leading-tight"
            dangerouslySetInnerHTML={{ __html: title?.rendered || 'Untitled' }}
          />

          {/* Enhanced date with better mobile spacing */}
          <div className="text-xs text-gray-500 mt-0.5 font-medium">{date || 'Chưa có ngày'}</div>
        </div>
      </div>
    </TransitionLink>
  );
}

const POST_ATOM_PARAMS = { type: 'post', per_page: 6 };

export default function HealthNews() {
  const data = useAtomValue(postsAtomFamily(POST_ATOM_PARAMS));
  const posts = (data as any) || [];
  const [isLoading, setIsLoading] = useState(!data || posts.length === 0);

  // Enhanced mobile-optimized loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="flex items-center w-full rounded-xl bg-white shadow-card-medical animate-pulse"
        role="status"
        aria-label="Đang tải bài viết..."
      >
        {/* Enhanced mobile-optimized skeleton image */}
        <div className="flex-shrink-0 w-24 h-24 sm:w-20 sm:h-20 bg-gray-200 rounded-l-xl"></div>

        {/* Enhanced mobile-optimized skeleton content */}
        <div className="p-4 sm:p-3 flex-1">
          <div className="flex flex-col gap-2 sm:gap-1">
            {/* Category skeleton */}
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>

            {/* Title skeleton - two lines */}
            <div className="space-y-1.5">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Date skeleton */}
            <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
          </div>
        </div>
      </div>
    ));
  };

  // Handle loading state
  useEffect(() => {
    setIsLoading(!data || posts.length === 0);
  }, [data, posts.length]);

  // Enhanced mobile-optimized news icon for section title
  const NewsIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-medical-600 flex-shrink-0"
      aria-hidden="true"
    >
      <path
        d="M4 6H20V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M4 6V4C4 2.9 4.9 2 6 2H18C19.1 2 20 2.9 20 4V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 10H16M8 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <Section
      className="py-3 sm:py-2"
      title="Tin tức sức khỏe"
      subtitle="Cập nhật thông tin y tế và sức khỏe mới nhất"
      viewMore="/explore"
      icon={<NewsIcon />}
      variant="medical"
      gradient={true}
      pattern={true}
      animation={true}
      compact={true}
      size="md"
      elevation="medium"
      borderRadius="lg"
      mobileOptimized={true}
    >
      {/* Enhanced mobile-optimized news container */}
      <div className="space-y-4 sm:space-y-3">
        {isLoading ? renderSkeletons() : posts.map((post) => <NewsItem key={post.id} {...post} />)}
      </div>
    </Section>
  );
}
