/**
 * Main Footer Component
 * Automatically detects platform and renders appropriate footer
 */

import React, { memo, Suspense, lazy } from 'react';
import { useDeviceInfo } from './footer/hooks';
import { getPlatformStyles } from './footer/utils';
import { createNavigationItems } from './footer/navigation-items';

// Lazy load platform-specific footers for better performance
const IOSFooter = lazy(() => import('./footer/iOSFooter').then((m) => ({ default: m.default })));
const AndroidFooter = lazy(() => import('./footer/AndroidFooter').then((m) => ({ default: m.default })));
const UniversalFooter = lazy(() => import('./footer/UniversalFooter').then((m) => ({ default: m.default })));

// Loading fallback component
const FooterSkeleton = () => (
  <div
    style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '83px',
      backgroundColor: 'rgba(248, 248, 248, 0.94)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}
  >
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        height: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 16px',
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  </div>
);

// Medical Context Interface
interface FooterMedicalContext {
  emergencyMode?: boolean;
  trustMode?: boolean;
  appointmentCount?: number;
  urgentNotifications?: number;
  healthStatus?: 'excellent' | 'good' | 'warning' | 'critical';
  trustLevel?: 'verified' | 'certified' | 'secure';
}

interface FooterProps {
  medicalContext?: FooterMedicalContext;
}

// Enhanced Main footer component with medical theming
const Footer = memo<FooterProps>(({ medicalContext = {} }) => {
  const deviceInfo = useDeviceInfo();
  const platformStyles = getPlatformStyles(deviceInfo.platform);
  const navigationItems = createNavigationItems(deviceInfo.platform);

  const commonProps = {
    items: navigationItems,
    deviceInfo,
    platformStyles,
    medicalContext,
  };

  // Render platform-specific footer
  const renderFooter = () => {
    switch (deviceInfo.platform) {
      case 'ios':
        return <IOSFooter {...commonProps} />;
      case 'android':
        return <AndroidFooter {...commonProps} />;
      default:
        return <UniversalFooter {...commonProps} />;
    }
  };

  return <Suspense fallback={<FooterSkeleton />}>{renderFooter()}</Suspense>;
});

Footer.displayName = 'Footer';

export default Footer;
