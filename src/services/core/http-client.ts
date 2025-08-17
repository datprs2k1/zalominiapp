/**
 * Enhanced HTTP client with retry logic, interceptors, and advanced features
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface RetryConfig {
  attempts?: number;
  delay?: number;
  backoffFactor?: number;
  retryCondition?: (error: AxiosError) => boolean;
}

export interface HttpClientConfig extends AxiosRequestConfig {
  retry?: RetryConfig;
  deduplication?: boolean;
  requestId?: string;
}

export interface RequestInterceptor {
  onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRejected?: (error: any) => any;
}

export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: AxiosError) => any;
}

export interface HttpClientStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  retriedRequests: number;
  deduplicatedRequests: number;
  averageResponseTime: number;
}

/**
 * Enhanced HTTP client class
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;
  private pendingRequests = new Map<string, Promise<AxiosResponse>>();
  private stats: HttpClientStats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    retriedRequests: 0,
    deduplicatedRequests: 0,
    averageResponseTime: 0,
  };
  private responseTimes: number[] = [];

  constructor(config: HttpClientConfig = {}) {
    this.axiosInstance = axios.create(config);
    this.setupDefaultInterceptors();
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): number {
    return this.axiosInstance.interceptors.request.use(
      interceptor.onFulfilled,
      interceptor.onRejected
    );
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): number {
    return this.axiosInstance.interceptors.response.use(
      interceptor.onFulfilled,
      interceptor.onRejected
    );
  }

  /**
   * Remove interceptor
   */
  removeInterceptor(type: 'request' | 'response', id: number): void {
    if (type === 'request') {
      this.axiosInstance.interceptors.request.eject(id);
    } else {
      this.axiosInstance.interceptors.response.eject(id);
    }
  }

  /**
   * Make HTTP request with enhanced features
   */
  async request<T = any>(config: HttpClientConfig): Promise<AxiosResponse<T>> {
    const startTime = Date.now();
    this.stats.totalRequests++;

    try {
      // Handle request deduplication
      if (config.deduplication !== false) {
        const requestKey = this.generateRequestKey(config);
        const existingRequest = this.pendingRequests.get(requestKey);
        
        if (existingRequest) {
          this.stats.deduplicatedRequests++;
          return existingRequest as Promise<AxiosResponse<T>>;
        }

        const requestPromise = this.executeRequest<T>(config);
        this.pendingRequests.set(requestKey, requestPromise);
        
        try {
          const response = await requestPromise;
          return response;
        } finally {
          this.pendingRequests.delete(requestKey);
        }
      }

      return await this.executeRequest<T>(config);
    } catch (error) {
      this.stats.failedRequests++;
      throw error;
    } finally {
      const responseTime = Date.now() - startTime;
      this.updateResponseTimeStats(responseTime);
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: HttpClientConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: HttpClientConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: HttpClientConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: HttpClientConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: HttpClientConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  /**
   * Get client statistics
   */
  getStats(): HttpClientStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      retriedRequests: 0,
      deduplicatedRequests: 0,
      averageResponseTime: 0,
    };
    this.responseTimes = [];
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.pendingRequests.clear();
  }

  private async executeRequest<T>(config: HttpClientConfig): Promise<AxiosResponse<T>> {
    const retryConfig = config.retry || {};
    const maxAttempts = retryConfig.attempts || 3;
    const baseDelay = retryConfig.delay || 1000;
    const backoffFactor = retryConfig.backoffFactor || 2;
    const retryCondition = retryConfig.retryCondition || this.defaultRetryCondition;

    let lastError: AxiosError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.axiosInstance.request<T>(config);
        this.stats.successfulRequests++;
        return response;
      } catch (error) {
        lastError = error as AxiosError;

        // Don't retry if it's the last attempt or retry condition is not met
        if (attempt === maxAttempts || !retryCondition(lastError)) {
          throw lastError;
        }

        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(backoffFactor, attempt - 1);
        await this.sleep(delay);
        
        this.stats.retriedRequests++;
      }
    }

    throw lastError!;
  }

  private generateRequestKey(config: HttpClientConfig): string {
    if (config.requestId) {
      return config.requestId;
    }

    const { method = 'GET', url = '', params, data } = config;
    const paramsStr = params ? JSON.stringify(params) : '';
    const dataStr = data ? JSON.stringify(data) : '';
    
    return `${method}:${url}:${paramsStr}:${dataStr}`;
  }

  private defaultRetryCondition(error: AxiosError): boolean {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private updateResponseTimeStats(responseTime: number): void {
    this.responseTimes.push(responseTime);
    
    // Keep only last 100 response times for average calculation
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }

    this.stats.averageResponseTime = 
      this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
  }

  private setupDefaultInterceptors(): void {
    // Request interceptor for logging and timing
    this.axiosInstance.interceptors.request.use(
      (config) => {
        config.metadata = { startTime: Date.now() };
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for logging and error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const endTime = Date.now();
        const startTime = response.config.metadata?.startTime || endTime;
        const duration = endTime - startTime;
        
        console.debug(`HTTP ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
        
        return response;
      },
      (error) => {
        if (error.response) {
          console.error(`HTTP Error ${error.response.status}: ${error.response.statusText}`, {
            url: error.config?.url,
            method: error.config?.method,
            data: error.response.data,
          });
        } else if (error.request) {
          console.error('Network Error:', error.message);
        } else {
          console.error('Request Error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }
}

/**
 * Create HTTP client instance
 */
export function createHttpClient(config?: HttpClientConfig): HttpClient {
  return new HttpClient(config);
}

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}
