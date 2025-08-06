/**
 * Universal Footer Component
 * Fallback footer for web and other platforms
 */

import React, { memo } from 'react';
import { useRouteHandle } from '@/hooks';
import { BaseFooter } from './BaseFooter';
import { BaseFooterProps } from './types';
import { DIMENSIONS, WEB_STYLES } from './constants';
import { createNavigationItems } from './navigation-items';
import { createEnhancedMedicalNavigationItems } from './medical-navigation-icons';

interface UniversalFooterProps extends Omit<BaseFooterProps, 'items'> {
  items?: BaseFooterProps['items'];
  medicalContext?: {
    emergencyMode?: boolean;
    trustMode?: boolean;
    appointmentCount?: number;
    urgentNotifications?: number;
    healthStatus?: 'excellent' | 'good' | 'warning' | 'critical';
    trustLevel?: 'verified' | 'certified' | 'secure';
  };
}

// Enhanced Universal Footer Component with Medical Theming
export const UniversalFooter: React.FC<UniversalFooterProps> = memo(
  ({ items, deviceInfo, platformStyles = WEB_STYLES, medicalContext = {} }) => {
    const [handle] = useRouteHandle();

    // Use enhanced medical navigation items if none provided
    const navigationItems = items || createEnhancedMedicalNavigationItems('web', medicalContext);

    // Early return if back navigation is active
    if (handle.back) {
      return null;
    }

    return (
      <BaseFooter
        items={navigationItems}
        deviceInfo={deviceInfo}
        platformStyles={platformStyles}
        dimensions={DIMENSIONS.web}
        className="universal-footer"
        medicalContext={medicalContext}
      />
    );
  }
);

UniversalFooter.displayName = 'UniversalFooter';

export default UniversalFooter;
