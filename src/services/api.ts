/**
 * Enhanced API Service for Medical Application
 * Provides robust HTTP client with medical-context error handling and logging
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_URL } from '@/config';
import { MedicalAPIError } from './cache';

// Add metadata to axios request config
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
      requestId: string;
      priority: 'high' | 'medium' | 'low';
    };
  }
}

/**
 * API request configuration interface
 */
export interface APIRequestConfig extends AxiosRequestConfig {
  readonly retries?: number;
  readonly retryDelay?: number;
  readonly skipErrorLogging?: boolean;
  readonly medicalContext?: string; // For contextual error messages
  readonly priority?: 'high' | 'medium' | 'low'; // Request priority
  readonly cacheTTL?: number; // Override default cache TTL
}

/**
 * API response metadata interface
 */
export interface APIResponseMetadata {
  readonly requestId?: string;
  readonly timestamp: number;
  readonly duration: number;
  readonly cached: boolean;
  readonly retryCount: number;
  readonly compressedSize?: number;
  readonly originalSize?: number;
}

/**
 * Enhanced API response interface
 */
export interface EnhancedAPIResponse<T = unknown> {
  readonly data: T;
  readonly metadata: APIResponseMetadata;
  readonly headers: Record<string, string>;
  readonly status: number;
}

/**
 * Medical API Logger
 */
class MedicalAPILogger {
  private static instance: MedicalAPILogger;
  private logs: Array<{
    timestamp: number;
    level: 'info' | 'warn' | 'error';
    message: string;
    context?: Record<string, unknown>;
  }> = [];
  private slowRequestThreshold = 1000; // 1 second

  static getInstance(): MedicalAPILogger {
    if (!MedicalAPILogger.instance) {
      MedicalAPILogger.instance = new MedicalAPILogger();
    }
    return MedicalAPILogger.instance;
  }

  private log(level: 'info' | 'warn' | 'error', message: string, context?: Record<string, unknown>): void {
    const logEntry = {
      timestamp: Date.now(),
      level,
      message,
      context,
    };

    this.logs.push(logEntry);

    // Keep only last 1000 logs to prevent memory issues
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  logSlowRequest(url: string, duration: number, context?: Record<string, unknown>): void {
    if (duration > this.slowRequestThreshold) {
      this.warn(`Slow API request: ${url} took ${duration.toFixed(2)}ms`, {
        ...context,
        duration,
        threshold: this.slowRequestThreshold,
      });
    }
  }

  getLogs(level?: 'info' | 'warn' | 'error', limit: number = 100): typeof this.logs {
    const filteredLogs = level ? this.logs.filter((log) => log.level === level) : this.logs;
    return filteredLogs.slice(-limit);
  }

  clearLogs(): void {
    this.logs = [];
  }

  getSlowRequestsCount(): number {
    return this.logs.filter((log) => log.level === 'warn' && log.message.startsWith('Slow API request')).length;
  }

  setSlowRequestThreshold(threshold: number): void {
    this.slowRequestThreshold = threshold;
  }
}

// Interface for queued requests
interface QueuedRequest {
  task: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  url: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

// Enhanced request queue with connection pooling and intelligent batching
class EnhancedRequestQueue {
  private highPriority: Array<QueuedRequest> = [];
  private mediumPriority: Array<QueuedRequest> = [];
  private lowPriority: Array<QueuedRequest> = [];
  private maxConcurrent = 8; // Optimized for HTTP/2 multiplexing
  private activeRequests = 0;
  private isProcessing = false;
  private connectionPool = new Map<string, number>(); // Track connections per domain
  private batchingEnabled = true;
  private batchDelay = 5; // ms - reduced for faster batching
  private pendingBatch: QueuedRequest[] = [];
  private batchTimer: ReturnType<typeof setTimeout> | null = null;

  enqueue(
    priority: 'high' | 'medium' | 'low' = 'medium',
    task: () => Promise<any>,
    url: string = '',
    maxRetries: number = 3
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const request: QueuedRequest = {
        task,
        resolve,
        reject,
        url,
        priority,
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries,
      };

      // Add to appropriate priority queue
      switch (priority) {
        case 'high':
          this.highPriority.push(request);
          break;
        case 'low':
          this.lowPriority.push(request);
          break;
        default:
          this.mediumPriority.push(request);
          break;
      }

      // Process immediately for high priority or if batching is disabled
      if (priority === 'high' || !this.batchingEnabled) {
        this.processQueue();
      } else {
        this.scheduleBatch();
      }
    });
  }

  private scheduleBatch(): void {
    if (this.batchTimer) return;

    this.batchTimer = setTimeout(() => {
      this.batchTimer = null;
      this.processQueue();
    }, this.batchDelay);
  }

  private processQueue(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;

    // Use requestIdleCallback for better performance
    const processRequests = () => {
      while (this.activeRequests < this.maxConcurrent && this.hasRequests()) {
        const request = this.getNextRequest();
        if (request) {
          this.executeRequest(request);
        }
      }
      this.isProcessing = false;
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(processRequests, { timeout: 100 });
    } else {
      setTimeout(processRequests, 0);
    }
  }

  private hasRequests(): boolean {
    return this.highPriority.length > 0 || this.mediumPriority.length > 0 || this.lowPriority.length > 0;
  }

  private getNextRequest(): QueuedRequest | undefined {
    // Prioritize high priority requests
    if (this.highPriority.length > 0) {
      return this.highPriority.shift();
    }

    // Check connection limits for medium/low priority
    const mediumRequest = this.mediumPriority[0];
    const lowRequest = this.lowPriority[0];

    if (mediumRequest && this.canExecuteRequest(mediumRequest.url)) {
      return this.mediumPriority.shift();
    }

    if (lowRequest && this.canExecuteRequest(lowRequest.url)) {
      return this.lowPriority.shift();
    }

    return undefined;
  }

  private canExecuteRequest(url: string): boolean {
    const domain = this.extractDomain(url);
    const currentConnections = this.connectionPool.get(domain) || 0;
    return currentConnections < 4; // Max 4 connections per domain
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'default';
    }
  }

  private async executeRequest(request: QueuedRequest): Promise<void> {
    this.activeRequests++;
    const domain = this.extractDomain(request.url);
    this.connectionPool.set(domain, (this.connectionPool.get(domain) || 0) + 1);

    try {
      const result = await request.task();
      request.resolve(result);
    } catch (error) {
      if (request.retryCount < request.maxRetries) {
        request.retryCount++;
        // Exponential backoff for retries
        const delay = Math.min(1000 * Math.pow(2, request.retryCount), 5000);
        setTimeout(() => {
          this.enqueue(request.priority, request.task, request.url, request.maxRetries);
        }, delay);
      } else {
        request.reject(error);
      }
    } finally {
      this.activeRequests--;
      this.connectionPool.set(domain, Math.max(0, (this.connectionPool.get(domain) || 0) - 1));

      // Continue processing queue
      if (this.hasRequests()) {
        this.processQueue();
      }
    }
  }

  // Get queue statistics for monitoring
  getStats() {
    const connectionPoolObj: Record<string, number> = {};
    this.connectionPool.forEach((value, key) => {
      connectionPoolObj[key] = value;
    });

    return {
      activeRequests: this.activeRequests,
      queuedRequests: this.highPriority.length + this.mediumPriority.length + this.lowPriority.length,
      connectionPool: connectionPoolObj,
      maxConcurrent: this.maxConcurrent,
    };
  }

  // Adjust concurrency based on network conditions
  adjustConcurrency(newLimit: number): void {
    this.maxConcurrent = Math.max(1, Math.min(newLimit, 12));
  }
}

const logger = MedicalAPILogger.getInstance();
const requestQueue = new EnhancedRequestQueue();

/**
 * Enhanced Axios instance with medical-specific configurations
 */
const createMedicalAPI = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Note: Accept-Encoding is automatically handled by the browser
      // Setting it manually causes "Refused to set unsafe header" error
    },
    // Enable HTTP/2 features when available
    httpAgent: undefined, // Let Axios use the default agent with HTTP/2 support if available
    decompress: true, // Auto-decompress responses
  });

  // Request interceptor for logging and request enhancement
  instance.interceptors.request.use(
    (config) => {
      const startTime = Date.now();

      // Add request metadata
      config.metadata = {
        startTime,
        requestId: `req_${startTime}_${Math.random().toString(36).substring(2, 11)}`,
        priority: (config as APIRequestConfig).priority || 'medium',
      };

      // Optimize fields for WordPress API
      if (config.url?.includes('/wp-json/wp/v2/')) {
        // Add _fields parameter if not present to reduce response size
        if (config.url.includes('?') && !config.url.includes('_fields=')) {
          config.url += '&_fields=id,title,content,excerpt,date,modified';
        } else if (!config.url.includes('?')) {
          config.url += '?_fields=id,title,content,excerpt,date,modified';
        }

        // Only remove _embed if it's explicitly set to false or empty
        // Don't remove if _embed parameter exists in URL (it means it was intentionally added)
        if (config.params?._embed === false || config.params?._embed === '') {
          config.url = config.url.replace(/_embed=[^&]*(&|$)/, '');
          if (config.url.endsWith('&')) {
            config.url = config.url.slice(0, -1);
          }
        }
      }

      // Log request in development
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          requestId: config.metadata.requestId,
          params: config.params,
          priority: config.metadata.priority,
        });
      }

      return config;
    },
    (error) => {
      logger.error('Request interceptor error', { error: error.message });
      return Promise.reject(error);
    }
  );

  // Response interceptor for data extraction and error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const endTime = Date.now();
      const startTime = response.config.metadata?.startTime || endTime;
      const duration = endTime - startTime;
      const requestId = response.config.metadata?.requestId;

      // Log slow requests
      logger.logSlowRequest(response.config.url || '', duration, {
        requestId,
        status: response.status,
      });

      // Log successful response
      logger.info(`API Response: ${response.status} ${response.config.url}`, {
        requestId,
        duration,
        status: response.status,
        dataSize: JSON.stringify(response.data).length,
      });

      // Get response size information
      const compressedSize = parseInt(response.headers['content-length'] || '0', 10);
      const originalSize = JSON.stringify(response.data).length;

      // Return enhanced response with metadata
      const enhancedResponse: EnhancedAPIResponse = {
        data: response.data,
        metadata: {
          requestId,
          timestamp: endTime,
          duration,
          cached: false,
          retryCount: 0,
          compressedSize,
          originalSize,
        },
        headers: response.headers as Record<string, string>,
        status: response.status,
      };

      // For backward compatibility, return just the data
      // but attach metadata for advanced usage
      const result = response.data;
      if (result && typeof result === 'object') {
        Object.defineProperty(result, '__metadata', {
          value: enhancedResponse.metadata,
          enumerable: false,
          writable: false,
        });
      }

      return result;
    },
    (error: AxiosError) => {
      const endTime = Date.now();
      const startTime = error.config?.metadata?.startTime || endTime;
      const duration = endTime - startTime;
      const requestId = error.config?.metadata?.requestId;

      // Create medical-specific error
      let medicalError: MedicalAPIError;

      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const responseData = error.response.data as any;

        let errorCode = 'SERVER_ERROR';
        let userMessage = 'Hệ thống y tế đang gặp sự cố';

        // Map HTTP status codes to medical-friendly messages
        switch (status) {
          case 400:
            errorCode = 'BAD_REQUEST';
            userMessage = 'Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin.';
            break;
          case 401:
            errorCode = 'UNAUTHORIZED';
            userMessage = 'Bạn cần đăng nhập để truy cập thông tin này.';
            break;
          case 403:
            errorCode = 'FORBIDDEN';
            userMessage = 'Bạn không có quyền truy cập thông tin này.';
            break;
          case 404:
            errorCode = 'NOT_FOUND';
            userMessage = 'Không tìm thấy thông tin y tế được yêu cầu.';
            break;
          case 429:
            errorCode = 'RATE_LIMITED';
            userMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorCode = 'SERVER_ERROR';
            userMessage = 'Hệ thống y tế đang bảo trì. Vui lòng thử lại sau.';
            break;
        }

        medicalError = new MedicalAPIError(
          responseData?.message || error.message || 'API request failed',
          errorCode,
          status,
          error.config?.url,
          userMessage
        );

        // Log error with context
        logger.error(`API Error: ${status} ${error.config?.url}`, {
          requestId,
          duration,
          status,
          errorCode,
          responseData,
          userMessage,
        });
      } else if (error.request) {
        // Network error
        medicalError = new MedicalAPIError(
          'Network error occurred',
          'NETWORK_ERROR',
          undefined,
          error.config?.url,
          'Không thể kết nối đến hệ thống y tế. Vui lòng kiểm tra kết nối mạng.'
        );

        logger.error(`Network Error: ${error.config?.url}`, {
          requestId,
          duration,
          message: error.message,
        });
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        medicalError = new MedicalAPIError(
          'Request timeout',
          'TIMEOUT_ERROR',
          undefined,
          error.config?.url,
          'Hết thời gian chờ kết nối. Vui lòng thử lại.'
        );

        logger.error(`Timeout Error: ${error.config?.url}`, {
          requestId,
          duration,
          timeout: error.config?.timeout,
        });
      } else {
        // Unknown error
        medicalError = new MedicalAPIError(
          error.message || 'Unknown error occurred',
          'UNKNOWN_ERROR',
          undefined,
          error.config?.url,
          'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ.'
        );

        logger.error(`Unknown Error: ${error.config?.url}`, {
          requestId,
          duration,
          message: error.message,
          stack: error.stack,
        });
      }

      return Promise.reject(medicalError);
    }
  );

  return instance;
};

// Create the main API instance
const api = createMedicalAPI();

/**
 * Enhanced API request function with prioritization and queue management
 */
const enhancedRequest = <T = any>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  config?: APIRequestConfig
): Promise<T> => {
  const priority = config?.priority || 'medium';
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

  return requestQueue.enqueue(priority, () => api[method](url, config) as Promise<any>, fullUrl, config?.retries || 3);
};

/**
 * API health check function
 */
export const checkAPIHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  timestamp: number;
  slowRequests?: number;
}> => {
  const startTime = Date.now();

  try {
    await api.get('/wp-json/wp/v2/', { timeout: 5000 });
    const responseTime = Date.now() - startTime;
    const slowRequests = logger.getSlowRequestsCount();

    logger.info('API Health Check: Healthy', { responseTime, slowRequests });

    return {
      status: 'healthy',
      responseTime,
      timestamp: Date.now(),
      slowRequests,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    logger.error('API Health Check: Unhealthy', {
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      status: 'unhealthy',
      responseTime,
      timestamp: Date.now(),
    };
  }
};

/**
 * Get API logs for debugging
 */
export const getAPILogs = (level?: 'info' | 'warn' | 'error', limit?: number) => {
  return logger.getLogs(level, limit);
};

/**
 * Clear API logs
 */
export const clearAPILogs = () => {
  logger.clearLogs();
};

/**
 * Set slow request threshold for performance monitoring
 */
export const setSlowRequestThreshold = (thresholdMs: number) => {
  logger.setSlowRequestThreshold(thresholdMs);
};

export default api;
export { logger as apiLogger, MedicalAPILogger, enhancedRequest };
