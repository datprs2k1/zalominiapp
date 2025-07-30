import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MEDICAL_COLORS, ANIMATIONS, ACCESSIBILITY, SPACING } from '@/styles/medical-design-system';

export interface SelectOption {
  id: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  category?: string;
}

export interface EnhancedSelectProps {
  options: SelectOption[];
  value?: SelectOption;
  onChange: (option: SelectOption) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export default function EnhancedSelect({
  options,
  value,
  onChange,
  placeholder = 'Chọn một tùy chọn',
  label,
  error,
  disabled = false,
  searchable = false,
  clearable = false,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: EnhancedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Calculate dropdown position
  const updateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Update dropdown position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const handlePositionUpdate = () => {
      updateDropdownPosition();
    };

    window.addEventListener('scroll', handlePositionUpdate, true);
    window.addEventListener('resize', handlePositionUpdate);

    return () => {
      window.removeEventListener('scroll', handlePositionUpdate, true);
      window.removeEventListener('resize', handlePositionUpdate);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          updateDropdownPosition();
          setIsOpen(true);
          setFocusedIndex(value ? filteredOptions.findIndex((opt) => opt.id === value.id) : 0);
        } else if (focusedIndex >= 0) {
          const selectedOption = filteredOptions[focusedIndex];
          if (selectedOption && !selectedOption.disabled) {
            onChange(selectedOption);
            setIsOpen(false);
            setSearchTerm('');
          }
        }
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (!isOpen) {
          updateDropdownPosition();
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        }
        event.preventDefault();
        break;
      case 'ArrowUp':
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        event.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  };

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange({ id: '', label: '', description: '' });
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (disabled) return;
    if (!isOpen) {
      updateDropdownPosition();
      setFocusedIndex(value ? filteredOptions.findIndex((opt) => opt.id === value.id) : 0);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative z-10 ${className}`} ref={selectRef} style={{ isolation: 'isolate' }}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold mb-2" style={{ color: MEDICAL_COLORS.primary.blue }}>
          {label}
        </label>
      )}

      {/* Select Trigger */}
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
                  : value?.id
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
          }
        `}
        style={{
          borderColor: isOpen
            ? MEDICAL_COLORS.primary.blue
            : error
              ? MEDICAL_COLORS.status.emergency
              : value?.id
                ? MEDICAL_COLORS.secondary.green
                : undefined,
          backgroundColor: isOpen
            ? `${MEDICAL_COLORS.primary.blue}05`
            : error
              ? `${MEDICAL_COLORS.status.emergency}05`
              : value?.id
                ? `${MEDICAL_COLORS.secondary.green}05`
                : undefined,
          boxShadow: isOpen ? `0 0 0 4px ${MEDICAL_COLORS.primary.blue}15` : undefined,
        }}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Option Icon */}
          {value?.icon && (
            <div className="flex-shrink-0 w-5 h-5" style={{ color: MEDICAL_COLORS.primary.blue }}>
              {value.icon}
            </div>
          )}

          {/* Selected Value or Placeholder */}
          <div className="flex-1 min-w-0">
            {value?.id ? (
              <div>
                <div className="font-medium text-gray-900 truncate">{value.label}</div>
                {value.description && <div className="text-sm text-gray-500 truncate">{value.description}</div>}
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Loading Spinner */}
          {loading && (
            <div
              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
              style={{
                borderColor: `${MEDICAL_COLORS.primary.blue}30`,
                borderTopColor: MEDICAL_COLORS.primary.blue,
              }}
            />
          )}

          {/* Clear Button */}
          {clearable && value?.id && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Xóa lựa chọn"
            >
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

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

      {/* Dropdown Options - Using Portal */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={optionsRef}
              className="fixed z-[9999] bg-white rounded-xl border-2 shadow-2xl overflow-hidden"
              style={{
                borderColor: MEDICAL_COLORS.primary.blue,
                boxShadow: `0 20px 40px ${MEDICAL_COLORS.primary.blue}20, 0 0 0 1px ${MEDICAL_COLORS.primary.blue}10`,
                top: dropdownPosition.top + 8,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: '240px',
              }}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              role="listbox"
            >
              {/* Search Input */}
              {searchable && (
                <div className="p-3 border-b" style={{ borderColor: `${MEDICAL_COLORS.primary.blue}15` }}>
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm..."
                      className="w-full px-3 py-2 pl-10 text-sm border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: `${MEDICAL_COLORS.primary.blue}30`,
                        focusRingColor: `${MEDICAL_COLORS.primary.blue}30`,
                      }}
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <svg
                      className="w-8 h-8 mx-auto mb-2 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0M3 3l18 18"
                      />
                    </svg>
                    <p className="text-sm">Không tìm thấy kết quả</p>
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      className={`
                      px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3
                      ${
                        option.disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : index === focusedIndex
                            ? 'bg-blue-50'
                            : 'hover:bg-gray-50'
                      }
                      ${value?.id === option.id ? 'bg-green-50 border-r-4' : ''}
                    `}
                      style={{
                        backgroundColor:
                          index === focusedIndex
                            ? `${MEDICAL_COLORS.primary.blue}08`
                            : value?.id === option.id
                              ? `${MEDICAL_COLORS.secondary.green}08`
                              : undefined,
                        borderRightColor: value?.id === option.id ? MEDICAL_COLORS.secondary.green : undefined,
                      }}
                      onClick={() => handleOptionClick(option)}
                      role="option"
                      aria-selected={value?.id === option.id}
                      whileHover={!prefersReducedMotion && !option.disabled ? { x: 4 } : {}}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Option Icon */}
                      {option.icon && (
                        <div className="flex-shrink-0 w-5 h-5" style={{ color: MEDICAL_COLORS.primary.blue }}>
                          {option.icon}
                        </div>
                      )}

                      {/* Option Content */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-gray-500 truncate">{option.description}</div>
                        )}
                      </div>

                      {/* Selected Indicator */}
                      {value?.id === option.id && (
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
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
