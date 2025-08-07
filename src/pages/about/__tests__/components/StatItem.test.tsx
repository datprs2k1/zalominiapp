// StatItem Component Tests
// Test suite for the StatItem component

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { MotionConfig } from 'framer-motion';
import { StatItem } from '../../components/StatItem';
import type { StatItemProps } from '../../types';

expect.extend(toHaveNoViolations);

// Mock framer-motion
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  useReducedMotion: () => false,
  useInView: () => true,
  useAnimation: () => ({
    start: jest.fn(),
  }),
}));

// Mock medical animations
jest.mock('@/components/medical-animations', () => ({
  AnimatedMedicalIcon: ({ type, size, color }: any) => (
    <div data-testid={`medical-icon-${type}`} data-size={size} data-color={color}>
      Medical Icon
    </div>
  ),
}));

// Mock hooks
jest.mock('../../hooks/useAccessibleAnimation', () => ({
  useAccessibleAnimation: () => ({
    shouldReduceMotion: false,
    getAnimationProps: (props: any) => props,
  }),
}));

jest.mock('../../utils/performance', () => ({
  useAnimationOptimization: () => ({
    shouldAnimate: true,
  }),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MotionConfig reducedMotion="always">
    {children}
  </MotionConfig>
);

const defaultProps: StatItemProps = {
  value: '100+',
  label: 'Test Statistic',
  icon: 'cross',
  color: 'primary',
  index: 0,
};

describe('StatItem', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      expect(screen.getByText('100+')).toBeInTheDocument();
      expect(screen.getByText('Test Statistic')).toBeInTheDocument();
    });

    it('renders with different props', () => {
      const props: StatItemProps = {
        value: '50+',
        label: 'Different Stat',
        icon: 'stethoscope',
        color: 'secondary',
        index: 1,
      };

      render(
        <TestWrapper>
          <StatItem {...props} />
        </TestWrapper>
      );
      
      expect(screen.getByText('50+')).toBeInTheDocument();
      expect(screen.getByText('Different Stat')).toBeInTheDocument();
      expect(screen.getByTestId('medical-icon-stethoscope')).toBeInTheDocument();
    });

    it('renders medical icon with correct props', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      const icon = screen.getByTestId('medical-icon-cross');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-size', 'lg');
      expect(icon).toHaveAttribute('data-color', 'secondary');
    });

    it('renders certification badge', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      expect(screen.getByText('Chứng nhận')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA labels', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      const statItem = screen.getByRole('article');
      expect(statItem).toHaveAttribute('aria-label');
      expect(statItem.getAttribute('aria-label')).toContain('100+');
      expect(statItem.getAttribute('aria-label')).toContain('Test Statistic');
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      const statItem = screen.getByRole('article');
      
      // Should be focusable
      await user.tab();
      expect(statItem).toHaveFocus();
    });

    it('has proper semantic structure', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      // Should have article role
      expect(screen.getByRole('article')).toBeInTheDocument();
      
      // Should have proper tabindex
      const statItem = screen.getByRole('article');
      expect(statItem).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Styling and Colors', () => {
    it('applies correct color classes for primary', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} color="primary" />
        </TestWrapper>
      );
      
      const statItem = screen.getByRole('article');
      expect(statItem).toHaveClass('bg-gradient-to-br');
    });

    it('applies correct color classes for secondary', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} color="secondary" />
        </TestWrapper>
      );
      
      const statItem = screen.getByRole('article');
      expect(statItem).toHaveClass('bg-gradient-to-br');
    });

    it('applies correct color classes for success', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} color="success" />
        </TestWrapper>
      );
      
      const statItem = screen.getByRole('article');
      expect(statItem).toHaveClass('bg-gradient-to-br');
    });

    it('applies correct color classes for warning', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} color="warning" />
        </TestWrapper>
      );
      
      const statItem = screen.getByRole('article');
      expect(statItem).toHaveClass('bg-gradient-to-br');
    });
  });

  describe('Animations', () => {
    it('handles reduced motion preference', () => {
      // Mock reduced motion
      const mockUseAccessibleAnimation = require('../../hooks/useAccessibleAnimation');
      mockUseAccessibleAnimation.useAccessibleAnimation.mockReturnValue({
        shouldReduceMotion: true,
        getAnimationProps: (props: any) => ({ ...props, animate: false }),
      });

      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      // Should still render
      expect(screen.getByText('100+')).toBeInTheDocument();
    });

    it('applies hover effects when animations are enabled', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      const statItem = screen.getByRole('article');
      expect(statItem).toHaveClass('cursor-pointer');
    });
  });

  describe('Interactions', () => {
    it('handles mouse hover', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      const statItem = screen.getByRole('article');
      
      await user.hover(statItem);
      // Should not throw error
      expect(statItem).toBeInTheDocument();
    });

    it('handles mouse leave', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      const statItem = screen.getByRole('article');
      
      await user.hover(statItem);
      await user.unhover(statItem);
      // Should not throw error
      expect(statItem).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders quickly', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <StatItem {...defaultProps} />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 50ms
      expect(renderTime).toBeLessThan(50);
    });

    it('handles multiple instances efficiently', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <div>
            {Array.from({ length: 10 }, (_, i) => (
              <StatItem
                key={i}
                {...defaultProps}
                value={`${i * 10}+`}
                label={`Stat ${i}`}
                index={i}
              />
            ))}
          </div>
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render 10 items within 100ms
      expect(renderTime).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty value', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} value="" />
        </TestWrapper>
      );
      
      // Should still render structure
      expect(screen.getByText('Test Statistic')).toBeInTheDocument();
    });

    it('handles empty label', () => {
      render(
        <TestWrapper>
          <StatItem {...defaultProps} label="" />
        </TestWrapper>
      );
      
      // Should still render value
      expect(screen.getByText('100+')).toBeInTheDocument();
    });

    it('handles very long values', () => {
      const longValue = '999,999,999+';
      
      render(
        <TestWrapper>
          <StatItem {...defaultProps} value={longValue} />
        </TestWrapper>
      );
      
      expect(screen.getByText(longValue)).toBeInTheDocument();
    });

    it('handles very long labels', () => {
      const longLabel = 'This is a very long label that might wrap to multiple lines';
      
      render(
        <TestWrapper>
          <StatItem {...defaultProps} label={longLabel} />
        </TestWrapper>
      );
      
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });
  });
});
