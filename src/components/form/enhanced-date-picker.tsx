import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MEDICAL_COLORS, ANIMATIONS, ACCESSIBILITY, SPACING } from '@/styles/medical-design-system';
import { formatDayName, formatShortDate } from '@/utils/format';
import { AvailableTimeSlots } from '@/types';

export interface EnhancedDatePickerProps {
  value?: { date?: Date };
  onChange: (value: { date?: Date }) => void;
  slots: AvailableTimeSlots[];
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export default function EnhancedDatePicker({
  value,
  onChange,
  slots,
  label,
  error,
  disabled = false,
  placeholder = 'Chọn ngày khám',
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: EnhancedDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value?.date);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const datePickerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        // Recalculate position on resize
        if (datePickerRef.current) {
          const rect = datePickerRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const dropdownHeight = 320;
          const fabHeight = 100;
          const spaceBelow = viewportHeight - rect.bottom - fabHeight;
          const spaceAbove = rect.top;

          setDropdownPosition(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'top' : 'bottom');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true); // Use capture to catch all scroll events
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(
            selectedDate ? slots.findIndex((slot) => slot.date.toDateString() === selectedDate.toDateString()) : 0
          );
        } else if (focusedIndex >= 0) {
          handleDateSelect(slots[focusedIndex].date);
        }
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => (prev < slots.length - 1 ? prev + 1 : prev));
        }
        event.preventDefault();
        break;
      case 'ArrowUp':
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        event.preventDefault();
        break;
      case 'ArrowLeft':
        if (isOpen && viewMode === 'expanded') {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        event.preventDefault();
        break;
      case 'ArrowRight':
        if (isOpen && viewMode === 'expanded') {
          setFocusedIndex((prev) => (prev < slots.length - 1 ? prev + 1 : prev));
        }
        event.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange({ date });
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const toggleDropdown = () => {
    if (disabled) return;

    // Calculate optimal dropdown position before opening
    if (!isOpen && datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 320; // Approximate height of dropdown
      const fabHeight = 100; // Height reserved for FAB button
      const spaceBelow = viewportHeight - rect.bottom - fabHeight;
      const spaceAbove = rect.top;

      // Use top position if there's not enough space below
      setDropdownPosition(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'top' : 'bottom');
    }

    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(
        selectedDate ? slots.findIndex((slot) => slot.date.toDateString() === selectedDate.toDateString()) : 0
      );
    }
  };

  const formatSelectedDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Hôm nay';
    if (isTomorrow(date)) return 'Ngày mai';
    return formatDayName(date);
  };

  return (
    <div className={`relative ${className}`} ref={datePickerRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold mb-2" style={{ color: MEDICAL_COLORS.primary.blue }}>
          {label}
        </label>
      )}

      {/* Date Picker Trigger */}
      <div
        className={`
          relative w-full min-h-[52px] px-4 py-3 rounded-xl border-2 cursor-pointer
          transition-all duration-300 flex items-center justify-between
          ${
            disabled
              ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
              : isOpen
                ? `border-2 shadow-lg`
                : error
                  ? 'border-red-300 bg-red-50'
                  : selectedDate
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
          }
        `}
        style={{
          borderColor: isOpen
            ? MEDICAL_COLORS.accent.cyan
            : error
              ? MEDICAL_COLORS.status.emergency
              : selectedDate
                ? MEDICAL_COLORS.secondary.green
                : undefined,
          backgroundColor: isOpen
            ? `${MEDICAL_COLORS.accent.cyan}05`
            : error
              ? `${MEDICAL_COLORS.status.emergency}05`
              : selectedDate
                ? `${MEDICAL_COLORS.secondary.green}05`
                : undefined,
          boxShadow: isOpen ? `0 0 0 4px ${MEDICAL_COLORS.accent.cyan}15` : undefined,
        }}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={ariaLabel || 'Chọn ngày khám'}
        aria-describedby={ariaDescribedBy}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Calendar Icon */}
          <div
            className="flex-shrink-0 w-6 h-6"
            style={{ color: selectedDate ? MEDICAL_COLORS.accent.cyan : MEDICAL_COLORS.gray[400] }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Selected Date or Placeholder */}
          <div className="flex-1 min-w-0">
            {selectedDate ? (
              <div>
                <div className="font-medium text-gray-900 truncate">{formatSelectedDate(selectedDate)}</div>
                <div className="text-sm" style={{ color: MEDICAL_COLORS.accent.cyan }}>
                  {getDateLabel(selectedDate)}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="w-5 h-5 text-gray-400"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="mt-2 flex items-center gap-2"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            style={{ color: MEDICAL_COLORS.status.emergency }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span className="text-sm font-medium" style={{ color: MEDICAL_COLORS.status.emergency }}>
            {error}
          </span>
        </motion.div>
      )}

      {/* Dropdown Calendar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute z-50 w-full bg-white rounded-xl border-2 shadow-2xl overflow-hidden ${
              dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
            style={{
              borderColor: MEDICAL_COLORS.accent.cyan,
              boxShadow: `0 20px 40px ${MEDICAL_COLORS.accent.cyan}20, 0 0 0 1px ${MEDICAL_COLORS.accent.cyan}10`,
              // Ensure dropdown doesn't overlap with sticky bottom button
              maxHeight:
                dropdownPosition === 'top'
                  ? 'calc(100vh - 200px)' // Reserve space when positioned above
                  : 'calc(100vh - 200px)', // Reserve space for FAB button and safe areas
            }}
            initial={
              prefersReducedMotion
                ? {}
                : {
                    opacity: 0,
                    y: dropdownPosition === 'top' ? 10 : -10,
                    scale: 0.95,
                  }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? {}
                : {
                    opacity: 0,
                    y: dropdownPosition === 'top' ? 10 : -10,
                    scale: 0.95,
                  }
            }
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 border-b flex items-center justify-between"
              style={{
                borderColor: `${MEDICAL_COLORS.accent.cyan}15`,
                backgroundColor: `${MEDICAL_COLORS.accent.cyan}05`,
              }}
            >
              <h3 className="font-semibold" style={{ color: MEDICAL_COLORS.accent.cyan }}>
                Chọn ngày khám
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'compact' ? 'expanded' : 'compact')}
                  className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                  aria-label={viewMode === 'compact' ? 'Mở rộng' : 'Thu gọn'}
                >
                  <svg
                    className="w-4 h-4"
                    style={{ color: MEDICAL_COLORS.accent.cyan }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {viewMode === 'compact' ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Date Options - Scrollable Container */}
            <div
              className={`p-3 ${viewMode === 'expanded' ? 'grid grid-cols-2 gap-2' : 'space-y-2'} max-h-80 overflow-y-auto medical-scrollbar`}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: `${MEDICAL_COLORS.accent.cyan}40 transparent`,
              }}
            >
              {slots.map((slot, index) => {
                const isSelected = selectedDate?.toDateString() === slot.date.toDateString();
                const isFocused = index === focusedIndex;
                const dayLabel = getDateLabel(slot.date);
                const shortDate = formatShortDate(slot.date);

                return (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(slot.date)}
                    className={`
                      w-full p-3 rounded-lg text-left transition-all duration-200 border-2
                      ${
                        isSelected
                          ? 'border-green-400 bg-green-50'
                          : isFocused
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                      ${viewMode === 'expanded' ? 'text-center' : 'flex items-center gap-3'}
                    `}
                    style={{
                      borderColor: isSelected
                        ? MEDICAL_COLORS.secondary.green
                        : isFocused
                          ? MEDICAL_COLORS.accent.cyan
                          : undefined,
                      backgroundColor: isSelected
                        ? `${MEDICAL_COLORS.secondary.green}08`
                        : isFocused
                          ? `${MEDICAL_COLORS.accent.cyan}08`
                          : undefined,
                    }}
                    whileHover={!prefersReducedMotion ? { scale: 1.02 } : {}}
                    whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
                    transition={{ duration: 0.15 }}
                  >
                    {viewMode === 'expanded' ? (
                      <div>
                        <div className="text-xs opacity-70 mb-1">{dayLabel}</div>
                        <div className="font-semibold text-lg">{shortDate}</div>
                        {(isToday(slot.date) || isTomorrow(slot.date)) && (
                          <div
                            className="text-xs mt-1 px-2 py-1 rounded-full inline-block"
                            style={{
                              backgroundColor: isToday(slot.date)
                                ? `${MEDICAL_COLORS.status.success}20`
                                : `${MEDICAL_COLORS.accent.cyan}20`,
                              color: isToday(slot.date) ? MEDICAL_COLORS.status.success : MEDICAL_COLORS.accent.cyan,
                            }}
                          >
                            {isToday(slot.date) ? 'Hôm nay' : 'Ngày mai'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex-shrink-0">
                          <div className="text-xs opacity-70">{dayLabel}</div>
                          <div className="font-semibold">{shortDate}</div>
                        </div>
                        <div className="flex-1 text-right">
                          <div className="text-sm text-gray-600">{formatSelectedDate(slot.date)}</div>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <svg
                              className="w-5 h-5"
                              style={{ color: MEDICAL_COLORS.secondary.green }}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                      </>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            {slots.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">Không có ngày khám khả dụng</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
