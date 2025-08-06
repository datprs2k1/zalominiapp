# Footer Quick Reference Guide

## 🚀 Quick Start

### Basic Usage (Automatic)

```tsx
import Footer from '@/components/footer';

// Automatically detects platform and renders appropriate footer
<Footer />
```

### Platform-Specific Usage

```tsx
import { iOSFooter, AndroidFooter, UniversalFooter } from '@/components/footer';

// Use specific platform footer
<iOSFooter items={items} deviceInfo={deviceInfo} platformStyles={styles} />
```

## 📁 File Structure

```
src/components/footer/
├── index.ts              # Main exports
├── types.ts              # TypeScript interfaces
├── constants.ts          # Platform styles & dimensions
├── utils.ts              # Utilities & haptic feedback
├── hooks.ts              # Custom React hooks
├── navigation-items.tsx  # Navigation items & icons
├── BaseFooter.tsx        # Shared base component
├── iOSFooter.tsx         # iOS implementation
├── AndroidFooter.tsx     # Android implementation
└── UniversalFooter.tsx   # Web implementation
```

## 🎯 Key Imports

```tsx
// Main footer component
import Footer from '@/components/footer';

// Platform-specific components
import { iOSFooter, AndroidFooter, UniversalFooter, BaseFooter } from '@/components/footer';

// Hooks
import { useFooterNavigation, useDeviceInfo, useFooterAnimations } from '@/components/footer';

// Utilities
import { detectPlatform, hapticFeedback, getPlatformStyles } from '@/components/footer';

// Constants & Types
import { IOS_STYLES, ANDROID_STYLES, WEB_STYLES, DIMENSIONS } from '@/components/footer';
import type { NavigationItem, DeviceInfo, PlatformStyles } from '@/components/footer';

// Navigation items
import { createNavigationItems, DEFAULT_NAV_ITEMS } from '@/components/footer';
```

## 🔧 Common Patterns

### Custom Navigation Items

```tsx
import { NavigationItem } from '@/components/footer';

const customItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: <HomeIcon />,
    ariaLabel: 'Navigate to home page',
    badge: 5, // Optional notification badge
  },
];
```

### Using Hooks

```tsx
function CustomFooter() {
  // Get device information
  const deviceInfo = useDeviceInfo();
  
  // Navigation logic
  const { handleItemPress, activeItem, focusedIndex } = useFooterNavigation(items);
  
  // Animation variants
  const { containerVariants, itemVariants } = useFooterAnimations(false);
  
  return (
    <motion.footer variants={containerVariants}>
      {/* Custom implementation */}
    </motion.footer>
  );
}
```

### Platform Detection

```tsx
import { detectPlatform, getPlatformStyles } from '@/components/footer';

const platform = detectPlatform();
const styles = getPlatformStyles(platform.platform);

console.log(platform); // { platform: 'ios', isTouch: true, userAgent: '...' }
```

### Haptic Feedback

```tsx
import { hapticFeedback } from '@/components/footer';

// Trigger haptic feedback
hapticFeedback.selection();      // Light selection feedback
hapticFeedback.impactLight();    // Light impact
hapticFeedback.impactMedium();   // Medium impact
hapticFeedback.impactHeavy();    // Heavy impact

// Or use the trigger method
hapticFeedback.trigger('selection');
```

## 🎨 Customization

### Custom Platform Styles

```tsx
import { PlatformStyles } from '@/components/footer';

const customStyles: PlatformStyles = {
  colors: {
    primary: '#your-brand-color',
    background: 'rgba(255, 255, 255, 0.95)',
    // ... other color overrides
  },
  typography: {
    fontFamily: 'Your-Custom-Font, system-ui, sans-serif',
    // ... other typography overrides
  },
  // ... other style overrides
};
```

### Custom Button Rendering

```tsx
<BaseFooter
  items={items}
  deviceInfo={deviceInfo}
  platformStyles={styles}
  dimensions={dimensions}
  renderCustomButton={(item, index, defaultProps) => (
    <CustomButton {...defaultProps} item={item}>
      {/* Custom button implementation */}
    </CustomButton>
  )}
/>
```

### Custom Badge Rendering

```tsx
<BaseFooter
  renderCustomBadge={(badgeCount) => (
    <CustomBadge count={badgeCount} />
  )}
  // ... other props
/>
```

## 📱 Platform Differences

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| **Height** | 83px | 80px | 80px |
| **Font** | SF Pro | Roboto | Inter |
| **Touch Target** | 44px min | 48px min | 48px min |
| **Safe Area** | 34px | 24px | 16px |
| **Haptics** | ✅ | ✅ | ❌ |
| **Backdrop Blur** | ✅ | ✅ | ✅ |

## 🔍 Debugging

### Check Platform Detection

```tsx
import { useDeviceInfo } from '@/components/footer';

function DebugInfo() {
  const deviceInfo = useDeviceInfo();
  
  return (
    <div>
      <p>Platform: {deviceInfo.platform}</p>
      <p>Touch: {deviceInfo.isTouch ? 'Yes' : 'No'}</p>
      <p>Screen: {deviceInfo.screenSize}</p>
      <p>Orientation: {deviceInfo.orientation}</p>
      <p>Safe Areas: {JSON.stringify(deviceInfo.safeAreas)}</p>
    </div>
  );
}
```

### Performance Monitoring

```tsx
// Check if components are lazy loaded
console.log('Footer components loaded:', {
  main: !!Footer,
  ios: !!iOSFooter,
  android: !!AndroidFooter,
  universal: !!UniversalFooter,
});
```

## ⚡ Performance Tips

1. **Use the main Footer component** - It handles lazy loading automatically
2. **Avoid inline objects** - Use the provided constants and utilities
3. **Leverage shared hooks** - Don't recreate navigation logic
4. **Use platform detection** - Only load what you need
5. **Enable haptics conditionally** - Check device support first

## 🐛 Common Issues

### Footer Not Appearing

```tsx
// Check if route has back navigation enabled
const [handle] = useRouteHandle();
if (handle.back) {
  // Footer is hidden on back navigation routes
}
```

### Platform Detection Issues

```tsx
// Force platform detection update
window.dispatchEvent(new Event('resize'));
```

### Haptic Feedback Not Working

```tsx
// Check if haptics are supported
import { hapticFeedback } from '@/components/footer';

if (hapticFeedback.isSupported) {
  hapticFeedback.selection();
} else {
  console.log('Haptics not supported on this device');
}
```

### Animation Performance

```tsx
// Check for reduced motion preference
const prefersReducedMotion = useReducedMotion();

// Animations are automatically disabled if user prefers reduced motion
```

## 📚 Related Documentation

- [Footer Architecture v2.0](./FOOTER_ARCHITECTURE_V2.md) - Complete architecture overview
- [Mobile Footer Components](./MOBILE_FOOTER_COMPONENTS.md) - Detailed component documentation
- [iOS Human Interface Guidelines](./IOS_HUMAN_INTERFACE_GUIDELINES_SPECS.md) - iOS design specifications
- [Android Material Design](./ANDROID_MATERIAL_DESIGN_3_SPECS.md) - Android design specifications

## 🆘 Need Help?

1. Check the [troubleshooting section](./MOBILE_FOOTER_COMPONENTS.md#troubleshooting)
2. Review the [migration guide](./MOBILE_FOOTER_COMPONENTS.md#migration-guide)
3. Look at [usage examples](./MOBILE_FOOTER_COMPONENTS.md#usage-examples)
4. Check the [architecture documentation](./FOOTER_ARCHITECTURE_V2.md)
