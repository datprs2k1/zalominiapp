# Styling Documentation

## Overview

The Zalo Medical Mini App uses a comprehensive styling system built on Tailwind CSS with custom enhancements for medical applications. The system has been significantly enhanced with mobile-first UX improvements, including platform-specific footer components and advanced accessibility features.

## Recent Updates (Mobile Footer UX Redesign)

### Platform-Specific Footer Components

- **iOS Footer**: Implements iOS Human Interface Guidelines with tab bar patterns
- **Android Footer**: Follows Material Design 3 principles with bottom navigation
- **Universal Footer**: Fallback for web and other platforms

### Enhanced Mobile Features

- Platform-specific touch targets (44pt iOS, 56dp Android)
- Haptic feedback integration
- Advanced accessibility support (WCAG 2.1 AA compliant)
- Safe area handling for modern devices
- Responsive design with orientation support

## Styling Architecture

### Core Technologies

- **Tailwind CSS** - Utility-first CSS framework
- **SCSS** - Enhanced CSS with variables and mixins
- **CSS Modules** - Scoped component styling
- **PostCSS** - CSS processing and optimization

### Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `src/css/tailwind.scss` - Tailwind imports and customizations
- `src/css/app.scss` - Main application styles

## Theme System

### Enhanced Theme (`src/styles/enhanced-theme.ts`)

Centralized theme configuration with TypeScript support:

```typescript
export const theme = {
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    medical: {
      primary: '#2563eb',
      secondary: '#10b981',
      accent: '#f59e0b',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
};
```

### CSS Theme (`src/styles/enhanced-theme.css`)

CSS custom properties for runtime theme switching:

```css
:root {
  --color-primary: 59 130 246;
  --color-medical-primary: 37 99 235;
  --color-medical-secondary: 16 185 129;
  --spacing-unit: 0.25rem;
}
```

## Color System

### Unified Color System (`src/styles/unified-color-system.ts`)

Comprehensive color palette for medical applications:

```typescript
export const medicalColors = {
  // Primary medical colors
  primary: '#2563eb',
  secondary: '#10b981',
  accent: '#f59e0b',

  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Medical specialties
  cardiology: '#dc2626',
  neurology: '#7c3aed',
  pediatrics: '#06b6d4',
  orthopedics: '#059669',
};
```

### Color CSS (`src/styles/unified-colors.css`)

CSS implementation of the color system with accessibility considerations.

## Typography System

### Enhanced Typography (`src/styles/enhanced-typography.ts`)

Typography scale and font configurations:

```typescript
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    medical: ['Source Sans Pro', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
  },
};
```

### Medical Typography (`src/styles/enhanced-medical-typography.ts`)

Specialized typography for medical content:

- Medical terminology formatting
- Prescription text styling
- Dosage and measurement formatting
- Clinical note styling

## Iconography

### Medical Iconography (`src/styles/enhanced-medical-iconography.ts`)

Medical-specific icon system:

```typescript
export const medicalIcons = {
  specialties: {
    cardiology: 'heart',
    neurology: 'brain',
    pediatrics: 'baby',
    orthopedics: 'bone',
  },
  actions: {
    appointment: 'calendar',
    prescription: 'pill',
    consultation: 'stethoscope',
  },
};
```

## Design System

### Medical Design System (`src/styles/medical-design-system.ts`)

Comprehensive design system for medical applications:

- Component specifications
- Spacing guidelines
- Color usage rules
- Typography hierarchy
- Accessibility standards

## Responsive Design

### Mobile-First Approach

All styles are designed mobile-first with progressive enhancement:

```css
/* Mobile styles (default) */
.medical-card {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .medical-card {
    padding: 1.5rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .medical-card {
    padding: 2rem;
  }
}
```

### Mobile Styles (`src/styles/mobile.css`)

Mobile-specific optimizations:

- Touch-friendly sizing
- Mobile navigation
- Gesture support
- Performance optimizations

## Platform-Specific Styles

### iOS Optimizations (`src/styles/ios-scroll-fixes.css`)

iOS-specific styling fixes:

```css
/* iOS scroll momentum */
.ios-scroll {
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}

/* iOS safe area support */
.ios-safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Animation System

### Transitions (`src/styles/transitions.css`)

Consistent transition system:

```css
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-medical {
  transition:
    transform 0.2s ease-out,
    opacity 0.2s ease-out;
}
```

### Framer Motion Integration

Components use Framer Motion for complex animations:

```typescript
const medicalCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02 },
};
```

## Component-Specific Styles

### Shortcodes (`src/styles/shortcodes.css`)

Styles for content shortcodes and special formatting.

### Information Cards (`src/components/information-card.css`)

Scoped styles for information card components.

## Accessibility

### Focus States

Consistent focus styling across all interactive elements:

```css
.focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### High Contrast Support

Support for high contrast mode and accessibility preferences:

```css
@media (prefers-contrast: high) {
  .medical-card {
    border: 2px solid currentColor;
  }
}
```

### Reduced Motion

Respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance Optimizations

### CSS Optimization

- Critical CSS inlining
- Unused CSS removal
- CSS minification
- Gzip compression

### Loading Strategies

- Progressive CSS loading
- Font loading optimization
- Image optimization
- Lazy loading of non-critical styles

## Development Workflow

### Style Guidelines

1. Use Tailwind utilities first
2. Create custom CSS only when necessary
3. Follow BEM methodology for custom CSS
4. Use CSS custom properties for theming
5. Ensure accessibility compliance

### Tools and Utilities

- **Prettier** - Code formatting
- **Stylelint** - CSS linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefixes

## Testing

### Visual Testing

- Component visual regression tests
- Cross-browser compatibility testing
- Mobile device testing
- Accessibility testing

### Style Testing

- CSS unit tests
- Theme consistency tests
- Responsive design tests
- Performance impact tests

## Maintenance

### Style Auditing

Regular audits for:

- Unused styles
- Performance impact
- Accessibility compliance
- Design consistency

### Documentation Updates

Keep styling documentation updated with:

- New component styles
- Theme changes
- Accessibility improvements
- Performance optimizations
