/**
 * Medical Design System Constants
 * Standardized dimensions, spacing, and styling for hospital-themed medical UI
 * Ensures visual consistency across all components in the Zalo Mini App
 */

// Enhanced Medical Color Palette - Modern Hospital Theme with Trust & Cleanliness
export const MEDICAL_COLORS = {
  // Hospital Whites - Pure, clean, sterile medical environment
  white: {
    pure: '#FFFFFF',
    warm: '#FEFEFE', // Slightly warmer white for comfort
    cool: '#FDFDFE', // Cool white for clinical areas
    soft: '#FAFBFC', // Soft white for backgrounds - Modern Hospital Standard
    pearl: '#F8F9FB', // Pearl white for subtle contrast
  },

  // Modern Hospital Primary Blues - Trust & Professionalism
  primary: {
    blue: '#2563EB', // Medical Blue - Primary actions, trust
    blueDark: '#1E40AF', // Dark Blue - Hover states, depth
    blueLight: '#3B82F6', // Light Blue - Secondary actions
    blueAccent: '#1D4ED8', // Accent Blue - Highlights
  },

  // Healing Greens - Health & Recovery
  secondary: {
    green: '#10B981', // Healing Green - Success, health
    greenDark: '#059669', // Dark Green - Confirmation states
    greenLight: '#34D399', // Light Green - Positive feedback
    greenAccent: '#047857', // Accent Green - Medical success
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

  // Trust-Building Cyan & Teal - Professional Medical Services
  accent: {
    // Backward-compatible simple color aliases (for existing components)
    cyan: '#0891B2', // Trust Cyan - Links, medical info (maps to cyanScale[600])
    cyanDark: '#0E7490', // Dark Cyan - Active states (maps to cyanScale[700])
    cyanLight: '#06B6D4', // Light Cyan - Highlights (maps to cyanScale[500])
    cyanAccent: '#0369A1', // Accent Cyan - Professional emphasis (custom)

    // Detailed color scales for advanced usage
    cyanScale: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4', // Primary cyan (cyanLight)
      600: '#0891B2', // Trust cyan (cyan)
      700: '#0E7490', // Dark cyan (cyanDark)
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

// Standardized Card Dimensions - Aligned with Medical Width System
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

  // Horizontal scroll cards (FeaturedServices) - Using unified width system
  horizontal: {
    width: 'w-[260px] sm:w-[280px] lg:w-[300px]', // Responsive width from MEDICAL_WIDTHS
    height: 'h-64', // 256px
    minHeight: 'min-h-[256px]',
  },

  // Grid cards (FeaturedDepartments) - Using unified width system
  grid: {
    width: 'w-full', // Full width in grid layout
    height: 'h-44', // 176px - optimized for grid
    minHeight: 'min-h-[176px]',
  },

  // Vertical list cards (HealthNews) - Using unified width system
  vertical: {
    width: 'w-full', // Full width in vertical layout
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

// Modern Hospital Iconography System
export const MEDICAL_ICONOGRAPHY = {
  // Core Medical Icons
  medical: {
    stethoscope: 'medical-stethoscope',
    heartRate: 'medical-heart-rate',
    medicalCross: 'medical-cross',
    hospital: 'medical-hospital',
    doctor: 'medical-doctor',
    nurse: 'medical-nurse',
    ambulance: 'medical-ambulance',
    prescription: 'medical-prescription',
  },

  // Healthcare Services
  services: {
    appointment: 'service-appointment',
    consultation: 'service-consultation',
    emergency: 'service-emergency',
    pharmacy: 'service-pharmacy',
    laboratory: 'service-laboratory',
    radiology: 'service-radiology',
    surgery: 'service-surgery',
    rehabilitation: 'service-rehabilitation',
  },

  // User Interface
  interface: {
    search: 'ui-search',
    filter: 'ui-filter',
    calendar: 'ui-calendar',
    profile: 'ui-profile',
    settings: 'ui-settings',
    notification: 'ui-notification',
    help: 'ui-help',
    menu: 'ui-menu',
  },

  // Status & Feedback
  status: {
    success: 'status-success',
    warning: 'status-warning',
    error: 'status-error',
    info: 'status-info',
    loading: 'status-loading',
    completed: 'status-completed',
  },
} as const;

// Standardized Spacing System - Enhanced for Medical UI
export const SPACING = {
  // Component spacing - Medical grade precision
  component: {
    xs: 'space-y-2', // 8px - Tight medical data
    sm: 'space-y-3', // 12px - Form elements
    md: 'space-y-4', // 16px - Standard sections
    lg: 'space-y-6', // 24px - Major sections
    xl: 'space-y-8', // 32px - Page sections
    xxl: 'space-y-12', // 48px - Major page divisions
  },

  // Padding system - Hospital-grade spacing
  padding: {
    card: 'p-4', // 16px - standard medical card
    cardLarge: 'p-6', // 24px - prominent medical card
    cardSmall: 'p-3', // 12px - compact medical info
    section: 'px-4 md:px-6', // Responsive section padding
    content: 'p-4', // 16px - medical content padding
    form: 'p-5', // 20px - medical form padding
  },

  // Margin system - Professional medical spacing
  margin: {
    section: 'mb-8', // 32px - major section separation
    card: 'mb-6', // 24px - medical card separation
    element: 'mb-4', // 16px - element separation
    small: 'mb-2', // 8px - tight element separation
  },

  // Gap system for grids and flex - Medical layout precision
  gap: {
    xs: 'gap-2', // 8px - Tight medical data
    sm: 'gap-3', // 12px - Form elements
    md: 'gap-4', // 16px - Standard layout
    lg: 'gap-6', // 24px - Major layout sections
    xl: 'gap-8', // 32px - Page layout sections
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

// Typography Scale
export const TYPOGRAPHY = {
  // Card titles
  cardTitle: 'text-lg font-semibold text-gray-900',
  cardTitleSmall: 'text-base font-semibold text-gray-900',

  // Section titles
  sectionTitle: 'text-xl font-bold text-gray-800 md:text-2xl',

  // Body text
  body: 'text-sm text-gray-600',
  bodySmall: 'text-xs text-gray-500',

  // Interactive text
  link: 'text-sm font-medium text-blue-600',
  button: 'text-sm font-medium',
} as const;

// Enhanced Animation System for Medical UI - Professional Micro-animations
export const ANIMATIONS = {
  // Transition durations - Medical grade timing
  duration: {
    instant: '100ms', // Immediate feedback
    fast: '150ms', // Quick interactions
    normal: '300ms', // Standard transitions
    slow: '500ms', // Deliberate animations
    medical: '400ms', // Optimized for medical UI feedback
    accessible: '200ms', // Reduced motion friendly
  },

  // Easing functions - Professional medical feel
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // medical: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Professional medical easing
    // // gentle: 'cubic-bezier(0.16, 1, 0.3, 1)', // Gentle, trustworthy
    // precise: 'cubic-bezier(0.4, 0, 0.2, 1)', // Precise medical actions
  },

  // Common transitions - Hospital-grade smoothness
  transition: {
    all: 'all 300ms ease-in-out',
    colors: 'color 200ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out',
    transform: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    // medical: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    // gentle: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    // precise: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Micro-animations for medical interactions
  microAnimations: {
    buttonHover: 'transform 150ms ease-out',
    cardHover: 'transform 200ms ease-out, box-shadow 200ms ease-out',
    inputFocus: 'border-color 150ms ease-out, box-shadow 150ms ease-out',
    medicalPulse: 'transform 1s ease-in-out infinite alternate',
    heartbeat: 'transform 0.8s ease-in-out infinite',
    breathe: 'opacity 2s ease-in-out infinite alternate',
  },

  // Reduced motion support - Accessibility first
  reducedMotion: {
    duration: '0.01ms', // Nearly instant for reduced motion
    easing: 'linear', // Simple easing
    transform: 'none', // No transforms
    opacity: 'opacity 150ms linear', // Only opacity changes
  },

  // Tailwind classes for easy use
  classes: {
    fast: 'duration-150', // 150ms - micro-interactions
    normal: 'duration-300', // 300ms - standard transitions
    slow: 'duration-500', // 500ms - complex animations
    medical: 'duration-[400ms]', // Custom medical timing
  },
} as const;

// Unified Width System for Medical Components
export const MEDICAL_WIDTHS = {
  // Main container widths for different contexts
  container: {
    narrow: 'max-w-md', // 448px - Current mobile-first approach
    standard: 'max-w-2xl', // 672px - Balanced for medical content
    wide: 'max-w-4xl', // 896px - Desktop medical dashboard
    full: 'max-w-6xl', // 1152px - Full medical interface
  },

  // Medical service card widths (horizontal scroll)
  serviceCard: {
    mobile: 'w-[260px]', // Optimized for mobile viewing
    tablet: 'w-[280px]', // Balanced for tablet
    desktop: 'w-[300px]', // Premium desktop experience
  },

  // Department card widths (grid layout)
  departmentCard: {
    mobile: 'w-full', // Full width on mobile
    tablet: 'w-full', // Full width in grid
    desktop: 'w-full', // Full width in grid
  },

  // News card widths (vertical layout)
  newsCard: {
    mobile: 'w-full', // Full width on mobile
    tablet: 'w-full', // Full width in vertical layout
    desktop: 'w-full', // Full width in vertical layout
  },

  // Section container widths
  section: {
    padding: 'px-3 md:px-4 lg:px-6', // Responsive section padding
    margin: 'mx-2 md:mx-3 lg:mx-4', // Responsive section margins
    maxWidth: 'max-w-none', // Allow sections to use container width
  },
} as const;

// Responsive Breakpoints - Enhanced for Medical UI
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

  // Medical-specific responsive classes
  medical: {
    container: 'w-full max-w-2xl mx-auto', // Standard medical container
    section: 'w-full', // Full width sections
    card: 'w-full', // Full width cards in grid
  },
} as const;

// Medical-specific component variants
export const MEDICAL_VARIANTS = {
  // Emergency/priority indicators
  priority: {
    low: 'bg-green-50 text-green-700 border-green-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
  },

  // Department/service categories
  category: {
    general: 'bg-blue-50 text-blue-700',
    emergency: 'bg-red-50 text-red-700',
    specialist: 'bg-purple-50 text-purple-700',
    diagnostic: 'bg-teal-50 text-teal-700',
  },
} as const;

// Utility function to combine classes
export const combineClasses = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Medical Skeleton Color System - Premium Hospital Grade
export const MEDICAL_SKELETON_COLORS = {
  // Primary skeleton colors using medical palette
  primary: {
    base: '#F0F4FF', // Ultra light medical blue background
    shimmer: '#E6EFFF', // Light medical blue for shimmer effect
    accent: '#DDE7FF', // Accent medical blue for highlights
  },

  // Secondary skeleton colors using healing greens
  secondary: {
    base: '#F0FDF9', // Ultra light healing green background
    shimmer: '#E6FFFA', // Light healing green for shimmer effect
    accent: '#DCFCE7', // Accent healing green for highlights
  },

  // Neutral skeleton colors using medical whites
  neutral: {
    base: '#FAFBFC', // Medical white soft background
    shimmer: '#F8F9FB', // Pearl white for shimmer effect
    accent: '#F3F4F6', // Light gray for subtle contrast
  },

  // Gradient combinations for advanced skeletons
  gradients: {
    medicalBlue: `linear-gradient(90deg, #F0F4FF 25%, #E6EFFF 50%, #F0F4FF 75%)`,
    healingGreen: `linear-gradient(90deg, #F0FDF9 25%, #E6FFFA 50%, #F0FDF9 75%)`,
    trustCyan: `linear-gradient(90deg, #F0FDFA 25%, #CCFBF1 50%, #F0FDFA 75%)`,
    medicalNeutral: `linear-gradient(90deg, #FAFBFC 25%, #F8F9FB 50%, #FAFBFC 75%)`,
  },
} as const;

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
    ANIMATIONS.classes.normal
  ),

  // Horizontal scroll card preset
  horizontalCard: combineClasses(
    CARD_DIMENSIONS.horizontal.width,
    CARD_DIMENSIONS.horizontal.height,
    SPACING.padding.content,
    BORDER_RADIUS.card,
    SHADOWS.card,
    'bg-white hover:' + SHADOWS.cardHover,
    ANIMATIONS.classes.normal
  ),

  // Emergency card preset
  emergencyCard: combineClasses(
    CARD_DIMENSIONS.large.width,
    CARD_DIMENSIONS.large.minHeight,
    SPACING.padding.cardLarge,
    BORDER_RADIUS.card,
    'border-2 border-red-200 bg-red-50',
    SHADOWS.cardHover,
    ANIMATIONS.classes.fast
  ),

  // Mobile optimized button
  mobileButton: combineClasses(
    TOUCH_TARGETS.interactive,
    SPACING.padding.content,
    BORDER_RADIUS.button,
    'font-medium text-center',
    'transition-all',
    ANIMATIONS.classes.fast,
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
    ANIMATIONS.classes.normal
  ),

  // Medical Skeleton Presets
  skeletonPrimary: combineClasses(
    BORDER_RADIUS.button,
    'skeleton-optimized',
    'bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50',
    'bg-[length:200%_100%]',
    'animate-shimmer-medical'
  ),

  skeletonSecondary: combineClasses(
    BORDER_RADIUS.button,
    'skeleton-optimized',
    'bg-gradient-to-r from-green-50 via-green-100 to-green-50',
    'bg-[length:200%_100%]',
    'animate-shimmer-medical'
  ),

  skeletonNeutral: combineClasses(
    BORDER_RADIUS.button,
    'skeleton-optimized',
    'bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50',
    'bg-[length:200%_100%]',
    'animate-shimmer-medical'
  ),

  skeletonFast: combineClasses(BORDER_RADIUS.button, 'skeleton-optimized', 'bg-blue-50', 'animate-pulse'),

  // Section container preset
  sectionContainer: combineClasses('bg-white', BORDER_RADIUS.section, SPACING.padding.section, SPACING.margin.section),
} as const;

// Modern Hospital Accessibility Standards - WCAG 2.1 AA Compliance
export const ACCESSIBILITY = {
  // WCAG 2.1 AA Compliance Standards
  contrast: {
    normal: '4.5:1', // Normal text contrast ratio
    large: '3:1', // Large text contrast ratio
    medical: '7:1', // Enhanced medical data contrast
    interactive: '4.5:1', // Interactive elements
  },

  // Touch targets - Medical grade precision
  touchTargets: {
    minimum: '44px', // WCAG minimum
    recommended: '48px', // Recommended size
    medical: '52px', // Medical interface standard
    emergency: '56px', // Emergency action buttons
  },

  // Focus indicators - Professional medical UI
  focus: {
    outline: '2px solid #2563EB',
    outlineOffset: '2px',
    borderRadius: '4px',
    boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
    medical: '3px solid #10B981', // Medical success color
  },

  // Screen reader support
  screenReader: {
    skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
    visuallyHidden: 'sr-only',
    focusable: 'focus:not-sr-only',
  },

  // Keyboard navigation
  keyboard: {
    tabIndex: '0', // Focusable
    tabIndexNegative: '-1', // Not in tab order
    ariaLabel: 'aria-label',
    ariaDescribedBy: 'aria-describedby',
    role: 'role',
  },

  // Medical context ARIA labels
  medicalAria: {
    appointment: 'Đặt lịch khám bệnh',
    doctor: 'Thông tin bác sĩ',
    service: 'Dịch vụ y tế',
    emergency: 'Cấp cứu y tế',
    search: 'Tìm kiếm dịch vụ y tế',
    profile: 'Hồ sơ bệnh nhân',
    history: 'Lịch sử khám bệnh',
    results: 'Kết quả xét nghiệm',
  },
} as const;
