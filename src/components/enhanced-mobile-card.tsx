/**
 * Enhanced Mobile Card Component
 * Optimized for both Android (Material Design) and iOS (Human Interface Guidelines)
 */

import React, { forwardRef, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';

// Types
interface EnhancedMobileCardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  style?: React.CSSProperties;
}

// Enhanced Mobile Card Component
export const EnhancedMobileCard = forwardRef<HTMLDivElement, EnhancedMobileCardProps>(
  (
    {
      children,
      variant = 'elevated',
      padding = 'medium',
      interactive = false,
      disabled = false,
      onClick,
      onSwipeLeft,
      onSwipeRight,
      onLongPress,
      className = '',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      role,
      style,
      ...props
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { deviceInfo, platformStyles, hapticFeedback, useGestures, getPlatformClasses } = useEnhancedMobile();
    const prefersReducedMotion = useReducedMotion();

    // Set up gesture handling
    useGestures(cardRef.current, {
      onSwipeLeft,
      onSwipeRight,
      onLongPress,
    });

    // Handle click with haptic feedback
    const handleClick = () => {
      if (disabled || !onClick) return;
      
      // Provide haptic feedback for interactive cards
      hapticFeedback.light();
      onClick();
    };

    // Get platform-specific styles
    const getVariantStyles = () => {
      const { platform } = deviceInfo;
      const colors = platformStyles.colors;
      const shadows = platformStyles.shadows;
      
      if (platform === 'ios') {
        switch (variant) {
          case 'elevated':
            return {
              background: colors.systemBackground,
              border: 'none',
              boxShadow: shadows.medium,
            };
          case 'outlined':
            return {
              background: colors.systemBackground,
              border: `1px solid ${colors.systemGray4}`,
              boxShadow: 'none',
            };
          case 'filled':
            return {
              background: colors.secondarySystemBackground,
              border: 'none',
              boxShadow: 'none',
            };
          default:
            return {
              background: colors.systemBackground,
              border: 'none',
              boxShadow: shadows.medium,
            };
        }
      } else {
        // Android Material Design
        switch (variant) {
          case 'elevated':
            return {
              background: colors.surface,
              border: 'none',
              boxShadow: shadows.level2,
            };
          case 'outlined':
            return {
              background: colors.surface,
              border: `1px solid ${colors.outline}`,
              boxShadow: 'none',
            };
          case 'filled':
            return {
              background: colors.surfaceVariant,
              border: 'none',
              boxShadow: 'none',
            };
          default:
            return {
              background: colors.surface,
              border: 'none',
              boxShadow: shadows.level2,
            };
        }
      }
    };

    // Get padding styles
    const getPaddingStyles = () => {
      const spacing = platformStyles.spacing;
      
      switch (padding) {
        case 'none':
          return { padding: '0' };
        case 'small':
          return { padding: spacing.sm };
        case 'large':
          return { padding: spacing.xl };
        default:
          return { padding: spacing.md };
      }
    };

    // Combine all styles
    const cardStyles = {
      ...getVariantStyles(),
      ...getPaddingStyles(),
      borderRadius: platformStyles.borderRadius.medium,
      position: 'relative' as const,
      overflow: 'hidden' as const,
      cursor: interactive && !disabled ? 'pointer' : 'default',
      opacity: disabled ? 0.6 : 1,
      transition: `all ${platformStyles.animations.normal} ${platformStyles.animations.easeInOut}`,
      touchAction: 'manipulation' as const,
      userSelect: 'none' as const,
      WebkitTapHighlightColor: 'transparent',
      ...style,
    };

    // Animation variants
    const animationVariants = {
      initial: { scale: 1, y: 0 },
      hover: interactive && !disabled ? { scale: 1.02, y: -2 } : { scale: 1, y: 0 },
      tap: interactive && !disabled ? { scale: 0.98, y: 0 } : { scale: 1, y: 0 },
    };

    // Determine the appropriate HTML element and props
    const elementProps = {
      ref: (node: HTMLDivElement) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
        cardRef.current = node;
      },
      className: getPlatformClasses(`enhanced-mobile-card ${className}`),
      style: cardStyles,
      onClick: interactive ? handleClick : undefined,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-disabled': disabled,
      role: role || (interactive ? 'button' : undefined),
      tabIndex: interactive && !disabled ? 0 : undefined,
      onKeyDown: interactive && !disabled ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined,
      ...props,
    };

    return (
      <motion.div
        {...elementProps}
        variants={prefersReducedMotion ? {} : animationVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        {children}
        
        {/* Ripple effect for Material Design */}
        {deviceInfo.platform === 'android' && interactive && (
          <div
            className="ripple-effect"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
              borderRadius: 'inherit',
            }}
          />
        )}
      </motion.div>
    );
  }
);

EnhancedMobileCard.displayName = 'EnhancedMobileCard';

// Export additional card variants for convenience
export const ElevatedCard = (props: Omit<EnhancedMobileCardProps, 'variant'>) => (
  <EnhancedMobileCard variant="elevated" {...props} />
);

export const OutlinedCard = (props: Omit<EnhancedMobileCardProps, 'variant'>) => (
  <EnhancedMobileCard variant="outlined" {...props} />
);

export const FilledCard = (props: Omit<EnhancedMobileCardProps, 'variant'>) => (
  <EnhancedMobileCard variant="filled" {...props} />
);

export const InteractiveCard = (props: Omit<EnhancedMobileCardProps, 'interactive'>) => (
  <EnhancedMobileCard interactive {...props} />
);

export default EnhancedMobileCard;
