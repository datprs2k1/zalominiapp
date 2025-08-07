// Accessibility utilities for About page components
// Provides helpers for ARIA labels, keyboard navigation, and screen reader support

import { useEffect, useRef } from 'react';

/**
 * Generates accessible IDs for form elements and ARIA relationships
 */
export const generateAccessibleId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Creates ARIA label for medical statistics
 */
export const createStatAriaLabel = (value: string, label: string, index: number): string => {
  return `Thống kê y khoa số ${index + 1}: ${value} ${label}`;
};

/**
 * Creates ARIA label for medical features
 */
export const createFeatureAriaLabel = (title: string, description: string): string => {
  return `Dịch vụ y tế: ${title}. ${description}`;
};

/**
 * Creates ARIA label for navigation buttons
 */
export const createButtonAriaLabel = (text: string, action: string): string => {
  return `${text} - ${action}`;
};

/**
 * Creates ARIA label for phone numbers
 */
export const createPhoneAriaLabel = (number: string, type: 'hotline' | 'emergency' = 'hotline'): string => {
  const typeText = type === 'emergency' ? 'Số cấp cứu' : 'Số hotline';
  return `${typeText}: ${number.replace(/\./g, ' ')}`;
};

/**
 * Hook for managing focus on page load
 */
export const useFocusManagement = (shouldFocus: boolean = true) => {
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldFocus && mainContentRef.current) {
      // Focus main content for screen readers
      mainContentRef.current.focus();
    }
  }, [shouldFocus]);

  return mainContentRef;
};

/**
 * Hook for announcing dynamic content changes to screen readers
 */
export const useScreenReaderAnnouncement = () => {
  const announcementRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
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
  };

  const AnnouncementRegion = () => (
    <div
      ref={announcementRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    />
  );

  return { announce, AnnouncementRegion };
};

/**
 * Hook for keyboard navigation support
 */
export const useKeyboardNavigation = () => {
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const createKeyboardProps = (action: () => void) => ({
    onKeyDown: (event: React.KeyboardEvent) => handleKeyDown(event, action),
    tabIndex: 0,
    role: 'button',
  });

  return { handleKeyDown, createKeyboardProps };
};

/**
 * Accessibility validation helpers
 */
export const validateAccessibility = {
  /**
   * Checks if an element has proper ARIA labels
   */
  hasAriaLabel: (element: HTMLElement): boolean => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.getAttribute('aria-describedby')
    );
  },

  /**
   * Checks if interactive elements are keyboard accessible
   */
  isKeyboardAccessible: (element: HTMLElement): boolean => {
    const tabIndex = element.getAttribute('tabindex');
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();
    
    // Naturally focusable elements
    const focusableElements = ['a', 'button', 'input', 'select', 'textarea'];
    
    return (
      focusableElements.includes(tagName) ||
      (tabIndex !== null && parseInt(tabIndex) >= 0) ||
      role === 'button' ||
      role === 'link'
    );
  },

  /**
   * Checks color contrast ratio (simplified check)
   */
  hasGoodContrast: (foreground: string, background: string): boolean => {
    // This is a simplified check - in production, use a proper contrast ratio calculator
    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    return ratio >= 4.5; // WCAG AA standard
  },
};

/**
 * Helper function to calculate luminance (simplified)
 */
function getLuminance(color: string): number {
  // Simplified luminance calculation
  // In production, use a proper color library
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * ARIA live region types
 */
export const ARIA_LIVE_REGIONS = {
  POLITE: 'polite',
  ASSERTIVE: 'assertive',
  OFF: 'off',
} as const;

/**
 * Common ARIA roles for medical content
 */
export const MEDICAL_ARIA_ROLES = {
  BANNER: 'banner',
  MAIN: 'main',
  NAVIGATION: 'navigation',
  COMPLEMENTARY: 'complementary',
  CONTENTINFO: 'contentinfo',
  REGION: 'region',
  ARTICLE: 'article',
  SECTION: 'section',
  LIST: 'list',
  LISTITEM: 'listitem',
  BUTTON: 'button',
  LINK: 'link',
  STATUS: 'status',
  ALERT: 'alert',
  DIALOG: 'dialog',
  TABLIST: 'tablist',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
} as const;

/**
 * Accessibility testing helpers for development
 */
export const a11yTestHelpers = {
  /**
   * Logs accessibility issues to console (development only)
   */
  auditPage: () => {
    if (process.env.NODE_ENV !== 'development') return;

    const issues: string[] = [];
    
    // Check for missing alt text on images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        issues.push(`Image ${index + 1} missing alt text`);
      }
    });

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      if (!validateAccessibility.hasAriaLabel(input as HTMLElement)) {
        issues.push(`Form element ${index + 1} missing label`);
      }
    });

    // Check for missing heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > lastLevel + 1) {
        issues.push(`Heading ${index + 1} skips levels (h${lastLevel} to h${level})`);
      }
      lastLevel = level;
    });

    if (issues.length > 0) {
      console.warn('Accessibility issues found:', issues);
    } else {
      console.log('No accessibility issues detected');
    }
  },

  /**
   * Highlights focusable elements (development only)
   */
  highlightFocusableElements: () => {
    if (process.env.NODE_ENV !== 'development') return;

    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach((element) => {
      (element as HTMLElement).style.outline = '2px solid red';
    });

    setTimeout(() => {
      focusableElements.forEach((element) => {
        (element as HTMLElement).style.outline = '';
      });
    }, 3000);
  },
};

export type AriaLiveRegion = typeof ARIA_LIVE_REGIONS[keyof typeof ARIA_LIVE_REGIONS];
export type MedicalAriaRole = typeof MEDICAL_ARIA_ROLES[keyof typeof MEDICAL_ARIA_ROLES];
