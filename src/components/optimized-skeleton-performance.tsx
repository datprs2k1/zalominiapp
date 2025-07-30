import React, { memo, useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { combineClasses } from '@/styles/medical-design-system';

// ===== PERFORMANCE OPTIMIZATION HOOKS =====

/**
 * Advanced reduced motion hook with system and user preferences
 */
export const useAdvancedReducedMotion = () => {
  const systemPreference = useReducedMotion();
  const [userPreference, setUserPreference] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('medical-reduced-motion');
    if (stored !== null) {
      setUserPreference(stored === 'true');
    }
  }, []);

  const shouldReduceMotion = userPreference !== null ? userPreference : systemPreference;

  const toggleReducedMotion = useCallback(() => {
    const newValue = !shouldReduceMotion;
    setUserPreference(newValue);
    localStorage.setItem('medical-reduced-motion', newValue.toString());
  }, [shouldReduceMotion]);

  return { shouldReduceMotion, toggleReducedMotion };
};

/**
 * Performance monitoring hook for skeleton components
 */
export const useSkeletonPerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;

    if (renderCount.current === 1) {
      startTime.current = performance.now();
    }

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;

      if (renderCount.current === 1) {
        console.log(`🏥 Medical Skeleton [${componentName}] first render: ${renderTime.toFixed(2)}ms`);
      }

      if (renderCount.current > 10) {
        console.warn(`⚠️ Medical Skeleton [${componentName}] re-rendered ${renderCount.current} times`);
      }
    }
  });

  return { renderCount: renderCount.current };
};

/**
 * Intersection observer hook for lazy skeleton loading
 */
export const useSkeletonInView = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '50px',
    ...options,
  });

  return { ref, isInView };
};

/**
 * Optimized animation variants with performance considerations
 */
export const useOptimizedSkeletonAnimations = (shouldReduceMotion: boolean) => {
  return useMemo(() => {
    if (shouldReduceMotion) {
      return {
        container: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.2 },
        },
        item: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.2 },
        },
      };
    }

    return {
      container: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: {
          duration: 0.4,
          staggerChildren: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
      item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    };
  }, [shouldReduceMotion]);
};

// ===== PERFORMANCE-OPTIMIZED SKELETON COMPONENTS =====

interface OptimizedSkeletonProps {
  variant?: 'primary' | 'secondary' | 'neutral' | 'fast';
  width?: string;
  height?: string;
  className?: string;
  animated?: boolean;
  lazy?: boolean;
  ariaLabel?: string;
  componentName?: string;
}

/**
 * Ultra-optimized skeleton component with advanced performance features
 */
export const OptimizedMedicalSkeleton = memo<OptimizedSkeletonProps>(
  ({
    variant = 'primary',
    width = 'w-full',
    height = 'h-4',
    className = '',
    animated = true,
    lazy = false,
    ariaLabel = 'Đang tải...',
    componentName = 'skeleton',
  }) => {
    const { shouldReduceMotion } = useAdvancedReducedMotion();
    const { renderCount } = useSkeletonPerformance(componentName);
    const { ref, isInView } = useSkeletonInView();

    // Memoized classes for performance
    const skeletonClasses = useMemo(() => {
      const baseClasses = 'skeleton-optimized';
      const variantClasses = {
        primary: shouldReduceMotion || !animated ? 'bg-blue-50' : 'skeleton-medical-primary',
        secondary: shouldReduceMotion || !animated ? 'bg-green-50' : 'skeleton-medical-secondary',
        neutral: shouldReduceMotion || !animated ? 'bg-gray-50' : 'skeleton-medical-neutral',
        fast: 'bg-blue-50 animate-pulse',
      };

      return combineClasses(baseClasses, variantClasses[variant], width, height, 'rounded-lg', className);
    }, [variant, width, height, className, shouldReduceMotion, animated]);

    // Render placeholder if lazy loading and not in view
    if (lazy && !isInView) {
      return (
        <div
          ref={ref}
          className={combineClasses(width, height, 'bg-transparent')}
          role="status"
          aria-label="Đang chuẩn bị tải..."
          data-skeleton-placeholder="true"
        />
      );
    }

    const animationProps = useMemo(() => {
      if (shouldReduceMotion || !animated) {
        return {};
      }

      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3, ease: 'easeOut' },
      };
    }, [shouldReduceMotion, animated]);

    return (
      <motion.div
        ref={lazy ? ref : undefined}
        className={skeletonClasses}
        role="status"
        aria-label={ariaLabel}
        aria-hidden="true"
        data-render-count={process.env.NODE_ENV === 'development' ? renderCount : undefined}
        {...animationProps}
      />
    );
  }
);

/**
 * Virtualized skeleton list for large datasets
 */
interface VirtualizedSkeletonListProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  renderItem: (index: number) => React.ReactNode;
  className?: string;
}

export const VirtualizedSkeletonList = memo<VirtualizedSkeletonListProps>(
  ({ itemCount, itemHeight, containerHeight, renderItem, className = '' }) => {
    const [scrollTop, setScrollTop] = useState(0);
    const { shouldReduceMotion } = useAdvancedReducedMotion();

    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(visibleStart + Math.ceil(containerHeight / itemHeight) + 1, itemCount);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []);

    const totalHeight = itemCount * itemHeight;

    return (
      <div
        className={combineClasses('overflow-auto', className)}
        style={{ height: containerHeight }}
        onScroll={handleScroll}
        role="status"
        aria-label="Đang tải danh sách..."
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {Array.from({ length: visibleEnd - visibleStart }, (_, index) => {
            const itemIndex = visibleStart + index;
            return (
              <div
                key={itemIndex}
                style={{
                  position: 'absolute',
                  top: itemIndex * itemHeight,
                  height: itemHeight,
                  width: '100%',
                }}
              >
                {renderItem(itemIndex)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

/**
 * Smart skeleton container with adaptive loading
 */
interface SmartSkeletonContainerProps {
  children: React.ReactNode;
  isLoading: boolean;
  skeleton: React.ReactNode;
  className?: string;
  fadeTransition?: boolean;
  componentName?: string;
}

export const SmartSkeletonContainer = memo<SmartSkeletonContainerProps>(
  ({ children, isLoading, skeleton, className = '', fadeTransition = true, componentName = 'container' }) => {
    const { shouldReduceMotion } = useAdvancedReducedMotion();
    const { renderCount } = useSkeletonPerformance(componentName);
    const [showContent, setShowContent] = useState(!isLoading);

    useEffect(() => {
      if (!isLoading) {
        // Delay content appearance for smooth transition
        const timer = setTimeout(() => setShowContent(true), shouldReduceMotion ? 0 : 150);
        return () => clearTimeout(timer);
      } else {
        setShowContent(false);
      }
    }, [isLoading, shouldReduceMotion]);

    const containerVariants = useMemo(() => {
      if (shouldReduceMotion || !fadeTransition) {
        return {};
      }

      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3, ease: 'easeInOut' },
      };
    }, [shouldReduceMotion, fadeTransition]);

    return (
      <div className={className} data-render-count={process.env.NODE_ENV === 'development' ? renderCount : undefined}>
        {isLoading ? (
          <motion.div key="skeleton" {...containerVariants}>
            {skeleton}
          </motion.div>
        ) : showContent ? (
          <motion.div key="content" {...containerVariants}>
            {children}
          </motion.div>
        ) : null}
      </div>
    );
  }
);

/**
 * Performance metrics component for development
 */
export const SkeletonPerformanceMetrics = memo(() => {
  const [metrics, setMetrics] = useState<{
    skeletonCount: number;
    averageRenderTime: number;
    totalRenders: number;
  }>({ skeletonCount: 0, averageRenderTime: 0, totalRenders: 0 });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const skeletonEntries = entries.filter(
        (entry) => entry.name.includes('skeleton') || entry.name.includes('Medical')
      );

      if (skeletonEntries.length > 0) {
        const totalTime = skeletonEntries.reduce((sum, entry) => sum + entry.duration, 0);
        const averageTime = totalTime / skeletonEntries.length;

        setMetrics((prev) => ({
          skeletonCount: prev.skeletonCount + skeletonEntries.length,
          averageRenderTime: averageTime,
          totalRenders: prev.totalRenders + skeletonEntries.length,
        }));
      }
    });

    try {
      observer.observe({ entryTypes: ['measure', 'mark'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }

    return () => observer.disconnect();
  }, []);

  // Always render in development, render minimal version in production
  if (!import.meta.env.DEV) {
    return (
      <div className="sr-only" aria-live="polite" role="status">
        Performance monitoring active
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-900 text-white p-2 rounded text-xs font-mono z-50">
      <div>Skeletons: {metrics.skeletonCount}</div>
      <div>Avg Render: {metrics.averageRenderTime.toFixed(2)}ms</div>
      <div>Total Renders: {metrics.totalRenders}</div>
    </div>
  );
});

// Set display names for better debugging
OptimizedMedicalSkeleton.displayName = 'OptimizedMedicalSkeleton';
VirtualizedSkeletonList.displayName = 'VirtualizedSkeletonList';
SmartSkeletonContainer.displayName = 'SmartSkeletonContainer';
SkeletonPerformanceMetrics.displayName = 'SkeletonPerformanceMetrics';

export default OptimizedMedicalSkeleton;
