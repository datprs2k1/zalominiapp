/**
 * Medical Progress Indicator Component
 * Progress bars and indicators for hospital application
 */

import React from 'react';
import { cn } from '@/utils/cn';

interface ProgressIndicatorProps {
  value: number; // 0-100
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
  testId?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  className,
  testId,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Size classes
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-medical-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  };

  return (
    <div className={cn('w-full', className)} data-testid={testId} {...props}>
      {/* Label */}
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-medical-body font-medium text-neutral-700">
            {label || 'Progress'}
          </span>
          <span className="text-medical-label text-neutral-500">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div
        className={cn(
          'w-full bg-neutral-200 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress indicator'}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantClasses[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Circular Progress Component
interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
  className?: string;
  testId?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  label,
  className,
  testId,
  ...props
}) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Variant colors
  const variantColors = {
    default: '#0ea5e9', // medical-500
    success: '#22c55e', // success-500
    warning: '#f59e0b', // warning-500
    danger: '#ef4444', // danger-500
  };

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      data-testid={testId}
      {...props}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb" // neutral-200
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center content */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-neutral-900">
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-neutral-500 mt-1 text-center">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Step Progress Component
interface StepProgressProps {
  steps: Array<{
    id: string;
    label: string;
    completed?: boolean;
    active?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  testId?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  orientation = 'horizontal',
  className,
  testId,
  ...props
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'items-center' : 'flex-col',
        className
      )}
      data-testid={testId}
      {...props}
    >
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            'flex items-center',
            isHorizontal ? 'flex-row' : 'flex-col',
            index < steps.length - 1 && (isHorizontal ? 'flex-1' : 'mb-4')
          )}
        >
          {/* Step indicator */}
          <div className="flex items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                step.completed
                  ? 'bg-success-500 text-white'
                  : step.active
                    ? 'bg-medical-500 text-white'
                    : 'bg-neutral-200 text-neutral-500'
              )}
            >
              {step.completed ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>

            {/* Step label */}
            <span
              className={cn(
                'ml-3 text-sm font-medium',
                step.active ? 'text-medical-600' : 'text-neutral-500'
              )}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                isHorizontal
                  ? 'flex-1 h-0.5 mx-4'
                  : 'w-0.5 h-8 ml-4 mt-2',
                step.completed ? 'bg-success-500' : 'bg-neutral-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
