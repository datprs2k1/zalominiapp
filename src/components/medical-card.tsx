import { ReactNode, HTMLAttributes } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MEDICAL_COLORS, TYPOGRAPHY, ANIMATIONS, ACCESSIBILITY, combineClasses } from '@/styles/medical-design-system';

export interface MedicalCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'emergency' | 'success' | 'info' | 'warning' | 'consultation';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  loading?: boolean;
  status?: 'emergency' | 'urgent' | 'routine' | 'consultation';
  header?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  timestamp?: string;
  patientId?: string;
  ariaLabel?: string;
}

const cardVariants = {
  default: 'bg-surface border border-border shadow-card hover:shadow-card-hover',
  elevated: 'bg-surface-elevated border border-border shadow-card-elevated hover:shadow-card-hover',
  outlined: 'bg-surface border-2 border-primary-200 shadow-sm hover:border-primary/30 hover:shadow-card',
  emergency:
    'bg-medical-emergency-light border border-medical-emergency/30 shadow-emergency hover:shadow-emergency-hover',
  success: 'bg-success-light border border-success/30 shadow-success hover:shadow-success-hover',
  info: 'bg-info-light border border-info/30 shadow-info hover:shadow-info-hover',
  warning: 'bg-warning-light border border-warning/30 shadow-warning hover:shadow-warning-hover',
  consultation: 'bg-medical-consultation-light border border-medical-consultation/30 shadow-consultation',
};

const cardSizes = {
  sm: 'p-4 rounded-lg min-h-[44px]', // Ensure 44px minimum touch target
  md: 'p-6 rounded-xl min-h-[48px]', // Comfortable touch target
  lg: 'p-8 rounded-2xl min-h-[56px]', // Large touch target
  xl: 'p-10 rounded-2xl min-h-[64px]', // Extra large touch target
};

// Medical status colors with new color scheme
const statusColors = {
  emergency: '#dc2626', // Red for emergency
  urgent: '#f59e0b', // Amber for urgent
  routine: '#00AA44', // Medical green for routine
  consultation: '#0066CC', // Medical blue for consultation
};

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-border rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-border rounded w-1/2 mb-3"></div>
    <div className="h-3 bg-border rounded w-full mb-2"></div>
    <div className="h-3 bg-border rounded w-2/3"></div>
  </div>
);

export const MedicalCard = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  interactive = false,
  loading = false,
  status,
  header,
  footer,
  icon,
  badge,
  priority,
  timestamp,
  patientId,
  ariaLabel,
  onClick,
  ...props
}: MedicalCardProps) => {
  const isClickable = interactive || onClick;
  const cardId = props.id || `medical-card-${Math.random().toString(36).substr(2, 9)}`;
  const prefersReducedMotion = useReducedMotion();

  // Determine ARIA role based on interactivity
  const role = isClickable ? 'button' : 'article';

  // Create comprehensive aria-label with medical context
  const computedAriaLabel =
    ariaLabel ||
    `${variant === 'emergency' ? 'Emergency medical ' : 'Medical '}${
      variant === 'consultation' ? 'consultation' : 'information'
    } card${patientId ? ` for patient ${patientId}` : ''}${
      priority ? `, priority level: ${priority}` : ''
    }${timestamp ? `, last updated: ${timestamp}` : ''}${status ? `, status: ${status}` : ''}`;

  return (
    <motion.div
      id={cardId}
      role={role}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={computedAriaLabel}
      aria-pressed={isClickable && onClick ? false : undefined}
      className={`
        relative overflow-hidden transition-all duration-300 medical-focus
        ${cardVariants[variant]}
        ${cardSizes[size]}
        ${isClickable ? 'cursor-pointer medical-card hover:scale-[1.02] active:scale-[0.98]' : ''}
        ${priority === 'critical' ? 'ring-2 ring-medical-emergency/50' : ''}
        ${className}
      `}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(e as any);
              }
            }
          : undefined
      }
      whileHover={
        isClickable && !prefersReducedMotion
          ? {
              y: -3,
              scale: 1.02,
              boxShadow:
                variant === 'emergency' ? `0 8px 24px #EF444430` : `0 4px 16px ${MEDICAL_COLORS.primary.blue}15`,
            }
          : {}
      }
      whileTap={isClickable && !prefersReducedMotion ? { scale: 0.98 } : {}}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? {}
          : {
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }
      }
      {...props}
    >
      {/* Status Indicator */}
      {status && (
        <div className="absolute top-0 left-0 right-0 h-1">
          <div className={`h-full ${statusColors[status]} status-indicator ${status}`}></div>
        </div>
      )}

      {/* Badge */}
      {badge && <div className="absolute top-3 right-3 z-10">{badge}</div>}

      {/* Header */}
      {header && (
        <div className="mb-4 pb-3 border-b border-border-light">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  {icon}
                </div>
              )}
              <div className="flex-1">{header}</div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative">{loading ? <LoadingSkeleton /> : children}</div>

      {/* Footer */}
      {footer && <div className="mt-4 pt-3 border-t border-border-light">{footer}</div>}

      {/* Hover Effect Overlay */}
      {isClickable && (
        <motion.div
          className="absolute inset-0 bg-primary/5 opacity-0 pointer-events-none"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

// Specialized Medical Card Variants
export const DoctorCard = ({ children, ...props }: Omit<MedicalCardProps, 'variant'>) => (
  <MedicalCard variant="default" {...props}>
    {children}
  </MedicalCard>
);

export const ServiceCard = ({ children, ...props }: Omit<MedicalCardProps, 'variant'>) => (
  <MedicalCard variant="outlined" {...props}>
    {children}
  </MedicalCard>
);

export const EmergencyCard = ({ children, ...props }: Omit<MedicalCardProps, 'variant'>) => (
  <MedicalCard variant="emergency" status="emergency" {...props}>
    {children}
  </MedicalCard>
);

export const AppointmentCard = ({ children, ...props }: Omit<MedicalCardProps, 'variant'>) => (
  <MedicalCard variant="default" interactive {...props}>
    {children}
  </MedicalCard>
);

// Medical Information Display Components
export const PatientInfoCard = ({
  patientName,
  patientId,
  age,
  gender,
  bloodType,
  allergies,
  ...props
}: MedicalCardProps & {
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  bloodType?: string;
  allergies?: string[];
}) => (
  <MedicalCard
    variant="outlined"
    header={
      <div>
        <h3 className="font-semibold text-text-primary text-lg">{patientName}</h3>
        <p className="text-text-muted text-sm">ID: {patientId}</p>
      </div>
    }
    icon={
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    }
    {...props}
  >
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="text-text-muted">Tuổi:</span>
        <span className="ml-2 font-medium text-text-primary">{age}</span>
      </div>
      <div>
        <span className="text-text-muted">Giới tính:</span>
        <span className="ml-2 font-medium text-text-primary">{gender}</span>
      </div>
      {bloodType && (
        <div>
          <span className="text-text-muted">Nhóm máu:</span>
          <span className="ml-2 font-medium text-error">{bloodType}</span>
        </div>
      )}
      {allergies && allergies.length > 0 && (
        <div className="col-span-2">
          <span className="text-text-muted">Dị ứng:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {allergies.map((allergy, index) => (
              <span key={index} className="px-2 py-1 bg-warning-light text-warning text-xs rounded-full">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </MedicalCard>
);

export const VitalSignsCard = ({
  bloodPressure,
  heartRate,
  temperature,
  oxygenSaturation,
  timestamp,
  ...props
}: MedicalCardProps & {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  timestamp: Date;
}) => (
  <MedicalCard
    variant="default"
    header={
      <div>
        <h3 className="font-semibold text-text-primary">Sinh hiệu</h3>
        <p className="text-text-muted text-sm">{timestamp.toLocaleString('vi-VN')}</p>
      </div>
    }
    icon={
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
      </svg>
    }
    {...props}
  >
    <div className="grid grid-cols-2 gap-4 text-sm">
      {bloodPressure && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-error rounded-full"></div>
          <div>
            <div className="text-text-muted">Huyết áp</div>
            <div className="font-semibold text-text-primary">{bloodPressure} mmHg</div>
          </div>
        </div>
      )}
      {heartRate && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-medical-pulse"></div>
          <div>
            <div className="text-text-muted">Nhịp tim</div>
            <div className="font-semibold text-text-primary">{heartRate} bpm</div>
          </div>
        </div>
      )}
      {temperature && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-warning rounded-full"></div>
          <div>
            <div className="text-text-muted">Nhiệt độ</div>
            <div className="font-semibold text-text-primary">{temperature}°C</div>
          </div>
        </div>
      )}
      {oxygenSaturation && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-info rounded-full"></div>
          <div>
            <div className="text-text-muted">SpO2</div>
            <div className="font-semibold text-text-primary">{oxygenSaturation}%</div>
          </div>
        </div>
      )}
    </div>
  </MedicalCard>
);
