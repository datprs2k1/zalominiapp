/**
 * Performance Optimizations Hook
 * Provides comprehensive performance monitoring and optimization utilities for mobile devices
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useEnhancedMobile } from './use-enhanced-mobile';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  
  // Additional metrics
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  
  // Memory usage
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  } | null;
  
  // Network information
  networkInfo: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  } | null;
  
  // Device performance
  deviceScore: number; // 0-100 performance score
  batteryLevel: number | null;
  isLowEndDevice: boolean;
}

export interface PerformanceOptimizations {
  // Image optimization
  shouldUseWebP: boolean;
  shouldLazyLoad: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  
  // Animation optimization
  shouldReduceAnimations: boolean;
  animationDuration: number;
  
  // Resource loading
  shouldPreload: boolean;
  shouldPrefetch: boolean;
  
  // Rendering optimization
  shouldVirtualize: boolean;
  batchSize: number;
}

export interface PerformanceUtils {
  // Monitoring
  startPerformanceMonitoring: () => void;
  stopPerformanceMonitoring: () => void;
  measureFunction: <T>(fn: () => T, name: string) => T;
  
  // Optimization
  optimizeImages: (src: string, options?: ImageOptimizationOptions) => string;
  debounce: <T extends (...args: any[]) => any>(fn: T, delay: number) => T;
  throttle: <T extends (...args: any[]) => any>(fn: T, limit: number) => T;
  
  // Lazy loading
  createIntersectionObserver: (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => IntersectionObserver;
  
  // Memory management
  cleanupResources: () => void;
  
  // Network optimization
  shouldLoadResource: (priority: 'high' | 'medium' | 'low') => boolean;
}

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export const usePerformanceOptimizations = () => {
  const { deviceInfo, networkSpeed } = useEnhancedMobile();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    memoryUsage: null,
    networkInfo: null,
    deviceScore: 50,
    batteryLevel: null,
    isLowEndDevice: false,
  });

  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const measurementsRef = useRef<Map<string, number>>(new Map());

  // Calculate device performance score
  const deviceScore = useMemo(() => {
    let score = 50; // Base score
    
    // CPU cores (if available)
    const cores = navigator.hardwareConcurrency || 2;
    score += Math.min(cores * 10, 30);
    
    // Memory (if available)
    const memory = (navigator as any).deviceMemory;
    if (memory) {
      score += Math.min(memory * 5, 20);
    }
    
    // Network speed
    if (networkSpeed === 'fast') {
      score += 20;
    } else if (networkSpeed === 'slow') {
      score -= 20;
    }
    
    // Platform optimization
    if (deviceInfo.platform === 'ios') {
      score += 10; // iOS generally has better performance
    }
    
    return Math.max(0, Math.min(100, score));
  }, [deviceInfo.platform, networkSpeed]);

  // Determine if device is low-end
  const isLowEndDevice = useMemo(() => {
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency || 2;
    
    return (
      deviceScore < 40 ||
      (memory && memory < 4) ||
      cores < 4 ||
      networkSpeed === 'slow'
    );
  }, [deviceScore, networkSpeed]);

  // Performance optimizations based on device capabilities
  const optimizations = useMemo<PerformanceOptimizations>(() => {
    return {
      shouldUseWebP: 'WebP' in window || deviceScore > 60,
      shouldLazyLoad: true,
      imageQuality: isLowEndDevice ? 'low' : deviceScore > 70 ? 'high' : 'medium',
      shouldReduceAnimations: isLowEndDevice || deviceScore < 50,
      animationDuration: isLowEndDevice ? 0.1 : deviceScore > 70 ? 0.3 : 0.2,
      shouldPreload: deviceScore > 60 && networkSpeed === 'fast',
      shouldPrefetch: deviceScore > 70 && networkSpeed === 'fast',
      shouldVirtualize: isLowEndDevice,
      batchSize: isLowEndDevice ? 10 : 20,
    };
  }, [deviceScore, isLowEndDevice, networkSpeed]);

  // Initialize performance monitoring
  useEffect(() => {
    const updateMetrics = () => {
      // Get network information
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const networkInfo = connection ? {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
      } : null;

      // Get memory usage
      const memory = (performance as any).memory;
      const memoryUsage = memory ? {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      } : null;

      // Get battery level
      let batteryLevel: number | null = null;
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          batteryLevel = battery.level * 100;
        });
      }

      setMetrics(prev => ({
        ...prev,
        networkInfo,
        memoryUsage,
        batteryLevel,
        deviceScore,
        isLowEndDevice,
      }));
    };

    updateMetrics();

    // Update metrics periodically
    const interval = setInterval(updateMetrics, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [deviceScore, isLowEndDevice]);

  // Core Web Vitals monitoring
  const startPerformanceMonitoring = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
      });
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    performanceObserverRef.current = lcpObserver; // Store one for cleanup
  }, []);

  const stopPerformanceMonitoring = useCallback(() => {
    if (performanceObserverRef.current) {
      performanceObserverRef.current.disconnect();
    }
  }, []);

  // Function performance measurement
  const measureFunction = useCallback(<T>(fn: () => T, name: string): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;
    
    measurementsRef.current.set(name, duration);
    
    // Log slow functions
    if (duration > 16) { // Slower than 60fps
      console.warn(`Slow function detected: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }, []);

  // Image optimization
  const optimizeImages = useCallback((src: string, options: ImageOptimizationOptions = {}) => {
    const {
      width,
      height,
      quality = optimizations.imageQuality === 'low' ? 60 : optimizations.imageQuality === 'high' ? 90 : 75,
      format = optimizations.shouldUseWebP ? 'webp' : 'jpeg',
    } = options;

    // If it's a data URL or blob, return as-is
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      return src;
    }

    // Build optimization parameters
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', quality.toString());
    params.append('f', format);

    // Return optimized URL (assuming image optimization service)
    return `${src}?${params.toString()}`;
  }, [optimizations.imageQuality, optimizations.shouldUseWebP]);

  // Debounce utility
  const debounce = useCallback(<T extends (...args: any[]) => any>(fn: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    }) as T;
  }, []);

  // Throttle utility
  const throttle = useCallback(<T extends (...args: any[]) => any>(fn: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  }, []);

  // Intersection Observer for lazy loading
  const createIntersectionObserver = useCallback((
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
  ) => {
    const defaultOptions = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    };

    return new IntersectionObserver(callback, defaultOptions);
  }, []);

  // Resource cleanup
  const cleanupResources = useCallback(() => {
    // Clear measurements
    measurementsRef.current.clear();
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
    
    // Clear caches if needed
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('temp') || name.includes('old')) {
            caches.delete(name);
          }
        });
      });
    }
  }, []);

  // Resource loading decision
  const shouldLoadResource = useCallback((priority: 'high' | 'medium' | 'low') => {
    if (priority === 'high') return true;
    
    if (isLowEndDevice) {
      return priority === 'high';
    }
    
    if (networkSpeed === 'slow') {
      return priority !== 'low';
    }
    
    return true;
  }, [isLowEndDevice, networkSpeed]);

  return {
    // State
    metrics,
    optimizations,
    
    // Utils
    startPerformanceMonitoring,
    stopPerformanceMonitoring,
    measureFunction,
    optimizeImages,
    debounce,
    throttle,
    createIntersectionObserver,
    cleanupResources,
    shouldLoadResource,
  };
};
