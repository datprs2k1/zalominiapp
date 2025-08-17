/**
 * Jotai atoms for WordPress API state management
 */

import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { createWordPressClient } from '../wordpress/client';
import { createPostsService } from '../wordpress/posts';
import { createServicesService, createDepartmentsService } from '../wordpress/pages';
import { createDoctorsService } from '../wordpress/doctors';
import { createSearchService } from '../wordpress/search';
import { API_URL, SERVICE_ID, DEPARTMENT_ID } from '@/config';

// Create WordPress client instance
const wpClient = createWordPressClient({
  baseUrl: API_URL,
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
});

// Create service instances
const postsService = createPostsService(wpClient);
const servicesService = createServicesService(wpClient, parseInt(SERVICE_ID));
const departmentsService = createDepartmentsService(wpClient, parseInt(DEPARTMENT_ID));
const doctorsService = createDoctorsService(wpClient);
const searchService = createSearchService(wpClient);

// Posts atoms
export const postsAtomFamily = atomFamily((params: { type?: string; per_page?: number; page?: number } = {}) =>
  atom(async () => {
    const response = await postsService.getPosts(params);
    return response.items;
  })
);

export const postAtomFamily = atomFamily((id: number) => atom(async () => await postsService.getPost(id)));

export const recentPostsAtom = atomFamily((count: number = 5) =>
  atom(async () => {
    const response = await postsService.getRecentPosts(count);
    return response.items;
  })
);

export const popularPostsAtom = atomFamily((count: number = 5) =>
  atom(async () => {
    const response = await postsService.getPopularPosts(count);
    return response.items;
  })
);

export const postsByCategoryAtom = atomFamily((categoryId: number) =>
  atom(async () => {
    const response = await postsService.getPostsByCategory(categoryId);
    return response.items;
  })
);

export const postsByTagAtom = atomFamily((tagId: number) =>
  atom(async () => {
    const response = await postsService.getPostsByTag(tagId);
    return response.items;
  })
);

export const relatedPostsAtom = atomFamily((postId: number) =>
  atom(async () => {
    const response = await postsService.getRelatedPosts(postId);
    return response.items;
  })
);

// Services atoms
export const servicesAtom = atomFamily((params: { per_page?: number } = {}) =>
  atom(async () => {
    const response = await servicesService.getServices(params);
    return response.items;
  })
);

export const serviceAtom = atomFamily((id: number) => atom(async () => await servicesService.getService(id)));

export const featuredServicesAtom = atomFamily((count: number = 5) =>
  atom(async () => {
    const response = await servicesService.getFeaturedServices(count);
    return response.items;
  })
);

// Departments atoms
export const departmentsAtom = atomFamily((params: { per_page?: number } = {}) =>
  atom(async () => {
    const response = await departmentsService.getDepartments(params);
    return response.items;
  })
);

export const departmentAtom = atomFamily((id: number) => atom(async () => await departmentsService.getDepartment(id)));

export const departmentsWithServicesAtom = atom(async () => {
  return await departmentsService.getDepartmentsWithServices();
});

// Doctors atoms
export const doctorsAtom = atom(async () => {
  const response = await doctorsService.getDoctors();
  return response.items;
});

export const doctorAtomFamily = atomFamily((id: number) => atom(async () => await doctorsService.getDoctor(id)));

export const availableDoctorsAtom = atom(async () => {
  const response = await doctorsService.getAvailableDoctors();
  return response.items;
});

export const featuredDoctorsAtom = atomFamily((count: number = 5) =>
  atom(async () => {
    const response = await doctorsService.getFeaturedDoctors(count);
    return response.items;
  })
);

export const doctorsBySpecialtyAtom = atomFamily((specialty: string) =>
  atom(async () => {
    const response = await doctorsService.getDoctorsBySpecialty(specialty);
    return response.items;
  })
);

export const doctorsByDepartmentAtom = atomFamily((department: string) =>
  atom(async () => {
    const response = await doctorsService.getDoctorsByDepartment(department);
    return response.items;
  })
);

export const experiencedDoctorsAtom = atomFamily((minYears: number = 10) =>
  atom(async () => {
    const response = await doctorsService.getExperiencedDoctors(minYears);
    return response.items;
  })
);

export const doctorsGroupedBySpecialtyAtom = atom(async () => {
  return await doctorsService.getDoctorsGroupedBySpecialty();
});

export const doctorsGroupedByDepartmentAtom = atom(async () => {
  return await doctorsService.getDoctorsGroupedByDepartment();
});

export const doctorStatsAtom = atom(async () => {
  return await doctorsService.getDoctorStats();
});

// Search atoms
export const searchAtom = atomFamily((keyword: string) =>
  atom(async () => {
    if (!keyword.trim()) return [];
    return await searchService.search(keyword);
  })
);

export const enhancedSearchAtom = atomFamily((keyword: string) =>
  atom(async () => {
    if (!keyword.trim()) return [];
    return await searchService.searchEnhanced(keyword);
  })
);

export const groupedSearchAtom = atomFamily((keyword: string) =>
  atom(async () => {
    if (!keyword.trim()) return [];
    return await searchService.searchGrouped(keyword);
  })
);

export const searchPostsAtom = atomFamily((keyword: string) =>
  atom(async () => {
    if (!keyword.trim()) return [];
    return await searchService.searchPosts(keyword);
  })
);

export const searchPagesAtom = atomFamily((keyword: string) =>
  atom(async () => {
    if (!keyword.trim()) return [];
    return await searchService.searchPages(keyword);
  })
);

export const searchSuggestionsAtom = atomFamily((partialQuery: string) =>
  atom(async () => {
    if (partialQuery.length < 2) return [];
    return await searchService.getSearchSuggestions(partialQuery);
  })
);

export const searchWithSuggestionsAtom = atomFamily((keyword: string) =>
  atom(async () => {
    if (!keyword.trim()) return { results: [], suggestions: [] };
    return await searchService.searchWithSuggestions(keyword);
  })
);

// Cache management atoms
export const cacheStatsAtom = atom(() => {
  return wpClient.getCacheStats();
});

export const httpStatsAtom = atom(() => {
  return wpClient.getHttpStats();
});

// Cache invalidation actions
export const invalidatePostsCacheAtom = atom(
  null,
  (get, set, params: { type?: string; per_page?: number; page?: number } = {}) => {
    postsService.invalidateCache(params);
  }
);

export const invalidatePostCacheAtom = atom(null, (get, set, id: number) => {
  postsService.invalidatePostCache(id);
});

export const invalidateServicesCacheAtom = atom(null, (get, set, params: { per_page?: number } = {}) => {
  servicesService.invalidateCache('services', params);
});

export const invalidateServiceCacheAtom = atom(null, (get, set, id: number) => {
  servicesService.invalidatePageCache(id);
});

export const invalidateDepartmentsCacheAtom = atom(null, (get, set, params: { per_page?: number } = {}) => {
  departmentsService.invalidateCache('departments', params);
});

export const invalidateDepartmentCacheAtom = atom(null, (get, set, id: number) => {
  departmentsService.invalidatePageCache(id);
});

export const invalidateDoctorsCacheAtom = atom(null, (get, set, params: any = {}) => {
  doctorsService.invalidateCache(params);
});

export const invalidateDoctorCacheAtom = atom(null, (get, set, id: number) => {
  doctorsService.invalidateDoctorCache(id);
});

export const clearAllCacheAtom = atom(null, (get, set) => {
  wpClient.clearCache();
});

// Utility atoms for common operations
export const allContentStatsAtom = atom(async (get) => {
  const [posts, services, departments, doctors] = await Promise.all([
    get(postsAtomFamily({})),
    get(servicesAtom({})),
    get(departmentsAtom({})),
    get(doctorsAtom),
  ]);

  return {
    posts: posts.length,
    services: services.length,
    departments: departments.length,
    doctors: doctors.length,
    total: posts.length + services.length + departments.length + doctors.length,
  };
});

// Export service instances for direct use if needed
export { wpClient, postsService, servicesService, departmentsService, doctorsService, searchService };

// Export utility functions for cache management
export const CacheUtils = {
  invalidateAll: () => wpClient.clearCache(),
  getStats: () => wpClient.getCacheStats(),
  getHttpStats: () => wpClient.getHttpStats(),
};

// Backward compatibility exports (matching original post.ts exports)
export const getPosts = (params: any = {}, options: any = {}) => postsService.getPosts(params, options);
export const getPost = (id: number, options: any = {}) => postsService.getPost(id, {}, options);
export const getServices = (params: any = {}, options: any = {}) => servicesService.getServices(params, options);
export const getService = (id: number, options: any = {}) => servicesService.getService(id, {}, options);
export const getDepartments = (params: any = {}, options: any = {}) =>
  departmentsService.getDepartments(params, options);
export const getDepartment = (id: number, options: any = {}) => departmentsService.getDepartment(id, {}, options);
export const getDoctors = (options: any = {}) => doctorsService.getDoctors({}, options);
export const getDoctor = (id: number, options: any = {}) => doctorsService.getDoctor(id, {}, options);
export const getSearch = (keyword: string, options: any = {}) => searchService.search(keyword, {}, options);

export const invalidateCache = (endpoint: string, params: any = {}) => {
  // Map old endpoint names to new invalidation methods
  switch (endpoint) {
    case 'wp-json/wp/v2/posts':
      postsService.invalidateCache(params);
      break;
    case 'wp-json/wp/v2/pages':
      if (params.parent === parseInt(SERVICE_ID)) {
        servicesService.invalidateCache(params);
      } else if (params.parent === parseInt(DEPARTMENT_ID)) {
        departmentsService.invalidateCache(params);
      } else {
        // For individual pages, we need to use the client's invalidateCache
        wpClient.invalidateCache('pages', params);
      }
      break;
    case '/wp-json/wp/v2/info-bacsi':
      doctorsService.invalidateCache(params);
      break;
    default:
      wpClient.clearCache();
  }
};

export const clearCache = () => wpClient.clearCache();
