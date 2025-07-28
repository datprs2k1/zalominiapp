/**
 * Intersection Observer Hook
 * 
 * Optimized hook for detecting when elements enter/exit the viewport
 * with performance optimizations and proper cleanup.
 * 
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
  initialIsIntersecting?: boolean;
}

interface UseIntersectionObserverResult {
  ref: React.RefObject<HTMLElement>;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

/**
 * Hook for intersection observer with performance optimizations
 */
export function useIntersectionObserver(
  callback?: (entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {}
): React.RefObject<HTMLDivElement> {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
    ...restOptions
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbackRef = useRef(callback);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  // Update callback ref
  callbackRef.current = callback;

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      
      if (entry.isIntersecting && !hasBeenVisible) {
        setHasBeenVisible(true);
      }

      // If freezeOnceVisible is true and element has been visible, don't trigger callback
      if (freezeOnceVisible && hasBeenVisible && !entry.isIntersecting) {
        return;
      }

      callbackRef.current?.(entry);
    },
    [freezeOnceVisible, hasBeenVisible]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create observer
    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin,
      ...restOptions,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [observerCallback, threshold, root, rootMargin, restOptions]);

  return elementRef;
}

/**
 * Hook that returns intersection state
 */
export function useIntersectionObserverState(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverResult {
  const [isIntersecting, setIsIntersecting] = useState(
    options.initialIsIntersecting ?? false
  );
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const ref = useIntersectionObserver(
    useCallback((entry: IntersectionObserverEntry) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, []),
    options
  );

  return { ref, isIntersecting, entry };
}

/**
 * Hook for lazy loading with intersection observer
 */
export function useLazyLoading(
  options: UseIntersectionObserverOptions = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const ref = useIntersectionObserver(
    useCallback((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && !hasLoaded) {
        setIsVisible(true);
        setHasLoaded(true);
      }
    }, [hasLoaded]),
    {
      threshold: 0.1,
      rootMargin: '50px',
      freezeOnceVisible: true,
      ...options,
    }
  );

  return { ref, isVisible, hasLoaded };
}

/**
 * Hook for infinite scroll with intersection observer
 */
export function useInfiniteScroll(
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const [isFetching, setIsFetching] = useState(false);

  const ref = useIntersectionObserver(
    useCallback((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && !isFetching) {
        setIsFetching(true);
        callback();
        // Reset fetching state after a delay to prevent rapid firing
        setTimeout(() => setIsFetching(false), 1000);
      }
    }, [callback, isFetching]),
    {
      threshold: 0.1,
      rootMargin: '100px',
      ...options,
    }
  );

  return { ref, isFetching };
}

/**
 * Hook for viewport tracking with performance optimizations
 */
export function useViewportTracker(
  onEnter?: () => void,
  onExit?: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const [isInViewport, setIsInViewport] = useState(false);
  const [viewportEntry, setViewportEntry] = useState<IntersectionObserverEntry>();

  const ref = useIntersectionObserver(
    useCallback((entry: IntersectionObserverEntry) => {
      const wasInViewport = isInViewport;
      const nowInViewport = entry.isIntersecting;

      setIsInViewport(nowInViewport);
      setViewportEntry(entry);

      if (!wasInViewport && nowInViewport) {
        onEnter?.();
      } else if (wasInViewport && !nowInViewport) {
        onExit?.();
      }
    }, [isInViewport, onEnter, onExit]),
    options
  );

  return {
    ref,
    isInViewport,
    entry: viewportEntry,
  };
}

/**
 * Hook for measuring element visibility percentage
 */
export function useVisibilityPercentage(
  options: UseIntersectionObserverOptions = {}
) {
  const [visibilityPercentage, setVisibilityPercentage] = useState(0);

  const ref = useIntersectionObserver(
    useCallback((entry: IntersectionObserverEntry) => {
      const percentage = Math.round(entry.intersectionRatio * 100);
      setVisibilityPercentage(percentage);
    }, []),
    {
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      ...options,
    }
  );

  return { ref, visibilityPercentage };
}

export default useIntersectionObserver;
