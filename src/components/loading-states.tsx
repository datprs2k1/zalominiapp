import { motion, AnimatePresence } from 'framer-motion';
import { SPACING, combineClasses } from '@/styles/medical-design-system';
import { ReactNode } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'medical' | 'minimal' | 'pulse' | 'dots' | 'heartbeat';
  message?: string;
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: 'blur' | 'solid' | 'gradient';
  children?: ReactNode;
  showProgress?: boolean;
  progress?: number;
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'image' | 'list';
  lines?: number;
  animated?: boolean;
}

interface ProgressiveLoadingProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

// Enhanced Medical Loading Spinner
export function LoadingSpinner({
  size = 'md',
  variant = 'medical',
  message = 'Đang tải...',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = {
    sm: 'space-y-2',
    md: 'space-y-3',
    lg: 'space-y-4',
  };

  if (variant === 'minimal') {
    return (
      <div className={combineClasses('flex items-center justify-center', className)}>
        <motion.div
          className={combineClasses(sizeClasses[size], 'border-2 border-gray-200 rounded-full border-t-blue-600')}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (variant === 'default') {
    return (
      <div className={combineClasses('flex items-center justify-center', SPACING.padding.section, className)}>
        <div className={combineClasses('flex flex-col items-center', containerClasses[size])}>
          <motion.div
            className={combineClasses(sizeClasses[size], 'border-2 border-blue-200 rounded-full border-t-blue-600')}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          {message && (
            <motion.p
              className="text-sm text-gray-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  // Medical variant with cross animation
  return (
    <div
      className={combineClasses('flex items-center justify-center min-h-[200px]', SPACING.padding.section, className)}
    >
      <div className={combineClasses('flex flex-col items-center', containerClasses[size])}>
        {/* Medical cross spinner */}
        <div className="relative">
          <motion.div
            className={combineClasses(sizeClasses[size], 'border-2 border-blue-200 rounded-full border-t-blue-600')}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </motion.div>

          {/* Medical cross overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 2v6H2v4h6v6h4v-6h6V8h-6V2H8z" />
            </svg>
          </motion.div>
        </div>

        {message && (
          <motion.p
            className="text-sm text-gray-600 font-medium text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// Full-screen loading overlay
export function LoadingOverlay({
  isVisible,
  message = 'Đang tải...',
  variant = 'blur',
  children,
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={combineClasses(
            'fixed inset-0 z-50 flex items-center justify-center',
            variant === 'blur' ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children || <LoadingSpinner variant="medical" message={message} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Skeleton loading components
export function Skeleton({ className = '', variant = 'text', lines = 1 }: SkeletonProps) {
  const baseClasses = 'bg-gray-200 animate-pulse rounded';

  if (variant === 'text') {
    return (
      <div className={combineClasses('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={combineClasses(baseClasses, 'h-4')}
            style={{ width: `${Math.random() * 40 + 60}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        className={combineClasses('p-4 border border-gray-200 rounded-lg space-y-3', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={combineClasses(baseClasses, 'h-6 w-3/4')} />
        <div className={combineClasses(baseClasses, 'h-4 w-full')} />
        <div className={combineClasses(baseClasses, 'h-4 w-2/3')} />
      </motion.div>
    );
  }

  if (variant === 'avatar') {
    return (
      <motion.div
        className={combineClasses(baseClasses, 'w-10 h-10 rounded-full', className)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    );
  }

  if (variant === 'button') {
    return (
      <motion.div
        className={combineClasses(baseClasses, 'h-10 w-24', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    );
  }

  return (
    <motion.div
      className={combineClasses(baseClasses, 'h-4', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}

// Progressive loading component for lists
export function ProgressiveLoader({
  items,
  renderItem,
  isLoading,
  skeletonCount = 3,
}: {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  isLoading: boolean;
  skeletonCount?: number;
}) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <Skeleton key={index} variant="card" />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {renderItem(item, index)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
