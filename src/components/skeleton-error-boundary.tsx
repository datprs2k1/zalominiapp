import React, { Component, ErrorInfo, ReactNode } from 'react';
import { combineClasses } from '@/styles/medical-design-system';

// ===== ERROR BOUNDARY TYPES =====

interface SkeletonErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
}

interface SkeletonErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// ===== SKELETON ERROR BOUNDARY =====

/**
 * Error boundary specifically designed for skeleton components
 * Provides graceful fallbacks when skeleton rendering fails
 */
export class SkeletonErrorBoundary extends Component<
  SkeletonErrorBoundaryProps,
  SkeletonErrorBoundaryState
> {
  constructor(props: SkeletonErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SkeletonErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    if (import.meta.env.DEV) {
      console.error('🏥 Skeleton Error Boundary caught an error:', {
        component: this.props.componentName || 'Unknown',
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback skeleton
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback - simple static skeleton
      return (
        <div
          className={combineClasses(
            'bg-blue-50 rounded-lg animate-pulse',
            'w-full h-4', // Default dimensions
            'skeleton-optimized'
          )}
          role="status"
          aria-label="Đang tải nội dung..."
          aria-live="polite"
          data-skeleton-fallback="true"
        />
      );
    }

    return this.props.children;
  }
}

// ===== SKELETON SAFE WRAPPER =====

interface SkeletonSafeWrapperProps {
  children: ReactNode;
  fallbackHeight?: string;
  fallbackWidth?: string;
  className?: string;
  componentName?: string;
}

/**
 * Safe wrapper for skeleton components with automatic error recovery
 */
export const SkeletonSafeWrapper: React.FC<SkeletonSafeWrapperProps> = ({
  children,
  fallbackHeight = 'h-4',
  fallbackWidth = 'w-full',
  className = '',
  componentName = 'Skeleton',
}) => {
  const fallbackSkeleton = (
    <div
      className={combineClasses(
        'bg-blue-50 rounded-lg animate-pulse skeleton-optimized',
        fallbackHeight,
        fallbackWidth,
        className
      )}
      role="status"
      aria-label="Đang tải nội dung..."
      aria-live="polite"
      data-skeleton-fallback="true"
    />
  );

  return (
    <SkeletonErrorBoundary
      fallback={fallbackSkeleton}
      componentName={componentName}
      onError={(error) => {
        // Track skeleton errors for monitoring
        if (import.meta.env.DEV) {
          console.warn(`Skeleton component ${componentName} failed:`, error.message);
        }
      }}
    >
      {children}
    </SkeletonErrorBoundary>
  );
};

// ===== ANIMATION ERROR BOUNDARY =====

interface AnimationErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  disableAnimations?: boolean;
}

/**
 * Error boundary for animation-related failures
 * Falls back to static rendering when animations fail
 */
export const AnimationErrorBoundary: React.FC<AnimationErrorBoundaryProps> = ({
  children,
  fallback,
  disableAnimations = false,
}) => {
  const [hasAnimationError, setHasAnimationError] = React.useState(false);

  React.useEffect(() => {
    const handleAnimationError = (event: ErrorEvent) => {
      if (event.message?.includes('framer-motion') || 
          event.message?.includes('animation') ||
          event.message?.includes('transform')) {
        setHasAnimationError(true);
        if (import.meta.env.DEV) {
          console.warn('🎭 Animation error detected, falling back to static rendering:', event.message);
        }
      }
    };

    window.addEventListener('error', handleAnimationError);
    return () => window.removeEventListener('error', handleAnimationError);
  }, []);

  if (hasAnimationError || disableAnimations) {
    return (
      <div data-animation-disabled="true">
        {fallback || children}
      </div>
    );
  }

  return (
    <SkeletonErrorBoundary
      fallback={fallback}
      componentName="AnimationWrapper"
    >
      {children}
    </SkeletonErrorBoundary>
  );
};

// ===== PERFORMANCE SAFE WRAPPER =====

interface PerformanceSafeWrapperProps {
  children: ReactNode;
  onPerformanceError?: (error: Error) => void;
}

/**
 * Wrapper that handles performance monitoring failures gracefully
 */
export const PerformanceSafeWrapper: React.FC<PerformanceSafeWrapperProps> = ({
  children,
  onPerformanceError,
}) => {
  const [hasPerformanceError, setHasPerformanceError] = React.useState(false);

  React.useEffect(() => {
    const handlePerformanceError = (error: Error) => {
      setHasPerformanceError(true);
      onPerformanceError?.(error);
      
      if (import.meta.env.DEV) {
        console.warn('📊 Performance monitoring error, continuing without monitoring:', error.message);
      }
    };

    // Check if performance APIs are available
    try {
      if (typeof performance === 'undefined' || !performance.now) {
        throw new Error('Performance API not available');
      }
    } catch (error) {
      handlePerformanceError(error as Error);
    }

    return () => {
      // Cleanup any performance observers
      try {
        if ('PerformanceObserver' in window) {
          // Disconnect any existing observers
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, [onPerformanceError]);

  return (
    <SkeletonErrorBoundary
      componentName="PerformanceWrapper"
      onError={(error) => {
        setHasPerformanceError(true);
        onPerformanceError?.(error);
      }}
    >
      {children}
    </SkeletonErrorBoundary>
  );
};

// ===== UTILITY FUNCTIONS =====

/**
 * Higher-order component for adding error boundaries to skeleton components
 */
export function withSkeletonErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    fallbackHeight?: string;
    fallbackWidth?: string;
    componentName?: string;
  } = {}
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <SkeletonSafeWrapper
      fallbackHeight={options.fallbackHeight}
      fallbackWidth={options.fallbackWidth}
      componentName={options.componentName || Component.displayName || Component.name}
    >
      <Component {...props} ref={ref} />
    </SkeletonSafeWrapper>
  ));

  WrappedComponent.displayName = `withSkeletonErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for handling skeleton rendering errors
 */
export function useSkeletonErrorHandler() {
  const [hasError, setHasError] = React.useState(false);
  const [errorCount, setErrorCount] = React.useState(0);

  const handleError = React.useCallback((error: Error, componentName?: string) => {
    setHasError(true);
    setErrorCount(prev => prev + 1);

    if (import.meta.env.DEV) {
      console.error(`🏥 Skeleton error in ${componentName || 'unknown component'}:`, error);
    }

    // Auto-recovery after 5 seconds
    setTimeout(() => {
      setHasError(false);
    }, 5000);
  }, []);

  const resetError = React.useCallback(() => {
    setHasError(false);
    setErrorCount(0);
  }, []);

  return {
    hasError,
    errorCount,
    handleError,
    resetError,
  };
}

export default SkeletonErrorBoundary;
