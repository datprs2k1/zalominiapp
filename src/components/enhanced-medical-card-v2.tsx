/**
 * Enhanced Medical Card Component V2
 * Optimized for healthcare applications with advanced touch interactions
 */

import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { EnhancedTouchManager, EnhancedHapticManager } from '@/utils/enhanced-touch-interactions';

// Types
interface MedicalCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  priority?: 'emergency' | 'urgent' | 'routine' | 'consultation';
  variant?: 'elevated' | 'outlined' | 'filled';
  interactive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  medicalContext?: 'appointment' | 'prescription' | 'test-result' | 'emergency' | 'general';
}

// Enhanced Medical Card Component
export const EnhancedMedicalCardV2 = forwardRef<HTMLDivElement, MedicalCardProps>(
  (
    {
      children,
      title,
      subtitle,
      priority = 'routine',
      variant = 'elevated',
      interactive = false,
      disabled = false,
      loading = false,
      onClick,
      onSwipeLeft,
      onSwipeRight,
      onLongPress,
      onDoubleTap,
      className = '',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      medicalContext = 'general',
      ...props
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const touchManagerRef = useRef<EnhancedTouchManager | null>(null);
    const hapticManagerRef = useRef<EnhancedHapticManager>(new EnhancedHapticManager());
    const { deviceInfo, platformStyles, getPlatformClasses } = useEnhancedMobile();
    const prefersReducedMotion = useReducedMotion();
    const [isPressed, setIsPressed] = useState(false);

    // Set up touch interactions
    useEffect(() => {
      if (!cardRef.current || !interactive) return;

      const touchManager = new EnhancedTouchManager(cardRef.current)
        .setSwipeHandler((gesture) => {
          if (gesture.direction === 'left' && onSwipeLeft) {
            hapticManagerRef.current.light();
            onSwipeLeft();
          } else if (gesture.direction === 'right' && onSwipeRight) {
            hapticManagerRef.current.light();
            onSwipeRight();
          }
        })
        .setLongPressHandler(() => {
          if (onLongPress) {
            hapticManagerRef.current.medium();
            onLongPress();
          }
        })
        .setDoubleTapHandler(() => {
          if (onDoubleTap) {
            hapticManagerRef.current.light();
            onDoubleTap();
          }
        })
        .setTouchStartHandler(() => {
          setIsPressed(true);
        })
        .setTouchEndHandler(() => {
          setIsPressed(false);
        });

      touchManagerRef.current = touchManager;

      return () => {
        touchManager.destroy();
      };
    }, [interactive, onSwipeLeft, onSwipeRight, onLongPress, onDoubleTap]);

    // Handle click with haptic feedback
    const handleClick = () => {
      if (disabled || loading || !onClick) return;
      
      hapticManagerRef.current.light();
      onClick();
    };

    // Get priority-specific styles
    const getPriorityStyles = () => {
      const { platform } = deviceInfo;
      const colors = platformStyles.colors;
      
      const priorityColors = {
        emergency: platform === 'ios' ? colors.systemRed : '#D32F2F',
        urgent: platform === 'ios' ? colors.systemOrange : '#F57C00',
        routine: platform === 'ios' ? colors.systemGreen : '#388E3C',
        consultation: platform === 'ios' ? colors.systemBlue : colors.primary,
      };

      return {
        borderLeftColor: priorityColors[priority],
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
      };
    };

    // Get medical context styles
    const getMedicalContextStyles = () => {
      const contextStyles = {
        appointment: { backgroundColor: '#E3F2FD' },
        prescription: { backgroundColor: '#F3E5F5' },
        'test-result': { backgroundColor: '#E8F5E8' },
        emergency: { backgroundColor: '#FFEBEE' },
        general: { backgroundColor: 'transparent' },
      };

      return contextStyles[medicalContext] || contextStyles.general;
    };

    // Get variant styles
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

    // Combine all styles
    const cardStyles = {
      ...getVariantStyles(),
      ...getPriorityStyles(),
      ...getMedicalContextStyles(),
      borderRadius: platformStyles.borderRadius.medium,
      padding: platformStyles.spacing.md,
      position: 'relative' as const,
      overflow: 'hidden' as const,
      cursor: interactive && !disabled ? 'pointer' : 'default',
      opacity: disabled ? 0.6 : 1,
      transform: isPressed ? 'scale(0.98)' : 'scale(1)',
      transition: `all ${platformStyles.animations.normal} ${platformStyles.animations.easeInOut}`,
      touchAction: 'manipulation' as const,
      userSelect: 'none' as const,
      WebkitTapHighlightColor: 'transparent',
      minHeight: interactive ? platformStyles.touchTarget.recommended : 'auto',
    };

    // Animation variants
    const animationVariants = {
      initial: { scale: 1, y: 0 },
      hover: interactive && !disabled ? { scale: 1.02, y: -2 } : { scale: 1, y: 0 },
      tap: interactive && !disabled ? { scale: 0.98, y: 0 } : { scale: 1, y: 0 },
    };

    // Loading spinner
    const LoadingSpinner = () => (
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    );

    return (
      <motion.div
        ref={(node) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              ref.current = node;
            }
          }
          cardRef.current = node;
        }}
        className={getPlatformClasses(`enhanced-medical-card medical-card-${priority} ${className}`)}
        style={cardStyles}
        onClick={interactive ? handleClick : undefined}
        aria-label={ariaLabel || `Medical card: ${title || 'Healthcare information'}`}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled}
        role={interactive ? 'button' : 'article'}
        tabIndex={interactive && !disabled ? 0 : undefined}
        onKeyDown={interactive && !disabled ? (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        } : undefined}
        variants={prefersReducedMotion ? {} : animationVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {/* Priority indicator */}
        <div
          className="absolute top-0 right-0 w-3 h-3 rounded-bl-lg"
          style={{
            backgroundColor: getPriorityStyles().borderLeftColor,
            opacity: 0.8,
          }}
        />

        {/* Header section */}
        {(title || subtitle) && (
          <div className="mb-3">
            {title && (
              <h3
                className="text-lg font-semibold text-gray-900 mb-1"
                style={{
                  fontFamily: platformStyles.typography.fontFamily.primary,
                  color: deviceInfo.platform === 'ios' 
                    ? platformStyles.colors.label 
                    : platformStyles.colors.onSurface,
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                className="text-sm text-gray-600"
                style={{
                  fontFamily: platformStyles.typography.fontFamily.secondary,
                  color: deviceInfo.platform === 'ios' 
                    ? platformStyles.colors.secondaryLabel 
                    : platformStyles.colors.onSurfaceVariant,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="medical-card-content">
          {children}
        </div>

        {/* Loading overlay */}
        {loading && <LoadingSpinner />}

        {/* Interaction hints for screen readers */}
        {interactive && (
          <div className="sr-only">
            {onSwipeLeft && 'Swipe left for additional options. '}
            {onSwipeRight && 'Swipe right for quick actions. '}
            {onLongPress && 'Long press for context menu. '}
            {onDoubleTap && 'Double tap for quick action. '}
          </div>
        )}
      </motion.div>
    );
  }
);

EnhancedMedicalCardV2.displayName = 'EnhancedMedicalCardV2';

export default EnhancedMedicalCardV2;
