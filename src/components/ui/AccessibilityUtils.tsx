/**
 * Accessibility Utilities
 * WCAG 2.1 AA compliance utilities for hospital application
 */

import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

// Skip Link Component
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children, className }) => (
  <a
    href={href}
    className={cn(
      'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50',
      'bg-medical-600 text-white px-4 py-2 rounded-medical font-medium',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500',
      className
    )}
  >
    {children}
  </a>
);

// Screen Reader Only Text
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ children, className }) => (
  <span className={cn('sr-only', className)}>
    {children}
  </span>
);

// Focus Trap Component
interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, active = true, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    firstFocusableRef.current = focusableElements[0] as HTMLElement;
    lastFocusableRef.current = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current?.focus();
        }
      } else {
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstFocusableRef.current?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// Announcement Component for Screen Readers
interface AnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

export const Announcement: React.FC<AnnouncementProps> = ({ 
  message, 
  priority = 'polite', 
  className 
}) => (
  <div
    aria-live={priority}
    aria-atomic="true"
    className={cn('sr-only', className)}
  >
    {message}
  </div>
);

// High Contrast Mode Detection Hook
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
};

// Reduced Motion Detection Hook
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Keyboard Navigation Hook
export const useKeyboardNavigation = (onEscape?: () => void, onEnter?: () => void) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Enter':
          onEnter?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter]);
};

// ARIA Describedby Hook
export const useAriaDescribedBy = (description: string) => {
  const id = React.useId();
  const descriptionId = `${id}-description`;

  const DescriptionComponent = React.useMemo(
    () => (
      <div id={descriptionId} className="sr-only">
        {description}
      </div>
    ),
    [descriptionId, description]
  );

  return {
    'aria-describedby': descriptionId,
    DescriptionComponent,
  };
};

// Color Contrast Checker Utility
export const checkColorContrast = (foreground: string, background: string): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 0;

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Đang tải...',
  disabled,
  className,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        'btn-medical-primary',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="sr-only">{loadingText}</span>
          <span aria-hidden="true">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Accessible Form Field Component
interface AccessibleFormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  label,
  children,
  error,
  helperText,
  required = false,
  className,
}) => {
  const id = React.useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className={cn('form-group-medical', className)}>
      <label htmlFor={id} className="label-medical">
        {label}
        {required && (
          <>
            <span className="text-danger-500 ml-1" aria-hidden="true">*</span>
            <ScreenReaderOnly>(bắt buộc)</ScreenReaderOnly>
          </>
        )}
      </label>
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': [
          error ? errorId : null,
          helperText ? helperId : null,
        ].filter(Boolean).join(' ') || undefined,
      })}
      
      {error && (
        <div id={errorId} className="mt-1 text-sm text-danger-600" role="alert">
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div id={helperId} className="mt-1 text-sm text-neutral-500">
          {helperText}
        </div>
      )}
    </div>
  );
};
