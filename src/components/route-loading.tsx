import { motion, AnimatePresence } from 'framer-motion';
import { LoadingOverlay } from '@/components/loading-states';
import { useState } from 'react';

interface RouteLoadingProps {
  isVisible: boolean;
  direction?: 'forward' | 'backward' | 'none';
  message?: string;
  variant?: 'overlay' | 'inline' | 'minimal';
}

export function RouteLoading({ isVisible, direction = 'none', message, variant = 'overlay' }: RouteLoadingProps) {
  // Generate appropriate loading message based on direction
  const getLoadingMessage = () => {
    if (message) return message;

    switch (direction) {
      case 'forward':
        return 'Đang chuyển trang...';
      case 'backward':
        return 'Đang quay lại...';
      default:
        return 'Đang tải...';
    }
  };

  if (variant === 'overlay') {
    return <LoadingOverlay isVisible={isVisible} message={getLoadingMessage()} variant="blur" />;
  }

  if (variant === 'minimal') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-green-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, originX: 1 }}
            transition={{
              duration: 0.25, // Faster progress bar
              ease: 'easeOut',
            }}
          />
        )}
      </AnimatePresence>
    );
  }

  // Inline variant - optimized for smooth experience
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{
            duration: 0.2, // Faster inline loading
            ease: 'easeOut',
          }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-6 h-6 border-2 border-blue-200 rounded-full border-t-blue-600"
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.8, // Faster spinner
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <span className="text-sm text-gray-600 font-medium">{getLoadingMessage()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing route loading states
export function useRouteLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>();

  const startLoading = (message?: string) => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage(undefined);
  };

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
  };
}

export default RouteLoading;
