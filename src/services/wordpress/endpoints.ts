/**
 * WordPress API endpoint configurations
 */

import { WPEndpointConfig, WPQueryParams } from './types';
import { ValidationSchema } from '../core/query-builder';

// Common parameter schemas
const commonSchema: ValidationSchema = {
  context: { type: 'string', enum: ['view', 'embed', 'edit'] },
  page: { type: 'number', min: 1 },
  per_page: { type: 'number', min: 1, max: 100 },
  search: { type: 'string', min: 1 },
  after: { type: 'string' },
  before: { type: 'string' },
  exclude: { type: 'array' },
  include: { type: 'array' },
  offset: { type: 'number', min: 0 },
  order: { type: 'string', enum: ['asc', 'desc'] },
  slug: { type: 'string' },
  status: { type: 'string' },
  _embed: { type: 'string' },
};

const contentSchema: ValidationSchema = {
  ...commonSchema,
  author: { type: 'number', min: 1 },
  author_exclude: { type: 'array' },
  orderby: {
    type: 'string',
    enum: ['author', 'date', 'id', 'include', 'modified', 'parent', 'relevance', 'slug', 'title', 'menu_order'],
  },
};

// WordPress REST API endpoint configurations
export const WP_ENDPOINTS: Record<string, WPEndpointConfig> = {
  // Posts endpoints
  posts: {
    path: 'posts',
    methods: ['GET', 'POST'],
    cacheable: true,
    defaultParams: {
      _embed: 'wp:term,wp:featuredmedia',
      per_page: 10,
      status: 'publish',
    },
    paramSchema: {
      ...contentSchema,
      categories: { type: 'array' },
      categories_exclude: { type: 'array' },
      tags: { type: 'array' },
      tags_exclude: { type: 'array' },
      sticky: { type: 'boolean' },
      format: { type: 'string' },
    },
  },

  post: {
    path: 'posts/{id}',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    cacheable: true,
    defaultParams: {
      _embed: 'wp:term,wp:featuredmedia',
    },
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
      _embed: { type: 'string' },
    },
  },

  // Pages endpoints
  pages: {
    path: 'pages',
    methods: ['GET', 'POST'],
    cacheable: true,
    defaultParams: {
      _embed: 'wp:term,wp:featuredmedia',
      per_page: 10,
      status: 'publish',
    },
    paramSchema: {
      ...contentSchema,
      parent: { type: 'number', min: 0 },
      parent_exclude: { type: 'array' },
      menu_order: { type: 'number' },
    },
  },

  page: {
    path: 'pages/{id}',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    cacheable: true,
    defaultParams: {
      _embed: 'wp:term,wp:featuredmedia',
    },
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
      _embed: { type: 'string' },
    },
  },

  // Comments endpoints
  comments: {
    path: 'comments',
    methods: ['GET', 'POST'],
    cacheable: true,
    defaultParams: {
      per_page: 10,
    },
    paramSchema: {
      ...commonSchema,
      author_email: { type: 'string' },
      karma: { type: 'number' },
      parent: { type: 'number', min: 0 },
      parent_exclude: { type: 'array' },
      post: { type: 'number', min: 1 },
      type: { type: 'string' },
    },
  },

  comment: {
    path: 'comments/{id}',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
    },
  },

  // Taxonomies endpoints
  taxonomies: {
    path: 'taxonomies',
    methods: ['GET'],
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
      type: { type: 'string' },
    },
  },

  taxonomy: {
    path: 'taxonomies/{taxonomy}',
    methods: ['GET'],
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
    },
  },

  // Categories endpoints
  categories: {
    path: 'categories',
    methods: ['GET', 'POST'],
    cacheable: true,
    defaultParams: {
      per_page: 10,
    },
    paramSchema: {
      ...commonSchema,
      parent: { type: 'number', min: 0 },
      post: { type: 'number', min: 1 },
      hide_empty: { type: 'boolean' },
    },
  },

  category: {
    path: 'categories/{id}',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
    },
  },

  // Tags endpoints
  tags: {
    path: 'tags',
    methods: ['GET', 'POST'],
    cacheable: true,
    defaultParams: {
      per_page: 10,
    },
    paramSchema: {
      ...commonSchema,
      post: { type: 'number', min: 1 },
      hide_empty: { type: 'boolean' },
    },
  },

  tag: {
    path: 'tags/{id}',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
    },
  },

  // Users endpoints
  users: {
    path: 'users',
    methods: ['GET', 'POST'],
    requiresAuth: true,
    cacheable: true,
    defaultParams: {
      per_page: 10,
    },
    paramSchema: {
      ...commonSchema,
      roles: { type: 'array' },
      capabilities: { type: 'array' },
      who: { type: 'string', enum: ['authors'] },
    },
  },

  user: {
    path: 'users/{id}',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    requiresAuth: true,
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
    },
  },

  // Media endpoints
  media: {
    path: 'media',
    methods: ['GET', 'POST'],
    cacheable: true,
    defaultParams: {
      per_page: 10,
    },
    paramSchema: {
      ...contentSchema,
      media_type: { type: 'string', enum: ['image', 'video', 'text', 'application', 'audio'] },
      mime_type: { type: 'string' },
      parent: { type: 'number', min: 0 },
      parent_exclude: { type: 'array' },
    },
  },

  mediaItem: {
    path: 'media/{id}',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
    },
  },

  // Search endpoint
  search: {
    path: 'search',
    methods: ['GET'],
    cacheable: true,
    defaultParams: {
      per_page: 10,
      _embed: 'true',
    },
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed'] },
      page: { type: 'number', min: 1 },
      per_page: { type: 'number', min: 1, max: 100 },
      search: { type: 'string', required: true, min: 1 },
      type: { type: 'string', enum: ['post', 'page', 'attachment'] },
      subtype: { type: 'string' },
      _embed: { type: 'string' },
    },
  },

  // Types endpoints
  types: {
    path: 'types',
    methods: ['GET'],
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
    },
  },

  type: {
    path: 'types/{type}',
    methods: ['GET'],
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
    },
  },

  // Statuses endpoints
  statuses: {
    path: 'statuses',
    methods: ['GET'],
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
    },
  },

  status: {
    path: 'statuses/{status}',
    methods: ['GET'],
    cacheable: true,
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
    },
  },
};

// Custom post type endpoints (can be extended)
export const CUSTOM_ENDPOINTS: Record<string, WPEndpointConfig> = {
  // Doctor custom post type
  doctors: {
    path: 'info-bacsi',
    methods: ['GET'],
    cacheable: true,
    defaultParams: {
      _embed: 'wp:featuredmedia',
      per_page: 100,
    },
    paramSchema: {
      ...contentSchema,
    },
  },

  doctor: {
    path: 'info-bacsi/{id}',
    methods: ['GET'],
    cacheable: true,
    defaultParams: {
      _embed: 'wp:featuredmedia',
    },
    paramSchema: {
      context: { type: 'string', enum: ['view', 'embed', 'edit'] },
      _embed: { type: 'string' },
    },
  },
};

// Utility functions for endpoint management
export class EndpointManager {
  private static endpoints = { ...WP_ENDPOINTS, ...CUSTOM_ENDPOINTS };

  /**
   * Get endpoint configuration
   */
  static getEndpoint(name: string): WPEndpointConfig | undefined {
    return this.endpoints[name];
  }

  /**
   * Register custom endpoint
   */
  static registerEndpoint(name: string, config: WPEndpointConfig): void {
    this.endpoints[name] = config;
  }

  /**
   * Get all endpoint names
   */
  static getEndpointNames(): string[] {
    return Object.keys(this.endpoints);
  }

  /**
   * Build endpoint path with parameters
   */
  static buildPath(endpointName: string, pathParams: Record<string, string | number> = {}): string {
    const endpoint = this.getEndpoint(endpointName);
    if (!endpoint) {
      console.error(`Available endpoints:`, this.getEndpointNames());
      console.error(`Requested endpoint:`, endpointName);
      console.error(`Path params:`, pathParams);
      throw new Error(`Unknown endpoint: ${endpointName}. Available endpoints: ${this.getEndpointNames().join(', ')}`);
    }

    let path = endpoint.path;

    // Replace path parameters
    Object.entries(pathParams).forEach(([key, value]) => {
      path = path.replace(`{${key}}`, String(value));
    });

    // Check if all required path parameters were replaced
    const unreplacedParams = path.match(/\{[^}]+\}/g);
    if (unreplacedParams) {
      throw new Error(`Missing path parameters: ${unreplacedParams.join(', ')}`);
    }

    return path;
  }

  /**
   * Get default parameters for endpoint
   */
  static getDefaultParams(endpointName: string): WPQueryParams {
    const endpoint = this.getEndpoint(endpointName);
    return endpoint?.defaultParams || {};
  }

  /**
   * Get parameter schema for endpoint
   */
  static getParamSchema(endpointName: string): ValidationSchema {
    const endpoint = this.getEndpoint(endpointName);
    return endpoint?.paramSchema || {};
  }

  /**
   * Check if endpoint is cacheable
   */
  static isCacheable(endpointName: string): boolean {
    const endpoint = this.getEndpoint(endpointName);
    return endpoint?.cacheable || false;
  }

  /**
   * Check if endpoint requires authentication
   */
  static requiresAuth(endpointName: string): boolean {
    const endpoint = this.getEndpoint(endpointName);
    return endpoint?.requiresAuth || false;
  }
}
