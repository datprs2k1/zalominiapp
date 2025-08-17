/**
 * Device Detection and Cross-platform Utilities
 * Utilities for detecting device capabilities and optimizing for different platforms
 */

import * as React from 'react';

// Device type detection
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
  browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';
  isTouch: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  hasHover: boolean;
  prefersReducedMotion: boolean;
  prefersColorScheme: 'light' | 'dark' | 'no-preference';
}

export const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Device type detection
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent) || (width >= 768 && width <= 1024);
  const type: DeviceInfo['type'] = isMobile && !isTablet ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  // OS detection
  let os: DeviceInfo['os'] = 'unknown';
  if (/iphone|ipad|ipod/i.test(userAgent)) os = 'ios';
  else if (/android/i.test(userAgent)) os = 'android';
  else if (/windows/i.test(userAgent)) os = 'windows';
  else if (/mac/i.test(userAgent)) os = 'macos';
  else if (/linux/i.test(userAgent)) os = 'linux';

  // Browser detection
  let browser: DeviceInfo['browser'] = 'unknown';
  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) browser = 'chrome';
  else if (/firefox/i.test(userAgent)) browser = 'firefox';
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'safari';
  else if (/edge/i.test(userAgent)) browser = 'edge';
  else if (/opera/i.test(userAgent)) browser = 'opera';

  // Screen size detection
  let screenSize: DeviceInfo['screenSize'] = 'xs';
  if (width >= 1536) screenSize = '2xl';
  else if (width >= 1280) screenSize = 'xl';
  else if (width >= 1024) screenSize = 'lg';
  else if (width >= 768) screenSize = 'md';
  else if (width >= 640) screenSize = 'sm';

  // Touch capability
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Orientation
  const orientation: DeviceInfo['orientation'] = width > height ? 'landscape' : 'portrait';

  // Pixel ratio
  const pixelRatio = window.devicePixelRatio || 1;

  // Hover capability
  const hasHover = window.matchMedia('(hover: hover)').matches;

  // Motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Color scheme preference
  let prefersColorScheme: DeviceInfo['prefersColorScheme'] = 'no-preference';
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    prefersColorScheme = 'dark';
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    prefersColorScheme = 'light';
  }

  return {
    type,
    os,
    browser,
    isTouch,
    screenSize,
    orientation,
    pixelRatio,
    hasHover,
    prefersReducedMotion,
    prefersColorScheme,
  };
};

// Responsive breakpoint utilities
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const useBreakpoint = (breakpoint: keyof typeof breakpoints): boolean => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return matches;
};

// Device-specific optimizations
export const getOptimizedImageSize = (deviceInfo: DeviceInfo): { width: number; quality: number } => {
  const baseWidth = 800;
  const baseQuality = 80;

  switch (deviceInfo.type) {
    case 'mobile':
      return {
        width: Math.round(baseWidth * 0.6 * deviceInfo.pixelRatio),
        quality: deviceInfo.pixelRatio > 2 ? baseQuality - 10 : baseQuality,
      };
    case 'tablet':
      return {
        width: Math.round(baseWidth * 0.8 * deviceInfo.pixelRatio),
        quality: baseQuality,
      };
    case 'desktop':
      return {
        width: Math.round(baseWidth * deviceInfo.pixelRatio),
        quality: baseQuality + 10,
      };
    default:
      return { width: baseWidth, quality: baseQuality };
  }
};

// Touch-friendly utilities
export const getTouchTargetSize = (deviceInfo: DeviceInfo): number => {
  // WCAG recommends minimum 44px for touch targets
  const baseSize = 44;

  if (deviceInfo.isTouch) {
    // Increase size for high-DPI displays
    return deviceInfo.pixelRatio > 2 ? baseSize + 8 : baseSize;
  }

  // Smaller targets are acceptable for mouse/trackpad
  return baseSize - 8;
};

// React hook for device information
export const useDeviceInfo = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      // Default values for SSR
      return {
        type: 'desktop',
        os: 'unknown',
        browser: 'unknown',
        isTouch: false,
        screenSize: 'lg',
        orientation: 'landscape',
        pixelRatio: 1,
        hasHover: true,
        prefersReducedMotion: false,
        prefersColorScheme: 'no-preference',
      };
    }
    return getDeviceInfo();
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDeviceInfo = () => {
      setDeviceInfo(getDeviceInfo());
    };

    // Update on resize
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    // Update on media query changes
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(prefers-color-scheme: light)'),
      window.matchMedia('(hover: hover)'),
    ];

    const handleMediaChange = () => updateDeviceInfo();
    mediaQueries.forEach((mq) => mq.addEventListener('change', handleMediaChange));

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
      mediaQueries.forEach((mq) => mq.removeEventListener('change', handleMediaChange));
    };
  }, []);

  return deviceInfo;
};

// Platform-specific CSS classes
export const getPlatformClasses = (deviceInfo: DeviceInfo): string[] => {
  const classes: string[] = [];

  // Device type
  classes.push(`device-${deviceInfo.type}`);

  // OS
  classes.push(`os-${deviceInfo.os}`);

  // Browser
  classes.push(`browser-${deviceInfo.browser}`);

  // Touch capability
  if (deviceInfo.isTouch) classes.push('touch-device');
  else classes.push('no-touch');

  // Hover capability
  if (deviceInfo.hasHover) classes.push('hover-device');
  else classes.push('no-hover');

  // High DPI
  if (deviceInfo.pixelRatio > 1.5) classes.push('high-dpi');

  // Motion preference
  if (deviceInfo.prefersReducedMotion) classes.push('reduced-motion');

  // Color scheme
  classes.push(`prefers-${deviceInfo.prefersColorScheme}`);

  return classes;
};

// Performance optimization based on device
export const getPerformanceConfig = (deviceInfo: DeviceInfo) => {
  const config = {
    enableAnimations: true,
    imageQuality: 80,
    lazyLoadThreshold: 0.1,
    prefetchCount: 3,
    enableServiceWorker: true,
  };

  // Reduce performance features on low-end devices
  if (deviceInfo.type === 'mobile') {
    config.enableAnimations = !deviceInfo.prefersReducedMotion;
    config.imageQuality = 70;
    config.lazyLoadThreshold = 0.2;
    config.prefetchCount = 1;
  }

  // Optimize for tablets
  if (deviceInfo.type === 'tablet') {
    config.prefetchCount = 2;
  }

  return config;
};

// Network-aware optimizations
export const getNetworkInfo = (): {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
} => {
  const connection =
    (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  if (connection) {
    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false,
    };
  }

  return {
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false,
  };
};

// Adaptive loading based on network
export const shouldLoadHighQualityAssets = (): boolean => {
  const network = getNetworkInfo();
  const deviceInfo = getDeviceInfo();

  // Don't load high quality on slow networks or save-data mode
  if (network.saveData || network.effectiveType === 'slow-2g' || network.effectiveType === '2g') {
    return false;
  }

  // Load high quality on desktop with good connection
  if (deviceInfo.type === 'desktop' && (network.effectiveType === '4g' || network.downlink > 1.5)) {
    return true;
  }

  // Default to medium quality
  return false;
};

// Viewport utilities
export const getViewportInfo = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    availableWidth: screen.availWidth,
    availableHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
  };
};

// Safe area utilities for mobile devices
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);

  return {
    top: parseInt(style.getPropertyValue('--sat') || '0', 10),
    right: parseInt(style.getPropertyValue('--sar') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
    left: parseInt(style.getPropertyValue('--sal') || '0', 10),
  };
};

// Feature detection
export const supportsFeature = (feature: string): boolean => {
  switch (feature) {
    case 'webp':
      return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    case 'avif':
      return document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0;
    case 'intersection-observer':
      return 'IntersectionObserver' in window;
    case 'service-worker':
      return 'serviceWorker' in navigator;
    case 'web-share':
      return 'share' in navigator;
    case 'clipboard':
      return 'clipboard' in navigator;
    case 'geolocation':
      return 'geolocation' in navigator;
    case 'vibration':
      return 'vibrate' in navigator;
    default:
      return false;
  }
};

// Initialize device detection
export const initDeviceDetection = () => {
  const deviceInfo = getDeviceInfo();
  const platformClasses = getPlatformClasses(deviceInfo);

  // Add platform classes to document
  document.documentElement.classList.add(...platformClasses);

  // Set CSS custom properties
  document.documentElement.style.setProperty('--device-pixel-ratio', deviceInfo.pixelRatio.toString());
  document.documentElement.style.setProperty('--touch-target-size', `${getTouchTargetSize(deviceInfo)}px`);

  // Listen for orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const newDeviceInfo = getDeviceInfo();
      document.documentElement.classList.toggle('portrait', newDeviceInfo.orientation === 'portrait');
      document.documentElement.classList.toggle('landscape', newDeviceInfo.orientation === 'landscape');
    }, 100);
  });

  return deviceInfo;
};
