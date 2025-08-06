/**
 * Header Accessibility Utilities
 * Enhanced accessibility features for header components
 */

import { useEffect, useRef, useCallback, useState } from 'react';

// Focus management utilities
export const useFocusManagement = () => {
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  const updateFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    focusableElementsRef.current = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  const focusFirst = useCallback(() => {
    const firstElement = focusableElementsRef.current[0];
    if (firstElement) {
      firstElement.focus();
    }
  }, []);

  const focusLast = useCallback(() => {
    const lastElement = focusableElementsRef.current[focusableElementsRef.current.length - 1];
    if (lastElement) {
      lastElement.focus();
    }
  }, []);

  const trapFocus = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const currentIndex = focusableElementsRef.current.indexOf(event.target as HTMLElement);

      if (event.shiftKey) {
        // Shift + Tab (backward)
        if (currentIndex <= 0) {
          event.preventDefault();
          focusLast();
        }
      } else {
        // Tab (forward)
        if (currentIndex >= focusableElementsRef.current.length - 1) {
          event.preventDefault();
          focusFirst();
        }
      }
    },
    [focusFirst, focusLast]
  );

  return {
    updateFocusableElements,
    focusFirst,
    focusLast,
    trapFocus,
  };
};

// Screen reader announcements
export const useScreenReaderAnnouncements = () => {
  const announcementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create announcement element if it doesn't exist
    if (!announcementRef.current) {
      const element = document.createElement('div');
      element.setAttribute('aria-live', 'polite');
      element.setAttribute('aria-atomic', 'true');
      element.className = 'sr-only';
      element.id = 'header-announcements';
      document.body.appendChild(element);
      announcementRef.current = element;
    }

    return () => {
      if (announcementRef.current && document.body.contains(announcementRef.current)) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
};

// Keyboard navigation utilities
export const useKeyboardNavigation = () => {
  const handleKeyDown = useCallback((event: KeyboardEvent, actions: Record<string, () => void>) => {
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }, []);

  const createKeyboardHandler = useCallback(
    (actions: Record<string, () => void>) => {
      return (event: KeyboardEvent) => handleKeyDown(event, actions);
    },
    [handleKeyDown]
  );

  return { handleKeyDown, createKeyboardHandler };
};

// High contrast mode detection
export const useHighContrastMode = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      // Check for Windows high contrast mode
      const isWindowsHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

      // Check for forced colors (Windows high contrast)
      const isForcedColors = window.matchMedia('(forced-colors: active)').matches;

      setIsHighContrast(isWindowsHighContrast || isForcedColors);
    };

    checkHighContrast();

    // Listen for changes
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const forcedColorsQuery = window.matchMedia('(forced-colors: active)');

    contrastQuery.addEventListener('change', checkHighContrast);
    forcedColorsQuery.addEventListener('change', checkHighContrast);

    return () => {
      contrastQuery.removeEventListener('change', checkHighContrast);
      forcedColorsQuery.removeEventListener('change', checkHighContrast);
    };
  }, []);

  return isHighContrast;
};

// Reduced motion detection
export const useReducedMotionPreference = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// ARIA utilities
export const useAriaUtils = () => {
  const generateId = useCallback((prefix: string = 'header') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const createAriaProps = useCallback((label?: string, describedBy?: string, expanded?: boolean, controls?: string) => {
    const props: Record<string, any> = {};

    if (label) props['aria-label'] = label;
    if (describedBy) props['aria-describedby'] = describedBy;
    if (expanded !== undefined) props['aria-expanded'] = expanded;
    if (controls) props['aria-controls'] = controls;

    return props;
  }, []);

  return { generateId, createAriaProps };
};

// Color contrast utilities
export const useColorContrast = () => {
  const calculateContrast = useCallback((color1: string, color2: string): number => {
    // Simplified contrast calculation
    // In a real implementation, you'd want a more robust color parsing library
    const getLuminance = (color: string): number => {
      // This is a simplified version - you'd want proper color parsing
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;

      const sRGB = [r, g, b].map((c) => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }, []);

  const meetsWCAGAA = useCallback(
    (color1: string, color2: string): boolean => {
      return calculateContrast(color1, color2) >= 4.5;
    },
    [calculateContrast]
  );

  const meetsWCAGAAA = useCallback(
    (color1: string, color2: string): boolean => {
      return calculateContrast(color1, color2) >= 7;
    },
    [calculateContrast]
  );

  return { calculateContrast, meetsWCAGAA, meetsWCAGAAA };
};
