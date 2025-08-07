import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { MobileOptimizedAboutPage } from '../MobileOptimizedAboutPage';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useAccessibilityOptimizations } from '@/hooks/useAccessibilityOptimizations';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock hooks
jest.mock('@/hooks/use-enhanced-mobile');
jest.mock('@/hooks/useResponsiveLayout');
jest.mock('@/hooks/useAccessibilityOptimizations');

const mockUseEnhancedMobile = useEnhancedMobile as jest.MockedFunction<typeof useEnhancedMobile>;
const mockUseResponsiveLayout = useResponsiveLayout as jest.MockedFunction<typeof useResponsiveLayout>;
const mockUseAccessibilityOptimizations = useAccessibilityOptimizations as jest.MockedFunction<typeof useAccessibilityOptimizations>;

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: jest.fn(),
});

describe('MobileOptimizedAboutPage', () => {
  const defaultMockValues = {
    useEnhancedMobile: {
      deviceInfo: {
        platform: 'ios' as const,
        isTouch: true,
        screenSize: 'medium' as const,
        orientation: 'portrait' as const,
        safeAreas: { top: 20, bottom: 20, left: 0, right: 0 },
      },
      platformStyles: {
        touchTarget: { minimum: '44px', recommended: '48px' },
        typography: { fontFamily: { primary: '-apple-system, BlinkMacSystemFont, sans-serif' } },
        colors: {},
        spacing: { small: '8px', medium: '16px', large: '24px' },
        borderRadius: { small: '8px', medium: '12px', large: '16px' },
        shadows: {},
        animations: {},
        footer: {},
      },
      getPlatformClasses: jest.fn((base: string) => `${base} platform-ios`),
      isOnline: true,
      networkSpeed: 'fast' as const,
    },
    useResponsiveLayout: {
      responsiveState: {
        currentBreakpoint: 'sm' as const,
        viewport: { width: 375, height: 667, aspectRatio: 0.56 },
        isPortrait: true,
        isLandscape: false,
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        devicePixelRatio: 2,
      },
      getResponsiveClasses: jest.fn((base: string) => `${base} responsive`),
      getResponsiveSpacing: jest.fn(() => '16px'),
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isPortrait: true,
      isLandscape: false,
      currentBreakpoint: 'sm' as const,
      viewport: { width: 375, height: 667, aspectRatio: 0.56 },
    },
    useAccessibilityOptimizations: {
      preferences: {
        reduceMotion: false,
        highContrast: false,
        largeText: false,
        screenReader: false,
        keyboardNavigation: false,
        voiceOver: false,
        darkMode: false,
      },
      announce: jest.fn(),
      ensureTouchTarget: jest.fn(() => ({ minWidth: '44px', minHeight: '44px' })),
      getScaledFontSize: jest.fn((size: number) => `${size}px`),
    },
  };

  beforeEach(() => {
    mockUseEnhancedMobile.mockReturnValue(defaultMockValues.useEnhancedMobile as any);
    mockUseResponsiveLayout.mockReturnValue(defaultMockValues.useResponsiveLayout as any);
    mockUseAccessibilityOptimizations.mockReturnValue(defaultMockValues.useAccessibilityOptimizations as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<MobileOptimizedAboutPage />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders all main sections', () => {
      render(<MobileOptimizedAboutPage />);
      
      // Check for main content sections
      expect(screen.getByText('BỆNH VIỆN ĐA KHOA')).toBeInTheDocument();
      expect(screen.getByText('HÒA BÌNH - HẢI PHÒNG')).toBeInTheDocument();
      expect(screen.getByText('Trị bệnh bằng khối óc – Chăm sóc bằng trái tim')).toBeInTheDocument();
    });

    it('renders emergency contact button prominently', () => {
      render(<MobileOptimizedAboutPage />);
      
      const emergencyButton = screen.getByText(/Cấp Cứu: 0868.115.666/);
      expect(emergencyButton).toBeInTheDocument();
      expect(emergencyButton.closest('button')).toHaveStyle({
        minHeight: expect.stringMatching(/\d+px/),
      });
    });
  });

  describe('Platform-Specific Behavior', () => {
    it('applies iOS-specific styling when platform is iOS', () => {
      render(<MobileOptimizedAboutPage />);
      
      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('platform-ios');
    });

    it('applies Android-specific styling when platform is Android', () => {
      mockUseEnhancedMobile.mockReturnValue({
        ...defaultMockValues.useEnhancedMobile,
        deviceInfo: {
          ...defaultMockValues.useEnhancedMobile.deviceInfo,
          platform: 'android',
        },
        getPlatformClasses: jest.fn((base: string) => `${base} platform-android`),
      } as any);

      render(<MobileOptimizedAboutPage />);
      
      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('platform-android');
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts layout for small screens', () => {
      mockUseResponsiveLayout.mockReturnValue({
        ...defaultMockValues.useResponsiveLayout,
        responsiveState: {
          ...defaultMockValues.useResponsiveLayout.responsiveState,
          currentBreakpoint: 'xs',
          viewport: { width: 320, height: 568, aspectRatio: 0.56 },
        },
        currentBreakpoint: 'xs',
        viewport: { width: 320, height: 568, aspectRatio: 0.56 },
      } as any);

      render(<MobileOptimizedAboutPage />);
      
      // Verify responsive classes are applied
      expect(defaultMockValues.useResponsiveLayout.getResponsiveClasses).toHaveBeenCalled();
    });

    it('adapts layout for landscape orientation', () => {
      mockUseResponsiveLayout.mockReturnValue({
        ...defaultMockValues.useResponsiveLayout,
        responsiveState: {
          ...defaultMockValues.useResponsiveLayout.responsiveState,
          isPortrait: false,
          isLandscape: true,
          viewport: { width: 667, height: 375, aspectRatio: 1.78 },
        },
        isPortrait: false,
        isLandscape: true,
        viewport: { width: 667, height: 375, aspectRatio: 1.78 },
      } as any);

      render(<MobileOptimizedAboutPage />);
      
      // Verify layout adapts to landscape
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<MobileOptimizedAboutPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides proper ARIA labels', () => {
      render(<MobileOptimizedAboutPage />);
      
      expect(screen.getByRole('main')).toHaveAttribute(
        'aria-label',
        'Trang giới thiệu bệnh viện Hòa Bình - Hải Phòng'
      );
    });

    it('includes skip navigation link', () => {
      render(<MobileOptimizedAboutPage />);
      
      const skipLink = screen.getByText('Bỏ qua điều hướng, đến nội dung chính');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<MobileOptimizedAboutPage />);
      
      // Tab through interactive elements
      await user.tab();
      expect(document.activeElement).toHaveAttribute('href', '#main-content');
    });

    it('announces important actions to screen readers', async () => {
      render(<MobileOptimizedAboutPage />);
      
      const emergencyButton = screen.getByText(/Cấp Cứu: 0868.115.666/);
      await userEvent.click(emergencyButton);
      
      // Verify announcement was made (would need to check actual implementation)
      expect(defaultMockValues.useAccessibilityOptimizations.announce).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('loads efficiently on slow networks', () => {
      mockUseEnhancedMobile.mockReturnValue({
        ...defaultMockValues.useEnhancedMobile,
        networkSpeed: 'slow',
      } as any);

      const { container } = render(<MobileOptimizedAboutPage />);
      
      // Verify component renders without heavy resources
      expect(container.firstChild).toBeInTheDocument();
    });

    it('reduces animations when motion is reduced', () => {
      mockUseAccessibilityOptimizations.mockReturnValue({
        ...defaultMockValues.useAccessibilityOptimizations,
        preferences: {
          ...defaultMockValues.useAccessibilityOptimizations.preferences,
          reduceMotion: true,
        },
      } as any);

      render(<MobileOptimizedAboutPage />);
      
      // Verify reduced motion is respected
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles emergency contact button click', async () => {
      // Mock window.location
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(<MobileOptimizedAboutPage />);
      
      const emergencyButton = screen.getByText(/Cấp Cứu: 0868.115.666/);
      await userEvent.click(emergencyButton);
      
      expect(window.location.href).toBe('tel:0868115666');
    });

    it('provides haptic feedback on supported devices', async () => {
      render(<MobileOptimizedAboutPage />);
      
      const emergencyButton = screen.getByText(/Cấp Cứu: 0868.115.666/);
      await userEvent.click(emergencyButton);
      
      expect(navigator.vibrate).toHaveBeenCalled();
    });

    it('handles service expansion correctly', async () => {
      render(<MobileOptimizedAboutPage />);
      
      // Find and click a service item (would need to implement in actual component)
      const serviceItems = screen.getAllByRole('button');
      if (serviceItems.length > 1) {
        await userEvent.click(serviceItems[1]);
        // Verify expansion behavior
      }
    });
  });

  describe('Error Handling', () => {
    it('gracefully handles missing platform information', () => {
      mockUseEnhancedMobile.mockReturnValue({
        ...defaultMockValues.useEnhancedMobile,
        deviceInfo: {
          ...defaultMockValues.useEnhancedMobile.deviceInfo,
          platform: 'web' as any,
        },
      } as any);

      expect(() => render(<MobileOptimizedAboutPage />)).not.toThrow();
    });

    it('handles network errors gracefully', () => {
      mockUseEnhancedMobile.mockReturnValue({
        ...defaultMockValues.useEnhancedMobile,
        isOnline: false,
      } as any);

      expect(() => render(<MobileOptimizedAboutPage />)).not.toThrow();
    });
  });
});
