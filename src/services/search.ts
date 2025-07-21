import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { WPSearchResult } from './wp-types';
import { fetchWPData, FetchOptions } from './cache';

export const getSearch = async (keyword: string, options?: FetchOptions) => {
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

export const searchAtom = atomFamily((keyword: string) => atom(async () => await getSearch(keyword)));
