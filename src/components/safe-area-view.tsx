/**
 * Safe Area View Component
 * Provides safe area handling for iOS and Android devices
 */

import React, { forwardRef } from 'react';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { useStatusBar } from './platform-status-bar';

// Types
interface SafeAreaViewProps {
  children: React.ReactNode;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  style?: React.CSSProperties;
  className?: string;
  backgroundColor?: string;
  mode?: 'padding' | 'margin';
}

// Safe Area View Component
export const SafeAreaView = forwardRef<HTMLDivElement, SafeAreaViewProps>(
  (
    {
      children,
      edges = ['top', 'bottom', 'left', 'right'],
      style,
      className = '',
      backgroundColor,
      mode = 'padding',
      ...props
    },
    ref
  ) => {
    const { deviceInfo, getPlatformClasses } = useEnhancedMobile();
    const { getSafeAreaInsets } = useStatusBar();

    // Get safe area insets
    const safeAreaInsets = getSafeAreaInsets();

    // Calculate optimized safe area styles for mobile
    const getSafeAreaStyles = (): React.CSSProperties => {
      const styles: React.CSSProperties = {};
      const property = mode === 'padding' ? 'padding' : 'margin';

      edges.forEach((edge) => {
        let insetValue = safeAreaInsets[edge];

        // Balance safe area values for mobile devices
        if (deviceInfo.isMobile) {
          if (edge === 'top') {
            // Optimized spacing for all mobile platforms
            // Balanced approach - not too close, not too far
            if (deviceInfo.platform === 'android') {
              insetValue = Math.max(Math.min(insetValue, 32), 24);
            } else if (deviceInfo.platform === 'ios') {
              insetValue = Math.max(Math.min(insetValue, 44), 28);
            } else {
              insetValue = Math.max(Math.min(insetValue, 28), 16);
            }
          } else if (edge === 'bottom') {
            // Reduce bottom safe area for mobile
            insetValue = Math.min(insetValue, 20);
          }
        }

        if (insetValue > 0) {
          const propertyName =
            `${property}${edge.charAt(0).toUpperCase() + edge.slice(1)}` as keyof React.CSSProperties;
          (styles as any)[propertyName] = `${insetValue}px`;
        }
      });

      return styles;
    };

    // Get platform-specific styles
    const getPlatformStyles = (): React.CSSProperties => {
      const { platform } = deviceInfo;

      const baseStyles: React.CSSProperties = {
        width: '100%',
        height: '100%',
        backgroundColor: backgroundColor || 'transparent',
      };

      if (platform === 'ios') {
        return {
          ...baseStyles,
          // iOS-specific styles
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none',
        };
      } else if (platform === 'android') {
        return {
          ...baseStyles,
          // Android-specific styles
          overscrollBehavior: 'contain',
        };
      }

      return baseStyles;
    };

    // Combine all styles
    const combinedStyles: React.CSSProperties = {
      ...getPlatformStyles(),
      ...getSafeAreaStyles(),
      ...style,
    };

    return (
      <div ref={ref} className={getPlatformClasses(`safe-area-view ${className}`)} style={combinedStyles} {...props}>
        {children}
      </div>
    );
  }
);

SafeAreaView.displayName = 'SafeAreaView';

// Safe Area Provider Component
export const SafeAreaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceInfo } = useEnhancedMobile();

  React.useEffect(() => {
    // Set up safe area CSS variables
    const updateSafeAreaVariables = () => {
      const { platform } = deviceInfo;

      if (platform === 'ios') {
        // Closer iOS safe areas for real device experience
        document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top, 28px)');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom, 8px)');
        document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left, 0px)');
        document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right, 0px)');
      } else if (platform === 'android') {
        // Closer Android safe areas for real device experience
        document.documentElement.style.setProperty('--safe-area-inset-top', '20px');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', '36px');
        document.documentElement.style.setProperty('--safe-area-inset-left', '0px');
        document.documentElement.style.setProperty('--safe-area-inset-right', '0px');
      } else {
        // Web fallback
        document.documentElement.style.setProperty('--safe-area-inset-top', '0px');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', '0px');
        document.documentElement.style.setProperty('--safe-area-inset-left', '0px');
        document.documentElement.style.setProperty('--safe-area-inset-right', '0px');
      }
    };

    updateSafeAreaVariables();

    // Update on orientation change
    const handleOrientationChange = () => {
      setTimeout(updateSafeAreaVariables, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [deviceInfo.platform]);

  return <>{children}</>;
};

// Convenience components for common use cases
export const SafeAreaTop: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className,
  style,
}) => (
  <SafeAreaView edges={['top']} className={className} style={style}>
    {children}
  </SafeAreaView>
);

export const SafeAreaBottom: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className, style }) => (
  <SafeAreaView edges={['bottom']} className={className} style={style}>
    {children}
  </SafeAreaView>
);

export const SafeAreaHorizontal: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className, style }) => (
  <SafeAreaView edges={['left', 'right']} className={className} style={style}>
    {children}
  </SafeAreaView>
);

// Hook for safe area utilities
export const useSafeArea = () => {
  const { getSafeAreaInsets } = useStatusBar();
  const { deviceInfo } = useEnhancedMobile();

  const safeAreaInsets = getSafeAreaInsets();

  const getSafeAreaStyle = (
    edges: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'],
    mode: 'padding' | 'margin' = 'padding'
  ) => {
    const styles: React.CSSProperties = {};
    const property = mode === 'padding' ? 'padding' : 'margin';

    edges.forEach((edge) => {
      const insetValue = safeAreaInsets[edge];
      if (insetValue > 0) {
        const propertyName = `${property}${edge.charAt(0).toUpperCase() + edge.slice(1)}` as keyof React.CSSProperties;
        (styles as any)[propertyName] = `${insetValue}px`;
      }
    });

    return styles;
  };

  const getSafeAreaClassName = (
    edges: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right']
  ) => {
    return edges.map((edge) => `safe-area-${edge}`).join(' ');
  };

  const isLandscape = () => {
    return deviceInfo.orientation === 'landscape';
  };

  const hasNotch = () => {
    return deviceInfo.platform === 'ios' && safeAreaInsets.top > 24;
  };

  const hasHomeIndicator = () => {
    return deviceInfo.platform === 'ios' && safeAreaInsets.bottom > 0;
  };

  return {
    safeAreaInsets,
    getSafeAreaStyle,
    getSafeAreaClassName,
    isLandscape,
    hasNotch,
    hasHomeIndicator,
  };
};

export default SafeAreaView;
