import { ReactNode } from 'react';
import ArrowRightIcon from './icons/arrow-right';
import { To } from 'react-router-dom';
import TransitionLink from './transition-link';
import { cn } from '@/utils/cn';

interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  viewMore?: To;
  isCard?: boolean;
  noPadding?: boolean;
  noBackground?: boolean;
  accentColor?: string;
  icon?: ReactNode;
  variant?: 'default' | 'medical' | 'wellness' | 'emergency' | 'accent';
  gradient?: boolean;
  pattern?: boolean;
  animation?: boolean;
  compact?: boolean;
  // Enhanced mobile-first props
  size?: 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'subtle' | 'medium' | 'high';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  mobileOptimized?: boolean;
}

export default function Section({
  children,
  className = '',
  title,
  viewMore,
  isCard = false,
  noPadding = false,
  noBackground = false,
  accentColor = 'medical',
  icon,
  variant = 'default',
  gradient = false,
  pattern = false,
  animation = true,
  compact = false,
  // Enhanced mobile-first props with defaults
  size = 'md',
  elevation = 'medium',
  borderRadius = 'md',
  mobileOptimized = true,
}: SectionProps) {
  // Enhanced mobile-first size configurations with improved touch targets
  // Optimized for iOS (44px minimum) and Android (48dp minimum) guidelines
  // Enhanced text sizes for better mobile readability
  const sizeConfig = {
    sm: {
      headerPadding: compact ? 'p-3' : 'p-4',
      headerMargin: 'mb-3',
      iconSize: compact ? 'p-2' : 'p-2.5',
      iconMargin: 'mr-3',
      titleSize: 'text-lg md:text-base', // Larger on mobile, smaller on desktop
      buttonPadding: 'px-4 py-3', // Enhanced for better touch targets (min 44px)
      buttonText: 'text-base md:text-sm', // Larger text on mobile
      cardPadding: 'p-4',
      sectionMargin: 'mb-4',
      minTouchTarget: 'min-h-[44px] min-w-[44px]', // iOS minimum (WCAG AA)
      iconTouchTarget: 'min-w-[40px] min-h-[40px]', // Comfortable icon touch area
    },
    md: {
      headerPadding: compact ? 'p-4' : 'p-5',
      headerMargin: compact ? 'mb-4' : 'mb-5',
      iconSize: compact ? 'p-2.5' : 'p-3',
      iconMargin: compact ? 'mr-3' : 'mr-4',
      titleSize: compact ? 'text-xl md:text-lg' : 'text-2xl md:text-xl', // Larger on mobile
      buttonPadding: compact ? 'px-5 py-3' : 'px-6 py-3.5', // Android recommended (48dp)
      buttonText: compact ? 'text-base md:text-sm' : 'text-lg md:text-base', // Larger on mobile
      cardPadding: compact ? 'p-5 md:p-6' : 'p-6 md:p-7',
      sectionMargin: compact ? 'mb-5' : 'mb-7',
      minTouchTarget: 'min-h-[48px] min-w-[48px]', // Android recommended
      iconTouchTarget: 'min-w-[44px] min-h-[44px]', // Enhanced icon touch area
    },
    lg: {
      headerPadding: compact ? 'p-5' : 'p-6',
      headerMargin: compact ? 'mb-5' : 'mb-7',
      iconSize: compact ? 'p-3' : 'p-4',
      iconMargin: compact ? 'mr-4' : 'mr-5',
      titleSize: compact ? 'text-2xl md:text-xl' : 'text-3xl md:text-2xl', // Much larger on mobile
      buttonPadding: compact ? 'px-6 py-3.5' : 'px-7 py-4', // Premium touch target (52px)
      buttonText: compact ? 'text-lg md:text-base' : 'text-xl md:text-lg', // Larger on mobile
      cardPadding: compact ? 'p-6 md:p-7' : 'p-7 md:p-8',
      sectionMargin: compact ? 'mb-6' : 'mb-10',
      minTouchTarget: 'min-h-[52px] min-w-[52px]', // Premium touch target
      iconTouchTarget: 'min-w-[48px] min-h-[48px]', // Premium icon touch area
    },
  };

  // Enhanced elevation system
  const elevationStyles = {
    none: '',
    subtle: 'shadow-subtle',
    medium: 'shadow-card-medical hover:shadow-card-hover',
    high: 'shadow-card-elevated hover:shadow-card-hover',
  };

  // Enhanced border radius system
  const radiusStyles = {
    sm: 'rounded-medical',
    md: 'rounded-medical-lg',
    lg: 'rounded-medical-xl',
    xl: 'rounded-3xl',
  };

  // Enhanced variant-based styling with improved mobile accessibility
  const variantStyles = {
    default: {
      headerBg: '',
      accentColor: accentColor,
      iconBg: `bg-${accentColor}-100`,
      iconColor: `text-${accentColor}-600`,
    },
    medical: {
      headerBg: gradient ? 'bg-gradient-to-r from-medical-50 via-medical-100 to-medical-50' : 'bg-medical-50',
      accentColor: 'medical',
      iconBg: 'bg-medical-100',
      iconColor: 'text-medical-600',
    },
    wellness: {
      headerBg: gradient ? 'bg-gradient-to-r from-wellness-50 via-wellness-100 to-wellness-50' : 'bg-wellness-50',
      accentColor: 'wellness',
      iconBg: 'bg-wellness-100',
      iconColor: 'text-wellness-600',
    },
    emergency: {
      headerBg: gradient ? 'bg-gradient-to-r from-danger-50 via-danger-100 to-danger-50' : 'bg-danger-50',
      accentColor: 'danger',
      iconBg: 'bg-danger-100',
      iconColor: 'text-danger-600',
    },
    accent: {
      headerBg: gradient ? 'bg-gradient-to-r from-accent-50 via-accent-100 to-accent-50' : 'bg-accent-50',
      accentColor: 'accent',
      iconBg: 'bg-accent-100',
      iconColor: 'text-accent-600',
    },
  };

  const currentVariant = variantStyles[variant];
  const effectiveAccentColor = currentVariant.accentColor;
  const currentSize = sizeConfig[size];

  const header = (title || viewMore) && (
    <div
      className={cn(
        'flex items-center justify-between gap-3',
        // Enhanced mobile-first layout with size configurations
        currentSize.headerPadding,
        currentSize.headerMargin,
        radiusStyles[borderRadius],
        currentVariant.headerBg,
        pattern && 'relative overflow-hidden',
        animation && 'animate-slide-down',
        // Enhanced mobile touch targets with size-based heights - optimized for larger mobile text
        mobileOptimized && size === 'sm' && 'min-h-[52px] md:min-h-[48px]',
        mobileOptimized && size === 'md' && 'min-h-[60px] md:min-h-[52px]',
        mobileOptimized && size === 'lg' && 'min-h-[68px] md:min-h-[56px]',
        // Improved accessibility with better focus states
        'focus-within:ring-2 focus-within:ring-medical-500 focus-within:ring-opacity-50',
        'focus-within:ring-offset-2 transition-all duration-200',
        // Enhanced mobile interactions
        'active:scale-[0.99] transform-gpu will-change-transform'
      )}
    >
      {/* Background pattern for medical theme */}
      {pattern && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="medical-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#medical-pattern)" />
          </svg>
        </div>
      )}

      {title && (
        <div className="flex items-center relative z-10 flex-1 min-w-0">
          {icon && (
            <div
              className={cn(
                'flex items-center justify-center shrink-0',
                // Enhanced mobile-first icon styling with size-based dimensions
                currentSize.iconSize,
                currentSize.iconMargin,
                radiusStyles.sm,
                currentVariant.iconBg,
                currentVariant.iconColor,
                elevationStyles.subtle,
                // Enhanced mobile accessibility with size-responsive touch targets
                // Optimized for both iOS and Android touch guidelines
                mobileOptimized && size === 'sm' && currentSize.iconTouchTarget,
                mobileOptimized && size === 'md' && currentSize.iconTouchTarget,
                mobileOptimized && size === 'lg' && currentSize.iconTouchTarget,
                // Improved interactions with better feedback
                'transition-all duration-200 hover:scale-105 active:scale-95',
                'transform-gpu will-change-transform',
                // Better accessibility for screen readers
                'focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-1'
              )}
              role="img"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <div
              className={cn(
                'font-semibold text-neutral-900 relative',
                // Enhanced mobile-first typography with better contrast and larger text
                currentSize.titleSize,
                mobileOptimized && 'leading-snug md:leading-tight tracking-normal md:tracking-tight',
                // Better text rendering on mobile with improved readability
                'antialiased font-semibold md:font-medium'
              )}
            >
              {title}
              <span
                className={cn(
                  'absolute -bottom-1 left-0 rounded-full transition-all duration-300',
                  // Enhanced accent line with better mobile visibility and size responsiveness
                  size === 'sm' ? 'h-0.5 w-5' : size === 'lg' ? 'h-1.5 w-10' : 'h-1 w-8',
                  `bg-${effectiveAccentColor}-500`,
                  gradient && size !== 'sm' && 'bg-gradient-to-r from-transparent via-current to-transparent',
                  // Enhanced visual feedback
                  'shadow-sm'
                )}
                aria-hidden="true"
              ></span>
            </div>
          </div>
        </div>
      )}

      {viewMore && (
        <TransitionLink
          to={viewMore}
          className={cn(
            'flex items-center justify-center gap-1.5 shrink-0 group',
            // Enhanced mobile-first button styling with size-responsive dimensions
            currentSize.buttonPadding,
            currentSize.buttonText,
            radiusStyles.sm,
            `bg-${effectiveAccentColor}-500 text-white`,
            `hover:bg-${effectiveAccentColor}-600 active:bg-${effectiveAccentColor}-700`,
            'shadow-button-medical hover:shadow-card-hover',
            'transition-all duration-200 transform hover:scale-105 active:scale-95',
            'relative z-10 font-semibold',
            // Enhanced mobile accessibility with size-responsive touch targets
            // Ensures compliance with iOS (44px) and Android (48dp) guidelines
            mobileOptimized && currentSize.minTouchTarget,
            // Improved focus states for accessibility with Serene Blues
            'focus:outline-none focus:ring-3 focus:ring-medical-200 focus:ring-opacity-75 focus:ring-offset-2',
            // Enhanced touch feedback and visual states for mobile
            'active:shadow-inner hover:shadow-lg active:scale-[0.97] hover:scale-[1.02]',
            // Hardware acceleration for smooth 60fps animations
            'transform-gpu will-change-transform transition-all duration-150',
            // Better text rendering and mobile typography
            'antialiased font-medium',
            // Enhanced mobile touch feedback with haptic-like visual response
            'active:bg-opacity-90 hover:bg-opacity-95'
          )}
          aria-label={`Xem tất cả ${title || 'mục'}`}
          role="button"
        >
          <span className={cn(currentSize.buttonText, 'font-semibold')}>
            {size === 'sm' || compact ? 'Xem' : 'Xem tất cả'}
          </span>
          <ArrowRightIcon
            className={cn(
              size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
              'transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-0.5',
              'flex-shrink-0'
            )}
            aria-hidden="true"
          />
        </TransitionLink>
      )}
    </div>
  );

  // Enhanced container padding with safe area support for iOS notches and improved mobile spacing
  const containerPadding = noPadding
    ? ''
    : mobileOptimized
      ? 'px-4 sm:px-5 md:px-6 safe-area-padding-x'
      : 'px-4 md:px-5';

  // Enhanced section classes with mobile-first design
  const sectionClasses = cn(
    containerPadding,
    className,
    // Enhanced mobile-first spacing
    currentSize.sectionMargin,
    animation && 'animate-slide-up',
    // Better mobile performance
    mobileOptimized && 'will-change-transform'
  );

  // Enhanced card styling with mobile-first design
  const contentClasses = cn(
    'flex flex-col justify-center',
    // Enhanced mobile-first gap system with better spacing
    size === 'sm' ? 'gap-3' : size === 'lg' ? 'gap-6' : 'gap-4',
    !noBackground && [
      'bg-white',
      // Enhanced mobile-first styling
      radiusStyles[borderRadius],
      elevationStyles[elevation],
      'border border-neutral-100 hover:border-medical-200',
      currentSize.cardPadding,
      'transition-all duration-300 ease-out',
      // Enhanced mobile interactions with better touch feedback
      mobileOptimized && 'hover:transform hover:scale-[1.01] active:scale-[0.99] active:shadow-inner',
      !mobileOptimized && 'hover:transform hover:scale-[1.01]',
      pattern && 'relative overflow-hidden',
      // Better mobile performance and accessibility
      'will-change-transform focus-within:ring-2 focus-within:ring-medical-300 focus-within:ring-opacity-50',
    ]
  );

  return (
    <div className={sectionClasses}>
      {isCard ? (
        <div className={contentClasses}>
          {/* Card background pattern */}
          {pattern && !noBackground && (
            <div className="absolute inset-0 opacity-3">
              <div
                className={cn(
                  'absolute top-0 right-0 w-32 h-32 rounded-full',
                  `bg-${effectiveAccentColor}-100`,
                  'transform translate-x-16 -translate-y-16'
                )}
              ></div>
              <div
                className={cn(
                  'absolute bottom-0 left-0 w-24 h-24 rounded-full',
                  `bg-${effectiveAccentColor}-50`,
                  'transform -translate-x-12 translate-y-12'
                )}
              ></div>
            </div>
          )}

          <div className="relative z-10">
            {header}
            <div className={animation ? 'animate-slide-up delay-100' : ''}>{children}</div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            compact ? 'space-y-2' : 'space-y-4',
            // Enhanced mobile spacing and touch optimization
            mobileOptimized && 'touch-manipulation select-none'
          )}
        >
          {header}
          <div
            className={cn(
              animation && 'animate-slide-up delay-100',
              // Better mobile content rendering
              mobileOptimized && 'will-change-transform'
            )}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
