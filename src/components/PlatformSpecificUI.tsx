import React, { ReactNode, CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { getColorToken } from '@/styles/unified-color-system';

// Platform-specific button component
interface PlatformButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'emergency' | 'medical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  hapticFeedback?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  'aria-label'?: string;
}

export const PlatformButton: React.FC<PlatformButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  hapticFeedback = true,
  fullWidth = false,
  icon,
  'aria-label': ariaLabel,
}) => {
  const { deviceInfo, platformStyles } = useEnhancedMobile();
  const { getResponsiveSpacing } = useResponsiveLayout();
  const shouldReduceMotion = useReducedMotion();

  const isIOS = deviceInfo.platform === 'ios';
  const isAndroid = deviceInfo.platform === 'android';

  // Platform-specific styling
  const getButtonStyles = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: platformStyles.typography.fontFamily.primary,
      fontWeight: isIOS ? '600' : '500',
      textAlign: 'center',
      textDecoration: 'none',
      userSelect: 'none',
      outline: 'none',
      position: 'relative',
      overflow: 'hidden',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.6 : 1,
      transition: shouldReduceMotion ? 'none' : 'all 0.2s ease',
    };

    // Size configurations
    const sizeConfig = {
      sm: {
        padding: isIOS ? '8px 16px' : '8px 16px',
        fontSize: isIOS ? '14px' : '14sp',
        minHeight: isIOS ? '32px' : '36px',
        borderRadius: isIOS ? '8px' : '6px',
      },
      md: {
        padding: isIOS ? '12px 24px' : '12px 20px',
        fontSize: isIOS ? '16px' : '16sp',
        minHeight: isIOS ? '44px' : '48px',
        borderRadius: isIOS ? '12px' : '8px',
      },
      lg: {
        padding: isIOS ? '16px 32px' : '16px 28px',
        fontSize: isIOS ? '18px' : '18sp',
        minHeight: isIOS ? '52px' : '56px',
        borderRadius: isIOS ? '16px' : '12px',
      },
    };

    // Variant configurations
    const variantConfig = {
      primary: {
        backgroundColor: getColorToken('primary'),
        color: getColorToken('white'),
        boxShadow: isIOS ? '0 2px 8px rgba(37, 99, 235, 0.3)' : '0 2px 4px rgba(37, 99, 235, 0.4)',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: getColorToken('primary'),
        border: `2px solid ${getColorToken('primary')}`,
        boxShadow: 'none',
      },
      emergency: {
        backgroundColor: getColorToken('error'),
        color: getColorToken('white'),
        boxShadow: isIOS ? '0 2px 8px rgba(239, 68, 68, 0.3)' : '0 2px 4px rgba(239, 68, 68, 0.4)',
      },
      medical: {
        backgroundColor: `linear-gradient(135deg, ${getColorToken('primary')} 0%, ${getColorToken('secondary')} 100%)`,
        color: getColorToken('white'),
        boxShadow: isIOS ? '0 4px 12px rgba(37, 99, 235, 0.25)' : '0 3px 6px rgba(37, 99, 235, 0.3)',
      },
    };

    return {
      ...baseStyles,
      ...sizeConfig[size],
      ...variantConfig[variant],
    };
  };

  const handleClick = () => {
    if (disabled) return;

    // Haptic feedback for mobile devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(variant === 'emergency' ? [10, 5, 10] : 10);
    }

    onClick?.();
  };

  const buttonStyles = getButtonStyles();

  return (
    <motion.button
      className={`platform-button platform-${deviceInfo.platform} ${className}`}
      style={buttonStyles}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileTap={shouldReduceMotion ? {} : { scale: disabled ? 1 : 0.98 }}
      whileHover={shouldReduceMotion ? {} : { scale: disabled ? 1 : 1.02 }}
      transition={{ duration: 0.1 }}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>

      {/* Platform-specific ripple effect for Android */}
      {isAndroid && !disabled && (
        <motion.div
          className="ripple-effect"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '0',
            height: '0',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          whileTap={{ width: '200px', height: '200px', opacity: [0, 1, 0] }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

// Platform-specific card component
interface PlatformCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  elevated?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  children,
  className = '',
  style = {},
  elevated = false,
  interactive = false,
  onClick,
  'aria-label': ariaLabel,
}) => {
  const { deviceInfo, platformStyles } = useEnhancedMobile();
  const shouldReduceMotion = useReducedMotion();

  const isIOS = deviceInfo.platform === 'ios';

  const cardStyles: CSSProperties = {
    backgroundColor: getColorToken('white'),
    borderRadius: isIOS ? '16px' : '12px',
    border: `1px solid ${getColorToken('border')}`,
    padding: '16px',
    position: 'relative',
    overflow: 'hidden',
    cursor: interactive ? 'pointer' : 'default',
    transition: shouldReduceMotion ? 'none' : 'all 0.2s ease',

    // Platform-specific shadows
    boxShadow: elevated
      ? isIOS
        ? '0 8px 24px rgba(0, 0, 0, 0.12)'
        : '0 4px 12px rgba(0, 0, 0, 0.15)'
      : isIOS
        ? '0 2px 8px rgba(0, 0, 0, 0.08)'
        : '0 1px 4px rgba(0, 0, 0, 0.1)',

    ...style,
  };

  const Component = interactive ? motion.div : 'div';
  const motionProps =
    interactive && !shouldReduceMotion
      ? {
          whileHover: { scale: 1.02, y: -2 },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.2 },
        }
      : {};

  return (
    <Component
      className={`platform-card platform-${deviceInfo.platform} ${className}`}
      style={cardStyles}
      onClick={onClick}
      aria-label={ariaLabel}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

// Platform-specific modal/sheet component
interface PlatformModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'center' | 'bottom';
  className?: string;
}

export const PlatformModal: React.FC<PlatformModalProps> = ({
  children,
  isOpen,
  onClose,
  title,
  position = 'bottom',
  className = '',
}) => {
  const { deviceInfo } = useEnhancedMobile();
  const shouldReduceMotion = useReducedMotion();

  const isIOS = deviceInfo.platform === 'ios';

  if (!isOpen) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: position === 'bottom' ? { y: '100%', opacity: 0 } : { scale: 0.8, opacity: 0 },
    visible: position === 'bottom' ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 },
  };

  const modalStyles: CSSProperties = {
    backgroundColor: getColorToken('white'),
    borderRadius: position === 'bottom' ? (isIOS ? '20px 20px 0 0' : '16px 16px 0 0') : isIOS ? '20px' : '16px',
    maxHeight: position === 'bottom' ? '80vh' : '90vh',
    width: position === 'bottom' ? '100%' : 'auto',
    maxWidth: position === 'center' ? '400px' : '100%',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <motion.div
      className="platform-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: position === 'bottom' ? 'flex-end' : 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: position === 'center' ? '20px' : '0',
      }}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className={`platform-modal platform-${deviceInfo.platform} ${className}`}
        style={modalStyles}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{
          duration: shouldReduceMotion ? 0.1 : 0.4,
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS-style handle for bottom sheets */}
        {isIOS && position === 'bottom' && (
          <div
            style={{
              width: '36px',
              height: '4px',
              backgroundColor: getColorToken('border'),
              borderRadius: '2px',
              margin: '8px auto',
            }}
          />
        )}

        {/* Modal header */}
        {title && (
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${getColorToken('border')}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: isIOS ? '18px' : '20sp',
                fontWeight: '600',
                color: getColorToken('text-primary'),
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: getColorToken('text-secondary'),
                padding: '4px',
              }}
              aria-label="Đóng"
            >
              ×
            </button>
          </div>
        )}

        {/* Modal content */}
        <div style={{ padding: '20px', overflowY: 'auto' }}>{children}</div>
      </motion.div>
    </motion.div>
  );
};

// Platform-specific loading component
interface PlatformLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const PlatformLoading: React.FC<PlatformLoadingProps> = ({ size = 'md', color, className = '' }) => {
  const { deviceInfo } = useEnhancedMobile();
  const shouldReduceMotion = useReducedMotion();

  const isIOS = deviceInfo.platform === 'ios';
  const loadingColor = color || getColorToken('primary');

  const sizeConfig = {
    sm: { width: '16px', height: '16px' },
    md: { width: '24px', height: '24px' },
    lg: { width: '32px', height: '32px' },
  };

  if (shouldReduceMotion) {
    return (
      <div
        className={`platform-loading static ${className}`}
        style={{
          ...sizeConfig[size],
          backgroundColor: loadingColor,
          borderRadius: '50%',
          opacity: 0.6,
        }}
      />
    );
  }

  // iOS-style spinner
  if (isIOS) {
    return (
      <motion.div
        className={`platform-loading ios-spinner ${className}`}
        style={{
          ...sizeConfig[size],
          border: `2px solid ${loadingColor}20`,
          borderTop: `2px solid ${loadingColor}`,
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    );
  }

  // Android-style loading dots
  return (
    <div
      className={`platform-loading android-dots ${className}`}
      style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          style={{
            width: sizeConfig[size].width,
            height: sizeConfig[size].height,
            backgroundColor: loadingColor,
            borderRadius: '50%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
