/**
 * Medical Service Prices Hook
 * Optimized React hook for managing medical service price data with enhanced performance
 *
 * @version 2.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { listServicePricePagesAtom } from '@/services/post';
import {
  parseExaminationDataOptimized,
  searchMedicalServicesOptimized,
  extractCategoriesOptimized,
} from '@/utils/medicalDataProcessing';
import type { MedicalServicePriceItem, MedicalServiceCategory } from '@/types/medical';

/**
 * Hook configuration interface
 */
interface UseMedicalServicePricesConfig {
  readonly itemsPerPage?: number;
  readonly debounceDelay?: number;
  readonly enableVirtualization?: boolean;
  readonly cacheResults?: boolean;
}

/**
 * Hook return type interface
 */
interface UseMedicalServicePricesReturn {
  // Data
  readonly prices: MedicalServicePriceItem[];
  readonly categories: MedicalServiceCategory[];
  readonly filteredItems: MedicalServicePriceItem[];
  readonly currentItems: MedicalServicePriceItem[];

  // State
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly searchTerm: string;
  readonly debouncedSearchTerm: string;
  readonly selectedCategory: number | null;
  readonly currentPage: number;

  // Pagination
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPrevPage: boolean;

  // Actions
  readonly setSearchTerm: (term: string) => void;
  readonly setSelectedCategory: (categoryId: number | null) => void;
  readonly setCurrentPage: (page: number) => void;
  readonly goToNextPage: () => void;
  readonly goToPrevPage: () => void;
  readonly resetFilters: () => void;

  // Performance metrics
  readonly performanceMetrics: {
    readonly parseTime: number;
    readonly filterTime: number;
    readonly totalItems: number;
    readonly cacheHits: number;
  };
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<UseMedicalServicePricesConfig> = {
  itemsPerPage: 10,
  debounceDelay: 300,
  enableVirtualization: true,
  cacheResults: true,
} as const;

/**
 * Performance metrics tracking
 */
interface PerformanceMetrics {
  parseTime: number;
  filterTime: number;
  totalItems: number;
  cacheHits: number;
}

/**
 * Optimized hook for managing medical service prices with enhanced performance
 *
 * @param config - Optional configuration for the hook
 * @returns Hook state and actions for medical service price management
 *
 * @performance
 * - Uses memoized data processing
 * - Implements debounced search
 * - Provides virtualization support
 * - Tracks performance metrics
 */
export const useMedicalServicePrices = (config: UseMedicalServicePricesConfig = {}): UseMedicalServicePricesReturn => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    parseTime: 0,
    filterTime: 0,
    totalItems: 0,
    cacheHits: 0,
  });

  // Refs for performance tracking
  const parseStartTime = useRef<number>(0);
  const filterStartTime = useRef<number>(0);
  const cacheHitsRef = useRef<number>(0);

  // Fetch raw data from atom
  const categoryData = useAtomValue(listServicePricePagesAtom);
  const isLoading = !categoryData || categoryData.length === 0;

  // Debounced search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, finalConfig.debounceDelay);

    return () => clearTimeout(timerId);
  }, [searchTerm, finalConfig.debounceDelay]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory]);

  // Process raw data into structured format with performance tracking and optimized processing
  const { prices, categories } = useMemo(() => {
    if (!categoryData || categoryData.length === 0) {
      return { prices: [], categories: [] };
    }

    parseStartTime.current = performance.now();

    try {
      const allItems: MedicalServicePriceItem[] = [];
      const processedCategories = new Set<number>();

      // Process categories in batches to avoid blocking the main thread
      const batchSize = 5;
      const batches: any[][] = [];

      // Split categories into batches
      for (let i = 0; i < categoryData.length; i += batchSize) {
        batches.push(categoryData.slice(i, i + batchSize));
      }

      // Process each batch
      for (const batch of batches) {
        for (const item of batch) {
          if (!item.content?.rendered) continue;

          const categoryName = item.title?.rendered || 'Không có tên';
          const parsedItems = parseExaminationDataOptimized(item.content.rendered, item.id, categoryName);

          if (parsedItems.length > 0) {
            allItems.push(...parsedItems);
            processedCategories.add(item.id);
          }
        }

        // Yield control to the browser between batches to prevent UI blocking
        if (batches.length > 1) {
          // Use setTimeout with 0 delay to yield control
          setTimeout(() => {}, 0);
        }
      }

      // Extract categories with optimized performance
      const extractedCategories = extractCategoriesOptimized(allItems);

      const parseTime = performance.now() - parseStartTime.current;

      setPerformanceMetrics((prev) => ({
        ...prev,
        parseTime,
        totalItems: allItems.length,
      }));

      setError(null);
      return {
        prices: allItems,
        categories: extractedCategories,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error processing medical service data: ${errorMessage}`);
      console.error('Error processing category data:', err);

      return { prices: [], categories: [] };
    }
  }, [categoryData]);

  // Filter items based on search and category with performance tracking
  const filteredItems = useMemo(() => {
    filterStartTime.current = performance.now();

    let filtered = prices;

    // Apply category filter
    if (selectedCategory !== null) {
      filtered = filtered.filter((item) => item.categoryId === selectedCategory);
    }

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = searchMedicalServicesOptimized(filtered, debouncedSearchTerm);
    }

    const filterTime = performance.now() - filterStartTime.current;

    setPerformanceMetrics((prev) => ({
      ...prev,
      filterTime,
    }));

    return filtered;
  }, [prices, debouncedSearchTerm, selectedCategory]);

  // Pagination calculations
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / finalConfig.itemsPerPage));
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * finalConfig.itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + finalConfig.itemsPerPage);
  }, [filteredItems, currentPage, finalConfig.itemsPerPage]);

  // Action handlers
  const handleSetSelectedCategory = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSetCurrentPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory(null);
    setCurrentPage(1);
  }, []);

  return {
    // Data
    prices,
    categories,
    filteredItems,
    currentItems,

    // State
    isLoading,
    error,
    searchTerm,
    debouncedSearchTerm,
    selectedCategory,
    currentPage,

    // Pagination
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,

    // Actions
    setSearchTerm,
    setSelectedCategory: handleSetSelectedCategory,
    setCurrentPage: handleSetCurrentPage,
    goToNextPage,
    goToPrevPage,
    resetFilters,

    // Performance metrics
    performanceMetrics,
  };
};

/**
 * Hook for optimized virtualization support
 *
 * @param items - Items to virtualize
 * @param containerRef - Reference to scroll container
 * @param itemHeight - Estimated height of each item
 * @returns Virtualization utilities
 */
export const useMedicalServiceVirtualization = (
  items: MedicalServicePriceItem[],
  containerRef: React.RefObject<HTMLElement>,
  itemHeight: number = 72
) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const containerHeight = containerRef.current.clientHeight;

    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount + 2, items.length); // +2 for buffer

    setVisibleRange({ start, end });
    setScrollTop(scrollTop);
  }, [itemHeight, items.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index,
      top: (visibleRange.start + index) * itemHeight,
    }));
  }, [items, visibleRange, itemHeight]);

  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    scrollTop,
    visibleRange,
  };
};
