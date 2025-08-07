import { useReducedMotion } from 'framer-motion';
import type { AccessibleAnimationHook } from '../types';

/**
 * Enhanced utility hook for reduced motion support with performance optimizations
 * @returns AccessibleAnimationHook with animation utilities
 */
export const useAccessibleAnimation = (): AccessibleAnimationHook => {
  const shouldReduceMotion = useReducedMotion();

  const getAnimationProps = (normalProps: Record<string, any>, reducedProps?: Record<string, any>) => {
    if (shouldReduceMotion) {
      return (
        reducedProps || {
          ...normalProps,
          transition: { duration: 0.01 },
          animate: normalProps.initial || {},
        }
      );
    }
    return {
      ...normalProps,
      // Add performance optimizations
      style: { willChange: 'transform, opacity' },
    };
  };

  const getTransition = (duration: number, delay: number = 0) => {
    if (shouldReduceMotion) {
      return { duration: 0.01, delay: 0 };
    }
    return {
      duration,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
      // Performance optimization
      type: 'tween' as const,
    };
  };

  return { getAnimationProps, getTransition, shouldReduceMotion };
};
