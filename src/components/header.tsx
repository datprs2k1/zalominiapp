/**
 * Enhanced Header Component - Main Entry Point
 * Provides platform-specific header implementations with medical theming
 */

import { memo } from 'react';
import { OptimizedHeaderProvider } from './header/OptimizedHeaderProvider';
import { PlatformHeader } from './header/PlatformHeader';
import { HeaderErrorBoundary } from './header/HeaderErrorBoundary';
import { HeaderProps } from './header/types';

// Main Header component using the new modular architecture with optimizations
const Header: React.FC<HeaderProps> = memo((props) => {
  return (
    <OptimizedHeaderProvider
      enablePerformanceMonitoring={process.env.NODE_ENV === 'development'}
      enablePreloading={true}
    >
      <PlatformHeader {...props} />
    </OptimizedHeaderProvider>
  );
});

Header.displayName = 'Header';

// Enhanced Header component with error boundary and performance optimizations
const EnhancedHeader = memo(() => {
  return (
    <HeaderErrorBoundary>
      <Header />
    </HeaderErrorBoundary>
  );
});

EnhancedHeader.displayName = 'EnhancedHeader';

export default EnhancedHeader;
