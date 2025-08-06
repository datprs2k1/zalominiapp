/**
 * Mobile Test Page
 * Simple test page to verify enhanced mobile components
 */

import React from 'react';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import EnhancedMobileNavigation from '@/components/enhanced-mobile-navigation';
import { EnhancedMobileButton } from '@/components/enhanced-mobile-button';
import { EnhancedMobileCard } from '@/components/enhanced-mobile-card';
import { MedicalIcons } from '@/components/icons/medical-icons';

const MobileTestPage: React.FC = () => {
  const { deviceInfo, getPlatformClasses } = useEnhancedMobile();

  // Test navigation items
  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <MedicalIcons.Hospital size="md" />,
      path: '/',
    },
    {
      id: 'services',
      label: 'Services',
      icon: <MedicalIcons.MedicalCross size="md" />,
      path: '/services',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <MedicalIcons.User size="md" />,
      path: '/profile',
    },
  ];

  return (
    <div className={getPlatformClasses('mobile-test-page p-4')}>
      <h1 className="text-2xl font-bold mb-4">Mobile Components Test</h1>
      
      {/* Device Info */}
      <EnhancedMobileCard variant="outlined" className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Device Information</h2>
        <p>Platform: {deviceInfo.platform}</p>
        <p>Screen Size: {deviceInfo.screenSize}</p>
        <p>Orientation: {deviceInfo.orientation}</p>
        <p>Touch Support: {deviceInfo.isTouch ? 'Yes' : 'No'}</p>
      </EnhancedMobileCard>

      {/* Test Buttons */}
      <EnhancedMobileCard variant="elevated" className="mb-4">
        <h2 className="text-lg font-semibold mb-4">Enhanced Buttons</h2>
        <div className="space-y-3">
          <EnhancedMobileButton variant="primary" fullWidth>
            Primary Button
          </EnhancedMobileButton>
          <EnhancedMobileButton variant="secondary" fullWidth>
            Secondary Button
          </EnhancedMobileButton>
          <EnhancedMobileButton variant="danger" fullWidth>
            Danger Button
          </EnhancedMobileButton>
        </div>
      </EnhancedMobileCard>

      {/* Test Cards */}
      <EnhancedMobileCard variant="filled" className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Interactive Card</h2>
        <p>This is a test card with enhanced mobile interactions.</p>
      </EnhancedMobileCard>

      {/* Test Navigation */}
      <div className="mb-20">
        <h2 className="text-lg font-semibold mb-4">Enhanced Navigation</h2>
        <p>The navigation component should appear at the bottom of the screen.</p>
      </div>

      {/* Enhanced Mobile Navigation */}
      <EnhancedMobileNavigation 
        items={navigationItems}
        onItemPress={(item) => {
          console.log('Navigation item pressed:', item.label);
        }}
      />
    </div>
  );
};

export default MobileTestPage;
