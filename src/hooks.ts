import { MutableRefObject, useLayoutEffect, useState, useEffect } from 'react';
import { UIMatch, useMatches } from 'react-router-dom';

export function useRealHeight(element: MutableRefObject<HTMLDivElement | null>, defaultValue?: number) {
  const [height, setHeight] = useState(defaultValue ?? 0);
  useLayoutEffect(() => {
    if (element.current && typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const [{ contentRect }] = entries;
        setHeight(contentRect.height);
      });
      ro.observe(element.current);
      return () => ro.disconnect();
    }
    return () => {};
  }, [element.current]);

  if (typeof ResizeObserver === 'undefined') {
    return -1;
  }
  return height;
}

export function useRouteHandle() {
  const matches = useMatches() as UIMatch<
    undefined,
    {
      title?: string;
      back?: boolean;
      scrollRestoration?: number;
      noScroll?: boolean;
      profile?: boolean;
    }
  >[];
  const lastMatch = matches[matches.length - 1];

  return [lastMatch.handle ?? {}, lastMatch, matches] as const;
}

/**
 * Custom hook to track whether the current session is a first-time visit
 * @param key - Unique identifier for this animation (defaults to 'hasVisitedBefore')
 * @returns boolean indicating if this is the first time the user is seeing this animation
 */
export function useFirstTimeAnimation(key = 'hasVisitedBefore'): boolean {
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  useEffect(() => {
    // Check if this animation has been shown before
    const hasVisitedBefore = localStorage.getItem(key) === 'true';

    if (!hasVisitedBefore) {
      // If this is the first visit, mark it as visited for future reference
      localStorage.setItem(key, 'true');
      setIsFirstTime(true);
    } else {
      setIsFirstTime(false);
    }
  }, [key]);

  return isFirstTime;
}
