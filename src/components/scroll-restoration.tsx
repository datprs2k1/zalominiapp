import { useRouteHandle } from '@/hooks';
import { FC, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollPositionTracker, createOptimizedScrollHandler } from '@/utils/scroll-performance';

// Global scroll position tracker instance
const scrollPositionTracker = new ScrollPositionTracker(100);

function getComputedOverflow(element: Element): string {
  try {
    const computedStyle = window.getComputedStyle(element);
    return computedStyle.overflow || computedStyle.overflowY || 'visible';
  } catch (error) {
    console.warn('Failed to get computed style for element:', error);
    return 'visible';
  }
}

function findElementWithScrollbar(rootElement: Element = document.body): Element | null {
  try {
    // First, try to find a <main> element
    const mainElement = document.querySelector('main');
    if (mainElement && mainElement.scrollHeight > mainElement.clientHeight) {
      return mainElement;
    }

    // If no <main> element is found, fall back to the original scrollbar detection
    if (rootElement.scrollHeight > rootElement.clientHeight && getComputedOverflow(rootElement) !== 'hidden') {
      // If the element has a scrollbar, return it
      return rootElement;
    }

    // If the element doesn't have a scrollbar, check its child elements
    for (let i = 0; i < rootElement.children.length; i++) {
      const childElement = rootElement.children[i];
      const elementWithScrollbar = findElementWithScrollbar(childElement);
      if (elementWithScrollbar) {
        // If a child element has a scrollbar, return it
        return elementWithScrollbar;
      }
    }

    // If none of the child elements have a scrollbar, return null
    return null;
  } catch (error) {
    console.warn('Error finding scrollable element:', error);
    return null;
  }
}

export const ScrollRestoration: FC = () => {
  const location = useLocation();
  const [handle] = useRouteHandle();
  const scrollHandlerRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    // Look for the main scroll element on the page
    const content = findElementWithScrollbar();
    console.log('Found scrollable element:', content);

    if (!content) {
      console.warn('No scrollable element found for scroll restoration');
      return () => {}; // Return empty cleanup function
    }

    try {
      // Handle explicit scroll restoration from route handle
      if (handle.scrollRestoration !== undefined) {
        console.log('Restoring to explicit position:', handle.scrollRestoration);
        content.scrollTo(0, handle.scrollRestoration);
        return () => {}; // Return empty cleanup function
      }

      // Handle automatic scroll restoration based on location
      const key = `${location.pathname}${location.search}`;
      const savedPosition = scrollPositionTracker.getPosition(key);

      if (savedPosition > 0) {
        // Restore to the saved position for this location
        console.log('Restoring scroll position for', key, 'to:', savedPosition);
        content.scrollTo(0, savedPosition);
      } else {
        // No saved position, scroll to top
        console.log('No saved position for', key, ', scrolling to top');
        content.scrollTo(0, 0);
      }

      // Set up optimized scroll position saving for this location
      const saveScrollPosition = () => {
        const currentPosition = content.scrollTop;
        scrollPositionTracker.savePosition(key, currentPosition);
        console.log('Saved scroll position for', key, ':', currentPosition);
      };

      // Use the optimized scroll handler from utils
      const scrollHandler = createOptimizedScrollHandler(saveScrollPosition, {
        throttle: true,
        passive: true,
      });

      scrollHandler.attach(content as HTMLElement);
      scrollHandlerRef.current = scrollHandler;

      return () => {
        if (scrollHandlerRef.current) {
          scrollHandlerRef.current.destroy();
          scrollHandlerRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error in scroll restoration:', error);
      return () => {}; // Return empty cleanup function on error
    }
  }, [location, handle.scrollRestoration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollHandlerRef.current) {
        scrollHandlerRef.current.destroy();
      }
    };
  }, []);

  return <></>;
};
