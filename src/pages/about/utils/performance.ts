// Performance optimization utilities for About page
// Provides helpers for lazy loading, memoization, and rendering optimization

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Hook for lazy loading images with intersection observer
 */
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const inView = useInView(imgRef, { once: true, margin: '50px' });

  useEffect(() => {
    if (inView && src && !isLoaded) {
      const img = new Image();

      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        setIsError(false);
      };

      img.onerror = () => {
        setIsError(true);
        setIsLoaded(false);
      };

      img.src = src;
    }
  }, [inView, src, isLoaded]);

  return {
    ref: imgRef,
    src: imageSrc,
    isLoaded,
    isError,
    inView,
  };
};

/**
 * Hook for debouncing values to prevent excessive re-renders
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for throttling function calls
 */
export const useThrottle = <T extends (...args: any[]) => any>(callback: T, delay: number): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

/**
 * Hook for memoizing expensive calculations
 */
export const useMemoizedCalculation = <T>(calculation: () => T, dependencies: React.DependencyList): T => {
  return useMemo(calculation, dependencies);
};

/**
 * Hook for optimizing animation performance
 */
export const useAnimationOptimization = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Pause animations when tab is not visible
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const shouldAnimate = isVisible && !prefersReducedMotion;

  return {
    shouldAnimate,
    isVisible,
    prefersReducedMotion,
  };
};

/**
 * Hook for optimizing scroll-based animations
 */
export const useScrollOptimization = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const throttledScrollHandler = useThrottle(() => {
    setScrollY(window.scrollY);
    setIsScrolling(true);

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, 16); // ~60fps

  useEffect(() => {
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [throttledScrollHandler]);

  return {
    scrollY,
    isScrolling,
  };
};

/**
 * Hook for preloading critical resources
 */
export const useResourcePreloader = (resources: string[]) => {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());
  const [failedResources, setFailedResources] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadResource = (url: string) => {
      return new Promise<void>((resolve, reject) => {
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          // Preload image
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = url;
        } else if (url.match(/\.(woff|woff2|ttf|otf)$/i)) {
          // Preload font
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = 'anonymous';
          link.href = url;
          link.onload = () => resolve();
          link.onerror = () => reject();
          document.head.appendChild(link);
        } else {
          // Generic fetch for other resources
          fetch(url)
            .then(() => resolve())
            .catch(() => reject());
        }
      });
    };

    const preloadAll = async () => {
      for (const resource of resources) {
        try {
          await preloadResource(resource);
          setLoadedResources((prev) => new Set(prev).add(resource));
        } catch {
          setFailedResources((prev) => new Set(prev).add(resource));
        }
      }
    };

    preloadAll();
  }, [resources]);

  return {
    loadedResources,
    failedResources,
    isComplete: loadedResources.size + failedResources.size === resources.length,
  };
};

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  /**
   * Measures component render time
   */
  measureRenderTime: (componentName: string) => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }

      return renderTime;
    };
  },

  /**
   * Measures animation frame rate
   */
  measureFPS: (duration: number = 1000) => {
    let frames = 0;
    let startTime = performance.now();

    const countFrame = () => {
      frames++;
      const currentTime = performance.now();

      if (currentTime - startTime >= duration) {
        const fps = Math.round((frames * 1000) / (currentTime - startTime));

        if (process.env.NODE_ENV === 'development') {
          console.log(`Average FPS: ${fps}`);
        }

        return fps;
      } else {
        requestAnimationFrame(countFrame);
      }
    };

    requestAnimationFrame(countFrame);
  },

  /**
   * Monitors memory usage
   */
  monitorMemory: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;

      if (process.env.NODE_ENV === 'development') {
        console.log('Memory usage:', {
          used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
          total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
          limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`,
        });
      }

      return memory;
    }

    return null;
  },
};

/**
 * Bundle size optimization helpers
 */
export const bundleOptimization = {
  /**
   * Lazy load component with error boundary
   */
  lazyLoadComponent: <T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ) => {
    const LazyComponent = React.lazy(importFn);

    return (props: React.ComponentProps<T>) =>
      React.createElement(
        React.Suspense,
        {
          fallback: fallback ? React.createElement(fallback) : React.createElement('div', {}, 'Loading...'),
        },
        React.createElement(LazyComponent, props)
      );
  },

  /**
   * Code splitting for large data sets
   */
  chunkData: <T>(data: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  },
};

/**
 * Critical rendering path optimization
 */
export const criticalPathOptimization = {
  /**
   * Preload critical CSS
   */
  preloadCriticalCSS: (href: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  },

  /**
   * Defer non-critical JavaScript
   */
  deferNonCriticalJS: (src: string) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
  },

  /**
   * Optimize font loading
   */
  optimizeFontLoading: (fontFamily: string, fontDisplay: string = 'swap') => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${fontFamily}';
        font-display: ${fontDisplay};
      }
    `;
    document.head.appendChild(style);
  },
};

// React import for lazy loading
import React from 'react';
