/**
 * Android Footer Component
 * Implements Material Design 3 principles for bottom navigation
 * Now uses iOS-style design for consistency
 */

import React, { memo } from 'react';
import { useRouteHandle } from '@/hooks';
import { BaseFooter } from './BaseFooter';
import { BaseFooterProps } from './types';
import { DIMENSIONS, ANDROID_STYLES } from './constants';
import { createNavigationItems } from './navigation-items';
import { createEnhancedMedicalNavigationItems } from './medical-navigation-icons';

interface AndroidFooterProps extends Omit<BaseFooterProps, 'items'> {
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

// Enhanced Android Footer Component with Medical Theming (iOS-styled for consistency)
export const AndroidFooter: React.FC<AndroidFooterProps> = memo(
  ({ items, deviceInfo, platformStyles = ANDROID_STYLES, medicalContext = {} }) => {
    const [handle] = useRouteHandle();

    // Use enhanced medical navigation items if none provided
    const navigationItems = items || createEnhancedMedicalNavigationItems('android', medicalContext);

    // Early return if back navigation is active
    if (handle.back) {
      return null;
    }

    return (
      <BaseFooter
        items={navigationItems}
        deviceInfo={deviceInfo}
        platformStyles={platformStyles}
        dimensions={DIMENSIONS.android}
        className="android-footer ios-styled rounded-bar"
        medicalContext={medicalContext}
      />
    );
  }
);

AndroidFooter.displayName = 'AndroidFooter';

export default AndroidFooter;
