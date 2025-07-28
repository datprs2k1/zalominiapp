/**
 * Medical Design System Constants
 * Standardized dimensions, spacing, and styling for hospital-themed medical UI
 * Ensures visual consistency across all components in the Zalo Mini App
 *
 * Note: Color definitions here are design tokens that feed into the unified color system.
 * For component usage, prefer the unified color system tokens from @/styles/unified-color-system
 */

// Enhanced Medical Color Palette - Modern Hospital Theme with Trust & Cleanliness
// These colors are used as design tokens by the unified color system
export const MEDICAL_COLORS = {
  // Hospital Whites - Pure, clean, sterile medical environment
  white: {
    pure: '#FFFFFF',
    warm: '#FEFEFE', // Slightly warmer white for comfort
    cool: '#FDFDFE', // Cool white for clinical areas
    soft: '#FAFBFC', // Soft white for backgrounds
    pearl: '#F8F9FB', // Pearl white for subtle contrast
  },

  // Medical Blues - Professional, trustworthy, calming
  blue: {
    50: '#F0F8FF', // Alice blue - very light, clean
    100: '#E6F3FF', // Light sky blue - calming
    200: '#CCE7FF', // Soft blue - gentle
    300: '#99D6FF', // Light blue - friendly
    400: '#66C2FF', // Medium blue - professional
    500: '#2B7CE9', // Primary medical blue - trustworthy
    600: '#1E5FCC', // Deep blue - authoritative
    700: '#1A4BA6', // Navy blue - serious
    800: '#163D80', // Dark blue - stable
    900: '#0F2A5A', // Deep navy - professional
  },

  // Healing Greens - Growth, health, wellness, nature
  green: {
    50: '#F0FDF4', // Mint cream - fresh
    100: '#DCFCE7', // Light mint - soothing
    200: '#BBF7D0', // Soft green - healing
    300: '#86EFAC', // Light green - growth
    400: '#4ADE80', // Medium green - vitality
    500: '#16A34A', // Primary medical green - health
    600: '#15803D', // Forest green - stability
    700: '#166534', // Deep green - trust
    800: '#14532D', // Dark green - reliability
    900: '#0F3A21', // Deep forest - endurance
  },

  // Soft Grays - Professional, clean, modern
  gray: {
    50: '#FAFBFC', // Almost white - clean
    100: '#F4F6F8', // Very light gray - subtle
    200: '#E5E9ED', // Light gray - gentle
    300: '#D1D8E0', // Medium light gray - soft
    400: '#9AA4B2', // Medium gray - neutral
    500: '#6B7785', // Primary gray - professional
    600: '#4A5568', // Dark gray - serious
    700: '#2D3748', // Charcoal - strong
    800: '#1A202C', // Dark charcoal - bold
    900: '#171923', // Near black - definitive
  },

  // Trust Blues - Deeper blues for authority and trust
  trust: {
    50: '#EBF4FF', // Very light trust blue
    100: '#DBEAFE', // Light trust blue
    200: '#BFDBFE', // Soft trust blue
    300: '#93C5FD', // Medium trust blue
    400: '#60A5FA', // Bright trust blue
    500: '#3B82F6', // Primary trust blue
    600: '#2563EB', // Deep trust blue
    700: '#1D4ED8', // Darker trust blue
    800: '#1E40AF', // Navy trust blue
    900: '#1E3A8A', // Deep navy trust
  },

  // Accent Colors - Medical cyan and teal for modern hospital feel
  accent: {
    cyan: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4', // Primary cyan
      600: '#0891B2',
      700: '#0E7490',
      800: '#155E75',
      900: '#164E63',
    },
    teal: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6', // Primary teal
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
    },
  },

  // Status colors for medical contexts - Enhanced with hospital theme
  status: {
    emergency: '#DC2626', // Medical alert red
    urgent: '#EA580C', // Urgent orange
    warning: '#D97706', // Medical caution amber
    success: '#16A34A', // Medical success green
    info: '#2563EB', // Medical info blue
    available: '#10B981', // Available green
    unavailable: '#6B7280', // Unavailable gray
  },

  // Gradients for modern hospital UI
  gradients: {
    primary: 'from-blue-50 via-white to-blue-50',
    secondary: 'from-green-50 via-white to-green-50',
    trust: 'from-trust-50 via-white to-trust-50',
    clean: 'from-white via-gray-50 to-white',
    medical: 'from-blue-50 via-green-50 to-blue-50',
    professional: 'from-trust-500 to-blue-600',
    healing: 'from-green-400 to-green-600',
  },
} as const;

// Standardized Card Dimensions
export const CARD_DIMENSIONS = {
  // Standard card sizes for consistent layout
  small: {
    width: 'w-full',
    height: 'h-40', // 160px
    minHeight: 'min-h-[160px]',
  },
  medium: {
    width: 'w-full',
    height: 'h-48', // 192px
    minHeight: 'min-h-[192px]',
  },
  large: {
    width: 'w-full',
    height: 'h-56', // 224px
    minHeight: 'min-h-[224px]',
  },

  // Horizontal scroll cards (FeaturedServices)
  horizontal: {
    width: 'w-[280px]', // Fixed width for horizontal scroll
    height: 'h-64', // 256px
    minHeight: 'min-h-[256px]',
  },

  // Grid cards (FeaturedDepartments)
  grid: {
    width: 'w-full',
    height: 'h-44', // 176px - optimized for 2-column grid
    minHeight: 'min-h-[176px]',
  },

  // Vertical list cards (HealthNews)
  vertical: {
    width: 'w-full',
    height: 'auto', // Dynamic height based on content
    minHeight: 'min-h-[200px]', // Minimum height for consistency
  },
} as const;

// Image Dimensions for consistent aspect ratios
export const IMAGE_DIMENSIONS = {
  // Card image heights
  small: 'h-32', // 128px
  medium: 'h-36', // 144px
  large: 'h-40', // 160px

  // Aspect ratios
  aspectRatios: {
    square: 'aspect-square',
    video: 'aspect-video', // 16:9
    photo: 'aspect-[4/3]',
    banner: 'aspect-[21/9]',
  },
} as const;

// Standardized Spacing System
export const SPACING = {
  // Component spacing
  component: {
    xs: 'space-y-2', // 8px
    sm: 'space-y-3', // 12px
    md: 'space-y-4', // 16px
    lg: 'space-y-6', // 24px
    xl: 'space-y-8', // 32px
  },

  // Padding system
  padding: {
    card: 'p-4', // 16px - standard card padding
    cardLarge: 'p-5', // 20px - large card padding
    section: 'px-4 md:px-5', // Responsive section padding
    content: 'p-3', // 12px - content padding
  },

  // Margin system
  margin: {
    section: 'mb-6', // 24px - section bottom margin
    card: 'mb-4', // 16px - card bottom margin
    element: 'mb-2', // 8px - element bottom margin
  },

  // Gap system for grids and flex
  gap: {
    xs: 'gap-2', // 8px
    sm: 'gap-3', // 12px
    md: 'gap-4', // 16px
    lg: 'gap-6', // 24px
  },
} as const;

// Touch Target Sizes (44px minimum for mobile accessibility)
export const TOUCH_TARGETS = {
  minimum: 'min-h-[44px] min-w-[44px]', // WCAG AA compliance
  button: 'h-10 w-10', // 40px - close to minimum
  buttonLarge: 'h-12 w-12', // 48px - comfortable size
  interactive: 'min-h-[44px]', // For interactive elements
} as const;

// Border Radius System
export const BORDER_RADIUS = {
  card: 'rounded-xl', // 12px - standard card radius
  cardLarge: 'rounded-2xl', // 16px - large card radius
  section: 'rounded-3xl', // 24px - section container radius
  button: 'rounded-lg', // 8px - button radius
  pill: 'rounded-full', // Full radius for pills/badges
} as const;

// Shadow System for depth hierarchy
export const SHADOWS = {
  card: 'shadow-sm', // Subtle card shadow
  cardHover: 'shadow-md', // Card hover state
  cardActive: 'shadow-lg', // Card active/focused state
  section: 'shadow-sm border border-gray-50', // Section container shadow
  medical: 'shadow-[0_8px_24px_rgba(0,102,204,0.06)]', // Medical-themed shadow
} as const;

// Enhanced Typography Scale - Improved Visual Hierarchy
export const TYPOGRAPHY = {
  // Hero and Display Typography
  heroTitle: 'text-3xl font-black text-[#1E40AF] md:text-4xl lg:text-5xl leading-tight',
  heroSubtitle: 'text-lg font-medium text-[#6B7785] md:text-xl lg:text-2xl leading-relaxed',

  // Section Headings - Clear hierarchy
  sectionTitle: 'text-2xl font-bold text-[#1E40AF] md:text-3xl leading-tight',
  sectionSubtitle: 'text-lg font-semibold text-[#2563EB] md:text-xl leading-snug',

  // Card Typography
  cardTitle: 'text-lg font-bold text-[#1E40AF] leading-tight',
  cardTitleSmall: 'text-base font-semibold text-[#1E40AF] leading-tight',
  cardSubtitle: 'text-sm font-medium text-[#6B7785] leading-relaxed',

  // Body Text - Enhanced readability
  body: 'text-base text-[#4A5568] leading-relaxed',
  bodySmall: 'text-sm text-[#6B7785] leading-relaxed',
  caption: 'text-xs text-[#9CA3AF] leading-normal',

  // Interactive Elements
  link: 'text-base font-semibold text-[#2563EB] hover:text-[#1E40AF] transition-colors',
  button: 'text-base font-bold tracking-wide',
  buttonSmall: 'text-sm font-semibold tracking-wide',

  // Medical-specific Typography
  medicalLabel: 'text-sm font-bold text-[#059669] uppercase tracking-wider',
  statusText: 'text-sm font-medium leading-tight',
  emergencyText: 'text-base font-bold text-red-600 leading-tight',
} as const;

// Animation Durations (300-500ms for medical UI)
export const ANIMATIONS = {
  fast: 'duration-200', // 200ms - micro-interactions
  normal: 'duration-300', // 300ms - standard transitions
  slow: 'duration-500', // 500ms - complex animations

  // Easing functions
  easing: {
    default: 'ease-out',
    medical: 'ease-[0.25,0.46,0.45,0.94]', // Custom medical easing
  },
} as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  mobile: 'max-w-sm', // < 640px
  tablet: 'md:max-w-2xl', // 640px - 768px
  desktop: 'lg:max-w-4xl', // > 1024px

  // Grid columns for different screens
  grid: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3',
  },
} as const;

// Medical-specific component variants using unified color system
export const MEDICAL_VARIANTS = {
  // Emergency/priority indicators
  priority: {
    low: 'bg-success-light text-success border-success',
    medium: 'bg-warning-light text-warning border-warning',
    high: 'bg-warning-light text-warning border-warning',
    critical: 'bg-error-light text-error border-error',
  },

  // Department/service categories
  category: {
    general: 'bg-primary-light text-primary',
    emergency: 'bg-error-light text-error',
    specialist: 'bg-accent-light text-accent',
    diagnostic: 'bg-secondary-light text-secondary',
  },
} as const;

// Utility function to combine classes
export const combineClasses = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Medical design system presets for common component patterns
export const MEDICAL_PRESETS = {
  // Standard card preset
  standardCard: combineClasses(
    CARD_DIMENSIONS.medium.width,
    CARD_DIMENSIONS.medium.minHeight,
    SPACING.padding.card,
    BORDER_RADIUS.card,
    SHADOWS.card,
    'bg-white hover:' + SHADOWS.cardHover,
    ANIMATIONS.normal
  ),

  // Horizontal scroll card preset
  horizontalCard: combineClasses(
    CARD_DIMENSIONS.horizontal.width,
    CARD_DIMENSIONS.horizontal.height,
    SPACING.padding.content,
    BORDER_RADIUS.card,
    SHADOWS.card,
    'bg-white hover:' + SHADOWS.cardHover,
    ANIMATIONS.normal
  ),

  // Emergency card preset
  emergencyCard: combineClasses(
    CARD_DIMENSIONS.large.width,
    CARD_DIMENSIONS.large.minHeight,
    SPACING.padding.cardLarge,
    BORDER_RADIUS.card,
    'border-2 border-red-200 bg-red-50',
    SHADOWS.cardHover,
    ANIMATIONS.fast
  ),

  // Mobile optimized button
  mobileButton: combineClasses(
    TOUCH_TARGETS.interactive,
    SPACING.padding.content,
    BORDER_RADIUS.button,
    'font-medium text-center',
    'transition-all',
    ANIMATIONS.fast,
    'active:scale-95'
  ),

  // Grid card preset
  gridCard: combineClasses(
    CARD_DIMENSIONS.grid.width,
    CARD_DIMENSIONS.grid.height,
    SPACING.padding.card,
    BORDER_RADIUS.card,
    SHADOWS.card,
    'bg-white hover:' + SHADOWS.cardHover,
    ANIMATIONS.normal
  ),

  // Section container preset
  sectionContainer: combineClasses('bg-white', BORDER_RADIUS.section, SPACING.padding.section, SPACING.margin.section),
} as const;
