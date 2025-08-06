import { ReactNode } from 'react';

// Shared types for all footer components
export interface NavigationItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  badge?: number;
  ariaLabel?: string;
}

export interface DeviceInfo {
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

export interface PlatformStyles {
  touchTarget: {
    minSize: number;
    recommendedSize: number;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
    };
  };
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    border: string;
    shadow: string;
    badge: string;
    focus: string;
    pressed: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    elevated: string;
  };
  animations: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      ease: string;
      spring: string;
      bounce: string;
    };
  };
}

export interface BaseFooterProps {
  items: NavigationItem[];
  deviceInfo: DeviceInfo;
  platformStyles: PlatformStyles;
}

// Animation variants type
export interface AnimationVariants {
  hidden: any;
  visible: any;
  tap?: any;
}

// Haptic feedback types
export type HapticType = 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy';

// Platform detection result
export interface PlatformDetection {
  platform: 'ios' | 'android' | 'web';
  version?: string;
  isTouch: boolean;
  userAgent: string;
}
