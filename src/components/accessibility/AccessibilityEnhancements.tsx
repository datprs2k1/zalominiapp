import React, { useEffect, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Skip to Content Link
export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Bỏ qua đến nội dung chính
    </a>
  );
};

// Focus Trap Component
interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  restoreFocus?: boolean;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  isActive,
  restoreFocus = true,
  className = ''
}) => {
  const [previousActiveElement, setPreviousActiveElement] = useState<Element | null>(null);

  useEffect(() => {
    if (isActive) {
      setPreviousActiveElement(document.activeElement);
    } else if (restoreFocus && previousActiveElement) {
      (previousActiveElement as HTMLElement).focus?.();
    }
  }, [isActive, restoreFocus, previousActiveElement]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isActive || event.key !== 'Tab') return;

    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1');

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [isActive]);

  return (
    <div className={className} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
};

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Đang tải...',
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      whileHover={prefersReducedMotion ? {} : { scale: isDisabled ? 1 : 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: isDisabled ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && <span className="mr-2" aria-hidden="true">{leftIcon}</span>}
      <span>{loading ? loadingText : children}</span>
      {!loading && rightIcon && <span className="ml-2" aria-hidden="true">{rightIcon}</span>}
    </motion.button>
  );
};

// Screen Reader Only Text
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ children }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
};

// Live Region for Dynamic Content Announcements
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = false,
  relevant = 'additions text'
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className="sr-only"
    >
      {children}
    </div>
  );
};

// Accessible Form Field
interface AccessibleFormFieldProps {
  label: string;
  id: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  label,
  id,
  error,
  helpText,
  required = false,
  children,
  className = ''
}) => {
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ');

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="bắt buộc">
            *
          </span>
        )}
      </label>
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required
      })}
      
      {helpText && (
        <p id={helpId} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Keyboard Navigation Helper
export const useKeyboardNavigation = (
  items: HTMLElement[],
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
    onSelect?: (index: number) => void;
  } = {}
) => {
  const { loop = true, orientation = 'vertical', onSelect } = options;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    let newIndex = currentIndex;

    switch (key) {
      case 'ArrowDown':
        if (orientation === 'vertical') {
          event.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= items.length) {
            newIndex = loop ? 0 : items.length - 1;
          }
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical') {
          event.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? items.length - 1 : 0;
          }
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          event.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= items.length) {
            newIndex = loop ? 0 : items.length - 1;
          }
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          event.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = loop ? items.length - 1 : 0;
          }
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect?.(currentIndex);
        return;
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      items[newIndex]?.focus();
    }
  }, [currentIndex, items, loop, orientation, onSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { currentIndex, setCurrentIndex };
};

// High Contrast Mode Toggle
export const HighContrastToggle: React.FC = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('high-contrast');
    if (stored === 'true') {
      setIsHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('high-contrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('high-contrast', 'false');
    }
  };

  return (
    <button
      onClick={toggleHighContrast}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      aria-pressed={isHighContrast}
      aria-label={`${isHighContrast ? 'Tắt' : 'Bật'} chế độ tương phản cao`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <span>{isHighContrast ? 'Tắt' : 'Bật'} tương phản cao</span>
    </button>
  );
};

// Font Size Control
export const FontSizeControl: React.FC = () => {
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    const stored = localStorage.getItem('font-size') || 'medium';
    setFontSize(stored);
    applyFontSize(stored);
  }, []);

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
    }
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
    applyFontSize(size);
    localStorage.setItem('font-size', size);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Cỡ chữ:</span>
      <div className="flex gap-1" role="radiogroup" aria-label="Chọn cỡ chữ">
        {[
          { value: 'small', label: 'Nhỏ' },
          { value: 'medium', label: 'Vừa' },
          { value: 'large', label: 'Lớn' }
        ].map(option => (
          <button
            key={option.value}
            onClick={() => changeFontSize(option.value)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fontSize === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            role="radio"
            aria-checked={fontSize === option.value}
            aria-label={`Cỡ chữ ${option.label}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Reduced Motion Toggle
export const ReducedMotionToggle: React.FC = () => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('reduced-motion');
    const systemPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldReduce = stored === 'true' || (stored === null && systemPreference);
    
    setIsReducedMotion(shouldReduce);
    applyReducedMotion(shouldReduce);
  }, []);

  const applyReducedMotion = (reduce: boolean) => {
    const root = document.documentElement;
    if (reduce) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
  };

  const toggleReducedMotion = () => {
    const newValue = !isReducedMotion;
    setIsReducedMotion(newValue);
    applyReducedMotion(newValue);
    localStorage.setItem('reduced-motion', newValue.toString());
  };

  return (
    <button
      onClick={toggleReducedMotion}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      aria-pressed={isReducedMotion}
      aria-label={`${isReducedMotion ? 'Bật' : 'Tắt'} hiệu ứng chuyển động`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>{isReducedMotion ? 'Bật' : 'Tắt'} hiệu ứng</span>
    </button>
  );
};

export default {
  SkipToContent,
  FocusTrap,
  AccessibleButton,
  ScreenReaderOnly,
  LiveRegion,
  AccessibleFormField,
  useKeyboardNavigation,
  HighContrastToggle,
  FontSizeControl,
  ReducedMotionToggle
};
