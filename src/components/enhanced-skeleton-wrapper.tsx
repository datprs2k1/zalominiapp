import React, { memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  trackSkeletonPerformance, 
  getReducedMotionSkeletonAnimation,
  announceSkeletonState 
} from './skeleton-performance-utils';

interface EnhancedSkeletonWrapperProps {
  children: React.ReactNode;
  skeletonName: string;
  ariaLabel: string;
  className?: string;
  animated?: boolean;
  onLoadComplete?: () => void;
}

// Enhanced skeleton wrapper with performance tracking and accessibility
export const EnhancedSkeletonWrapper = memo(function EnhancedSkeletonWrapper({
  children,
  skeletonName,
  ariaLabel,
  className = '',
  animated = true,
  onLoadComplete,
}: EnhancedSkeletonWrapperProps) {
  const startTimeRef = useRef<number>(0);
  const hasAnnouncedRef = useRef<boolean>(false);

  // Track performance and accessibility
  useEffect(() => {
    startTimeRef.current = performance.now();
    
    // Announce skeleton loading to screen readers
    if (!hasAnnouncedRef.current) {
      announceSkeletonState(ariaLabel);
      hasAnnouncedRef.current = true;
    }

    return () => {
      // Track performance when component unmounts
      if (startTimeRef.current > 0) {
        trackSkeletonPerformance(skeletonName, startTimeRef.current);
      }
      
      // Call completion callback
      if (onLoadComplete) {
        onLoadComplete();
      }
    };
  }, [skeletonName, ariaLabel, onLoadComplete]);

  // Respect user's motion preferences
  const shouldAnimate = animated && getReducedMotionSkeletonAnimation();

  return (
    <motion.div
      className={className}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: shouldAnimate ? 0.2 : 0,
        ease: 'easeOut'
      }}
      data-skeleton={skeletonName}
      data-testid={`skeleton-${skeletonName}`}
    >
      {children}
    </motion.div>
  );
});

// HOC to wrap skeleton components with enhanced features
export function withEnhancedSkeleton<T extends object>(
  SkeletonComponent: React.ComponentType<T>,
  skeletonName: string,
  defaultAriaLabel: string
) {
  return memo(function EnhancedSkeleton(props: T & { 
    ariaLabel?: string; 
    onLoadComplete?: () => void;
    className?: string;
  }) {
    const { ariaLabel = defaultAriaLabel, onLoadComplete, className, ...skeletonProps } = props;
    
    return (
      <EnhancedSkeletonWrapper
        skeletonName={skeletonName}
        ariaLabel={ariaLabel}
        className={className}
        onLoadComplete={onLoadComplete}
      >
        <SkeletonComponent {...(skeletonProps as T)} />
      </EnhancedSkeletonWrapper>
    );
  });
}

// Skeleton transition component for smooth loading states
export const SkeletonTransition = memo(function SkeletonTransition({
  isLoading,
  skeleton,
  children,
  className = '',
}: {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Progressive skeleton loader for lists
export const ProgressiveSkeletonLoader = memo(function ProgressiveSkeletonLoader({
  items,
  skeletonComponent: SkeletonComponent,
  renderItem,
  isLoading,
  skeletonCount = 5,
  staggerDelay = 0.1,
  className = '',
}: {
  items: any[];
  skeletonComponent: React.ComponentType<any>;
  renderItem: (item: any, index: number) => React.ReactNode;
  isLoading: boolean;
  skeletonCount?: number;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * staggerDelay,
                  duration: 0.3,
                  ease: 'easeOut'
                }}
              >
                <SkeletonComponent />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * (staggerDelay / 2),
                  duration: 0.3,
                  ease: 'easeOut'
                }}
              >
                {renderItem(item, index)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default EnhancedSkeletonWrapper;
