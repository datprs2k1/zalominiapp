/**
 * WordPress API types and interfaces
 */

// Base WordPress object interface
export interface WPBaseObject {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  type: string;
  link: string;
  [key: string]: any;
}

// WordPress rendered content interface
export interface WPRenderedContent {
  rendered: string;
  protected?: boolean;
}

// WordPress title interface
export interface WPTitle {
  rendered: string;
}

// WordPress excerpt interface
export interface WPExcerpt {
  rendered: string;
  protected?: boolean;
}

// WordPress featured media interface
export interface WPFeaturedMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: WPTitle;
  author: number;
  caption: WPRenderedContent;
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
}

// WordPress term interface
export interface WPTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
}

// WordPress embedded content interface
export interface WPEmbedded {
  'wp:featuredmedia'?: WPFeaturedMedia[];
  'wp:term'?: WPTerm[][];
  author?: WPUser[];
  replies?: WPComment[][];
}

// WordPress post interface
export interface WPPost extends WPBaseObject {
  title: WPTitle;
  content: WPRenderedContent;
  excerpt: WPExcerpt;
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _embedded?: WPEmbedded;
}

// WordPress page interface
export interface WPPage extends WPBaseObject {
  title: WPTitle;
  content: WPRenderedContent;
  excerpt: WPExcerpt;
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  template: string;
  meta: any[];
  _embedded?: WPEmbedded;
}

// WordPress user interface
export interface WPUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [size: string]: string;
  };
  meta: any[];
}

// WordPress comment interface
export interface WPComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  author_email: string;
  date: string;
  date_gmt: string;
  content: WPRenderedContent;
  link: string;
  status: string;
  type: string;
  author_avatar_urls: {
    [size: string]: string;
  };
  meta: any[];
}

// WordPress search result interface
export interface WPSearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
  _embedded?: WPEmbedded;
}

// Custom post type for doctors
export interface WPDoctor extends WPBaseObject {
  title: WPTitle;
  content: WPRenderedContent;
  excerpt?: WPExcerpt;
  author: number;
  featured_media: number;
  template: string;
  meta: any[];
  _embedded?: WPEmbedded;
}

// WordPress API query parameters
export interface WPQueryParams {
  // Common parameters
  context?: 'view' | 'embed' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  author?: number | number[];
  author_exclude?: number | number[];
  before?: string;
  exclude?: number | number[];
  include?: number | number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  slug?: string | string[];
  status?: string | string[];
  _embed?: string | boolean;
  
  // Post-specific parameters
  categories?: number | number[];
  categories_exclude?: number | number[];
  tags?: number | number[];
  tags_exclude?: number | number[];
  sticky?: boolean;
  
  // Page-specific parameters
  parent?: number | number[];
  parent_exclude?: number | number[];
  menu_order?: number;
  
  // Custom parameters
  [key: string]: any;
}

// WordPress API response wrapper
export interface WPAPIResponse<T> {
  data: T;
  headers: {
    'x-wp-total'?: string;
    'x-wp-totalpages'?: string;
    link?: string;
  };
}

// WordPress API error interface
export interface WPAPIError {
  code: string;
  message: string;
  data: {
    status: number;
    params?: any;
    details?: any;
  };
}

// WordPress API collection response
export interface WPCollectionResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Normalized WordPress content (extracted from rendered fields)
export interface NormalizedWPContent {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  date: string;
  slug: string;
  link: string;
  status: string;
  type: string;
  author?: number;
  featuredMedia?: {
    id: number;
    url: string;
    alt: string;
    caption?: string;
  };
  terms?: {
    [taxonomy: string]: WPTerm[];
  };
  meta?: any;
}

// WordPress endpoint configuration
export interface WPEndpointConfig {
  path: string;
  methods: ('GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE')[];
  requiresAuth?: boolean;
  cacheable?: boolean;
  defaultParams?: WPQueryParams;
  paramSchema?: any;
}

// WordPress client configuration
export interface WPClientConfig {
  baseUrl: string;
  apiPath?: string;
  timeout?: number;
  retryAttempts?: number;
  cacheEnabled?: boolean;
  cacheTTL?: number;
  defaultParams?: WPQueryParams;
  auth?: {
    username?: string;
    password?: string;
    token?: string;
  };
}

// Request options for WordPress API calls
export interface WPRequestOptions {
  cache?: boolean;
  cacheTTL?: number;
  timeout?: number;
  retryAttempts?: number;
  abortSignal?: AbortSignal;
  normalize?: boolean;
}

// WordPress API endpoints enum
export enum WPEndpoints {
  POSTS = 'posts',
  PAGES = 'pages',
  COMMENTS = 'comments',
  TAXONOMIES = 'taxonomies',
  CATEGORIES = 'categories',
  TAGS = 'tags',
  USERS = 'users',
  MEDIA = 'media',
  SEARCH = 'search',
  TYPES = 'types',
  STATUSES = 'statuses',
}

// Type guards for WordPress objects
export const isWPPost = (obj: any): obj is WPPost => {
  return obj && typeof obj === 'object' && obj.type === 'post';
};

export const isWPPage = (obj: any): obj is WPPage => {
  return obj && typeof obj === 'object' && obj.type === 'page';
};

export const isWPSearchResult = (obj: any): obj is WPSearchResult => {
  return obj && typeof obj === 'object' && 'title' in obj && 'url' in obj;
};

// Utility types for better type inference
export type WPContentType = WPPost | WPPage | WPDoctor;
export type WPCollectionType<T extends WPContentType> = WPCollectionResponse<T>;
export type WPSingleType<T extends WPContentType> = T;

// Response transformation types
export type WPTransformFunction<T, R> = (data: T) => R;
export type WPCollectionTransformFunction<T, R> = (data: T[], meta: { total: number; pages: number }) => R;
