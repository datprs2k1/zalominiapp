import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MedicalIcons } from './icons/medical-icons';
import { MedicalSpinner } from './medical-animations';

// Enhanced TypeScript interfaces for better type safety
interface SearchBarComponentProps {
  className?: string;
  onSearch?: (query: string) => Promise<void> | void;
  onSearchError?: (error: Error) => void;
  showQuickCategories?: boolean;
  variant?: 'default' | 'compact' | 'hero';
  medicalContext?: 'general' | 'emergency' | 'appointment' | 'doctor' | 'service';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  placeholder?: string;
  ariaLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  maxLength?: number;
  debounceMs?: number;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onQueryChange?: (query: string) => void;
}

// Enhanced interfaces for better type safety and accessibility
interface QuickCategory {
  id: string;
  label: string;
  icon: string;
  searchTerm: string;
  color: 'primary' | 'secondary' | 'accent' | 'info';
  gradient: string;
  ariaLabel?: string;
  description?: string;
}

interface MedicalSuggestion {
  text: string;
  icon: string;
  category: string;
  priority?: number;
  medicalSpecialty?: string;
}

interface SearchState {
  query: string;
  isFocused: boolean;
  isLoading: boolean;
  showSuggestions: boolean;
  selectedSuggestionIndex: number;
  searchError: string | null;
  hasSearched: boolean;
}

// Healthcare color palette constants for consistency
const HEALTHCARE_COLORS = {
  medicalBlue: '#2563EB',
  medicalBlueDark: '#1E40AF',
  healingGreen: '#10B981',
  healingGreenDark: '#059669',
  medicalWhite: '#FAFBFC',
  trustCyan: '#0891B2',
  trustCyanDark: '#0E7490',
  emergencyRed: '#DC2626',
  warningAmber: '#F59E0B',
} as const;

// Enhanced quick categories with improved accessibility and healthcare design
const quickCategories: QuickCategory[] = [
  {
    id: 'doctors',
    label: 'Bác sĩ',
    icon: 'M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z M16 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
    searchTerm: 'bác sĩ',
    color: 'primary',
    gradient: `from-[${HEALTHCARE_COLORS.medicalBlue}] to-[${HEALTHCARE_COLORS.medicalBlueDark}]`,
    ariaLabel: 'Tìm kiếm bác sĩ và chuyên gia y tế',
    description: 'Tìm bác sĩ theo chuyên khoa, kinh nghiệm và đánh giá',
  },
  {
    id: 'departments',
    label: 'Chuyên khoa',
    icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
    searchTerm: 'chuyên khoa',
    color: 'secondary',
    gradient: `from-[${HEALTHCARE_COLORS.healingGreen}] to-[${HEALTHCARE_COLORS.healingGreenDark}]`,
    ariaLabel: 'Tìm kiếm các chuyên khoa y tế',
    description: 'Khám phá các chuyên khoa như tim mạch, thần kinh, nhi khoa',
  },
  {
    id: 'services',
    label: 'Dịch vụ khám',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2 M12 6v6l4 2',
    searchTerm: 'dịch vụ khám',
    color: 'accent',
    gradient: `from-[${HEALTHCARE_COLORS.trustCyan}] to-[${HEALTHCARE_COLORS.trustCyanDark}]`,
    ariaLabel: 'Tìm kiếm dịch vụ khám bệnh',
    description: 'Các dịch vụ khám tổng quát, khám chuyên khoa và tư vấn',
  },
  {
    id: 'tests',
    label: 'Xét nghiệm',
    icon: 'M9 11H7a2 2 0 01-2-2V7a2 2 0 012-2h2m4 0h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m0 4h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m-4 0H7a2 2 0 01-2-2v-2a2 2 0 012-2h2m5-4a2 2 0 11-4 0 2 2 0 014 0z',
    searchTerm: 'xét nghiệm',
    color: 'info',
    gradient: `from-[${HEALTHCARE_COLORS.medicalBlue}] to-[${HEALTHCARE_COLORS.medicalBlueDark}]`,
    ariaLabel: 'Tìm kiếm dịch vụ xét nghiệm',
    description: 'Xét nghiệm máu, nước tiểu, hình ảnh và các xét nghiệm chuyên sâu',
  },
];

export default function SearchBarComponent({
  className = '',
  onSearch,
  onSearchError,
  showQuickCategories = true,
  variant = 'default',
  medicalContext = 'general',
  priority,
  placeholder,
  ariaLabel,
  loading = false,
  disabled = false,
  maxLength = 100,
  debounceMs = 300,
  showSuggestions: showSuggestionsOverride,
  autoFocus = false,
  onFocus,
  onBlur,
  onQueryChange,
}: SearchBarComponentProps) {
  // Enhanced state management with performance optimizations
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(loading);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Refs for DOM manipulation and accessibility
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<number>();

  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Auto-focus functionality
  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  // Sync loading state with prop
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Enhanced accessibility and medical context with WCAG 2.1 AA compliance
  const searchId = useMemo(() => `medical-search-${Math.random().toString(36).slice(2, 9)}`, []);
  const suggestionsId = `${searchId}-suggestions`;
  const statusId = `${searchId}-status`;
  const errorId = `${searchId}-error`;
  const descriptionId = `${searchId}-description`;

  // Memoized computed values for performance
  const computedPlaceholder = useMemo(
    () =>
      placeholder ||
      (medicalContext === 'emergency'
        ? 'Tìm kiếm khẩn cấp y tế - Nhập từ khóa và nhấn Enter'
        : medicalContext === 'doctor'
          ? 'Tìm bác sĩ, chuyên khoa - Sử dụng phím mũi tên để điều hướng'
          : medicalContext === 'appointment'
            ? 'Tìm lịch hẹn - Nhập tên bác sĩ hoặc chuyên khoa'
            : 'Tìm kiếm dịch vụ y tế - Nhập từ khóa để tìm kiếm'),
    [placeholder, medicalContext]
  );

  const computedAriaLabel = useMemo(
    () =>
      ariaLabel ||
      `Tìm kiếm ${medicalContext === 'emergency' ? 'khẩn cấp' : 'y tế'}${priority ? `, mức độ: ${priority}` : ''}. Sử dụng phím Tab để điều hướng, Enter để tìm kiếm, phím mũi tên để chọn gợi ý.`,
    [ariaLabel, medicalContext, priority]
  );

  // Enhanced Medical context styling with WCAG 2.1 AA compliant focus states
  const contextStyling = {
    emergency: {
      base: 'border-red-300/60',
      focus: 'focus:border-red-500 focus:ring-2 focus:ring-red-500/30 focus:ring-offset-2 focus:ring-offset-white',
      focusVisible: 'focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-2',
    },
    appointment: {
      base: 'border-[#2563EB]/40',
      focus: 'focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 focus:ring-offset-2 focus:ring-offset-white',
      focusVisible: 'focus-visible:outline-2 focus-visible:outline-[#2563EB] focus-visible:outline-offset-2',
    },
    doctor: {
      base: 'border-[#10B981]/40',
      focus: 'focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/30 focus:ring-offset-2 focus:ring-offset-white',
      focusVisible: 'focus-visible:outline-2 focus-visible:outline-[#10B981] focus-visible:outline-offset-2',
    },
    service: {
      base: 'border-[#0891B2]/40',
      focus: 'focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/30 focus:ring-offset-2 focus:ring-offset-white',
      focusVisible: 'focus-visible:outline-2 focus-visible:outline-[#0891B2] focus-visible:outline-offset-2',
    },
    general: {
      base: 'border-slate-200',
      focus: 'focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 focus:ring-offset-2 focus:ring-offset-white',
      focusVisible: 'focus-visible:outline-2 focus-visible:outline-[#2563EB] focus-visible:outline-offset-2',
    },
  };

  const priorityStyling = priority === 'critical' ? 'ring-2 ring-red-500/50' : '';

  // Enhanced medical search suggestions with Vietnamese medical context and better typing
  const medicalSuggestions: MedicalSuggestion[] = useMemo(
    () => [
      {
        text: 'Khám tổng quát',
        icon: '🏥',
        category: 'Khám sức khỏe',
        priority: 1,
        medicalSpecialty: 'general',
      },
      {
        text: 'Bác sĩ tim mạch',
        icon: '❤️',
        category: 'Chuyên khoa tim mạch',
        priority: 2,
        medicalSpecialty: 'cardiology',
      },
      {
        text: 'Xét nghiệm máu',
        icon: '🩸',
        category: 'Xét nghiệm cơ bản',
        priority: 3,
        medicalSpecialty: 'laboratory',
      },
      {
        text: 'Khoa Nhi',
        icon: '👶',
        category: 'Chăm sóc trẻ em',
        priority: 4,
        medicalSpecialty: 'pediatrics',
      },
      {
        text: 'Da liễu thẩm mỹ',
        icon: '🧴',
        category: 'Chuyên khoa da',
        priority: 5,
        medicalSpecialty: 'dermatology',
      },
      {
        text: 'Thần kinh học',
        icon: '🧠',
        category: 'Chuyên khoa thần kinh',
        priority: 6,
        medicalSpecialty: 'neurology',
      },
    ],
    []
  );

  // Filter suggestions based on query with performance optimization
  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return medicalSuggestions;

    const lowercaseQuery = query.toLowerCase().trim();
    return medicalSuggestions
      .filter(
        (suggestion) =>
          suggestion.text.toLowerCase().includes(lowercaseQuery) ||
          suggestion.category.toLowerCase().includes(lowercaseQuery) ||
          suggestion.medicalSpecialty?.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }, [query, medicalSuggestions]);

  // Enhanced handleSubmit with async support and better error handling
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (disabled || isLoading) return;

      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setSearchError('Vui lòng nhập từ khóa tìm kiếm');
        return;
      }

      if (trimmedQuery.length > maxLength) {
        setSearchError(`Từ khóa tìm kiếm không được vượt quá ${maxLength} ký tự`);
        return;
      }

      setIsLoading(true);
      setSearchError(null);
      setHasSearched(true);
      setShowSuggestions(false);

      try {
        if (onSearch) {
          await onSearch(trimmedQuery);
        } else {
          navigate(`/search?keyword=${encodeURIComponent(trimmedQuery)}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tìm kiếm';
        setSearchError(errorMessage);

        if (onSearchError) {
          onSearchError(error instanceof Error ? error : new Error(errorMessage));
        }
      } finally {
        // Small delay for better UX and to prevent rapid successive searches
        setTimeout(
          () => {
            setIsLoading(false);
          },
          shouldReduceMotion ? 100 : 300
        );
      }
    },
    [query, disabled, isLoading, maxLength, onSearch, onSearchError, navigate, shouldReduceMotion]
  );

  // Enhanced handleInputChange with debouncing and performance optimizations
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Prevent input if disabled or exceeds max length
      if (disabled || (maxLength && value.length > maxLength)) {
        return;
      }

      setQuery(value);
      setSelectedSuggestionIndex(-1); // Reset selection when typing
      setSearchError(null); // Clear error when user starts typing

      // Show suggestions based on override or default behavior
      const shouldShowSuggestions = showSuggestionsOverride !== undefined ? showSuggestionsOverride : value.length > 0;
      setShowSuggestions(shouldShowSuggestions);

      if (value.length === 0) {
        setHasSearched(false); // Reset search state when input is cleared
      }

      // Debounced callback for external query change handler
      if (onQueryChange && debounceMs > 0) {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = window.setTimeout(() => {
          onQueryChange(value);
        }, debounceMs);
      } else if (onQueryChange) {
        onQueryChange(value);
      }
    },
    [disabled, maxLength, showSuggestionsOverride, onQueryChange, debounceMs]
  );

  // Enhanced focus and blur handlers with callback support
  const handleFocus = useCallback(() => {
    if (disabled) return;

    setIsFocused(true);

    // Show suggestions based on override or default behavior
    const shouldShowSuggestions = showSuggestionsOverride !== undefined ? showSuggestionsOverride : query.length > 0;
    setShowSuggestions(shouldShowSuggestions);

    if (onFocus) {
      onFocus();
    }
  }, [disabled, query.length, showSuggestionsOverride, onFocus]);

  const handleBlur = useCallback(() => {
    // Delay to allow clicking on suggestions
    setTimeout(
      () => {
        setIsFocused(false);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);

        if (onBlur) {
          onBlur();
        }
      },
      shouldReduceMotion ? 100 : 150
    );
  }, [onBlur, shouldReduceMotion]);

  // Enhanced keyboard navigation for accessibility with filtered suggestions
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (!showSuggestions || filteredSuggestions.length === 0) {
        // Allow form submission when no suggestions are shown
        if (e.key === 'Enter') {
          handleSubmit(e as any);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
          break;
        case 'Enter':
          if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < filteredSuggestions.length) {
            e.preventDefault();
            handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex].text);
          } else {
            // Submit form if no suggestion is selected
            handleSubmit(e as any);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
          searchInputRef.current?.blur();
          break;
        case 'Tab':
          // Allow natural tab navigation
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
          break;
      }
    },
    [disabled, showSuggestions, filteredSuggestions, selectedSuggestionIndex, handleSubmit]
  );

  // Enhanced suggestion click handler with async support
  const handleSuggestionClick = useCallback(
    async (suggestion: string) => {
      if (disabled || isLoading) return;

      setQuery(suggestion);
      setShowSuggestions(false);
      setSearchError(null);
      setHasSearched(true);
      setIsLoading(true);
      setSelectedSuggestionIndex(-1);

      try {
        if (onSearch) {
          await onSearch(suggestion);
        } else {
          navigate(`/search?keyword=${encodeURIComponent(suggestion)}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tìm kiếm';
        setSearchError(errorMessage);

        if (onSearchError) {
          onSearchError(error instanceof Error ? error : new Error(errorMessage));
        }
      } finally {
        setTimeout(
          () => {
            setIsLoading(false);
          },
          shouldReduceMotion ? 100 : 300
        );
      }
    },
    [disabled, isLoading, onSearch, onSearchError, navigate, shouldReduceMotion]
  );

  // Enhanced clear search function
  const clearSearch = useCallback(() => {
    if (disabled) return;

    setQuery('');
    setShowSuggestions(false);
    setSearchError(null);
    setHasSearched(false);
    setSelectedSuggestionIndex(-1);

    // Clear any pending debounced calls
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Notify parent of query change
    if (onQueryChange) {
      onQueryChange('');
    }

    // Focus back to input for better UX
    searchInputRef.current?.focus();
  }, [disabled, onQueryChange]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative z-20 ${className}`}>
      {/* Enhanced Hospital Search Container with Micro-animations and Reduced Motion Support */}
      <motion.div
        className={`relative bg-[${HEALTHCARE_COLORS.medicalWhite}]/98 backdrop-blur-xl rounded-xl shadow-lg border border-[${HEALTHCARE_COLORS.medicalBlue}]/20 overflow-hidden medical-search-container ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
        animate={{
          opacity: 1,
          y: shouldReduceMotion ? 0 : 0,
          scale: shouldReduceMotion ? 1 : 1,
          boxShadow: isFocused
            ? `0 12px 24px rgba(37, 99, 235, 0.12), 0 4px 8px rgba(37, 99, 235, 0.08)`
            : '0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.03)',
        }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={
          shouldReduceMotion || disabled
            ? {}
            : {
                scale: 1.01,
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.08), 0 2px 6px rgba(37, 99, 235, 0.06)',
              }
        }
        style={{
          background: `linear-gradient(135deg, ${HEALTHCARE_COLORS.medicalWhite} 0%, rgba(248,250,252,0.95) 100%)`,
        }}
      >
        {/* Enhanced Medical Cross Accent with Pulse Animation */}
        <div
          className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r medical-pulse-accent ${shouldReduceMotion ? '' : 'animate-pulse'}`}
          style={{
            background: `linear-gradient(to right, ${HEALTHCARE_COLORS.medicalBlue}, ${HEALTHCARE_COLORS.trustCyan}, ${HEALTHCARE_COLORS.healingGreen})`,
          }}
        ></div>

        {/* Medical Cross Icon Overlay */}
        <div className="absolute top-1 right-2 opacity-5">
          <MedicalIcons.MedicalCross
            size="lg"
            className={`text-[${HEALTHCARE_COLORS.medicalBlue}]`}
            aria-hidden="true"
          />
        </div>

        {/* Compact Search Input Section */}
        <div className="p-2">
          <form ref={searchFormRef} onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
              {/* Enhanced Medical Search Icon with Context-Aware Iconography */}
              <div
                className={`absolute z-10 left-2.5 flex items-center justify-center pointer-events-none transition-all duration-300 ${
                  isFocused ? `text-[${HEALTHCARE_COLORS.medicalBlue}] scale-105` : 'text-slate-400'
                }`}
              >
                <motion.div
                  animate={isLoading && !shouldReduceMotion ? { rotate: 360 } : { rotate: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 1.2, repeat: isLoading ? Infinity : 0, ease: 'linear' }
                  }
                  whileHover={!isLoading && !shouldReduceMotion ? { scale: 1.1, rotate: 5 } : {}}
                >
                  {isLoading ? (
                    <MedicalSpinner size="sm" color={medicalContext === 'emergency' ? 'secondary' : 'primary'} />
                  ) : medicalContext === 'emergency' ? (
                    <MedicalIcons.Emergency
                      size="md"
                      className={`text-[${HEALTHCARE_COLORS.emergencyRed}]`}
                      aria-hidden="true"
                    />
                  ) : medicalContext === 'doctor' ? (
                    <MedicalIcons.Stethoscope
                      size="md"
                      className={`text-[${HEALTHCARE_COLORS.healingGreen}]`}
                      aria-hidden="true"
                    />
                  ) : medicalContext === 'appointment' ? (
                    <MedicalIcons.Calendar
                      size="md"
                      className={`text-[${HEALTHCARE_COLORS.trustCyan}]`}
                      aria-hidden="true"
                    />
                  ) : (
                    <MedicalIcons.Search
                      size="md"
                      className={`text-[${HEALTHCARE_COLORS.medicalBlue}]`}
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
              </div>

              {/* Enhanced Compact Medical Search Input with WCAG 2.1 AA Focus States */}
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={computedPlaceholder}
                maxLength={maxLength}
                className={`w-full py-2.5 pl-10 pr-10 rounded-lg border-2 outline-none transition-all duration-300 text-slate-800 placeholder-slate-500 bg-white/90 backdrop-blur-sm text-base font-medium medical-focus-input ${
                  isFocused
                    ? `${contextStyling[medicalContext].base} ${contextStyling[medicalContext].focus} ${contextStyling[medicalContext].focusVisible} shadow-md bg-white`
                    : `${contextStyling[medicalContext].base} hover:border-[${HEALTHCARE_COLORS.medicalBlue}]/50 hover:shadow-sm`
                } ${priorityStyling} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                style={{
                  fontSize: '16px', // Prevents zoom on iOS
                  minHeight: '44px', // Ensures 44px+ touch target
                }}
                aria-label={computedAriaLabel}
                aria-busy={isLoading}
                aria-describedby={`${descriptionId} ${statusId} ${searchError ? errorId : ''}`}
                aria-expanded={showSuggestions}
                aria-haspopup="listbox"
                aria-owns={showSuggestions ? suggestionsId : undefined}
                aria-activedescendant={
                  selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined
                }
                aria-invalid={searchError ? 'true' : 'false'}
                role="combobox"
                disabled={disabled || isLoading}
                autoComplete="off"
                spellCheck="false"
                autoCapitalize="off"
                autoCorrect="off"
              />

              {/* Enhanced accessibility descriptions for screen readers */}
              <div id={descriptionId} className="sr-only">
                {medicalContext === 'emergency'
                  ? 'Tìm kiếm khẩn cấp y tế. Sử dụng phím Tab để điều hướng, Enter để tìm kiếm. Kết quả sẽ hiển thị ngay lập tức.'
                  : 'Tìm kiếm dịch vụ y tế. Sử dụng phím Tab để điều hướng, Enter để tìm kiếm, phím mũi tên lên xuống để chọn gợi ý. Nhấn Escape để đóng danh sách gợi ý.'}
              </div>

              {/* Live region for search status announcements */}
              <div id={statusId} className="sr-only" aria-live="polite" aria-atomic="true">
                {isLoading
                  ? 'Đang tìm kiếm...'
                  : searchError
                    ? `Lỗi: ${searchError}`
                    : showSuggestions && filteredSuggestions.length > 0
                      ? `Có ${filteredSuggestions.length} gợi ý tìm kiếm. Sử dụng phím mũi tên để điều hướng.`
                      : query && !showSuggestions && hasSearched
                        ? 'Không có gợi ý nào được tìm thấy.'
                        : ''}
              </div>

              {/* Enhanced visual error message with better accessibility */}
              <AnimatePresence>
                {searchError && (
                  <motion.div
                    id={errorId}
                    className={`absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm z-50`}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                    role="alert"
                    aria-live="assertive"
                  >
                    <div className="flex items-center gap-2">
                      <MedicalIcons.AlertTriangle
                        size="sm"
                        className={`text-[${HEALTHCARE_COLORS.emergencyRed}]`}
                        aria-hidden="true"
                      />
                      <span>{searchError}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Compact Clear Button with WCAG 2.1 AA Focus States */}
              <AnimatePresence>
                {query && !isLoading && !disabled && (
                  <motion.button
                    type="button"
                    onClick={clearSearch}
                    className={`absolute right-1.5 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md medical-focus-button focus:outline-2 focus:outline-[${HEALTHCARE_COLORS.medicalBlue}] focus:outline-offset-2 focus:ring-2 focus:ring-[${HEALTHCARE_COLORS.medicalBlue}]/30 focus:ring-offset-2 focus:ring-offset-white focus-visible:outline-2 focus-visible:outline-[${HEALTHCARE_COLORS.medicalBlue}] focus-visible:outline-offset-2`}
                    aria-label="Xóa tìm kiếm và quay lại ô nhập"
                    aria-describedby={`${searchId}-clear-description`}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, rotate: 90 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            scale: 1.05,
                            rotate: 90,
                            backgroundColor: `rgba(37, 99, 235, 0.1)`,
                          }
                    }
                    transition={shouldReduceMotion ? { duration: 0 } : undefined}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" opacity="0.1" fill="currentColor" />
                      <path d="m15 9-6 6" />
                      <path d="m9 9 6 6" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Hidden description for clear button */}
              <div id={`${searchId}-clear-description`} className="sr-only">
                Xóa nội dung tìm kiếm và đặt con trở lại ô nhập
              </div>
            </div>
          </form>
        </div>

        {/* Enhanced Compact Quick Access Medical Categories */}
        {showQuickCategories && !disabled && (
          <motion.div
            className="px-2 pb-2"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.15, duration: 0.25 }}
          >
            <div
              className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide"
              role="group"
              aria-label="Danh mục tìm kiếm nhanh y tế"
              aria-describedby="quick-categories-description"
            >
              {/* Hidden description for screen readers */}
              <div id="quick-categories-description" className="sr-only">
                Các danh mục tìm kiếm nhanh cho dịch vụ y tế. Sử dụng phím Tab để điều hướng và Enter để chọn.
              </div>

              {quickCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={async () => {
                    if (disabled || isLoading) return;

                    setQuery(category.searchTerm);
                    setHasSearched(true);
                    setIsLoading(true);

                    try {
                      if (onSearch) {
                        await onSearch(category.searchTerm);
                      } else {
                        navigate(`/search?keyword=${encodeURIComponent(category.searchTerm)}`);
                      }
                    } catch (error) {
                      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tìm kiếm';
                      setSearchError(errorMessage);

                      if (onSearchError) {
                        onSearchError(error instanceof Error ? error : new Error(errorMessage));
                      }
                    } finally {
                      setTimeout(
                        () => {
                          setIsLoading(false);
                        },
                        shouldReduceMotion ? 100 : 300
                      );
                    }
                  }}
                  className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all duration-200 min-w-fit bg-gradient-to-r ${category.gradient} text-white shadow-md hover:shadow-lg medical-focus-category focus:outline-2 focus:outline-white focus:outline-offset-2 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.05 * index, duration: 0.25 }}
                  whileHover={
                    shouldReduceMotion || disabled || isLoading
                      ? {}
                      : {
                          scale: 1.02,
                          y: -1,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        }
                  }
                  whileTap={shouldReduceMotion || disabled || isLoading ? {} : { scale: 0.98 }}
                  aria-label={category.ariaLabel || `Tìm kiếm ${category.label.toLowerCase()}`}
                  aria-describedby={`category-${category.id}-description`}
                  disabled={disabled || isLoading}
                  style={{ minHeight: '32px' }} // Ensure adequate touch target
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d={category.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-medium">{category.label}</span>

                  {/* Enhanced hidden description for screen readers */}
                  <span id={`category-${category.id}-description`} className="sr-only">
                    {category.description || `Tìm kiếm nhanh cho ${category.label.toLowerCase()}`}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Compact Medical Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && isFocused && !disabled && (
          <motion.div
            ref={suggestionsRef}
            className={`absolute top-full left-0 right-0 mt-1.5 bg-[${HEALTHCARE_COLORS.medicalWhite}]/98 backdrop-blur-xl rounded-xl shadow-lg border border-[${HEALTHCARE_COLORS.medicalBlue}]/20 overflow-hidden z-30`}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: `linear-gradient(135deg, ${HEALTHCARE_COLORS.medicalWhite} 0%, rgba(248,250,252,0.95) 100%)`,
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
            }}
            id={suggestionsId}
            role="listbox"
            aria-label="Gợi ý tìm kiếm y tế"
            aria-labelledby={`${searchId}-suggestions-header`}
            aria-live="polite"
          >
            <div className="p-1.5">
              <div
                id={`${searchId}-suggestions-header`}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-2.5 py-1.5 border-b border-slate-100"
              >
                <MedicalIcons.VitalSigns
                  size="sm"
                  className={`text-[${HEALTHCARE_COLORS.medicalBlue}]`}
                  aria-hidden="true"
                />
                {filteredSuggestions.length > 0
                  ? query.trim()
                    ? `Gợi ý cho "${query.trim()}" (${filteredSuggestions.length})`
                    : 'Tìm kiếm phổ biến'
                  : 'Không có gợi ý'}
              </div>

              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, index) => {
                  const isSelected = selectedSuggestionIndex === index;
                  return (
                    <motion.button
                      key={suggestion.text}
                      id={`suggestion-${index}`}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-all duration-150 flex items-center gap-2.5 group medical-focus-suggestion focus:outline-2 focus:outline-[${HEALTHCARE_COLORS.medicalBlue}] focus:outline-offset-2 focus:ring-2 focus:ring-[${HEALTHCARE_COLORS.medicalBlue}]/30 focus:ring-offset-2 focus:ring-offset-white focus-visible:outline-2 focus-visible:outline-[${HEALTHCARE_COLORS.medicalBlue}] focus-visible:outline-offset-2 ${
                        isSelected
                          ? `bg-[${HEALTHCARE_COLORS.medicalBlue}]/10 text-slate-800 border-l-4 border-[${HEALTHCARE_COLORS.medicalBlue}]`
                          : `text-slate-700 hover:bg-[${HEALTHCARE_COLORS.medicalBlue}]/5 focus:bg-[${HEALTHCARE_COLORS.medicalBlue}]/5`
                      } ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { delay: index * 0.03, duration: 0.2 }}
                      whileTap={shouldReduceMotion || disabled || isLoading ? {} : { scale: 0.98 }}
                      whileHover={
                        shouldReduceMotion || disabled || isLoading
                          ? {}
                          : {
                              x: 2,
                              backgroundColor: isSelected ? `rgba(37, 99, 235, 0.15)` : `rgba(37, 99, 235, 0.08)`,
                            }
                      }
                      aria-label={`Chọn gợi ý: ${suggestion.text} - ${suggestion.category}${suggestion.medicalSpecialty ? ` (${suggestion.medicalSpecialty})` : ''}`}
                      aria-describedby={`suggestion-${index}-description`}
                      aria-selected={isSelected}
                      role="option"
                      tabIndex={-1} // Managed by keyboard navigation
                      disabled={disabled || isLoading}
                      style={{ minHeight: '44px' }} // Ensure adequate touch target
                    >
                      <div
                        className={`flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[${HEALTHCARE_COLORS.medicalBlue}]/10 to-[${HEALTHCARE_COLORS.healingGreen}]/10 rounded-full flex items-center justify-center text-sm group-hover:scale-105 group-focus:scale-105 transition-transform duration-150 ${
                          isSelected
                            ? `scale-105 bg-gradient-to-br from-[${HEALTHCARE_COLORS.medicalBlue}]/20 to-[${HEALTHCARE_COLORS.healingGreen}]/20`
                            : ''
                        } ${shouldReduceMotion ? 'transition-none' : ''}`}
                      >
                        <span aria-hidden="true">{suggestion.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-medium text-sm truncate ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                        >
                          {suggestion.text}
                        </div>
                        <div className={`text-xs truncate ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>
                          {suggestion.category}
                          {suggestion.medicalSpecialty && (
                            <span className="ml-1 text-slate-400">• {suggestion.medicalSpecialty}</span>
                          )}
                        </div>
                      </div>
                      <svg
                        className={`w-3.5 h-3.5 transition-colors duration-150 flex-shrink-0 ${
                          isSelected
                            ? `text-[${HEALTHCARE_COLORS.medicalBlue}]`
                            : `text-slate-400 group-hover:text-[${HEALTHCARE_COLORS.medicalBlue}] group-focus:text-[${HEALTHCARE_COLORS.medicalBlue}]`
                        } ${shouldReduceMotion ? 'transition-none' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                      {/* Enhanced hidden description for screen readers */}
                      <span id={`suggestion-${index}-description`} className="sr-only">
                        Gợi ý tìm kiếm: {suggestion.text} thuộc danh mục {suggestion.category}
                        {suggestion.medicalSpecialty ? `, chuyên khoa ${suggestion.medicalSpecialty}` : ''}.
                        {isSelected ? 'Đã chọn. ' : ''}Nhấn Enter để chọn hoặc sử dụng phím mũi tên để điều hướng.
                      </span>
                    </motion.button>
                  );
                })
              ) : (
                <div className="px-2.5 py-4 text-center text-slate-500" role="status">
                  <MedicalIcons.Search size="lg" className="mx-auto mb-2 text-slate-300" aria-hidden="true" />
                  <p className="text-sm font-medium">
                    {query.trim() ? 'Không tìm thấy gợi ý phù hợp' : 'Không có gợi ý tìm kiếm'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {query.trim()
                      ? 'Thử nhập từ khóa khác hoặc nhấn Enter để tìm kiếm'
                      : 'Nhập từ khóa để xem gợi ý tìm kiếm'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Custom Styles for WCAG 2.1 AA Compliant Medical UI */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Medical gradient animations with reduced motion support */
        @keyframes medical-glow {
          0%, 100% { box-shadow: 0 0 12px rgba(37, 99, 235, 0.2); }
          50% { box-shadow: 0 0 18px rgba(37, 99, 235, 0.3); }
        }

        @keyframes medical-pulse-accent {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .medical-glow {
          animation: medical-glow 2s ease-in-out infinite;
        }

        .medical-pulse-accent {
          animation: medical-pulse-accent 3s ease-in-out infinite;
        }

        /* Enhanced micro-animations for medical UI */
        .medical-search-container {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced reduced motion preferences support */
        @media (prefers-reduced-motion: reduce) {
          .medical-glow,
          .medical-pulse-accent {
            animation: none !important;
          }

          .medical-focus-input,
          .medical-focus-button,
          .medical-focus-category,
          .medical-focus-suggestion,
          .medical-search-container {
            transition: none !important;
          }

          /* Disable all motion animations while preserving focus states */
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          /* Preserve essential focus transitions for accessibility */
          .medical-focus-input:focus,
          .medical-focus-button:focus,
          .medical-focus-category:focus,
          .medical-focus-suggestion:focus {
            transition: box-shadow 0.1ms, outline 0.1ms !important;
          }
        }

        /* WCAG 2.1 AA Compliant Focus States */

        /* Search Input Focus - Enhanced for medical contexts */
        .medical-focus-input:focus {
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3), 0 0 0 4px rgba(37, 99, 235, 0.1);
          border-color: #2563EB;
        }

        .medical-focus-input:focus-visible {
          outline: 2px solid #2563EB;
          outline-offset: 2px;
        }

        /* Clear Button Focus - High contrast for accessibility */
        .medical-focus-button:focus {
          background-color: rgba(37, 99, 235, 0.1);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5), 0 0 0 4px rgba(37, 99, 235, 0.2);
        }

        .medical-focus-button:focus-visible {
          outline: 2px solid #2563EB;
          outline-offset: 2px;
        }

        /* Category Button Focus - White outline for colored backgrounds */
        .medical-focus-category:focus {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8), 0 0 0 4px rgba(255, 255, 255, 0.4);
        }

        .medical-focus-category:focus-visible {
          outline: 2px solid #FFFFFF;
          outline-offset: 2px;
        }

        /* Suggestion Item Focus - Consistent with input styling */
        .medical-focus-suggestion:focus {
          background-color: rgba(37, 99, 235, 0.05);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3), 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .medical-focus-suggestion:focus-visible {
          outline: 2px solid #2563EB;
          outline-offset: 2px;
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .medical-focus-input:focus,
          .medical-focus-button:focus,
          .medical-focus-suggestion:focus {
            outline: 3px solid #000000;
            outline-offset: 2px;
            box-shadow: 0 0 0 1px #FFFFFF, 0 0 0 4px #000000;
          }

          .medical-focus-category:focus {
            outline: 3px solid #FFFFFF;
            outline-offset: 2px;
            box-shadow: 0 0 0 1px #000000, 0 0 0 4px #FFFFFF;
          }
        }

        /* Dark Mode Focus States */
        @media (prefers-color-scheme: dark) {
          .medical-focus-input:focus,
          .medical-focus-button:focus,
          .medical-focus-suggestion:focus {
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5), 0 0 0 4px rgba(37, 99, 235, 0.2);
            border-color: #2563EB;
          }

          .medical-focus-input:focus-visible,
          .medical-focus-button:focus-visible,
          .medical-focus-suggestion:focus-visible {
            outline-color: #2563EB;
          }
        }

        /* Smooth transitions for focus states */
        .medical-focus-input,
        .medical-focus-button,
        .medical-focus-category,
        .medical-focus-suggestion {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Screen reader only content */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
}
