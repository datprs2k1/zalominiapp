// ===== PERFORMANCE MONITORING TYPES =====

interface SkeletonMetrics {
  componentName: string;
  renderTime: number;
  renderCount: number;
  firstRenderTime: number;
  averageRenderTime: number;
  memoryUsage?: number;
  isVisible: boolean;
  loadingDuration: number;
  transitionDuration: number;
  userAgent: string;
  timestamp: number;
}

interface PerformanceThresholds {
  maxRenderTime: number;
  maxRenderCount: number;
  maxLoadingDuration: number;
  maxMemoryUsage: number;
}

interface PerformanceReport {
  totalSkeletons: number;
  averageRenderTime: number;
  slowestComponent: string;
  mostRenderedComponent: string;
  memoryUsage: number;
  recommendations: string[];
  timestamp: number;
}

// ===== PERFORMANCE MONITORING CLASS =====

class SkeletonPerformanceMonitor {
  private metrics: Map<string, SkeletonMetrics> = new Map();
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;
  
  private readonly thresholds: PerformanceThresholds = {
    maxRenderTime: 16, // 60fps target
    maxRenderCount: 10,
    maxLoadingDuration: 3000,
    maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  };

  constructor() {
    this.initializeMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  private initializeMonitoring() {
    if (typeof window === 'undefined' || this.isMonitoring) return;

    try {
      // Monitor paint and layout metrics
      if ('PerformanceObserver' in window) {
        this.setupPerformanceObserver();
      }

      // Monitor memory usage
      this.setupMemoryMonitoring();

      // Setup periodic reporting
      this.setupPeriodicReporting();

      this.isMonitoring = true;
      console.log('🏥 Medical Skeleton Performance Monitor initialized');
    } catch (error) {
      console.warn('Failed to initialize skeleton performance monitoring:', error);
    }
  }

  /**
   * Setup performance observer for paint and layout metrics
   */
  private setupPerformanceObserver() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.name.includes('skeleton') || entry.name.includes('Medical')) {
          this.recordPerformanceEntry(entry);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['measure', 'mark', 'paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Performance observer not fully supported:', error);
    }
  }

  /**
   * Setup memory monitoring
   */
  private setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > this.thresholds.maxMemoryUsage) {
          this.logWarning('High memory usage detected', {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
          });
        }
      }, 5000);
    }
  }

  /**
   * Setup periodic performance reporting
   */
  private setupPeriodicReporting() {
    setInterval(() => {
      if (this.metrics.size > 0) {
        const report = this.generatePerformanceReport();
        this.logPerformanceReport(report);
      }
    }, 30000); // Report every 30 seconds
  }

  /**
   * Record a skeleton component render
   */
  recordRender(componentName: string, renderTime: number, isFirstRender = false) {
    const existing = this.metrics.get(componentName);
    const timestamp = performance.now();

    if (existing) {
      existing.renderCount++;
      existing.renderTime = renderTime;
      existing.averageRenderTime = (existing.averageRenderTime + renderTime) / 2;
      existing.timestamp = timestamp;
    } else {
      this.metrics.set(componentName, {
        componentName,
        renderTime,
        renderCount: 1,
        firstRenderTime: renderTime,
        averageRenderTime: renderTime,
        isVisible: true,
        loadingDuration: 0,
        transitionDuration: 0,
        userAgent: navigator.userAgent,
        timestamp,
      });
    }

    // Check for performance issues
    this.checkPerformanceThresholds(componentName, renderTime);

    // Mark performance entry
    if ('mark' in performance) {
      performance.mark(`skeleton-${componentName}-render-${timestamp}`);
    }
  }

  /**
   * Record skeleton loading duration
   */
  recordLoadingDuration(componentName: string, duration: number) {
    const metric = this.metrics.get(componentName);
    if (metric) {
      metric.loadingDuration = duration;
      
      if (duration > this.thresholds.maxLoadingDuration) {
        this.logWarning('Slow skeleton loading detected', {
          component: componentName,
          duration,
          threshold: this.thresholds.maxLoadingDuration,
        });
      }
    }
  }

  /**
   * Record skeleton transition duration
   */
  recordTransitionDuration(componentName: string, duration: number) {
    const metric = this.metrics.get(componentName);
    if (metric) {
      metric.transitionDuration = duration;
    }
  }

  /**
   * Record skeleton visibility change
   */
  recordVisibilityChange(componentName: string, isVisible: boolean) {
    const metric = this.metrics.get(componentName);
    if (metric) {
      metric.isVisible = isVisible;
    }
  }

  /**
   * Record performance entry from PerformanceObserver
   */
  private recordPerformanceEntry(entry: PerformanceEntry) {
    if (entry.entryType === 'measure' && entry.name.includes('skeleton')) {
      const componentName = this.extractComponentName(entry.name);
      this.recordRender(componentName, entry.duration);
    }
  }

  /**
   * Extract component name from performance entry name
   */
  private extractComponentName(entryName: string): string {
    const match = entryName.match(/skeleton-(.+?)-/);
    return match ? match[1] : 'unknown';
  }

  /**
   * Check if metrics exceed performance thresholds
   */
  private checkPerformanceThresholds(componentName: string, renderTime: number) {
    const metric = this.metrics.get(componentName);
    if (!metric) return;

    // Check render time
    if (renderTime > this.thresholds.maxRenderTime) {
      this.logWarning('Slow skeleton render detected', {
        component: componentName,
        renderTime,
        threshold: this.thresholds.maxRenderTime,
      });
    }

    // Check render count
    if (metric.renderCount > this.thresholds.maxRenderCount) {
      this.logWarning('Excessive skeleton re-renders detected', {
        component: componentName,
        renderCount: metric.renderCount,
        threshold: this.thresholds.maxRenderCount,
      });
    }
  }

  /**
   * Generate comprehensive performance report
   */
  generatePerformanceReport(): PerformanceReport {
    const metrics = Array.from(this.metrics.values());
    
    const totalSkeletons = metrics.length;
    const averageRenderTime = metrics.reduce((sum, m) => sum + m.averageRenderTime, 0) / totalSkeletons;
    
    const slowestComponent = metrics.reduce((slowest, current) => 
      current.averageRenderTime > slowest.averageRenderTime ? current : slowest
    ).componentName;
    
    const mostRenderedComponent = metrics.reduce((most, current) => 
      current.renderCount > most.renderCount ? current : most
    ).componentName;

    const memoryUsage = 'memory' in performance 
      ? (performance as any).memory.usedJSHeapSize 
      : 0;

    const recommendations = this.generateRecommendations(metrics);

    return {
      totalSkeletons,
      averageRenderTime,
      slowestComponent,
      mostRenderedComponent,
      memoryUsage,
      recommendations,
      timestamp: Date.now(),
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: SkeletonMetrics[]): string[] {
    const recommendations: string[] = [];

    // Check for slow components
    const slowComponents = metrics.filter(m => m.averageRenderTime > this.thresholds.maxRenderTime);
    if (slowComponents.length > 0) {
      recommendations.push(`Optimize slow skeleton components: ${slowComponents.map(c => c.componentName).join(', ')}`);
    }

    // Check for excessive re-renders
    const excessiveRenders = metrics.filter(m => m.renderCount > this.thresholds.maxRenderCount);
    if (excessiveRenders.length > 0) {
      recommendations.push(`Reduce re-renders for: ${excessiveRenders.map(c => c.componentName).join(', ')}`);
    }

    // Check for long loading durations
    const slowLoading = metrics.filter(m => m.loadingDuration > this.thresholds.maxLoadingDuration);
    if (slowLoading.length > 0) {
      recommendations.push(`Improve loading performance for: ${slowLoading.map(c => c.componentName).join(', ')}`);
    }

    // General recommendations
    if (metrics.length > 20) {
      recommendations.push('Consider implementing skeleton virtualization for large lists');
    }

    if (recommendations.length === 0) {
      recommendations.push('Skeleton performance is optimal');
    }

    return recommendations;
  }

  /**
   * Log performance warning
   */
  private logWarning(message: string, data: any) {
    if (import.meta.env.DEV) {
      console.warn(`⚠️ Medical Skeleton Performance: ${message}`, data);
    }
  }

  /**
   * Log performance report
   */
  private logPerformanceReport(report: PerformanceReport) {
    if (import.meta.env.DEV) {
      console.group('🏥 Medical Skeleton Performance Report');
      console.log('Total Skeletons:', report.totalSkeletons);
      console.log('Average Render Time:', `${report.averageRenderTime.toFixed(2)}ms`);
      console.log('Slowest Component:', report.slowestComponent);
      console.log('Most Rendered Component:', report.mostRenderedComponent);
      console.log('Memory Usage:', `${(report.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      console.log('Recommendations:', report.recommendations);
      console.groupEnd();
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): SkeletonMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get metric for specific component
   */
  getComponentMetric(componentName: string): SkeletonMetrics | undefined {
    return this.metrics.get(componentName);
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics.clear();
  }

  /**
   * Destroy monitor and cleanup
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
    this.isMonitoring = false;
  }
}

// ===== SINGLETON INSTANCE =====

export const skeletonPerformanceMonitor = new SkeletonPerformanceMonitor();

// ===== UTILITY FUNCTIONS =====

/**
 * Hook for tracking skeleton component performance
 */
export function useSkeletonPerformanceTracking(componentName: string) {
  const startTime = performance.now();

  return {
    recordRender: (isFirstRender = false) => {
      const renderTime = performance.now() - startTime;
      skeletonPerformanceMonitor.recordRender(componentName, renderTime, isFirstRender);
    },
    recordLoadingDuration: (duration: number) => {
      skeletonPerformanceMonitor.recordLoadingDuration(componentName, duration);
    },
    recordTransitionDuration: (duration: number) => {
      skeletonPerformanceMonitor.recordTransitionDuration(componentName, duration);
    },
    recordVisibilityChange: (isVisible: boolean) => {
      skeletonPerformanceMonitor.recordVisibilityChange(componentName, isVisible);
    },
  };
}

export default skeletonPerformanceMonitor;
