/**
 * Accessibility Utilities for Medical Header
 * Enhanced accessibility features for healthcare applications
 */

import { MEDICAL_ACCESSIBILITY_LABELS } from './constants';

// Touch target size validation (WCAG 2.1 AA compliance)
export const TOUCH_TARGET_SIZES = {
  minimum: 44, // 44pt minimum for iOS
  recommended: 48, // 48pt recommended for better accessibility
  large: 56, // Large touch targets for elderly users
} as const;

// Contrast ratio requirements
export const CONTRAST_RATIOS = {
  normal: 4.5, // WCAG AA for normal text
  large: 3.0,  // WCAG AA for large text (18pt+ or 14pt+ bold)
  enhanced: 7.0, // WCAG AAA for enhanced accessibility
} as const;

// Dynamic Type scale support (iOS)
export const DYNAMIC_TYPE_SCALES = {
  xSmall: 0.8,
  small: 0.9,
  medium: 1.0,
  large: 1.15,
  xLarge: 1.3,
  xxLarge: 1.5,
  xxxLarge: 1.7,
  accessibility1: 2.0,
  accessibility2: 2.3,
  accessibility3: 2.6,
  accessibility4: 3.0,
  accessibility5: 3.5,
} as const;

// VoiceOver gesture support
export const VOICEOVER_GESTURES = {
  swipeRight: 'Navigate to next element',
  swipeLeft: 'Navigate to previous element',
  doubleTap: 'Activate element',
  twoFingerTap: 'Pause/resume VoiceOver',
  threeFingerSwipeUp: 'Scroll up',
  threeFingerSwipeDown: 'Scroll down',
} as const;

// Medical-specific accessibility announcements
export const MEDICAL_ANNOUNCEMENTS = {
  healthStatusChange: (status: string) => `Trạng thái sức khỏe đã thay đổi thành ${status}`,
  emergencyActivated: 'Chế độ khẩn cấp đã được kích hoạt',
  emergencyDeactivated: 'Chế độ khẩn cấp đã được tắt',
  medicalNotification: (count: number) => `${count} thông báo y tế mới`,
  navigationChange: (page: string) => `Đã chuyển đến trang ${page}`,
  connectionStatus: (status: 'connected' | 'disconnected') => 
    status === 'connected' ? 'Đã kết nối với hệ thống y tế' : 'Mất kết nối với hệ thống y tế',
} as const;

// Accessibility validation utilities
export const validateTouchTarget = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  const minSize = TOUCH_TARGET_SIZES.minimum;
  
  return rect.width >= minSize && rect.height >= minSize;
};

export const validateContrastRatio = (foreground: string, background: string): number => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd use a proper color contrast library
  const getLuminance = (color: string): number => {
    // This is a simplified version - use a proper color library in production
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Screen reader announcement utility
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (typeof window === 'undefined') return;
  
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management utilities
export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  
  return () => container.removeEventListener('keydown', handleTabKey);
};

// Keyboard navigation support
export const handleKeyboardNavigation = (
  e: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onIndexChange: (index: number) => void
) => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      onIndexChange(nextIndex);
      items[nextIndex]?.focus();
      break;
      
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      onIndexChange(prevIndex);
      items[prevIndex]?.focus();
      break;
      
    case 'Home':
      e.preventDefault();
      onIndexChange(0);
      items[0]?.focus();
      break;
      
    case 'End':
      e.preventDefault();
      const lastIndex = items.length - 1;
      onIndexChange(lastIndex);
      items[lastIndex]?.focus();
      break;
  }
};

// High contrast mode detection
export const isHighContrastMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Dynamic Type scale detection (iOS)
export const getDynamicTypeScale = (): number => {
  if (typeof window === 'undefined') return 1.0;
  
  // This would need to be implemented with native iOS bridge
  // For now, return default scale
  return 1.0;
};

// Voice Control support
export const addVoiceControlSupport = (element: HTMLElement, commands: string[]) => {
  // Add voice control names as data attributes
  element.setAttribute('data-voice-control-names', commands.join(','));
  
  // Add aria-label for voice recognition
  if (commands.length > 0) {
    const existingLabel = element.getAttribute('aria-label') || '';
    const voiceLabel = commands[0];
    element.setAttribute('aria-label', existingLabel ? `${existingLabel}, ${voiceLabel}` : voiceLabel);
  }
};

// Medical-specific accessibility helpers
export const createMedicalAccessibilityContext = () => {
  return {
    announceHealthStatusChange: (status: string) => {
      announceToScreenReader(MEDICAL_ANNOUNCEMENTS.healthStatusChange(status), 'assertive');
    },
    
    announceEmergencyMode: (activated: boolean) => {
      const message = activated 
        ? MEDICAL_ANNOUNCEMENTS.emergencyActivated
        : MEDICAL_ANNOUNCEMENTS.emergencyDeactivated;
      announceToScreenReader(message, 'assertive');
    },
    
    announceMedicalNotification: (count: number) => {
      announceToScreenReader(MEDICAL_ANNOUNCEMENTS.medicalNotification(count), 'polite');
    },
    
    announceNavigationChange: (page: string) => {
      announceToScreenReader(MEDICAL_ANNOUNCEMENTS.navigationChange(page), 'polite');
    },
    
    announceConnectionStatus: (status: 'connected' | 'disconnected') => {
      announceToScreenReader(MEDICAL_ANNOUNCEMENTS.connectionStatus(status), 'assertive');
    },
  };
};

// Accessibility testing utilities
export const runAccessibilityChecks = (container: HTMLElement) => {
  const issues: string[] = [];
  
  // Check touch target sizes
  const interactiveElements = container.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach((element) => {
    if (!validateTouchTarget(element as HTMLElement)) {
      issues.push(`Touch target too small: ${element.tagName}`);
    }
  });
  
  // Check for missing alt text
  const images = container.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
      issues.push('Image missing alt text');
    }
  });
  
  // Check for missing labels
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const hasLabel = input.getAttribute('aria-label') || 
                    input.getAttribute('aria-labelledby') ||
                    container.querySelector(`label[for="${input.id}"]`);
    
    if (!hasLabel) {
      issues.push(`Input missing label: ${input.tagName}`);
    }
  });
  
  return issues;
};

// Type definitions
export type TouchTargetSize = keyof typeof TOUCH_TARGET_SIZES;
export type ContrastLevel = keyof typeof CONTRAST_RATIOS;
export type DynamicTypeScale = keyof typeof DYNAMIC_TYPE_SCALES;
export type VoiceOverGesture = keyof typeof VOICEOVER_GESTURES;
