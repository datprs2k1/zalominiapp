/**
 * Query builder utilities for URL construction and parameter handling
 */

export interface QueryParams {
  [key: string]: string | number | boolean | string[] | number[] | undefined | null;
}

export interface UrlBuilderOptions {
  baseUrl?: string;
  endpoint?: string;
  params?: QueryParams;
  encodeParams?: boolean;
  arrayFormat?: 'brackets' | 'comma' | 'repeat';
}

export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array';
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: (string | number)[];
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
  sanitized: QueryParams;
}

/**
 * Query parameter utilities
 */
export class QueryBuilder {
  /**
   * Build query string from parameters
   */
  static buildQueryString(
    params: QueryParams,
    options: { encodeParams?: boolean; arrayFormat?: 'brackets' | 'comma' | 'repeat' } = {}
  ): string {
    const { encodeParams = true, arrayFormat = 'brackets' } = options;
    
    const queryParts: string[] = [];

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      const encodedKey = encodeParams ? encodeURIComponent(key) : key;

      if (Array.isArray(value)) {
        this.handleArrayParam(queryParts, encodedKey, value, arrayFormat, encodeParams);
      } else {
        const encodedValue = encodeParams ? encodeURIComponent(String(value)) : String(value);
        queryParts.push(`${encodedKey}=${encodedValue}`);
      }
    });

    return queryParts.join('&');
  }

  /**
   * Parse query string into parameters object
   */
  static parseQueryString(queryString: string): QueryParams {
    const params: QueryParams = {};
    
    if (!queryString) return params;

    // Remove leading '?' if present
    const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    
    cleanQuery.split('&').forEach(pair => {
      const [key, value] = pair.split('=').map(decodeURIComponent);
      
      if (key) {
        // Handle array parameters (key[] format)
        if (key.endsWith('[]')) {
          const arrayKey = key.slice(0, -2);
          if (!params[arrayKey]) {
            params[arrayKey] = [];
          }
          (params[arrayKey] as string[]).push(value || '');
        } else {
          params[key] = value || '';
        }
      }
    });

    return params;
  }

  /**
   * Build complete URL with query parameters
   */
  static buildUrl(options: UrlBuilderOptions): string {
    const { baseUrl = '', endpoint = '', params = {} } = options;
    
    let url = baseUrl;
    
    if (endpoint) {
      // Ensure proper path joining
      const separator = url.endsWith('/') || endpoint.startsWith('/') ? '' : '/';
      url = `${url}${separator}${endpoint}`;
    }

    const queryString = this.buildQueryString(params, options);
    
    if (queryString) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}${queryString}`;
    }

    return url;
  }

  /**
   * Validate query parameters against schema
   */
  static validateParams(params: QueryParams, schema: ValidationSchema): ValidationResult {
    const errors: { [key: string]: string } = {};
    const sanitized: QueryParams = {};

    // Check required fields
    Object.entries(schema).forEach(([key, rule]) => {
      const value = params[key];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors[key] = `${key} is required`;
        return;
      }

      if (value === undefined || value === null) {
        return;
      }

      // Type validation
      if (rule.type) {
        const typeError = this.validateType(key, value, rule.type);
        if (typeError) {
          errors[key] = typeError;
          return;
        }
      }

      // Range validation for numbers
      if (rule.type === 'number' && typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors[key] = `${key} must be at least ${rule.min}`;
          return;
        }
        if (rule.max !== undefined && value > rule.max) {
          errors[key] = `${key} must be at most ${rule.max}`;
          return;
        }
      }

      // String length validation
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.min !== undefined && value.length < rule.min) {
          errors[key] = `${key} must be at least ${rule.min} characters`;
          return;
        }
        if (rule.max !== undefined && value.length > rule.max) {
          errors[key] = `${key} must be at most ${rule.max} characters`;
          return;
        }
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string') {
        if (!rule.pattern.test(value)) {
          errors[key] = `${key} format is invalid`;
          return;
        }
      }

      // Enum validation
      if (rule.enum && !rule.enum.includes(value as string | number)) {
        errors[key] = `${key} must be one of: ${rule.enum.join(', ')}`;
        return;
      }

      // Custom validation
      if (rule.custom) {
        const customResult = rule.custom(value);
        if (customResult !== true) {
          errors[key] = typeof customResult === 'string' ? customResult : `${key} is invalid`;
          return;
        }
      }

      // If validation passes, add to sanitized params
      sanitized[key] = value;
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * Sanitize parameters by removing undefined/null values and trimming strings
   */
  static sanitizeParams(params: QueryParams): QueryParams {
    const sanitized: QueryParams = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed) {
          sanitized[key] = trimmed;
        }
      } else if (Array.isArray(value)) {
        const filtered = value.filter(item => item !== undefined && item !== null);
        if (filtered.length > 0) {
          sanitized[key] = filtered;
        }
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  /**
   * Merge multiple parameter objects
   */
  static mergeParams(...paramObjects: QueryParams[]): QueryParams {
    return paramObjects.reduce((merged, params) => {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          merged[key] = value;
        }
      });
      return merged;
    }, {});
  }

  private static handleArrayParam(
    queryParts: string[],
    key: string,
    value: (string | number)[],
    format: 'brackets' | 'comma' | 'repeat',
    encodeParams: boolean
  ): void {
    if (value.length === 0) return;

    switch (format) {
      case 'brackets':
        value.forEach(item => {
          const encodedValue = encodeParams ? encodeURIComponent(String(item)) : String(item);
          queryParts.push(`${key}[]=${encodedValue}`);
        });
        break;
      
      case 'comma':
        const commaValues = value.map(item => 
          encodeParams ? encodeURIComponent(String(item)) : String(item)
        ).join(',');
        queryParts.push(`${key}=${commaValues}`);
        break;
      
      case 'repeat':
        value.forEach(item => {
          const encodedValue = encodeParams ? encodeURIComponent(String(item)) : String(item);
          queryParts.push(`${key}=${encodedValue}`);
        });
        break;
    }
  }

  private static validateType(key: string, value: any, expectedType: string): string | null {
    switch (expectedType) {
      case 'string':
        if (typeof value !== 'string') {
          return `${key} must be a string`;
        }
        break;
      
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return `${key} must be a number`;
        }
        break;
      
      case 'boolean':
        if (typeof value !== 'boolean') {
          return `${key} must be a boolean`;
        }
        break;
      
      case 'array':
        if (!Array.isArray(value)) {
          return `${key} must be an array`;
        }
        break;
      
      default:
        return null;
    }
    
    return null;
  }
}

/**
 * WordPress-specific query parameter schemas
 */
export const WordPressSchemas = {
  posts: {
    per_page: { type: 'number' as const, min: 1, max: 100 },
    page: { type: 'number' as const, min: 1 },
    search: { type: 'string' as const, min: 1 },
    author: { type: 'number' as const, min: 1 },
    categories: { type: 'array' as const },
    tags: { type: 'array' as const },
    status: { type: 'string' as const, enum: ['publish', 'draft', 'private'] },
    orderby: { type: 'string' as const, enum: ['date', 'title', 'menu_order', 'id'] },
    order: { type: 'string' as const, enum: ['asc', 'desc'] },
    _embed: { type: 'string' as const },
  },
  
  pages: {
    per_page: { type: 'number' as const, min: 1, max: 100 },
    page: { type: 'number' as const, min: 1 },
    parent: { type: 'number' as const, min: 0 },
    search: { type: 'string' as const, min: 1 },
    status: { type: 'string' as const, enum: ['publish', 'draft', 'private'] },
    orderby: { type: 'string' as const, enum: ['date', 'title', 'menu_order', 'id'] },
    order: { type: 'string' as const, enum: ['asc', 'desc'] },
    _embed: { type: 'string' as const },
  },
} as const;

/**
 * Convenience functions for common operations
 */
export const QueryUtils = {
  /**
   * Build WordPress API URL
   */
  buildWPUrl: (baseUrl: string, endpoint: string, params?: QueryParams): string => {
    return QueryBuilder.buildUrl({
      baseUrl,
      endpoint: `wp-json/wp/v2/${endpoint}`,
      params: QueryBuilder.sanitizeParams(params || {}),
    });
  },

  /**
   * Validate WordPress parameters
   */
  validateWPParams: (endpoint: string, params: QueryParams): ValidationResult => {
    const schema = WordPressSchemas[endpoint as keyof typeof WordPressSchemas];
    if (!schema) {
      return { isValid: true, errors: {}, sanitized: params };
    }
    return QueryBuilder.validateParams(params, schema);
  },
};
