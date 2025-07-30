import { useRouteHandle } from '@/hooks';
import TransitionLink from './transition-link';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MedicalIcons } from './icons/medical-icons';
import { memo, useMemo, useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';

// TypeScript interfaces for better type safety
interface NavIconProps {
  active: boolean;
  shouldReduceMotion?: boolean;
}

interface NavItem {
  name: string;
  path: string;
  ariaLabel: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  isSpecial?: boolean;
  icon: (props: NavIconProps) => JSX.Element;
}

/**
 * Enhanced medical navigation items with healthcare icons and accessibility
 * Organized by priority and user journey flow
 *
 * Sticky Footer Behavior:
 * - When page content is shorter than viewport: Footer sticks to bottom (fixed positioning)
 * - When page content exceeds viewport: Footer flows naturally at bottom of content (relative positioning)
 * - Mobile optimized with proper safe area handling
 * - Accessibility compliant with screen reader announcements
 * - Performance optimized with memoization and debounced resize handling
 */
const NAV_ITEMS: NavItem[] = [
  {
    name: 'Trang chủ',
    path: '/',
    ariaLabel: 'Trang chủ ứng dụng y tế - Điểm khởi đầu cho các dịch vụ chăm sóc sức khỏe',
    priority: 'high',
    icon: ({ active, shouldReduceMotion }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-300 ${active ? 'text-primary-600' : 'text-neutral-500'}`}
        aria-hidden="true"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    name: 'Dịch vụ',
    path: '/service-prices',
    ariaLabel: 'Dịch vụ y tế và khám chữa bệnh - Xem bảng giá và thông tin chi tiết',
    priority: 'high',
    icon: ({ active, shouldReduceMotion }) => (
      <MedicalIcons.Stethoscope
        className={`transition-all duration-300 ${active ? 'text-primary-600' : 'text-neutral-500'}`}
        aria-hidden="true"
      />
    ),
  },
  {
    name: 'Đặt lịch',
    path: '/booking',
    ariaLabel: 'Đặt lịch khám bệnh và hẹn tái khám - Chức năng chính của ứng dụng',
    isSpecial: true,
    priority: 'critical',
    icon: ({ active, shouldReduceMotion }) => (
      <div className="relative">
        <motion.div
          initial={{ opacity: 0.15, scale: 0.95 }}
          animate={shouldReduceMotion ? {} : { opacity: [0.15, 0.3, 0.15], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 blur-lg"
        ></motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full ${
            active
              ? 'bg-gradient-to-r from-primary-700 to-primary-600'
              : 'bg-gradient-to-r from-primary-600 to-secondary-500'
          } -mt-7 sm:-mt-8 shadow-lg shadow-primary-500/25`}
        >
          <MedicalIcons.MedicalCross size="lg" className="text-white" aria-hidden="true" />
        </motion.div>
      </div>
    ),
  },
  {
    name: 'Bác sĩ',
    path: '/doctor',
    ariaLabel: 'Thông tin bác sĩ và chuyên khoa - Tìm hiểu về đội ngũ y bác sĩ',
    priority: 'medium',
    icon: ({ active, shouldReduceMotion }) => (
      <MedicalIcons.User
        className={`transition-all duration-300 ${active ? 'text-primary-600' : 'text-neutral-500'}`}
        aria-hidden="true"
      />
    ),
  },
  {
    name: 'Giới thiệu',
    path: '/about',
    ariaLabel: 'Thông tin giới thiệu và liên hệ - Tìm hiểu về cơ sở y tế',
    priority: 'low',
    icon: ({ active, shouldReduceMotion }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-300 ${active ? 'text-primary-600' : 'text-neutral-500'}`}
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="5"></circle>
        <path d="M20 21a8 8 0 1 0-16 0"></path>
      </svg>
    ),
  },
];

const Footer = memo(function Footer() {
  // ALL HOOKS MUST BE CALLED CONSISTENTLY - NO EARLY RETURNS BEFORE ALL HOOKS
  const [handle] = useRouteHandle();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // State for sticky footer behavior
  const [isContentShort, setIsContentShort] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(() => NAV_ITEMS, []);

  // Effect to handle sticky footer behavior
  useEffect(() => {
    // Track active timeouts for cleanup
    const activeTimeouts = new Set<number>();

    const checkContentHeight = () => {
      try {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const footerHeight = 80; // Approximate footer height

        // Check if content + footer is shorter than viewport
        const contentPlusFooter = documentHeight;
        const shouldStick = contentPlusFooter <= viewportHeight;

        // Update state and announce changes for accessibility
        const previousState = isContentShort;
        const hasStateChanged = previousState !== shouldStick;

        setIsContentShort(shouldStick);

        // Handle accessibility announcements separately from state updates
        if (hasStateChanged) {
          const message = shouldStick
            ? 'Thanh điều hướng đã được cố định ở cuối màn hình'
            : 'Thanh điều hướng đã trở về vị trí bình thường';

          // Use a timeout to ensure the announcement doesn't interfere with other screen reader content
          const announcementTimeout = window.setTimeout(() => {
            try {
              const announcement = document.createElement('div');
              announcement.setAttribute('aria-live', 'polite');
              announcement.setAttribute('aria-atomic', 'true');
              announcement.className = 'sr-only';
              announcement.textContent = message;
              document.body.appendChild(announcement);

              // Remove the announcement after it's been read
              const cleanupTimeout = window.setTimeout(() => {
                try {
                  if (announcement.parentNode) {
                    document.body.removeChild(announcement);
                  }
                } catch (cleanupError) {
                  console.warn('Footer accessibility announcement cleanup failed:', cleanupError);
                }
                activeTimeouts.delete(cleanupTimeout);
              }, 1000);
              activeTimeouts.add(cleanupTimeout);
            } catch (announcementError) {
              console.warn('Footer accessibility announcement failed:', announcementError);
            }
            activeTimeouts.delete(announcementTimeout);
          }, 100);
          activeTimeouts.add(announcementTimeout);
        }
        setViewportHeight(viewportHeight);
      } catch (error) {
        console.error('Error checking content height for sticky footer:', error);
      }
    };

    // Initial check
    checkContentHeight();

    // Check on resize and orientation change with debouncing
    let resizeTimeout: number;
    const handleResize = () => {
      // Clear previous timeout to debounce resize events for performance
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(checkContentHeight, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Check when content changes (using MutationObserver)
    const observer = new MutationObserver(checkContentHeight);
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      observer.observe(mainContent, {
        childList: true,
        subtree: true,
        attributes: false,
      });
    }

    return () => {
      // Clear all active timeouts to prevent memory leaks
      activeTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      activeTimeouts.clear();

      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      observer.disconnect();
    };
  }, [location.pathname]); // Re-run when route changes

  // Memoize sticky footer classes for performance
  const stickyFooterClasses = useMemo(() => {
    const baseClasses = 'w-full z-30';
    const stickyClasses = isContentShort ? 'sticky bottom-0 left-0 right-0' : 'relative';

    return `${baseClasses} ${stickyClasses}`;
  }, [isContentShort]);

  // Early return AFTER all hooks have been called to avoid hook violations
  if (handle.back) {
    return null;
  }

  return (
    <motion.footer
      role="contentinfo"
      aria-label="Điều hướng chính của ứng dụng y tế"
      className={stickyFooterClasses}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        // Ensure footer doesn't interfere with content when sticky
        ...(isContentShort && {
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08), 0 -2px 8px rgba(0, 0, 0, 0.04)',
        }),
      }}
    >
      {/* Premium Medical Footer Background - Enhanced for Sticky Behavior */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24">
        {/* Enhanced glass morphism background with medical white - Optimized for sticky positioning */}
        <div
          className={`absolute inset-0 border-t shadow-lg bg-white ${
            isContentShort
              ? 'bg-gradient-to-t from-slate-100/95 to-slate-50/98 border-slate-200/80 shadow-slate-900/8'
              : 'bg-gradient-to-t from-slate-100/90 to-slate-50/95 border-slate-200/60 shadow-slate-900/5'
          }`}
        ></div>

        {/* Medical gradient overlay with healing green accent */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-50/30 via-primary-50/10 to-transparent"></div>

        {/* Enhanced medical accent line for sticky state */}
        <div
          className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400/40 to-transparent ${
            isContentShort ? 'opacity-100' : 'opacity-70'
          } transition-opacity duration-300`}
        ></div>

        {/* Enhanced medical pattern with trust-building elements */}
        <div className="absolute inset-0 opacity-3">
          <svg width="100%" height="100%" viewBox="0 0 60 60" className="w-full h-full">
            <defs>
              <pattern id="footer-medical" patternUnits="userSpaceOnUse" width="40" height="40">
                <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-accent-500" />
                <circle cx="10" cy="30" r="0.8" fill="currentColor" className="text-secondary-400" />
                <circle cx="30" cy="10" r="0.8" fill="currentColor" className="text-primary-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-medical)" />
          </svg>
        </div>
      </div>

      {/* Navigation - Enhanced for Sticky Behavior */}
      <nav
        className={`relative z-10 w-full px-2 sm:px-4 ${
          isContentShort
            ? 'pb-safe' // Use safe area padding when sticky
            : 'pb-2 sm:pb-3' // Regular padding when in flow
        } transition-all duration-300`}
        role="navigation"
        aria-label="Điều hướng chính"
      >
        <div
          className="mx-auto grid max-w-md sm:max-w-lg gap-1 sm:gap-2"
          role="tablist"
          style={{ gridTemplateColumns: `repeat(${navigationItems.length}, 1fr)` }}
        >
          {navigationItems.map((item, index) => (
            <TransitionLink
              to={item.path}
              key={item.path}
              aria-label={item.ariaLabel || item.name}
              role="tab"
              tabIndex={0}
              className={`flex flex-col items-center justify-center py-2 sm:py-3 min-w-[48px] min-h-[48px] sm:min-w-[56px] sm:min-h-[56px] ${item.isSpecial ? 'pt-0' : 'pt-2 sm:pt-3'} rounded-lg transition-all duration-200 hover:bg-neutral-50/80 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-neutral-50/80 active:scale-95 touch-manipulation`}
            >
              {({ isActive }) => (
                <motion.div
                  className="relative flex flex-col items-center"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, delay: index * 0.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  {/* Icon Container */}
                  <motion.div
                    className="relative"
                    animate={
                      isActive && !item.isSpecial && !shouldReduceMotion
                        ? {
                            scale: [1, 1.1, 1],
                            transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                          }
                        : {}
                    }
                  >
                    <item.icon
                      active={isActive || item.path === location.pathname}
                      shouldReduceMotion={shouldReduceMotion || false}
                    />

                    {/* Active indicator */}
                    {isActive && !item.isSpecial && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary-600 rounded-full shadow-sm"
                        initial={shouldReduceMotion ? {} : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <motion.div
                    className={`text-xs sm:text-sm font-medium mt-1.5 sm:mt-2 transition-colors duration-200 ${
                      isActive || item.path === location.pathname
                        ? 'text-primary-700 font-semibold'
                        : 'text-neutral-600'
                    }`}
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: isActive && !item.isSpecial ? [0, -2, 0] : 0,
                            transition: { duration: 0.3 },
                          }
                    }
                  >
                    {item.name}
                  </motion.div>
                </motion.div>
              )}
            </TransitionLink>
          ))}
        </div>
      </nav>
    </motion.footer>
  );
});

// Error boundary for Footer component to prevent crashes
interface FooterErrorBoundaryProps {
  children: ReactNode;
}

interface FooterErrorBoundaryState {
  hasError: boolean;
}

class FooterErrorBoundary extends Component<FooterErrorBoundaryProps, FooterErrorBoundaryState> {
  constructor(props: FooterErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): FooterErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Footer Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for footer errors
      return (
        <footer className="w-full z-30 bg-white border-t border-gray-200">
          <nav className="relative z-10 w-full px-4 py-3" role="navigation" aria-label="Điều hướng chính">
            <div className="mx-auto max-w-md text-center">
              <span className="text-sm text-gray-500">Đang tải điều hướng...</span>
            </div>
          </nav>
        </footer>
      );
    }

    return this.props.children;
  }
}

// Enhanced Footer with error boundary
const EnhancedFooter = memo(() => {
  return (
    <FooterErrorBoundary>
      <Footer />
    </FooterErrorBoundary>
  );
});

EnhancedFooter.displayName = 'EnhancedFooter';

export default EnhancedFooter;
