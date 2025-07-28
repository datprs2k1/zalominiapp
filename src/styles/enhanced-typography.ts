// Enhanced Typography System for Medical App
// Optimized for mobile reading and medical context

export const TYPOGRAPHY = {
  // Font Families - Optimized for Medical Readability
  fonts: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    medical: '"SF Pro Display", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"SF Mono", "JetBrains Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    display: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },

  // Font Sizes - Medical-optimized for readability
  sizes: {
    // Display sizes for headers - Hospital-appropriate
    display: {
      xl: 'text-4xl', // 36px - Main page titles (Doctor names, etc.)
      lg: 'text-3xl', // 30px - Section headers (Department names)
      md: 'text-2xl', // 24px - Card titles (Service names)
      sm: 'text-xl', // 20px - Subsection headers
    },

    // Body text sizes - Enhanced readability for medical content
    body: {
      xl: 'text-lg', // 18px - Important medical information
      lg: 'text-base', // 16px - Standard body text (minimum for accessibility)
      md: 'text-sm', // 14px - Secondary text (still readable)
      sm: 'text-xs', // 12px - Captions, labels (minimum size)
    },

    // Medical-specific sizes for healthcare data
    medical: {
      vital: 'text-3xl', // 30px - Vital signs, critical numbers
      important: 'text-2xl', // 24px - Important medical data
      dosage: 'text-lg', // 18px - Medication dosages
      label: 'text-sm', // 14px - Medical labels
      note: 'text-xs', // 12px - Medical notes (minimum readable)
    },
  },

  // Font Weights
  weights: {
    light: 'font-light', // 300
    normal: 'font-normal', // 400
    medium: 'font-medium', // 500
    semibold: 'font-semibold', // 600
    bold: 'font-bold', // 700
    extrabold: 'font-extrabold', // 800
  },

  // Line Heights - Medical readability optimized
  lineHeights: {
    tight: 'leading-tight', // 1.25 - Headers and titles
    normal: 'leading-normal', // 1.5 - Standard body text
    relaxed: 'leading-relaxed', // 1.625 - Medical descriptions, long content
    loose: 'leading-loose', // 2 - Instructions, important notices
    medical: 'leading-7', // 1.75 - Optimal for medical information
  },

  // Letter Spacing
  tracking: {
    tighter: 'tracking-tighter', // -0.05em
    tight: 'tracking-tight', // -0.025em
    normal: 'tracking-normal', // 0em
    wide: 'tracking-wide', // 0.025em
    wider: 'tracking-wider', // 0.05em
  },

  // Text Colors - Medical context
  colors: {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    muted: 'text-gray-500',
    light: 'text-gray-400',

    // Medical status colors
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',

    // Medical context colors
    vital: 'text-red-600',
    normal: 'text-green-600',
    caution: 'text-orange-600',
  },
} as const;

// Typography Presets for common use cases
export const TYPOGRAPHY_PRESETS = {
  // Page Headers
  pageTitle: `${TYPOGRAPHY.sizes.display.xl} ${TYPOGRAPHY.weights.bold} ${TYPOGRAPHY.lineHeights.tight} ${TYPOGRAPHY.colors.primary}`,
  sectionTitle: `${TYPOGRAPHY.sizes.display.md} ${TYPOGRAPHY.weights.semibold} ${TYPOGRAPHY.lineHeights.tight} ${TYPOGRAPHY.colors.primary}`,
  cardTitle: `${TYPOGRAPHY.sizes.display.sm} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.tight} ${TYPOGRAPHY.colors.primary}`,

  // Body Text
  bodyLarge: `${TYPOGRAPHY.sizes.body.xl} ${TYPOGRAPHY.weights.normal} ${TYPOGRAPHY.lineHeights.relaxed} ${TYPOGRAPHY.colors.primary}`,
  bodyNormal: `${TYPOGRAPHY.sizes.body.lg} ${TYPOGRAPHY.weights.normal} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.primary}`,
  bodySmall: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.normal} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.secondary}`,

  // Medical Text
  vitalSign: `${TYPOGRAPHY.sizes.medical.vital} ${TYPOGRAPHY.weights.bold} ${TYPOGRAPHY.lineHeights.tight} ${TYPOGRAPHY.colors.vital}`,
  dosage: `${TYPOGRAPHY.sizes.medical.dosage} ${TYPOGRAPHY.weights.semibold} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.primary}`,
  medicalLabel: `${TYPOGRAPHY.sizes.medical.label} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.secondary}`,
  medicalNote: `${TYPOGRAPHY.sizes.medical.note} ${TYPOGRAPHY.weights.normal} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.muted}`,

  // UI Elements
  button: `${TYPOGRAPHY.sizes.body.lg} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.tight}`,
  buttonSmall: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.tight}`,
  label: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.secondary}`,
  caption: `${TYPOGRAPHY.sizes.body.sm} ${TYPOGRAPHY.weights.normal} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.muted}`,

  // Navigation
  navItem: `${TYPOGRAPHY.sizes.body.lg} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.tight}`,
  navItemActive: `${TYPOGRAPHY.sizes.body.lg} ${TYPOGRAPHY.weights.semibold} ${TYPOGRAPHY.lineHeights.tight} ${TYPOGRAPHY.colors.info}`,

  // Status Text
  success: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.success}`,
  warning: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.warning}`,
  error: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.error}`,
  info: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.info}`,
} as const;

// Responsive Typography Utilities
export const RESPONSIVE_TYPOGRAPHY = {
  // Responsive headers
  heroTitle: 'text-2xl md:text-4xl lg:text-5xl font-bold leading-tight',
  pageTitle: 'text-xl md:text-3xl lg:text-4xl font-bold leading-tight',
  sectionTitle: 'text-lg md:text-2xl lg:text-3xl font-semibold leading-tight',

  // Responsive body text
  bodyLarge: 'text-base md:text-lg lg:text-xl leading-relaxed',
  bodyNormal: 'text-sm md:text-base lg:text-lg leading-normal',
  bodySmall: 'text-xs md:text-sm lg:text-base leading-normal',
} as const;

// Medical Typography Helpers
export const MEDICAL_TYPOGRAPHY = {
  // Emergency/Urgent text
  emergency: `${TYPOGRAPHY.sizes.display.md} ${TYPOGRAPHY.weights.bold} ${TYPOGRAPHY.lineHeights.tight} text-red-600`,
  urgent: `${TYPOGRAPHY.sizes.body.xl} ${TYPOGRAPHY.weights.semibold} ${TYPOGRAPHY.lineHeights.tight} text-orange-600`,

  // Patient information
  patientName: `${TYPOGRAPHY.sizes.display.sm} ${TYPOGRAPHY.weights.semibold} ${TYPOGRAPHY.lineHeights.tight} ${TYPOGRAPHY.colors.primary}`,
  patientId: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.normal} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.muted}`,

  // Medical data
  measurement: `${TYPOGRAPHY.sizes.medical.vital} ${TYPOGRAPHY.weights.bold} ${TYPOGRAPHY.lineHeights.tight}`,
  unit: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.normal} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.muted}`,

  // Instructions
  instruction: `${TYPOGRAPHY.sizes.body.lg} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.relaxed} ${TYPOGRAPHY.colors.primary}`,
  warning: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.semibold} ${TYPOGRAPHY.lineHeights.normal} text-red-600`,

  // Time and dates
  datetime: `${TYPOGRAPHY.sizes.body.md} ${TYPOGRAPHY.weights.medium} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.secondary}`,
  duration: `${TYPOGRAPHY.sizes.body.sm} ${TYPOGRAPHY.weights.normal} ${TYPOGRAPHY.lineHeights.normal} ${TYPOGRAPHY.colors.muted}`,
} as const;

// Utility function to combine typography classes
export function combineTypography(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

// Typography component props helper
export interface TypographyProps {
  variant?: keyof typeof TYPOGRAPHY_PRESETS;
  size?: keyof typeof TYPOGRAPHY.sizes.body | keyof typeof TYPOGRAPHY.sizes.display;
  weight?: keyof typeof TYPOGRAPHY.weights;
  color?: keyof typeof TYPOGRAPHY.colors;
  className?: string;
}

// Get typography classes based on props
export function getTypographyClasses({ variant, size, weight, color, className = '' }: TypographyProps): string {
  if (variant) {
    return combineTypography(TYPOGRAPHY_PRESETS[variant], className);
  }

  const classes = [
    size &&
      (TYPOGRAPHY.sizes.body[size as keyof typeof TYPOGRAPHY.sizes.body] ||
        TYPOGRAPHY.sizes.display[size as keyof typeof TYPOGRAPHY.sizes.display]),
    weight && TYPOGRAPHY.weights[weight],
    color && TYPOGRAPHY.colors[color],
    className,
  ];

  return combineTypography(...classes);
}

// CSS-in-JS styles for custom components
export const TYPOGRAPHY_STYLES = {
  fontFamily: TYPOGRAPHY.fonts.primary,

  // Base text rendering optimizations
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',

  // Mobile text size adjustment
  WebkitTextSizeAdjust: '100%',
  textSizeAdjust: '100%',
} as const;

// Export default typography configuration
export default TYPOGRAPHY;
