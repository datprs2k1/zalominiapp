# Medical Services API Documentation

This directory contains the optimized and enhanced WordPress API services for the medical application. All services have been refactored with improved type safety, error handling, caching, and medical-specific features.

## Architecture Overview

The services layer follows a modular architecture with the following key components:

- **Common utilities** (`common.ts`) - Shared functions and patterns
- **Enhanced caching** (`cache.ts`) - LRU cache with medical error handling
- **API client** (`api.ts`) - Robust HTTP client with logging
- **Type definitions** (`wp-types.ts`) - Comprehensive TypeScript interfaces
- **Content services** - Posts, services, departments, doctors, search

## Key Features

### 🔒 Type Safety

- Comprehensive TypeScript interfaces with readonly properties
- Eliminated `any` types in favor of specific interfaces
- Enhanced WordPress API type definitions

### ⚡ Performance Optimization

- LRU cache with size limits and TTL management
- Parallel API requests for comprehensive search
- Optimized data transformations with medical context

### 🛡️ Error Handling

- Medical-context error messages in Vietnamese
- Retry logic with exponential backoff
- Comprehensive logging for debugging

### 🏥 Medical-Specific Features

- Medical priority sorting for content
- Vietnamese medical terminology support
- Healthcare-specific data transformations
- Accessibility considerations for medical UI

## Service Modules

### Posts Service (`posts.ts`)

Handles blog posts and medical articles with enhanced features:

```typescript
import { getPosts, getPost, searchPosts } from '@/services/posts';

// Get enhanced posts with medical filtering
const posts = await getPosts({ per_page: 10 });

// Search posts with medical context
const searchResults = await searchPosts('tim mạch');
```

**Enhanced Features:**

- Reading time estimation
- Medical content filtering
- Featured image extraction
- Plain text excerpts
- Vietnamese date formatting

### Services Service (`services.ts`)

Manages medical services and pricing information:

```typescript
import { getServices, getServicePrices } from '@/services/services';

// Get medical services with pricing
const services = await getServices({ orderby: 'menu_order' });

// Get service price list
const prices = await getServicePrices([1, 2, 3]);
```

**Enhanced Features:**

- Price extraction from content
- Service categorization
- Vietnamese currency formatting
- Medical service validation

### Departments Service (`departments.ts`)

Handles hospital departments and specialties:

```typescript
import { getDepartments, getDepartmentsByType } from '@/services/departments';

// Get all departments with priority sorting
const departments = await getDepartments();

// Get emergency departments
const emergencyDepts = await getDepartmentsByType('clinical');
```

**Enhanced Features:**

- Department type classification
- Emergency department identification
- Contact information extraction
- Staff count tracking
- Priority-based sorting

### Doctors Service (`doctors.ts`)

Manages doctor profiles and medical staff:

```typescript
import { getDoctors, searchDoctors, getSeniorDoctors } from '@/services/doctors';

// Get doctors with seniority sorting
const doctors = await getDoctors();

// Search doctors by specialization
const cardiologists = await searchDoctors('tim mạch');
```

**Enhanced Features:**

- Experience and qualification extraction
- Specialization categorization
- Consultation fee parsing
- Availability status
- Seniority-based priority

### Search Service (`search.ts`)

Comprehensive search across all medical content:

```typescript
import { getComprehensiveSearch } from '@/services/search';

// Comprehensive search with suggestions
const results = await getComprehensiveSearch('khám tim mạch');
```

**Enhanced Features:**

- Multi-category parallel search
- Medical terminology suggestions
- Vietnamese search optimization
- Result categorization and prioritization

## Common Utilities (`common.ts`)

Shared utilities for all services:

### Data Transformation

- `extractFeaturedImageUrl()` - Extract WordPress featured images
- `extractCategories()` - Extract taxonomy terms
- `extractPlainText()` - Clean HTML content
- `truncateText()` - Smart text truncation
- `formatMedicalDate()` - Vietnamese date formatting

### Content Filtering

- `filterMedicalContent()` - Filter published content
- `sortByMedicalPriority()` - Medical priority sorting
- `isValidWPContent()` - Content validation

### Atom Factories

- `createListAtomFamily()` - Generic list atom factory
- `createItemAtomFamily()` - Generic item atom factory
- `createSimpleAtom()` - Simple atom factory

## Enhanced Medical Caching System (`cache.ts`)

Advanced caching system optimized for medical applications with comprehensive performance monitoring:

### 🚀 **Key Features**

- **Medical-Aware TTL**: Different cache durations for medical content types
- **Priority-Based Eviction**: Emergency content gets highest priority
- **Compression**: Automatic compression for large medical data objects
- **Circuit Breaker**: Fault tolerance for cache operations
- **Tag-Based Invalidation**: Selective cache invalidation by medical categories
- **Health Monitoring**: Real-time cache performance tracking
- **Vietnamese Error Messages**: Medical-context friendly error handling

### 📊 **Medical Content Types & TTL**

```typescript
// Emergency content: 30 seconds (critical, real-time)
// Departments: 5 minutes (semi-static hospital structure)
// Doctors: 10 minutes (staff information, moderate changes)
// Services: 15 minutes (service info, relatively stable)
// Posts: 30 minutes (educational content, infrequent updates)
// Search: 2 minutes (dynamic results)
// General: 5 minutes (default for other content)
```

### 🎯 **Priority System**

```typescript
// Priority 1: Emergency (never evicted unless expired)
// Priority 2: Departments, Doctors (high priority)
// Priority 3: Services, General (medium priority)
// Priority 4: Posts (lower priority)
// Priority 5: Search (lowest priority, can be regenerated)
```

### 💾 **Enhanced Configuration**

- **Cache Size**: 100MB (increased for medical data)
- **Max Entries**: 2000 entries
- **Compression Threshold**: 1KB (compress larger entries)
- **Cleanup Interval**: 5 minutes (more frequent)
- **Circuit Breaker**: 5 failures trigger open state

### 🔧 **Basic Usage**

```typescript
import { fetchWPData, getCacheStats, getCacheHealth } from '@/services/cache';

// Fetch with automatic medical content type detection
const doctors = await fetchWPData('/wp-json/wp/v2/info-bacsi');
const departments = await fetchWPData('/wp-json/wp/v2/pages', { parent: 1009 });

// Monitor cache performance
const stats = getCacheStats();
console.log(`Cache hit rate: ${stats.hitRate * 100}%`);
console.log(`Compression ratio: ${stats.compressionRatio * 100}%`);

// Check cache health
const health = getCacheHealth();
console.log(`Cache status: ${health.status}`);
```

### 🏥 **Medical-Specific Features**

#### Cache Warmup

```typescript
import { warmupMedicalCache } from '@/services/cache';

// Preload critical medical data on app startup
await warmupMedicalCache();
```

#### Tag-Based Invalidation

```typescript
import { invalidateCacheByTags, invalidateMedicalContent } from '@/services/cache';

// Invalidate specific content types
invalidateMedicalContent.emergency(); // Clear emergency content
invalidateMedicalContent.doctors(); // Clear doctor profiles
invalidateMedicalContent.departments(); // Clear department info

// Invalidate by custom tags
invalidateCacheByTags(['parent:1009', 'emergency']);
```

#### Performance Monitoring

```typescript
import { cacheMonitoring } from '@/services/cache';

// Get detailed metrics
const metrics = cacheMonitoring.getMetrics();
const memoryReport = cacheMonitoring.getMemoryReport();
const contentBreakdown = cacheMonitoring.getContentTypeBreakdown();

// Check if optimization is needed
if (cacheMonitoring.needsOptimization()) {
  console.warn('Cache performance degraded, consider optimization');
}
```

## Error Handling

### Medical API Error Class

Custom error class with medical context:

```typescript
import { MedicalAPIError } from '@/services/cache';

try {
  const data = await fetchWPData('/api/endpoint');
} catch (error) {
  if (error instanceof MedicalAPIError) {
    // Display user-friendly Vietnamese message
    showError(error.getUserMessage());
  }
}
```

### Error Codes

- `NETWORK_ERROR` - Network connectivity issues
- `TIMEOUT_ERROR` - Request timeout
- `NOT_FOUND` - Content not found
- `UNAUTHORIZED` - Authentication required
- `SERVER_ERROR` - Server-side issues

## API Client (`api.ts`)

Enhanced Axios client with medical features:

### Features

- **Request/Response Logging**: Detailed logging for debugging
- **Medical Error Mapping**: HTTP status to medical messages
- **Health Checks**: API availability monitoring
- **Metadata Tracking**: Request timing and performance

### Usage

```typescript
import api, { checkAPIHealth, getAPILogs } from '@/services/api';

// Check API health
const health = await checkAPIHealth();

// Get API logs for debugging
const logs = getAPILogs('error', 50);
```

## Type Definitions (`wp-types.ts`)

Comprehensive WordPress API types:

### Key Interfaces

- `WPPost` - WordPress post with embedded data
- `WPPage` - WordPress page extending post
- `WPDoctor` - Custom doctor post type
- `WPSearchResult` - Search result structure
- `WPAPIError` - Error response structure

### Enhanced Features

- Readonly properties for immutability
- Detailed embedded data types
- Medical-specific field definitions
- Comprehensive error structures

## Best Practices

### Performance

1. Use caching for frequently accessed data
2. Implement pagination for large datasets
3. Use parallel requests for independent data
4. Monitor cache hit rates and adjust TTL

### Error Handling

1. Always catch and handle MedicalAPIError
2. Display user-friendly Vietnamese messages
3. Log errors for debugging in development
4. Implement retry logic for transient failures

### Type Safety

1. Use specific interfaces instead of `any`
2. Leverage readonly properties for immutability
3. Validate data structures before processing
4. Use type guards for runtime validation

### Medical Context

1. Prioritize emergency and critical content
2. Use Vietnamese medical terminology
3. Consider accessibility requirements
4. Implement medical-specific sorting and filtering

## Migration Guide

### From Legacy Services

The optimized services maintain backward compatibility through legacy exports:

```typescript
// Old way (still works)
import { getPosts } from '@/services/posts';

// New way (recommended)
import { getPosts, EnhancedPost } from '@/services/posts';
```

### Breaking Changes

- Enhanced interfaces may have additional readonly properties
- Error handling now throws MedicalAPIError instead of generic errors
- Cache behavior is more aggressive with LRU eviction

## Monitoring and Debugging

### Cache Statistics

```typescript
import { getCacheStats } from '@/services/cache';

const stats = getCacheStats();
console.log('Cache Performance:', {
  hitRate: `${(stats.hitRate * 100).toFixed(2)}%`,
  totalEntries: stats.totalEntries,
  totalSize: `${(stats.totalSize / 1024 / 1024).toFixed(2)}MB`,
});
```

### API Logs

```typescript
import { getAPILogs } from '@/services/api';

// Get recent errors
const errors = getAPILogs('error', 20);
errors.forEach((log) => {
  console.error(`[${new Date(log.timestamp).toISOString()}] ${log.message}`, log.context);
});
```

## Contributing

When adding new services or modifying existing ones:

1. Follow the established patterns in `common.ts`
2. Add comprehensive TypeScript types
3. Implement medical-specific transformations
4. Include Vietnamese error messages
5. Add JSDoc documentation
6. Write unit tests for new functionality
7. Update this documentation

## Support

For issues or questions about the medical services:

1. Check the API logs for error details
2. Monitor cache performance for optimization opportunities
3. Review type definitions for proper usage
4. Consult the medical terminology guide for Vietnamese translations
