import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MedicalIcons } from './icons/medical-icons';
import { MedicalSpinner } from './medical-animations';

interface SearchBarComponentProps {
  className?: string;
  onSearch?: (query: string) => void;
  showQuickCategories?: boolean;
  variant?: 'default' | 'compact' | 'hero';
  medicalContext?: 'general' | 'emergency' | 'appointment' | 'doctor' | 'service';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  placeholder?: string;
  ariaLabel?: string;
  loading?: boolean;
}

interface QuickCategory {
  id: string;
  label: string;
  icon: string;
  searchTerm: string;
  color: 'primary' | 'secondary' | 'accent' | 'info';
  gradient: string;
}

const quickCategories: QuickCategory[] = [
  {
    id: 'doctors',
    label: 'Bác sĩ',
    icon: 'M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z M16 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z', // Stethoscope
    searchTerm: 'bác sĩ',
    color: 'primary',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'departments',
    label: 'Chuyên khoa',
    icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', // Medical cross in circle
    searchTerm: 'chuyên khoa',
    color: 'secondary',
    gradient: 'from-green-500 to-green-600',
  },
  {
    id: 'services',
    label: 'Dịch vụ khám',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2 M12 6v6l4 2', // Heartbeat with medical monitoring
    searchTerm: 'dịch vụ khám',
    color: 'accent',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'tests',
    label: 'Xét nghiệm',
    icon: 'M9 11H7a2 2 0 01-2-2V7a2 2 0 012-2h2m4 0h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m0 4h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m-4 0H7a2 2 0 01-2-2v-2a2 2 0 012-2h2m5-4a2 2 0 11-4 0 2 2 0 014 0z', // Medical test tubes/lab equipment
    searchTerm: 'xét nghiệm',
    color: 'info',
    gradient: 'from-purple-500 to-indigo-600',
  },
];

export default function SearchBarComponent({
  className = '',
  onSearch,
  showQuickCategories = true,
  variant = 'default',
  medicalContext = 'general',
  priority,
  placeholder,
  ariaLabel,
  loading = false,
}: SearchBarComponentProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(loading);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Enhanced accessibility and medical context
  const searchId = `medical-search-${Math.random().toString(36).slice(2, 9)}`;
  const computedPlaceholder =
    placeholder ||
    (medicalContext === 'emergency'
      ? 'Tìm kiếm khẩn cấp...'
      : medicalContext === 'doctor'
        ? 'Tìm bác sĩ, chuyên khoa...'
        : medicalContext === 'appointment'
          ? 'Tìm lịch hẹn...'
          : 'Tìm kiếm dịch vụ y tế...');

  const computedAriaLabel =
    ariaLabel ||
    `Tìm kiếm ${medicalContext === 'emergency' ? 'khẩn cấp' : 'y tế'}${priority ? `, mức độ: ${priority}` : ''}`;

  // Enhanced Medical context styling with WCAG 2.1 AA compliant focus states
  const contextStyling = {
    emergency: {
      base: 'border-medical-emergency/50',
      focus:
        'focus:border-medical-emergency focus:ring-2 focus:ring-medical-emergency/30 focus:ring-offset-2 focus:ring-offset-white',
      focusVisible: 'focus-visible:outline-2 focus-visible:outline-medical-emergency focus-visible:outline-offset-2',
    },
    appointment: {
      base: 'border-primary/50',
      focus: 'focus:border-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-white',
      focusVisible: 'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
    },
    doctor: {
      base: 'border-secondary/50',
      focus: 'focus:border-secondary focus:ring-2 focus:ring-secondary/30 focus:ring-offset-2 focus:ring-offset-white',
      focusVisible: 'focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2',
    },
    service: {
      base: 'border-info/50',
      focus: 'focus:border-info focus:ring-2 focus:ring-info/30 focus:ring-offset-2 focus:ring-offset-white',
      focusVisible: 'focus-visible:outline-2 focus-visible:outline-info focus-visible:outline-offset-2',
    },
    general: {
      base: 'border-border',
      focus: 'focus:border-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-white',
      focusVisible: 'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
    },
  };

  const priorityStyling = priority === 'critical' ? 'ring-2 ring-medical-emergency/50' : '';

  // Enhanced medical search suggestions with Vietnamese medical context
  const medicalSuggestions = [
    { text: 'Khám tổng quát', icon: '🏥', category: 'Khám sức khỏe' },
    { text: 'Bác sĩ tim mạch', icon: '❤️', category: 'Chuyên khoa tim mạch' },
    { text: 'Xét nghiệm máu', icon: '🩸', category: 'Xét nghiệm cơ bản' },
    { text: 'Khoa Nhi', icon: '👶', category: 'Chăm sóc trẻ em' },
    { text: 'Da liễu thẩm mỹ', icon: '🧴', category: 'Chuyên khoa da' },
    { text: 'Thần kinh học', icon: '🧠', category: 'Chuyên khoa thần kinh' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      try {
        if (onSearch) {
          onSearch(query);
        } else {
          navigate(`/search?keyword=${encodeURIComponent(query)}`);
        }
      } finally {
        setIsLoading(false);
        setShowSuggestions(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestionIndex(-1); // Reset selection when typing
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
  };

  // Enhanced keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev < medicalSuggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : medicalSuggestions.length - 1));
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(medicalSuggestions[selectedSuggestionIndex].text);
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
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`/search?keyword=${encodeURIComponent(suggestion)}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  return (
    <div className={`relative z-20 ${className}`}>
      {/* Compact Hospital Search Container */}
      <motion.div
        className="relative bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-blue-100/50 overflow-hidden"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
          boxShadow: isFocused
            ? '0 12px 24px rgba(59, 130, 246, 0.12), 0 4px 8px rgba(59, 130, 246, 0.08)'
            : '0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Compact Medical Cross Accent */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-teal-500 to-blue-600"></div>

        {/* Compact Search Input Section */}
        <div className="p-2.5">
          <form ref={searchFormRef} onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
              {/* Compact Medical Search Icon */}
              <div
                className={`absolute z-10 left-3 flex items-center justify-center pointer-events-none transition-all duration-300 ${
                  isFocused ? 'text-blue-600 scale-105' : 'text-slate-400'
                }`}
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1.2, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
                >
                  {isLoading ? (
                    <MedicalSpinner size="sm" color={medicalContext === 'emergency' ? 'secondary' : 'primary'} />
                  ) : (
                    <MedicalIcons.Search size="md" className="text-primary" aria-hidden="true" />
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
                className={`w-full py-3 pl-11 pr-11 rounded-lg border-2 outline-none transition-all duration-300 text-text-primary placeholder-text-muted bg-surface/80 backdrop-blur-sm text-base font-medium medical-focus-input ${
                  isFocused
                    ? `${contextStyling[medicalContext].base} ${contextStyling[medicalContext].focus} ${contextStyling[medicalContext].focusVisible} shadow-md bg-surface`
                    : `${contextStyling[medicalContext].base} hover:border-primary/50 hover:shadow-sm`
                } ${priorityStyling}`}
                style={{
                  fontSize: '16px', // Prevents zoom on iOS
                  minHeight: '44px', // Ensures 44px+ touch target
                }}
                aria-label={computedAriaLabel}
                aria-busy={isLoading}
                aria-describedby={`${searchId}-description`}
                aria-expanded={showSuggestions}
                aria-haspopup="listbox"
                aria-activedescendant={
                  selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined
                }
                role="combobox"
                disabled={isLoading}
              />

              {/* Hidden description for screen readers */}
              <div id={`${searchId}-description`} className="sr-only">
                {medicalContext === 'emergency'
                  ? 'Tìm kiếm khẩn cấp y tế. Sử dụng phím Tab để điều hướng, Enter để tìm kiếm.'
                  : 'Tìm kiếm dịch vụ y tế. Sử dụng phím Tab để điều hướng, Enter để tìm kiếm, phím mũi tên để chọn gợi ý.'}
              </div>

              {/* Enhanced Compact Clear Button with WCAG 2.1 AA Focus States */}
              <AnimatePresence>
                {query && !isLoading && (
                  <motion.button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md medical-focus-button focus:outline-2 focus:outline-primary focus:outline-offset-2 focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-white focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                    aria-label="Xóa tìm kiếm và quay lại ô nhập"
                    aria-describedby={`${searchId}-clear-description`}
                    initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
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

        {/* Compact Quick Access Medical Categories */}
        {showQuickCategories && (
          <motion.div
            className="px-2.5 pb-2.5"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            <div
              className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide"
              role="group"
              aria-label="Danh mục tìm kiếm nhanh"
            >
              {quickCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => {
                    setQuery(category.searchTerm);
                    if (onSearch) {
                      onSearch(category.searchTerm);
                    } else {
                      navigate(`/search?keyword=${encodeURIComponent(category.searchTerm)}`);
                    }
                  }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 min-w-fit bg-gradient-to-r ${category.gradient} text-white shadow-md hover:shadow-lg medical-focus-category focus:outline-2 focus:outline-white focus:outline-offset-2 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.25 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Tìm kiếm ${category.label.toLowerCase()}`}
                  aria-describedby={`category-${category.id}-description`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d={category.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-medium">{category.label}</span>

                  {/* Hidden description for screen readers */}
                  <span id={`category-${category.id}-description`} className="sr-only">
                    Tìm kiếm nhanh cho {category.label.toLowerCase()}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Compact Medical Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && isFocused && (
          <motion.div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl rounded-xl shadow-lg border border-blue-100/50 overflow-hidden z-30"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
            }}
            role="listbox"
            aria-label="Gợi ý tìm kiếm y tế"
          >
            <div className="p-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-3 py-2 border-b border-slate-100">
                <svg
                  className="w-3.5 h-3.5 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-label="Tìm kiếm phổ biến"
                  role="img"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Tìm kiếm phổ biến
              </div>
              {medicalSuggestions.map((suggestion, index) => {
                const isSelected = selectedSuggestionIndex === index;
                return (
                  <motion.button
                    key={suggestion.text}
                    id={`suggestion-${index}`}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 flex items-center gap-3 group medical-focus-suggestion focus:outline-2 focus:outline-primary focus:outline-offset-2 focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-white focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
                      isSelected
                        ? 'bg-blue-100 text-slate-800 border-l-4 border-primary'
                        : 'text-slate-700 hover:bg-blue-50 focus:bg-blue-50'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ x: 2 }}
                    aria-label={`Chọn gợi ý: ${suggestion.text} - ${suggestion.category}`}
                    aria-describedby={`suggestion-${index}-description`}
                    aria-selected={isSelected}
                    role="option"
                    tabIndex={-1} // Managed by keyboard navigation
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center text-sm group-hover:scale-105 group-focus:scale-105 transition-transform duration-150 ${
                        isSelected ? 'scale-105 bg-gradient-to-br from-blue-200 to-teal-200' : ''
                      }`}
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
                      </div>
                    </div>
                    <svg
                      className={`w-3.5 h-3.5 transition-colors duration-150 flex-shrink-0 ${
                        isSelected
                          ? 'text-primary'
                          : 'text-slate-400 group-hover:text-blue-500 group-focus:text-blue-500'
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    {/* Hidden description for screen readers */}
                    <span id={`suggestion-${index}-description`} className="sr-only">
                      Gợi ý tìm kiếm: {suggestion.text} thuộc danh mục {suggestion.category}.
                      {isSelected ? 'Đã chọn. ' : ''}Nhấn Enter để chọn.
                    </span>
                  </motion.button>
                );
              })}
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
          0%, 100% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.2); }
          50% { box-shadow: 0 0 18px rgba(59, 130, 246, 0.3); }
        }

        .medical-glow {
          animation: medical-glow 2s ease-in-out infinite;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .medical-glow {
            animation: none;
          }

          .medical-focus-input,
          .medical-focus-button,
          .medical-focus-category,
          .medical-focus-suggestion {
            transition: none;
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
          background-color: rgba(59, 130, 246, 0.1);
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
          background-color: rgba(59, 130, 246, 0.05);
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
            box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5), 0 0 0 4px rgba(96, 165, 250, 0.2);
            border-color: #60A5FA;
          }

          .medical-focus-input:focus-visible,
          .medical-focus-button:focus-visible,
          .medical-focus-suggestion:focus-visible {
            outline-color: #60A5FA;
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
