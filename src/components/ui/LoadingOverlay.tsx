/**
 * Medical Loading Overlay Component
 * Full-screen loading overlay for page transitions
 */

import React from 'react';
import { cn } from '@/utils/cn';
import Loading from './Loading';

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  variant?: 'spinner' | 'dots';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backdrop?: 'light' | 'dark' | 'blur';
  className?: string;
  testId?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = 'Đang tải...',
  variant = 'spinner',
  size = 'lg',
  backdrop = 'blur',
  className,
  testId,
}) => {
  if (!isVisible) return null;

  // Backdrop classes
  const backdropClasses = {
    light: 'bg-white/80',
    dark: 'bg-neutral-900/80',
    blur: 'bg-white/80 backdrop-blur-medical',
  };

  return (
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center', backdropClasses[backdrop], className)}
      data-testid={testId}
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-medical-lg shadow-card-hover">
        <Loading variant={variant} size={size} />
        {text && <p className="text-neutral-700 font-medium text-center max-w-xs">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingOverlay;
