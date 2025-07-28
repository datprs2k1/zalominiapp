/**
 * Unit tests for the enhanced cache service
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import {
  fetchWPData,
  invalidateCache,
  clearCache,
  getCacheStats,
  getCacheHealth,
  invalidateCacheByTags,
  warmupMedicalCache,
  invalidateMedicalContent,
  cacheMonitoring,
  MedicalAPIError,
  DEFAULT_CACHE_TIME,
  MEDICAL_CACHE_TTL,
  MEDICAL_PRIORITY,
} from '../cache';
import api from '../api';

// Mock the API module
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockApi = api as { get: MockedFunction<any> };

describe('Enhanced Medical Cache Service', () => {
  beforeEach(() => {
    clearCache();
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearCache();
  });

  describe('fetchWPData', () => {
    it('should fetch data and cache it', async () => {
      const mockData = { id: 1, title: { rendered: 'Test Post' } };
      mockApi.get.mockResolvedValueOnce(mockData);

      const result = await fetchWPData('/wp-json/wp/v2/posts/1');

      expect(result).toEqual(mockData);
      expect(mockApi.get).toHaveBeenCalledWith(
        '/wp-json/wp/v2/posts/1',
        expect.objectContaining({
          signal: undefined,
          timeout: 30000,
        })
      );
    });

    it('should return cached data on subsequent requests', async () => {
      const mockData = { id: 1, title: { rendered: 'Test Post' } };
      mockApi.get.mockResolvedValueOnce(mockData);

      // First request
      const result1 = await fetchWPData('/wp-json/wp/v2/posts/1');

      // Second request (should use cache)
      const result2 = await fetchWPData('/wp-json/wp/v2/posts/1');

      expect(result1).toEqual(mockData);
      expect(result2).toEqual(mockData);
      expect(mockApi.get).toHaveBeenCalledTimes(1);
    });

    it('should handle query parameters correctly', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      mockApi.get.mockResolvedValueOnce(mockData);

      const result = await fetchWPData('/wp-json/wp/v2/posts', {
        per_page: 10,
        _embed: 'wp:featuredmedia',
      });

      expect(result).toEqual(mockData);
      expect(mockApi.get).toHaveBeenCalledWith(
        '/wp-json/wp/v2/posts?per_page=10&_embed=wp%3Afeaturedmedia',
        expect.any(Object)
      );
    });

    it('should skip cache when cache option is false', async () => {
      const mockData = { id: 1, title: { rendered: 'Test Post' } };
      mockApi.get.mockResolvedValue(mockData);

      // First request with cache disabled
      await fetchWPData('/wp-json/wp/v2/posts/1', {}, { cache: false });

      // Second request with cache disabled
      await fetchWPData('/wp-json/wp/v2/posts/1', {}, { cache: false });

      expect(mockApi.get).toHaveBeenCalledTimes(2);
    });

    it('should handle network errors with medical context', async () => {
      const networkError = {
        request: {},
        message: 'Network Error',
        config: { url: '/wp-json/wp/v2/posts/1' },
      };
      mockApi.get.mockRejectedValueOnce(networkError);

      await expect(fetchWPData('/wp-json/wp/v2/posts/1')).rejects.toThrow(MedicalAPIError);

      try {
        await fetchWPData('/wp-json/wp/v2/posts/1');
      } catch (error) {
        expect(error).toBeInstanceOf(MedicalAPIError);
        expect((error as MedicalAPIError).code).toBe('NETWORK_ERROR');
        expect((error as MedicalAPIError).getUserMessage()).toContain('kết nối');
      }
    });

    it('should handle HTTP errors with medical context', async () => {
      const httpError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
        config: { url: '/wp-json/wp/v2/posts/999' },
      };
      mockApi.get.mockRejectedValueOnce(httpError);

      await expect(fetchWPData('/wp-json/wp/v2/posts/999')).rejects.toThrow(MedicalAPIError);

      try {
        await fetchWPData('/wp-json/wp/v2/posts/999');
      } catch (error) {
        expect(error).toBeInstanceOf(MedicalAPIError);
        expect((error as MedicalAPIError).code).toBe('NOT_FOUND');
        expect((error as MedicalAPIError).status).toBe(404);
      }
    });

    it('should implement retry logic', async () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' },
        },
        config: { url: '/wp-json/wp/v2/posts/1' },
      };

      // Fail first two attempts, succeed on third
      mockApi.get
        .mockRejectedValueOnce(serverError)
        .mockRejectedValueOnce(serverError)
        .mockResolvedValueOnce({ id: 1, title: { rendered: 'Success' } });

      const result = await fetchWPData('/wp-json/wp/v2/posts/1', {}, { retries: 3 });

      expect(result).toEqual({ id: 1, title: { rendered: 'Success' } });
      expect(mockApi.get).toHaveBeenCalledTimes(3);
    });

    it('should handle abort signals', async () => {
      const abortController = new AbortController();
      const abortError = {
        name: 'AbortError',
        message: 'Request aborted',
        config: { url: '/wp-json/wp/v2/posts/1' },
      };

      mockApi.get.mockRejectedValueOnce(abortError);
      abortController.abort();

      await expect(fetchWPData('/wp-json/wp/v2/posts/1', {}, { abortSignal: abortController.signal })).rejects.toThrow(
        MedicalAPIError
      );
    });
  });

  describe('Cache Management', () => {
    it('should invalidate specific cache entries', async () => {
      const mockData = { id: 1, title: { rendered: 'Test Post' } };
      mockApi.get.mockResolvedValue(mockData);

      // Cache the data
      await fetchWPData('/wp-json/wp/v2/posts/1');

      // Invalidate cache
      const invalidated = invalidateCache('/wp-json/wp/v2/posts/1');
      expect(invalidated).toBe(true);

      // Next request should hit API again
      await fetchWPData('/wp-json/wp/v2/posts/1');
      expect(mockApi.get).toHaveBeenCalledTimes(2);
    });

    it('should clear all cache entries', async () => {
      const mockData = { id: 1, title: { rendered: 'Test Post' } };
      mockApi.get.mockResolvedValue(mockData);

      // Cache multiple entries
      await fetchWPData('/wp-json/wp/v2/posts/1');
      await fetchWPData('/wp-json/wp/v2/posts/2');

      let stats = getCacheStats();
      expect(stats.totalEntries).toBe(2);

      // Clear cache
      clearCache();

      stats = getCacheStats();
      expect(stats.totalEntries).toBe(0);
    });

    it('should provide cache statistics', async () => {
      const mockData = { id: 1, title: { rendered: 'Test Post' } };
      mockApi.get.mockResolvedValue(mockData);

      // Initial stats
      let stats = getCacheStats();
      expect(stats.totalEntries).toBe(0);
      expect(stats.hitRate).toBe(0);

      // Add cache entry
      await fetchWPData('/wp-json/wp/v2/posts/1');

      // Access cached entry
      await fetchWPData('/wp-json/wp/v2/posts/1');

      stats = getCacheStats();
      expect(stats.totalEntries).toBe(1);
      expect(stats.hitRate).toBeGreaterThan(0);
      expect(stats.totalSize).toBeGreaterThan(0);
    });
  });

  describe('Medical Error Handling', () => {
    it('should create medical errors with Vietnamese messages', () => {
      const error = new MedicalAPIError('Test error', 'NETWORK_ERROR', undefined, '/test', 'Custom message');

      expect(error.name).toBe('MedicalAPIError');
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.getUserMessage()).toBe('Custom message');
    });

    it('should provide default Vietnamese messages for error codes', () => {
      const networkError = new MedicalAPIError('Network error', 'NETWORK_ERROR');
      expect(networkError.getUserMessage()).toContain('kết nối');

      const timeoutError = new MedicalAPIError('Timeout error', 'TIMEOUT_ERROR');
      expect(timeoutError.getUserMessage()).toContain('thời gian');

      const notFoundError = new MedicalAPIError('Not found', 'NOT_FOUND');
      expect(notFoundError.getUserMessage()).toContain('không tìm thấy');

      const serverError = new MedicalAPIError('Server error', 'SERVER_ERROR');
      expect(serverError.getUserMessage()).toContain('hệ thống');
    });
  });

  describe('Cache Expiration', () => {
    it('should expire cache entries after TTL', async () => {
      const mockData = { id: 1, title: { rendered: 'Test Post' } };
      mockApi.get.mockResolvedValue(mockData);

      // Cache with short TTL
      await fetchWPData('/wp-json/wp/v2/posts/1', {}, { cacheTime: 100 });

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should fetch from API again
      await fetchWPData('/wp-json/wp/v2/posts/1');
      expect(mockApi.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Data Validation', () => {
    it('should handle empty responses', async () => {
      mockApi.get.mockResolvedValueOnce(null);

      await expect(fetchWPData('/wp-json/wp/v2/posts/1')).rejects.toThrow(MedicalAPIError);

      try {
        await fetchWPData('/wp-json/wp/v2/posts/1');
      } catch (error) {
        expect(error).toBeInstanceOf(MedicalAPIError);
        expect((error as MedicalAPIError).code).toBe('EMPTY_RESPONSE');
      }
    });

    it('should handle undefined responses', async () => {
      mockApi.get.mockResolvedValueOnce(undefined);

      await expect(fetchWPData('/wp-json/wp/v2/posts/1')).rejects.toThrow(MedicalAPIError);
    });
  });

  describe('Medical Content Type Detection', () => {
    it('should detect doctor content type', async () => {
      const mockData = { id: 1, title: { rendered: 'Dr. Test' } };
      mockApi.get.mockResolvedValueOnce(mockData);

      await fetchWPData('/wp-json/wp/v2/info-bacsi/1');

      const stats = getCacheStats();
      expect(stats.contentTypeStats.doctors.entries).toBe(1);
    });

    it('should detect department content type', async () => {
      const mockData = { id: 1, title: { rendered: 'Cardiology Department' } };
      mockApi.get.mockResolvedValueOnce(mockData);

      await fetchWPData('/wp-json/wp/v2/pages', { parent: 1009 });

      const stats = getCacheStats();
      expect(stats.contentTypeStats.departments.entries).toBe(1);
    });

    it('should detect service content type', async () => {
      const mockData = { id: 1, title: { rendered: 'Heart Surgery' } };
      mockApi.get.mockResolvedValueOnce(mockData);

      await fetchWPData('/wp-json/wp/v2/pages', { parent: 7222 });

      const stats = getCacheStats();
      expect(stats.contentTypeStats.services.entries).toBe(1);
    });

    it('should detect emergency content type', async () => {
      const mockData = [{ id: 1, title: { rendered: 'Emergency Info' } }];
      mockApi.get.mockResolvedValueOnce(mockData);

      await fetchWPData('/wp-json/wp/v2/search', { search: 'cấp cứu' });

      const stats = getCacheStats();
      expect(stats.contentTypeStats.emergency.entries).toBe(1);
    });
  });

  describe('Medical Cache TTL', () => {
    it('should use different TTL for different content types', () => {
      expect(MEDICAL_CACHE_TTL.emergency).toBe(30 * 1000); // 30 seconds
      expect(MEDICAL_CACHE_TTL.departments).toBe(5 * 60 * 1000); // 5 minutes
      expect(MEDICAL_CACHE_TTL.doctors).toBe(10 * 60 * 1000); // 10 minutes
      expect(MEDICAL_CACHE_TTL.services).toBe(15 * 60 * 1000); // 15 minutes
      expect(MEDICAL_CACHE_TTL.posts).toBe(30 * 60 * 1000); // 30 minutes
      expect(MEDICAL_CACHE_TTL.search).toBe(2 * 60 * 1000); // 2 minutes
    });

    it('should use different priorities for different content types', () => {
      expect(MEDICAL_PRIORITY.emergency).toBe(1); // Highest priority
      expect(MEDICAL_PRIORITY.departments).toBe(2);
      expect(MEDICAL_PRIORITY.doctors).toBe(2);
      expect(MEDICAL_PRIORITY.services).toBe(3);
      expect(MEDICAL_PRIORITY.posts).toBe(4);
      expect(MEDICAL_PRIORITY.search).toBe(5); // Lowest priority
    });
  });

  describe('Cache Health Monitoring', () => {
    it('should provide cache health status', () => {
      const health = getCacheHealth();

      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('circuitBreakerState');
      expect(health).toHaveProperty('memoryUsage');
      expect(health).toHaveProperty('hitRate');
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
    });

    it('should provide detailed cache statistics', () => {
      const stats = getCacheStats();

      expect(stats).toHaveProperty('totalEntries');
      expect(stats).toHaveProperty('totalSize');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('compressionRatio');
      expect(stats).toHaveProperty('averageResponseTime');
      expect(stats).toHaveProperty('contentTypeStats');
      expect(stats).toHaveProperty('priorityDistribution');
      expect(stats).toHaveProperty('memoryEfficiency');
    });
  });

  describe('Tag-based Cache Invalidation', () => {
    it('should invalidate cache entries by tags', async () => {
      const mockData = { id: 1, title: { rendered: 'Test Doctor' } };
      mockApi.get.mockResolvedValueOnce(mockData);

      // Cache some doctor data
      await fetchWPData('/wp-json/wp/v2/info-bacsi/1');

      let stats = getCacheStats();
      expect(stats.totalEntries).toBe(1);

      // Invalidate by tags
      const invalidatedCount = invalidateCacheByTags(['doctors']);
      expect(invalidatedCount).toBe(1);

      stats = getCacheStats();
      expect(stats.totalEntries).toBe(0);
    });

    it('should invalidate medical content by type', async () => {
      const mockData = { id: 1, title: { rendered: 'Test' } };
      mockApi.get.mockResolvedValue(mockData);

      // Cache different types of content
      await fetchWPData('/wp-json/wp/v2/info-bacsi/1');
      await fetchWPData('/wp-json/wp/v2/pages', { parent: 1009 });

      let stats = getCacheStats();
      expect(stats.totalEntries).toBe(2);

      // Invalidate only doctors
      const invalidatedCount = invalidateMedicalContent.doctors();
      expect(invalidatedCount).toBeGreaterThan(0);

      stats = getCacheStats();
      expect(stats.totalEntries).toBe(1); // Only departments should remain
    });
  });

  describe('Cache Performance Monitoring', () => {
    it('should provide memory usage report', () => {
      const report = cacheMonitoring.getMemoryReport();

      expect(report).toHaveProperty('totalSize');
      expect(report).toHaveProperty('maxSize');
      expect(report).toHaveProperty('usagePercent');
      expect(report).toHaveProperty('efficiency');
      expect(report).toHaveProperty('compressionRatio');
      expect(typeof report.usagePercent).toBe('number');
    });

    it('should detect when cache needs optimization', () => {
      const needsOptimization = cacheMonitoring.needsOptimization();
      expect(typeof needsOptimization).toBe('boolean');
    });

    it('should provide content type breakdown', () => {
      const breakdown = cacheMonitoring.getContentTypeBreakdown();

      expect(breakdown).toHaveProperty('emergency');
      expect(breakdown).toHaveProperty('departments');
      expect(breakdown).toHaveProperty('doctors');
      expect(breakdown).toHaveProperty('services');
      expect(breakdown).toHaveProperty('posts');
      expect(breakdown).toHaveProperty('search');
      expect(breakdown).toHaveProperty('general');
    });
  });

  describe('Cache Warmup', () => {
    it('should warm up medical cache without errors', async () => {
      mockApi.get.mockResolvedValue({ id: 1, title: { rendered: 'Test' } });

      await expect(warmupMedicalCache()).resolves.not.toThrow();

      // Should have made multiple API calls for warmup
      expect(mockApi.get).toHaveBeenCalledTimes(3); // Emergency, doctors, services
    });

    it('should handle warmup failures gracefully', async () => {
      mockApi.get.mockRejectedValue(new Error('Network error'));

      await expect(warmupMedicalCache()).resolves.not.toThrow();
    });
  });
});
