import api from './api';

export interface QueryParams {
  per_page?: number;
  type?: string;
  parent?: number | string;
  _embed?: string;
  search?: string;
  [key: string]: any;
}

export interface FetchOptions {
  cache?: boolean;
  cacheTime?: number;
  abortSignal?: AbortSignal;
}

// Simple in-memory cache implementation
type CacheEntry = {
  data: any;
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();

export const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Generic API fetch function with caching
export const fetchWPData = async <T>(
  endpoint: string,
  params: QueryParams = {},
  options: FetchOptions = { cache: true, cacheTime: DEFAULT_CACHE_TIME }
): Promise<T> => {
  try {
    // Build URL with query parameters
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');

    const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
    const cacheKey = url;

    // Check cache if enabled
    if (options.cache) {
      const cachedData = cache.get(cacheKey);
      const now = Date.now();

      if (cachedData && now - cachedData.timestamp < (options.cacheTime || DEFAULT_CACHE_TIME)) {
        return cachedData.data as T;
      }
    }

    // Make API request
    const response = await api.get<T>(url, {
      signal: options.abortSignal,
    });

    const data = response.data || (response as unknown as T);

    // Store in cache if enabled
    if (options.cache) {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request was aborted');
    }

    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Clear cache entry for specific endpoint
export const invalidateCache = (endpoint: string, params: QueryParams = {}) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
  cache.delete(url);
};

// Clear entire cache
export const clearCache = () => {
  cache.clear();
};
