/**
 * Platform-Specific Status Bar Component
 * Handles status bar styling for iOS and Android
 */

import React, { useEffect } from 'react';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';

// Types
interface PlatformStatusBarProps {
  style?: 'light-content' | 'dark-content' | 'default';
  backgroundColor?: string;
  translucent?: boolean;
  hidden?: boolean;
}

// Platform Status Bar Component
export const PlatformStatusBar: React.FC<PlatformStatusBarProps> = ({
  style = 'dark-content',
  backgroundColor = '#FFFFFF',
  translucent = true,
  hidden = false,
}) => {
  const { deviceInfo } = useEnhancedMobile();

  useEffect(() => {
    const { platform } = deviceInfo;

    // Apply platform-specific status bar styling
    if (platform === 'ios') {
      applyIOSStatusBar();
    } else if (platform === 'android') {
      applyAndroidStatusBar();
    }

    // Apply general styling
    applyGeneralStatusBar();
  }, [style, backgroundColor, translucent, hidden, deviceInfo.platform]);

  // Apply iOS-specific status bar styling
  const applyIOSStatusBar = () => {
    // Set status bar style
    const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (metaStatusBar) {
      metaStatusBar.setAttribute('content', translucent ? 'black-translucent' : style);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-status-bar-style';
      meta.content = translucent ? 'black-translucent' : style;
      document.head.appendChild(meta);
    }

    // Set theme color for iOS
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', backgroundColor);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = backgroundColor;
      document.head.appendChild(meta);
    }

    // Apply closer safe area CSS variables for iOS - Real device optimized
    document.documentElement.style.setProperty('--status-bar-height', '44px');
    document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top, 32px)');
    document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom, 20px)');
    document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left, 0px)');
    document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right, 0px)');
  };

  // Apply Android-specific status bar styling
  const applyAndroidStatusBar = () => {
    // Set theme color for Android
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', backgroundColor);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = backgroundColor;
      document.head.appendChild(meta);
    }

    // Set status bar color for Android
    const metaStatusBarColor = document.querySelector('meta[name="msapplication-navbutton-color"]');
    if (metaStatusBarColor) {
      metaStatusBarColor.setAttribute('content', backgroundColor);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'msapplication-navbutton-color';
      meta.content = backgroundColor;
      document.head.appendChild(meta);
    }

    // Apply closer Material Design status bar height for Android devices
    // Reduced spacing for real Android devices
    document.documentElement.style.setProperty('--status-bar-height', '20px');
    document.documentElement.style.setProperty('--safe-area-inset-top', '20px');
    document.documentElement.style.setProperty('--safe-area-inset-bottom', '0px');
    document.documentElement.style.setProperty('--safe-area-inset-left', '0px');
    document.documentElement.style.setProperty('--safe-area-inset-right', '0px');
  };

  // Apply general status bar styling
  const applyGeneralStatusBar = () => {
    // Set viewport meta tag for proper status bar handling
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }

    const viewportContent = [
      'width=device-width',
      'initial-scale=1.0',
      'maximum-scale=1.0',
      'user-scalable=no',
      'viewport-fit=cover',
    ].join(', ');

    viewport.setAttribute('content', viewportContent);

    // Apply CSS custom properties for status bar
    document.documentElement.style.setProperty('--status-bar-style', style);
    document.documentElement.style.setProperty('--status-bar-background', backgroundColor);
    document.documentElement.style.setProperty('--status-bar-translucent', translucent ? '1' : '0');
    document.documentElement.style.setProperty('--status-bar-hidden', hidden ? '1' : '0');

    // Apply body styles for status bar
    document.body.style.paddingTop = hidden ? '0' : 'var(--safe-area-inset-top)';
  };

  // This component doesn't render anything visible
  return null;
};

// Hook for status bar utilities
export const useStatusBar = () => {
  const { deviceInfo } = useEnhancedMobile();

  const setStatusBarStyle = (style: 'light-content' | 'dark-content' | 'default') => {
    document.documentElement.style.setProperty('--status-bar-style', style);

    if (deviceInfo.platform === 'ios') {
      const metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (metaStatusBar) {
        metaStatusBar.setAttribute('content', style);
      }
    }
  };

  const setStatusBarBackgroundColor = (color: string) => {
    document.documentElement.style.setProperty('--status-bar-background', color);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    }
  };

  const hideStatusBar = () => {
    document.documentElement.style.setProperty('--status-bar-hidden', '1');
    document.body.style.paddingTop = '0';
  };

  const showStatusBar = () => {
    document.documentElement.style.setProperty('--status-bar-hidden', '0');
    document.body.style.paddingTop = 'var(--safe-area-inset-top)';
  };

  const getStatusBarHeight = (): number => {
    const height = getComputedStyle(document.documentElement).getPropertyValue('--status-bar-height');
    return parseInt(height) || (deviceInfo.platform === 'ios' ? 44 : 28);
  };

  const getSafeAreaInsets = () => {
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top')) || 0,
      bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom')) || 0,
      left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left')) || 0,
      right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right')) || 0,
    };
  };

  return {
    setStatusBarStyle,
    setStatusBarBackgroundColor,
    hideStatusBar,
    showStatusBar,
    getStatusBarHeight,
    getSafeAreaInsets,
  };
};

export default PlatformStatusBar;
