import React from 'react';
import { getClinicsByType, type Clinic } from '@/data/clinics';
import './styles.css';
import { motion, AnimatePresence } from 'framer-motion';

// Import extracted components and utilities
import { AnimatedElement } from './components';
import { CONTENT } from './constants/content';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { ClinicsSection } from './components/ClinicsSection';

export default function AboutPage() {
  const generalClinics = getClinicsByType('general');

  return (
    <AnimatePresence mode="wait">
      <motion.main
        className="about-page flex-1 flex flex-col min-h-screen"
        style={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          borderWidth: '0',
          outlineWidth: '0',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        role="main"
        aria-label="Trang giới thiệu bệnh viện Hòa Bình - Hải Phòng"
      >
        {/* Skip navigation for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-4 focus:ring-primary/50"
          tabIndex={0}
        >
          Bỏ qua điều hướng, đến nội dung chính
        </a>

        {/* Page header with breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol>
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li aria-current="page">Về chúng tôi</li>
          </ol>
        </nav>

        <div id="main-content" tabIndex={-1}>
          <HeroSection />
          <StatsSection />
          <ClinicsSection clinics={generalClinics} />
        </div>

        {/* Enhanced page footer with accessibility info */}
        <footer className="mt-auto py-8 bg-surface border-t border-border" role="contentinfo">
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <p className="text-text-secondary text-sm">
              © 2024 Bệnh viện Đa khoa Hòa Bình - Hải Phòng.
              <span className="sr-only">Trang web tuân thủ tiêu chuẩn WCAG 2.1 AA về khả năng tiếp cận.</span>
            </p>
            <div className="mt-2 flex justify-center gap-4 text-xs text-text-muted">
              <span>
                Hotline:{' '}
                <a href="tel:0976091115" className="text-primary hover:underline">
                  0976.091.115
                </a>
              </span>
              <span>
                Cấp cứu 24/7:{' '}
                <a href="tel:0868115666" className="text-error hover:underline">
                  0868.115666
                </a>
              </span>
            </div>
          </div>
        </footer>
      </motion.main>
    </AnimatePresence>
  );
}
