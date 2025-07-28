import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HomePageSkeleton,
  ServicesPageSkeleton,
  CategoriesPageSkeleton,
  ProfilePageSkeleton,
  DetailPageSkeleton,
  BookingPageSkeleton,
  ListPageSkeleton,
  SearchResultsSkeleton,
  GenericPageSkeleton,
} from '@/components/route-skeletons';

// Route pattern definitions
interface RoutePattern {
  pattern: RegExp;
  component: React.ComponentType<{ className?: string; animated?: boolean }>;
  name: string;
  description: string;
}

// Define route patterns and their corresponding skeleton components
const routePatterns: RoutePattern[] = [
  {
    pattern: /^\/$/,
    component: HomePageSkeleton,
    name: 'home',
    description: 'Home page with hero, services, departments, and news',
  },
  {
    pattern: /^\/services$/,
    component: ServicesPageSkeleton,
    name: 'services',
    description: 'Services listing page',
  },
  {
    pattern: /^\/categories$/,
    component: CategoriesPageSkeleton,
    name: 'categories',
    description: 'Categories grid page',
  },
  {
    pattern: /^\/departments$/,
    component: ListPageSkeleton,
    name: 'departments',
    description: 'Departments listing page',
  },
  {
    pattern: /^\/doctor$/,
    component: ListPageSkeleton,
    name: 'doctors',
    description: 'Doctors listing page',
  },
  {
    pattern: /^\/service\/\d+$/,
    component: DetailPageSkeleton,
    name: 'service-detail',
    description: 'Service detail page with tabs and booking',
  },
  {
    pattern: /^\/department\/\d+$/,
    component: DetailPageSkeleton,
    name: 'department-detail',
    description: 'Department detail page with services and doctors',
  },
  {
    pattern: /^\/doctor\/\d+$/,
    component: DetailPageSkeleton,
    name: 'doctor-detail',
    description: 'Doctor detail page with schedule and booking',
  },
  {
    pattern: /^\/booking/,
    component: BookingPageSkeleton,
    name: 'booking',
    description: 'Booking flow with steps and forms',
  },
  {
    pattern: /^\/profile/,
    component: ProfilePageSkeleton,
    name: 'profile',
    description: 'User profile page with stats and menu',
  },
  {
    pattern: /^\/schedule/,
    component: ListPageSkeleton,
    name: 'schedule',
    description: 'Schedule history and details',
  },
  {
    pattern: /^\/invoices$/,
    component: ListPageSkeleton,
    name: 'invoices',
    description: 'Invoices listing page',
  },
  {
    pattern: /^\/search$/,
    component: SearchResultsSkeleton,
    name: 'search',
    description: 'Search results page with filters',
  },
  {
    pattern: /^\/ask$/,
    component: GenericPageSkeleton,
    name: 'ask',
    description: 'Ask question form page',
  },
  {
    pattern: /^\/feedback$/,
    component: GenericPageSkeleton,
    name: 'feedback',
    description: 'Feedback form page',
  },
  {
    pattern: /^\/news/,
    component: ListPageSkeleton,
    name: 'news',
    description: 'News listing page',
  },
  {
    pattern: /^\/about$/,
    component: GenericPageSkeleton,
    name: 'about',
    description: 'About page',
  },
  {
    pattern: /^\/explore$/,
    component: GenericPageSkeleton,
    name: 'explore',
    description: 'Explore page',
  },
];

// Hook to get the appropriate skeleton component for current route
export function useRouteSkeleton() {
  const location = useLocation();

  const skeletonInfo = useMemo(() => {
    const pathname = location.pathname;
    
    // Find matching pattern
    const matchedPattern = routePatterns.find(pattern => 
      pattern.pattern.test(pathname)
    );

    // Return matched skeleton or fallback to generic
    if (matchedPattern) {
      return {
        component: matchedPattern.component,
        name: matchedPattern.name,
        description: matchedPattern.description,
        pathname,
      };
    }

    // Fallback to generic skeleton
    return {
      component: GenericPageSkeleton,
      name: 'generic',
      description: 'Generic page skeleton',
      pathname,
    };
  }, [location.pathname]);

  return skeletonInfo;
}

// Hook to check if a route should show skeleton loading
export function useSkeletonVisibility() {
  const location = useLocation();

  const shouldShowSkeleton = useMemo(() => {
    const pathname = location.pathname;
    
    // Routes that should not show skeleton (e.g., 404 page)
    const excludedRoutes = ['/404', '*'];
    
    return !excludedRoutes.some(route => {
      if (route === '*') return false; // Handle wildcard separately if needed
      return pathname === route;
    });
  }, [location.pathname]);

  return shouldShowSkeleton;
}

// Utility function to get skeleton component by route name
export function getSkeletonByRouteName(routeName: string) {
  const pattern = routePatterns.find(p => p.name === routeName);
  return pattern ? pattern.component : GenericPageSkeleton;
}

// Utility function to get all available skeleton types
export function getAvailableSkeletonTypes() {
  return routePatterns.map(pattern => ({
    name: pattern.name,
    description: pattern.description,
    component: pattern.component,
  }));
}

// Hook for preloading skeleton components (for performance)
export function useSkeletonPreloader() {
  const preloadSkeleton = (routeName: string) => {
    const SkeletonComponent = getSkeletonByRouteName(routeName);
    
    // Preload the component by creating a hidden instance
    if (typeof window !== 'undefined') {
      const preloadContainer = document.createElement('div');
      preloadContainer.style.display = 'none';
      preloadContainer.setAttribute('data-skeleton-preload', routeName);
      
      // This would trigger the component to be loaded into memory
      // In a real implementation, you might use React.createElement here
      // For now, we just mark it as preloaded
      preloadContainer.setAttribute('data-preloaded', 'true');
      
      // Clean up after a short delay
      setTimeout(() => {
        if (preloadContainer.parentNode) {
          preloadContainer.parentNode.removeChild(preloadContainer);
        }
      }, 100);
    }
  };

  return { preloadSkeleton };
}

// Enhanced hook that combines route detection with loading states
export function useRouteSkeletonWithLoading(isLoading: boolean = false) {
  const skeletonInfo = useRouteSkeleton();
  const shouldShow = useSkeletonVisibility();
  
  return {
    ...skeletonInfo,
    shouldShow: shouldShow && isLoading,
    isVisible: shouldShow && isLoading,
  };
}

export default useRouteSkeleton;
