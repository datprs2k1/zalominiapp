import { PlatformStyles, AnimationVariants } from './types';

// iOS-optimized dimensions for all platforms - Clean, consistent interface
export const DIMENSIONS = {
  ios: {
    height: 90, // iOS standard tab bar height - larger
    barHeight: 60, // iOS tab bar content height - larger
    buttonSize: 60, // iOS standard touch target - larger
    iconSize: 32, // iOS optimal icon size - larger
    maxWidth: 414, // iPhone Pro Max width
    safeAreaBottom: 20, // iOS safe area - closer to bottom
    showLabels: false, // Clean icon-only design
    compactMode: false, // iOS standard mode
    borderRadius: 0, // No background - clean iOS style
    spacing: 0, // iOS standard spacing (distributed)
    activeScale: 1.0, // No scaling to prevent overflow
    animationDuration: 200, // iOS standard animation
    hapticFeedback: true, // iOS haptic feedback
  },
  android: {
    height: 90, // Match iOS for consistency - larger
    barHeight: 60, // Match iOS - larger
    buttonSize: 60, // Match iOS touch targets - larger
    iconSize: 32, // Match iOS - larger
    maxWidth: 414, // Match iOS
    safeAreaBottom: 36, // Android navigation bar - increased for better spacing
    showLabels: false, // Clean icon-only design
    compactMode: false, // Match iOS
    borderRadius: 0, // No background - clean style
    spacing: 0, // Match iOS spacing
    activeScale: 1.0, // No scaling to prevent overflow
    animationDuration: 200, // Match iOS animation
    hapticFeedback: true, // Android haptic feedback
  },
  web: {
    height: 90, // Match iOS for consistency - larger
    barHeight: 60, // Match iOS - larger
    buttonSize: 60, // Match iOS touch targets - larger
    iconSize: 32, // Match iOS - larger
    maxWidth: 414, // Match iOS
    safeAreaBottom: 16, // Web safe area
    showLabels: false, // Clean icon-only design
    compactMode: false, // Match iOS
    borderRadius: 0, // No background - clean style
    spacing: 0, // Match iOS spacing
    activeScale: 1.0, // No scaling to prevent overflow
    animationDuration: 200, // Match iOS animation
    hapticFeedback: false, // No haptic on web
  },
} as const;

// iOS-specific styles
export const IOS_STYLES: PlatformStyles = {
  touchTarget: {
    minSize: 44,
    recommendedSize: 48,
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    fontSize: {
      small: '9px',
      medium: '11px',
      large: '13px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
  },
  colors: {
    background: 'rgba(255, 255, 255, 0.95)', // Footer background
    surface: 'rgba(255, 255, 255, 0.9)',
    primary: 'rgb(0, 122, 255)',
    secondary: 'rgba(60, 60, 67, 0.5)',
    text: {
      primary: 'rgb(0, 0, 0)',
      secondary: 'rgba(60, 60, 67, 0.5)',
      disabled: 'rgba(60, 60, 67, 0.3)',
    },
    border: 'rgba(0, 0, 0, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    badge: 'rgb(255, 59, 48)',
    focus: 'rgb(0, 122, 255)',
    pressed: 'transparent', // No background on press
    active: {
      background: 'transparent', // No background for clean iOS style
      backgroundSolid: 'transparent', // No background
      text: 'rgb(0, 122, 255)', // iOS blue for active state
      icon: 'rgb(0, 122, 255)', // iOS blue icons on active
      border: 'none', // No border
      glow: 'rgba(0, 122, 255, 0.3)', // iOS blue glow for active
      shadow: 'none', // No shadow for clean design
      scale: 1.08, // Subtle iOS-style scaling
    },
    inactive: {
      background: 'transparent', // No background
      text: 'rgba(60, 60, 67, 0.6)', // iOS gray for inactive
      icon: 'rgba(60, 60, 67, 0.6)', // iOS standard gray
      hover: 'rgba(0, 0, 0, 0.04)', // Subtle iOS hover
    },
    focus: {
      background: 'rgba(0, 122, 255, 0.08)', // iOS focus background
      border: '2px solid rgba(0, 122, 255, 0.3)', // iOS focus ring
      shadow: '0 0 0 4px rgba(0, 122, 255, 0.15)', // iOS focus shadow
      scale: 1.02, // Subtle focus scaling
      outline: 'none', // Remove default outline
    },
    hover: {
      background: 'rgba(0, 0, 0, 0.04)', // iOS hover background
      scale: 1.02, // Subtle hover scaling
      transition: 'all 150ms ease-out', // iOS hover timing
    },
    pressed: {
      background: 'rgba(0, 122, 255, 0.12)', // iOS pressed background
      scale: 0.96, // iOS pressed scaling
      transition: 'all 100ms ease-out', // Fast press response
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  animations: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      ease: 'ease',
      spring: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};

// Android-specific styles (Material Design 3)
export const ANDROID_STYLES: PlatformStyles = {
  touchTarget: {
    minSize: 48,
    recommendedSize: 56,
  },
  typography: {
    fontFamily: 'Roboto, system-ui, sans-serif',
    fontSize: {
      small: '10px',
      medium: '12px',
      large: '14px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
  },
  colors: {
    background: 'rgba(255, 255, 255, 0.95)', // Footer background
    surface: 'rgba(255, 255, 255, 0.9)',
    primary: 'rgb(0, 122, 255)',
    secondary: 'rgba(60, 60, 67, 0.5)',
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(60, 60, 67, 0.5)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    border: 'rgba(0, 0, 0, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    badge: 'rgb(255, 59, 48)',
    focus: 'rgb(0, 122, 255)',
    pressed: 'transparent', // No background on press
    active: {
      background: 'transparent', // No background for clean iOS style
      backgroundSolid: 'transparent', // No background
      text: 'rgb(0, 122, 255)', // iOS blue for active state
      icon: 'rgb(0, 122, 255)', // iOS blue icons on active
      border: 'none', // No border
      glow: 'rgba(0, 122, 255, 0.3)', // iOS blue glow for active
      shadow: 'none', // No shadow for clean design
      scale: 1.08, // Subtle iOS-style scaling
    },
    inactive: {
      background: 'transparent', // No background
      text: 'rgba(60, 60, 67, 0.6)', // iOS gray for inactive
      icon: 'rgba(60, 60, 67, 0.6)', // iOS standard gray
      hover: 'rgba(0, 0, 0, 0.04)', // Subtle iOS hover
    },
    focus: {
      background: 'rgba(0, 122, 255, 0.08)', // iOS focus background
      border: '2px solid rgba(0, 122, 255, 0.3)', // iOS focus ring
      shadow: '0 0 0 4px rgba(0, 122, 255, 0.15)', // iOS focus shadow
      scale: 1.02, // Subtle focus scaling
      outline: 'none', // Remove default outline
    },
    hover: {
      background: 'rgba(0, 0, 0, 0.04)', // iOS hover background
      scale: 1.02, // Subtle hover scaling
      transition: 'all 150ms ease-out', // iOS hover timing
    },
    pressed: {
      background: 'rgba(0, 122, 255, 0.12)', // iOS pressed background
      scale: 0.96, // iOS pressed scaling
      transition: 'all 100ms ease-out', // Fast press response
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.2)',
    md: '0 2px 8px rgba(0, 0, 0, 0.15)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.15)',
    elevated: '0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  animations: {
    duration: {
      fast: 100,
      normal: 200,
      slow: 300,
    },
    easing: {
      ease: 'ease',
      spring: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
};

// Web/Universal styles
export const WEB_STYLES: PlatformStyles = {
  touchTarget: {
    minSize: 44,
    recommendedSize: 48,
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      small: '9px',
      medium: '11px',
      large: '13px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
  },
  colors: {
    background: 'rgba(255, 255, 255, 0.95)', // Footer background
    surface: 'rgba(255, 255, 255, 0.9)',
    primary: 'rgb(0, 122, 255)',
    secondary: 'rgba(60, 60, 67, 0.5)',
    text: {
      primary: 'rgb(0, 0, 0)',
      secondary: 'rgba(60, 60, 67, 0.5)',
      disabled: 'rgba(60, 60, 67, 0.3)',
    },
    border: 'rgba(0, 0, 0, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    badge: 'rgb(255, 59, 48)',
    focus: 'rgb(0, 122, 255)',
    pressed: 'transparent', // No background on press
    active: {
      background: 'transparent', // No background for clean iOS style
      backgroundSolid: 'transparent', // No background
      text: 'rgb(0, 122, 255)', // iOS blue for active state
      icon: 'rgb(0, 122, 255)', // iOS blue icons on active
      border: 'none', // No border
      glow: 'rgba(0, 122, 255, 0.3)', // iOS blue glow for active
      shadow: 'none', // No shadow for clean design
      scale: 1.08, // Subtle iOS-style scaling
    },
    inactive: {
      background: 'transparent', // No background
      text: 'rgba(60, 60, 67, 0.6)', // iOS gray for inactive
      icon: 'rgba(60, 60, 67, 0.6)', // iOS standard gray
      hover: 'rgba(0, 0, 0, 0.04)', // Subtle iOS hover
    },
    focus: {
      background: 'rgba(0, 122, 255, 0.08)', // iOS focus background
      border: '2px solid rgba(0, 122, 255, 0.3)', // iOS focus ring
      shadow: '0 0 0 4px rgba(0, 122, 255, 0.15)', // iOS focus shadow
      scale: 1.02, // Subtle focus scaling
      outline: 'none', // Remove default outline
    },
    hover: {
      background: 'rgba(0, 0, 0, 0.04)', // iOS hover background
      scale: 1.02, // Subtle hover scaling
      transition: 'all 150ms ease-out', // iOS hover timing
    },
    pressed: {
      background: 'rgba(0, 122, 255, 0.12)', // iOS pressed background
      scale: 0.96, // iOS pressed scaling
      transition: 'all 100ms ease-out', // Fast press response
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.08)',
    elevated: '0 -4px 20px rgba(0, 0, 0, 0.08), 0 -2px 8px rgba(0, 0, 0, 0.04)',
  },
  animations: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      ease: 'ease',
      spring: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};

// Animation variants
export const ANIMATION_VARIANTS: Record<string, AnimationVariants> = {
  container: {
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
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  },
  badge: {
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
  },
};
