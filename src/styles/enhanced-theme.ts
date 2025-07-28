// Enhanced Theme System with Dark Mode Support
// Medical-focused color palette with accessibility compliance

export const ENHANCED_COLORS = {
  // Primary Medical Blue - Modern Hospital Theme
  primary: {
    50: '#EFF6FF', // Very light blue background - hospital white
    100: '#DBEAFE', // Light blue background
    200: '#BFDBFE', // Light blue border
    300: '#93C5FD', // Medium light blue
    400: '#60A5FA', // Medium blue
    500: '#2563EB', // Base primary - professional medical blue
    600: '#1E40AF', // Darker blue for hover states
    700: '#1D4ED8', // Dark blue for active states
    800: '#1E3A8A', // Very dark blue
    900: '#1E293B', // Darkest blue
  },

  // Secondary Medical Green - Soft Hospital Greens
  secondary: {
    50: '#ECFDF5', // Very light green background - hospital green tint
    100: '#D1FAE5', // Light green background
    200: '#A7F3D0', // Light green border
    300: '#6EE7B7', // Medium light green
    400: '#34D399', // Medium green
    500: '#10B981', // Base secondary - professional health green
    600: '#059669', // Darker green for hover states
    700: '#047857', // Dark green for active states
    800: '#065F46', // Very dark green
    900: '#064E3B', // Darkest green
  },

  // Medical Status Colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Success green
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Warning amber
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Error red
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Info blue
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Neutral Colors - Light Theme
  neutral: {
    50: '#FAFAFA', // Lightest background
    100: '#F5F5F5', // Light background
    200: '#E5E5E5', // Light border
    300: '#D4D4D4', // Medium light border
    400: '#A3A3A3', // Medium text
    500: '#737373', // Base text
    600: '#525252', // Dark text
    700: '#404040', // Darker text
    800: '#262626', // Very dark text
    900: '#171717', // Darkest text
  },

  // Medical Emergency Colors
  emergency: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#DC2626', // Emergency red
    600: '#B91C1C',
    700: '#991B1B',
    800: '#7F1D1D',
    900: '#450A0A',
  },

  // Medical Specialty Colors
  cardiology: '#E53E3E', // Heart red
  neurology: '#805AD5', // Brain purple
  pediatrics: '#38B2AC', // Child teal
  orthopedics: '#D69E2E', // Bone yellow
  oncology: '#9F7AEA', // Cancer purple
  dermatology: '#F56565', // Skin pink
  psychiatry: '#4299E1', // Mind blue
  radiology: '#48BB78', // Scan green
} as const;

// Dark Theme Colors
export const DARK_COLORS = {
  // Primary colors adjusted for dark mode
  primary: {
    50: '#001F3F',
    100: '#002E5C',
    200: '#004080',
    300: '#0052A3',
    400: '#0066CC',
    500: '#3B82F6', // Lighter primary for dark mode
    600: '#60A5FA',
    700: '#93C5FD',
    800: '#BFDBFE',
    900: '#DBEAFE',
  },

  // Background colors for dark mode
  background: {
    primary: '#0F172A', // Main dark background
    secondary: '#1E293B', // Card backgrounds
    tertiary: '#334155', // Elevated surfaces
  },

  // Text colors for dark mode
  text: {
    primary: '#F8FAFC', // Main text
    secondary: '#CBD5E1', // Secondary text
    muted: '#94A3B8', // Muted text
    disabled: '#64748B', // Disabled text
  },

  // Border colors for dark mode
  border: {
    primary: '#334155', // Main borders
    secondary: '#475569', // Hover borders
    focus: '#3B82F6', // Focus borders
  },
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  light: {
    colors: {
      // Background colors
      background: {
        primary: ENHANCED_COLORS.neutral[50],
        secondary: '#FFFFFF',
        tertiary: ENHANCED_COLORS.neutral[100],
        overlay: 'rgba(0, 0, 0, 0.5)',
      },

      // Text colors
      text: {
        primary: ENHANCED_COLORS.neutral[900],
        secondary: ENHANCED_COLORS.neutral[700],
        muted: ENHANCED_COLORS.neutral[500],
        disabled: ENHANCED_COLORS.neutral[400],
        inverse: '#FFFFFF',
      },

      // Border colors
      border: {
        primary: ENHANCED_COLORS.neutral[200],
        secondary: ENHANCED_COLORS.neutral[300],
        focus: ENHANCED_COLORS.primary[500],
        error: ENHANCED_COLORS.error[500],
      },

      // Surface colors
      surface: {
        primary: '#FFFFFF',
        secondary: ENHANCED_COLORS.neutral[50],
        elevated: '#FFFFFF',
        overlay: 'rgba(255, 255, 255, 0.95)',
      },

      // Medical context colors
      medical: {
        vital: ENHANCED_COLORS.error[500],
        normal: ENHANCED_COLORS.success[500],
        caution: ENHANCED_COLORS.warning[500],
        emergency: ENHANCED_COLORS.emergency[500],
      },
    },

    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      medical: '0 4px 12px rgba(0, 102, 204, 0.15)',
      emergency: '0 4px 12px rgba(220, 38, 38, 0.25)',
    },
  },

  dark: {
    colors: {
      // Background colors
      background: {
        primary: DARK_COLORS.background.primary,
        secondary: DARK_COLORS.background.secondary,
        tertiary: DARK_COLORS.background.tertiary,
        overlay: 'rgba(0, 0, 0, 0.8)',
      },

      // Text colors
      text: {
        primary: DARK_COLORS.text.primary,
        secondary: DARK_COLORS.text.secondary,
        muted: DARK_COLORS.text.muted,
        disabled: DARK_COLORS.text.disabled,
        inverse: ENHANCED_COLORS.neutral[900],
      },

      // Border colors
      border: {
        primary: DARK_COLORS.border.primary,
        secondary: DARK_COLORS.border.secondary,
        focus: DARK_COLORS.border.focus,
        error: ENHANCED_COLORS.error[400],
      },

      // Surface colors
      surface: {
        primary: DARK_COLORS.background.secondary,
        secondary: DARK_COLORS.background.tertiary,
        elevated: '#475569',
        overlay: 'rgba(15, 23, 42, 0.95)',
      },

      // Medical context colors (adjusted for dark mode)
      medical: {
        vital: ENHANCED_COLORS.error[400],
        normal: ENHANCED_COLORS.success[400],
        caution: ENHANCED_COLORS.warning[400],
        emergency: ENHANCED_COLORS.emergency[400],
      },
    },

    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      medical: '0 4px 12px rgba(59, 130, 246, 0.3)',
      emergency: '0 4px 12px rgba(239, 68, 68, 0.4)',
    },
  },
} as const;

// Accessibility Colors (WCAG AA compliant)
export const ACCESSIBILITY_COLORS = {
  // High contrast colors for better readability
  highContrast: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#0052CC',
    secondary: '#008844',
    error: '#CC0000',
    warning: '#CC6600',
    success: '#006600',
  },

  // Focus indicators
  focus: {
    ring: ENHANCED_COLORS.primary[500],
    ringOffset: '#FFFFFF',
    ringWidth: '2px',
    ringOpacity: '0.5',
  },

  // Color blind friendly palette
  colorBlindFriendly: {
    blue: '#0173B2',
    orange: '#DE8F05',
    green: '#029E73',
    red: '#CC78BC',
    purple: '#CA9161',
    brown: '#FBAFE4',
    pink: '#949494',
    gray: '#56B4E9',
  },
} as const;

// Theme utilities
export function getThemeColors(isDark: boolean = false) {
  return isDark ? THEME_CONFIG.dark.colors : THEME_CONFIG.light.colors;
}

export function getThemeShadows(isDark: boolean = false) {
  return isDark ? THEME_CONFIG.dark.shadows : THEME_CONFIG.light.shadows;
}

// CSS custom properties generator
export function generateCSSVariables(isDark: boolean = false) {
  const theme = isDark ? THEME_CONFIG.dark : THEME_CONFIG.light;
  const variables: Record<string, string> = {};

  // Generate color variables
  Object.entries(theme.colors).forEach(([category, colors]) => {
    Object.entries(colors).forEach(([name, value]) => {
      variables[`--color-${category}-${name}`] = value;
    });
  });

  // Generate shadow variables
  Object.entries(theme.shadows).forEach(([name, value]) => {
    variables[`--shadow-${name}`] = value;
  });

  return variables;
}

// Theme context type
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof THEME_CONFIG.light.colors;
  shadows: typeof THEME_CONFIG.light.shadows;
}

// Export default theme
export const DEFAULT_THEME = THEME_CONFIG.light;
export const DARK_THEME = THEME_CONFIG.dark;
