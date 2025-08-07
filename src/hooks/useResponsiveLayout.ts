/**
 * Responsive Layout Hook for Mobile-Optimized About Page
 * Provides responsive utilities and breakpoint management for mobile devices
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useEnhancedMobile } from './use-enhanced-mobile';

// Responsive breakpoints optimized for mobile-first design
export const MOBILE_BREAKPOINTS = {
  xs: 320,   // Small phones
  sm: 375,   // Standard phones (iPhone SE, etc.)
  md: 414,   // Large phones (iPhone Pro, etc.)
  lg: 768,   // Small tablets / Large phones landscape
  xl: 1024,  // Tablets
  xxl: 1200, // Desktop (fallback)
} as const;

export type BreakpointKey = keyof typeof MOBILE_BREAKPOINTS;

export interface ViewportDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface ResponsiveState {
  currentBreakpoint: BreakpointKey;
  viewport: ViewportDimensions;
  isPortrait: boolean;
  isLandscape: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  devicePixelRatio: number;
}

export interface ResponsiveLayoutConfig {
  // Grid configuration
  columns: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  
  // Spacing configuration
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  
  // Typography scaling
  typography: {
    scale: number;
    lineHeight: number;
  };
  
  // Touch target sizing
  touchTargets: {
    minimum: string;
    recommended: string;
    large: string;
  };
}

export const useResponsiveLayout = () => {
  const { deviceInfo, platformStyles } = useEnhancedMobile();
  const [responsiveState, setResponsiveState] = useState<ResponsiveState>({
    currentBreakpoint: 'sm',
    viewport: { width: 375, height: 667, aspectRatio: 0.56 },
    isPortrait: true,
    isLandscape: false,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    devicePixelRatio: 1,
  });

  // Update responsive state based on viewport changes
  const updateResponsiveState = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Determine current breakpoint
    let currentBreakpoint: BreakpointKey = 'xs';
    if (width >= MOBILE_BREAKPOINTS.xxl) currentBreakpoint = 'xxl';
    else if (width >= MOBILE_BREAKPOINTS.xl) currentBreakpoint = 'xl';
    else if (width >= MOBILE_BREAKPOINTS.lg) currentBreakpoint = 'lg';
    else if (width >= MOBILE_BREAKPOINTS.md) currentBreakpoint = 'md';
    else if (width >= MOBILE_BREAKPOINTS.sm) currentBreakpoint = 'sm';

    // Determine device categories
    const isMobile = width < MOBILE_BREAKPOINTS.lg;
    const isTablet = width >= MOBILE_BREAKPOINTS.lg && width < MOBILE_BREAKPOINTS.xxl;
    const isDesktop = width >= MOBILE_BREAKPOINTS.xxl;
    const isPortrait = height > width;
    const isLandscape = width > height;

    setResponsiveState({
      currentBreakpoint,
      viewport: { width, height, aspectRatio },
      isPortrait,
      isLandscape,
      isMobile,
      isTablet,
      isDesktop,
      devicePixelRatio,
    });
  }, []);

  // Initialize and listen for viewport changes
  useEffect(() => {
    updateResponsiveState();

    const handleResize = () => {
      updateResponsiveState();
    };

    const handleOrientationChange = () => {
      // Delay to ensure viewport dimensions are updated
      setTimeout(updateResponsiveState, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [updateResponsiveState]);

  // Generate responsive layout configuration
  const layoutConfig = useMemo<ResponsiveLayoutConfig>(() => {
    const isIOS = deviceInfo.platform === 'ios';
    const baseSpacing = isIOS ? 8 : 4;

    return {
      columns: {
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
      },
      spacing: {
        xs: `${baseSpacing}px`,
        sm: `${baseSpacing * 1.5}px`,
        md: `${baseSpacing * 2}px`,
        lg: `${baseSpacing * 3}px`,
      },
      typography: {
        scale: responsiveState.isMobile ? 0.9 : 1,
        lineHeight: responsiveState.isMobile ? 1.4 : 1.5,
      },
      touchTargets: {
        minimum: isIOS ? '44px' : '48px',
        recommended: isIOS ? '48px' : '56px',
        large: isIOS ? '56px' : '64px',
      },
    };
  }, [deviceInfo.platform, responsiveState.isMobile]);

  // Responsive utility functions
  const getResponsiveValue = useCallback(<T>(values: Partial<Record<BreakpointKey, T>>): T | undefined => {
    const { currentBreakpoint } = responsiveState;
    
    // Find the appropriate value for current breakpoint or fallback to smaller breakpoints
    const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    
    for (let i = currentIndex; i >= 0; i--) {
      const breakpoint = breakpointOrder[i];
      if (values[breakpoint] !== undefined) {
        return values[breakpoint];
      }
    }
    
    return undefined;
  }, [responsiveState.currentBreakpoint]);

  // Generate responsive CSS classes
  const getResponsiveClasses = useCallback((baseClass: string = '') => {
    const { currentBreakpoint, isPortrait, isLandscape, isMobile, isTablet } = responsiveState;
    
    return [
      baseClass,
      `breakpoint-${currentBreakpoint}`,
      isPortrait ? 'orientation-portrait' : 'orientation-landscape',
      isMobile ? 'device-mobile' : isTablet ? 'device-tablet' : 'device-desktop',
      `platform-${deviceInfo.platform}`,
    ].filter(Boolean).join(' ');
  }, [responsiveState, deviceInfo.platform]);

  // Calculate optimal grid columns for current viewport
  const getOptimalColumns = useCallback((maxColumns: number = 4): number => {
    const { width } = responsiveState.viewport;
    const minColumnWidth = 280; // Minimum width for readable content
    const availableWidth = width - 32; // Account for padding
    const calculatedColumns = Math.floor(availableWidth / minColumnWidth);
    
    return Math.min(Math.max(calculatedColumns, 1), maxColumns);
  }, [responsiveState.viewport]);

  // Generate responsive spacing values
  const getResponsiveSpacing = useCallback((size: 'xs' | 'sm' | 'md' | 'lg' = 'md') => {
    return layoutConfig.spacing[size];
  }, [layoutConfig.spacing]);

  // Check if current viewport matches breakpoint
  const isBreakpoint = useCallback((breakpoint: BreakpointKey): boolean => {
    return responsiveState.currentBreakpoint === breakpoint;
  }, [responsiveState.currentBreakpoint]);

  // Check if current viewport is at least the specified breakpoint
  const isBreakpointUp = useCallback((breakpoint: BreakpointKey): boolean => {
    const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const currentIndex = breakpointOrder.indexOf(responsiveState.currentBreakpoint);
    const targetIndex = breakpointOrder.indexOf(breakpoint);
    
    return currentIndex >= targetIndex;
  }, [responsiveState.currentBreakpoint]);

  // Check if current viewport is below the specified breakpoint
  const isBreakpointDown = useCallback((breakpoint: BreakpointKey): boolean => {
    const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const currentIndex = breakpointOrder.indexOf(responsiveState.currentBreakpoint);
    const targetIndex = breakpointOrder.indexOf(breakpoint);
    
    return currentIndex < targetIndex;
  }, [responsiveState.currentBreakpoint]);

  // Generate responsive font size
  const getResponsiveFontSize = useCallback((baseSize: number): string => {
    const scale = layoutConfig.typography.scale;
    const scaledSize = baseSize * scale;
    
    // Ensure minimum readable size on mobile
    const minSize = responsiveState.isMobile ? 14 : 16;
    const finalSize = Math.max(scaledSize, minSize);
    
    return `${finalSize}px`;
  }, [layoutConfig.typography.scale, responsiveState.isMobile]);

  // Calculate safe area padding
  const getSafeAreaPadding = useCallback(() => {
    const isIOS = deviceInfo.platform === 'ios';
    
    if (!isIOS) {
      return {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
      };
    }

    return {
      top: 'env(safe-area-inset-top, 20px)',
      bottom: 'env(safe-area-inset-bottom, 20px)',
      left: 'env(safe-area-inset-left, 0px)',
      right: 'env(safe-area-inset-right, 0px)',
    };
  }, [deviceInfo.platform]);

  return {
    // State
    responsiveState,
    layoutConfig,
    
    // Utility functions
    getResponsiveValue,
    getResponsiveClasses,
    getOptimalColumns,
    getResponsiveSpacing,
    getResponsiveFontSize,
    getSafeAreaPadding,
    
    // Breakpoint checks
    isBreakpoint,
    isBreakpointUp,
    isBreakpointDown,
    
    // Convenience properties
    isMobile: responsiveState.isMobile,
    isTablet: responsiveState.isTablet,
    isDesktop: responsiveState.isDesktop,
    isPortrait: responsiveState.isPortrait,
    isLandscape: responsiveState.isLandscape,
    currentBreakpoint: responsiveState.currentBreakpoint,
    viewport: responsiveState.viewport,
  };
};
