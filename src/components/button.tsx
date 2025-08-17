import { startViewTransition } from '@/utils/miscellaneous';
import React, { ButtonHTMLAttributes, FC, MouseEvent, ReactNode, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

// Legacy interface for backward compatibility
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  onDisabledClick?: () => void;
  // New medical design system props
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'legacy';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  loading,
  disabled,
  onDisabledClick,
  onClick,
  variant = 'legacy', // Default to legacy for backward compatibility
  size = 'md',
  fullWidth = true, // Legacy default
  leftIcon,
  rightIcon,
  ...props
}) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled && onDisabledClick) {
      onDisabledClick();
      e.preventDefault();
      return;
    }
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Legacy styling (maintain existing appearance)
  if (variant === 'legacy') {
    return (
      <button
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-primary to-primary-gradient',
          'shadow shadow-highlight flex w-full h-12 p-3 justify-center items-center',
          'text-white text-lg rounded-full active:scale-95 transition-transform duration-200',
          className
        )}
        onClick={handleClick}
        disabled={disabled || loading}
        {...props}
      >
        {(loading || disabled) && <div className="bg-[#E1E1E1CC] absolute inset-0 pointer-events-none" />}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className={loading ? 'opacity-0' : ''}>{children}</div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </button>
    );
  }

  // New medical design system styling
  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'font-medium rounded-medical transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-[0.98] transform',
  ];

  const variantClasses = {
    primary: [
      'bg-medical-500 hover:bg-medical-600 active:bg-medical-700',
      'text-white shadow-button-medical focus:ring-medical-500',
    ],
    secondary: [
      'bg-white border-2 border-medical-500 text-medical-600',
      'hover:bg-medical-50 active:bg-medical-100 focus:ring-medical-500',
    ],
    success: [
      'bg-success-500 hover:bg-success-600 active:bg-success-700',
      'text-white shadow-button-medical focus:ring-success-500',
    ],
    danger: [
      'bg-danger-500 hover:bg-danger-600 active:bg-danger-700',
      'text-white shadow-emergency focus:ring-danger-500',
    ],
    ghost: ['bg-transparent text-medical-600 hover:bg-medical-50', 'active:bg-medical-100 focus:ring-medical-500'],
  };

  const sizeClasses = {
    sm: ['min-h-[36px] px-3 py-2 text-sm'],
    md: ['min-h-[44px] px-6 py-3 text-base'],
    lg: ['min-h-[52px] px-8 py-4 text-lg'],
    xl: ['min-h-[60px] px-10 py-5 text-xl'],
  };

  const widthClasses = fullWidth ? ['w-full'] : [];

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses],
    sizeClasses[size],
    widthClasses,
    className
  );

  return (
    <button className={buttonClasses} onClick={handleClick} disabled={disabled || loading} {...props}>
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
};
