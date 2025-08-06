import { PlatformDetection, DeviceInfo, HapticType } from './types';
import { IOS_STYLES, ANDROID_STYLES, WEB_STYLES } from './constants';

// Platform detection utility
export const detectPlatform = (): PlatformDetection => {
  const userAgent = navigator.userAgent;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return {
      platform: 'ios',
      version: userAgent.match(/OS (\d+)_(\d+)/)?.[0],
      isTouch: true,
      userAgent,
    };
  }

  if (/Android/.test(userAgent)) {
    return {
      platform: 'android',
      version: userAgent.match(/Android (\d+\.?\d*)/)?.[1],
      isTouch: true,
      userAgent,
    };
  }

  return {
    platform: 'web',
    isTouch,
    userAgent,
  };
};

// Get device info including safe areas
export const getDeviceInfo = (): DeviceInfo => {
  const platform = detectPlatform();

  // Get safe area insets
  const safeAreas = {
    top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0'),
    bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left') || '0'),
    right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right') || '0'),
  };

  // Fallback safe area values
  if (safeAreas.bottom === 0) {
    if (platform.platform === 'ios') {
      safeAreas.bottom = 34; // iPhone X and newer
    } else if (platform.platform === 'android') {
      safeAreas.bottom = 36; // Android gesture navigation - increased for better spacing
    } else {
      safeAreas.bottom = 16; // Web fallback
    }
  }

  // Determine screen size
  const screenSize = window.innerWidth < 768 ? 'small' : window.innerWidth < 1024 ? 'medium' : 'large';

  // Determine orientation
  const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

  return {
    platform: platform.platform,
    isTouch: platform.isTouch,
    screenSize,
    orientation,
    safeAreas,
  };
};

// Get platform-specific styles
export const getPlatformStyles = (platform: 'ios' | 'android' | 'web') => {
  switch (platform) {
    case 'ios':
      return IOS_STYLES;
    case 'android':
      return ANDROID_STYLES;
    default:
      return WEB_STYLES;
  }
};

// Haptic feedback utility
export class HapticFeedback {
  private isSupported: boolean;
  private platform: string;

  constructor() {
    this.platform = detectPlatform().platform;
    this.isSupported = 'vibrate' in navigator && this.platform !== 'web';
  }

  private vibrate(pattern: number | number[]) {
    if (this.isSupported) {
      navigator.vibrate(pattern);
    }
  }

  selection() {
    this.vibrate(10);
  }

  impactLight() {
    this.vibrate(10);
  }

  impactMedium() {
    this.vibrate(20);
  }

  impactHeavy() {
    this.vibrate(30);
  }

  trigger(type: HapticType) {
    switch (type) {
      case 'selection':
        this.selection();
        break;
      case 'impactLight':
        this.impactLight();
        break;
      case 'impactMedium':
        this.impactMedium();
        break;
      case 'impactHeavy':
        this.impactHeavy();
        break;
    }
  }
}

// Create singleton instance
export const hapticFeedback = new HapticFeedback();

// Keyboard navigation utilities
export const getNextIndex = (currentIndex: number, length: number, direction: 'next' | 'prev') => {
  if (direction === 'next') {
    return currentIndex < length - 1 ? currentIndex + 1 : 0;
  } else {
    return currentIndex > 0 ? currentIndex - 1 : length - 1;
  }
};

// Style generation utilities
export const generateButtonStyles = (
  isActive: boolean,
  isPressed: boolean,
  isFocused: boolean,
  platformStyles: any,
  dimensions: any,
  isHovered: boolean = false
) => {
  // iOS-optimized design with focus and hover states
  let background = 'transparent';
  let boxShadow = 'none';
  let border = 'none';
  let transform = 'none'; // No scaling to prevent overflow
  let outline = 'none';

  // State priority: pressed > focused > active > hovered > default
  if (isPressed) {
    background = platformStyles.colors.pressed?.background || 'rgba(0, 122, 255, 0.12)';
    transform = 'none'; // No scaling to prevent overflow
    boxShadow = 'none';
  } else if (isFocused) {
    background = platformStyles.colors.focus?.background || 'rgba(0, 122, 255, 0.08)';
    border = platformStyles.colors.focus?.border || '2px solid rgba(0, 122, 255, 0.3)';
    boxShadow = platformStyles.colors.focus?.shadow || '0 0 0 4px rgba(0, 122, 255, 0.15)';
    transform = 'none'; // No scaling to prevent overflow
    outline = 'none';
  } else if (isActive) {
    background = 'transparent';
    boxShadow = 'none';
    border = 'none';
    transform = 'none'; // No scaling to prevent overflow
  } else if (isHovered) {
    background = platformStyles.colors.hover?.background || 'rgba(0, 0, 0, 0.04)';
    transform = 'none'; // No scaling to prevent overflow
    boxShadow = 'none';
  }

  // Determine text color based on state - iOS blue theme
  const textColor = isActive
    ? platformStyles.colors.active?.icon || 'rgb(0, 122, 255)' // iOS blue icons on active
    : platformStyles.colors.inactive?.icon || 'rgba(60, 60, 67, 0.6)'; // iOS gray icons on inactive

  // Calculate responsive button size based on screen width
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 414;
  let buttonSize = dimensions.buttonSize;
  let buttonPadding = '12px';

  if (screenWidth <= 280) {
    buttonSize = 40;
    buttonPadding = '8px';
  } else if (screenWidth <= 320) {
    buttonSize = 44;
    buttonPadding = '10px';
  } else if (screenWidth <= 375) {
    buttonSize = 48;
    buttonPadding = '12px';
  } else if (screenWidth <= 414) {
    buttonSize = 52;
    buttonPadding = '13px';
  }

  return {
    // iOS-optimized dimensions with responsive sizing
    width: `${buttonSize}px`,
    height: `${buttonSize}px`,
    minWidth: `${buttonSize}px`,
    minHeight: `${buttonSize}px`,
    maxWidth: `${buttonSize}px`,
    maxHeight: `${buttonSize}px`,
    padding: buttonPadding, // Responsive padding
    borderRadius: isFocused ? '8px' : '0px', // Rounded corners for focus state
    display: 'flex' as const,
    flexDirection: 'row' as const, // Always row for icon-centered layout
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    background,
    color: textColor,
    border,
    cursor: 'pointer',
    position: 'relative' as const,
    transition: isPressed
      ? 'all 100ms ease-out' // Fast press response
      : 'all 150ms ease-out', // iOS standard timing
    outline,
    transform,
    boxShadow,
    overflow: 'visible' as const,
    // iOS-style focus and interaction states
    WebkitTapHighlightColor: 'transparent', // Remove iOS tap highlight
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    touchAction: 'manipulation' as const, // Optimize touch response
  };
};

export const generateContainerStyles = (platformStyles: any, dimensions: any, safeAreaBottom: number) => {
  // Calculate responsive padding based on screen width
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 414;
  let horizontalPadding = platformStyles.spacing.md;

  if (screenWidth <= 280) {
    horizontalPadding = 8;
  } else if (screenWidth <= 320) {
    horizontalPadding = 10;
  } else if (screenWidth <= 375) {
    horizontalPadding = 12;
  } else if (screenWidth <= 414) {
    horizontalPadding = 14;
  }

  return {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: `${dimensions.height}px`,
    padding: `0 ${horizontalPadding}px max(${safeAreaBottom}px, 8px) ${horizontalPadding}px`,
    display: 'flex' as const,
    alignItems: 'flex-end' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
    maxWidth: '100vw' as const,
    boxSizing: 'border-box' as const,
  };
};

export const generateBarStyles = (platformStyles: any, dimensions: any) => {
  // Calculate responsive dimensions based on screen width
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 414;
  let barHeight = dimensions.barHeight;
  let marginBottom = platformStyles.spacing.xs;
  let maxWidth = dimensions.maxWidth;

  if (screenWidth <= 280) {
    barHeight = 50;
    marginBottom = 4;
    maxWidth = screenWidth - 16; // Account for container padding
  } else if (screenWidth <= 320) {
    barHeight = 55;
    marginBottom = 6;
    maxWidth = screenWidth - 20;
  } else if (screenWidth <= 375) {
    barHeight = 58;
    marginBottom = 6;
    maxWidth = screenWidth - 24;
  } else if (screenWidth <= 414) {
    barHeight = 60;
    marginBottom = 6;
    maxWidth = screenWidth - 28;
  }

  return {
    backgroundColor: platformStyles.colors.background,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: `${platformStyles.borderRadius.xl}px`,
    boxShadow: platformStyles.shadows.elevated,
    border: `0.5px solid ${platformStyles.colors.border}`,
    width: '100%',
    maxWidth: `${Math.min(maxWidth, screenWidth - 32)}px`,
    height: `${barHeight}px`,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: `${marginBottom}px`,
    overflow: 'hidden' as const,
    boxSizing: 'border-box' as const,
  };
};

// Layout utilities
export const shouldShowLabels = (platform: string, screenSize: string, userPreference?: boolean) => {
  // User preference overrides everything
  if (userPreference !== undefined) return userPreference;

  // Platform-specific defaults
  switch (platform) {
    case 'ios':
    case 'android':
      // Mobile platforms: hide labels for cleaner look, show only on larger screens
      return screenSize === 'large';
    case 'web':
      // Web: show labels for better accessibility
      return true;
    default:
      return false;
  }
};

export const getOptimalIconSize = (platform: string, showLabels: boolean) => {
  // Calculate responsive icon size based on screen width
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 414;

  let iconSize = 24; // Default fallback

  if (screenWidth <= 280) {
    iconSize = 20;
  } else if (screenWidth <= 320) {
    iconSize = 22;
  } else if (screenWidth <= 375) {
    iconSize = 24;
  } else if (screenWidth <= 414) {
    iconSize = 26;
  } else {
    // Use platform-specific sizes for larger screens
    const baseSizes = {
      ios: showLabels ? 20 : 32,
      android: showLabels ? 22 : 32,
      web: showLabels ? 20 : 32,
    };
    iconSize = baseSizes[platform as keyof typeof baseSizes] || 32;
  }

  return iconSize;
};

// Text utilities
export const truncateText = (text: string, maxLength: number = 8) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 1) + '…';
};

export const getOptimalFontSize = (text: string, containerWidth: number) => {
  // Calculate optimal font size based on text length and container width
  const baseSize = 9;
  const textLength = text.length;

  if (textLength <= 6) return `${baseSize}px`;
  if (textLength <= 8) return `${baseSize - 0.5}px`;
  return `${baseSize - 1}px`;
};

// Accessibility utilities
export const getAriaLabel = (item: any, isActive: boolean) => {
  const baseLabel = item.ariaLabel || item.label;
  const statusLabel = isActive ? 'đang được chọn' : '';
  const badgeLabel = item.badge ? `, ${item.badge} thông báo` : '';

  return `${baseLabel}${statusLabel ? `, ${statusLabel}` : ''}${badgeLabel}`;
};

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
