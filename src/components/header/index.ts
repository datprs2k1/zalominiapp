/**
 * Header Components Export Index
 * Centralized exports for all header-related components
 */

// Main components
export {
  HeaderProvider,
  useHeaderContext,
  useHeaderNavigation,
  useHeaderAnimations,
  useHeaderPlatform,
} from './HeaderProvider';
export {
  OptimizedHeaderProvider,
  useOptimizedHeaderContext,
  useOptimizedHeaderNavigation,
  useOptimizedHeaderAnimations,
  useOptimizedHeaderPlatform,
  useOptimizedHeader,
} from './OptimizedHeaderProvider';
export { PlatformHeader } from './PlatformHeader';
export { HeaderErrorBoundary, HeaderErrorBoundaryWrapper } from './HeaderErrorBoundary';

// Platform-specific headers
export { IOSHeader } from './platforms/IOSHeader';
export { AndroidHeader } from './platforms/AndroidHeader';
export { WebHeader } from './platforms/WebHeader';
export { BaseHeader } from './platforms/BaseHeader';

// Individual components
export { SkipLink } from './components/SkipLink';
export { NavigationStatus } from './components/NavigationStatus';
export { Logo } from './components/Logo';
export { OptimizedLogo } from './components/OptimizedLogo';
export { Branding } from './components/Branding';
export { BackButton } from './components/BackButton';
export { OptimizedBackButton } from './components/OptimizedBackButton';
export { Title } from './components/Title';

// Utilities
export * from './utils/performance';
export * from './utils/accessibility';

// Types and constants
export type {
  Platform,
  HeaderVariant,
  AnimationConfig,
  DeviceInfo,
  PlatformStyles,
  HeaderContextValue,
  RouteHandle,
  HeaderProps,
  PlatformHeaderProps,
  LogoProps,
  BackButtonProps,
  TitleProps,
  HeaderErrorBoundaryProps,
  AccessibilityLabels,
  HeaderConfig,
} from './types';

export {
  SKIP_LINK_ID,
  SCROLL_THRESHOLD,
  NAVIGATION_TIMEOUT,
  ANIMATION_DURATIONS,
  ACCESSIBILITY_LABELS,
  HEADER_STYLES,
  LOGO_STYLES,
  BACK_BUTTON_STYLES,
  HEADER_HEIGHTS,
  DEFAULT_HEADER_CONFIG,
  MEDICAL_BRANDING,
  CSS_CLASSES,
} from './constants';
