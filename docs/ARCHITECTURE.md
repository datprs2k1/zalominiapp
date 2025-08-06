# Architecture Documentation

## System Architecture

### Overview
The Zalo Medical Mini App follows a modern React architecture with TypeScript, emphasizing modularity, performance, and maintainability.

## Directory Structure

### `/src/components/`
React components organized by functionality:

#### Core Components
- `layout.tsx` - Main application layout
- `header.tsx` - Application header
- `footer.tsx` - Application footer
- `button.tsx` - Reusable button component

#### Medical Components
- `medical-card.tsx` - Medical service cards
- `medical-form.tsx` - Medical forms
- `medical-icons.tsx` - Medical iconography
- `medical-loading-states.tsx` - Loading states for medical content
- `enhanced-medical-card.tsx` - Enhanced medical service cards
- `enhanced-medical-skeleton.tsx` - Skeleton loading for medical content

#### Doctor Components
- `doctor/` - Doctor-related components
- `doctor-info-cards.tsx` - Doctor information display

#### UI Components
- `hero-section.tsx` - Landing page hero
- `information-card.tsx` - Information display cards
- `loading-states.tsx` - Various loading states
- `enhanced-loading-states.tsx` - Advanced loading patterns

#### Accessibility Components
- `accessibility.tsx` - Accessibility utilities
- `accessibility-settings.tsx` - Accessibility configuration
- `accessible-medical-skeleton.tsx` - Accessible loading states

#### Form Components
- `form/` - Form-related components

#### Error Handling
- `error-boundary.tsx` - React error boundaries
- `error/` - Error handling components

### `/src/pages/`
Route-level components:

- `home/` - Home page components
- `about/` - About page
- `ask/` - Ask/consultation pages
- `booking/` - Appointment booking
- `categories/` - Service categories
- `departments/` - Medical departments
- `detail/` - Detail pages
- `doctor/` - Doctor pages
- `explore/` - Exploration/discovery
- `feedback/` - Feedback system
- `invoices/` - Invoice management
- `news/` - News and articles
- `profile/` - User profile
- `schedule/` - Scheduling
- `search/` - Search functionality
- `services/` - Medical services

### `/src/services/`
API integration and data management:

- `api.ts` - Main API client
- `cache.ts` - Caching layer
- `common.ts` - Common service utilities
- `departments.ts` - Department services
- `doctors.ts` - Doctor services
- `post.ts` - Post/article services
- `posts.ts` - Posts management
- `search.ts` - Search services
- `services.ts` - Medical services API
- `wp-types.ts` - WordPress type definitions

### `/src/hooks/`
Custom React hooks:

- `use-debounce.ts` - Debouncing hook
- `use-enhanced-loading-state.ts` - Enhanced loading states
- `use-intersection-observer.ts` - Intersection observer
- `use-optimized-api.ts` - API optimization
- `use-route-skeleton.ts` - Route-based skeletons
- `use-route-transition.ts` - Route transitions
- `use-safe-loading-state.ts` - Safe loading states
- `useMedicalServicePrices.ts` - Medical pricing
- `useNotifications.ts` - Notification management
- `useUserPreferences.ts` - User preferences

### `/src/utils/`
Utility functions:

#### Core Utilities
- `format.ts` - Data formatting
- `errors.ts` - Error handling
- `mock.ts` - Mock data
- `user.ts` - User utilities

#### Performance
- `performance-monitor.ts` - Performance monitoring
- `enhanced-performance-monitor.ts` - Advanced performance tracking
- `api-performance-monitor.ts` - API performance
- `scroll-performance.ts` - Scroll optimization
- `network-aware-optimizations.ts` - Network optimization

#### Medical Specific
- `medical-cache.ts` - Medical data caching
- `medical-testing.ts` - Medical testing utilities
- `medical-app-validator.ts` - Medical app validation
- `medicalDataProcessing.ts` - Medical data processing
- `medicalErrorHandling.ts` - Medical error handling

#### Accessibility & Validation
- `accessibility.ts` - Accessibility utilities
- `accessibility-validator.ts` - Accessibility validation
- `mobile-responsiveness-validator.ts` - Mobile validation

#### Content Processing
- `decodeHTML.ts` - HTML decoding
- `htmlProcessingHelpers.ts` - HTML processing
- `normalHTML.tsx` - HTML normalization

#### Platform Specific
- `ios-fixes.ts` - iOS-specific fixes

### `/src/types/`
TypeScript type definitions:

- `medical.ts` - Medical-related types
- `types.d.ts` - Global type definitions
- `global.d.ts` - Global declarations

### `/src/styles/`
Styling and theme system:

- `enhanced-theme.ts` - Theme configuration
- `enhanced-theme.css` - Theme styles
- `enhanced-typography.ts` - Typography system
- `enhanced-medical-typography.ts` - Medical typography
- `enhanced-medical-iconography.ts` - Medical icons
- `medical-design-system.ts` - Medical design system
- `unified-color-system.ts` - Color system
- `unified-colors.css` - Color definitions
- `transitions.css` - Transition animations
- `mobile.css` - Mobile-specific styles
- `ios-scroll-fixes.css` - iOS scroll fixes
- `shortcodes.css` - Shortcode styles

### `/src/contexts/`
React contexts:

- `animation-context.tsx` - Animation context

### `/src/data/`
Static data:

- `clinics.ts` - Clinic data

## State Management

### Jotai Integration
The application uses Jotai for state management, providing atomic state updates and efficient re-renders.

### State Structure
- Global application state in `state.ts`
- Component-specific state using React hooks
- Context-based state for cross-component communication

## Performance Optimizations

### Loading Strategies
- Skeleton loading states
- Progressive loading
- Virtual scrolling for large lists
- Route-based code splitting

### Caching
- API response caching
- Medical data caching
- Image optimization

### Mobile Optimizations
- iOS-specific fixes
- Touch-friendly interactions
- Responsive design patterns

## Error Handling

### Error Boundaries
- Component-level error boundaries
- Global error handling
- Medical-specific error handling

### Validation
- Form validation
- Data validation
- Accessibility validation
- Mobile responsiveness validation

## Testing Strategy

### Test Structure
- Component tests in `__tests__` directories
- Service layer testing
- Utility function testing
- Integration testing

## Build and Deployment

### Build Process
- Vite for fast builds
- TypeScript compilation
- CSS optimization with Tailwind
- Asset optimization

### Deployment
- Zalo Mini Program platform deployment
- Environment-specific configurations
- Performance monitoring in production
