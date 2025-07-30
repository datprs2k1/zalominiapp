import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doctor } from '@/types';
import { WPDoctor } from '@/services/wp-types';
import { doctorsAtom } from '@/services/post';
import { combineClasses } from '@/styles/medical-design-system';
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

  // Enhanced keyboard navigation for accessibility
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isDisabled) return;

      // Support Enter and Space keys for activation (WCAG 2.1 AA)
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    },
    [isDisabled, onClick]
  );

  // Respect user's motion preferences (WCAG 2.1 AA)
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const avatarUrl = imageError ? '/avatar-doctor-fallback.png' : doctor.image || '/avatar-doctor-fallback.png';

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.95 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: prefersReducedMotion ? 0 : index * 0.1,
        duration: prefersReducedMotion ? 0.2 : 0.6,
        ease: prefersReducedMotion ? 'linear' : [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              scale: 1.02,
              y: -4,
              transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
            }
      }
      whileTap={
        prefersReducedMotion
          ? undefined
          : {
              scale: 0.98,
              transition: { duration: 0.15 },
            }
      }
      className={combineClasses(
        'relative overflow-hidden group cursor-pointer',
        'p-6 transition-all duration-300 ease-out',
        'min-h-[160px] touch-manipulation select-none',
        'bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-100/50',
        'hover:shadow-lg hover:border-blue-200/70 hover:bg-white/95',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400',
        isSelected
          ? 'bg-gradient-to-br from-blue-50/80 to-cyan-50/60 border-blue-300/70 shadow-lg ring-2 ring-blue-400/30'
          : isDisabled
            ? 'opacity-60 cursor-not-allowed bg-gray-50/50 border-gray-200'
            : ''
      )}
      onClick={!isDisabled ? onClick : undefined}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={`${isSelected ? 'Đã chọn' : 'Chọn'} bác sĩ ${doctor.name}${isDisabled ? ' (không có sẵn)' : ''}`}
      aria-disabled={isDisabled}
      aria-pressed={isSelected}
      aria-describedby={`doctor-${doctor.id}-info`}
    >
      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-4 right-4 z-20 bg-green-500 text-white p-2 rounded-full shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Layout: Avatar and info */}
      <div className="flex flex-col space-y-4">
        {/* Compact Doctor Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Subtle glow effect for available doctors */}
            {doctor.isAvailable && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-xl blur-md animate-pulse" />
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={combineClasses(
                'relative w-24 h-32 sm:w-28 sm:h-36',
                'rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200',
                'shadow-md border border-white/80',
                'transition-all duration-300 group-hover:shadow-lg group-hover:scale-102'
              )}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-6 h-6 text-gray-400">
                    <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <img
                src={avatarUrl}
                alt={`Ảnh đại diện của ${doctor.name}`}
                className={combineClasses(
                  'object-cover w-full h-full transition-opacity duration-300',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                decoding="async"
              />

              {/* Compact Availability indicator */}
              <div
                className={combineClasses(
                  'absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-md',
                  doctor.isAvailable
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/20'
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-500/20'
                )}
                aria-label={doctor.isAvailable ? 'Có sẵn' : 'Không có sẵn'}
              >
                {/* Subtle pulse animation for available doctors */}
                {doctor.isAvailable && (
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
                )}

                <div className="relative w-full h-full flex items-center justify-center">
                  {doctor.isAvailable ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Compact Doctor Information */}
        <div id={`doctor-${doctor.id}-info`} className="w-full space-y-3 text-center">
          {/* Doctor Name with Compact Typography */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 leading-tight break-words bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              {doctor.name}
            </h3>
            {/* Compact Professional Badge */}
            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200/50">
              <svg className="w-2.5 h-2.5 text-blue-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Chuyên gia</span>
            </div>
          </div>

          {/* Compact Medical Title */}
          {doctor.title && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 border border-blue-100/50">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center shadow-sm">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-blue-800 break-words">{doctor.title}</span>
                </div>
              </div>
            </div>
          )}

          {/* Compact Department */}
          {doctor.unit && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-100/50">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md flex items-center justify-center shadow-sm">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-green-800 break-words">{doctor.unit}</span>
                </div>
              </div>
            </div>
          )}

          {/* Compact Languages */}
          {doctor.languages && (
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-2 border border-purple-100/50">
              <div className="flex items-center justify-center space-x-1.5 mb-1">
                <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Ngôn ngữ</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {doctor.languages.split(',').map((lang, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-purple-800 bg-white/70 border border-purple-200/50"
                  >
                    {lang.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Unavailable indicator */}
          {!doctor.isAvailable && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 border border-red-100/50">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-red-700">Hiện không có sẵn</span>
              </div>
            </div>
          )}

          {/* Compact Call-to-Action for Available Doctors */}
          {doctor.isAvailable && (
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-1.5 text-xs text-blue-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="font-medium">Nhấn để xem chi tiết</span>
              </div>
            </div>
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
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPageSelector?: boolean;
};

// Enhanced Hospital-Themed Pagination Component with Advanced UX
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPageSelector = false,
}: PaginationProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [jumpToPage, setJumpToPage] = useState('');
  const [showJumpInput, setShowJumpInput] = useState(false);
  const jumpInputRef = useRef<HTMLInputElement>(null);

  // Items per page options
  const itemsPerPageOptions = [3, 5, 10, 15, 20];

  // Respect user's motion preferences
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage && !isTransitioning) {
        setIsTransitioning(true);
        onPageChange(page);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    },
    [currentPage, totalPages, onPageChange, isTransitioning]
  );

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  // Smart page number calculation for better UX
  const visiblePages = useMemo(() => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  // Jump to page functionality
  const handleJumpToPage = useCallback(() => {
    const page = parseInt(jumpToPage);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpToPage('');
      setShowJumpInput(false);
    }
  }, [jumpToPage, totalPages, handlePageChange]);

  const handleJumpInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleJumpToPage();
      } else if (e.key === 'Escape') {
        setShowJumpInput(false);
        setJumpToPage('');
      }
    },
    [handleJumpToPage]
  );

  // Enhanced keyboard navigation with accessibility announcements
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let announcement = '';

      if (e.key === 'ArrowLeft' && currentPage > 1) {
        e.preventDefault();
        handlePrevPage();
        announcement = `Chuyển đến trang ${currentPage - 1}`;
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        e.preventDefault();
        handleNextPage();
        announcement = `Chuyển đến trang ${currentPage + 1}`;
      } else if (e.key === 'Home') {
        e.preventDefault();
        handlePageChange(1);
        announcement = 'Chuyển đến trang đầu tiên';
      } else if (e.key === 'End') {
        e.preventDefault();
        handlePageChange(totalPages);
        announcement = 'Chuyển đến trang cuối cùng';
      } else if (e.key === 'PageUp' && currentPage > 1) {
        e.preventDefault();
        const targetPage = Math.max(1, currentPage - 5);
        handlePageChange(targetPage);
        announcement = `Nhảy về trang ${targetPage}`;
      } else if (e.key === 'PageDown' && currentPage < totalPages) {
        e.preventDefault();
        const targetPage = Math.min(totalPages, currentPage + 5);
        handlePageChange(targetPage);
        announcement = `Nhảy đến trang ${targetPage}`;
      }

      // Announce page changes to screen readers
      if (announcement) {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        document.body.appendChild(announcer);
        setTimeout(() => document.body.removeChild(announcer), 1000);
      }
    },
    [currentPage, totalPages, handlePrevPage, handleNextPage, handlePageChange]
  );

  // Auto-focus jump input when shown
  useEffect(() => {
    if (showJumpInput && jumpInputRef.current) {
      jumpInputRef.current.focus();
    }
  }, [showJumpInput]);

  if (totalPages <= 1) return null;

  return (
    <div
      className="flex flex-col gap-4 mt-6 pt-4"
      role="navigation"
      aria-label="Điều hướng trang danh sách bác sĩ"
      aria-describedby="pagination-help"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Screen reader instructions */}
      <div id="pagination-help" className="sr-only">
        Sử dụng phím mũi tên trái phải để chuyển trang, Home để đến trang đầu, End để đến trang cuối, PageUp để nhảy về
        5 trang, PageDown để nhảy tới 5 trang. Hiện tại đang ở trang {currentPage} trong tổng số {totalPages} trang với{' '}
        {totalItems} kết quả.
      </div>
      {/* Compact Pagination */}
      <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-lg p-3 border border-blue-100/50">
        {/* Single Row Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Right: Navigation Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isTransitioning}
              aria-label="Trang trước"
              className={combineClasses(
                'flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-h-[40px]',
                currentPage === 1 || isTransitioning
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="ml-1 hidden sm:inline">Trước</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {/* Show simplified page numbers */}
              {totalPages <= 7 ? (
                // Show all pages if 7 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={isTransitioning}
                    aria-label={`Trang ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                    className={combineClasses(
                      'w-8 h-8 flex items-center justify-center rounded text-xs font-medium transition-all duration-200',
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300',
                      isTransitioning && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {page}
                  </button>
                ))
              ) : (
                // Show condensed pagination for many pages
                <>
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={isTransitioning}
                        className="w-8 h-8 flex items-center justify-center rounded text-xs font-medium bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                      >
                        1
                      </button>
                      <span className="text-gray-400 text-xs">...</span>
                    </>
                  )}

                  {[currentPage - 1, currentPage, currentPage + 1]
                    .filter((page) => page >= 1 && page <= totalPages)
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={isTransitioning}
                        aria-label={`Trang ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={combineClasses(
                          'w-8 h-8 flex items-center justify-center rounded text-xs font-medium transition-all duration-200',
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300',
                          isTransitioning && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {page}
                      </button>
                    ))}

                  {currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-400 text-xs">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={isTransitioning}
                        className="w-8 h-8 flex items-center justify-center rounded text-xs font-medium bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isTransitioning}
              aria-label="Trang sau"
              className={combineClasses(
                'flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-h-[40px]',
                currentPage === totalPages || isTransitioning
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md'
              )}
            >
              <span className="mr-1 hidden sm:inline">Sau</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile swipe hint */}
        <div className="sm:hidden text-xs text-center text-gray-500 mt-2">💡 Vuốt trái/phải để chuyển trang</div>
      </div>

      {/* Loading indicator during transitions */}
      {isTransitioning && (
        <div className="flex justify-center py-2" role="status" aria-label="Đang chuyển trang">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <span className="sr-only">Đang tải trang {currentPage}...</span>
        </div>
      )}

      {/* ARIA live region for pagination announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" id="pagination-status">
        {isTransitioning
          ? `Đang chuyển đến trang ${currentPage}`
          : `Hiện tại đang ở trang ${currentPage} trong tổng số ${totalPages} trang. Hiển thị ${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} đến ${Math.min(currentPage * itemsPerPage, totalItems)} trong ${totalItems} kết quả.`}
      </div>

      {/* Enhanced focus trap for keyboard users */}
      <div className="sr-only">
        <button
          onFocus={() => {
            // Focus the main pagination container when tabbing from outside
            const paginationContainer = document.querySelector(
              '[role="navigation"][aria-label*="Điều hướng trang"]'
            ) as HTMLElement;
            if (paginationContainer) {
              paginationContainer.focus();
            }
          }}
          tabIndex={-1}
          aria-hidden="true"
        >
          Bắt đầu vùng điều hướng trang
        </button>
      </div>
    </div>
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
        className="flex items-center gap-8 p-6 rounded-2xl bg-white shadow-lg border border-gray-200"
      >
        {/* Avatar Skeleton */}
        <div className="w-24 h-32 rounded-xl bg-gray-200 animate-pulse"></div>

        <div className="flex-1 space-y-3">
          {/* Name Skeleton */}
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          {/* Title Skeleton */}
          <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          {/* Department Skeleton */}
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          {/* Additional info Skeleton */}
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </motion.div>
    ))}

    {/* Loading indicator */}
    <div className="flex items-center justify-center py-4">
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>

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
    className="py-20 px-8 text-center bg-white rounded-2xl shadow-lg border border-gray-200"
    role="status"
    aria-label="Không có bác sĩ nào có sẵn"
  >
    {/* Medical Icon */}
    <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Không có bác sĩ nào</h3>

    <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
      Hiện tại không có bác sĩ nào có sẵn trong hệ thống. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ
      trợ.
    </p>

    {/* Refresh suggestion */}
    <div className="text-sm text-gray-500">
      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Dữ liệu sẽ được cập nhật tự động
    </div>

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
  }, [doctors.length]);

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
    <div
      ref={containerRef}
      className="flex flex-col gap-6 doctor-selector-container"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Danh sách bác sĩ với điều hướng bằng phím mũi tên"
    >
      {doctors.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={(event) => {
                event.preventDefault();
                handleSwipeStart();
              }}
              onDragEnd={(_, info) => {
                const swipeThreshold = 75;
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={doctors.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(_newItemsPerPage) => {
              // Reset to first page when changing items per page
              setCurrentPage(1);
              // You can add a prop to handle this in the parent component if needed
            }}
            showItemsPerPageSelector={true}
          />
        </>
      )}
    </div>
  );
}

export default DoctorList;
