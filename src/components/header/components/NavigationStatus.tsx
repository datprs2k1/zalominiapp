/**
 * Navigation Status Component
 * Provides ARIA live region for navigation feedback
 */

import React, { memo } from 'react';
import { useOptimizedHeaderNavigation } from '../OptimizedHeaderProvider';
import { ACCESSIBILITY_LABELS } from '../constants';

// Navigation status props
interface NavigationStatusProps {
  className?: string;
  loadingMessage?: string;
}

// Navigation status component
export const NavigationStatus: React.FC<NavigationStatusProps> = memo(
  ({ className = '', loadingMessage = ACCESSIBILITY_LABELS.navigationStatus }) => {
    const { isNavigating } = useOptimizedHeaderNavigation();

    return (
      <div aria-live="polite" aria-atomic="true" className={`sr-only ${className}`} role="status">
        {isNavigating ? loadingMessage : ''}
      </div>
    );
  }
);

NavigationStatus.displayName = 'NavigationStatus';
