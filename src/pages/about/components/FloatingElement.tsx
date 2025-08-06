import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibleAnimation } from '../hooks/useAccessibleAnimation';

interface FloatingElementProps {
  children?: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}

/**
 * Simplified floating element component for subtle background animations
 */
export const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  className = '', 
  duration = 12, 
  delay = 0 
}) => {
  const { shouldReduceMotion } = useAccessibleAnimation();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        delay,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};
