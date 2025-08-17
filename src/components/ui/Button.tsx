/**
 * Medical Button Component
 * Comprehensive button system for hospital mobile application
 */

import React, { forwardRef } from 'react';
import { ButtonProps } from './types';
import { cn } from '@/utils/cn';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      testId,
      ...props
    },
    ref
  ) => {
    // Base button classes
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-medical transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-[0.98] transform',
    ];

    // Variant classes
    const variantClasses = {
      primary: [
        'bg-medical-500 hover:bg-medical-600 active:bg-medical-700',
        'text-white shadow-button-medical',
        'focus:ring-medical-500',
      ],
      secondary: [
        'bg-white border-2 border-medical-500',
        'text-medical-600 hover:bg-medical-50 active:bg-medical-100',
        'focus:ring-medical-500',
      ],
      success: [
        'bg-success-500 hover:bg-success-600 active:bg-success-700',
        'text-white shadow-button-medical',
        'focus:ring-success-500',
      ],
      danger: [
        'bg-danger-500 hover:bg-danger-600 active:bg-danger-700',
        'text-white shadow-emergency',
        'focus:ring-danger-500',
      ],
      ghost: ['bg-transparent text-medical-600', 'hover:bg-medical-50 active:bg-medical-100', 'focus:ring-medical-500'],
    };

    // Size classes
    const sizeClasses = {
      sm: ['min-h-[36px] px-3 py-2 text-sm'],
      md: ['min-h-[44px] px-6 py-3 text-base'],
      lg: ['min-h-[52px] px-8 py-4 text-lg'],
      xl: ['min-h-[60px] px-10 py-5 text-xl'],
    };

    // Width classes
    const widthClasses = fullWidth ? ['w-full'] : [];

    // Loading state classes
    const loadingClasses = loading ? ['cursor-wait'] : [];

    // Combine all classes
    const buttonClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      widthClasses,
      loadingClasses,
      className
    );

    return (
      <button ref={ref} className={buttonClasses} disabled={disabled || loading} data-testid={testId} {...props}>
        {loading ? (
          <>
            <div className="loading-dots-medical">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span className="opacity-70">Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
