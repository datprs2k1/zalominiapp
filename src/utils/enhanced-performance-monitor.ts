/**
 * Enhanced Performance Monitoring System
 * 
 * Comprehensive performance tracking, API response time monitoring,
 * and automated performance alerts for medical applications.
 * 
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 */

import { getAPIPerformanceMetrics, clearAPIPerformanceMetrics, getCacheStats } from '../services/cache';
import { checkAPIHealth } from '../services/api';

// Performance metrics interfaces
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'api' | 'render' | 'navigation' | 'resource' | 'custom';
  metadata?: Record<string, any>;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  metric: PerformanceMetric;
  threshold: number;
  timestamp: number;
}

interface PerformanceReport {
  summary: {
    totalMetrics: number;
    averageApiResponseTime: number;
    slowApiCalls: number;
    renderingIssues: number;
    memoryUsage: number;
    cacheHitRate: number;
  };
  alerts: PerformanceAlert[];
  recommendations: string[];
  trends: {
    apiResponseTimes: number[];
    renderTimes: number[];
    memoryUsage: number[];
  };
}

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  API_RESPONSE_SLOW: 1000, // ms
  API_RESPONSE_CRITICAL: 3000, // ms
  RENDER_TIME_SLOW: 16, // ms (60fps)
  RENDER_TIME_CRITICAL: 33, // ms (30fps)
  MEMORY_USAGE_WARNING: 50 * 1024 * 1024, // 50MB
  MEMORY_USAGE_CRITICAL: 100 * 1024 * 1024, // 100MB
  CACHE_HIT_RATE_LOW: 0.7, // 70%
};

class EnhancedPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;
  private maxMetrics = 1000;
  private reportingInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.initializeObservers();
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    try {
      // Navigation timing observer
      if ('PerformanceObserver' in window) {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.recordMetric({
                name: 'page_load_time',
                value: navEntry.loadEventEnd - navEntry.navigationStart,
                timestamp: Date.now(),
                category: 'navigation',
                metadata: {
                  domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.navigationStart,
                  firstPaint: navEntry.responseEnd - navEntry.navigationStart,
                },
              });
            }
          }
        });

        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);

        // Resource timing observer for API calls
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              
              // Track API calls
              if (resourceEntry.name.includes('/wp-json/') || resourceEntry.name.includes('/api/')) {
                this.recordMetric({
                  name: 'api_response_time',
                  value: resourceEntry.responseEnd - resourceEntry.requestStart,
                  timestamp: Date.now(),
                  category: 'api',
                  metadata: {
                    url: resourceEntry.name,
                    method: 'GET',
                    size: resourceEntry.transferSize,
                  },
                });
              }
            }
          }
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      }
    } catch (error) {
      console.warn('Failed to initialize performance observers:', error);
    }
  }

  /**
   * Start monitoring performance
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    
    // Start periodic reporting
    this.reportingInterval = setInterval(() => {
      this.generateReport();
    }, 60000); // Report every minute

    // Monitor memory usage
    this.startMemoryMonitoring();

    console.log('Enhanced performance monitoring started');
  }

  /**
   * Stop monitoring performance
   */
  stopMonitoring(): void {
    this.isMonitoring = false;

    if (this.reportingInterval) {
      clearInterval(this.reportingInterval);
      this.reportingInterval = null;
    }

    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    console.log('Enhanced performance monitoring stopped');
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Limit stored metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Check for performance issues
    this.checkThresholds(metric);
  }

  /**
   * Record API call performance
   */
  recordApiCall(url: string, duration: number, metadata?: Record<string, any>): void {
    this.recordMetric({
      name: 'api_call',
      value: duration,
      timestamp: Date.now(),
      category: 'api',
      metadata: {
        url,
        ...metadata,
      },
    });
  }

  /**
   * Record render performance
   */
  recordRenderTime(componentName: string, duration: number): void {
    this.recordMetric({
      name: 'component_render',
      value: duration,
      timestamp: Date.now(),
      category: 'render',
      metadata: {
        component: componentName,
      },
    });
  }

  /**
   * Check performance thresholds and create alerts
   */
  private checkThresholds(metric: PerformanceMetric): void {
    let alertType: 'warning' | 'error' | 'critical' | null = null;
    let threshold = 0;

    switch (metric.category) {
      case 'api':
        if (metric.value > PERFORMANCE_THRESHOLDS.API_RESPONSE_CRITICAL) {
          alertType = 'critical';
          threshold = PERFORMANCE_THRESHOLDS.API_RESPONSE_CRITICAL;
        } else if (metric.value > PERFORMANCE_THRESHOLDS.API_RESPONSE_SLOW) {
          alertType = 'warning';
          threshold = PERFORMANCE_THRESHOLDS.API_RESPONSE_SLOW;
        }
        break;

      case 'render':
        if (metric.value > PERFORMANCE_THRESHOLDS.RENDER_TIME_CRITICAL) {
          alertType = 'critical';
          threshold = PERFORMANCE_THRESHOLDS.RENDER_TIME_CRITICAL;
        } else if (metric.value > PERFORMANCE_THRESHOLDS.RENDER_TIME_SLOW) {
          alertType = 'warning';
          threshold = PERFORMANCE_THRESHOLDS.RENDER_TIME_SLOW;
        }
        break;
    }

    if (alertType) {
      this.createAlert(alertType, metric, threshold);
    }
  }

  /**
   * Create performance alert
   */
  private createAlert(type: 'warning' | 'error' | 'critical', metric: PerformanceMetric, threshold: number): void {
    const alert: PerformanceAlert = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message: this.generateAlertMessage(metric, threshold),
      metric,
      threshold,
      timestamp: Date.now(),
    };

    this.alerts.push(alert);

    // Limit stored alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Log critical alerts
    if (type === 'critical') {
      console.error('Performance Alert:', alert.message);
    } else if (type === 'warning') {
      console.warn('Performance Alert:', alert.message);
    }
  }

  /**
   * Generate alert message
   */
  private generateAlertMessage(metric: PerformanceMetric, threshold: number): string {
    switch (metric.category) {
      case 'api':
        return `Slow API call: ${metric.metadata?.url || 'Unknown'} took ${metric.value.toFixed(0)}ms (threshold: ${threshold}ms)`;
      case 'render':
        return `Slow render: ${metric.metadata?.component || 'Unknown component'} took ${metric.value.toFixed(2)}ms (threshold: ${threshold}ms)`;
      default:
        return `Performance issue: ${metric.name} = ${metric.value} (threshold: ${threshold})`;
    }
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        this.recordMetric({
          name: 'memory_usage',
          value: memory.usedJSHeapSize,
          timestamp: Date.now(),
          category: 'resource',
          metadata: {
            totalHeapSize: memory.totalJSHeapSize,
            heapSizeLimit: memory.jsHeapSizeLimit,
          },
        });
      }
    };

    setInterval(checkMemory, 30000);
    checkMemory();
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 300000); // Last 5 minutes

    const apiMetrics = recentMetrics.filter(m => m.category === 'api');
    const renderMetrics = recentMetrics.filter(m => m.category === 'render');
    const memoryMetrics = recentMetrics.filter(m => m.name === 'memory_usage');

    const cacheStats = getCacheStats();

    const report: PerformanceReport = {
      summary: {
        totalMetrics: recentMetrics.length,
        averageApiResponseTime: apiMetrics.length > 0 
          ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length 
          : 0,
        slowApiCalls: apiMetrics.filter(m => m.value > PERFORMANCE_THRESHOLDS.API_RESPONSE_SLOW).length,
        renderingIssues: renderMetrics.filter(m => m.value > PERFORMANCE_THRESHOLDS.RENDER_TIME_SLOW).length,
        memoryUsage: memoryMetrics.length > 0 ? memoryMetrics[memoryMetrics.length - 1].value : 0,
        cacheHitRate: cacheStats.hitRate,
      },
      alerts: this.alerts.filter(a => now - a.timestamp < 300000),
      recommendations: this.generateRecommendations(recentMetrics),
      trends: {
        apiResponseTimes: apiMetrics.slice(-10).map(m => m.value),
        renderTimes: renderMetrics.slice(-10).map(m => m.value),
        memoryUsage: memoryMetrics.slice(-10).map(m => m.value),
      },
    };

    return report;
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = [];
    
    const slowApiCalls = metrics.filter(m => 
      m.category === 'api' && m.value > PERFORMANCE_THRESHOLDS.API_RESPONSE_SLOW
    ).length;

    const slowRenders = metrics.filter(m => 
      m.category === 'render' && m.value > PERFORMANCE_THRESHOLDS.RENDER_TIME_SLOW
    ).length;

    if (slowApiCalls > 5) {
      recommendations.push('Consider implementing request batching or caching for API calls');
    }

    if (slowRenders > 3) {
      recommendations.push('Optimize component rendering with React.memo or useMemo');
    }

    const memoryMetrics = metrics.filter(m => m.name === 'memory_usage');
    if (memoryMetrics.length > 0 && memoryMetrics[memoryMetrics.length - 1].value > PERFORMANCE_THRESHOLDS.MEMORY_USAGE_WARNING) {
      recommendations.push('Monitor memory usage - consider cleanup for unused data');
    }

    return recommendations;
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  clear(): void {
    this.metrics = [];
    this.alerts = [];
  }
}

// Global enhanced performance monitor instance
export const enhancedPerformanceMonitor = new EnhancedPerformanceMonitor();

// Auto-start monitoring in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  enhancedPerformanceMonitor.startMonitoring();
}

// Export utilities
export const recordApiCall = (url: string, duration: number, metadata?: Record<string, any>) => {
  enhancedPerformanceMonitor.recordApiCall(url, duration, metadata);
};

export const recordRenderTime = (componentName: string, duration: number) => {
  enhancedPerformanceMonitor.recordRenderTime(componentName, duration);
};

export const getPerformanceReport = () => {
  return enhancedPerformanceMonitor.generateReport();
};

export default enhancedPerformanceMonitor;
