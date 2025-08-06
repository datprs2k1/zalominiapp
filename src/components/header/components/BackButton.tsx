/**
 * Back Button Component
 * Navigation back button with platform-specific styling
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { To } from 'react-router-dom';

import { BackIcon } from '../../icons/back';
import { BackButtonProps } from '../types';
import { useOptimizedHeaderAnimations, useOptimizedHeaderNavigation } from '../OptimizedHeaderProvider';
import { BACK_BUTTON_STYLES, ACCESSIBILITY_LABELS } from '../constants';
import { MEDICAL_COLOR_PALETTE } from '@/styles/unified-color-system';

// Back button component
export const BackButton: React.FC<BackButtonProps> = memo(
  ({
    onNavigate,
    isNavigating: externalIsNavigating,
    className = '',
    'aria-label': ariaLabel = ACCESSIBILITY_LABELS.backButton,
  }) => {
    const { prefersReducedMotion } = useOptimizedHeaderAnimations();
    const { isNavigating: contextIsNavigating } = useOptimizedHeaderNavigation();

    // Use external isNavigating prop or context value
    const isNavigating = externalIsNavigating ?? contextIsNavigating;
    const shouldAnimate = !prefersReducedMotion;

    const handleClick = () => {
      onNavigate(-1 as To);
    };

    return (
      <motion.button
        className={`
        p-2 mr-2 -ml-1 rounded-lg cursor-pointer
        min-w-[40px] min-h-[40px] md:min-w-[48px] md:min-h-[48px] lg:min-w-[52px] lg:min-h-[52px]
        flex items-center justify-center
        transition-all duration-150 ease-out
        hover:shadow-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${isNavigating ? 'animate-pulse' : ''}
        ${className}
      `
          .replace(/\s+/g, ' ')
          .trim()}
        style={BACK_BUTTON_STYLES}
        onClick={handleClick}
        disabled={isNavigating}
        whileHover={
          shouldAnimate
            ? {
                scale: 1.05,
                backgroundColor: `${MEDICAL_COLOR_PALETTE.medical.blue[500]}15`,
              }
            : {}
        }
        whileTap={shouldAnimate ? { scale: 0.95 } : {}}
        transition={shouldAnimate ? { duration: 0.15, ease: 'easeOut' } : {}}
        aria-label={ariaLabel}
        title={ACCESSIBILITY_LABELS.backButtonTitle}
        aria-describedby="back-button-description"
      >
        <BackIcon aria-hidden="true" />

        {/* Hidden description for screen readers */}
        <span id="back-button-description" className="sr-only">
          {ACCESSIBILITY_LABELS.backButtonDescription}
        </span>
      </motion.button>
    );
  }
);

BackButton.displayName = 'BackButton';
