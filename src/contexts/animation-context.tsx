import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface AnimationContextType {
  isFirstVisit: boolean;
  markVisited: (key: string) => void;
  shouldAnimate: (key: string) => boolean;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [visitedKeys, setVisitedKeys] = useState<Record<string, boolean>>({});
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);

  // Check if this is the first visit to the site overall
  useEffect(() => {
    const hasVisitedSite = localStorage.getItem('hasVisitedSiteBefore') === 'true';

    if (!hasVisitedSite) {
      localStorage.setItem('hasVisitedSiteBefore', 'true');
      setIsFirstVisit(true);
    } else {
      setIsFirstVisit(false);
    }

    // Load any previously visited animation keys from localStorage
    const savedKeys = localStorage.getItem('animationKeys');
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        setVisitedKeys(parsedKeys);
      } catch (e) {
        console.error('Failed to parse animation keys from localStorage', e);
      }
    }
  }, []);

  // Save visited keys to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(visitedKeys).length > 0) {
      localStorage.setItem('animationKeys', JSON.stringify(visitedKeys));
    }
  }, [visitedKeys]);

  const markVisited = (key: string) => {
    setVisitedKeys((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const shouldAnimate = (key: string) => {
    // If no specific key is provided, use global first visit state
    if (!key) return isFirstVisit;

    // Otherwise check if this specific animation has been shown before
    return !visitedKeys[key];
  };

  return (
    <AnimationContext.Provider value={{ isFirstVisit, markVisited, shouldAnimate }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation(key?: string) {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }

  const { shouldAnimate, markVisited } = context;

  // Effect to mark animation as viewed once component mounts
  useEffect(() => {
    if (key) {
      markVisited(key);
    }
  }, [key, markVisited]);

  // Add the getAnimationClass function
  const getAnimationClass = (animationType: string, speed: 'fast' | 'normal' | 'slow' = 'normal') => {
    // Animation classes based on type and speed
    const speedClasses = {
      fast: 'duration-300',
      normal: 'duration-500',
      slow: 'duration-700',
    };

    const animationClasses: Record<string, string> = {
      fade: 'animate-fade-in',
      'slide-up': 'animate-slide-up',
      'slide-down': 'animate-slide-down',
      'slide-left': 'animate-slide-left',
      'slide-right': 'animate-slide-right',
    };

    const animationClass = animationClasses[animationType] || '';
    const speedClass = speedClasses[speed] || speedClasses.normal;

    return `${animationClass} ${speedClass}`;
  };

  return {
    shouldAnimate: key ? shouldAnimate(key) : context.isFirstVisit,
    isFirstVisit: context.isFirstVisit,
    getAnimationClass,
  };
}
