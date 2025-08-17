/**
 * Medical Section Component
 * Structured section layout for hospital application
 */

import React from 'react';
import { cn } from '@/utils/cn';

interface SectionProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'white' | 'gray' | 'medical';
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  action,
  spacing = 'md',
  background = 'transparent',
  children,
  className,
  testId,
  ...props
}) => {
  // Spacing classes
  const spacingClasses = {
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8',
    xl: 'py-12',
  };

  // Background classes
  const backgroundClasses = {
    transparent: '',
    white: 'bg-white',
    gray: 'bg-neutral-50',
    medical: 'bg-medical-50',
  };

  // Section classes
  const sectionClasses = cn(
    spacingClasses[spacing],
    backgroundClasses[background],
    className
  );

  return (
    <section
      className={sectionClasses}
      data-testid={testId}
      {...props}
    >
      {/* Section header */}
      {(title || subtitle || action) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {title && (
              <h2 className="text-medical-title font-bold text-neutral-900">
                {title}
              </h2>
            )}
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-medical-body text-neutral-600">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Section content */}
      <div>
        {children}
      </div>
    </section>
  );
};

export default Section;
