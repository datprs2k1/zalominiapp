/**
 * Optimized Logo Component
 * Performance-optimized logo with enhanced accessibility
 */

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

import { LogoProps } from '../types';
import { useOptimizedHeaderAnimations, useOptimizedHeaderPlatform } from '../OptimizedHeaderProvider';
import { LOGO_STYLES, ACCESSIBILITY_LABELS, MEDICAL_BRANDING } from '../constants';
import { useMemoizedClasses, usePerformanceMonitor } from '../utils/performance';
import { useAriaUtils, useColorContrast } from '../utils/accessibility';

// Optimized size configurations with memoization
const SIZE_CONFIG = {
  small: {
    container: 'min-h-[32px] min-w-[32px] p-1.5',
    icon: 'h-4 w-4',
  },
  medium: {
    container: 'min-h-[40px] min-w-[40px] md:min-h-[48px] md:min-w-[48px] p-2',
    icon: 'h-5 w-5 md:h-7 md:w-7',
  },
  large: {
    container: 'min-h-[48px] min-w-[48px] lg:min-h-[52px] lg:min-w-[52px] p-2 md:p-2.5',
    icon: 'h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8',
  },
} as const;

// Memoized SVG icon component
const LogoIcon = memo<{ className: string }>(({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
  </svg>
));

LogoIcon.displayName = 'LogoIcon';

// Optimized Logo component
export const OptimizedLogo: React.FC<LogoProps> = memo(({ size = 'medium', animated = true, className = '' }) => {
  const { prefersReducedMotion } = useOptimizedHeaderAnimations();
  const { deviceInfo } = useOptimizedHeaderPlatform();
  const { generateId, createAriaProps } = useAriaUtils();
  const { meetsWCAGAA } = useColorContrast();

  // Performance monitoring in development
  usePerformanceMonitor('OptimizedLogo');

  // Memoized configuration
  const sizeConfig = useMemo(() => SIZE_CONFIG[size], [size]);
  const shouldAnimate = useMemo(() => animated && !prefersReducedMotion, [animated, prefersReducedMotion]);

  // Generate unique IDs for accessibility
  const logoId = useMemo(() => generateId('logo'), [generateId]);
  const descriptionId = useMemo(() => generateId('logo-description'), [generateId]);

  // Memoized CSS classes
  const containerClasses = useMemoizedClasses(
    `rounded-xl mr-2 md:mr-3 flex items-center justify-center 
     shadow-md hover:shadow-lg transition-shadow duration-300
     ring-1 ring-white/20 hover:ring-white/30 text-white drop-shadow-sm`,
    {
      [sizeConfig.container]: true,
      [className]: !!className,
    },
    [sizeConfig.container, className]
  );

  const iconClasses = useMemo(() => `${sizeConfig.icon} text-white drop-shadow-sm`, [sizeConfig.icon]);

  // Accessibility props
  const ariaProps = useMemo(
    () => createAriaProps(ACCESSIBILITY_LABELS.logo, descriptionId),
    [createAriaProps, descriptionId]
  );

  // Animation variants for better performance
  const animationVariants = useMemo(
    () => ({
      hover: shouldAnimate ? { scale: 1.05 } : {},
      tap: shouldAnimate ? { scale: 0.95 } : {},
      transition: shouldAnimate ? { duration: 0.15, ease: 'easeOut' } : {},
    }),
    [shouldAnimate]
  );

  return (
    <motion.div
      id={logoId}
      className={containerClasses}
      style={LOGO_STYLES}
      whileHover={animationVariants.hover}
      whileTap={animationVariants.tap}
      transition={animationVariants.transition}
      role="img"
      {...ariaProps}
    >
      <LogoIcon className={iconClasses} />

      {/* Hidden description for screen readers */}
      <span id={descriptionId} className="sr-only">
        {ACCESSIBILITY_LABELS.logoDescription}
      </span>
    </motion.div>
  );
});

OptimizedLogo.displayName = 'OptimizedLogo';
