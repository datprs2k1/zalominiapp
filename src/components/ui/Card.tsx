/**
 * Medical Card Component
 * Versatile card system for hospital mobile application
 */

import React, { forwardRef } from 'react';
import { CardProps } from './types';
import { cn } from '@/utils/cn';

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', shadow = true, children, className, testId, ...props }, ref) => {
    // Base card classes
    const baseClasses = ['bg-white rounded-medical-lg border border-neutral-100', 'transition-all duration-200'];

    // Variant classes
    const variantClasses = {
      default: shadow ? ['shadow-card-medical'] : [],
      hover: [
        'cursor-pointer',
        shadow ? 'shadow-card-medical hover:shadow-card-hover' : '',
        'hover:border-medical-200 hover:-translate-y-0.5',
      ],
      doctor: [
        'cursor-pointer',
        shadow ? 'shadow-card-medical hover:shadow-card-hover' : '',
        'hover:border-medical-200 hover:-translate-y-0.5',
        'flex flex-col items-center text-center',
      ],
      appointment: [shadow ? 'shadow-card-medical' : '', 'border-l-4 border-l-medical-500'],
      emergency: ['shadow-emergency border-l-4 border-l-danger-500', 'bg-danger-50/30'],
    };

    // Padding classes
    const paddingClasses = {
      sm: ['p-3'],
      md: ['p-card-padding'],
      lg: ['p-6'],
      xl: ['p-8'],
    };

    // Combine all classes
    const cardClasses = cn(baseClasses, variantClasses[variant], paddingClasses[padding], className);

    return (
      <div ref={ref} className={cardClasses} data-testid={testId} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
