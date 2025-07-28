import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';
import { 
  SPACING, 
  BORDER_RADIUS, 
  SHADOWS, 
  TOUCH_TARGETS,
  ANIMATIONS,
  combineClasses 
} from '@/styles/medical-design-system';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'doctor' | 'department' | 'service' | 'article';
  url: string;
  priority?: 'high' | 'medium' | 'low';
  medicalContext?: 'emergency' | 'routine' | 'general';
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => Promise<SearchResult[]>;
  onSelect?: (result: SearchResult) => void;
  className?: string;
  medicalContext?: 'emergency' | 'routine' | 'general';
  showRecentSearches?: boolean;
  maxResults?: number;
  debounceMs?: number;
  autoFocus?: boolean;
  ariaLabel?: string;
}

export default function EnhancedSearch({
  placeholder = 'Tìm kiếm dịch vụ y tế, bác sĩ, chuyên khoa...',
  onSearch,
  onSelect,
  className = '',
  medicalContext = 'general',
  showRecentSearches = true,
  maxResults = 8,
  debounceMs = 300,
  autoFocus = false,
  ariaLabel = 'Tìm kiếm dịch vụ y tế',
}: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  const debouncedQuery = useDebounce(query, debounceMs);

  // Load recent searches from localStorage
  useEffect(() => {
    if (showRecentSearches) {
      const saved = localStorage.getItem('medical-search-recent');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved).slice(0, 5));
        } catch (error) {
          console.warn('Failed to load recent searches:', error);
        }
      }
    }
  }, [showRecentSearches]);

  // Auto focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() && onSearch) {
      setIsLoading(true);
      onSearch(debouncedQuery)
        .then((searchResults) => {
          setResults(searchResults.slice(0, maxResults));
          setSelectedIndex(-1);
        })
        .catch((error) => {
          console.error('Search failed:', error);
          setResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [debouncedQuery, onSearch, maxResults]);

  // Medical context styling
  const getContextStyling = useMemo(() => {
    const contextMap = {
      emergency: {
        inputBorder: 'border-red-300 focus:border-red-500 focus:ring-red-500',
        iconColor: 'text-red-500',
        resultHover: 'hover:bg-red-50',
        loadingColor: 'border-red-500',
      },
      routine: {
        inputBorder: 'border-green-300 focus:border-green-500 focus:ring-green-500',
        iconColor: 'text-green-500',
        resultHover: 'hover:bg-green-50',
        loadingColor: 'border-green-500',
      },
      general: {
        inputBorder: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
        iconColor: 'text-blue-500',
        resultHover: 'hover:bg-blue-50',
        loadingColor: 'border-blue-500',
      },
    };
    return contextMap[medicalContext];
  }, [medicalContext]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0 || showRecentSearches);
  }, [showRecentSearches]);

  // Handle result selection
  const handleResultSelect = useCallback((result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    
    // Save to recent searches
    if (showRecentSearches) {
      const updated = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('medical-search-recent', JSON.stringify(updated));
    }

    onSelect?.(result);
  }, [recentSearches, showRecentSearches, onSelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = results.length + (showRecentSearches && !query ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, results, selectedIndex, showRecentSearches, query, recentSearches, handleResultSelect]);

  // Get result type icon
  const getResultIcon = useCallback((type: SearchResult['type']) => {
    const icons = {
      doctor: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4L13.5 7H10.5L9 4L3 7V9H21ZM21 10H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V10Z"/>
        </svg>
      ),
      department: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7V10H22V7L12 2ZM4 11V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V11H4Z"/>
        </svg>
      ),
      service: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
        </svg>
      ),
      article: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"/>
        </svg>
      ),
    };
    return icons[type];
  }, []);

  return (
    <div className={combineClasses('relative w-full', className)}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={combineClasses(
            'w-full pl-10 pr-4 py-3 text-base',
            'border-2 rounded-lg',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-opacity-50',
            TOUCH_TARGETS.interactive,
            getContextStyling.inputBorder
          )}
          aria-label={ariaLabel}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />

        {/* Search Icon */}
        <div className={combineClasses(
          'absolute left-3 top-1/2 transform -translate-y-1/2',
          getContextStyling.iconColor
        )}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className={combineClasses(
              'w-4 h-4 border-2 border-gray-300 rounded-full animate-spin',
              `border-t-${medicalContext === 'emergency' ? 'red' : medicalContext === 'routine' ? 'green' : 'blue'}-500`
            )}></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && (query || showRecentSearches) && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={combineClasses(
              'absolute top-full left-0 right-0 z-50 mt-1',
              'bg-white border border-gray-200',
              BORDER_RADIUS.card,
              SHADOWS.dropdown,
              'max-h-80 overflow-y-auto'
            )}
          >
            {/* Search Results */}
            {results.length > 0 && (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultSelect(result)}
                    className={combineClasses(
                      'w-full px-4 py-3 text-left flex items-center space-x-3',
                      'transition-colors duration-150',
                      TOUCH_TARGETS.interactive,
                      selectedIndex === index ? 'bg-gray-100' : getContextStyling.resultHover
                    )}
                  >
                    <div className={combineClasses('flex-shrink-0', getContextStyling.iconColor)}>
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-sm text-gray-500 truncate">{result.subtitle}</div>
                      )}
                    </div>
                    {result.priority === 'high' && (
                      <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {showRecentSearches && !query && recentSearches.length > 0 && (
              <div className="py-2 border-t border-gray-100">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tìm kiếm gần đây
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className={combineClasses(
                      'w-full px-4 py-2 text-left flex items-center space-x-3',
                      'transition-colors duration-150',
                      TOUCH_TARGETS.interactive,
                      'hover:bg-gray-50'
                    )}
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query && !isLoading && results.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>Không tìm thấy kết quả cho "{query}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
