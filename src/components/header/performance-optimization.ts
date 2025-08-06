/**
 * Performance Optimization for Medical Header
 * Advanced performance monitoring and optimization utilities
 */

// Performance monitoring configuration
export const PERFORMANCE_CONFIG = {
  // Target frame rates
  targetFPS: 60,
  minAcceptableFPS: 30,
  
  // Memory thresholds (MB)
  memoryWarningThreshold: 50,
  memoryCriticalThreshold: 100,
  
  // Animation performance
  maxConcurrentAnimations: 3,
  animationBudgetMs: 16.67, // 60fps = 16.67ms per frame
  
  // Backdrop blur performance
  blurOptimizationThreshold: 20, // Reduce blur on slower devices
  fallbackBlur: 10, // Fallback blur amount
  
  // Battery optimization
  batteryLowThreshold: 0.2, // 20%
  batteryCriticalThreshold: 0.1, // 10%
} as const;

// Performance metrics tracking
interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  animationCount: number;
  renderTime: number;
  batteryLevel?: number;
  isLowPowerMode?: boolean;
}

// Performance monitor class
export class MedicalHeaderPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fps: 60,
    memoryUsage: 0,
    animationCount: 0,
    renderTime: 0,
  };
  
  private frameCount = 0;
  private lastTime = performance.now();
  private animationFrame?: number;
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];
  
  constructor() {
    this.startMonitoring();
  }
  
  private startMonitoring() {
    const monitor = () => {
      const currentTime = performance.now();
      this.frameCount++;
      
      // Calculate FPS every second
      if (currentTime - this.lastTime >= 1000) {
        this.metrics.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        // Update other metrics
        this.updateMemoryUsage();
        this.updateBatteryInfo();
        
        // Notify observers
        this.notifyObservers();
      }
      
      this.animationFrame = requestAnimationFrame(monitor);
    };
    
    this.animationFrame = requestAnimationFrame(monitor);
  }
  
  private updateMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    }
  }
  
  private updateBatteryInfo() {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.metrics.batteryLevel = battery.level;
        this.metrics.isLowPowerMode = battery.level < PERFORMANCE_CONFIG.batteryLowThreshold;
      });
    }
  }
  
  private notifyObservers() {
    this.observers.forEach(observer => observer(this.metrics));
  }
  
  public subscribe(observer: (metrics: PerformanceMetrics) => void) {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }
  
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  public incrementAnimationCount() {
    this.metrics.animationCount++;
  }
  
  public decrementAnimationCount() {
    this.metrics.animationCount = Math.max(0, this.metrics.animationCount - 1);
  }
  
  public updateRenderTime(time: number) {
    this.metrics.renderTime = time;
  }
  
  public destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.observers = [];
  }
}

// Performance optimization utilities
export const optimizeForPerformance = (metrics: PerformanceMetrics) => {
  const optimizations = {
    reduceAnimations: false,
    reduceBlur: false,
    simplifyEffects: false,
    enableBatteryMode: false,
  };
  
  // FPS-based optimizations
  if (metrics.fps < PERFORMANCE_CONFIG.minAcceptableFPS) {
    optimizations.reduceAnimations = true;
    optimizations.simplifyEffects = true;
  }
  
  // Memory-based optimizations
  if (metrics.memoryUsage > PERFORMANCE_CONFIG.memoryWarningThreshold) {
    optimizations.reduceBlur = true;
  }
  
  if (metrics.memoryUsage > PERFORMANCE_CONFIG.memoryCriticalThreshold) {
    optimizations.reduceAnimations = true;
    optimizations.simplifyEffects = true;
  }
  
  // Battery-based optimizations
  if (metrics.isLowPowerMode || (metrics.batteryLevel && metrics.batteryLevel < PERFORMANCE_CONFIG.batteryLowThreshold)) {
    optimizations.enableBatteryMode = true;
    optimizations.reduceAnimations = true;
    optimizations.reduceBlur = true;
  }
  
  // Animation count optimization
  if (metrics.animationCount > PERFORMANCE_CONFIG.maxConcurrentAnimations) {
    optimizations.reduceAnimations = true;
  }
  
  return optimizations;
};

// Backdrop blur optimization
export const getOptimizedBlurValue = (metrics: PerformanceMetrics, baseBlur: number): number => {
  const optimizations = optimizeForPerformance(metrics);
  
  if (optimizations.reduceBlur) {
    return Math.min(baseBlur, PERFORMANCE_CONFIG.fallbackBlur);
  }
  
  if (optimizations.enableBatteryMode) {
    return PERFORMANCE_CONFIG.fallbackBlur;
  }
  
  return baseBlur;
};

// Animation optimization
export const getOptimizedAnimationConfig = (metrics: PerformanceMetrics) => {
  const optimizations = optimizeForPerformance(metrics);
  
  return {
    duration: optimizations.reduceAnimations ? 0.1 : 0.3,
    easing: optimizations.simplifyEffects ? 'linear' : 'cubic-bezier(0.16, 1, 0.3, 1)',
    enableSpring: !optimizations.reduceAnimations,
    enableParallax: !optimizations.simplifyEffects,
    maxConcurrent: optimizations.reduceAnimations ? 1 : PERFORMANCE_CONFIG.maxConcurrentAnimations,
  };
};

// Memory optimization utilities
export const optimizeMemoryUsage = () => {
  // Force garbage collection if available
  if ('gc' in window && typeof (window as any).gc === 'function') {
    (window as any).gc();
  }
  
  // Clear unused event listeners
  const unusedElements = document.querySelectorAll('[data-cleanup-needed]');
  unusedElements.forEach(element => {
    element.removeAttribute('data-cleanup-needed');
    // Remove event listeners would go here
  });
};

// Device capability detection
export const detectDeviceCapabilities = () => {
  const capabilities = {
    supportsBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
    supportsWebkitBackdropFilter: CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
    supportsTransform3d: CSS.supports('transform', 'translate3d(0,0,0)'),
    supportsWillChange: CSS.supports('will-change', 'transform'),
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
    deviceMemory: (navigator as any).deviceMemory || 1,
    connectionType: (navigator as any).connection?.effectiveType || 'unknown',
  };
  
  return capabilities;
};

// Performance-aware component wrapper
export const withPerformanceOptimization = <T extends object>(
  Component: React.ComponentType<T>,
  monitor: MedicalHeaderPerformanceMonitor
) => {
  return React.memo((props: T) => {
    const [optimizations, setOptimizations] = React.useState(optimizeForPerformance(monitor.getMetrics()));
    
    React.useEffect(() => {
      const unsubscribe = monitor.subscribe((metrics) => {
        setOptimizations(optimizeForPerformance(metrics));
      });
      
      return unsubscribe;
    }, []);
    
    // Apply performance optimizations to props
    const optimizedProps = {
      ...props,
      performanceMode: optimizations.enableBatteryMode,
      reduceAnimations: optimizations.reduceAnimations,
      simplifyEffects: optimizations.simplifyEffects,
    };
    
    return React.createElement(Component, optimizedProps);
  });
};

// CSS optimization utilities
export const generateOptimizedCSS = (metrics: PerformanceMetrics) => {
  const optimizations = optimizeForPerformance(metrics);
  const blurValue = getOptimizedBlurValue(metrics, 30);
  
  return {
    '--medical-header-blur': optimizations.reduceBlur ? `${blurValue}px` : '30px',
    '--medical-animation-duration': optimizations.reduceAnimations ? '0.1s' : '0.3s',
    '--medical-animation-easing': optimizations.simplifyEffects ? 'linear' : 'cubic-bezier(0.16, 1, 0.3, 1)',
    '--medical-transform-style': optimizations.simplifyEffects ? 'flat' : 'preserve-3d',
  };
};

// Performance testing utilities
export const runPerformanceTests = async () => {
  const results = {
    animationPerformance: 0,
    blurPerformance: 0,
    memoryUsage: 0,
    renderTime: 0,
  };
  
  // Test animation performance
  const animationStart = performance.now();
  await new Promise(resolve => {
    let frame = 0;
    const animate = () => {
      frame++;
      if (frame < 60) {
        requestAnimationFrame(animate);
      } else {
        results.animationPerformance = performance.now() - animationStart;
        resolve(void 0);
      }
    };
    requestAnimationFrame(animate);
  });
  
  // Test blur performance
  const blurStart = performance.now();
  const testElement = document.createElement('div');
  testElement.style.backdropFilter = 'blur(30px)';
  testElement.style.width = '100px';
  testElement.style.height = '100px';
  document.body.appendChild(testElement);
  
  await new Promise(resolve => requestAnimationFrame(resolve));
  results.blurPerformance = performance.now() - blurStart;
  document.body.removeChild(testElement);
  
  // Test memory usage
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    results.memoryUsage = memory.usedJSHeapSize / 1024 / 1024;
  }
  
  return results;
};

// Global performance monitor instance
export const globalPerformanceMonitor = new MedicalHeaderPerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceOptimization = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(globalPerformanceMonitor.getMetrics());
  const [optimizations, setOptimizations] = React.useState(optimizeForPerformance(metrics));
  
  React.useEffect(() => {
    const unsubscribe = globalPerformanceMonitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      setOptimizations(optimizeForPerformance(newMetrics));
    });
    
    return unsubscribe;
  }, []);
  
  return {
    metrics,
    optimizations,
    getOptimizedBlur: (baseBlur: number) => getOptimizedBlurValue(metrics, baseBlur),
    getOptimizedAnimation: () => getOptimizedAnimationConfig(metrics),
    getOptimizedCSS: () => generateOptimizedCSS(metrics),
  };
};

// Type definitions
export type PerformanceOptimizations = ReturnType<typeof optimizeForPerformance>;
export type DeviceCapabilities = ReturnType<typeof detectDeviceCapabilities>;
export type PerformanceTestResults = Awaited<ReturnType<typeof runPerformanceTests>>;
