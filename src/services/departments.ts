import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { WPPage } from './wp-types';
import { fetchWPData, FetchOptions } from './cache';
import { DEPARTMENT_ID } from '@/config';

export const getDepartments = async ({ per_page }: { per_page?: number } = {}, options?: FetchOptions) => {
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

export const getDepartment = async (id: number, options?: FetchOptions) => {
  return fetchWPData<WPPage>(
    `wp-json/wp/v2/pages/${id}`,
    {
      _embed: 'wp:term,wp:featuredmedia',
    },
    options
  );
};

export const departmentsAtom = atomFamily((entry: { per_page?: number } = {}) =>
  atom(async () => await getDepartments(entry))
);

export const departmentAtom = atomFamily((id: number) => atom(async () => await getDepartment(id)));
