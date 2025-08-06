/**
 * Header Error Boundary Component
 * Provides error handling and fallback UI for header components
 */

import React, { Component, ReactNode } from 'react';
import { HeaderErrorBoundaryProps } from './types';

// Error boundary state
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

// Default fallback component
const DefaultFallback: React.FC = () => (
  <header className="flex-none w-full min-h-[64px] bg-white border-b border-gray-200 px-4 py-3">
    <div className="flex items-center justify-center">
      <span className="text-gray-500 text-sm">Đang tải header...</span>
    </div>
  </header>
);

// Header error boundary class component
export class HeaderErrorBoundary extends Component<HeaderErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: HeaderErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error for debugging
    console.error('Header Error Boundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback || <DefaultFallback />;
    }

    return this.props.children;
  }
}

// Functional wrapper for easier usage
export const HeaderErrorBoundaryWrapper: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}> = ({ children, fallback, onError }) => {
  return (
    <HeaderErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </HeaderErrorBoundary>
  );
};
