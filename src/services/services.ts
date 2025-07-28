/**
 * Medical Services API
 * Handles fetching and caching of medical services and pricing information
 */

import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { WPPage } from './wp-types';
import { FetchOptions } from './cache';
import { SERVICE_ID, SERVICE_PRICE_ID } from '@/config';
import {
  fetchPages,
  fetchPage,
  createListAtomFamily,
  createItemAtomFamily,
  filterMedicalContent,
  sortByMedicalPriority,
  extractFeaturedImageUrl,
  extractPlainText,
  truncateText,
  formatMedicalDate,
  WP_ENDPOINTS,
} from './common';
import { fetchWPData } from './cache';
import { batchRequest, optimizeApiUrl } from '../utils/api-performance-monitor';
import { enhancedRequest } from './api';

/**
 * Interface for service query parameters
 */
export interface ServicesQueryParams {
  readonly per_page?: number;
  readonly page?: number;
  readonly search?: string;
  readonly orderby?: 'date' | 'title' | 'menu_order' | 'modified';
  readonly order?: 'asc' | 'desc';
}

/**
 * Enhanced service data with medical-specific transformations
 */
export interface EnhancedService extends WPPage {
  readonly featuredImageUrl: string | null;
  readonly plainTextContent: string;
  readonly truncatedDescription: string;
  readonly formattedDate: string;
  readonly serviceCategory: string;
  readonly estimatedDuration?: string;
  readonly price?: {
    readonly amount: number;
    readonly currency: string;
    readonly formatted: string;
  };
}

/**
 * Service price information
 */
export interface ServicePrice {
  readonly id: number;
  readonly serviceId: number;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly currency: string;
  readonly formattedPrice: string;
  readonly category: string;
  readonly isActive: boolean;
}

/**
 * Transform raw WordPress page to enhanced service
 */
export const transformService = (service: WPPage): EnhancedService => {
  const plainTextContent = extractPlainText(service.content.rendered);
  const serviceCategory = service.parent === Number(SERVICE_ID) ? 'medical-service' : 'general';

  // Extract price from content or meta (if available)
  const priceMatch = plainTextContent.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:VND|đ|vnđ)/i);
  const priceAmount = priceMatch ? parseFloat(priceMatch[1].replace(/[.,]/g, '')) : undefined;

  return {
    ...service,
    featuredImageUrl: extractFeaturedImageUrl(service._embedded),
    plainTextContent,
    truncatedDescription: truncateText(plainTextContent, 200),
    formattedDate: formatMedicalDate(service.date),
    serviceCategory,
    price: priceAmount
      ? {
          amount: priceAmount,
          currency: 'VND',
          formatted: new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(priceAmount),
        }
      : undefined,
  };
};

/**
 * Transform service price page to structured price data
 */
export const transformServicePrice = (pricePage: WPPage): ServicePrice => {
  const plainTextContent = extractPlainText(pricePage.content.rendered);
  const priceMatch = plainTextContent.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:VND|đ|vnđ)/i);
  const price = priceMatch ? parseFloat(priceMatch[1].replace(/[.,]/g, '')) : 0;

  return {
    id: pricePage.id,
    serviceId: pricePage.parent,
    name: pricePage.title.rendered,
    description: extractPlainText(pricePage.excerpt.rendered),
    price,
    currency: 'VND',
    formattedPrice: new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price),
    category: 'medical-service',
    isActive: pricePage.status === 'publish',
  };
};

/**
 * Get medical services with enhanced data
 */
export const getServices = async (
  params: ServicesQueryParams = {},
  options?: FetchOptions
): Promise<EnhancedService[]> => {
  const services = await fetchPages(
    {
      parent: SERVICE_ID,
      orderby: 'menu_order',
      order: 'asc',
      ...params,
    },
    options
  );

  const filteredServices = filterMedicalContent(services);
  const sortedServices = params.orderby === 'menu_order' ? filteredServices : sortByMedicalPriority(filteredServices);

  return sortedServices.map(transformService);
};

/**
 * Get single medical service with enhanced data
 */
export const getService = async (id: number, options?: FetchOptions): Promise<EnhancedService> => {
  const service = await fetchPage(id, options);
  return transformService(service);
};

/**
 * Get service price list
 */
export const getListServicePrices = async (options?: FetchOptions): Promise<ServicePrice[]> => {
  const pricePages = await fetchPages(
    {
      parent: SERVICE_PRICE_ID,
      per_page: 100,
      orderby: 'menu_order',
      order: 'asc',
    },
    options
  );

  const filteredPages = filterMedicalContent(pricePages);
  return filteredPages.map(transformServicePrice);
};

/**
 * Get specific service prices by IDs
 */
export const getServicePrices = async (ids: number[], options?: FetchOptions): Promise<ServicePrice[]> => {
  if (ids.length === 0) {
    return [];
  }

  const pricePages = await fetchPages(
    {
      parent: SERVICE_PRICE_ID,
      include: ids.join(','),
      per_page: ids.length,
    },
    options
  );

  const filteredPages = filterMedicalContent(pricePages);
  return filteredPages.map(transformServicePrice);
};

/**
 * Search services by name or description
 */
export const searchServices = async (
  query: string,
  params: Omit<ServicesQueryParams, 'search'> = {},
  options?: FetchOptions
): Promise<EnhancedService[]> => {
  if (!query.trim()) {
    return [];
  }

  // For now, fall back to the original implementation to avoid type errors
  return getServices(
    {
      ...params,
      search: query.trim(),
      orderby: 'title',
    },
    options
  );
};

/**
 * Get featured/popular services
 */
export const getFeaturedServices = async (limit: number = 6, options?: FetchOptions): Promise<EnhancedService[]> => {
  const services = await getServices(
    {
      per_page: limit,
      orderby: 'menu_order',
      order: 'asc',
    },
    options
  );

  return services.slice(0, limit);
};

/**
 * Atom families for reactive state management
 */

// Services list atom family
export const servicesAtomFamily = createListAtomFamily(getServices);

// Single service atom family
export const serviceAtomFamily = createItemAtomFamily(getService);

// Service prices list atom (transformed data)
export const listServicePricesAtom = atom(async () => await getListServicePrices());

/**
 * Raw service price pages atom with enhanced caching and performance optimization
 * Returns raw WordPress page data for components that need HTML content parsing
 *
 * @performance Uses medical-priority caching with 30-minute TTL and optimized request parameters
 * @returns Promise<WPPage[]> Filtered and sorted service price pages
 */
export const listServicePricePagesAtom = atom(async () => {
  const pricePages = await fetchWPData<WPPage[]>(
    WP_ENDPOINTS.PAGES,
    {
      parent: SERVICE_PRICE_ID,
      per_page: 100,
      orderby: 'title',
      order: 'asc',
      type: 'page',
      // Remove _embed to reduce response size - we only need content for parsing
      _fields: 'id,title,content,modified',
    },
    {
      // Enhanced caching for medical service prices
      cache: true,
      retries: 2,
      retryDelay: 500,
    }
  );

  // Apply medical content filtering and sorting for better performance
  const filteredPages = filterMedicalContent(pricePages);
  return sortByMedicalPriority(filteredPages);
});

// Specific service prices atom family
export const servicePricesAtomFamily = atomFamily((ids: number[]) => atom(async () => await getServicePrices(ids)));

// Featured services atom
export const featuredServicesAtom = atom(async () => await getFeaturedServices());

// Search services atom family
export const searchServicesAtomFamily = atomFamily((query: string) => atom(async () => await searchServices(query)));

// Legacy exports for backward compatibility
export const servicesAtom = servicesAtomFamily;
export const serviceAtom = serviceAtomFamily;
export const servicePricesAtom = servicePricesAtomFamily;
