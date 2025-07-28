import { useRouteHandle } from '@/hooks';
import { Outlet, useNavigation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouteTransition, useRouteSkeletonLoading } from '@/hooks/use-route-transition';
import { useRouteSkeleton, useSkeletonVisibility } from '@/hooks/use-route-skeleton';
import { RouteLoading } from '@/components/route-loading';
import { useEffect, useState } from 'react';

function Page() {
  const [handle] = useRouteHandle();
  const navigation = useNavigation();
  const routeTransition = useRouteTransition();
  const skeletonLoading = useRouteSkeletonLoading();
  const routeSkeleton = useRouteSkeleton();
  const shouldShowSkeleton = useSkeletonVisibility();
  const [showRouteLoading, setShowRouteLoading] = useState(false);

  // Show loading when navigation is in progress
  const isNavigating = navigation.state === 'loading' || navigation.state === 'submitting';

  // Show loading overlay for route transitions
  useEffect(() => {
    if (routeTransition.isTransitioning) {
      setShowRouteLoading(true);

      // Hide loading after transition completes
      const timer = setTimeout(() => {
        setShowRouteLoading(false);
      }, 400); // Match transition duration

      return () => clearTimeout(timer);
    } else {
      setShowRouteLoading(false);
    }
  }, [routeTransition.isTransitioning]);

  // Get the appropriate skeleton component
  const SkeletonComponent = routeSkeleton.component;

  // Determine if we should show skeleton
  const showSkeleton = shouldShowSkeleton && (isNavigating || skeletonLoading.isSkeletonVisible);

  return (
    <>
      {/* Top Progress Bar */}
      <RouteLoading
        isVisible={isNavigating || showRouteLoading}
        direction={routeTransition.direction}
        variant="minimal"
      />

      {/* Route Loading Overlay - Only for longer transitions */}
      <RouteLoading
        isVisible={isNavigating && navigation.state === 'loading'}
        direction={routeTransition.direction}
        variant="overlay"
      />

      {/* Page Content with Transition */}
      <motion.div
        className={`flex-1 flex flex-col z-10 ${handle.noScroll ? 'overflow-hidden' : 'overflow-y-auto'}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: isNavigating || showRouteLoading ? 0.3 : 1,
          y: isNavigating || showRouteLoading ? 10 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <AnimatePresence mode="wait">
          {showSkeleton ? (
            // Show skeleton loading for the current route - optimized for smooth experience
            <motion.div
              key={`skeleton-${routeTransition.currentPath}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.15, // Faster skeleton appearance
                ease: 'easeOut',
              }}
              className="w-full h-full"
            >
              <SkeletonComponent className="w-full h-full" animated={true} />
            </motion.div>
          ) : (
            // Show actual page content - optimized transitions
            <motion.div
              key={routeTransition.currentPath}
              initial={{
                opacity: 0,
                x: routeTransition.direction === 'forward' ? 15 : routeTransition.direction === 'backward' ? -15 : 0,
                y: routeTransition.direction === 'none' ? 5 : 0,
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
              }}
              exit={{
                opacity: 0,
                x: routeTransition.direction === 'forward' ? -15 : routeTransition.direction === 'backward' ? 15 : 0,
                y: routeTransition.direction === 'none' ? -5 : 0,
              }}
              transition={{
                duration: 0.25, // Faster content transition
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default Page;
