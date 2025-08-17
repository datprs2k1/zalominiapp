/**
 * Medical Loading Component
 * Various loading indicators for hospital application
 */

import React from 'react';
import { LoadingProps } from './types';
import { cn } from '@/utils/cn';

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  className,
  testId,
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: {
      spinner: 'w-4 h-4',
      dots: 'w-1 h-1',
      text: 'text-sm',
    },
    md: {
      spinner: 'w-6 h-6',
      dots: 'w-2 h-2',
      text: 'text-base',
    },
    lg: {
      spinner: 'w-8 h-8',
      dots: 'w-3 h-3',
      text: 'text-lg',
    },
    xl: {
      spinner: 'w-12 h-12',
      dots: 'w-4 h-4',
      text: 'text-xl',
    },
  };

  const renderSpinner = () => (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-medical-200 border-t-medical-500',
        sizeClasses[size].spinner
      )}
      role="status"
      aria-label="Loading"
    />
  );

  const renderDots = () => (
    <div className="flex items-center gap-1" role="status" aria-label="Loading">
      <div
        className={cn(
          'bg-medical-500 rounded-full animate-loading-dots',
          sizeClasses[size].dots
        )}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={cn(
          'bg-medical-500 rounded-full animate-loading-dots',
          sizeClasses[size].dots
        )}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={cn(
          'bg-medical-500 rounded-full animate-loading-dots',
          sizeClasses[size].dots
        )}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );

  const renderSkeleton = () => (
    <div
      className={cn(
        'animate-skeleton bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-medical',
        'h-4 w-32',
        className
      )}
      style={{
        backgroundSize: '400px 100%',
      }}
      role="status"
      aria-label="Loading content"
    />
  );

  const renderContent = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  if (variant === 'skeleton') {
    return renderContent();
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3',
        className
      )}
      data-testid={testId}
      {...props}
    >
      {renderContent()}
      {text && (
        <span className={cn('text-neutral-600', sizeClasses[size].text)}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Loading;
