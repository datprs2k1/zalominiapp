/**
 * Medical Textarea Component
 * Accessible textarea for hospital forms
 */

import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  testId?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      resize = 'vertical',
      className,
      testId,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Base textarea classes
    const baseClasses = [
      'w-full px-4 py-3 border rounded-medical',
      'text-medical-body bg-white placeholder-neutral-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'transition-all duration-200',
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

    // Resize classes
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    // Determine variant based on error
    const currentVariant = error ? 'error' : variant;

    // Combine all classes
    const textareaClasses = cn(
      baseClasses,
      variantClasses[currentVariant],
      resizeClasses[resize],
      className
    );

    return (
      <div className="form-group-medical">
        {label && (
          <label htmlFor={textareaId} className="label-medical">
            {label}
            {props.required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={textareaClasses}
          data-testid={testId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        
        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-1 text-sm text-danger-600"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="mt-1 text-sm text-neutral-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
