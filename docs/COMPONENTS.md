# Components Documentation

## Overview

This document provides detailed information about the React components used in the Zalo Medical Mini App.

## Component Categories

### Layout Components

#### `Layout` (`src/components/layout.tsx`)

Main application layout wrapper that provides consistent structure across all pages.

**Props:**

```typescript
interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}
```

#### `Header` (`src/components/header.tsx`)

Enhanced modular header system with platform-specific implementations and medical theming.

**Architecture:**

- **Modular Design**: Separate components for different platforms (iOS, Android, Web)
- **Performance Optimized**: Lazy loading, memoization, and optimized rendering
- **Accessibility Compliant**: WCAG 2.1 AA compliance with full keyboard navigation
- **Medical Theming**: Healthcare-specific styling and branding

**Main Components:**

```typescript
// Main header component
import Header from '@/components/header';

// Platform-specific headers
import { IOSHeader, AndroidHeader, WebHeader, BaseHeader } from '@/components/header';

// Context providers
import { HeaderProvider, OptimizedHeaderProvider } from '@/components/header';
```

**Props:**

```typescript
interface HeaderProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'main' | 'navigation' | 'profile';
}

interface PlatformHeaderProps extends HeaderProps {
  platform: 'ios' | 'android' | 'web';
  deviceInfo: DeviceInfo;
  platformStyles: PlatformStyles;
}
```

**Key Features:**

- Automatic platform detection and appropriate header rendering
- Medical branding with healthcare-specific styling
- Performance monitoring in development mode
- Error boundary protection
- Skip links and navigation status for accessibility
- Responsive design with safe area support

**Usage:**

```tsx
// Basic usage
<Header />

// With custom variant
<Header variant="navigation" />

// Platform-specific usage
<IOSHeader platform="ios" deviceInfo={deviceInfo} platformStyles={styles} />
```

#### `Footer` (`src/components/footer.tsx`)

Advanced modular footer system with platform-specific implementations and medical context support.

**Architecture:**

- **Platform-Specific Components**: iOS, Android, and Universal implementations
- **Medical Context Integration**: Emergency mode, trust indicators, and health status
- **Unified Design System**: iOS-style design across all platforms for consistency
- **Performance Optimized**: Lazy loading, shared components, and optimized animations

**Main Components:**

```typescript
// Main footer component
import Footer from '@/components/footer';

// Platform-specific footers
import { iOSFooter, AndroidFooter, UniversalFooter, BaseFooter } from '@/components/footer';
```

**Props:**

```typescript
interface FooterProps {
  medicalContext?: FooterMedicalContext;
}

interface FooterMedicalContext {
  emergencyMode?: boolean;
  trustMode?: boolean;
  appointmentCount?: number;
  urgentNotifications?: number;
  healthStatus?: 'excellent' | 'good' | 'warning' | 'critical';
  trustLevel?: 'verified' | 'certified' | 'secure';
}

interface BaseFooterProps {
  items: NavigationItem[];
  deviceInfo: DeviceInfo;
  platformStyles: PlatformStyles;
}
```

**Key Features:**

- Automatic platform detection and rendering
- Medical context awareness with emergency and trust modes
- Haptic feedback on supported devices
- Accessibility compliant with ARIA labels and keyboard navigation
- Responsive design with safe area support
- Badge notifications for appointments and urgent messages
- Medical theming with healthcare-specific colors and styling

**Usage:**

```tsx
// Basic usage
<Footer />

// With medical context
<Footer
  medicalContext={{
    emergencyMode: false,
    trustMode: true,
    appointmentCount: 3,
    healthStatus: 'good'
  }}
/>

// Platform-specific usage
<iOSFooter
  items={navigationItems}
  deviceInfo={deviceInfo}
  platformStyles={styles}
  medicalContext={medicalContext}
/>
```

**Navigation Items:**

```typescript
interface NavigationItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  badge?: number;
  ariaLabel?: string;
}
```

### Medical Components

#### `MedicalCard` (`src/components/medical-card.tsx`)

Displays medical service information in card format.

**Props:**

```typescript
interface MedicalCardProps {
  service: MedicalService;
  onClick?: () => void;
  showPrice?: boolean;
  compact?: boolean;
}
```

#### `EnhancedMedicalCard` (`src/components/enhanced-medical-card.tsx`)

Advanced medical card with animations and enhanced features.

#### `MedicalForm` (`src/components/medical-form.tsx`)

Form component for medical data input and validation.

#### `MedicalIcons` (`src/components/medical-icons.tsx`)

Medical iconography system with consistent styling.

#### `OptimizedMedicalPackages` (`src/components/OptimizedMedicalPackages.tsx`)

Optimized display of medical service packages with performance enhancements.

### Doctor Components

#### Doctor Directory (`src/components/doctor/`)

Collection of doctor-related components:

- Doctor profile cards
- Doctor availability display
- Doctor rating systems
- Consultation booking interfaces

#### `DoctorInfoCards` (`src/components/doctor-info-cards.tsx`)

Displays doctor information in card format with specializations and ratings.

### UI Components

#### `Button` (`src/components/button.tsx`)

Reusable button component with multiple variants.

**Props:**

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

#### `HeroSection` (`src/components/hero-section.tsx`)

Landing page hero section with call-to-action elements.

#### `InformationCard` (`src/components/information-card.tsx`)

General-purpose information display card.

### Loading Components

#### `LoadingStates` (`src/components/loading-states.tsx`)

Various loading state components for different UI elements.

#### `EnhancedLoadingStates` (`src/components/enhanced-loading-states.tsx`)

Advanced loading patterns with animations and skeleton screens.

#### `MedicalLoadingStates` (`src/components/medical-loading-states.tsx`)

Medical-specific loading states and skeleton screens.

#### Skeleton Components

- `enhanced-medical-skeleton.tsx` - Medical content skeletons
- `accessible-medical-skeleton.tsx` - Accessible skeleton screens
- `advanced-skeleton-patterns.tsx` - Advanced skeleton patterns
- `enhanced-skeleton-wrapper.tsx` - Skeleton wrapper utilities

### Form Components

#### Form Directory (`src/components/form/`)

Collection of form-related components:

- Input fields
- Validation components
- Form layouts
- Submit handlers

### Accessibility Components

#### `Accessibility` (`src/components/accessibility.tsx`)

Core accessibility utilities and components.

#### `AccessibilitySettings` (`src/components/accessibility-settings.tsx`)

User accessibility preference settings.

#### `FocusStatesDemo` (`src/components/focus-states-demo.tsx`)

Demonstration and testing of focus states for accessibility.

### Error Handling Components

#### `ErrorBoundary` (`src/components/error-boundary.tsx`)

React error boundary for graceful error handling.

**Props:**

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
```

#### Error Directory (`src/components/error/`)

Error handling and display components.

### Animation Components

#### `EnhancedAnimations` (`src/components/enhanced-animations.tsx`)

Advanced animation components using Framer Motion.

#### `MedicalAnimations` (`src/components/medical-animations.tsx`)

Medical-specific animations and transitions.

### Search Components

#### `EnhancedSearch` (`src/components/enhanced-search.tsx`)

Advanced search component with filtering and suggestions.

**Props:**

```typescript
interface EnhancedSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  filters?: SearchFilter[];
  debounceMs?: number;
}
```

### Content Processing Components

#### `ContentProcessor` (`src/components/ContentProcessor.tsx`)

Processes and sanitizes content for safe display.

#### `HtmlContentDisplay` (`src/components/HtmlContentDisplay.tsx`)

Safely displays HTML content with sanitization.

#### `SanitizedContentExample` (`src/components/SanitizedContentExample.tsx`)

Example implementation of content sanitization.

### Utility Components

#### `DashedDivider` (`src/components/dashed-divider.tsx`)

Decorative dashed divider component.

#### `HorizontalDivider` (`src/components/horizontal-divider.tsx`)

Horizontal divider with customizable styling.

#### `MarkedTitleSection` (`src/components/marked-title-section.tsx`)

Title section with visual markers and emphasis.

### Performance Components

#### `PerformanceMonitor` (`src/components/PerformanceMonitor.tsx`)

Component for monitoring and displaying performance metrics.

### Testing Components

#### `ColorTestingDashboard` (`src/components/color-testing-dashboard.tsx`)

Dashboard for testing color system and accessibility.

#### `IosScrollTest` (`src/components/ios-scroll-test.tsx`)

Component for testing iOS-specific scroll behaviors.

### Icon Components

#### Icons Directory (`src/components/icons/`)

Collection of SVG icons and icon components used throughout the application.

### Item Components

#### Items Directory (`src/components/items/`)

Reusable item components for lists and collections.

### Page Components

#### About Page (`src/pages/about/`)

Comprehensive about page with modular component architecture and medical theming.

**Main Component:**

```typescript
// About page with hospital showcase
import AboutPage from '@/pages/about';
```

**Sub-Components:**

```typescript
// Reusable page components
import { AnimatedElement, FloatingElement, ProfessionalButton } from '@/pages/about/components';
```

**Props:**

```typescript
interface AnimatedElementProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight';
  delay?: number;
  duration?: number;
  className?: string;
}
```

**Key Features:**

- Hospital branding and mission showcase
- Animated statistics and achievements
- Medical department listings
- Call-to-action sections with emergency contacts
- Accessibility-compliant animations
- Responsive design with mobile optimization
- Content management system for easy updates

**Content Structure:**

```typescript
export const CONTENT = {
  about: {
    title: string;
    brandName: string;
    slogan: string;
    paragraphs: string[];
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  },
  stats: Array<{
    value: string;
    label: string;
    icon: string;
    color: string;
  }>,
  cta: {
    title: string;
    description: string;
    phoneNumber: string;
    contactLink: string;
  }
};
```

**Usage:**

```tsx
// Basic about page
<AboutPage />

// Custom animated element
<AnimatedElement animation="fadeIn" delay={0.2}>
  <div>Content to animate</div>
</AnimatedElement>

// Professional button
<ProfessionalButton
  variant="primary"
  onClick={handleClick}
>
  Contact Us
</ProfessionalButton>
```

### Debug Components

#### Debug Directory (`src/components/debug/`)

Development and debugging components:

- Performance debugging
- State inspection
- Component testing utilities

## Component Patterns

### Higher-Order Components (HOCs)

- Error boundary wrappers
- Performance monitoring wrappers
- Accessibility enhancement wrappers

### Render Props Pattern

Used in components that need to share stateful logic:

```typescript
<DataProvider>
  {({ data, loading, error }) => (
    <MedicalCard data={data} loading={loading} />
  )}
</DataProvider>
```

### Compound Components

Components that work together as a system:

```typescript
<MedicalPackage>
  <MedicalPackage.Header />
  <MedicalPackage.Content />
  <MedicalPackage.Actions />
</MedicalPackage>
```

## Styling Conventions

### CSS Modules

Some components use CSS modules for scoped styling:

- `information-card.css` - Styles for information cards

### Tailwind CSS

Most components use Tailwind CSS classes for styling with consistent design system.

### Theme Integration

Components integrate with the unified theme system defined in `src/styles/`.

## Performance Considerations

### Lazy Loading

Components are lazy-loaded where appropriate to improve initial load times.

### Memoization

Performance-critical components use React.memo and useMemo for optimization.

### Virtual Scrolling

Large lists use virtual scrolling components from `@tanstack/react-virtual`.

## Accessibility Features

### ARIA Support

All interactive components include proper ARIA attributes.

### Keyboard Navigation

Components support keyboard navigation and focus management.

### Screen Reader Support

Components are optimized for screen reader accessibility.

## Testing

### Component Tests

Each component directory includes `__tests__` subdirectories with:

- Unit tests
- Integration tests
- Accessibility tests
- Visual regression tests

### Testing Utilities

- Mock components for testing
- Test data generators
- Accessibility testing helpers
