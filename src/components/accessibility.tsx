import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Skip to Content Link for Screen Readers
export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-white px-4 py-2 rounded-md font-medium medical-focus"
    >
      Chuyển đến nội dung chính
    </a>
  );
};

// Screen Reader Only Text
export const ScreenReaderOnly = ({ children }: { children: ReactNode }) => {
  return <span className="sr-only">{children}</span>;
};

// Accessible Button with Enhanced Focus
export const AccessibleButton = ({
  children,
  onClick,
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
  variant = 'primary',
  className = '',
  ...props
}: {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'emergency';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-secondary hover:bg-secondary-light text-white',
    emergency: 'bg-medical-emergency hover:bg-red-700 text-white',
  };

  return (
    <motion.button
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-200
        medical-focus focus:ring-4 focus:ring-primary/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// High Contrast Mode Toggle
export const HighContrastToggle = () => {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const savedPreference = localStorage.getItem('high-contrast');
    if (savedPreference === 'true') {
      setHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);

    if (newValue) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('high-contrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('high-contrast', 'false');
    }
  };

  return (
    <AccessibleButton
      onClick={toggleHighContrast}
      ariaLabel={highContrast ? 'Tắt chế độ tương phản cao' : 'Bật chế độ tương phản cao'}
      variant="secondary"
      className="fixed top-4 right-4 z-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14v12c3.31 0 6-2.69 6-6s-2.69-6-6-6z" />
      </svg>
      <ScreenReaderOnly>{highContrast ? 'Tắt chế độ tương phản cao' : 'Bật chế độ tương phản cao'}</ScreenReaderOnly>
    </AccessibleButton>
  );
};

// Font Size Control
export const FontSizeControl = () => {
  const [fontSize, setFontSize] = useState('normal');

  useEffect(() => {
    const savedSize = localStorage.getItem('font-size') || 'normal';
    setFontSize(savedSize);
    document.documentElement.setAttribute('data-font-size', savedSize);
  }, []);

  const changeFontSize = (size: 'small' | 'normal' | 'large') => {
    setFontSize(size);
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('font-size', size);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-border">
      <span className="text-sm font-medium text-text-primary">Cỡ chữ:</span>
      <div className="flex gap-1">
        {[
          { size: 'small', label: 'Nhỏ', value: 'A' },
          { size: 'normal', label: 'Vừa', value: 'A' },
          { size: 'large', label: 'Lớn', value: 'A' },
        ].map(({ size, label, value }) => (
          <button
            key={size}
            onClick={() => changeFontSize(size as 'small' | 'normal' | 'large')}
            className={`
              px-2 py-1 rounded text-xs font-bold transition-colors medical-focus
              ${fontSize === size ? 'bg-primary text-white' : 'bg-border hover:bg-border-light text-text-secondary'}
              ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'}
            `}
            aria-label={`Đặt cỡ chữ ${label}`}
            aria-pressed={fontSize === size}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

// Keyboard Navigation Helper
export const useKeyboardNavigation = (items: HTMLElement[], loop = true) => {
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (items.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setCurrentIndex((prev) => {
            const next = prev + 1;
            return loop ? next % items.length : Math.min(next, items.length - 1);
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setCurrentIndex((prev) => {
            const next = prev - 1;
            return loop ? (next < 0 ? items.length - 1 : next) : Math.max(next, 0);
          });
          break;
        case 'Home':
          event.preventDefault();
          setCurrentIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentIndex(items.length - 1);
          break;
        case 'Enter':
        case ' ':
          if (currentIndex >= 0 && items[currentIndex]) {
            event.preventDefault();
            items[currentIndex].click();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, loop, currentIndex]);

  useEffect(() => {
    if (currentIndex >= 0 && items[currentIndex]) {
      items[currentIndex].focus();
    }
  }, [currentIndex, items]);

  return { currentIndex, setCurrentIndex };
};

// Focus Trap for Modals
export const FocusTrap = ({ children, active = true }: { children: ReactNode; active?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  );
};

// Accessible Modal
export const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('aria-hidden', 'true');
    } else {
      document.body.style.overflow = '';
      document.body.removeAttribute('aria-hidden');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.removeAttribute('aria-hidden');
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <FocusTrap active={isOpen}>
        <motion.div
          ref={modalRef}
          className={`
            relative bg-surface rounded-xl shadow-modal border border-border
            max-w-md w-full max-h-[90vh] overflow-y-auto
            ${className}
          `}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
            <AccessibleButton
              onClick={onClose}
              ariaLabel="Đóng hộp thoại"
              variant="secondary"
              className="p-2 bg-transparent hover:bg-border text-text-muted"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </AccessibleButton>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </motion.div>
      </FocusTrap>
    </div>
  );
};
