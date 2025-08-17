import ArrowRightIcon from '@/components/icons/arrow-right';
import Section from '@/components/section';
import { useAtomValue } from 'jotai';
import { departmentsAtom } from '@/services/post';
import { useMemo } from 'react';
import TransitionLink from '@/components/transition-link';
import { cn } from '@/utils/cn';

const POST_ATOM_PARAMS = { per_page: 4 };

interface FeaturedDepartentsProps {
  className?: string;
}

// Unified blue theme for all departments using Serene Blues palette
// All buttons will use the medical blue color scheme for consistency
const departmentTheme = {
  gradient: 'from-medical-500 to-medical-600',
  bgGradient: 'from-medical-50 to-medical-100',
  accent: 'medical-500',
  shadow: 'shadow-card-medical',
};

function SkeletonCard({ horizontal = false }) {
  return (
    <div
      className={cn(
        'animate-pulse flex flex-col rounded-2xl shadow-sm bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden',
        horizontal ? 'flex-shrink-0 w-[280px] min-h-[200px]' : 'w-full min-h-[200px]'
      )}
    >
      {/* Image skeleton */}
      <div
        className={cn('bg-gradient-to-br from-neutral-200 to-neutral-300 w-full mb-0', horizontal ? 'h-28' : 'h-32')}
      />
      {/* Content skeleton */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="h-4 bg-gradient-to-r from-neutral-300 to-neutral-200 rounded-full w-4/5 mx-auto" />
        <div className="h-3 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-full w-3/5 mx-auto" />
        <div className="mt-auto h-[52px] bg-gradient-to-r from-neutral-300 to-neutral-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function FeaturedDepartents({ className }: FeaturedDepartentsProps) {
  const data = useAtomValue(departmentsAtom(POST_ATOM_PARAMS));
  const posts = (data as any) || [];
  const isLoading = !data || posts.length === 0;
  const skeletons = useMemo(() => Array.from({ length: 4 }), []);

  // Enhanced department icon with modern styling
  const DepartmentIcon = () => (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-medical-400 to-wellness-500 rounded-full blur-sm opacity-30"></div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative text-medical-600"
        aria-hidden="true"
      >
        <path
          d="M3 21H21V9L12 2L3 9V21Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M9 21V12H15V21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M12 7V9M10 8H14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Add medical cross */}
        <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );

  return (
    <Section
      className={cn('pt-4 pb-6', className)}
      title="Khoa nổi bật"
      subtitle="Các chuyên khoa hàng đầu với đội ngũ bác sĩ giàu kinh nghiệm"
      viewMore="/departments"
      icon={<DepartmentIcon />}
      variant="medical"
      gradient={true}
      pattern={true}
      animation={true}
      compact={true}
    >
      {/* Mobile-optimized responsive layout */}
      <div className="space-y-4">
        {/* Grid layout for larger mobile screens */}
        <div className="hidden xs:block">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 px-1">
            {isLoading
              ? skeletons.map((_, idx) => <SkeletonCard key={idx} />)
              : posts.map((post) => {
                  return <MobileDepartmentCard key={post.id} post={post} theme={departmentTheme} layout="grid" />;
                })}
          </div>
        </div>

        {/* Horizontal scroll layout for small screens */}
        <div className="block xs:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 px-1 hide-scrollbar scroll-snap-x">
            {isLoading
              ? skeletons.map((_, idx) => <SkeletonCard key={idx} horizontal />)
              : posts.map((post) => {
                  return <MobileDepartmentCard key={post.id} post={post} theme={departmentTheme} layout="horizontal" />;
                })}
          </div>
        </div>
      </div>
    </Section>
  );
}

// Mobile-optimized department card component
function MobileDepartmentCard({ post, theme, layout = 'grid' }) {
  const isHorizontal = layout === 'horizontal';

  return (
    <TransitionLink
      to={`/department/${post.id}`}
      className={cn(
        'group flex flex-col bg-white rounded-2xl overflow-hidden',
        'transition-all duration-200 ease-out',
        'border border-neutral-100',
        'relative focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2',
        // Mobile-optimized active states with better feedback
        'active:scale-[0.96] active:shadow-sm',
        'hover:shadow-lg hover:-translate-y-0.5',
        'shadow-card-medical hover:shadow-card-hover',
        // Layout-specific sizing
        isHorizontal ? 'flex-shrink-0 w-[280px] scroll-snap-align' : 'w-full',
        // Enhanced touch target for mobile accessibility
        'min-h-[200px]'
      )}
      aria-label={`Xem chi tiết ${post.title.rendered}`}
    >
      {/* Enhanced image container */}
      <div className="relative overflow-hidden">
        {post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
          <>
            <img
              src={post._embedded['wp:featuredmedia'][0].source_url}
              alt={post.title.rendered}
              className={cn(
                'w-full object-cover object-center transition-transform duration-300',
                'group-hover:scale-105 group-active:scale-100',
                isHorizontal ? 'h-28' : 'h-32'
              )}
              loading="lazy"
              onError={(e) => {
                // Fallback for missing images
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            {/* Fallback placeholder with unified blue theme */}
            <div
              className={cn(
                'hidden w-full bg-gradient-to-br from-medical-50 to-medical-100 items-center justify-center',
                isHorizontal ? 'h-28' : 'h-32'
              )}
            >
              <div className={cn('w-8 h-8 rounded-full bg-white/80 flex items-center justify-center')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-medical-500">
                  <path
                    d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19Z"
                    fill="currentColor"
                  />
                  <circle cx="9" cy="9" r="2" fill="currentColor" />
                  <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Gradient overlay */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent',
                'group-hover:from-black/25 transition-all duration-300'
              )}
            />

            {/* Department category badge - mobile optimized */}
            <div
              className={cn(
                'absolute top-2 right-2 px-2.5 py-1 rounded-full font-medium',
                'bg-white/95 backdrop-blur-sm text-neutral-700',
                'shadow-sm border border-white/30',
                'text-xs leading-tight'
              )}
            >
              Chuyên khoa
            </div>
          </>
        ) : (
          // Default placeholder when no image with unified blue theme
          <div
            className={cn(
              'w-full bg-gradient-to-br from-medical-50 to-medical-100 flex items-center justify-center',
              isHorizontal ? 'h-28' : 'h-32'
            )}
          >
            <div className={cn('w-8 h-8 rounded-full bg-white/80 flex items-center justify-center')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-medical-500">
                <path
                  d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19Z"
                  fill="currentColor"
                />
                <circle cx="9" cy="9" r="2" fill="currentColor" />
                <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Mobile-optimized content area */}
      <div className="flex flex-col flex-1 p-4 bg-gradient-to-br from-white to-neutral-50/30">
        <div
          className={cn(
            'font-semibold text-neutral-800 mb-4 text-center line-clamp-2',
            'transition-colors duration-200 group-hover:text-medical-700',
            'leading-snug min-h-[2.8rem] flex items-center justify-center',
            // Enhanced mobile typography
            'px-2' // Add padding for better mobile text spacing
          )}
          style={{
            fontSize: '16px', // Optimized for mobile readability (WCAG AA)
            lineHeight: '1.4',
          }}
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Mobile-optimized CTA button with unified blue theme */}
        <button
          className={cn(
            'mt-auto w-full flex items-center justify-center rounded-xl',
            'bg-gradient-to-r from-medical-500 to-medical-600',
            'hover:from-medical-600 hover:to-medical-700',
            'active:from-medical-700 active:to-medical-800',
            'text-white font-semibold',
            'transition-all duration-200 ease-out',
            'transform active:scale-[0.96]',
            'relative overflow-hidden',
            'shadow-button-medical active:shadow-sm',
            // Enhanced mobile touch target - using comfortable size
            'min-h-[52px] py-3 px-4',
            // Better mobile feedback with medical blue focus
            'focus:outline-none focus:ring-2 focus:ring-medical-300 focus:ring-offset-2',
            'focus:ring-offset-white'
          )}
          style={{
            fontSize: '14px', // Optimized for mobile readability
            fontWeight: '600',
          }}
          aria-label={`Khám phá ${post.title.rendered}`}
        >
          {/* Enhanced button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-active:translate-x-full transition-transform duration-500 ease-out" />
          <span className="relative z-10">Khám phá ngay</span>
          <ArrowRightIcon
            width={18}
            height={18}
            color="white"
            className="ml-2 relative z-10 transition-transform group-hover:translate-x-0.5 group-active:translate-x-1"
            aria-hidden="true"
          />
        </button>
      </div>
    </TransitionLink>
  );
}
