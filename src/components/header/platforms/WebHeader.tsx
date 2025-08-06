/**
 * Web Header Component
 * Optimized for desktop and web browsers with enhanced features
 */

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { useRouteHandle } from '@/hooks';
import UserProfile from '../../user-profile';
import { MedicalIcons } from '../../icons/medical-icons';
import { PlatformHeaderProps } from '../types';
import { useOptimizedHeaderAnimations, useOptimizedHeaderNavigation } from '../OptimizedHeaderProvider';
import { BaseHeader } from './BaseHeader';
import { Logo } from '../components/Logo';
import { Branding } from '../components/Branding';
import { BackButton } from '../components/BackButton';
import { Title } from '../components/Title';
import { HEADER_HEIGHTS, HEADER_STYLES } from '../constants';

// Medical background pattern for web
const MedicalBackgroundPattern: React.FC = memo(() => (
  <div className="absolute inset-0 opacity-[0.02] md:opacity-[0.03]">
    <svg width="100%" height="100%" viewBox="0 0 60 60" className="w-full h-full">
      <defs>
        <pattern id="hospital-cross" patternUnits="userSpaceOnUse" width="40" height="40">
          <path d="M16 10h8v20h-8zM10 16h20v8H10z" fill="#2563eb" opacity="0.3" />
          <circle cx="20" cy="20" r="2" fill="#059669" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hospital-cross)" />
    </svg>
  </div>
));

MedicalBackgroundPattern.displayName = 'MedicalBackgroundPattern';

// Web-specific header content
const WebHeaderContent: React.FC<{ deviceInfo: any; showMainHeader: boolean }> = memo(
  ({ deviceInfo, showMainHeader }) => {
    const location = useLocation();
    const [handle] = useRouteHandle();
    const { prefersReducedMotion, duration } = useOptimizedHeaderAnimations();
    const { handleNavigation } = useOptimizedHeaderNavigation();

    // Determine what to show
    const showBack = useMemo(() => location.key !== 'default' && handle?.back !== false, [location.key, handle?.back]);

    // Web-specific height based on device
    const headerHeight = useMemo(() => {
      const heights = HEADER_HEIGHTS.web;
      if (deviceInfo.screenSize === 'small') return heights.compact;
      if (deviceInfo.screenSize === 'large') return heights.large;
      return heights.regular;
    }, [deviceInfo.screenSize]);

    return (
      <>
        {/* Enhanced Medical Background for Web */}
        {showMainHeader && (
          <motion.div
            className="absolute inset-0 z-0 overflow-hidden"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: duration * 1.5,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            {/* Enhanced Modern Hospital Gradient */}
            <div className="absolute h-[120px] md:h-[160px] lg:h-[200px] w-full" style={HEADER_STYLES} />

            {/* Subtle overlay for enhanced text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40" />

            {/* Enhanced Medical Pattern */}
            <MedicalBackgroundPattern />

            {/* Enhanced Professional Medical Icons - Web Only */}
            {!prefersReducedMotion && (
              <>
                {/* Stethoscope Icon - Top Right */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 opacity-4 md:opacity-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                    className="drop-shadow-sm"
                  >
                    <MedicalIcons.Stethoscope
                      size="sm"
                      className="text-cyan-500/40 hover:text-cyan-500/60 transition-colors duration-300"
                    />
                  </motion.div>
                </div>

                {/* Heart Rate Icon - Top Left */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8 opacity-3 md:opacity-5 hidden sm:block">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="drop-shadow-sm"
                  >
                    <MedicalIcons.HeartRate
                      size="xs"
                      className="text-green-500/30 hover:text-green-500/50 transition-colors duration-300"
                    />
                  </motion.div>
                </div>

                {/* Medical Cross Icon - Bottom Right */}
                <div className="absolute bottom-4 right-6 md:bottom-6 md:right-8 opacity-3 md:opacity-4 hidden md:block">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="drop-shadow-sm"
                  >
                    <MedicalIcons.MedicalCross
                      size="xs"
                      className="text-blue-500/30 hover:text-blue-500/50 transition-colors duration-300"
                    />
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Header Content */}
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
                    <Logo size="large" animated={!prefersReducedMotion} />
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
      </>
    );
  }
);

WebHeaderContent.displayName = 'WebHeaderContent';

// Web Header component
export const WebHeader: React.FC<PlatformHeaderProps> = memo((props) => {
  const { deviceInfo, platformStyles, className = '', ...rest } = props;
  const [handle] = useRouteHandle();

  const showMainHeader = useMemo(() => !handle?.back, [handle?.back]);

  // Web-specific styling
  const webClasses = useMemo(
    () =>
      `
    web-header
    bg-white
    ${showMainHeader ? '' : 'border-b border-gray-200/60'}
    ${className}
  `
        .replace(/\s+/g, ' ')
        .trim(),
    [className, showMainHeader]
  );

  return (
    <BaseHeader
      {...rest}
      platform="web"
      deviceInfo={deviceInfo}
      platformStyles={platformStyles}
      className={webClasses}
      enableScrollEffect={true}
    >
      <WebHeaderContent deviceInfo={deviceInfo} showMainHeader={showMainHeader} />
    </BaseHeader>
  );
});

WebHeader.displayName = 'WebHeader';
