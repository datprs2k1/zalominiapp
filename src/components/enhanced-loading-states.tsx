import { motion, AnimatePresence } from 'framer-motion';
import { SPACING, combineClasses } from '@/styles/medical-design-system';
import { ReactNode } from 'react';
import { getColorToken } from '@/styles/unified-color-system';

interface EnhancedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'medical' | 'pulse' | 'dots' | 'heartbeat' | 'wave' | 'gradient';
  message?: string;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

interface SkeletonScreenProps {
  variant?: 'card' | 'list' | 'profile' | 'article' | 'grid';
  lines?: number;
  className?: string;
  animated?: boolean;
}

interface ProgressiveLoadingProps {
  steps: string[];
  currentStep: number;
  className?: string;
  showProgress?: boolean;
}

interface LoadingWaveProps {
  className?: string;
  color?: string;
  height?: number;
}

// Enhanced Loading Spinner with multiple medical-themed variants
export function EnhancedLoadingSpinner({
  size = 'md',
  variant = 'medical',
  message = 'Đang tải...',
  className = '',
  color = 'primary',
}: EnhancedLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const colorMap = {
    primary: getColorToken('primary'),
    secondary: getColorToken('secondary'),
    success: getColorToken('success'),
    warning: getColorToken('warning'),
    error: getColorToken('error'),
  };

  const selectedColor = colorMap[color];

  // Medical cross with rotating gradient
  if (variant === 'medical') {
    return (
      <div className={combineClasses('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="relative">
          <motion.div
            className={combineClasses(sizeClasses[size], 'rounded-full')}
            style={{
              background: `conic-gradient(from 0deg, ${selectedColor}, transparent, ${selectedColor})`,
              padding: '3px',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <motion.svg
                className="w-1/2 h-1/2"
                style={{ color: selectedColor }}
                fill="currentColor"
                viewBox="0 0 20 20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d="M8 2v6H2v4h6v6h4v-6h6V8h-6V2H8z" />
              </motion.svg>
            </div>
          </motion.div>
        </div>

        {message && (
          <motion.p
            className="text-sm text-gray-600 text-center max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  // Pulse variant
  if (variant === 'pulse') {
    return (
      <div className={combineClasses('flex flex-col items-center justify-center space-y-4', className)}>
        <motion.div
          className={combineClasses(sizeClasses[size], 'rounded-full')}
          style={{ backgroundColor: selectedColor }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.6, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {message && <motion.p className="text-sm text-gray-600 text-center">{message}</motion.p>}
      </div>
    );
  }

  // Bouncing dots
  if (variant === 'dots') {
    return (
      <div className={combineClasses('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedColor }}
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        {message && <motion.p className="text-sm text-gray-600 text-center">{message}</motion.p>}
      </div>
    );
  }

  // Heartbeat animation
  if (variant === 'heartbeat') {
    return (
      <div className={combineClasses('flex flex-col items-center justify-center space-y-4', className)}>
        <motion.div
          className={combineClasses(sizeClasses[size], 'text-red-500')}
          animate={{ scale: [1, 1.4, 1, 1.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>
        {message && <motion.p className="text-sm text-gray-600 text-center">{message}</motion.p>}
      </div>
    );
  }

  // Wave animation
  if (variant === 'wave') {
    return (
      <div className={combineClasses('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{ backgroundColor: selectedColor }}
              animate={{ height: [8, 24, 8] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        {message && <motion.p className="text-sm text-gray-600 text-center">{message}</motion.p>}
      </div>
    );
  }

  // Gradient spinner
  if (variant === 'gradient') {
    return (
      <div className={combineClasses('flex flex-col items-center justify-center space-y-4', className)}>
        <motion.div
          className={combineClasses(sizeClasses[size], 'rounded-full')}
          style={{
            background: `linear-gradient(45deg, ${selectedColor}, transparent, ${selectedColor})`,
            padding: '2px',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full bg-white rounded-full" />
        </motion.div>
        {message && <motion.p className="text-sm text-gray-600 text-center">{message}</motion.p>}
      </div>
    );
  }

  return null;
}

// Skeleton Screen Components
export function SkeletonScreen({ variant = 'card', lines = 3, className = '', animated = true }: SkeletonScreenProps) {
  const shimmerAnimation = animated
    ? {
        animate: {
          backgroundPosition: ['200% 0', '-200% 0'],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        },
      }
    : {};

  const skeletonClass = `bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded animate-pulse`;

  if (variant === 'card') {
    return (
      <div className={combineClasses('p-4 border border-gray-200 rounded-lg space-y-3', className)}>
        <motion.div className={combineClasses(skeletonClass, 'h-4 w-3/4')} {...shimmerAnimation} />
        <motion.div className={combineClasses(skeletonClass, 'h-3 w-full')} {...shimmerAnimation} />
        <motion.div className={combineClasses(skeletonClass, 'h-3 w-2/3')} {...shimmerAnimation} />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={combineClasses('space-y-3', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <motion.div className={combineClasses(skeletonClass, 'w-10 h-10 rounded-full')} {...shimmerAnimation} />
            <div className="flex-1 space-y-2">
              <motion.div className={combineClasses(skeletonClass, 'h-3 w-3/4')} {...shimmerAnimation} />
              <motion.div className={combineClasses(skeletonClass, 'h-2 w-1/2')} {...shimmerAnimation} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div className={combineClasses('flex flex-col items-center space-y-4', className)}>
        <motion.div className={combineClasses(skeletonClass, 'w-20 h-20 rounded-full')} {...shimmerAnimation} />
        <motion.div className={combineClasses(skeletonClass, 'h-4 w-32')} {...shimmerAnimation} />
        <motion.div className={combineClasses(skeletonClass, 'h-3 w-24')} {...shimmerAnimation} />
      </div>
    );
  }

  return null;
}

// Progressive Loading Component
export function ProgressiveLoading({
  steps,
  currentStep,
  className = '',
  showProgress = true,
}: ProgressiveLoadingProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={combineClasses('flex flex-col items-center space-y-6', className)}>
      <EnhancedLoadingSpinner variant="medical" size="lg" />

      {showProgress && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Tiến độ</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <div className="text-center">
        <motion.p
          className="text-sm font-medium text-gray-700"
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {steps[currentStep]}
        </motion.p>
      </div>
    </div>
  );
}

// Loading Wave Component
export function LoadingWave({ className = '', color = getColorToken('primary'), height = 40 }: LoadingWaveProps) {
  return (
    <div className={combineClasses('flex items-end justify-center space-x-1', className)} style={{ height }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ height: [height * 0.2, height * 0.8, height * 0.2] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
