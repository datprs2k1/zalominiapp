// About Page Component Tests
// Comprehensive test suite for the main About page component

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { MotionConfig } from 'framer-motion';
import AboutPage from '../index';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock framer-motion for testing
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  useReducedMotion: () => false,
  useInView: () => true,
}));

// Mock medical animations
jest.mock('@/components/medical-animations', () => ({
  AnimatedMedicalIcon: ({ type, size, color }: any) => (
    <div data-testid={`medical-icon-${type}`} data-size={size} data-color={color}>
      Medical Icon
    </div>
  ),
}));

// Mock clinic card component
jest.mock('@/components/ClinicCard', () => {
  return function MockClinicCard({ clinic }: any) {
    return (
      <div data-testid={`clinic-card-${clinic.id}`}>
        <h3>{clinic.name}</h3>
        <p>{clinic.description}</p>
      </div>
    );
  };
});

// Mock clinic data
jest.mock('@/data/clinics', () => ({
  getClinicsByType: jest.fn(() => [
    {
      id: '1',
      name: 'Test Clinic 1',
      description: 'Test clinic description 1',
      type: 'general',
    },
    {
      id: '2',
      name: 'Test Clinic 2',
      description: 'Test clinic description 2',
      type: 'specialty',
    },
  ]),
}));

// Mock unified color system
jest.mock('@/styles/unified-color-system', () => ({
  getColorToken: jest.fn((token: string) => {
    const colors: Record<string, string> = {
      primary: '#2563eb',
      secondary: '#10b981',
      'secondary-hover': '#059669',
    };
    return colors[token] || '#000000';
  }),
}));

// Mock call icon
jest.mock('@/components/icons/call', () => {
  return function MockCallIcon({ className }: any) {
    return <div data-testid="call-icon" className={className}>Call Icon</div>;
  };
});

// Test wrapper with motion config
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MotionConfig reducedMotion="always">
    {children}
  </MotionConfig>
);

describe('AboutPage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders all main sections', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Check for hero section
      expect(screen.getByRole('banner')).toBeInTheDocument();
      
      // Check for main content
      expect(screen.getByText('HÒA BÌNH - HẢI PHÒNG')).toBeInTheDocument();
      expect(screen.getByText('Trị bệnh bằng khối óc – Chăm sóc bằng trái tim')).toBeInTheDocument();
      
      // Check for statistics section
      expect(screen.getByText('Thành Tựu Y Khoa')).toBeInTheDocument();
      
      // Check for CTA section
      expect(screen.getByText('Cần Tư Vấn Y Tế Ngay?')).toBeInTheDocument();
      
      // Check for clinics section
      expect(screen.getByText('Dịch Vụ Y Tế Chuyên Nghiệp')).toBeInTheDocument();
    });

    it('renders statistics with correct values', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      expect(screen.getByText('15+')).toBeInTheDocument();
      expect(screen.getByText('50+')).toBeInTheDocument();
      expect(screen.getByText('300+')).toBeInTheDocument();
      expect(screen.getByText('1000+')).toBeInTheDocument();
    });

    it('renders contact information', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      expect(screen.getByText(/0868\.115666/)).toBeInTheDocument();
      expect(screen.getByText(/0976\.091\.115/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Check for main heading
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('has proper ARIA labels for interactive elements', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Check for phone links with proper aria labels
      const phoneLinks = screen.getAllByRole('link');
      const phoneLink = phoneLinks.find(link => 
        link.getAttribute('href')?.includes('tel:')
      );
      
      expect(phoneLink).toHaveAttribute('aria-label');
    });

    it('has proper alt text for images', () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Test tab navigation
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
      
      // Test that focusable elements are reachable
      const focusableElements = screen.getAllByRole('button').concat(
        screen.getAllByRole('link')
      );
      
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('Interactions', () => {
    it('handles phone link clicks', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const phoneLinks = screen.getAllByRole('link');
      const phoneLink = phoneLinks.find(link => 
        link.getAttribute('href')?.includes('tel:')
      );
      
      expect(phoneLink).toBeInTheDocument();
      
      // Click should not throw error
      if (phoneLink) {
        await user.click(phoneLink);
      }
    });

    it('handles button interactions', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      
      // Test that buttons are clickable
      for (const button of buttons) {
        await user.click(button);
        // Should not throw error
      }
    });
  });

  describe('Responsive Design', () => {
    it('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Component should render without issues on mobile
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('adapts to desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Component should render without issues on desktop
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders within acceptable time', async () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('handles reduced motion preference', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
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

      // Should render without animations
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing clinic data gracefully', () => {
      // Mock empty clinic data
      const { getClinicsByType } = require('@/data/clinics');
      getClinicsByType.mockReturnValue([]);
      
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      // Should still render main sections
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('handles image loading errors gracefully', async () => {
      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const images = screen.getAllByRole('img');
      
      // Simulate image error
      if (images.length > 0) {
        fireEvent.error(images[0]);
        
        // Should handle error gracefully
        await waitFor(() => {
          expect(images[0]).toBeInTheDocument();
        });
      }
    });
  });
});
