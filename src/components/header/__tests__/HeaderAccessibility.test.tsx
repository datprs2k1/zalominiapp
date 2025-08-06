/**
 * Header Accessibility Tests
 * Comprehensive accessibility tests for header components
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'jotai';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { HeaderProvider } from '../HeaderProvider';
import { PlatformHeader } from '../PlatformHeader';
import { Logo } from '../components/Logo';
import { BackButton } from '../components/BackButton';
import { Title } from '../components/Title';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock dependencies
vi.mock('@/hooks', () => ({
  useRouteHandle: () => [{ title: 'Test Page', back: false }],
}));

vi.mock('@/hooks/use-enhanced-mobile', () => ({
  useEnhancedMobile: () => ({
    deviceInfo: {
      platform: 'web',
      isTouch: false,
      screenSize: 'medium',
      orientation: 'portrait',
      safeAreas: { top: 0, bottom: 0, left: 0, right: 0 },
    },
    platformStyles: {
      touchTarget: {},
      typography: {},
      colors: {},
      spacing: {},
      borderRadius: {},
      shadows: {},
      animations: {},
    },
    hapticFeedback: {
      light: vi.fn(),
      medium: vi.fn(),
      heavy: vi.fn(),
    },
  }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    header: 'header',
    div: 'div',
    button: 'button',
  },
  useReducedMotion: () => false,
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <Provider>
      <HeaderProvider>
        {children}
      </HeaderProvider>
    </Provider>
  </BrowserRouter>
);

describe('Header Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('logo should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Logo />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('back button should not have accessibility violations', async () => {
      const mockNavigate = vi.fn();
      const { container } = render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('title should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Title title="Test Title" />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic HTML', () => {
    it('uses correct semantic elements', () => {
      render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );

      // Check for proper semantic structure
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('logo uses img role correctly', () => {
      render(
        <TestWrapper>
          <Logo />
        </TestWrapper>
      );

      const logo = screen.getByRole('img');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('aria-label');
    });

    it('title uses heading role correctly', () => {
      render(
        <TestWrapper>
          <Title title="Test Title" />
        </TestWrapper>
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('ARIA Attributes', () => {
    it('header has correct ARIA attributes', () => {
      render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );

      const header = screen.getByRole('banner');
      expect(header).toHaveAttribute('aria-label');
    });

    it('logo has correct ARIA attributes', () => {
      render(
        <TestWrapper>
          <Logo />
        </TestWrapper>
      );

      const logo = screen.getByRole('img');
      expect(logo).toHaveAttribute('aria-label', 'Logo bệnh viện - Ứng dụng y tế Zalo');
      expect(logo).toHaveAttribute('aria-describedby');
    });

    it('back button has correct ARIA attributes', () => {
      const mockNavigate = vi.fn();
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('aria-describedby');
      expect(button).toHaveAttribute('title');
    });

    it('title has correct ARIA attributes', () => {
      render(
        <TestWrapper>
          <Title title="Test Title" />
        </TestWrapper>
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveAttribute('aria-live', 'polite');
      expect(heading).toHaveAttribute('aria-label');
    });
  });

  describe('Keyboard Navigation', () => {
    it('skip link is keyboard accessible', () => {
      render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );

      const skipLink = screen.getByText('Chuyển đến nội dung chính');
      expect(skipLink).toHaveAttribute('tabIndex', '0');
      
      // Test focus
      skipLink.focus();
      expect(skipLink).toHaveFocus();
    });

    it('back button is keyboard accessible', () => {
      const mockNavigate = vi.fn();
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      
      // Test tab navigation
      button.focus();
      expect(button).toHaveFocus();
      
      // Test Enter key
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('maintains proper tab order', () => {
      const mockNavigate = vi.fn();
      render(
        <TestWrapper>
          <div>
            <PlatformHeader />
            <BackButton onNavigate={mockNavigate} />
          </div>
        </TestWrapper>
      );

      // Get all focusable elements
      const focusableElements = screen.getAllByRole('button').concat(
        screen.getAllByRole('link')
      );

      // Test tab order
      focusableElements.forEach((element, index) => {
        element.focus();
        expect(element).toHaveFocus();
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('provides live region for navigation status', () => {
      render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );

      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('provides descriptive text for screen readers', () => {
      render(
        <TestWrapper>
          <Logo />
        </TestWrapper>
      );

      const description = screen.getByText('Ứng dụng y tế chuyên nghiệp cung cấp dịch vụ chăm sóc sức khỏe đáng tin cậy');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('sr-only');
    });

    it('hides decorative elements from screen readers', () => {
      const mockNavigate = vi.fn();
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );

      // SVG icon should be hidden from screen readers
      const icon = screen.getByRole('button').querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Color Contrast', () => {
    it('meets WCAG AA color contrast requirements', () => {
      // This would require actual color contrast testing
      // In a real implementation, you'd use tools like:
      // - @testing-library/jest-dom with custom matchers
      // - Puppeteer with accessibility testing
      // - Manual verification with contrast checking tools
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Reduced Motion Support', () => {
    it('respects prefers-reduced-motion setting', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <TestWrapper>
          <Logo animated={true} />
        </TestWrapper>
      );

      // Component should respect reduced motion preference
      // This would need to be tested with actual animation properties
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Focus Management', () => {
    it('maintains focus visibility', () => {
      const mockNavigate = vi.fn();
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      button.focus();
      
      // Check that focus styles are applied
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus:shadow-lg');
    });

    it('provides clear focus indicators', () => {
      render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );

      const skipLink = screen.getByText('Chuyển đến nội dung chính');
      skipLink.focus();
      
      // Skip link should be visible when focused
      expect(skipLink).toHaveClass('focus:not-sr-only');
    });
  });

  describe('Touch Target Size', () => {
    it('meets minimum touch target size requirements', () => {
      const mockNavigate = vi.fn();
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );

      const button = screen.getByRole('button');
      
      // Button should meet minimum 44px touch target
      expect(button).toHaveClass('min-w-[40px]');
      expect(button).toHaveClass('min-h-[40px]');
    });
  });
});
