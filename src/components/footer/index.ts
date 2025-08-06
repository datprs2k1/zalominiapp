// Export all footer components and utilities
export { iOSFooter } from './iOSFooter';
export { AndroidFooter } from './AndroidFooter';
export { UniversalFooter } from './UniversalFooter';
export { BaseFooter } from './BaseFooter';

// Export types
export type {
  NavigationItem,
  DeviceInfo,
  PlatformStyles,
  BaseFooterProps,
  AnimationVariants,
  HapticType,
  PlatformDetection,
} from './types';

// Export constants
export {
  DIMENSIONS,
  IOS_STYLES,
  ANDROID_STYLES,
  WEB_STYLES,
  ANIMATION_VARIANTS,
} from './constants';

// Export utilities
export {
  detectPlatform,
  getDeviceInfo,
  getPlatformStyles,
  HapticFeedback,
  hapticFeedback,
  getNextIndex,
  generateButtonStyles,
  generateContainerStyles,
  generateBarStyles,
  getAriaLabel,
  debounce,
  throttle,
} from './utils';

// Export hooks
export {
  useFooterNavigation,
  useDeviceInfo,
  useFooterAnimations,
  useFooterAccessibility,
} from './hooks';

// Export navigation items
export {
  HomeIcon,
  AboutIcon,
  DEFAULT_NAV_ITEMS,
  createNavigationItems,
} from './navigation-items';
