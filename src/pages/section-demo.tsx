/**
 * Section Component Demo Page
 * Showcases all Section variants and features for the hospital mobile app
 */

import React from 'react';
import Section from '@/components/section';

// Demo icons
const MedicalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L2 7V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const WellnessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 22C12 22 4 17 4 10C4 8 6 6 8 6C10 6 11 7 12 8C13 7 14 6 16 6C18 6 20 8 20 10C20 17 12 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M12 10V14M10 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EmergencyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const NewsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 6H20V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M8 10H16M8 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AccentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export default function SectionDemo() {
  return (
    <div className="min-h-screen bg-medical-50 pb-20">
      {/* Modern Hospital Header */}
      <div className="bg-gradient-to-br from-medical-500 via-medical-600 to-medical-700 px-4 py-8 shadow-header">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-medical-xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
            <MedicalIcon />
          </div>
          <h1 className="text-medical-title text-white font-bold mb-2">Optimized Hospital UI</h1>
          <p className="text-white/90 text-medical-body leading-relaxed">
            Serene Blues design system with mobile-first approach for Android & iOS
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="w-16 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-md mx-auto space-y-6 px-4 -mt-6 relative z-10">
        {/* Design System Overview Card */}
        <div className="bg-white rounded-medical-xl p-6 shadow-card-medical border border-medical-100">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-medical-500 rounded-full mr-3"></div>
            <h2 className="text-medical-heading font-bold text-medical-800">Design System Features</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-medical-50 rounded-medical">
              <div className="w-8 h-8 bg-medical-500 rounded-medical mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">44px</span>
              </div>
              <p className="text-xs text-medical-600 font-medium">iOS Touch Targets</p>
            </div>
            <div className="text-center p-3 bg-medical-50 rounded-medical">
              <div className="w-8 h-8 bg-medical-500 rounded-medical mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">48dp</span>
              </div>
              <p className="text-xs text-medical-600 font-medium">Android Touch Targets</p>
            </div>
            <div className="text-center p-3 bg-medical-50 rounded-medical">
              <div className="w-8 h-8 bg-success-500 rounded-medical mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">AA</span>
              </div>
              <p className="text-xs text-medical-600 font-medium">WCAG Compliant</p>
            </div>
            <div className="text-center p-3 bg-medical-50 rounded-medical">
              <div className="w-8 h-8 bg-medical-500 rounded-medical mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">60fps</span>
              </div>
              <p className="text-xs text-medical-600 font-medium">Smooth Animations</p>
            </div>
          </div>
        </div>

        {/* Enhanced Medical Variant - Large Size with Mobile Optimization */}
        <Section
          variant="medical"
          gradient={true}
          pattern={true}
          animation={true}
          title="Medical Services"
          subtitle="Professional healthcare services with modern technology and mobile-first design"
          viewMore="/services"
          icon={<MedicalIcon />}
          size="lg"
          elevation="high"
          borderRadius="lg"
          mobileOptimized={true}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-medical-lg shadow-subtle border border-medical-100 hover:shadow-card-hover transition-shadow duration-200">
              <h3 className="font-semibold text-lg text-medical-800 mb-2">Cardiology</h3>
              <p className="text-base text-neutral-600 leading-relaxed">
                Heart care specialists with advanced mobile diagnostics
              </p>
            </div>
            <div className="bg-white p-5 rounded-medical-lg shadow-subtle border border-medical-100 hover:shadow-card-hover transition-shadow duration-200">
              <h3 className="font-semibold text-lg text-medical-800 mb-2">Neurology</h3>
              <p className="text-base text-neutral-600 leading-relaxed">Brain care experts with mobile consultation</p>
            </div>
          </div>
        </Section>

        {/* Enhanced Wellness Variant - Medium Size */}
        <Section
          variant="wellness"
          gradient={true}
          pattern={true}
          animation={true}
          title="Wellness Programs"
          subtitle="Comprehensive health and wellness initiatives"
          viewMore="/wellness"
          icon={<WellnessIcon />}
          size="md"
          elevation="medium"
          borderRadius="md"
          mobileOptimized={true}
        >
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-medical-lg shadow-subtle border border-wellness-100 flex items-center gap-3 hover:shadow-card-hover transition-shadow duration-200">
              <div className="w-4 h-4 bg-wellness-500 rounded-full flex-shrink-0"></div>
              <span className="text-base font-medium text-wellness-800">Nutrition Counseling</span>
            </div>
            <div className="bg-white p-4 rounded-medical-lg shadow-subtle border border-wellness-100 flex items-center gap-3 hover:shadow-card-hover transition-shadow duration-200">
              <div className="w-4 h-4 bg-wellness-500 rounded-full flex-shrink-0"></div>
              <span className="text-base font-medium text-wellness-800">Fitness Programs</span>
            </div>
          </div>
        </Section>

        {/* Enhanced Emergency Variant - Compact Size */}
        <Section
          variant="emergency"
          gradient={true}
          pattern={true}
          animation={true}
          title="Emergency Services"
          subtitle="24/7 emergency medical care and support"
          viewMore="/emergency"
          icon={<EmergencyIcon />}
          size="sm"
          elevation="high"
          borderRadius="md"
          compact={true}
          mobileOptimized={true}
        >
          <div className="bg-white p-4 rounded-medical-lg shadow-subtle border border-danger-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 bg-danger-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="font-semibold text-base text-danger-800">Emergency Hotline</span>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">Call 115 for immediate assistance</p>
          </div>
        </Section>

        {/* Accent Variant */}
        <Section
          variant="accent"
          gradient={true}
          pattern={true}
          animation={true}
          title="Health News"
          subtitle="Latest updates and health information"
          viewMore="/news"
          icon={<NewsIcon />}
        >
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-medical shadow-sm">
              <h3 className="font-semibold text-medical-body mb-2">Latest Health Tips</h3>
              <p className="text-medical-label text-neutral-600">Stay informed about health trends</p>
            </div>
          </div>
        </Section>

        {/* Card Mode Examples */}
        <Section
          variant="medical"
          gradient={true}
          pattern={true}
          animation={true}
          title="Card Mode Example"
          subtitle="Enhanced card styling with depth and shadows"
          viewMore="/cards"
          icon={<AccentIcon />}
          isCard={true}
        >
          <div className="text-center py-4">
            <p className="text-medical-body text-neutral-600">
              This section demonstrates the enhanced card mode with gradient headers, background patterns, and improved
              visual hierarchy.
            </p>
          </div>
        </Section>

        {/* Size Variants Showcase */}
        <div className="space-y-4">
          <div className="px-4 py-4 bg-white rounded-medical-lg shadow-card-medical">
            <h2 className="text-lg font-bold text-neutral-900 mb-3">Size Variants</h2>
            <p className="text-sm text-neutral-600 mb-4">Different section sizes for various content densities</p>
          </div>

          {/* Small Size Example */}
          <Section
            variant="accent"
            title="Small Section"
            subtitle="Compact layout for dense information"
            viewMore="/small"
            icon={<AccentIcon />}
            size="sm"
            elevation="subtle"
            borderRadius="sm"
            mobileOptimized={true}
          >
            <div className="text-center py-2">
              <p className="text-sm text-neutral-600">Perfect for quick info cards</p>
            </div>
          </Section>

          {/* Large Size Example */}
          <Section
            variant="medical"
            title="Large Section"
            subtitle="Spacious layout for detailed content presentation"
            viewMore="/large"
            icon={<MedicalIcon />}
            size="lg"
            elevation="high"
            borderRadius="xl"
            gradient={true}
            pattern={true}
            mobileOptimized={true}
          >
            <div className="text-center py-6">
              <p className="text-base text-neutral-600 leading-relaxed">
                Ideal for featured content and detailed information displays
              </p>
            </div>
          </Section>
        </div>

        {/* Mobile Touch Target Demo */}
        <Section
          variant="accent"
          title="Touch Target Optimization"
          subtitle="Demonstrating mobile-friendly touch targets and accessibility"
          viewMore="/touch-demo"
          icon={<AccentIcon />}
          size="md"
          elevation="medium"
          borderRadius="lg"
          mobileOptimized={true}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-medical-500 text-white px-4 py-3 rounded-medical-lg font-semibold text-sm min-h-[48px] hover:bg-medical-600 transition-colors duration-200 active:scale-95 transform">
                48px Target
              </button>
              <button className="bg-wellness-500 text-white px-4 py-3.5 rounded-medical-lg font-semibold text-sm min-h-[52px] hover:bg-wellness-600 transition-colors duration-200 active:scale-95 transform">
                52px Target
              </button>
            </div>
            <p className="text-sm text-neutral-600 text-center">
              Touch targets meet WCAG AA guidelines for mobile accessibility
            </p>
          </div>
        </Section>

        {/* Enhanced Feature Comparison */}
        <div className="px-5 py-7 bg-white rounded-medical-xl shadow-card-elevated border border-medical-100">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Mobile-First Optimization Features</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-medical-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="text-lg font-semibold text-neutral-900">Enhanced Touch Targets</span>
                <p className="text-base text-neutral-600 mt-2 leading-relaxed">
                  Minimum 48px touch targets with size-responsive scaling for optimal mobile interaction
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-wellness-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="text-lg font-semibold text-neutral-900">Mobile-First Typography</span>
                <p className="text-base text-neutral-600 mt-2 leading-relaxed">
                  Optimized font sizes (14px-28px) and line heights for better mobile readability
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-accent-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="text-lg font-semibold text-neutral-900">Cross-Platform Consistency</span>
                <p className="text-base text-neutral-600 mt-2 leading-relaxed">
                  Design patterns familiar to both Android and iOS users with platform-specific optimizations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-danger-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="text-lg font-semibold text-neutral-900">Enhanced Accessibility</span>
                <p className="text-base text-neutral-600 mt-2 leading-relaxed">
                  WCAG AA compliance with improved focus states and screen reader support
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-neutral-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="text-lg font-semibold text-neutral-900">Performance Optimized</span>
                <p className="text-base text-neutral-600 mt-2 leading-relaxed">
                  Hardware acceleration and smooth 60fps animations with reduced motion support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
