import api from './api';
import { WPAPIError } from './wp-types';

/**
 * WordPress API query parameters interface
 * Provides type safety for common WordPress REST API parameters
 */
export interface QueryParams {
  readonly per_page?: number;
  readonly type?: string;
  readonly parent?: number | string;
  readonly _embed?: string;
  readonly _fields?: string;
  readonly search?: string;
  readonly page?: number;
  readonly include?: string;
  readonly exclude?: string;
  readonly order?: 'asc' | 'desc';
  readonly orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'modified' | 'menu_order';
  readonly status?: 'publish' | 'draft' | 'private' | 'pending' | 'future';
  readonly categories?: string;
  readonly tags?: string;
  readonly author?: number;
  readonly before?: string;
  readonly after?: string;
  readonly slug?: string;
  readonly [key: string]: unknown;
}

/**
 * Fetch options for API requests with caching configuration
 */
export interface FetchOptions {
  readonly cache?: boolean;
  readonly cacheTime?: number;
  readonly abortSignal?: AbortSignal;
  readonly retries?: number;
  readonly retryDelay?: number;
}

/**
 * Medical content types for cache optimization
 */
export type MedicalContentType =
  | 'emergency' // Emergency departments, critical info (30s TTL)
  | 'departments' // Hospital departments (5 min TTL)
  | 'doctors' // Doctor profiles (10 min TTL)
  | 'services' // Medical services (15 min TTL)
  | 'posts' // Medical articles/posts (30 min TTL)
  | 'search' // Search results (2 min TTL)
  | 'general'; // General content (5 min TTL)

/**
 * Cache entry structure with enhanced metadata
 */
interface CacheEntry<T = unknown> {
  readonly data: T;
  readonly timestamp: number;
  readonly size: number;
  readonly accessCount: number;
  readonly lastAccessed: number;
  readonly contentType: MedicalContentType;
  readonly priority: number; // 1-5, where 1 is highest priority
  readonly compressed: boolean;
  readonly tags: readonly string[]; // For selective invalidation
  readonly checksum?: string; // For corruption detection
}

/**
 * Enhanced cache statistics with medical-specific metrics
 */
export interface CacheStats {
  readonly totalEntries: number;
  readonly totalSize: number;
  readonly hitRate: number;
  readonly oldestEntry: number;
  readonly newestEntry: number;
  readonly compressionRatio: number;
  readonly averageResponseTime: number;
  readonly contentTypeStats: Record<
    MedicalContentType,
    {
      readonly entries: number;
      readonly hitRate: number;
      readonly averageSize: number;
      readonly totalAccesses: number;
    }
  >;
  readonly priorityDistribution: Record<number, number>;
  readonly memoryEfficiency: number; // Percentage of useful vs total memory
}

/**
 * Cache performance metrics
 */
interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  compressions: number;
  decompressions: number;
  corruptionDetections: number;
  responseTimeSum: number;
  responseTimeCount: number;
  contentTypeMetrics: Map<
    MedicalContentType,
    {
      hits: number;
      misses: number;
      totalSize: number;
      accessCount: number;
    }
  >;
}

// Enhanced cache configuration constants
export const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
export const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB (increased for medical data)
export const MAX_CACHE_ENTRIES = 2000; // Increased for medical content
export const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes (more frequent)
export const COMPRESSION_THRESHOLD = 1024; // Compress entries larger than 1KB
export const MAX_COMPRESSION_RATIO = 0.8; // Don't compress if ratio > 80%

/**
 * Medical content type specific TTL configurations
 */
export const MEDICAL_CACHE_TTL: Record<MedicalContentType, number> = {
  emergency: 30 * 1000, // 30 seconds - Critical emergency info
  departments: 10 * 60 * 1000, // 10 minutes - Department info changes rarely (increased from 5min)
  doctors: 15 * 60 * 1000, // 15 minutes - Doctor profiles semi-static (increased from 10min)
  services: 120 * 60 * 1000, // 120 minutes - Service prices are relatively stable (increased from 60min)
  posts: 60 * 60 * 1000, // 60 minutes - Articles don't change often (increased from 30min)
  search: 5 * 60 * 1000, // 5 minutes - Search results can be dynamic (increased from 2min)
  general: 15 * 60 * 1000, // 15 minutes - Default for other content (increased from 5min)
};

/**
 * Priority levels for medical content
 */
export const MEDICAL_PRIORITY: Record<MedicalContentType, number> = {
  emergency: 1, // Highest priority - never evict unless expired
  departments: 2, // High priority - hospital structure info
  doctors: 2, // High priority - staff information
  services: 3, // Medium priority - service information
  posts: 4, // Lower priority - educational content
  search: 5, // Lowest priority - can be regenerated
  general: 3, // Medium priority - default
};

/**
 * Compression utilities for cache optimization
 */
class CompressionUtils {
  /**
   * Simple compression using JSON stringification with optimization
   */
  static compress(data: unknown): { compressed: string; ratio: number } {
    const original = JSON.stringify(data);
    const originalSize = original.length;

    // Simple compression: remove extra whitespace and common patterns
    const compressed = original
      .replace(/\s+/g, ' ')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/:\s*/g, ':')
      .trim();

    const compressedSize = compressed.length;
    const ratio = compressedSize / originalSize;

    return { compressed, ratio };
  }

  /**
   * Decompress data
   */
  static decompress(compressed: string): unknown {
    return JSON.parse(compressed);
  }

  /**
   * Calculate checksum for corruption detection
   */
  static calculateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
}

/**
 * Circuit breaker for cache operations
 */
class CacheCircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  private readonly failureThreshold = 5;
  private readonly recoveryTimeout = 30000; // 30 seconds

  canExecute(): boolean {
    const now = Date.now();

    if (this.state === 'open') {
      if (now - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'half-open';
        return true;
      }
      return false;
    }

    return true;
  }

  onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  getState(): string {
    return this.state;
  }
}

/**
 * Enhanced medical cache implementation with advanced features
 */
class EnhancedMedicalCache {
  private cache = new Map<string, CacheEntry>();
  private totalSize = 0;
  private metrics: CacheMetrics;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private circuitBreaker = new CacheCircuitBreaker();
  private warmupInProgress = false;

  constructor() {
    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      compressions: 0,
      decompressions: 0,
      corruptionDetections: 0,
      responseTimeSum: 0,
      responseTimeCount: 0,
      contentTypeMetrics: new Map(),
    };

    this.initializeContentTypeMetrics();
    this.startCleanupTimer();
    this.startWarmupProcess();
  }

  /**
   * Initialize content type metrics
   */
  private initializeContentTypeMetrics(): void {
    const contentTypes: MedicalContentType[] = [
      'emergency',
      'departments',
      'doctors',
      'services',
      'posts',
      'search',
      'general',
    ];

    contentTypes.forEach((type) => {
      this.metrics.contentTypeMetrics.set(type, {
        hits: 0,
        misses: 0,
        totalSize: 0,
        accessCount: 0,
      });
    });
  }

  /**
   * Enhanced get method with medical-specific optimizations
   */
  get<T>(key: string, contentType: MedicalContentType = 'general'): T | null {
    const startTime = Date.now();

    if (!this.circuitBreaker.canExecute()) {
      this.updateContentTypeMetrics(contentType, 'miss');
      return null;
    }

    try {
      const entry = this.cache.get(key) as CacheEntry<T> | undefined;

      if (!entry) {
        this.metrics.misses++;
        this.updateContentTypeMetrics(contentType, 'miss');
        this.circuitBreaker.onSuccess();
        return null;
      }

      const now = Date.now();
      const maxAge = MEDICAL_CACHE_TTL[contentType] || DEFAULT_CACHE_TIME;

      // Check if entry is expired
      if (now - entry.timestamp > maxAge) {
        this.delete(key);
        this.metrics.misses++;
        this.updateContentTypeMetrics(contentType, 'miss');
        this.circuitBreaker.onSuccess();
        return null;
      }

      // Verify data integrity if checksum exists
      if (entry.checksum && entry.compressed) {
        const currentChecksum = CompressionUtils.calculateChecksum(entry.data as string);
        if (currentChecksum !== entry.checksum) {
          this.metrics.corruptionDetections++;
          this.delete(key);
          this.metrics.misses++;
          this.updateContentTypeMetrics(contentType, 'miss');
          return null;
        }
      }

      // Decompress data if needed
      let data = entry.data;
      if (entry.compressed) {
        try {
          data = CompressionUtils.decompress(entry.data as string) as T;
          this.metrics.decompressions++;
        } catch (error) {
          this.metrics.corruptionDetections++;
          this.delete(key);
          this.metrics.misses++;
          this.updateContentTypeMetrics(contentType, 'miss');
          return null;
        }
      }

      // Update access metadata
      const updatedEntry: CacheEntry<T> = {
        ...entry,
        accessCount: entry.accessCount + 1,
        lastAccessed: now,
      };

      this.cache.set(key, updatedEntry);
      this.metrics.hits++;
      this.updateContentTypeMetrics(contentType, 'hit');
      this.updateResponseTime(Date.now() - startTime);
      this.circuitBreaker.onSuccess();

      return data;
    } catch (error) {
      this.circuitBreaker.onFailure();
      this.metrics.misses++;
      this.updateContentTypeMetrics(contentType, 'miss');
      return null;
    }
  }

  /**
   * Enhanced set method with compression and medical-specific features
   */
  set<T>(key: string, data: T, contentType: MedicalContentType = 'general', tags: string[] = []): void {
    if (!this.circuitBreaker.canExecute()) {
      return;
    }

    try {
      const now = Date.now();
      let processedData: T | string = data;
      let compressed = false;
      let checksum: string | undefined;

      // Determine if compression should be applied
      const originalSize = this.estimateSize(data);
      if (originalSize > COMPRESSION_THRESHOLD) {
        const compressionResult = CompressionUtils.compress(data);

        if (compressionResult.ratio < MAX_COMPRESSION_RATIO) {
          processedData = compressionResult.compressed;
          compressed = true;
          checksum = CompressionUtils.calculateChecksum(compressionResult.compressed);
          this.metrics.compressions++;
        }
      }

      const finalSize = this.estimateSize(processedData);

      // Remove existing entry if present
      if (this.cache.has(key)) {
        this.delete(key);
      }

      // Check if we need to evict entries (priority-based)
      this.evictIfNeeded(finalSize, contentType);

      const entry: CacheEntry<T | string> = {
        data: processedData,
        timestamp: now,
        size: finalSize,
        accessCount: 1,
        lastAccessed: now,
        contentType,
        priority: MEDICAL_PRIORITY[contentType],
        compressed,
        tags,
        checksum,
      };

      this.cache.set(key, entry);
      this.totalSize += finalSize;

      // Update content type metrics
      const typeMetrics = this.metrics.contentTypeMetrics.get(contentType);
      if (typeMetrics) {
        typeMetrics.totalSize += finalSize;
        this.metrics.contentTypeMetrics.set(contentType, typeMetrics);
      }

      this.circuitBreaker.onSuccess();
    } catch (error) {
      this.circuitBreaker.onFailure();
    }
  }

  /**
   * Delete specific cache entry with metrics update
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.totalSize -= entry.size;

      // Update content type metrics
      const typeMetrics = this.metrics.contentTypeMetrics.get(entry.contentType);
      if (typeMetrics) {
        typeMetrics.totalSize -= entry.size;
        this.metrics.contentTypeMetrics.set(entry.contentType, typeMetrics);
      }

      return this.cache.delete(key);
    }
    return false;
  }

  /**
   * Clear all cache entries and reset metrics
   */
  clear(): void {
    this.cache.clear();
    this.totalSize = 0;
    this.metrics.hits = 0;
    this.metrics.misses = 0;
    this.metrics.evictions = 0;
    this.metrics.compressions = 0;
    this.metrics.decompressions = 0;
    this.metrics.corruptionDetections = 0;
    this.metrics.responseTimeSum = 0;
    this.metrics.responseTimeCount = 0;
    this.initializeContentTypeMetrics();
  }

  /**
   * Get enhanced cache statistics with medical-specific metrics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map((e) => e.timestamp);
    const totalHits = this.metrics.hits;
    const totalMisses = this.metrics.misses;
    const totalRequests = totalHits + totalMisses;

    // Calculate compression ratio
    const compressedEntries = entries.filter((e) => e.compressed);
    const totalCompressedSize = compressedEntries.reduce((sum, e) => sum + e.size, 0);
    const totalUncompressedSize = entries.reduce((sum, e) => sum + e.size, 0);
    const compressionRatio = totalUncompressedSize > 0 ? totalCompressedSize / totalUncompressedSize : 1;

    // Calculate content type statistics
    const contentTypeStats: Record<MedicalContentType, any> = {} as any;
    this.metrics.contentTypeMetrics.forEach((metrics, contentType) => {
      const typeEntries = entries.filter((e) => e.contentType === contentType);
      const typeHits = metrics.hits;
      const typeMisses = metrics.misses;
      const typeRequests = typeHits + typeMisses;

      contentTypeStats[contentType] = {
        entries: typeEntries.length,
        hitRate: typeRequests > 0 ? typeHits / typeRequests : 0,
        averageSize: typeEntries.length > 0 ? metrics.totalSize / typeEntries.length : 0,
        totalAccesses: metrics.accessCount,
      };
    });

    // Calculate priority distribution
    const priorityDistribution: Record<number, number> = {};
    entries.forEach((entry) => {
      priorityDistribution[entry.priority] = (priorityDistribution[entry.priority] || 0) + 1;
    });

    // Calculate memory efficiency
    const usefulMemory = entries.reduce((sum, e) => {
      const age = Date.now() - e.lastAccessed;
      const maxAge = MEDICAL_CACHE_TTL[e.contentType] || DEFAULT_CACHE_TIME;
      return age < maxAge ? sum + e.size : sum;
    }, 0);
    const memoryEfficiency = this.totalSize > 0 ? (usefulMemory / this.totalSize) * 100 : 100;

    return {
      totalEntries: this.cache.size,
      totalSize: this.totalSize,
      hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : 0,
      compressionRatio,
      averageResponseTime:
        this.metrics.responseTimeCount > 0 ? this.metrics.responseTimeSum / this.metrics.responseTimeCount : 0,
      contentTypeStats,
      priorityDistribution,
      memoryEfficiency,
    };
  }

  /**
   * Enhanced size estimation with better accuracy
   */
  private estimateSize(data: unknown): number {
    try {
      if (typeof data === 'string') {
        return data.length * 2; // UTF-16 encoding
      }

      const jsonString = JSON.stringify(data);
      return jsonString.length * 2; // UTF-16 encoding
    } catch {
      // Fallback for non-serializable data
      return 1024; // 1KB default
    }
  }

  /**
   * Priority-based eviction with medical content awareness
   */
  private evictIfNeeded(newEntrySize: number, contentType: MedicalContentType): void {
    const newPriority = MEDICAL_PRIORITY[contentType];

    // Check size limit
    while (this.totalSize + newEntrySize > MAX_CACHE_SIZE && this.cache.size > 0) {
      this.evictByPriority(newPriority);
    }

    // Check entry count limit
    while (this.cache.size >= MAX_CACHE_ENTRIES) {
      this.evictByPriority(newPriority);
    }
  }

  /**
   * Evict entries based on priority and LRU
   */
  private evictByPriority(newEntryPriority: number): void {
    let candidateKey = '';
    let candidatePriority = 0;
    let candidateTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      // Skip high-priority entries if new entry has lower priority
      if (entry.priority < newEntryPriority) {
        continue;
      }

      // Prefer lower priority entries, then older entries
      if (
        entry.priority > candidatePriority ||
        (entry.priority === candidatePriority && entry.lastAccessed < candidateTime)
      ) {
        candidateKey = key;
        candidatePriority = entry.priority;
        candidateTime = entry.lastAccessed;
      }
    }

    if (candidateKey) {
      this.delete(candidateKey);
      this.metrics.evictions++;
    }
  }

  /**
   * Update content type metrics
   */
  private updateContentTypeMetrics(contentType: MedicalContentType, operation: 'hit' | 'miss'): void {
    const metrics = this.metrics.contentTypeMetrics.get(contentType);
    if (metrics) {
      if (operation === 'hit') {
        metrics.hits++;
      } else {
        metrics.misses++;
      }
      metrics.accessCount++;
      this.metrics.contentTypeMetrics.set(contentType, metrics);
    }
  }

  /**
   * Update response time metrics
   */
  private updateResponseTime(responseTime: number): void {
    this.metrics.responseTimeSum += responseTime;
    this.metrics.responseTimeCount++;
  }

  /**
   * Start periodic cleanup with medical-aware expiration
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired();
    }, CACHE_CLEANUP_INTERVAL);
  }

  /**
   * Remove expired entries with content-type aware TTL
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      const maxAge = MEDICAL_CACHE_TTL[entry.contentType] || DEFAULT_CACHE_TIME;
      if (now - entry.timestamp > maxAge) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.delete(key));
  }

  /**
   * Cache warming for frequently accessed medical content
   */
  private async startWarmupProcess(): Promise<void> {
    if (this.warmupInProgress) return;

    this.warmupInProgress = true;

    try {
      // This would be implemented to pre-load critical medical data
      // For now, it's a placeholder for the warmup logic
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      // Warmup failed, but don't break the cache
    } finally {
      this.warmupInProgress = false;
    }
  }

  /**
   * Invalidate cache entries by tags
   */
  invalidateByTags(tags: string[]): number {
    let invalidatedCount = 0;
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some((tag) => tags.includes(tag))) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => {
      if (this.delete(key)) {
        invalidatedCount++;
      }
    });

    return invalidatedCount;
  }

  /**
   * Get cache health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    circuitBreakerState: string;
    memoryUsage: number;
    hitRate: number;
  } {
    const stats = this.getStats();
    const memoryUsagePercent = (this.totalSize / MAX_CACHE_SIZE) * 100;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (this.circuitBreaker.getState() === 'open') {
      status = 'unhealthy';
    } else if (memoryUsagePercent > 90 || stats.hitRate < 0.5) {
      status = 'degraded';
    }

    return {
      status,
      circuitBreakerState: this.circuitBreaker.getState(),
      memoryUsage: memoryUsagePercent,
      hitRate: stats.hitRate,
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
}

// Global enhanced medical cache instance
const cache = new EnhancedMedicalCache();

/**
 * Custom error class for API-related errors with medical context
 */
export class MedicalAPIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly endpoint?: string,
    public readonly userFriendlyMessage?: string
  ) {
    super(message);
    this.name = 'MedicalAPIError';
  }

  /**
   * Get user-friendly error message for medical UI context
   */
  getUserMessage(): string {
    if (this.userFriendlyMessage) {
      return this.userFriendlyMessage;
    }

    // Provide medical-context friendly error messages
    switch (this.code) {
      case 'NETWORK_ERROR':
        return 'Không thể kết nối đến hệ thống y tế. Vui lòng kiểm tra kết nối mạng.';
      case 'TIMEOUT_ERROR':
        return 'Hệ thống đang bận. Vui lòng thử lại sau ít phút.';
      case 'NOT_FOUND':
        return 'Không tìm thấy thông tin y tế được yêu cầu.';
      case 'UNAUTHORIZED':
        return 'Bạn không có quyền truy cập thông tin này.';
      case 'SERVER_ERROR':
        return 'Hệ thống y tế đang gặp sự cố. Vui lòng liên hệ bộ phận hỗ trợ.';
      default:
        return 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.';
    }
  }
}

/**
 * Build URL with query parameters
 */
function buildURL(endpoint: string, params: QueryParams): string {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `${endpoint}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Sleep function for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Detect medical content type from endpoint
 */
function detectContentType(endpoint: string, params: QueryParams): MedicalContentType {
  const url = endpoint.toLowerCase();

  if (url.includes('info-bacsi') || url.includes('doctor')) {
    return 'doctors';
  }

  if (url.includes('search')) {
    return 'search';
  }

  if (url.includes('pages')) {
    const parent = params.parent?.toString();
    if (parent === '1009') {
      // DEPARTMENT_ID
      return 'departments';
    }
    if (parent === '7222') {
      // SERVICE_ID
      return 'services';
    }
  }

  if (url.includes('posts')) {
    return 'posts';
  }

  // Check for emergency content
  const searchTerm = params.search?.toString().toLowerCase();
  if (searchTerm?.includes('cấp cứu') || searchTerm?.includes('emergency')) {
    return 'emergency';
  }

  return 'general';
}

/**
 * Generate cache tags from endpoint and parameters
 */
function generateCacheTags(endpoint: string, params: QueryParams, contentType: MedicalContentType): string[] {
  const tags: string[] = [contentType];

  if (params.parent) {
    tags.push(`parent:${params.parent}`);
  }

  if (params.type) {
    tags.push(`type:${params.type}`);
  }

  if (params.search) {
    tags.push('search');
  }

  // Add endpoint-specific tags
  if (endpoint.includes('wp/v2/')) {
    const apiPath = endpoint.split('wp/v2/')[1];
    tags.push(`api:${apiPath.split('?')[0]}`);
  }

  return tags;
}

// Request deduplication map to prevent duplicate API calls
const pendingRequests = new Map<string, Promise<any>>();

// Background refresh queue for stale-while-revalidate
const backgroundRefreshQueue = new Set<string>();

// Cleanup pending requests periodically to prevent memory leaks
setInterval(
  () => {
    // Clear requests older than 5 minutes
    for (const [key, promise] of pendingRequests.entries()) {
      // Check if promise is still pending by checking its state
      Promise.race([promise, Promise.resolve('timeout')])
        .then((result) => {
          if (result === 'timeout') {
            pendingRequests.delete(key);
          }
        })
        .catch(() => {
          pendingRequests.delete(key);
        });
    }
  },
  5 * 60 * 1000
); // Run every 5 minutes

/**
 * Background refresh function for stale-while-revalidate pattern
 */
async function backgroundRefresh<T>(
  endpoint: string,
  params: QueryParams,
  options: FetchOptions,
  cacheKey: string,
  contentType: MedicalContentType,
  cacheTags: string[]
): Promise<void> {
  // Prevent duplicate background refreshes
  if (backgroundRefreshQueue.has(cacheKey)) {
    return;
  }

  backgroundRefreshQueue.add(cacheKey);

  try {
    // Perform the API request in the background
    const response = await api.get<T>(buildURL(endpoint, params), {
      timeout: contentType === 'emergency' ? 10000 : 30000,
    });

    const data = response?.data || (response as unknown as T);

    // Update cache with fresh data
    if (data !== null && data !== undefined) {
      cache.set(cacheKey, data, contentType, cacheTags);
    }
  } catch (error) {
    // Silently fail background refresh - user still has stale data
    console.warn('Background refresh failed for:', cacheKey, error);
  } finally {
    backgroundRefreshQueue.delete(cacheKey);
  }
}

/**
 * Predictive caching function to preload related content
 */
async function triggerPredictiveCaching(
  endpoint: string,
  params: QueryParams,
  contentType: MedicalContentType
): Promise<void> {
  // Only trigger predictive caching for certain content types
  if (!['posts', 'services', 'departments'].includes(contentType)) {
    return;
  }

  // Use requestIdleCallback to avoid blocking main thread
  const predictiveCache = () => {
    try {
      if (contentType === 'posts' && !params.search) {
        // Preload related posts
        const relatedParams = { ...params, per_page: 5 };
        preloadCache(endpoint, relatedParams).catch(() => {
          // Silently fail predictive caching
        });
      } else if (contentType === 'services' && params.parent) {
        // Preload other services in the same category
        const relatedParams = { ...params, per_page: 10 };
        preloadCache(endpoint, relatedParams).catch(() => {
          // Silently fail predictive caching
        });
      } else if (contentType === 'departments') {
        // Preload department services
        const serviceParams = { parent: 7222, per_page: 20 };
        preloadCache('/wp-json/wp/v2/pages', serviceParams).catch(() => {
          // Silently fail predictive caching
        });
      }
    } catch (error) {
      // Silently fail predictive caching
    }
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(predictiveCache, { timeout: 2000 });
  } else {
    setTimeout(predictiveCache, 100);
  }
}

/**
 * Enhanced generic API fetch function with medical-aware caching, stale-while-revalidate, and predictive caching
 */
export const fetchWPData = async <T>(
  endpoint: string,
  params: QueryParams = {},
  options: FetchOptions = {}
): Promise<T> => {
  const { cache: enableCache = true, abortSignal, retries = 3, retryDelay = 1000 } = options;

  const url = buildURL(endpoint, params);
  const cacheKey = url;
  const contentType = detectContentType(endpoint, params);
  const cacheTags = generateCacheTags(endpoint, params, contentType);

  // Check cache if enabled
  if (enableCache) {
    const cachedData = cache.get<T>(cacheKey, contentType);
    if (cachedData !== null) {
      // Implement stale-while-revalidate pattern
      const cacheEntry = cache['cache'].get(cacheKey);
      if (cacheEntry) {
        const age = Date.now() - cacheEntry.timestamp;
        const maxAge = MEDICAL_CACHE_TTL[contentType] || DEFAULT_CACHE_TIME;
        const staleThreshold = maxAge * 0.8; // Revalidate when 80% of TTL is reached

        if (age > staleThreshold) {
          // Return stale data immediately, but trigger background refresh
          backgroundRefresh(endpoint, params, options, cacheKey, contentType, cacheTags);
        }
      }

      // Trigger predictive caching for related content
      triggerPredictiveCaching(endpoint, params, contentType);

      return cachedData;
    }
  }

  // Check for pending request (deduplication)
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<T>;
  }

  let lastError: Error | null = null;

  // Create the request promise and store it for deduplication
  const requestPromise = (async (): Promise<T> => {
    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Add delay for retries (except first attempt)
        if (attempt > 0) {
          await sleep(retryDelay * attempt);
        }

        // Check if request was aborted
        if (abortSignal?.aborted) {
          throw new MedicalAPIError('Request was aborted', 'ABORTED', undefined, endpoint, 'Yêu cầu đã bị hủy');
        }

        // Make API request with optimized timeout based on content type and performance tracking
        const timeout = contentType === 'emergency' ? 10000 : contentType === 'services' ? 15000 : 30000;
        const requestStartTime = performance.now();

        // Mark start of API request for performance monitoring
        if (typeof window !== 'undefined' && window.performance) {
          performance.mark(`api-request-start-${cacheKey}`);
        }

        const response = await api.get<T>(url, {
          signal: abortSignal,
          timeout,
        });

        // Track API response time
        const responseTime = performance.now() - requestStartTime;

        // Log slow requests for monitoring
        if (responseTime > 1000) {
          // Log requests slower than 1 second
          console.warn(`Slow API request detected: ${url} took ${responseTime.toFixed(2)}ms`, {
            contentType,
            timeout,
            responseTime,
          });
        }

        // Mark end of API request for performance monitoring
        if (typeof window !== 'undefined' && window.performance) {
          performance.mark(`api-request-end-${cacheKey}`);
          performance.measure(
            `api-request-${cacheKey}`,
            `api-request-start-${cacheKey}`,
            `api-request-end-${cacheKey}`
          );
        }

        // Handle response data
        const data = response?.data || (response as unknown as T);

        // Validate response data
        if (data === null || data === undefined) {
          throw new MedicalAPIError(
            'Empty response received',
            'EMPTY_RESPONSE',
            200,
            endpoint,
            'Không nhận được dữ liệu từ hệ thống'
          );
        }

        // Store in cache if enabled
        if (enableCache) {
          cache.set(cacheKey, data, contentType, cacheTags);
        }

        return data;
      } catch (error: unknown) {
        lastError = error as Error;

        // Handle specific error types
        if (error instanceof MedicalAPIError) {
          // Don't retry for certain error types
          if (['ABORTED', 'UNAUTHORIZED', 'NOT_FOUND'].includes(error.code)) {
            throw error;
          }
        } else if (error && typeof error === 'object') {
          const axiosError = error as any;

          // Handle Axios errors
          if (axiosError.response) {
            const status = axiosError.response.status;
            const wpError = axiosError.response.data as WPAPIError | undefined;

            let errorCode = 'SERVER_ERROR';
            let userMessage = '';

            switch (status) {
              case 400:
                errorCode = 'BAD_REQUEST';
                userMessage = 'Yêu cầu không hợp lệ';
                break;
              case 401:
                errorCode = 'UNAUTHORIZED';
                userMessage = 'Không có quyền truy cập';
                break;
              case 403:
                errorCode = 'FORBIDDEN';
                userMessage = 'Truy cập bị từ chối';
                break;
              case 404:
                errorCode = 'NOT_FOUND';
                userMessage = 'Không tìm thấy thông tin';
                break;
              case 429:
                errorCode = 'RATE_LIMITED';
                userMessage = 'Quá nhiều yêu cầu, vui lòng thử lại sau';
                break;
              case 500:
              case 502:
              case 503:
              case 504:
                errorCode = 'SERVER_ERROR';
                userMessage = 'Hệ thống đang gặp sự cố';
                break;
            }

            const medicalError = new MedicalAPIError(
              wpError?.message || axiosError.message || 'API request failed',
              errorCode,
              status,
              endpoint,
              userMessage
            );

            // Don't retry for client errors (4xx)
            if (status >= 400 && status < 500) {
              throw medicalError;
            }

            lastError = medicalError;
          } else if (axiosError.request) {
            // Network error
            lastError = new MedicalAPIError(
              'Network error occurred',
              'NETWORK_ERROR',
              undefined,
              endpoint,
              'Không thể kết nối đến hệ thống'
            );
          } else if (axiosError.code === 'ECONNABORTED') {
            // Timeout error
            lastError = new MedicalAPIError(
              'Request timeout',
              'TIMEOUT_ERROR',
              undefined,
              endpoint,
              'Hết thời gian chờ kết nối'
            );
          }
        }

        // If this is the last attempt, throw the error
        if (attempt === retries) {
          break;
        }
      }
    }

    // Throw the last error if all retries failed
    throw (
      lastError ||
      new MedicalAPIError(
        'Unknown error occurred',
        'UNKNOWN_ERROR',
        undefined,
        endpoint,
        'Đã xảy ra lỗi không xác định'
      )
    );
  })();

  // Store the promise for deduplication
  pendingRequests.set(cacheKey, requestPromise);

  try {
    const result = await requestPromise;
    return result;
  } finally {
    // Clean up the pending request
    pendingRequests.delete(cacheKey);
  }
};

/**
 * Clear cache entry for specific endpoint
 */
export const invalidateCache = (endpoint: string, params: QueryParams = {}): boolean => {
  const url = buildURL(endpoint, params);
  return cache.delete(url);
};

/**
 * Clear entire cache
 */
export const clearCache = (): void => {
  cache.clear();
};

/**
 * Get cache statistics for monitoring
 */
export const getCacheStats = (): CacheStats => {
  return cache.getStats();
};

/**
 * Invalidate cache entries matching a pattern
 */
export const invalidateCachePattern = (pattern: string): number => {
  let deletedCount = 0;
  const regex = new RegExp(pattern);

  for (const key of cache['cache'].keys()) {
    if (regex.test(key)) {
      if (cache.delete(key)) {
        deletedCount++;
      }
    }
  }

  return deletedCount;
};

/**
 * Preload data into cache
 */
export const preloadCache = async <T>(
  endpoint: string,
  params: QueryParams = {},
  options: Omit<FetchOptions, 'cache'> = {}
): Promise<T> => {
  return fetchWPData<T>(endpoint, params, { ...options, cache: true });
};

/**
 * Enhanced cache management functions
 */

/**
 * Invalidate cache entries by medical content tags
 */
export const invalidateCacheByTags = (tags: string[]): number => {
  return cache.invalidateByTags(tags);
};

/**
 * Get cache health status for monitoring
 */
export const getCacheHealth = () => {
  return cache.getHealthStatus();
};

/**
 * Warm up cache with critical medical data
 */
export const warmupMedicalCache = async (): Promise<void> => {
  // Check if cache is already warmed up
  const cacheStats = cache.getStats();
  const isWarmupNeeded = cacheStats.totalEntries < 10;

  if (isWarmupNeeded) {
    console.info('Starting medical cache warmup...');

    try {
      // Warm up critical services data in parallel
      await Promise.all([
        // Critical services - prioritize these
        preloadCache('/wp-json/wp/v2/pages', { parent: 7220, per_page: 100, _fields: 'id,title,content,modified' }),
        preloadCache('/wp-json/wp/v2/posts', { per_page: 10, _fields: 'id,title,excerpt,modified' }),
        preloadCache('/wp-json/wp/v2/pages', { parent: 1009, per_page: 50, _fields: 'id,title,content,modified' }),

        // Secondary data - load after a delay to prioritize critical data
        new Promise((resolve) =>
          setTimeout(async () => {
            try {
              await Promise.all([
                preloadCache('/wp-json/wp/v2/doctor', { per_page: 20, _fields: 'id,title,content,modified' }),
                preloadCache('/wp-json/wp/v2/service', { per_page: 20, _fields: 'id,title,content,modified' }),
              ]);
            } catch (error) {
              console.warn('Secondary cache warmup error:', error);
            }
            resolve(true);
          }, 500)
        ),
      ]);

      console.info('Medical cache warmup completed successfully.');
    } catch (error) {
      console.error('Error during medical cache warmup:', error);
      // Continue even if warmup fails - application can still function
    }
  }
};

/**
 * Medical-specific cache invalidation patterns
 */
export const invalidateMedicalContent = {
  /**
   * Invalidate all emergency-related content
   */
  emergency: () => invalidateCacheByTags(['emergency', 'cấp cứu']),

  /**
   * Invalidate department content
   */
  departments: () => invalidateCacheByTags(['departments', 'parent:1009']),

  /**
   * Invalidate doctor profiles
   */
  doctors: () => invalidateCacheByTags(['doctors', 'api:info-bacsi']),

  /**
   * Invalidate service information
   */
  services: () => invalidateCacheByTags(['services', 'parent:7222']),

  /**
   * Invalidate all search results
   */
  search: () => invalidateCacheByTags(['search']),

  /**
   * Invalidate all content (nuclear option)
   */
  all: () => {
    clearCache();
    return cache.getStats().totalEntries;
  },
};

/**
 * Cache performance monitoring utilities
 */
export const cacheMonitoring = {
  /**
   * Get detailed performance metrics
   */
  getMetrics: () => cache.getStats(),

  /**
   * Get cache health status
   */
  getHealth: () => cache.getHealthStatus(),

  /**
   * Check if cache needs optimization
   */
  needsOptimization: (): boolean => {
    const health = cache.getHealthStatus();
    return health.status !== 'healthy' || health.hitRate < 0.7;
  },

  /**
   * Get memory usage report
   */
  getMemoryReport: () => {
    const stats = cache.getStats();
    return {
      totalSize: stats.totalSize,
      maxSize: MAX_CACHE_SIZE,
      usagePercent: (stats.totalSize / MAX_CACHE_SIZE) * 100,
      efficiency: stats.memoryEfficiency,
      compressionRatio: stats.compressionRatio,
    };
  },

  /**
   * Get content type performance breakdown
   */
  getContentTypeBreakdown: () => {
    const stats = cache.getStats();
    return stats.contentTypeStats;
  },
};

/**
 * Get API performance metrics
 */
export const getAPIPerformanceMetrics = () => {
  if (typeof window === 'undefined' || !window.performance) {
    return { measures: [], marks: [] };
  }

  const measures = performance
    .getEntriesByType('measure')
    .filter((entry) => entry.name.startsWith('api-request-'))
    .map((entry) => ({
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
    }));

  const marks = performance
    .getEntriesByType('mark')
    .filter((entry) => entry.name.startsWith('api-request-'))
    .map((entry) => ({
      name: entry.name,
      startTime: entry.startTime,
    }));

  return { measures, marks };
};

/**
 * Clear API performance metrics
 */
export const clearAPIPerformanceMetrics = () => {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }

  const entries = performance
    .getEntriesByType('measure')
    .concat(performance.getEntriesByType('mark'))
    .filter((entry) => entry.name.startsWith('api-request-'));

  entries.forEach((entry) => {
    try {
      performance.clearMeasures(entry.name);
      performance.clearMarks(entry.name);
    } catch (e) {
      // Ignore errors
    }
  });
};

/**
 * Cleanup function for graceful shutdown
 */
export const destroyCache = (): void => {
  cache.destroy();
};
