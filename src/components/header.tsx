import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useAtomValue } from 'jotai';
import { To, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

import { useRouteHandle } from '@/hooks';
import { customTitleState } from '@/state';
import { decodeHTML } from '@/utils/decodeHTML';
import { MEDICAL_COLOR_PALETTE } from '@/styles/unified-color-system';

import { BackIcon } from './icons/back';
import { MedicalIcons } from './icons/medical-icons';
import UserProfile from './user-profile';

// Types
interface HeaderErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface AnimatedMedicalIconProps {
  icon: React.ComponentType<any>;
  size: 'xs' | 'sm' | 'md';
  className: string;
  position: string;
  animation: {
    animate: Record<string, any>;
    transition: Record<string, any>;
  };
}

// Constants
const SKIP_LINK_ID = 'main-content';
const SCROLL_THRESHOLD = 10;
const NAVIGATION_TIMEOUT = 300;

// Accessibility labels
const ACCESSIBILITY_LABELS = {
  skipLink: 'Chuyển đến nội dung chính',
  navigationStatus: 'Đang chuyển trang...',
  mainHeader: 'Ứng dụng y tế Zalo - Trang chủ bệnh viện, điều hướng chính',
  logo: 'Logo bệnh viện - Ứng dụng y tế Zalo',
  logoDescription: 'Ứng dụng y tế chuyên nghiệp cung cấp dịch vụ chăm sóc sức khỏe đáng tin cậy',
  backButton: 'Quay lại trang trước - Điều hướng y tế. Nhấn Enter hoặc Space để kích hoạt',
  backButtonDescription: 'Nút điều hướng quay lại trang trước đó trong ứng dụng y tế',
  backButtonTitle: 'Quay lại trang trước',
} as const;

// Static style objects for better performance
const HEADER_STYLES = {
  background: `linear-gradient(135deg,
    ${MEDICAL_COLOR_PALETTE.medical.blue[500]}08 0%,
    ${MEDICAL_COLOR_PALETTE.neutral.white.soft} 35%,
    ${MEDICAL_COLOR_PALETTE.medical.green[500]}06 70%,
    ${MEDICAL_COLOR_PALETTE.medical.cyan[500]}04 100%)`,
} as const;

const LOGO_STYLES = {
  background: `linear-gradient(135deg, ${MEDICAL_COLOR_PALETTE.medical.blue[500]}, ${MEDICAL_COLOR_PALETTE.medical.blue[600]})`,
  boxShadow: `0 4px 12px ${MEDICAL_COLOR_PALETTE.medical.blue[500]}20, 0 2px 4px ${MEDICAL_COLOR_PALETTE.medical.blue[500]}10`,
} as const;

const BACK_BUTTON_STYLES = {
  backgroundColor: `${MEDICAL_COLOR_PALETTE.medical.blue[500]}10`,
  color: MEDICAL_COLOR_PALETTE.medical.blue[500],
  border: `1px solid ${MEDICAL_COLOR_PALETTE.medical.blue[500]}20`,
} as const;

// Memoized components for better performance
const ProfileHeader = memo(() => {
  return <UserProfile />;
});

const CustomTitle = memo(() => {
  const title = useAtomValue(customTitleState);
  return decodeHTML(title);
});

// Animated Medical Icon Component
const AnimatedMedicalIcon = memo(({ icon: Icon, size, className, position, animation }: AnimatedMedicalIconProps) => (
  <div className={position}>
    <motion.div animate={animation.animate} transition={animation.transition} className="drop-shadow-sm">
      <Icon size={size} className={className} />
    </motion.div>
  </div>
));

// Medical Background Pattern Component
const MedicalBackgroundPattern = memo(() => (
  <div className="absolute inset-0 opacity-[0.02] md:opacity-[0.03]">
    <svg width="100%" height="100%" viewBox="0 0 60 60" className="w-full h-full">
      <defs>
        <pattern id="hospital-cross" patternUnits="userSpaceOnUse" width="40" height="40">
          <path d="M16 10h8v20h-8zM10 16h20v8H10z" fill={MEDICAL_COLOR_PALETTE.medical.blue[500]} opacity="0.3" />
          <circle cx="20" cy="20" r="2" fill={MEDICAL_COLOR_PALETTE.medical.green[500]} opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hospital-cross)" />
    </svg>
  </div>
));

// Hospital Logo Component
const HospitalLogo = memo(({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => (
  <motion.div
    className="rounded-2xl p-3 mr-3 md:mr-4 min-h-[48px] min-w-[48px] md:min-h-[52px] md:min-w-[52px] lg:min-h-[56px] lg:min-w-[56px]
               flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300
               ring-2 ring-white/20 hover:ring-white/30"
    style={LOGO_STYLES}
    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
    transition={prefersReducedMotion ? {} : { duration: 0.15, ease: 'easeOut' }}
    role="img"
    aria-label={ACCESSIBILITY_LABELS.logo}
    aria-describedby="logo-description"
  >
    <svg
      className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 text-white drop-shadow-sm"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  </motion.div>
));

// Hospital Branding Component
const HospitalBranding = memo(() => (
  <div className="flex flex-col space-y-0.5">
    <span
      className="font-bold text-lg md:text-xl lg:text-2xl leading-tight tracking-tight"
      style={{ color: MEDICAL_COLOR_PALETTE.medical.blue[500] }}
    >
      Healthcare App
    </span>
    <span
      className="text-xs md:text-sm lg:text-base font-medium leading-tight opacity-90"
      style={{ color: MEDICAL_COLOR_PALETTE.medical.green[500] }}
    >
      Trusted Medical Care
    </span>
    <span id="logo-description" className="sr-only">
      {ACCESSIBILITY_LABELS.logoDescription}
    </span>
  </div>
));

// Back Button Component
const BackButton = memo(
  ({
    isNavigating,
    prefersReducedMotion,
    onNavigate,
  }: {
    isNavigating: boolean;
    prefersReducedMotion: boolean;
    onNavigate: (to: To) => void;
  }) => (
    <motion.button
      className={`
      p-3 mr-3 -ml-1 rounded-xl cursor-pointer
      min-w-[48px] min-h-[48px] md:min-w-[52px] md:min-h-[52px] lg:min-w-[56px] lg:min-h-[56px]
      flex items-center justify-center
      transition-all duration-150 ease-out
      hover:shadow-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2
      active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
      ${isNavigating ? 'animate-pulse' : ''}
    `
        .replace(/\s+/g, ' ')
        .trim()}
      style={BACK_BUTTON_STYLES}
      onClick={() => onNavigate(-1 as To)}
      disabled={isNavigating}
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              scale: 1.05,
              backgroundColor: `${MEDICAL_COLOR_PALETTE.medical.blue[500]}15`,
            }
      }
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      transition={prefersReducedMotion ? {} : { duration: 0.15, ease: 'easeOut' }}
      aria-label={ACCESSIBILITY_LABELS.backButton}
      title={ACCESSIBILITY_LABELS.backButtonTitle}
      aria-describedby="back-button-description"
    >
      <BackIcon aria-hidden="true" />
      <span id="back-button-description" className="sr-only">
        {ACCESSIBILITY_LABELS.backButtonDescription}
      </span>
    </motion.button>
  )
);

// Error boundary component for header - Fixed to prevent cross-component updates
const HeaderErrorBoundary = ({ children, fallback }: HeaderErrorBoundaryProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      // Only handle errors that are specifically related to the header component
      // to prevent interference with other components
      const isHeaderRelated = error.filename?.includes('header') || error.message?.toLowerCase().includes('header');

      if (isHeaderRelated) {
        console.error('Header Error:', error);
        // Use setTimeout to prevent setState during render
        setTimeout(() => {
          setHasError(true);
        }, 0);
      }
    };

    // Use a more specific error handler to avoid conflicts
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Main Header component with performance optimizations and error handling
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [handle] = useRouteHandle();
  const [scrolled, setScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Enhanced scroll handling with throttling for better performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > SCROLL_THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced navigation handler with loading state
  const handleNavigation = useCallback(
    (to: To) => {
      setIsNavigating(true);
      navigate(to, { viewTransition: true });
      // Reset navigation state after a short delay
      setTimeout(() => setIsNavigating(false), NAVIGATION_TIMEOUT);
    },
    [navigate]
  );

  // Memoized calculations for better performance
  const showMainHeader = useMemo(() => !handle?.back, [handle?.back]);
  const showBack = useMemo(() => location.key !== 'default' && handle?.back !== false, [location.key, handle?.back]);

  // Enhanced accessibility and medical context with WCAG 2.1 AA compliance
  const headerRole = useMemo(() => (showMainHeader ? 'banner' : 'navigation'), [showMainHeader]);
  const headerAriaLabel = useMemo(
    () =>
      showMainHeader
        ? ACCESSIBILITY_LABELS.mainHeader
        : `Điều hướng y tế: ${handle.title === 'custom' ? 'Trang tùy chỉnh' : handle.title}. Nhấn Tab để điều hướng, Enter để kích hoạt`,
    [showMainHeader, handle.title]
  );

  // Enhanced ARIA live region for navigation feedback
  const navigationStatus = isNavigating ? ACCESSIBILITY_LABELS.navigationStatus : '';

  return (
    <>
      {/* Skip Link for Keyboard Navigation - WCAG 2.1 AA Compliance */}
      <a
        href={`#${SKIP_LINK_ID}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]
                   bg-blue-600 text-white px-4 py-2 rounded-md font-medium
                   focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600
                   transition-all duration-200"
        tabIndex={0}
      >
        {ACCESSIBILITY_LABELS.skipLink}
      </a>

      {/* ARIA Live Region for Navigation Status */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {navigationStatus}
      </div>

      <motion.header
        role={headerRole}
        aria-label={headerAriaLabel}
        className={`
        flex-none w-full min-h-[64px] md:min-h-[72px] lg:min-h-[80px]
        transition-all duration-300 ease-out sticky top-0 z-50
        ${showMainHeader ? 'bg-white' : `bg-white border-b border-gray-200/60`}
        ${
          scrolled
            ? `sticky top-0 z-50 bg-white border-b border-gray-200/80
             shadow-[0_4px_12px_rgba(37,99,235,0.08),0_2px_4px_rgba(37,99,235,0.04)]`
            : 'relative z-30'
        }
        px-4 md:px-6 lg:px-8 pt-safe pb-2 md:pb-3 lg:pb-4
        focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:ring-offset-2
      `
          .replace(/\s+/g, ' ')
          .trim()}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.4 }}
      >
        {/* Modern Hospital Header Background */}
        {showMainHeader && (
          <motion.div
            className="absolute inset-0 z-0 overflow-hidden"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={prefersReducedMotion ? {} : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Enhanced Modern Hospital Gradient - Clean & Professional */}
            <div className="absolute h-[160px] md:h-[200px] lg:h-[240px] w-full" style={HEADER_STYLES} />

            {/* Subtle overlay for enhanced text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40" />

            {/* Enhanced Medical Pattern - Hospital Grade */}
            <MedicalBackgroundPattern />

            {/* Enhanced Professional Medical Icons - Reduced Motion Friendly */}
            {!prefersReducedMotion && (
              <>
                {/* Stethoscope Icon - Top Right */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-6 md:opacity-8">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                    className="drop-shadow-sm"
                  >
                    <MedicalIcons.Stethoscope
                      size="md"
                      className="text-cyan-500/60 hover:text-cyan-500/80 transition-colors duration-300"
                    />
                  </motion.div>
                </div>

                {/* Heart Rate Icon - Top Left */}
                <div className="absolute top-8 left-8 md:top-10 md:left-10 opacity-5 md:opacity-6">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="drop-shadow-sm"
                  >
                    <MedicalIcons.HeartRate
                      size="sm"
                      className="text-green-500/50 hover:text-green-500/70 transition-colors duration-300"
                    />
                  </motion.div>
                </div>

                {/* Medical Cross Icon - Bottom Right */}
                <div className="absolute bottom-6 right-8 md:bottom-8 md:right-12 opacity-4 md:opacity-5 hidden md:block">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="drop-shadow-sm"
                  >
                    <MedicalIcons.MedicalCross
                      size="xs"
                      className="text-blue-500/40 hover:text-blue-500/60 transition-colors duration-300"
                    />
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Enhanced Modern Hospital Header Content */}
        <div className="flex items-center justify-between min-h-[52px] md:min-h-[56px] lg:min-h-[60px] relative z-20">
          {showMainHeader ? (
            <motion.div
              className="w-full"
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {handle.profile ? (
                <ProfileHeader />
              ) : (
                <div className="flex items-center justify-between px-2 md:px-4">
                  <div className="flex items-center">
                    {/* Enhanced Modern Hospital Logo with Medical Branding */}
                    <HospitalLogo prefersReducedMotion={!!prefersReducedMotion} />
                    <HospitalBranding />
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center w-full"
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={prefersReducedMotion ? {} : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {showBack && (
                <BackButton
                  isNavigating={isNavigating}
                  prefersReducedMotion={!!prefersReducedMotion}
                  onNavigate={handleNavigation}
                />
              )}

              {/* Enhanced Modern Hospital Page Title */}
              <div
                className="text-lg md:text-xl lg:text-2xl font-semibold truncate flex-1 leading-tight tracking-tight
                         transition-colors duration-200 hover:opacity-80"
                style={{ color: MEDICAL_COLOR_PALETTE.medical.blue[500] }}
                role="heading"
                aria-level={1}
                aria-live="polite"
                aria-label={`Trang hiện tại: ${handle.title === 'custom' ? 'Trang tùy chỉnh' : handle.title}`}
              >
                {handle.title === 'custom' ? <CustomTitle /> : handle.title}
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>
    </>
  );
}

// Enhanced Header component with error boundary and performance optimizations
const EnhancedHeader = memo(() => {
  return (
    <HeaderErrorBoundary
      fallback={
        <header className="flex-none w-full min-h-[64px] bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-center">
            <span className="text-gray-500 text-sm">Đang tải header...</span>
          </div>
        </header>
      }
    >
      <Header />
    </HeaderErrorBoundary>
  );
});

EnhancedHeader.displayName = 'EnhancedHeader';

export default EnhancedHeader;
