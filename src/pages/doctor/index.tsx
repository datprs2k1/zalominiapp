import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DoctorList from '@/components/form/doctor-list';
import { Doctor } from '@/types';
import { getColorToken } from '@/styles/unified-color-system';

export default function DoctorPage() {
  const navigate = useNavigate();

  // Navigate directly to doctor detail page when a doctor is clicked
  const handleDoctorClick = useCallback(
    (doctor: Doctor) => {
      navigate(`/doctor/${doctor.id}`, { viewTransition: true });
    },
    [navigate]
  );

  // Respect user's motion preferences
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Compact Medical Header with Professional Hierarchy */}
        <motion.header
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0.2 } : { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-8 relative"
        >
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-500/5 to-green-500/5 rounded-3xl blur-3xl -z-10" />

          {/* Compact Medical Icon */}
          <motion.div
            initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.8, opacity: 0 }}
            animate={prefersReducedMotion ? { scale: 1 } : { scale: 1, opacity: 1 }}
            transition={
              prefersReducedMotion ? { duration: 0.2 } : { duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
            }
            className="flex items-center justify-center mb-4"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-md opacity-20" />

              {/* Main Icon Container */}
              <div
                className="relative w-16 h-16 rounded-xl flex items-center justify-center shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${getColorToken('primary')} 0%, ${getColorToken('primary-600')} 50%, ${getColorToken('accent-600')} 100%)`,
                }}
              >
                {/* Medical Cross Icon */}
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>

                {/* Subtle Medical Cross Overlay */}
                <div className="absolute top-1 right-1 w-2.5 h-2.5 text-white/60">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Typography Hierarchy */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.2, delay: 0.1 }
                : { duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
            }
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-blue-900 to-cyan-900 bg-clip-text text-transparent leading-tight">
              Bác sĩ Chuyên khoa
            </h1>

            {/* Compact Professional Subtitle */}
            <div className="flex items-center justify-center mb-3">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-12" />
              <span className="mx-3 text-xs font-medium text-blue-600 uppercase tracking-wider">
                Đội ngũ Y tế Chuyên nghiệp
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-12" />
            </div>

            <p className="text-base text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium mb-4">
              Khám phá đội ngũ bác sĩ chuyên nghiệp, giàu kinh nghiệm với trình độ cao
            </p>

            {/* Compact Trust Indicators */}
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">Chứng chỉ hành nghề</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-medium">Kinh nghiệm lâu năm</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                <span className="font-medium">Chăm sóc tận tâm</span>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Enhanced Doctor List Container */}
        <motion.main
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.2, delay: 0.2 }
              : { duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
          }
          className="relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20" />

          {/* Content Container */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100/50 py-4">
            {/* Compact Section Header */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Danh sách Bác sĩ</h2>
              <p className="text-sm text-gray-600">Chọn bác sĩ phù hợp với nhu cầu của bạn</p>
            </div>

            <DoctorList onChange={handleDoctorClick} itemsPerPage={8} />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
