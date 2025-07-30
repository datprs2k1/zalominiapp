/**
 * Unit tests for the enhanced posts service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import { getPosts, getPost, getFeaturedPosts, searchPosts, transformPost, EnhancedPost } from '../posts';
import { fetchPostsGeneric as fetchPosts, fetchPostGeneric as fetchPost } from '../common';
import { WPPost } from '../wp-types';

// Mock the common module
vi.mock('../common', () => ({
  fetchPosts: vi.fn(),
  fetchPost: vi.fn(),
  filterMedicalContent: vi.fn((posts) => posts),
  sortByMedicalPriority: vi.fn((posts) => posts),
  extractFeaturedImageUrl: vi.fn(() => 'https://example.com/image.jpg'),
  extractCategories: vi.fn(() => [{ id: 1, name: 'Cardiology', slug: 'cardiology' }]),
  extractPlainText: vi.fn((html) => html.replace(/<[^>]*>/g, '')),
  truncateText: vi.fn((text, length) => (text.length > length ? text.substring(0, length) + '...' : text)),
  formatMedicalDate: vi.fn(() => '15 tháng 7, 2024'),
  createListAtomFamily: vi.fn(),
  createItemAtomFamily: vi.fn(),
}));

const mockFetchPosts = fetchPosts as MockedFunction<typeof fetchPosts>;
const mockFetchPost = fetchPost as MockedFunction<typeof fetchPost>;

describe('Enhanced Posts Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockWPPost: WPPost = {
    id: 1,
    title: { rendered: 'Heart Health Tips' },
    content: { rendered: '<p>This is a comprehensive guide to heart health...</p>' },
    excerpt: { rendered: '<p>Learn about heart health...</p>' },
    date: '2024-07-15T10:00:00Z',
    date_gmt: '2024-07-15T10:00:00Z',
    modified: '2024-07-15T10:00:00Z',
    modified_gmt: '2024-07-15T10:00:00Z',
    slug: 'heart-health-tips',
    status: 'publish',
    type: 'post',
    link: 'https://example.com/heart-health-tips',
    author: 1,
    featured_media: 123,
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    template: '',
    format: 'standard',
    meta: {},
    categories: [1],
    tags: [],
    _embedded: {
      'wp:featuredmedia': [
        {
          id: 123,
          source_url: 'https://example.com/heart-image.jpg',
          alt_text: 'Heart health illustration',
        },
      ],
      'wp:term': [
        [
          {
            id: 1,
            name: 'Cardiology',
            slug: 'cardiology',
            taxonomy: 'category',
          },
        ],
      ],
    },
  };

  describe('transformPost', () => {
    it('should transform WP post to enhanced post', () => {
      const enhanced = transformPost(mockWPPost);

      expect(enhanced).toMatchObject({
        id: 1,
        title: { rendered: 'Heart Health Tips' },
        featuredImageUrl: 'https://example.com/image.jpg',
        categories: [{ id: 1, name: 'Cardiology', slug: 'cardiology' }],
        formattedDate: '15 tháng 7, 2024',
      });

      expect(enhanced.readingTime).toBeGreaterThan(0);
      expect(enhanced.plainTextExcerpt).toBeDefined();
      expect(enhanced.truncatedExcerpt).toBeDefined();
    });

    it('should calculate reading time correctly', () => {
      const longContent = 'word '.repeat(1000); // 1000 words
      const postWithLongContent = {
        ...mockWPPost,
        content: { rendered: longContent },
      };

      const enhanced = transformPost(postWithLongContent);
      expect(enhanced.readingTime).toBe(5); // 1000 words / 200 words per minute = 5 minutes
    });

    it('should handle minimum reading time', () => {
      const shortContent = 'Short content';
      const postWithShortContent = {
        ...mockWPPost,
        content: { rendered: shortContent },
      };

      const enhanced = transformPost(postWithShortContent);
      expect(enhanced.readingTime).toBe(1); // Minimum 1 minute
    });
  });

  describe('getPosts', () => {
    it('should fetch and enhance posts', async () => {
      mockFetchPosts.mockResolvedValueOnce([mockWPPost]);

      const posts = await getPosts({ per_page: 10 });

      expect(mockFetchPosts).toHaveBeenCalledWith({ per_page: 10 });
      expect(posts).toHaveLength(1);
      expect(posts[0]).toHaveProperty('featuredImageUrl');
      expect(posts[0]).toHaveProperty('readingTime');
    });

    it('should handle empty results', async () => {
      mockFetchPosts.mockResolvedValueOnce([]);

      const posts = await getPosts();

      expect(posts).toHaveLength(0);
    });

    it('should pass query parameters correctly', async () => {
      mockFetchPosts.mockResolvedValueOnce([]);

      await getPosts({
        type: 'post',
        per_page: 5,
        page: 2,
        category: 'cardiology',
      });

      expect(mockFetchPosts).toHaveBeenCalledWith({
        type: 'post',
        per_page: 5,
        page: 2,
        category: 'cardiology',
      });
    });
  });

  describe('getPost', () => {
    it('should fetch and enhance single post', async () => {
      mockFetchPost.mockResolvedValueOnce(mockWPPost);

      const post = await getPost(1);

      expect(mockFetchPost).toHaveBeenCalledWith(1, undefined);
      expect(post).toHaveProperty('featuredImageUrl');
      expect(post).toHaveProperty('readingTime');
      expect(post.id).toBe(1);
    });

    it('should pass options to fetch function', async () => {
      mockFetchPost.mockResolvedValueOnce(mockWPPost);
      const options = { cache: false };

      await getPost(1, options);

      expect(mockFetchPost).toHaveBeenCalledWith(1, options);
    });
  });

  describe('getFeaturedPosts', () => {
    it('should prioritize sticky posts', async () => {
      const stickyPost = { ...mockWPPost, id: 1, sticky: true };
      const regularPost1 = { ...mockWPPost, id: 2, sticky: false };
      const regularPost2 = { ...mockWPPost, id: 3, sticky: false };

      mockFetchPosts.mockResolvedValueOnce([regularPost1, stickyPost, regularPost2]);

      const featured = await getFeaturedPosts(2);

      expect(featured).toHaveLength(2);
      expect(featured[0].id).toBe(1); // Sticky post should be first
      expect(featured[0].sticky).toBe(true);
    });

    it('should limit results correctly', async () => {
      const posts = Array.from({ length: 10 }, (_, i) => ({
        ...mockWPPost,
        id: i + 1,
        sticky: false,
      }));

      mockFetchPosts.mockResolvedValueOnce(posts);

      const featured = await getFeaturedPosts(3);

      expect(featured).toHaveLength(3);
    });

    it('should handle mixed sticky and regular posts', async () => {
      const stickyPost1 = { ...mockWPPost, id: 1, sticky: true };
      const stickyPost2 = { ...mockWPPost, id: 2, sticky: true };
      const regularPost = { ...mockWPPost, id: 3, sticky: false };

      mockFetchPosts.mockResolvedValueOnce([regularPost, stickyPost1, stickyPost2]);

      const featured = await getFeaturedPosts(3);

      expect(featured).toHaveLength(3);
      expect(featured[0].sticky).toBe(true);
      expect(featured[1].sticky).toBe(true);
      expect(featured[2].sticky).toBe(false);
    });
  });

  describe('searchPosts', () => {
    it('should search posts with query', async () => {
      mockFetchPosts.mockResolvedValueOnce([mockWPPost]);

      const results = await searchPosts('heart health');

      expect(mockFetchPosts).toHaveBeenCalledWith({
        search: 'heart health',
        orderby: 'relevance',
      });
      expect(results).toHaveLength(1);
    });

    it('should return empty array for empty query', async () => {
      const results = await searchPosts('');

      expect(mockFetchPosts).not.toHaveBeenCalled();
      expect(results).toHaveLength(0);
    });

    it('should trim whitespace from query', async () => {
      mockFetchPosts.mockResolvedValueOnce([]);

      await searchPosts('  heart health  ');

      expect(mockFetchPosts).toHaveBeenCalledWith({
        search: 'heart health',
        orderby: 'relevance',
      });
    });

    it('should pass additional parameters', async () => {
      mockFetchPosts.mockResolvedValueOnce([]);

      await searchPosts('heart', { per_page: 5, page: 2 });

      expect(mockFetchPosts).toHaveBeenCalledWith({
        search: 'heart',
        orderby: 'relevance',
        per_page: 5,
        page: 2,
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle fetch errors gracefully', async () => {
      const error = new Error('Network error');
      mockFetchPosts.mockRejectedValueOnce(error);

      await expect(getPosts()).rejects.toThrow('Network error');
    });

    it('should handle single post fetch errors', async () => {
      const error = new Error('Post not found');
      mockFetchPost.mockRejectedValueOnce(error);

      await expect(getPost(999)).rejects.toThrow('Post not found');
    });
  });

  describe('Data Validation', () => {
    it('should handle posts without embedded data', () => {
      const postWithoutEmbedded = {
        ...mockWPPost,
        _embedded: undefined,
      };

      const enhanced = transformPost(postWithoutEmbedded);

      expect(enhanced.featuredImageUrl).toBe('https://example.com/image.jpg'); // Mocked return
      expect(enhanced.categories).toEqual([{ id: 1, name: 'Cardiology', slug: 'cardiology' }]); // Mocked return
    });

    it('should handle posts with empty content', () => {
      const postWithEmptyContent = {
        ...mockWPPost,
        content: { rendered: '' },
        excerpt: { rendered: '' },
      };

      const enhanced = transformPost(postWithEmptyContent);

      expect(enhanced.plainTextExcerpt).toBe('');
      expect(enhanced.truncatedExcerpt).toBe('');
      expect(enhanced.readingTime).toBe(1); // Minimum reading time
    });
  });
});
