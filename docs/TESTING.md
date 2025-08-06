# Testing Documentation

## Overview
This document outlines the testing strategy and practices for the Zalo Medical Mini App.

## Testing Strategy

### Testing Pyramid
1. **Unit Tests** (70%) - Individual functions and components
2. **Integration Tests** (20%) - Component interactions and API integration
3. **End-to-End Tests** (10%) - Complete user workflows

### Testing Tools
- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing
- **MSW** - API mocking
- **Cypress** - End-to-end testing
- **Accessibility Testing** - axe-core integration

## Unit Testing

### Component Testing
Test individual React components in isolation:

```typescript
// src/components/__tests__/MedicalCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MedicalCard } from '../MedicalCard';

describe('MedicalCard', () => {
  const mockService = {
    id: '1',
    name: 'General Consultation',
    price: 100,
    duration: 30,
    description: 'Basic medical consultation'
  };

  it('renders service information correctly', () => {
    render(<MedicalCard service={mockService} />);
    
    expect(screen.getByText('General Consultation')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = jest.fn();
    render(<MedicalCard service={mockService} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when loading prop is true', () => {
    render(<MedicalCard service={mockService} loading={true} />);
    
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
});
```

### Hook Testing
Test custom React hooks:

```typescript
// src/hooks/__tests__/useMedicalService.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useMedicalService } from '../useMedicalService';
import * as api from '../../services/api';

jest.mock('../../services/api');
const mockApi = api as jest.Mocked<typeof api>;

describe('useMedicalService', () => {
  it('fetches service data successfully', async () => {
    const mockService = { id: '1', name: 'Test Service' };
    mockApi.getService.mockResolvedValue(mockService);

    const { result } = renderHook(() => useMedicalService('1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.service).toEqual(mockService);
    expect(result.current.error).toBeNull();
  });

  it('handles API errors correctly', async () => {
    const mockError = new Error('API Error');
    mockApi.getService.mockRejectedValue(mockError);

    const { result } = renderHook(() => useMedicalService('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.service).toBeNull();
    expect(result.current.error).toBe('API Error');
  });
});
```

### Utility Function Testing
Test utility functions:

```typescript
// src/utils/__tests__/format.test.ts
import { formatPrice, formatDuration, formatDate } from '../format';

describe('format utilities', () => {
  describe('formatPrice', () => {
    it('formats price correctly', () => {
      expect(formatPrice(100)).toBe('$100');
      expect(formatPrice(99.99)).toBe('$99.99');
      expect(formatPrice(0)).toBe('Free');
    });
  });

  describe('formatDuration', () => {
    it('formats duration in minutes', () => {
      expect(formatDuration(30)).toBe('30 min');
      expect(formatDuration(60)).toBe('1 hour');
      expect(formatDuration(90)).toBe('1 hour 30 min');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25');
      expect(formatDate(date)).toBe('Dec 25, 2023');
    });
  });
});
```

## Integration Testing

### API Integration Testing
Test API service integration:

```typescript
// src/services/__tests__/doctorService.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { doctorService } from '../doctors';

const server = setupServer(
  rest.get('/api/doctors', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'Dr. Smith', specialization: 'Cardiology' },
        { id: '2', name: 'Dr. Johnson', specialization: 'Neurology' }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('doctorService', () => {
  it('fetches doctors successfully', async () => {
    const doctors = await doctorService.getDoctors();
    
    expect(doctors).toHaveLength(2);
    expect(doctors[0].name).toBe('Dr. Smith');
    expect(doctors[1].specialization).toBe('Neurology');
  });

  it('handles API errors', async () => {
    server.use(
      rest.get('/api/doctors', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await expect(doctorService.getDoctors()).rejects.toThrow();
  });
});
```

### Component Integration Testing
Test component interactions:

```typescript
// src/pages/__tests__/DoctorList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DoctorList } from '../DoctorList';
import * as doctorService from '../../services/doctors';

jest.mock('../../services/doctors');
const mockDoctorService = doctorService as jest.Mocked<typeof doctorService>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DoctorList', () => {
  it('displays doctors after loading', async () => {
    const mockDoctors = [
      { id: '1', name: 'Dr. Smith', specialization: 'Cardiology' }
    ];
    mockDoctorService.getDoctors.mockResolvedValue(mockDoctors);

    renderWithRouter(<DoctorList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    expect(screen.getByText('Cardiology')).toBeInTheDocument();
  });
});
```

## End-to-End Testing

### Cypress Configuration
```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 375,
    viewportHeight: 667,
  },
});
```

### E2E Test Examples
```typescript
// cypress/e2e/doctor-booking.cy.ts
describe('Doctor Booking Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('allows user to book an appointment', () => {
    // Navigate to doctors page
    cy.get('[data-testid="doctors-tab"]').click();
    
    // Select a doctor
    cy.get('[data-testid="doctor-card"]').first().click();
    
    // Click book appointment
    cy.get('[data-testid="book-appointment"]').click();
    
    // Fill appointment form
    cy.get('[data-testid="date-picker"]').click();
    cy.get('[data-testid="date-option"]').first().click();
    
    cy.get('[data-testid="time-slot"]').first().click();
    
    cy.get('[data-testid="patient-name"]').type('John Doe');
    cy.get('[data-testid="patient-phone"]').type('1234567890');
    
    // Submit booking
    cy.get('[data-testid="submit-booking"]').click();
    
    // Verify success
    cy.get('[data-testid="booking-success"]').should('be.visible');
    cy.contains('Appointment booked successfully').should('be.visible');
  });

  it('handles booking errors gracefully', () => {
    // Mock API error
    cy.intercept('POST', '/api/appointments', { statusCode: 500 });
    
    // Attempt booking
    cy.get('[data-testid="doctors-tab"]').click();
    cy.get('[data-testid="doctor-card"]').first().click();
    cy.get('[data-testid="book-appointment"]').click();
    
    // Fill form and submit
    cy.get('[data-testid="date-picker"]').click();
    cy.get('[data-testid="date-option"]').first().click();
    cy.get('[data-testid="submit-booking"]').click();
    
    // Verify error handling
    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});
```

## Accessibility Testing

### Automated Accessibility Testing
```typescript
// src/components/__tests__/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MedicalCard } from '../MedicalCard';

expect.extend(toHaveNoViolations);

describe('MedicalCard Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const mockService = {
      id: '1',
      name: 'Test Service',
      price: 100
    };

    const { container } = render(<MedicalCard service={mockService} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Accessibility Testing
- Keyboard navigation testing
- Screen reader testing
- Color contrast verification
- Focus management testing

## Performance Testing

### Component Performance Testing
```typescript
// src/components/__tests__/performance.test.tsx
import { render } from '@testing-library/react';
import { MedicalCardList } from '../MedicalCardList';

describe('MedicalCardList Performance', () => {
  it('renders large lists efficiently', () => {
    const largeServiceList = Array.from({ length: 1000 }, (_, i) => ({
      id: `${i}`,
      name: `Service ${i}`,
      price: 100
    }));

    const startTime = performance.now();
    render(<MedicalCardList services={largeServiceList} />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100); // Should render in < 100ms
  });
});
```

## Test Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Test Setup
```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock ZMP SDK
jest.mock('zmp-sdk', () => ({
  getAccessToken: jest.fn(() => Promise.resolve('mock-token')),
  getUserInfo: jest.fn(() => Promise.resolve({ id: '1', name: 'Test User' }))
}));
```

## Test Data Management

### Mock Data
```typescript
// src/mocks/data.ts
export const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Smith',
    specialization: 'Cardiology',
    experience: 10,
    rating: 4.8,
    image: '/images/doctor1.jpg'
  },
  {
    id: '2',
    name: 'Dr. John Johnson',
    specialization: 'Neurology',
    experience: 15,
    rating: 4.9,
    image: '/images/doctor2.jpg'
  }
];

export const mockServices = [
  {
    id: '1',
    name: 'General Consultation',
    price: 100,
    duration: 30,
    description: 'Basic medical consultation'
  }
];
```

## Continuous Integration

### GitHub Actions Test Workflow
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - run: yarn install
      - run: yarn test --coverage
      - run: yarn test:e2e
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

## Best Practices

### Testing Guidelines
1. Write tests before or alongside code (TDD/BDD)
2. Test behavior, not implementation
3. Use descriptive test names
4. Keep tests simple and focused
5. Mock external dependencies
6. Test error scenarios
7. Maintain high test coverage
8. Run tests in CI/CD pipeline

### Test Organization
- Group related tests in describe blocks
- Use consistent naming conventions
- Keep test files close to source files
- Separate unit, integration, and e2e tests
- Use shared test utilities and helpers
