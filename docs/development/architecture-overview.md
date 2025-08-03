# Architecture Overview

This document provides a comprehensive overview of the Zalo Healthcare Mini App architecture, including system design, key technologies, design patterns, and architectural decisions.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Zalo Mini App Platform                   │
├─────────────────────────────────────────────────────────────┤
│                     Frontend Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   React 18  │  │ TypeScript  │  │ Tailwind CSS│        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                   State Management                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Jotai    │  │ React Query │  │ Local State │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    Services Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ API Client  │  │ Cache Layer │  │ Data Transform│       │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    External APIs                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ WordPress   │  │ Zalo SDK    │  │ Third Party │        │
│  │     API     │  │             │  │    APIs     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Core Technologies

#### Frontend Stack
- **React 18**: Modern React with concurrent features and Suspense
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **SCSS**: Enhanced CSS with variables and mixins for complex styling
- **Vite**: Fast build tool with hot module replacement

#### State Management
- **Jotai**: Atomic state management for granular reactivity
- **React Router v7**: Client-side routing with data loading
- **Context API**: React contexts for theme and animation providers

#### Platform Integration
- **Zalo Mini App SDK**: Platform-specific APIs and capabilities
- **ZMP UI**: Zalo Mini App UI component library
- **Progressive Web App**: Service worker for offline capabilities

## 🎯 Design Patterns

### Component Architecture

#### Atomic Design Principles
```
Atoms (Basic Components)
├── Button
├── Input
├── Icon
└── Typography

Molecules (Component Combinations)
├── SearchBar
├── ServiceItem
├── DoctorCard
└── FormField

Organisms (Complex Components)
├── Header
├── ServiceMenu
├── DoctorList
└── BookingForm

Templates (Page Layouts)
├── Layout
├── PageLayout
└── ModalLayout

Pages (Complete Views)
├── HomePage
├── BookingPage
├── ProfilePage
└── SearchPage
```

#### Component Patterns

**1. Compound Components**
```typescript
// Example: Modal with compound pattern
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

**2. Render Props Pattern**
```typescript
// Example: Data fetching with render props
<DataProvider>
  {({ data, loading, error }) => (
    loading ? <Skeleton /> : <Content data={data} />
  )}
</DataProvider>
```

**3. Higher-Order Components (HOCs)**
```typescript
// Example: withLoading HOC
const EnhancedComponent = withLoading(BaseComponent);
```

### State Management Patterns

#### Jotai Atomic Pattern
```typescript
// Atomic state definition
export const doctorsAtom = atom<Doctor[]>([]);
export const selectedDoctorAtom = atom<Doctor | null>(null);

// Derived atoms
export const availableDoctorsAtom = atom((get) => 
  get(doctorsAtom).filter(doctor => doctor.available)
);

// Async atoms
export const doctorDataAtom = atom(async () => {
  const response = await fetchDoctors();
  return response.data;
});
```

#### State Organization
```
State Structure:
├── Global State (Jotai atoms)
│   ├── User state
│   ├── App configuration
│   └── Cache state
├── Page State (Local state)
│   ├── Form state
│   ├── UI state
│   └── Temporary data
└── Component State (useState)
    ├── Local UI state
    ├── Animation state
    └── Interaction state
```

## 🔄 Data Flow Architecture

### Request Flow
```
User Action → Component → Hook → Service → API → Cache → Response
     ↑                                                        ↓
     └─────────────── UI Update ← State Update ←──────────────┘
```

### Service Layer Architecture
```typescript
// Service layer structure
services/
├── api.ts           // HTTP client configuration
├── cache.ts         // Caching layer with LRU cache
├── common.ts        // Shared utilities and transformers
├── doctors.ts       // Doctor-specific API calls
├── departments.ts   // Department-specific API calls
├── posts.ts         // Blog/news API calls
├── search.ts        // Search functionality
└── wp-types.ts      // WordPress API type definitions
```

### Caching Strategy
- **LRU Cache**: In-memory caching with size limits
- **Cache Tags**: Tag-based invalidation for related data
- **Compression**: Automatic compression for large responses
- **Circuit Breaker**: Failure handling and recovery

## 📱 Mobile-First Architecture

### Responsive Design Strategy
```css
/* Mobile-first breakpoint system */
/* Base: Mobile (320px+) */
.component { /* mobile styles */ }

/* Tablet (640px+) */
@media (min-width: 640px) { /* tablet styles */ }

/* Desktop (1024px+) */
@media (min-width: 1024px) { /* desktop styles */ }
```

### Performance Optimizations
- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Dynamic imports for non-critical components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Optimization**: Tree shaking and dead code elimination

### iOS-Specific Optimizations
```typescript
// iOS scroll fixes
import { initializeIOSFixes } from './utils/ios-fixes';

// Safe area handling
.ios-safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

## 🔐 Security Architecture

### Data Protection
- **Input Sanitization**: XSS prevention for user inputs
- **Content Security Policy**: CSP headers for script execution
- **API Security**: Token-based authentication with Zalo SDK

### Privacy Considerations
- **User Consent**: Explicit consent for data access
- **Data Minimization**: Only collect necessary user data
- **Local Storage**: Secure storage of sensitive information

## 🚀 Performance Architecture

### Loading Strategies
```typescript
// Progressive loading with Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <LazyComponent />
</Suspense>

// Skeleton loading states
<ProgressiveLoader
  skeleton={<DoctorCardSkeleton />}
  component={<DoctorCard />}
/>
```

### Animation Architecture
```typescript
// Framer Motion integration
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

// Animation context provider
<AnimationProvider>
  <motion.div variants={pageVariants}>
    {children}
  </motion.div>
</AnimationProvider>
```

## 🧪 Testing Architecture

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API service and data flow testing
- **E2E Tests**: User journey and critical path testing
- **Visual Regression**: UI consistency testing

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for tests
- **Playwright**: End-to-end testing

## 📦 Build Architecture

### Build Pipeline
```
Source Code → TypeScript Compilation → Bundling → Optimization → Deployment
     ↓              ↓                    ↓           ↓            ↓
   Linting    Type Checking         Code Split   Minification   Zalo Platform
```

### Development Tools
- **Vite**: Development server and build tool
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates

## 🔧 Configuration Management

### Environment Configuration
```typescript
// app-config.json structure
{
  "app": {
    "title": "Zalo Healthcare",
    "icon": "icon.png",
    "description": "Healthcare Mini App"
  },
  "api": {
    "baseUrl": "https://api.example.com",
    "timeout": 10000
  },
  "features": {
    "offline": true,
    "analytics": true
  }
}
```

This architecture provides a solid foundation for a scalable, maintainable, and performant healthcare application on the Zalo Mini App platform.
