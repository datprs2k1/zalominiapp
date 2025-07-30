import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Import the main page component and related components
import Page from '../page';
import { HomePageSkeleton } from '../route-skeletons';

// Mock all the hooks and dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigation: () => ({
    state: 'idle',
  }),
  Outlet: () => <div data-testid="outlet-content">Page Content</div>,
}));

jest.mock('@/hooks', () => ({
  useRouteHandle: () => [{ noScroll: false }],
}));

jest.mock('@/hooks/use-route-transition', () => ({
  useRouteTransition: () => ({
    isTransitioning: false,
    currentPath: '/test',
    direction: 'none',
  }),
  useRouteSkeletonLoading: () => ({
    isSkeletonVisible: false,
  }),
}));

jest.mock('@/hooks/use-route-skeleton', () => ({
  useRouteSkeleton: () => ({
    component: HomePageSkeleton,
  }),
  useSkeletonVisibility: () => false,
}));

jest.mock('@/components/route-loading', () => ({
  RouteLoading: () => <div data-testid="route-loading">Loading...</div>,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
  },
});

describe('Skeleton Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Page Component Integration', () => {
    it('renders without crashing', () => {
      render(
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      );

      // Should render the page content
      expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
    });

    it('handles skeleton loading states', async () => {
      // Mock loading state
      jest.doMock('@/hooks/use-route-skeleton', () => ({
        useRouteSkeleton: () => ({
          component: HomePageSkeleton,
        }),
        useSkeletonVisibility: () => true, // Force skeleton to show
      }));

      render(
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      );

      // Should render without errors even with skeleton showing
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });

    it('handles navigation state changes', async () => {
      // Mock navigation loading
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigation: () => ({
          state: 'loading',
        }),
        Outlet: () => <div data-testid="outlet-content">Page Content</div>,
      }));

      render(
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      );

      // Should handle navigation loading gracefully
      await waitFor(() => {
        expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery Integration', () => {
    it('recovers from skeleton rendering errors', () => {
      // Mock a skeleton that throws an error
      const ErrorSkeleton = () => {
        throw new Error('Skeleton rendering failed');
      };

      jest.doMock('@/hooks/use-route-skeleton', () => ({
        useRouteSkeleton: () => ({
          component: ErrorSkeleton,
        }),
        useSkeletonVisibility: () => true,
      }));

      render(
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      );

      // Should still render something (fallback)
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('handles missing dependencies gracefully', () => {
      // Mock missing performance API
      const originalPerformance = window.performance;
      // @ts-ignore
      delete window.performance;

      render(
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      );

      expect(screen.getByTestId('outlet-content')).toBeInTheDocument();

      // Restore performance API
      window.performance = originalPerformance;
    });
  });

  describe('Performance Integration', () => {
    it('handles rapid state changes without breaking', async () => {
      let toggleCount = 0;
      const maxToggles = 50;

      // Mock rapidly changing navigation state
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigation: () => ({
          state: toggleCount % 2 === 0 ? 'idle' : 'loading',
        }),
        Outlet: () => <div data-testid="outlet-content">Page Content</div>,
      }));

      const { rerender } = render(
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      );

      // Rapidly toggle navigation state
      for (let i = 0; i < maxToggles; i++) {
        toggleCount = i;
        rerender(
          <BrowserRouter>
            <Page />
          </BrowserRouter>
        );
      }

      // Should still be functional
      await waitFor(() => {
        expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
      });
    });

    it('handles memory pressure gracefully', () => {
      // Create many skeleton instances
      const skeletons = Array.from({ length: 100 }, (_, i) => (
        <HomePageSkeleton key={i} />
      ));

      render(<div>{skeletons}</div>);

      // Should render all skeletons without memory issues
      const renderedSkeletons = screen.getAllByRole('status');
      expect(renderedSkeletons).toHaveLength(100);
    });
  });

  describe('Accessibility Integration', () => {
    it('maintains accessibility during loading transitions', async () => {
      render(
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      );

      // Check for proper ARIA attributes
      const statusElements = screen.getAllByRole('status');
      statusElements.forEach(element => {
        expect(element).toHaveAttribute('aria-live');
      });
    });

    it('handles screen reader announcements', async () => {
      render(
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      );

      // Should have proper aria-labels
      const statusElements = screen.getAllByRole('status');
      statusElements.forEach(element => {
        expect(element).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Real-world Scenarios', () => {
    it('handles slow network conditions', async () => {
      // Simulate slow loading
      jest.useFakeTimers();

      render(
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      );

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(screen.getByTestId('outlet-content')).toBeInTheDocument();

      jest.useRealTimers();
    });

    it('handles component unmounting during loading', async () => {
      const TestWrapper = ({ show }: { show: boolean }) => {
        if (!show) return null;
        return (
          <BrowserRouter>
            <Page />
          </BrowserRouter>
        );
      };

      const { rerender } = render(<TestWrapper show={true} />);
      expect(screen.getByTestId('outlet-content')).toBeInTheDocument();

      // Unmount during loading
      rerender(<TestWrapper show={false} />);
      expect(screen.queryByTestId('outlet-content')).not.toBeInTheDocument();

      // Remount
      rerender(<TestWrapper show={true} />);
      expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
    });

    it('handles browser back/forward navigation', async () => {
      render(
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      );

      // Simulate navigation
      act(() => {
        window.history.pushState({}, '', '/new-page');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });

      // Should still render correctly
      await waitFor(() => {
        expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles null/undefined props', () => {
      // @ts-ignore - intentionally passing invalid props
      render(<HomePageSkeleton className={null} animated={undefined} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('handles invalid CSS classes', () => {
      render(<HomePageSkeleton className="invalid-class-!@#$%^&*()" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('handles extremely large datasets', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      
      render(
        <div>
          {largeArray.map(i => (
            <HomePageSkeleton key={i} />
          ))}
        </div>
      );

      // Should handle large numbers of skeletons
      const skeletons = screen.getAllByRole('status');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});
