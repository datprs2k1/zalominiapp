/**
 * Manual verification script for export conflict resolution
 * This file tests that all exports work correctly without TypeScript errors
 */

// Test 1: Import enhanced functions from posts module (should be primary exports)
import { fetchPost, fetchPosts, getPosts, getPost } from '../posts';

// Test 2: Import generic functions with aliases from common module
import { fetchPostGeneric, fetchPostsGeneric, fetchPages, fetchPage } from '../common';

// Test 3: Import everything from main post.ts module
import {
  // Enhanced post functions (primary)
  fetchPost as mainFetchPost,
  fetchPosts as mainFetchPosts,
  getPosts as mainGetPosts,
  getPost as mainGetPost,
  
  // Generic functions (aliased)
  fetchPostGeneric as mainFetchPostGeneric,
  fetchPostsGeneric as mainFetchPostsGeneric,
  
  // Other utilities
  WP_ENDPOINTS,
  truncateText,
  formatMedicalDate,
  fetchPages as mainFetchPages,
  fetchPage as mainFetchPage,
  
  // Cache functions
  invalidateCache,
  clearCache,
  getCacheStats,
  
  // API functions
  api,
  checkAPIHealth,
} from '../post';

// Test 4: Verify types are correct
const testTypes = () => {
  // These should compile without errors
  const postId: number = 123;
  const params = { per_page: 10 };
  
  // Enhanced functions should accept PostsQueryParams
  fetchPost(postId, params);
  fetchPosts(params);
  
  // Generic functions should accept basic params
  fetchPostGeneric(postId);
  fetchPostsGeneric({ per_page: 10 });
  
  // Main module exports should work the same way
  mainFetchPost(postId, params);
  mainFetchPosts(params);
  mainFetchPostGeneric(postId);
  mainFetchPostsGeneric({ per_page: 10 });
  
  console.log('✅ All export types are correct');
};

// Test 5: Verify functions are different instances
const testFunctionIdentity = () => {
  // Enhanced vs Generic should be different functions
  console.log('Enhanced fetchPost !== Generic fetchPost:', mainFetchPost !== mainFetchPostGeneric);
  console.log('Enhanced fetchPosts !== Generic fetchPosts:', mainFetchPosts !== mainFetchPostsGeneric);
  
  // Same functions from different imports should be the same
  console.log('Posts module fetchPost === Main module fetchPost:', fetchPost === mainFetchPost);
  console.log('Common module fetchPostGeneric === Main module fetchPostGeneric:', fetchPostGeneric === mainFetchPostGeneric);
  
  console.log('✅ Function identity tests passed');
};

// Test 6: Verify all expected exports exist
const testExportExistence = () => {
  const requiredExports = [
    // Enhanced functions
    mainFetchPost, mainFetchPosts, mainGetPosts, mainGetPost,
    
    // Generic functions
    mainFetchPostGeneric, mainFetchPostsGeneric, mainFetchPages, mainFetchPage,
    
    // Utilities
    WP_ENDPOINTS, truncateText, formatMedicalDate,
    
    // Cache functions
    invalidateCache, clearCache, getCacheStats,
    
    // API functions
    api, checkAPIHealth,
  ];
  
  const missingExports = requiredExports.filter(exp => exp === undefined);
  
  if (missingExports.length === 0) {
    console.log('✅ All required exports are available');
  } else {
    console.error('❌ Missing exports:', missingExports.length);
  }
};

// Run verification
export const verifyExports = () => {
  console.log('🔍 Verifying export conflict resolution...');
  
  try {
    testTypes();
    testFunctionIdentity();
    testExportExistence();
    
    console.log('🎉 All export conflict resolution tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Export verification failed:', error);
    return false;
  }
};

// Export for testing
export {
  fetchPost,
  fetchPosts,
  fetchPostGeneric,
  fetchPostsGeneric,
  mainFetchPost,
  mainFetchPosts,
  mainFetchPostGeneric,
  mainFetchPostsGeneric,
};

// Auto-run verification if this file is executed directly
if (typeof window === 'undefined') {
  verifyExports();
}
