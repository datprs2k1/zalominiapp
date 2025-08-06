/**
 * Android Header Component
 * Implements Material Design 3 principles for app bars
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
import { HEADER_HEIGHTS } from '../constants';

// Android-specific header content
const AndroidHeaderContent: React.FC<{ deviceInfo: any }> = memo(({ deviceInfo }) => {
  const location = useLocation();
  const [handle] = useRouteHandle();
  const { prefersReducedMotion, duration } = useOptimizedHeaderAnimations();
  const { handleNavigation } = useOptimizedHeaderNavigation();

  // Determine what to show
  const showMainHeader = useMemo(() => !handle?.back, [handle?.back]);
  const showBack = useMemo(() => location.key !== 'default' && handle?.back !== false, [location.key, handle?.back]);

  // Android-specific height based on device
  const headerHeight = useMemo(() => {
    const heights = HEADER_HEIGHTS.android;
    if (deviceInfo.screenSize === 'small') return heights.compact;
    if (deviceInfo.screenSize === 'large') return heights.large;
    return heights.regular;
  }, [deviceInfo.screenSize]);

  return (
    <div className="flex items-center justify-between relative z-20" style={{ minHeight: `${headerHeight}px` }}>
      {showMainHeader ? (
        <motion.div
          className="w-full"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: duration * 0.8,
                  delay: 0.05,
                  ease: [0.4, 0.0, 0.2, 1], // Material Design easing
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
          initial={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: duration * 0.8,
                  ease: [0.4, 0.0, 0.2, 1], // Material Design easing
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

AndroidHeaderContent.displayName = 'AndroidHeaderContent';

// Android Header component
export const AndroidHeader: React.FC<PlatformHeaderProps> = memo((props) => {
  const { deviceInfo, platformStyles, className = '', ...rest } = props;

  // Android-specific styling (Material Design 3)
  const androidClasses = useMemo(
    () =>
      `
    android-header
    bg-white
    border-b border-gray-200/60
    shadow-sm
    ${className}
  `
        .replace(/\s+/g, ' ')
        .trim(),
    [className]
  );

  return (
    <BaseHeader
      {...rest}
      platform="android"
      deviceInfo={deviceInfo}
      platformStyles={platformStyles}
      className={androidClasses}
      enableScrollEffect={true}
    >
      <AndroidHeaderContent deviceInfo={deviceInfo} />
    </BaseHeader>
  );
});

AndroidHeader.displayName = 'AndroidHeader';
