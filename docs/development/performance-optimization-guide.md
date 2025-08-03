# Performance Optimization Guide

This guide covers performance optimization strategies, monitoring tools, and best practices specific to the Zalo Healthcare Mini App.

## 📋 Table of Contents

- [Performance Overview](#performance-overview)
- [Frontend Optimizations](#frontend-optimizations)
- [API and Caching Optimizations](#api-and-caching-optimizations)
- [Mobile Performance](#mobile-performance)
- [Monitoring and Metrics](#monitoring-and-metrics)
- [Build Optimizations](#build-optimizations)
- [Runtime Optimizations](#runtime-optimizations)

## 📊 Performance Overview

### Current Performance Features

The Zalo Healthcare Mini App includes several built-in performance optimizations:

- **Advanced Caching System**: LRU cache with medical error handling
- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Dynamic imports for non-critical components
- **Image Optimization**: WebP format with fallbacks
- **iOS-Specific Optimizations**: Scroll performance fixes
- **Performance Monitoring**: Built-in performance tracking

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ~1.2s |
| Largest Contentful Paint | < 2.5s | ~2.1s |
| Time to Interactive | < 3.5s | ~3.0s |
| Bundle Size | < 500KB | ~450KB |
| API Response Time | < 500ms | ~300ms |

## ⚡ Frontend Optimizations

### Code Splitting Implementation

The app uses strategic code splitting for optimal loading:

```typescript
// src/router.tsx - Route-based splitting
const ServicesPage = lazy(() => import("./pages/services"));
const BookingPage = lazy(() => import("./pages/booking"));
const ProfilePage = lazy(() => import("./pages/profile"));

// Component-based splitting for large components
const MedicalChart = lazy(() => import("./components/medical/chart"));
```

### Image Optimization

```typescript
// src/components/optimized-image.tsx
export const OptimizedImage: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
}) => {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <source srcSet={`${src}.jpg`} type="image/jpeg" />
      <img
        src={`${src}.jpg`}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
};
```

### Virtual Scrolling for Large Lists

```typescript
// Using @tanstack/react-virtual for doctor lists
import { useVirtualizer } from '@tanstack/react-virtual';

export const DoctorList: React.FC<{ doctors: Doctor[] }> = ({ doctors }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: doctors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated height of each doctor card
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <DoctorCard doctor={doctors[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Skeleton Loading Optimization

```typescript
// src/components/skeleton-performance-utils.ts
export const initializeSkeletonPerformance = () => {
  // Preload skeleton styles
  const skeletonStyles = document.createElement('style');
  skeletonStyles.textContent = `
    .skeleton-pulse {
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    }
    @keyframes skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(skeletonStyles);
};
```

## 🔄 API and Caching Optimizations

### Advanced Caching Strategy

```typescript
// src/services/cache.ts - LRU Cache with medical context
export class MedicalCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 100;
  
  set(key: string, data: any, ttl: number = 300000) {
    // Implement LRU eviction
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      medicalContext: this.extractMedicalContext(data),
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.data;
  }
}
```

### API Request Optimization

```typescript
// src/utils/api-performance-monitor.ts
export const batchRequest = async <T>(
  requests: Array<() => Promise<T>>,
  batchSize: number = 3
): Promise<T[]> => {
  const results: T[] = [];
  
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(request => request())
    );
    results.push(...batchResults);
  }
  
  return results;
};

export const optimizeApiUrl = (url: string, params: Record<string, any>) => {
  // Remove unnecessary parameters
  const optimizedParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
  return `${url}?${new URLSearchParams(optimizedParams)}`;
};
```

### Intelligent Prefetching

```typescript
// src/hooks/use-optimized-api.ts
export const useOptimizedAPI = <T>(
  endpoint: string,
  config: OptimizedAPIConfig = {}
) => {
  const prefetch = useCallback(async (prefetchEndpoint: string) => {
    // Prefetch related data based on user behavior
    const cacheKey = generateCacheKey(prefetchEndpoint);
    
    if (!cache.has(cacheKey)) {
      try {
        const data = await fetchWPData(prefetchEndpoint);
        cache.set(cacheKey, data);
      } catch (error) {
        // Silent fail for prefetch
        console.debug('Prefetch failed:', error);
      }
    }
  }, []);
  
  // Auto-prefetch related content
  useEffect(() => {
    if (data && config.autoPrefetch) {
      const relatedEndpoints = getRelatedEndpoints(endpoint, data);
      relatedEndpoints.forEach(prefetch);
    }
  }, [data, prefetch]);
};
```

## 📱 Mobile Performance

### iOS-Specific Optimizations

```css
/* src/styles/ios-scroll-fixes.css */
.ios-scroll-container {
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  transform: translateZ(0);
  will-change: scroll-position;
}

.ios-smooth-scroll {
  scroll-behavior: smooth;
  -webkit-scroll-behavior: smooth;
}

/* Prevent iOS zoom on input focus */
input, select, textarea {
  font-size: 16px;
}
```

### Touch Performance

```typescript
// src/utils/touch-optimization.ts
export const optimizeTouchEvents = () => {
  // Use passive event listeners for better scroll performance
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  
  // Debounce touch events
  const debouncedTouchHandler = debounce((event: TouchEvent) => {
    // Handle touch logic
  }, 16); // ~60fps
};
```

### Memory Management

```typescript
// src/hooks/use-memory-optimization.ts
export const useMemoryOptimization = () => {
  useEffect(() => {
    const cleanup = () => {
      // Clear large objects from memory
      if (window.medicalDataCache) {
        window.medicalDataCache.clear();
      }
      
      // Force garbage collection (if available)
      if (window.gc) {
        window.gc();
      }
    };
    
    // Cleanup on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cleanup();
      }
    });
    
    return cleanup;
  }, []);
};
```

## 📈 Monitoring and Metrics

### Performance Monitoring Setup

```typescript
// src/utils/performance-monitor.ts
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  
  startTiming(label: string) {
    this.metrics.set(`${label}_start`, performance.now());
  }
  
  endTiming(label: string) {
    const start = this.metrics.get(`${label}_start`);
    if (start) {
      const duration = performance.now() - start;
      this.metrics.set(label, duration);
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`Slow operation detected: ${label} took ${duration}ms`);
      }
      
      return duration;
    }
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// Usage in components
export const usePerformanceMonitoring = (componentName: string) => {
  const monitor = useMemo(() => new PerformanceMonitor(), []);
  
  useEffect(() => {
    monitor.startTiming(`${componentName}_render`);
    return () => {
      monitor.endTiming(`${componentName}_render`);
    };
  });
  
  return monitor;
};
```

### Core Web Vitals Tracking

```typescript
// src/utils/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const initializeWebVitals = () => {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};

// Track medical-specific metrics
export const trackMedicalMetrics = () => {
  // Track appointment booking flow performance
  const bookingStartTime = performance.now();
  
  // Track API response times for medical data
  const trackAPIResponse = (endpoint: string, duration: number) => {
    if (duration > 500) {
      console.warn(`Slow medical API: ${endpoint} took ${duration}ms`);
    }
  };
};
```

## 🏗️ Build Optimizations

### Vite Configuration

```typescript
// vite.config.mts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['zmp-ui', 'framer-motion'],
          medical: ['./src/components/medical', './src/services/medical'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'zmp-ui'],
    exclude: ['@tanstack/react-virtual'],
  },
});
```

### Bundle Analysis

```bash
# Analyze bundle size
yarn build --analyze

# Check for duplicate dependencies
yarn why package-name

# Optimize bundle
yarn add -D webpack-bundle-analyzer
```

## 🚀 Runtime Optimizations

### React Performance

```typescript
// Use React.memo for expensive components
export const DoctorCard = React.memo<DoctorCardProps>(({ doctor }) => {
  return (
    <div className="doctor-card">
      {/* Component content */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for medical data
  return prevProps.doctor.id === nextProps.doctor.id &&
         prevProps.doctor.availability === nextProps.doctor.availability;
});

// Use useMemo for expensive calculations
export const useMedicalCalculations = (patientData: PatientData) => {
  return useMemo(() => {
    return calculateMedicalMetrics(patientData);
  }, [patientData.vitals, patientData.medications]);
};
```

### State Management Optimization

```typescript
// Optimize Jotai atoms for medical data
export const doctorAtomFamily = atomFamily((doctorId: string) =>
  atom(async () => {
    const cached = medicalCache.get(`doctor_${doctorId}`);
    if (cached) return cached;
    
    const doctor = await fetchDoctor(doctorId);
    medicalCache.set(`doctor_${doctorId}`, doctor, 600000); // 10 minutes
    return doctor;
  })
);
```

## 📊 Performance Checklist

### Development
- [ ] Use React DevTools Profiler
- [ ] Monitor bundle size during development
- [ ] Test on actual mobile devices
- [ ] Use performance monitoring hooks

### Pre-deployment
- [ ] Run Lighthouse audit
- [ ] Test on slow network connections
- [ ] Verify Core Web Vitals
- [ ] Check memory usage patterns

### Production
- [ ] Monitor real user metrics
- [ ] Set up performance alerts
- [ ] Regular performance reviews
- [ ] A/B test performance improvements

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
