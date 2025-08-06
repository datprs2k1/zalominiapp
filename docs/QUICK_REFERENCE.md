# Quick Reference Guide

## Essential Commands

### Development
```bash
# Start development server
yarn start

# Run tests
yarn test

# Build for production
yarn build

# Format code
yarn format

# Deploy to ZMP platform
yarn deploy
```

### ZMP CLI Commands
```bash
# Login to ZMP CLI
zmp login

# Deploy to specific environment
zmp deploy --env staging
zmp deploy --env production

# View deployment logs
zmp logs

# Check current user
zmp whoami

# Logout
zmp logout
```

## Project Structure Quick Overview

```
src/
├── components/          # UI Components
│   ├── medical/        # Medical-specific components
│   ├── doctor/         # Doctor-related components
│   ├── form/           # Form components
│   ├── loading/        # Loading states
│   └── accessibility/  # Accessibility components
├── pages/              # Route components
│   ├── home/          # Home page
│   ├── booking/       # Appointment booking
│   ├── doctor/        # Doctor pages
│   └── services/      # Medical services
├── services/           # API integration
│   ├── api.ts         # Main API client
│   ├── doctors.ts     # Doctor services
│   └── cache.ts       # Caching layer
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript definitions
└── styles/             # Styling system
```

## Key Files

### Configuration
- `app-config.json` - ZMP app configuration
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Tailwind CSS config
- `tsconfig.json` - TypeScript config
- `vite.config.mts` - Vite build config

### Entry Points
- `src/app.ts` - Main app entry
- `src/router.tsx` - Route configuration
- `src/state.ts` - Global state
- `index.html` - HTML entry point

## Common Patterns

### Component Structure
```typescript
interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({
  // Props destructuring
}) => {
  // Hooks
  // Event handlers
  // Render
};
```

### API Service Pattern
```typescript
export const serviceAPI = {
  async getData(): Promise<DataType[]> {
    try {
      const response = await api.get('/endpoint');
      return response.data;
    } catch (error) {
      throw new APIError('Error message', error);
    }
  }
};
```

### Custom Hook Pattern
```typescript
export const useCustomHook = (param: string) => {
  const [state, setState] = useState<StateType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook logic

  return { state, loading, error, refetch };
};
```

## Styling Quick Reference

### Tailwind Classes
```css
/* Layout */
.container mx-auto px-4
.flex items-center justify-between
.grid grid-cols-1 md:grid-cols-2 gap-4

/* Medical Theme Colors */
.bg-medical-primary text-white
.text-medical-secondary
.border-medical-accent

/* Responsive */
.hidden md:block
.text-sm md:text-base lg:text-lg
```

### Custom CSS Variables
```css
:root {
  --color-medical-primary: 37 99 235;
  --color-medical-secondary: 16 185 129;
  --spacing-unit: 0.25rem;
}
```

## Testing Quick Reference

### Component Test Template
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from '../Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles interactions', () => {
    const mockHandler = jest.fn();
    render(<Component onClick={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### API Test Template
```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { apiService } from '../apiService';

const server = setupServer(
  rest.get('/api/endpoint', (req, res, ctx) => {
    return res(ctx.json({ data: 'mock data' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Debugging Tips

### Common Issues
1. **Build Errors**: Clear node_modules and reinstall
2. **ZMP Login Issues**: Use `zmp logout` then `zmp login`
3. **TypeScript Errors**: Check type definitions in `src/types/`
4. **Styling Issues**: Verify Tailwind classes and custom CSS

### Debug Commands
```bash
# Clear all caches
rm -rf node_modules dist .vite
yarn install

# Check TypeScript
yarn tsc --noEmit

# Verbose deployment
zmp deploy --verbose

# Check bundle size
yarn build && ls -la dist/
```

## Performance Tips

### Optimization Checklist
- [ ] Use React.memo for expensive components
- [ ] Implement lazy loading for routes
- [ ] Optimize images and assets
- [ ] Use virtual scrolling for large lists
- [ ] Implement proper caching strategies
- [ ] Monitor bundle size

### Performance Monitoring
```typescript
// Performance hook usage
const { startTiming, endTiming } = usePerformanceMonitor();

const handleAction = async () => {
  startTiming('action');
  await performAction();
  endTiming('action');
};
```

## Accessibility Checklist

### Essential Checks
- [ ] Proper ARIA labels
- [ ] Keyboard navigation support
- [ ] Color contrast compliance
- [ ] Screen reader compatibility
- [ ] Focus management
- [ ] Alternative text for images

### Testing Tools
```bash
# Run accessibility tests
yarn test:a11y

# Manual testing with axe-core
import { axe } from 'jest-axe';
const results = await axe(container);
```

## Environment Variables

### Required Variables
```bash
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

### ZMP Configuration
```json
{
  "app": {
    "title": "App Name",
    "statusBar": "transparent"
  },
  "template": {
    "oaID": "your-oa-id"
  }
}
```

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Environment variables set
- [ ] Build successful
- [ ] Performance benchmarks met

### Post-deployment
- [ ] App functionality verified
- [ ] Performance metrics checked
- [ ] Error monitoring active
- [ ] User feedback collected

## Troubleshooting

### Common Solutions
| Issue | Solution |
|-------|----------|
| Build fails | Clear cache, reinstall dependencies |
| Tests fail | Check mock data and API responses |
| Deployment fails | Verify ZMP credentials and config |
| Styling broken | Check Tailwind config and CSS imports |
| Performance issues | Use React DevTools Profiler |

### Support Resources
- Zalo Mini Program Documentation
- React Documentation
- TypeScript Handbook
- Tailwind CSS Documentation
- Testing Library Documentation
