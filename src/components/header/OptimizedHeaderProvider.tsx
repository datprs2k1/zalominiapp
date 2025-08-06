/**
 * Optimized Header Provider Component
 * Performance-optimized provider with enhanced accessibility and memory management
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useRef } from 'react';
import { To, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { HeaderContextValue, AnimationConfig } from './types';
import { NAVIGATION_TIMEOUT } from './constants';
import { usePerformanceMonitor, useCleanup, preloadCriticalResources } from './utils/performance';
import { useScreenReaderAnnouncements, useReducedMotionPreference } from './utils/accessibility';

// Create optimized header context
const OptimizedHeaderContext = createContext<HeaderContextValue | null>(null);

// Optimized header provider props
interface OptimizedHeaderProviderProps {
  children: ReactNode;
  enablePerformanceMonitoring?: boolean;
  enablePreloading?: boolean;
}

// Optimized header provider component
export const OptimizedHeaderProvider: React.FC<OptimizedHeaderProviderProps> = ({ 
  children,
  enablePerformanceMonitoring = process.env.NODE_ENV === 'development',
  enablePreloading = true,
}) => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { deviceInfo, platformStyles, hapticFeedback } = useEnhancedMobile();
  const { announce } = useScreenReaderAnnouncements();
  
  // Performance monitoring
  if (enablePerformanceMonitoring) {
    usePerformanceMonitor('OptimizedHeaderProvider');
  }
  
  // Navigation state with ref for performance
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout>();

  // Preload critical resources on mount
  React.useEffect(() => {
    if (enablePreloading) {
      preloadCriticalResources();
    }
  }, [enablePreloading]);

  // Cleanup navigation timeout on unmount
  useCleanup(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
  });

  // Memoized animation configuration
  const animationConfig = useMemo<AnimationConfig>(() => ({
    prefersReducedMotion: !!prefersReducedMotion,
    enableTransitions: !prefersReducedMotion,
    duration: prefersReducedMotion ? 0.01 : 0.4,
  }), [prefersReducedMotion]);

  // Optimized navigation handler with performance improvements
  const handleNavigation = useCallback(
    (to: To) => {
      // Prevent multiple rapid navigations
      if (isNavigating) return;
      
      setIsNavigating(true);

      // Announce navigation to screen readers
      announce('Đang chuyển trang...', 'polite');

      // Provide haptic feedback for navigation
      hapticFeedback.light();

      // Clear any existing timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      // Navigate with view transition if supported
      try {
        navigate(to, { viewTransition: true });
      } catch (error) {
        // Fallback for browsers that don't support view transitions
        navigate(to);
      }
      
      // Reset navigation state after a short delay
      navigationTimeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
        announce('Đã chuyển trang thành công', 'polite');
      }, NAVIGATION_TIMEOUT);
    },
    [navigate, hapticFeedback, announce, isNavigating]
  );

  // Memoized context value with performance optimizations
  const contextValue = useMemo<HeaderContextValue>(() => ({
    deviceInfo,
    platformStyles,
    animationConfig,
    isNavigating,
    setIsNavigating,
    handleNavigation,
    hapticFeedback,
  }), [
    deviceInfo,
    platformStyles,
    animationConfig,
    isNavigating,
    handleNavigation,
    hapticFeedback,
  ]);

  return (
    <OptimizedHeaderContext.Provider value={contextValue}>
      {children}
    </OptimizedHeaderContext.Provider>
  );
};

// Optimized hook to use header context
export const useOptimizedHeaderContext = (): HeaderContextValue => {
  const context = useContext(OptimizedHeaderContext);
  if (!context) {
    throw new Error('useOptimizedHeaderContext must be used within an OptimizedHeaderProvider');
  }
  return context;
};

// Optimized hook to use header navigation
export const useOptimizedHeaderNavigation = () => {
  const { handleNavigation, isNavigating } = useOptimizedHeaderContext();
  return useMemo(() => ({ handleNavigation, isNavigating }), [handleNavigation, isNavigating]);
};

// Optimized hook to use header animations
export const useOptimizedHeaderAnimations = () => {
  const { animationConfig } = useOptimizedHeaderContext();
  return useMemo(() => animationConfig, [animationConfig]);
};

// Optimized hook to use header platform info
export const useOptimizedHeaderPlatform = () => {
  const { deviceInfo, platformStyles } = useOptimizedHeaderContext();
  return useMemo(() => ({ deviceInfo, platformStyles }), [deviceInfo, platformStyles]);
};

// Performance-optimized header hook that combines multiple contexts
export const useOptimizedHeader = () => {
  const context = useOptimizedHeaderContext();
  
  return useMemo(() => ({
    // Navigation
    handleNavigation: context.handleNavigation,
    isNavigating: context.isNavigating,
    
    // Platform
    deviceInfo: context.deviceInfo,
    platformStyles: context.platformStyles,
    
    // Animation
    animationConfig: context.animationConfig,
    prefersReducedMotion: context.animationConfig.prefersReducedMotion,
    
    // Haptic
    hapticFeedback: context.hapticFeedback,
  }), [context]);
};
