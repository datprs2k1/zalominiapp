/**
 * Enhanced Mobile Design System for Zalo Mini App Healthcare
 * Optimized for both Android (Material Design) and iOS (Human Interface Guidelines)
 */

// Platform Detection
export const detectPlatform = (): 'ios' | 'android' | 'web' => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  return 'web';
};

// Enhanced Touch Target System
export const ENHANCED_TOUCH_TARGETS = {
  // iOS Human Interface Guidelines
  ios: {
    minimum: '44px',
    recommended: '48px',
    large: '56px',
    spacing: '8px',
  },
  // Material Design Guidelines
  android: {
    minimum: '48px',
    recommended: '56px',
    large: '64px',
    spacing: '8px',
  },
  // Universal fallback
  universal: {
    minimum: '44px',
    recommended: '48px',
    large: '56px',
    spacing: '8px',
  },
} as const;

// Enhanced Typography System
export const ENHANCED_TYPOGRAPHY = {
  ios: {
    // iOS Typography Scale
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      secondary: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      monospace: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    },
    fontSize: {
      caption2: ['11px', '13px'],
      caption1: ['12px', '16px'],
      footnote: ['13px', '18px'],
      subheadline: ['15px', '20px'],
      callout: ['16px', '21px'],
      body: ['17px', '22px'],
      headline: ['17px', '22px'],
      title3: ['20px', '25px'],
      title2: ['22px', '28px'],
      title1: ['28px', '34px'],
      largeTitle: ['34px', '41px'],
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      heavy: '800',
    },
  },
  android: {
    // Material Design Typography Scale
    fontFamily: {
      primary: '"Roboto", "Noto Sans", system-ui, sans-serif',
      secondary: '"Roboto", "Noto Sans", system-ui, sans-serif',
      monospace: '"Roboto Mono", "Noto Sans Mono", monospace',
    },
    fontSize: {
      caption: ['12px', '16px'],
      overline: ['12px', '32px'],
      body2: ['14px', '20px'],
      body1: ['16px', '24px'],
      button: ['14px', '16px'],
      subtitle2: ['14px', '22px'],
      subtitle1: ['16px', '28px'],
      h6: ['20px', '32px'],
      h5: ['24px', '32px'],
      h4: ['34px', '36px'],
      h3: ['48px', '50px'],
      h2: ['60px', '62px'],
      h1: ['96px', '98px'],
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      bold: '700',
      black: '900',
    },
  },
} as const;

// Enhanced Color System with Platform Variants
export const ENHANCED_PLATFORM_COLORS = {
  ios: {
    // iOS System Colors
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemIndigo: '#5856D6',
    systemOrange: '#FF9500',
    systemPink: '#FF2D92',
    systemPurple: '#AF52DE',
    systemRed: '#FF3B30',
    systemTeal: '#5AC8FA',
    systemYellow: '#FFCC00',
    // iOS Gray Colors
    systemGray: '#8E8E93',
    systemGray2: '#AEAEB2',
    systemGray3: '#C7C7CC',
    systemGray4: '#D1D1D6',
    systemGray5: '#E5E5EA',
    systemGray6: '#F2F2F7',
    // iOS Label Colors
    label: '#000000',
    secondaryLabel: '#3C3C43',
    tertiaryLabel: '#3C3C43',
    quaternaryLabel: '#2C2C2E',
    // iOS Background Colors
    systemBackground: '#FFFFFF',
    secondarySystemBackground: '#F2F2F7',
    tertiarySystemBackground: '#FFFFFF',
  },
  android: {
    // Material Design 3 Colors
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',
    tertiary: '#7D5260',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD8E4',
    onTertiaryContainer: '#31111D',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    background: '#FFFBFE',
    onBackground: '#1C1B1F',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
  },
} as const;

// Enhanced Spacing System
export const ENHANCED_SPACING = {
  ios: {
    // iOS spacing based on 8pt grid
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    // iOS specific spacing
    margin: '16px',
    padding: '16px',
    sectionSpacing: '35px',
  },
  android: {
    // Material Design spacing based on 8dp grid
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    // Material specific spacing
    margin: '16px',
    padding: '16px',
    sectionSpacing: '32px',
  },
} as const;

// Enhanced Border Radius System
export const ENHANCED_BORDER_RADIUS = {
  ios: {
    // iOS corner radius
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '20px',
    continuous: '50%', // iOS continuous corner style
  },
  android: {
    // Material Design corner radius
    none: '0px',
    extraSmall: '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '28px',
    full: '50%',
  },
} as const;

// Enhanced Shadow System
export const ENHANCED_SHADOWS = {
  ios: {
    // iOS shadow system
    small: '0 1px 3px rgba(0, 0, 0, 0.12)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.12)',
    large: '0 10px 15px rgba(0, 0, 0, 0.12)',
    xlarge: '0 20px 25px rgba(0, 0, 0, 0.12)',
  },
  android: {
    // Material Design elevation system
    level0: 'none',
    level1: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
    level2: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
    level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
    level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)',
    level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)',
  },
} as const;

// Platform-specific utility functions
export const getPlatformValue = <T>(values: { ios: T; android: T; universal?: T }): T => {
  const platform = detectPlatform();
  return values[platform] || values.universal || values.ios;
};

export const getPlatformTouchTarget = () => {
  return getPlatformValue(ENHANCED_TOUCH_TARGETS);
};

export const getPlatformTypography = () => {
  return getPlatformValue(ENHANCED_TYPOGRAPHY);
};

export const getPlatformColors = () => {
  return getPlatformValue(ENHANCED_PLATFORM_COLORS);
};

export const getPlatformSpacing = () => {
  return getPlatformValue(ENHANCED_SPACING);
};

export const getPlatformBorderRadius = () => {
  return getPlatformValue(ENHANCED_BORDER_RADIUS);
};

export const getPlatformShadows = () => {
  return getPlatformValue(ENHANCED_SHADOWS);
};

// Enhanced Animation System
export const ENHANCED_ANIMATIONS = {
  ios: {
    // iOS animation curves
    easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    easeIn: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    // iOS timing
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    // iOS-specific animation properties
    springConfig: {
      stiffness: 400,
      damping: 30,
      mass: 0.8,
    },
    tapScale: 0.95,
    tapDuration: '100ms',
  },
  android: {
    // Material Design motion
    standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
    emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    // Material timing
    short1: '50ms',
    short2: '100ms',
    short3: '150ms',
    short4: '200ms',
    medium1: '250ms',
    medium2: '300ms',
    medium3: '350ms',
    medium4: '400ms',
    long1: '450ms',
    long2: '500ms',
    long3: '550ms',
    long4: '600ms',
    // Material Design-specific animation properties
    rippleDuration: '300ms',
    stateLayerDuration: '150ms',
    tapScale: 0.95,
    tapDuration: '150ms',
  },
} as const;

// Enhanced Footer-Specific Design Tokens
export const ENHANCED_FOOTER_TOKENS = {
  ios: {
    height: '83px', // 49pt content + 34pt safe area
    contentHeight: '49px',
    backgroundColor: 'rgba(248, 248, 248, 0.94)',
    backdropFilter: 'blur(20px)',
    borderTop: '0.5px solid rgba(60, 60, 67, 0.29)',
    itemSpacing: '8px',
    itemPadding: '4px 8px',
    itemRadius: '8px',
    iconSize: '20px',
    labelSize: '10px',
    labelWeight: '400',
    selectedLabelWeight: '600',
    selectedColor: 'rgb(0, 122, 255)',
    unselectedColor: 'rgba(60, 60, 67, 0.6)',
    badgeColor: 'rgb(255, 59, 48)',
    badgeSize: '17px',
    badgeRadius: '8.5px',
    focusColor: 'rgb(0, 122, 255)',
  },
  android: {
    height: '80px',
    contentHeight: '56px',
    backgroundColor: 'rgb(248, 250, 252)',
    elevation: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
    borderTop: '1px solid rgb(226, 232, 240)',
    itemSpacing: '8px',
    itemPadding: '12px 8px 16px',
    itemRadius: '16px',
    iconSize: '20px',
    labelSize: '12px',
    labelWeight: '500',
    selectedLabelWeight: '600',
    selectedColor: 'rgb(30, 64, 175)',
    selectedBackground: 'rgb(219, 234, 254)',
    unselectedColor: 'rgb(75, 85, 99)',
    badgeColor: 'rgb(239, 68, 68)',
    badgeSize: '16px',
    badgeRadius: '8px',
    focusColor: 'rgb(37, 99, 235)',
    rippleColor: 'rgba(37, 99, 235, 0.12)',
  },
} as const;

// Platform-specific footer token getters
export const getPlatformFooterTokens = () => {
  return getPlatformValue(ENHANCED_FOOTER_TOKENS);
};
