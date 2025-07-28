import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DoctorList from '@/components/form/doctor-list';
import { Doctor } from '@/types';
import {
  combineClasses,
  BORDER_RADIUS,
  TYPOGRAPHY,
  TOUCH_TARGETS,
  SHADOWS,
  SPACING,
  ANIMATIONS,
  MEDICAL_COLORS,
} from '@/styles/medical-design-system';

// Page transition variants for smooth animations

export default function DoctorPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>();

  // Optimized callback to prevent unnecessary re-renders
  const handleDoctorChange = useCallback((doctor: Doctor) => {
    setSelectedDoctor(doctor);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50/90 via-white to-green-50/90 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Enhanced Medical Background with Subtle Patterns */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Primary medical gradient */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-blue-500/12 via-cyan-400/8 to-green-500/10" />

        {/* Medical cross pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="medical-cross" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M8 6h4v8h-4zM6 8h8v4h-8z" fill="currentColor" className="text-blue-600" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#medical-cross)" />
          </svg>
        </div>

        {/* Floating medical elements */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-100/30 to-cyan-100/20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-24 h-24 rounded-full bg-gradient-to-br from-green-100/30 to-emerald-100/20"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Main Content Container with Enhanced Layout */}
      <motion.div
        className={combineClasses(
          'relative z-10 min-h-screen flex flex-col',
          'px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16',
          'max-w-7xl mx-auto'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {/* Enhanced Header Section */}
        <motion.header
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className={combineClasses(
                'w-16 h-16 sm:w-20 sm:h-20',
                'bg-gradient-to-br from-blue-500 to-cyan-600',
                BORDER_RADIUS.cardLarge,
                'flex items-center justify-center',
                SHADOWS.medical,
                'ring-4 ring-blue-100/50'
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </motion.div>
          </div>

          <motion.h1
            className={combineClasses(
              'text-3xl sm:text-4xl lg:text-5xl font-bold',
              'bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900',
              'bg-clip-text text-transparent',
              'mb-4 leading-tight'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Chọn Bác sĩ Chuyên khoa
          </motion.h1>

          <motion.p
            className={combineClasses(
              'text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto',
              'leading-relaxed font-medium'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Tìm kiếm và kết nối với đội ngũ bác sĩ chuyên nghiệp, giàu kinh nghiệm của chúng tôi
          </motion.p>
        </motion.header>

        {/* Enhanced Doctor Selection Card */}
        <motion.main
          className="flex-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div
            className={combineClasses(
              'bg-white/95 backdrop-blur-sm',
              BORDER_RADIUS.section,
              SHADOWS.medical,
              'p-6 sm:p-8 lg:p-10',
              'border border-blue-100/50',
              'min-h-[600px] flex flex-col'
            )}
            role="main"
            aria-labelledby="doctor-selection-heading"
          >
            {/* Selection Status Banner */}
            <AnimatePresence mode="wait">
              {selectedDoctor && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={combineClasses(
                    'flex items-center justify-between',
                    'bg-gradient-to-r from-green-50 to-emerald-50',
                    'border border-green-200/60',
                    BORDER_RADIUS.cardLarge,
                    'p-4 sm:p-6 mb-8',
                    SHADOWS.card
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={combineClasses(
                        'w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600',
                        BORDER_RADIUS.pill,
                        'flex items-center justify-center',
                        'ring-4 ring-green-100'
                      )}
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-green-800 mb-1">Đã chọn bác sĩ</h3>
                      <p className="text-green-700 font-medium">
                        {selectedDoctor.name} - {selectedDoctor.title}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDoctor(undefined)}
                    className={combineClasses(
                      'text-green-600 hover:text-green-800',
                      'p-2 rounded-full hover:bg-green-100',
                      ANIMATIONS.normal
                    )}
                    aria-label="Bỏ chọn bác sĩ"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Doctor Selector Container */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              role="region"
              aria-label="Danh sách bác sĩ có sẵn"
            >
              <DoctorList value={selectedDoctor} onChange={handleDoctorChange} itemsPerPage={6} />
            </motion.div>
          </div>
        </motion.main>
      </motion.div>
    </motion.div>
  );
}
