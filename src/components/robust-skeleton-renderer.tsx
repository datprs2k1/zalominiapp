import React, { memo, useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { combineClasses } from '@/styles/medical-design-system';
import { SkeletonSafeWrapper, AnimationErrorBoundary } from './skeleton-error-boundary';

// ===== ROBUST SKELETON TYPES =====

interface RobustSkeletonProps {
  variant?: 'primary' | 'secondary' | 'neutral' | 'fast';
  width?: string;
  height?: string;
  className?: string;
  animated?: boolean;
  ariaLabel?: string;
  shape?: 'rectangle' | 'circle' | 'rounded' | 'pill';
  fallbackMode?: boolean;
  testId?: string;
}

interface SkeletonRenderState {
  isReady: boolean;
  hasError: boolean;
  renderAttempts: number;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get safe skeleton classes with fallbacks
 */
const getSafeSkeletonClasses = (
  variant: RobustSkeletonProps['variant'] = 'primary',
  animated: boolean = true,
  shouldReduceMotion: boolean = false,
  shape: RobustSkeletonProps['shape'] = 'rectangle',
  fallbackMode: boolean = false
): string => {
  // Fallback mode uses simple classes
  if (fallbackMode || shouldReduceMotion || !animated) {
    const baseClasses = 'skeleton-optimized animate-pulse';
    const variantClasses = {
      primary: 'bg-blue-50',
      secondary: 'bg-green-50', 
      neutral: 'bg-gray-50',
      fast: 'bg-blue-50',
    };
    
    const shapeClasses = {
      rectangle: 'rounded',
      circle: 'rounded-full aspect-square',
      rounded: 'rounded-lg',
      pill: 'rounded-full',
    };

    return combineClasses(
      baseClasses,
      variantClasses[variant],
      shapeClasses[shape]
    );
  }

  // Enhanced mode with medical styling
  const baseClasses = 'skeleton-optimized';
  const variantClasses = {
    primary: 'skeleton-medical-primary',
    secondary: 'skeleton-medical-secondary',
    neutral: 'skeleton-medical-neutral',
    fast: 'skeleton-medical-primary animate-skeleton-fast',
  };

  const shapeClasses = {
    rectangle: 'rounded-lg',
    circle: 'rounded-full aspect-square',
    rounded: 'rounded-lg',
    pill: 'rounded-full',
  };

  return combineClasses(
    baseClasses,
    variantClasses[variant],
    shapeClasses[shape]
  );
};

/**
 * Safe animation props with error handling
 */
const getSafeAnimationProps = (
  animated: boolean,
  shouldReduceMotion: boolean,
  fallbackMode: boolean
) => {
  if (!animated || shouldReduceMotion || fallbackMode) {
    return {};
  }

  try {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { 
        duration: 0.3,
        ease: 'easeOut'
      },
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Animation props failed, using fallback:', error);
    }
    return {};
  }
};

// ===== ROBUST SKELETON COMPONENT =====

/**
 * Robust skeleton component that guarantees rendering
 */
export const RobustSkeleton = memo<RobustSkeletonProps>(({
  variant = 'primary',
  width = 'w-full',
  height = 'h-4',
  className = '',
  animated = true,
  ariaLabel = 'Đang tải nội dung...',
  shape = 'rectangle',
  fallbackMode = false,
  testId,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [renderState, setRenderState] = useState<SkeletonRenderState>({
    isReady: false,
    hasError: false,
    renderAttempts: 0,
  });
  const mountedRef = useRef(true);

  // Ensure component is ready to render
  useEffect(() => {
    if (mountedRef.current) {
      setRenderState(prev => ({
        ...prev,
        isReady: true,
        renderAttempts: prev.renderAttempts + 1,
      }));
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Memoized classes for performance
  const skeletonClasses = useMemo(() => {
    try {
      return combineClasses(
        getSafeSkeletonClasses(variant, animated, shouldReduceMotion, shape, fallbackMode),
        width,
        height,
        className
      );
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Skeleton classes failed, using fallback:', error);
      }
      return combineClasses('bg-blue-50 rounded animate-pulse skeleton-optimized', width, height);
    }
  }, [variant, animated, shouldReduceMotion, shape, fallbackMode, width, height, className]);

  // Memoized animation props
  const animationProps = useMemo(() => 
    getSafeAnimationProps(animated, shouldReduceMotion, fallbackMode || renderState.hasError),
    [animated, shouldReduceMotion, fallbackMode, renderState.hasError]
  );

  // Error handler
  const handleRenderError = useCallback(() => {
    if (mountedRef.current) {
      setRenderState(prev => ({
        ...prev,
        hasError: true,
      }));
    }
  }, []);

  // Don't render until ready (prevents hydration issues)
  if (!renderState.isReady) {
    return (
      <div
        className={combineClasses('bg-blue-50 rounded animate-pulse skeleton-optimized', width, height)}
        role="status"
        aria-label={ariaLabel}
        data-skeleton-loading="true"
        data-testid={testId}
      />
    );
  }

  // Fallback rendering for errors or fallback mode
  if (renderState.hasError || fallbackMode || renderState.renderAttempts > 3) {
    return (
      <div
        className={combineClasses('bg-blue-50 rounded animate-pulse skeleton-optimized', width, height, className)}
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
        data-skeleton-fallback="true"
        data-testid={testId}
      />
    );
  }

  // Enhanced rendering with animations
  try {
    return (
      <AnimationErrorBoundary
        fallback={
          <div
            className={skeletonClasses}
            role="status"
            aria-label={ariaLabel}
            aria-live="polite"
            data-skeleton-static="true"
            data-testid={testId}
          />
        }
        disableAnimations={shouldReduceMotion || !animated}
      >
        <motion.div
          className={skeletonClasses}
          role="status"
          aria-label={ariaLabel}
          aria-live="polite"
          aria-hidden="true"
          data-skeleton-enhanced="true"
          data-testid={testId}
          onError={handleRenderError}
          {...animationProps}
        />
      </AnimationErrorBoundary>
    );
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Enhanced skeleton rendering failed, using fallback:', error);
    }
    
    // Ultimate fallback
    return (
      <div
        className={combineClasses('bg-blue-50 rounded animate-pulse skeleton-optimized', width, height)}
        role="status"
        aria-label={ariaLabel}
        data-skeleton-ultimate-fallback="true"
        data-testid={testId}
      />
    );
  }
});

// ===== ROBUST SKELETON GROUP =====

interface RobustSkeletonGroupProps {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
  fallbackMode?: boolean;
  testId?: string;
}

export const RobustSkeletonGroup = memo<RobustSkeletonGroupProps>(({
  children,
  ariaLabel,
  className = '',
  fallbackMode = false,
  testId,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady || fallbackMode) {
    return (
      <div
        className={combineClasses('space-y-4', className)}
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
        data-skeleton-group-fallback="true"
        data-testid={testId}
      >
        {children}
      </div>
    );
  }

  try {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: shouldReduceMotion ? 0.2 : 0.4, ease: 'easeOut' },
      },
    };

    return (
      <AnimationErrorBoundary
        fallback={
          <div
            className={combineClasses('space-y-4', className)}
            role="status"
            aria-label={ariaLabel}
            aria-live="polite"
            data-skeleton-group-static="true"
            data-testid={testId}
          >
            {children}
          </div>
        }
        disableAnimations={shouldReduceMotion}
      >
        <motion.div
          className={combineClasses('space-y-4', className)}
          role="status"
          aria-label={ariaLabel}
          aria-live="polite"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          data-skeleton-group-enhanced="true"
          data-testid={testId}
        >
          {React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))}
        </motion.div>
      </AnimationErrorBoundary>
    );
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Enhanced skeleton group rendering failed, using fallback:', error);
    }

    return (
      <div
        className={combineClasses('space-y-4', className)}
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
        data-skeleton-group-ultimate-fallback="true"
        data-testid={testId}
      >
        {children}
      </div>
    );
  }
});

// ===== ROBUST SKELETON TRANSITION =====

interface RobustSkeletonTransitionProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  fallbackMode?: boolean;
  testId?: string;
}

export const RobustSkeletonTransition = memo<RobustSkeletonTransitionProps>(({
  isLoading,
  skeleton,
  children,
  className = '',
  fallbackMode = false,
  testId,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Simple fallback rendering
  if (!isReady || fallbackMode || shouldReduceMotion) {
    return (
      <div className={className} data-testid={testId}>
        {isLoading ? skeleton : children}
      </div>
    );
  }

  // Enhanced transition rendering
  try {
    return (
      <AnimationErrorBoundary
        fallback={
          <div className={className} data-testid={testId}>
            {isLoading ? skeleton : children}
          </div>
        }
      >
        <div className={className} data-testid={testId}>
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {skeleton}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </AnimationErrorBoundary>
    );
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Enhanced skeleton transition failed, using fallback:', error);
    }

    return (
      <div className={className} data-testid={testId}>
        {isLoading ? skeleton : children}
      </div>
    );
  }
});

// Set display names
RobustSkeleton.displayName = 'RobustSkeleton';
RobustSkeletonGroup.displayName = 'RobustSkeletonGroup';
RobustSkeletonTransition.displayName = 'RobustSkeletonTransition';

export default RobustSkeleton;
