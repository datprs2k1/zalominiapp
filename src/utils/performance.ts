/**
 * Performance Monitoring and Optimization Utilities
 * Tools for measuring and improving app performance
 */

// Performance metrics interface
interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

// Performance observer for Core Web Vitals
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }

    // First Contentful Paint and TTFB from Navigation Timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }

      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];
        this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  getScore(): number {
    const { fcp, lcp, fid, cls } = this.metrics;
    let score = 100;

    // FCP scoring (good: <1.8s, needs improvement: 1.8-3s, poor: >3s)
    if (fcp) {
      if (fcp > 3000) score -= 25;
      else if (fcp > 1800) score -= 10;
    }

    // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
    if (lcp) {
      if (lcp > 4000) score -= 25;
      else if (lcp > 2500) score -= 10;
    }

    // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
    if (fid) {
      if (fid > 300) score -= 25;
      else if (fid > 100) score -= 10;
    }

    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (cls) {
      if (cls > 0.25) score -= 25;
      else if (cls > 0.1) score -= 10;
    }

    return Math.max(0, score);
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Bundle size analyzer
export const analyzeBundleSize = async (): Promise<{
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{ name: string; size: number }>;
}> => {
  // This would typically integrate with webpack-bundle-analyzer
  // For now, we'll provide a mock implementation
  return {
    totalSize: 0,
    gzippedSize: 0,
    chunks: [],
  };
};

// Memory usage monitor
export const getMemoryUsage = (): {
  used: number;
  total: number;
  percentage: number;
} => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }
  return { used: 0, total: 0, percentage: 0 };
};

// Image optimization utilities
export const optimizeImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}
): string => {
  // This would integrate with an image optimization service
  // For now, return the original URL
  return url;
};

// Lazy loading utility
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Resource preloader
export const preloadResource = (
  url: string,
  type: 'script' | 'style' | 'image' | 'font' = 'script'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'image':
        link.as = 'image';
        break;
      case 'font':
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        break;
    }

    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload ${url}`));
    
    document.head.appendChild(link);
  });
};

// Critical CSS inliner
export const inlineCriticalCSS = (css: string): void => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Service Worker registration
export const registerServiceWorker = async (swUrl: string): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(swUrl);
      console.log('SW registered: ', registration);
      return registration;
    } catch (error) {
      console.log('SW registration failed: ', error);
      return null;
    }
  }
  return null;
};

// Performance budget checker
export const checkPerformanceBudget = (
  metrics: Partial<PerformanceMetrics>,
  budget: {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
  }
): {
  passed: boolean;
  violations: string[];
} => {
  const violations: string[] = [];

  if (budget.fcp && metrics.fcp && metrics.fcp > budget.fcp) {
    violations.push(`FCP exceeded budget: ${metrics.fcp}ms > ${budget.fcp}ms`);
  }

  if (budget.lcp && metrics.lcp && metrics.lcp > budget.lcp) {
    violations.push(`LCP exceeded budget: ${metrics.lcp}ms > ${budget.lcp}ms`);
  }

  if (budget.fid && metrics.fid && metrics.fid > budget.fid) {
    violations.push(`FID exceeded budget: ${metrics.fid}ms > ${budget.fid}ms`);
  }

  if (budget.cls && metrics.cls && metrics.cls > budget.cls) {
    violations.push(`CLS exceeded budget: ${metrics.cls} > ${budget.cls}`);
  }

  return {
    passed: violations.length === 0,
    violations,
  };
};

// Initialize performance monitoring
export const initPerformanceMonitoring = (): PerformanceMonitor => {
  const monitor = new PerformanceMonitor();
  
  // Report metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const metrics = monitor.getMetrics();
      const score = monitor.getScore();
      
      console.log('Performance Metrics:', metrics);
      console.log('Performance Score:', score);
      
      // You can send these metrics to your analytics service
      // analytics.track('performance_metrics', { ...metrics, score });
    }, 1000);
  });

  return monitor;
};
