/**
 * Medical Search API
 * Handles comprehensive search across all medical content types
 */

import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { WPSearchResult } from './wp-types';
import { FetchOptions } from './cache';
import { fetchSearchResults, createListAtomFamily } from './common';
import { searchPosts, EnhancedPost } from './posts';
import { searchServices, EnhancedService } from './services';
import { searchDepartments, EnhancedDepartment } from './departments';
import { searchDoctors, EnhancedDoctor } from './doctors';

/**
 * Interface for search query parameters
 */
export interface SearchQueryParams {
  readonly per_page?: number;
  readonly page?: number;
  readonly type?: 'post' | 'page' | 'info-bacsi' | string;
  readonly subtype?: string;
}

/**
 * Enhanced search result with medical context
 */
export interface EnhancedSearchResult extends WPSearchResult {
  readonly category: 'post' | 'service' | 'department' | 'doctor' | 'other';
  readonly relevanceScore: number;
  readonly snippet: string;
  readonly featuredImageUrl?: string;
  readonly formattedDate?: string;
  readonly priority: number; // For ordering results by medical importance
}

/**
 * Comprehensive search results interface
 */
export interface ComprehensiveSearchResults {
  readonly query: string;
  readonly totalResults: number;
  readonly posts: readonly EnhancedPost[];
  readonly services: readonly EnhancedService[];
  readonly departments: readonly EnhancedDepartment[];
  readonly doctors: readonly EnhancedDoctor[];
  readonly other: readonly EnhancedSearchResult[];
  readonly suggestions: readonly string[];
}

/**
 * Search statistics interface
 */
export interface SearchStats {
  readonly totalSearches: number;
  readonly popularQueries: readonly string[];
  readonly categoryDistribution: Record<string, number>;
  readonly averageResultsPerQuery: number;
}

/**
 * Transform raw search result to enhanced result
 */
export const transformSearchResult = (result: WPSearchResult): EnhancedSearchResult => {
  // Determine category based on type
  let category: EnhancedSearchResult['category'] = 'other';
  let priority = 5;

  switch (result.type) {
    case 'post':
      category = 'post';
      priority = 3;
      break;
    case 'page':
      // Could be service or department based on subtype
      if (result.subtype === 'service') {
        category = 'service';
        priority = 2;
      } else if (result.subtype === 'department') {
        category = 'department';
        priority = 1;
      } else {
        category = 'other';
        priority = 4;
      }
      break;
    case 'info-bacsi':
      category = 'doctor';
      priority = 1; // Doctors are high priority in medical search
      break;
  }

  // Calculate relevance score (simplified)
  const titleLength = result.title.length;
  const relevanceScore = Math.max(0, 100 - titleLength * 0.5);

  // Create snippet from title
  const snippet = result.title.length > 100 ? result.title.substring(0, 97) + '...' : result.title;

  return {
    ...result,
    category,
    relevanceScore,
    snippet,
    priority,
  };
};

/**
 * Basic search using WordPress search API
 */
export const getSearch = async (
  keyword: string,
  params: SearchQueryParams = {},
  options?: FetchOptions
): Promise<EnhancedSearchResult[]> => {
  if (!keyword.trim()) {
    return [];
  }

  const results = await fetchSearchResults(keyword, params, options);
  return results.map(transformSearchResult);
};

/**
 * Comprehensive search across all medical content types
 */
export const getComprehensiveSearch = async (
  query: string,
  options?: FetchOptions
): Promise<ComprehensiveSearchResults> => {
  if (!query.trim()) {
    return {
      query: query.trim(),
      totalResults: 0,
      posts: [],
      services: [],
      departments: [],
      doctors: [],
      other: [],
      suggestions: [],
    };
  }

  const trimmedQuery = query.trim();

  // Perform parallel searches across all content types
  const [posts, services, departments, doctors, otherResults] = await Promise.allSettled([
    searchPosts(trimmedQuery, { per_page: 20 }, options),
    searchServices(trimmedQuery, { per_page: 20 }, options),
    searchDepartments(trimmedQuery, { per_page: 20 }, options),
    searchDoctors(trimmedQuery, { per_page: 20 }, options),
    getSearch(trimmedQuery, { per_page: 50 }, options),
  ]);

  // Extract successful results
  const postsResults = posts.status === 'fulfilled' ? posts.value : [];
  const servicesResults = services.status === 'fulfilled' ? services.value : [];
  const departmentsResults = departments.status === 'fulfilled' ? departments.value : [];
  const doctorsResults = doctors.status === 'fulfilled' ? doctors.value : [];
  const otherSearchResults = otherResults.status === 'fulfilled' ? otherResults.value : [];

  // Filter out results that are already included in specific categories
  const specificIds = new Set([
    ...postsResults.map((p) => p.id),
    ...servicesResults.map((s) => s.id),
    ...departmentsResults.map((d) => d.id),
    ...doctorsResults.map((d) => d.id),
  ]);

  const filteredOtherResults = otherSearchResults.filter((result) => !specificIds.has(result.id));

  const totalResults =
    postsResults.length +
    servicesResults.length +
    departmentsResults.length +
    doctorsResults.length +
    filteredOtherResults.length;

  // Generate search suggestions based on query
  const suggestions = generateSearchSuggestions(trimmedQuery);

  return {
    query: trimmedQuery,
    totalResults,
    posts: postsResults,
    services: servicesResults,
    departments: departmentsResults,
    doctors: doctorsResults,
    other: filteredOtherResults,
    suggestions,
  };
};

/**
 * Generate search suggestions for medical queries
 */
export const generateSearchSuggestions = (query: string): string[] => {
  const lowerQuery = query.toLowerCase();
  const suggestions: string[] = [];

  // Medical specialties suggestions
  const specialties = [
    'tim mạch',
    'nội khoa',
    'ngoại khoa',
    'sản phụ khoa',
    'nhi khoa',
    'mắt',
    'tai mũi họng',
    'da liễu',
    'thần kinh',
    'ung bướu',
    'xét nghiệm',
    'chẩn đoán hình ảnh',
    'cấp cứu',
    'phục hồi chức năng',
  ];

  specialties.forEach((specialty) => {
    if (specialty.includes(lowerQuery) || lowerQuery.includes(specialty)) {
      suggestions.push(specialty);
    }
  });

  // Common medical terms
  const medicalTerms = [
    'khám sức khỏe',
    'xét nghiệm máu',
    'siêu âm',
    'x-quang',
    'nội soi',
    'phẫu thuật',
    'điều trị',
    'tư vấn',
    'đặt lịch khám',
  ];

  medicalTerms.forEach((term) => {
    if (term.includes(lowerQuery) && !suggestions.includes(term)) {
      suggestions.push(term);
    }
  });

  return suggestions.slice(0, 5); // Limit to 5 suggestions
};

/**
 * Search with autocomplete suggestions
 */
export const getSearchWithSuggestions = async (
  query: string,
  options?: FetchOptions
): Promise<{
  results: EnhancedSearchResult[];
  suggestions: string[];
}> => {
  const [results, suggestions] = await Promise.all([
    getSearch(query, {}, options),
    Promise.resolve(generateSearchSuggestions(query)),
  ]);

  return { results, suggestions };
};

/**
 * Get popular search terms (mock implementation)
 */
export const getPopularSearchTerms = async (): Promise<string[]> => {
  // In a real implementation, this would fetch from analytics
  return [
    'khám tim mạch',
    'xét nghiệm máu',
    'siêu âm thai',
    'nội soi dạ dày',
    'chụp x-quang',
    'khám mắt',
    'điều trị ung thư',
    'phẫu thuật',
    'cấp cứu',
    'tư vấn dinh dưỡng',
  ];
};

/**
 * Atom families for reactive state management
 */

// Basic search atom family
export const searchAtomFamily = atomFamily((keyword: string) => atom(async () => await getSearch(keyword)));

// Comprehensive search atom family
export const comprehensiveSearchAtomFamily = atomFamily((query: string) =>
  atom(async () => await getComprehensiveSearch(query))
);

// Search with suggestions atom family
export const searchWithSuggestionsAtomFamily = atomFamily((query: string) =>
  atom(async () => await getSearchWithSuggestions(query))
);

// Popular search terms atom
export const popularSearchTermsAtom = atom(async () => await getPopularSearchTerms());

// Legacy exports for backward compatibility
export const searchAtom = searchAtomFamily;
