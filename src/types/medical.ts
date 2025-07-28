/**
 * Medical Service Types and Interfaces
 * Comprehensive type definitions for medical service pricing system
 *
 * @version 2.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 */

/**
 * Medical service priority levels
 */
export enum MedicalServicePriority {
  EMERGENCY = 1,
  URGENT = 2,
  ROUTINE = 3,
  ELECTIVE = 4,
}

/**
 * Medical service categories
 */
export enum MedicalServiceCategory {
  EMERGENCY = 'emergency',
  CARDIOLOGY = 'cardiology',
  NEUROLOGY = 'neurology',
  ORTHOPEDICS = 'orthopedics',
  PEDIATRICS = 'pediatrics',
  OBSTETRICS = 'obstetrics',
  SURGERY = 'surgery',
  RADIOLOGY = 'radiology',
  LABORATORY = 'laboratory',
  PHARMACY = 'pharmacy',
  GENERAL = 'general',
}

/**
 * Currency types supported by the medical system
 */
export enum SupportedCurrency {
  VND = 'VND',
  USD = 'USD',
}

/**
 * Medical service price item interface (matches utility functions)
 */
export interface MedicalServicePriceItem {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly categoryId: number;
  readonly categoryName: string;
  readonly isEmergency?: boolean;
  readonly priority?: number;
}

/**
 * Medical service category interface (matches utility functions)
 */
export interface MedicalServiceCategory {
  readonly id: number;
  readonly name: string;
  readonly priority?: number;
  readonly itemCount?: number;
}

/**
 * Search configuration options
 */
export interface MedicalSearchOptions {
  readonly fuzzyMatch?: boolean;
  readonly prioritizeEmergency?: boolean;
  readonly minScore?: number;
  readonly maxResults?: number;
  readonly includeInactive?: boolean;
  readonly categoryFilter?: number[];
  readonly priceRange?: {
    readonly min: number;
    readonly max: number;
  };
}

/**
 * Search result with scoring
 */
export interface MedicalSearchResult {
  readonly item: MedicalServicePriceItem;
  readonly score: number;
  readonly matchedFields: readonly string[];
  readonly highlightedText?: string;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  readonly page: number;
  readonly itemsPerPage: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPrevPage: boolean;
}

/**
 * Performance metrics for monitoring
 */
export interface PerformanceMetrics {
  readonly parseTime: number;
  readonly filterTime: number;
  readonly searchTime: number;
  readonly renderTime: number;
  readonly totalItems: number;
  readonly filteredItems: number;
  readonly cacheHits: number;
  readonly cacheMisses: number;
}

/**
 * Error types for medical services
 */
export enum MedicalErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SERVER_ERROR = 'SERVER_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
}

/**
 * Medical service error interface
 */
export interface MedicalServiceError {
  readonly type: MedicalErrorType;
  readonly message: string;
  readonly code?: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: string;
  readonly retryable: boolean;
}

/**
 * Component state interface
 */
export interface MedicalServiceState {
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: MedicalServiceError | null;
  readonly data: MedicalServicePriceItem[];
  readonly categories: MedicalServiceCategory[];
  readonly filteredData: MedicalServicePriceItem[];
  readonly searchTerm: string;
  readonly selectedCategory: number | null;
  readonly pagination: PaginationConfig;
  readonly performanceMetrics: PerformanceMetrics;
}

/**
 * Hook configuration interface
 */
export interface MedicalServiceHookConfig {
  readonly itemsPerPage?: number;
  readonly debounceDelay?: number;
  readonly enableVirtualization?: boolean;
  readonly enableCaching?: boolean;
  readonly enablePerformanceTracking?: boolean;
  readonly searchOptions?: MedicalSearchOptions;
  readonly autoRefresh?: boolean;
  readonly refreshInterval?: number;
}

/**
 * Component props interfaces
 */
export interface MedicalPriceCardProps {
  readonly item: MedicalServicePriceItem;
  readonly onClick?: (item: MedicalServicePriceItem) => void;
  readonly showCategory?: boolean;
  readonly compact?: boolean;
  readonly highlightSearch?: string;
  readonly className?: string;
}

export interface MedicalCategoryFilterProps {
  readonly categories: MedicalServiceCategory[];
  readonly selectedCategory: number | null;
  readonly onCategoryChange: (categoryId: number | null) => void;
  readonly showItemCounts?: boolean;
  readonly maxVisible?: number;
  readonly className?: string;
}

export interface MedicalSearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly showSuggestions?: boolean;
  readonly suggestions?: readonly string[];
  readonly className?: string;
}

export interface MedicalPaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
  readonly onPageChange: (page: number) => void;
  readonly showInfo?: boolean;
  readonly className?: string;
}

/**
 * Virtualization props interface
 */
export interface MedicalVirtualizedListProps<T = MedicalServicePriceItem> {
  readonly items: readonly T[];
  readonly itemHeight: number;
  readonly containerHeight: number;
  readonly renderItem: (item: T) => React.ReactNode;
  readonly overscan?: number;
  readonly className?: string;
  readonly onScroll?: (scrollTop: number) => void;
}

/**
 * Theme configuration for medical UI
 */
export interface MedicalThemeConfig {
  readonly colors: {
    readonly primary: {
      readonly blue: string;
      readonly darkBlue: string;
    };
    readonly secondary: {
      readonly green: string;
      readonly darkGreen: string;
    };
    readonly emergency: {
      readonly red: string;
      readonly darkRed: string;
    };
    readonly neutral: Record<string, string>;
  };
  readonly spacing: {
    readonly touchTarget: number;
    readonly padding: Record<string, number>;
    readonly margin: Record<string, number>;
  };
  readonly animation: {
    readonly duration: {
      readonly fast: number;
      readonly normal: number;
      readonly slow: number;
    };
    readonly easing: string;
  };
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  readonly enableScreenReader: boolean;
  readonly enableKeyboardNavigation: boolean;
  readonly enableHighContrast: boolean;
  readonly minTouchTarget: number;
  readonly announceChanges: boolean;
}

/**
 * Type guards for runtime type checking
 */
export const isMedicalServicePriceItem = (item: unknown): item is MedicalServicePriceItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as MedicalServicePriceItem).id === 'number' &&
    typeof (item as MedicalServicePriceItem).name === 'string' &&
    typeof (item as MedicalServicePriceItem).price === 'number'
  );
};

export const isMedicalServiceCategory = (category: unknown): category is MedicalServiceCategory => {
  return (
    typeof category === 'object' &&
    category !== null &&
    typeof (category as MedicalServiceCategory).id === 'number' &&
    typeof (category as MedicalServiceCategory).name === 'string'
  );
};

/**
 * Utility types
 */
export type MedicalServiceItemId = MedicalServicePriceItem['id'];
export type MedicalServiceCategoryId = MedicalServiceCategory['id'];
export type MedicalServicePriceRange = [number, number];
export type MedicalServiceSortField = 'name' | 'price' | 'category' | 'priority';
export type MedicalServiceSortOrder = 'asc' | 'desc';

/**
 * Event handler types
 */
export type MedicalServiceItemClickHandler = (item: MedicalServicePriceItem) => void;
export type MedicalCategoryChangeHandler = (categoryId: number | null) => void;
export type MedicalSearchChangeHandler = (searchTerm: string) => void;
export type MedicalPageChangeHandler = (page: number) => void;
