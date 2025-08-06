/**
 * Header Performance Utilities
 * Optimizations for better header performance across all platforms
 */

import React, { useCallback, useRef, useMemo } from 'react';

// Throttle utility for scroll events
export const useThrottledScroll = (callback: () => void, delay: number = 16) => {
  const lastRun = useRef(Date.now());

  return useCallback(() => {
    if (Date.now() - lastRun.current >= delay) {
      callback();
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Debounce utility for resize events
export const useDebounce = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => func(...args), delay);
    }) as T,
    [func, delay]
  );
};

// Memoized CSS class generator
export const useMemoizedClasses = (
  baseClasses: string,
  conditionalClasses: Record<string, boolean>,
  dependencies: any[]
) => {
  return useMemo(() => {
    const classes = [baseClasses];

    Object.entries(conditionalClasses).forEach(([className, condition]) => {
      if (condition) {
        classes.push(className);
      }
    });

    return classes.join(' ').replace(/\s+/g, ' ').trim();
  }, [baseClasses, conditionalClasses, ...dependencies]);
};

// Intersection Observer for scroll detection
export const useScrollDetection = (threshold: number = 10) => {
  const isScrolled = useRef(false);
  const callbacks = useRef<Set<(scrolled: boolean) => void>>(new Set());

  const subscribe = useCallback((callback: (scrolled: boolean) => void) => {
    callbacks.current.add(callback);

    return () => {
      callbacks.current.delete(callback);
    };
  }, []);

  const checkScroll = useThrottledScroll(() => {
    const scrolled = window.scrollY > threshold;

    if (scrolled !== isScrolled.current) {
      isScrolled.current = scrolled;
      callbacks.current.forEach((callback) => callback(scrolled));
    }
  });

  // Initialize scroll listener
  if (typeof window !== 'undefined' && callbacks.current.size === 0) {
    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  return { subscribe, getCurrentScrollState: () => isScrolled.current };
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontPreloads = ['SF Pro Display', 'Roboto', 'system-ui'];

  fontPreloads.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = `/fonts/${font.replace(/\s+/g, '-').toLowerCase()}.woff2`;
    document.head.appendChild(link);
  });
};

// Bundle size optimization - lazy load heavy components
export const lazyLoadComponent = <T extends React.ComponentType<any>>(importFunc: () => Promise<{ default: T }>) => {
  return React.lazy(importFunc);
};

// Memory cleanup utility
export const useCleanup = (cleanup: () => void) => {
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  React.useEffect(() => {
    return () => cleanupRef.current();
  }, []);
};

// Performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  React.useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }

    startTime.current = performance.now();
  });

  return { renderCount: renderCount.current };
};
