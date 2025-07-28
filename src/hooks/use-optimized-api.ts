/**
 * Optimized API Hooks for Enhanced Performance
 * 
 * This module provides React hooks with built-in caching, error handling,
 * retry logic, and performance optimizations specifically designed for
 * medical applications.
 * 
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchWPData, QueryParams, FetchOptions, MedicalContentType } from '@/services/cache';
import { WPPost, WPPage } from '@/services/wp-types';

// Hook configuration interface
interface UseOptimizedAPIConfig extends FetchOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: number | boolean;
  retryDelay?: number | ((attempt: number) => number);
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  suspense?: boolean;
  keepPreviousData?: boolean;
}

// Hook return type
interface UseOptimizedAPIResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isStale: boolean;
  isFetching: boolean;
  refetch: () => Promise<void>;
  invalidate: () => void;
  prefetch: () => Promise<void>;
}

// Network status detection
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', handleConnectionChange);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
}

/**
 * Main optimized API hook with advanced caching and performance features
 */
export function useOptimizedAPI<T = any>(
  endpoint: string,
  params: QueryParams = {},
  config: UseOptimizedAPIConfig = {}
): UseOptimizedAPIResult<T> {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    refetchOnReconnect = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    retry = 3,
    retryDelay = (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 30000),
    onSuccess,
    onError,
    keepPreviousData = false,
    ...fetchOptions
  } = config;

  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const { isOnline, connectionType } = useNetworkStatus();

  // Memoize the cache key
  const cacheKey = useMemo(() => {
    return `${endpoint}?${new URLSearchParams(params as any).toString()}`;
  }, [endpoint, params]);

  // Determine if data is stale
  const isDataStale = useCallback(() => {
    return Date.now() - lastFetchTime > staleTime;
  }, [lastFetchTime, staleTime]);

  // Adaptive retry delay based on connection type
  const getRetryDelay = useCallback((attempt: number) => {
    const baseDelay = typeof retryDelay === 'function' ? retryDelay(attempt) : retryDelay;
    
    // Increase delay for slower connections
    const multiplier = connectionType === 'slow-2g' ? 3 : 
                      connectionType === '2g' ? 2 : 
                      connectionType === '3g' ? 1.5 : 1;
    
    return baseDelay * multiplier;
  }, [retryDelay, connectionType]);

  // Main fetch function with error handling and retries
  const fetchData = useCallback(async (options: { isRefetch?: boolean } = {}) => {
    if (!enabled || !isOnline) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    if (!options.isRefetch) {
      setIsLoading(true);
    }
    setIsFetching(true);
    setIsError(false);
    setError(null);

    try {
      const result = await fetchWPData<T>(
        endpoint,
        params,
        {
          ...fetchOptions,
          abortSignal: abortControllerRef.current.signal,
        }
      );

      setData(prevData => keepPreviousData && prevData ? prevData : result);
      setLastFetchTime(Date.now());
      setIsStale(false);
      retryCountRef.current = 0;
      
      onSuccess?.(result);
    } catch (err) {
      const error = err as Error;
      
      // Don't set error state for aborted requests
      if (error.name === 'AbortError') return;

      const maxRetries = typeof retry === 'boolean' ? (retry ? 3 : 0) : retry;
      
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const delay = getRetryDelay(retryCountRef.current);
        
        setTimeout(() => {
          fetchData(options);
        }, delay);
        return;
      }

      setIsError(true);
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [enabled, isOnline, endpoint, params, fetchOptions, keepPreviousData, onSuccess, onError, retry, getRetryDelay]);

  // Refetch function
  const refetch = useCallback(async () => {
    await fetchData({ isRefetch: true });
  }, [fetchData]);

  // Invalidate function
  const invalidate = useCallback(() => {
    setIsStale(true);
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  // Prefetch function
  const prefetch = useCallback(async () => {
    if (!data || isDataStale()) {
      await fetchData();
    }
  }, [data, isDataStale, fetchData]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, cacheKey]);

  // Refetch on reconnect
  useEffect(() => {
    if (refetchOnReconnect && isOnline && data && isDataStale()) {
      fetchData({ isRefetch: true });
    }
  }, [isOnline, refetchOnReconnect, data, isDataStale, fetchData]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (data && isDataStale()) {
        fetchData({ isRefetch: true });
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, data, isDataStale, fetchData]);

  // Update stale status
  useEffect(() => {
    if (!data) return;

    const interval = setInterval(() => {
      setIsStale(isDataStale());
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [data, isDataStale]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    isLoading,
    isError,
    error,
    isStale,
    isFetching,
    refetch,
    invalidate,
    prefetch,
  };
}

/**
 * Specialized hook for posts with enhanced features
 */
export function useOptimizedPosts(
  params: QueryParams = {},
  config: UseOptimizedAPIConfig = {}
) {
  return useOptimizedAPI<WPPost[]>('/wp-json/wp/v2/posts', params, {
    staleTime: 10 * 60 * 1000, // 10 minutes for posts
    ...config,
  });
}

/**
 * Specialized hook for pages with enhanced features
 */
export function useOptimizedPages(
  params: QueryParams = {},
  config: UseOptimizedAPIConfig = {}
) {
  return useOptimizedAPI<WPPage[]>('/wp-json/wp/v2/pages', params, {
    staleTime: 15 * 60 * 1000, // 15 minutes for pages
    ...config,
  });
}

/**
 * Hook for infinite scroll/pagination with optimized loading
 */
export function useInfiniteAPI<T = any>(
  endpoint: string,
  baseParams: QueryParams = {},
  config: UseOptimizedAPIConfig = {}
) {
  const [pages, setPages] = useState<T[][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const params = useMemo(() => ({
    ...baseParams,
    page: currentPage,
    per_page: baseParams.per_page || 10,
  }), [baseParams, currentPage]);

  const { data, isLoading, isError, error, refetch } = useOptimizedAPI<T[]>(
    endpoint,
    params,
    config
  );

  // Update pages when new data arrives
  useEffect(() => {
    if (data) {
      setPages(prevPages => {
        const newPages = [...prevPages];
        newPages[currentPage - 1] = data;
        return newPages;
      });

      // Check if there are more pages
      const itemsPerPage = baseParams.per_page || 10;
      setHasNextPage(data.length === itemsPerPage);
    }
  }, [data, currentPage, baseParams.per_page]);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    setCurrentPage(prev => prev + 1);
    setIsLoadingMore(false);
  }, [hasNextPage, isLoadingMore]);

  const reset = useCallback(() => {
    setPages([]);
    setCurrentPage(1);
    setHasNextPage(true);
  }, []);

  const allData = useMemo(() => pages.flat(), [pages]);

  return {
    data: allData,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasNextPage,
    loadMore,
    reset,
    refetch,
  };
}
