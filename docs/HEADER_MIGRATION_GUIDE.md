# Header Component Migration Guide

## Overview

This guide helps you migrate from the old monolithic header component to the new modular, platform-specific header system.

## What's New

### ✅ Benefits of the New Header System

1. **Modular Architecture**: Components are broken down into smaller, focused pieces
2. **Platform-Specific**: Optimized for iOS, Android, and Web with native-like experiences
3. **Performance Optimized**: Better memoization, reduced bundle size, and faster renders
4. **Enhanced Accessibility**: WCAG 2.1 AA compliant with comprehensive screen reader support
5. **Better Testing**: Comprehensive test coverage for reliability
6. **Type Safety**: Full TypeScript support with detailed type definitions
7. **Real Device Optimized**: Header spacing tested and optimized for actual mobile devices

### 🎯 Recent Spacing Optimizations (2025-08-06)

**Android Improvements**:

- **Status bar spacing**: Reduced to 20px for closer, more native feel
- **Device-responsive**: 18px (small phones), 20px (medium), 24px (tablets)
- **Real device tested**: Validated on actual Android devices

**iOS Improvements**:

- **Safe area optimization**: Reduced default fallback to 40px
- **Device-specific**: iPhone X/11/12/13 (40px), Pro Max (42px), iPhone 14 Pro (48px)

**Cross-Platform**:

- **Responsive design**: Adapts to screen sizes and orientations
- **Performance optimized**: Uses CSS variables for efficient updates

### 🏗️ Architecture Changes

**Before (Monolithic)**:

```
src/components/header.tsx (476 lines)
├── All logic in one file
├── Mixed concerns
├── Platform detection inline
└── Limited reusability
```

**After (Modular)**:

```
src/components/header/
├── index.ts                     # Clean exports
├── types.ts                     # Type definitions
├── constants.ts                 # Shared constants
├── HeaderProvider.tsx           # Context management
├── OptimizedHeaderProvider.tsx  # Performance optimizations
├── PlatformHeader.tsx           # Platform selection
├── components/                  # Individual components
├── platforms/                   # Platform-specific implementations
├── utils/                       # Utilities
└── __tests__/                   # Comprehensive tests
```

## Migration Steps

### Step 1: No Changes Required (Basic Usage)

If you're using the header with default settings, **no changes are required**:

```tsx
// This continues to work exactly the same
import Header from '@/components/header';

function App() {
  return (
    <div>
      <Header />
      <main id="main-content">{/* Your content */}</main>
    </div>
  );
}
```

### Step 2: Advanced Usage Migration

If you were customizing the header, here's how to migrate:

**Before**:

```tsx
// Old approach - limited customization
import Header from '@/components/header';

function App() {
  return <Header />;
}
```

**After**:

```tsx
// New approach - full customization
import { OptimizedHeaderProvider, PlatformHeader, Logo, BackButton, Title } from '@/components/header';

function App() {
  return (
    <OptimizedHeaderProvider>
      <PlatformHeader variant="navigation" />
      {/* Or build custom header */}
      <header>
        <Logo size="large" />
        <Title title="Custom Title" />
        <BackButton onNavigate={handleNavigation} />
      </header>
    </OptimizedHeaderProvider>
  );
}
```

### Step 3: Platform-Specific Customization

**New Feature**: Platform-specific headers

```tsx
import { IOSHeader, AndroidHeader, WebHeader, useHeaderPlatform } from '@/components/header';

function CustomHeader() {
  const { deviceInfo } = useHeaderPlatform();

  // Use specific platform header
  switch (deviceInfo.platform) {
    case 'ios':
      return <IOSHeader className="custom-ios-styles" />;
    case 'android':
      return <AndroidHeader className="custom-android-styles" />;
    default:
      return <WebHeader className="custom-web-styles" />;
  }
}
```

## Breaking Changes

### ⚠️ Minimal Breaking Changes

The new system is designed to be **backward compatible**. However, there are a few edge cases:

1. **Direct component imports**: If you were importing internal components directly
2. **Custom styling**: Some CSS classes may have changed
3. **Event handlers**: Navigation handling is now centralized in context

### Migration for Edge Cases

**1. Direct Component Imports**:

```tsx
// Before (if you were doing this)
import { BackIcon } from '@/components/header';

// After
import { BackIcon } from '@/components/icons/back';
import { BackButton } from '@/components/header';
```

**2. Custom Styling**:

```tsx
// Before
<header className="custom-header-styles">

// After - use the className prop
<PlatformHeader className="custom-header-styles" />
```

**3. Navigation Handling**:

```tsx
// Before (manual navigation)
const navigate = useNavigate();
const handleBack = () => navigate(-1);

// After (use context)
import { useHeaderNavigation } from '@/components/header';

const { handleNavigation } = useHeaderNavigation();
// handleNavigation(-1) is automatically optimized
```

## Performance Improvements

### Automatic Optimizations

The new header system includes automatic performance optimizations:

1. **Memoization**: All components use React.memo and useMemo
2. **Throttled Scrolling**: Scroll events are throttled for better performance
3. **Bundle Splitting**: Components can be lazy-loaded
4. **Memory Management**: Automatic cleanup of event listeners and timers

### Monitoring Performance

Enable performance monitoring in development:

```tsx
import { OptimizedHeaderProvider } from '@/components/header';

function App() {
  return (
    <OptimizedHeaderProvider
      enablePerformanceMonitoring={true} // Enable in development
      enablePreloading={true} // Preload critical resources
    >
      <PlatformHeader />
    </OptimizedHeaderProvider>
  );
}
```

## Accessibility Improvements

### New Accessibility Features

1. **WCAG 2.1 AA Compliance**: Full compliance with accessibility standards
2. **Enhanced Screen Reader Support**: Better announcements and descriptions
3. **Improved Keyboard Navigation**: Comprehensive keyboard support
4. **Focus Management**: Better focus indicators and management
5. **Color Contrast**: Automatic contrast checking utilities

### Testing Accessibility

```bash
# Run accessibility tests
npm test src/components/header/__tests__/HeaderAccessibility.test.tsx

# Run all header tests
npm test src/components/header/__tests__/
```

## Testing Migration

### New Test Structure

The new system includes comprehensive tests:

```bash
src/components/header/__tests__/
├── Header.test.tsx              # Component functionality
├── HeaderAccessibility.test.tsx # Accessibility compliance
└── HeaderPerformance.test.tsx   # Performance benchmarks
```

### Running Tests

```bash
# Test specific components
npm test -- --testPathPattern=header

# Test accessibility
npm test -- --testNamePattern="accessibility"

# Test performance
npm test -- --testNamePattern="performance"
```

## Troubleshooting

### Common Issues and Solutions

**1. "useHeaderContext must be used within a HeaderProvider"**

```tsx
// Solution: Wrap with provider
<OptimizedHeaderProvider>
  <YourComponent />
</OptimizedHeaderProvider>
```

**2. Platform detection not working**

```tsx
// Check user agent and device info
import { useHeaderPlatform } from '@/components/header';

const { deviceInfo } = useHeaderPlatform();
console.log('Platform:', deviceInfo.platform);
```

**3. Styling issues**

```tsx
// Use platform-specific classes
import { useHeaderPlatform } from '@/components/header';

const { getPlatformClasses } = useHeaderPlatform();
const classes = getPlatformClasses('base-classes');
```

**4. Performance issues**

```tsx
// Enable monitoring to identify bottlenecks
<OptimizedHeaderProvider enablePerformanceMonitoring={true}>
  <PlatformHeader />
</OptimizedHeaderProvider>
```

## Rollback Plan

If you need to rollback to the old header:

1. **Keep the old file**: The old header.tsx is preserved as header.legacy.tsx
2. **Switch imports**: Change import paths temporarily
3. **Gradual migration**: Migrate page by page if needed

```tsx
// Temporary rollback
import Header from '@/components/header.legacy';
```

## Support and Resources

### Documentation

- [Header README](../src/components/header/README.md)
- [Component API Documentation](../src/components/header/types.ts)
- [Platform-Specific Guidelines](../src/components/header/platforms/)

### Getting Help

1. Check the troubleshooting section above
2. Review test files for usage examples
3. Check console for performance monitoring output
4. Run accessibility tests to identify issues

### Best Practices

1. Always use the HeaderProvider wrapper
2. Test across all target platforms
3. Monitor performance in development
4. Run accessibility tests regularly
5. Follow semantic HTML practices

## Timeline

- **Phase 1**: New system available (backward compatible)
- **Phase 2**: Gradual migration of existing pages
- **Phase 3**: Deprecation of old system (6 months)
- **Phase 4**: Removal of legacy code (12 months)

The new header system is production-ready and provides significant improvements in performance, accessibility, and maintainability while maintaining backward compatibility.
