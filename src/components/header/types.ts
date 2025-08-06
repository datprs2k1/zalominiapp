/**
 * Header Component Types
 * Shared type definitions for all header components
 */

import { ReactNode } from 'react';
import { To } from 'react-router-dom';

// Platform types
export type Platform = 'ios' | 'android' | 'web';

// Header variant types
export type HeaderVariant = 'main' | 'navigation' | 'profile';

// Animation preferences
export interface AnimationConfig {
  prefersReducedMotion: boolean;
  enableTransitions: boolean;
  duration: number;
}

// Device information
export interface DeviceInfo {
  platform: Platform;
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

// Platform-specific styles
export interface PlatformStyles {
  touchTarget: Record<string, any>;
  typography: Record<string, any>;
  colors: Record<string, any>;
  spacing: Record<string, any>;
  borderRadius: Record<string, any>;
  shadows: Record<string, any>;
  animations: Record<string, any>;
}

// Header context
export interface HeaderContextValue {
  deviceInfo: DeviceInfo;
  platformStyles: PlatformStyles;
  animationConfig: AnimationConfig;
  isNavigating: boolean;
  setIsNavigating: (navigating: boolean) => void;
  handleNavigation: (to: To) => void;
  hapticFeedback: {
    light: () => void;
    medium: () => void;
    heavy: () => void;
  };
}

// Route handle information
export interface RouteHandle {
  title?: string;
  back?: boolean;
  profile?: boolean;
}

// Header props
export interface HeaderProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: HeaderVariant;
}

// Platform header props
export interface PlatformHeaderProps extends HeaderProps {
  platform: Platform;
  deviceInfo: DeviceInfo;
  platformStyles: PlatformStyles;
}

// Logo props
export interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}

// Back button props
export interface BackButtonProps {
  onNavigate: (to: To) => void;
  isNavigating?: boolean;
  className?: string;
  'aria-label'?: string;
}

// Title props
export interface TitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  truncate?: boolean;
}

// Error boundary props
export interface HeaderErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

// Accessibility labels
export interface AccessibilityLabels {
  skipLink: string;
  navigationStatus: string;
  mainHeader: string;
  logo: string;
  logoDescription: string;
  backButton: string;
  backButtonDescription: string;
  backButtonTitle: string;
}

// Header configuration
export interface HeaderConfig {
  showLogo: boolean;
  showTitle: boolean;
  showBackButton: boolean;
  showProfile: boolean;
  enableAnimations: boolean;
  enableHapticFeedback: boolean;
  accessibilityLabels: AccessibilityLabels;
}
