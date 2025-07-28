import { ButtonHTMLAttributes, FC, MouseEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { getColorToken, COLOR_TOKENS } from '@/styles/unified-color-system';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  children: ReactNode;
  loading?: boolean;
  onDisabledClick?: () => void;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'emergency'
    | 'success'
    | 'warning'
    | 'info'
    | 'consultation';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  ariaLabel?: string;
  loadingText?: string;
}

const buttonVariants = {
  primary:
    'bg-gradient-to-r from-primary to-primary-light text-text-inverse shadow-button hover:shadow-button-hover border-transparent hover:from-primary-dark hover:to-primary',
  secondary:
    'bg-gradient-to-r from-secondary to-secondary-light text-text-inverse shadow-button hover:shadow-button-hover border-transparent hover:from-secondary-dark hover:to-secondary',
  outline:
    'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-text-inverse shadow-sm hover:shadow-button transition-all duration-300',
  ghost:
    'bg-transparent text-primary hover:bg-primary-50 border-transparent shadow-none hover:shadow-sm transition-all duration-300',
  emergency:
    'bg-gradient-to-r from-medical-emergency to-error-dark text-text-inverse shadow-emergency hover:shadow-emergency-hover border-transparent',
  success:
    'bg-gradient-to-r from-success to-success-dark text-text-inverse shadow-success hover:shadow-success-hover border-transparent',
  warning:
    'bg-gradient-to-r from-warning to-warning-dark text-text-inverse shadow-warning hover:shadow-warning-hover border-transparent',
  info: 'bg-gradient-to-r from-info to-info-dark text-text-inverse shadow-info hover:shadow-info-hover border-transparent',
  consultation:
    'bg-gradient-to-r from-medical-consultation to-primary text-text-inverse shadow-consultation border-transparent',
};

const buttonSizes = {
  sm: 'h-11 px-4 text-sm font-medium min-w-[44px]', // 44px minimum height
  md: 'h-12 px-6 text-base font-medium min-w-[48px]', // 48px comfortable height
  lg: 'h-14 px-8 text-lg font-semibold min-w-[56px]', // 56px large height
  xl: 'h-16 px-10 text-xl font-semibold min-w-[64px]', // 64px extra large height
};

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  return (
    <motion.div
      className={`border-2 border-current border-t-transparent rounded-full ${spinnerSizes[size]}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

export const Button: FC<ButtonProps> = ({
  children,
  className = '',
  loading = false,
  disabled = false,
  onDisabledClick,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  priority,
  ariaLabel,
  loadingText = 'Đang xử lý...',
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

  const isDisabled = disabled || loading;
  const buttonId = props.id || `button-${Math.random().toString(36).substr(2, 9)}`;

  // Create comprehensive aria-label
  const computedAriaLabel =
    ariaLabel ||
    `${variant === 'emergency' ? 'Emergency ' : ''}${typeof children === 'string' ? children : 'Button'}${priority ? `, priority: ${priority}` : ''}${loading ? `, ${loadingText}` : ''}`;

  // Determine if button should have special styling based on priority
  const priorityClasses = priority === 'critical' ? 'ring-2 ring-red-500/50 animate-pulse' : '';

  // Medical color styles for different variants using unified color system
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          background: `linear-gradient(to right, ${getColorToken('primary')}, ${getColorToken('primary-dark')})`,
        };
      case 'secondary':
        return {
          background: `linear-gradient(to right, ${getColorToken('secondary')}, ${getColorToken('secondary-hover')})`,
        };
      case 'emergency':
        return { background: `linear-gradient(to right, ${getColorToken('error')}, ${getColorToken('error-hover')})` };
      case 'success':
        return {
          background: `linear-gradient(to right, ${getColorToken('success')}, ${getColorToken('success-hover')})`,
        };
      case 'warning':
        return {
          background: `linear-gradient(to right, ${getColorToken('warning')}, ${getColorToken('warning-hover')})`,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: getColorToken('primary'),
          color: getColorToken('primary'),
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: getColorToken('primary'),
        };
      default:
        return {
          background: `linear-gradient(to right, ${getColorToken('primary')}, ${getColorToken('primary-dark')})`,
        };
    }
  };

  return (
    <motion.button
      id={buttonId}
      className={`
        relative overflow-hidden rounded-lg border transition-all duration-300
        flex items-center justify-center gap-2 font-medium
        medical-focus
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'}
        ${priorityClasses}
        ${className}
      `}
      style={!isDisabled ? getVariantStyle() : undefined}
      onClick={handleClick}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-disabled={isDisabled}
      aria-label={props['aria-label'] || computedAriaLabel}
      aria-busy={loading}
      type={props.type || 'button'}
      name={props.name}
      value={props.value}
      form={props.form}
      formAction={props.formAction}
      formEncType={props.formEncType}
      formMethod={props.formMethod}
      formNoValidate={props.formNoValidate}
      formTarget={props.formTarget}
      autoFocus={props.autoFocus}
      tabIndex={props.tabIndex}
      title={props.title}
      role={props.role}
      aria-describedby={props['aria-describedby']}
      aria-expanded={props['aria-expanded']}
      aria-pressed={props['aria-pressed']}
    >
      {/* Background overlay for disabled state */}
      {isDisabled && <div className="absolute inset-0 bg-surface/20 backdrop-blur-[1px] pointer-events-none" />}

      {/* Button content */}
      <div className="relative flex items-center justify-center gap-2">
        {/* Left icon or loading spinner */}
        {loading ? (
          <LoadingSpinner size={size} />
        ) : leftIcon ? (
          <span className="flex items-center justify-center">{leftIcon}</span>
        ) : null}

        {/* Button text */}
        <motion.span
          className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          initial={false}
          animate={{ opacity: loading ? 0 : 1 }}
        >
          {children}
        </motion.span>

        {/* Right icon */}
        {!loading && rightIcon && <span className="flex items-center justify-center">{rightIcon}</span>}
      </div>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-lg opacity-0"
        whileTap={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

// Specialized medical button variants
export const EmergencyButton: FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="emergency" {...props} />;

export const SuccessButton: FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="success" {...props} />;

export const OutlineButton: FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="outline" {...props} />;

export const GhostButton: FC<Omit<ButtonProps, 'variant'>> = (props) => <Button variant="ghost" {...props} />;
