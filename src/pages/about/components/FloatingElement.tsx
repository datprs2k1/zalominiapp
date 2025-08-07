import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibleAnimation } from '../hooks/useAccessibleAnimation';
import { EASING } from '../constants/animations';
import type { FloatingElementProps } from '../types';

/**
 * Optimized floating element component for subtle background animations
 * Uses performance-optimized animations and respects reduced motion preferences
 */
export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className = '',
  duration = 12,
  delay = 0,
}) => {
  const { shouldReduceMotion } = useAccessibleAnimation();

  // Respect reduced motion preference
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        opacity: [0.2, 0.4, 0.2],
        scale: [1, 1.02, 1],
        y: [-5, 5, -5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        delay,
        ease: EASING.smooth,
      }}
      // Performance optimization
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};
