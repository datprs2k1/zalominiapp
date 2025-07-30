// Performance and accessibility utilities for skeleton components
import * as SkeletonComponents from './route-skeletons';

// Preload skeleton components for better performance
export function preloadSkeletonComponents() {
  // This function can be called during app initialization
  // to preload skeleton components into memory

  if (typeof window !== 'undefined') {
    // Use requestIdleCallback for non-blocking preloading
    const preload = () => {
      // Skeleton components are now statically imported for better optimization
      // This ensures they're included in the main bundle for immediate availability
      console.log('Skeleton components preloaded (static import)');
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preload);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(preload, 100);
    }
  }
}

// Reduce motion for users who prefer reduced motion
export function getReducedMotionSkeletonAnimation() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    return !prefersReducedMotion.matches;
  }
  return true; // Default to animated if we can't detect preference
}

// Performance monitoring for skeleton loading
export function trackSkeletonPerformance(skeletonName: string, startTime: number) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log performance metrics (in production, you might send this to analytics)
    console.log(`Skeleton ${skeletonName} rendered in ${duration.toFixed(2)}ms`);

    // Mark performance entry
    if ('mark' in performance) {
      performance.mark(`skeleton-${skeletonName}-complete`);
    }
  }
}

// Intersection Observer for lazy skeleton loading
export function createSkeletonIntersectionObserver(callback: (entries: IntersectionObserverEntry[]) => void) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    });
  }
  return null;
}

// Memory management for skeleton components
export function cleanupSkeletonResources() {
  // Clean up any skeleton-related resources
  if (typeof window !== 'undefined') {
    // Remove any skeleton-specific event listeners
    // Clear any skeleton-related timers
    // This can be called during component unmount or route changes
  }
}

// Accessibility announcements for screen readers
export function announceSkeletonState(message: string) {
  if (typeof window !== 'undefined') {
    // Create a live region for screen reader announcements
    let liveRegion = document.getElementById('skeleton-live-region');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'skeleton-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }

    // Clear previous message and set new one
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion!.textContent = message;
    }, 100);
  }
}

// Skeleton component registry for dynamic loading
const skeletonRegistry = new Map<string, () => Promise<any>>();

export function registerSkeleton(name: string, loader: () => Promise<any>) {
  skeletonRegistry.set(name, loader);
}

export function getSkeletonLoader(name: string) {
  return skeletonRegistry.get(name);
}

// Initialize skeleton performance utilities
export function initializeSkeletonPerformance() {
  if (typeof window !== 'undefined') {
    // Set up performance observers
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('skeleton')) {
            console.log(`Skeleton performance entry:`, entry);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['mark', 'measure'] });
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
    }

    // Preload skeleton components
    preloadSkeletonComponents();
  }
}

// Export all utilities
export default {
  preloadSkeletonComponents,
  getReducedMotionSkeletonAnimation,
  trackSkeletonPerformance,
  createSkeletonIntersectionObserver,
  cleanupSkeletonResources,
  announceSkeletonState,
  registerSkeleton,
  getSkeletonLoader,
  initializeSkeletonPerformance,
};
