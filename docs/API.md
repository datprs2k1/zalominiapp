# API Documentation

## Overview
This document describes the API services and data management layer of the Zalo Medical Mini App.

## Service Architecture

### Base API Configuration
Located in `src/services/api.ts` - Main API client with Axios configuration.

### Service Modules

#### Common Services (`src/services/common.ts`)
Common utilities and shared API functionality.

#### Department Services (`src/services/departments.ts`)
Handles medical department-related API calls:
- Fetch department listings
- Department details
- Department-specific services

#### Doctor Services (`src/services/doctors.ts`)
Manages doctor-related API operations:
- Doctor profiles
- Doctor availability
- Doctor specializations
- Consultation booking

#### Post Services (`src/services/post.ts` & `src/services/posts.ts`)
Content management for articles and posts:
- Health articles
- News posts
- Educational content
- Blog management

#### Search Services (`src/services/search.ts`)
Search functionality across the application:
- Doctor search
- Service search
- Content search
- Advanced filtering

#### Medical Services (`src/services/services.ts`)
Core medical service operations:
- Service listings
- Service details
- Pricing information
- Availability checking

### Caching Layer (`src/services/cache.ts`)
Implements intelligent caching strategies:
- API response caching
- Cache invalidation
- Performance optimization
- Offline support

## API Endpoints

### Authentication
```typescript
// User authentication and session management
POST /auth/login
POST /auth/logout
GET /auth/profile
PUT /auth/profile
```

### Departments
```typescript
// Medical departments
GET /departments
GET /departments/:id
GET /departments/:id/services
GET /departments/:id/doctors
```

### Doctors
```typescript
// Doctor management
GET /doctors
GET /doctors/:id
GET /doctors/:id/availability
GET /doctors/:id/reviews
POST /doctors/:id/book
```

### Services
```typescript
// Medical services
GET /services
GET /services/:id
GET /services/categories
GET /services/pricing
```

### Search
```typescript
// Search functionality
GET /search?q={query}&type={type}
GET /search/suggestions?q={query}
GET /search/filters
```

### Posts & Content
```typescript
// Content management
GET /posts
GET /posts/:id
GET /posts/categories
GET /news
GET /articles
```

## Data Types

### WordPress Integration (`src/services/wp-types.ts`)
Type definitions for WordPress API integration:

```typescript
interface WPPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  author: number;
  categories: number[];
  tags: number[];
  featured_media: number;
}

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
}
```

### Medical Types (`src/types/medical.ts`)
Medical-specific type definitions:

```typescript
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: TimeSlot[];
  bio: string;
  image: string;
}

interface MedicalService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  department: string;
  requirements: string[];
}

interface Appointment {
  id: string;
  doctorId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}
```

## Error Handling

### API Error Types
```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

interface ValidationError extends APIError {
  field: string;
  value: any;
}
```

### Error Handling Strategies
- Network error handling
- Validation error display
- Retry mechanisms
- Fallback data
- User-friendly error messages

## Performance Optimizations

### Caching Strategies
- **Memory Cache**: In-memory caching for frequently accessed data
- **Local Storage**: Persistent caching for offline support
- **API Cache**: Server-side caching headers
- **Stale-While-Revalidate**: Background data updates

### Request Optimization
- Request deduplication
- Batch requests
- Pagination
- Lazy loading
- Prefetching

### Data Processing
- Data normalization
- Selective field loading
- Compression
- Image optimization

## API Hooks

### Custom Hooks for API Integration

#### `useOptimizedApi` (`src/hooks/use-optimized-api.ts`)
Optimized API calling with caching and error handling:

```typescript
const { data, loading, error, refetch } = useOptimizedApi({
  endpoint: '/doctors',
  cacheKey: 'doctors-list',
  cacheDuration: 300000, // 5 minutes
});
```

#### `useMedicalServicePrices` (`src/hooks/useMedicalServicePrices.ts`)
Specialized hook for medical service pricing:

```typescript
const { prices, loading, updatePrice } = useMedicalServicePrices(serviceId);
```

## Testing

### API Testing (`src/utils/api-test.ts`)
Utilities for testing API endpoints:
- Mock API responses
- Test data generation
- API endpoint validation
- Performance testing

### Service Testing
Each service module includes corresponding test files in `__tests__` directories:
- Unit tests for service functions
- Integration tests for API calls
- Mock data for testing
- Error scenario testing

## Security

### Authentication
- JWT token management
- Secure token storage
- Token refresh handling
- Session management

### Data Protection
- Input sanitization
- XSS prevention
- CSRF protection
- Secure API communication

## Monitoring

### Performance Monitoring (`src/utils/api-performance-monitor.ts`)
- API response time tracking
- Error rate monitoring
- Cache hit/miss ratios
- Network performance metrics

### Logging
- API request/response logging
- Error logging
- Performance metrics
- User interaction tracking

## Configuration

### Environment Variables
```typescript
interface APIConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  cacheEnabled: boolean;
}
```

### API Versioning
- Version headers
- Backward compatibility
- Migration strategies
- Deprecation handling
