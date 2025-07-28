import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
// Import components
import HeroSection from './hero-section';
import FeaturedServices from './featured-services';
import FeaturedDepartents from './featured-departents';
import HealthNews from './health-news';
import QuickActions from './quick-actions';
import SearchBarComponent from '@/components/search-bar-component';
import {
  SPACING,
  BORDER_RADIUS,
  MEDICAL_COLORS,
  TYPOGRAPHY,
  ANIMATIONS,
  ACCESSIBILITY,
  combineClasses,
} from '@/styles/medical-design-system';
import { getColorToken } from '@/styles/unified-color-system';
import { MEDICAL_TYPOGRAPHY } from '@/styles/enhanced-medical-typography';

function HomePage() {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Ensure layout is stable before showing content
    const timer = setTimeout(() => {
      setIsLayoutReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Modern Hospital Loading State
  if (!isLayoutReady) {
    return (
      <main className="min-h-screen w-full py-6" style={{ backgroundColor: MEDICAL_COLORS.white.soft }}>
        <div className="animate-pulse space-y-6 px-4 max-w-md mx-auto">
          {/* Medical Search Loading */}
          <div
            className="h-14 rounded-2xl border-2"
            style={{
              borderColor: `${MEDICAL_COLORS.primary.blue}20`,
              backgroundColor: `${MEDICAL_COLORS.primary.blue}05`,
            }}
          ></div>

          {/* Hero Section Loading */}
          <div
            className="h-56 rounded-3xl border-2"
            style={{
              borderColor: `${MEDICAL_COLORS.secondary.green}20`,
              backgroundColor: `${MEDICAL_COLORS.secondary.green}05`,
            }}
          ></div>

          {/* Services Loading */}
          <div className="space-y-4">
            <div
              className="h-36 rounded-2xl border-2"
              style={{
                borderColor: `${MEDICAL_COLORS.primary.blue}15`,
                backgroundColor: `${MEDICAL_COLORS.primary.blue}05`,
              }}
            ></div>
            <div
              className="h-36 rounded-2xl border-2"
              style={{
                borderColor: `${MEDICAL_COLORS.secondary.green}15`,
                backgroundColor: `${MEDICAL_COLORS.secondary.green}05`,
              }}
            ></div>
            <div
              className="h-36 rounded-2xl border-2"
              style={{
                borderColor: `${MEDICAL_COLORS.accent.cyan}15`,
                backgroundColor: `${MEDICAL_COLORS.accent.cyan}05`,
              }}
            ></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      className="min-h-screen w-full"
      style={{ backgroundColor: MEDICAL_COLORS.white.soft }}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReducedMotion
          ? {}
          : {
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }
      }
    >
      {/* Modern Hospital Dashboard Layout */}
      <div
        className={combineClasses(
          'medical-hospital-dashboard',
          SPACING.padding.section,
          'pb-8 max-w-md mx-auto space-y-6'
        )}
      >
        {/* Enhanced Medical Search Section */}
        <motion.div
          className="medical-search-section"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: 0.5,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <div
            className={combineClasses('p-4 rounded-2xl shadow-sm border', 'bg-white')}
            style={{
              borderColor: `${MEDICAL_COLORS.primary.blue}15`,
              boxShadow: `0 2px 8px ${MEDICAL_COLORS.primary.blue}08`,
            }}
          >
            <SearchBarComponent
              medicalContext="general"
              placeholder="Tìm dịch vụ y tế, bác sĩ, khoa..."
              ariaLabel={ACCESSIBILITY.medicalAria.search}
            />
          </div>
        </motion.div>

        {/* Quick Actions Section - Enhanced Medical Services */}
        <motion.div
          className="medical-quick-actions-section"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: 0.6,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <QuickActions />
        </motion.div>

        {/* Premium Medical Hero Section */}
        <motion.div
          className="medical-hero-section"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: 0.6,
                  delay: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <HeroSection />
        </motion.div>

        {/* Featured Medical Services Section */}
        <motion.div
          className="medical-services-section"
          role="region"
          aria-labelledby="featured-services-heading"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: 0.6,
                  delay: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <FeaturedServices />
        </motion.div>

        {/* Featured Medical Departments Section */}
        <motion.div
          className="medical-departments-section"
          role="region"
          aria-labelledby="featured-departments-heading"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: 0.6,
                  delay: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <FeaturedDepartents />
        </motion.div>

        {/* Health News & Updates Section */}
        <motion.div
          className="medical-news-section"
          role="region"
          aria-labelledby="health-news-heading"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: 0.6,
                  delay: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
        >
          <HealthNews />
        </motion.div>
      </div>
    </motion.main>
  );
}

export default HomePage;
