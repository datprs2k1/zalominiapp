/**
 * Optimized Back Button Component
 * Performance-optimized back button with enhanced accessibility
 */

import React, { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { To } from 'react-router-dom';

import { BackIcon } from '../../icons/back';
import { BackButtonProps } from '../types';
import { useOptimizedHeaderAnimations, useOptimizedHeaderNavigation } from '../OptimizedHeaderProvider';
import { BACK_BUTTON_STYLES, ACCESSIBILITY_LABELS } from '../constants';
import { MEDICAL_COLOR_PALETTE } from '@/styles/unified-color-system';
import { useMemoizedClasses, usePerformanceMonitor } from '../utils/performance';
import { useAriaUtils, useFocusManagement, useKeyboardNavigation } from '../utils/accessibility';

// Optimized Back Button component
export const OptimizedBackButton: React.FC<BackButtonProps> = memo(
  ({
    onNavigate,
    isNavigating: externalIsNavigating,
    className = '',
    'aria-label': ariaLabel = ACCESSIBILITY_LABELS.backButton,
  }) => {
    const { prefersReducedMotion } = useOptimizedHeaderAnimations();
    const { isNavigating: contextIsNavigating } = useOptimizedHeaderNavigation();
    const { generateId, createAriaProps } = useAriaUtils();
    const { createKeyboardHandler } = useKeyboardNavigation();

    // Performance monitoring in development
    usePerformanceMonitor('OptimizedBackButton');

    // Use external isNavigating prop or context value
    const isNavigating = useMemo(
      () => externalIsNavigating ?? contextIsNavigating,
      [externalIsNavigating, contextIsNavigating]
    );

    const shouldAnimate = useMemo(() => !prefersReducedMotion, [prefersReducedMotion]);

    // Generate unique IDs for accessibility
    const buttonId = useMemo(() => generateId('back-button'), [generateId]);
    const descriptionId = useMemo(() => generateId('back-button-description'), [generateId]);

    // Memoized click handler
    const handleClick = useCallback(() => {
      if (!isNavigating) {
        onNavigate(-1 as To);
      }
    }, [onNavigate, isNavigating]);

    // Keyboard handler for accessibility
    const handleKeyDown = useMemo(
      () =>
        createKeyboardHandler({
          Enter: handleClick,
          ' ': handleClick, // Space key
        }),
      [createKeyboardHandler, handleClick]
    );

    // Memoized CSS classes
    const buttonClasses = useMemoizedClasses(
      `p-2 mr-2 -ml-1 rounded-lg cursor-pointer
     min-w-[40px] min-h-[40px] md:min-w-[48px] md:min-h-[48px] lg:min-w-[52px] lg:min-h-[52px]
     flex items-center justify-center
     transition-all duration-150 ease-out
     hover:shadow-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
     active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`,
      {
        'animate-pulse': isNavigating,
        [className]: !!className,
      },
      [isNavigating, className]
    );

    // Animation variants for better performance
    const animationVariants = useMemo(
      () => ({
        hover: shouldAnimate
          ? {
              scale: 1.05,
              backgroundColor: `${MEDICAL_COLOR_PALETTE.medical.blue[500]}15`,
            }
          : {},
        tap: shouldAnimate ? { scale: 0.95 } : {},
        transition: shouldAnimate ? { duration: 0.15, ease: 'easeOut' } : {},
      }),
      [shouldAnimate]
    );

    // Accessibility props
    const ariaProps = useMemo(
      () => createAriaProps(ariaLabel, descriptionId),
      [createAriaProps, ariaLabel, descriptionId]
    );

    return (
      <motion.button
        id={buttonId}
        className={buttonClasses}
        style={BACK_BUTTON_STYLES}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isNavigating}
        whileHover={animationVariants.hover}
        whileTap={animationVariants.tap}
        transition={animationVariants.transition}
        title={ACCESSIBILITY_LABELS.backButtonTitle}
        {...ariaProps}
      >
        <BackIcon aria-hidden="true" />

        {/* Hidden description for screen readers */}
        <span id={descriptionId} className="sr-only">
          {ACCESSIBILITY_LABELS.backButtonDescription}
        </span>
      </motion.button>
    );
  }
);

OptimizedBackButton.displayName = 'OptimizedBackButton';
