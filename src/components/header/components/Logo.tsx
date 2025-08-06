/**
 * Logo Component
 * Medical app logo with platform-specific styling and animations
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';

import { LogoProps } from '../types';
import { useOptimizedHeaderAnimations, useOptimizedHeaderPlatform } from '../OptimizedHeaderProvider';
import { LOGO_STYLES, ACCESSIBILITY_LABELS, MEDICAL_BRANDING } from '../constants';

// Size configurations
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

// Logo component
export const Logo: React.FC<LogoProps> = memo(({ size = 'medium', animated = true, className = '' }) => {
  const { prefersReducedMotion } = useOptimizedHeaderAnimations();
  const { deviceInfo } = useOptimizedHeaderPlatform();

  const sizeConfig = SIZE_CONFIG[size];
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <motion.div
      className={`
        rounded-xl mr-2 md:mr-3 flex items-center justify-center 
        shadow-md hover:shadow-lg transition-shadow duration-300
        ring-1 ring-white/20 hover:ring-white/30
        ${sizeConfig.container} ${className}
      `}
      style={LOGO_STYLES}
      whileHover={shouldAnimate ? { scale: 1.05 } : {}}
      whileTap={shouldAnimate ? { scale: 0.95 } : {}}
      transition={shouldAnimate ? { duration: 0.15, ease: 'easeOut' } : {}}
      role="img"
      aria-label={ACCESSIBILITY_LABELS.logo}
      aria-describedby="logo-description"
    >
      <svg
        className={`${sizeConfig.icon} text-white drop-shadow-sm`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
      </svg>

      {/* Hidden description for screen readers */}
      <span id="logo-description" className="sr-only">
        {ACCESSIBILITY_LABELS.logoDescription}
      </span>
    </motion.div>
  );
});

Logo.displayName = 'Logo';
