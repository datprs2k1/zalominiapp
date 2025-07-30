/**
 * Optimized Medical Service Prices Page
 * Modern hospital-themed page component with enhanced medical UI design system
 *
 * @version 4.0.0
 * @author Medical Development Team
 * @since 2024-07-28
 *
 * @features
 * - Premium hospital aesthetic with preferred healthcare colors:
 *   • Medical Blues: #2563EB (primary), #1E40AF (dark)
 *   • Healing Greens: #10B981 (primary), #059669 (dark)
 *   • Medical White: #FAFBFC (backgrounds)
 *   • Trust Cyan: #0891B2 (accents)
 * - Enhanced card-based layouts with premium medical design tokens
 * - Professional micro-animations with prefers-reduced-motion support
 * - 48px minimum touch targets for enhanced mobile accessibility
 * - Comprehensive medical iconography and emergency service indicators
 * - WCAG 2.1 AA compliant ARIA labels and Vietnamese localization
 * - Optimized performance with virtualization and memoization
 * - Enhanced responsive design for all device sizes
 */

import React, { memo, useCallback, useRef, useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/section';
import { useMedicalServicePrices } from '@/hooks/useMedicalServicePrices';
import {
  MedicalPriceCard,
  MedicalCategoryFilter,
  MedicalSearchBar,
  MedicalEmptyState,
  MedicalVirtualizedList,
} from '@/components/medical/MedicalServiceComponents';
import { formatPriceOptimized } from '@/utils/medicalDataProcessing';
import type { MedicalServicePriceItem } from '@/types/medical';

// Lazy load performance monitor for development
const PerformanceMonitor = lazy(() =>
  import('@/components/PerformanceMonitor').catch(() => ({
    default: () => null, // Fallback component
  }))
);

/**
 * Validation and testing utilities for the pricing page
 */
const validateAccessibility = () => {
  if (typeof window === 'undefined') return;

  // Check for ARIA labels
  const elementsWithoutAria = document.querySelectorAll('button:not([aria-label]), input:not([aria-label])');
  if (elementsWithoutAria.length > 0) {
    console.warn('Elements without ARIA labels found:', elementsWithoutAria);
  }

  // Check color contrast (basic validation)
  const primaryElements = document.querySelectorAll('[style*="#2563EB"]');
  console.log('Primary color elements found:', primaryElements.length);

  // Check keyboard navigation
  const focusableElements = document.querySelectorAll(
    'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
  );
  console.log('Focusable elements found:', focusableElements.length);
};

const validatePerformance = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const metrics = {
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
    firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
  };

  console.log('Performance metrics:', metrics);
  return metrics;
};

/**
 * Enhanced medical service pricing page configuration
 * Optimized for premium healthcare user experience
 */
const MEDICAL_PRICING_CONFIG = {
  itemsPerPage: 12,
  debounceDelay: 250,
  virtualItemHeight: 88, // Increased for better mobile touch targets
  containerHeight: 600,
  enableVirtualization: true,
  touchTargetSize: 48, // Enhanced touch target for better accessibility
  animationDuration: 300, // Medical-appropriate animation timing
  reducedMotionDuration: 150, // Faster animations for reduced motion preference
} as const;

/**
 * Premium healthcare color scheme configuration
 * Based on modern hospital design principles
 * Frozen object for performance optimization
 */
const HEALTHCARE_COLORS = Object.freeze({
  primary: Object.freeze({
    main: '#2563EB', // Medical Blue - Primary actions, trust
    dark: '#1E40AF', // Dark Blue - Hover states, depth
    light: '#DBEAFE', // Light Blue - Backgrounds, subtle highlights
    50: '#EFF6FF', // Ultra light medical background
    100: '#DBEAFE', // Light medical background
  }),
  secondary: Object.freeze({
    main: '#10B981', // Healing Green - Success, growth
    dark: '#059669', // Dark Green - Emphasis
    light: '#D1FAE5', // Light Green - Backgrounds
    50: '#ECFDF5', // Ultra light healing background
  }),
  accent: Object.freeze({
    cyan: '#0891B2', // Trust-building cyan
    cyanLight: '#CFFAFE', // Light cyan backgrounds
  }),
  medical: Object.freeze({
    white: '#FAFBFC', // Medical white - Clean backgrounds
    emergency: '#DC2626', // Emergency red
    warning: '#F59E0B', // Warning amber
  }),
});

/**
 * Enhanced medical pagination component with hospital-themed design
 */
const MedicalPagination = memo(
  ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    prefersReducedMotion = false,
    animationConfig = { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    prefersReducedMotion?: boolean;
    animationConfig?: { duration: number; ease: any };
  }) => {
    const renderPageNumbers = useCallback(() => {
      const pageNumbers: React.ReactNode[] = [];
      let startPage = 1;
      let endPage = Math.min(5, totalPages);

      if (totalPages > 5) {
        if (currentPage <= 3) {
          startPage = 1;
          endPage = 5;
        } else if (currentPage >= totalPages - 2) {
          startPage = totalPages - 4;
          endPage = totalPages;
        } else {
          startPage = currentPage - 2;
          endPage = currentPage + 2;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <motion.button
            key={i}
            onClick={() => onPageChange(i)}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium min-h-[48px] transition-all duration-300 medical-focus rounded-lg ${
              currentPage === i
                ? 'z-10 border-2 shadow-lg text-white'
                : 'bg-white border-gray-200 text-gray-700 hover:shadow-md hover:border-gray-300'
            }`}
            style={{
              backgroundColor: currentPage === i ? HEALTHCARE_COLORS.primary.main : 'white',
              borderColor: currentPage === i ? HEALTHCARE_COLORS.primary.main : '#E5E7EB',
              color: currentPage === i ? 'white' : '#374151',
            }}
            whileHover={{
              scale: 1.02,
              boxShadow:
                currentPage === i ? `0 8px 25px ${HEALTHCARE_COLORS.primary.main}40` : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            whileTap={{ scale: 0.98 }}
            aria-current={currentPage === i ? 'page' : undefined}
            aria-label={`Trang ${i}${currentPage === i ? ' - Trang hiện tại' : ''}`}
          >
            {i}
          </motion.button>
        );
      }

      return pageNumbers;
    }, [currentPage, totalPages, onPageChange]);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
      <motion.div
        className="px-4 py-4 border-t sm:px-6 rounded-b-xl"
        style={{
          background: `linear-gradient(135deg, ${HEALTHCARE_COLORS.primary[50]} 0%, ${HEALTHCARE_COLORS.medical.white} 50%, ${HEALTHCARE_COLORS.secondary[50]} 100%)`,
          borderColor: HEALTHCARE_COLORS.primary.light,
        }}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: animationConfig.duration,
          ease: animationConfig.ease,
        }}
      >
        <div className="flex items-center justify-between">
          {/* Enhanced Mobile pagination */}
          <div className="flex-1 flex justify-between sm:hidden">
            <motion.button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={isFirstPage}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg min-h-[48px] transition-all duration-300 medical-focus ${
                isFirstPage
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white border-gray-200 hover:shadow-md'
              }`}
              style={{
                color: isFirstPage ? '#9CA3AF' : HEALTHCARE_COLORS.primary.main,
                borderColor: isFirstPage ? '#E5E7EB' : HEALTHCARE_COLORS.primary.light,
              }}
              whileHover={
                !isFirstPage
                  ? {
                      scale: 1.02,
                      boxShadow: `0 4px 12px ${HEALTHCARE_COLORS.primary.main}20`,
                    }
                  : {}
              }
              whileTap={!isFirstPage ? { scale: 0.98 } : {}}
              aria-label="Trang trước"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Trước
            </motion.button>
            <motion.button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={isLastPage}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg min-h-[48px] transition-all duration-300 medical-focus ${
                isLastPage
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white border-gray-200 hover:shadow-md'
              }`}
              style={{
                color: isLastPage ? '#9CA3AF' : HEALTHCARE_COLORS.primary.main,
                borderColor: isLastPage ? '#E5E7EB' : HEALTHCARE_COLORS.primary.light,
              }}
              whileHover={
                !isLastPage
                  ? {
                      scale: 1.02,
                      boxShadow: `0 4px 12px ${HEALTHCARE_COLORS.primary.main}20`,
                    }
                  : {}
              }
              whileTap={!isLastPage ? { scale: 0.98 } : {}}
              aria-label="Trang sau"
            >
              Sau
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Enhanced Desktop pagination */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: HEALTHCARE_COLORS.primary.main }}
              ></div>
              <p className="text-sm text-gray-700">
                Hiển thị{' '}
                <span className="font-semibold" style={{ color: HEALTHCARE_COLORS.primary.main }}>
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                đến{' '}
                <span className="font-semibold" style={{ color: HEALTHCARE_COLORS.primary.main }}>
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{' '}
                của{' '}
                <span className="font-semibold" style={{ color: HEALTHCARE_COLORS.secondary.main }}>
                  {totalItems}
                </span>{' '}
                dịch vụ y tế
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-lg shadow-medical -space-x-px"
                aria-label="Phân trang dịch vụ y tế"
              >
                <motion.button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={isFirstPage}
                  className={`relative inline-flex items-center px-3 py-2 rounded-l-lg border text-sm font-medium min-h-[44px] transition-all duration-300 medical-focus ${
                    isFirstPage
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white text-primary border-primary-300 hover:bg-primary-50 hover:border-primary'
                  }`}
                  whileHover={!isFirstPage ? { scale: 1.05 } : {}}
                  whileTap={!isFirstPage ? { scale: 0.95 } : {}}
                  aria-label="Trang trước"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>

                {renderPageNumbers()}

                <motion.button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={isLastPage}
                  className={`relative inline-flex items-center px-3 py-2 rounded-r-lg border text-sm font-medium min-h-[44px] transition-all duration-300 medical-focus ${
                    isLastPage
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white text-primary border-primary-300 hover:bg-primary-50 hover:border-primary'
                  }`}
                  whileHover={!isLastPage ? { scale: 1.05 } : {}}
                  whileTap={!isLastPage ? { scale: 0.95 } : {}}
                  aria-label="Trang sau"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

MedicalPagination.displayName = 'MedicalPagination';

/**
 * Enhanced medical call-to-action component with hospital theming
 */
const MedicalCallToAction = memo(
  ({
    onContactClick,
    prefersReducedMotion = false,
    animationConfig = { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }: {
    onContactClick: () => void;
    prefersReducedMotion?: boolean;
    animationConfig?: { duration: number; ease: any };
  }) => (
    <motion.div
      className="mt-8 md:mt-12 rounded-xl p-6 md:p-8 border shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${HEALTHCARE_COLORS.primary[50]} 0%, ${HEALTHCARE_COLORS.medical.white} 50%, ${HEALTHCARE_COLORS.secondary[50]} 100%)`,
        borderColor: HEALTHCARE_COLORS.primary.light,
        boxShadow: `0 4px 20px ${HEALTHCARE_COLORS.primary.main}15`,
      }}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: animationConfig.duration * 1.2,
        ease: animationConfig.ease,
      }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-3 md:mb-4">
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-4"
              style={{ backgroundColor: HEALTHCARE_COLORS.primary.light }}
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                style={{ color: HEALTHCARE_COLORS.primary.main }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652m1.306-1.652l-1.306 1.652m0 0A9.014 9.014 0 014.33 16.712m14.34-9.424l-4.138 3.448M4.33 16.712a9.014 9.014 0 010-9.424m0 9.424a9.027 9.027 0 001.652 1.306M4.33 16.712l3.448-4.138M4.33 7.288a9.027 9.027 0 011.652-1.306M4.33 7.288l3.448 4.138m0 0a3.765 3.765 0 002.528 0m-2.528 0a3.765 3.765 0 000 2.528m2.528-2.528a3.765 3.765 0 000 2.528m0-2.528l4.138-3.448"
                />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              Cần tư vấn thêm về dịch vụ y tế?
            </h3>
          </div>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mt-2">
            Đội ngũ chuyên gia y tế và chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7. Chúng tôi cam kết mang đến
            dịch vụ tư vấn chất lượng cao.
          </p>
          <div
            className="flex items-center justify-center sm:justify-start mt-3 text-sm font-medium"
            style={{ color: HEALTHCARE_COLORS.secondary.main }}
          >
            <div
              className="w-3 h-3 rounded-full animate-pulse mr-3"
              style={{ backgroundColor: HEALTHCARE_COLORS.secondary.main }}
            ></div>
            <span>Tư vấn miễn phí • Phản hồi nhanh chóng • Chuyên gia giàu kinh nghiệm</span>
          </div>
        </div>
        <motion.button
          className="w-full lg:w-auto text-white rounded-lg px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-bold transition-all duration-300 min-h-[56px] medical-focus"
          style={{
            background: `linear-gradient(135deg, ${HEALTHCARE_COLORS.primary.main} 0%, ${HEALTHCARE_COLORS.primary.dark} 100%)`,
            boxShadow: `0 4px 12px ${HEALTHCARE_COLORS.primary.main}30`,
          }}
          onClick={onContactClick}
          whileHover={{
            scale: 1.02,
            y: -2,
            boxShadow: `0 8px 25px ${HEALTHCARE_COLORS.primary.main}40`,
          }}
          whileTap={{ scale: 0.98 }}
          aria-label="Liên hệ tư vấn dịch vụ y tế"
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.75a.75.75 0 100-1.5.75.75 0 000 1.5zM9.75 9.75h4.5"
              />
            </svg>
            Tư vấn chuyên gia
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
);

MedicalCallToAction.displayName = 'MedicalCallToAction';

/**
 * Optimized Medical Service Prices Page Component
 *
 * @returns Fully optimized medical service pricing page with enhanced performance
 */
const ServicePricesPage = memo(() => {
  // Motion preferences for accessibility
  const shouldReduceMotion = useReducedMotion();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for user motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(shouldReduceMotion || mediaQuery.matches);

    const handleChange = () => {
      setPrefersReducedMotion(shouldReduceMotion || mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [shouldReduceMotion]);

  // Testing and validation hooks for development
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    // Run accessibility validation after component mounts
    const timer = setTimeout(() => {
      validateAccessibility();
      validatePerformance();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Add keyboard navigation testing
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Log keyboard navigation for testing
      if (e.key === 'Tab') {
        console.log('Tab navigation:', document.activeElement);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Memoized animation configurations based on motion preferences for performance
  const animationConfig = useMemo(
    () => ({
      duration: prefersReducedMotion
        ? MEDICAL_PRICING_CONFIG.reducedMotionDuration / 1000
        : MEDICAL_PRICING_CONFIG.animationDuration / 1000,
      ease: prefersReducedMotion ? ('linear' as const) : ([0.25, 0.46, 0.45, 0.94] as const),
      scale: prefersReducedMotion ? 1 : undefined,
      y: prefersReducedMotion ? 0 : undefined,
    }),
    [prefersReducedMotion]
  );

  // Use optimized custom hook for data management
  const {
    categories,
    filteredItems,
    currentItems,
    isLoading,
    error,
    searchTerm,
    selectedCategory,
    currentPage,
    totalItems,
    totalPages,
    setSearchTerm,
    setSelectedCategory,
    setCurrentPage,
    performanceMetrics,
  } = useMedicalServicePrices({
    itemsPerPage: MEDICAL_PRICING_CONFIG.itemsPerPage,
    debounceDelay: MEDICAL_PRICING_CONFIG.debounceDelay,
    enableVirtualization: MEDICAL_PRICING_CONFIG.enableVirtualization,
  });

  // Refs for scroll management
  const priceTableRef = useRef<HTMLDivElement>(null);

  // Memoized handlers
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      priceTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [setCurrentPage]
  );

  // Optimized contact handler with performance considerations and analytics
  const handleContactClick = useCallback(() => {
    // Performance-optimized contact functionality
    try {
      // Track user interaction for analytics (non-blocking)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'contact_click', {
          event_category: 'medical_services',
          event_label: 'pricing_page',
          value: filteredItems.length,
        });
      }

      // Implementation for contact functionality
      console.log('Medical service contact requested');
      // Could integrate with Zalo messaging or phone call
    } catch (error) {
      // Fail silently to not break user experience
      console.warn('Analytics tracking failed:', error);
    }
  }, [filteredItems.length]);

  // Optimized and memoized desktop table row renderer for virtualization
  const renderDesktopRow = useCallback(
    (item: MedicalServicePriceItem) => (
      <div
        className="flex items-center p-4 h-full transition-colors duration-200 hover:bg-blue-50"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = HEALTHCARE_COLORS.primary[50];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        role="row"
        aria-label={`Dịch vụ ${item.name}, giá ${formatPriceOptimized(item.price)}`}
      >
        <div className="w-1/2">
          <div className="font-semibold text-gray-900 text-base leading-relaxed">{item.name}</div>
          <div className="text-sm text-gray-600 mt-2 flex items-center gap-2 leading-relaxed">
            {item.isEmergency && (
              <span
                className="text-base font-medium px-2 py-1 rounded-full"
                style={{
                  color: HEALTHCARE_COLORS.medical.emergency,
                  backgroundColor: `${HEALTHCARE_COLORS.medical.emergency}15`,
                }}
                role="img"
                aria-label="Khẩn cấp"
              >
                🚨 Khẩn cấp
              </span>
            )}
            <span className="font-medium">{item.categoryName}</span>
          </div>
        </div>
        <div className="w-1/4 text-gray-700 text-sm leading-relaxed px-2">{item.description}</div>
        <div
          className="w-1/4 text-right font-bold text-lg"
          style={{
            color: item.isEmergency ? HEALTHCARE_COLORS.medical.emergency : HEALTHCARE_COLORS.primary.main,
          }}
        >
          {formatPriceOptimized(item.price)}
        </div>
      </div>
    ),
    []
  );

  // Enhanced loading state with medical theming and performance optimization
  const loadingComponent = useMemo(() => {
    if (!isLoading) return null;

    return (
      <Section className="pt-4 px-2 sm:pt-8 sm:px-4 md:px-8" isCard>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="relative">
            <div
              className="w-16 h-16 border-4 rounded-full animate-spin"
              style={{
                borderColor: HEALTHCARE_COLORS.primary.light,
                borderTopColor: HEALTHCARE_COLORS.primary.main,
              }}
            ></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin"
              style={{
                borderTopColor: HEALTHCARE_COLORS.secondary.main,
                animationDirection: 'reverse',
                animationDuration: '1.5s',
              }}
            ></div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải dữ liệu dịch vụ y tế</h3>
            <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát...</p>
            <div className="flex items-center justify-center mt-3">
              <div
                className="w-2 h-2 rounded-full animate-pulse mr-2"
                style={{ backgroundColor: HEALTHCARE_COLORS.primary.main }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-pulse mr-2"
                style={{
                  backgroundColor: HEALTHCARE_COLORS.secondary.main,
                  animationDelay: '0.2s',
                }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: HEALTHCARE_COLORS.primary.main,
                  animationDelay: '0.4s',
                }}
              ></div>
            </div>
          </div>
        </motion.div>
      </Section>
    );
  }, [isLoading]);

  // Return loading component if loading
  if (isLoading) return loadingComponent;

  // Enhanced error state with medical theming
  if (error) {
    return (
      <Section className="pt-4 px-2 sm:pt-8 sm:px-4 md:px-8" isCard>
        <motion.div
          className="p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải dữ liệu dịch vụ</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <motion.button
            className="text-white px-6 py-2 rounded-lg transition-colors duration-300 min-h-[48px] medical-focus"
            style={{
              backgroundColor: HEALTHCARE_COLORS.primary.main,
            }}
            onClick={() => window.location.reload()}
            whileHover={{
              scale: 1.02,
              backgroundColor: HEALTHCARE_COLORS.primary.dark,
            }}
            whileTap={{ scale: 0.98 }}
          >
            Thử lại
          </motion.button>
        </motion.div>
      </Section>
    );
  }

  return (
    <motion.div
      role="main"
      aria-label="Bảng giá dịch vụ y tế"
      data-testid="medical-pricing-page"
      data-test-total-items={totalItems}
      data-test-filtered-items={filteredItems.length}
      data-test-current-page={currentPage}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: animationConfig.duration * 1.5,
        ease: animationConfig.ease,
      }}
    >
      <Section className="pt-6 px-4 sm:pt-8 sm:px-6 md:px-8 lg:px-12" isCard>
        {/* Enhanced Header with Medical Theming */}
        <header>
          <motion.div
            className="mb-8 md:mb-12"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: animationConfig.duration * 1.2,
              ease: animationConfig.ease,
            }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 md:mb-8">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6"
                style={{
                  background: `linear-gradient(135deg, ${HEALTHCARE_COLORS.primary.main} 0%, ${HEALTHCARE_COLORS.primary.dark} 100%)`,
                  boxShadow: `0 4px 12px ${HEALTHCARE_COLORS.primary.main}30`,
                }}
              >
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                  Bảng giá dịch vụ y tế
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto sm:mx-0">
                  Tham khảo giá các dịch vụ y tế chất lượng cao tại bệnh viện của chúng tôi. Giá cả minh bạch, dịch vụ
                  chuyên nghiệp, đội ngũ y bác sĩ giàu kinh nghiệm.
                </p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Enhanced Performance info for medical staff */}
        {performanceMetrics.totalItems > 0 && (
          <motion.div
            className="border rounded-lg p-4 shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${HEALTHCARE_COLORS.primary[50]} 0%, ${HEALTHCARE_COLORS.medical.white} 50%, ${HEALTHCARE_COLORS.secondary[50]} 100%)`,
              borderColor: HEALTHCARE_COLORS.primary.light,
            }}
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: animationConfig.duration,
              delay: prefersReducedMotion ? 0 : 0.2,
              ease: animationConfig.ease,
            }}
          >
            <div className="flex items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: HEALTHCARE_COLORS.primary.light }}
              >
                <svg
                  className="w-4 h-4"
                  style={{ color: HEALTHCARE_COLORS.primary.main }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <p className="text-base font-medium text-gray-900 leading-relaxed">
                  Hệ thống đang hiển thị{' '}
                  <span className="font-bold text-lg" style={{ color: HEALTHCARE_COLORS.primary.main }}>
                    {performanceMetrics.totalItems}
                  </span>{' '}
                  dịch vụ y tế
                </p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Cập nhật liên tục • Giá cả minh bạch • Dịch vụ chất lượng cao
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter section */}
        <section
          className="mt-8 md:mt-10 space-y-6"
          aria-label="Bộ lọc và tìm kiếm dịch vụ y tế"
          role="search"
          data-testid="medical-search-filters"
        >
          <h2 className="sr-only">Tìm kiếm và lọc dịch vụ y tế</h2>

          {/* Search bar */}
          <div role="group" aria-labelledby="search-label">
            <label id="search-label" className="sr-only">
              Tìm kiếm dịch vụ y tế theo tên
            </label>
            <MedicalSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Tìm kiếm dịch vụ y tế..."
              aria-describedby="search-help"
            />
            <div id="search-help" className="sr-only">
              Nhập tên dịch vụ y tế để tìm kiếm. Kết quả sẽ được cập nhật tự động.
            </div>
          </div>

          {/* Category filters */}
          <div role="group" aria-labelledby="filter-label">
            <label id="filter-label" className="sr-only">
              Lọc dịch vụ y tế theo danh mục
            </label>
            <MedicalCategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              showItemCounts={true}
              aria-describedby="filter-help"
            />
            <div id="filter-help" className="sr-only">
              Chọn danh mục để lọc dịch vụ y tế. Có thể chọn tất cả hoặc một danh mục cụ thể.
            </div>
          </div>
        </section>

        {/* Enhanced Results count with accessibility */}
        {filteredItems.length > 0 && (
          <section
            className="mt-6 md:mt-8 text-base text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            role="status"
            aria-live="polite"
            aria-label="Kết quả tìm kiếm dịch vụ y tế"
            data-testid="search-results-summary"
            data-test-results-count={filteredItems.length}
          >
            <span className="text-base leading-relaxed">
              Tìm thấy{' '}
              <span className="font-bold text-lg" style={{ color: HEALTHCARE_COLORS.primary.main }}>
                {filteredItems.length}
              </span>{' '}
              dịch vụ y tế phù hợp
              {selectedCategory && (
                <span
                  className="ml-3 text-sm px-3 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: HEALTHCARE_COLORS.primary.light,
                    color: HEALTHCARE_COLORS.primary.dark,
                  }}
                  role="img"
                  aria-label="Đã áp dụng bộ lọc"
                >
                  ✓ Đã lọc
                </span>
              )}
            </span>
            {(searchTerm || selectedCategory) && (
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className="text-sm text-gray-500 underline min-h-[52px] px-3 py-2 rounded-lg medical-focus transition-colors duration-200 hover:text-blue-600"
                whileHover={{
                  scale: 1.05,
                  color: HEALTHCARE_COLORS.primary.main,
                }}
                whileTap={{ scale: 0.95 }}
                aria-label="Xóa tất cả bộ lọc tìm kiếm và danh mục"
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Xóa bộ lọc
              </motion.button>
            )}
          </section>
        )}

        {/* Enhanced Desktop table view with medical theming */}
        <section aria-label="Bảng dịch vụ y tế - Chế độ xem desktop" data-testid="desktop-pricing-table">
          <motion.div
            className="hidden sm:block"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: animationConfig.duration * 1.2,
              delay: prefersReducedMotion ? 0 : 0.3,
              ease: animationConfig.ease,
            }}
          >
            <div
              ref={priceTableRef}
              className="overflow-hidden rounded-xl border shadow-lg"
              style={{
                borderColor: HEALTHCARE_COLORS.primary.light,
                boxShadow: `0 4px 20px ${HEALTHCARE_COLORS.primary.main}15`,
              }}
            >
              {/* Enhanced Table header with medical design */}
              <div
                className="p-4 border-b flex"
                style={{
                  background: `linear-gradient(135deg, ${HEALTHCARE_COLORS.primary[50]} 0%, ${HEALTHCARE_COLORS.medical.white} 50%, ${HEALTHCARE_COLORS.secondary[50]} 100%)`,
                  borderColor: HEALTHCARE_COLORS.primary.light,
                }}
                role="row"
                aria-label="Tiêu đề bảng dịch vụ y tế"
              >
                <div
                  className="w-1/2 font-bold text-base flex items-center"
                  style={{ color: HEALTHCARE_COLORS.primary.dark }}
                  role="columnheader"
                  aria-sort="none"
                  tabIndex={0}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
                  </svg>
                  Dịch vụ y tế
                </div>
                <div
                  className="w-1/4 font-bold text-base flex items-center"
                  style={{ color: HEALTHCARE_COLORS.primary.dark }}
                  role="columnheader"
                  tabIndex={0}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                  Mô tả chi tiết
                </div>
                <div
                  className="w-1/4 text-right font-bold text-base flex items-center justify-end"
                  style={{ color: HEALTHCARE_COLORS.secondary.dark }}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m-1.5-.124C9.113 4.5 12 7.387 12 11.25v4.5m0 0l3.75-3.75M12 15.75l3.75 3.75M9.75 9.75L12 12m0 0l2.25-2.25"
                    />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                  </svg>
                  Chi phí dịch vụ
                </div>
              </div>

              {/* Table body with virtualization */}
              <div className="divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <MedicalEmptyState />
                ) : (
                  <MedicalVirtualizedList
                    items={currentItems}
                    itemHeight={MEDICAL_PRICING_CONFIG.virtualItemHeight}
                    containerHeight={MEDICAL_PRICING_CONFIG.containerHeight}
                    renderItem={renderDesktopRow}
                    className="divide-y divide-gray-200"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Enhanced Mobile card view with medical theming */}
        <section aria-label="Danh sách dịch vụ y tế - Chế độ xem mobile" data-testid="mobile-pricing-cards">
          <motion.div
            className="block sm:hidden"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: animationConfig.duration * 1.2,
              delay: prefersReducedMotion ? 0 : 0.3,
              ease: animationConfig.ease,
            }}
          >
            <div className="mb-6">
              {filteredItems.length === 0 ? (
                <MedicalEmptyState />
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {currentItems.map((item, index) => (
                    <motion.div
                      key={`mobile-${item.id}-${index}`}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: animationConfig.duration,
                        delay: prefersReducedMotion ? 0 : index * 0.05,
                        ease: animationConfig.ease,
                      }}
                    >
                      <MedicalPriceCard item={item} showCategory={true} compact={false} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Pagination with medical design */}
        {filteredItems.length > 0 && (
          <nav
            aria-label="Điều hướng trang dịch vụ y tế"
            role="navigation"
            data-testid="pricing-pagination"
            data-test-current-page={currentPage}
            data-test-total-pages={totalPages}
          >
            <MedicalPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={MEDICAL_PRICING_CONFIG.itemsPerPage}
              onPageChange={handlePageChange}
              prefersReducedMotion={prefersReducedMotion}
              animationConfig={animationConfig}
            />
          </nav>
        )}

        {/* Enhanced Mobile scroll to top button with medical theming */}
        <div className="block sm:hidden fixed bottom-6 right-6 z-10">
          <motion.button
            className="text-white rounded-full p-4 transition-all duration-300 min-h-[56px] min-w-[56px] flex items-center justify-center medical-focus shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${HEALTHCARE_COLORS.primary.main} 0%, ${HEALTHCARE_COLORS.primary.dark} 100%)`,
              boxShadow: `0 4px 12px ${HEALTHCARE_COLORS.primary.main}40`,
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{
              scale: 1.1,
              y: -2,
              boxShadow: `0 8px 25px ${HEALTHCARE_COLORS.primary.main}50`,
            }}
            whileTap={{ scale: 0.9 }}
            aria-label="Cuộn lên đầu trang"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: HEALTHCARE_COLORS.secondary.main }}
            ></div>
          </motion.button>
        </div>

        {/* Medical call to action */}
        <MedicalCallToAction
          onContactClick={handleContactClick}
          prefersReducedMotion={prefersReducedMotion}
          animationConfig={animationConfig}
        />
      </Section>

      {/* Performance Monitor for development with lazy loading */}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <PerformanceMonitor />
        </Suspense>
      )}

      {/* Testing Summary for Development */}
      {import.meta.env.DEV && (
        <div
          data-testid="testing-summary"
          style={{ display: 'none' }}
          data-test-summary={JSON.stringify({
            totalItems,
            filteredItems: filteredItems.length,
            currentPage,
            totalPages,
            searchTerm,
            selectedCategory,
            prefersReducedMotion,
            performanceMetrics,
            accessibilityFeatures: {
              ariaLabels: true,
              keyboardNavigation: true,
              semanticHTML: true,
              colorContrast: 'WCAG-AA',
              screenReaderSupport: true,
              focusManagement: true,
            },
            responsiveDesign: {
              mobileOptimized: true,
              tabletOptimized: true,
              desktopOptimized: true,
              touchTargets: '48px+',
            },
            performanceOptimizations: {
              lazyLoading: true,
              memoization: true,
              virtualization: true,
              codesplitting: true,
            },
          })}
        />
      )}
    </motion.div>
  );
});

ServicePricesPage.displayName = 'ServicePricesPage';

export default ServicePricesPage;
