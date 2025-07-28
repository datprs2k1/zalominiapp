import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

interface RouteTransitionState {
  isTransitioning: boolean;
  transitionType: 'push' | 'pop' | 'replace';
  previousPath: string | null;
  currentPath: string;
  direction: 'forward' | 'backward' | 'none';
}

interface TransitionConfig {
  duration: number;
  enablePreload: boolean;
  trackHistory: boolean;
}

const defaultConfig: TransitionConfig = {
  duration: 250, // Reduced for smoother experience
  enablePreload: true,
  trackHistory: true,
};

export function useRouteTransition(config: Partial<TransitionConfig> = {}) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const finalConfig = { ...defaultConfig, ...config };

  const [state, setState] = useState<RouteTransitionState>({
    isTransitioning: false,
    transitionType: 'push',
    previousPath: null,
    currentPath: location.pathname,
    direction: 'none',
  });

  const historyStack = useRef<string[]>([location.pathname]);
  const transitionTimer = useRef<NodeJS.Timeout>();

  // Determine navigation direction based on history
  const getNavigationDirection = (
    currentPath: string,
    previousPath: string | null
  ): 'forward' | 'backward' | 'none' => {
    if (!previousPath) return 'none';

    const currentIndex = historyStack.current.indexOf(currentPath);
    const previousIndex = historyStack.current.indexOf(previousPath);

    if (navigationType === 'POP') {
      return 'backward';
    }

    if (currentIndex > previousIndex) {
      return 'forward';
    }

    return 'forward'; // Default for new routes
  };

  // Update history stack
  const updateHistoryStack = (path: string, type: 'push' | 'pop' | 'replace') => {
    if (!finalConfig.trackHistory) return;

    switch (type) {
      case 'push':
        if (!historyStack.current.includes(path)) {
          historyStack.current.push(path);
        }
        break;
      case 'pop':
        const index = historyStack.current.indexOf(path);
        if (index !== -1) {
          historyStack.current = historyStack.current.slice(0, index + 1);
        }
        break;
      case 'replace':
        const lastIndex = historyStack.current.length - 1;
        if (lastIndex >= 0) {
          historyStack.current[lastIndex] = path;
        }
        break;
    }
  };

  useEffect(() => {
    const previousPath = state.currentPath;
    const currentPath = location.pathname;

    if (previousPath === currentPath) return;

    const transitionType = navigationType === 'POP' ? 'pop' : navigationType === 'REPLACE' ? 'replace' : 'push';

    const direction = getNavigationDirection(currentPath, previousPath);

    // Update history stack
    updateHistoryStack(currentPath, transitionType);

    // Start transition
    setState((prev) => ({
      ...prev,
      isTransitioning: true,
      transitionType,
      previousPath,
      currentPath,
      direction,
    }));

    // Clear existing timer
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
    }

    // End transition after duration
    transitionTimer.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isTransitioning: false,
      }));
    }, finalConfig.duration);

    return () => {
      if (transitionTimer.current) {
        clearTimeout(transitionTimer.current);
      }
    };
  }, [location.pathname, navigationType, finalConfig.duration]);

  // Preload next route (if enabled)
  const preloadRoute = (path: string) => {
    if (!finalConfig.enablePreload) return;

    // Create a link element to preload the route
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);

    // Clean up after a delay
    setTimeout(() => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }, 5000);
  };

  // Get transition classes based on direction and type
  const getTransitionClasses = () => {
    const { direction, transitionType, isTransitioning } = state;

    const baseClasses = 'transition-all duration-400 ease-out';

    if (!isTransitioning) {
      return `${baseClasses} opacity-100 transform-none`;
    }

    switch (direction) {
      case 'forward':
        return `${baseClasses} opacity-0 translate-x-4`;
      case 'backward':
        return `${baseClasses} opacity-0 -translate-x-4`;
      default:
        return `${baseClasses} opacity-0 translate-y-2`;
    }
  };

  // Check if route is a detail page (for different transition styles)
  const isDetailRoute = (path: string) => {
    return (
      path.includes('/service/') ||
      path.includes('/department/') ||
      path.includes('/doctor/') ||
      path.includes('/schedule/')
    );
  };

  // Check if route is a modal-like page
  const isModalRoute = (path: string) => {
    return path.includes('/booking') || path.includes('/ask') || path.includes('/feedback');
  };

  return {
    ...state,
    getTransitionClasses,
    preloadRoute,
    isDetailRoute: isDetailRoute(state.currentPath),
    isModalRoute: isModalRoute(state.currentPath),
    historyStack: historyStack.current,
  };
}

// Hook for managing loading states during transitions
export function useTransitionLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Đang tải...');
  const loadingTimer = useRef<NodeJS.Timeout>();

  const startLoading = (message = 'Đang tải...', minDuration = 300) => {
    setLoadingMessage(message);
    setIsLoading(true);

    // Ensure minimum loading duration for better UX
    if (loadingTimer.current) {
      clearTimeout(loadingTimer.current);
    }

    loadingTimer.current = setTimeout(() => {
      setIsLoading(false);
    }, minDuration);
  };

  const stopLoading = () => {
    if (loadingTimer.current) {
      clearTimeout(loadingTimer.current);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      if (loadingTimer.current) {
        clearTimeout(loadingTimer.current);
      }
    };
  }, []);

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
  };
}

// Hook for managing page-specific loading states
export function usePageLoading(pageName: string) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [`${pageName}_${key}`]: loading,
    }));
  };

  const isLoading = (key: string) => {
    return loadingStates[`${pageName}_${key}`] || false;
  };

  const isAnyLoading = () => {
    return Object.values(loadingStates).some((loading) => loading);
  };

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    loadingStates,
  };
}

// Optimized hook for smooth skeleton loading during route transitions
export function useRouteSkeletonLoading() {
  const routeTransition = useRouteTransition();
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(false);
  const [skeletonDuration, setSkeletonDuration] = useState(300); // Reduced default duration

  // Immediate skeleton visibility control for smooth experience
  useEffect(() => {
    if (routeTransition.isTransitioning) {
      // Show skeleton immediately without delay
      setIsSkeletonVisible(true);

      // Hide skeleton with minimal buffer time
      const timer = setTimeout(() => {
        setIsSkeletonVisible(false);
      }, skeletonDuration);

      return () => clearTimeout(timer);
    } else {
      // Hide immediately when transition ends
      setIsSkeletonVisible(false);
    }
  }, [routeTransition.isTransitioning, skeletonDuration]);

  // Optimized skeleton duration based on route complexity
  useEffect(() => {
    const { currentPath } = routeTransition;

    // Shorter durations for smoother experience
    if (currentPath.includes('/service/') || currentPath.includes('/department/')) {
      setSkeletonDuration(400); // Reduced from 800ms
    } else if (currentPath === '/' || currentPath.includes('/booking')) {
      setSkeletonDuration(350); // Reduced from 700ms
    } else {
      setSkeletonDuration(300); // Reduced from 600ms
    }
  }, [routeTransition.currentPath]);

  return {
    ...routeTransition,
    isSkeletonVisible,
    skeletonDuration,
    setSkeletonDuration,
  };
}
