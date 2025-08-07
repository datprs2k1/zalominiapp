import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibleAnimation } from '../hooks/useAccessibleAnimation';
import {
  fadeInUp,
  fadeInScale,
  fadeInSlide,
  fadeInRight,
  createTransition,
  TRANSITIONS,
} from '../constants/animations';
import type { AnimatedElementProps, AnimationType } from '../types';

/**
 * Reusable animated element component with Framer Motion
 */
export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  delay = 0,
  duration = 0.4,
  className = '',
  animation = 'fadeIn',
}) => {
  const { getAnimationProps, shouldReduceMotion } = useAccessibleAnimation();

  // Optimized animation variants mapping
  const variants: Record<string, any> = {
    fadeIn: fadeInUp,
    fadeScale: fadeInScale,
    fadeSlide: fadeInSlide,
    slideUp: fadeInUp,
    slideLeft: fadeInSlide,
    slideRight: fadeInRight,
  };

  // Create optimized transition
  const transition = shouldReduceMotion ? { duration: 0.01, delay: 0 } : createTransition(duration, delay);

  const animationProps = getAnimationProps({
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-50px' },
    variants: variants[animation],
    transition,
  });

  return (
    <motion.div
      className={className}
      {...animationProps}
      // Performance optimization
      style={{ willChange: shouldReduceMotion ? 'auto' : 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};
