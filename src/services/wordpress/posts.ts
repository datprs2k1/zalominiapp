/**
 * WordPress Posts service module
 */

import { WordPressClient } from './client';
import { WPPost, WPQueryParams, WPRequestOptions, WPCollectionResponse } from './types';

export interface PostsQueryParams extends WPQueryParams {
  type?: string;
  categories?: number | number[];
  tags?: number | number[];
  author?: number;
  sticky?: boolean;
  format?: string;
}

export interface PostQueryOptions extends WPRequestOptions {
  normalize?: boolean;
}

/**
 * Posts service class
 */
export class PostsService {
  constructor(private client: WordPressClient) {}

  /**
   * Get multiple posts
   */
  async getPosts(
    params: PostsQueryParams = {},
    options: PostQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPost>> {
    const defaultParams: PostsQueryParams = {
      _embed: 'wp:term,wp:featuredmedia',
      per_page: 10,
      status: 'publish',
      ...params,
    };

    return this.client.getCollection<WPPost>('posts', defaultParams, options);
  }

  /**
   * Get single post by ID
   */
  async getPost(
    id: number,
    params: WPQueryParams = {},
    options: PostQueryOptions = {}
  ): Promise<WPPost> {
    const defaultParams: WPQueryParams = {
      _embed: 'wp:term,wp:featuredmedia',
      ...params,
    };

    return this.client.getById<WPPost>('post', id, defaultParams, options);
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(
    categoryId: number,
    params: PostsQueryParams = {},
    options: PostQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPost>> {
    return this.getPosts({ ...params, categories: [categoryId] }, options);
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(
    tagId: number,
    params: PostsQueryParams = {},
    options: PostQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPost>> {
    return this.getPosts({ ...params, tags: [tagId] }, options);
  }

  /**
   * Get posts by author
   */
  async getPostsByAuthor(
    authorId: number,
    params: PostsQueryParams = {},
    options: PostQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPost>> {
    return this.getPosts({ ...params, author: authorId }, options);
  }

  /**
   * Get sticky posts
   */
  async getStickyPosts(
    params: PostsQueryParams = {},
    options: PostQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPost>> {
    return this.getPosts({ ...params, sticky: true }, options);
  }

  /**
   * Search posts
   */
  async searchPosts(
    query: string,
    params: PostsQueryParams = {},
    options: PostQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPost>> {
    return this.getPosts({ ...params, search: query }, options);
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(
    count: number = 5,
    params: PostsQueryParams = {},
    options: PostQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPost>> {
    return this.getPosts({
      ...params,
      per_page: count,
      orderby: 'date',
      order: 'desc',
    }, options);
  }

  /**
   * Get popular posts (by comment count)
   */
  async getPopularPosts(
    count: number = 5,
    params: PostsQueryParams = {},
    options: PostQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPost>> {
    return this.getPosts({
      ...params,
      per_page: count,
      orderby: 'comment_count',
      order: 'desc',
    }, options);
  }

  /**
   * Get posts with featured images
   */
  async getPostsWithFeaturedImages(
    params: PostsQueryParams = {},
    options: PostQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPost>> {
    // Filter posts that have featured media
    const response = await this.getPosts(params, options);
    
    const filteredPosts = response.items.filter(post => 
      post.featured_media > 0 || 
      (post._embedded?.['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0)
    );

    return {
      ...response,
      items: filteredPosts,
      total: filteredPosts.length,
    };
  }

  /**
   * Get related posts (by categories)
   */
  async getRelatedPosts(
    postId: number,
    count: number = 5,
    options: PostQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPost>> {
    // First get the post to find its categories
    const post = await this.getPost(postId, {}, options);
    
    if (!post.categories || post.categories.length === 0) {
      return {
        items: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    // Get posts from the same categories, excluding the current post
    return this.getPosts({
      categories: post.categories,
      exclude: [postId],
      per_page: count,
      orderby: 'date',
      order: 'desc',
    }, options);
  }

  /**
   * Invalidate posts cache
   */
  invalidateCache(params: PostsQueryParams = {}): void {
    this.client.invalidateCache('posts', params);
  }

  /**
   * Invalidate single post cache
   */
  invalidatePostCache(id: number, params: WPQueryParams = {}): void {
    this.client.invalidateCache('post', { ...params, id });
  }
}

/**
 * Create posts service instance
 */
export function createPostsService(client: WordPressClient): PostsService {
  return new PostsService(client);
}

/**
 * Utility functions for posts
 */
export const PostsUtils = {
  /**
   * Extract post excerpt with fallback to content
   */
  getExcerpt: (post: WPPost, maxLength: number = 150): string => {
    if (post.excerpt?.rendered) {
      const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
      if (excerpt) {
        return excerpt.length > maxLength ? excerpt.substring(0, maxLength) + '...' : excerpt;
      }
    }

    if (post.content?.rendered) {
      const content = post.content.rendered.replace(/<[^>]*>/g, '').trim();
      return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
    }

    return '';
  },

  /**
   * Get featured image URL with fallback sizes
   */
  getFeaturedImageUrl: (post: WPPost, size: string = 'medium'): string | null => {
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    if (!featuredMedia) return null;

    // Try to get specific size
    if (featuredMedia.media_details?.sizes?.[size]) {
      return featuredMedia.media_details.sizes[size].source_url;
    }

    // Fallback to source URL
    return featuredMedia.source_url || null;
  },

  /**
   * Get post categories
   */
  getCategories: (post: WPPost): Array<{ id: number; name: string; slug: string }> => {
    const categories = post._embedded?.['wp:term']?.find(termGroup => 
      termGroup.length > 0 && termGroup[0].taxonomy === 'category'
    );
    
    return categories?.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })) || [];
  },

  /**
   * Get post tags
   */
  getTags: (post: WPPost): Array<{ id: number; name: string; slug: string }> => {
    const tags = post._embedded?.['wp:term']?.find(termGroup => 
      termGroup.length > 0 && termGroup[0].taxonomy === 'post_tag'
    );
    
    return tags?.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })) || [];
  },

  /**
   * Format post date
   */
  formatDate: (post: WPPost, locale: string = 'en-US'): string => {
    return new Date(post.date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * Get reading time estimate
   */
  getReadingTime: (post: WPPost, wordsPerMinute: number = 200): number => {
    if (!post.content?.rendered) return 0;
    
    const text = post.content.rendered.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    
    return Math.ceil(wordCount / wordsPerMinute);
  },
};
