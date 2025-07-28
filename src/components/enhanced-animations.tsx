import React, { ReactNode } from 'react';
import { motion, AnimatePresence, useInView, useAnimation, Variants } from 'framer-motion';
import { useTheme } from './theme-provider';

// Enhanced Animation Variants
export const ENHANCED_ANIMATIONS = {
  // Entrance animations
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  fadeInDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  scaleInBounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: [0.3, 1.1, 1],
      transition: { duration: 0.5, times: [0, 0.6, 1] }
    },
    exit: { opacity: 0, scale: 0.8 }
  },

  // Medical-specific animations
  heartbeat: {
    animate: {
      scale: [1, 1.2, 1, 1.2, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
    }
  },

  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }
  },

  // Stagger animations
  staggerContainer: {
    animate: {
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  // Hover animations
  hoverLift: {
    whileHover: { 
      y: -4, 
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    whileTap: { scale: 0.98 }
  },

  hoverGlow: {
    whileHover: {
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
      transition: { duration: 0.2 }
    }
  },

  // Loading animations
  spin: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: 'linear' }
  },

  bounce: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
  }
} as const;

// Animated Container Component
interface AnimatedContainerProps {
  children: ReactNode;
  animation?: keyof typeof ENHANCED_ANIMATIONS;
  delay?: number;
  duration?: number;
  className?: string;
  triggerOnce?: boolean;
}

export function AnimatedContainer({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration,
  className = '',
  triggerOnce = true
}: AnimatedContainerProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, margin: '-50px' });
  const controls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      controls.start('animate');
    }
  }, [isInView, controls]);

  const animationConfig = ENHANCED_ANIMATIONS[animation];
  const customTransition = duration ? { ...animationConfig.transition, duration } : animationConfig.transition;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={controls}
      variants={{
        initial: animationConfig.initial,
        animate: {
          ...animationConfig.animate,
          transition: { ...customTransition, delay }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Staggered List Animation
interface StaggeredListProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
  itemClassName?: string;
}

export function StaggeredList({
  children,
  staggerDelay = 0.1,
  className = '',
  itemClassName = ''
}: StaggeredListProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={{
        animate: {
          transition: { staggerChildren: staggerDelay, delayChildren: 0.1 }
        }
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          variants={ENHANCED_ANIMATIONS.staggerItem}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Interactive Button with Enhanced Animations
interface AnimatedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'medical' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  loading = false
}: AnimatedButtonProps) {
  const { colors } = useTheme();

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-600',
    secondary: 'bg-secondary text-white hover:bg-secondary-600',
    medical: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700',
    emergency: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-lg font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            Loading...
          </motion.div>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Floating Action Button with Medical Animation
interface FloatingActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'emergency' | 'success';
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  position = 'bottom-right'
}: FloatingActionButtonProps) {
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    emergency: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
  };

  return (
    <motion.button
      className={`
        fixed ${positionStyles[position]}
        w-14 h-14 rounded-full
        ${variantStyles[variant]}
        text-white shadow-lg
        flex items-center justify-center
        z-50
        ${className}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.button>
  );
}

// Medical Status Indicator with Animation
interface AnimatedStatusIndicatorProps {
  status: 'normal' | 'warning' | 'critical' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function AnimatedStatusIndicator({
  status,
  size = 'md',
  animated = true,
  className = ''
}: AnimatedStatusIndicatorProps) {
  const { colors } = useTheme();

  const sizeStyles = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusColors = {
    normal: colors.medical.normal,
    warning: colors.medical.caution,
    critical: colors.medical.vital,
    emergency: colors.medical.emergency
  };

  const animationVariant = status === 'emergency' ? 'heartbeat' : 'pulse';

  return (
    <motion.div
      className={`${sizeStyles[size]} rounded-full ${className}`}
      style={{ backgroundColor: statusColors[status] }}
      variants={animated ? ENHANCED_ANIMATIONS[animationVariant] : undefined}
      animate={animated ? 'animate' : undefined}
      aria-label={`Status: ${status}`}
    />
  );
}

// Notification Toast with Animation
interface AnimatedToastProps {
  children: ReactNode;
  type?: 'success' | 'warning' | 'error' | 'info';
  isVisible: boolean;
  onClose?: () => void;
  duration?: number;
}

export function AnimatedToast({
  children,
  type = 'info',
  isVisible,
  onClose,
  duration = 5000
}: AnimatedToastProps) {
  const typeStyles = {
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`
            fixed top-4 right-4 z-50
            px-4 py-3 rounded-lg shadow-lg
            ${typeStyles[type]}
            max-w-sm
          `}
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center justify-between">
            <div>{children}</div>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-3 text-white hover:text-gray-200"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Progress Bar with Animation
interface AnimatedProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
  height?: number;
  animated?: boolean;
  className?: string;
}

export function AnimatedProgressBar({
  progress,
  label,
  color = '#3B82F6',
  height = 8,
  animated = true,
  className = ''
}: AnimatedProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div 
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={animated ? { duration: 1, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
    </div>
  );
}
