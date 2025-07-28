# Architecture Overview

This document provides a comprehensive overview of the Zalo Healthcare application architecture, explaining key design decisions, patterns, and implementation details.

## Application Structure

The application follows a modern React architecture with the following key layers:

```
├── Components          # Reusable UI components
├── Pages               # Route-specific page components
├── Services            # API and data access layer
├── State Management    # Global and local state
├── Routing             # Application navigation
├── Utilities           # Helper functions and tools
└── Static Assets       # Images, icons, and other static files
```

## Key Technologies

- **React 18**: Core UI library
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **Jotai**: Lightweight state management
- **React Router v7**: Client-side routing
- **Framer Motion**: Animation library
- **Zalo Mini App SDK**: Platform-specific capabilities

## Component Architecture

### Component Organization

Components are organized into several categories:

1. **Core Components**: Basic UI elements like buttons, inputs, dividers
2. **Composite Components**: More complex UI elements combining multiple core components
3. **Layout Components**: Structural elements like headers, footers, sections
4. **Page Components**: Top-level components that represent entire pages
5. **Feature Components**: Components specific to certain features (e.g., doctor-selector)

### Component Design Patterns

1. **Composition over Inheritance**: Components are composed from smaller pieces
2. **Container/Presentational Pattern**: Separation of data fetching and presentation
3. **Render Props/Children**: Flexible component APIs for varied use cases
4. **Custom Hooks**: Encapsulation of component logic for reusability

## State Management

The application uses Jotai for global state management, with a clear separation of concerns:

### Global State (Jotai atoms)

- **User State**: User profile and authentication
- **UI State**: Theme, layout preferences, etc.
- **Feature State**: State that spans multiple components

### Local State

- React's `useState` for component-specific state
- `useReducer` for more complex component state

### State Organization

```
state.ts                # Core atom definitions
contexts/               # React contexts for specific features
hooks.ts                # Custom hooks for state access
```

## Data Flow

### API Layer

The application's data flow follows a clear pattern:

1. **Service Layer**: Encapsulates API calls and data transformations
2. **State Management**: Updates global state based on API responses
3. **Components**: Consume state and trigger actions
4. **Error Handling**: Centralized error handling for API calls

### Services Implementation

```typescript
// Example service pattern
export const getDoctors = async (params: DoctorSearchParams): Promise<Doctor[]> => {
  try {
    const response = await api.get('/doctors', { params });
    return transformDoctors(response.data);
  } catch (error) {
    handleApiError(error);
    return [];
  }
};
```

## Routing Architecture

The application uses React Router v7 for declarative routing:

```typescript
// src/router.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'doctors',
        element: <DoctorsPage />,
      },
      // Other routes...
    ],
  },
]);
```

### Route Types

1. **Public Routes**: Accessible to all users
2. **Protected Routes**: Require authentication
3. **Feature Routes**: Grouped by feature area

## Content Processing System

The application includes a specialized system for processing HTML content from external sources (like WordPress) and adapting it to use Tailwind CSS classes:

1. **Content Normalization**: Converts external HTML to clean, structured HTML
2. **Tailwind Transformation**: Applies Tailwind classes based on content structure
3. **Component Integration**: Renders processed content within the application

## Mobile Optimization

The application follows a mobile-first design approach with:

1. **Responsive Layouts**: Adapting UI to different screen sizes
2. **Touch Optimization**: Ensuring all interactions work well on touch devices
3. **Performance Considerations**: Optimized for mobile networks and devices

## Error Handling

Comprehensive error handling strategy including:

1. **API Error Handling**: Centralized handling of network and server errors
2. **UI Error States**: Appropriate UI feedback for different error conditions
3. **Error Boundaries**: React error boundaries to prevent application crashes
4. **Logging**: Error logging for debugging and monitoring

## Testing Strategy

The application can be tested using:

1. **Unit Tests**: For individual components and utilities
2. **Integration Tests**: For feature workflows
3. **E2E Tests**: For critical user journeys

## Performance Optimization

Key performance optimizations include:

1. **Code Splitting**: Route-based splitting for smaller initial bundle
2. **Lazy Loading**: Deferring loading of non-critical components
3. **Memoization**: Preventing unnecessary re-renders
4. **Asset Optimization**: Optimized images and other assets
5. **Virtual Lists**: For handling large data sets efficiently

## Dependency Management

Dependencies are managed with Yarn, with clear distinction between:

1. **Core Dependencies**: Essential libraries for the application
2. **Development Dependencies**: Tools used during development only

## Build and Deployment

The application is built and deployed using:

1. **Vite**: Modern build tool for fast development and optimized production builds
2. **Zalo Mini App CLI**: For deploying to the Zalo Mini App platform
