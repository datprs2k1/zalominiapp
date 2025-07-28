/**
 * Medical Data Processing Utilities
 * Optimized utilities for processing medical service data with enhanced performance
 *
 * @version 2.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 */

import type { MedicalServicePriceItem } from '@/types/medical';

// Local type definition to avoid conflicts
interface MedicalCategoryInterface {
  readonly id: number;
  readonly name: string;
  readonly priority?: number;
  readonly itemCount?: number;
}

/**
 * Pre-compiled regex patterns for better performance
 */
const COMPILED_PATTERNS = {
  headerPattern: /^([A-Z]\/|[0-9]+\/|[IVX]+\/|[A-Z][0-9.]+\/|[A-Z][0-9]+\/|[0-9]+\.[0-9]+\/)$/,
  pricePattern: /\d+/g,
  whitespacePattern: /\s+/g,
} as const;

/**
 * HTML parsing configuration for medical data
 */
interface HTMLParsingConfig {
  readonly minCells: number;
  readonly headerPattern: RegExp;
  readonly pricePattern: RegExp;
  readonly emergencyKeywords: readonly string[];
}

/**
 * Default configuration for medical HTML parsing
 */
const DEFAULT_PARSING_CONFIG: HTMLParsingConfig = {
  minCells: 4,
  headerPattern: COMPILED_PATTERNS.headerPattern,
  pricePattern: COMPILED_PATTERNS.pricePattern,
  emergencyKeywords: ['cấp cứu', 'khẩn cấp', 'emergency', 'urgent'] as const,
} as const;

/**
 * Memoized DOMParser instance for better performance
 */
let domParserInstance: DOMParser | null = null;
const getDOMParser = (): DOMParser => {
  if (!domParserInstance) {
    domParserInstance = new DOMParser();
  }
  return domParserInstance;
};

/**
 * Cache for parsed HTML content to avoid re-parsing
 */
const htmlParseCache = new Map<string, CacheEntry>();
const CACHE_MAX_SIZE = 100; // Increased cache size
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes - longer TTL for better performance

/**
 * Cache entry interface
 */
interface CacheEntry {
  data: MedicalServicePriceItem[];
  timestamp: number;
}

/**
 * Clean expired cache entries with LRU eviction
 */
const cleanExpiredCache = (): void => {
  const now = Date.now();
  const entriesToDelete: string[] = [];

  for (const [key, entry] of htmlParseCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      entriesToDelete.push(key);
    }
  }

  // Batch delete expired entries
  entriesToDelete.forEach((key) => htmlParseCache.delete(key));

  // If still over limit, remove oldest entries
  if (htmlParseCache.size > CACHE_MAX_SIZE) {
    const entries = Array.from(htmlParseCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = entries.slice(0, htmlParseCache.size - CACHE_MAX_SIZE);
    toRemove.forEach(([key]) => htmlParseCache.delete(key));
  }
};

/**
 * Optimized HTML table parser for medical service data
 * Uses memoization, caching, and performance optimizations
 *
 * @param htmlContent - Raw HTML content containing service price table
 * @param categoryId - Category ID for the services
 * @param categoryName - Category name for the services
 * @param config - Optional parsing configuration
 * @returns Array of parsed medical service price items
 *
 * @performance
 * - Uses cached DOMParser instance
 * - Implements result caching with TTL
 * - Pre-allocates arrays for better memory usage
 * - Uses efficient DOM traversal methods
 */
export const parseExaminationDataOptimized = (
  htmlContent: string,
  categoryId: number,
  categoryName: string,
  config: Partial<HTMLParsingConfig> = {}
): MedicalServicePriceItem[] => {
  // Input validation
  if (!htmlContent?.trim()) {
    return [];
  }

  // Create cache key
  const cacheKey = `${categoryId}-${htmlContent.length}-${htmlContent.slice(0, 100)}`;

  // Check cache first
  const cachedEntry = htmlParseCache.get(cacheKey);
  if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL) {
    return cachedEntry.data;
  }

  // Clean expired cache entries periodically
  if (htmlParseCache.size > CACHE_MAX_SIZE) {
    cleanExpiredCache();
  }

  // Merge configuration
  const parseConfig = { ...DEFAULT_PARSING_CONFIG, ...config };

  try {
    // Use cached DOM parser
    const parser = getDOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Use more efficient query selector - try multiple selectors for robustness
    let rows = doc.querySelectorAll('table tbody tr');
    if (rows.length === 0) {
      rows = doc.querySelectorAll('table tr');
      if (rows.length === 0) {
        return [];
      }
    }

    // Pre-allocate array with estimated size
    const items: MedicalServicePriceItem[] = new Array(rows.length);
    let validItemCount = 0;

    // Pre-compile emergency keywords for faster lookup
    const emergencyKeywordsLower = parseConfig.emergencyKeywords.map((k) => k.toLowerCase());

    // Process rows efficiently with optimized text extraction
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.children; // Use children instead of querySelectorAll for better performance

      if (cells.length < parseConfig.minCells) continue;

      // Extract text content efficiently with null checks
      const idText = cells[0].textContent?.trim() || '';
      if (parseConfig.headerPattern.test(idText)) continue;

      const name = cells[1].textContent?.trim() || '';
      const description = cells[2].textContent?.trim() || '';
      const priceText = cells[3].textContent?.trim() || '0';

      // Skip empty rows early
      if (!name && !description) continue;

      // Parse ID and price efficiently
      const id = parseInt(idText, 10) || validItemCount + 1;
      const priceMatches = priceText.match(parseConfig.pricePattern);
      const price = priceMatches ? parseInt(priceMatches.join(''), 10) : 0;

      // Optimized emergency check with pre-compiled lowercase keywords
      const nameLower = name.toLowerCase();
      const descLower = description.toLowerCase();
      const isEmergency = emergencyKeywordsLower.some(
        (keyword) => nameLower.includes(keyword) || descLower.includes(keyword)
      );

      // Create optimized item object
      items[validItemCount++] = {
        id,
        name,
        description,
        price,
        categoryId,
        categoryName,
        isEmergency,
        priority: isEmergency ? 1 : 2,
      };
    }

    // Trim array to actual size
    items.length = validItemCount;

    // Cache the result
    htmlParseCache.set(cacheKey, {
      data: items,
      timestamp: Date.now(),
    });

    return items;
  } catch (error) {
    console.error('Error parsing medical service data:', error);
    return [];
  }
};

/**
 * Optimized price formatter with memoization
 */
const priceFormatterCache = new Map<number, string>();
const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

/**
 * Format price with caching for better performance
 *
 * @param price - Price value to format
 * @returns Formatted price string in Vietnamese currency format
 */
export const formatPriceOptimized = (price: number): string => {
  if (priceFormatterCache.has(price)) {
    return priceFormatterCache.get(price)!;
  }

  const formatted = priceFormatter.format(price);

  // Cache common prices (limit cache size)
  if (priceFormatterCache.size < 1000) {
    priceFormatterCache.set(price, formatted);
  }

  return formatted;
};

/**
 * Vietnamese text normalization for better search accuracy
 */
const normalizeVietnameseText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
};

/**
 * Advanced search function with Vietnamese text support and fuzzy matching
 *
 * @param items - Array of medical service items to search
 * @param searchTerm - Search term (supports Vietnamese with diacritics)
 * @param options - Search configuration options
 * @returns Filtered and scored array of matching items
 */
export const searchMedicalServicesOptimized = (
  items: MedicalServicePriceItem[],
  searchTerm: string,
  options: {
    fuzzyMatch?: boolean;
    prioritizeEmergency?: boolean;
    minScore?: number;
  } = {}
): MedicalServicePriceItem[] => {
  if (!searchTerm?.trim()) {
    return items;
  }

  const { fuzzyMatch = true, prioritizeEmergency = true, minScore = 0.3 } = options;

  const normalizedSearch = normalizeVietnameseText(searchTerm);
  const searchWords = normalizedSearch.split(/\s+/).filter((word) => word.length > 0);

  if (searchWords.length === 0) {
    return items;
  }

  // Create scored results
  const scoredResults = items
    .map((item) => {
      const normalizedName = normalizeVietnameseText(item.name);
      const normalizedDescription = normalizeVietnameseText(item.description);
      const normalizedCategory = normalizeVietnameseText(item.categoryName);

      let score = 0;
      let matchCount = 0;

      // Calculate match score for each search word
      for (const word of searchWords) {
        let wordScore = 0;

        // Exact matches get highest score
        if (normalizedName.includes(word)) {
          wordScore += normalizedName.startsWith(word) ? 1.0 : 0.8;
        }
        if (normalizedDescription.includes(word)) {
          wordScore += 0.6;
        }
        if (normalizedCategory.includes(word)) {
          wordScore += 0.4;
        }

        // Fuzzy matching for partial matches
        if (fuzzyMatch && wordScore === 0) {
          const fuzzyScore =
            calculateFuzzyScore(word, normalizedName) * 0.5 +
            calculateFuzzyScore(word, normalizedDescription) * 0.3 +
            calculateFuzzyScore(word, normalizedCategory) * 0.2;
          wordScore = Math.max(wordScore, fuzzyScore);
        }

        if (wordScore > 0) {
          matchCount++;
          score += wordScore;
        }
      }

      // Require all words to have some match (AND logic)
      if (matchCount < searchWords.length) {
        score = 0;
      } else {
        // Normalize score by number of search words
        score = score / searchWords.length;

        // Boost emergency services if prioritized
        if (prioritizeEmergency && item.isEmergency) {
          score *= 1.2;
        }
      }

      return { item, score };
    })
    .filter((result) => result.score >= minScore)
    .sort((a, b) => {
      // Sort by score (descending), then by emergency status, then by name
      if (Math.abs(a.score - b.score) > 0.01) {
        return b.score - a.score;
      }
      if (a.item.isEmergency !== b.item.isEmergency) {
        return a.item.isEmergency ? -1 : 1;
      }
      return a.item.name.localeCompare(b.item.name, 'vi');
    });

  return scoredResults.map((result) => result.item);
};

/**
 * Calculate fuzzy match score between two strings
 */
const calculateFuzzyScore = (search: string, target: string): number => {
  if (search.length === 0) return 0;
  if (target.length === 0) return 0;
  if (search === target) return 1;

  let matches = 0;
  let searchIndex = 0;

  for (let i = 0; i < target.length && searchIndex < search.length; i++) {
    if (target[i] === search[searchIndex]) {
      matches++;
      searchIndex++;
    }
  }

  return matches / search.length;
};

/**
 * Extract unique categories with optimized performance
 *
 * @param items - Array of medical service items
 * @returns Array of unique categories with item counts
 */
export const extractCategoriesOptimized = (items: MedicalServicePriceItem[]): MedicalCategoryInterface[] => {
  const categoryMap = new Map<number, MedicalCategoryInterface>();

  for (const item of items) {
    const existing = categoryMap.get(item.categoryId);
    if (existing) {
      categoryMap.set(item.categoryId, {
        id: existing.id,
        name: existing.name,
        priority: existing.priority,
        itemCount: (existing.itemCount || 0) + 1,
      } as MedicalCategoryInterface);
    } else {
      categoryMap.set(item.categoryId, {
        id: item.categoryId,
        name: item.categoryName,
        priority: item.isEmergency ? 1 : 2,
        itemCount: 1,
      } as MedicalCategoryInterface);
    }
  }

  // Convert to array and sort by priority then name
  return Array.from(categoryMap.values()).sort((a, b) => {
    if (a.priority !== b.priority) {
      return (a.priority || 2) - (b.priority || 2);
    }
    return a.name.localeCompare(b.name, 'vi');
  });
};

/**
 * Clear all caches (useful for memory management)
 */
export const clearMedicalDataCaches = (): void => {
  htmlParseCache.clear();
  priceFormatterCache.clear();
};

/**
 * Get cache statistics for monitoring
 */
export const getMedicalDataCacheStats = () => ({
  htmlCacheSize: htmlParseCache.size,
  priceCacheSize: priceFormatterCache.size,
  htmlCacheMaxSize: CACHE_MAX_SIZE,
  cacheTTL: CACHE_TTL,
});
