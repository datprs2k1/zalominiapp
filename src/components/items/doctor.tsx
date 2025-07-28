import { HTMLProps, ReactNode, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Doctor } from '@/types';
import { WPDoctor } from '@/services/wp-types';
import TransitionLink from '../transition-link';
import { BORDER_RADIUS, SHADOWS, ANIMATIONS, TOUCH_TARGETS, combineClasses } from '@/styles/medical-design-system';
import './doctor-mobile.css';

/**
 * WordPress doctor data structure for backward compatibility
 * @deprecated Use Doctor type from @/types instead
 */
interface DoctorWP {
  readonly id: number;
  readonly title?: { rendered?: string } | string;
  readonly name?: string;
  readonly languages?: string;
  readonly specialties?: string;
  readonly image?: string;
  readonly _embedded?: {
    readonly 'wp:featuredmedia'?: ReadonlyArray<{
      readonly source_url?: string;
      readonly alt_text?: string;
    }>;
  };
  readonly avatar?: string;
  readonly bacsi_chucdanh?: string;
  readonly bacsi_donvi?: string;
  readonly bacsi_kinhnghiem?: string;
  readonly isAvailable?: boolean;
  readonly unit?: string;
}

/**
 * Props for the DoctorItem component
 */
interface DoctorItemProps extends Omit<HTMLProps<HTMLDivElement>, 'title'> {
  /** Doctor data - supports both new Doctor type and legacy WordPress format */
  readonly doctor: Doctor | DoctorWP;
  /** Optional suffix element (e.g., selection indicator) */
  readonly suffix?: ReactNode;
  /** Whether to display language information */
  readonly withLanguages?: boolean;
  /** Optional description content to display below doctor info */
  readonly description?: ReactNode;
  /** Whether the component should be interactive (clickable) */
  readonly interactive?: boolean;
}

/**
 * Type guard to check if doctor has WordPress embedded media
 */
const hasEmbeddedMedia = (
  doctor: Doctor | DoctorWP
): doctor is DoctorWP & { _embedded: { 'wp:featuredmedia': ReadonlyArray<{ source_url: string }> } } => {
  return (
    '_embedded' in doctor &&
    doctor._embedded != null &&
    'wp:featuredmedia' in doctor._embedded &&
    Array.isArray(doctor._embedded['wp:featuredmedia']) &&
    doctor._embedded['wp:featuredmedia'].length > 0 &&
    typeof doctor._embedded['wp:featuredmedia'][0]?.source_url === 'string'
  );
};

/**
 * Constants for the component
 */
const FALLBACK_AVATAR = '/avatar-doctor-fallback.png';
const FALLBACK_NAME = 'Bác sĩ';
const FALLBACK_TITLE = 'Bác sĩ';

/**
 * Enhanced Doctor Item Component - Mobile Optimized
 *
 * Displays doctor information in a card format with mobile-first responsive design,
 * enhanced accessibility, medical-themed styling, and optimized performance.
 *
 * Features:
 * - Mobile-first responsive design (320px-768px+)
 * - Touch-friendly interactions (44px+ touch targets)
 * - Optimized typography and readability
 * - Performance-optimized animations
 * - WCAG AA accessibility compliance
 * - Hospital UI theme consistency
 *
 * @param props - Component props
 * @returns JSX element representing a mobile-optimized doctor card
 */
const DoctorItem = memo<DoctorItemProps>(
  ({ doctor, suffix, withLanguages = true, description, interactive = true, ...props }) => {
    const [imgError, setImgError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Get the doctor's avatar URL with proper fallback handling
     */
    const getAvatarUrl = useCallback((): string => {
      if (imgError) return FALLBACK_AVATAR;

      // Check WordPress embedded media first
      if (hasEmbeddedMedia(doctor)) {
        return doctor._embedded['wp:featuredmedia'][0].source_url;
      }

      // Check direct image property
      if (doctor.image && typeof doctor.image === 'string') {
        return doctor.image;
      }

      // Check avatar property (WordPress legacy)
      if ('avatar' in doctor && doctor.avatar && typeof doctor.avatar === 'string') {
        return doctor.avatar;
      }

      return FALLBACK_AVATAR;
    }, [doctor, imgError]);

    /**
     * Extract doctor's display name with fallback
     */
    const getDisplayName = useCallback((): string => {
      if (doctor.name && typeof doctor.name === 'string') {
        return doctor.name.trim();
      }

      // Handle WordPress title object format
      if ('title' in doctor && doctor.title) {
        if (typeof doctor.title === 'object' && 'rendered' in doctor.title) {
          return doctor.title.rendered?.trim() || FALLBACK_NAME;
        }
        if (typeof doctor.title === 'string') {
          return doctor.title.trim();
        }
      }

      return FALLBACK_NAME;
    }, [doctor]);

    /**
     * Extract doctor's professional title with fallback
     */
    const getProfessionalTitle = useCallback((): string => {
      // Check WordPress custom field first
      if ('bacsi_chucdanh' in doctor && doctor.bacsi_chucdanh) {
        return doctor.bacsi_chucdanh.trim();
      }

      // Check standard title field
      if (doctor.title && typeof doctor.title === 'string') {
        return doctor.title.trim();
      }

      return FALLBACK_TITLE;
    }, [doctor]);

    /**
     * Extract doctor's department/unit information
     */
    const getDepartment = useCallback((): string => {
      // Check WordPress custom field first
      if ('bacsi_donvi' in doctor && doctor.bacsi_donvi) {
        return doctor.bacsi_donvi.trim();
      }

      // Check standard unit field
      if (doctor.unit && typeof doctor.unit === 'string') {
        return doctor.unit.trim();
      }

      return '';
    }, [doctor]);

    /**
     * Handle image loading events for mobile optimization
     */
    const handleImageError = useCallback(() => {
      setImgError(true);
      setIsLoading(false);
    }, []);

    const handleImageLoad = useCallback(() => {
      setIsLoading(false);
    }, []);

    // Extract computed values
    const avatarUrl = getAvatarUrl();
    const displayName = getDisplayName();
    const professionalTitle = getProfessionalTitle();
    const department = getDepartment();
    const isAvailable = doctor.isAvailable !== false; // Default to true if not specified
    const isWrappedInLink = props.onClick === undefined && interactive;

    /**
     * Handle keyboard interactions for accessibility
     */
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!interactive || !props.onClick) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          props.onClick(event as any);
        }
      },
      [interactive, props.onClick]
    );

    /**
     * Main content component with mobile-first responsive design
     */
    const Content = memo(() => (
      <div className="flex items-start gap-3 sm:gap-4 md:gap-6 relative">
        {/* Enhanced Doctor Avatar with Larger, Circular Design */}
        <div className="flex-shrink-0 relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
            }}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 shadow-lg shadow-blue-100/50 ring-4 ring-white border-2 border-blue-100/60 transform-gpu will-change-transform hover:shadow-xl hover:shadow-blue-200/60 hover:ring-blue-200/40 transition-all duration-300"
          >
            {/* Enhanced lazy loading with intersection observer */}
            <img
              src={avatarUrl}
              alt={`Ảnh đại diện của ${displayName}`}
              className={`object-cover w-full h-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 select-none ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
              decoding="async"
              fetchPriority="low"
              sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
              style={{
                imageRendering: 'crisp-edges',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                contentVisibility: 'auto',
                containIntrinsicSize: '96px 96px',
              }}
            />

            {/* Loading skeleton overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 animate-pulse flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
          </motion.div>

          {/* Enhanced availability indicator with prominent design */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3, type: 'spring', stiffness: 200 }}
            className={`absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white shadow-lg shadow-black/20 focus:outline-none focus:ring-4 focus:ring-blue-200 transform-gpu ${
              isAvailable
                ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 animate-pulse'
                : 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600'
            }`}
            aria-label={isAvailable ? 'Có sẵn' : 'Không có sẵn'}
            role="img"
          >
            <div className="w-full h-full flex items-center justify-center">
              {isAvailable ? (
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </motion.div>
        </div>

        {/* Doctor Information with mobile-optimized typography */}
        <div className="flex-grow min-w-0">
          {/* Doctor Name - Mobile-first responsive typography */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl leading-tight mb-2 sm:mb-3 break-words hyphens-auto"
          >
            {displayName}
          </motion.h3>

          {/* Professional Title - Mobile-optimized badge */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 mb-2 sm:mb-3 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 rounded-lg shadow-sm select-none antialiased"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{professionalTitle}</span>
          </motion.div>

          {/* Department with mobile-optimized layout */}
          {department && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex items-center text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 break-words"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="font-medium truncate">{department}</span>
            </motion.div>
          )}
        </div>

        {/* Suffix Element (Selection Indicator) - Mobile optimized */}
        {suffix && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            className="flex-shrink-0 mt-1 sm:mt-2 min-h-[44px] min-w-[44px]"
          >
            {suffix}
          </motion.div>
        )}
      </div>
    ));

    // Link mode - wraps content in TransitionLink for navigation
    if (isWrappedInLink) {
      return (
        <TransitionLink
          to={`/doctor/${doctor.id}`}
          className={combineClasses(
            'block',
            // Mobile-first responsive padding
            'p-3 sm:p-4 md:p-5', // Smaller padding on mobile
            'bg-gradient-to-r from-white to-blue-50/20',
            'border border-blue-100',
            BORDER_RADIUS.cardLarge,
            'hover:border-blue-300 hover:from-blue-50/30 hover:to-green-50/20',
            SHADOWS.card,
            'hover:shadow-lg',
            ANIMATIONS.normal,
            // Enhanced mobile accessibility
            'focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400',
            'focus:ring-offset-1', // Better focus visibility on mobile
            // Mobile touch optimization
            'touch-manipulation',
            'active:scale-[0.98]', // Subtle press feedback
            // Performance optimization
            'transform-gpu will-change-transform',
            props.className || ''
          )}
          aria-label={`Xem thông tin chi tiết của ${displayName}, ${professionalTitle}`}
        >
          <Content />
        </TransitionLink>
      );
    }

    // Interactive mode - mobile-optimized clickable div with enhanced accessibility
    return (
      <motion.div
        {...(props as any)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94], // Medical easing
        }}
        className={combineClasses(
          // Mobile-first responsive padding
          'p-3 sm:p-4 md:p-5', // Smaller padding on mobile
          'bg-gradient-to-r from-white to-blue-50/20',
          'border border-blue-100',
          BORDER_RADIUS.cardLarge,
          interactive && props.onClick ? 'cursor-pointer' : 'cursor-default',
          interactive && props.onClick && 'hover:border-blue-300 hover:from-blue-50/30 hover:to-green-50/20',
          SHADOWS.card,
          interactive && props.onClick && 'hover:shadow-lg',
          ANIMATIONS.normal,
          // Enhanced mobile accessibility
          'focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400',
          'focus:ring-offset-1', // Better focus visibility on mobile
          // Mobile touch optimization
          interactive && props.onClick && 'touch-manipulation',
          interactive && props.onClick && 'active:scale-[0.98]', // Subtle press feedback
          // Performance optimization
          'transform-gpu will-change-transform',
          // Availability state styling
          !isAvailable && 'opacity-75 bg-gray-50',
          // Mobile-specific minimum touch target
          interactive && props.onClick && TOUCH_TARGETS.interactive,
          props.className || ''
        )}
        role={interactive && props.onClick ? 'button' : 'article'}
        tabIndex={interactive && props.onClick ? 0 : -1}
        aria-label={
          interactive && props.onClick
            ? `Chọn bác sĩ ${displayName}, ${professionalTitle}${department ? `, ${department}` : ''}${isAvailable ? ', có sẵn' : ', không có sẵn'}`
            : `Thông tin bác sĩ ${displayName}`
        }
        aria-disabled={!isAvailable}
        onKeyDown={handleKeyDown}
        // Mobile-optimized hover and tap animations
        whileHover={
          interactive && props.onClick
            ? {
                scale: 1.005, // Subtle hover effect for mobile
                transition: { duration: 0.2 },
              }
            : undefined
        }
        whileTap={
          interactive && props.onClick
            ? {
                scale: 0.98,
                transition: { duration: 0.1 },
              }
            : undefined
        }
      >
        <Content />
      </motion.div>
    );
  }
);

// Set display name for debugging
DoctorItem.displayName = 'DoctorItem';

export default DoctorItem;
