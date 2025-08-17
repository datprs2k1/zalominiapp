/**
 * WordPress Search service module
 */

import { WordPressClient } from './client';
import { WPSearchResult, WPQueryParams, WPRequestOptions, WPPost, WPPage, WPDoctor } from './types';

export interface SearchQueryParams extends WPQueryParams {
  type?: 'post' | 'page' | 'attachment' | string;
  subtype?: string;
}

export interface SearchOptions extends WPRequestOptions {
  includeContent?: boolean;
  groupByType?: boolean;
}

export interface SearchResultGroup {
  type: string;
  subtype?: string;
  results: WPSearchResult[];
  total: number;
}

export interface EnhancedSearchResult extends WPSearchResult {
  excerpt?: string;
  date?: string;
  author?: string;
  featuredImage?: string;
  relevanceScore?: number;
}

/**
 * Search service class
 */
export class SearchService {
  constructor(private client: WordPressClient) {}

  /**
   * Basic search across all content types
   */
  async search(
    query: string,
    params: SearchQueryParams = {},
    options: SearchOptions = {}
  ): Promise<WPSearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    const defaultParams: SearchQueryParams = {
      search: query.trim(),
      _embed: 'true',
      per_page: 100,
      ...params,
    };

    return this.client.search(query, defaultParams, options);
  }

  /**
   * Search with enhanced results (includes excerpts, dates, etc.)
   */
  async searchEnhanced(
    query: string,
    params: SearchQueryParams = {},
    options: SearchOptions = {}
  ): Promise<EnhancedSearchResult[]> {
    const results = await this.search(query, params, options);
    
    // Enhance results with additional information
    const enhancedResults = await Promise.all(
      results.map(async (result) => {
        const enhanced: EnhancedSearchResult = {
          ...result,
          relevanceScore: this.calculateRelevanceScore(result, query),
        };

        // Try to get additional details based on type
        try {
          if (result.type === 'post') {
            const post = await this.client.getById<WPPost>('post', result.id, { _embed: 'wp:featuredmedia' });
            enhanced.excerpt = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim();
            enhanced.date = post.date;
            enhanced.featuredImage = this.extractFeaturedImageUrl(post._embedded);
          } else if (result.type === 'page') {
            const page = await this.client.getById<WPPage>('page', result.id, { _embed: 'wp:featuredmedia' });
            enhanced.excerpt = page.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim();
            enhanced.date = page.date;
            enhanced.featuredImage = this.extractFeaturedImageUrl(page._embedded);
          }
        } catch (error) {
          // If we can't get additional details, continue with basic result
          console.warn(`Could not enhance search result ${result.id}:`, error);
        }

        return enhanced;
      })
    );

    // Sort by relevance score
    return enhancedResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  /**
   * Search grouped by content type
   */
  async searchGrouped(
    query: string,
    params: SearchQueryParams = {},
    options: SearchOptions = {}
  ): Promise<SearchResultGroup[]> {
    const results = await this.search(query, params, options);
    
    const groups: Record<string, SearchResultGroup> = {};

    results.forEach(result => {
      const key = `${result.type}-${result.subtype || 'default'}`;
      
      if (!groups[key]) {
        groups[key] = {
          type: result.type,
          subtype: result.subtype,
          results: [],
          total: 0,
        };
      }

      groups[key].results.push(result);
      groups[key].total++;
    });

    return Object.values(groups).sort((a, b) => b.total - a.total);
  }

  /**
   * Search posts only
   */
  async searchPosts(
    query: string,
    params: SearchQueryParams = {},
    options: SearchOptions = {}
  ): Promise<WPSearchResult[]> {
    return this.search(query, { ...params, type: 'post' }, options);
  }

  /**
   * Search pages only
   */
  async searchPages(
    query: string,
    params: SearchQueryParams = {},
    options: SearchOptions = {}
  ): Promise<WPSearchResult[]> {
    return this.search(query, { ...params, type: 'page' }, options);
  }

  /**
   * Search with suggestions (fuzzy matching)
   */
  async searchWithSuggestions(
    query: string,
    params: SearchQueryParams = {},
    options: SearchOptions = {}
  ): Promise<{
    results: WPSearchResult[];
    suggestions: string[];
    correctedQuery?: string;
  }> {
    const originalResults = await this.search(query, params, options);
    
    // If we have good results, return them
    if (originalResults.length >= 3) {
      return {
        results: originalResults,
        suggestions: [],
      };
    }

    // Try to generate suggestions for better results
    const suggestions = this.generateSearchSuggestions(query);
    let bestResults = originalResults;
    let correctedQuery: string | undefined;

    // Try each suggestion to see if we get better results
    for (const suggestion of suggestions) {
      const suggestionResults = await this.search(suggestion, params, options);
      if (suggestionResults.length > bestResults.length) {
        bestResults = suggestionResults;
        correctedQuery = suggestion;
        break;
      }
    }

    return {
      results: bestResults,
      suggestions: suggestions.filter(s => s !== correctedQuery),
      correctedQuery,
    };
  }

  /**
   * Get popular search terms (would need to be implemented with analytics)
   */
  async getPopularSearchTerms(limit: number = 10): Promise<Array<{ term: string; count: number }>> {
    // This would typically be implemented with search analytics
    // For now, return empty array
    return [];
  }

  /**
   * Search autocomplete suggestions
   */
  async getSearchSuggestions(
    partialQuery: string,
    limit: number = 5
  ): Promise<string[]> {
    if (partialQuery.length < 2) {
      return [];
    }

    // Get search results for the partial query
    const results = await this.search(partialQuery, { per_page: 20 });
    
    // Extract unique titles that start with or contain the query
    const suggestions = new Set<string>();
    
    results.forEach(result => {
      const title = result.title.toLowerCase();
      const query = partialQuery.toLowerCase();
      
      if (title.includes(query)) {
        // Extract words from title that might be good suggestions
        const words = title.split(/\s+/);
        words.forEach(word => {
          if (word.startsWith(query) && word.length > query.length) {
            suggestions.add(word);
          }
        });
        
        // Also add the full title if it's not too long
        if (result.title.length <= 50) {
          suggestions.add(result.title);
        }
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Advanced search with filters
   */
  async advancedSearch(
    query: string,
    filters: {
      types?: string[];
      dateRange?: { start: string; end: string };
      author?: number;
      categories?: number[];
      tags?: number[];
    } = {},
    options: SearchOptions = {}
  ): Promise<WPSearchResult[]> {
    let results = await this.search(query, {}, options);

    // Apply filters
    if (filters.types && filters.types.length > 0) {
      results = results.filter(result => filters.types!.includes(result.type));
    }

    // Additional filtering would require getting full objects
    // This is a simplified implementation
    return results;
  }

  private calculateRelevanceScore(result: WPSearchResult, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    const titleLower = result.title.toLowerCase();

    // Exact title match gets highest score
    if (titleLower === queryLower) {
      score += 100;
    }
    // Title starts with query
    else if (titleLower.startsWith(queryLower)) {
      score += 80;
    }
    // Title contains query
    else if (titleLower.includes(queryLower)) {
      score += 60;
    }

    // Boost score for certain content types
    if (result.type === 'page') {
      score += 10; // Pages might be more important
    }

    // Boost score based on URL structure (shorter URLs might be more important)
    if (result.url.split('/').length <= 4) {
      score += 5;
    }

    return score;
  }

  private extractFeaturedImageUrl(embedded: any): string | undefined {
    return embedded?.['wp:featuredmedia']?.[0]?.source_url;
  }

  private generateSearchSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    
    // Remove common typos and variations
    const corrections: Record<string, string> = {
      'docter': 'doctor',
      'servise': 'service',
      'departement': 'department',
      'appointement': 'appointment',
      'medecine': 'medicine',
      'treatement': 'treatment',
    };

    const words = query.toLowerCase().split(/\s+/);
    const correctedWords = words.map(word => corrections[word] || word);
    
    if (correctedWords.join(' ') !== query.toLowerCase()) {
      suggestions.push(correctedWords.join(' '));
    }

    // Add partial word suggestions
    if (words.length === 1 && words[0].length >= 3) {
      const word = words[0];
      // Common medical/healthcare terms that might be relevant
      const commonTerms = [
        'doctor', 'service', 'department', 'appointment', 'treatment',
        'medicine', 'health', 'care', 'clinic', 'hospital', 'surgery',
        'therapy', 'consultation', 'diagnosis', 'emergency'
      ];
      
      commonTerms.forEach(term => {
        if (term.startsWith(word) || term.includes(word)) {
          suggestions.push(term);
        }
      });
    }

    return suggestions.slice(0, 5);
  }
}

/**
 * Create search service instance
 */
export function createSearchService(client: WordPressClient): SearchService {
  return new SearchService(client);
}

/**
 * Utility functions for search
 */
export const SearchUtils = {
  /**
   * Highlight search terms in text
   */
  highlightSearchTerms: (text: string, query: string, className: string = 'highlight'): string => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, `<span class="${className}">$1</span>`);
  },

  /**
   * Extract search snippet from content
   */
  extractSnippet: (content: string, query: string, maxLength: number = 150): string => {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    
    if (!query.trim()) {
      return cleanContent.length > maxLength 
        ? cleanContent.substring(0, maxLength) + '...' 
        : cleanContent;
    }

    const queryIndex = cleanContent.toLowerCase().indexOf(query.toLowerCase());
    
    if (queryIndex === -1) {
      return cleanContent.length > maxLength 
        ? cleanContent.substring(0, maxLength) + '...' 
        : cleanContent;
    }

    // Try to center the query in the snippet
    const start = Math.max(0, queryIndex - Math.floor(maxLength / 2));
    const end = Math.min(cleanContent.length, start + maxLength);
    
    let snippet = cleanContent.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < cleanContent.length) snippet = snippet + '...';
    
    return snippet;
  },

  /**
   * Clean and normalize search query
   */
  normalizeQuery: (query: string): string => {
    return query
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .toLowerCase();
  },

  /**
   * Check if query is too short or invalid
   */
  isValidQuery: (query: string, minLength: number = 2): boolean => {
    const normalized = SearchUtils.normalizeQuery(query);
    return normalized.length >= minLength;
  },
};
