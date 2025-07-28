# API and Services Guide

This document provides documentation for the API services in the Zalo Healthcare application, explaining their purpose, implementation details, and usage patterns.

## Table of Contents

- [Overview](#overview)
- [API Service](#api-service)
- [Doctors Service](#doctors-service)
- [Departments Service](#departments-service)
- [Services API](#services-api)
- [Posts Service](#posts-service)
- [Search Service](#search-service)
- [Cache Service](#cache-service)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Overview

The application's services layer abstracts API calls and data processing, providing a clean interface for components to fetch and manipulate data. Services are organized by domain and follow a consistent pattern of error handling, data transformation, and caching.

## API Service

The base API service provides common HTTP request functionality used by other service modules.

**File Location:** `src/services/api.ts`

### Key Functions

```typescript
// Base API configuration
export const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => handleApiError(error)
);

// Generic GET function with error handling
export const get = async <T>(url: string, params?: any): Promise<T> => {
  try {
    const response = await api.get<T>(url, { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Additional HTTP methods: post, put, delete, etc.
```

### Usage

```typescript
import { get, post } from '@/services/api';

// In a service file
export const getDoctors = async (params) => {
  return await get('/doctors', params);
};

export const createAppointment = async (data) => {
  return await post('/appointments', data);
};
```

## Doctors Service

Service for fetching and managing doctor data.

**File Location:** `src/services/doctors.ts`

### Key Functions

```typescript
// Get all doctors with optional filtering
export const getDoctors = async (params?: DoctorSearchParams): Promise<Doctor[]> => {
  const cachedData = await cacheService.get('doctors', JSON.stringify(params));

  if (cachedData) {
    return cachedData as Doctor[];
  }

  const data = await api.get<ApiResponse<Doctor[]>>('/doctors', { params });
  const doctors = transformDoctors(data.results);

  await cacheService.set('doctors', JSON.stringify(params), doctors);

  return doctors;
};

// Get a single doctor by ID
export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  const cachedData = await cacheService.get('doctor', id);

  if (cachedData) {
    return cachedData as Doctor;
  }

  const data = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
  const doctor = transformDoctor(data.result);

  await cacheService.set('doctor', id, doctor);

  return doctor;
};

// Get doctor availability
export const getDoctorAvailability = async (
  doctorId: string,
  startDate: string,
  endDate: string
): Promise<Availability[]> => {
  const data = await api.get<ApiResponse<Availability[]>>(`/doctors/${doctorId}/availability`, {
    params: { startDate, endDate },
  });

  return data.results;
};
```

### Data Types

```typescript
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  bio: string;
  rating: number;
  reviewCount: number;
  education: string[];
  experience: string[];
  languages: string[];
}

export interface DoctorSearchParams {
  specialty?: string;
  name?: string;
  rating?: number;
  serviceId?: string;
  departmentId?: string;
  page?: number;
  limit?: number;
}

export interface Availability {
  date: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}
```

### Usage

```typescript
import { getDoctors, getDoctorById } from '@/services/doctors';

// In a component
const loadDoctors = async () => {
  const doctors = await getDoctors({
    specialty: 'Cardiology',
    page: 1,
    limit: 10,
  });
  setDoctors(doctors);
};

const loadDoctorDetails = async (id) => {
  const doctor = await getDoctorById(id);
  setDoctor(doctor);
};
```

## Departments Service

Service for fetching and managing medical department data.

**File Location:** `src/services/departments.ts`

### Key Functions

```typescript
// Get all departments
export const getDepartments = async (): Promise<Department[]> => {
  const cachedData = await cacheService.get('departments', 'all');

  if (cachedData) {
    return cachedData as Department[];
  }

  const data = await api.get<ApiResponse<Department[]>>('/departments');
  const departments = transformDepartments(data.results);

  await cacheService.set('departments', 'all', departments);

  return departments;
};

// Get a single department by ID
export const getDepartmentById = async (id: string): Promise<Department | null> => {
  const cachedData = await cacheService.get('department', id);

  if (cachedData) {
    return cachedData as Department;
  }

  const data = await api.get<ApiResponse<Department>>(`/departments/${id}`);
  const department = transformDepartment(data.result);

  await cacheService.set('department', id, department);

  return department;
};

// Get doctors in a department
export const getDoctorsByDepartment = async (departmentId: string): Promise<Doctor[]> => {
  const data = await api.get<ApiResponse<Doctor[]>>(`/departments/${departmentId}/doctors`);
  return transformDoctors(data.results);
};
```

### Data Types

```typescript
export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  serviceCount: number;
  doctorCount: number;
}
```

### Usage

```typescript
import { getDepartments, getDepartmentById } from '@/services/departments';

// In a component
const loadDepartments = async () => {
  const departments = await getDepartments();
  setDepartments(departments);
};

const loadDepartmentDetails = async (id) => {
  const department = await getDepartmentById(id);
  setDepartment(department);
};
```

## Services API

Service for fetching and managing medical services data.

**File Location:** `src/services/services.ts`

### Key Functions

```typescript
// Get all services with optional filtering
export const getServices = async (params?: ServiceSearchParams): Promise<Service[]> => {
  const cachedData = await cacheService.get('services', JSON.stringify(params));

  if (cachedData) {
    return cachedData as Service[];
  }

  const data = await api.get<ApiResponse<Service[]>>('/services', { params });
  const services = transformServices(data.results);

  await cacheService.set('services', JSON.stringify(params), services);

  return services;
};

// Get a single service by ID
export const getServiceById = async (id: string): Promise<Service | null> => {
  const cachedData = await cacheService.get('service', id);

  if (cachedData) {
    return cachedData as Service;
  }

  const data = await api.get<ApiResponse<Service>>(`/services/${id}`);
  const service = transformService(data.result);

  await cacheService.set('service', id, service);

  return service;
};

// Get services by department ID
export const getServicesByDepartment = async (departmentId: string): Promise<Service[]> => {
  const data = await api.get<ApiResponse<Service[]>>(`/departments/${departmentId}/services`);
  return transformServices(data.results);
};
```

### Data Types

```typescript
export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: {
    amount: number;
    currency: string;
  };
  duration: number;
  departmentId: string;
}

export interface ServiceSearchParams {
  name?: string;
  departmentId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}
```

### Usage

```typescript
import { getServices, getServiceById } from '@/services/services';

// In a component
const loadServices = async () => {
  const services = await getServices({
    departmentId: selectedDepartment,
    page: 1,
    limit: 10,
  });
  setServices(services);
};

const loadServiceDetails = async (id) => {
  const service = await getServiceById(id);
  setService(service);
};
```

## Posts Service

Service for fetching and managing health news and articles.

**File Location:** `src/services/posts.ts`

### Key Functions

```typescript
// Get all posts with optional filtering
export const getPosts = async (params?: PostsSearchParams): Promise<Post[]> => {
  const cachedData = await cacheService.get('posts', JSON.stringify(params));

  if (cachedData) {
    return cachedData as Post[];
  }

  const data = await api.get<ApiResponse<WPPost[]>>('/posts', { params });
  const posts = data.results.map(transformPost);

  await cacheService.set('posts', JSON.stringify(params), posts);

  return posts;
};

// Get a single post by ID
export const getPostById = async (id: string): Promise<Post | null> => {
  const cachedData = await cacheService.get('post', id);

  if (cachedData) {
    return cachedData as Post;
  }

  const data = await api.get<ApiResponse<WPPost>>(`/posts/${id}`);
  const post = transformPost(data.result);

  await cacheService.set('post', id, post);

  return post;
};
```

### Data Types

```typescript
import { WPPost } from './wp-types';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: string;
  author: {
    name: string;
    avatar: string;
  };
  categories: string[];
}

export interface PostsSearchParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}
```

### Usage

```typescript
import { getPosts, getPostById } from '@/services/posts';

// In a component
const loadPosts = async () => {
  const posts = await getPosts({
    category: 'health-tips',
    page: 1,
    limit: 10,
  });
  setPosts(posts);
};

const loadPostDetails = async (id) => {
  const post = await getPostById(id);
  setPost(post);
};
```

## Search Service

Service for searching across different data types in the application.

**File Location:** `src/services/search.ts`

### Key Functions

```typescript
// Global search across multiple entity types
export const globalSearch = async (query: string): Promise<SearchResults> => {
  const data = await api.get<ApiResponse<SearchResults>>('/search', { params: { query } });

  return {
    doctors: data.results.doctors.map(transformDoctor),
    departments: data.results.departments.map(transformDepartment),
    services: data.results.services.map(transformService),
    posts: data.results.posts.map(transformPost),
  };
};

// Type-specific search functions
export const searchDoctors = async (query: string): Promise<Doctor[]> => {
  const data = await api.get<ApiResponse<Doctor[]>>('/search/doctors', { params: { query } });
  return data.results.map(transformDoctor);
};

export const searchDepartments = async (query: string): Promise<Department[]> => {
  const data = await api.get<ApiResponse<Department[]>>('/search/departments', { params: { query } });
  return data.results.map(transformDepartment);
};

export const searchServices = async (query: string): Promise<Service[]> => {
  const data = await api.get<ApiResponse<Service[]>>('/search/services', { params: { query } });
  return data.results.map(transformService);
};
```

### Data Types

```typescript
export interface SearchResults {
  doctors: Doctor[];
  departments: Department[];
  services: Service[];
  posts: Post[];
}
```

### Usage

```typescript
import { globalSearch, searchDoctors } from '@/services/search';

// In a search component
const performSearch = async () => {
  const results = await globalSearch(searchQuery);
  setSearchResults(results);
};

const searchForDoctors = async () => {
  const doctors = await searchDoctors(searchQuery);
  setDoctors(doctors);
};
```

## Cache Service

Service for caching API responses to improve performance.

**File Location:** `src/services/cache.ts`

### Key Functions

```typescript
// Get item from cache
export const get = async <T>(namespace: string, key: string): Promise<T | null> => {
  const cacheKey = `${namespace}:${key}`;

  try {
    const item = localStorage.getItem(cacheKey);

    if (!item) {
      return null;
    }

    const { value, expiry } = JSON.parse(item);

    if (expiry && expiry < Date.now()) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return value as T;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

// Set item in cache with optional expiry
export const set = async <T>(
  namespace: string,
  key: string,
  value: T,
  expiryMs: number = 5 * 60 * 1000 // Default 5 minutes
): Promise<void> => {
  const cacheKey = `${namespace}:${key}`;

  try {
    const item = {
      value,
      expiry: Date.now() + expiryMs,
    };

    localStorage.setItem(cacheKey, JSON.stringify(item));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

// Remove item from cache
export const remove = async (namespace: string, key: string): Promise<void> => {
  const cacheKey = `${namespace}:${key}`;

  try {
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Cache remove error:', error);
  }
};

// Clear all cache for a namespace
export const clearNamespace = async (namespace: string): Promise<void> => {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(`${namespace}:`)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Cache clearNamespace error:', error);
  }
};
```

### Usage

```typescript
import * as cacheService from '@/services/cache';

// In a service file
export const getDepartments = async (): Promise<Department[]> => {
  const cachedData = await cacheService.get('departments', 'all');

  if (cachedData) {
    return cachedData as Department[];
  }

  const data = await api.get<ApiResponse<Department[]>>('/departments');
  const departments = transformDepartments(data.results);

  await cacheService.set('departments', 'all', departments);

  return departments;
};
```

## Error Handling

The application uses a centralized error handling system to manage API errors consistently.

**File Location:** `src/utils/errors.ts`

### Key Functions

```typescript
// Custom error types
export class NotifiableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotifiableError';
  }
}

export class NetworkError extends NotifiableError {
  constructor() {
    super('Network connection error. Please check your internet connection.');
  }
}

export class AuthenticationError extends NotifiableError {
  constructor() {
    super('Authentication failed. Please log in again.');
  }
}

// Central error handler
export const handleApiError = (error: any): never => {
  if (!error.response) {
    throw new NetworkError();
  }

  const { status, data } = error.response;

  switch (status) {
    case 401:
      // Handle authentication errors
      throw new AuthenticationError();
    case 403:
      // Handle permission errors
      throw new NotifiableError('You do not have permission to access this resource.');
    case 404:
      // Handle not found errors
      throw new NotifiableError('The requested resource was not found.');
    case 500:
      // Handle server errors
      throw new NotifiableError('An unexpected server error occurred. Please try again later.');
    default:
      // Handle other errors
      const message = data?.message || 'An unexpected error occurred.';
      throw new NotifiableError(message);
  }
};
```

### Usage

```typescript
import { handleApiError, NotifiableError } from '@/utils/errors';

// In a component
const fetchData = async () => {
  try {
    const data = await getDoctors();
    setDoctors(data);
  } catch (error) {
    if (error instanceof NotifiableError) {
      // Show user-friendly error message
      toast.error(error.message);
    } else {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred.');
    }
  }
};
```

## Best Practices

1. **Use Service Abstraction**

   - Always access APIs through service functions, not directly
   - Keep API URL construction and parameter handling in services

2. **Handle Errors Properly**

   - Use the centralized error handling system
   - Display user-friendly error messages for known error types
   - Log unexpected errors for debugging

3. **Leverage Caching**

   - Cache frequently accessed data
   - Set appropriate cache expiry times
   - Clear cache when data is likely to change

4. **Data Transformation**

   - Transform API responses to match the application's data model
   - Handle null/undefined values safely
   - Format dates and other special fields consistently

5. **TypeScript Types**

   - Define clear interfaces for API responses and application models
   - Use generic types for reusable API functions
   - Document complex types for better maintainability

6. **Testing**
   - Write tests for service functions
   - Mock API responses for consistent testing
   - Test error handling paths
