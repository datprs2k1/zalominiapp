import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getColorToken } from '@/styles/unified-color-system';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'profile' | 'appointment' | 'doctor' | 'search' | 'invoice';
  count?: number;
  className?: string;
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

interface LoadingProgressProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

// Advanced Loading Spinner with Medical Theme
export const MedicalLoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    primary: 'text-blue-600',
    secondary: 'text-green-600',
    white: 'text-white'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      animate={prefersReducedMotion ? {} : { rotate: 360 }}
      transition={prefersReducedMotion ? {} : {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          className="opacity-25"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="23.562"
          className="opacity-75"
        />
        {/* Medical Cross in Center */}
        <g className="opacity-50">
          <rect x="11" y="8" width="2" height="8" fill="currentColor" />
          <rect x="8" y="11" width="8" height="2" fill="currentColor" />
        </g>
      </svg>
    </motion.div>
  );
};

// Progress Bar with Medical Styling
export const MedicalProgressBar: React.FC<LoadingProgressProps> = ({
  progress,
  label,
  showPercentage = true,
  variant = 'primary',
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();

  const variantClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-orange-600',
    error: 'bg-red-600'
  };

  const backgroundClasses = {
    primary: 'bg-blue-100',
    success: 'bg-green-100',
    warning: 'bg-orange-100',
    error: 'bg-red-100'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && <span className="text-sm text-gray-500">{Math.round(progress)}%</span>}
        </div>
      )}
      <div className={`w-full h-2 rounded-full ${backgroundClasses[variant]}`}>
        <motion.div
          className={`h-full rounded-full ${variantClasses[variant]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={prefersReducedMotion ? {} : {
            duration: 0.5,
            ease: "easeOut"
          }}
        />
      </div>
    </div>
  );
};

// Skeleton Loading Components
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 1,
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();

  const pulseAnimation = prefersReducedMotion ? {} : {
    animate: {
      opacity: [0.5, 1, 0.5],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const renderCardSkeleton = () => (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
      {...pulseAnimation}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </motion.div>
  );

  const renderListSkeleton = () => (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
      {...pulseAnimation}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
      </div>
    </motion.div>
  );

  const renderProfileSkeleton = () => (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      {...pulseAnimation}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        <div className="space-y-2 text-center">
          <div className="h-6 bg-gray-200 rounded w-32 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3].map(i => (
            <div key={i} className="text-center space-y-2">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderAppointmentSkeleton = () => (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      {...pulseAnimation}
    >
      <div className="bg-gray-100 p-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </motion.div>
  );

  const renderDoctorSkeleton = () => (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      {...pulseAnimation}
    >
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSearchSkeleton = () => (
    <motion.div className="space-y-4" {...pulseAnimation}>
      <div className="h-12 bg-gray-200 rounded-xl"></div>
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-8 bg-gray-200 rounded-lg w-20"></div>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </motion.div>
  );

  const renderInvoiceSkeleton = () => (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      {...pulseAnimation}
    >
      <div className="bg-gray-100 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </motion.div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'card': return renderCardSkeleton();
      case 'list': return renderListSkeleton();
      case 'profile': return renderProfileSkeleton();
      case 'appointment': return renderAppointmentSkeleton();
      case 'doctor': return renderDoctorSkeleton();
      case 'search': return renderSearchSkeleton();
      case 'invoice': return renderInvoiceSkeleton();
      default: return renderCardSkeleton();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// Loading Overlay Component
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  variant?: 'spinner' | 'progress' | 'dots';
  backdrop?: boolean;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Đang tải...',
  progress,
  variant = 'spinner',
  backdrop = true,
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (!isVisible) return null;

  const renderLoadingContent = () => {
    switch (variant) {
      case 'spinner':
        return <MedicalLoadingSpinner size="lg" variant="white" />;
      case 'progress':
        return progress !== undefined ? (
          <MedicalProgressBar 
            progress={progress} 
            variant="primary" 
            showPercentage 
            className="w-64"
          />
        ) : <MedicalLoadingSpinner size="lg" variant="white" />;
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={prefersReducedMotion ? {} : {
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={prefersReducedMotion ? {} : {
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );
      default:
        return <MedicalLoadingSpinner size="lg" variant="white" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
    >
      {backdrop && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      )}
      <div className="relative bg-blue-600 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          {renderLoadingContent()}
          <p className="text-white font-medium text-center">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Inline Loading Component
interface InlineLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  size = 'md',
  message,
  variant = 'primary',
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <MedicalLoadingSpinner size={size} variant={variant} />
      {message && (
        <span className={`font-medium ${
          variant === 'primary' ? 'text-blue-600' : 'text-green-600'
        }`}>
          {message}
        </span>
      )}
    </div>
  );
};

export default {
  MedicalLoadingSpinner,
  MedicalProgressBar,
  LoadingSkeleton,
  LoadingOverlay,
  InlineLoading
};
