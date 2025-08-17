/**
 * WordPress API Service - Refactored with clean architecture
 *
 * This file now serves as the main export point for the WordPress API service,
 * using a clean, modular architecture with proper separation of concerns.
 *
 * All original function signatures are preserved for backward compatibility.
 */

// Re-export all atoms and services from the new state management layer
export * from './state/atoms';

// Re-export types for backward compatibility
export type {
  WPPost,
  WPPage,
  WPDoctor,
  WPSearchResult,
  WPQueryParams as QueryParams,
  WPRequestOptions as FetchOptions,
} from './wordpress/types';

// Re-export utility functions
export { PostsUtils } from './wordpress/posts';
export { PagesUtils } from './wordpress/pages';
export { DoctorsUtils } from './wordpress/doctors';
export { SearchUtils } from './wordpress/search';

// Re-export core services for advanced usage
export { createWordPressClient } from './wordpress/client';
export { createPostsService } from './wordpress/posts';
export { createServicesService, createDepartmentsService } from './wordpress/pages';
export { createDoctorsService } from './wordpress/doctors';
export { createSearchService } from './wordpress/search';

// Re-export cache utilities
export { createCache, type ICache } from './core/cache';
export { createHttpClient } from './core/http-client';
export { QueryBuilder, QueryUtils } from './core/query-builder';

/**
 * LEGACY COMPATIBILITY SECTION
 *
 * The following code maintains backward compatibility with the original API.
 * All functions now use the new modular architecture under the hood.
 */

// Note: These functions are now imported from './state/atoms' and use the new architecture
// They maintain the exact same API for backward compatibility

// Note: All atoms are now imported from './state/atoms' and use the new architecture
// They maintain the exact same API for backward compatibility

/**
 * MIGRATION NOTES:
 *
 * This file has been refactored to use a clean, modular architecture:
 *
 * 1. Core Infrastructure:
 *    - Enhanced caching with TTL and automatic cleanup
 *    - HTTP client with retry logic and request deduplication
 *    - Query builder with parameter validation
 *
 * 2. WordPress API Client:
 *    - Generic CRUD operations
 *    - Response normalization
 *    - Automatic _embed parameter handling
 *
 * 3. Specialized Services:
 *    - Posts service with advanced querying
 *    - Pages service for services and departments
 *    - Doctors service with specialty filtering
 *    - Search service with enhanced results
 *
 * 4. State Management:
 *    - All Jotai atoms organized in separate file
 *    - Cache invalidation utilities
 *    - Performance monitoring
 *
 * All original exports are preserved for backward compatibility.
 * New features and utilities are available through the exported services.
 */
