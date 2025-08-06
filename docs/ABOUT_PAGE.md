# About Page Documentation

## Overview

The About page (`src/pages/about/index.tsx`) is a comprehensive, animated landing page that showcases the Hòa Bình - Hải Phòng General Hospital. It features modern animations, accessibility compliance, and responsive design optimized for medical service presentation.

## Architecture

### File Structure

```
src/pages/about/
├── index.tsx                    # Main about page component
├── styles.css                   # Page-specific styles
├── components/                  # Reusable page components
│   ├── AnimatedElement.tsx      # Animation wrapper component
│   ├── FloatingElement.tsx      # Floating animation component
│   ├── ProfessionalButton.tsx   # Professional-styled button
│   └── index.ts                 # Component exports
├── constants/                   # Page constants
│   ├── animations.ts            # Animation configurations
│   └── content.ts               # Page content and text
└── hooks/                       # Custom hooks
    └── useAccessibleAnimation.ts # Accessibility-aware animations
```

## Components

### Main About Page Component

**Location:** `src/pages/about/index.tsx`

The main component renders four key sections:
- **HeroSection**: Hospital introduction with branding
- **StatsSection**: Achievement statistics and metrics
- **CTASection**: Call-to-action for consultations
- **ClinicsSection**: Medical departments and services

**Key Features:**
- Responsive design with mobile-first approach
- Accessibility compliance (WCAG 2.1 AA)
- Performance optimized with lazy loading
- SEO optimized with proper meta tags
- Medical theming with healthcare-specific styling

### AnimatedElement Component

**Location:** `src/pages/about/components/AnimatedElement.tsx`

Wrapper component for adding consistent animations throughout the page.

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

### FloatingElement Component

**Location:** `src/pages/about/components/FloatingElement.tsx`

Creates subtle floating animations for decorative elements.

### ProfessionalButton Component

**Location:** `src/pages/about/components/ProfessionalButton.tsx`

Medical-themed button component with professional styling.

## Content Management

### Content Constants

**Location:** `src/pages/about/constants/content.ts`

Centralized content management for easy updates and localization:

```typescript
export const CONTENT = {
  about: {
    banner: 'Về chúng tôi',
    title: 'BỆNH VIỆN ĐA KHOA',
    brandName: 'HÒA BÌNH - HẢI PHÒNG',
    slogan: 'Trị bệnh bằng khối óc – Chăm sóc bằng trái tim',
    subtitle: 'Đơn vị y tế hàng đầu tại Hải Phòng với hơn 15 năm kinh nghiệm',
    paragraphs: [...],
    features: [...],
  },
  stats: [...],
  cta: {...},
};
```

**Content Sections:**
- **about**: Hospital information, mission, and features
- **stats**: Achievement statistics and metrics
- **cta**: Call-to-action content for consultations

## Animations

### Animation System

**Location:** `src/pages/about/constants/animations.ts`

Defines consistent animation variants using Framer Motion:

```typescript
export const fadeInSlide = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### Accessibility-Aware Animations

**Location:** `src/pages/about/hooks/useAccessibleAnimation.ts`

Custom hook that respects user's motion preferences:

```typescript
const useAccessibleAnimation = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return {
    shouldAnimate: !prefersReducedMotion,
    duration: prefersReducedMotion ? 0 : 0.6,
    // ... other animation settings
  };
};
```

## Page Sections

### Hero Section

**Features:**
- Hospital branding and mission statement
- Responsive hero image
- Call-to-action buttons
- Medical-themed gradient backgrounds

### Statistics Section

**Features:**
- Animated counters for achievements
- Medical icons for visual appeal
- Responsive grid layout
- Color-coded statistics

### Call-to-Action Section

**Features:**
- Emergency contact information
- Appointment booking links
- Professional styling
- Accessibility-compliant buttons

### Clinics Section

**Features:**
- Medical department listings
- Service descriptions
- Interactive elements
- Responsive card layout

## Styling

### CSS Architecture

**Location:** `src/pages/about/styles.css`

Page-specific styles that complement the global design system:
- Medical color palette
- Typography hierarchy
- Responsive breakpoints
- Animation keyframes

### Design System Integration

The page integrates with the global medical design system:
- Uses medical color tokens
- Follows typography scale
- Implements spacing system
- Maintains brand consistency

## Accessibility Features

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: Medical-grade color contrast ratios
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks

### Accessibility Implementation

```tsx
// Skip link for keyboard navigation
<nav aria-label="Breadcrumb" className="sr-only">
  <ol>
    <li><a href="/">Trang chủ</a></li>
    <li aria-current="page">Về chúng tôi</li>
  </ol>
</nav>

// Main content landmark
<div id="main-content" tabIndex={-1}>
  {/* Page content */}
</div>
```

## Performance Optimizations

### Loading Strategies

- **Lazy Loading**: Images and heavy components
- **Code Splitting**: Dynamic imports for animations
- **Memoization**: React.memo for expensive components
- **Optimized Images**: WebP format with fallbacks

### Performance Monitoring

- Bundle size optimization
- Core Web Vitals tracking
- Animation performance monitoring
- Memory usage optimization

## Usage Examples

### Basic Implementation

```tsx
import AboutPage from '@/pages/about';

function App() {
  return (
    <Routes>
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
```

### Custom Content

```tsx
// Modify content in constants/content.ts
export const CUSTOM_CONTENT = {
  about: {
    title: 'Custom Hospital Name',
    // ... other customizations
  }
};
```

## Testing

### Test Coverage

- Component rendering tests
- Accessibility compliance tests
- Animation behavior tests
- Responsive design tests
- Content validation tests

### Testing Utilities

```bash
# Run about page tests
npm test -- --testPathPattern=about

# Test accessibility
npm test -- --testNamePattern="accessibility"

# Test animations
npm test -- --testNamePattern="animation"
```

## Maintenance

### Content Updates

1. Update content in `constants/content.ts`
2. Modify images in the public directory
3. Test responsive behavior
4. Validate accessibility compliance

### Adding New Sections

1. Create component in `components/` directory
2. Add animation variants in `constants/animations.ts`
3. Update main page component
4. Add corresponding tests

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Accessibility**: Screen readers and assistive technologies
- **Performance**: Optimized for mobile devices

## SEO Optimization

- Semantic HTML structure
- Meta tags and descriptions
- Open Graph tags
- Structured data markup
- Mobile-friendly design
- Fast loading times
