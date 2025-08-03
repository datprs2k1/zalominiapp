# API Services Guide

This guide provides comprehensive documentation for the API services layer, including WordPress integration, caching strategies, and data flow patterns in the Zalo Healthcare Mini App.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [WordPress Integration](#wordpress-integration)
- [Service Layer Structure](#service-layer-structure)
- [Caching System](#caching-system)
- [Data Flow Patterns](#data-flow-patterns)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)

## 🏗️ Architecture Overview

### Service Layer Structure

```
services/
├── api.ts              # HTTP client configuration
├── cache.ts            # Advanced caching with LRU and compression
├── common.ts           # Shared utilities and transformers
├── doctors.ts          # Doctor profiles and medical staff
├── departments.ts      # Medical departments and services
├── posts.ts            # Blog posts and medical articles
├── search.ts           # Comprehensive search functionality
├── wp-types.ts         # WordPress API type definitions
└── README.md           # Service layer documentation
```

### Key Features

- **🔒 Type Safety**: Comprehensive TypeScript interfaces
- **⚡ Enhanced Caching**: LRU cache with medical error handling
- **🔄 Robust HTTP Client**: Axios with logging and retry logic
- **🏥 Medical Content Filtering**: Healthcare-specific content processing
- **🔍 Advanced Search**: Multi-category search with Vietnamese optimization

## 🔌 WordPress Integration

### API Client Configuration

<augment_code_snippet path="src/services/api.ts" mode="EXCERPT">

```typescript
// HTTP client with medical-specific configuration
const apiClient = axios.create({
  baseURL: process.env.WORDPRESS_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
```

</augment_code_snippet>

### WordPress API Endpoints

```typescript
// Core WordPress endpoints
const ENDPOINTS = {
  POSTS: '/wp-json/wp/v2/posts',
  PAGES: '/wp-json/wp/v2/pages',
  DOCTORS: '/wp-json/wp/v2/info-bacsi',
  DEPARTMENTS: '/wp-json/wp/v2/pages',
  MEDIA: '/wp-json/wp/v2/media',
  SEARCH: '/wp-json/wp/v2/search',
};

// Medical-specific content IDs
const CONTENT_IDS = {
  DEPARTMENT_ID: 1009, // Parent ID for departments
  SERVICES_CATEGORY: 'dich-vu', // Services category slug
  NEWS_CATEGORY: 'tin-tuc', // News category slug
};
```

### Content Type Definitions

<augment_code_snippet path="src/services/wp-types.ts" mode="EXCERPT">

```typescript
// WordPress post interface
export interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  date: string;
  modified: string;
}

// Medical doctor interface
export interface WPDoctor extends WPPost {
  acf?: {
    specialty?: string;
    experience?: string;
    consultation_fee?: string;
    availability?: string;
  };
}
```

</augment_code_snippet>

## 🏥 Service Layer Structure

### Posts Service

Handles blog posts and medical articles with enhanced features.

```typescript
import { getPosts, getPost, searchPosts } from '@/services/posts';

// Get enhanced posts with medical filtering
const posts = await getPosts({ per_page: 10 });

// Search posts with medical context
const searchResults = await searchPosts('tim mạch');

// Get single post with related content
const post = await getPost(123);
```

**Enhanced Features:**

- Reading time estimation
- Medical content filtering
- Featured image extraction
- Plain text excerpts
- Vietnamese date formatting

### Doctors Service

Manages doctor profiles and medical staff information.

<augment_code_snippet path="src/services/doctors.ts" mode="EXCERPT">

```typescript
/**
 * Get doctors with enhanced data
 */
export const getDoctors = async (
  params: DoctorsQueryParams = {},
  options?: FetchOptions
): Promise<EnhancedDoctor[]> => {
  const doctors = await fetchDoctors(params, options);
  const filteredDoctors = filterMedicalContent(doctors);
  const enhancedDoctors = filteredDoctors.map(transformDoctor);

  // Sort by priority (seniority) and then by name
  return enhancedDoctors.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.title.rendered.localeCompare(b.title.rendered, 'vi');
  });
};
```

</augment_code_snippet>

**Enhanced Features:**

- Experience and qualification extraction
- Specialization categorization
- Consultation fee parsing
- Availability status tracking
- Seniority-based priority sorting

### Departments Service

Manages medical departments and service categories.

```typescript
import { getDepartments, getDepartment } from '@/services/departments';

// Get all departments with hierarchy
const departments = await getDepartments();

// Get specific department with services
const cardiology = await getDepartment('tim-mach');
```

**Enhanced Features:**

- Department type classification
- Emergency department identification
- Contact information extraction
- Staff count tracking
- Priority-based sorting

### Search Service

Comprehensive search across all medical content.

```typescript
import { getComprehensiveSearch } from '@/services/search';

// Multi-category search with suggestions
const results = await getComprehensiveSearch('khám tim mạch');

// Results structure
interface SearchResults {
  doctors: EnhancedDoctor[];
  departments: EnhancedDepartment[];
  posts: EnhancedPost[];
  services: EnhancedService[];
  suggestions: string[];
}
```

**Enhanced Features:**

- Multi-category parallel search
- Medical terminology suggestions
- Vietnamese search optimization
- Result categorization and prioritization
- Fuzzy matching for medical terms

## 🚀 Caching System

### Advanced LRU Cache

<augment_code_snippet path="src/services/cache.ts" mode="EXCERPT">

```typescript
// Cache configuration for medical data
const CACHE_CONFIG = {
  maxSize: 100 * 1024 * 1024, // 100MB cache size
  maxEntries: 2000, // Maximum entries
  compressionThreshold: 1024, // Compress entries > 1KB
  cleanupInterval: 5 * 60 * 1000, // Cleanup every 5 minutes
  circuitBreakerThreshold: 5, // Open circuit after 5 failures
};
```

</augment_code_snippet>

### Cache Features

**1. Intelligent Compression**

```typescript
// Automatic compression for large responses
const compressedData = await cache.set('doctors-list', largeDataSet);
```

**2. Tag-Based Invalidation**

```typescript
// Invalidate related content
invalidateMedicalContent.doctors(); // Clear doctor profiles
invalidateMedicalContent.departments(); // Clear department info
invalidateMedicalContent.emergency(); // Clear emergency content
```

**3. Cache Warmup**

```typescript
// Preload critical medical data
await warmupMedicalCache();
```

**4. Performance Monitoring**

```typescript
// Monitor cache performance
const stats = getCacheStats();
console.log(`Hit rate: ${stats.hitRate * 100}%`);
console.log(`Compression ratio: ${stats.compressionRatio * 100}%`);
```

### Cache Strategies

- **Stale-While-Revalidate**: Serve cached content while updating in background
- **Cache-First**: Serve from cache, fallback to network
- **Network-First**: Try network first, fallback to cache
- **Medical Priority**: Emergency content bypasses cache

## 🔄 Data Flow Patterns

### Request Flow

```
User Action → Component → Hook → Service → Cache Check → API Call → Transform → Cache Store → UI Update
```

### Data Transformation Pipeline

```typescript
// Common transformation pipeline
const transformMedicalContent = (rawData: WPPost[]): EnhancedPost[] => {
  return rawData
    .filter(filterMedicalContent) // Remove non-medical content
    .map(extractMedicalData) // Extract medical fields
    .map(enhanceWithMetadata) // Add computed metadata
    .sort(sortByMedicalPriority); // Sort by medical importance
};
```

### State Integration

```typescript
// Jotai atoms for service integration
export const doctorsAtom = atom(async () => await getDoctors());
export const searchResultsAtomFamily = atomFamily((query: string) =>
  atom(async () => await getComprehensiveSearch(query))
);
```

## ⚠️ Error Handling

### Error Types

```typescript
// Medical-specific error types
export class MedicalAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high' | 'critical'
  ) {
    super(message);
  }
}

// Emergency service errors
export class EmergencyServiceError extends MedicalAPIError {
  constructor(message: string) {
    super(message, 'EMERGENCY_SERVICE_ERROR', 'critical');
  }
}
```

### Error Recovery Strategies

```typescript
// Circuit breaker pattern
const circuitBreaker = {
  failures: 0,
  threshold: 5,
  timeout: 30000,

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.failures >= this.threshold) {
      throw new Error('Circuit breaker open');
    }

    try {
      const result = await fn();
      this.failures = 0; // Reset on success
      return result;
    } catch (error) {
      this.failures++;
      throw error;
    }
  },
};
```

### Retry Logic

```typescript
// Exponential backoff retry
const retryWithBackoff = async <T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};
```

## ⚡ Performance Optimization

### Request Optimization

```typescript
// Batch requests for related data
const batchFetch = async (ids: number[]) => {
  const chunks = chunkArray(ids, 10); // Process in chunks of 10
  const results = await Promise.all(chunks.map((chunk) => fetchMultiple(chunk)));
  return results.flat();
};
```

### Data Prefetching

```typescript
// Prefetch related medical content
const prefetchRelatedContent = async (doctorId: number) => {
  const doctor = await getDoctor(doctorId);

  // Prefetch related data in parallel
  await Promise.all([
    getDepartment(doctor.departmentId),
    getDoctorSchedule(doctorId),
    getRelatedDoctors(doctor.specialtyId),
  ]);
};
```

### Memory Management

```typescript
// Automatic memory cleanup
const cleanupExpiredCache = () => {
  const now = Date.now();
  const expiredKeys = cache.keys().filter((key) => {
    const entry = cache.get(key);
    return entry && entry.expiry < now;
  });

  expiredKeys.forEach((key) => cache.delete(key));
};
```

## 🔧 Usage Examples

### Basic Service Usage

```typescript
// Fetch doctors with caching
const doctors = await getDoctors({
  specialty: 'cardiology',
  available: true,
  per_page: 20,
});

// Search with comprehensive results
const searchResults = await getComprehensiveSearch('khám tim');

// Get department with services
const department = await getDepartment('tim-mach');
```

### Advanced Usage with State Management

```typescript
// Using with Jotai atoms
const DoctorsList = () => {
  const doctors = useAtomValue(doctorsAtom);
  const searchResults = useAtomValue(searchResultsAtomFamily('cardiology'));

  return (
    <div>
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};
```

## 📚 Quick Reference

### Available Services

| Service | File | Purpose | Key Functions |
| --- | --- | --- | --- |
| **Posts** | `posts.ts` | Blog posts and medical articles | `getPosts()`, `getPost()`, `searchPosts()` |
| **Doctors** | `doctors.ts` | Doctor profiles and medical staff | `getDoctors()`, `getDoctorById()`, `searchDoctors()` |
| **Departments** | `departments.ts` | Medical departments and services | `getDepartments()`, `getDepartmentById()` |
| **Services** | `services.ts` | Medical services and pricing | `getServices()`, `getServicePrices()` |
| **Search** | `search.ts` | Comprehensive search functionality | `getComprehensiveSearch()` |

### Common Usage Patterns

```typescript
// Fetch and display doctors
const { data: doctors, isLoading } = useAtom(doctorsAtom);

// Search across all content types
const searchResults = await getComprehensiveSearch('tim mạch');

// Get cached service prices
const prices = await getServicePrices({ useCache: true });

// Fetch posts with medical filtering
const posts = await getPosts({
  per_page: 10,
  medicalFilter: true,
});
```

### Environment Configuration

```typescript
// Required environment variables
WORDPRESS_API_URL=https://your-api.com/wp-json/wp/v2
API_TIMEOUT=10000
API_RETRY_ATTEMPTS=3
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
