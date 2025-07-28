import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

// Medical-specific animation variants
export const medicalAnimations = {
  // Gentle fade in for medical content
  fadeInGentle: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Slide in from right for forms and panels
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Scale in for important medical alerts
  scaleInAlert: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Heartbeat animation for vital signs
  heartbeat: {
    animate: {
      scale: [1, 1.1, 1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Pulse for status indicators
  medicalPulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Loading animation for medical data
  loadingDots: {
    animate: {
      scale: [0, 1, 0],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Stagger animation for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Enhanced medical-specific animations
  gentleShake: {
    animate: {
      x: [0, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  },

  successBounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: [0.8, 1.1, 1],
      transition: {
        duration: 0.5,
        times: [0, 0.6, 1],
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: { opacity: 0, scale: 0.8 },
  },

  notificationSlide: {
    initial: { opacity: 0, y: -50, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.95 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  cardHover: {
    whileHover: {
      y: -2,
      scale: 1.02,
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    whileTap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  },

  emergencyPulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

// Enhanced Medical Loading Spinner Component with medical colors
export const MedicalSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  const colorStyles = {
    primary: { borderColor: '#0066CC transparent transparent transparent' },
    secondary: { borderColor: '#00AA44 transparent transparent transparent' },
    white: { borderColor: '#FFFFFF transparent transparent transparent' },
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-solid rounded-full ${className}`}
      style={colorStyles[color]}
      animate={{
        rotate: 360,
        borderColor:
          color === 'primary'
            ? [
                '#0066CC transparent transparent transparent',
                '#00AA44 #0066CC transparent transparent',
                'transparent #00AA44 #0066CC transparent',
                'transparent transparent #00AA44 #0066CC',
                '#0066CC transparent transparent transparent',
              ]
            : color === 'secondary'
              ? [
                  '#00AA44 transparent transparent transparent',
                  '#0066CC #00AA44 transparent transparent',
                  'transparent #0066CC #00AA44 transparent',
                  'transparent transparent #0066CC #00AA44',
                  '#00AA44 transparent transparent transparent',
                ]
              : undefined,
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
      role="status"
      aria-label="Đang tải..."
    />
  );
};

// Medical Progress Bar Component
export const MedicalProgressBar = ({
  progress,
  label,
  color = 'primary',
  showPercentage = true,
  animated = true,
  className = '',
}: {
  progress: number;
  label?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}) => {
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
          {showPercentage && <span className="text-sm text-text-muted">{Math.round(progress)}%</span>}
        </div>
      )}
      <div className="w-full bg-border rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={animated ? { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } : { duration: 0 }}
        />
      </div>
    </div>
  );
};

// Animated Medical Icon Component
export const AnimatedMedicalIcon = ({
  type,
  size = 'md',
  color = 'primary',
  animate = true,
  className = '',
}: {
  type: 'heartbeat' | 'pulse' | 'cross' | 'stethoscope' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  animate?: boolean;
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };

  const icons = {
    heartbeat: <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />,
    pulse: <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />,
    cross: <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />,
    stethoscope: (
      <path d="M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z" />
    ),
    pill: <path d="M10.5 20.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z" />,
  };

  const animationProps = animate
    ? type === 'heartbeat'
      ? medicalAnimations.heartbeat
      : medicalAnimations.medicalPulse
    : {};

  return (
    <motion.svg
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...animationProps}
    >
      {icons[type]}
    </motion.svg>
  );
};

// Floating Action Button with Medical Animation
export const MedicalFloatingButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'emergency' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} & HTMLMotionProps<'button'>) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-primary-light text-white shadow-medical',
    emergency: 'bg-gradient-to-r from-medical-emergency to-red-600 text-white shadow-error',
    success: 'bg-gradient-to-r from-success to-green-600 text-white shadow-success',
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  return (
    <motion.button
      className={`
        fixed bottom-6 right-6 rounded-full flex items-center justify-center
        medical-focus transition-all duration-200 z-40
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Medical Card with Hover Animation
export const AnimatedMedicalCard = ({
  children,
  className = '',
  onClick,
  ...props
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
} & HTMLMotionProps<'div'>) => {
  return (
    <motion.div
      className={`
        bg-surface rounded-xl border border-border shadow-card
        cursor-pointer medical-card transition-all duration-200
        ${className}
      `}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Staggered List Animation
export const StaggeredList = ({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div className={className} variants={medicalAnimations.staggerItem}>
      {children}
    </motion.div>
  );
};

// Medical Heartbeat Component with medical colors
export const MedicalHeartbeat = ({
  size = 'md',
  color = '#dc2626',
  className = '',
  active = true,
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  active?: boolean;
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={active ? medicalAnimations.heartbeat : {}}
      role="img"
      aria-label="Nhịp tim"
    >
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill={color}
        />
      </svg>
    </motion.div>
  );
};

// Medical Pulse Indicator with medical colors
export const MedicalPulseIndicator = ({
  size = 'sm',
  active = true,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full ${className}`}
      style={{ backgroundColor: active ? '#00AA44' : '#6B7280' }}
      animate={active ? medicalAnimations.medicalPulse : {}}
      role="status"
      aria-label={active ? 'Hoạt động' : 'Không hoạt động'}
    />
  );
};

// Medical Emergency Button with pulsing animation
export const MedicalEmergencyButton = ({
  children,
  onClick,
  className = '',
  ...props
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
} & HTMLMotionProps<'button'>) => {
  return (
    <motion.button
      className={`
        bg-gradient-to-r from-red-600 to-red-700 text-white
        px-6 py-3 rounded-lg font-semibold shadow-lg
        min-h-[44px] min-w-[44px]
        ${className}
      `}
      onClick={onClick}
      animate={medicalAnimations.emergencyPulse}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
