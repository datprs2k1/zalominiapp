/**
 * Lazy Component Loader
 * Code splitting and lazy loading for React components
 */

import React, { Suspense, lazy, ComponentType } from 'react';
import { Loading } from './Loading';
import { cn } from '@/utils/cn';

// Error boundary for lazy components
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LazyComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} />;
      }
      
      return (
        <div className="p-8 text-center bg-danger-50 border border-danger-200 rounded-medical">
          <div className="w-12 h-12 mx-auto mb-4 text-danger-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-danger-800 mb-2">
            Lỗi tải component
          </h3>
          <p className="text-danger-600 mb-4">
            Không thể tải component này. Vui lòng thử lại.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-medical-secondary"
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy component wrapper with loading states
interface LazyComponentProps {
  children: React.ReactNode;
  loading?: React.ComponentType;
  error?: React.ComponentType<{ error: Error }>;
  className?: string;
  minLoadingTime?: number;
}

export const LazyComponentWrapper: React.FC<LazyComponentProps> = ({
  children,
  loading: LoadingComponent = () => <Loading variant="spinner" size="lg" />,
  error: ErrorComponent,
  className,
  minLoadingTime = 200,
}) => {
  const [showLoading, setShowLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  return (
    <div className={cn('lazy-component-wrapper', className)}>
      <LazyComponentErrorBoundary fallback={ErrorComponent}>
        <Suspense fallback={showLoading ? <LoadingComponent /> : null}>
          {children}
        </Suspense>
      </LazyComponentErrorBoundary>
    </div>
  );
};

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: {
    loading?: React.ComponentType;
    error?: React.ComponentType<{ error: Error }>;
    minLoadingTime?: number;
  } = {}
) => {
  const LazyComponent = lazy(importFunc);

  return React.forwardRef<any, P>((props, ref) => (
    <LazyComponentWrapper {...options}>
      <LazyComponent {...props} ref={ref} />
    </LazyComponentWrapper>
  ));
};

// Route-based code splitting
export const createLazyRoute = (
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  options: {
    loading?: React.ComponentType;
    error?: React.ComponentType<{ error: Error }>;
    preload?: boolean;
  } = {}
) => {
  const LazyComponent = lazy(importFunc);

  // Preload the component if requested
  if (options.preload) {
    importFunc();
  }

  const RouteComponent: React.FC<any> = (props) => (
    <LazyComponentWrapper
      loading={options.loading}
      error={options.error}
      className="min-h-screen"
    >
      <LazyComponent {...props} />
    </LazyComponentWrapper>
  );

  // Add preload method to component
  (RouteComponent as any).preload = importFunc;

  return RouteComponent;
};

// Progressive enhancement wrapper
interface ProgressiveEnhancementProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  condition?: () => boolean;
  className?: string;
}

export const ProgressiveEnhancement: React.FC<ProgressiveEnhancementProps> = ({
  children,
  fallback,
  condition = () => true,
  className,
}) => {
  const [shouldEnhance, setShouldEnhance] = React.useState(false);

  React.useEffect(() => {
    // Check if enhancement should be applied
    if (condition()) {
      setShouldEnhance(true);
    }
  }, [condition]);

  return (
    <div className={className}>
      {shouldEnhance ? children : fallback}
    </div>
  );
};

// Intersection-based lazy loading
interface IntersectionLazyProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  once?: boolean;
}

export const IntersectionLazy: React.FC<IntersectionLazyProps> = ({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  className,
  once = true,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder}
    </div>
  );
};

// Bundle splitting utilities
export const preloadRoute = (routeImport: () => Promise<any>) => {
  // Preload on hover or focus
  const handlePreload = () => {
    routeImport();
  };

  return {
    onMouseEnter: handlePreload,
    onFocus: handlePreload,
  };
};

// Component registry for dynamic imports
class ComponentRegistry {
  private components = new Map<string, () => Promise<{ default: ComponentType<any> }>>();
  private cache = new Map<string, ComponentType<any>>();

  register(name: string, importFunc: () => Promise<{ default: ComponentType<any> }>) {
    this.components.set(name, importFunc);
  }

  async load(name: string): Promise<ComponentType<any> | null> {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    const importFunc = this.components.get(name);
    if (!importFunc) {
      console.warn(`Component "${name}" not found in registry`);
      return null;
    }

    try {
      const module = await importFunc();
      const component = module.default;
      this.cache.set(name, component);
      return component;
    } catch (error) {
      console.error(`Failed to load component "${name}":`, error);
      return null;
    }
  }

  preload(name: string) {
    const importFunc = this.components.get(name);
    if (importFunc) {
      importFunc();
    }
  }

  preloadAll() {
    this.components.forEach((importFunc) => {
      importFunc();
    });
  }
}

export const componentRegistry = new ComponentRegistry();

// Dynamic component loader
interface DynamicComponentProps {
  name: string;
  fallback?: React.ComponentType;
  error?: React.ComponentType<{ error: Error }>;
  [key: string]: any;
}

export const DynamicComponent: React.FC<DynamicComponentProps> = ({
  name,
  fallback: FallbackComponent = () => <Loading variant="spinner" />,
  error: ErrorComponent,
  ...props
}) => {
  const [Component, setComponent] = React.useState<ComponentType<any> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        const component = await componentRegistry.load(name);
        
        if (mounted) {
          setComponent(() => component);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      mounted = false;
    };
  }, [name]);

  if (loading) {
    return <FallbackComponent />;
  }

  if (error) {
    if (ErrorComponent) {
      return <ErrorComponent error={error} />;
    }
    return (
      <div className="p-4 text-center text-danger-600">
        Failed to load component: {name}
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="p-4 text-center text-neutral-500">
        Component not found: {name}
      </div>
    );
  }

  return <Component {...props} />;
};
