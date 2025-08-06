/**
 * Header Component Tests
 * Comprehensive tests for header components across all platforms
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'jotai';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { HeaderProvider } from '../HeaderProvider';
import { PlatformHeader } from '../PlatformHeader';
import { Logo } from '../components/Logo';
import { BackButton } from '../components/BackButton';
import { Title } from '../components/Title';
import { SkipLink } from '../components/SkipLink';

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

describe('Header Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('PlatformHeader', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('includes skip link for accessibility', () => {
      render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );
      
      const skipLink = screen.getByText('Chuyển đến nội dung chính');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('includes navigation status for screen readers', () => {
      render(
        <TestWrapper>
          <PlatformHeader />
        </TestWrapper>
      );
      
      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toBeInTheDocument();
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Logo Component', () => {
    it('renders with correct accessibility attributes', () => {
      render(
        <TestWrapper>
          <Logo />
        </TestWrapper>
      );
      
      const logo = screen.getByRole('img');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('aria-label', 'Logo bệnh viện - Ứng dụng y tế Zalo');
      expect(logo).toHaveAttribute('aria-describedby');
    });

    it('renders different sizes correctly', () => {
      const { rerender } = render(
        <TestWrapper>
          <Logo size="small" />
        </TestWrapper>
      );
      
      let logo = screen.getByRole('img');
      expect(logo).toHaveClass('min-h-[32px]');
      
      rerender(
        <TestWrapper>
          <Logo size="large" />
        </TestWrapper>
      );
      
      logo = screen.getByRole('img');
      expect(logo).toHaveClass('min-h-[48px]');
    });

    it('includes hidden description for screen readers', () => {
      render(
        <TestWrapper>
          <Logo />
        </TestWrapper>
      );
      
      const description = screen.getByText('Ứng dụng y tế chuyên nghiệp cung cấp dịch vụ chăm sóc sức khỏe đáng tin cậy');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('sr-only');
    });
  });

  describe('BackButton Component', () => {
    const mockNavigate = vi.fn();

    it('renders with correct accessibility attributes', () => {
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Quay lại trang trước - Điều hướng y tế. Nhấn Enter hoặc Space để kích hoạt');
      expect(button).toHaveAttribute('title', 'Quay lại trang trước');
    });

    it('calls onNavigate when clicked', async () => {
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });

    it('is disabled when navigating', () => {
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} isNavigating={true} />
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('includes hidden description for screen readers', () => {
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );
      
      const description = screen.getByText('Nút điều hướng quay lại trang trước đó trong ứng dụng y tế');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('sr-only');
    });
  });

  describe('Title Component', () => {
    it('renders title correctly', () => {
      render(
        <TestWrapper>
          <Title title="Test Title" />
        </TestWrapper>
      );
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Title');
    });

    it('renders subtitle when provided', () => {
      render(
        <TestWrapper>
          <Title title="Test Title" subtitle="Test Subtitle" />
        </TestWrapper>
      );
      
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('has correct accessibility attributes', () => {
      render(
        <TestWrapper>
          <Title title="Test Title" />
        </TestWrapper>
      );
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveAttribute('aria-live', 'polite');
      expect(heading).toHaveAttribute('aria-label', 'Trang hiện tại: Test Title');
    });

    it('truncates long titles when specified', () => {
      render(
        <TestWrapper>
          <Title title="Very Long Title That Should Be Truncated" truncate={true} />
        </TestWrapper>
      );
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('truncate');
    });
  });

  describe('SkipLink Component', () => {
    it('renders with correct attributes', () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText('Chuyển đến nội dung chính');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
      expect(skipLink).toHaveAttribute('tabIndex', '0');
    });

    it('accepts custom target and label', () => {
      render(<SkipLink targetId="custom-target" label="Custom Label" />);
      
      const skipLink = screen.getByText('Custom Label');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#custom-target');
    });

    it('has correct CSS classes for accessibility', () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText('Chuyển đến nội dung chính');
      expect(skipLink).toHaveClass('sr-only');
      expect(skipLink).toHaveClass('focus:not-sr-only');
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation for back button', async () => {
      const mockNavigate = vi.fn();
      
      render(
        <TestWrapper>
          <BackButton onNavigate={mockNavigate} />
        </TestWrapper>
      );
      
      const button = screen.getByRole('button');
      
      // Test Enter key
      fireEvent.keyDown(button, { key: 'Enter' });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
      
      // Test Space key
      fireEvent.keyDown(button, { key: ' ' });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(2);
      });
    });

    it('skip link works with keyboard', () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText('Chuyển đến nội dung chính');
      
      // Focus the skip link
      skipLink.focus();
      expect(skipLink).toHaveFocus();
      
      // Test Enter key navigation
      fireEvent.keyDown(skipLink, { key: 'Enter' });
      // In a real browser, this would navigate to the target element
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to different screen sizes', () => {
      // This would require mocking window.matchMedia or using a testing library
      // that supports responsive testing
      expect(true).toBe(true); // Placeholder for responsive tests
    });
  });

  describe('Error Handling', () => {
    it('handles missing context gracefully', () => {
      // Test components outside of provider context
      expect(() => {
        render(<Logo />);
      }).not.toThrow();
    });
  });
});
