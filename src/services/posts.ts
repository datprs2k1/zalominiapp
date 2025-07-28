/**
 * Enhanced Posts API Service
 * Provides optimized access to WordPress posts with caching and performance tracking
 *
 * @version 2.0.0
 * @author Medical Development Team
 * @since 2024-07-22
 */

import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { WPPost } from './wp-types';
import { enhancedRequest } from './api';
import { batchRequest, optimizeApiUrl } from '../utils/api-performance-monitor';
import { WP_ENDPOINTS } from './common';

/**
 * Interface for posts query parameters
 */
export interface PostsQueryParams {
  readonly per_page?: number;
  readonly page?: number;
  readonly search?: string;
  readonly orderby?: string;
  readonly categories?: string;
  readonly tags?: string;
  readonly _fields?: string;
}

/**
 * Enhanced post data with medical-specific transformations
 */
export interface EnhancedPost extends WPPost {
  readonly featuredImageUrl: string | null;
  readonly plainTextExcerpt: string;
  readonly truncatedExcerpt: string;
  readonly formattedDate: string;
  readonly readingTime: number; // Estimated reading time in minutes
}

/**
 * Optimized post fetching with field selection and batching
 */
export const fetchPosts = async (params: PostsQueryParams = {}): Promise<WPPost[]> => {
  // Set default fields to minimize response size
  const defaultFields = params._fields || 'id,title,excerpt,date,link,_links';
  const optimizedParams = {
    ...params,
    _fields: defaultFields,
    _embed: 'wp:featuredmedia',
  };

  // Use optimized batch request with high priority for main content
  return batchRequest('get', optimizeApiUrl(`${WP_ENDPOINTS.POSTS}`), {
    params: optimizedParams,
    priority: 'high',
  });
};

/**
 * Fetch a single post by ID with optimized field selection
 */
export const fetchPost = async (id: number, params: PostsQueryParams = {}): Promise<WPPost> => {
  // Set default fields for post detail view
  const defaultFields = params._fields || 'id,title,content,excerpt,date,modified,link,_links';
  const optimizedParams = {
    ...params,
    _fields: defaultFields,
  };

  return enhancedRequest('get', `${WP_ENDPOINTS.POSTS}/${id}`, {
    params: optimizedParams,
    priority: 'high',
  });
};

/**
 * Fetch posts by category with optimized parameters
 */
export const fetchPostsByCategory = async (categoryId: number, params: PostsQueryParams = {}): Promise<WPPost[]> => {
  const optimizedParams = {
    ...params,
    categories: categoryId.toString(),
    _fields: params._fields || 'id,title,excerpt,date,link',
  };

  return batchRequest('get', optimizeApiUrl(`${WP_ENDPOINTS.POSTS}`), {
    params: optimizedParams,
    priority: categoryId === 1 ? 'high' : 'medium', // Prioritize main category
  });
};

/**
 * Fetch featured posts with optimized parameters
 */
export const fetchFeaturedPosts = async (params: PostsQueryParams = {}): Promise<WPPost[]> => {
  const optimizedParams = {
    ...params,
    tags: '159', // Featured tag
    per_page: params.per_page || 5,
    _fields: 'id,title,excerpt,date',
  };

  return batchRequest('get', optimizeApiUrl(`${WP_ENDPOINTS.POSTS}`), {
    params: optimizedParams,
    priority: 'high',
  });
};

/**
 * Search posts with optimized parameters
 */
export const searchPosts = async (
  query: string,
  params: Omit<PostsQueryParams, 'search'> = {}
): Promise<EnhancedPost[]> => {
  if (!query.trim()) {
    return [];
  }

  const optimizedParams = {
    ...params,
    search: query.trim(),
    orderby: 'relevance',
    _fields: params._fields || 'id,title,excerpt,date,content.rendered',
    per_page: params.per_page || 20,
  };

  // Use the batch request for better performance
  const posts = await batchRequest('get', optimizeApiUrl(`${WP_ENDPOINTS.POSTS}`), {
    params: optimizedParams,
    priority: 'medium',
  });

  // Convert to EnhancedPost format to maintain backward compatibility
  return posts.map((post: WPPost) => {
    const plainTextExcerpt = post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : '';

    return {
      ...post,
      featuredImageUrl: null, // Simplified for now
      plainTextExcerpt,
      truncatedExcerpt: truncateText(plainTextExcerpt, 150),
      formattedDate: formatDate(post.date),
      readingTime: estimateReadingTime(post.content?.rendered || ''),
    };
  });
};

/**
 * Enhanced wrapper functions for backward compatibility
 * These functions provide the expected API interface
 */

/**
 * Get posts with enhanced features - main API function
 */
export const getPosts = async (params: PostsQueryParams = {}): Promise<EnhancedPost[]> => {
  const posts = await fetchPosts(params);

  // Transform to EnhancedPost format
  return posts.map((post) => {
    const plainTextExcerpt = post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : '';

    return {
      ...post,
      featuredImageUrl: null, // Simplified for now
      plainTextExcerpt,
      truncatedExcerpt: truncateText(plainTextExcerpt, 150),
      formattedDate: formatDate(post.date),
      readingTime: estimateReadingTime(post.content?.rendered || ''),
    };
  });
};

/**
 * Get a single post by ID with enhanced features
 */
export const getPost = async (id: number, params: PostsQueryParams = {}): Promise<EnhancedPost> => {
  const post = await fetchPost(id, params);
  const plainTextExcerpt = post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : '';

  return {
    ...post,
    featuredImageUrl: null, // Simplified for now
    plainTextExcerpt,
    truncatedExcerpt: truncateText(plainTextExcerpt, 150),
    formattedDate: formatDate(post.date),
    readingTime: estimateReadingTime(post.content?.rendered || ''),
  };
};

/**
 * Get featured posts with enhanced features
 */
export const getFeaturedPosts = async (limit: number = 5, params: PostsQueryParams = {}): Promise<EnhancedPost[]> => {
  const posts = await fetchFeaturedPosts({ ...params, per_page: limit });

  // Transform to EnhancedPost format and prioritize sticky posts
  const enhancedPosts = posts.map((post) => {
    const plainTextExcerpt = post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : '';

    return {
      ...post,
      featuredImageUrl: null, // Simplified for now
      plainTextExcerpt,
      truncatedExcerpt: truncateText(plainTextExcerpt, 150),
      formattedDate: formatDate(post.date),
      readingTime: estimateReadingTime(post.content?.rendered || ''),
    };
  });

  // Sort to prioritize sticky posts
  return enhancedPosts
    .sort((a, b) => {
      if (a.sticky && !b.sticky) return -1;
      if (!a.sticky && b.sticky) return 1;
      return 0;
    })
    .slice(0, limit);
};

/**
 * Transform a single post to enhanced format - utility function
 */
export const transformPost = (post: WPPost): EnhancedPost => {
  const plainTextExcerpt = post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : '';

  return {
    ...post,
    featuredImageUrl: null, // Simplified for now
    plainTextExcerpt,
    truncatedExcerpt: truncateText(plainTextExcerpt, 150),
    formattedDate: formatDate(post.date),
    readingTime: estimateReadingTime(post.content?.rendered || ''),
  };
};

/**
 * Helper function to strip HTML tags
 */
function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Helper function to truncate text
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Helper function to format date
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Helper function to estimate reading time
 */
function estimateReadingTime(content: string): number {
  const words = stripHtml(content).split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200)); // Assuming 200 words per minute
}

/**
 * Optimized posts atom for homepage
 * Uses field selection and cached response
 */
export const listPostsAtom = atom(async () => {
  return fetchPosts({
    per_page: 10,
    _fields: 'id,title,excerpt,date,link',
  });
});

/**
 * Optimized featured posts atom
 */
export const featuredPostsAtom = atom(async () => {
  return fetchFeaturedPosts();
});

/**
 * Post by ID atom family
 */
export const postAtomFamily = atomFamily((id: number) => {
  return atom(async () => {
    return fetchPost(id);
  });
});

/**
 * Posts by category atom family
 */
export const postsByCategoryAtomFamily = atomFamily((categoryId: number) => {
  return atom(async () => {
    return fetchPostsByCategory(categoryId, {
      per_page: 10,
    });
  });
});

// Legacy exports for backward compatibility
export const postsAtomFamily = listPostsAtom;
export const postsAtom = listPostsAtom;
