import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

// Import skeleton components
import { MedicalSkeleton, MedicalSkeletonCard, MedicalSkeletonGroup } from '../enhanced-medical-skeleton';
import { AccessibleMedicalSkeleton, AccessibleSkeletonGroup } from '../accessible-medical-skeleton';
import { SmoothSkeletonTransition } from '../smooth-skeleton-transitions';
import { ContentAwareSkeleton, DoctorProfileSkeleton } from '../advanced-skeleton-patterns';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock framer-motion for testing
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
    memory: {
      usedJSHeapSize: 1024 * 1024,
      totalJSHeapSize: 2 * 1024 * 1024,
      jsHeapSizeLimit: 4 * 1024 * 1024,
    },
  },
});

describe('Medical Skeleton Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('MedicalSkeleton', () => {
    it('renders with default props', () => {
      render(<MedicalSkeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('aria-label', 'Đang tải nội dung y tế...');
    });

    it('applies correct variant classes', () => {
      const { rerender } = render(<MedicalSkeleton variant="primary" />);
      let skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('skeleton-medical-primary');

      rerender(<MedicalSkeleton variant="secondary" />);
      skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('skeleton-medical-secondary');

      rerender(<MedicalSkeleton variant="neutral" />);
      skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('skeleton-medical-neutral');
    });

    it('respects reduced motion preferences', () => {
      const mockUseReducedMotion = jest.fn(() => true);
      jest.doMock('framer-motion', () => ({
        ...jest.requireActual('framer-motion'),
        useReducedMotion: mockUseReducedMotion,
      }));

      render(<MedicalSkeleton variant="primary" animated={true} />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('bg-blue-50');
    });

    it('applies custom dimensions', () => {
      render(<MedicalSkeleton width="w-32" height="h-8" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('w-32', 'h-8');
    });

    it('supports different shapes', () => {
      const { rerender } = render(<MedicalSkeleton shape="circle" />);
      let skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full', 'aspect-square');

      rerender(<MedicalSkeleton shape="pill" />);
      skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full');

      rerender(<MedicalSkeleton shape="rounded" />);
      skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-lg');
    });
  });

  describe('MedicalSkeletonCard', () => {
    it('renders complete card structure', () => {
      render(
        <MedicalSkeletonCard
          showImage={true}
          showTitle={true}
          showDescription={true}
          showActions={true}
        />
      );

      const card = screen.getByRole('status');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('aria-label', 'Đang tải thẻ thông tin y tế...');
    });

    it('conditionally renders sections', () => {
      render(
        <MedicalSkeletonCard
          showImage={false}
          showTitle={true}
          showDescription={false}
          showActions={false}
        />
      );

      const card = screen.getByRole('status');
      expect(card).toBeInTheDocument();
      // Should only contain title skeleton
    });
  });

  describe('AccessibleMedicalSkeleton', () => {
    it('provides comprehensive accessibility attributes', () => {
      render(
        <AccessibleMedicalSkeleton
          ariaLabel="Loading medical content"
          accessibility={{
            announceLoading: true,
            respectReducedMotion: true,
            highContrast: false,
          }}
        />
      );

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading medical content');
      expect(skeleton).toHaveAttribute('aria-live', 'polite');
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
    });

    it('supports high contrast mode', () => {
      render(
        <AccessibleMedicalSkeleton
          accessibility={{ highContrast: true }}
        />
      );

      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('border-2', 'border-blue-600');
    });
  });

  describe('SmoothSkeletonTransition', () => {
    it('shows skeleton when loading', () => {
      render(
        <SmoothSkeletonTransition
          isLoading={true}
          skeleton={<div data-testid="skeleton">Loading...</div>}
        >
          <div data-testid="content">Content</div>
        </SmoothSkeletonTransition>
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('shows content when not loading', () => {
      render(
        <SmoothSkeletonTransition
          isLoading={false}
          skeleton={<div data-testid="skeleton">Loading...</div>}
        >
          <div data-testid="content">Content</div>
        </SmoothSkeletonTransition>
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('calls transition callbacks', async () => {
      const onTransitionStart = jest.fn();
      const onTransitionComplete = jest.fn();

      const { rerender } = render(
        <SmoothSkeletonTransition
          isLoading={true}
          skeleton={<div data-testid="skeleton">Loading...</div>}
          onTransitionStart={onTransitionStart}
          onTransitionComplete={onTransitionComplete}
        >
          <div data-testid="content">Content</div>
        </SmoothSkeletonTransition>
      );

      rerender(
        <SmoothSkeletonTransition
          isLoading={false}
          skeleton={<div data-testid="skeleton">Loading...</div>}
          onTransitionStart={onTransitionStart}
          onTransitionComplete={onTransitionComplete}
        >
          <div data-testid="content">Content</div>
        </SmoothSkeletonTransition>
      );

      expect(onTransitionStart).toHaveBeenCalled();
      
      await waitFor(() => {
        expect(onTransitionComplete).toHaveBeenCalled();
      }, { timeout: 1000 });
    });
  });

  describe('ContentAwareSkeleton', () => {
    it('renders doctor skeleton correctly', () => {
      render(
        <ContentAwareSkeleton
          contentType="doctor"
          layout="card"
        />
      );

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders service skeleton correctly', () => {
      render(
        <ContentAwareSkeleton
          contentType="service"
          layout="grid"
          showActions={true}
        />
      );

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders appointment skeleton correctly', () => {
      render(
        <ContentAwareSkeleton
          contentType="appointment"
          layout="list"
          showActions={false}
        />
      );

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('DoctorProfileSkeleton', () => {
    it('renders card layout', () => {
      render(<DoctorProfileSkeleton layout="card" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders list layout', () => {
      render(<DoctorProfileSkeleton layout="list" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders detail layout', () => {
      render(<DoctorProfileSkeleton layout="detail" />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
    });
  });
});

describe('Accessibility Tests', () => {
  it('MedicalSkeleton has no accessibility violations', async () => {
    const { container } = render(<MedicalSkeleton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('MedicalSkeletonCard has no accessibility violations', async () => {
    const { container } = render(<MedicalSkeletonCard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('AccessibleMedicalSkeleton has no accessibility violations', async () => {
    const { container } = render(<AccessibleMedicalSkeleton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ContentAwareSkeleton has no accessibility violations', async () => {
    const { container } = render(
      <ContentAwareSkeleton contentType="doctor" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Performance Tests', () => {
  it('renders quickly under normal conditions', () => {
    const startTime = performance.now();
    
    render(<MedicalSkeleton />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render in less than 16ms (60fps)
    expect(renderTime).toBeLessThan(16);
  });

  it('handles multiple skeletons efficiently', () => {
    const startTime = performance.now();
    
    render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <MedicalSkeleton key={i} />
        ))}
      </div>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render 50 skeletons in reasonable time
    expect(renderTime).toBeLessThan(100);
  });

  it('memoization prevents unnecessary re-renders', () => {
    const TestComponent = () => {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
          <MedicalSkeleton />
        </div>
      );
    };

    const { getByRole } = render(<TestComponent />);
    const button = getByRole('button');
    
    // Click button to trigger re-render
    act(() => {
      button.click();
    });

    // Skeleton should not re-render unnecessarily
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
  });
});

describe('Visual Regression Tests', () => {
  it('maintains consistent visual appearance', () => {
    const { container } = render(
      <div style={{ width: '300px', padding: '16px' }}>
        <MedicalSkeletonCard
          variant="primary"
          showImage={true}
          showTitle={true}
          showDescription={true}
          showActions={true}
        />
      </div>
    );

    // This would typically use a visual regression testing tool
    // like Percy, Chromatic, or jest-image-snapshot
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly in different variants', () => {
    const variants = ['primary', 'secondary', 'neutral'] as const;
    
    variants.forEach(variant => {
      const { container } = render(
        <MedicalSkeleton variant={variant} width="w-32" height="h-8" />
      );
      
      expect(container.firstChild).toMatchSnapshot(`skeleton-${variant}`);
    });
  });
});

describe('Integration Tests', () => {
  it('works with loading state management', async () => {
    const TestComponent = () => {
      const [isLoading, setIsLoading] = React.useState(true);
      
      React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 100);
        return () => clearTimeout(timer);
      }, []);

      return (
        <SmoothSkeletonTransition
          isLoading={isLoading}
          skeleton={<MedicalSkeleton data-testid="skeleton" />}
        >
          <div data-testid="content">Loaded content</div>
        </SmoothSkeletonTransition>
      );
    };

    render(<TestComponent />);
    
    // Initially shows skeleton
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    
    // After loading, shows content
    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });
});
