import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPACING, BORDER_RADIUS, SHADOWS, ANIMATIONS, combineClasses } from '@/styles/medical-design-system';
import { MedicalHeartbeat, MedicalPulseIndicator } from '@/components/medical-animations';

interface MobileOptimizedLayoutProps {
  children: ReactNode;
  className?: string;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
  showScrollIndicator?: boolean;
  medicalContext?: 'emergency' | 'routine' | 'general';
  title?: string;
  showHeader?: boolean;
  showFloatingAction?: boolean;
  floatingActionIcon?: ReactNode;
  onFloatingActionClick?: () => void;
}

export default function MobileOptimizedLayout({
  children,
  className = '',
  enablePullToRefresh = false,
  onRefresh,
  showScrollIndicator = true,
  medicalContext = 'general',
  title,
  showHeader = false,
  showFloatingAction = false,
  floatingActionIcon,
  onFloatingActionClick,
}: MobileOptimizedLayoutProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Handle pull-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enablePullToRefresh) return;
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enablePullToRefresh || isRefreshing) return;

    const touchY = e.touches[0].clientY;
    const distance = touchY - touchStart;

    // Only allow pull down when at top of page
    if (window.scrollY === 0 && distance > 0) {
      setPullDistance(Math.min(distance * 0.5, 80));
    }
  };

  const handleTouchEnd = async () => {
    if (!enablePullToRefresh || isRefreshing) return;

    if (pullDistance > 60 && onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  };

  // Handle scroll indicator and header effects
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Medical context styling
  const getContextStyling = () => {
    const contextMap = {
      emergency: {
        pullColor: 'text-red-600',
        scrollButton: 'bg-red-600 hover:bg-red-700',
        accent: 'border-red-200',
        gradient: 'from-red-500 to-red-600',
        iconColor: 'text-red-500',
        floatingButton: 'bg-red-500',
        floatingButtonHover: 'hover:bg-red-600',
        headerBg: 'bg-red-50',
        headerText: 'text-red-900',
      },
      routine: {
        pullColor: 'text-green-600',
        scrollButton: 'bg-green-600 hover:bg-green-700',
        accent: 'border-green-200',
        gradient: 'from-green-500 to-green-600',
        iconColor: 'text-green-500',
        floatingButton: 'bg-green-500',
        floatingButtonHover: 'hover:bg-green-600',
        headerBg: 'bg-green-50',
        headerText: 'text-green-900',
      },
      general: {
        pullColor: 'text-blue-600',
        scrollButton: 'bg-blue-600 hover:bg-blue-700',
        accent: 'border-blue-200',
        gradient: 'from-blue-500 to-blue-600',
        iconColor: 'text-blue-600',
        floatingButton: 'bg-blue-500',
        floatingButtonHover: 'hover:bg-blue-600',
        headerBg: 'bg-blue-50',
        headerText: 'text-blue-900',
      },
    };
    return contextMap[medicalContext];
  };

  const contextStyling = getContextStyling();

  return (
    <div
      className={combineClasses('relative min-h-screen', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Medical themed header */}
      {showHeader && (
        <motion.header
          className={combineClasses(
            'sticky top-0 z-40 w-full',
            'backdrop-blur-md border-b',
            contextStyling.accent,
            scrollY > 20 ? 'bg-white/90' : 'bg-white/80'
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={combineClasses('flex items-center justify-between', SPACING.padding.card)}>
            <div className="flex items-center">
              {medicalContext === 'emergency' && (
                <div className="mr-2">
                  <MedicalHeartbeat size="sm" active={true} />
                </div>
              )}
              <h1 className={combineClasses('font-semibold', contextStyling.headerText, 'text-lg')}>
                {title || (medicalContext === 'emergency' ? 'Dịch vụ khẩn cấp' : 'Dịch vụ y tế')}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <MedicalPulseIndicator active={true} size="sm" />
              <span className="text-xs text-gray-500">
                {medicalContext === 'emergency' ? 'Cấp cứu 24/7' : 'Hoạt động'}
              </span>
            </div>
          </div>
        </motion.header>
      )}

      {/* Pull to refresh indicator - Modern hospital theme */}
      <AnimatePresence>
        {enablePullToRefresh && (pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={combineClasses(
              'fixed top-0 left-0 right-0 z-50 flex items-center justify-center',
              'backdrop-blur-sm bg-white/80 shadow-sm border-b',
              contextStyling.accent,
              SPACING.padding.content
            )}
            style={{ transform: `translateY(${pullDistance - 60}px)` }}
          >
            <div className="flex items-center space-x-2">
              {isRefreshing ? (
                <>
                  <div
                    className={combineClasses(
                      'w-4 h-4 border-2 border-gray-300 rounded-full animate-spin',
                      `border-t-${medicalContext === 'emergency' ? 'red' : medicalContext === 'routine' ? 'green' : 'blue'}-600`
                    )}
                  ></div>
                  <span className="text-sm text-gray-600">Đang cập nhật...</span>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: pullDistance > 60 ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={contextStyling.pullColor}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </motion.div>
                  <span className="text-sm text-gray-600">
                    {pullDistance > 60 ? 'Thả để cập nhật' : 'Kéo để cập nhật'}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="relative">{children}</main>

      {/* Floating action button - Medical styled */}
      <AnimatePresence>
        {showFloatingAction && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onFloatingActionClick}
            className={combineClasses(
              'fixed bottom-24 right-4 z-40 p-3 text-white rounded-full shadow-xl',
              contextStyling.floatingButton,
              contextStyling.floatingButtonHover,
              'flex items-center justify-center',
              'w-14 h-14',
              'transition-all duration-200'
            )}
            aria-label="Hành động nhanh"
          >
            {floatingActionIcon || (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}

            {/* Pulse effect for emergency */}
            {medicalContext === 'emergency' && (
              <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Enhanced scroll to top button - Medical themed */}
      <AnimatePresence>
        {showScrollIndicator && showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className={combineClasses(
              'fixed bottom-20 right-4 z-40 p-3 text-white rounded-full shadow-lg',
              'transition-all duration-200',
              contextStyling.scrollButton,
              SHADOWS.cardHover
            )}
            aria-label="Cuộn lên đầu trang"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// Enhanced Medical-specific layout presets
export const MedicalLayoutPresets = {
  emergency: {
    medicalContext: 'emergency' as const,
    enablePullToRefresh: true,
    showScrollIndicator: true,
    showHeader: true,
    className: 'bg-red-50',
    title: 'Dịch vụ cấp cứu',
  },
  routine: {
    medicalContext: 'routine' as const,
    enablePullToRefresh: true,
    showScrollIndicator: true,
    showHeader: true,
    className: 'bg-green-50',
    title: 'Dịch vụ y tế',
  },
  general: {
    medicalContext: 'general' as const,
    enablePullToRefresh: false,
    showScrollIndicator: true,
    showHeader: true,
    className: 'bg-gray-50',
    title: 'Bệnh viện Zalo',
  },
  consultation: {
    medicalContext: 'general' as const,
    enablePullToRefresh: false,
    showScrollIndicator: true,
    showHeader: true,
    showFloatingAction: true,
    className: 'bg-blue-50',
    title: 'Tư vấn y tế',
  },
};

// Enhanced mobile viewport utilities
export const MobileViewportUtils = {
  // Set CSS custom properties for mobile viewport
  setMobileViewport: () => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  },

  // Optimize touch interactions
  optimizeTouchInteractions: () => {
    // Disable double-tap zoom on buttons and interactive elements
    document.addEventListener('touchstart', (e) => {
      if (e.target instanceof HTMLElement) {
        const isInteractive = e.target.matches('button, a, [role="button"], input, select, textarea');
        if (isInteractive) {
          e.target.style.touchAction = 'manipulation';
        }
      }
    });

    // Improve scroll performance
    document.body.style.overscrollBehavior = 'contain';
  },

  // Optimize for medical accessibility
  enhanceMedicalAccessibility: () => {
    // Add medical-specific ARIA labels
    const medicalElements = document.querySelectorAll('[data-medical-context]');
    medicalElements.forEach((element) => {
      const context = element.getAttribute('data-medical-context');
      if (context === 'emergency') {
        element.setAttribute('aria-label', `Khẩn cấp: ${element.textContent}`);
      }
    });

    // Enhance focus management for medical forms
    const medicalForms = document.querySelectorAll('form[data-medical-form]');
    medicalForms.forEach((form) => {
      const firstInput = form.querySelector('input, select, textarea') as HTMLElement;
      if (firstInput) {
        firstInput.focus();
      }
    });

    // Add high contrast support
    const enableHighContrast = () => {
      document.documentElement.classList.add('high-contrast');
    };

    // Check for prefers-contrast media query
    if (window.matchMedia('(prefers-contrast: more)').matches) {
      enableHighContrast();
    }
  },
};
