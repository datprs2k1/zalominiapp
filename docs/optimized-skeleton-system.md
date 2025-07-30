# Optimized Medical Skeleton Loading System

## Overview

The optimized skeleton loading system provides a comprehensive, accessible, and performant solution for loading states in the healthcare website application. It features medical-appropriate colors, smooth transitions, accessibility compliance, and advanced performance monitoring.

## Key Features

### 🏥 Medical Design System Integration
- **Medical Color Palette**: Uses healthcare-appropriate colors (#2563EB, #1E40AF, #10B981, #059669, #FAFBFC)
- **Professional Aesthetics**: Premium medical facility visual hierarchy
- **Context-Aware Styling**: Different variants for different medical contexts

### ♿ WCAG 2.1 AA Compliance
- **Screen Reader Support**: Comprehensive ARIA attributes and announcements
- **Reduced Motion**: Full support for `prefers-reduced-motion`
- **High Contrast**: Automatic detection and support for high contrast mode
- **Focus Management**: Proper focus handling during transitions

### ⚡ Performance Optimizations
- **Hardware Acceleration**: GPU-accelerated animations with `transform3d`
- **Memoization**: React.memo and useMemo for preventing unnecessary re-renders
- **Intersection Observer**: Lazy loading for off-screen skeletons
- **Virtual Scrolling**: Support for large lists with virtualization

### 🎭 Smooth Transitions
- **Medical Easing**: Healthcare-appropriate easing functions
- **Context-Aware Timing**: Different durations based on medical context
- **Progressive Loading**: Multi-stage loading with progress indication
- **Staggered Animations**: Coordinated animations for multiple elements

## Components

### Core Components

#### `MedicalSkeleton`
Basic skeleton component with medical styling.

```tsx
import { MedicalSkeleton } from '@/components/enhanced-medical-skeleton';

<MedicalSkeleton
  variant="primary"        // primary | secondary | neutral | fast
  size="md"               // sm | md | lg | xl
  shape="rectangle"       // rectangle | circle | rounded | pill
  width="w-full"
  height="h-4"
  animated={true}
  ariaLabel="Đang tải nội dung y tế..."
/>
```

#### `MedicalSkeletonCard`
Pre-built card skeleton for medical content.

```tsx
import { MedicalSkeletonCard } from '@/components/enhanced-medical-skeleton';

<MedicalSkeletonCard
  variant="primary"
  showImage={true}
  showTitle={true}
  showDescription={true}
  showActions={false}
  animated={true}
/>
```

#### `AccessibleMedicalSkeleton`
Enhanced skeleton with comprehensive accessibility features.

```tsx
import { AccessibleMedicalSkeleton } from '@/components/accessible-medical-skeleton';

<AccessibleMedicalSkeleton
  variant="primary"
  accessibility={{
    announceLoading: true,
    announceComplete: false,
    respectReducedMotion: true,
    highContrast: false,
    focusManagement: true,
  }}
/>
```

### Advanced Components

#### `SmoothSkeletonTransition`
Provides seamless transitions between skeleton and content states.

```tsx
import { SmoothSkeletonTransition } from '@/components/smooth-skeleton-transitions';

<SmoothSkeletonTransition
  isLoading={isLoading}
  transitionType="medical"    // fade | slide | scale | medical | crossfade
  duration={400}
  skeleton={<MedicalSkeleton />}
  onTransitionStart={() => console.log('Transition started')}
  onTransitionComplete={() => console.log('Transition completed')}
>
  <YourContent />
</SmoothSkeletonTransition>
```

#### `ContentAwareSkeleton`
Intelligent skeleton that adapts to different content types.

```tsx
import { ContentAwareSkeleton } from '@/components/advanced-skeleton-patterns';

<ContentAwareSkeleton
  contentType="doctor"        // doctor | service | department | appointment | news
  layout="card"              // card | list | grid | detail | compact
  showImage={true}
  showActions={true}
/>
```

#### `ProgressiveMedicalSkeleton`
Multi-stage loading with progress indication.

```tsx
import { ProgressiveMedicalSkeleton } from '@/components/advanced-skeleton-patterns';

<ProgressiveMedicalSkeleton
  stages={[
    { name: 'Loading structure', duration: 500, content: <BasicSkeleton /> },
    { name: 'Loading details', duration: 300, content: <DetailedSkeleton /> },
    { name: 'Finalizing', duration: 200, content: <FinalSkeleton /> },
  ]}
  onStageComplete={(stageName) => console.log(`Completed: ${stageName}`)}
/>
```

## Hooks

### `useEnhancedLoadingState`
Comprehensive loading state management with medical context.

```tsx
import { useEnhancedLoadingState } from '@/hooks/use-enhanced-loading-state';

const {
  loadingState,
  setLoading,
  setProgress,
  setStage,
  setError,
  clearLoading,
  shouldShowSkeleton,
  loadingDuration,
} = useEnhancedLoadingState({
  minLoadingTime: 300,
  maxLoadingTime: 10000,
  enableSkeletonFallback: true,
  medicalContext: 'appointment',
  priority: 'normal',
});
```

### `useRouteLoadingState`
Route-specific loading state management.

```tsx
import { useRouteLoadingState } from '@/hooks/use-enhanced-loading-state';

const {
  showRouteLoading,
  setShowRouteLoading,
  isNavigating,
  isTransitioning,
  navigationState,
  transitionDirection,
} = useRouteLoadingState();
```

### `useSkeletonPerformanceTracking`
Performance monitoring for skeleton components.

```tsx
import { useSkeletonPerformanceTracking } from '@/utils/skeleton-performance-monitor';

const {
  recordRender,
  recordLoadingDuration,
  recordTransitionDuration,
  recordVisibilityChange,
} = useSkeletonPerformanceTracking('DoctorCard');
```

## Performance Monitoring

### Automatic Monitoring
The system includes built-in performance monitoring that tracks:

- **Render Times**: Individual component render performance
- **Loading Durations**: Time from loading start to completion
- **Transition Times**: Animation and transition durations
- **Memory Usage**: JavaScript heap usage monitoring
- **Re-render Counts**: Detection of excessive re-renders

### Performance Thresholds
- **Max Render Time**: 16ms (60fps target)
- **Max Render Count**: 10 re-renders per component
- **Max Loading Duration**: 3000ms
- **Max Memory Usage**: 50MB

### Performance Reports
Automatic reports every 30 seconds in development mode:

```
🏥 Medical Skeleton Performance Report
Total Skeletons: 12
Average Render Time: 8.45ms
Slowest Component: DoctorProfileSkeleton
Most Rendered Component: MedicalSkeleton
Memory Usage: 23.45MB
Recommendations: ['Skeleton performance is optimal']
```

## Accessibility Features

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for all skeleton elements
- **Live Regions**: Announcements for loading state changes
- **Status Updates**: Progress announcements for multi-stage loading

### Reduced Motion
- **System Preference**: Automatic detection of `prefers-reduced-motion`
- **User Override**: Manual toggle for reduced motion
- **Graceful Fallbacks**: Static alternatives for all animations

### High Contrast
- **System Detection**: Automatic high contrast mode detection
- **Enhanced Borders**: Increased border visibility in high contrast
- **Color Adjustments**: Optimized colors for better visibility

### Focus Management
- **Focus Preservation**: Maintains focus during transitions
- **Focus Restoration**: Returns focus after loading completes
- **Keyboard Navigation**: Full keyboard accessibility

## Best Practices

### Performance
1. **Use Memoization**: Wrap skeleton components in `React.memo`
2. **Lazy Loading**: Use intersection observer for off-screen skeletons
3. **Minimize Re-renders**: Use stable props and avoid inline objects
4. **Hardware Acceleration**: Prefer transform over layout properties

### Accessibility
1. **Provide Context**: Use descriptive ARIA labels
2. **Respect Preferences**: Always check for reduced motion
3. **Announce Changes**: Use live regions for status updates
4. **Test with Screen Readers**: Verify with actual assistive technology

### User Experience
1. **Match Content Layout**: Skeleton should mirror actual content
2. **Appropriate Timing**: Don't show skeletons for very fast loads
3. **Progressive Enhancement**: Show basic skeleton first, then details
4. **Consistent Styling**: Use medical color palette throughout

## Migration Guide

### From Basic Skeletons
```tsx
// Before
<div className="animate-pulse bg-gray-200 h-4 w-full rounded" />

// After
<MedicalSkeleton variant="primary" height="h-4" width="w-full" />
```

### From Custom Loading States
```tsx
// Before
const [isLoading, setIsLoading] = useState(false);

// After
const { loadingState, setLoading, shouldShowSkeleton } = useEnhancedLoadingState({
  medicalContext: 'doctor',
});
```

### Route Integration
```tsx
// Before
{isLoading && <BasicSkeleton />}
{!isLoading && <Content />}

// After
<SmoothSkeletonTransition
  isLoading={isLoading}
  skeleton={<ContentAwareSkeleton contentType="doctor" />}
>
  <Content />
</SmoothSkeletonTransition>
```

## Testing

### Unit Tests
```bash
npm test -- skeleton-components.test.tsx
```

### Accessibility Tests
```bash
npm run test:a11y
```

### Performance Tests
```bash
npm run test:performance
```

### Visual Regression Tests
```bash
npm run test:visual
```

## Configuration

### CSS Variables
```css
:root {
  --skeleton-primary-bg: #F0F4FF;
  --skeleton-primary-shimmer: #E6EFFF;
  --skeleton-secondary-bg: #F0FDF9;
  --skeleton-secondary-shimmer: #E6FFFA;
  --skeleton-neutral-bg: #FAFBFC;
  --skeleton-neutral-shimmer: #F8F9FB;
  --skeleton-animation-duration: 1.5s;
  --skeleton-transition-duration: 0.4s;
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "types": ["@testing-library/jest-dom", "jest-axe"]
  }
}
```

## Troubleshooting

### Common Issues

1. **Skeleton not showing**: Check `shouldShowSkeleton` logic
2. **Poor performance**: Enable performance monitoring
3. **Accessibility violations**: Run axe tests
4. **Animation issues**: Verify reduced motion settings

### Debug Mode
```tsx
import { SkeletonPerformanceMetrics } from '@/components/optimized-skeleton-performance';

// Add to your app in development
{process.env.NODE_ENV === 'development' && <SkeletonPerformanceMetrics />}
```

## Support

For issues or questions about the skeleton system:
1. Check the performance monitor for bottlenecks
2. Run accessibility tests with axe
3. Review the component documentation
4. Check the test suite for examples
