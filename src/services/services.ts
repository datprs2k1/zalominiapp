import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { WPPage } from './wp-types';
import { fetchWPData, FetchOptions } from './cache';
import { SERVICE_ID, SERVICE_PRICE_ID } from '@/config';

export const getServices = async ({ per_page }: { per_page?: number } = {}, options?: FetchOptions) => {
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

export const getService = async (id: number, options?: FetchOptions) => {
  return fetchWPData<WPPage>(
    `wp-json/wp/v2/pages/${id}`,
    {
      _embed: 'wp:term,wp:featuredmedia',
    },
    options
  );
};

export const getListServicePrices = async (options?: FetchOptions) => {
  return fetchWPData<WPPage>(
    `wp-json/wp/v2/pages`,
    {
      _embed: 'wp:term,wp:featuredmedia',
      parent: SERVICE_PRICE_ID,
    },
    options
  );
};

export const getServicePrices = async (ids: number[], options?: FetchOptions) => {
  return fetchWPData<WPPage>(`wp-json/wp/v2/pages`, {
    _embed: 'wp:term,wp:featuredmedia',
    parent: SERVICE_PRICE_ID,
    include: ids.join(','),
  });
};

export const serviceAtom = atomFamily((id: number) => atom(async () => await getService(id)));

export const servicesAtom = atomFamily((entry: { per_page?: number } = {}) =>
  atom(async () => await getServices(entry))
);

export const listServicePricesAtom = atomFamily(() => atom(async () => await getListServicePrices()));

export const servicePricesAtom = atomFamily((ids: number[]) => atom(async () => await getServicePrices(ids)));
