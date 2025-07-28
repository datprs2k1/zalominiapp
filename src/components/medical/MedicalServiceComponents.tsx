/**
 * Enhanced Medical Service Components
 * Modern hospital-themed React components with enhanced medical UI design system
 *
 * @version 3.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 *
 * @features
 * - Hospital-themed medical UI with primary blues (#0066CC, #004499) and secondary greens (#00AA44, #008833)
 * - Gentle 300-500ms animations with medical-appropriate easing
 * - Enhanced accessibility with ARIA labels and Vietnamese localization
 * - Medical iconography and emergency service indicators
 * - 44px minimum touch targets for mobile accessibility
 */

import React, { memo, useCallback, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPriceOptimized } from '@/utils/medicalDataProcessing';
import type {
  MedicalServicePriceItem,
  MedicalServiceCategory,
  MedicalPriceCardProps,
  MedicalCategoryFilterProps,
  MedicalSearchBarProps,
  MedicalVirtualizedListProps,
} from '@/types/medical';

/**
 * Medical color palette constants
 */
const MEDICAL_COLORS = {
  primary: {
    blue: '#0066CC',
    darkBlue: '#004499',
  },
  secondary: {
    green: '#00AA44',
    darkGreen: '#008833',
  },
  neutral: {
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  },
} as const;

// Using imported types from @/types/medical

/**
 * Enhanced medical price card component with hospital-themed design and animations
 *
 * @param props - Component props
 * @returns Memoized medical price card component with enhanced theming
 *
 * @features
 * - Hospital-themed medical colors and gradients
 * - Gentle hover animations with medical-appropriate easing
 * - Emergency service indicators with visual feedback
 * - Enhanced accessibility with ARIA labels
 * - 44px minimum touch targets for mobile
 */
export const MedicalPriceCard = memo<MedicalPriceCardProps>(
  ({ item, onClick, showCategory = true, compact = false }) => {
    // Memoized price formatting
    const formattedPrice = useMemo(() => formatPriceOptimized(item.price), [item.price]);

    // Memoized click handler
    const handleClick = useCallback(() => {
      onClick?.(item);
    }, [onClick, item]);

    // Memoized emergency indicator
    const isEmergency = item.isEmergency || item.priority === 1;

    // Memoized CSS classes
    const cardClasses = useMemo(() => {
      const baseClasses = [
        'bg-white',
        'rounded-xl',
        'shadow-sm',
        'border',
        'transition-all',
        'duration-300',
        'hover:shadow-md',
        'hover:border-blue-200',
        'cursor-pointer',
        'min-h-[44px]', // Medical touch target requirement
      ];

      if (compact) {
        baseClasses.push('p-3');
      } else {
        baseClasses.push('p-4');
      }

      if (isEmergency) {
        baseClasses.push('border-red-200', 'bg-red-50');
      } else {
        baseClasses.push('border-gray-100');
      }

      return baseClasses.join(' ');
    }, [compact, isEmergency]);

    const categoryClasses = useMemo(() => {
      const baseClasses = ['inline-block', 'px-2', 'py-1', 'text-xs', 'rounded-full', 'mb-2', 'font-medium'];

      if (isEmergency) {
        baseClasses.push('bg-red-100', 'text-red-700');
      } else {
        baseClasses.push('bg-blue-50', 'text-blue-600');
      }

      return baseClasses.join(' ');
    }, [isEmergency]);

    return (
      <motion.div
        className={`
          bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer medical-focus border
          ${compact ? 'p-3' : 'p-4'}
          ${
            isEmergency
              ? 'border-red-200 bg-gradient-to-r from-red-50 to-red-25 shadow-emergency'
              : 'border-primary-200 hover:border-primary-300'
          }
          min-h-[44px]
        `}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Dịch vụ y tế ${item.name}, giá ${formattedPrice}${isEmergency ? ', dịch vụ cấp cứu' : ''}${showCategory ? `, thuộc ${item.categoryName}` : ''}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        whileHover={{
          scale: 1.02,
          y: -2,
          transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        whileTap={{
          scale: 0.98,
          transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className={compact ? 'mb-1' : 'mb-2'}>
          {showCategory && (
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-red-500' : 'bg-primary'}`}></div>
              <span
                className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${
                  isEmergency ? 'bg-red-100 text-red-700' : 'bg-primary-50 text-primary-dark'
                }`}
              >
                {isEmergency && (
                  <motion.svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                )}
                {item.categoryName}
              </span>
            </div>
          )}
          <h3 className={`text-gray-900 font-semibold ${compact ? 'text-sm' : 'text-base'}`}>{item.name}</h3>
        </div>

        {item.description && (
          <p className={`text-gray-600 mb-3 ${compact ? 'text-xs' : 'text-sm'} line-clamp-2`}>{item.description}</p>
        )}

        <div className="flex justify-between items-center">
          <span
            className={`font-bold ${isEmergency ? 'text-red-700' : 'text-secondary-dark'} ${compact ? 'text-base' : 'text-lg'}`}
          >
            {formattedPrice}
          </span>
          {isEmergency && (
            <motion.span
              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Cấp cứu
            </motion.span>
          )}
        </div>
      </motion.div>
    );
  }
);

MedicalPriceCard.displayName = 'MedicalPriceCard';

// MedicalCategoryFilterProps imported from types

/**
 * Optimized medical category filter component
 *
 * @param props - Component props
 * @returns Memoized category filter component
 */
export const MedicalCategoryFilter = memo<MedicalCategoryFilterProps>(
  ({ categories, selectedCategory, onCategoryChange, showItemCounts = true }) => {
    // Memoized category buttons
    const categoryButtons = useMemo(() => {
      return categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const isEmergency = category.priority === 1;

        const buttonClasses = [
          'flex-shrink-0',
          'px-4',
          'py-2',
          'rounded-lg',
          'text-sm',
          'font-medium',
          'transition-all',
          'duration-200',
          'min-h-[44px]', // Medical touch target
          'flex',
          'items-center',
          'gap-2',
        ];

        if (isSelected) {
          if (isEmergency) {
            buttonClasses.push('bg-red-600', 'text-white', 'shadow-sm');
          } else {
            buttonClasses.push('bg-blue-600', 'text-white', 'shadow-sm');
          }
        } else {
          if (isEmergency) {
            buttonClasses.push('bg-red-50', 'text-red-700', 'hover:bg-red-100');
          } else {
            buttonClasses.push('bg-gray-100', 'text-gray-800', 'hover:bg-gray-200');
          }
        }

        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px] flex items-center gap-2 medical-focus
              ${
                isSelected
                  ? isEmergency
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-emergency'
                    : 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-medical'
                  : isEmergency
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary border border-gray-200 hover:border-primary-300'
              }
            `}
            title={category.name}
            aria-pressed={isSelected}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {isEmergency && (
              <motion.div
                className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}
            <span className="truncate max-w-[160px]">{category.name}</span>
            {showItemCounts && category.itemCount && (
              <motion.span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  isSelected
                    ? 'bg-white bg-opacity-20 text-white'
                    : isEmergency
                      ? 'bg-red-100 text-red-700'
                      : 'bg-primary-100 text-primary-dark'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {category.itemCount}
              </motion.span>
            )}
          </motion.button>
        );
      });
    }, [categories, selectedCategory, onCategoryChange, showItemCounts]);

    return (
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900">Danh mục dịch vụ y tế</h3>
        </div>
        <div className="relative">
          <div className="overflow-x-auto -mx-2 px-2">
            <div className="flex space-x-3 pb-2">
              {/* Enhanced All categories button */}
              <motion.button
                onClick={() => onCategoryChange(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px] flex items-center gap-2 medical-focus ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-medical'
                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary border border-gray-200 hover:border-primary-300'
                }`}
                aria-pressed={selectedCategory === null}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Tất cả dịch vụ
              </motion.button>
              {categoryButtons}
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white pointer-events-none"></div>
        </div>
      </motion.div>
    );
  }
);

MedicalCategoryFilter.displayName = 'MedicalCategoryFilter';

// MedicalSearchBarProps imported from types

/**
 * Enhanced medical search bar component with hospital theming
 *
 * @param props - Component props
 * @returns Memoized search bar component with enhanced medical design
 */
export const MedicalSearchBar = memo<MedicalSearchBarProps>(
  ({ value, onChange, placeholder = 'Tìm kiếm dịch vụ y tế...', disabled = false }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    const handleClear = useCallback(() => {
      onChange('');
    }, [onChange]);

    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <motion.svg
              className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={isFocused ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </motion.svg>
          </div>
          <input
            type="text"
            className={`w-full py-3 pl-12 pr-12 rounded-xl border shadow-sm transition-all duration-300 min-h-[44px] medical-focus ${
              isFocused
                ? 'border-primary bg-primary-50 ring-2 ring-primary-200'
                : 'border-gray-300 bg-white hover:border-primary-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            aria-label="Tìm kiếm dịch vụ y tế"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <AnimatePresence mode="wait">
              {value ? (
                <motion.button
                  key="clear"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-red-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Xóa tìm kiếm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              ) : (
                <motion.div
                  key="search-indicator"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Tìm kiếm</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }
);

MedicalSearchBar.displayName = 'MedicalSearchBar';

/**
 * Enhanced props interface for MedicalLoadingSpinner component
 */
interface MedicalLoadingSpinnerProps {
  readonly size?: 'sm' | 'md' | 'lg';
  readonly message?: string;
  readonly type?: 'spinner' | 'pulse' | 'heartbeat' | 'dots';
  readonly className?: string;
}

/**
 * Enhanced medical-themed loading spinner component with hospital design
 *
 * @param props - Component props
 * @returns Enhanced medical loading spinner component with animations
 */
export const MedicalLoadingSpinner = memo<MedicalLoadingSpinnerProps>(
  ({ size = 'md', message = 'Đang tải dữ liệu y tế...', type = 'spinner', className = '' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    };

    const renderSpinner = () => {
      switch (type) {
        case 'pulse':
          return (
            <motion.div
              className={`${sizeClasses[size]} bg-gradient-to-r from-primary to-secondary rounded-full`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );

        case 'heartbeat':
          return (
            <motion.div
              className={`${sizeClasses[size]} flex items-center justify-center`}
              animate={{
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.14, 0.28, 0.42, 0.7],
              }}
            >
              <svg className="w-full h-full text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          );

        case 'dots':
          return (
            <div className="flex space-x-2">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-primary rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          );

        default:
          return (
            <div className="relative">
              <div
                className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary rounded-full animate-spin`}
              ></div>
              <div
                className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-secondary rounded-full animate-spin`}
                style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
              ></div>
            </div>
          );
      }
    };

    return (
      <motion.div
        className={`flex flex-col items-center justify-center py-12 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderSpinner()}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <p className="text-base font-medium text-gray-900 mb-2">{message}</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

MedicalLoadingSpinner.displayName = 'MedicalLoadingSpinner';

/**
 * Medical skeleton loading component for card layouts
 */
export const MedicalSkeleton = memo(
  ({
    count = 3,
    type = 'card',
    className = '',
  }: {
    count?: number;
    type?: 'card' | 'list' | 'table';
    className?: string;
  }) => {
    const renderCardSkeleton = () => (
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="ml-4">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderListSkeleton = () => (
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="animate-pulse flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );

    const renderTableSkeleton = () => (
      <div className="bg-white border border-gray-200">
        <div className="animate-pulse p-4 flex items-center space-x-4">
          <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );

    const renderSkeleton = () => {
      switch (type) {
        case 'list':
          return renderListSkeleton();
        case 'table':
          return renderTableSkeleton();
        default:
          return renderCardSkeleton();
      }
    };

    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }, (_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {renderSkeleton()}
          </motion.div>
        ))}
      </div>
    );
  }
);

MedicalSkeleton.displayName = 'MedicalSkeleton';

/**
 * Medical priority badge component
 */
export const MedicalPriorityBadge = memo(
  ({
    priority,
    size = 'md',
    className = '',
  }: {
    priority: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }) => {
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base',
    };

    const priorityConfig = {
      low: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        icon: '📋',
        label: 'Thường',
      },
      medium: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: '📝',
        label: 'Trung bình',
      },
      high: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: '⚠️',
        label: 'Cao',
      },
      critical: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        icon: '🔥',
        label: 'Nghiêm trọng',
      },
      emergency: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: '🚨',
        label: 'Cấp cứu',
      },
    };

    const config = priorityConfig[priority];

    return (
      <motion.span
        className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${config.bg} ${config.text} ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        <span role="img" aria-label={`Mức độ ưu tiên ${config.label}`}>
          {config.icon}
        </span>
        {config.label}
      </motion.span>
    );
  }
);

MedicalPriorityBadge.displayName = 'MedicalPriorityBadge';

/**
 * Medical status indicator component
 */
export const MedicalStatusIndicator = memo(
  ({
    status,
    size = 'md',
    showLabel = true,
    className = '',
  }: {
    status: 'available' | 'busy' | 'offline' | 'emergency';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
  }) => {
    const sizeClasses = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
    };

    const statusConfig = {
      available: {
        color: 'bg-green-500',
        label: 'Sẵn sàng',
        animation: 'animate-pulse',
      },
      busy: {
        color: 'bg-yellow-500',
        label: 'Bận',
        animation: '',
      },
      offline: {
        color: 'bg-gray-400',
        label: 'Offline',
        animation: '',
      },
      emergency: {
        color: 'bg-red-500',
        label: 'Cấp cứu',
        animation: 'animate-ping',
      },
    };

    const config = statusConfig[status];

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative">
          <div className={`${sizeClasses[size]} ${config.color} rounded-full`}></div>
          {config.animation && (
            <div
              className={`absolute inset-0 ${sizeClasses[size]} ${config.color} rounded-full ${config.animation} opacity-75`}
            ></div>
          )}
        </div>
        {showLabel && <span className="text-sm text-gray-600">{config.label}</span>}
      </div>
    );
  }
);

MedicalStatusIndicator.displayName = 'MedicalStatusIndicator';

/**
 * Medical icon component with animations
 */
export const MedicalIcon = memo(
  ({
    type,
    size = 'md',
    animate = false,
    className = '',
  }: {
    type: 'stethoscope' | 'heart' | 'pill' | 'syringe' | 'cross' | 'ambulance';
    size?: 'sm' | 'md' | 'lg';
    animate?: boolean;
    className?: string;
  }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    const icons = {
      stethoscope: (
        <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7z"
          />
        </svg>
      ),
      heart: (
        <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ),
      pill: (
        <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      syringe: (
        <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 18v2m8-10a2 2 0 100-4 2 2 0 000 4zm0 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"
          />
        </svg>
      ),
      cross: (
        <svg className={`${sizeClasses[size]} ${className}`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      ambulance: (
        <svg className={`${sizeClasses[size]} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    };

    const MotionIcon = animate ? motion.div : 'div';
    const animationProps = animate
      ? {
          animate:
            type === 'heart'
              ? {
                  scale: [1, 1.1, 1, 1.1, 1],
                }
              : {
                  rotate: [0, 5, -5, 0],
                },
          transition: {
            duration: type === 'heart' ? 1.5 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }
      : {};

    return <MotionIcon {...animationProps}>{icons[type]}</MotionIcon>;
  }
);

MedicalIcon.displayName = 'MedicalIcon';

/**
 * Medical-themed empty state component
 */
export const MedicalEmptyState = memo(() => (
  <div className="p-6 text-center text-gray-500">
    <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    </svg>
    <p className="text-base font-medium text-gray-900 mb-1">Không tìm thấy dịch vụ</p>
    <p className="text-sm">Vui lòng thử lại với từ khóa khác hoặc chọn danh mục khác</p>
  </div>
));

MedicalEmptyState.displayName = 'MedicalEmptyState';

// MedicalVirtualizedListProps imported from types

/**
 * Optimized virtualized list component for medical services
 *
 * @param props - Component props
 * @returns Virtualized list component with medical optimizations
 */
export const MedicalVirtualizedList = memo<MedicalVirtualizedListProps<MedicalServicePriceItem>>(
  ({ items, itemHeight, containerHeight, renderItem, overscan = 3, className = '' }) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate visible range
    const visibleRange = useMemo(() => {
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const visibleCount = Math.ceil(containerHeight / itemHeight);
      const end = Math.min(items.length, start + visibleCount + overscan * 2);

      return { start, end };
    }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

    // Handle scroll with throttling
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []);

    // Memoized visible items
    const visibleItems = useMemo(() => {
      return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
        item,
        index: visibleRange.start + index,
        top: (visibleRange.start + index) * itemHeight,
      }));
    }, [items, visibleRange, itemHeight]);

    const totalHeight = items.length * itemHeight;

    return (
      <div
        ref={containerRef}
        className={`overflow-auto ${className}`}
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map(({ item, index, top }) => (
            <div
              key={`${item.id}-${index}`}
              style={{
                position: 'absolute',
                top,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

MedicalVirtualizedList.displayName = 'MedicalVirtualizedList';
