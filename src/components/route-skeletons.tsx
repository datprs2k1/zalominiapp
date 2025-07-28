import { motion } from 'framer-motion';
import { combineClasses } from '@/styles/medical-design-system';
import { memo } from 'react';

interface SkeletonProps {
  className?: string;
  animated?: boolean;
}

// Optimized skeleton animation for smooth experience
const skeletonAnimation = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 1.5, // Faster animation
    repeat: Infinity,
    ease: 'linear',
  },
};

// Fast skeleton animation for immediate feedback
const fastSkeletonAnimation = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 1, // Even faster for quick transitions
    repeat: Infinity,
    ease: 'linear',
  },
};

// Optimized skeleton classes for better performance
const baseSkeletonClasses = 'skeleton-shimmer skeleton-optimized rounded';

// Fast skeleton classes without heavy animations
const fastSkeletonClasses = 'bg-gray-200 rounded skeleton-optimized animate-pulse';

// Accessibility attributes for skeleton containers
const getSkeletonContainerProps = (ariaLabel: string) => ({
  role: 'status' as const,
  'aria-label': ariaLabel,
  'aria-live': 'polite' as const,
});

// Accessibility attributes for skeleton elements
const skeletonElementProps = {
  'aria-hidden': true as const,
};

// Home Page Skeleton
export const HomePageSkeleton = memo(function HomePageSkeleton({ className = '', animated = true }: SkeletonProps) {
  return (
    <div className={combineClasses('space-y-6 p-4', className)} {...getSkeletonContainerProps('Đang tải trang chủ')}>
      {/* Search Bar Skeleton */}
      <div
        className={combineClasses(animated ? baseSkeletonClasses : fastSkeletonClasses, 'h-12 w-full rounded-lg')}
        {...skeletonElementProps}
      />

      {/* Hero Section Skeleton */}
      <div
        className={combineClasses(animated ? baseSkeletonClasses : fastSkeletonClasses, 'h-48 w-full rounded-xl')}
        {...skeletonElementProps}
      />

      {/* Featured Services Grid */}
      <div className="space-y-4">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-6 w-40')}
          {...(animated ? skeletonAnimation : {})}
        />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              className={combineClasses(baseSkeletonClasses, 'h-32 rounded-lg')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Featured Departments */}
      <div className="space-y-4">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-6 w-36')}
          {...(animated ? skeletonAnimation : {})}
        />
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              className={combineClasses(baseSkeletonClasses, 'h-20 rounded-lg')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Health News */}
      <div className="space-y-4">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-6 w-32')}
          {...(animated ? skeletonAnimation : {})}
        />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div key={index} className="flex space-x-3">
              <motion.div
                className={combineClasses(baseSkeletonClasses, 'w-16 h-16 rounded-lg flex-shrink-0')}
                {...(animated ? skeletonAnimation : {})}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
              <div className="flex-1 space-y-2">
                <motion.div
                  className={combineClasses(baseSkeletonClasses, 'h-4 w-full')}
                  {...(animated ? skeletonAnimation : {})}
                  style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
                />
                <motion.div
                  className={combineClasses(baseSkeletonClasses, 'h-3 w-3/4')}
                  {...(animated ? skeletonAnimation : {})}
                  style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Services List Page Skeleton
export const ServicesPageSkeleton = memo(function ServicesPageSkeleton({
  className = '',
  animated = true,
}: SkeletonProps) {
  return (
    <div
      className={combineClasses('space-y-4 p-4', className)}
      {...getSkeletonContainerProps('Đang tải danh sách dịch vụ')}
    >
      {/* Header */}
      <motion.div
        className={combineClasses(baseSkeletonClasses, 'h-8 w-48')}
        {...(animated ? skeletonAnimation : {})}
      />

      {/* Search/Filter Bar */}
      <motion.div
        className={combineClasses(baseSkeletonClasses, 'h-10 w-full rounded-lg')}
        {...(animated ? skeletonAnimation : {})}
      />

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div key={index} className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'w-16 h-16 rounded-lg flex-shrink-0')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className={combineClasses(baseSkeletonClasses, 'h-5 w-3/4')}
                {...(animated ? skeletonAnimation : {})}
                style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
              />
              <motion.div
                className={combineClasses(baseSkeletonClasses, 'h-4 w-full')}
                {...(animated ? skeletonAnimation : {})}
                style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
              />
              <motion.div
                className={combineClasses(baseSkeletonClasses, 'h-3 w-1/2')}
                {...(animated ? skeletonAnimation : {})}
                style={{ animationDelay: `${index * 0.1 + 0.15}s` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

// Categories Page Skeleton
export const CategoriesPageSkeleton = memo(function CategoriesPageSkeleton({
  className = '',
  animated = true,
}: SkeletonProps) {
  return (
    <div className={combineClasses('space-y-4 p-4', className)} {...getSkeletonContainerProps('Đang tải danh mục')}>
      {/* Header */}
      <motion.div
        className={combineClasses(baseSkeletonClasses, 'h-8 w-40')}
        {...(animated ? skeletonAnimation : {})}
      />

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg">
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'w-12 h-12 rounded-lg mx-auto')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-4 w-3/4 mx-auto')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
            />
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-3 w-1/2 mx-auto')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

// Profile Page Skeleton
export const ProfilePageSkeleton = memo(function ProfilePageSkeleton({
  className = '',
  animated = true,
}: SkeletonProps) {
  return (
    <div
      className={combineClasses('space-y-6 p-4', className)}
      {...getSkeletonContainerProps('Đang tải trang cá nhân')}
    >
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'w-20 h-20 rounded-full')}
          {...(animated ? skeletonAnimation : {})}
        />
        <div className="flex-1 space-y-2">
          <motion.div
            className={combineClasses(baseSkeletonClasses, 'h-6 w-48')}
            {...(animated ? skeletonAnimation : {})}
          />
          <motion.div
            className={combineClasses(baseSkeletonClasses, 'h-4 w-32')}
            {...(animated ? skeletonAnimation : {})}
          />
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div key={index} className="text-center space-y-2 p-4 border border-gray-200 rounded-lg">
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-8 w-12 mx-auto')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-3 w-16 mx-auto')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
            />
          </motion.div>
        ))}
      </div>

      {/* Profile Menu Items */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'w-8 h-8 rounded')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-4 flex-1')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
            />
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'w-4 h-4 rounded')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

// Detail Page Skeleton (Service/Department/Doctor Detail)
export const DetailPageSkeleton = memo(function DetailPageSkeleton({ className = '', animated = true }: SkeletonProps) {
  return (
    <div className={combineClasses('space-y-6 p-4', className)} {...getSkeletonContainerProps('Đang tải chi tiết')}>
      {/* Hero Image */}
      <motion.div
        className={combineClasses(baseSkeletonClasses, 'h-48 w-full rounded-xl')}
        {...(animated ? skeletonAnimation : {})}
      />

      {/* Title and Basic Info */}
      <div className="space-y-3">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-8 w-3/4')}
          {...(animated ? skeletonAnimation : {})}
        />
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-5 w-1/2')}
          {...(animated ? skeletonAnimation : {})}
        />
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-4 w-full')}
          {...(animated ? skeletonAnimation : {})}
        />
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-4 w-5/6')}
          {...(animated ? skeletonAnimation : {})}
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            className={combineClasses(baseSkeletonClasses, 'h-10 w-20 rounded-t-lg')}
            {...(animated ? skeletonAnimation : {})}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-5 w-1/3')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-4 w-full')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
            />
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-4 w-4/5')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            />
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-12 flex-1 rounded-lg')}
          {...(animated ? skeletonAnimation : {})}
        />
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-12 w-12 rounded-lg')}
          {...(animated ? skeletonAnimation : {})}
        />
      </div>
    </div>
  );
});

// Booking Page Skeleton
export const BookingPageSkeleton = memo(function BookingPageSkeleton({
  className = '',
  animated = true,
}: SkeletonProps) {
  return (
    <div
      className={combineClasses('space-y-6 p-4', className)}
      {...getSkeletonContainerProps('Đang tải trang đặt lịch')}
    >
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center">
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'w-8 h-8 rounded-full')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
            {index < 3 && (
              <motion.div
                className={combineClasses(baseSkeletonClasses, 'h-1 w-12 mx-2')}
                {...(animated ? skeletonAnimation : {})}
                style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="space-y-4">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-6 w-48')}
          {...(animated ? skeletonAnimation : {})}
        />

        {/* Form Fields */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-4 w-32')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-12 w-full rounded-lg')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
            />
          </div>
        ))}
      </div>

      {/* Calendar/Time Slots */}
      <div className="space-y-4">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-5 w-40')}
          {...(animated ? skeletonAnimation : {})}
        />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 21 }).map((_, index) => (
            <motion.div
              key={index}
              className={combineClasses(baseSkeletonClasses, 'h-10 rounded')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.02}s` }}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-12 w-24 rounded-lg')}
          {...(animated ? skeletonAnimation : {})}
        />
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-12 flex-1 rounded-lg')}
          {...(animated ? skeletonAnimation : {})}
        />
      </div>
    </div>
  );
});

// List Page Skeleton (Generic for departments, doctors, etc.)
export const ListPageSkeleton = memo(function ListPageSkeleton({ className = '', animated = true }: SkeletonProps) {
  return (
    <div className={combineClasses('space-y-4 p-4', className)} {...getSkeletonContainerProps('Đang tải danh sách')}>
      {/* Header with Search */}
      <div className="space-y-3">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-8 w-48')}
          {...(animated ? skeletonAnimation : {})}
        />
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-10 w-full rounded-lg')}
          {...(animated ? skeletonAnimation : {})}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            className={combineClasses(baseSkeletonClasses, 'h-8 w-16 rounded-full')}
            {...(animated ? skeletonAnimation : {})}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>

      {/* List Items */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div key={index} className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'w-16 h-16 rounded-lg flex-shrink-0')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className={combineClasses(baseSkeletonClasses, 'h-5 w-3/4')}
                {...(animated ? skeletonAnimation : {})}
                style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
              />
              <motion.div
                className={combineClasses(baseSkeletonClasses, 'h-4 w-full')}
                {...(animated ? skeletonAnimation : {})}
                style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
              />
              <motion.div
                className={combineClasses(baseSkeletonClasses, 'h-3 w-1/2')}
                {...(animated ? skeletonAnimation : {})}
                style={{ animationDelay: `${index * 0.1 + 0.15}s` }}
              />
            </div>
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'w-8 h-8 rounded')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

// Search Results Skeleton
export const SearchResultsSkeleton = memo(function SearchResultsSkeleton({
  className = '',
  animated = true,
}: SkeletonProps) {
  return (
    <div
      className={combineClasses('space-y-4 p-4', className)}
      {...getSkeletonContainerProps('Đang tải kết quả tìm kiếm')}
    >
      {/* Search Header */}
      <div className="space-y-3">
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-10 w-full rounded-lg')}
          {...(animated ? skeletonAnimation : {})}
        />
        <motion.div
          className={combineClasses(baseSkeletonClasses, 'h-4 w-48')}
          {...(animated ? skeletonAnimation : {})}
        />
      </div>

      {/* Filter Categories */}
      <div className="flex space-x-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            className={combineClasses(baseSkeletonClasses, 'h-8 w-20 rounded-full flex-shrink-0')}
            {...(animated ? skeletonAnimation : {})}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-start space-x-3">
              <motion.div
                className={combineClasses(baseSkeletonClasses, 'w-12 h-12 rounded-lg flex-shrink-0')}
                {...(animated ? skeletonAnimation : {})}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
              <div className="flex-1 space-y-2">
                <motion.div
                  className={combineClasses(baseSkeletonClasses, 'h-5 w-3/4')}
                  {...(animated ? skeletonAnimation : {})}
                  style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
                />
                <motion.div
                  className={combineClasses(baseSkeletonClasses, 'h-4 w-full')}
                  {...(animated ? skeletonAnimation : {})}
                  style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
                />
                <motion.div
                  className={combineClasses(baseSkeletonClasses, 'h-3 w-2/3')}
                  {...(animated ? skeletonAnimation : {})}
                  style={{ animationDelay: `${index * 0.1 + 0.15}s` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

// Generic Page Skeleton (fallback)
export const GenericPageSkeleton = memo(function GenericPageSkeleton({
  className = '',
  animated = true,
}: SkeletonProps) {
  return (
    <div className={combineClasses('space-y-6 p-4', className)} {...getSkeletonContainerProps('Đang tải trang')}>
      {/* Header */}
      <motion.div
        className={combineClasses(baseSkeletonClasses, 'h-8 w-64')}
        {...(animated ? skeletonAnimation : {})}
      />

      {/* Content Blocks */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg">
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-5 w-1/2')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-4 w-full')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
            />
            <motion.div
              className={combineClasses(baseSkeletonClasses, 'h-4 w-3/4')}
              {...(animated ? skeletonAnimation : {})}
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
});
