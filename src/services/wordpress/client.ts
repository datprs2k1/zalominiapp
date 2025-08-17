/**
 * WordPress REST API client with caching, normalization, and advanced features
 */

import { HttpClient, createHttpClient } from '../core/http-client';
import { ICache, createCache } from '../core/cache';
import { QueryBuilder, ValidationResult } from '../core/query-builder';
import { EndpointManager } from './endpoints';
import {
  WPClientConfig,
  WPRequestOptions,
  WPQueryParams,
  WPAPIResponse,
  WPCollectionResponse,
  WPContentType,
  NormalizedWPContent,
  WPPost,
  WPPage,
  WPDoctor,
  WPSearchResult,
  WPTransformFunction,
  WPCollectionTransformFunction,
} from './types';

/**
 * WordPress REST API Client
 */
export class WordPressClient {
  private httpClient: HttpClient;
  private cache: ICache;
  private config: Required<WPClientConfig>;

  constructor(config: WPClientConfig) {
    this.config = {
      apiPath: 'wp-json/wp/v2',
      timeout: 10000,
      retryAttempts: 3,
      cacheEnabled: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      defaultParams: {},
      auth: {},
      ...config,
    };

    // Initialize HTTP client
    this.httpClient = createHttpClient({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      retry: {
        attempts: this.config.retryAttempts,
      },
    });

    // Initialize cache
    this.cache = createCache({
      ttl: this.config.cacheTTL,
    });

    this.setupInterceptors();
  }

  /**
   * Generic GET request
   */
  async get<T = any>(endpoint: string, params: WPQueryParams = {}, options: WPRequestOptions = {}): Promise<T> {
    const mergedParams = { ...this.config.defaultParams, ...params };
    const validation = this.validateParams(endpoint, mergedParams);

    if (!validation.isValid) {
      throw new Error(`Invalid parameters: ${Object.values(validation.errors).join(', ')}`);
    }

    const url = this.buildUrl(endpoint, validation.sanitized);
    const cacheKey = `GET:${url}`;

    // Check cache if enabled
    if (options.cache !== false && this.config.cacheEnabled) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const response = await this.httpClient.get<T>(url, {
        timeout: options.timeout,
        retry: options.retryAttempts ? { attempts: options.retryAttempts } : undefined,
        signal: options.abortSignal,
      });

      const data = response.data;

      // Cache the response if enabled
      if (options.cache !== false && this.config.cacheEnabled && EndpointManager.isCacheable(endpoint)) {
        const ttl = options.cacheTTL || this.config.cacheTTL;
        this.cache.set(cacheKey, data, ttl);
      }

      return data;
    } catch (error) {
      console.error(`WordPress API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get single item by ID
   */
  async getById<T extends WPContentType>(
    endpoint: string,
    id: number,
    params: WPQueryParams = {},
    options: WPRequestOptions = {}
  ): Promise<T> {
    const mergedParams = { ...this.config.defaultParams, ...params };
    const validation = this.validateParams(endpoint, mergedParams);

    if (!validation.isValid) {
      throw new Error(`Invalid parameters: ${Object.values(validation.errors).join(', ')}`);
    }

    // Build the path with ID parameter
    const path = EndpointManager.buildPath(endpoint, { id });
    const url = QueryBuilder.buildUrl({
      baseUrl: '',
      endpoint: `${this.config.apiPath}/${path}`,
      params: QueryBuilder.sanitizeParams(validation.sanitized),
    });

    const cacheKey = `GET:${url}`;

    // Check cache if enabled
    if (options.cache !== false && this.config.cacheEnabled) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const response = await this.httpClient.get<T>(url, {
        timeout: options.timeout,
        retry: options.retryAttempts ? { attempts: options.retryAttempts } : undefined,
        signal: options.abortSignal,
      });

      const data = response.data;

      // Cache the response if enabled
      if (options.cache !== false && this.config.cacheEnabled && EndpointManager.isCacheable(endpoint)) {
        const ttl = options.cacheTTL || this.config.cacheTTL;
        this.cache.set(cacheKey, data, ttl);
      }

      return data;
    } catch (error) {
      console.error(`WordPress API Error for ${endpoint}/${id}:`, error);
      throw error;
    }
  }

  /**
   * Get collection with pagination support
   */
  async getCollection<T extends WPContentType>(
    endpoint: string,
    params: WPQueryParams = {},
    options: WPRequestOptions = {}
  ): Promise<WPCollectionResponse<T>> {
    const response = await this.httpClient.get<T[]>(
      this.buildUrl(endpoint, { ...this.config.defaultParams, ...params }),
      {
        timeout: options.timeout,
        retry: options.retryAttempts ? { attempts: options.retryAttempts } : undefined,
        signal: options.abortSignal,
      }
    );

    const items = response.data;
    const headers = response.headers;

    const total = parseInt(headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(headers['x-wp-totalpages'] || '1', 10);
    const currentPage = params.page || 1;

    return {
      items,
      total,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }

  /**
   * Search content
   */
  async search(query: string, params: WPQueryParams = {}, options: WPRequestOptions = {}): Promise<WPSearchResult[]> {
    return this.get<WPSearchResult[]>('search', { search: query, ...params }, options);
  }

  /**
   * Normalize WordPress content (extract rendered fields, etc.)
   */
  normalize<T extends WPContentType>(content: T, options: { includeMeta?: boolean } = {}): NormalizedWPContent {
    const normalized: NormalizedWPContent = {
      id: content.id,
      title: 'title' in content && content.title ? content.title.rendered : '',
      content: 'content' in content && content.content ? content.content.rendered : '',
      excerpt: 'excerpt' in content && content.excerpt ? content.excerpt.rendered : undefined,
      date: content.date,
      slug: content.slug,
      link: content.link,
      status: content.status,
      type: content.type,
    };

    // Add author if present
    if ('author' in content) {
      normalized.author = content.author;
    }

    // Extract featured media
    if (content._embedded?.['wp:featuredmedia']?.[0]) {
      const media = content._embedded['wp:featuredmedia'][0];
      normalized.featuredMedia = {
        id: media.id,
        url: media.source_url,
        alt: media.alt_text,
        caption: media.caption?.rendered,
      };
    }

    // Extract terms (categories, tags, etc.)
    if (content._embedded?.['wp:term']) {
      normalized.terms = {};
      content._embedded['wp:term'].forEach((termGroup) => {
        if (termGroup.length > 0) {
          const taxonomy = termGroup[0].taxonomy;
          normalized.terms![taxonomy] = termGroup;
        }
      });
    }

    // Include meta if requested
    if (options.includeMeta && 'meta' in content) {
      normalized.meta = content.meta;
    }

    return normalized;
  }

  /**
   * Transform response data
   */
  transform<T, R>(data: T, transformer: WPTransformFunction<T, R>): R {
    return transformer(data);
  }

  /**
   * Transform collection response data
   */
  transformCollection<T extends WPContentType, R>(
    response: WPCollectionResponse<T>,
    transformer: WPCollectionTransformFunction<T, R>
  ): R {
    return transformer(response.items, {
      total: response.total,
      pages: response.totalPages,
    });
  }

  /**
   * Invalidate cache for specific endpoint
   */
  invalidateCache(endpoint: string, params: WPQueryParams = {}): void {
    try {
      const url = this.buildUrl(endpoint, params);
      const cacheKey = `GET:${url}`;
      this.cache.delete(cacheKey);
    } catch (error) {
      // If we can't build the URL (e.g., unknown endpoint), just clear all cache
      console.warn(`Could not invalidate cache for endpoint ${endpoint}:`, error);
      this.cache.clear();
    }
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * Get HTTP client statistics
   */
  getHttpStats() {
    return this.httpClient.getStats();
  }

  private buildUrl(endpoint: string, params: WPQueryParams): string {
    let path: string;

    // Check if endpoint is already a built path (contains slashes but is not a known endpoint name)
    if (endpoint.includes('/') && !EndpointManager.getEndpoint(endpoint)) {
      // Already a built path, use as-is
      path = endpoint;
    } else {
      // Handle path parameters if endpoint contains them
      const pathParams: Record<string, string | number> = {};
      const queryParams = { ...params };

      // Extract path parameters (like {id})
      const pathParamMatches = endpoint.match(/\{([^}]+)\}/g);
      if (pathParamMatches) {
        pathParamMatches.forEach((match) => {
          const paramName = match.slice(1, -1); // Remove { and }
          if (queryParams[paramName] !== undefined) {
            pathParams[paramName] = queryParams[paramName] as string | number;
            delete queryParams[paramName];
          }
        });
      }

      path = EndpointManager.buildPath(endpoint, pathParams);
    }

    return QueryBuilder.buildUrl({
      baseUrl: '',
      endpoint: `${this.config.apiPath}/${path}`,
      params: QueryBuilder.sanitizeParams(params),
    });
  }

  private validateParams(endpoint: string, params: WPQueryParams): ValidationResult {
    const schema = EndpointManager.getParamSchema(endpoint);
    return QueryBuilder.validateParams(params, schema);
  }

  private setupInterceptors(): void {
    // Add authentication if configured
    if (this.config.auth.token) {
      this.httpClient.addRequestInterceptor({
        onFulfilled: (config) => {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${this.config.auth.token}`,
          };
          return config;
        },
      });
    } else if (this.config.auth.username && this.config.auth.password) {
      this.httpClient.addRequestInterceptor({
        onFulfilled: (config) => {
          const credentials = btoa(`${this.config.auth.username}:${this.config.auth.password}`);
          config.headers = {
            ...config.headers,
            Authorization: `Basic ${credentials}`,
          };
          return config;
        },
      });
    }

    // Add response data extraction (similar to original api.ts)
    this.httpClient.addResponseInterceptor({
      onFulfilled: (response) => {
        // Extract data from response, preserving headers for pagination
        return {
          ...response,
          data: response.data,
        };
      },
    });
  }
}

/**
 * Create WordPress client instance
 */
export function createWordPressClient(config: WPClientConfig): WordPressClient {
  return new WordPressClient(config);
}
