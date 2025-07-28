import React, { ReactNode, useEffect, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';

// Enhanced Touch Interactions
interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  threshold?: number;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = '',
  threshold = 100
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-threshold, 0, threshold], [0.5, 1, 0.5]);
  const rotate = useTransform(x, [-threshold, 0, threshold], [-10, 0, 10]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    
    if (offset > threshold && onSwipeRight) {
      onSwipeRight();
    } else if (offset < -threshold && onSwipeLeft) {
      onSwipeLeft();
    }
    
    // Reset position
    x.set(0);
  };

  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing ${className}`}
      style={{ x, opacity, rotate }}
      drag="x"
      dragConstraints={{ left: -threshold * 1.5, right: threshold * 1.5 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

// Pull to Refresh Component
interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  className = ''
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const scale = useTransform(y, [0, threshold], [0.8, 1]);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    y.set(0);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Pull to refresh indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-blue-50"
        style={{ opacity, scale, y: -40 }}
      >
        <div className="flex items-center space-x-2 text-blue-600">
          <motion.div
            className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
          />
          <span className="text-sm font-medium">
            {isRefreshing ? 'Đang làm mới...' : 'Kéo để làm mới'}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Enhanced Touch Button
interface TouchButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'medical' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  hapticFeedback?: boolean;
}

export function TouchButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  hapticFeedback = true
}: TouchButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    
    // Haptic feedback for mobile devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    onClick?.();
  };

  const variantStyles = {
    primary: 'bg-blue-600 text-white active:bg-blue-700',
    secondary: 'bg-gray-600 text-white active:bg-gray-700',
    medical: 'bg-gradient-to-r from-blue-500 to-green-500 text-white',
    emergency: 'bg-red-600 text-white active:bg-red-700'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[48px]'
  };

  return (
    <motion.button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-lg font-medium
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-manipulation
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
    >
      {children}
    </motion.button>
  );
}

// Mobile Navigation Drawer
interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'left' | 'right' | 'bottom';
}

export function MobileDrawer({
  isOpen,
  onClose,
  children,
  position = 'left'
}: MobileDrawerProps) {
  const variants = {
    left: {
      closed: { x: '-100%' },
      open: { x: 0 }
    },
    right: {
      closed: { x: '100%' },
      open: { x: 0 }
    },
    bottom: {
      closed: { y: '100%' },
      open: { y: 0 }
    }
  };

  const positionStyles = {
    left: 'left-0 top-0 h-full w-80 max-w-[80vw]',
    right: 'right-0 top-0 h-full w-80 max-w-[80vw]',
    bottom: 'bottom-0 left-0 right-0 h-auto max-h-[80vh]'
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <motion.div
        className={`
          fixed bg-white shadow-xl z-50
          ${positionStyles[position]}
        `}
        variants={variants[position]}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}

// Mobile-optimized Input
interface MobileInputProps {
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url';
}

export function MobileInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  autoFocus = false,
  inputMode
}: MobileInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      inputMode={inputMode}
      autoFocus={autoFocus}
      className={`
        w-full px-4 py-3 text-base
        border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all duration-200
        touch-manipulation
        ${className}
      `}
      style={{
        fontSize: '16px', // Prevents zoom on iOS
        WebkitAppearance: 'none',
        appearance: 'none'
      }}
    />
  );
}

// Gesture-based Image Viewer
interface GestureImageViewerProps {
  src: string;
  alt: string;
  className?: string;
}

export function GestureImageViewer({
  src,
  alt,
  className = ''
}: GestureImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handlePinch = (event: any, info: PanInfo) => {
    // Simple pinch-to-zoom implementation
    const newScale = Math.max(0.5, Math.min(3, scale + info.delta.y * 0.01));
    setScale(newScale);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    if (scale > 1) {
      setPosition({
        x: position.x + info.delta.x,
        y: position.y + info.delta.y
      });
    }
  };

  const resetTransform = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-auto cursor-grab active:cursor-grabbing"
        style={{
          scale,
          x: position.x,
          y: position.y
        }}
        drag={scale > 1}
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        onPan={handlePinch}
        onDrag={handleDrag}
        onDoubleClick={resetTransform}
        whileTap={{ scale: scale * 0.95 }}
      />
    </div>
  );
}

// Mobile-optimized Modal
interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  fullScreen?: boolean;
}

export function MobileModal({
  isOpen,
  onClose,
  title,
  children,
  fullScreen = false
}: MobileModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className={`
          relative bg-white rounded-t-xl sm:rounded-xl shadow-xl
          w-full max-w-lg mx-4
          ${fullScreen ? 'h-full sm:h-auto' : 'max-h-[90vh]'}
        `}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// Hook for mobile detection and capabilities
export function useMobileCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    hasTouch: false,
    hasVibration: false,
    hasGeolocation: false,
    isStandalone: false,
    orientation: 'portrait' as 'portrait' | 'landscape'
  });

  useEffect(() => {
    const updateCapabilities = () => {
      setCapabilities({
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        hasTouch: 'ontouchstart' in window,
        hasVibration: 'vibrate' in navigator,
        hasGeolocation: 'geolocation' in navigator,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      });
    };

    updateCapabilities();
    window.addEventListener('resize', updateCapabilities);
    window.addEventListener('orientationchange', updateCapabilities);

    return () => {
      window.removeEventListener('resize', updateCapabilities);
      window.removeEventListener('orientationchange', updateCapabilities);
    };
  }, []);

  return capabilities;
}
