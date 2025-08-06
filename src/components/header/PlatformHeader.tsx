/**
 * Platform Header Component
 * Automatically selects the appropriate header implementation based on platform
 */

import React, { memo } from 'react';

import { useOptimizedHeaderPlatform } from './OptimizedHeaderProvider';
import { HeaderProps } from './types';
import { IOSHeader } from './platforms/IOSHeader';
import { AndroidHeader } from './platforms/AndroidHeader';
import { WebHeader } from './platforms/WebHeader';
import { SkipLink } from './components/SkipLink';
import { NavigationStatus } from './components/NavigationStatus';

// Platform header component
export const PlatformHeader: React.FC<HeaderProps> = memo((props) => {
  const { deviceInfo, platformStyles } = useOptimizedHeaderPlatform();

  // Select platform-specific header implementation
  const HeaderComponent = (() => {
    switch (deviceInfo.platform) {
      case 'ios':
        return IOSHeader;
      case 'android':
        return AndroidHeader;
      case 'web':
      default:
        return WebHeader;
    }
  })();

  return (
    <>
      {/* Skip Link for Keyboard Navigation - WCAG 2.1 AA Compliance */}
      <SkipLink />

      {/* ARIA Live Region for Navigation Status */}
      <NavigationStatus />

      {/* Platform-specific header */}
      <HeaderComponent
        {...props}
        platform={deviceInfo.platform}
        deviceInfo={deviceInfo}
        platformStyles={platformStyles}
      />
    </>
  );
});

PlatformHeader.displayName = 'PlatformHeader';
