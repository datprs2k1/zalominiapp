/**
 * API Performance Monitor
 *
 * This utility provides tools to monitor and optimize API performance
 * including request batching, performance tracking, and diagnostics.
 *
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-07-29
 */

import { getAPIPerformanceMetrics, clearAPIPerformanceMetrics, getCacheStats } from '../services/cache';
import { checkAPIHealth, enhancedRequest, setSlowRequestThreshold } from '../services/api';
import { API_URL } from '@/config';

// Default performance thresholds
const THRESHOLDS = {
  SLOW_REQUEST: 800, // ms - Threshold for slow request warnings (reduced from default 1000ms)
  CRITICAL_REQUEST: 2000, // ms - Threshold for critical request warnings
  CACHE_HIT_RATE_LOW: 0.6, // 60% - Threshold for low cache hit rate warnings
  MAX_PARALLEL_REQUESTS: 6, // Maximum number of parallel requests
};

/**
 * Interface for request batching
 */
interface BatchRequestItem<T = any> {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  url: string;
  config?: any;
  priority?: 'high' | 'medium' | 'low';
  resolve: (data: T) => void;
  reject: (error: any) => void;
}

/**
 * Interface for API performance metrics
 */
export interface APIPerformanceMetrics {
  totalRequests: number;
  averageResponseTime: number;
  slowRequests: number;
  criticalRequests: number;
  cacheHitRate: number;
  cachedRequestsCount: number;
  networkRequestsCount: number;
  largestResponses: Array<{
    url: string;
    size: number;
    time: number;
  }>;
  endpointPerformance: Record<
    string,
    {
      count: number;
      averageTime: number;
      totalSize: number;
    }
  >;
}

// Pending request batching system
class RequestBatcher {
  private batchQueue: BatchRequestItem[] = [];
  private isBatchProcessing = false;
  private batchDelay = 10; // ms
  private batchMaxSize = THRESHOLDS.MAX_PARALLEL_REQUESTS;

  add<T>(item: BatchRequestItem<T>): void {
    this.batchQueue.push(item as BatchRequestItem);
    this.processBatchIfNeeded();
  }

  private processBatchIfNeeded(): void {
    if (this.isBatchProcessing || this.batchQueue.length === 0) return;

    this.isBatchProcessing = true;
    setTimeout(() => this.processBatch(), this.batchDelay);
  }

  private processBatch(): void {
    // Process high priority requests first
    const highPriorityItems = this.batchQueue.filter((item) => item.priority === 'high');
    const mediumPriorityItems = this.batchQueue.filter((item) => !item.priority || item.priority === 'medium');
    const lowPriorityItems = this.batchQueue.filter((item) => item.priority === 'low');

    // Sort by priority
    const sortedItems = [...highPriorityItems, ...mediumPriorityItems, ...lowPriorityItems];

    // Process only a batch of requests
    const batch = sortedItems.slice(0, this.batchMaxSize);

    // Remove processed items from queue
    this.batchQueue = this.batchQueue.filter((item) => !batch.includes(item));

    // Process batch in parallel
    batch.forEach((item) => {
      enhancedRequest(item.method, item.url, item.config)
        .then(item.resolve)
        .catch(item.reject)
        .then(() => {
          // Check if we need to process more batches
          if (this.batchQueue.length > 0) {
            setTimeout(() => this.processBatch(), this.batchDelay);
          } else {
            this.isBatchProcessing = false;
          }
        })
        .catch((error) => {
          console.error('Error in batch processing:', error);
          // Continue processing the queue even if there was an error
          if (this.batchQueue.length > 0) {
            setTimeout(() => this.processBatch(), this.batchDelay);
          } else {
            this.isBatchProcessing = false;
          }
        });
    });
  }
}

// Request batcher singleton
const requestBatcher = new RequestBatcher();

/**
 * Optimized batch request function
 * Batches multiple requests together for better performance
 */
export function batchRequest<T = any>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  config?: any
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    requestBatcher.add({
      method,
      url,
      config,
      priority: config?.priority,
      resolve,
      reject,
    });
  });
}

/**
 * Get API performance metrics
 */
export function getAPIMetrics(): APIPerformanceMetrics {
  const { measures } = getAPIPerformanceMetrics();
  const cacheStats = getCacheStats();

  // Calculate metrics
  const totalRequests = measures.length;
  let totalTime = 0;
  let slowRequests = 0;
  let criticalRequests = 0;

  const endpointPerformance: Record<string, { count: number; totalTime: number; totalSize: number }> = {};
  const largestResponses: Array<{ url: string; size: number; time: number }> = [];

  // Process measures
  measures.forEach((measure) => {
    const duration = measure.duration;
    const url = measure.name.replace('api-request-', '');

    totalTime += duration;

    if (duration > THRESHOLDS.CRITICAL_REQUEST) {
      criticalRequests++;
    } else if (duration > THRESHOLDS.SLOW_REQUEST) {
      slowRequests++;
    }

    // Track endpoint performance
    const endpoint = extractEndpoint(url);
    if (!endpointPerformance[endpoint]) {
      endpointPerformance[endpoint] = {
        count: 0,
        totalTime: 0,
        totalSize: 0,
      };
    }

    endpointPerformance[endpoint].count++;
    endpointPerformance[endpoint].totalTime += duration;

    // Track largest responses
    const size = measure.name.includes('_size_') ? parseInt(measure.name.split('_size_')[1], 10) || 0 : 0;

    if (size > 0) {
      endpointPerformance[endpoint].totalSize += size;

      if (largestResponses.length < 5) {
        largestResponses.push({ url, size, time: duration });
        largestResponses.sort((a, b) => b.size - a.size);
      } else if (size > largestResponses[4].size) {
        largestResponses[4] = { url, size, time: duration };
        largestResponses.sort((a, b) => b.size - a.size);
      }
    }
  });

  // Calculate averages for endpoints
  const processedEndpointPerformance: APIPerformanceMetrics['endpointPerformance'] = {};

  Object.entries(endpointPerformance).forEach(([endpoint, data]) => {
    processedEndpointPerformance[endpoint] = {
      count: data.count,
      averageTime: data.count > 0 ? data.totalTime / data.count : 0,
      totalSize: data.totalSize,
    };
  });

  return {
    totalRequests,
    averageResponseTime: totalRequests > 0 ? totalTime / totalRequests : 0,
    slowRequests,
    criticalRequests,
    cacheHitRate: cacheStats.hitRate,
    cachedRequestsCount: Math.round(totalRequests * cacheStats.hitRate),
    networkRequestsCount: Math.round(totalRequests * (1 - cacheStats.hitRate)),
    largestResponses,
    endpointPerformance: processedEndpointPerformance,
  };
}

/**
 * Extract endpoint base path from URL
 */
function extractEndpoint(url: string): string {
  try {
    // Remove baseURL and query parameters
    let path = url.replace(API_URL, '');

    // Remove query parameters
    if (path.includes('?')) {
      path = path.split('?')[0];
    }

    // Get main path components
    const pathParts = path.split('/').filter(Boolean);

    // For WordPress API, try to get the main endpoint
    if (pathParts[0] === 'wp-json' && pathParts.length > 2) {
      return `/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}`;
    }

    // If it's a regular endpoint
    if (pathParts.length > 0) {
      return `/${pathParts[0]}`;
    }

    return '/';
  } catch (e) {
    return '/unknown';
  }
}

/**
 * Clear performance metrics
 */
export function clearAPIMetrics(): void {
  clearAPIPerformanceMetrics();
}

/**
 * Configure optimal API performance settings
 */
export function configureAPIPerformance(): void {
  // Set optimal thresholds
  setSlowRequestThreshold(THRESHOLDS.SLOW_REQUEST);

  // Periodically check API health (every 5 minutes in production)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    setInterval(
      () => {
        checkAPIHealth()
          .then((health) => {
            if (health.status !== 'healthy') {
              console.warn('API health check failed:', health);
              // Could add alert/notification here
            }
          })
          .catch(console.error);
      },
      5 * 60 * 1000
    );
  }
}

// Auto-configure API performance on module load
configureAPIPerformance();

/**
 * Report API performance issues
 */
export function reportAPIPerformanceIssues(): Array<string> {
  const metrics = getAPIMetrics();
  const issues: Array<string> = [];

  // Check for slow requests
  if (metrics.slowRequests > 3) {
    issues.push(`${metrics.slowRequests} slow API requests detected (>${THRESHOLDS.SLOW_REQUEST}ms)`);
  }

  // Check for critical requests
  if (metrics.criticalRequests > 0) {
    issues.push(`${metrics.criticalRequests} critical API requests detected (>${THRESHOLDS.CRITICAL_REQUEST}ms)`);
  }

  // Check cache hit rate
  if (metrics.cacheHitRate < THRESHOLDS.CACHE_HIT_RATE_LOW) {
    issues.push(`Low cache hit rate (${(metrics.cacheHitRate * 100).toFixed(1)}%)`);
  }

  // Check for slow endpoints
  Object.entries(metrics.endpointPerformance).forEach(([endpoint, data]) => {
    if (data.averageTime > THRESHOLDS.SLOW_REQUEST && data.count > 2) {
      issues.push(`Slow endpoint ${endpoint}: ${data.averageTime.toFixed(0)}ms avg (${data.count} calls)`);
    }
  });

  return issues;
}

/**
 * Optimize an API URL by adding performance-enhancing parameters
 */
export function optimizeApiUrl(url: string): string {
  if (!url.includes('/wp-json/wp/v2/')) return url;

  const hasParams = url.includes('?');
  let optimizedUrl = url;

  // Add _fields parameter if not present
  if (!url.includes('_fields=')) {
    optimizedUrl += hasParams ? '&' : '?';
    optimizedUrl += '_fields=id,title,content,excerpt,date,modified';
  }

  // Remove _embed if present and not needed explicitly
  if (url.includes('_embed=') && !url.includes('_embed=1') && !url.includes('_embed=true')) {
    optimizedUrl = optimizedUrl.replace(/_embed=[^&]*(&|$)/, '');
  }

  return optimizedUrl;
}

export default {
  getAPIMetrics,
  clearAPIMetrics,
  batchRequest,
  reportAPIPerformanceIssues,
  optimizeApiUrl,
};
