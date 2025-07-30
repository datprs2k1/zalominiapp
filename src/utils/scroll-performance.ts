/**
 * Mobile Scroll Performance Optimization Utilities
 * Provides throttled/debounced scroll handlers, hardware acceleration, and performance monitoring
 */

// Performance monitoring
interface ScrollPerformanceMetrics {
  frameDrops: number;
  averageFrameTime: number;
  scrollEventCount: number;
  lastFrameTime: number;
}

class ScrollPerformanceMonitor {
  private metrics: ScrollPerformanceMetrics = {
    frameDrops: 0,
    averageFrameTime: 0,
    scrollEventCount: 0,
    lastFrameTime: performance.now(),
  };

  private frameTimeHistory: number[] = [];
  private readonly maxHistorySize = 60; // Track last 60 frames

  public recordFrame(): void {
    const currentTime = performance.now();
    const frameTime = currentTime - this.metrics.lastFrameTime;

    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > this.maxHistorySize) {
      this.frameTimeHistory.shift();
    }

    // Calculate average frame time
    this.metrics.averageFrameTime =
      this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length;

    // Detect frame drops (>16.67ms for 60fps)
    if (frameTime > 16.67) {
      this.metrics.frameDrops++;
    }

    this.metrics.lastFrameTime = currentTime;
  }

  public recordScrollEvent(): void {
    this.metrics.scrollEventCount++;
  }

  public getMetrics(): ScrollPerformanceMetrics {
    return { ...this.metrics };
  }

  public reset(): void {
    this.metrics = {
      frameDrops: 0,
      averageFrameTime: 0,
      scrollEventCount: 0,
      lastFrameTime: performance.now(),
    };
    this.frameTimeHistory = [];
  }
}

// Global performance monitor instance
export const scrollPerformanceMonitor = new ScrollPerformanceMonitor();

/**
 * Optimized throttle function using requestAnimationFrame
 * Ensures scroll handlers run at most once per frame
 */
export function throttleRAF<T extends (...args: any[]) => void>(
  func: T,
  options: { leading?: boolean; trailing?: boolean } = {}
): T {
  const { leading = true, trailing = true } = options;
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  let hasLeadingRun = false;

  const throttled = (...args: Parameters<T>) => {
    lastArgs = args;
    scrollPerformanceMonitor.recordScrollEvent();

    if (leading && !hasLeadingRun) {
      func(...args);
      hasLeadingRun = true;
    }

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        scrollPerformanceMonitor.recordFrame();

        if (trailing && lastArgs) {
          func(...lastArgs);
        }

        rafId = null;
        hasLeadingRun = false;
        lastArgs = null;
      });
    }
  };

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      hasLeadingRun = false;
      lastArgs = null;
    }
  };

  return throttled as T;
}

/**
 * Debounce function optimized for scroll events
 */
export function debounceScroll<T extends (...args: any[]) => void>(func: T, delay: number = 100): T {
  let timeoutId: number | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced as T;
}

/**
 * Hardware acceleration utilities - iOS optimized
 */
export const hardwareAcceleration = {
  /**
   * Enable hardware acceleration for an element - iOS safe version
   */
  enable(element: HTMLElement): void {
    // iOS-safe optimizations without problematic transforms
    element.style.willChange = 'opacity';
    // REMOVED: element.style.transform = 'translateZ(0)' - Causes iOS scroll issues
    // REMOVED: element.style.backfaceVisibility = 'hidden' - Can block iOS touch events
    // REMOVED: element.style.perspective = '1000px' - Not needed for iOS

    // Add iOS-specific touch optimizations
    element.style.touchAction = 'manipulation';
    element.style.webkitTouchCallout = 'none';
    element.style.webkitUserSelect = 'none';
  },

  /**
   * Disable hardware acceleration for an element
   */
  disable(element: HTMLElement): void {
    element.style.willChange = 'auto';
    element.style.transform = '';
    element.style.backfaceVisibility = '';
    element.style.perspective = '';
    element.style.touchAction = '';
    element.style.webkitTouchCallout = '';
    element.style.webkitUserSelect = '';
  },

  /**
   * Enable hardware acceleration for scroll containers - iOS optimized
   */
  enableForScrollContainer(element: HTMLElement): void {
    element.style.willChange = 'scroll-position';
    // REMOVED: element.style.transform = 'translateZ(0)' - Problematic on iOS
    element.style.webkitOverflowScrolling = 'touch';
    element.style.overscrollBehavior = 'contain';
    // Add iOS touch optimization
    element.style.touchAction = 'pan-y';
  },
};

/**
 * Optimized scroll position tracker
 */
export class ScrollPositionTracker {
  private positions = new Map<string, number>();
  private throttledSave: (key: string, position: number) => void;

  constructor(saveDelay: number = 150) {
    this.throttledSave = debounceScroll((key: string, position: number) => {
      this.positions.set(key, position);
    }, saveDelay);
  }

  public savePosition(key: string, position: number): void {
    this.throttledSave(key, position);
  }

  public getPosition(key: string): number {
    return this.positions.get(key) || 0;
  }

  public clearPosition(key: string): void {
    this.positions.delete(key);
  }

  public clearAll(): void {
    this.positions.clear();
  }
}

/**
 * Optimized scroll event handler hook
 */
export interface ScrollEventOptions {
  throttle?: boolean;
  debounce?: boolean;
  debounceDelay?: number;
  passive?: boolean;
  capture?: boolean;
}

export function createOptimizedScrollHandler(
  handler: (event: Event) => void,
  options: ScrollEventOptions = {}
): {
  attach: (element: HTMLElement | Window) => void;
  detach: (element: HTMLElement | Window) => void;
  destroy: () => void;
} {
  const { throttle = true, debounce = false, debounceDelay = 100, passive = true, capture = false } = options;

  let optimizedHandler: typeof handler;

  if (throttle && !debounce) {
    optimizedHandler = throttleRAF(handler);
  } else if (debounce) {
    optimizedHandler = debounceScroll(handler, debounceDelay);
  } else {
    optimizedHandler = handler;
  }

  const eventOptions: AddEventListenerOptions = {
    passive,
    capture,
  };

  const attachedElements = new Set<HTMLElement | Window>();

  return {
    attach(element: HTMLElement | Window) {
      element.addEventListener('scroll', optimizedHandler, eventOptions);
      attachedElements.add(element);
    },

    detach(element: HTMLElement | Window) {
      element.removeEventListener('scroll', optimizedHandler, eventOptions);
      attachedElements.delete(element);
    },

    destroy() {
      attachedElements.forEach((element) => {
        element.removeEventListener('scroll', optimizedHandler, eventOptions);
      });
      attachedElements.clear();

      if ('cancel' in optimizedHandler) {
        (optimizedHandler as any).cancel();
      }
    },
  };
}

/**
 * Smooth scroll utility with performance optimization
 */
export function smoothScrollTo(
  element: HTMLElement | Window,
  options: {
    top?: number;
    left?: number;
    behavior?: ScrollBehavior;
    duration?: number;
  }
): Promise<void> {
  const { top = 0, left = 0, behavior = 'smooth', duration = 500 } = options;

  return new Promise((resolve) => {
    // Use native smooth scrolling if supported and no custom duration
    if (behavior === 'smooth' && duration === 500) {
      if (element instanceof Window) {
        element.scrollTo({ top, left, behavior });
      } else {
        element.scrollTo({ top, left, behavior });
      }

      // Estimate completion time for native smooth scroll
      setTimeout(resolve, 500);
      return;
    }

    // Custom smooth scroll implementation for better control
    const startTime = performance.now();
    const startTop = element instanceof Window ? element.scrollY : element.scrollTop;
    const startLeft = element instanceof Window ? element.scrollX : element.scrollLeft;
    const deltaTop = top - startTop;
    const deltaLeft = left - startLeft;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      const currentTop = startTop + deltaTop * easedProgress;
      const currentLeft = startLeft + deltaLeft * easedProgress;

      if (element instanceof Window) {
        element.scrollTo(currentLeft, currentTop);
      } else {
        element.scrollTop = currentTop;
        element.scrollLeft = currentLeft;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
}

/**
 * Mobile-specific scroll optimizations
 */
export const mobileScrollOptimizations = {
  /**
   * Apply mobile-specific scroll optimizations to an element
   */
  applyToElement(element: HTMLElement): void {
    // Enable momentum scrolling on iOS
    element.style.webkitOverflowScrolling = 'touch';

    // Prevent overscroll bounce
    element.style.overscrollBehavior = 'contain';

    // Enable hardware acceleration
    hardwareAcceleration.enableForScrollContainer(element);

    // Optimize touch interactions
    element.style.touchAction = 'pan-y';
  },

  /**
   * Apply global mobile scroll optimizations
   */
  applyGlobal(): void {
    // Prevent horizontal overscroll
    document.body.style.overscrollBehaviorX = 'none';

    // Enable momentum scrolling globally
    document.body.style.webkitOverflowScrolling = 'touch';

    // Optimize touch interactions
    document.body.style.touchAction = 'manipulation';
  },

  /**
   * Remove mobile scroll optimizations
   */
  removeFromElement(element: HTMLElement): void {
    element.style.webkitOverflowScrolling = '';
    element.style.overscrollBehavior = '';
    element.style.touchAction = '';
    hardwareAcceleration.disable(element);
  },
};
