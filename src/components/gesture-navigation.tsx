/**
 * Gesture-Based Navigation Component
 * Provides swipe navigation between pages for mobile devices
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useReducedMotion, PanInfo } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { EnhancedTouchManager } from '@/utils/enhanced-touch-interactions';

// Types
interface GestureNavigationProps {
  children: React.ReactNode;
  enableSwipeNavigation?: boolean;
  swipeThreshold?: number;
  pages?: Array<{
    path: string;
    title: string;
  }>;
  className?: string;
}

// Gesture Navigation Component
export const GestureNavigation: React.FC<GestureNavigationProps> = ({
  children,
  enableSwipeNavigation = true,
  swipeThreshold = 100,
  pages = [],
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchManagerRef = useRef<EnhancedTouchManager | null>(null);
  const { deviceInfo, hapticFeedback, getPlatformClasses } = useEnhancedMobile();
  const prefersReducedMotion = useReducedMotion();
  
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [canNavigateBack, setCanNavigateBack] = useState(false);
  const [canNavigateForward, setCanNavigateForward] = useState(false);

  // Check navigation possibilities
  useEffect(() => {
    if (pages.length === 0) {
      setCanNavigateBack(window.history.length > 1);
      setCanNavigateForward(false);
      return;
    }

    const currentIndex = pages.findIndex(page => page.path === location.pathname);
    setCanNavigateBack(currentIndex > 0);
    setCanNavigateForward(currentIndex < pages.length - 1);
  }, [location.pathname, pages]);

  // Set up gesture handling
  useEffect(() => {
    if (!containerRef.current || !enableSwipeNavigation || !deviceInfo.isTouch) return;

    const touchManager = new EnhancedTouchManager(containerRef.current)
      .setSwipeHandler((gesture) => {
        if (gesture.distance < swipeThreshold) return;

        if (gesture.direction === 'right' && canNavigateBack) {
          handleNavigateBack();
        } else if (gesture.direction === 'left' && canNavigateForward) {
          handleNavigateForward();
        }
      });

    touchManagerRef.current = touchManager;

    return () => {
      touchManager.destroy();
    };
  }, [enableSwipeNavigation, deviceInfo.isTouch, swipeThreshold, canNavigateBack, canNavigateForward]);

  // Handle navigation back
  const handleNavigateBack = useCallback(() => {
    hapticFeedback.light();
    
    if (pages.length > 0) {
      const currentIndex = pages.findIndex(page => page.path === location.pathname);
      if (currentIndex > 0) {
        navigate(pages[currentIndex - 1].path);
      }
    } else {
      navigate(-1);
    }
  }, [hapticFeedback, navigate, pages, location.pathname]);

  // Handle navigation forward
  const handleNavigateForward = useCallback(() => {
    hapticFeedback.light();
    
    if (pages.length > 0) {
      const currentIndex = pages.findIndex(page => page.path === location.pathname);
      if (currentIndex < pages.length - 1) {
        navigate(pages[currentIndex + 1].path);
      }
    }
  }, [hapticFeedback, navigate, pages, location.pathname]);

  // Handle pan start
  const handlePanStart = () => {
    if (!enableSwipeNavigation) return;
    setIsDragging(true);
  };

  // Handle pan
  const handlePan = (event: any, info: PanInfo) => {
    if (!enableSwipeNavigation || !isDragging) return;

    const { offset } = info;
    const maxDrag = 100;
    
    // Limit drag distance and apply resistance
    let constrainedX = offset.x;
    
    if (offset.x > 0 && !canNavigateBack) {
      constrainedX = offset.x * 0.2; // Resistance when can't navigate back
    } else if (offset.x < 0 && !canNavigateForward) {
      constrainedX = offset.x * 0.2; // Resistance when can't navigate forward
    } else {
      constrainedX = Math.max(-maxDrag, Math.min(maxDrag, offset.x));
    }
    
    setDragX(constrainedX);
  };

  // Handle pan end
  const handlePanEnd = (event: any, info: PanInfo) => {
    if (!enableSwipeNavigation) return;
    
    setIsDragging(false);
    setDragX(0);

    const { offset, velocity } = info;
    const swipeVelocityThreshold = 500;
    
    // Check if swipe was fast enough or far enough
    const shouldNavigate = Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > swipeVelocityThreshold;
    
    if (shouldNavigate) {
      if (offset.x > 0 && canNavigateBack) {
        handleNavigateBack();
      } else if (offset.x < 0 && canNavigateForward) {
        handleNavigateForward();
      }
    }
  };

  // Get navigation indicator styles
  const getIndicatorStyles = (direction: 'left' | 'right') => {
    const isVisible = isDragging && (
      (direction === 'left' && dragX > 20 && canNavigateBack) ||
      (direction === 'right' && dragX < -20 && canNavigateForward)
    );

    return {
      opacity: isVisible ? 1 : 0,
      transform: `translateX(${direction === 'left' ? dragX - 50 : dragX + 50}px)`,
      transition: isDragging ? 'none' : 'all 0.3s ease',
    };
  };

  // Animation variants
  const containerVariants = {
    initial: { x: 0 },
    animate: { x: dragX },
  };

  return (
    <div
      ref={containerRef}
      className={getPlatformClasses(`gesture-navigation ${className}`)}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        touchAction: enableSwipeNavigation ? 'pan-y' : 'auto',
      }}
    >
      {/* Navigation indicators */}
      {enableSwipeNavigation && deviceInfo.isTouch && (
        <>
          {/* Back indicator */}
          <div
            className="navigation-indicator back-indicator"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              pointerEvents: 'none',
              ...getIndicatorStyles('left'),
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
              }}
            >
              ←
            </div>
          </div>

          {/* Forward indicator */}
          <div
            className="navigation-indicator forward-indicator"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              pointerEvents: 'none',
              ...getIndicatorStyles('right'),
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
              }}
            >
              →
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <motion.div
        className="gesture-navigation-content"
        style={{
          width: '100%',
          height: '100%',
        }}
        variants={prefersReducedMotion ? {} : containerVariants}
        initial="initial"
        animate="animate"
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        drag={enableSwipeNavigation && deviceInfo.isTouch ? 'x' : false}
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.2}
      >
        {children}
      </motion.div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isDragging && canNavigateBack && dragX > 20 && 'Swipe right to go back'}
        {isDragging && canNavigateForward && dragX < -20 && 'Swipe left to go forward'}
      </div>
    </div>
  );
};

export default GestureNavigation;
