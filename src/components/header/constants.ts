/**
 * Header Constants
 * Shared constants and configuration for header components
 */

import { AccessibilityLabels, HeaderConfig } from './types';
import { MEDICAL_COLOR_PALETTE } from '@/styles/unified-color-system';

// Skip link configuration
export const SKIP_LINK_ID = 'main-content';

// Scroll and navigation thresholds
export const SCROLL_THRESHOLD = 10;
export const NAVIGATION_TIMEOUT = 300;

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 600,
} as const;

// Accessibility labels (Vietnamese for medical app)
export const ACCESSIBILITY_LABELS: AccessibilityLabels = {
  skipLink: 'Chuyển đến nội dung chính',
  navigationStatus: 'Đang chuyển trang...',
  mainHeader: 'Ứng dụng y tế Zalo - Trang chủ bệnh viện, điều hướng chính',
  logo: 'Logo bệnh viện - Ứng dụng y tế Zalo',
  logoDescription: 'Ứng dụng y tế chuyên nghiệp cung cấp dịch vụ chăm sóc sức khỏe đáng tin cậy',
  backButton: 'Quay lại trang trước - Điều hướng y tế. Nhấn Enter hoặc Space để kích hoạt',
  backButtonDescription: 'Nút điều hướng quay lại trang trước đó trong ứng dụng y tế',
  backButtonTitle: 'Quay lại trang trước',
} as const;

// Header style configurations
export const HEADER_STYLES = {
  background: `linear-gradient(135deg,
    ${MEDICAL_COLOR_PALETTE.medical.blue[500]}08 0%,
    ${MEDICAL_COLOR_PALETTE.neutral.white.soft} 35%,
    ${MEDICAL_COLOR_PALETTE.medical.green[500]}06 70%,
    ${MEDICAL_COLOR_PALETTE.medical.cyan[500]}04 100%)`,
} as const;

export const LOGO_STYLES = {
  background: `linear-gradient(135deg, ${MEDICAL_COLOR_PALETTE.medical.blue[500]}, ${MEDICAL_COLOR_PALETTE.medical.blue[600]})`,
  boxShadow: `0 4px 12px ${MEDICAL_COLOR_PALETTE.medical.blue[500]}20, 0 2px 4px ${MEDICAL_COLOR_PALETTE.medical.blue[500]}10`,
} as const;

export const BACK_BUTTON_STYLES = {
  backgroundColor: `${MEDICAL_COLOR_PALETTE.medical.blue[500]}10`,
  color: MEDICAL_COLOR_PALETTE.medical.blue[500],
  border: `1px solid ${MEDICAL_COLOR_PALETTE.medical.blue[500]}20`,
} as const;

// Platform-specific header heights - Enhanced for optimal UX across all platforms
export const HEADER_HEIGHTS = {
  ios: {
    compact: 48, // Increased from 40 for better touch targets
    regular: 56, // Increased from 48 for better content visibility
    large: 64, // Increased from 56 for better hierarchy
  },
  android: {
    compact: 52, // Increased from 44 for Material Design compliance
    regular: 60, // Increased from 52 for better touch targets
    large: 68, // Increased from 60 for better content spacing
  },
  web: {
    compact: 56, // Increased from 52 for better desktop experience
    regular: 64, // Increased from 60 for better content hierarchy
    large: 72, // Increased from 68 for better visual balance
  },
} as const;

// Responsive breakpoints for header sizing
export const HEADER_BREAKPOINTS = {
  mobile: 375, // Small mobile devices
  tablet: 768, // Tablet devices
  desktop: 1024, // Desktop and larger
  wide: 1440, // Wide desktop screens
} as const;

// Default header configuration
export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  showLogo: true,
  showTitle: true,
  showBackButton: true,
  showProfile: true,
  enableAnimations: true,
  enableHapticFeedback: true,
  accessibilityLabels: ACCESSIBILITY_LABELS,
} as const;

// Medical branding configuration
export const MEDICAL_BRANDING = {
  title: 'Healthcare App',
  subtitle: 'Trusted Medical Care',
  description: 'Ứng dụng y tế chuyên nghiệp cung cấp dịch vụ chăm sóc sức khỏe đáng tin cậy',
} as const;

// Enhanced CSS class utilities with responsive and accessibility improvements
export const CSS_CLASSES = {
  header: {
    base: 'flex-none w-full transition-all duration-300 ease-out sticky top-0 z-50',
    main: 'bg-white',
    navigation: 'bg-white border-b border-gray-200/60',
    scrolled:
      'sticky top-0 z-50 bg-white border-b border-gray-200/80 shadow-[0_4px_12px_rgba(37,99,235,0.08),0_2px_4px_rgba(37,99,235,0.04)]',
    focus: 'focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:ring-offset-2',
    // Enhanced safe area support
    safeArea: 'pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]',
    // Responsive height classes
    responsive: 'h-12 sm:h-14 md:h-16 lg:h-18',
  },
  content: {
    base: 'flex items-center justify-between relative z-20',
    // Enhanced responsive padding with safe area support
    padding: 'px-3 sm:px-4 md:px-6 lg:px-8 pt-safe pb-2 md:pb-3 lg:pb-4',
    // Improved spacing for different screen sizes
    spacing: 'gap-2 sm:gap-3 md:gap-4 lg:gap-6',
  },
  // Enhanced skip link with better positioning
  skipLink:
    'sr-only focus:not-sr-only focus:absolute focus:top-[env(safe-area-inset-top,1rem)] focus:left-4 focus:z-[100] bg-blue-600 text-white px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-200',
  // New responsive utilities
  responsive: {
    mobile: 'block sm:hidden',
    tablet: 'hidden sm:block lg:hidden',
    desktop: 'hidden lg:block',
    // Touch target sizing
    touchTarget: 'min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px]',
  },
} as const;

// Enhanced safe area utilities for modern devices
export const SAFE_AREA_UTILITIES = {
  // CSS custom properties for safe areas
  cssVars: {
    top: 'var(--safe-area-inset-top, 0px)',
    bottom: 'var(--safe-area-inset-bottom, 0px)',
    left: 'var(--safe-area-inset-left, 0px)',
    right: 'var(--safe-area-inset-right, 0px)',
  },
  // Fallback values for older browsers
  fallbacks: {
    top: '20px',
    bottom: '0px',
    left: '0px',
    right: '0px',
  },
  // Platform-specific safe area handling
  platform: {
    ios: 'supports(padding: max(0px)) and (-webkit-touch-callout: none)',
    android: 'supports(padding: max(0px)) and (not (-webkit-touch-callout: none))',
    web: 'not (supports(padding: max(0px)))',
  },
} as const;

// Enhanced accessibility constants for WCAG AA compliance
export const ENHANCED_ACCESSIBILITY = {
  // Minimum touch target sizes (WCAG 2.1 AA)
  touchTargets: {
    minimum: 44, // 44px minimum for mobile
    recommended: 48, // 48px recommended for better UX
    desktop: 32, // 32px acceptable for desktop with precise pointing
  },
  // Color contrast ratios
  contrast: {
    normal: 4.5, // WCAG AA for normal text
    large: 3.0, // WCAG AA for large text (18pt+ or 14pt+ bold)
    enhanced: 7.0, // WCAG AAA for enhanced accessibility
  },
  // Focus indicators
  focus: {
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineOffset: '2px',
    borderRadius: '4px',
  },
  // Animation preferences
  motion: {
    reduced: 'prefers-reduced-motion: reduce',
    standard: 'prefers-reduced-motion: no-preference',
  },
} as const;
