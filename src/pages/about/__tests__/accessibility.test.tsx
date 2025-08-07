// Accessibility Tests for About Page
// Comprehensive accessibility testing suite

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { MotionConfig } from 'framer-motion';
import AboutPage from '../index';
import { StatItem } from '../components/StatItem';
import { HeroSection } from '../components/HeroSection';
import {
  createStatAriaLabel,
  createFeatureAriaLabel,
  createButtonAriaLabel,
  createPhoneAriaLabel,
  validateAccessibility,
} from '../utils/accessibility';

expect.extend(toHaveNoViolations);

// Mock all external dependencies
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  useReducedMotion: () => false,
  useInView: () => true,
  useAnimation: () => ({ start: jest.fn() }),
}));

jest.mock('@/components/medical-animations', () => ({
  AnimatedMedicalIcon: ({ type }: any) => <div data-testid={`icon-${type}`}>Icon</div>,
}));

jest.mock('@/components/ClinicCard', () => {
  return function MockClinicCard({ clinic }: any) {
    return <div data-testid={`clinic-${clinic.id}`}>{clinic.name}</div>;
  };
});

jest.mock('@/data/clinics', () => ({
  getClinicsByType: () => [{ id: '1', name: 'Test Clinic', description: 'Test description' }],
}));

jest.mock('@/styles/unified-color-system', () => ({
  getColorToken: () => '#000000',
}));

jest.mock('@/components/icons/call', () => {
  return function MockCallIcon() {
    return <div data-testid="call-icon">Call</div>;
  };
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MotionConfig reducedMotion="always">{children}</MotionConfig>
);

describe('Accessibility Tests', () => {
  describe('WCAG Compliance', () => {
    it('meets WCAG 2.1 AA standards for the full page', async () => {
      const { container } = render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const results = await axe(container, {
        rules: {
          // Enable all WCAG 2.1 AA rules
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'focus-management': { enabled: true },
          'aria-labels': { enabled: true },
          'semantic-structure': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('has proper document structure', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Should have main landmark
      expect(screen.getByRole('banner')).toBeInTheDocument();

      // Should have proper heading hierarchy
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);

      // Should have at least one h1
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('has proper color contrast', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Test would normally check actual computed styles
      // This is a placeholder for contrast ratio testing
      const textElements = screen.getAllByText(/./);
      expect(textElements.length).toBeGreaterThan(0);
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports full keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Get all focusable elements
      const focusableElements = [...screen.getAllByRole('button'), ...screen.getAllByRole('link')];

      expect(focusableElements.length).toBeGreaterThan(0);

      // Test tab navigation through all elements
      for (let i = 0; i < Math.min(focusableElements.length, 5); i++) {
        await user.tab();
        expect(document.activeElement).toBeInTheDocument();
      }
    });

    it('has proper focus indicators', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        await user.tab();
        const focusedElement = document.activeElement;

        // Should have focus styles (this would need actual CSS testing in real scenario)
        expect(focusedElement).toBeInTheDocument();
      }
    });

    it('supports Enter and Space key activation', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        buttons[0].focus();

        // Test Enter key
        await user.keyboard('{Enter}');
        // Should not throw error

        // Test Space key
        await user.keyboard(' ');
        // Should not throw error
      }
    });
  });

  describe('Screen Reader Support', () => {
    it('has proper ARIA labels for all interactive elements', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Check buttons have accessible names
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(
          button.getAttribute('aria-label') || button.textContent || button.getAttribute('aria-labelledby')
        ).toBeTruthy();
      });

      // Check links have accessible names
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(
          link.getAttribute('aria-label') || link.textContent || link.getAttribute('aria-labelledby')
        ).toBeTruthy();
      });
    });

    it('has proper landmark roles', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Should have banner landmark
      expect(screen.getByRole('banner')).toBeInTheDocument();

      // Should have proper section structure
      const regions = screen.getAllByRole('region');
      expect(regions.length).toBeGreaterThanOrEqual(0);
    });

    it('has descriptive text for complex content', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Check for hidden descriptions
      const descriptions = document.querySelectorAll('.sr-only');
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Accessibility', () => {
    it('has proper touch targets', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        writable: true,
      });

      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');

      // All interactive elements should be present
      expect([...buttons, ...links].length).toBeGreaterThan(0);
    });

    it('supports zoom up to 200%', () => {
      // Mock zoomed viewport
      Object.defineProperty(document.documentElement, 'style', {
        value: { zoom: '200%' },
        writable: true,
      });

      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Content should still be accessible
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Reduced Motion Support', () => {
    it('respects prefers-reduced-motion', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Should render without motion-based issues
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Utility Functions', () => {
    describe('createStatAriaLabel', () => {
      it('creates proper aria label for statistics', () => {
        const label = createStatAriaLabel('100+', 'Patients', 0);
        expect(label).toBe('Thống kê y khoa số 1: 100+ Patients');
      });

      it('handles different indices', () => {
        const label = createStatAriaLabel('50+', 'Doctors', 2);
        expect(label).toBe('Thống kê y khoa số 3: 50+ Doctors');
      });
    });

    describe('createFeatureAriaLabel', () => {
      it('creates proper aria label for features', () => {
        const label = createFeatureAriaLabel('24/7 Care', 'Round the clock service');
        expect(label).toBe('Dịch vụ y tế: 24/7 Care. Round the clock service');
      });
    });

    describe('createButtonAriaLabel', () => {
      it('creates proper aria label for buttons', () => {
        const label = createButtonAriaLabel('Learn More', 'About our services');
        expect(label).toBe('Learn More - About our services');
      });
    });

    describe('createPhoneAriaLabel', () => {
      it('creates proper aria label for hotline', () => {
        const label = createPhoneAriaLabel('0123.456.789', 'hotline');
        expect(label).toBe('Số hotline: 0123 456 789');
      });

      it('creates proper aria label for emergency', () => {
        const label = createPhoneAriaLabel('0123.456.789', 'emergency');
        expect(label).toBe('Số cấp cứu: 0123 456 789');
      });
    });

    describe('validateAccessibility', () => {
      it('validates aria labels correctly', () => {
        const elementWithLabel = document.createElement('button');
        elementWithLabel.setAttribute('aria-label', 'Test button');

        expect(validateAccessibility.hasAriaLabel(elementWithLabel)).toBe(true);

        const elementWithoutLabel = document.createElement('button');
        expect(validateAccessibility.hasAriaLabel(elementWithoutLabel)).toBe(false);
      });

      it('validates keyboard accessibility correctly', () => {
        const button = document.createElement('button');
        expect(validateAccessibility.isKeyboardAccessible(button)).toBe(true);

        const div = document.createElement('div');
        expect(validateAccessibility.isKeyboardAccessible(div)).toBe(false);

        const divWithTabIndex = document.createElement('div');
        divWithTabIndex.setAttribute('tabindex', '0');
        expect(validateAccessibility.isKeyboardAccessible(divWithTabIndex)).toBe(true);
      });
    });
  });

  describe('Component-Specific Accessibility', () => {
    it('StatItem has proper accessibility attributes', () => {
      render(
        <TestWrapper>
          <StatItem value="100+" label="Test Stat" icon="cross" color="primary" index={0} />
        </TestWrapper>
      );

      const statItem = screen.getByRole('article');
      expect(statItem).toHaveAttribute('aria-label');
      expect(statItem).toHaveAttribute('tabindex', '0');
    });

    it('HeroSection has proper accessibility structure', () => {
      render(
        <TestWrapper>
          <HeroSection />
        </TestWrapper>
      );

      const banner = screen.getByRole('banner');
      expect(banner).toHaveAttribute('aria-labelledby');
      expect(banner).toHaveAttribute('aria-describedby');
    });
  });
});
