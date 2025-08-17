/**
 * Medical Skeleton Component
 * Skeleton loaders for content placeholders
 */

import React from 'react';
import { SkeletonProps } from './types';
import { cn } from '@/utils/cn';

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  variant = 'rectangular',
  animation = true,
  className,
  testId,
  ...props
}) => {
  // Base skeleton classes
  const baseClasses = [
    'bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200',
    animation && 'animate-skeleton',
  ];

  // Variant classes
  const variantClasses = {
    text: 'rounded-sm',
    rectangular: 'rounded-medical',
    circular: 'rounded-full',
  };

  // Style object for dimensions
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    backgroundSize: animation ? '400px 100%' : undefined,
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
      role="status"
      aria-label="Loading content"
      data-testid={testId}
      {...props}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonText: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="text" height="1rem" {...props} />
);

export const SkeletonAvatar: React.FC<Omit<SkeletonProps, 'variant'>> = ({ 
  width = 40, 
  height = 40, 
  ...props 
}) => (
  <Skeleton variant="circular" width={width} height={height} {...props} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-3 p-4', className)}>
    <div className="flex items-center gap-3">
      <SkeletonAvatar />
      <div className="flex-1 space-y-2">
        <SkeletonText width="60%" />
        <SkeletonText width="40%" />
      </div>
    </div>
    <div className="space-y-2">
      <SkeletonText />
      <SkeletonText width="80%" />
      <SkeletonText width="90%" />
    </div>
  </div>
);

export const SkeletonDoctorCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('card-medical space-y-4', className)}>
    <div className="flex flex-col items-center text-center space-y-3">
      <SkeletonAvatar width={80} height={80} />
      <div className="space-y-2">
        <SkeletonText width="120px" height="1.25rem" />
        <SkeletonText width="100px" />
      </div>
    </div>
    <div className="flex justify-between items-center">
      <SkeletonText width="80px" />
      <SkeletonText width="60px" />
    </div>
  </div>
);

export const SkeletonAppointmentCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('card-appointment space-y-4', className)}>
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <Skeleton width={20} height={20} variant="rectangular" />
        <SkeletonText width="80px" />
      </div>
      <SkeletonText width="60px" />
    </div>
    <div className="space-y-2">
      <SkeletonText width="140px" height="1.25rem" />
      <SkeletonText width="100px" />
    </div>
    <div className="space-y-1">
      <SkeletonText width="180px" />
      <SkeletonText width="120px" />
    </div>
    <div className="flex gap-2 pt-2">
      <Skeleton width="80px" height="36px" variant="rectangular" />
      <Skeleton width="80px" height="36px" variant="rectangular" />
      <Skeleton width="60px" height="36px" variant="rectangular" />
    </div>
  </div>
);

export const SkeletonServiceCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('card-medical space-y-4', className)}>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Skeleton width={48} height={48} variant="rectangular" />
        <div className="space-y-2">
          <SkeletonText width="120px" height="1.25rem" />
          <SkeletonText width="80px" />
        </div>
      </div>
      <Skeleton width={12} height={12} variant="circular" />
    </div>
    <div className="space-y-2">
      <SkeletonText />
      <SkeletonText width="80%" />
    </div>
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <SkeletonText width="60px" />
        <SkeletonText width="80px" />
      </div>
      <SkeletonText width="100px" height="1.25rem" />
    </div>
    <Skeleton width="100%" height="36px" variant="rectangular" />
  </div>
);

export const SkeletonList: React.FC<{ 
  count?: number; 
  itemHeight?: number;
  className?: string;
}> = ({ count = 5, itemHeight = 60, className }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center gap-3">
        <SkeletonAvatar width={40} height={40} />
        <div className="flex-1 space-y-2">
          <SkeletonText width="60%" />
          <SkeletonText width="40%" />
        </div>
        <SkeletonText width="80px" />
      </div>
    ))}
  </div>
);

export default Skeleton;
