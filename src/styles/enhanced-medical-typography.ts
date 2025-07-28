/**
 * Enhanced Medical Typography System
 * Premium hospital-grade typography for professional medical interfaces
 * Optimized for accessibility, readability, and medical content hierarchy
 */

// Medical Typography Scale - Hospital-Grade Hierarchy
export const MEDICAL_TYPOGRAPHY = {
  // Font Sizes - Medical Content Hierarchy
  fontSize: {
    // Hero and Landing Sections
    hero: '2.5rem', // 40px - Hero headings, main banners
    'hero-mobile': '2rem', // 32px - Hero on mobile devices
    
    // Page and Section Headers
    h1: '2rem', // 32px - Page titles, main headers
    'h1-mobile': '1.75rem', // 28px - H1 on mobile
    h2: '1.5rem', // 24px - Section headers
    'h2-mobile': '1.375rem', // 22px - H2 on mobile
    h3: '1.25rem', // 20px - Subsection headers
    'h3-mobile': '1.125rem', // 18px - H3 on mobile
    h4: '1.125rem', // 18px - Component headers
    h5: '1rem', // 16px - Small headers
    h6: '0.875rem', // 14px - Micro headers
    
    // Body Text - Medical Content
    body: '1rem', // 16px - Regular body text
    'body-large': '1.125rem', // 18px - Large body text for important content
    'body-small': '0.875rem', // 14px - Small body text
    
    // UI and Interface Elements
    caption: '0.875rem', // 14px - Captions, secondary info
    label: '0.875rem', // 14px - Form labels, UI labels
    button: '0.875rem', // 14px - Button text
    'button-large': '1rem', // 16px - Large button text
    input: '1rem', // 16px - Input field text
    
    // Medical Specific
    'medical-data': '1rem', // 16px - Medical data display
    'medical-label': '0.75rem', // 12px - Medical labels, metadata
    'emergency': '1.125rem', // 18px - Emergency text
    'vital-signs': '1.25rem', // 20px - Vital signs display
  },

  // Font Weights - Medical Professional Hierarchy
  fontWeight: {
    light: 300, // Light text for subtle information
    normal: 400, // Regular body text
    medium: 500, // Emphasis, important information
    semibold: 600, // Section headers, medical labels
    bold: 700, // Strong emphasis, alerts
    extrabold: 800, // Emergency, critical information
  },

  // Line Heights - Optimized for Medical Content Readability
  lineHeight: {
    tight: 1.25, // Tight spacing for headers
    normal: 1.5, // Standard reading line height
    relaxed: 1.625, // Relaxed for long-form medical content
    loose: 2, // Loose for accessibility
    
    // Medical specific line heights
    'medical-data': 1.4, // Medical data display
    'emergency': 1.3, // Emergency information
    'form': 1.5, // Form elements
  },

  // Letter Spacing - Professional Medical Appearance
  letterSpacing: {
    tighter: '-0.05em', // Tighter for large headers
    tight: '-0.025em', // Slightly tight for headers
    normal: '0em', // Normal spacing
    wide: '0.025em', // Wide for labels
    wider: '0.05em', // Wider for emphasis
    widest: '0.1em', // Widest for special cases
    
    // Medical specific
    'medical-label': '0.025em', // Medical labels
    'emergency': '0.05em', // Emergency text
  },

  // Font Families - Medical Professional Stack
  fontFamily: {
    // Primary font stack - optimized for medical content
    primary: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(', '),
    
    // Secondary font for emphasis
    secondary: [
      'Inter',
      'system-ui',
      'sans-serif',
    ].join(', '),
    
    // Monospace for medical data
    mono: [
      'SF Mono',
      'Monaco',
      'Inconsolata',
      'Roboto Mono',
      'Consolas',
      'monospace',
    ].join(', '),
  },
} as const;

// Medical Typography Presets - Ready-to-use combinations
export const MEDICAL_TYPOGRAPHY_PRESETS = {
  // Hero Section Typography
  hero: {
    fontSize: MEDICAL_TYPOGRAPHY.fontSize.hero,
    fontWeight: MEDICAL_TYPOGRAPHY.fontWeight.bold,
    lineHeight: MEDICAL_TYPOGRAPHY.lineHeight.tight,
    letterSpacing: MEDICAL_TYPOGRAPHY.letterSpacing.tighter,
    fontFamily: MEDICAL_TYPOGRAPHY.fontFamily.primary,
  },
  
  // Page Title Typography
  pageTitle: {
    fontSize: MEDICAL_TYPOGRAPHY.fontSize.h1,
    fontWeight: MEDICAL_TYPOGRAPHY.fontWeight.semibold,
    lineHeight: MEDICAL_TYPOGRAPHY.lineHeight.tight,
    letterSpacing: MEDICAL_TYPOGRAPHY.letterSpacing.tight,
    fontFamily: MEDICAL_TYPOGRAPHY.fontFamily.primary,
  },
  
  // Section Header Typography
  sectionHeader: {
    fontSize: MEDICAL_TYPOGRAPHY.fontSize.h2,
    fontWeight: MEDICAL_TYPOGRAPHY.fontWeight.semibold,
    lineHeight: MEDICAL_TYPOGRAPHY.lineHeight.tight,
    letterSpacing: MEDICAL_TYPOGRAPHY.letterSpacing.normal,
    fontFamily: MEDICAL_TYPOGRAPHY.fontFamily.primary,
  },
  
  // Body Text Typography
  bodyText: {
    fontSize: MEDICAL_TYPOGRAPHY.fontSize.body,
    fontWeight: MEDICAL_TYPOGRAPHY.fontWeight.normal,
    lineHeight: MEDICAL_TYPOGRAPHY.lineHeight.normal,
    letterSpacing: MEDICAL_TYPOGRAPHY.letterSpacing.normal,
    fontFamily: MEDICAL_TYPOGRAPHY.fontFamily.primary,
  },
  
  // Medical Data Typography
  medicalData: {
    fontSize: MEDICAL_TYPOGRAPHY.fontSize['medical-data'],
    fontWeight: MEDICAL_TYPOGRAPHY.fontWeight.medium,
    lineHeight: MEDICAL_TYPOGRAPHY.lineHeight['medical-data'],
    letterSpacing: MEDICAL_TYPOGRAPHY.letterSpacing.normal,
    fontFamily: MEDICAL_TYPOGRAPHY.fontFamily.mono,
  },
  
  // Emergency Typography
  emergency: {
    fontSize: MEDICAL_TYPOGRAPHY.fontSize.emergency,
    fontWeight: MEDICAL_TYPOGRAPHY.fontWeight.bold,
    lineHeight: MEDICAL_TYPOGRAPHY.lineHeight.emergency,
    letterSpacing: MEDICAL_TYPOGRAPHY.letterSpacing.emergency,
    fontFamily: MEDICAL_TYPOGRAPHY.fontFamily.primary,
  },
  
  // Button Typography
  button: {
    fontSize: MEDICAL_TYPOGRAPHY.fontSize.button,
    fontWeight: MEDICAL_TYPOGRAPHY.fontWeight.medium,
    lineHeight: MEDICAL_TYPOGRAPHY.lineHeight.normal,
    letterSpacing: MEDICAL_TYPOGRAPHY.letterSpacing.wide,
    fontFamily: MEDICAL_TYPOGRAPHY.fontFamily.primary,
  },
  
  // Form Label Typography
  formLabel: {
    fontSize: MEDICAL_TYPOGRAPHY.fontSize.label,
    fontWeight: MEDICAL_TYPOGRAPHY.fontWeight.medium,
    lineHeight: MEDICAL_TYPOGRAPHY.lineHeight.form,
    letterSpacing: MEDICAL_TYPOGRAPHY.letterSpacing['medical-label'],
    fontFamily: MEDICAL_TYPOGRAPHY.fontFamily.primary,
  },
} as const;

// Responsive Typography Utilities
export const RESPONSIVE_TYPOGRAPHY = {
  // Mobile-first responsive font sizes
  responsive: {
    hero: {
      base: MEDICAL_TYPOGRAPHY.fontSize['hero-mobile'],
      md: MEDICAL_TYPOGRAPHY.fontSize.hero,
    },
    h1: {
      base: MEDICAL_TYPOGRAPHY.fontSize['h1-mobile'],
      md: MEDICAL_TYPOGRAPHY.fontSize.h1,
    },
    h2: {
      base: MEDICAL_TYPOGRAPHY.fontSize['h2-mobile'],
      md: MEDICAL_TYPOGRAPHY.fontSize.h2,
    },
    h3: {
      base: MEDICAL_TYPOGRAPHY.fontSize['h3-mobile'],
      md: MEDICAL_TYPOGRAPHY.fontSize.h3,
    },
  },
} as const;

// Typography Utility Functions
export function getTypographyPreset(preset: keyof typeof MEDICAL_TYPOGRAPHY_PRESETS) {
  return MEDICAL_TYPOGRAPHY_PRESETS[preset];
}

export function generateTypographyCSS(preset: keyof typeof MEDICAL_TYPOGRAPHY_PRESETS): string {
  const typography = MEDICAL_TYPOGRAPHY_PRESETS[preset];
  return `
    font-size: ${typography.fontSize};
    font-weight: ${typography.fontWeight};
    line-height: ${typography.lineHeight};
    letter-spacing: ${typography.letterSpacing};
    font-family: ${typography.fontFamily};
  `.trim();
}

// CSS Custom Properties for Typography
export function generateTypographyVariables(): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Font sizes
  Object.entries(MEDICAL_TYPOGRAPHY.fontSize).forEach(([key, value]) => {
    variables[`--font-size-${key}`] = value;
  });
  
  // Font weights
  Object.entries(MEDICAL_TYPOGRAPHY.fontWeight).forEach(([key, value]) => {
    variables[`--font-weight-${key}`] = value.toString();
  });
  
  // Line heights
  Object.entries(MEDICAL_TYPOGRAPHY.lineHeight).forEach(([key, value]) => {
    variables[`--line-height-${key}`] = value.toString();
  });
  
  // Letter spacing
  Object.entries(MEDICAL_TYPOGRAPHY.letterSpacing).forEach(([key, value]) => {
    variables[`--letter-spacing-${key}`] = value;
  });
  
  // Font families
  Object.entries(MEDICAL_TYPOGRAPHY.fontFamily).forEach(([key, value]) => {
    variables[`--font-family-${key}`] = value;
  });
  
  return variables;
}

// Type definitions
export type TypographyPreset = keyof typeof MEDICAL_TYPOGRAPHY_PRESETS;
export type FontSize = keyof typeof MEDICAL_TYPOGRAPHY.fontSize;
export type FontWeight = keyof typeof MEDICAL_TYPOGRAPHY.fontWeight;
export type LineHeight = keyof typeof MEDICAL_TYPOGRAPHY.lineHeight;
export type LetterSpacing = keyof typeof MEDICAL_TYPOGRAPHY.letterSpacing;
export type FontFamily = keyof typeof MEDICAL_TYPOGRAPHY.fontFamily;
