# Header Components Documentation

## Overview

The header component system provides a clean, modular, and platform-specific header implementation for the Zalo Mini App Healthcare application. It supports iOS, Android, and Web platforms with optimized performance and comprehensive accessibility features.

## Architecture

### Core Components

```
src/components/header/
├── index.ts                     # Main exports
├── types.ts                     # TypeScript definitions
├── constants.ts                 # Shared constants
├── HeaderProvider.tsx           # Context provider
├── OptimizedHeaderProvider.tsx  # Performance-optimized provider
├── PlatformHeader.tsx           # Platform-specific header selector
├── HeaderErrorBoundary.tsx      # Error handling
├── components/                  # Individual components
│   ├── SkipLink.tsx
│   ├── NavigationStatus.tsx
│   ├── Logo.tsx
│   ├── OptimizedLogo.tsx
│   ├── Branding.tsx
│   ├── BackButton.tsx
│   ├── OptimizedBackButton.tsx
│   └── Title.tsx
├── platforms/                   # Platform-specific implementations
│   ├── BaseHeader.tsx
│   ├── IOSHeader.tsx
│   ├── AndroidHeader.tsx
│   └── WebHeader.tsx
├── utils/                       # Utilities
│   ├── performance.ts
│   └── accessibility.ts
└── __tests__/                   # Test files
    ├── Header.test.tsx
    ├── HeaderAccessibility.test.tsx
    └── HeaderPerformance.test.tsx
```

## Usage

### Basic Usage

```tsx
import Header from '@/components/header';

function App() {
  return (
    <div>
      <Header />
      <main id="main-content">{/* Your app content */}</main>
    </div>
  );
}
```

### Advanced Usage with Custom Configuration

```tsx
import { HeaderProvider, PlatformHeader } from '@/components/header';

function App() {
  return (
    <HeaderProvider>
      <PlatformHeader variant="navigation" />
      <main id="main-content">{/* Your app content */}</main>
    </HeaderProvider>
  );
}
```

### Using Optimized Components

```tsx
import { OptimizedHeaderProvider, PlatformHeader } from '@/components/header';

function App() {
  return (
    <OptimizedHeaderProvider enablePerformanceMonitoring={true} enablePreloading={true}>
      <PlatformHeader />
      <main id="main-content">{/* Your app content */}</main>
    </OptimizedHeaderProvider>
  );
}
```

## Platform-Specific Features

### iOS Header

- Follows iOS Human Interface Guidelines
- Backdrop blur effect
- iOS-specific animations and transitions
- Native-like touch feedback
- **Optimized safe area spacing**: 32-48px based on device model
- **Device-specific adjustments**: iPhone X/11/12/13 (40px), Pro Max (42px), iPhone 14 Pro (48px)

### Android Header

- Implements Material Design 3 principles
- Material Design elevation and shadows
- Android-specific easing curves
- Material touch ripple effects
- **Optimized status bar spacing**: 20px for closer, more native feel
- **Device-responsive spacing**: 18px (small), 20px (medium), 24px (tablets)
- **Real device optimized**: Tested and adjusted for actual Android devices

### Web Header

- Enhanced desktop experience
- Medical background patterns
- Animated medical icons
- Optimized for mouse and keyboard interaction
- **Responsive spacing**: 20px base with screen-size adjustments

## Components

### HeaderProvider

Provides shared context and state management for all header components.

```tsx
interface HeaderProviderProps {
  children: ReactNode;
}
```

### PlatformHeader

Automatically selects the appropriate header implementation based on the current platform.

```tsx
interface HeaderProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'main' | 'navigation' | 'profile';
}
```

### Logo

Medical app logo with platform-specific styling and animations.

```tsx
interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}
```

### BackButton

Navigation back button with accessibility features.

```tsx
interface BackButtonProps {
  onNavigate: (to: To) => void;
  isNavigating?: boolean;
  className?: string;
  'aria-label'?: string;
}
```

### Title

Header title with platform-specific typography.

```tsx
interface TitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  truncate?: boolean;
}
```

## Accessibility Features

### WCAG 2.1 AA Compliance

- Proper semantic HTML structure
- Comprehensive ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

### Keyboard Navigation

- Skip link for main content
- Tab order management
- Enter/Space key support
- Focus indicators

### Screen Reader Support

- Live regions for status updates
- Descriptive labels and descriptions
- Hidden decorative elements
- Proper heading hierarchy

## Performance Optimizations

### Memoization

- React.memo for component optimization
- useMemo for expensive calculations
- useCallback for event handlers
- Memoized CSS classes

### Bundle Size

- Tree-shakable exports
- Lazy loading for heavy components
- Optimized dependencies
- Code splitting support

### Runtime Performance

- Throttled scroll events
- Efficient re-renders
- Memory leak prevention
- Animation optimization

## Testing

### Unit Tests

```bash
npm test src/components/header/__tests__/Header.test.tsx
```

### Accessibility Tests

```bash
npm test src/components/header/__tests__/HeaderAccessibility.test.tsx
```

### Performance Tests

```bash
npm test src/components/header/__tests__/HeaderPerformance.test.tsx
```

## Configuration

### Constants

All configuration is centralized in `constants.ts`:

```tsx
export const ACCESSIBILITY_LABELS = {
  skipLink: 'Chuyển đến nội dung chính',
  navigationStatus: 'Đang chuyển trang...',
  mainHeader: 'Ứng dụng y tế Zalo - Trang chủ bệnh viện',
  // ... more labels
};

export const HEADER_HEIGHTS = {
  ios: { compact: 44, regular: 56, large: 64 },
  android: { compact: 48, regular: 56, large: 64 },
  web: { compact: 56, regular: 64, large: 72 },
};
```

### Styling

Platform-specific styles are automatically applied based on device detection:

```tsx
// iOS styles
backdrop-blur-md bg-white/95 border-b border-gray-200/50

// Android styles
bg-white border-b border-gray-200/60 shadow-sm

// Web styles
bg-white with medical background patterns
```

## Header Spacing Optimizations

### Recent Updates (2025-08-06)

The header spacing has been optimized for real device usage based on user feedback and testing on actual mobile devices.

### Android Spacing Optimizations

**Status Bar Spacing**:

- **Primary spacing**: Reduced to **20px** for closer, more native feel
- **Device-specific adjustments**:
  - Small phones (≤480px): **18px**
  - Medium phones (481-768px): **20px**
  - Tablets (≥769px): **24px**
  - Landscape mode: **16px**

**Header Heights**:

- **Compact**: 44px (reduced from 48px)
- **Regular**: 52px (reduced from 56px)
- **Large**: 60px (reduced from 64px)

### iOS Spacing Optimizations

**Safe Area Handling**:

- **Default fallback**: 40px (optimized from 44px)
- **Device-specific spacing**:
  - iPhone X/11/12/13: 40px
  - iPhone Pro Max: 42px
  - iPhone 14 Pro: 48px

### Implementation Details

The spacing optimizations are implemented across multiple files:

1. **`src/components/platform-status-bar.tsx`**: Core status bar height definitions
2. **`src/styles/mobile.css`**: Responsive media queries and device-specific rules
3. **`src/components/header/constants.ts`**: Platform-specific header height constants
4. **`src/components/safe-area-view.tsx`**: Safe area variable management

### CSS Variables

The system uses CSS custom properties for dynamic spacing:

```css
--status-bar-height: 20px (Android) / 44px (iOS) --safe-area-inset-top: Device-specific values
  --safe-area-inset-bottom: Platform-optimized values;
```

### Testing and Validation

- ✅ **Real device testing**: Validated on actual Android and iOS devices
- ✅ **Cross-platform consistency**: Maintains platform-specific design guidelines
- ✅ **Responsive design**: Adapts to different screen sizes and orientations
- ✅ **Accessibility compliance**: Maintains proper touch targets and focus states

## Migration Guide

### From Old Header

1. Replace the old header import:

```tsx
// Old
import Header from '@/components/header';

// New
import Header from '@/components/header';
// No changes needed for basic usage!
```

2. For advanced usage, use the new modular components:

```tsx
// Old monolithic approach
// Everything was in one large component

// New modular approach
import { HeaderProvider, PlatformHeader, Logo, BackButton } from '@/components/header';
```

## Best Practices

1. **Always wrap with HeaderProvider** for context access
2. **Use semantic HTML** for better accessibility
3. **Test across platforms** to ensure consistent behavior
4. **Monitor performance** in development mode
5. **Follow WCAG guidelines** for accessibility compliance

## Troubleshooting

### Common Issues

1. **Context not found error**

   - Ensure components are wrapped with HeaderProvider

2. **Platform detection issues**

   - Check user agent string and device detection logic

3. **Performance issues**

   - Enable performance monitoring
   - Check for memory leaks
   - Optimize re-renders

4. **Accessibility violations**
   - Run accessibility tests
   - Check ARIA attributes
   - Verify keyboard navigation

## Contributing

When contributing to the header components:

1. Follow the established architecture patterns
2. Add comprehensive tests for new features
3. Ensure accessibility compliance
4. Update documentation
5. Test across all platforms
