import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
// Import components
import HeroSection from './hero-section';
import FeaturedServices from './featured-services';
import FeaturedDepartents from './featured-departents';
import HealthNews from './health-news';
import SearchBarComponent from '@/components/search-bar-component';
import { MEDICAL_COLORS, MEDICAL_WIDTHS, ACCESSIBILITY, combineClasses } from '@/styles/medical-design-system';

function HomePage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.main
      className="min-h-screen w-full"
      role="main"
      aria-label="Trang chủ Bệnh viện Hòa Bình - Dịch vụ y tế chuyên nghiệp"
      id="main-content"
      style={{
        backgroundColor: MEDICAL_COLORS.white.soft,
        background: `linear-gradient(135deg, ${MEDICAL_COLORS.white.soft} 0%, ${MEDICAL_COLORS.white.pure} 50%, ${MEDICAL_COLORS.white.pearl} 100%)`,
      }}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.01 }
          : {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }
      }
    >
      {/* Skip to content link for screen readers */}
      <a
        href="#hero-section"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:ring-offset-2"
        style={{ textDecoration: 'none' }}
      >
        Chuyển đến nội dung chính
      </a>

      {/* Live region for dynamic content announcements */}
      <div id="live-region" aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {/* Screen reader announcements will be inserted here */}
      </div>
      {/* Optimized Compact Hospital Dashboard Layout */}
      <div
        className={combineClasses(
          'medical-hospital-dashboard',
          'px-3 md:px-4', // More compact padding
          'pb-6', // Reduced bottom padding
          MEDICAL_WIDTHS.container.standard,
          'mx-auto space-y-4' // Reduced vertical spacing from 6 to 4
        )}
      >
        {/* Compact Medical Search Section with Professional Animation */}
        <motion.section
          className="medical-search-section"
          role="search"
          aria-labelledby="search-section-heading"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 15, scale: 0.98 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            ...(prefersReducedMotion
              ? {}
              : {
                  y: [0, -2, 0],
                  transition: {
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  },
                }),
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : {
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <h2 id="search-section-heading" className="sr-only">
            Tìm kiếm dịch vụ y tế
          </h2>
          <SearchBarComponent
            medicalContext="general"
            placeholder="Tìm dịch vụ y tế, bác sĩ, khoa..."
            ariaLabel={ACCESSIBILITY.medicalAria.search}
          />
        </motion.section>

        {/* Compact Premium Medical Hero Section with Professional Animation */}
        <motion.section
          className="medical-hero-section"
          id="hero-section"
          role="banner"
          aria-labelledby="hero-section-heading"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.005 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : {
                  duration: 0.5,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <h2 id="hero-section-heading" className="sr-only">
            Giới thiệu bệnh viện và dịch vụ nổi bật
          </h2>
          <HeroSection />
        </motion.section>

        {/* Compact Featured Medical Services Section with Staggered Animation */}
        <motion.section
          className="medical-services-section"
          role="region"
          aria-labelledby="featured-services-heading"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, x: -10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.002 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : {
                  duration: 0.5,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <FeaturedServices />
        </motion.section>

        {/* Compact Featured Medical Departments Section with Staggered Animation */}
        <motion.section
          className="medical-departments-section"
          role="region"
          aria-labelledby="featured-departments-heading"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, x: 10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.002 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : {
                  duration: 0.5,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <FeaturedDepartents />
        </motion.section>

        {/* Compact Health News & Updates Section with Professional Animation */}
        <motion.section
          className="medical-news-section"
          role="region"
          aria-labelledby="health-news-heading"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.002 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : {
                  duration: 0.5,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <HealthNews />
        </motion.section>
      </div>

      {/* Professional Medical Styles */}
      <style>{`
        @keyframes medicalFloat {C
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.015;
          }
          25% {
            transform: translateY(-2px) rotate(0.5deg);
            opacity: 0.02;
          }
          50% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.015;
          }
          75% {
            transform: translateY(2px) rotate(-0.5deg);
            opacity: 0.01;
          }
        }

        @keyframes medicalPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.1);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(37, 99, 235, 0);
          }
        }

        .medical-hospital-dashboard {
          position: relative;
          z-index: 1;
        }

        .medical-search-section,
        .medical-hero-section,
        .medical-services-section,
        .medical-departments-section,
        .medical-news-section {
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .medical-hospital-dashboard *,
          .medical-search-section *,
          .medical-hero-section *,
          .medical-services-section *,
          .medical-departments-section *,
          .medical-news-section * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Enhanced focus states for accessibility */
        .medical-hospital-dashboard *:focus-visible {
          outline: 2px solid ${MEDICAL_COLORS.primary.blue};
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Performance optimizations */
        .medical-hospital-dashboard,
        .medical-search-section,
        .medical-hero-section,
        .medical-services-section,
        .medical-departments-section,
        .medical-news-section {
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Responsive design optimizations */
        @media (max-width: 640px) {
          .medical-hospital-dashboard {
            padding-left: 12px;
            padding-right: 12px;
          }

          .medical-search-section,
          .medical-hero-section,
          .medical-services-section,
          .medical-departments-section,
          .medical-news-section {
            margin-bottom: 12px;
          }
        }

        /* Optimize animations for better performance */
        @media (prefers-reduced-motion: no-preference) {
          .medical-hospital-dashboard * {
            animation-fill-mode: both;
          }
        }

        /* GPU acceleration for smooth animations */
        .group:hover,
        .group:focus {
          transform: translateZ(0);
        }
      `}</style>
    </motion.main>
  );
}

export default HomePage;
