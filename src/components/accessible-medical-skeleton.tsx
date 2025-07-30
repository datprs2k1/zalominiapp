import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { combineClasses } from '@/styles/medical-design-system';

// ===== ACCESSIBILITY TYPES =====

interface AccessibilityOptions {
  announceLoading?: boolean;
  announceComplete?: boolean;
  customLoadingMessage?: string;
  customCompleteMessage?: string;
  respectReducedMotion?: boolean;
  highContrast?: boolean;
  focusManagement?: boolean;
}

interface AccessibleSkeletonProps {
  variant?: 'primary' | 'secondary' | 'neutral';
  width?: string;
  height?: string;
  className?: string;
  animated?: boolean;
  ariaLabel?: string;
  accessibility?: AccessibilityOptions;
  onLoadingStart?: () => void;
  onLoadingComplete?: () => void;
}

// ===== ACCESSIBILITY HOOKS =====

/**
 * Enhanced reduced motion hook with comprehensive support
 */
export const useEnhancedReducedMotion = () => {
  const systemPreference = useReducedMotion();
  const [userPreference, setUserPreference] = useState<boolean | null>(null);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Check user preferences
    const storedMotion = localStorage.getItem('medical-reduced-motion');
    const storedContrast = localStorage.getItem('medical-high-contrast');
    
    if (storedMotion !== null) {
      setUserPreference(storedMotion === 'true');
    }
    
    if (storedContrast !== null) {
      setHighContrast(storedContrast === 'true');
    }

    // Check system high contrast preference
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(prev => prev || mediaQuery.matches);

    const handleContrastChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('medical-high-contrast')) {
        setHighContrast(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleContrastChange);
    return () => mediaQuery.removeEventListener('change', handleContrastChange);
  }, []);

  const shouldReduceMotion = userPreference !== null ? userPreference : systemPreference;

  return {
    shouldReduceMotion,
    highContrast,
    setUserPreference,
    setHighContrast,
  };
};

/**
 * Screen reader announcement hook
 */
export const useScreenReaderAnnouncements = () => {
  const announcementRef = useRef<HTMLDivElement>(null);

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

  const AnnouncementRegion = memo(() => (
    <div
      ref={announcementRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    />
  ));

  return { announce, AnnouncementRegion };
};

/**
 * Focus management hook for skeleton transitions
 */
export const useFocusManagement = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
    }
  }, []);

  const manageFocusForLoading = useCallback((isLoading: boolean) => {
    if (isLoading) {
      saveFocus();
    } else {
      // Restore focus after a brief delay to allow content to render
      setTimeout(restoreFocus, 100);
    }
  }, [saveFocus, restoreFocus]);

  return { saveFocus, restoreFocus, manageFocusForLoading };
};

// ===== ACCESSIBLE SKELETON COMPONENTS =====

/**
 * WCAG 2.1 AA compliant medical skeleton component
 */
export const AccessibleMedicalSkeleton = memo<AccessibleSkeletonProps>(({
  variant = 'primary',
  width = 'w-full',
  height = 'h-4',
  className = '',
  animated = true,
  ariaLabel = 'Đang tải nội dung y tế',
  accessibility = {},
  onLoadingStart,
  onLoadingComplete,
}) => {
  const { shouldReduceMotion, highContrast } = useEnhancedReducedMotion();
  const { announce } = useScreenReaderAnnouncements();
  const [isVisible, setIsVisible] = useState(false);

  const {
    announceLoading = true,
    announceComplete = false,
    customLoadingMessage,
    customCompleteMessage,
    respectReducedMotion = true,
    focusManagement = false,
  } = accessibility;

  // Handle loading announcements
  useEffect(() => {
    if (announceLoading) {
      const message = customLoadingMessage || ariaLabel;
      announce(message, 'polite');
      onLoadingStart?.();
    }

    setIsVisible(true);

    return () => {
      if (announceComplete) {
        const message = customCompleteMessage || 'Nội dung đã tải xong';
        announce(message, 'polite');
        onLoadingComplete?.();
      }
    };
  }, [announceLoading, announceComplete, customLoadingMessage, customCompleteMessage, ariaLabel, announce, onLoadingStart, onLoadingComplete]);

  // Determine animation behavior
  const shouldAnimate = animated && (!respectReducedMotion || !shouldReduceMotion);

  // High contrast styles
  const contrastClasses = highContrast ? 'border-2 border-blue-600' : '';

  // Variant classes with accessibility considerations
  const getVariantClasses = () => {
    const baseClasses = 'skeleton-optimized rounded-lg';
    
    if (highContrast) {
      return `${baseClasses} bg-blue-100 border-2 border-blue-600`;
    }

    if (!shouldAnimate) {
      switch (variant) {
        case 'primary': return `${baseClasses} bg-blue-50`;
        case 'secondary': return `${baseClasses} bg-green-50`;
        case 'neutral': return `${baseClasses} bg-gray-50`;
        default: return `${baseClasses} bg-blue-50`;
      }
    }

    switch (variant) {
      case 'primary': return `${baseClasses} skeleton-medical-primary`;
      case 'secondary': return `${baseClasses} skeleton-medical-secondary`;
      case 'neutral': return `${baseClasses} skeleton-medical-neutral`;
      default: return `${baseClasses} skeleton-medical-primary`;
    }
  };

  const skeletonClasses = combineClasses(
    getVariantClasses(),
    width,
    height,
    contrastClasses,
    className
  );

  const animationProps = shouldAnimate ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: 'easeOut' },
  } : {};

  return (
    <motion.div
      className={skeletonClasses}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
      aria-busy="true"
      tabIndex={focusManagement ? 0 : -1}
      {...animationProps}
    />
  );
});

/**
 * Accessible skeleton group with comprehensive ARIA support
 */
interface AccessibleSkeletonGroupProps {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
  announceProgress?: boolean;
  totalItems?: number;
  loadedItems?: number;
}

export const AccessibleSkeletonGroup = memo<AccessibleSkeletonGroupProps>(({
  children,
  ariaLabel,
  className = '',
  announceProgress = false,
  totalItems,
  loadedItems = 0,
}) => {
  const { announce, AnnouncementRegion } = useScreenReaderAnnouncements();
  const { shouldReduceMotion } = useEnhancedReducedMotion();

  // Announce progress updates
  useEffect(() => {
    if (announceProgress && totalItems && loadedItems > 0) {
      const percentage = Math.round((loadedItems / totalItems) * 100);
      announce(`Đã tải ${percentage}% nội dung`, 'polite');
    }
  }, [announceProgress, totalItems, loadedItems, announce]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.4, ease: 'easeOut' },
    },
  };

  return (
    <>
      <motion.div
        className={combineClasses('space-y-4', className)}
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
        aria-busy="true"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))}
      </motion.div>
      <AnnouncementRegion />
    </>
  );
});

/**
 * Accessible loading state manager
 */
interface AccessibleLoadingManagerProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton: React.ReactNode;
  loadingMessage?: string;
  completeMessage?: string;
  className?: string;
}

export const AccessibleLoadingManager = memo<AccessibleLoadingManagerProps>(({
  isLoading,
  children,
  skeleton,
  loadingMessage = 'Đang tải nội dung...',
  completeMessage = 'Nội dung đã tải xong',
  className = '',
}) => {
  const { announce, AnnouncementRegion } = useScreenReaderAnnouncements();
  const { manageFocusForLoading } = useFocusManagement();
  const { shouldReduceMotion } = useEnhancedReducedMotion();

  useEffect(() => {
    if (isLoading) {
      announce(loadingMessage, 'polite');
      manageFocusForLoading(true);
    } else {
      announce(completeMessage, 'polite');
      manageFocusForLoading(false);
    }
  }, [isLoading, loadingMessage, completeMessage, announce, manageFocusForLoading]);

  const transitionProps = shouldReduceMotion ? {} : {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  };

  return (
    <>
      <div className={className} aria-live="polite" aria-busy={isLoading}>
        {isLoading ? (
          <motion.div key="skeleton" {...transitionProps}>
            {skeleton}
          </motion.div>
        ) : (
          <motion.div key="content" {...transitionProps}>
            {children}
          </motion.div>
        )}
      </div>
      <AnnouncementRegion />
    </>
  );
});

/**
 * Accessibility settings panel for skeleton preferences
 */
export const SkeletonAccessibilitySettings = memo(() => {
  const { shouldReduceMotion, highContrast, setUserPreference, setHighContrast } = useEnhancedReducedMotion();

  const handleReducedMotionToggle = () => {
    const newValue = !shouldReduceMotion;
    setUserPreference(newValue);
    localStorage.setItem('medical-reduced-motion', newValue.toString());
  };

  const handleHighContrastToggle = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('medical-high-contrast', newValue.toString());
  };

  return (
    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">Cài đặt trợ năng</h3>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={shouldReduceMotion}
            onChange={handleReducedMotionToggle}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Giảm hiệu ứng chuyển động</span>
        </label>
        
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={highContrast}
            onChange={handleHighContrastToggle}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Tăng độ tương phản</span>
        </label>
      </div>
    </div>
  );
});

// Set display names for better debugging
AccessibleMedicalSkeleton.displayName = 'AccessibleMedicalSkeleton';
AccessibleSkeletonGroup.displayName = 'AccessibleSkeletonGroup';
AccessibleLoadingManager.displayName = 'AccessibleLoadingManager';
SkeletonAccessibilitySettings.displayName = 'SkeletonAccessibilitySettings';

export default AccessibleMedicalSkeleton;
