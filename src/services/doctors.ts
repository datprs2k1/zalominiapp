import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { WPDoctor } from './wp-types';
import { fetchWPData, FetchOptions } from './cache';

export const getDoctors = async (options?: FetchOptions) => {
  return fetchWPData<WPDoctor[]>(
    '/wp-json/wp/v2/info-bacsi',
    {
      _embed: 'wp:featuredmedia',
      per_page: 100,
    },
    options
  );
};

export const getDoctor = async (id: number, options?: FetchOptions) => {
  return fetchWPData<WPDoctor>(
    `/wp-json/wp/v2/info-bacsi/${id}`,
    {
      _embed: 'wp:featuredmedia',
    },
    options
  );
};

export const doctorsAtom = atom(async () => await getDoctors());

export const doctorAtomFamily = atomFamily((id: number) => atom(async () => await getDoctor(id)));
