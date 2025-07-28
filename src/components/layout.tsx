import Header from './header';
import Footer from './footer';
import { Toaster } from 'react-hot-toast';
import { ScrollRestoration } from './scroll-restoration';
import Page from './page';
import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { performanceMonitor } from '@/utils/performance-monitor';
import { MobileViewportUtils } from './mobile-optimized-layout';
import { MEDICAL_COLORS, SPACING, ANIMATIONS } from '@/styles/medical-design-system';
import { announceToScreenReader, manageFocus } from '@/utils/accessibility';
import { getColorToken, COLOR_TOKENS } from '@/styles/unified-color-system';

// Lazy load accessibility settings for better performance
const AccessibilitySettings = lazy(() =>
  import('./accessibility-settings').then((module) => ({
    default: module.AccessibilitySettings,
  }))
);
// import QuickAccessButton from './quick-access-button';

// Enhanced TypeScript interfaces for better type safety
interface LayoutProps {
  className?: string;
  'data-testid'?: string;
}

interface ScreenSize {
  type: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
}

interface LayoutState {
  isLayoutReady: boolean;
  showAccessibilitySettings: boolean;
  isMobile: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  hasError: boolean;
}

// Type for animation preferences
interface AnimationPreferences {
  prefersReducedMotion: boolean | null;
  duration: number;
  ease: readonly number[];
}

// Memoized Layout component for performance optimization
const Layout = ({ className = '', 'data-testid': testId }: LayoutProps = {}) => {
  // Enhanced state management with proper typing
  const [layoutState, setLayoutState] = useState<LayoutState>({
    isLayoutReady: false,
    showAccessibilitySettings: false,
    isMobile: false,
    screenSize: 'mobile',
    hasError: false,
  });

  const [screenInfo, setScreenInfo] = useState<ScreenSize>({
    type: 'mobile',
    width: typeof window !== 'undefined' ? window.innerWidth : 768,
    height: typeof window !== 'undefined' ? window.innerHeight : 1024,
  });

  const prefersReducedMotion = useReducedMotion();

  // Animation preferences with proper typing
  const animationPrefs: AnimationPreferences = useMemo(
    () => ({
      prefersReducedMotion,
      duration: prefersReducedMotion ? 0.1 : 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    }),
    [prefersReducedMotion]
  );

  // Memoized animation variants based on user preferences
  const layoutAnimations = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
    [prefersReducedMotion]
  );

  // Enhanced responsive breakpoint detection with error handling
  useEffect(() => {
    const updateScreenSize = () => {
      try {
        const width = window.innerWidth;
        const height = window.innerHeight;

        let newScreenSize: 'mobile' | 'tablet' | 'desktop';
        let isMobile: boolean;

        if (width < 768) {
          newScreenSize = 'mobile';
          isMobile = true;
        } else if (width < 1024) {
          newScreenSize = 'tablet';
          isMobile = false;
        } else {
          newScreenSize = 'desktop';
          isMobile = false;
        }

        setLayoutState((prev) => ({
          ...prev,
          screenSize: newScreenSize,
          isMobile,
        }));

        setScreenInfo({
          type: newScreenSize,
          width,
          height,
        });
      } catch (error) {
        console.error('Error updating screen size:', error);
        setLayoutState((prev) => ({ ...prev, hasError: true }));
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    window.addEventListener('orientationchange', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
      window.removeEventListener('orientationchange', updateScreenSize);
    };
  }, []);

  // Enhanced mobile viewport and performance optimizations
  useEffect(() => {
    const startTime = Date.now();

    try {
      // Initialize mobile viewport optimizations
      const cleanupViewport = MobileViewportUtils.setMobileViewport();
      MobileViewportUtils.optimizeTouchInteractions();
      MobileViewportUtils.enhanceMedicalAccessibility();

      // Enhanced mobile-specific optimizations
      if (layoutState.isMobile) {
        // Prevent zoom on input focus
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
          metaViewport.setAttribute(
            'content',
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
          );
        }

        // Optimize scroll behavior for mobile
        document.body.style.overscrollBehavior = 'contain';
        (document.body.style as any).webkitOverflowScrolling = 'touch';

        // Add mobile-specific CSS classes
        document.documentElement.classList.add('mobile-layout');
      } else {
        document.documentElement.classList.remove('mobile-layout');
      }

      // Track layout initialization performance
      performanceMonitor.trackMedicalPageLoad('layout', Date.now() - startTime, 'general');

      // Mark layout as ready after optimizations
      setLayoutState((prev) => ({ ...prev, isLayoutReady: true }));

      return cleanupViewport;
    } catch (error) {
      console.error('Error initializing layout:', error);
      setLayoutState((prev) => ({ ...prev, hasError: true }));
      return () => {}; // Return empty cleanup function on error
    }
  }, [layoutState.isMobile]);

  // Enhanced accessibility keyboard shortcuts with error handling
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      try {
        // Alt + A to open accessibility settings
        if (event.altKey && event.key === 'a') {
          event.preventDefault();
          setLayoutState((prev) => ({
            ...prev,
            showAccessibilitySettings: !prev.showAccessibilitySettings,
          }));
          announceToScreenReader(
            layoutState.showAccessibilitySettings ? 'Đã đóng cài đặt trợ năng' : 'Đã mở cài đặt trợ năng',
            'polite'
          );
        }

        // Escape to close accessibility settings
        if (event.key === 'Escape' && layoutState.showAccessibilitySettings) {
          setLayoutState((prev) => ({ ...prev, showAccessibilitySettings: false }));
          announceToScreenReader('Đã đóng cài đặt trợ năng', 'polite');
        }

        // Alt + M to skip to main content
        if (event.altKey && event.key === 'm') {
          event.preventDefault();
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.focus();
            announceToScreenReader('Đã chuyển đến nội dung chính', 'polite');
          }
        }

        // Alt + H to skip to header
        if (event.altKey && event.key === 'h') {
          event.preventDefault();
          const header = document.querySelector('header');
          if (header) {
            const firstFocusable = header.querySelector(
              'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as HTMLElement;
            if (firstFocusable) {
              firstFocusable.focus();
              announceToScreenReader('Đã chuyển đến thanh điều hướng', 'polite');
            }
          }
        }
      } catch (error) {
        console.error('Error handling keyboard shortcut:', error);
        setLayoutState((prev) => ({ ...prev, hasError: true }));
      }
    },
    [layoutState.showAccessibilitySettings]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Announce layout ready state to screen readers
  useEffect(() => {
    if (layoutState.isLayoutReady) {
      announceToScreenReader('Ứng dụng y tế đã sẵn sàng sử dụng', 'polite');
    }
  }, [layoutState.isLayoutReady]);

  // Focus management for accessibility settings modal
  useEffect(() => {
    if (layoutState.showAccessibilitySettings) {
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        manageFocus.trapFocus(modal as HTMLElement);
      }
    }
  }, [layoutState.showAccessibilitySettings]);

  // Enhanced modern hospital container classes with medical-grade styling
  const containerClasses = useMemo(() => {
    try {
      const baseClasses = 'w-screen h-screen flex flex-col text-text-primary overflow-hidden relative';

      // Clean modern hospital background with medical colors
      const backgroundClasses = `
        bg-slate-50
        after:absolute after:inset-0 after:z-0
        after:bg-gradient-to-br after:from-blue-50/30 after:via-transparent after:to-emerald-50/20
        after:pointer-events-none
      `
        .replace(/\s+/g, ' ')
        .trim();

      const responsiveClasses = {
        mobile: `
          mobile:min-h-screen mobile:max-w-full
        `
          .replace(/\s+/g, ' ')
          .trim(),
        tablet: `
          tablet:max-w-5xl tablet:mx-auto tablet:my-6
          tablet:rounded-2xl
        `
          .replace(/\s+/g, ' ')
          .trim(),
        desktop: `
          desktop:max-w-7xl desktop:mx-auto desktop:my-8
          desktop:rounded-3xl
        `
          .replace(/\s+/g, ' ')
          .trim(),
      };

      return `${baseClasses} ${backgroundClasses} ${responsiveClasses[layoutState.screenSize]} ${className}`;
    } catch (error) {
      console.error('Error generating container classes:', error);
      return `w-screen h-screen flex flex-col text-text-primary overflow-hidden bg-white ${className}`;
    }
  }, [layoutState.screenSize, className]);

  return (
    <div
      className={containerClasses}
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        minHeight: layoutState.isMobile ? 'calc(var(--vh, 1vh) * 100)' : '600px',
      }}
      data-testid={testId}
      data-screen-size={layoutState.screenSize}
      data-has-error={layoutState.hasError}
      role="application"
      aria-label="Ứng dụng y tế Zalo - Giao diện chính"
    >
      {/* Enhanced Skip to Main Content - Medical Grade Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-6 focus:left-6 focus:z-50 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:border-4 focus:border-blue-300 focus:font-medium focus:text-sm focus:transition-all focus:duration-200"
      >
        Chuyển đến nội dung chính
      </a>

      <Header />

      <motion.main
        id="main-content"
        className="flex-1 overflow-x-hidden overflow-y-auto overscroll-none relative z-[2] focus:outline-none bg-white/95"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${getColorToken('primary')} ${getColorToken('background-secondary')}cc`,
        }}
        tabIndex={-1}
        role="main"
        aria-label="Nội dung chính của ứng dụng"
        initial={layoutAnimations.initial}
        animate={layoutAnimations.animate}
        transition={layoutAnimations.transition}
      >
        {/* Medical content wrapper with premium hospital styling */}
        <div className="relative min-h-full">
          {/* Clean medical content background */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-transparent to-emerald-50/10 pointer-events-none"
            aria-hidden="true"
          />
          <Page />
        </div>
      </motion.main>

      <Footer />

      {/* Premium Hospital-Grade Toast Notifications */}
      <Toaster
        containerClassName="toast-container medical-notifications"
        position="bottom-center"
        toastOptions={{
          className: 'medical-toast hospital-grade',
          duration: 4500,
          style: {
            maxWidth: '92vw',
            padding: '18px 24px',
            borderRadius: '20px',
            fontSize: '15px',
            fontWeight: '500',
            lineHeight: '1.5',
            letterSpacing: '0.01em',
            border: `3px solid ${getColorToken('primary')}`,
            background: getColorToken('surface'),
            color: getColorToken('text-primary'),
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          },
          success: {
            style: {
              border: `3px solid ${getColorToken('success')}`,
              background: getColorToken('success-light'),
            },
          },
          error: {
            style: {
              border: `3px solid ${getColorToken('error')}`,
              background: getColorToken('error-light'),
            },
          },
          loading: {
            style: {
              border: `3px solid ${getColorToken('accent')}`,
              background: getColorToken('accent-light'),
            },
          },
        }}
      />

      {/* Lazy-loaded Accessibility Settings Modal */}
      {layoutState.showAccessibilitySettings && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg p-6 border-4 border-blue-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Đang tải cài đặt trợ năng...</p>
              </div>
            </div>
          }
        >
          <AccessibilitySettings
            isOpen={layoutState.showAccessibilitySettings}
            onClose={() => setLayoutState((prev) => ({ ...prev, showAccessibilitySettings: false }))}
            className="fixed inset-0 z-50"
          />
        </Suspense>
      )}

      <ScrollRestoration />
    </div>
  );
};

// Export memoized component for performance optimization
export default React.memo(Layout, (prevProps, nextProps) => {
  // Custom comparison function for optimal re-rendering
  if (!prevProps || !nextProps) return false;

  return prevProps.className === nextProps.className && prevProps['data-testid'] === nextProps['data-testid'];
});
