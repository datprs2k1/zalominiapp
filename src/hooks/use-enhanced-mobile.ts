/**
 * Enhanced Mobile Hook for Zalo Mini App Healthcare
 * Provides platform-specific behaviors and optimizations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  detectPlatform,
  getPlatformTouchTarget,
  getPlatformTypography,
  getPlatformColors,
  getPlatformSpacing,
  getPlatformBorderRadius,
  getPlatformShadows,
  ENHANCED_ANIMATIONS,
  getPlatformFooterTokens,
} from '@/styles/enhanced-mobile-design-system';
import { mobileAccessibilityManager } from '@/utils/mobile-accessibility-enhancements';

// Types
interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  isTouch: boolean;
  screenSize: 'small' | 'medium' | 'large';
  orientation: 'portrait' | 'landscape';
  safeAreas: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

interface PlatformStyles {
  touchTarget: typeof getPlatformTouchTarget extends () => infer T ? T : never;
  typography: typeof getPlatformTypography extends () => infer T ? T : never;
  colors: typeof getPlatformColors extends () => infer T ? T : never;
  spacing: typeof getPlatformSpacing extends () => infer T ? T : never;
  borderRadius: typeof getPlatformBorderRadius extends () => infer T ? T : never;
  shadows: typeof getPlatformShadows extends () => infer T ? T : never;
  animations: typeof ENHANCED_ANIMATIONS.ios | typeof ENHANCED_ANIMATIONS.android;
  footer: typeof getPlatformFooterTokens extends () => infer T ? T : never;
}

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onLongPress?: () => void;
}

interface HapticFeedback {
  light: () => void;
  medium: () => void;
  heavy: () => void;
  success: () => void;
  warning: () => void;
  error: () => void;
}

// Custom hook for enhanced mobile functionality
export const useEnhancedMobile = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: 'web',
    isTouch: false,
    screenSize: 'medium',
    orientation: 'portrait',
    safeAreas: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkSpeed, setNetworkSpeed] = useState<'slow' | 'fast'>('fast');

  // Platform detection and device info
  useEffect(() => {
    const updateDeviceInfo = () => {
      const platform = detectPlatform();
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Screen size detection
      const width = window.innerWidth;
      let screenSize: 'small' | 'medium' | 'large' = 'medium';
      if (width < 640) screenSize = 'small';
      else if (width > 1024) screenSize = 'large';

      // Orientation detection
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

      // Safe area detection
      const computedStyle = getComputedStyle(document.documentElement);
      const safeAreas = {
        top: parseInt(computedStyle.getPropertyValue('--safe-area-top') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-left') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-right') || '0'),
      };

      setDeviceInfo({
        platform,
        isTouch,
        screenSize,
        orientation,
        safeAreas,
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Network speed detection
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      const updateNetworkSpeed = () => {
        const effectiveType = connection.effectiveType;
        setNetworkSpeed(effectiveType === 'slow-2g' || effectiveType === '2g' ? 'slow' : 'fast');
      };

      updateNetworkSpeed();
      connection.addEventListener('change', updateNetworkSpeed);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', updateNetworkSpeed);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Platform-specific styles
  const platformStyles = useMemo<PlatformStyles>(() => {
    const platform = deviceInfo.platform;
    return {
      touchTarget: getPlatformTouchTarget(),
      typography: getPlatformTypography(),
      colors: getPlatformColors(),
      spacing: getPlatformSpacing(),
      borderRadius: getPlatformBorderRadius(),
      shadows: getPlatformShadows(),
      animations: ENHANCED_ANIMATIONS[platform] || ENHANCED_ANIMATIONS.ios,
      footer: getPlatformFooterTokens(),
    };
  }, [deviceInfo.platform]);

  // Haptic feedback
  const hapticFeedback = useMemo<HapticFeedback>(() => {
    const vibrate = (pattern: number | number[]) => {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    };

    return {
      light: () => vibrate(10),
      medium: () => vibrate(20),
      heavy: () => vibrate(30),
      success: () => vibrate([10, 50, 10]),
      warning: () => vibrate([20, 100, 20]),
      error: () => vibrate([50, 100, 50]),
    };
  }, []);

  // Gesture handling
  const useGestures = useCallback(
    (element: HTMLElement | null, handlers: GestureHandlers) => {
      useEffect(() => {
        if (!element || !deviceInfo.isTouch) return;

        let startX = 0;
        let startY = 0;
        let startTime = 0;
        let isLongPress = false;
        let longPressTimer: NodeJS.Timeout;

        const handleTouchStart = (e: TouchEvent) => {
          const touch = e.touches[0];
          startX = touch.clientX;
          startY = touch.clientY;
          startTime = Date.now();
          isLongPress = false;

          // Long press detection
          if (handlers.onLongPress) {
            longPressTimer = setTimeout(() => {
              isLongPress = true;
              handlers.onLongPress!();
              hapticFeedback.medium();
            }, 500);
          }
        };

        const handleTouchMove = () => {
          // Cancel long press if user moves finger
          if (longPressTimer) {
            clearTimeout(longPressTimer);
          }
        };

        const handleTouchEnd = (e: TouchEvent) => {
          if (longPressTimer) {
            clearTimeout(longPressTimer);
          }

          if (isLongPress) return;

          const touch = e.changedTouches[0];
          const endX = touch.clientX;
          const endY = touch.clientY;
          const endTime = Date.now();

          const deltaX = endX - startX;
          const deltaY = endY - startY;
          const deltaTime = endTime - startTime;

          // Swipe detection (minimum distance and maximum time)
          if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
            if (deltaTime < 300) {
              if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0 && handlers.onSwipeRight) {
                  handlers.onSwipeRight();
                  hapticFeedback.light();
                } else if (deltaX < 0 && handlers.onSwipeLeft) {
                  handlers.onSwipeLeft();
                  hapticFeedback.light();
                }
              } else {
                // Vertical swipe
                if (deltaY > 0 && handlers.onSwipeDown) {
                  handlers.onSwipeDown();
                  hapticFeedback.light();
                } else if (deltaY < 0 && handlers.onSwipeUp) {
                  handlers.onSwipeUp();
                  hapticFeedback.light();
                }
              }
            }
          }
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
          element.removeEventListener('touchstart', handleTouchStart);
          element.removeEventListener('touchmove', handleTouchMove);
          element.removeEventListener('touchend', handleTouchEnd);
          if (longPressTimer) {
            clearTimeout(longPressTimer);
          }
        };
      }, [element, handlers, deviceInfo.isTouch, hapticFeedback]);
    },
    [deviceInfo.isTouch, hapticFeedback]
  );

  // Responsive image loading
  const getOptimizedImageSrc = useCallback(
    (baseSrc: string, sizes: { small: string; medium: string; large: string }) => {
      const { screenSize } = deviceInfo;
      const quality = networkSpeed === 'slow' ? 'low' : 'high';

      let selectedSize = sizes[screenSize];
      if (networkSpeed === 'slow' && screenSize !== 'small') {
        selectedSize = sizes.small; // Use smaller image for slow connections
      }

      return selectedSize || baseSrc;
    },
    [deviceInfo.screenSize, networkSpeed]
  );

  // Platform-specific CSS classes
  const getPlatformClasses = useCallback(
    (baseClasses: string = '') => {
      const { platform, screenSize, orientation } = deviceInfo;
      return [
        baseClasses,
        `platform-${platform}`,
        `screen-${screenSize}`,
        `orientation-${orientation}`,
        isOnline ? 'online' : 'offline',
        networkSpeed === 'slow' ? 'slow-network' : 'fast-network',
      ]
        .filter(Boolean)
        .join(' ');
    },
    [deviceInfo, isOnline, networkSpeed]
  );

  return {
    deviceInfo,
    platformStyles,
    hapticFeedback,
    useGestures,
    getOptimizedImageSrc,
    getPlatformClasses,
    isOnline,
    networkSpeed,
  };
};
