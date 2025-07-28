/**
 * Performance Monitoring Utilities for Zalo Mini App
 * Medical-context aware performance tracking and optimization
 */

interface PerformanceMetrics {
  timestamp: number;
  metric: string;
  value: number;
  context?: string;
  medicalPriority?: 'emergency' | 'routine' | 'general';
}

interface ComponentPerformance {
  componentName: string;
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastUpdate: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private componentMetrics: Map<string, ComponentPerformance> = new Map();
  private observers: PerformanceObserver[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.initializeObservers();
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      this.isEnabled = false;
      return;
    }

    try {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.recordMetric('page_load_time', entry.duration, 'navigation');
            this.recordMetric('dom_content_loaded', (entry as PerformanceNavigationTiming).domContentLoadedEventEnd, 'navigation');
          }
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.recordMetric('resource_load_time', resourceEntry.duration, `resource:${resourceEntry.name}`);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('largest_contentful_paint', entry.startTime, 'core_web_vitals');
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // Observe first input delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('first_input_delay', (entry as any).processingStart - entry.startTime, 'core_web_vitals');
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
      this.isEnabled = false;
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: string, value: number, context?: string, medicalPriority?: 'emergency' | 'routine' | 'general') {
    if (!this.isEnabled) return;

    const entry: PerformanceMetrics = {
      timestamp: Date.now(),
      metric,
      value,
      context,
      medicalPriority,
    };

    this.metrics.push(entry);

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Log critical performance issues
    this.checkCriticalMetrics(entry);
  }

  /**
   * Track React component performance
   */
  trackComponent(componentName: string, phase: 'mount' | 'update' | 'render', duration: number) {
    if (!this.isEnabled) return;

    const existing = this.componentMetrics.get(componentName);
    const now = Date.now();

    if (existing) {
      if (phase === 'render') {
        existing.renderTime = duration;
      } else if (phase === 'update') {
        existing.updateCount++;
        existing.lastUpdate = now;
      }
    } else {
      this.componentMetrics.set(componentName, {
        componentName,
        renderTime: phase === 'render' ? duration : 0,
        mountTime: phase === 'mount' ? duration : 0,
        updateCount: phase === 'update' ? 1 : 0,
        lastUpdate: now,
      });
    }

    // Record metric for analysis
    this.recordMetric(`component_${phase}_time`, duration, `component:${componentName}`);
  }

  /**
   * Check for critical performance issues
   */
  private checkCriticalMetrics(entry: PerformanceMetrics) {
    const thresholds = {
      largest_contentful_paint: 2500, // 2.5s
      first_input_delay: 100, // 100ms
      page_load_time: 3000, // 3s
      component_render_time: 16, // 16ms (60fps)
    };

    const threshold = thresholds[entry.metric as keyof typeof thresholds];
    if (threshold && entry.value > threshold) {
      console.warn(`Performance issue detected: ${entry.metric} took ${entry.value}ms (threshold: ${threshold}ms)`, {
        context: entry.context,
        medicalPriority: entry.medicalPriority,
      });

      // For medical emergency contexts, log more aggressively
      if (entry.medicalPriority === 'emergency') {
        console.error(`CRITICAL: Emergency medical context performance issue: ${entry.metric}`);
      }
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    if (!this.isEnabled) return null;

    const summary = {
      totalMetrics: this.metrics.length,
      componentCount: this.componentMetrics.size,
      averageMetrics: {} as Record<string, number>,
      criticalIssues: 0,
      medicalContextMetrics: {
        emergency: 0,
        routine: 0,
        general: 0,
      },
    };

    // Calculate averages
    const metricGroups = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.metric]) acc[metric.metric] = [];
      acc[metric.metric].push(metric.value);
      
      // Count medical context metrics
      if (metric.medicalPriority) {
        summary.medicalContextMetrics[metric.medicalPriority]++;
      }

      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(metricGroups).forEach(([metric, values]) => {
      summary.averageMetrics[metric] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    return summary;
  }

  /**
   * Get component performance data
   */
  getComponentPerformance() {
    return Array.from(this.componentMetrics.values()).sort((a, b) => b.renderTime - a.renderTime);
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = [];
    this.componentMetrics.clear();
  }

  /**
   * Disable performance monitoring
   */
  disable() {
    this.isEnabled = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * Medical-specific performance tracking
   */
  trackMedicalAction(action: string, duration: number, priority: 'emergency' | 'routine' | 'general') {
    this.recordMetric(`medical_action_${action}`, duration, 'medical_action', priority);
    
    // For emergency actions, also track in separate high-priority metrics
    if (priority === 'emergency') {
      this.recordMetric('emergency_action_time', duration, `emergency:${action}`, 'emergency');
    }
  }

  /**
   * Track medical page load performance
   */
  trackMedicalPageLoad(pageName: string, loadTime: number, medicalContext?: string) {
    this.recordMetric('medical_page_load', loadTime, `page:${pageName}`, 
      medicalContext?.includes('emergency') ? 'emergency' : 'routine');
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for component performance tracking
export function usePerformanceTracking(componentName: string) {
  const trackRender = (duration: number) => {
    performanceMonitor.trackComponent(componentName, 'render', duration);
  };

  const trackMount = (duration: number) => {
    performanceMonitor.trackComponent(componentName, 'mount', duration);
  };

  const trackUpdate = (duration: number) => {
    performanceMonitor.trackComponent(componentName, 'update', duration);
  };

  return { trackRender, trackMount, trackUpdate };
}

// Medical-specific performance utilities
export const MedicalPerformanceUtils = {
  // Track emergency action performance
  trackEmergencyAction: (action: string, startTime: number) => {
    const duration = Date.now() - startTime;
    performanceMonitor.trackMedicalAction(action, duration, 'emergency');
  },

  // Track routine medical action performance
  trackRoutineAction: (action: string, startTime: number) => {
    const duration = Date.now() - startTime;
    performanceMonitor.trackMedicalAction(action, duration, 'routine');
  },

  // Get medical performance report
  getMedicalPerformanceReport: () => {
    const summary = performanceMonitor.getPerformanceSummary();
    const components = performanceMonitor.getComponentPerformance();
    
    return {
      summary,
      components,
      recommendations: generatePerformanceRecommendations(summary, components),
    };
  },
};

// Generate performance recommendations
function generatePerformanceRecommendations(summary: any, components: ComponentPerformance[]) {
  const recommendations: string[] = [];

  if (summary?.averageMetrics?.largest_contentful_paint > 2500) {
    recommendations.push('Consider optimizing images and reducing bundle size for faster LCP');
  }

  if (summary?.averageMetrics?.first_input_delay > 100) {
    recommendations.push('Optimize JavaScript execution to improve FID');
  }

  const slowComponents = components.filter(c => c.renderTime > 16);
  if (slowComponents.length > 0) {
    recommendations.push(`Optimize slow components: ${slowComponents.map(c => c.componentName).join(', ')}`);
  }

  if (summary?.medicalContextMetrics?.emergency > 0) {
    recommendations.push('Review emergency context performance - consider preloading critical resources');
  }

  return recommendations;
}

export default performanceMonitor;
