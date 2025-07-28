/**
 * UI Improvements Test Suite
 * Verifies that all UI/UX improvements have been implemented correctly
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeroSection from '../pages/home/hero-section';
import { TYPOGRAPHY } from '../styles/medical-design-system';

// Mock TransitionLink component
jest.mock('../components/transition-link', () => {
  return function MockTransitionLink({ children, to }: { children: React.ReactNode; to: string }) {
    return <a href={to}>{children}</a>;
  };
});

describe('UI Improvements Verification', () => {
  describe('Hero Section Improvements', () => {
    it('should render simplified hero section with correct structure', () => {
      render(<HeroSection />);
      
      // Verify main CTA button exists
      const ctaButton = screen.getByRole('button', { name: /đặt lịch ngay/i });
      expect(ctaButton).toBeInTheDocument();
      
      // Verify slogan is present
      expect(screen.getByText('Trị bệnh bằng khối óc')).toBeInTheDocument();
      expect(screen.getByText('Chăm sóc bằng trái tim')).toBeInTheDocument();
    });

    it('should have exactly 3 quick access buttons (reduced from 4)', () => {
      render(<HeroSection />);
      
      // Should have 3 quick access buttons
      const quickAccessButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('Đặt lịch') || 
        button.textContent?.includes('Bác sĩ') || 
        button.textContent?.includes('Dịch vụ')
      );
      
      expect(quickAccessButtons).toHaveLength(3);
    });

    it('should have exactly 2 benefits cards (reduced from 4)', () => {
      render(<HeroSection />);
      
      // Should have 2 benefits: "Đội ngũ chuyên môn" and "Công nghệ hiện đại"
      expect(screen.getByText('Đội ngũ chuyên môn')).toBeInTheDocument();
      expect(screen.getByText('Công nghệ hiện đại')).toBeInTheDocument();
      
      // Should not have the old 4 benefits
      expect(screen.queryByText('Chất lượng điều trị')).not.toBeInTheDocument();
      expect(screen.queryByText('Dịch vụ toàn diện')).not.toBeInTheDocument();
    });
  });

  describe('Typography System', () => {
    it('should use consistent typography classes', () => {
      // Verify typography constants exist and are properly structured
      expect(TYPOGRAPHY.heroTitle).toBeDefined();
      expect(TYPOGRAPHY.sectionTitle).toBeDefined();
      expect(TYPOGRAPHY.cardTitle).toBeDefined();
      expect(TYPOGRAPHY.body).toBeDefined();
      
      // Verify typography includes proper medical colors
      expect(TYPOGRAPHY.heroTitle).toContain('text-[#1E40AF]');
      expect(TYPOGRAPHY.sectionTitle).toContain('text-[#1E40AF]');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should have mobile-optimized classes', () => {
      render(<HeroSection />);
      
      // Check for mobile-responsive classes in the DOM
      const heroContainer = document.querySelector('.medical-unified-block');
      expect(heroContainer).toBeInTheDocument();
      
      // Verify responsive spacing classes are applied
      const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="lg:"]');
      expect(responsiveElements.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Optimizations', () => {
    it('should not have complex animations', () => {
      render(<HeroSection />);
      
      // Should not have complex animation classes
      const complexAnimations = document.querySelectorAll('[class*="animate-shine"], [class*="heartbeat"], [class*="ecg-line"]');
      expect(complexAnimations.length).toBe(0);
      
      // Should have simple animations only
      const simpleAnimations = document.querySelectorAll('[class*="animate-pulse"], [class*="transition"]');
      expect(simpleAnimations.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Improvements', () => {
    it('should have proper ARIA labels', () => {
      render(<HeroSection />);
      
      // Check for aria-label attributes
      const ariaLabels = document.querySelectorAll('[aria-label]');
      expect(ariaLabels.length).toBeGreaterThan(0);
      
      // Check for role attributes
      const roleElements = document.querySelectorAll('[role]');
      expect(roleElements.length).toBeGreaterThan(0);
    });

    it('should have proper heading hierarchy', () => {
      render(<HeroSection />);
      
      // Should have proper heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});

// Integration test for the complete improvements
describe('Complete UI Improvements Integration', () => {
  it('should render the improved hero section without errors', () => {
    const { container } = render(<HeroSection />);
    
    // Should render without throwing
    expect(container).toBeInTheDocument();
    
    // Should have the main structure
    expect(container.querySelector('.medical-unified-block')).toBeInTheDocument();
    
    // Should have simplified content
    expect(screen.getByText('Truy cập nhanh')).toBeInTheDocument();
    expect(screen.getByText('Tại sao chọn chúng tôi')).toBeInTheDocument();
  });

  it('should have improved visual hierarchy', () => {
    render(<HeroSection />);
    
    // Main CTA should be prominent
    const mainCTA = screen.getByRole('button', { name: /đặt lịch ngay/i });
    expect(mainCTA).toHaveClass('bg-gradient-to-r');
    
    // Section titles should use consistent typography
    const sectionTitles = screen.getAllByRole('heading');
    expect(sectionTitles.length).toBeGreaterThan(0);
  });
});
