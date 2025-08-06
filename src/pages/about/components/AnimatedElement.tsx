import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibleAnimation } from '../hooks/useAccessibleAnimation';
import { fadeInUp, fadeInScale, fadeInSlide } from '../constants/animations';

interface AnimatedElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animation?: 'fadeUp' | 'fadeScale' | 'fadeSlide';
}

/**
 * Reusable animated element component with Framer Motion
 */
export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  delay = 0,
  className = '',
  animation = 'fadeUp',
}) => {
  const { getAnimationProps, getTransition } = useAccessibleAnimation();

  const variants = {
    fadeUp: fadeInUp,
    fadeScale: fadeInScale,
    fadeSlide: fadeInSlide,
  };

  const animationProps = getAnimationProps({
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-50px' },
    variants: variants[animation],
    transition: getTransition(0.6, delay / 1000),
  });

  return (
    <motion.div className={className} {...animationProps}>
      {children}
    </motion.div>
  );
};
