/**
 * Header Provider Component
 * Provides shared context and state management for header components
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { To, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { HeaderContextValue, AnimationConfig } from './types';
import { NAVIGATION_TIMEOUT } from './constants';

// Create header context
const HeaderContext = createContext<HeaderContextValue | null>(null);

// Header provider props
interface HeaderProviderProps {
  children: ReactNode;
}

// Header provider component
export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { deviceInfo, platformStyles, hapticFeedback } = useEnhancedMobile();
  
  // Navigation state
  const [isNavigating, setIsNavigating] = useState(false);

  // Animation configuration
  const animationConfig = useMemo<AnimationConfig>(() => ({
    prefersReducedMotion: !!prefersReducedMotion,
    enableTransitions: !prefersReducedMotion,
    duration: prefersReducedMotion ? 0.01 : 0.4,
  }), [prefersReducedMotion]);

  // Enhanced navigation handler with loading state and haptic feedback
  const handleNavigation = useCallback(
    (to: To) => {
      setIsNavigating(true);

      // Provide haptic feedback for navigation
      hapticFeedback.light();

      // Navigate with view transition if supported
      navigate(to, { viewTransition: true });
      
      // Reset navigation state after a short delay
      setTimeout(() => setIsNavigating(false), NAVIGATION_TIMEOUT);
    },
    [navigate, hapticFeedback]
  );

  // Context value
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
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  );
};

// Hook to use header context
export const useHeaderContext = (): HeaderContextValue => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeaderContext must be used within a HeaderProvider');
  }
  return context;
};

// Hook to use header navigation
export const useHeaderNavigation = () => {
  const { handleNavigation, isNavigating } = useHeaderContext();
  return { handleNavigation, isNavigating };
};

// Hook to use header animations
export const useHeaderAnimations = () => {
  const { animationConfig } = useHeaderContext();
  return animationConfig;
};

// Hook to use header platform info
export const useHeaderPlatform = () => {
  const { deviceInfo, platformStyles } = useHeaderContext();
  return { deviceInfo, platformStyles };
};
