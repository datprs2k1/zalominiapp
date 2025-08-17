/**
 * Medical Checkbox Component
 * Accessible checkbox for hospital forms
 */

import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  variant?: 'default' | 'error';
  size?: 'sm' | 'md' | 'lg';
  testId?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      variant = 'default',
      size = 'md',
      className,
      testId,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Size classes
    const sizeClasses = {
      sm: {
        checkbox: 'w-4 h-4',
        label: 'text-sm',
        description: 'text-xs',
      },
      md: {
        checkbox: 'w-5 h-5',
        label: 'text-base',
        description: 'text-sm',
      },
      lg: {
        checkbox: 'w-6 h-6',
        label: 'text-lg',
        description: 'text-base',
      },
    };

    // Base checkbox classes
    const baseClasses = [
      'rounded border-2 text-medical-500',
      'focus:ring-2 focus:ring-offset-0 focus:ring-medical-500',
      'transition-all duration-200 cursor-pointer',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    // Variant classes
    const variantClasses = {
      default: [
        'border-neutral-300 bg-white',
        'checked:bg-medical-500 checked:border-medical-500',
        'hover:border-medical-400',
      ],
      error: [
        'border-danger-500 bg-white',
        'checked:bg-danger-500 checked:border-danger-500',
        'hover:border-danger-400',
        'focus:ring-danger-500',
      ],
    };

    // Determine variant based on error
    const currentVariant = error ? 'error' : variant;

    // Combine checkbox classes
    const checkboxClasses = cn(
      baseClasses,
      variantClasses[currentVariant],
      sizeClasses[size].checkbox,
      className
    );

    return (
      <div className="form-group-medical">
        <div className="flex items-start gap-3">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={checkboxClasses}
              data-testid={testId}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? `${checkboxId}-error` : description ? `${checkboxId}-description` : undefined
              }
              {...props}
            />
          </div>
          
          {(label || description) && (
            <div className="flex-1">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    'font-medium cursor-pointer',
                    sizeClasses[size].label,
                    error ? 'text-danger-700' : 'text-neutral-900'
                  )}
                >
                  {label}
                  {props.required && <span className="text-danger-500 ml-1">*</span>}
                </label>
              )}
              
              {description && (
                <p
                  id={`${checkboxId}-description`}
                  className={cn(
                    'text-neutral-600 mt-1',
                    sizeClasses[size].description
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p
            id={`${checkboxId}-error`}
            className="mt-1 text-sm text-danger-600 ml-8"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
