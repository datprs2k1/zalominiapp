import React, { memo, useMemo, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { combineClasses } from '@/styles/medical-design-system';
import { MedicalSkeleton, MedicalSkeletonGroup } from './enhanced-medical-skeleton';
import { AccessibleMedicalSkeleton } from './accessible-medical-skeleton';

// ===== ADVANCED PATTERN TYPES =====

interface ContentAwareSkeletonProps {
  contentType: 'doctor' | 'service' | 'department' | 'appointment' | 'news' | 'patient';
  layout?: 'card' | 'list' | 'grid' | 'detail' | 'compact';
  showImage?: boolean;
  showActions?: boolean;
  className?: string;
  animated?: boolean;
}

interface ProgressiveSkeletonProps {
  stages: Array<{
    name: string;
    duration: number;
    content: React.ReactNode;
  }>;
  className?: string;
  onStageComplete?: (stageName: string) => void;
}

interface SmartSkeletonProps {
  actualContent?: React.ReactNode;
  isLoading: boolean;
  adaptToContent?: boolean;
  className?: string;
}

// ===== CONTENT-AWARE SKELETON PATTERNS =====

/**
 * Doctor Profile Skeleton - Matches actual doctor card layout
 */
export const DoctorProfileSkeleton = memo<{
  layout?: 'card' | 'list' | 'detail';
  className?: string;
  animated?: boolean;
}>(({ layout = 'card', className = '', animated = true }) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  if (layout === 'detail') {
    return (
      <MedicalSkeletonGroup ariaLabel="Đang tải thông tin chi tiết bác sĩ" className={className}>
        {/* Doctor Header */}
        <div className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-blue-100">
          <MedicalSkeleton
            variant="primary"
            width="w-24"
            height="h-24"
            shape="circle"
            animated={shouldAnimate}
            ariaLabel="Đang tải ảnh bác sĩ..."
          />
          <div className="flex-1 space-y-3">
            <MedicalSkeleton variant="primary" height="h-6" width="w-48" animated={shouldAnimate} delay={0.1} />
            <MedicalSkeleton variant="secondary" height="h-4" width="w-32" animated={shouldAnimate} delay={0.2} />
            <MedicalSkeleton variant="neutral" height="h-4" width="w-64" animated={shouldAnimate} delay={0.3} />
          </div>
        </div>

        {/* Specializations */}
        <div className="space-y-3">
          <MedicalSkeleton variant="primary" height="h-5" width="w-32" animated={shouldAnimate} delay={0.4} />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <MedicalSkeleton
                key={i}
                variant="secondary"
                height="h-8"
                width="w-20"
                shape="pill"
                animated={shouldAnimate}
                delay={0.5 + i * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Experience & Education */}
        <div className="space-y-4">
          <MedicalSkeleton variant="primary" height="h-5" width="w-28" animated={shouldAnimate} delay={0.8} />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <MedicalSkeleton variant="neutral" height="h-4" width="w-full" animated={shouldAnimate} delay={0.9 + i * 0.1} />
              <MedicalSkeleton variant="neutral" height="h-4" width="w-3/4" animated={shouldAnimate} delay={1.0 + i * 0.1} />
            </div>
          ))}
        </div>
      </MedicalSkeletonGroup>
    );
  }

  if (layout === 'list') {
    return (
      <div className={combineClasses('flex items-center space-x-4 p-4 bg-white rounded-lg border border-blue-100', className)}>
        <MedicalSkeleton
          variant="primary"
          width="w-16"
          height="h-16"
          shape="circle"
          animated={shouldAnimate}
          ariaLabel="Đang tải ảnh bác sĩ..."
        />
        <div className="flex-1 space-y-2">
          <MedicalSkeleton variant="primary" height="h-5" width="w-40" animated={shouldAnimate} delay={0.1} />
          <MedicalSkeleton variant="secondary" height="h-4" width="w-32" animated={shouldAnimate} delay={0.2} />
          <MedicalSkeleton variant="neutral" height="h-3" width="w-48" animated={shouldAnimate} delay={0.3} />
        </div>
        <div className="space-y-2">
          <MedicalSkeleton variant="primary" height="h-8" width="w-20" shape="pill" animated={shouldAnimate} delay={0.4} />
        </div>
      </div>
    );
  }

  // Default card layout
  return (
    <div className={combineClasses('p-4 bg-white rounded-xl border border-blue-100 space-y-4', className)}>
      <div className="flex items-center space-x-3">
        <MedicalSkeleton
          variant="primary"
          width="w-12"
          height="h-12"
          shape="circle"
          animated={shouldAnimate}
          ariaLabel="Đang tải ảnh bác sĩ..."
        />
        <div className="flex-1 space-y-2">
          <MedicalSkeleton variant="primary" height="h-4" width="w-32" animated={shouldAnimate} delay={0.1} />
          <MedicalSkeleton variant="secondary" height="h-3" width="w-24" animated={shouldAnimate} delay={0.2} />
        </div>
      </div>
      <MedicalSkeleton variant="neutral" height="h-3" width="w-full" animated={shouldAnimate} delay={0.3} />
      <MedicalSkeleton variant="neutral" height="h-3" width="w-4/5" animated={shouldAnimate} delay={0.4} />
      <div className="flex space-x-2 pt-2">
        <MedicalSkeleton variant="primary" height="h-8" width="w-16" shape="pill" animated={shouldAnimate} delay={0.5} />
        <MedicalSkeleton variant="neutral" height="h-8" width="w-12" shape="pill" animated={shouldAnimate} delay={0.6} />
      </div>
    </div>
  );
});

/**
 * Medical Service Skeleton - Matches service card layout
 */
export const MedicalServiceSkeleton = memo<{
  layout?: 'card' | 'list' | 'grid';
  showPrice?: boolean;
  className?: string;
  animated?: boolean;
}>(({ layout = 'card', showPrice = true, className = '', animated = true }) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  if (layout === 'grid') {
    return (
      <div className={combineClasses('p-4 bg-white rounded-xl border border-green-100 space-y-3', className)}>
        <MedicalSkeleton
          variant="secondary"
          height="h-32"
          width="w-full"
          shape="rounded"
          animated={shouldAnimate}
          ariaLabel="Đang tải hình ảnh dịch vụ..."
        />
        <MedicalSkeleton variant="secondary" height="h-5" width="w-3/4" animated={shouldAnimate} delay={0.1} />
        <MedicalSkeleton variant="neutral" height="h-4" width="w-full" animated={shouldAnimate} delay={0.2} />
        <MedicalSkeleton variant="neutral" height="h-4" width="w-5/6" animated={shouldAnimate} delay={0.3} />
        {showPrice && (
          <div className="flex justify-between items-center pt-2">
            <MedicalSkeleton variant="primary" height="h-6" width="w-20" animated={shouldAnimate} delay={0.4} />
            <MedicalSkeleton variant="secondary" height="h-8" width="w-16" shape="pill" animated={shouldAnimate} delay={0.5} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={combineClasses('flex space-x-4 p-4 bg-white rounded-lg border border-green-100', className)}>
      <MedicalSkeleton
        variant="secondary"
        width="w-20"
        height="h-20"
        shape="rounded"
        animated={shouldAnimate}
        ariaLabel="Đang tải icon dịch vụ..."
      />
      <div className="flex-1 space-y-2">
        <MedicalSkeleton variant="secondary" height="h-5" width="w-48" animated={shouldAnimate} delay={0.1} />
        <MedicalSkeleton variant="neutral" height="h-4" width="w-full" animated={shouldAnimate} delay={0.2} />
        <MedicalSkeleton variant="neutral" height="h-4" width="w-3/4" animated={shouldAnimate} delay={0.3} />
        {showPrice && (
          <MedicalSkeleton variant="primary" height="h-5" width="w-24" animated={shouldAnimate} delay={0.4} />
        )}
      </div>
    </div>
  );
});

/**
 * Appointment Skeleton - Matches appointment card layout
 */
export const AppointmentSkeleton = memo<{
  layout?: 'card' | 'list' | 'compact';
  showStatus?: boolean;
  className?: string;
  animated?: boolean;
}>(({ layout = 'card', showStatus = true, className = '', animated = true }) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  return (
    <div className={combineClasses('p-4 bg-white rounded-xl border border-blue-100 space-y-3', className)}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <MedicalSkeleton variant="primary" height="h-5" width="w-32" animated={shouldAnimate} />
          <MedicalSkeleton variant="neutral" height="h-4" width="w-24" animated={shouldAnimate} delay={0.1} />
        </div>
        {showStatus && (
          <MedicalSkeleton variant="secondary" height="h-6" width="w-16" shape="pill" animated={shouldAnimate} delay={0.2} />
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <MedicalSkeleton
          variant="primary"
          width="w-10"
          height="h-10"
          shape="circle"
          animated={shouldAnimate}
          delay={0.3}
        />
        <div className="space-y-1">
          <MedicalSkeleton variant="primary" height="h-4" width="w-28" animated={shouldAnimate} delay={0.4} />
          <MedicalSkeleton variant="neutral" height="h-3" width="w-20" animated={shouldAnimate} delay={0.5} />
        </div>
      </div>

      <div className="flex space-x-2 pt-2">
        <MedicalSkeleton variant="primary" height="h-8" width="w-20" shape="pill" animated={shouldAnimate} delay={0.6} />
        <MedicalSkeleton variant="neutral" height="h-8" width="w-16" shape="pill" animated={shouldAnimate} delay={0.7} />
      </div>
    </div>
  );
});

/**
 * Progressive Loading Skeleton - Shows different stages of loading
 */
export const ProgressiveMedicalSkeleton = memo<ProgressiveSkeletonProps>(({
  stages,
  className = '',
  onStageComplete,
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (currentStage >= stages.length) return;

    const timer = setTimeout(() => {
      onStageComplete?.(stages[currentStage].name);
      setCurrentStage(prev => prev + 1);
    }, stages[currentStage].duration);

    return () => clearTimeout(timer);
  }, [currentStage, stages, onStageComplete]);

  const currentStageData = stages[currentStage] || stages[stages.length - 1];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.2 : 0.4 }}
      role="status"
      aria-label={`Đang tải: ${currentStageData.name}`}
    >
      {currentStageData.content}
    </motion.div>
  );
});

/**
 * Content-Aware Skeleton Factory
 */
export const ContentAwareSkeleton = memo<ContentAwareSkeletonProps>(({
  contentType,
  layout = 'card',
  showImage = true,
  showActions = true,
  className = '',
  animated = true,
}) => {
  const skeletonProps = { layout, className, animated };

  switch (contentType) {
    case 'doctor':
      return <DoctorProfileSkeleton {...skeletonProps} />;
    
    case 'service':
      return <MedicalServiceSkeleton {...skeletonProps} showPrice={showActions} />;
    
    case 'appointment':
      return <AppointmentSkeleton {...skeletonProps} showStatus={showActions} />;
    
    case 'department':
      return (
        <div className={combineClasses('p-4 bg-white rounded-xl border border-green-100 space-y-3', className)}>
          {showImage && (
            <MedicalSkeleton variant="secondary" height="h-24" width="w-full" shape="rounded" animated={animated} />
          )}
          <MedicalSkeleton variant="secondary" height="h-5" width="w-3/4" animated={animated} delay={0.1} />
          <MedicalSkeleton variant="neutral" height="h-4" width="w-full" animated={animated} delay={0.2} />
          <MedicalSkeleton variant="neutral" height="h-4" width="w-5/6" animated={animated} delay={0.3} />
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <MedicalSkeleton variant="secondary" height="h-8" width="w-20" shape="pill" animated={animated} delay={0.4} />
            </div>
          )}
        </div>
      );
    
    case 'news':
      return (
        <div className={combineClasses('p-4 bg-white rounded-xl border border-gray-100 space-y-3', className)}>
          {showImage && (
            <MedicalSkeleton variant="neutral" height="h-32" width="w-full" shape="rounded" animated={animated} />
          )}
          <MedicalSkeleton variant="neutral" height="h-5" width="w-4/5" animated={animated} delay={0.1} />
          <MedicalSkeleton variant="neutral" height="h-4" width="w-full" animated={animated} delay={0.2} />
          <MedicalSkeleton variant="neutral" height="h-4" width="w-3/4" animated={animated} delay={0.3} />
          <div className="flex justify-between items-center pt-2">
            <MedicalSkeleton variant="neutral" height="h-3" width="w-20" animated={animated} delay={0.4} />
            {showActions && (
              <MedicalSkeleton variant="primary" height="h-6" width="w-16" shape="pill" animated={animated} delay={0.5} />
            )}
          </div>
        </div>
      );
    
    default:
      return (
        <div className={combineClasses('p-4 bg-white rounded-xl border border-blue-100 space-y-3', className)}>
          <MedicalSkeleton variant="primary" height="h-5" width="w-3/4" animated={animated} />
          <MedicalSkeleton variant="neutral" height="h-4" width="w-full" animated={animated} delay={0.1} />
          <MedicalSkeleton variant="neutral" height="h-4" width="w-5/6" animated={animated} delay={0.2} />
        </div>
      );
  }
});

// Set display names for better debugging
DoctorProfileSkeleton.displayName = 'DoctorProfileSkeleton';
MedicalServiceSkeleton.displayName = 'MedicalServiceSkeleton';
AppointmentSkeleton.displayName = 'AppointmentSkeleton';
ProgressiveMedicalSkeleton.displayName = 'ProgressiveMedicalSkeleton';
ContentAwareSkeleton.displayName = 'ContentAwareSkeleton';

export default ContentAwareSkeleton;
