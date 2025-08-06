/**
 * Header Spacing Test
 * Tests the header spacing fixes for Android status bar
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../header';
import { PlatformStatusBar } from '../platform-status-bar';
import { SafeAreaProvider } from '../safe-area-view';

// Mock the enhanced mobile hook
jest.mock('@/hooks/use-enhanced-mobile', () => ({
  useEnhancedMobile: () => ({
    deviceInfo: {
      platform: 'android',
      isMobile: true,
      screenSize: 'medium',
      orientation: 'portrait',
      safeAreas: {
        top: 32,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
    getPlatformClasses: (classes: string) => classes,
  }),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <SafeAreaProvider>
      {children}
    </SafeAreaProvider>
  </BrowserRouter>
);

describe('Header Spacing for Android', () => {
  beforeEach(() => {
    // Reset CSS variables before each test
    document.documentElement.style.removeProperty('--safe-area-inset-top');
    document.documentElement.style.removeProperty('--status-bar-height');
  });

  test('should set correct Android safe area insets', () => {
    render(
      <TestWrapper>
        <PlatformStatusBar />
      </TestWrapper>
    );

    // Check that Android safe area insets are set correctly
    const topInset = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top');
    expect(topInset).toBe('32px');
  });

  test('should apply pt-safe class correctly', () => {
    // Set up CSS variables as they would be set by PlatformStatusBar
    document.documentElement.style.setProperty('--safe-area-inset-top', '32px');

    const testElement = document.createElement('div');
    testElement.className = 'pt-safe';
    document.body.appendChild(testElement);

    const computedStyle = getComputedStyle(testElement);
    const paddingTop = computedStyle.getPropertyValue('padding-top');
    
    // The pt-safe class should use the CSS variable
    expect(paddingTop).toBe('32px');

    document.body.removeChild(testElement);
  });

  test('should render header with proper spacing', () => {
    render(
      <TestWrapper>
        <PlatformStatusBar />
        <Header />
      </TestWrapper>
    );

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Check that the header has the correct platform class
    expect(header).toHaveClass('platform-android');
  });

  test('should handle different Android screen sizes', () => {
    // Test with different screen sizes
    const screenSizes = ['small', 'medium', 'large'];
    
    screenSizes.forEach(size => {
      // Mock different screen size
      jest.doMock('@/hooks/use-enhanced-mobile', () => ({
        useEnhancedMobile: () => ({
          deviceInfo: {
            platform: 'android',
            isMobile: true,
            screenSize: size,
            orientation: 'portrait',
            safeAreas: {
              top: 32,
              bottom: 0,
              left: 0,
              right: 0,
            },
          },
          getPlatformClasses: (classes: string) => classes,
        }),
      }));

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveClass(`screen-${size}`);
    });
  });

  test('should maintain accessibility with proper spacing', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    const header = screen.getByRole('banner');
    
    // Check that header is accessible
    expect(header).toHaveAttribute('aria-label');
    
    // Check that header has proper focus handling
    expect(header).toHaveClass('focus-within:ring-2');
  });
});

describe('Cross-platform Header Spacing', () => {
  test('should handle iOS platform correctly', () => {
    jest.doMock('@/hooks/use-enhanced-mobile', () => ({
      useEnhancedMobile: () => ({
        deviceInfo: {
          platform: 'ios',
          isMobile: true,
          screenSize: 'medium',
          orientation: 'portrait',
          safeAreas: {
            top: 44,
            bottom: 34,
            left: 0,
            right: 0,
          },
        },
        getPlatformClasses: (classes: string) => classes,
      }),
    }));

    render(
      <TestWrapper>
        <PlatformStatusBar />
      </TestWrapper>
    );

    // iOS should have different safe area values
    const topInset = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top');
    expect(topInset).toContain('env(safe-area-inset-top');
  });

  test('should handle web platform correctly', () => {
    jest.doMock('@/hooks/use-enhanced-mobile', () => ({
      useEnhancedMobile: () => ({
        deviceInfo: {
          platform: 'web',
          isMobile: false,
          screenSize: 'large',
          orientation: 'landscape',
          safeAreas: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        },
        getPlatformClasses: (classes: string) => classes,
      }),
    }));

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('platform-web');
  });
});
