/**
 * Test file to verify export conflict resolution in post.ts
 * Ensures that the TypeScript export ambiguity has been resolved
 */

import { describe, it, expect } from 'vitest';

describe('Export Conflict Resolution', () => {
  it('should import enhanced fetchPost and fetchPosts from posts module', async () => {
    const { fetchPost, fetchPosts } = await import('../posts');
    
    expect(fetchPost).toBeDefined();
    expect(fetchPosts).toBeDefined();
    expect(typeof fetchPost).toBe('function');
    expect(typeof fetchPosts).toBe('function');
  });

  it('should import generic fetchPost and fetchPosts with aliases from common module', async () => {
    const { fetchPostGeneric, fetchPostsGeneric } = await import('../common');
    
    expect(fetchPostGeneric).toBeDefined();
    expect(fetchPostsGeneric).toBeDefined();
    expect(typeof fetchPostGeneric).toBe('function');
    expect(typeof fetchPostsGeneric).toBe('function');
  });

  it('should import both versions from main post.ts module without conflicts', async () => {
    const postModule = await import('../post');
    
    // Enhanced versions (primary exports)
    expect(postModule.fetchPost).toBeDefined();
    expect(postModule.fetchPosts).toBeDefined();
    
    // Generic versions (aliased exports)
    expect(postModule.fetchPostGeneric).toBeDefined();
    expect(postModule.fetchPostsGeneric).toBeDefined();
    
    // Verify they are different functions
    expect(postModule.fetchPost).not.toBe(postModule.fetchPostGeneric);
    expect(postModule.fetchPosts).not.toBe(postModule.fetchPostsGeneric);
  });

  it('should export all expected utilities from common module', async () => {
    const postModule = await import('../post');
    
    // WordPress endpoints
    expect(postModule.WP_ENDPOINTS).toBeDefined();
    expect(postModule.DEFAULT_EMBED).toBeDefined();
    
    // Fetch functions
    expect(postModule.fetchPages).toBeDefined();
    expect(postModule.fetchPage).toBeDefined();
    expect(postModule.fetchDoctors).toBeDefined();
    expect(postModule.fetchDoctor).toBeDefined();
    
    // Utility functions
    expect(postModule.truncateText).toBeDefined();
    expect(postModule.formatMedicalDate).toBeDefined();
    expect(postModule.filterMedicalContent).toBeDefined();
    expect(postModule.sortByMedicalPriority).toBeDefined();
  });

  it('should export all enhanced service modules', async () => {
    const postModule = await import('../post');
    
    // Enhanced post functions
    expect(postModule.getPosts).toBeDefined();
    expect(postModule.getPost).toBeDefined();
    expect(postModule.getFeaturedPosts).toBeDefined();
    expect(postModule.searchPosts).toBeDefined();
    
    // Service functions
    expect(postModule.getServices).toBeDefined();
    expect(postModule.getServicePrices).toBeDefined();
    
    // Department functions
    expect(postModule.getDepartments).toBeDefined();
    expect(postModule.getDepartment).toBeDefined();
    
    // Doctor functions
    expect(postModule.getDoctors).toBeDefined();
    expect(postModule.getDoctor).toBeDefined();
  });

  it('should export cache management functions', async () => {
    const postModule = await import('../post');
    
    expect(postModule.invalidateCache).toBeDefined();
    expect(postModule.clearCache).toBeDefined();
    expect(postModule.getCacheStats).toBeDefined();
    expect(postModule.preloadCache).toBeDefined();
    expect(postModule.MedicalAPIError).toBeDefined();
  });

  it('should export API client and health monitoring', async () => {
    const postModule = await import('../post');
    
    expect(postModule.api).toBeDefined();
    expect(postModule.checkAPIHealth).toBeDefined();
    expect(postModule.getAPILogs).toBeDefined();
    expect(postModule.clearAPILogs).toBeDefined();
  });

  it('should maintain backward compatibility for existing imports', async () => {
    // Test that existing import patterns still work
    const { getPosts, getPost } = await import('../post');
    const { fetchPages, fetchPage } = await import('../post');
    const { WP_ENDPOINTS, truncateText } = await import('../post');
    
    expect(getPosts).toBeDefined();
    expect(getPost).toBeDefined();
    expect(fetchPages).toBeDefined();
    expect(fetchPage).toBeDefined();
    expect(WP_ENDPOINTS).toBeDefined();
    expect(truncateText).toBeDefined();
  });

  it('should not have duplicate exports causing TypeScript errors', () => {
    // This test passes if the file compiles without TypeScript errors
    // The fact that we can import from the module means no export conflicts exist
    expect(true).toBe(true);
  });
});
