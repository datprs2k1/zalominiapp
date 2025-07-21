import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { WPPost } from './wp-types';
import { fetchWPData, FetchOptions } from './cache';

export const getPosts = async (
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

export const getPost = async (id: number, options?: FetchOptions) => {
  return fetchWPData<WPPost>(
    `wp-json/wp/v2/posts/${id}`,
    {
      _embed: 'wp:term,wp:featuredmedia',
    },
    options
  );
};

// Use the same pattern for all atom families
export const postsAtomFamily = atomFamily((entry: { type?: string; per_page?: number } = {}) =>
  atom(async () => await getPosts(entry))
);

export const postAtomFamily = atomFamily((id: number) => atom(async () => await getPost(id)));
