import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Base Form Field Props - Enhanced
interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  medicalContext?: 'patient-info' | 'vital-signs' | 'medication' | 'appointment' | 'emergency';
  patientId?: string;
  ariaLabel?: string;
}

// Input Field Props
export interface MedicalInputProps extends InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {}

// Textarea Field Props
export interface MedicalTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFieldProps {}

// Select Field Props
export interface MedicalSelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseFieldProps {
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

const fieldSizes = {
  sm: 'h-input-sm px-4 text-sm min-w-touch',
  md: 'h-input-md px-6 text-base min-w-touch',
  lg: 'h-input-lg px-8 text-lg min-w-touch',
};

const labelSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const fieldVariants = {
  default: 'bg-background border-2 border-border hover:border-primary/50 focus:border-primary',
  filled: 'bg-surface-hover border-2 border-transparent hover:border-primary/30 focus:border-primary',
  outlined: 'bg-transparent border-2 border-primary/30 hover:border-primary/50 focus:border-primary',
};

const medicalContextColors = {
  'patient-info': 'focus:ring-primary/20',
  'vital-signs': 'focus:ring-medical-emergency/20',
  medication: 'focus:ring-warning/20',
  appointment: 'focus:ring-info/20',
  emergency: 'focus:ring-medical-emergency/30 border-medical-emergency/50',
};

// Medical Input Component - Enhanced
export const MedicalInput = ({
  label,
  error,
  required = false,
  helpText,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  priority,
  medicalContext,
  patientId,
  ariaLabel,
  className = '',
  ...props
}: MedicalInputProps) => {
  const hasError = !!error;
  const fieldId = props.id || `medical-input-${Math.random().toString(36).slice(2, 9)}`;

  // Create comprehensive aria-label
  const computedAriaLabel =
    ariaLabel ||
    `${label}${required ? ', required' : ''}${medicalContext ? `, ${medicalContext} field` : ''}${patientId ? ` for patient ${patientId}` : ''}${priority ? `, priority: ${priority}` : ''}`;

  // Get medical context styling
  const contextStyling = medicalContext ? medicalContextColors[medicalContext] : '';
  const priorityStyling = priority === 'critical' ? 'ring-2 ring-medical-emergency/50' : '';

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Label */}
      <label
        htmlFor={fieldId}
        className={`block font-medium text-text-primary ${labelSizes[size]} ${
          required ? "after:content-['*'] after:text-error after:ml-1" : ''
        }`}
      >
        {label}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">{leftIcon}</div>
        )}

        {/* Input Field */}
        <input
          id={fieldId}
          className={`
            w-full rounded-lg transition-all duration-300 font-medium
            placeholder-text-muted medical-focus
            ${fieldVariants[variant]}
            ${fieldSizes[size]}
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
            ${contextStyling}
            ${priorityStyling}
            ${
              hasError
                ? 'border-error shadow-input-error focus:border-error focus:shadow-input-error focus:ring-error/20'
                : 'focus:shadow-input-focus focus:ring-4'
            }
            ${className}
          `}
          aria-invalid={hasError}
          aria-label={computedAriaLabel}
          aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted">{rightIcon}</div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            id={`${fieldId}-error`}
            className="flex items-center gap-2 text-error text-sm font-medium"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      {helpText && !error && (
        <div id={`${fieldId}-help`} className="text-text-muted text-sm">
          {helpText}
        </div>
      )}
    </motion.div>
  );
};

// Medical Textarea Component
export const MedicalTextarea = ({
  label,
  error,
  required = false,
  helpText,
  size = 'md',
  className = '',
  rows = 4,
  ...props
}: MedicalTextareaProps) => {
  const hasError = !!error;
  const fieldId = props.id || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <label
        htmlFor={fieldId}
        className={`block font-medium text-text-primary ${labelSizes[size]} ${
          required ? "after:content-['*'] after:text-error after:ml-1" : ''
        }`}
      >
        {label}
      </label>

      {/* Textarea Field */}
      <textarea
        id={fieldId}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium
          placeholder-text-muted bg-background/50 medical-focus resize-none
          ${
            hasError
              ? 'border-error shadow-error focus:border-error focus:shadow-error'
              : 'border-border hover:border-primary/50 focus:border-primary focus:shadow-input-focus'
          }
          ${className}
        `}
        aria-invalid={hasError}
        aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
        {...props}
      />

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            id={`${fieldId}-error`}
            className="flex items-center gap-2 text-error text-sm font-medium"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      {helpText && !error && (
        <div id={`${fieldId}-help`} className="text-text-muted text-sm">
          {helpText}
        </div>
      )}
    </motion.div>
  );
};

// Medical Select Component
export const MedicalSelect = ({
  label,
  error,
  required = false,
  helpText,
  options,
  placeholder,
  size = 'md',
  className = '',
  ...props
}: MedicalSelectProps) => {
  const hasError = !!error;
  const fieldId = props.id || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <label
        htmlFor={fieldId}
        className={`block font-medium text-text-primary ${labelSizes[size]} ${
          required ? "after:content-['*'] after:text-error after:ml-1" : ''
        }`}
      >
        {label}
      </label>

      {/* Select Container */}
      <div className="relative">
        <select
          id={fieldId}
          className={`
            w-full rounded-lg border-2 transition-all duration-200 font-medium
            bg-background/50 medical-focus appearance-none cursor-pointer
            ${fieldSizes[size]} pr-10
            ${
              hasError
                ? 'border-error shadow-error focus:border-error focus:shadow-error'
                : 'border-border hover:border-primary/50 focus:border-primary focus:shadow-input-focus'
            }
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-text-muted">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            id={`${fieldId}-error`}
            className="flex items-center gap-2 text-error text-sm font-medium"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      {helpText && !error && (
        <div id={`${fieldId}-help`} className="text-text-muted text-sm">
          {helpText}
        </div>
      )}
    </motion.div>
  );
};

// Form Container Component
export const MedicalForm = ({
  children,
  className = '',
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.FormHTMLAttributes<HTMLFormElement>) => {
  return (
    <form className={`space-y-6 ${className}`} {...props}>
      {children}
    </form>
  );
};

// Field Group Component
export const FieldGroup = ({
  title,
  description,
  children,
  className = '',
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-semibold text-text-primary">{title}</h3>}
          {description && <p className="text-text-muted text-sm">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
};
