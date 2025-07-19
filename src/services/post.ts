import api from './api';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { SERVICE_ID, DEPARTMENT_ID } from '@/config';

// Define proper types for API responses
interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
  [key: string]: any; // For other WP fields
}

interface WPPage extends WPPost {
  parent: number;
}

interface WPDoctor {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
  [key: string]: any;
}

interface WPSearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
  [key: string]: any;
}

interface QueryParams {
  per_page?: number;
  type?: string;
  parent?: number | string;
  _embed?: string;
  search?: string;
  [key: string]: any;
}

interface FetchOptions {
  cache?: boolean;
  cacheTime?: number;
  abortSignal?: AbortSignal;
}

// Simple in-memory cache implementation
type CacheEntry = {
  data: any;
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();

const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Generic API fetch function with caching
const fetchWPData = async <T>(
  endpoint: string,
  params: QueryParams = {},
  options: FetchOptions = { cache: true, cacheTime: DEFAULT_CACHE_TIME }
): Promise<T> => {
  try {
    // Build URL with query parameters
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');

    const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
    const cacheKey = url;

    // Check cache if enabled
    if (options.cache) {
      const cachedData = cache.get(cacheKey);
      const now = Date.now();

      if (cachedData && now - cachedData.timestamp < (options.cacheTime || DEFAULT_CACHE_TIME)) {
        return cachedData.data as T;
      }
    }

    // Make API request
    const response = await api.get<T>(url, {
      signal: options.abortSignal,
    });

    const data = response.data || (response as unknown as T);

    // Store in cache if enabled
    if (options.cache) {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request was aborted');
    }

    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Clear cache entry for specific endpoint
const invalidateCache = (endpoint: string, params: QueryParams = {}) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
  cache.delete(url);
};

// Clear entire cache
const clearCache = () => {
  cache.clear();
};

const getPosts = async (
  { type, per_page, page }: { type?: string; per_page?: number; page?: number } = {},
  options?: FetchOptions
) => {
  return fetchWPData<WPPost[]>(
    'wp-json/wp/v2/posts',
    {
      _embed: 'wp:term,wp:featuredmedia',
      per_page,
      type,
      page,
    },
    options
  );
};

const getPost = async (id: number, options?: FetchOptions) => {
  return fetchWPData<WPPost>(
    `wp-json/wp/v2/posts/${id}`,
    {
      _embed: 'wp:term,wp:featuredmedia',
    },
    options
  );
};

const getServices = async ({ per_page }: { per_page?: number } = {}, options?: FetchOptions) => {
  return fetchWPData<WPPage[]>(
    'wp-json/wp/v2/pages',
    {
      type: 'page',
      parent: SERVICE_ID,
      per_page,
      _embed: 'wp:term,wp:featuredmedia',
    },
    options
  );
};

const getService = async (id: number, options?: FetchOptions) => {
  return fetchWPData<WPPage>(
    `wp-json/wp/v2/pages/${id}`,
    {
      _embed: 'wp:term,wp:featuredmedia',
    },
    options
  );
};

const getDepartments = async ({ per_page }: { per_page?: number } = {}, options?: FetchOptions) => {
  return fetchWPData<WPPage[]>(
    'wp-json/wp/v2/pages',
    {
      parent: DEPARTMENT_ID,
      _embed: 'wp:term,wp:featuredmedia',
      per_page,
    },
    options
  );
};

const getDepartment = async (id: number, options?: FetchOptions) => {
  return fetchWPData<WPPage>(
    `wp-json/wp/v2/pages/${id}`,
    {
      _embed: 'wp:term,wp:featuredmedia',
    },
    options
  );
};

const getDoctors = async (options?: FetchOptions) => {
  return fetchWPData<WPDoctor[]>(
    '/wp-json/wp/v2/info-bacsi',
    {
      _embed: 'wp:featuredmedia',
      per_page: 100,
    },
    options
  );
};

const getSearch = async (keyword: string, options?: FetchOptions) => {
  return fetchWPData<WPSearchResult[]>(
    '/wp-json/wp/v2/search',
    {
      search: keyword,
      _embed: 'true',
      per_page: 100,
    },
    options
  );
};

const getDoctor = async (id: number, options?: FetchOptions) => {
  return fetchWPData<WPDoctor>(
    `/wp-json/wp/v2/info-bacsi/${id}`,
    {
      _embed: 'wp:featuredmedia',
    },
    options
  );
};

// Use the same pattern for all atom families
const postsAtomFamily = atomFamily((entry: { type?: string; per_page?: number } = {}) =>
  atom(async () => await getPosts(entry))
);

const postAtomFamily = atomFamily((id: number) => atom(async () => await getPost(id)));

const serviceAtom = atomFamily((id: number) => atom(async () => await getService(id)));

const servicesAtom = atomFamily((entry: { per_page?: number } = {}) => atom(async () => await getServices(entry)));

const departmentsAtom = atomFamily((entry: { per_page?: number } = {}) =>
  atom(async () => await getDepartments(entry))
);

const departmentAtom = atomFamily((id: number) => atom(async () => await getDepartment(id)));

const doctorsAtom = atom(async () => await getDoctors());

const doctorAtomFamily = atomFamily((id: number) => atom(async () => await getDoctor(id)));

const searchAtom = atomFamily((keyword: string) => atom(async () => await getSearch(keyword)));

export {
  getPosts,
  postsAtomFamily,
  getPost,
  postAtomFamily,
  getService,
  serviceAtom,
  getServices,
  getDepartments,
  servicesAtom,
  departmentsAtom,
  departmentAtom,
  doctorsAtom,
  doctorAtomFamily,
  searchAtom,
  invalidateCache,
  clearCache,
};
