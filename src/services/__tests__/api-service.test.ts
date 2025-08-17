/**
 * API Service Integration Tests
 * 
 * These tests validate that the refactored API service maintains
 * backward compatibility and works correctly.
 */

import {
  // Legacy exports (should still work)
  getPosts,
  getPost,
  getServices,
  getService,
  getDepartments,
  getDepartment,
  getDoctors,
  getDoctor,
  getSearch,
  invalidateCache,
  clearCache,
  
  // New service exports
  createWordPressClient,
  createPostsService,
  createServicesService,
  createDepartmentsService,
  createDoctorsService,
  createSearchService,
  
  // Utility exports
  PostsUtils,
  PagesUtils,
  DoctorsUtils,
  SearchUtils,
  QueryBuilder,
  QueryUtils,
  
  // Cache utilities
  createCache,
  createHttpClient,
} from '../post';

// Mock the config
jest.mock('@/config', () => ({
  API_URL: 'https://test-api.com',
  SERVICE_ID: '123',
  DEPARTMENT_ID: '456',
}));

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));

describe('API Service Refactoring', () => {
  describe('Backward Compatibility', () => {
    test('should export all legacy functions', () => {
      expect(typeof getPosts).toBe('function');
      expect(typeof getPost).toBe('function');
      expect(typeof getServices).toBe('function');
      expect(typeof getService).toBe('function');
      expect(typeof getDepartments).toBe('function');
      expect(typeof getDepartment).toBe('function');
      expect(typeof getDoctors).toBe('function');
      expect(typeof getDoctor).toBe('function');
      expect(typeof getSearch).toBe('function');
      expect(typeof invalidateCache).toBe('function');
      expect(typeof clearCache).toBe('function');
    });

    test('should maintain function signatures', () => {
      // Test that functions can be called with expected parameters
      expect(() => getPosts()).not.toThrow();
      expect(() => getPosts({})).not.toThrow();
      expect(() => getPosts({ per_page: 10 })).not.toThrow();
      
      expect(() => getPost(1)).not.toThrow();
      expect(() => getServices()).not.toThrow();
      expect(() => getServices({})).not.toThrow();
    });
  });

  describe('New Service Architecture', () => {
    test('should export new service creators', () => {
      expect(typeof createWordPressClient).toBe('function');
      expect(typeof createPostsService).toBe('function');
      expect(typeof createServicesService).toBe('function');
      expect(typeof createDepartmentsService).toBe('function');
      expect(typeof createDoctorsService).toBe('function');
      expect(typeof createSearchService).toBe('function');
    });

    test('should export utility functions', () => {
      expect(typeof PostsUtils).toBe('object');
      expect(typeof PagesUtils).toBe('object');
      expect(typeof DoctorsUtils).toBe('object');
      expect(typeof SearchUtils).toBe('object');
      expect(typeof QueryBuilder).toBe('function');
      expect(typeof QueryUtils).toBe('object');
    });

    test('should export core infrastructure', () => {
      expect(typeof createCache).toBe('function');
      expect(typeof createHttpClient).toBe('function');
    });
  });

  describe('Core Infrastructure', () => {
    describe('Cache Service', () => {
      test('should create cache instance', () => {
        const cache = createCache();
        expect(cache).toBeDefined();
        expect(typeof cache.get).toBe('function');
        expect(typeof cache.set).toBe('function');
        expect(typeof cache.has).toBe('function');
        expect(typeof cache.delete).toBe('function');
        expect(typeof cache.clear).toBe('function');
      });

      test('should support TTL caching', () => {
        const cache = createCache({ ttl: 1000 });
        cache.set('test', 'value');
        expect(cache.get('test')).toBe('value');
        expect(cache.has('test')).toBe(true);
      });
    });

    describe('HTTP Client', () => {
      test('should create HTTP client instance', () => {
        const client = createHttpClient();
        expect(client).toBeDefined();
        expect(typeof client.get).toBe('function');
        expect(typeof client.post).toBe('function');
        expect(typeof client.put).toBe('function');
        expect(typeof client.delete).toBe('function');
      });
    });

    describe('Query Builder', () => {
      test('should build query strings correctly', () => {
        const queryString = QueryBuilder.buildQueryString({
          per_page: 10,
          search: 'test query',
          categories: [1, 2, 3],
        });
        
        expect(queryString).toContain('per_page=10');
        expect(queryString).toContain('search=test%20query');
        expect(queryString).toContain('categories');
      });

      test('should validate parameters', () => {
        const result = QueryBuilder.validateParams(
          { per_page: 10, search: 'test' },
          {
            per_page: { type: 'number', min: 1, max: 100 },
            search: { type: 'string', required: true },
          }
        );
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
      });

      test('should sanitize parameters', () => {
        const sanitized = QueryBuilder.sanitizeParams({
          valid: 'value',
          empty: '',
          undefined: undefined,
          null: null,
          whitespace: '  trimmed  ',
        });
        
        expect(sanitized).toEqual({
          valid: 'value',
          whitespace: 'trimmed',
        });
      });
    });
  });

  describe('Utility Functions', () => {
    describe('PostsUtils', () => {
      test('should extract excerpt correctly', () => {
        const post = {
          id: 1,
          title: { rendered: 'Test Post' },
          content: { rendered: '<p>This is test content</p>' },
          excerpt: { rendered: '<p>This is excerpt</p>' },
          date: '2023-01-01',
        };
        
        const excerpt = PostsUtils.getExcerpt(post as any);
        expect(excerpt).toBe('This is excerpt');
      });

      test('should format date correctly', () => {
        const post = {
          date: '2023-01-01T10:00:00',
        };
        
        const formatted = PostsUtils.formatDate(post as any);
        expect(formatted).toMatch(/January 1, 2023/);
      });
    });

    describe('SearchUtils', () => {
      test('should normalize query correctly', () => {
        const normalized = SearchUtils.normalizeQuery('  Test Query!@#  ');
        expect(normalized).toBe('test query');
      });

      test('should validate query correctly', () => {
        expect(SearchUtils.isValidQuery('ab')).toBe(true);
        expect(SearchUtils.isValidQuery('a')).toBe(false);
        expect(SearchUtils.isValidQuery('')).toBe(false);
      });

      test('should highlight search terms', () => {
        const highlighted = SearchUtils.highlightSearchTerms(
          'This is a test content',
          'test'
        );
        expect(highlighted).toContain('<span class="highlight">test</span>');
      });
    });
  });

  describe('WordPress Client', () => {
    test('should create WordPress client with config', () => {
      const client = createWordPressClient({
        baseUrl: 'https://test.com',
        cacheEnabled: true,
      });
      
      expect(client).toBeDefined();
      expect(typeof client.get).toBe('function');
      expect(typeof client.getById).toBe('function');
      expect(typeof client.getCollection).toBe('function');
      expect(typeof client.search).toBe('function');
    });
  });

  describe('Service Classes', () => {
    let client: any;

    beforeEach(() => {
      client = createWordPressClient({
        baseUrl: 'https://test.com',
      });
    });

    test('should create posts service', () => {
      const postsService = createPostsService(client);
      expect(postsService).toBeDefined();
      expect(typeof postsService.getPosts).toBe('function');
      expect(typeof postsService.getPost).toBe('function');
      expect(typeof postsService.searchPosts).toBe('function');
    });

    test('should create services service', () => {
      const servicesService = createServicesService(client, 123);
      expect(servicesService).toBeDefined();
      expect(typeof servicesService.getServices).toBe('function');
      expect(typeof servicesService.getService).toBe('function');
    });

    test('should create departments service', () => {
      const departmentsService = createDepartmentsService(client, 456);
      expect(departmentsService).toBeDefined();
      expect(typeof departmentsService.getDepartments).toBe('function');
      expect(typeof departmentsService.getDepartment).toBe('function');
    });

    test('should create doctors service', () => {
      const doctorsService = createDoctorsService(client);
      expect(doctorsService).toBeDefined();
      expect(typeof doctorsService.getDoctors).toBe('function');
      expect(typeof doctorsService.getDoctor).toBe('function');
      expect(typeof doctorsService.getDoctorsBySpecialty).toBe('function');
    });

    test('should create search service', () => {
      const searchService = createSearchService(client);
      expect(searchService).toBeDefined();
      expect(typeof searchService.search).toBe('function');
      expect(typeof searchService.searchEnhanced).toBe('function');
      expect(typeof searchService.searchGrouped).toBe('function');
    });
  });
});

// Integration test to ensure the refactoring doesn't break existing usage
describe('Integration Tests', () => {
  test('should maintain existing import patterns', () => {
    // Test that existing imports still work
    const imports = [
      'postsAtomFamily',
      'postAtomFamily', 
      'servicesAtom',
      'serviceAtom',
      'departmentsAtom',
      'departmentAtom',
      'doctorsAtom',
      'doctorAtomFamily',
      'searchAtom',
    ];

    // These should be available from the main export
    imports.forEach(importName => {
      expect(() => {
        const module = require('../post');
        expect(module[importName]).toBeDefined();
      }).not.toThrow();
    });
  });
});
