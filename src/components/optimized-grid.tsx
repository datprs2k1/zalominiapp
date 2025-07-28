import { ReactNode, memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SPACING, BORDER_RADIUS, combineClasses } from '@/styles/medical-design-system';

interface OptimizedGridProps {
  children: ReactNode[];
  className?: string;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  itemMinHeight?: string;
  enableVirtualization?: boolean;
  itemsPerPage?: number;
  medicalContext?: 'emergency' | 'routine' | 'general';
  animationDelay?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loading?: boolean;
}

const OptimizedGrid = memo(function OptimizedGrid({
  children,
  className = '',
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  itemMinHeight = 'min-h-[160px]',
  enableVirtualization = false,
  itemsPerPage = 12,
  medicalContext = 'general',
  animationDelay = 0.1,
  showLoadMore = false,
  onLoadMore,
  loading = false,
}: OptimizedGridProps) {
  // Memoized grid classes
  const gridClasses = useMemo(() => {
    const gapMap = {
      xs: SPACING.gap.xs,
      sm: SPACING.gap.sm,
      md: SPACING.gap.md,
      lg: SPACING.gap.lg,
    };

    const columnClasses = [
      `grid-cols-${columns.mobile}`,
      `md:grid-cols-${columns.tablet}`,
      `lg:grid-cols-${columns.desktop}`,
    ].join(' ');

    return combineClasses(
      'grid',
      columnClasses,
      gapMap[gap],
      'w-full',
      className
    );
  }, [columns, gap, className]);

  // Medical context styling
  const getContextStyling = useCallback(() => {
    const contextMap = {
      emergency: {
        containerBg: 'bg-red-50',
        itemAccent: 'border-l-4 border-red-500',
        loadMoreBg: 'bg-red-600 hover:bg-red-700',
      },
      routine: {
        containerBg: 'bg-green-50',
        itemAccent: 'border-l-4 border-green-500',
        loadMoreBg: 'bg-green-600 hover:bg-green-700',
      },
      general: {
        containerBg: 'bg-gray-50',
        itemAccent: 'border-l-4 border-blue-500',
        loadMoreBg: 'bg-blue-600 hover:bg-blue-700',
      },
    };
    return contextMap[medicalContext];
  }, [medicalContext]);

  const contextStyling = getContextStyling();

  // Animation variants for staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: animationDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // Virtualization logic (simplified for mobile performance)
  const visibleChildren = useMemo(() => {
    if (!enableVirtualization) return children;
    return children.slice(0, itemsPerPage);
  }, [children, enableVirtualization, itemsPerPage]);

  // Loading skeleton items
  const renderSkeletonItems = useCallback(() => {
    const skeletonCount = Math.min(itemsPerPage, 6);
    return Array.from({ length: skeletonCount }, (_, index) => (
      <div
        key={`skeleton-${index}`}
        className={combineClasses(
          'animate-pulse bg-gray-200',
          BORDER_RADIUS.card,
          itemMinHeight,
          'p-4'
        )}
      >
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    ));
  }, [itemsPerPage, itemMinHeight]);

  // Load more button
  const renderLoadMoreButton = useCallback(() => {
    if (!showLoadMore || !onLoadMore) return null;

    return (
      <div className="col-span-full flex justify-center mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLoadMore}
          disabled={loading}
          className={combineClasses(
            'px-6 py-3 text-white font-medium rounded-lg',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[44px] min-w-[120px]', // Touch-friendly sizing
            contextStyling.loadMoreBg
          )}
          aria-label="Tải thêm nội dung"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang tải...</span>
            </div>
          ) : (
            'Tải thêm'
          )}
        </motion.button>
      </div>
    );
  }, [showLoadMore, onLoadMore, loading, contextStyling.loadMoreBg]);

  return (
    <div className={combineClasses('w-full', SPACING.padding.section)}>
      {/* Grid container */}
      <motion.div
        className={gridClasses}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading && visibleChildren.length === 0 ? (
          // Show skeleton loading
          renderSkeletonItems()
        ) : (
          // Show actual content
          visibleChildren.map((child, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={combineClasses(
                'relative',
                itemMinHeight,
                medicalContext !== 'general' && contextStyling.itemAccent
              )}
            >
              {child}
            </motion.div>
          ))
        )}

        {/* Load more button */}
        {renderLoadMoreButton()}
      </motion.div>

      {/* Performance indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          Grid Performance: {visibleChildren.length} items rendered
          {enableVirtualization && ` (virtualized from ${children.length} total)`}
        </div>
      )}
    </div>
  );
});

export default OptimizedGrid;

// Medical grid presets for common use cases
export const MedicalGridPresets = {
  doctorGrid: {
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    gap: 'md' as const,
    itemMinHeight: 'min-h-[200px]',
    medicalContext: 'routine' as const,
    animationDelay: 0.1,
  },
  departmentGrid: {
    columns: { mobile: 1, tablet: 2, desktop: 2 },
    gap: 'lg' as const,
    itemMinHeight: 'min-h-[240px]',
    medicalContext: 'general' as const,
    animationDelay: 0.15,
  },
  serviceGrid: {
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    gap: 'md' as const,
    itemMinHeight: 'min-h-[160px]',
    medicalContext: 'routine' as const,
    animationDelay: 0.08,
    enableVirtualization: true,
    itemsPerPage: 12,
  },
  emergencyGrid: {
    columns: { mobile: 1, tablet: 1, desktop: 2 },
    gap: 'lg' as const,
    itemMinHeight: 'min-h-[180px]',
    medicalContext: 'emergency' as const,
    animationDelay: 0.05, // Faster for emergency content
  },
  newsGrid: {
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    gap: 'md' as const,
    itemMinHeight: 'min-h-[220px]',
    medicalContext: 'general' as const,
    animationDelay: 0.12,
    enableVirtualization: true,
    itemsPerPage: 9,
  },
};

// Grid performance utilities
export const GridPerformanceUtils = {
  // Calculate optimal items per page based on viewport
  calculateOptimalItemsPerPage: (itemHeight: number = 200) => {
    const viewportHeight = window.innerHeight;
    const itemsPerViewport = Math.floor(viewportHeight / itemHeight);
    return Math.max(itemsPerViewport * 2, 6); // Show 2 viewports worth, minimum 6
  },

  // Optimize grid for medical context
  optimizeForMedicalContext: (context: 'emergency' | 'routine' | 'general') => {
    const optimizations = {
      emergency: {
        itemsPerPage: 4, // Fewer items for faster loading
        animationDelay: 0.05,
        enableVirtualization: false, // Disable for immediate access
      },
      routine: {
        itemsPerPage: 12,
        animationDelay: 0.1,
        enableVirtualization: true,
      },
      general: {
        itemsPerPage: 15,
        animationDelay: 0.12,
        enableVirtualization: true,
      },
    };
    return optimizations[context];
  },
};
