import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface MedicalLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pulse' | 'cross' | 'heartbeat' | 'wave';
  message?: string;
  className?: string;
}

interface MedicalSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'image' | 'medical-card';
  lines?: number;
  animated?: boolean;
}

interface MedicalLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: 'blur' | 'medical' | 'gradient';
  children?: ReactNode;
}

// Medical Cross Loading Spinner
export function MedicalLoadingSpinner({ 
  size = 'md', 
  variant = 'cross', 
  message, 
  className = '' 
}: MedicalLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const CrossSpinner = () => (
    <motion.div
      className={`${sizeClasses[size]} text-primary`}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 2v6H2v4h6v6h4v-6h6V8h-6V2H8z" />
      </svg>
    </motion.div>
  );

  const PulseSpinner = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-primary rounded-full`}
      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );

  const HeartbeatSpinner = () => (
    <motion.div
      className={`${sizeClasses[size]} text-secondary`}
      animate={{ scale: [1, 1.1, 1, 1.1, 1] }}
      transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 1] }}
    >
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    </motion.div>
  );

  const WaveSpinner = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-6 bg-accent rounded-full"
          animate={{ scaleY: [1, 2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );

  const spinnerComponents = {
    cross: CrossSpinner,
    pulse: PulseSpinner,
    heartbeat: HeartbeatSpinner,
    wave: WaveSpinner
  };

  const SpinnerComponent = spinnerComponents[variant];

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <SpinnerComponent />
      {message && (
        <motion.p
          className="text-sm text-gray-600 font-medium text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

// Enhanced Medical Skeleton Component
export function MedicalSkeleton({ 
  className = '', 
  variant = 'text', 
  lines = 1, 
  animated = true 
}: MedicalSkeletonProps) {
  const baseClasses = `bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg ${animated ? 'animate-pulse' : ''}`;

  if (variant === 'medical-card') {
    return (
      <div className={`bg-white rounded-2xl p-6 border border-border-medical shadow-lg ${className}`}>
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-10 h-10 rounded-full ${baseClasses}`} />
          <div className="flex-1 space-y-2">
            <div className={`h-4 w-3/4 ${baseClasses}`} />
            <div className={`h-3 w-1/2 ${baseClasses}`} />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`h-3 ${baseClasses}`} style={{ width: `${Math.random() * 40 + 60}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`h-4 ${baseClasses}`}
            style={{ width: `${Math.random() * 40 + 60}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={`w-16 h-16 rounded-full ${baseClasses} ${className}`} />;
  }

  if (variant === 'button') {
    return <div className={`h-12 w-32 rounded-xl ${baseClasses} ${className}`} />;
  }

  if (variant === 'image') {
    return <div className={`w-full h-48 rounded-2xl ${baseClasses} ${className}`} />;
  }

  return <div className={`h-4 ${baseClasses} ${className}`} />;
}

// Medical Loading Overlay
export function MedicalLoadingOverlay({ 
  isVisible, 
  message = 'Đang tải...', 
  variant = 'medical',
  children 
}: MedicalLoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
          
          {/* Content */}
          <motion.div
            className="relative bg-white rounded-3xl p-8 shadow-2xl border border-border-medical max-w-sm mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="text-center">
              <MedicalLoadingSpinner size="lg" variant="cross" />
              <motion.p
                className="mt-4 text-gray-700 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.p>
            </div>
            
            {/* Medical Cross Decoration */}
            <div className="absolute -top-2 -right-2 w-6 h-6 opacity-20">
              <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 2v6H2v4h6v6h4v-6h6V8h-6V2H8z" />
              </svg>
            </div>
          </motion.div>
          
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Medical Page Transition Component
export function MedicalPageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

export default {
  MedicalLoadingSpinner,
  MedicalSkeleton,
  MedicalLoadingOverlay,
  MedicalPageTransition
};
