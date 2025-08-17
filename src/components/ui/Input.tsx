/**
 * Medical Input Component
 * Accessible input system for hospital forms
 */

import React, { forwardRef } from 'react';
import { InputProps } from './types';
import { cn } from '@/utils/cn';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      className,
      testId,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Base input classes
    const baseClasses = [
      'w-full px-4 py-3 border rounded-medical',
      'text-medical-body bg-white placeholder-neutral-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'transition-all duration-200 min-h-[44px]',
      'disabled:bg-neutral-50 disabled:cursor-not-allowed',
    ];

    // Variant classes
    const variantClasses = {
      default: [
        'border-neutral-300',
        'focus:ring-medical-500 focus:border-medical-500',
      ],
      error: [
        'border-danger-500',
        'focus:ring-danger-500 focus:border-danger-500',
      ],
    };

    // Icon padding adjustments
    const iconClasses = {
      left: leftIcon ? ['pl-12'] : [],
      right: rightIcon ? ['pr-12'] : [],
    };

    // Combine all classes
    const inputClasses = cn(
      baseClasses,
      variantClasses[variant],
      iconClasses.left,
      iconClasses.right,
      className
    );

    return (
      <div className="form-group-medical">
        {label && (
          <label htmlFor={inputId} className="label-medical">
            {label}
            {props.required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            data-testid={testId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-danger-600"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-neutral-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
