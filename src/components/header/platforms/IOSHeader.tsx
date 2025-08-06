/**
 * iOS Header Component
 * Implements iOS Human Interface Guidelines for navigation bars
 */

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { useRouteHandle } from '@/hooks';
import UserProfile from '../../user-profile';
import { PlatformHeaderProps } from '../types';
import { useOptimizedHeaderAnimations, useOptimizedHeaderNavigation } from '../OptimizedHeaderProvider';
import { BaseHeader } from './BaseHeader';
import { Logo } from '../components/Logo';
import { Branding } from '../components/Branding';
import { BackButton } from '../components/BackButton';
import { Title } from '../components/Title';
import { MedicalStatus } from '../components/MedicalStatus';
import { HEADER_HEIGHTS, CSS_CLASSES } from '../constants';
import { MEDICAL_HEADER_STYLES, MEDICAL_TYPOGRAPHY, MEDICAL_ANIMATIONS, type HealthStatus } from '../medical-styles';
import { useDarkModeMedicalStyles } from '../dark-mode-support';

// Enhanced iOS-specific header content with medical features
const IOSHeaderContent: React.FC<{
  deviceInfo: any;
  healthStatus?: HealthStatus;
  showMedicalFeatures?: boolean;
}> = memo(({ deviceInfo, healthStatus = 'good', showMedicalFeatures = true }) => {
  const location = useLocation();
  const [handle] = useRouteHandle();
  const { prefersReducedMotion, duration } = useOptimizedHeaderAnimations();
  const { handleNavigation } = useOptimizedHeaderNavigation();
  const { isDarkMode, getBackgroundStyle, getTextStyle } = useDarkModeMedicalStyles();

  // Determine what to show
  const showMainHeader = useMemo(() => !handle?.back, [handle?.back]);
  const showBack = useMemo(() => location.key !== 'default' && handle?.back !== false, [location.key, handle?.back]);
  const isEmergencyMode = useMemo(() => healthStatus === 'critical', [healthStatus]);

  // iOS-specific height based on device
  const headerHeight = useMemo(() => {
    const heights = HEADER_HEIGHTS.ios;
    if (deviceInfo.screenSize === 'small') return heights.compact;
    if (deviceInfo.screenSize === 'large') return heights.large;
    return heights.regular;
  }, [deviceInfo.screenSize]);

  return (
    <div className="flex items-center justify-between relative z-20" style={{ minHeight: `${headerHeight}px` }}>
      {showMainHeader ? (
        <motion.div
          className="w-full"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: duration * 1.25,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          {handle.profile ? (
            <UserProfile />
          ) : (
            <div className="flex items-center justify-between px-2 md:px-4">
              <div className="flex items-center">
                <Logo size="medium" animated={!prefersReducedMotion} />
                <Branding />
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="flex items-center w-full"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          {showBack && <BackButton onNavigate={handleNavigation} />}

          <Title title={handle.title || ''} className="flex-1" truncate={true} />
        </motion.div>
      )}
    </div>
  );
});

IOSHeaderContent.displayName = 'IOSHeaderContent';

// iOS Header component
export const IOSHeader: React.FC<PlatformHeaderProps> = memo((props) => {
  const { deviceInfo, platformStyles, className = '', ...rest } = props;

  // iOS-specific styling
  const iosClasses = useMemo(
    () =>
      `
    ios-header
    backdrop-blur-md
    bg-white/95
    border-b border-gray-200/50
    ${className}
  `
        .replace(/\s+/g, ' ')
        .trim(),
    [className]
  );

  return (
    <BaseHeader
      {...rest}
      platform="ios"
      deviceInfo={deviceInfo}
      platformStyles={platformStyles}
      className={iosClasses}
      enableScrollEffect={true}
    >
      <IOSHeaderContent deviceInfo={deviceInfo} />
    </BaseHeader>
  );
});

IOSHeader.displayName = 'IOSHeader';
