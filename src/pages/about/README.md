# About Page - Clean Architecture

This directory contains the cleaned and optimized About page implementation with comprehensive testing, accessibility features, and performance optimizations.

## 📁 Project Structure

```
src/pages/about/
├── components/           # Extracted, reusable components
│   ├── AnimatedElement.tsx
│   ├── FloatingElement.tsx
│   ├── ProfessionalButton.tsx
│   ├── StatItem.tsx
│   ├── HeroSection.tsx
│   ├── StatsSection.tsx
│   ├── CTASection.tsx
│   ├── ClinicsSection.tsx
│   └── index.ts         # Component exports
├── constants/           # Content and configuration
│   ├── content.ts       # Page content
│   ├── animations.ts    # Animation configurations
│   ├── styles.ts        # Style constants
│   └── i18n.ts         # Internationalization
├── hooks/              # Custom hooks
│   ├── useAccessibleAnimation.ts
│   └── useContentManagement.ts
├── styles/             # Organized CSS
│   ├── design-tokens.css
│   ├── utilities.css
│   ├── components.css
│   └── styles.css      # Main stylesheet
├── types/              # TypeScript definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── accessibility.ts
│   └── performance.ts
├── __tests__/          # Comprehensive test suite
│   ├── AboutPage.test.tsx
│   ├── accessibility.test.tsx
│   ├── components/
│   │   └── StatItem.test.tsx
│   └── setup.ts
├── jest.config.js      # Test configuration
├── index.tsx          # Main page component
└── README.md          # This file
```

## 🚀 Key Improvements

### 1. Component Architecture
- **Extracted Components**: Broke down the monolithic component into smaller, focused components
- **TypeScript Integration**: Added comprehensive type definitions for better development experience
- **Reusable Patterns**: Created reusable components that can be used across the application

### 2. Performance Optimizations
- **Lazy Loading**: Implemented lazy image loading with intersection observer
- **Animation Optimization**: Optimized Framer Motion usage with reduced motion support
- **Bundle Optimization**: Organized imports and reduced bundle size
- **Memory Management**: Proper cleanup and performance monitoring utilities

### 3. Accessibility Enhancements
- **WCAG 2.1 AA Compliance**: Full accessibility compliance with comprehensive testing
- **Screen Reader Support**: Proper ARIA labels and semantic structure
- **Keyboard Navigation**: Full keyboard accessibility with focus management
- **Reduced Motion**: Respects user's motion preferences

### 4. Styling Organization
- **Design System**: Centralized design tokens and consistent styling
- **CSS Architecture**: Organized CSS with utilities, components, and design tokens
- **Responsive Design**: Mobile-first responsive design with consistent breakpoints
- **Performance**: Optimized CSS with minimal redundancy

### 5. Content Management
- **Internationalization**: Built-in i18n support for future expansion
- **Content Validation**: Content quality assurance and validation
- **Search & Analytics**: Content search and performance tracking capabilities

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run accessibility tests only
npm run test:a11y

# Run performance tests
npm run test:performance
```

### Test Coverage

The test suite includes:

- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **Accessibility Tests**: WCAG compliance and screen reader testing
- **Performance Tests**: Render time and memory usage testing
- **Visual Regression Tests**: UI consistency testing

### Coverage Targets

- **Components**: 85% coverage minimum
- **Utilities**: 90% coverage minimum
- **Overall**: 80% coverage minimum

## 🎨 Styling

### Design Tokens

The design system uses CSS custom properties for consistent theming:

```css
:root {
  --medical-primary: #2563eb;
  --medical-secondary: #10b981;
  --medical-accent: #f59e0b;
  /* ... more tokens */
}
```

### Utility Classes

Common patterns are available as utility classes:

```css
.medical-card { /* Card styling */ }
.medical-button { /* Button styling */ }
.medical-gradient { /* Gradient backgrounds */ }
```

### Responsive Design

Mobile-first approach with consistent breakpoints:

```css
/* Mobile: 375px+ */
/* Tablet: 768px+ */
/* Desktop: 1024px+ */
/* Large: 1280px+ */
```

## ♿ Accessibility

### Features

- **Semantic HTML**: Proper landmark roles and heading hierarchy
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indicators and management
- **Color Contrast**: WCAG AA compliant color combinations
- **Reduced Motion**: Respects user motion preferences

### Testing

Accessibility is tested using:

- **jest-axe**: Automated accessibility testing
- **Manual Testing**: Screen reader and keyboard testing
- **Color Contrast**: Automated contrast ratio validation

## 🌐 Internationalization

### Current Support

- **Vietnamese (vi)**: Primary language
- **English (en)**: Secondary language (prepared)

### Adding Languages

1. Add language to `SupportedLanguage` type
2. Create content object in `i18n.ts`
3. Update `getContent` function
4. Add tests for new language

### Usage

```typescript
import { useContentManagement } from './hooks/useContentManagement';

const { content, language, setLanguage } = useContentManagement();
```

## 📊 Performance

### Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimizations

- **Code Splitting**: Lazy loading of non-critical components
- **Image Optimization**: Lazy loading with proper sizing
- **Animation Performance**: GPU-accelerated animations
- **Bundle Size**: Optimized imports and tree shaking

## 🔧 Development

### Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Run Tests**:
   ```bash
   npm test
   ```

### Code Quality

- **ESLint**: Code linting with accessibility rules
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Pre-commit hooks

### Contributing

1. Follow the established component structure
2. Add comprehensive tests for new features
3. Ensure accessibility compliance
4. Update documentation as needed
5. Run the full test suite before submitting

## 📈 Monitoring

### Performance Monitoring

```typescript
import { performanceMonitor } from './utils/performance';

// Measure render time
const endMeasure = performanceMonitor.measureRenderTime('ComponentName');
// ... component logic
endMeasure();

// Monitor memory usage
performanceMonitor.monitorMemory();
```

### Analytics

```typescript
import { useContentAnalytics } from './hooks/useContentManagement';

const { trackPageView, trackContentInteraction } = useContentAnalytics();
```

## 🚀 Deployment

### Build Process

```bash
# Production build
npm run build

# Analyze bundle
npm run analyze

# Test production build
npm run preview
```

### Environment Variables

```env
# Optional: Analytics tracking
REACT_APP_ANALYTICS_ID=your-analytics-id

# Optional: Performance monitoring
REACT_APP_PERFORMANCE_MONITORING=true
```

## 📝 Changelog

### v2.0.0 - Clean Architecture Implementation

- ✅ Extracted components from monolithic structure
- ✅ Added comprehensive TypeScript types
- ✅ Implemented performance optimizations
- ✅ Added full accessibility compliance
- ✅ Organized CSS architecture
- ✅ Added internationalization support
- ✅ Created comprehensive test suite
- ✅ Added performance monitoring
- ✅ Implemented content management system

### Previous Versions

- v1.0.0 - Initial implementation (monolithic structure)

## 🤝 Support

For questions or issues related to the About page implementation:

1. Check the test suite for usage examples
2. Review the component documentation
3. Check accessibility guidelines
4. Review performance best practices

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
