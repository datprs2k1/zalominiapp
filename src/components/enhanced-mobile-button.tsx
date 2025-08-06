/**
 * Enhanced Mobile Button Component
 * Optimized for both Android (Material Design) and iOS (Human Interface Guidelines)
 */

import React, { forwardRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';

// Types
interface EnhancedMobileButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  hapticFeedback?: 'light' | 'medium' | 'heavy';
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  type?: 'button' | 'submit' | 'reset';
}

// Enhanced Mobile Button Component
export const EnhancedMobileButton = forwardRef<HTMLButtonElement, EnhancedMobileButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      hapticFeedback = 'light',
      onClick,
      className = '',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const { deviceInfo, platformStyles, hapticFeedback: haptic, getPlatformClasses } = useEnhancedMobile();
    const prefersReducedMotion = useReducedMotion();

    // Handle click with haptic feedback
    const handleClick = useCallback(() => {
      if (disabled || loading) return;
      
      // Trigger haptic feedback
      haptic[hapticFeedback]();
      
      // Call the onClick handler
      onClick?.();
    }, [disabled, loading, haptic, hapticFeedback, onClick]);

    // Get platform-specific styles
    const getVariantStyles = () => {
      const { platform } = deviceInfo;
      const colors = platformStyles.colors;
      
      if (platform === 'ios') {
        switch (variant) {
          case 'primary':
            return {
              background: colors.systemBlue,
              color: 'white',
              border: 'none',
            };
          case 'secondary':
            return {
              background: colors.systemGray6,
              color: colors.systemBlue,
              border: `1px solid ${colors.systemGray4}`,
            };
          case 'tertiary':
            return {
              background: 'transparent',
              color: colors.systemBlue,
              border: 'none',
            };
          case 'danger':
            return {
              background: colors.systemRed,
              color: 'white',
              border: 'none',
            };
          case 'success':
            return {
              background: colors.systemGreen,
              color: 'white',
              border: 'none',
            };
          default:
            return {
              background: colors.systemBlue,
              color: 'white',
              border: 'none',
            };
        }
      } else {
        // Android Material Design
        switch (variant) {
          case 'primary':
            return {
              background: colors.primary,
              color: colors.onPrimary,
              border: 'none',
            };
          case 'secondary':
            return {
              background: colors.secondaryContainer,
              color: colors.onSecondaryContainer,
              border: `1px solid ${colors.outline}`,
            };
          case 'tertiary':
            return {
              background: 'transparent',
              color: colors.primary,
              border: 'none',
            };
          case 'danger':
            return {
              background: colors.error,
              color: colors.onError,
              border: 'none',
            };
          case 'success':
            return {
              background: '#4CAF50', // Material Green
              color: 'white',
              border: 'none',
            };
          default:
            return {
              background: colors.primary,
              color: colors.onPrimary,
              border: 'none',
            };
        }
      }
    };

    // Get size-specific styles
    const getSizeStyles = () => {
      const touchTarget = platformStyles.touchTarget;
      
      switch (size) {
        case 'small':
          return {
            minHeight: touchTarget.minimum,
            padding: '8px 16px',
            fontSize: '14px',
          };
        case 'large':
          return {
            minHeight: touchTarget.large,
            padding: '16px 32px',
            fontSize: '18px',
          };
        default:
          return {
            minHeight: touchTarget.recommended,
            padding: '12px 24px',
            fontSize: '16px',
          };
      }
    };

    // Combine all styles
    const buttonStyles = {
      ...getVariantStyles(),
      ...getSizeStyles(),
      borderRadius: platformStyles.borderRadius.medium,
      fontFamily: platformStyles.typography.fontFamily.primary,
      fontWeight: platformStyles.typography.fontWeight.medium,
      width: fullWidth ? '100%' : 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: `all ${platformStyles.animations.normal} ${platformStyles.animations.easeInOut}`,
      touchAction: 'manipulation',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
    };

    // Animation variants
    const animationVariants = {
      initial: { scale: 1 },
      hover: { scale: disabled ? 1 : 1.02 },
      tap: { scale: disabled ? 1 : 0.98 },
    };

    // Loading spinner component
    const LoadingSpinner = () => (
      <motion.div
        className="loading-spinner"
        style={{
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    );

    return (
      <motion.button
        ref={ref}
        type={type}
        className={getPlatformClasses(`enhanced-mobile-button ${className}`)}
        style={buttonStyles}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || loading}
        variants={prefersReducedMotion ? {} : animationVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && icon && iconPosition === 'left' && (
          <span className="button-icon" style={{ display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
        <span className="button-text" style={{ lineHeight: 1.2 }}>
          {children}
        </span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="button-icon" style={{ display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
      </motion.button>
    );
  }
);

EnhancedMobileButton.displayName = 'EnhancedMobileButton';

// Export additional button variants for convenience
export const PrimaryButton = (props: Omit<EnhancedMobileButtonProps, 'variant'>) => (
  <EnhancedMobileButton variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<EnhancedMobileButtonProps, 'variant'>) => (
  <EnhancedMobileButton variant="secondary" {...props} />
);

export const DangerButton = (props: Omit<EnhancedMobileButtonProps, 'variant'>) => (
  <EnhancedMobileButton variant="danger" {...props} />
);

export const SuccessButton = (props: Omit<EnhancedMobileButtonProps, 'variant'>) => (
  <EnhancedMobileButton variant="success" {...props} />
);

export default EnhancedMobileButton;
