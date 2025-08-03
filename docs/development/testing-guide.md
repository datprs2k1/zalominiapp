# Testing Guide

This comprehensive guide covers testing strategies, setup procedures, and best practices for the Zalo Healthcare Mini App, ensuring code quality and reliability.

## 📋 Table of Contents

- [Testing Strategy](#testing-strategy)
- [Test Setup](#test-setup)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Accessibility Testing](#accessibility-testing)
- [Performance Testing](#performance-testing)
- [Best Practices](#best-practices)

## 🎯 Testing Strategy

### Testing Pyramid

```
    /\
   /  \     E2E Tests (Few)
  /____\    - Critical user journeys
 /      \   - Cross-browser compatibility
/__________\ Integration Tests (Some)
            - API integration
            - Component interaction
            Unit Tests (Many)
            - Component logic
            - Utility functions
            - Business logic
```

### Test Types Overview

- **Unit Tests**: Individual components and functions
- **Integration Tests**: Component interactions and API calls
- **E2E Tests**: Complete user workflows
- **Accessibility Tests**: WCAG compliance and screen reader support
- **Performance Tests**: Load times and rendering performance
- **Visual Tests**: UI consistency and regression detection

## 🛠️ Test Setup

### Current Testing Setup

The project currently has a Jest configuration set up for services testing. To add comprehensive testing, install these dependencies:

```bash
# Install testing dependencies
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
yarn add -D jest ts-jest jest-environment-jsdom
yarn add -D jest-junit jest-watch-typeahead jest-sonar-reporter
```

### Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "jest-environment-jsdom": "^29.5.0",
    "jest-junit": "^16.0.0",
    "jest-watch-typeahead": "^2.2.2",
    "jest-sonar-reporter": "^2.0.0"
  }
}
```

### Current Jest Configuration

The project has a Jest configuration file at `src/services/__tests__/jest.config.js` optimized for testing medical API services:

**Key Features:**

- **TypeScript Support**: Uses `ts-jest` for TypeScript transformation
- **JSDOM Environment**: For testing React components
- **Path Mapping**: Supports `@/` path aliases
- **Coverage Reports**: HTML, LCOV, and JSON coverage reports
- **Medical Context**: Optimized for healthcare application testing

**Configuration Highlights:**

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/../$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Test Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:services": "jest src/services/__tests__",
    "test:components": "jest src/components/__tests__",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run only service tests
yarn test:services

# Run tests for CI/CD
yarn test:ci
```

## 🧪 Testing Examples for Zalo Healthcare

### Testing Medical Components

**Example: Testing the Button Component**

```typescript
// src/components/__tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
  it('renders with medical variant', () => {
    render(
      <Button variant="emergency" priority="critical">
        Emergency Call
      </Button>
    );

    const button = screen.getByRole('button', { name: /emergency call/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('emergency');
  });

  it('shows loading state for medical actions', () => {
    render(
      <Button loading variant="consultation">
        Book Appointment
      </Button>
    );

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

**Example: Testing Medical Card Component**

```typescript
// src/components/__tests__/medical-card.test.tsx
import { render, screen } from '@testing-library/react';
import { MedicalCard } from '../medical-card';

describe('MedicalCard Component', () => {
  it('displays doctor information correctly', () => {
    const doctorData = {
      name: 'Dr. John Smith',
      specialty: 'Cardiology',
      status: 'available'
    };

    render(
      <MedicalCard
        variant="elevated"
        status="consultation"
        header={<h3>{doctorData.name}</h3>}
      >
        {doctorData.specialty} - {doctorData.status}
      </MedicalCard>
    );

    expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    expect(screen.getByText(/cardiology/i)).toBeInTheDocument();
  });
});
```

### Testing API Services

**Example: Testing Doctor Service**

```typescript
// src/services/__tests__/doctors.test.ts
import { getDoctors, getDoctorById } from '../doctors';
import { mockDoctors } from '../../utils/mock';

// Mock the API client
jest.mock('../api', () => ({
  get: jest.fn(),
}));

describe('Doctors Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches doctors with medical filtering', async () => {
    const mockResponse = { data: mockDoctors };
    require('../api').get.mockResolvedValue(mockResponse);

    const doctors = await getDoctors({ specialty: 'cardiology' });

    expect(doctors).toHaveLength(mockDoctors.length);
    expect(doctors[0]).toHaveProperty('specialty');
    expect(doctors[0]).toHaveProperty('availability');
  });

  it('handles API errors gracefully', async () => {
    require('../api').get.mockRejectedValue(new Error('Network error'));

    await expect(getDoctors()).rejects.toThrow('Network error');
  });
});
```

### Testing Hooks

**Example: Testing Medical Service Hook**

```typescript
// src/hooks/__tests__/useMedicalServicePrices.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useMedicalServicePrices } from '../useMedicalServicePrices';

describe('useMedicalServicePrices Hook', () => {
  it('fetches service prices correctly', async () => {
    const { result } = renderHook(() => useMedicalServicePrices());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.prices).toBeDefined();
    expect(result.current.error).toBeNull();
  });
});
```

### Jest Configuration

**`jest.config.js`**

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/test/**', '!src/**/*.stories.tsx'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{ts,tsx}', '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'],
};
```

### Test Setup File

**`src/test/setup.ts`**

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { server } from './mocks/server';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock Zalo SDK
global.window.ZaloJavaScriptInterface = {
  getUserInfo: jest.fn(),
  openChat: jest.fn(),
  shareMessage: jest.fn(),
};

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
```

## 🧪 Unit Testing

### Component Testing

<augment_code_snippet path="src/components/**tests**/skeleton-components.test.tsx" mode="EXCERPT">

```typescript
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

// Import components to test
import { MedicalSkeleton, MedicalSkeletonCard } from '../enhanced-medical-skeleton';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('MedicalSkeleton', () => {
  it('renders with correct accessibility attributes', async () => {
    const { container } = render(<MedicalSkeleton />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

    // Accessibility test
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

</augment_code_snippet>

### Button Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading button</Button>);

    expect(screen.getByText('Đang xử lý...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant styles', () => {
    render(<Button variant="emergency">Emergency</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-medical-emergency');
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useDoctor } from '../hooks/useDoctor';
import { server } from '../test/mocks/server';
import { rest } from 'msw';

describe('useDoctor Hook', () => {
  it('fetches doctor data successfully', async () => {
    const mockDoctor = {
      id: 1,
      name: 'Dr. Smith',
      specialty: 'Cardiology',
    };

    server.use(
      rest.get('/api/doctors/1', (req, res, ctx) => {
        return res(ctx.json(mockDoctor));
      })
    );

    const { result } = renderHook(() => useDoctor(1));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.doctor).toEqual(mockDoctor);
    expect(result.current.error).toBeNull();
  });

  it('handles error states', async () => {
    server.use(
      rest.get('/api/doctors/1', (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ message: 'Not found' }));
      })
    );

    const { result } = renderHook(() => useDoctor(1));

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.doctor).toBeNull();
  });
});
```

### Utility Function Testing

```typescript
import { formatMedicalDate, validatePhoneNumber } from '../utils/medical';

describe('Medical Utilities', () => {
  describe('formatMedicalDate', () => {
    it('formats date correctly for Vietnamese locale', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatMedicalDate(date);

      expect(formatted).toBe('15/01/2024 10:30');
    });

    it('handles invalid dates', () => {
      const formatted = formatMedicalDate(null);
      expect(formatted).toBe('--');
    });
  });

  describe('validatePhoneNumber', () => {
    it('validates Vietnamese phone numbers', () => {
      expect(validatePhoneNumber('0901234567')).toBe(true);
      expect(validatePhoneNumber('+84901234567')).toBe(true);
      expect(validatePhoneNumber('123')).toBe(false);
    });
  });
});
```

## 🔗 Integration Testing

### API Integration Testing

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { DoctorsList } from '../components/DoctorsList';
import { server } from '../test/mocks/server';
import { rest } from 'msw';

describe('DoctorsList Integration', () => {
  it('fetches and displays doctors', async () => {
    const mockDoctors = [
      { id: 1, name: 'Dr. Smith', specialty: 'Cardiology' },
      { id: 2, name: 'Dr. Johnson', specialty: 'Neurology' }
    ];

    server.use(
      rest.get('/api/doctors', (req, res, ctx) => {
        return res(ctx.json(mockDoctors));
      })
    );

    render(<DoctorsList />);

    // Should show loading initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Should display doctors after loading
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. Johnson')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    server.use(
      rest.get('/api/doctors', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    render(<DoctorsList />);

    await waitFor(() => {
      expect(screen.getByText(/error loading doctors/i)).toBeInTheDocument();
    });
  });
});
```

### State Management Testing

```typescript
import { Provider } from 'jotai';
import { render, screen, fireEvent } from '@testing-library/react';
import { doctorsAtom } from '../state';
import { DoctorSelector } from '../components/DoctorSelector';

describe('Doctor State Management', () => {
  it('updates selected doctor state', async () => {
    const mockDoctors = [
      { id: 1, name: 'Dr. Smith', specialty: 'Cardiology' }
    ];

    render(
      <Provider initialValues={[[doctorsAtom, mockDoctors]]}>
        <DoctorSelector />
      </Provider>
    );

    const doctorCard = screen.getByText('Dr. Smith');
    fireEvent.click(doctorCard);

    // Verify state update
    expect(screen.getByText(/selected: dr. smith/i)).toBeInTheDocument();
  });
});
```

## 🎭 End-to-End Testing

### Playwright Setup

**`playwright.config.ts`**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'yarn start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
import { test, expect } from '@playwright/test';

test.describe('Doctor Booking Flow', () => {
  test('should complete appointment booking', async ({ page }) => {
    await page.goto('/');

    // Navigate to doctors page
    await page.click('[data-testid="doctors-link"]');
    await expect(page).toHaveURL('/doctors');

    // Select a doctor
    await page.click('[data-testid="doctor-card"]:first-child');
    await expect(page.locator('[data-testid="doctor-profile"]')).toBeVisible();

    // Book appointment
    await page.click('[data-testid="book-appointment"]');
    await page.fill('[data-testid="patient-name"]', 'John Doe');
    await page.fill('[data-testid="phone-number"]', '0901234567');
    await page.selectOption('[data-testid="time-slot"]', '09:00');

    // Submit booking
    await page.click('[data-testid="submit-booking"]');

    // Verify success
    await expect(page.locator('[data-testid="booking-success"]')).toBeVisible();
    await expect(page.locator('text=Booking confirmed')).toBeVisible();
  });

  test('should handle booking validation errors', async ({ page }) => {
    await page.goto('/booking');

    // Submit empty form
    await page.click('[data-testid="submit-booking"]');

    // Check validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Phone number is required')).toBeVisible();
  });
});
```

### Mobile E2E Testing

```typescript
test.describe('Mobile User Experience', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test mobile navigation
    await page.click('[data-testid="mobile-menu-toggle"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Test swipe gestures (if implemented)
    const card = page.locator('[data-testid="swipeable-card"]').first();
    await card.hover();
    await page.mouse.down();
    await page.mouse.move(100, 0);
    await page.mouse.up();

    // Verify swipe action
    await expect(page.locator('[data-testid="swiped-indicator"]')).toBeVisible();
  });
});
```

## ♿ Accessibility Testing

### Automated Accessibility Testing

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/doctors');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'search-input');

    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'filter-button');

    // Test Enter key activation
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="filter-menu"]')).toBeVisible();
  });
});
```

### Screen Reader Testing

```typescript
test('should provide proper screen reader support', async ({ page }) => {
  await page.goto('/doctors');

  // Check ARIA labels
  const searchInput = page.locator('[data-testid="search-input"]');
  await expect(searchInput).toHaveAttribute('aria-label', 'Search doctors');

  // Check live regions
  await page.fill('[data-testid="search-input"]', 'cardiology');
  await expect(page.locator('[aria-live="polite"]')).toContainText('3 results found');

  // Check focus management
  await page.click('[data-testid="doctor-card"]:first-child');
  await expect(page.locator('[data-testid="doctor-profile"] h1')).toBeFocused();
});
```

## ⚡ Performance Testing

### Load Time Testing

```typescript
test('should load pages within performance budget', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000); // 3 second budget

  // Check Core Web Vitals
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(
          entries.map((entry) => ({
            name: entry.name,
            value: entry.value,
          }))
        );
      }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    });
  });

  const lcp = metrics.find((m) => m.name === 'largest-contentful-paint');
  expect(lcp?.value).toBeLessThan(2500); // LCP budget
});
```

## 📏 Best Practices

### Test Organization

```typescript
// Group related tests
describe('DoctorCard Component', () => {
  describe('Rendering', () => {
    it('should render doctor information');
    it('should show availability status');
  });

  describe('Interactions', () => {
    it('should handle click events');
    it('should support keyboard navigation');
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels');
    it('should support screen readers');
  });
});
```

### Test Data Management

```typescript
// Test data factories
export const createMockDoctor = (overrides = {}) => ({
  id: 1,
  name: 'Dr. Smith',
  specialty: 'Cardiology',
  available: true,
  rating: 4.8,
  ...overrides,
});

// Use in tests
const doctor = createMockDoctor({ name: 'Dr. Johnson', specialty: 'Neurology' });
```

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
          cache: 'yarn'

      - run: yarn install --frozen-lockfile
      - run: yarn test --coverage
      - run: yarn test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
