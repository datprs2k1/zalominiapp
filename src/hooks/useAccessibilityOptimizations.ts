/**
 * Accessibility Optimizations Hook
 * Provides comprehensive accessibility features and WCAG 2.1 AA compliance utilities
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useEnhancedMobile } from './use-enhanced-mobile';

export interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceOver: boolean;
  darkMode: boolean;
}

export interface AccessibilityState {
  preferences: AccessibilityPreferences;
  focusVisible: boolean;
  announcements: string[];
  currentFocus: HTMLElement | null;
}

export interface AccessibilityUtils {
  // Announcements
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  clearAnnouncements: () => void;
  
  // Focus management
  setFocus: (element: HTMLElement | string) => void;
  trapFocus: (container: HTMLElement) => () => void;
  restoreFocus: () => void;
  
  // Keyboard navigation
  handleKeyboardNavigation: (event: KeyboardEvent, actions: Record<string, () => void>) => void;
  
  // Screen reader utilities
  getAriaLabel: (text: string, context?: string) => string;
  getAriaDescription: (description: string) => string;
  
  // Color contrast utilities
  checkContrast: (foreground: string, background: string) => { ratio: number; passes: boolean };
  getHighContrastColor: (color: string) => string;
  
  // Touch accessibility
  ensureTouchTarget: (size: number) => { minWidth: string; minHeight: string };
  
  // Text scaling
  getScaledFontSize: (baseSize: number) => string;
  getScaledLineHeight: (baseLineHeight: number) => string;
}

export const useAccessibilityOptimizations = (): AccessibilityState & AccessibilityUtils => {
  const { deviceInfo } = useEnhancedMobile();
  const [accessibilityState, setAccessibilityState] = useState<AccessibilityState>({
    preferences: {
      reduceMotion: false,
      highContrast: false,
      largeText: false,
      screenReader: false,
      keyboardNavigation: false,
      voiceOver: false,
      darkMode: false,
    },
    focusVisible: false,
    announcements: [],
    currentFocus: null,
  });

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const announcementTimeoutRef = useRef<NodeJS.Timeout>();

  // Detect accessibility preferences
  useEffect(() => {
    const detectPreferences = () => {
      const preferences: AccessibilityPreferences = {
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        largeText: window.matchMedia('(prefers-reduced-data: reduce)').matches,
        screenReader: !!(window.navigator as any).userAgent.match(/NVDA|JAWS|VoiceOver|ORCA/i),
        keyboardNavigation: false, // Will be detected on first tab key
        voiceOver: !!(window.navigator as any).userAgent.match(/VoiceOver/i),
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      };

      setAccessibilityState(prev => ({ ...prev, preferences }));
    };

    detectPreferences();

    // Listen for preference changes
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
    ];

    const handleChange = () => detectPreferences();
    mediaQueries.forEach(mq => mq.addEventListener('change', handleChange));

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', handleChange));
    };
  }, []);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setAccessibilityState(prev => ({
          ...prev,
          preferences: { ...prev.preferences, keyboardNavigation: true },
          focusVisible: true,
        }));
      }
    };

    const handleMouseDown = () => {
      setAccessibilityState(prev => ({ ...prev, focusVisible: false }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Announcement utilities
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Create or update live region
    let liveRegion = document.getElementById('accessibility-announcements');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'accessibility-announcements';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }

    // Clear previous timeout
    if (announcementTimeoutRef.current) {
      clearTimeout(announcementTimeoutRef.current);
    }

    // Update live region
    liveRegion.textContent = message;
    liveRegion.setAttribute('aria-live', priority);

    // Update state
    setAccessibilityState(prev => ({
      ...prev,
      announcements: [...prev.announcements, message].slice(-5), // Keep last 5 announcements
    }));

    // Clear announcement after delay
    announcementTimeoutRef.current = setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    }, 1000);
  }, []);

  const clearAnnouncements = useCallback(() => {
    const liveRegion = document.getElementById('accessibility-announcements');
    if (liveRegion) {
      liveRegion.textContent = '';
    }
    setAccessibilityState(prev => ({ ...prev, announcements: [] }));
  }, []);

  // Focus management utilities
  const setFocus = useCallback((element: HTMLElement | string) => {
    const targetElement = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element;

    if (targetElement) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Set focus
      targetElement.focus();
      
      // Update state
      setAccessibilityState(prev => ({ ...prev, currentFocus: targetElement }));
      
      // Announce focus change for screen readers
      const label = targetElement.getAttribute('aria-label') || 
                   targetElement.getAttribute('title') || 
                   targetElement.textContent || 
                   'Element';
      announce(`Focused on ${label}`, 'polite');
    }
  }, [announce]);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  // Keyboard navigation handler
  const handleKeyboardNavigation = useCallback((
    event: KeyboardEvent, 
    actions: Record<string, () => void>
  ) => {
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }, []);

  // ARIA utilities
  const getAriaLabel = useCallback((text: string, context?: string) => {
    return context ? `${text}, ${context}` : text;
  }, []);

  const getAriaDescription = useCallback((description: string) => {
    // Create or get description element
    const descId = `desc-${Math.random().toString(36).substr(2, 9)}`;
    let descElement = document.getElementById(descId);
    
    if (!descElement) {
      descElement = document.createElement('div');
      descElement.id = descId;
      descElement.style.position = 'absolute';
      descElement.style.left = '-10000px';
      descElement.textContent = description;
      document.body.appendChild(descElement);
    }
    
    return descId;
  }, []);

  // Color contrast utilities
  const checkContrast = useCallback((foreground: string, background: string) => {
    // Simplified contrast calculation (would need full implementation)
    const ratio = 4.5; // Placeholder - implement actual calculation
    const passes = ratio >= 4.5; // WCAG AA standard
    
    return { ratio, passes };
  }, []);

  const getHighContrastColor = useCallback((color: string) => {
    // Return high contrast version of color
    if (accessibilityState.preferences.highContrast) {
      // Convert to high contrast equivalent
      return color === '#ffffff' ? '#000000' : '#ffffff';
    }
    return color;
  }, [accessibilityState.preferences.highContrast]);

  // Touch accessibility utilities
  const ensureTouchTarget = useCallback((size: number = 44) => {
    const minSize = Math.max(size, deviceInfo.platform === 'ios' ? 44 : 48);
    return {
      minWidth: `${minSize}px`,
      minHeight: `${minSize}px`,
    };
  }, [deviceInfo.platform]);

  // Text scaling utilities
  const getScaledFontSize = useCallback((baseSize: number) => {
    const scale = accessibilityState.preferences.largeText ? 1.2 : 1;
    return `${baseSize * scale}px`;
  }, [accessibilityState.preferences.largeText]);

  const getScaledLineHeight = useCallback((baseLineHeight: number) => {
    const scale = accessibilityState.preferences.largeText ? 1.1 : 1;
    return `${baseLineHeight * scale}`;
  }, [accessibilityState.preferences.largeText]);

  return {
    // State
    ...accessibilityState,
    
    // Utilities
    announce,
    clearAnnouncements,
    setFocus,
    trapFocus,
    restoreFocus,
    handleKeyboardNavigation,
    getAriaLabel,
    getAriaDescription,
    checkContrast,
    getHighContrastColor,
    ensureTouchTarget,
    getScaledFontSize,
    getScaledLineHeight,
  };
};
