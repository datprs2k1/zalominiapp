import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doctor } from '@/types';
import { WPDoctor } from '@/services/wp-types';
import { doctorsAtom } from '@/services/post';
import {
  MEDICAL_COLORS,
  BORDER_RADIUS,
  SHADOWS,
  SPACING,
  ANIMATIONS,
  TOUCH_TARGETS,
  combineClasses,
} from '@/styles/medical-design-system';
import './doctor-list.css';

// Helper function to convert WPDoctor to Doctor
const convertToDoctor = (wpDoctor: WPDoctor): Doctor => ({
  id: wpDoctor.id,
  name: wpDoctor.title?.rendered || '',
  title: wpDoctor.bacsi_chucdanh || '',
  languages: wpDoctor.bacsi_ngonngu || '',
  specialties: wpDoctor.bacsi_chuyenmon || '',
  image: wpDoctor._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
  isAvailable: wpDoctor.bacsi_trangthai !== 'unavailable',
  unit: wpDoctor.bacsi_donvi || '',
});

// Modern Hospital-Themed Doctor Card Component
interface DoctorCardProps {
  doctor: Doctor;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
  index: number;
}

const DoctorCard = ({ doctor, isSelected, isDisabled, onClick, index }: DoctorCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const avatarUrl = imageError ? '/avatar-doctor-fallback.png' : doctor.image || '/avatar-doctor-fallback.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94], // Medical easing
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      className={combineClasses(
        // Enhanced card container with hospital theme
        'relative overflow-hidden',
        'bg-gradient-to-br from-white via-blue-50/30 to-green-50/20',
        'border-2 transition-all duration-300',
        isSelected
          ? 'border-blue-400 shadow-xl shadow-blue-100/50 bg-gradient-to-br from-blue-50 via-white to-blue-50'
          : 'border-blue-100/60 hover:border-blue-300/80 shadow-lg shadow-blue-50/30',
        BORDER_RADIUS.section,
        'backdrop-blur-sm',
        // Enhanced padding for larger content
        'p-6 sm:p-8 md:p-10',
        // Accessibility and interaction
        'cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-200/60',
        'touch-manipulation',
        // Disabled state
        isDisabled && 'opacity-70 cursor-not-allowed bg-gray-50/80 border-gray-200'
      )}
      onClick={!isDisabled ? onClick : undefined}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={`${isSelected ? 'Đã chọn' : 'Chọn'} bác sĩ ${doctor.name}${isDisabled ? ' (không có sẵn)' : ''}`}
      aria-disabled={isDisabled}
    >
      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute top-4 right-4 z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-6 sm:gap-8">
        {/* Enhanced Doctor Avatar - Larger and More Prominent */}
        <div className="flex-shrink-0 relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={combineClasses(
              // Significantly larger sizing for prominence
              'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36',
              // Circular frame for modern hospital aesthetic
              'rounded-full overflow-hidden',
              'bg-gradient-to-br from-blue-50 via-white to-green-50',
              // Enhanced shadow and ring for prominence
              'shadow-xl shadow-blue-100/60',
              'ring-4 ring-white',
              'border-3 border-blue-100/80',
              // Hover effects
              'hover:shadow-2xl hover:shadow-blue-200/70 hover:ring-blue-200/50',
              'transition-all duration-300'
            )}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 animate-pulse flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}

            <img
              src={avatarUrl}
              alt={`Ảnh đại diện của ${doctor.name}`}
              className={combineClasses(
                'object-cover w-full h-full transition-all duration-300',
                'hover:scale-105',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              decoding="async"
            />

            {/* Enhanced availability indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className={combineClasses(
                'absolute -bottom-2 -right-2',
                'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14',
                'rounded-full border-4 border-white shadow-lg',
                doctor.isAvailable
                  ? 'bg-gradient-to-br from-green-400 to-green-600'
                  : 'bg-gradient-to-br from-gray-400 to-gray-600',
                doctor.isAvailable && 'animate-pulse'
              )}
              aria-label={doctor.isAvailable ? 'Có sẵn' : 'Không có sẵn'}
            >
              <div className="w-full h-full flex items-center justify-center">
                {doctor.isAvailable ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Doctor Information with Enhanced Typography */}
        <div className="flex-grow min-w-0">
          {/* Enhanced Doctor Name with Prominent Typography */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: 'easeOut' }}
            className={combineClasses(
              // Larger, more prominent font sizing
              'text-2xl font-black text-gray-900',
              'sm:text-3xl md:text-4xl lg:text-5xl',
              'leading-tight tracking-tight mb-4',
              // Enhanced visual hierarchy with gradient text
              'bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900',
              'bg-clip-text text-transparent',
              'break-words hyphens-auto drop-shadow-sm'
            )}
          >
            {doctor.name}
          </motion.h3>

          {/* Enhanced Professional Title Badge */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, ease: 'easeOut' }}
            className={combineClasses(
              'inline-flex items-center px-5 py-3 mb-4',
              'text-base font-bold',
              'bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-50',
              'text-blue-800 border-2 border-blue-200/80',
              BORDER_RADIUS.cardLarge,
              'shadow-md shadow-blue-100/60 backdrop-blur-sm',
              'hover:shadow-lg hover:border-blue-300/80',
              'transition-all duration-300'
            )}
          >
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{doctor.title}</span>
          </motion.div>

          {/* Enhanced Department Information */}
          {doctor.unit && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, ease: 'easeOut' }}
              className={combineClasses(
                'flex items-center text-base text-gray-700 mb-3 font-semibold',
                'px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50/50',
                'border border-gray-200/60 rounded-lg shadow-sm'
              )}
            >
              <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="truncate">{doctor.unit}</span>
            </motion.div>
          )}

          {/* Enhanced Specialties */}
          {doctor.specialties && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ease: 'easeOut' }}
              className="mb-3"
            >
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold text-green-700">Chuyên môn:</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed pl-6">{doctor.specialties}</p>
            </motion.div>
          )}

          {/* Enhanced Languages */}
          {doctor.languages && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ease: 'easeOut' }}
              className="mb-3"
            >
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                <span className="font-semibold text-purple-700">Ngôn ngữ:</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed pl-6">{doctor.languages}</p>
            </motion.div>
          )}

          {/* Unavailable indicator */}
          {!doctor.isAvailable && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-full"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Không có sẵn
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to get title rank for sorting (higher number = higher rank)
const getTitleRank = (title: string): number => {
  if (!title) return -1;

  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('thạc sĩ') && lowerTitle.includes('ckii')) return 7;
  if (lowerTitle.includes('thạc sĩ') && lowerTitle.includes('bác sĩ')) return 6;
  if (lowerTitle.includes('thạc sĩ')) return 5;
  if (lowerTitle.includes('bác sĩ') && (lowerTitle.includes('chuyên khoa ii') || lowerTitle.includes('ckii'))) return 4;
  if (lowerTitle.includes('bác sĩ') && (lowerTitle.includes('chuyên khoa i') || lowerTitle.includes('cki'))) return 3;
  if (lowerTitle.includes('bác sĩ')) return 2;

  return 0;
};

export interface DoctorSelectorProps {
  value?: Doctor;
  onChange: (doctor: Doctor) => void;
  onLoadDoctors?: (doctors: Doctor[]) => void;
  loading?: boolean;
  itemsPerPage?: number;
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// Enhanced Hospital-Themed Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    },
    [totalPages, onPageChange]
  );

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 pagination-container gap-4 sm:gap-0"
      role="navigation"
      aria-label="Điều hướng trang"
    >
      {/* Enhanced Hospital-Themed Previous Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        aria-label="Trang trước"
        className={combineClasses(
          'flex items-center justify-center',
          TOUCH_TARGETS.interactive,
          'px-6 py-4 text-base font-bold',
          BORDER_RADIUS.cardLarge,
          'transition-all duration-300 w-full sm:w-auto',
          'border-2 backdrop-blur-sm',
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 shadow-none'
            : 'bg-gradient-to-r from-blue-50 via-white to-blue-100 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 shadow-lg hover:shadow-xl hover:shadow-blue-100/50'
        )}
      >
        <svg
          className="h-5 w-5 mr-3 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-black">Trang Trước</span>
      </motion.button>

      {/* Mobile-First Page Numbers - Hidden on mobile, simplified on tablet */}
      <div className="hidden sm:flex items-center space-x-1 sm:space-x-2 order-2 sm:order-none">
        {totalPages <= 5 ? (
          // Show all pages if 5 or fewer (mobile-optimized)
          [...Array(totalPages)].map((_, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToPage(idx + 1)}
              aria-label={`Trang ${idx + 1}`}
              aria-current={currentPage === idx + 1 ? 'page' : undefined}
              className={`${TOUCH_TARGETS.buttonLarge} flex items-center justify-center ${BORDER_RADIUS.button} text-sm font-semibold transition-all ${ANIMATIONS.normal} ${
                currentPage === idx + 1
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-700 shadow-sm hover:shadow-md active:scale-95'
              }`}
            >
              {idx + 1}
            </motion.button>
          ))
        ) : (
          // Show simplified pagination for mobile-first approach
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToPage(1)}
              aria-label="Trang 1"
              aria-current={currentPage === 1 ? 'page' : undefined}
              className={`${TOUCH_TARGETS.buttonLarge} flex items-center justify-center ${BORDER_RADIUS.button} text-sm font-semibold transition-all ${ANIMATIONS.normal} ${
                currentPage === 1
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-700 shadow-sm hover:shadow-md active:scale-95'
              }`}
            >
              1
            </motion.button>

            {currentPage > 2 && (
              <span className="flex items-center justify-center w-8 h-8 text-gray-400 font-medium">
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                  ...
                </motion.div>
              </span>
            )}

            {/* Show current page if not first or last */}
            {currentPage > 1 && currentPage < totalPages && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage)}
                aria-label={`Trang ${currentPage}`}
                aria-current="page"
                className={`${TOUCH_TARGETS.buttonLarge} flex items-center justify-center ${BORDER_RADIUS.button} text-sm font-semibold transition-all ${ANIMATIONS.normal} bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg`}
              >
                {currentPage}
              </motion.button>
            )}

            {currentPage < totalPages - 1 && (
              <span className="flex items-center justify-center w-8 h-8 text-gray-400 font-medium">
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                  ...
                </motion.div>
              </span>
            )}

            {totalPages > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(totalPages)}
                aria-label={`Trang ${totalPages}`}
                aria-current={currentPage === totalPages ? 'page' : undefined}
                className={`${TOUCH_TARGETS.buttonLarge} flex items-center justify-center ${BORDER_RADIUS.button} text-sm font-semibold transition-all ${ANIMATIONS.normal} ${
                  currentPage === totalPages
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-700 shadow-sm hover:shadow-md active:scale-95'
                }`}
              >
                {totalPages}
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* Enhanced Hospital-Themed Mobile Pagination Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex sm:hidden items-center bg-gradient-to-r from-blue-50 via-white to-green-50 px-6 py-4 rounded-2xl order-1 w-full justify-center border-2 border-blue-100 shadow-lg backdrop-blur-sm"
      >
        <svg className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-base font-black text-blue-700">
          Trang {currentPage} / {totalPages}
        </span>
      </motion.div>

      {/* Enhanced Hospital-Themed Next Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        aria-label="Trang sau"
        className={combineClasses(
          'flex items-center justify-center',
          TOUCH_TARGETS.interactive,
          'px-6 py-4 text-base font-bold',
          BORDER_RADIUS.cardLarge,
          'transition-all duration-300 w-full sm:w-auto',
          'border-2 backdrop-blur-sm',
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 shadow-none'
            : 'bg-gradient-to-r from-green-50 via-white to-green-100 text-green-700 border-green-200 hover:from-green-100 hover:to-green-200 hover:border-green-300 shadow-lg hover:shadow-xl hover:shadow-green-100/50'
        )}
      >
        <span className="font-black">Trang Sau</span>
        <svg
          className="h-5 w-5 ml-3 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

// Enhanced Hospital-Themed Loading Skeleton
const LoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="flex flex-col gap-8 doctor-selector-container"
    role="status"
    aria-label="Đang tải danh sách bác sĩ"
  >
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: i * 0.15,
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94], // Medical easing
        }}
        className={combineClasses(
          'flex items-center gap-8 p-10',
          BORDER_RADIUS.section,
          'bg-gradient-to-br from-blue-50/90 via-white to-green-50/70',
          'shadow-xl shadow-blue-100/50',
          'border-2 border-blue-100/60',
          'backdrop-blur-sm',
          'doctor-skeleton'
        )}
      >
        {/* Enhanced Larger Circular Avatar Skeleton */}
        <div className="relative h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 rounded-full bg-gradient-to-br from-blue-200 to-green-200 overflow-hidden ring-4 ring-white border-3 border-blue-100 shadow-xl">
          <motion.div
            animate={{
              background: [
                'linear-gradient(45deg, #dbeafe, #dcfce7)',
                'linear-gradient(45deg, #bfdbfe, #bbf7d0)',
                'linear-gradient(45deg, #dbeafe, #dcfce7)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0"
          />
          <div className="absolute inset-3 rounded-full bg-white/70 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 text-blue-400"
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {/* Enhanced Name Skeleton - Larger and More Prominent */}
          <motion.div
            animate={{
              background: [
                'linear-gradient(90deg, #bfdbfe, #93c5fd, #bfdbfe)',
                'linear-gradient(90deg, #93c5fd, #bfdbfe, #93c5fd)',
                'linear-gradient(90deg, #bfdbfe, #93c5fd, #bfdbfe)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-8 w-3/4 rounded-xl shadow-sm"
          />
          {/* Enhanced Title Skeleton */}
          <motion.div
            animate={{
              background: [
                'linear-gradient(90deg, #bbf7d0, #86efac, #bbf7d0)',
                'linear-gradient(90deg, #86efac, #bbf7d0, #86efac)',
                'linear-gradient(90deg, #bbf7d0, #86efac, #bbf7d0)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="h-6 w-2/3 rounded-xl shadow-sm"
          />
          {/* Enhanced Department Skeleton */}
          <motion.div
            animate={{
              background: [
                'linear-gradient(90deg, #e5e7eb, #d1d5db, #e5e7eb)',
                'linear-gradient(90deg, #d1d5db, #e5e7eb, #d1d5db)',
                'linear-gradient(90deg, #e5e7eb, #d1d5db, #e5e7eb)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="h-5 w-1/2 rounded-xl shadow-sm"
          />
          {/* Additional Skeleton Lines for Specialties */}
          <motion.div
            animate={{
              background: [
                'linear-gradient(90deg, #f3e8ff, #e9d5ff, #f3e8ff)',
                'linear-gradient(90deg, #e9d5ff, #f3e8ff, #e9d5ff)',
                'linear-gradient(90deg, #f3e8ff, #e9d5ff, #f3e8ff)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            className="h-4 w-5/6 rounded-lg shadow-sm"
          />
        </div>

        {/* Status Indicator Skeleton */}
        <motion.div
          animate={{
            background: [
              'linear-gradient(45deg, #bfdbfe, #bbf7d0)',
              'linear-gradient(45deg, #93c5fd, #86efac)',
              'linear-gradient(45deg, #bfdbfe, #bbf7d0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-10 w-24 rounded-full"
        />
      </motion.div>
    ))}

    {/* Enhanced loading indicator */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex items-center justify-center py-4"
    >
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              backgroundColor: ['#3b82f6', '#10b981', '#3b82f6'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>
    </motion.div>

    {/* Screen Reader Text */}
    <span className="sr-only">Đang tải danh sách bác sĩ, vui lòng chờ...</span>
  </motion.div>
);

// Enhanced Hospital-Themed Empty State with Healthcare Iconography
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={combineClasses(
      'py-32 px-10 text-center',
      'bg-gradient-to-br from-blue-50/90 via-white to-green-50/70',
      BORDER_RADIUS.section,
      'shadow-xl shadow-blue-100/50',
      'border-2 border-blue-100/60',
      'backdrop-blur-sm'
    )}
    role="status"
    aria-label="Không có bác sĩ nào có sẵn"
  >
    {/* Enhanced Medical Icon with Healthcare Theme */}
    <motion.div
      initial={{ y: -20, scale: 0.8 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      className="w-36 h-36 mx-auto mb-10 bg-gradient-to-br from-white via-blue-50 to-white rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden border-4 border-blue-100"
    >
      {/* Background pulse effect */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.05, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 rounded-full"
      />

      {/* Main Healthcare Icon */}
      <motion.div
        initial={{ rotate: -10, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
        className="relative z-10 flex items-center justify-center"
      >
        <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </motion.div>

      {/* Medical Cross Decoration */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-3 right-3 w-6 h-6 text-green-500"
      >
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </motion.div>

      {/* Stethoscope Icon */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-3 left-3 w-5 h-5 text-blue-400"
      >
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      </motion.div>
    </motion.div>

    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-4xl font-black text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent"
    >
      Không có bác sĩ nào
    </motion.h3>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-gray-700 text-xl max-w-lg mx-auto leading-relaxed mb-10 font-semibold"
    >
      Hiện tại không có bác sĩ nào có sẵn trong hệ thống. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ
      trợ.
    </motion.p>

    {/* Enhanced Decorative Elements */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="flex justify-center space-x-3 mb-6"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.3, 1],
            backgroundColor: i % 2 === 0 ? ['#60a5fa', '#34d399', '#60a5fa'] : ['#34d399', '#60a5fa', '#34d399'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="w-3 h-3 rounded-full"
        />
      ))}
    </motion.div>

    {/* Refresh suggestion */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="text-sm text-gray-500"
    >
      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Dữ liệu sẽ được cập nhật tự động
    </motion.div>

    {/* Screen Reader Text */}
    <span className="sr-only">Không có bác sĩ nào có sẵn trong danh sách</span>
  </motion.div>
);

export interface DoctorListProps {
  value?: Doctor;
  onChange: (doctor: Doctor) => void;
  onLoadDoctors?: (doctors: Doctor[]) => void;
  loading?: boolean;
  itemsPerPage?: number;
}
function DoctorList({ value, onChange, onLoadDoctors, loading, itemsPerPage = 5 }: DoctorListProps) {
  const wpDoctors = useAtomValue(doctorsAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [announceText, setAnnounceText] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Memoize the doctors conversion
  const doctors = useMemo(() => {
    try {
      if (!wpDoctors) return [];

      // Convert WPDoctors to Doctors
      const convertedDoctors = wpDoctors.map(convertToDoctor);

      // Sort doctors by title rank (highest to lowest)
      return convertedDoctors.sort((a, b) => {
        const rankA = getTitleRank(a.title);
        const rankB = getTitleRank(b.title);

        // Sort by rank first (descending)
        if (rankA !== rankB) return rankB - rankA;

        // If ranks are equal, sort alphabetically by name
        return a.name.localeCompare(b.name);
      });
    } catch (err) {
      console.error('Error processing doctors data:', err);
      setError('Có lỗi xảy ra khi tải danh sách bác sĩ');
      return [];
    }
  }, [wpDoctors]);

  // Memoize pagination calculations
  const { totalPages, paginatedDoctors } = useMemo(() => {
    const total = Math.ceil(doctors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return {
      totalPages: total,
      paginatedDoctors: doctors.slice(startIndex, startIndex + itemsPerPage),
    };
  }, [doctors, currentPage, itemsPerPage]);

  // Touch gesture handlers for mobile pagination - Fixed scroll conflicts
  const handleSwipeLeft = useCallback(() => {
    if (isSwipeEnabled && currentPage < totalPages && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [isSwipeEnabled, currentPage, totalPages, isTransitioning]);

  const handleSwipeRight = useCallback(() => {
    if (isSwipeEnabled && currentPage > 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [isSwipeEnabled, currentPage, isTransitioning]);

  // Disable swipe during animations to prevent conflicts - Extended timeout
  const handleSwipeStart = useCallback(() => {
    setIsSwipeEnabled(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setIsSwipeEnabled(true);
      setIsTransitioning(false);
    }, 500); // Increased from 300ms to 500ms
  }, []);

  // Enhanced keyboard navigation for mobile accessibility
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && currentPage > 1) {
        event.preventDefault();
        setCurrentPage((prev) => prev - 1);
      } else if (event.key === 'ArrowRight' && currentPage < totalPages) {
        event.preventDefault();
        setCurrentPage((prev) => prev + 1);
      }
    },
    [currentPage, totalPages]
  );

  const isLoading = loading || !wpDoctors;

  useEffect(() => {
    if (doctors.length > 0) {
      onLoadDoctors?.(doctors);
    }
  }, [doctors, onLoadDoctors]);

  useEffect(() => {
    // Reset to first page when doctors list changes
    setCurrentPage(1);
    setAnnounceText(`Đã tải ${doctors.length} bác sĩ. Hiện tại đang ở trang 1.`);
  }, [doctors.length]);

  // Accessibility: Announce page changes to screen readers
  useEffect(() => {
    if (totalPages > 1) {
      setAnnounceText(
        `Đã chuyển đến trang ${currentPage} trong tổng số ${totalPages} trang. Hiển thị ${paginatedDoctors.length} bác sĩ.`
      );
    }
  }, [currentPage, totalPages, paginatedDoctors.length]);

  // Clear error when data loads successfully
  useEffect(() => {
    if (wpDoctors && doctors.length > 0) {
      setError(null);
    }
  }, [wpDoctors, doctors.length]);

  // Performance optimization: Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Performance optimization: Preload next page images
  useEffect(() => {
    if (currentPage < totalPages && isIntersecting) {
      const nextPageStart = currentPage * itemsPerPage;
      const nextPageDoctors = doctors.slice(nextPageStart, nextPageStart + itemsPerPage);

      // Preload images for next page
      nextPageDoctors.forEach((doctor) => {
        if (doctor.image) {
          const img = new Image();
          img.src = doctor.image;
          img.loading = 'lazy';
        }
      });
    }
  }, [currentPage, totalPages, doctors, itemsPerPage, isIntersecting]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-3 doctor-selector-container" role="alert" aria-live="polite">
        <div className="py-12 text-center bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg">
          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-red-700 mb-3">Không thể tải danh sách bác sĩ</h3>
          <p className="text-red-600 mb-6 max-w-md mx-auto leading-relaxed">{error}</p>

          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 shadow-lg hover:shadow-xl"
            aria-label="Thử tải lại danh sách bác sĩ"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Thử lại
          </button>

          {/* Screen Reader Text */}
          <span className="sr-only">Đã xảy ra lỗi khi tải danh sách bác sĩ. Nhấn nút thử lại để tải lại.</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94], // Medical easing curve
        staggerChildren: 0.1,
      }}
      className="flex flex-col gap-6 sm:gap-8 md:gap-10 doctor-selector-container"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Danh sách bác sĩ với điều hướng bằng phím mũi tên"
      style={{
        // Performance optimization for mobile
        contentVisibility: isIntersecting ? 'visible' : 'auto',
        containIntrinsicSize: isIntersecting ? 'none' : '100% 400px',
      }}
    >
      {doctors.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94], // Medical easing
                staggerChildren: 0.1,
              }}
              className="flex flex-col gap-6 sm:gap-8"
              // Fixed mobile swipe gestures - prevent scroll conflicts
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.05} // Reduced from 0.1 to prevent excessive movement
              dragMomentum={false} // Disable momentum to prevent scroll conflicts
              onDragStart={(event) => {
                // Prevent default scroll behavior during drag
                event.preventDefault();
                handleSwipeStart();
              }}
              onDragEnd={(_, info) => {
                const swipeThreshold = 75; // Increased threshold for more intentional swipes
                if (Math.abs(info.offset.x) > swipeThreshold) {
                  if (info.offset.x > 0) {
                    handleSwipeRight();
                  } else {
                    handleSwipeLeft();
                  }
                }
              }}
              whileDrag={{ scale: 0.99 }} // Reduced scale change
              style={{
                // Prevent scroll interference
                touchAction: 'pan-x',
                userSelect: 'none',
              }}
            >
              {paginatedDoctors.map((doctor, index) => {
                const selected = value && value.id === doctor.id;
                const disabled = !doctor.isAvailable;

                return (
                  <DoctorCard
                    key={doctor.id || index}
                    doctor={doctor}
                    isSelected={!!selected}
                    isDisabled={disabled}
                    onClick={() => onChange(doctor)}
                    index={index}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {/* Screen Reader Announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announceText}
      </div>
    </motion.div>
  );
}

export default DoctorList;
