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
 *
 * EXPORT STRATEGY:
 * - Primary exports: Enhanced functions from posts.ts (fetchPost, fetchPosts)
 * - Aliased exports: Generic functions from common.ts (fetchPostGeneric, fetchPostsGeneric)
 * - This resolves TypeScript export ambiguity while maintaining backward compatibility
 */

// Enhanced service modules with medical-specific features - Primary exports
export * from './posts';
export * from './services';
export * from './departments';
export * from './doctors';
export * from './search';

// Core utilities and common functions - Explicit exports to avoid conflicts
export {
  // WordPress API endpoints
  WP_ENDPOINTS,
  DEFAULT_EMBED,
  DOCTOR_EMBED,

  // Generic fetch functions (aliased to avoid conflicts with posts.ts)
  fetchPages,
  fetchPage,
  fetchDoctors,
  fetchDoctor,
  fetchSearchResults,
  fetchPosts as fetchPostsGeneric,
  fetchPost as fetchPostGeneric,

  // Parameter builders
  buildPostsParams,
  buildPagesParams,
  buildDoctorsParams,
  buildSearchParams,

  // Atom factories
  createListAtomFamily,
  createItemAtomFamily,
  createSimpleAtom,

  // Utility functions
  extractFeaturedImageUrl,
  extractCategories,
  extractPlainText,
  truncateText,
  formatMedicalDate,
  isValidWPContent,

  // Content filters
  filterMedicalContent,
  sortByMedicalPriority,
} from './common';

// WordPress types
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
