/**
 * Dark Mode Support for Medical Header
 * Enhanced dark theme with medical-specific color adjustments
 */

import { MEDICAL_COLOR_PALETTE } from '@/styles/unified-color-system';

// Dark mode medical color overrides
export const DARK_MODE_MEDICAL_COLORS = {
  // Background colors for dark mode
  backgrounds: {
    primary: `linear-gradient(135deg,
      rgba(15, 23, 42, 0.95) 0%,
      rgba(30, 41, 59, 0.95) 25%,
      rgba(15, 23, 42, 0.95) 50%,
      rgba(51, 65, 85, 0.95) 75%,
      rgba(15, 23, 42, 0.95) 100%)`,
    
    navigation: `linear-gradient(135deg,
      rgba(15, 23, 42, 0.95) 0%,
      rgba(30, 41, 59, 0.95) 50%,
      rgba(15, 23, 42, 0.95) 100%)`,
    
    emergency: `linear-gradient(135deg,
      rgba(30, 41, 59, 0.95) 0%,
      rgba(51, 65, 85, 0.95) 100%)`,
  },

  // Text colors for dark mode
  text: {
    primary: MEDICAL_COLOR_PALETTE.neutral.gray[50],
    secondary: MEDICAL_COLOR_PALETTE.neutral.gray[300],
    muted: MEDICAL_COLOR_PALETTE.neutral.gray[400],
    inverse: MEDICAL_COLOR_PALETTE.neutral.gray[900],
  },

  // Border colors for dark mode
  borders: {
    primary: `1px solid ${MEDICAL_COLOR_PALETTE.neutral.gray[700]}60`,
    navigation: `1px solid ${MEDICAL_COLOR_PALETTE.neutral.gray[600]}40`,
    emergency: `1px solid ${MEDICAL_COLOR_PALETTE.semantic.emergency[400]}50`,
  },

  // Enhanced shadows for dark mode
  shadows: {
    primary: `0 4px 20px rgba(0, 0, 0, 0.3), 
              0 2px 8px rgba(0, 0, 0, 0.2)`,
    
    navigation: `0 2px 12px rgba(0, 0, 0, 0.25),
                 0 1px 4px rgba(0, 0, 0, 0.15)`,
    
    emergency: `0 4px 16px rgba(220, 38, 38, 0.25),
                0 2px 6px rgba(220, 38, 38, 0.15)`,
  },

  // Health status colors adjusted for dark mode
  healthStatus: {
    excellent: {
      color: MEDICAL_COLOR_PALETTE.medical.green[400],
      backgroundColor: `${MEDICAL_COLOR_PALETTE.medical.green[400]}20`,
      borderColor: `${MEDICAL_COLOR_PALETTE.medical.green[400]}40`,
    },
    good: {
      color: MEDICAL_COLOR_PALETTE.medical.blue[400],
      backgroundColor: `${MEDICAL_COLOR_PALETTE.medical.blue[400]}20`,
      borderColor: `${MEDICAL_COLOR_PALETTE.medical.blue[400]}40`,
    },
    warning: {
      color: MEDICAL_COLOR_PALETTE.semantic.warning[400],
      backgroundColor: `${MEDICAL_COLOR_PALETTE.semantic.warning[400]}20`,
      borderColor: `${MEDICAL_COLOR_PALETTE.semantic.warning[400]}40`,
    },
    critical: {
      color: MEDICAL_COLOR_PALETTE.semantic.emergency[400],
      backgroundColor: `${MEDICAL_COLOR_PALETTE.semantic.emergency[400]}20`,
      borderColor: `${MEDICAL_COLOR_PALETTE.semantic.emergency[400]}40`,
    },
  },

  // Emergency button colors for dark mode
  emergencyButton: {
    background: MEDICAL_COLOR_PALETTE.semantic.emergency[500],
    backgroundHover: MEDICAL_COLOR_PALETTE.semantic.emergency[400],
    text: MEDICAL_COLOR_PALETTE.neutral.white.pure,
    border: `2px solid ${MEDICAL_COLOR_PALETTE.semantic.emergency[400]}`,
    shadow: `0 2px 8px ${MEDICAL_COLOR_PALETTE.semantic.emergency[500]}30,
             0 1px 3px ${MEDICAL_COLOR_PALETTE.semantic.emergency[500]}20`,
  },

  // Trust indicators for dark mode
  trustIndicators: {
    certification: {
      color: MEDICAL_COLOR_PALETTE.medical.blue[400],
      backgroundColor: `${MEDICAL_COLOR_PALETTE.medical.blue[400]}15`,
      borderColor: `${MEDICAL_COLOR_PALETTE.medical.blue[400]}30`,
    },
    security: {
      color: MEDICAL_COLOR_PALETTE.medical.green[400],
      backgroundColor: `${MEDICAL_COLOR_PALETTE.medical.green[400]}15`,
      borderColor: `${MEDICAL_COLOR_PALETTE.medical.green[400]}30`,
    },
    emergency: {
      color: MEDICAL_COLOR_PALETTE.semantic.emergency[400],
      backgroundColor: `${MEDICAL_COLOR_PALETTE.semantic.emergency[400]}15`,
      borderColor: `${MEDICAL_COLOR_PALETTE.semantic.emergency[400]}30`,
    },
  },

  // Logo styling for dark mode
  logo: {
    background: `linear-gradient(135deg, 
      ${MEDICAL_COLOR_PALETTE.medical.blue[500]} 0%,
      ${MEDICAL_COLOR_PALETTE.medical.green[500]} 100%)`,
    ring: `2px solid ${MEDICAL_COLOR_PALETTE.neutral.gray[600]}50`,
    ringHover: `2px solid ${MEDICAL_COLOR_PALETTE.neutral.gray[500]}70`,
    shadow: `0 4px 16px ${MEDICAL_COLOR_PALETTE.medical.blue[500]}20, 
             0 2px 6px ${MEDICAL_COLOR_PALETTE.medical.blue[500]}10`,
  },
} as const;

// Dark mode detection utility
export const isDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for explicit theme setting
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  
  // Check for system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Dark mode CSS variables
export const DARK_MODE_CSS_VARIABLES = {
  '--medical-header-bg-dark': DARK_MODE_MEDICAL_COLORS.backgrounds.primary,
  '--medical-header-border-dark': DARK_MODE_MEDICAL_COLORS.borders.primary,
  '--medical-header-shadow-dark': DARK_MODE_MEDICAL_COLORS.shadows.primary,
  '--medical-text-primary-dark': DARK_MODE_MEDICAL_COLORS.text.primary,
  '--medical-text-secondary-dark': DARK_MODE_MEDICAL_COLORS.text.secondary,
  '--medical-emergency-bg-dark': DARK_MODE_MEDICAL_COLORS.emergencyButton.background,
  '--medical-logo-ring-dark': DARK_MODE_MEDICAL_COLORS.logo.ring,
} as const;

// Hook for dark mode medical styles
export const useDarkModeMedicalStyles = () => {
  const darkMode = isDarkMode();
  
  return {
    isDarkMode: darkMode,
    colors: darkMode ? DARK_MODE_MEDICAL_COLORS : null,
    getBackgroundStyle: (variant: 'primary' | 'navigation' | 'emergency' = 'primary') => {
      if (!darkMode) return {};
      
      return {
        background: DARK_MODE_MEDICAL_COLORS.backgrounds[variant],
        borderColor: DARK_MODE_MEDICAL_COLORS.borders[variant].split(' ')[2],
        boxShadow: DARK_MODE_MEDICAL_COLORS.shadows[variant],
      };
    },
    getTextStyle: (variant: 'primary' | 'secondary' | 'muted' = 'primary') => {
      if (!darkMode) return {};
      
      return {
        color: DARK_MODE_MEDICAL_COLORS.text[variant],
      };
    },
    getHealthStatusStyle: (status: keyof typeof DARK_MODE_MEDICAL_COLORS.healthStatus) => {
      if (!darkMode) return {};
      
      return DARK_MODE_MEDICAL_COLORS.healthStatus[status];
    },
    getEmergencyButtonStyle: () => {
      if (!darkMode) return {};
      
      return DARK_MODE_MEDICAL_COLORS.emergencyButton;
    },
    getTrustIndicatorStyle: (type: keyof typeof DARK_MODE_MEDICAL_COLORS.trustIndicators) => {
      if (!darkMode) return {};
      
      return DARK_MODE_MEDICAL_COLORS.trustIndicators[type];
    },
    getLogoStyle: () => {
      if (!darkMode) return {};
      
      return DARK_MODE_MEDICAL_COLORS.logo;
    },
  };
};

// Dark mode theme toggle utility
export const toggleDarkMode = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Store preference
  localStorage.setItem('medical-header-theme', newTheme);
  
  return newTheme;
};

// Initialize dark mode from stored preference
export const initializeDarkMode = () => {
  if (typeof window === 'undefined') return;
  
  const storedTheme = localStorage.getItem('medical-header-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const theme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
};

// Listen for system theme changes
export const setupDarkModeListener = (callback?: (isDark: boolean) => void) => {
  if (typeof window === 'undefined') return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    const storedTheme = localStorage.getItem('medical-header-theme');
    
    // Only update if no explicit theme is set
    if (!storedTheme) {
      const theme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      callback?.(e.matches);
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  return () => mediaQuery.removeEventListener('change', handleChange);
};

// Type definitions
export type DarkModeVariant = 'primary' | 'navigation' | 'emergency';
export type TextVariant = 'primary' | 'secondary' | 'muted';
export type HealthStatusVariant = keyof typeof DARK_MODE_MEDICAL_COLORS.healthStatus;
export type TrustIndicatorVariant = keyof typeof DARK_MODE_MEDICAL_COLORS.trustIndicators;
