/**
 * Enhanced Medical Service Prices Page
 * Modern hospital-themed page component with enhanced medical UI design system
 *
 * @version 3.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 *
 * @features
 * - Hospital-themed medical UI with primary blues (#0066CC, #004499) and secondary greens (#00AA44, #008833)
 * - Enhanced card-based layouts with medical design tokens
 * - Gentle 300-500ms animations with medical-appropriate easing
 * - 44px minimum touch targets for mobile accessibility
 * - Medical iconography and emergency service indicators
 * - ARIA labels and Vietnamese localization support
 * - Optimized performance with virtualization and memoization
 */

import React, { memo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
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
import PerformanceMonitor from '@/components/PerformanceMonitor';

/**
 * Enhanced medical service pricing page configuration
 */
const MEDICAL_PRICING_CONFIG = {
  itemsPerPage: 12,
  debounceDelay: 250,
  virtualItemHeight: 80,
  containerHeight: 600,
  enableVirtualization: true,
  touchTargetSize: 44, // Minimum touch target for mobile accessibility
  animationDuration: 300, // Medical-appropriate animation timing
} as const;

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
  }: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
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
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium min-h-[44px] transition-all duration-300 medical-focus ${
              currentPage === i
                ? 'z-10 bg-primary-50 border-primary text-primary-dark shadow-sm'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-primary-50 hover:border-primary-light hover:text-primary'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-current={currentPage === i ? 'page' : undefined}
            aria-label={`Trang ${i}`}
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
        className="px-4 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 border-t border-primary-200 sm:px-6 rounded-b-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center justify-between">
          {/* Enhanced Mobile pagination */}
          <div className="flex-1 flex justify-between sm:hidden">
            <motion.button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={isFirstPage}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg min-h-[44px] transition-all duration-300 medical-focus ${
                isFirstPage
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-primary border-primary-300 hover:bg-primary-50 hover:border-primary shadow-sm'
              }`}
              whileHover={!isFirstPage ? { scale: 1.02 } : {}}
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
              className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg min-h-[44px] transition-all duration-300 medical-focus ${
                isLastPage
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-primary border-primary-300 hover:bg-primary-50 hover:border-primary shadow-sm'
              }`}
              whileHover={!isLastPage ? { scale: 1.02 } : {}}
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
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-semibold text-primary">{(currentPage - 1) * itemsPerPage + 1}</span> đến{' '}
                <span className="font-semibold text-primary">{Math.min(currentPage * itemsPerPage, totalItems)}</span>{' '}
                của <span className="font-semibold text-secondary">{totalItems}</span> dịch vụ y tế
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
const MedicalCallToAction = memo(({ onContactClick }: { onContactClick: () => void }) => (
  <motion.div
    className="mt-8 bg-gradient-to-r from-primary-50 via-white to-secondary-50 rounded-xl p-6 border border-primary-200 shadow-medical"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="flex flex-col sm:flex-row items-center justify-between">
      <div className="mb-4 sm:mb-0 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start mb-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Cần tư vấn thêm về dịch vụ y tế?</h3>
        </div>
        <p className="text-sm text-gray-600">
          Đội ngũ chuyên gia y tế và chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7
        </p>
        <div className="flex items-center justify-center sm:justify-start mt-2 text-xs text-secondary">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse mr-2"></div>
          <span>Tư vấn miễn phí • Phản hồi nhanh chóng</span>
        </div>
      </div>
      <motion.button
        className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg px-6 py-3 text-sm font-medium shadow-medical hover:shadow-medical-hover transition-all duration-300 min-h-[44px] medical-focus"
        onClick={onContactClick}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Liên hệ tư vấn dịch vụ y tế"
      >
        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Liên hệ ngay
        </div>
      </motion.button>
    </div>
  </motion.div>
));

MedicalCallToAction.displayName = 'MedicalCallToAction';

/**
 * Optimized Medical Service Prices Page Component
 *
 * @returns Fully optimized medical service pricing page with enhanced performance
 */
const ServicePricesPage = memo(() => {
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

  const handleContactClick = useCallback(() => {
    // Implementation for contact functionality
    console.log('Medical service contact requested');
    // Could integrate with Zalo messaging or phone call
  }, []);

  // Memoized desktop table row renderer for virtualization
  const renderDesktopRow = useCallback(
    (item: MedicalServicePriceItem) => (
      <div className="flex items-center p-4 h-full hover:bg-blue-50 transition-colors duration-200">
        <div className="w-1/2">
          <div className="font-medium text-gray-800">{item.name}</div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
            {item.isEmergency && <span className="text-red-600">🚨</span>}
            {item.categoryName}
          </div>
        </div>
        <div className="w-1/4 text-gray-600 text-sm">{item.description}</div>
        <div className={`w-1/4 text-right font-medium ${item.isEmergency ? 'text-red-700' : 'text-blue-700'}`}>
          {formatPriceOptimized(item.price)}
        </div>
      </div>
    ),
    []
  );

  // Enhanced loading state with medical theming
  if (isLoading) {
    return (
      <Section className="pt-4 px-2 sm:pt-8 sm:px-4 md:px-8" isCard>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            ></div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải dữ liệu dịch vụ y tế</h3>
            <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát...</p>
            <div className="flex items-center justify-center mt-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2"></div>
              <div
                className="w-2 h-2 bg-secondary rounded-full animate-pulse mr-2"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </motion.div>
      </Section>
    );
  }

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
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300 min-h-[44px] medical-focus"
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.02 }}
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Section className="pt-4 px-2 sm:pt-8 sm:px-4 md:px-8" isCard>
        {/* Enhanced Header with Medical Theming */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center mr-4 shadow-medical">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Bảng giá dịch vụ y tế</h2>
              <p className="text-sm text-gray-600">
                Tham khảo giá các dịch vụ y tế chất lượng cao tại bệnh viện của chúng tôi
              </p>
            </div>
          </div>

          {/* Enhanced Performance info for medical staff */}
          {performanceMetrics.totalItems > 0 && (
            <motion.div
              className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-4 shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Hệ thống đang hiển thị{' '}
                    <span className="text-primary font-semibold">{performanceMetrics.totalItems}</span> dịch vụ y tế
                  </p>
                  <p className="text-xs text-gray-600">Cập nhật liên tục • Giá cả minh bạch</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filter section */}
          <div className="mt-6 space-y-4">
            {/* Search bar */}
            <MedicalSearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Tìm kiếm dịch vụ y tế..." />

            {/* Category filters */}
            <MedicalCategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              showItemCounts={true}
            />
          </div>

          {/* Enhanced Results count with accessibility */}
          {filteredItems.length > 0 && (
            <div
              className="mt-4 text-sm text-gray-600 flex items-center justify-between"
              role="status"
              aria-live="polite"
            >
              <span>
                Tìm thấy <span className="font-medium text-primary">{filteredItems.length}</span> dịch vụ y tế
                {selectedCategory && (
                  <span
                    className="ml-2 text-xs bg-primary-100 text-primary-dark px-2 py-1 rounded-full"
                    role="img"
                    aria-label="Đã áp dụng bộ lọc"
                  >
                    Đã lọc
                  </span>
                )}
              </span>
              {(searchTerm || selectedCategory) && (
                <motion.button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }}
                  className="text-xs text-gray-500 hover:text-primary underline min-h-[44px] px-2 py-1 rounded medical-focus"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Xóa tất cả bộ lọc tìm kiếm và danh mục"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Xóa bộ lọc
                </motion.button>
              )}
            </div>
          )}
        </motion.div>

        {/* Enhanced Desktop table view with medical theming */}
        <motion.div
          className="hidden sm:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div ref={priceTableRef} className="overflow-hidden rounded-xl border border-primary-200 shadow-medical">
            {/* Enhanced Table header with medical design */}
            <div className="bg-gradient-to-r from-primary-50 via-white to-secondary-50 p-4 border-b border-primary-200 flex">
              <div className="w-1/2 font-semibold text-primary-dark flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                Dịch vụ y tế
              </div>
              <div className="w-1/4 font-semibold text-primary-dark flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Mô tả
              </div>
              <div className="w-1/4 text-right font-semibold text-secondary-dark flex items-center justify-end">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                Giá tiền
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

        {/* Enhanced Mobile card view with medical theming */}
        <motion.div
          className="block sm:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="mb-4">
            {filteredItems.length === 0 ? (
              <MedicalEmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {currentItems.map((item, index) => (
                  <motion.div
                    key={`mobile-${item.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <MedicalPriceCard item={item} showCategory={true} compact={false} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Pagination with medical design */}
        {filteredItems.length > 0 && (
          <MedicalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={MEDICAL_PRICING_CONFIG.itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}

        {/* Enhanced Mobile scroll to top button with medical theming */}
        <div className="block sm:hidden fixed bottom-4 right-4 z-10">
          <motion.button
            className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-full p-3 shadow-medical hover:shadow-medical-hover transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center medical-focus"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Cuộn lên đầu trang"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
          </motion.button>
        </div>

        {/* Medical call to action */}
        <MedicalCallToAction onContactClick={handleContactClick} />
      </Section>

      {/* Performance Monitor for development */}
      {import.meta.env.DEV && <PerformanceMonitor />}
    </motion.div>
  );
});

ServicePricesPage.displayName = 'ServicePricesPage';

export default ServicePricesPage;
