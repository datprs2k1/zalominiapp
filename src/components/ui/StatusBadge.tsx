/**
 * Status Badge Component
 * Visual indicators for availability and status
 */

import React from 'react';
import { StatusBadgeProps } from './types';
import { cn } from '@/utils/cn';

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, size = 'md', className, testId, ...props }) => {
  // Base badge classes
  const baseClasses = ['inline-flex items-center gap-1 rounded-full font-medium', 'transition-all duration-200'];

  // Status variant classes
  const statusClasses = {
    available: ['bg-success-50 text-success-700 border border-success-200'],
    busy: ['bg-warning-50 text-warning-700 border border-warning-200'],
    unavailable: ['bg-danger-50 text-danger-700 border border-danger-200'],
  };

  // Size classes
  const sizeClasses = {
    sm: ['px-2 py-1 text-xs'],
    md: ['px-3 py-1.5 text-sm'],
    lg: ['px-4 py-2 text-base'],
    xl: ['px-5 py-2.5 text-lg'],
  };

  // Status indicators (dots)
  const statusDots = {
    available: 'bg-success-500',
    busy: 'bg-warning-500',
    unavailable: 'bg-danger-500',
  };

  // Default text for each status
  const defaultText = {
    available: 'Available',
    busy: 'Busy',
    unavailable: 'Unavailable',
  };

  // Combine all classes
  const badgeClasses = cn(baseClasses, statusClasses[status], sizeClasses[size], className);

  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' || size === 'xl' ? 'w-3 h-3' : 'w-2.5 h-2.5';

  return (
    <span className={badgeClasses} data-testid={testId} {...props}>
      <span className={cn('rounded-full flex-shrink-0', statusDots[status], dotSize)} />
      <span>{text || defaultText[status]}</span>
    </span>
  );
};

export default StatusBadge;
