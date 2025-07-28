/**
 * Medical Error Handling Utilities
 * Comprehensive error handling system for medical service applications
 *
 * @version 2.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 */

import { MedicalErrorType, MedicalServiceError } from '@/types/medical';

/**
 * Medical error class with enhanced functionality
 */
export class MedicalError extends Error {
  public readonly type: MedicalErrorType;
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;
  public readonly retryable: boolean;
  public readonly userMessage: string;

  constructor(
    type: MedicalErrorType,
    message: string,
    options: {
      code?: string;
      details?: Record<string, unknown>;
      retryable?: boolean;
      userMessage?: string;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = 'MedicalError';
    this.type = type;
    this.code = options.code;
    this.details = options.details;
    this.timestamp = new Date().toISOString();
    this.retryable = options.retryable ?? false;
    this.userMessage = options.userMessage ?? this.getDefaultUserMessage(type);

    if (options.cause) {
      this.cause = options.cause;
    }

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MedicalError);
    }
  }

  /**
   * Convert to serializable error object
   */
  toJSON(): MedicalServiceError {
    return {
      type: this.type,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      retryable: this.retryable,
    };
  }

  /**
   * Get user-friendly error message in Vietnamese
   */
  private getDefaultUserMessage(type: MedicalErrorType): string {
    const messages: Record<MedicalErrorType, string> = {
      [MedicalErrorType.NETWORK_ERROR]: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
      [MedicalErrorType.PARSE_ERROR]: 'Dữ liệu không hợp lệ. Vui lòng thử lại sau.',
      [MedicalErrorType.VALIDATION_ERROR]: 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.',
      [MedicalErrorType.NOT_FOUND]: 'Không tìm thấy dịch vụ y tế được yêu cầu.',
      [MedicalErrorType.UNAUTHORIZED]: 'Bạn không có quyền truy cập tính năng này.',
      [MedicalErrorType.SERVER_ERROR]: 'Lỗi máy chủ. Vui lòng thử lại sau.',
      [MedicalErrorType.CACHE_ERROR]: 'Lỗi bộ nhớ đệm. Dữ liệu có thể không được cập nhật.',
    };

    return messages[type] || 'Đã xảy ra lỗi không xác định.';
  }
}

/**
 * Error factory functions for common medical errors
 */
export const createMedicalError = {
  /**
   * Network connection error
   */
  network: (message: string, details?: Record<string, unknown>): MedicalError =>
    new MedicalError(MedicalErrorType.NETWORK_ERROR, message, {
      details,
      retryable: true,
      userMessage: 'Không thể kết nối đến hệ thống y tế. Vui lòng kiểm tra kết nối mạng và thử lại.',
    }),

  /**
   * Data parsing error
   */
  parse: (message: string, data?: unknown): MedicalError =>
    new MedicalError(MedicalErrorType.PARSE_ERROR, message, {
      details: { data },
      retryable: false,
      userMessage: 'Dữ liệu dịch vụ y tế không hợp lệ. Vui lòng liên hệ bộ phận kỹ thuật.',
    }),

  /**
   * Validation error
   */
  validation: (message: string, field?: string, value?: unknown): MedicalError =>
    new MedicalError(MedicalErrorType.VALIDATION_ERROR, message, {
      details: { field, value },
      retryable: false,
      userMessage: 'Thông tin nhập vào không hợp lệ. Vui lòng kiểm tra và thử lại.',
    }),

  /**
   * Resource not found error
   */
  notFound: (resource: string, id?: string | number): MedicalError =>
    new MedicalError(MedicalErrorType.NOT_FOUND, `${resource} not found`, {
      details: { resource, id },
      retryable: false,
      userMessage: 'Không tìm thấy dịch vụ y tế được yêu cầu. Vui lòng thử tìm kiếm khác.',
    }),

  /**
   * Authorization error
   */
  unauthorized: (action: string): MedicalError =>
    new MedicalError(MedicalErrorType.UNAUTHORIZED, `Unauthorized: ${action}`, {
      details: { action },
      retryable: false,
      userMessage: 'Bạn không có quyền truy cập tính năng này. Vui lòng liên hệ quản trị viên.',
    }),

  /**
   * Server error
   */
  server: (message: string, statusCode?: number): MedicalError =>
    new MedicalError(MedicalErrorType.SERVER_ERROR, message, {
      details: { statusCode },
      retryable: true,
      userMessage: 'Hệ thống y tế đang gặp sự cố. Vui lòng thử lại sau ít phút.',
    }),

  /**
   * Cache error
   */
  cache: (operation: string, key?: string): MedicalError =>
    new MedicalError(MedicalErrorType.CACHE_ERROR, `Cache error: ${operation}`, {
      details: { operation, key },
      retryable: true,
      userMessage: 'Dữ liệu có thể không được cập nhật. Vui lòng làm mới trang.',
    }),
};

/**
 * Error boundary utility for React components
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: MedicalError | null;
  errorId: string | null;
}

/**
 * Error recovery strategies
 */
export enum ErrorRecoveryStrategy {
  RETRY = 'retry',
  FALLBACK = 'fallback',
  IGNORE = 'ignore',
  REDIRECT = 'redirect',
}

/**
 * Error recovery configuration
 */
export interface ErrorRecoveryConfig {
  strategy: ErrorRecoveryStrategy;
  maxRetries?: number;
  retryDelay?: number;
  fallbackData?: unknown;
  redirectUrl?: string;
}

/**
 * Error handler with recovery strategies
 */
export class MedicalErrorHandler {
  private static instance: MedicalErrorHandler;
  private errorLog: MedicalServiceError[] = [];
  private maxLogSize = 100;

  private constructor() {}

  public static getInstance(): MedicalErrorHandler {
    if (!MedicalErrorHandler.instance) {
      MedicalErrorHandler.instance = new MedicalErrorHandler();
    }
    return MedicalErrorHandler.instance;
  }

  /**
   * Handle error with recovery strategy
   */
  public async handleError(
    error: Error | MedicalError,
    config: ErrorRecoveryConfig = { strategy: ErrorRecoveryStrategy.IGNORE }
  ): Promise<unknown> {
    const medicalError = error instanceof MedicalError ? error : this.convertToMedicalError(error);

    // Log error
    this.logError(medicalError);

    // Apply recovery strategy
    switch (config.strategy) {
      case ErrorRecoveryStrategy.RETRY:
        return this.retryOperation(medicalError, config);

      case ErrorRecoveryStrategy.FALLBACK:
        return config.fallbackData;

      case ErrorRecoveryStrategy.REDIRECT:
        if (config.redirectUrl) {
          window.location.href = config.redirectUrl;
        }
        break;

      case ErrorRecoveryStrategy.IGNORE:
      default:
        // Just log and continue
        break;
    }

    throw medicalError;
  }

  /**
   * Convert generic error to MedicalError
   */
  private convertToMedicalError(error: Error): MedicalError {
    if (error.name === 'TypeError' || error.name === 'SyntaxError') {
      return createMedicalError.parse(error.message);
    }

    if (error.message.includes('fetch') || error.message.includes('network')) {
      return createMedicalError.network(error.message);
    }

    return createMedicalError.server(error.message);
  }

  /**
   * Retry operation with exponential backoff
   */
  private async retryOperation(error: MedicalError, config: ErrorRecoveryConfig): Promise<unknown> {
    if (!error.retryable || (config.maxRetries ?? 0) <= 0) {
      throw error;
    }

    const delay = config.retryDelay ?? 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // This would need to be implemented by the calling code
    // as we don't have access to the original operation here
    throw new Error('Retry operation must be implemented by caller');
  }

  /**
   * Log error for monitoring
   */
  private logError(error: MedicalError): void {
    const errorEntry = error.toJSON();

    this.errorLog.unshift(errorEntry);

    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Log to console for debugging
    console.error('Medical Error:', errorEntry);

    // Here you could also send to external logging service
    // this.sendToLoggingService(errorEntry);
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<MedicalErrorType, number>;
    recentErrors: MedicalServiceError[];
  } {
    const errorsByType = this.errorLog.reduce(
      (acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1;
        return acc;
      },
      {} as Record<MedicalErrorType, number>
    );

    return {
      totalErrors: this.errorLog.length,
      errorsByType,
      recentErrors: this.errorLog.slice(0, 10),
    };
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    this.errorLog = [];
  }
}

/**
 * Utility functions for error handling
 */
export const errorUtils = {
  /**
   * Check if error is retryable
   */
  isRetryable: (error: Error | MedicalError): boolean => {
    if (error instanceof MedicalError) {
      return error.retryable;
    }

    // Network errors are generally retryable
    return error.message.includes('fetch') || error.message.includes('network') || error.message.includes('timeout');
  },

  /**
   * Get user-friendly error message
   */
  getUserMessage: (error: Error | MedicalError): string => {
    if (error instanceof MedicalError) {
      return error.userMessage;
    }

    return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.';
  },

  /**
   * Create error ID for tracking
   */
  createErrorId: (): string => {
    return `med_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};

/**
 * Global error handler instance
 */
export const medicalErrorHandler = MedicalErrorHandler.getInstance();
