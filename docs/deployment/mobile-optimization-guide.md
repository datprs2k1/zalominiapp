# Mobile Optimization Guide

This guide covers mobile-specific optimizations, iOS fixes, responsive design patterns, and performance enhancements for the Zalo Healthcare Mini App.

## 📋 Table of Contents

- [Mobile-First Design](#mobile-first-design)
- [iOS-Specific Optimizations](#ios-specific-optimizations)
- [Touch and Gesture Handling](#touch-and-gesture-handling)
- [Performance Optimizations](#performance-optimizations)
- [Responsive Design Patterns](#responsive-design-patterns)
- [Accessibility on Mobile](#accessibility-on-mobile)
- [Testing on Mobile](#testing-on-mobile)

## 📱 Mobile-First Design

### Design Philosophy

The Zalo Healthcare app follows a mobile-first approach:

1. **Touch-First Interface**: All interactions designed for finger navigation
2. **Thumb-Friendly Layout**: Critical actions within thumb reach zones
3. **Progressive Enhancement**: Start with mobile, enhance for larger screens
4. **Performance Priority**: Optimized for mobile network conditions

### Mobile Breakpoint System

```css
/* Mobile-first CSS architecture */
/* Base styles: Mobile (320px+) */
.medical-component {
  padding: var(--spacing-sm);
  font-size: var(--font-size-body);
}

/* Tablet (640px+) */
@media (min-width: 640px) {
  .medical-component {
    padding: var(--spacing-md);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .medical-component {
    padding: var(--spacing-lg);
    font-size: var(--font-size-body-large);
  }
}
```

### Touch Target Optimization

```css
/* Touch target sizing system */
:root {
  --touch-target-min: 44px;        /* WCAG minimum */
  --touch-target-comfortable: 48px; /* Comfortable size */
  --touch-target-large: 56px;      /* Large actions */
  --touch-target-xl: 64px;         /* Emergency actions */
}

.touch-target {
  min-height: var(--touch-target-min);
  min-width: var(--touch-target-min);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.emergency-button {
  min-height: var(--touch-target-xl);
  min-width: var(--touch-target-xl);
}
```

## 🍎 iOS-Specific Optimizations

### iOS Scroll Fixes

<augment_code_snippet path="src/utils/ios-fixes.ts" mode="EXCERPT">
````typescript
// iOS-specific initialization
export const initializeIOSFixes = () => {
  if (isIOS()) {
    // Fix iOS scroll bounce
    document.body.style.overscrollBehavior = 'none';
    
    // Fix iOS viewport height issues
    setViewportHeight();
    
    // Handle orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Fix iOS input zoom
    preventInputZoom();
  }
};
````
</augment_code_snippet>

### Safe Area Handling

```css
/* iOS safe area support */
.ios-safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Header with safe area */
.app-header {
  padding-top: max(1rem, env(safe-area-inset-top));
  background: var(--color-primary);
}

/* Bottom navigation with safe area */
.bottom-nav {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

### iOS Scroll Behavior

```css
/* iOS-specific scroll optimizations */
@supports (-webkit-touch-callout: none) {
  /* iOS Safari specific */
  
  .scrollable-content {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  
  /* Disable scroll bounce on modals */
  .medical-modal,
  .medical-drawer {
    -webkit-overflow-scrolling: auto;
    overscroll-behavior: contain;
  }
  
  /* iOS button styling */
  .medical-button-ios {
    -webkit-appearance: none;
    border-radius: var(--border-radius-lg);
    background: var(--color-primary);
    border: none;
  }
}
```

### Viewport Meta Configuration

```html
<!-- Optimized viewport for iOS -->
<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
>

<!-- iOS-specific meta tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Zalo Healthcare">
```

## 👆 Touch and Gesture Handling

### Touch Event Handling

```typescript
// Enhanced touch handling
export const useTouchGestures = (elementRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    let startY = 0;
    let startX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      
      const deltaY = currentY - startY;
      const deltaX = currentX - startX;
      
      // Handle swipe gestures
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 50) {
          onSwipeRight?.();
        } else if (deltaX < -50) {
          onSwipeLeft?.();
        }
      }
    };
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
};
```

### Gesture-Based Navigation

```typescript
// Swipe navigation component
export const SwipeableCard = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight 
}: SwipeableCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useTouchGestures(cardRef, {
    onSwipeLeft,
    onSwipeRight,
    threshold: 100 // Minimum swipe distance
  });
  
  return (
    <motion.div
      ref={cardRef}
      className="swipeable-card"
      whileTap={{ scale: 0.98 }}
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
      dragElastic={0.2}
    >
      {children}
    </motion.div>
  );
};
```

### Pull-to-Refresh

```typescript
// Pull-to-refresh implementation
export const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const handlePullToRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  };
  
  return {
    isRefreshing,
    pullDistance,
    handlePullToRefresh
  };
};
```

## ⚡ Performance Optimizations

### Image Optimization

```typescript
// Optimized image component
export const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height,
  priority = false 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Generate responsive image URLs
  const srcSet = useMemo(() => {
    const sizes = [320, 640, 1024, 1280];
    return sizes
      .map(size => `${src}?w=${size} ${size}w`)
      .join(', ');
  }, [src]);
  
  return (
    <div className="relative overflow-hidden">
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <img
        src={src}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
```

### Virtual Scrolling

```typescript
// Virtual scrolling for large lists
import { useVirtualizer } from '@tanstack/react-virtual';

export const VirtualizedDoctorList = ({ doctors }: { doctors: Doctor[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: doctors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated item height
    overscan: 5, // Render 5 extra items
  });
  
  return (
    <div
      ref={parentRef}
      className="h-96 overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
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

### Lazy Loading Components

```typescript
// Lazy loading with intersection observer
export const LazyComponent = ({ 
  children, 
  fallback = <div>Loading...</div>,
  rootMargin = '50px' 
}: LazyComponentProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [rootMargin]);
  
  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};
```

## 📐 Responsive Design Patterns

### Container Queries

```css
/* Container-based responsive design */
.doctor-card-container {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .doctor-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
  }
}

@container (min-width: 500px) {
  .doctor-card {
    grid-template-columns: auto 1fr auto;
  }
}
```

### Fluid Typography

```css
/* Fluid typography system */
:root {
  --font-size-sm: clamp(0.875rem, 2.5vw, 1rem);
  --font-size-base: clamp(1rem, 3vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 4vw, 1.5rem);
  --font-size-xl: clamp(1.5rem, 5vw, 2rem);
  --font-size-2xl: clamp(2rem, 6vw, 3rem);
}

.responsive-title {
  font-size: var(--font-size-xl);
  line-height: 1.2;
}
```

### Adaptive Layouts

```typescript
// Adaptive layout hook
export const useAdaptiveLayout = () => {
  const [layout, setLayout] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setLayout('mobile');
      } else if (width < 1024) {
        setLayout('tablet');
      } else {
        setLayout('desktop');
      }
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);
  
  return layout;
};

// Usage in components
const DoctorGrid = () => {
  const layout = useAdaptiveLayout();
  
  const gridCols = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };
  
  return (
    <div 
      className={`grid gap-4`}
      style={{ gridTemplateColumns: `repeat(${gridCols[layout]}, 1fr)` }}
    >
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};
```

## ♿ Accessibility on Mobile

### Touch Accessibility

```css
/* Enhanced touch targets for accessibility */
.accessible-touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 8px;
  margin: 4px;
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border: 2px solid currentColor;
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
```

### Screen Reader Optimization

```typescript
// Screen reader announcements
export const useScreenReaderAnnouncement = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);
  
  return announce;
};
```

### Focus Management

```typescript
// Focus trap for modals
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);
  
  return containerRef;
};
```

## 🧪 Testing on Mobile

### Mobile Testing Setup

```typescript
// Mobile viewport testing
const mobileViewports = {
  'iPhone SE': { width: 375, height: 667 },
  'iPhone 12': { width: 390, height: 844 },
  'Samsung Galaxy S21': { width: 384, height: 854 },
  'iPad': { width: 768, height: 1024 }
};

describe('Mobile Responsiveness', () => {
  Object.entries(mobileViewports).forEach(([device, viewport]) => {
    it(`should render correctly on ${device}`, async () => {
      await page.setViewport(viewport);
      await page.goto('/');
      
      const screenshot = await page.screenshot();
      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: `mobile-${device.toLowerCase().replace(/\s+/g, '-')}`
      });
    });
  });
});
```

### Touch Testing

```typescript
// Touch interaction testing
describe('Touch Interactions', () => {
  it('should handle swipe gestures', async () => {
    const card = await page.$('.swipeable-card');
    
    // Simulate swipe left
    await card.touchstart({ touches: [{ clientX: 200, clientY: 100 }] });
    await card.touchmove({ touches: [{ clientX: 50, clientY: 100 }] });
    await card.touchend({});
    
    // Verify swipe action
    expect(await page.$('.swiped-left')).toBeTruthy();
  });
});
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
