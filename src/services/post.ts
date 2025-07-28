/**
 * Medical Services API - Main Export Module
 *
 * This module provides a unified interface for all medical-related WordPress API services.
 * All services have been optimized with enhanced type safety, caching, error handling,
 * and medical-specific features.
 *
 * @version 2.0.0
 * @author Medical Development Team
 * @since 2024-07-22
 */

// Enhanced service modules with medical-specific features
export * from './posts';
export * from './services';
export * from './departments';
export * from './doctors';
export * from './search';

// Core utilities and common functions
export * from './common';
export * from './wp-types';

// Cache management and API utilities
export {
  invalidateCache,
  clearCache,
  getCacheStats,
  invalidateCachePattern,
  preloadCache,
  destroyCache,
  MedicalAPIError,
  DEFAULT_CACHE_TIME,
  MAX_CACHE_SIZE,
  MAX_CACHE_ENTRIES,
} from './cache';

// API client and health monitoring
export { default as api, checkAPIHealth, getAPILogs, clearAPILogs, apiLogger, MedicalAPILogger } from './api';

/**
 * Service version and metadata
 */
export const SERVICE_VERSION = '2.0.0';
export const SERVICE_BUILD_DATE = '2024-07-22';
export const SERVICE_FEATURES = [
  'Enhanced Type Safety',
  'LRU Caching with Size Limits',
  'Medical Error Handling',
  'Vietnamese Localization',
  'Performance Optimization',
  'Comprehensive Logging',
  'Medical Content Filtering',
  'Priority-based Sorting',
  'Retry Logic with Backoff',
  'Health Monitoring',
] as const;

/**
 * Quick health check for all services
 */
export const checkServicesHealth = async () => {
  const { checkAPIHealth } = await import('./api');
  const { getCacheStats } = await import('./cache');

  try {
    const [apiHealth, cacheStats] = await Promise.all([
      checkAPIHealth().catch((error) => ({ status: 'unhealthy' as const, error: error.message })),
      Promise.resolve(getCacheStats()).catch((error) => ({ error: error.message })),
    ]);

    return {
      timestamp: new Date().toISOString(),
      version: SERVICE_VERSION,
      api: apiHealth,
      cache: cacheStats,
      features: SERVICE_FEATURES,
    };
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      version: SERVICE_VERSION,
      api: { status: 'unhealthy' as const, error: 'Health check failed' },
      cache: { error: 'Cache stats unavailable' },
      features: SERVICE_FEATURES,
    };
  }
};
