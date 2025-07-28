import React, { memo } from 'react';
import { combineClasses } from '@/styles/medical-design-system';

// Optimized skeleton classes for better performance
const baseSkeletonClasses = 'skeleton-shimmer skeleton-optimized rounded';
const fastSkeletonClasses = 'bg-gray-200 rounded skeleton-optimized animate-pulse';

// Accessibility attributes
const getSkeletonContainerProps = (ariaLabel: string) => ({
  role: 'status' as const,
  'aria-label': ariaLabel,
  'aria-live': 'polite' as const,
});

const skeletonElementProps = {
  'aria-hidden': true as const,
};

// Optimized skeleton element component
export const SkeletonElement = memo(function SkeletonElement({
  className = '',
  animated = true,
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded',
}: {
  className?: string;
  animated?: boolean;
  width?: string;
  height?: string;
  rounded?: string;
}) {
  return (
    <div
      className={combineClasses(
        animated ? baseSkeletonClasses : fastSkeletonClasses,
        width,
        height,
        rounded,
        className
      )}
      {...skeletonElementProps}
    />
  );
});

// Optimized skeleton grid component
export const SkeletonGrid = memo(function SkeletonGrid({
  count = 4,
  cols = 2,
  gap = 'gap-4',
  itemHeight = 'h-32',
  animated = true,
  className = '',
}: {
  count?: number;
  cols?: number;
  gap?: string;
  itemHeight?: string;
  animated?: boolean;
  className?: string;
}) {
  return (
    <div className={combineClasses(`grid grid-cols-${cols}`, gap, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonElement
          key={index}
          animated={animated}
          height={itemHeight}
          className="w-full"
        />
      ))}
    </div>
  );
});

// Optimized skeleton list component
export const SkeletonList = memo(function SkeletonList({
  count = 5,
  animated = true,
  showAvatar = false,
  className = '',
}: {
  count?: number;
  animated?: boolean;
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={combineClasses('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex space-x-3 p-4 border border-gray-200 rounded-lg">
          {showAvatar && (
            <SkeletonElement
              animated={animated}
              width="w-12"
              height="h-12"
              rounded="rounded-full"
              className="flex-shrink-0"
            />
          )}
          <div className="flex-1 space-y-2">
            <SkeletonElement animated={animated} height="h-5" width="w-3/4" />
            <SkeletonElement animated={animated} height="h-4" width="w-full" />
            <SkeletonElement animated={animated} height="h-3" width="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
});

// Optimized skeleton card component
export const SkeletonCard = memo(function SkeletonCard({
  animated = true,
  showImage = true,
  className = '',
}: {
  animated?: boolean;
  showImage?: boolean;
  className?: string;
}) {
  return (
    <div className={combineClasses('p-4 border border-gray-200 rounded-lg space-y-3', className)}>
      {showImage && (
        <SkeletonElement
          animated={animated}
          height="h-32"
          width="w-full"
          rounded="rounded-lg"
        />
      )}
      <div className="space-y-2">
        <SkeletonElement animated={animated} height="h-5" width="w-3/4" />
        <SkeletonElement animated={animated} height="h-4" width="w-full" />
        <SkeletonElement animated={animated} height="h-4" width="w-5/6" />
      </div>
    </div>
  );
});

// Optimized skeleton form component
export const SkeletonForm = memo(function SkeletonForm({
  fieldCount = 5,
  animated = true,
  className = '',
}: {
  fieldCount?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <div className={combineClasses('space-y-4', className)}>
      {Array.from({ length: fieldCount }).map((_, index) => (
        <div key={index} className="space-y-2">
          <SkeletonElement animated={animated} height="h-4" width="w-32" />
          <SkeletonElement animated={animated} height="h-12" width="w-full" rounded="rounded-lg" />
        </div>
      ))}
    </div>
  );
});

// Optimized skeleton container wrapper
export const SkeletonContainer = memo(function SkeletonContainer({
  children,
  ariaLabel,
  className = '',
}: {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div
      className={combineClasses('space-y-4 p-4', className)}
      {...getSkeletonContainerProps(ariaLabel)}
    >
      {children}
    </div>
  );
});

// Performance optimized skeleton variants
export const SkeletonVariants = {
  // Ultra-fast skeleton for immediate feedback
  ultraFast: {
    animated: false,
    className: 'animate-pulse',
  },
  
  // Standard skeleton with shimmer
  standard: {
    animated: true,
    className: 'skeleton-shimmer',
  },
  
  // Minimal skeleton for simple content
  minimal: {
    animated: false,
    className: 'bg-gray-100',
  },
};

// Hook for skeleton performance optimization
export function useSkeletonOptimization() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Check device performance
  const isLowEndDevice = typeof navigator !== 'undefined' 
    ? navigator.hardwareConcurrency <= 2 
    : false;

  // Determine optimal skeleton variant
  const getOptimalVariant = () => {
    if (prefersReducedMotion || isLowEndDevice) {
      return SkeletonVariants.ultraFast;
    }
    return SkeletonVariants.standard;
  };

  return {
    prefersReducedMotion,
    isLowEndDevice,
    optimalVariant: getOptimalVariant(),
  };
}

export default {
  SkeletonElement,
  SkeletonGrid,
  SkeletonList,
  SkeletonCard,
  SkeletonForm,
  SkeletonContainer,
  SkeletonVariants,
  useSkeletonOptimization,
};
