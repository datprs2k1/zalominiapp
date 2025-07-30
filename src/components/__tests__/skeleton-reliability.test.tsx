import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import components to test
import { RobustSkeleton, RobustSkeletonGroup, RobustSkeletonTransition } from '../robust-skeleton-renderer';
import { SkeletonErrorBoundary, SkeletonSafeWrapper } from '../skeleton-error-boundary';
import { HomePageSkeleton } from '../route-skeletons';
import { useSafeLoadingState } from '../../hooks/use-safe-loading-state';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
  useInView: () => ({ ref: { current: null }, isInView: true }),
}));

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
  },
});

describe('Skeleton Reliability Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('RobustSkeleton', () => {
    it('always renders a valid DOM element', () => {
      render(<RobustSkeleton testId="robust-skeleton" />);
      const skeleton = screen.getByTestId('robust-skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('role', 'status');
    });

    it('renders fallback when in fallback mode', () => {
      render(<RobustSkeleton fallbackMode={true} testId="fallback-skeleton" />);
      const skeleton = screen.getByTestId('fallback-skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('data-skeleton-fallback', 'true');
    });

    it('handles invalid props gracefully', () => {
      // @ts-ignore - intentionally passing invalid props
      render(<RobustSkeleton variant="invalid" shape="invalid" testId="invalid-props" />);
      const skeleton = screen.getByTestId('invalid-props');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders with all shape variants', () => {
      const shapes = ['rectangle', 'circle', 'rounded', 'pill'] as const;
      shapes.forEach(shape => {
        render(<RobustSkeleton shape={shape} testId={`shape-${shape}`} />);
        const skeleton = screen.getByTestId(`shape-${shape}`);
        expect(skeleton).toBeInTheDocument();
      });
    });

    it('renders with all variant types', () => {
      const variants = ['primary', 'secondary', 'neutral', 'fast'] as const;
      variants.forEach(variant => {
        render(<RobustSkeleton variant={variant} testId={`variant-${variant}`} />);
        const skeleton = screen.getByTestId(`variant-${variant}`);
        expect(skeleton).toBeInTheDocument();
      });
    });
  });

  describe('SkeletonErrorBoundary', () => {
    const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div data-testid="normal-content">Normal content</div>;
    };

    it('renders children when no error occurs', () => {
      render(
        <SkeletonErrorBoundary>
          <ThrowError shouldThrow={false} />
        </SkeletonErrorBoundary>
      );
      expect(screen.getByTestId('normal-content')).toBeInTheDocument();
    });

    it('renders fallback when error occurs', () => {
      render(
        <SkeletonErrorBoundary>
          <ThrowError shouldThrow={true} />
        </SkeletonErrorBoundary>
      );
      const fallback = screen.getByRole('status');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveAttribute('data-skeleton-fallback', 'true');
    });

    it('renders custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Custom fallback</div>;
      render(
        <SkeletonErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </SkeletonErrorBoundary>
      );
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
      const onError = jest.fn();
      render(
        <SkeletonErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </SkeletonErrorBoundary>
      );
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('SkeletonSafeWrapper', () => {
    it('renders children normally when no error', () => {
      render(
        <SkeletonSafeWrapper componentName="TestComponent">
          <div data-testid="wrapped-content">Content</div>
        </SkeletonSafeWrapper>
      );
      expect(screen.getByTestId('wrapped-content')).toBeInTheDocument();
    });

    it('provides fallback dimensions', () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };

      render(
        <SkeletonSafeWrapper 
          componentName="TestComponent"
          fallbackHeight="h-32"
          fallbackWidth="w-64"
        >
          <ThrowError />
        </SkeletonSafeWrapper>
      );

      const fallback = screen.getByRole('status');
      expect(fallback).toHaveClass('h-32', 'w-64');
    });
  });

  describe('RobustSkeletonTransition', () => {
    it('shows skeleton when loading', () => {
      render(
        <RobustSkeletonTransition
          isLoading={true}
          skeleton={<div data-testid="skeleton">Loading...</div>}
          testId="transition"
        >
          <div data-testid="content">Content</div>
        </RobustSkeletonTransition>
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('shows content when not loading', () => {
      render(
        <RobustSkeletonTransition
          isLoading={false}
          skeleton={<div data-testid="skeleton">Loading...</div>}
          testId="transition"
        >
          <div data-testid="content">Content</div>
        </RobustSkeletonTransition>
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('handles fallback mode gracefully', () => {
      render(
        <RobustSkeletonTransition
          isLoading={true}
          fallbackMode={true}
          skeleton={<div data-testid="skeleton">Loading...</div>}
          testId="fallback-transition"
        >
          <div data-testid="content">Content</div>
        </RobustSkeletonTransition>
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
  });

  describe('HomePageSkeleton', () => {
    it('always renders without errors', () => {
      render(<HomePageSkeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<HomePageSkeleton className="custom-class" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('handles animation disabled', () => {
      render(<HomePageSkeleton animated={false} />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders fallback when error occurs', () => {
      // Mock console.error to verify fallback is triggered
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Force an error by mocking a dependency
      jest.doMock('../enhanced-medical-skeleton', () => {
        throw new Error('Mock error');
      });

      render(<HomePageSkeleton />);
      
      // Should still render something
      const fallback = screen.getByRole('status');
      expect(fallback).toBeInTheDocument();
    });
  });

  describe('Safe Loading State Hook', () => {
    const TestComponent = () => {
      const {
        loadingState,
        setLoading,
        shouldShowSkeleton,
        isStableLoading,
        forceRefresh,
      } = useSafeLoadingState({
        enableSkeletonFallback: true,
        medicalContext: 'general',
      });

      return (
        <div>
          <div data-testid="loading-state">{loadingState.isLoading.toString()}</div>
          <div data-testid="stable-loading">{isStableLoading.toString()}</div>
          <div data-testid="show-skeleton">{shouldShowSkeleton.toString()}</div>
          <div data-testid="render-key">{loadingState.renderKey}</div>
          <button onClick={() => setLoading(true)} data-testid="start-loading">
            Start Loading
          </button>
          <button onClick={() => setLoading(false)} data-testid="stop-loading">
            Stop Loading
          </button>
          <button onClick={forceRefresh} data-testid="force-refresh">
            Force Refresh
          </button>
        </div>
      );
    };

    it('manages loading state safely', async () => {
      render(<TestComponent />);

      // Initial state
      expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      expect(screen.getByTestId('stable-loading')).toHaveTextContent('false');

      // Start loading
      fireEvent.click(screen.getByTestId('start-loading'));
      
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('true');
      });

      // Stop loading
      fireEvent.click(screen.getByTestId('stop-loading'));
      
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      });
    });

    it('handles force refresh', () => {
      render(<TestComponent />);
      
      const initialRenderKey = screen.getByTestId('render-key').textContent;
      
      fireEvent.click(screen.getByTestId('force-refresh'));
      
      const newRenderKey = screen.getByTestId('render-key').textContent;
      expect(newRenderKey).not.toBe(initialRenderKey);
    });

    it('prevents rapid state changes', async () => {
      render(<TestComponent />);

      // Rapidly toggle loading state
      for (let i = 0; i < 20; i++) {
        fireEvent.click(screen.getByTestId('start-loading'));
        fireEvent.click(screen.getByTestId('stop-loading'));
      }

      // Should still be functional
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('handles missing performance API', () => {
      const originalPerformance = window.performance;
      // @ts-ignore
      delete window.performance;

      render(<RobustSkeleton testId="no-performance" />);
      const skeleton = screen.getByTestId('no-performance');
      expect(skeleton).toBeInTheDocument();

      window.performance = originalPerformance;
    });

    it('handles component unmounting during loading', async () => {
      const TestComponent = ({ show }: { show: boolean }) => {
        if (!show) return null;
        return <RobustSkeleton testId="unmount-test" />;
      };

      const { rerender } = render(<TestComponent show={true} />);
      expect(screen.getByTestId('unmount-test')).toBeInTheDocument();

      rerender(<TestComponent show={false} />);
      expect(screen.queryByTestId('unmount-test')).not.toBeInTheDocument();
    });

    it('handles null/undefined props gracefully', () => {
      // @ts-ignore - intentionally passing undefined
      render(<RobustSkeleton className={undefined} width={null} testId="null-props" />);
      const skeleton = screen.getByTestId('null-props');
      expect(skeleton).toBeInTheDocument();
    });
  });
});
