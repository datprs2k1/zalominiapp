/**
 * Network-Aware Optimizations
 * 
 * Adaptive loading based on connection speed, offline support,
 * and background sync capabilities for medical applications.
 * 
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 */

import { QueryParams, FetchOptions } from '@/services/cache';

// Network connection types and their characteristics
interface NetworkInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown';
  downlink: number; // Mbps
  rtt: number; // ms
  saveData: boolean;
}

interface AdaptiveLoadingConfig {
  enableImageOptimization: boolean;
  enableDataCompression: boolean;
  enablePrefetching: boolean;
  maxConcurrentRequests: number;
  requestTimeout: number;
  enableOfflineMode: boolean;
}

// Network-specific configurations
const NETWORK_CONFIGS: Record<string, AdaptiveLoadingConfig> = {
  'slow-2g': {
    enableImageOptimization: true,
    enableDataCompression: true,
    enablePrefetching: false,
    maxConcurrentRequests: 2,
    requestTimeout: 10000,
    enableOfflineMode: true,
  },
  '2g': {
    enableImageOptimization: true,
    enableDataCompression: true,
    enablePrefetching: false,
    maxConcurrentRequests: 3,
    requestTimeout: 8000,
    enableOfflineMode: true,
  },
  '3g': {
    enableImageOptimization: true,
    enableDataCompression: false,
    enablePrefetching: true,
    maxConcurrentRequests: 4,
    requestTimeout: 6000,
    enableOfflineMode: false,
  },
  '4g': {
    enableImageOptimization: false,
    enableDataCompression: false,
    enablePrefetching: true,
    maxConcurrentRequests: 6,
    requestTimeout: 5000,
    enableOfflineMode: false,
  },
  'unknown': {
    enableImageOptimization: true,
    enableDataCompression: false,
    enablePrefetching: false,
    maxConcurrentRequests: 4,
    requestTimeout: 6000,
    enableOfflineMode: false,
  },
};

class NetworkAwareOptimizer {
  private networkInfo: NetworkInfo | null = null;
  private isOnline = navigator.onLine;
  private offlineQueue: Array<{ url: string; params: QueryParams; options: FetchOptions; resolve: Function; reject: Function }> = [];
  private backgroundSyncQueue: Array<{ action: string; data: any; timestamp: number }> = [];
  private currentConfig: AdaptiveLoadingConfig;

  constructor() {
    this.currentConfig = NETWORK_CONFIGS['unknown'];
    this.initializeNetworkDetection();
    this.initializeOfflineHandling();
    this.initializeBackgroundSync();
  }

  /**
   * Initialize network detection
   */
  private initializeNetworkDetection(): void {
    // Modern browsers with Network Information API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.updateNetworkInfo(connection);

      connection.addEventListener('change', () => {
        this.updateNetworkInfo(connection);
      });
    }

    // Fallback: estimate connection based on performance
    this.estimateConnectionSpeed();
  }

  /**
   * Update network information and configuration
   */
  private updateNetworkInfo(connection: any): void {
    this.networkInfo = {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false,
    };

    this.currentConfig = NETWORK_CONFIGS[this.networkInfo.effectiveType] || NETWORK_CONFIGS['unknown'];
    
    console.log('Network updated:', this.networkInfo, 'Config:', this.currentConfig);
  }

  /**
   * Estimate connection speed using performance timing
   */
  private estimateConnectionSpeed(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.navigationStart;
      const transferSize = navigation.transferSize || 1000000; // 1MB fallback
      
      // Estimate speed in Mbps
      const speedMbps = (transferSize * 8) / (loadTime * 1000);
      
      let effectiveType: NetworkInfo['effectiveType'] = 'unknown';
      if (speedMbps < 0.15) effectiveType = 'slow-2g';
      else if (speedMbps < 0.75) effectiveType = '2g';
      else if (speedMbps < 2) effectiveType = '3g';
      else effectiveType = '4g';

      this.networkInfo = {
        effectiveType,
        downlink: speedMbps,
        rtt: navigation.responseStart - navigation.requestStart,
        saveData: false,
      };

      this.currentConfig = NETWORK_CONFIGS[effectiveType];
    }
  }

  /**
   * Initialize offline handling
   */
  private initializeOfflineHandling(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processOfflineQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Initialize background sync
   */
  private initializeBackgroundSync(): void {
    // Register service worker for background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        // Background sync will be handled by service worker
        console.log('Background sync available');
      });
    }

    // Fallback: process background sync queue when online
    setInterval(() => {
      if (this.isOnline && this.backgroundSyncQueue.length > 0) {
        this.processBackgroundSyncQueue();
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Get adaptive request options based on network conditions
   */
  getAdaptiveRequestOptions(baseOptions: FetchOptions = {}): FetchOptions {
    const adaptiveOptions: FetchOptions = {
      ...baseOptions,
      retries: this.getAdaptiveRetries(),
      retryDelay: this.getAdaptiveRetryDelay(),
    };

    // Adjust timeout based on network
    if (this.networkInfo) {
      adaptiveOptions.retryDelay = Math.max(1000, this.networkInfo.rtt * 2);
    }

    return adaptiveOptions;
  }

  /**
   * Get adaptive retry count based on network
   */
  private getAdaptiveRetries(): number {
    if (!this.networkInfo) return 3;

    switch (this.networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 5; // More retries for slow connections
      case '3g':
        return 3;
      case '4g':
        return 2;
      default:
        return 3;
    }
  }

  /**
   * Get adaptive retry delay based on network
   */
  private getAdaptiveRetryDelay(): number {
    if (!this.networkInfo) return 1000;

    const baseDelay = Math.max(1000, this.networkInfo.rtt * 2);
    
    switch (this.networkInfo.effectiveType) {
      case 'slow-2g':
        return baseDelay * 3;
      case '2g':
        return baseDelay * 2;
      case '3g':
        return baseDelay * 1.5;
      case '4g':
        return baseDelay;
      default:
        return baseDelay;
    }
  }

  /**
   * Optimize query parameters based on network
   */
  optimizeQueryParams(params: QueryParams): QueryParams {
    const optimizedParams = { ...params };

    if (this.currentConfig.enableDataCompression) {
      // Reduce data size for slow connections
      if (!optimizedParams._fields) {
        optimizedParams._fields = 'id,title,excerpt,date'; // Minimal fields
      }
      
      // Reduce per_page for slow connections
      if (optimizedParams.per_page && optimizedParams.per_page > 10) {
        optimizedParams.per_page = Math.min(optimizedParams.per_page, 5);
      }
    }

    // Remove _embed for slow connections to reduce payload
    if (this.networkInfo?.effectiveType === 'slow-2g' || this.networkInfo?.effectiveType === '2g') {
      delete optimizedParams._embed;
    }

    return optimizedParams;
  }

  /**
   * Check if prefetching should be enabled
   */
  shouldPrefetch(): boolean {
    return this.currentConfig.enablePrefetching && this.isOnline;
  }

  /**
   * Get maximum concurrent requests based on network
   */
  getMaxConcurrentRequests(): number {
    return this.currentConfig.maxConcurrentRequests;
  }

  /**
   * Add request to offline queue
   */
  addToOfflineQueue(url: string, params: QueryParams, options: FetchOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      this.offlineQueue.push({ url, params, options, resolve, reject });
    });
  }

  /**
   * Process offline queue when back online
   */
  private async processOfflineQueue(): Promise<void> {
    console.log(`Processing ${this.offlineQueue.length} offline requests`);

    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const item of queue) {
      try {
        // Re-attempt the request
        const { fetchWPData } = await import('@/services/cache');
        const result = await fetchWPData(item.url, item.params, item.options);
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
    }
  }

  /**
   * Add action to background sync queue
   */
  addToBackgroundSync(action: string, data: any): void {
    this.backgroundSyncQueue.push({
      action,
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Process background sync queue
   */
  private async processBackgroundSyncQueue(): Promise<void> {
    const queue = [...this.backgroundSyncQueue];
    this.backgroundSyncQueue = [];

    for (const item of queue) {
      try {
        // Process background sync item
        await this.processBackgroundSyncItem(item);
      } catch (error) {
        console.error('Background sync failed:', error);
        // Re-add to queue if not too old (24 hours)
        if (Date.now() - item.timestamp < 24 * 60 * 60 * 1000) {
          this.backgroundSyncQueue.push(item);
        }
      }
    }
  }

  /**
   * Process individual background sync item
   */
  private async processBackgroundSyncItem(item: { action: string; data: any; timestamp: number }): Promise<void> {
    switch (item.action) {
      case 'cache_invalidation':
        // Invalidate cache entries
        const { invalidateCache } = await import('@/services/cache');
        invalidateCache(item.data.endpoint, item.data.params);
        break;
      
      case 'prefetch_content':
        // Prefetch content
        const { preloadCache } = await import('@/services/cache');
        await preloadCache(item.data.endpoint, item.data.params);
        break;
      
      default:
        console.warn('Unknown background sync action:', item.action);
    }
  }

  /**
   * Get current network status
   */
  getNetworkStatus() {
    return {
      isOnline: this.isOnline,
      networkInfo: this.networkInfo,
      config: this.currentConfig,
      offlineQueueSize: this.offlineQueue.length,
      backgroundSyncQueueSize: this.backgroundSyncQueue.length,
    };
  }

  /**
   * Check if data saver mode is enabled
   */
  isDataSaverEnabled(): boolean {
    return this.networkInfo?.saveData || false;
  }

  /**
   * Get optimized image quality based on network
   */
  getOptimizedImageQuality(): number {
    if (!this.networkInfo) return 80;

    switch (this.networkInfo.effectiveType) {
      case 'slow-2g':
        return 40;
      case '2g':
        return 60;
      case '3g':
        return 80;
      case '4g':
        return 90;
      default:
        return 80;
    }
  }
}

// Global network-aware optimizer instance
export const networkOptimizer = new NetworkAwareOptimizer();

// Export utilities
export const getAdaptiveRequestOptions = (baseOptions?: FetchOptions) => {
  return networkOptimizer.getAdaptiveRequestOptions(baseOptions);
};

export const optimizeQueryParams = (params: QueryParams) => {
  return networkOptimizer.optimizeQueryParams(params);
};

export const shouldPrefetch = () => {
  return networkOptimizer.shouldPrefetch();
};

export const getNetworkStatus = () => {
  return networkOptimizer.getNetworkStatus();
};

export const addToBackgroundSync = (action: string, data: any) => {
  networkOptimizer.addToBackgroundSync(action, data);
};

export default networkOptimizer;
