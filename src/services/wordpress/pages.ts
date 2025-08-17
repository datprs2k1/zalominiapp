/**
 * WordPress Pages service module (includes Services and Departments)
 */

import { WordPressClient } from './client';
import { WPPage, WPQueryParams, WPRequestOptions, WPCollectionResponse } from './types';

export interface PagesQueryParams extends WPQueryParams {
  parent?: number;
  menu_order?: number;
  template?: string;
}

export interface PageQueryOptions extends WPRequestOptions {
  normalize?: boolean;
}

/**
 * Pages service class
 */
export class PagesService {
  constructor(private client: WordPressClient) {}

  /**
   * Get multiple pages
   */
  async getPages(
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPage>> {
    const defaultParams: PagesQueryParams = {
      _embed: 'wp:term,wp:featuredmedia',
      per_page: 10,
      status: 'publish',
      ...params,
    };

    return this.client.getCollection<WPPage>('pages', defaultParams, options);
  }

  /**
   * Get single page by ID
   */
  async getPage(
    id: number,
    params: WPQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPPage> {
    const defaultParams: WPQueryParams = {
      _embed: 'wp:term,wp:featuredmedia',
      ...params,
    };

    return this.client.getById<WPPage>('page', id, defaultParams, options);
  }

  /**
   * Get child pages of a parent page
   */
  async getChildPages(
    parentId: number,
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPage>> {
    return this.getPages({ ...params, parent: parentId }, options);
  }

  /**
   * Get top-level pages (no parent)
   */
  async getTopLevelPages(
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPage>> {
    return this.getPages({ ...params, parent: 0 }, options);
  }

  /**
   * Get pages by template
   */
  async getPagesByTemplate(
    template: string,
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPage>> {
    return this.getPages({ ...params, template }, options);
  }

  /**
   * Search pages
   */
  async searchPages(
    query: string,
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPage>> {
    return this.getPages({ ...params, search: query }, options);
  }

  /**
   * Get page hierarchy (parent and children)
   */
  async getPageHierarchy(
    pageId: number,
    options: PageQueryOptions = {}
  ): Promise<{
    page: WPPage;
    parent?: WPPage;
    children: WPPage[];
    siblings: WPPage[];
  }> {
    const page = await this.getPage(pageId, {}, options);
    
    const [parent, children, siblings] = await Promise.all([
      // Get parent if exists
      page.parent > 0 ? this.getPage(page.parent, {}, options).catch(() => undefined) : Promise.resolve(undefined),
      // Get children
      this.getChildPages(pageId, {}, options).then(response => response.items),
      // Get siblings (same parent)
      page.parent > 0 
        ? this.getChildPages(page.parent, { exclude: [pageId] }, options).then(response => response.items)
        : this.getTopLevelPages({ exclude: [pageId] }, options).then(response => response.items),
    ]);

    return {
      page,
      parent,
      children,
      siblings,
    };
  }

  /**
   * Invalidate pages cache
   */
  invalidateCache(params: PagesQueryParams = {}): void {
    this.client.invalidateCache('pages', params);
  }

  /**
   * Invalidate single page cache
   */
  invalidatePageCache(id: number, params: WPQueryParams = {}): void {
    this.client.invalidateCache('page', { ...params, id });
  }
}

/**
 * Services-specific service class (extends PagesService)
 */
export class ServicesService extends PagesService {
  constructor(client: WordPressClient, private serviceParentId: number) {
    super(client);
  }

  /**
   * Get all services
   */
  async getServices(
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPage>> {
    return this.getChildPages(this.serviceParentId, params, options);
  }

  /**
   * Get single service by ID
   */
  async getService(
    id: number,
    params: WPQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPPage> {
    return this.getPage(id, params, options);
  }

  /**
   * Search services
   */
  async searchServices(
    query: string,
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPage>> {
    return this.getServices({ ...params, search: query }, options);
  }

  /**
   * Get featured services (by menu order or custom criteria)
   */
  async getFeaturedServices(
    count: number = 5,
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPage>> {
    return this.getServices({
      ...params,
      per_page: count,
      orderby: 'menu_order',
      order: 'asc',
    }, options);
  }
}

/**
 * Departments-specific service class (extends PagesService)
 */
export class DepartmentsService extends PagesService {
  constructor(client: WordPressClient, private departmentParentId: number) {
    super(client);
  }

  /**
   * Get all departments
   */
  async getDepartments(
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPage>> {
    return this.getChildPages(this.departmentParentId, params, options);
  }

  /**
   * Get single department by ID
   */
  async getDepartment(
    id: number,
    params: WPQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPPage> {
    return this.getPage(id, params, options);
  }

  /**
   * Search departments
   */
  async searchDepartments(
    query: string,
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<WPCollectionResponse<WPPage>> {
    return this.getDepartments({ ...params, search: query }, options);
  }

  /**
   * Get departments with services
   */
  async getDepartmentsWithServices(
    params: PagesQueryParams = {},
    options: PageQueryOptions = {}
  ): Promise<Array<WPPage & { services: WPPage[] }>> {
    const departmentsResponse = await this.getDepartments(params, options);
    
    // For each department, get its services (if any)
    const departmentsWithServices = await Promise.all(
      departmentsResponse.items.map(async (department) => {
        const servicesResponse = await this.getChildPages(department.id, {}, options);
        return {
          ...department,
          services: servicesResponse.items,
        };
      })
    );

    return departmentsWithServices;
  }
}

/**
 * Create pages service instance
 */
export function createPagesService(client: WordPressClient): PagesService {
  return new PagesService(client);
}

/**
 * Create services service instance
 */
export function createServicesService(client: WordPressClient, serviceParentId: number): ServicesService {
  return new ServicesService(client, serviceParentId);
}

/**
 * Create departments service instance
 */
export function createDepartmentsService(client: WordPressClient, departmentParentId: number): DepartmentsService {
  return new DepartmentsService(client, departmentParentId);
}

/**
 * Utility functions for pages
 */
export const PagesUtils = {
  /**
   * Build page breadcrumb trail
   */
  buildBreadcrumb: async (
    page: WPPage,
    pagesService: PagesService,
    options: PageQueryOptions = {}
  ): Promise<Array<{ id: number; title: string; slug: string }>> => {
    const breadcrumb: Array<{ id: number; title: string; slug: string }> = [];
    let currentPage = page;

    // Build breadcrumb from current page up to root
    while (currentPage) {
      breadcrumb.unshift({
        id: currentPage.id,
        title: currentPage.title.rendered,
        slug: currentPage.slug,
      });

      if (currentPage.parent > 0) {
        try {
          currentPage = await pagesService.getPage(currentPage.parent, {}, options);
        } catch {
          break;
        }
      } else {
        break;
      }
    }

    return breadcrumb;
  },

  /**
   * Get page content without HTML tags
   */
  getPlainContent: (page: WPPage, maxLength?: number): string => {
    const content = page.content?.rendered?.replace(/<[^>]*>/g, '').trim() || '';
    return maxLength && content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  },

  /**
   * Get page featured image URL
   */
  getFeaturedImageUrl: (page: WPPage, size: string = 'medium'): string | null => {
    const featuredMedia = page._embedded?.['wp:featuredmedia']?.[0];
    if (!featuredMedia) return null;

    if (featuredMedia.media_details?.sizes?.[size]) {
      return featuredMedia.media_details.sizes[size].source_url;
    }

    return featuredMedia.source_url || null;
  },

  /**
   * Check if page has children
   */
  hasChildren: (page: WPPage, allPages: WPPage[]): boolean => {
    return allPages.some(p => p.parent === page.id);
  },

  /**
   * Sort pages by menu order
   */
  sortByMenuOrder: (pages: WPPage[]): WPPage[] => {
    return [...pages].sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0));
  },

  /**
   * Filter pages by template
   */
  filterByTemplate: (pages: WPPage[], template: string): WPPage[] => {
    return pages.filter(page => page.template === template);
  },
};
