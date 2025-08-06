/**
 * Medical Footer Theme System
 * iOS Hospital App-inspired design constants for footer interface
 *
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-08-06
 *
 * @features
 * - Hospital-themed medical UI with iOS design patterns
 * - Medical gradient backgrounds with backdrop blur effects
 * - Medical status indicators and emergency access patterns
 * - Trust certification and security indicators
 * - Enhanced accessibility with medical context
 */

import { MEDICAL_COLORS } from '@/styles/medical-design-system';

// Medical Footer Color System - iOS Hospital App Inspired
export const MEDICAL_FOOTER_COLORS = {
  // Medical Background Gradients
  backgrounds: {
    primary: {
      light:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 250, 252, 0.97) 30%, rgba(240, 249, 255, 0.97) 100%)',
      dark: 'linear-gradient(135deg, rgba(28, 28, 30, 0.97) 0%, rgba(44, 44, 46, 0.97) 30%, rgba(58, 58, 60, 0.97) 100%)',
    },
    emergency: {
      light:
        'linear-gradient(135deg, rgba(254, 242, 242, 0.97) 0%, rgba(255, 255, 255, 0.97) 50%, rgba(240, 249, 255, 0.97) 100%)',
      dark: 'linear-gradient(135deg, rgba(69, 26, 26, 0.97) 0%, rgba(28, 28, 30, 0.97) 50%, rgba(44, 44, 46, 0.97) 100%)',
    },
    trust: {
      light:
        'linear-gradient(135deg, rgba(240, 249, 255, 0.97) 0%, rgba(255, 255, 255, 0.97) 50%, rgba(240, 253, 244, 0.97) 100%)',
      dark: 'linear-gradient(135deg, rgba(12, 74, 110, 0.97) 0%, rgba(28, 28, 30, 0.97) 50%, rgba(20, 83, 45, 0.97) 100%)',
    },
  },

  // Medical Status Colors
  status: {
    excellent: MEDICAL_COLORS.status.success, // #16A34A
    good: MEDICAL_COLORS.primary.blue, // #2563EB
    warning: MEDICAL_COLORS.status.warning, // #D97706
    critical: MEDICAL_COLORS.status.emergency, // #DC2626
    emergency: '#FF3B30', // iOS system red
    routine: '#007AFF', // iOS system blue
    urgent: '#FF9500', // iOS system orange
    consultation: '#34C759', // iOS system green
  },

  // Trust & Security Indicators
  trust: {
    verified: '#34C759', // iOS system green
    secure: '#007AFF', // iOS system blue
    certified: '#5856D6', // iOS system purple
    warning: '#FF9500', // iOS system orange
    error: '#FF3B30', // iOS system red
  },

  // Medical Badge Colors
  badges: {
    appointment: '#007AFF', // iOS system blue
    urgent: '#FF3B30', // iOS system red
    reminder: '#FF9500', // iOS system orange
    completed: '#34C759', // iOS system green
    pending: '#8E8E93', // iOS system gray
  },
};

// Medical Backdrop Blur System
export const MEDICAL_BACKDROP_BLUR = {
  // iOS Hospital App-style blur effects
  standard: {
    blur: '30px', // Enhanced blur for premium feel
    saturation: '1.8', // Increased saturation for medical clarity
    brightness: '1.1', // Slight brightness boost for cleanliness
  },
  emergency: {
    blur: '25px', // Slightly reduced for urgency
    saturation: '1.5',
    brightness: '1.05',
  },
  trust: {
    blur: '35px', // Maximum blur for trust indication
    saturation: '2.0',
    brightness: '1.15',
  },
};

// Medical Typography System
export const MEDICAL_FOOTER_TYPOGRAPHY = {
  // iOS SF Pro font family with medical context
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
    secondary: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    medical: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", system-ui, sans-serif',
  },

  // Medical text sizes
  fontSize: {
    badge: '12px', // Medical badge text
    label: '10px', // Navigation labels
    status: '9px', // Status indicators
    emergency: '14px', // Emergency text
  },

  // Medical font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    emergency: '800', // Bold for emergency
  },
};

// Medical Animation System
export const MEDICAL_ANIMATIONS = {
  // iOS-style medical animations
  durations: {
    fast: '150ms', // Quick medical interactions
    normal: '250ms', // Standard medical transitions
    slow: '400ms', // Deliberate medical actions
    emergency: '100ms', // Immediate emergency response
  },

  // Medical easing curves
  easing: {
    medical: 'cubic-bezier(0.16, 1, 0.3, 1)', // iOS-style spring
    emergency: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Quick response
    trust: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth trust building
  },

  // Medical haptic patterns
  haptic: {
    selection: 10, // Light tap for selection
    emergency: [50, 100, 50], // Emergency pattern
    success: [10, 50, 10], // Success confirmation
    warning: [20, 100, 20], // Warning alert
    error: [50, 100, 50, 100, 50], // Error pattern
  },
};

// Medical Spacing System
export const MEDICAL_SPACING = {
  // Medical-grade spacing for precision
  footer: {
    height: '90px', // Increased for medical readability
    contentHeight: '60px', // Content area height
    safeArea: {
      ios: '34px', // iOS safe area
      android: '36px', // Android navigation bar
      web: '16px', // Web safe area
    },
  },

  // Medical touch targets
  touchTargets: {
    minimum: '44px', // iOS minimum
    recommended: '48px', // Medical recommended
    emergency: '56px', // Emergency access
  },

  // Medical padding
  padding: {
    container: '8px', // Container padding
    item: '12px', // Item padding
    badge: '4px', // Badge padding
    emergency: '16px', // Emergency padding
  },
};

// Medical Shadow System
export const MEDICAL_SHADOWS = {
  // iOS-style shadows with medical tinting
  footer: {
    light: '0 -1px 0 rgba(0, 0, 0, 0.04), 0 -2px 8px rgba(37, 99, 235, 0.08), 0 -4px 16px rgba(37, 99, 235, 0.04)',
    dark: '0 -1px 0 rgba(255, 255, 255, 0.04), 0 -2px 8px rgba(59, 130, 246, 0.12), 0 -4px 16px rgba(59, 130, 246, 0.08)',
  },
  emergency: {
    light: '0 -2px 8px rgba(220, 38, 38, 0.15), 0 -4px 16px rgba(220, 38, 38, 0.08)',
    dark: '0 -2px 8px rgba(248, 113, 113, 0.20), 0 -4px 16px rgba(248, 113, 113, 0.12)',
  },
  trust: {
    light: '0 -2px 8px rgba(16, 185, 129, 0.12), 0 -4px 16px rgba(16, 185, 129, 0.06)',
    dark: '0 -2px 8px rgba(52, 211, 153, 0.16), 0 -4px 16px rgba(52, 211, 153, 0.10)',
  },
};

// Medical Border System
export const MEDICAL_BORDERS = {
  // Medical border styling
  separator: {
    light: '1px solid rgba(229, 231, 235, 0.3)',
    dark: '1px solid rgba(75, 85, 99, 0.3)',
  },
  emergency: {
    light: '2px solid rgba(220, 38, 38, 0.5)',
    dark: '2px solid rgba(248, 113, 113, 0.5)',
  },
  trust: {
    light: '1px solid rgba(16, 185, 129, 0.3)',
    dark: '1px solid rgba(52, 211, 153, 0.3)',
  },
};

// Medical Theme Presets
export const MEDICAL_THEME_PRESETS = {
  // Standard medical footer
  standard: {
    background: MEDICAL_FOOTER_COLORS.backgrounds.primary,
    blur: MEDICAL_BACKDROP_BLUR.standard,
    shadow: MEDICAL_SHADOWS.footer,
    border: MEDICAL_BORDERS.separator,
  },

  // Emergency mode footer
  emergency: {
    background: MEDICAL_FOOTER_COLORS.backgrounds.emergency,
    blur: MEDICAL_BACKDROP_BLUR.emergency,
    shadow: MEDICAL_SHADOWS.emergency,
    border: MEDICAL_BORDERS.emergency,
  },

  // Trust mode footer
  trust: {
    background: MEDICAL_FOOTER_COLORS.backgrounds.trust,
    blur: MEDICAL_BACKDROP_BLUR.trust,
    shadow: MEDICAL_SHADOWS.trust,
    border: MEDICAL_BORDERS.trust,
  },
};

// Medical Footer Theme Export
export const MEDICAL_FOOTER_THEME = {
  colors: MEDICAL_FOOTER_COLORS,
  blur: MEDICAL_BACKDROP_BLUR,
  typography: MEDICAL_FOOTER_TYPOGRAPHY,
  animations: MEDICAL_ANIMATIONS,
  spacing: MEDICAL_SPACING,
  shadows: MEDICAL_SHADOWS,
  borders: MEDICAL_BORDERS,
  presets: MEDICAL_THEME_PRESETS,
} as const;

export default MEDICAL_FOOTER_THEME;
