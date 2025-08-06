/**
 * iOS Footer Component
 * Implements iOS Human Interface Guidelines for tab bar navigation
 */

import React, { memo } from 'react';
import { useRouteHandle } from '@/hooks';
import { BaseFooter } from './BaseFooter';
import { BaseFooterProps } from './types';
import { DIMENSIONS, IOS_STYLES } from './constants';
import { createNavigationItems } from './navigation-items';
import { createEnhancedMedicalNavigationItems } from './medical-navigation-icons';

interface IOSFooterProps extends Omit<BaseFooterProps, 'items'> {
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

// Enhanced iOS Footer Component with Medical Theming
export const IOSFooter: React.FC<IOSFooterProps> = memo(
  ({ items, deviceInfo, platformStyles = IOS_STYLES, medicalContext = {} }) => {
    const [handle] = useRouteHandle();

    // Use enhanced medical navigation items if none provided
    const navigationItems = items || createEnhancedMedicalNavigationItems('ios', medicalContext);

    // Early return if back navigation is active
    if (handle.back) {
      return null;
    }

    return (
      <BaseFooter
        items={navigationItems}
        deviceInfo={deviceInfo}
        platformStyles={platformStyles}
        dimensions={DIMENSIONS.ios}
        className="ios-footer rounded-bar"
        medicalContext={medicalContext}
      />
    );
  }
);

IOSFooter.displayName = 'IOSFooter';

export default IOSFooter;
