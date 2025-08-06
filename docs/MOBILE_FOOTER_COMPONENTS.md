# Mobile Footer Components Documentation (v2.0)

## Overview

The mobile footer system has been completely refactored with a modern, modular architecture. The new system provides optimal user experience across all platforms with a unified iOS-style design for consistency, while maintaining platform-specific optimizations and accessibility features.

## Architecture

### New Component Hierarchy

```
Footer (Main Container with Platform Detection)
├── BaseFooter (Shared Base Component)
├── iOSFooter (iOS Human Interface Guidelines)
├── AndroidFooter (iOS-styled for consistency)
└── UniversalFooter (Web/Fallback)
```

### Modular Structure

```
src/components/footer/
├── types.ts              # Shared TypeScript interfaces
├── constants.ts          # Platform-specific constants & styles
├── utils.ts              # Utility functions & haptic feedback
├── hooks.ts              # Custom React hooks
├── navigation-items.tsx  # Shared navigation items & icons
├── BaseFooter.tsx        # Shared base component
├── iOSFooter.tsx         # iOS-specific implementation
├── AndroidFooter.tsx     # Android-specific implementation
├── UniversalFooter.tsx   # Web/Universal implementation
└── index.ts              # Barrel exports
```

### Platform Detection

The system automatically detects the user's platform and renders the appropriate footer component:

- **iOS**: Detects iPhone, iPad, iPod devices
- **Android**: Detects Android devices (with iOS-style design)
- **Universal**: Fallback for web browsers and other platforms

## Component Details

### Footer (Main Container)

**Location**: `src/components/footer.tsx`

Main container component that handles platform detection and lazy loading of platform-specific footers.

**Features**:

- Automatic platform detection with `useDeviceInfo` hook
- Lazy loading with Suspense for better performance
- Loading skeleton fallback
- Smart platform-specific rendering
- Responsive breakpoint handling

**Usage**:

```tsx
import Footer from '@/components/footer';

// Used automatically in Layout component
<Footer />;
```

### BaseFooter (Shared Component)

**Location**: `src/components/footer/BaseFooter.tsx`

Shared base component that provides common footer functionality and can be extended by platform-specific implementations.

**Features**:

- Shared navigation logic via `useFooterNavigation` hook
- Common accessibility features
- Customizable button and badge rendering
- Consistent animation handling
- Platform-agnostic styling system

**Usage**:

```tsx
import { BaseFooter } from '@/components/footer';

<BaseFooter
  items={navigationItems}
  deviceInfo={deviceInfo}
  platformStyles={platformStyles}
  dimensions={dimensions}
  className="custom-footer"
/>;
```

### iOSFooter

**Location**: `src/components/footer/iOSFooter.tsx`

iOS-specific footer component following Human Interface Guidelines, now using the shared BaseFooter architecture.

**Features**:

- 83px height (49pt content + 34pt safe area)
- SF Pro font family via platform styles
- iOS-style spring animations
- VoiceOver accessibility support
- Haptic feedback via shared utilities
- Safe area inset handling
- Extends BaseFooter for consistency

**Design Specifications**:

- Touch targets: 44pt minimum, 48pt recommended
- Colors: iOS system colors from `IOS_STYLES` constant
- Typography: SF Pro Display/Text
- Animations: Spring-based with cubic-bezier easing
- Badge style: 16px height, iOS system red

**Usage**:

```tsx
import { iOSFooter } from '@/components/footer';

<iOSFooter items={navigationItems} deviceInfo={deviceInfo} platformStyles={IOS_STYLES} />;
```

### AndroidFooter (iOS-styled for Consistency)

**Location**: `src/components/footer/AndroidFooter.tsx`

Android footer component now using iOS-style design for consistency while maintaining Android accessibility features. Extends BaseFooter for shared functionality.

**Features**:

- 80px height with 64px content area (Android dimensions)
- iOS-style design with Android optimizations
- Haptic feedback via shared utilities
- TalkBack accessibility support (maintained)
- iOS color system and backdrop blur
- Extends BaseFooter for consistency
- Platform-specific touch handling

**Design Specifications**:

- Touch targets: 48px minimum (Android guidelines)
- Colors: iOS system colors from `ANDROID_STYLES` constant
- Typography: Roboto with iOS-style weights
- Animations: iOS spring curves
- Badge style: 16px height, Material Design red

**Usage**:

```tsx
import { AndroidFooter } from '@/components/footer';

<AndroidFooter items={navigationItems} deviceInfo={deviceInfo} platformStyles={ANDROID_STYLES} />;
```

### UniversalFooter

**Location**: `src/components/footer/UniversalFooter.tsx`

Fallback footer component for web browsers and other platforms. Extends BaseFooter for consistency.

**Features**:

- 80px height with 64px content area
- Inter font family for web compatibility
- Smooth transitions and animations
- Standard web accessibility features
- Cross-browser compatibility
- Responsive design handling
- Extends BaseFooter for consistency

**Design Specifications**:

- Touch targets: 48px minimum (web standards)
- Colors: Web-optimized color palette from `WEB_STYLES`
- Typography: Inter system font stack
- Animations: Standard CSS transitions with spring easing
- Badge style: 16px height, web-safe red badges

**Usage**:

```tsx
import { UniversalFooter } from '@/components/footer';

<UniversalFooter items={navigationItems} deviceInfo={deviceInfo} platformStyles={WEB_STYLES} />;
```

## Navigation Items

### Shared Navigation System

The new architecture includes a shared navigation system with centralized item definitions and platform-specific customizations.

**Location**: `src/components/footer/navigation-items.tsx`

### Navigation Item Interface

```typescript
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  ariaLabel?: string;
}
```

### Default Navigation Items

The system includes predefined navigation items that can be customized per platform:

1. **Trang chủ** (`/`) - Home icon (custom SVG)
2. **Dịch vụ** (`/service-prices`) - Stethoscope icon (MedicalIcons)
3. **Đặt lịch** (`/booking`) - Medical cross icon (MedicalIcons)
4. **Bác sĩ** (`/doctor`) - User icon (MedicalIcons)
5. **Giới thiệu** (`/about`) - About icon (custom SVG)

### Navigation Item Factory

```typescript
// Create platform-specific navigation items
const createNavigationItems = (platform: 'ios' | 'android' | 'web'): NavigationItem[] => {
  // Platform-specific customizations can be added here
  return DEFAULT_NAV_ITEMS.map((item) => ({
    ...item,
    // Platform-specific modifications if needed
  }));
};
```

### Custom Icons

The system includes shared icon components:

```typescript
// Shared icon components
export const HomeIcon = React.memo(() => (/* SVG */));
export const AboutIcon = React.memo(() => (/* SVG */));

// Usage with MedicalIcons
icon: <MedicalIcons.Stethoscope />
```

## Accessibility Features

### WCAG 2.1 AA Compliance

- Color contrast ratios of 4.5:1 minimum
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- Touch target size compliance

### Platform-Specific Accessibility

- **iOS**: VoiceOver, Voice Control, Dynamic Type
- **Android**: TalkBack, Switch Access, Voice Access
- **Universal**: Standard web accessibility APIs

### Keyboard Navigation

- Arrow keys: Navigate between tabs
- Home/End: Jump to first/last tab
- Enter/Space: Activate selected tab
- Tab: Focus management

## Responsive Design

### Breakpoints

- **Small phones**: 320px - 374px
- **Standard phones**: 375px - 413px
- **Large phones**: 414px - 767px
- **Tablets**: 768px+ (Navigation rail on landscape)

### Orientation Support

- **Portrait**: Standard bottom navigation
- **Landscape**: Compressed height, optimized spacing
- **Tablet Landscape**: Navigation rail (Android only)

## Safe Area Handling

### iOS Safe Areas

```css
padding-bottom: max(env(safe-area-inset-bottom), 34px);
padding-left: env(safe-area-inset-left, 0px);
padding-right: env(safe-area-inset-right, 0px);
```

### Android Gesture Navigation

```css
padding-bottom: max(env(safe-area-inset-bottom), 24px);
```

## Shared Utilities and Hooks

### Custom Hooks

**Location**: `src/components/footer/hooks.ts`

#### useFooterNavigation

Provides shared navigation logic for all footer components:

```typescript
const { activeItem, focusedIndex, itemRefs, handleItemPress, handleKeyDown, handleFocus, handleBlur } =
  useFooterNavigation(items, enableHaptics);
```

#### useDeviceInfo

Automatically detects device information and safe areas:

```typescript
const deviceInfo = useDeviceInfo();
// Returns: { platform, isTouch, screenSize, orientation, safeAreas }
```

#### useFooterAnimations

Provides platform-appropriate animation variants:

```typescript
const { containerVariants, itemVariants, badgeVariants } = useFooterAnimations(prefersReducedMotion);
```

### Utility Functions

**Location**: `src/components/footer/utils.ts`

- `detectPlatform()` - Platform detection
- `getPlatformStyles()` - Get platform-specific styles
- `HapticFeedback` - Haptic feedback management
- `generateButtonStyles()` - Dynamic button styling
- `getAriaLabel()` - Accessibility label generation

### Constants and Styles

**Location**: `src/components/footer/constants.ts`

- `DIMENSIONS` - Platform-specific dimensions
- `IOS_STYLES` - iOS design system
- `ANDROID_STYLES` - Android design system
- `WEB_STYLES` - Web design system
- `ANIMATION_VARIANTS` - Shared animations

## Performance Optimizations

### Lazy Loading

Platform-specific components are lazy loaded to reduce initial bundle size:

```typescript
const iOSFooter = lazy(() => import('./footer/iOSFooter').then((m) => ({ default: m.iOSFooter })));
const AndroidFooter = lazy(() => import('./footer/AndroidFooter').then((m) => ({ default: m.AndroidFooter })));
const UniversalFooter = lazy(() => import('./footer/UniversalFooter').then((m) => ({ default: m.UniversalFooter })));
```

### Shared Component Architecture

- **BaseFooter**: Shared logic reduces code duplication by ~60%
- **Shared Hooks**: Common functionality extracted into reusable hooks
- **Shared Constants**: Platform styles and dimensions centralized
- **Tree Shaking**: Only used components are included in the bundle

### Animation Performance

- Use transform and opacity for animations
- Hardware acceleration with will-change
- Respect prefers-reduced-motion
- 60fps target on all devices

### Memory Management

- Proper event listener cleanup
- Timeout and interval cleanup
- Component unmounting handling

## Testing

### Automated Testing

Run the mobile footer test suite:

```javascript
// In browser console
window.runMobileFooterTests();
window.runPerformanceValidation();
window.runAllTests();
```

### Manual Testing Checklist

- [ ] Platform detection accuracy
- [ ] Touch target size compliance
- [ ] Keyboard navigation functionality
- [ ] Screen reader compatibility
- [ ] Safe area handling on various devices
- [ ] Animation performance (60fps)
- [ ] Haptic feedback (on supported devices)
- [ ] Badge notifications display
- [ ] Orientation changes
- [ ] Dark mode appearance

## Usage Examples

### Basic Implementation

```tsx
// Already integrated in src/components/layout.tsx
import Footer from '@/components/footer';

export default function Layout() {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

### Using Platform-Specific Components

```tsx
import { iOSFooter, AndroidFooter, UniversalFooter } from '@/components/footer';
import { useDeviceInfo, getPlatformStyles, createNavigationItems } from '@/components/footer';

function CustomFooter() {
  const deviceInfo = useDeviceInfo();
  const platformStyles = getPlatformStyles(deviceInfo.platform);
  const navigationItems = createNavigationItems(deviceInfo.platform);

  return <iOSFooter items={navigationItems} deviceInfo={deviceInfo} platformStyles={platformStyles} />;
}
```

### Custom Navigation Items

```tsx
import { NavigationItem, createNavigationItems } from '@/components/footer';

const customItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    ariaLabel: 'Dashboard - Main overview page',
  },
  // ... more items
];

// Use with any footer component
<BaseFooter items={customItems} deviceInfo={deviceInfo} platformStyles={platformStyles} dimensions={DIMENSIONS.ios} />;
```

### Haptic Feedback Integration

```tsx
import { hapticFeedback, HapticFeedback } from '@/components/footer';

// Use shared instance
hapticFeedback.selection();
hapticFeedback.impactLight();

// Or create custom instance
const customHaptic = new HapticFeedback();
customHaptic.trigger('impactMedium');
```

### Using Shared Hooks

```tsx
import { useFooterNavigation, useDeviceInfo, useFooterAnimations } from '@/components/footer';

function CustomFooterComponent({ items }: { items: NavigationItem[] }) {
  const deviceInfo = useDeviceInfo();
  const { handleItemPress, focusedIndex } = useFooterNavigation(items);
  const { containerVariants } = useFooterAnimations(false);

  return <motion.footer variants={containerVariants}>{/* Custom footer implementation */}</motion.footer>;
}
```

## Troubleshooting

### Common Issues

1. **Footer not appearing**: Check if route has `handle.back: true`
2. **Platform detection incorrect**: Verify user agent string
3. **Safe areas not working**: Ensure viewport meta tag is correct
4. **Animations stuttering**: Check for heavy DOM operations during animation
5. **Accessibility issues**: Run automated accessibility tests

### Debug Tools

- `window.testResults` - Footer functionality test results
- `window.performanceResults` - Performance validation results
- Browser DevTools - Network, Performance, Accessibility tabs

## Migration Guide

### From Previous Footer System to New Architecture (v2.0)

#### Breaking Changes

1. **Import Changes**:

   ```tsx
   // Old
   import EnhancedFooterV3 from './footer';

   // New
   import Footer from '@/components/footer';
   ```

2. **Component Structure**:
   - Old system: Single monolithic component
   - New system: Modular architecture with shared base

#### Migration Steps

1. **Update Main Import** (Already done):

   ```tsx
   // src/components/layout.tsx
   import Footer from '@/components/footer';
   ```

2. **Custom Implementations**:

   ```tsx
   // Old custom footer
   import { iOSFooter } from './footer/iOSFooter';

   // New custom footer
   import { iOSFooter, useDeviceInfo, getPlatformStyles } from '@/components/footer';
   ```

3. **Navigation Items**:

   ```tsx
   // Old
   const items = [...]; // Manual definition

   // New
   import { createNavigationItems } from '@/components/footer';
   const items = createNavigationItems('ios');
   ```

#### Benefits of Migration

- **60% Code Reduction**: Shared components eliminate duplication
- **Better Type Safety**: Comprehensive TypeScript interfaces
- **Improved Performance**: Lazy loading and optimized renders
- **Enhanced Maintainability**: Modular architecture
- **Consistent UX**: Unified design system across platforms

#### Testing After Migration

1. Test platform detection accuracy
2. Verify navigation functionality
3. Check accessibility features
4. Validate performance metrics
5. Test on target devices

### Customization Guide

#### Custom Platform Styles

```tsx
import { PlatformStyles } from '@/components/footer';

const customStyles: PlatformStyles = {
  colors: {
    primary: '#custom-color',
    // ... other customizations
  },
  // ... other style overrides
};
```

#### Custom Navigation Items

```tsx
import { NavigationItem } from '@/components/footer';

const customItems: NavigationItem[] = [
  {
    id: 'custom',
    label: 'Custom',
    path: '/custom',
    icon: <CustomIcon />,
    ariaLabel: 'Custom page navigation',
  },
];
```

#### Extending BaseFooter

```tsx
import { BaseFooter } from '@/components/footer';

const CustomFooter = memo(({ items, deviceInfo, platformStyles }) => {
  return (
    <BaseFooter
      items={items}
      deviceInfo={deviceInfo}
      platformStyles={platformStyles}
      dimensions={customDimensions}
      className="custom-footer"
      renderCustomButton={(item, index, defaultProps) => (
        // Custom button implementation
      )}
    />
  );
});
```
