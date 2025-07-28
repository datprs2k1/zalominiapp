/**
 * Unified Color System for Medical Zalo Mini App
 * Centralized color management with medical design principles
 * Version: 1.0.0
 *
 * This file serves as the single source of truth for all colors in the application.
 * All other color definitions should reference these tokens.
 */

// ===== CORE MEDICAL COLOR PALETTE =====

export const MEDICAL_COLOR_PALETTE = {
  // Primary Medical Blues - Professional & Trustworthy
  medical: {
    blue: {
      50: '#EFF6FF', // Ultra light medical background
      100: '#DBEAFE', // Light medical background
      200: '#BFDBFE', // Light medical border
      300: '#93C5FD', // Medium light medical
      400: '#60A5FA', // Medium medical
      500: '#2563EB', // Primary medical blue - main brand color
      600: '#1E40AF', // Dark medical blue - hover states
      700: '#1D4ED8', // Darker medical blue - active states
      800: '#1E3A8A', // Very dark medical blue
      900: '#1E293B', // Darkest medical blue
    },

    // Healing Greens - Growth & Recovery
    green: {
      50: '#ECFDF5', // Ultra light healing background
      100: '#D1FAE5', // Light healing background
      200: '#A7F3D0', // Light healing border
      300: '#6EE7B7', // Medium light healing
      400: '#34D399', // Medium healing
      500: '#10B981', // Primary healing green
      600: '#059669', // Dark healing green - hover states
      700: '#047857', // Darker healing green
      800: '#065F46', // Very dark healing green
      900: '#064E3B', // Darkest healing green
    },

    // Trust Cyan - Reliability & Communication
    cyan: {
      50: '#ECFEFF', // Ultra light trust background
      100: '#CFFAFE', // Light trust background
      200: '#A5F3FC', // Light trust border
      300: '#67E8F9', // Medium light trust
      400: '#22D3EE', // Medium trust
      500: '#0891B2', // Primary trust cyan
      600: '#0E7490', // Dark trust cyan
      700: '#155E75', // Darker trust cyan
      800: '#164E63', // Very dark trust cyan
      900: '#083344', // Darkest trust cyan
    },
  },

  // Medical Context Colors
  semantic: {
    // Emergency & Critical
    emergency: {
      50: '#FEF2F2', // Light emergency background
      100: '#FEE2E2', // Emergency background
      200: '#FECACA', // Emergency border
      300: '#FCA5A5', // Light emergency
      400: '#F87171', // Medium emergency
      500: '#DC2626', // Primary emergency red
      600: '#B91C1C', // Dark emergency
      700: '#991B1B', // Darker emergency
      800: '#7F1D1D', // Very dark emergency
      900: '#450A0A', // Darkest emergency
    },

    // Warning & Caution
    warning: {
      50: '#FFFBEB', // Light warning background
      100: '#FEF3C7', // Warning background
      200: '#FDE68A', // Warning border
      300: '#FCD34D', // Light warning
      400: '#FBBF24', // Medium warning
      500: '#F59E0B', // Primary warning amber
      600: '#D97706', // Dark warning
      700: '#B45309', // Darker warning
      800: '#92400E', // Very dark warning
      900: '#451A03', // Darkest warning
    },

    // Success & Normal
    success: {
      50: '#F0FDF4', // Light success background
      100: '#DCFCE7', // Success background
      200: '#BBF7D0', // Success border
      300: '#86EFAC', // Light success
      400: '#4ADE80', // Medium success
      500: '#22C55E', // Primary success green
      600: '#16A34A', // Dark success
      700: '#15803D', // Darker success
      800: '#166534', // Very dark success
      900: '#14532D', // Darkest success
    },

    // Information & Guidance
    info: {
      50: '#F0F9FF', // Light info background
      100: '#E0F2FE', // Info background
      200: '#BAE6FD', // Info border
      300: '#7DD3FC', // Light info
      400: '#38BDF8', // Medium info
      500: '#0EA5E9', // Primary info blue
      600: '#0284C7', // Dark info
      700: '#0369A1', // Darker info
      800: '#075985', // Very dark info
      900: '#0C4A6E', // Darkest info
    },
  },

  // Neutral Colors - Hospital Environment
  neutral: {
    // Pure Medical Whites
    white: {
      pure: '#FFFFFF', // Pure hospital white
      warm: '#FEFEFE', // Slightly warm white for comfort
      cool: '#FDFDFE', // Cool white for clinical areas
      soft: '#FAFBFC', // Soft white for backgrounds
      pearl: '#F8F9FB', // Pearl white for subtle contrast
    },

    // Medical Grays - Professional & Clean
    gray: {
      50: '#F8FAFC', // Ultra light gray - hospital background
      100: '#F1F5F9', // Very light gray
      200: '#E2E8F0', // Light gray - borders
      300: '#CBD5E1', // Medium light gray
      400: '#94A3B8', // Medium gray - muted text
      500: '#64748B', // Base gray - secondary text
      600: '#475569', // Dark gray - primary text
      700: '#334155', // Darker gray
      800: '#1E293B', // Very dark gray
      900: '#0F172A', // Darkest gray - dark mode background
    },
  },
} as const;

// ===== SEMANTIC COLOR TOKENS =====

export const COLOR_TOKENS = {
  // Modern Hospital Primary Colors - Trust & Professionalism
  primary: '#2563EB', // Medical Blue - Primary actions, trust
  'primary-hover': '#1E40AF', // Dark Blue - Hover states, depth
  'primary-active': '#1D4ED8', // Accent Blue - Active states
  'primary-light': '#DBEAFE', // Light Blue - Backgrounds, subtle highlights
  'primary-dark': '#1E3A8A', // Dark Blue - Emphasis, headers
  'primary-50': '#EFF6FF', // Ultra light medical background
  'primary-100': '#DBEAFE', // Light medical background
  'primary-200': '#BFDBFE', // Light medical border
  'primary-300': '#93C5FD', // Medium light medical
  'primary-400': '#60A5FA', // Medium medical
  'primary-500': '#2563EB', // Primary medical blue
  'primary-600': '#1E40AF', // Dark medical blue
  'primary-700': '#1D4ED8', // Darker medical blue
  'primary-800': '#1E3A8A', // Very dark medical blue
  'primary-900': '#1E293B', // Darkest medical blue

  // Healing Colors - Health & Recovery
  secondary: '#10B981', // Healing Green - Success, health
  'secondary-hover': '#059669', // Dark Green - Hover states
  'secondary-active': '#047857', // Accent Green - Active states
  'secondary-light': '#D1FAE5', // Light Green - Positive feedback backgrounds
  'secondary-dark': '#065F46', // Dark Green - Emphasis
  'secondary-50': '#ECFDF5', // Ultra light healing background
  'secondary-100': '#D1FAE5', // Light healing background
  'secondary-200': '#A7F3D0', // Light healing border
  'secondary-300': '#6EE7B7', // Medium light healing
  'secondary-400': '#34D399', // Medium healing
  'secondary-500': '#10B981', // Primary healing green
  'secondary-600': '#059669', // Dark healing green
  'secondary-700': '#047857', // Darker healing green
  'secondary-800': '#065F46', // Very dark healing green
  'secondary-900': '#064E3B', // Darkest healing green

  // Trust-Building Colors - Enhanced Professional Medical Services
  accent: '#0891B2', // Trust Cyan - Links, medical info
  'accent-hover': '#0E7490', // Dark Cyan - Hover states
  'accent-active': '#155E75', // Accent Cyan - Active states
  'accent-light': '#CFFAFE', // Light Cyan - Backgrounds, highlights
  'accent-dark': '#164E63', // Dark Cyan - Emphasis
  'accent-50': '#F0FDFF', // Ultra light trust background
  'accent-100': '#CFFAFE', // Light trust background
  'accent-200': '#A5F3FC', // Light trust border
  'accent-300': '#67E8F9', // Medium light trust
  'accent-400': '#22D3EE', // Medium trust
  'accent-500': '#0891B2', // Primary trust cyan
  'accent-600': '#0E7490', // Dark trust cyan
  'accent-700': '#155E75', // Darker trust cyan
  'accent-800': '#164E63', // Very dark trust cyan
  'accent-900': '#083344', // Darkest trust cyan

  // Enhanced Modern Hospital Background Colors
  background: '#FFFFFF', // Pure white - Clean medical environment
  'background-secondary': '#FAFBFC', // Medical white - Soft backgrounds
  'background-tertiary': '#F8FAFC', // Pearl medical white - card backgrounds
  'background-quaternary': '#F1F5F9', // Subtle medical gray - section backgrounds
  'background-elevated': MEDICAL_COLOR_PALETTE.neutral.white.pure,
  'background-overlay': 'rgba(0, 0, 0, 0.5)', // Modal overlay
  'background-medical': '#FEFEFE', // Slightly warm white for comfort
  'background-clinical': '#FDFDFE', // Cool white for clinical areas
  'background-emergency': MEDICAL_COLOR_PALETTE.semantic.emergency[50], // Emergency background
  'background-success': MEDICAL_COLOR_PALETTE.semantic.success[50], // Success background

  // Enhanced Medical Surface Colors - Premium Hospital Hierarchy
  surface: MEDICAL_COLOR_PALETTE.neutral.white.pure,
  'surface-secondary': '#FAFBFC', // Secondary surface
  'surface-tertiary': '#F8FAFC', // Tertiary surface
  'surface-elevated': MEDICAL_COLOR_PALETTE.neutral.white.pure,
  'surface-hover': MEDICAL_COLOR_PALETTE.neutral.gray[50],
  'surface-medical': MEDICAL_COLOR_PALETTE.medical.green[50],
  'surface-overlay': 'rgba(255, 255, 255, 0.95)', // Light overlay
  'surface-glass': 'rgba(255, 255, 255, 0.8)', // Glass morphism effect
  'surface-card': '#FFFFFF', // Card surface
  'surface-interactive': '#FAFBFC', // Interactive surface

  // Text Colors
  'text-primary': MEDICAL_COLOR_PALETTE.neutral.gray[900],
  'text-secondary': MEDICAL_COLOR_PALETTE.neutral.gray[600],
  'text-muted': MEDICAL_COLOR_PALETTE.neutral.gray[500],
  'text-disabled': MEDICAL_COLOR_PALETTE.neutral.gray[400],
  'text-inverse': MEDICAL_COLOR_PALETTE.neutral.white.pure,
  'text-on-primary': MEDICAL_COLOR_PALETTE.neutral.white.pure,
  'text-on-secondary': MEDICAL_COLOR_PALETTE.neutral.white.pure,

  // Border Colors
  border: MEDICAL_COLOR_PALETTE.neutral.gray[200],
  'border-light': MEDICAL_COLOR_PALETTE.neutral.gray[100],
  'border-strong': MEDICAL_COLOR_PALETTE.neutral.gray[300],
  'border-focus': MEDICAL_COLOR_PALETTE.medical.blue[500],
  'border-error': MEDICAL_COLOR_PALETTE.semantic.emergency[500],

  // State Colors
  error: MEDICAL_COLOR_PALETTE.semantic.emergency[500],
  'error-light': MEDICAL_COLOR_PALETTE.semantic.emergency[50],
  'error-hover': MEDICAL_COLOR_PALETTE.semantic.emergency[600],

  warning: MEDICAL_COLOR_PALETTE.semantic.warning[500],
  'warning-light': MEDICAL_COLOR_PALETTE.semantic.warning[50],
  'warning-hover': MEDICAL_COLOR_PALETTE.semantic.warning[600],

  success: MEDICAL_COLOR_PALETTE.semantic.success[500],
  'success-light': MEDICAL_COLOR_PALETTE.semantic.success[50],
  'success-hover': MEDICAL_COLOR_PALETTE.semantic.success[600],

  info: MEDICAL_COLOR_PALETTE.semantic.info[500],
  'info-light': MEDICAL_COLOR_PALETTE.semantic.info[50],
  'info-hover': MEDICAL_COLOR_PALETTE.semantic.info[600],
} as const;

// ===== CSS CUSTOM PROPERTIES GENERATOR =====

export function generateCSSVariables(isDark = false): Record<string, string> {
  const variables: Record<string, string> = {};

  // Generate CSS custom properties from color tokens
  Object.entries(COLOR_TOKENS).forEach(([key, value]) => {
    variables[`--color-${key}`] = value;
  });

  // Add dark mode overrides if needed
  if (isDark) {
    // Dark mode color adjustments
    variables['--color-background'] = MEDICAL_COLOR_PALETTE.neutral.gray[900];
    variables['--color-background-secondary'] = MEDICAL_COLOR_PALETTE.neutral.gray[800];
    variables['--color-surface'] = MEDICAL_COLOR_PALETTE.neutral.gray[800];
    variables['--color-text-primary'] = MEDICAL_COLOR_PALETTE.neutral.gray[50];
    variables['--color-text-secondary'] = MEDICAL_COLOR_PALETTE.neutral.gray[300];
    variables['--color-border'] = MEDICAL_COLOR_PALETTE.neutral.gray[700];
  }

  return variables;
}

// ===== UTILITY FUNCTIONS =====

export function getColorToken(tokenName: keyof typeof COLOR_TOKENS): string {
  return COLOR_TOKENS[tokenName];
}

export function getMedicalColor(
  category: keyof typeof MEDICAL_COLOR_PALETTE.medical,
  shade: keyof typeof MEDICAL_COLOR_PALETTE.medical.blue
): string {
  return MEDICAL_COLOR_PALETTE.medical[category][shade];
}

export function getSemanticColor(
  category: keyof typeof MEDICAL_COLOR_PALETTE.semantic,
  shade: keyof typeof MEDICAL_COLOR_PALETTE.semantic.emergency
): string {
  return MEDICAL_COLOR_PALETTE.semantic[category][shade];
}

// ===== TYPE DEFINITIONS =====

export type ColorToken = keyof typeof COLOR_TOKENS;
export type MedicalColorCategory = keyof typeof MEDICAL_COLOR_PALETTE.medical;
export type SemanticColorCategory = keyof typeof MEDICAL_COLOR_PALETTE.semantic;
export type ColorShade = keyof typeof MEDICAL_COLOR_PALETTE.medical.blue;
