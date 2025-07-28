import { ReactNode, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  SPACING, 
  BORDER_RADIUS, 
  SHADOWS, 
  ANIMATIONS, 
  TOUCH_TARGETS,
  MEDICAL_PRESETS,
  combineClasses 
} from '@/styles/medical-design-system';
import OptimizedImage from './optimized-image';

interface EnhancedMedicalCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  image?: {
    src: string;
    alt: string;
    priority?: boolean;
  };
  medicalContext?: 'doctor' | 'department' | 'service' | 'emergency' | 'general';
  priority?: 'high' | 'medium' | 'low';
  interactive?: boolean;
  onClick?: () => void;
  href?: string;
  badge?: {
    text: string;
    variant: 'emergency' | 'available' | 'busy' | 'info';
  };
  loading?: boolean;
  skeleton?: boolean;
  size?: 'small' | 'medium' | 'large';
  layout?: 'vertical' | 'horizontal';
  showHoverEffect?: boolean;
  ariaLabel?: string;
}

const EnhancedMedicalCard = memo(({
  children,
  className = '',
  title,
  subtitle,
  image,
  medicalContext = 'general',
  priority = 'medium',
  interactive = false,
  onClick,
  href,
  badge,
  loading = false,
  skeleton = false,
  size = 'medium',
  layout = 'vertical',
  showHoverEffect = true,
  ariaLabel,
}: EnhancedMedicalCardProps) => {
  // Memoized styling calculations
  const cardStyles = useMemo(() => {
    const sizeMap = {
      small: {
        padding: SPACING.padding.content,
        minHeight: 'min-h-[120px]',
        imageSize: { width: 60, height: 60 },
      },
      medium: {
        padding: SPACING.padding.card,
        minHeight: 'min-h-[160px]',
        imageSize: { width: 80, height: 80 },
      },
      large: {
        padding: SPACING.padding.cardLarge,
        minHeight: 'min-h-[200px]',
        imageSize: { width: 100, height: 100 },
      },
    };

    const priorityMap = {
      high: {
        shadow: SHADOWS.cardHover,
        border: 'border-2 border-red-200',
        accent: 'bg-red-50',
      },
      medium: {
        shadow: SHADOWS.card,
        border: 'border border-gray-200',
        accent: 'bg-blue-50',
      },
      low: {
        shadow: 'shadow-sm',
        border: 'border border-gray-100',
        accent: 'bg-gray-50',
      },
    };

    const contextMap = {
      doctor: 'bg-blue-gradient',
      department: 'bg-green-gradient',
      service: 'bg-teal-gradient',
      emergency: 'bg-red-gradient',
      general: 'bg-white',
    };

    return {
      size: sizeMap[size],
      priority: priorityMap[priority],
      context: contextMap[medicalContext],
    };
  }, [size, priority, medicalContext]);

  // Badge styling
  const getBadgeStyles = (variant: string) => {
    const badgeMap = {
      emergency: 'bg-red-100 text-red-800 border-red-200',
      available: 'bg-green-100 text-green-800 border-green-200',
      busy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return badgeMap[variant as keyof typeof badgeMap] || badgeMap.info;
  };

  // Skeleton loader
  if (skeleton || loading) {
    return (
      <div className={combineClasses(
        'animate-pulse bg-gray-200',
        BORDER_RADIUS.card,
        cardStyles.size.padding,
        cardStyles.size.minHeight,
        className
      )}>
        <div className="space-y-3">
          {image && (
            <div className={combineClasses(
              'bg-gray-300 rounded',
              layout === 'horizontal' ? 'w-16 h-16' : 'w-full h-32'
            )}></div>
          )}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: showHoverEffect ? { y: -2, scale: 1.02 } : {},
    tap: { scale: 0.98 },
  };

  // Card content
  const cardContent = (
    <>
      {/* Badge */}
      {badge && (
        <div className={combineClasses(
          'absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full border',
          getBadgeStyles(badge.variant)
        )}>
          {badge.text}
        </div>
      )}

      {/* Content layout */}
      <div className={combineClasses(
        'flex',
        layout === 'horizontal' ? 'flex-row space-x-4' : 'flex-col space-y-3'
      )}>
        {/* Image */}
        {image && (
          <div className={layout === 'horizontal' ? 'flex-shrink-0' : 'w-full'}>
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              width={layout === 'horizontal' ? cardStyles.size.imageSize.width : undefined}
              height={layout === 'horizontal' ? cardStyles.size.imageSize.height : 120}
              priority={image.priority}
              medicalContext={medicalContext}
              className={layout === 'horizontal' ? 'rounded-full' : 'w-full object-cover'}
            />
          </div>
        )}

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="font-semibold text-gray-900 truncate mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </>
  );

  // Base card classes
  const baseCardClasses = combineClasses(
    'relative bg-white',
    BORDER_RADIUS.card,
    cardStyles.priority.shadow,
    cardStyles.priority.border,
    cardStyles.size.padding,
    cardStyles.size.minHeight,
    'transition-all',
    ANIMATIONS.normal,
    interactive && TOUCH_TARGETS.interactive,
    className
  );

  // Interactive card (button or link)
  if (interactive && (onClick || href)) {
    const Component = href ? 'a' : 'button';
    const props = href ? { href } : { onClick };

    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        transition={{ duration: 0.2 }}
      >
        <Component
          className={combineClasses(
            baseCardClasses,
            'block w-full text-left cursor-pointer',
            showHoverEffect && 'hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
          aria-label={ariaLabel || title}
          {...props}
        >
          {cardContent}
        </Component>
      </motion.div>
    );
  }

  // Static card
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.2 }}
      className={baseCardClasses}
      aria-label={ariaLabel}
    >
      {cardContent}
    </motion.div>
  );
});

EnhancedMedicalCard.displayName = 'EnhancedMedicalCard';

export default EnhancedMedicalCard;

// Medical card presets for common use cases
export const MedicalCardPresets = {
  doctorCard: {
    medicalContext: 'doctor' as const,
    size: 'medium' as const,
    layout: 'vertical' as const,
    interactive: true,
    showHoverEffect: true,
  },
  departmentCard: {
    medicalContext: 'department' as const,
    size: 'large' as const,
    layout: 'vertical' as const,
    interactive: true,
    showHoverEffect: true,
  },
  serviceCard: {
    medicalContext: 'service' as const,
    size: 'medium' as const,
    layout: 'horizontal' as const,
    interactive: true,
    showHoverEffect: true,
  },
  emergencyCard: {
    medicalContext: 'emergency' as const,
    priority: 'high' as const,
    size: 'large' as const,
    layout: 'vertical' as const,
    interactive: true,
    showHoverEffect: true,
    badge: {
      text: 'Khẩn cấp',
      variant: 'emergency' as const,
    },
  },
};
