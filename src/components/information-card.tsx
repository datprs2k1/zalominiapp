import React, { ReactNode, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import {
  MedicalCrossIcon,
  StethoscopeIcon,
  HeartIcon,
  CertificateIcon,
  MedicalShieldIcon,
  ExperienceIcon,
  LanguageIcon,
  MedicalFeeIcon,
  OnlineStatusIcon,
  StarIcon,
  AppointmentIcon,
} from '@/components/medical-icons';
import './information-card.css';

export interface InformationCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card title */
  title: string;
  /** Card subtitle (optional) */
  subtitle?: string;
  /** Main content value */
  value: string | ReactNode;
  /** Icon to display */
  icon?: ReactNode;
  /** Card variant for different medical contexts */
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  /** Card size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the card is interactive */
  interactive?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Badge content */
  badge?: ReactNode;
  /** Additional info to display */
  additionalInfo?: string;
  /** Whether to show hover effects */
  showHoverEffect?: boolean;
  /** Custom gradient colors */
  gradientFrom?: string;
  gradientTo?: string;
  /** Medical context for appropriate styling */
  medicalContext?: 'general' | 'emergency' | 'consultation' | 'appointment' | 'prescription' | 'vitals';
  /** Priority level for visual emphasis */
  priority?: 'low' | 'medium' | 'high' | 'critical';
  /** Accessibility label */
  ariaLabel?: string;
}

// Predefined medical icons for common information types
export const MedicalIcons = {
  specialization: <StethoscopeIcon size="md" />,
  qualification: <CertificateIcon size="md" />,
  experience: <ExperienceIcon size="md" />,
  language: <LanguageIcon size="md" />,
  fee: <MedicalFeeIcon size="md" />,
  status: <OnlineStatusIcon size="md" />,
  rating: <StarIcon size="md" />,
  appointment: <AppointmentIcon size="md" />,
  department: <MedicalShieldIcon size="md" />,
  general: <MedicalCrossIcon size="md" />,
  vitals: <HeartIcon size="md" />,
};

// Variant configurations
const variantConfig = {
  default: {
    background: 'from-slate-50 via-gray-50 to-slate-50',
    border: 'border-slate-200',
    iconBg: 'from-slate-500 to-slate-600',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-600',
    decoration: 'text-slate-400',
  },
  primary: {
    background: 'from-blue-50 via-primary-50 to-blue-50',
    border: 'border-primary-200',
    iconBg: 'from-primary to-primary-600',
    textPrimary: 'text-primary-800',
    textSecondary: 'text-primary-600',
    decoration: 'text-primary-400',
  },
  secondary: {
    background: 'from-secondary-50 via-accent-50 to-secondary-50',
    border: 'border-secondary-200',
    iconBg: 'from-secondary to-secondary-600',
    textPrimary: 'text-secondary-800',
    textSecondary: 'text-secondary-600',
    decoration: 'text-secondary-400',
  },
  accent: {
    background: 'from-accent-50 via-primary-50 to-accent-50',
    border: 'border-accent-200',
    iconBg: 'from-accent to-accent-600',
    textPrimary: 'text-accent-800',
    textSecondary: 'text-accent-600',
    decoration: 'text-accent-400',
  },
  success: {
    background: 'from-emerald-50 via-green-50 to-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'from-emerald-500 to-emerald-600',
    textPrimary: 'text-emerald-800',
    textSecondary: 'text-emerald-600',
    decoration: 'text-emerald-400',
  },
  warning: {
    background: 'from-amber-50 via-yellow-50 to-amber-50',
    border: 'border-amber-200',
    iconBg: 'from-amber-500 to-amber-600',
    textPrimary: 'text-amber-800',
    textSecondary: 'text-amber-600',
    decoration: 'text-amber-400',
  },
  error: {
    background: 'from-red-50 via-rose-50 to-red-50',
    border: 'border-red-200',
    iconBg: 'from-red-500 to-red-600',
    textPrimary: 'text-red-800',
    textSecondary: 'text-red-600',
    decoration: 'text-red-400',
  },
  info: {
    background: 'from-cyan-50 via-blue-50 to-cyan-50',
    border: 'border-cyan-200',
    iconBg: 'from-cyan-500 to-cyan-600',
    textPrimary: 'text-cyan-800',
    textSecondary: 'text-cyan-600',
    decoration: 'text-cyan-400',
  },
};

// Size configurations
const sizeConfig = {
  sm: {
    padding: 'p-4',
    iconSize: 'w-8 h-8',
    titleSize: 'text-sm',
    valueSize: 'text-base',
    subtitleSize: 'text-xs',
    spacing: 'space-y-2',
  },
  md: {
    padding: 'p-6',
    iconSize: 'w-10 h-10',
    titleSize: 'text-base',
    valueSize: 'text-lg',
    subtitleSize: 'text-sm',
    spacing: 'space-y-3',
  },
  lg: {
    padding: 'p-8',
    iconSize: 'w-12 h-12',
    titleSize: 'text-lg',
    valueSize: 'text-xl',
    subtitleSize: 'text-base',
    spacing: 'space-y-4',
  },
};

export const InformationCard: React.FC<InformationCardProps> = ({
  title,
  subtitle,
  value,
  icon,
  variant = 'default',
  size = 'md',
  interactive = false,
  loading = false,
  badge,
  additionalInfo,
  showHoverEffect = true,
  gradientFrom,
  gradientTo,
  medicalContext = 'general',
  priority = 'medium',
  ariaLabel,
  className = '',
  onClick,
  ...props
}) => {
  const config = variantConfig[variant];
  const sizeConf = sizeConfig[size];

  // Custom gradient override
  const backgroundGradient =
    gradientFrom && gradientTo ? `from-${gradientFrom} via-${gradientFrom}/50 to-${gradientTo}` : config.background;

  // Priority-based styling adjustments
  const priorityStyles = priority === 'high' || priority === 'critical' ? 'ring-2 ring-primary/20 shadow-lg' : '';

  const isClickable = interactive || onClick;

  return (
    <motion.div
      className={`
        relative bg-gradient-to-r ${backgroundGradient} 
        rounded-2xl ${sizeConf.padding} border ${config.border} 
        shadow-lg hover:shadow-xl transition-all duration-300
        ${priorityStyles}
        ${isClickable ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${showHoverEffect ? 'hover:shadow-2xl hover:-translate-y-1' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={showHoverEffect ? { y: -2 } : undefined}
      onClick={onClick}
      role={isClickable ? 'button' : 'article'}
      aria-label={ariaLabel || `${title}: ${typeof value === 'string' ? value : 'information card'}`}
      tabIndex={isClickable ? 0 : undefined}
      {...props}
    >
      {/* Medical decoration pattern */}
      <div className="absolute top-4 right-4 opacity-10">
        <div className={`w-4 h-4 ${config.decoration}`}>
          <MedicalCrossIcon size="sm" />
        </div>
      </div>

      {/* Badge */}
      {badge && <div className="absolute -top-2 -right-2">{badge}</div>}

      <div className={`flex items-start ${sizeConf.spacing}`}>
        {/* Icon section */}
        {icon && (
          <div
            className={`
            ${sizeConf.iconSize} bg-gradient-to-r ${config.iconBg} 
            rounded-2xl flex items-center justify-center 
            flex-shrink-0 shadow-lg text-white
          `}
          >
            {icon}
          </div>
        )}

        {/* Content section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`${sizeConf.titleSize} font-semibold ${config.textPrimary} leading-tight`}>{title}</h3>
            {priority === 'critical' && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
          </div>

          {subtitle && <p className={`${sizeConf.subtitleSize} ${config.textSecondary} mb-2`}>{subtitle}</p>}

          <div className={`${sizeConf.valueSize} font-bold ${config.textPrimary} leading-tight`}>
            {loading ? <div className="animate-pulse bg-gray-200 h-6 w-3/4 rounded"></div> : value}
          </div>

          {additionalInfo && (
            <p className={`${sizeConf.subtitleSize} ${config.textSecondary} mt-2 opacity-80`}>{additionalInfo}</p>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      {isClickable && showHoverEffect && (
        <motion.div
          className="absolute inset-0 bg-white/10 opacity-0 pointer-events-none rounded-2xl"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Medical corner decoration */}
      <div className="absolute bottom-4 left-4 opacity-5">
        <div className={`w-3 h-3 ${config.decoration}`}>
          <HeartIcon size="sm" />
        </div>
      </div>
    </motion.div>
  );
};

// Specialized Information Card variants for common medical use cases
export const DoctorInfoCard = ({ children, ...props }: Omit<InformationCardProps, 'variant'>) => (
  <InformationCard variant="primary" medicalContext="consultation" {...props} />
);

export const AppointmentInfoCard = ({ children, ...props }: Omit<InformationCardProps, 'variant'>) => (
  <InformationCard variant="accent" medicalContext="appointment" {...props} />
);

export const VitalInfoCard = ({ children, ...props }: Omit<InformationCardProps, 'variant'>) => (
  <InformationCard variant="success" medicalContext="vitals" {...props} />
);

export const EmergencyInfoCard = ({ children, ...props }: Omit<InformationCardProps, 'variant'>) => (
  <InformationCard variant="error" medicalContext="emergency" priority="critical" {...props} />
);

export default InformationCard;
