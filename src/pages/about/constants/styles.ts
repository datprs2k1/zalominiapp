// Style constants for About page components
// Provides TypeScript integration with CSS design tokens

export const MEDICAL_COLORS = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  secondary: '#10b981',
  secondaryHover: '#059669',
  accent: '#f59e0b',
  accentHover: '#d97706',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

export const MEDICAL_SURFACES = {
  surface: '#ffffff',
  surfaceElevated: '#f8fafc',
  surfaceOverlay: 'rgba(255, 255, 255, 0.95)',
} as const;

export const MEDICAL_TEXT = {
  primary: '#1f2937',
  secondary: '#6b7280',
  muted: '#9ca3af',
  inverse: '#ffffff',
} as const;

export const MEDICAL_SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const MEDICAL_RADIUS = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const;

export const MEDICAL_SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

export const MEDICAL_TYPOGRAPHY = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

export const MEDICAL_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const MEDICAL_Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

export const MEDICAL_DURATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

export const MEDICAL_EASINGS = {
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

// Utility functions for style generation
export const createMedicalGradient = (
  color1: keyof typeof MEDICAL_COLORS,
  color2: keyof typeof MEDICAL_COLORS,
  direction: string = '135deg'
): string => {
  return `linear-gradient(${direction}, ${MEDICAL_COLORS[color1]}, ${MEDICAL_COLORS[color2]})`;
};

export const createMedicalShadow = (
  size: keyof typeof MEDICAL_SHADOWS,
  color: string = 'rgba(0, 0, 0, 0.1)'
): string => {
  return MEDICAL_SHADOWS[size].replace('rgba(0, 0, 0, 0.1)', color);
};

export const createResponsiveValue = <T>(
  values: Partial<Record<keyof typeof MEDICAL_BREAKPOINTS | 'base', T>>
): Record<string, T> => {
  const result: Record<string, T> = {};
  
  if (values.base !== undefined) {
    result.base = values.base;
  }
  
  Object.entries(MEDICAL_BREAKPOINTS).forEach(([breakpoint, size]) => {
    if (values[breakpoint as keyof typeof MEDICAL_BREAKPOINTS] !== undefined) {
      result[`@media (min-width: ${size})`] = values[breakpoint as keyof typeof MEDICAL_BREAKPOINTS]!;
    }
  });
  
  return result;
};

// Common style combinations
export const MEDICAL_BUTTON_STYLES = {
  primary: {
    background: createMedicalGradient('primary', 'primaryHover'),
    color: MEDICAL_TEXT.inverse,
    boxShadow: MEDICAL_SHADOWS.md,
    borderRadius: MEDICAL_RADIUS.lg,
    padding: `${MEDICAL_SPACING.md} ${MEDICAL_SPACING.lg}`,
    fontWeight: MEDICAL_TYPOGRAPHY.fontWeight.semibold,
    transition: `all ${MEDICAL_DURATIONS.normal} ${MEDICAL_EASINGS.out}`,
  },
  secondary: {
    background: MEDICAL_SURFACES.surface,
    color: MEDICAL_COLORS.primary,
    border: `2px solid ${MEDICAL_COLORS.primary}`,
    borderRadius: MEDICAL_RADIUS.lg,
    padding: `${MEDICAL_SPACING.md} ${MEDICAL_SPACING.lg}`,
    fontWeight: MEDICAL_TYPOGRAPHY.fontWeight.semibold,
    transition: `all ${MEDICAL_DURATIONS.normal} ${MEDICAL_EASINGS.out}`,
  },
} as const;

export const MEDICAL_CARD_STYLES = {
  base: {
    background: MEDICAL_SURFACES.surface,
    border: `1px solid #e5e7eb`,
    borderRadius: MEDICAL_RADIUS.xl,
    boxShadow: MEDICAL_SHADOWS.md,
    transition: `all ${MEDICAL_DURATIONS.normal} ${MEDICAL_EASINGS.out}`,
  },
  elevated: {
    background: MEDICAL_SURFACES.surfaceElevated,
    boxShadow: MEDICAL_SHADOWS.lg,
  },
  interactive: {
    cursor: 'pointer',
    ':hover': {
      boxShadow: MEDICAL_SHADOWS.xl,
      transform: 'translateY(-4px)',
    },
  },
} as const;

// Type definitions for style props
export type MedicalColor = keyof typeof MEDICAL_COLORS;
export type MedicalSpacing = keyof typeof MEDICAL_SPACING;
export type MedicalRadius = keyof typeof MEDICAL_RADIUS;
export type MedicalShadow = keyof typeof MEDICAL_SHADOWS;
export type MedicalBreakpoint = keyof typeof MEDICAL_BREAKPOINTS;
export type MedicalDuration = keyof typeof MEDICAL_DURATIONS;
export type MedicalEasing = keyof typeof MEDICAL_EASINGS;
