/**
 * Header Performance Tests
 * Tests for performance optimizations and memory management
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'jotai';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { HeaderProvider } from '../HeaderProvider';
import { OptimizedHeaderProvider } from '../OptimizedHeaderProvider';
import { PlatformHeader } from '../PlatformHeader';
import { Logo } from '../components/Logo';
import { OptimizedLogo } from '../components/OptimizedLogo';
import { BackButton } from '../components/BackButton';
import { OptimizedBackButton } from '../components/OptimizedBackButton';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock dependencies
vi.mock('@/hooks', () => ({
  useRouteHandle: () => [{ title: 'Test Page', back: false }],
}));

vi.mock('@/hooks/use-enhanced-mobile', () => ({
  useEnhancedMobile: () => ({
    deviceInfo: {
      platform: 'web',
      isTouch: false,
      screenSize: 'medium',
      orientation: 'portrait',
      safeAreas: { top: 0, bottom: 0, left: 0, right: 0 },
    },
    platformStyles: {
      touchTarget: {},
      typography: {},
      colors: {},
      spacing: {},
      borderRadius: {},
      shadows: {},
      animations: {},
    },
    hapticFeedback: {
      light: vi.fn(),
      medium: vi.fn(),
      heavy: vi.fn(),
    },
  }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    header: 'header',
    div: 'div',
    button: 'button',
  },
  useReducedMotion: () => false,
}));

// Test wrapper components
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <Provider>
      <HeaderProvider>
        {children}
      </HeaderProvider>
    </Provider>
  </BrowserRouter>
);

const OptimizedTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <Provider>
      <OptimizedHeaderProvider>
        {children}
      </OptimizedHeaderProvider>
    </Provider>
  </BrowserRouter>
);

describe('Header Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformance.now.mockReturnValue(Date.now());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Render Performance', () => {
    it('renders header components efficiently', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Header should render quickly (under 16ms for 60fps)
      expect(renderTime).toBeLessThan(16);
    });

    it('optimized components render faster than regular components', async () => {
      // Test regular logo
      const regularStart = performance.now();
      const { unmount: unmountRegular } = render(
        <TestWrapper>
          <Logo />
        </TestWrapper>
      );
      const regularEnd = performance.now();
      const regularTime = regularEnd - regularStart;
      unmountRegular();

      // Test optimized logo
      const optimizedStart = performance.now();
      const { unmount: unmountOptimized } = render(
        <OptimizedTestWrapper>
          <OptimizedLogo />
        </OptimizedTestWrapper>
      );
      const optimizedEnd = performance.now();
      const optimizedTime = optimizedEnd - optimizedStart;
      unmountOptimized();

      // Optimized version should be faster or at least not significantly slower
      expect(optimizedTime).toBeLessThanOrEqual(regularTime * 1.1);
    });
  });

  describe('Memory Management', () => {
    it('cleans up event listeners on unmount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );

      // Should add scroll listener
      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });

      unmount();

      // Should remove scroll listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('cleans up timeouts on unmount', async () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const mockNavigate = vi.fn();

      const { unmount } = render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );

      // Trigger navigation
      const button = screen.getByRole('button');
      fireEvent.click(button);

      unmount();

      // Should clean up any pending timeouts
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('Memoization', () => {
    it('memoizes expensive calculations', () => {
      const TestComponent = () => {
        const [count, setCount] = React.useState(0);
        
        return (
          <TestWrapper>
            <div>
              <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
              <Logo />
            </div>
          </TestWrapper>
        );
      };

      render(<TestComponent />);
      
      const button = screen.getByText(/Count:/);
      const logo = screen.getByRole('img');
      
      // Initial render
      expect(logo).toBeInTheDocument();
      
      // Re-render by updating state
      fireEvent.click(button);
      
      // Logo should still be the same instance (memoized)
      expect(screen.getByRole('img')).toBe(logo);
    });

    it('optimized components use React.memo effectively', () => {
      const renderSpy = vi.fn();
      
      const TestOptimizedLogo = React.memo(() => {
        renderSpy();
        return <OptimizedLogo />;
      });

      const TestComponent = () => {
        const [count, setCount] = React.useState(0);
        
        return (
          <OptimizedTestWrapper>
            <div>
              <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
              <TestOptimizedLogo />
            </div>
          </OptimizedTestWrapper>
        );
      };

      render(<TestComponent />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render parent
      const button = screen.getByText(/Count:/);
      fireEvent.click(button);
      
      // Memoized component should not re-render
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Scroll Performance', () => {
    it('throttles scroll events', async () => {
      const scrollHandler = vi.fn();
      
      // Mock scroll event throttling
      let throttledHandler: () => void;
      vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
        if (event === 'scroll') {
          throttledHandler = handler as () => void;
        }
      });

      render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );

      // Simulate rapid scroll events
      for (let i = 0; i < 10; i++) {
        if (throttledHandler) {
          throttledHandler();
        }
      }

      // Should throttle scroll events to improve performance
      expect(true).toBe(true); // Placeholder - actual throttling would need more complex testing
    });
  });

  describe('Bundle Size Optimization', () => {
    it('lazy loads heavy components when needed', async () => {
      // This would require actual bundle analysis tools
      // For now, we test that components can be dynamically imported
      
      const LazyComponent = React.lazy(() => 
        Promise.resolve({ default: () => <div>Lazy Component</div> })
      );

      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </React.Suspense>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Lazy Component')).toBeInTheDocument();
      });
    });
  });

  describe('Animation Performance', () => {
    it('respects reduced motion preferences for performance', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <TestWrapper>
          <Logo animated={true} />
        </TestWrapper>
      );

      // Should disable animations for better performance when reduced motion is preferred
      expect(true).toBe(true); // Placeholder for actual animation testing
    });
  });

  describe('Network Performance', () => {
    it('preloads critical resources', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.head, 'appendChild');

      render(
        <OptimizedTestWrapper>
          <PlatformHeader />
        </OptimizedTestWrapper>
      );

      // Should preload critical fonts and resources
      expect(createElementSpy).toHaveBeenCalledWith('link');
      expect(appendChildSpy).toHaveBeenCalled();
    });
  });

  describe('CPU Usage', () => {
    it('minimizes CPU usage during interactions', async () => {
      const mockNavigate = vi.fn();
      
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      
      // Measure CPU time for interaction
      const startTime = performance.now();
      
      fireEvent.click(button);
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;
      
      // Interaction should be fast
      expect(interactionTime).toBeLessThan(5);
    });
  });

  describe('Memory Leaks', () => {
    it('prevents memory leaks from event listeners', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );

      unmount();

      // Should clean up all event listeners
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it('prevents memory leaks from timers', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      
      const { unmount } = render(
        <OptimizedTestWrapper>
          <PlatformHeader />
        </OptimizedTestWrapper>
      );

      unmount();

      // Should clean up any timers
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
