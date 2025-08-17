/**
 * Medical Radio Group Component
 * Accessible radio group for hospital forms
 */

import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  testId?: string;
  required?: boolean;
}

const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      name,
      options,
      value,
      onChange,
      label,
      error,
      helperText,
      variant = 'default',
      size = 'md',
      orientation = 'vertical',
      className,
      testId,
      required = false,
      ...props
    },
    ref
  ) => {
    const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;

    // Size classes
    const sizeClasses = {
      sm: {
        radio: 'w-4 h-4',
        label: 'text-sm',
        description: 'text-xs',
      },
      md: {
        radio: 'w-5 h-5',
        label: 'text-base',
        description: 'text-sm',
      },
      lg: {
        radio: 'w-6 h-6',
        label: 'text-lg',
        description: 'text-base',
      },
    };

    // Base radio classes
    const baseRadioClasses = [
      'border-2 text-medical-500',
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

    // Orientation classes
    const orientationClasses = {
      horizontal: 'flex flex-wrap gap-6',
      vertical: 'space-y-3',
    };

    const handleChange = (optionValue: string) => {
      if (onChange) {
        onChange(optionValue);
      }
    };

    return (
      <fieldset
        ref={ref}
        className={cn('form-group-medical', className)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${groupId}-error` : helperText ? `${groupId}-helper` : undefined
        }
        data-testid={testId}
        {...props}
      >
        {label && (
          <legend className="label-medical">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </legend>
        )}

        <div className={orientationClasses[orientation]}>
          {options.map((option) => {
            const radioId = `${name}-${option.value}`;
            const isChecked = value === option.value;

            return (
              <div key={option.value} className="flex items-start gap-3">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    id={radioId}
                    name={name}
                    value={option.value}
                    checked={isChecked}
                    disabled={option.disabled}
                    onChange={() => handleChange(option.value)}
                    className={cn(
                      baseRadioClasses,
                      variantClasses[currentVariant],
                      sizeClasses[size].radio
                    )}
                    aria-describedby={
                      option.description ? `${radioId}-description` : undefined
                    }
                  />
                </div>

                <div className="flex-1">
                  <label
                    htmlFor={radioId}
                    className={cn(
                      'font-medium cursor-pointer',
                      sizeClasses[size].label,
                      option.disabled && 'opacity-50 cursor-not-allowed',
                      error ? 'text-danger-700' : 'text-neutral-900'
                    )}
                  >
                    {option.label}
                  </label>

                  {option.description && (
                    <p
                      id={`${radioId}-description`}
                      className={cn(
                        'text-neutral-600 mt-1',
                        sizeClasses[size].description,
                        option.disabled && 'opacity-50'
                      )}
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <p
            id={`${groupId}-error`}
            className="mt-1 text-sm text-danger-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${groupId}-helper`}
            className="mt-1 text-sm text-neutral-500"
          >
            {helperText}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
