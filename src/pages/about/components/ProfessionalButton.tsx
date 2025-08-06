import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibleAnimation } from '../hooks/useAccessibleAnimation';

interface ProfessionalButtonProps {
  children: React.ReactNode;
  href: string;
  variant: 'primary' | 'secondary';
  className?: string;
  ariaLabel?: string;
}

/**
 * Professional button component with micro-interactions
 */
export const ProfessionalButton: React.FC<ProfessionalButtonProps> = ({ 
  children, 
  href, 
  variant, 
  className = '', 
  ariaLabel 
}) => {
  const { getAnimationProps } = useAccessibleAnimation();

  const baseClasses =
    'flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-lg text-center min-h-[48px] sm:min-h-[56px] focus:outline-none focus:ring-4 focus:ring-opacity-50 touch-manipulation';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-medical-blue to-medical-blue-dark text-white hover:from-medical-blue-dark hover:to-medical-blue focus:ring-medical-blue',
    secondary:
      'bg-medical-white border-2 border-healing-green text-healing-green hover:bg-healing-green/5 focus:ring-healing-green',
  };

  const hoverProps = getAnimationProps(
    {
      whileHover: {
        scale: 1.01,
        boxShadow:
          variant === 'primary' ? '0 8px 20px -8px rgba(37, 99, 235, 0.2)' : '0 8px 20px -8px rgba(16, 185, 129, 0.2)',
      },
      whileTap: { scale: 0.99 },
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    {
      whileHover: {},
      whileTap: {},
      transition: { duration: 0.01 },
    }
  );

  return (
    <motion.a
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...hoverProps}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
    >
      {children}
    </motion.a>
  );
};
