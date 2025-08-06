import { useCallback, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationItem, HapticType } from './types';
import { hapticFeedback, getNextIndex, debounce } from './utils';

// Hook for footer navigation logic
export const useFooterNavigation = (items: NavigationItem[], enableHaptics = true) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [pressedIndex, setPressedIndex] = useState<number>(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Handle item press with haptic feedback
  const handleItemPress = useCallback(
    (item: NavigationItem, index: number, hapticType: HapticType = 'selection') => {
      // Haptic feedback
      if (enableHaptics) {
        hapticFeedback.trigger(hapticType);
      }

      // Visual feedback
      setActiveItem(item.id);
      setTimeout(() => setActiveItem(''), 150);

      // Navigation
      navigate(item.path);
    },
    [navigate, enableHaptics]
  );

  // Navigate to specific index
  const navigateToIndex = useCallback((index: number) => {
    setFocusedIndex(index);
    itemRefs.current[index]?.focus();
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigateToIndex(getNextIndex(index, items.length, 'prev'));
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateToIndex(getNextIndex(index, items.length, 'next'));
          break;
        case 'Home':
          event.preventDefault();
          navigateToIndex(0);
          break;
        case 'End':
          event.preventDefault();
          navigateToIndex(items.length - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleItemPress(items[index], index);
          break;
      }
    },
    [handleItemPress, navigateToIndex, items]
  );

  // Focus management
  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  // Handle hover (mouse enter)
  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  // Handle hover end (mouse leave)
  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(-1);
  }, []);

  // Handle press start (mouse down / touch start)
  const handlePressStart = useCallback(
    (index: number) => {
      setPressedIndex(index);
      // iOS-style haptic feedback on press start
      if (enableHaptics) {
        hapticFeedback('impact');
      }
    },
    [enableHaptics]
  );

  // Handle press end (mouse up / touch end)
  const handlePressEnd = useCallback(() => {
    setPressedIndex(-1);
  }, []);

  return {
    activeItem,
    focusedIndex,
    hoveredIndex,
    pressedIndex,
    itemRefs,
    handleItemPress,
    handleKeyDown,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    handlePressStart,
    handlePressEnd,
    navigateToIndex,
    setFocusedIndex,
  };
};

// Hook for device info and responsive behavior
export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState(() => {
    // Initial device info
    const safeAreas = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    return {
      platform: 'web' as const,
      isTouch: 'ontouchstart' in window,
      screenSize: window.innerWidth < 768 ? ('small' as const) : ('medium' as const),
      orientation: window.innerHeight > window.innerWidth ? ('portrait' as const) : ('landscape' as const),
      safeAreas,
    };
  });

  useEffect(() => {
    const updateDeviceInfo = debounce(() => {
      // Get safe area insets
      const safeAreas = {
        top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0'),
        bottom: parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0'
        ),
        left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left') || '0'),
        right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right') || '0'),
      };

      // Platform detection
      const userAgent = navigator.userAgent;
      let platform: 'ios' | 'android' | 'web' = 'web';

      if (/iPhone|iPad|iPod/.test(userAgent)) {
        platform = 'ios';
        if (safeAreas.bottom === 0) safeAreas.bottom = 34;
      } else if (/Android/.test(userAgent)) {
        platform = 'android';
        if (safeAreas.bottom === 0) safeAreas.bottom = 24;
      } else {
        if (safeAreas.bottom === 0) safeAreas.bottom = 16;
      }

      setDeviceInfo({
        platform,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        screenSize: window.innerWidth < 768 ? 'small' : window.innerWidth < 1024 ? 'medium' : 'large',
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
        safeAreas,
      });
    }, 100);

    // Initial update
    updateDeviceInfo();

    // Listen for resize and orientation changes
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

// Hook for platform-specific animations
export const useFooterAnimations = (prefersReducedMotion: boolean) => {
  const containerVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { y: 100, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8,
            staggerChildren: 0.05,
          },
        },
      };

  const itemVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      };

  const badgeVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { scale: 0, opacity: 0 },
        visible: {
          scale: 1,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30,
          },
        },
      };

  return {
    containerVariants,
    itemVariants,
    badgeVariants,
  };
};

// Hook for accessibility features
export const useFooterAccessibility = () => {
  const [announceText, setAnnounceText] = useState<string>('');

  const announceNavigation = useCallback((itemLabel: string) => {
    setAnnounceText(`Navigated to ${itemLabel}`);
    // Clear announcement after screen reader has time to read it
    setTimeout(() => setAnnounceText(''), 1000);
  }, []);

  const announceSelection = useCallback((itemLabel: string) => {
    setAnnounceText(`Selected ${itemLabel}`);
    setTimeout(() => setAnnounceText(''), 1000);
  }, []);

  return {
    announceText,
    announceNavigation,
    announceSelection,
  };
};
