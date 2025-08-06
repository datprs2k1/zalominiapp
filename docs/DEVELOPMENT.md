# Development Guide

## Getting Started

### Prerequisites
- Node.js 16+ 
- Yarn package manager
- Zalo Mini Program CLI
- VS Code (recommended)

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd zalo

# Install dependencies
yarn install

# Install ZMP CLI globally
npm install -g zmp-cli

# Login to ZMP CLI
yarn login
```

### Development Server
```bash
# Start development server
yarn start

# The app will be available at the ZMP development URL
# Check the terminal output for the specific URL
```

## Development Workflow

### Project Structure
Follow the established directory structure:
```
src/
├── components/     # Reusable UI components
├── pages/         # Route-level components  
├── services/      # API integration
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript definitions
├── styles/        # Styling system
├── contexts/      # React contexts
└── data/          # Static data
```

### Code Organization

#### Components
- Create components in appropriate subdirectories
- Use TypeScript for all components
- Include proper prop types and interfaces
- Add JSDoc comments for complex components

```typescript
/**
 * Medical service card component
 * @param service - Medical service data
 * @param onClick - Click handler
 * @param showPrice - Whether to display pricing
 */
interface MedicalCardProps {
  service: MedicalService;
  onClick?: () => void;
  showPrice?: boolean;
}

export const MedicalCard: React.FC<MedicalCardProps> = ({
  service,
  onClick,
  showPrice = true
}) => {
  // Component implementation
};
```

#### Hooks
- Create custom hooks for reusable logic
- Use proper naming convention (use prefix)
- Include proper TypeScript types

```typescript
export const useMedicalService = (serviceId: string) => {
  const [service, setService] = useState<MedicalService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook implementation
  
  return { service, loading, error, refetch };
};
```

#### Services
- Organize API calls by domain
- Use proper error handling
- Implement caching where appropriate
- Include TypeScript types for responses

```typescript
export const doctorService = {
  async getDoctors(): Promise<Doctor[]> {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error) {
      throw new APIError('Failed to fetch doctors', error);
    }
  }
};
```

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` type - use proper typing
- Use generic types where appropriate

### React Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization
- Follow React hooks rules

### Styling
- Use Tailwind CSS utilities first
- Create custom CSS only when necessary
- Follow the established design system
- Ensure mobile responsiveness

### Accessibility
- Include proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers
- Follow WCAG guidelines

## Testing

### Unit Testing
```bash
# Run unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage
```

### Component Testing
- Test component rendering
- Test user interactions
- Test accessibility
- Mock external dependencies

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MedicalCard } from '../MedicalCard';

describe('MedicalCard', () => {
  it('renders service information', () => {
    const mockService = {
      id: '1',
      name: 'Consultation',
      price: 100
    };

    render(<MedicalCard service={mockService} />);
    
    expect(screen.getByText('Consultation')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });
});
```

### Integration Testing
- Test API integration
- Test component interactions
- Test routing
- Test state management

## Performance

### Optimization Strategies
- Use React.lazy for code splitting
- Implement virtual scrolling for large lists
- Optimize images and assets
- Use proper caching strategies

### Monitoring
- Use performance monitoring hooks
- Monitor API response times
- Track user interactions
- Monitor memory usage

```typescript
// Performance monitoring example
const { startTiming, endTiming } = usePerformanceMonitor();

const handleApiCall = async () => {
  startTiming('api-call');
  try {
    const data = await apiService.getData();
    endTiming('api-call');
    return data;
  } catch (error) {
    endTiming('api-call', { error: true });
    throw error;
  }
};
```

## Debugging

### Development Tools
- React Developer Tools
- Redux DevTools (if using Redux)
- Network tab for API debugging
- Performance tab for optimization

### Logging
- Use structured logging
- Include context information
- Log errors with stack traces
- Use different log levels

```typescript
import { logger } from '../utils/logger';

const handleError = (error: Error) => {
  logger.error('API call failed', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId()
  });
};
```

### Error Handling
- Implement error boundaries
- Provide user-friendly error messages
- Log errors for debugging
- Implement retry mechanisms

## Mobile Development

### iOS Specific
- Test on iOS devices
- Handle iOS-specific scroll issues
- Implement safe area support
- Test touch interactions

### Android Specific
- Test on Android devices
- Handle Android-specific behaviors
- Test different screen sizes
- Optimize for various Android versions

### Responsive Design
- Mobile-first approach
- Test on various screen sizes
- Ensure touch-friendly interactions
- Optimize for different orientations

## API Integration

### Best Practices
- Use proper error handling
- Implement request/response interceptors
- Use proper TypeScript types
- Implement caching strategies

```typescript
// API client configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

## Build and Deployment

### Build Process
```bash
# Build for production
yarn build

# Preview production build
yarn preview
```

### Deployment
```bash
# Deploy to ZMP platform
yarn deploy

# Deploy to specific environment
yarn deploy --env staging
```

### Environment Configuration
- Use environment variables for configuration
- Separate configs for development/staging/production
- Keep sensitive data in environment variables

## Git Workflow

### Branch Strategy
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### Commit Messages
Follow conventional commit format:
```
feat: add doctor booking functionality
fix: resolve iOS scroll issue
docs: update API documentation
style: improve medical card styling
```

### Pull Requests
- Include proper description
- Add screenshots for UI changes
- Ensure tests pass
- Request appropriate reviews

## Tools and Extensions

### VS Code Extensions
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### Development Tools
- React Developer Tools
- Zalo Mini Program Developer Tools
- Postman for API testing
- Chrome DevTools
