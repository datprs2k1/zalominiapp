/**
 * Medical Container Component
 * Responsive container for hospital application layout
 */

import React from 'react';
import { ContainerProps } from './types';
import { cn } from '@/utils/cn';

const Container: React.FC<ContainerProps> = ({
  maxWidth = 'md',
  padding = 'md',
  center = true,
  children,
  className,
  testId,
  ...props
}) => {
  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  // Padding classes
  const paddingClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
    xl: 'px-8 py-6',
  };

  // Center classes
  const centerClasses = center ? ['mx-auto'] : [];

  // Combine all classes
  const containerClasses = cn(
    'w-full',
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    centerClasses,
    className
  );

  return (
    <div
      className={containerClasses}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
