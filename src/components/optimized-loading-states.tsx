/**
 * Optimized Loading States with Framer Motion
 * 
 * High-performance, accessible loading components with reduced motion support
 * and smooth transitions optimized for medical applications.
 * 
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 */

import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SPACING, combineClasses } from '@/styles/medical-design-system';

// Loading state interfaces
interface OptimizedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'medical' | 'pulse' | 'dots' | 'heartbeat' | 'minimal';
  message?: string;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  ariaLabel?: string;
  showProgress?: boolean;
  progress?: number;
}

interface OptimizedSkeletonProps {
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'image' | 'list' | 'article';
  lines?: number;
  className?: string;
  animated?: boolean;
  width?: string | number;
  height?: string | number;
  ariaLabel?: string;
}

interface ProgressiveLoadingProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  renderSkeleton: () => React.ReactNode;
  isLoading: boolean;
  staggerDelay?: number;
  className?: string;
  ariaLabel?: string;
}

// Optimized animation variants with reduced motion support
const createAnimationVariants = (shouldReduceMotion: boolean) => ({
  spinner: {
    animate: shouldReduceMotion 
      ? { opacity: [0.5, 1, 0.5] }
      : { rotate: 360 },
    transition: shouldReduceMotion
      ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      : { duration: 1, repeat: Infinity, ease: 'linear' },
  },
  pulse: {
    animate: { scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  dots: {
    animate: shouldReduceMotion
      ? { opacity: [0.3, 1, 0.3] }
      : { y: [0, -10, 0] },
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
  },
  skeleton: {
    animate: shouldReduceMotion
      ? { opacity: [0.6, 0.8, 0.6] }
      : { backgroundPosition: ['200% 0', '-200% 0'] },
    transition: shouldReduceMotion
      ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      : { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
});

/**
 * Optimized Loading Spinner with accessibility and performance features
 */
export const OptimizedLoadingSpinner = memo<OptimizedLoadingSpinnerProps>(({
  size = 'md',
  variant = 'medical',
  message = 'Đang tải...',
  className = '',
  color = 'primary',
  ariaLabel,
  showProgress = false,
  progress = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const animations = useMemo(() => createAnimationVariants(shouldReduceMotion), [shouldReduceMotion]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'border-blue-600 text-blue-600',
    secondary: 'border-green-600 text-green-600',
    success: 'border-emerald-600 text-emerald-600',
    warning: 'border-amber-600 text-amber-600',
    error: 'border-red-600 text-red-600',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full bg-current ${colorClasses[color]}`}
                {...animations.dots}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} rounded-full bg-current ${colorClasses[color]}`}
            {...animations.pulse}
          />
        );

      case 'minimal':
        return (
          <div className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full border-t-current ${colorClasses[color]}`}>
            {!shouldReduceMotion && (
              <motion.div
                className="w-full h-full"
                {...animations.spinner}
              />
            )}
          </div>
        );

      default: // medical
        return (
          <div className="relative">
            <motion.div
              className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full border-t-current ${colorClasses[color]}`}
              {...animations.spinner}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-current rounded-full opacity-60"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={combineClasses('flex flex-col items-center justify-center', SPACING.padding.section, className)}
      role="status"
      aria-label={ariaLabel || message}
      aria-live="polite"
    >
      {renderSpinner()}
      
      {message && (
        <motion.p
          className="mt-3 text-sm text-gray-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}

      {showProgress && (
        <motion.div
          className="mt-2 w-32 h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className={`h-full bg-current ${colorClasses[color]}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </div>
  );
});

OptimizedLoadingSpinner.displayName = 'OptimizedLoadingSpinner';

/**
 * Optimized Skeleton with performance and accessibility features
 */
export const OptimizedSkeleton = memo<OptimizedSkeletonProps>(({
  variant = 'text',
  lines = 1,
  className = '',
  animated = true,
  width,
  height,
  ariaLabel = 'Đang tải nội dung...',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const animations = useMemo(() => createAnimationVariants(shouldReduceMotion), [shouldReduceMotion]);

  const baseClasses = 'bg-gray-200 rounded';
  const animationClasses = animated && !shouldReduceMotion 
    ? 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'
    : '';

  const getVariantClasses = () => {
    switch (variant) {
      case 'avatar':
        return 'w-12 h-12 rounded-full';
      case 'button':
        return 'h-10 w-24 rounded-lg';
      case 'image':
        return 'w-full h-48 rounded-lg';
      case 'card':
        return 'w-full h-32 rounded-xl';
      case 'article':
        return 'w-full h-64 rounded-xl';
      case 'list':
        return 'w-full h-16 rounded-lg';
      default: // text
        return 'h-4 rounded';
    }
  };

  const style = useMemo(() => ({
    width: width || undefined,
    height: height || undefined,
  }), [width, height]);

  if (variant === 'text' && lines > 1) {
    return (
      <div className={combineClasses('space-y-2', className)} role="status" aria-label={ariaLabel}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={combineClasses(baseClasses, animationClasses, 'h-4')}
            style={{ 
              width: `${Math.random() * 40 + 60}%`,
              ...style 
            }}
            {...(animated ? animations.skeleton : {})}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={combineClasses(baseClasses, animationClasses, getVariantClasses(), className)}
      style={style}
      {...(animated ? animations.skeleton : {})}
      role="status"
      aria-label={ariaLabel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
});

OptimizedSkeleton.displayName = 'OptimizedSkeleton';

/**
 * Progressive Loading Component with staggered animations
 */
export const ProgressiveLoading = memo<ProgressiveLoadingProps>(({
  items,
  renderItem,
  renderSkeleton,
  isLoading,
  staggerDelay = 0.1,
  className = '',
  ariaLabel = 'Đang tải danh sách...',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className={className} role="status" aria-label={ariaLabel}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
            className="space-y-4"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div key={index} variants={itemVariants}>
                {renderSkeleton()}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <motion.div key={item.id || index} variants={itemVariants}>
                {renderItem(item, index)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ProgressiveLoading.displayName = 'ProgressiveLoading';

/**
 * Smart Loading Overlay with adaptive behavior
 */
export const SmartLoadingOverlay = memo<{
  isVisible: boolean;
  message?: string;
  variant?: 'blur' | 'solid' | 'minimal';
  children?: React.ReactNode;
  onCancel?: () => void;
}>(({
  isVisible,
  message = 'Đang xử lý...',
  variant = 'blur',
  children,
  onCancel,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 0.9,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.3, ease: 'easeOut' },
    },
  };

  const getOverlayClasses = () => {
    switch (variant) {
      case 'solid':
        return 'bg-white/90';
      case 'minimal':
        return 'bg-transparent';
      default: // blur
        return 'bg-white/80 backdrop-blur-sm';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={combineClasses(
            'fixed inset-0 z-50 flex items-center justify-center',
            getOverlayClasses()
          )}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="dialog"
          aria-modal="true"
          aria-label={message}
        >
          <motion.div
            className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-lg max-w-sm mx-4"
            variants={contentVariants}
          >
            <OptimizedLoadingSpinner variant="medical" message={message} />
            
            {children}
            
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Hủy bỏ"
              >
                Hủy bỏ
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SmartLoadingOverlay.displayName = 'SmartLoadingOverlay';
