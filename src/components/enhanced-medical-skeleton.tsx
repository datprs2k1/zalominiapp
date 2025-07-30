import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { combineClasses, MEDICAL_SKELETON_COLORS } from '@/styles/medical-design-system';
import { useReducedMotion } from 'framer-motion';
import { SkeletonSafeWrapper } from './skeleton-error-boundary';

// ===== TYPE DEFINITIONS =====

interface MedicalSkeletonProps {
  variant?: 'primary' | 'secondary' | 'neutral' | 'fast';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'rectangle' | 'circle' | 'rounded' | 'pill';
  width?: string;
  height?: string;
  className?: string;
  animated?: boolean;
  ariaLabel?: string;
  delay?: number;
}

interface MedicalSkeletonGroupProps {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
  staggerDelay?: number;
}

interface MedicalSkeletonCardProps {
  variant?: 'primary' | 'secondary' | 'neutral';
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
  className?: string;
  animated?: boolean;
  ariaLabel?: string;
}

// ===== UTILITY FUNCTIONS =====

const getSizeClasses = (size: MedicalSkeletonProps['size']) => {
  switch (size) {
    case 'sm':
      return 'h-3';
    case 'md':
      return 'h-4';
    case 'lg':
      return 'h-6';
    case 'xl':
      return 'h-8';
    default:
      return 'h-4';
  }
};

const getShapeClasses = (shape: MedicalSkeletonProps['shape']) => {
  switch (shape) {
    case 'circle':
      return 'rounded-full aspect-square';
    case 'rounded':
      return 'rounded-lg';
    case 'pill':
      return 'rounded-full';
    case 'rectangle':
    default:
      return 'rounded';
  }
};

const getVariantClasses = (
  variant: MedicalSkeletonProps['variant'],
  animated: boolean,
  prefersReducedMotion: boolean
) => {
  const baseClasses = 'skeleton-optimized';

  if (prefersReducedMotion || !animated) {
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-blue-50`;
      case 'secondary':
        return `${baseClasses} bg-green-50`;
      case 'neutral':
        return `${baseClasses} bg-gray-50`;
      case 'fast':
      default:
        return `${baseClasses} bg-blue-50 animate-pulse`;
    }
  }

  switch (variant) {
    case 'primary':
      return `${baseClasses} skeleton-medical-primary`;
    case 'secondary':
      return `${baseClasses} skeleton-medical-secondary`;
    case 'neutral':
      return `${baseClasses} skeleton-medical-neutral`;
    case 'fast':
    default:
      return `${baseClasses} skeleton-medical-primary animate-skeleton-fast`;
  }
};

// ===== MAIN COMPONENTS =====

/**
 * Enhanced Medical Skeleton Component
 * Optimized for healthcare applications with medical color palette
 */
export const MedicalSkeleton = memo<MedicalSkeletonProps>(
  ({
    variant = 'primary',
    size = 'md',
    shape = 'rectangle',
    width = 'w-full',
    height,
    className = '',
    animated = true,
    ariaLabel = 'Đang tải nội dung y tế...',
    delay = 0,
  }) => {
    const prefersReducedMotion = useReducedMotion();

    const skeletonClasses = useMemo(() => {
      try {
        return combineClasses(
          getVariantClasses(variant, animated, prefersReducedMotion),
          getSizeClasses(size),
          getShapeClasses(shape),
          width,
          height || '',
          className
        );
      } catch (error) {
        console.warn('🏥 MedicalSkeleton class generation failed, using fallback:', error);
        return combineClasses('bg-blue-50 rounded animate-pulse skeleton-optimized', width, height || 'h-4');
      }
    }, [variant, size, shape, width, height, className, animated, prefersReducedMotion]);

    const animationProps = useMemo(() => {
      if (prefersReducedMotion || !animated) {
        return {};
      }

      try {
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: {
            duration: 0.3,
            delay: delay,
            ease: 'easeOut',
          },
        };
      } catch (error) {
        console.warn('🏥 MedicalSkeleton animation props failed, using static:', error);
        return {};
      }
    }, [prefersReducedMotion, animated, delay]);

    return (
      <SkeletonSafeWrapper
        componentName="MedicalSkeleton"
        fallbackHeight={height || 'h-4'}
        fallbackWidth={width}
        className={className}
      >
        <motion.div
          className={skeletonClasses}
          role="status"
          aria-label={ariaLabel}
          aria-hidden="true"
          data-skeleton-variant={variant}
          data-skeleton-animated={animated}
          {...animationProps}
        />
      </SkeletonSafeWrapper>
    );
  }
);

/**
 * Medical Skeleton Group Container
 * Provides consistent spacing and accessibility for skeleton groups
 */
export const MedicalSkeletonGroup = memo<MedicalSkeletonGroupProps>(
  ({ children, ariaLabel, className = '', staggerDelay = 0.1 }) => {
    const prefersReducedMotion = useReducedMotion();

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: prefersReducedMotion ? 0.2 : 0.4, ease: 'easeOut' },
      },
    };

    return (
      <motion.div
        className={combineClasses('space-y-4', className)}
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }
);

/**
 * Medical Skeleton Card
 * Pre-built card skeleton with medical styling
 */
export const MedicalSkeletonCard = memo<MedicalSkeletonCardProps>(
  ({
    variant = 'primary',
    showImage = true,
    showTitle = true,
    showDescription = true,
    showActions = false,
    className = '',
    animated = true,
    ariaLabel = 'Đang tải thẻ thông tin y tế...',
  }) => {
    return (
      <div
        className={combineClasses(
          'p-4 border border-blue-100 rounded-xl bg-white space-y-3',
          'shadow-sm hover:shadow-md transition-shadow duration-200',
          className
        )}
        role="status"
        aria-label={ariaLabel}
      >
        {showImage && (
          <MedicalSkeleton
            variant={variant}
            height="h-32"
            width="w-full"
            shape="rounded"
            animated={animated}
            ariaLabel="Đang tải hình ảnh y tế..."
          />
        )}

        {showTitle && (
          <div className="space-y-2">
            <MedicalSkeleton
              variant={variant}
              height="h-5"
              width="w-3/4"
              animated={animated}
              delay={0.1}
              ariaLabel="Đang tải tiêu đề..."
            />
          </div>
        )}

        {showDescription && (
          <div className="space-y-2">
            <MedicalSkeleton
              variant={variant}
              height="h-4"
              width="w-full"
              animated={animated}
              delay={0.2}
              ariaLabel="Đang tải mô tả..."
            />
            <MedicalSkeleton variant={variant} height="h-4" width="w-5/6" animated={animated} delay={0.3} />
          </div>
        )}

        {showActions && (
          <div className="flex space-x-2 pt-2">
            <MedicalSkeleton
              variant={variant}
              height="h-8"
              width="w-20"
              shape="pill"
              animated={animated}
              delay={0.4}
              ariaLabel="Đang tải nút hành động..."
            />
            <MedicalSkeleton variant="neutral" height="h-8" width="w-16" shape="pill" animated={animated} delay={0.5} />
          </div>
        )}
      </div>
    );
  }
);

// ===== SPECIALIZED MEDICAL SKELETONS =====

/**
 * Medical List Item Skeleton
 */
export const MedicalListSkeleton = memo<{
  variant?: 'primary' | 'secondary' | 'neutral';
  showAvatar?: boolean;
  className?: string;
  animated?: boolean;
}>(({ variant = 'primary', showAvatar = true, className = '', animated = true }) => (
  <div className={combineClasses('flex items-center space-x-3 p-3', className)}>
    {showAvatar && (
      <MedicalSkeleton
        variant={variant}
        width="w-10"
        height="h-10"
        shape="circle"
        animated={animated}
        ariaLabel="Đang tải avatar..."
      />
    )}
    <div className="flex-1 space-y-2">
      <MedicalSkeleton
        variant={variant}
        height="h-4"
        width="w-1/2"
        animated={animated}
        delay={0.1}
        ariaLabel="Đang tải tên..."
      />
      <MedicalSkeleton
        variant="neutral"
        height="h-3"
        width="w-3/4"
        animated={animated}
        delay={0.2}
        ariaLabel="Đang tải thông tin..."
      />
    </div>
  </div>
));

/**
 * Medical Button Skeleton
 */
export const MedicalButtonSkeleton = memo<{
  variant?: 'primary' | 'secondary' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}>(({ variant = 'primary', size = 'md', className = '', animated = true }) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  };

  return (
    <MedicalSkeleton
      variant={variant}
      height={sizeClasses[size].split(' ')[0]}
      width={sizeClasses[size].split(' ')[1]}
      shape="pill"
      className={className}
      animated={animated}
      ariaLabel="Đang tải nút..."
    />
  );
});

// Set display names for better debugging
MedicalSkeleton.displayName = 'MedicalSkeleton';
MedicalSkeletonGroup.displayName = 'MedicalSkeletonGroup';
MedicalSkeletonCard.displayName = 'MedicalSkeletonCard';
MedicalListSkeleton.displayName = 'MedicalListSkeleton';
MedicalButtonSkeleton.displayName = 'MedicalButtonSkeleton';

export default MedicalSkeleton;
