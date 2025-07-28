import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DoctorList from '@/components/form/doctor-list';
import { Doctor } from '@/types';
import { combineClasses, BORDER_RADIUS, SHADOWS, MEDICAL_COLORS } from '@/styles/medical-design-system';
import { getColorToken } from '@/styles/unified-color-system';

// Page transition variants for smooth animations

export default function DoctorPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Navigate directly to doctor detail page when a doctor is clicked
  const handleDoctorClick = useCallback(
    (doctor: Doctor) => {
      navigate(`/doctor/${doctor.id}`, { viewTransition: true });
    },
    [navigate]
  );

  // Specialty options for filtering
  const specialties = [
    { value: 'all', label: 'Tất cả chuyên khoa' },
    { value: 'cardiology', label: 'Tim mạch' },
    { value: 'neurology', label: 'Thần kinh' },
    { value: 'orthopedics', label: 'Chỉnh hình' },
    { value: 'pediatrics', label: 'Nhi khoa' },
    { value: 'dermatology', label: 'Da liễu' },
    { value: 'ophthalmology', label: 'Mắt' },
    { value: 'ent', label: 'Tai mũi họng' },
  ];

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
            Bác sĩ Chuyên khoa
          </motion.h1>

          <motion.p
            className={combineClasses(
              'text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto',
              'leading-relaxed font-medium mb-8'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Khám phá đội ngũ bác sĩ chuyên nghiệp, giàu kinh nghiệm của chúng tôi
          </motion.p>

          {/* Enhanced Search & Filter Section */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all medical-focus"
                  />
                </div>
              </div>

              {/* Filter Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Specialty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên khoa</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all medical-focus"
                  >
                    {specialties.map((specialty) => (
                      <option key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all medical-focus"
                  >
                    <option value="all">Tất cả bác sĩ</option>
                    <option value="available">Đang có lịch</option>
                    <option value="online">Đang online</option>
                  </select>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>50+ Bác sĩ chuyên khoa</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>15+ Năm kinh nghiệm</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Tư vấn 24/7</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Enhanced Doctor List Card */}
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
            aria-labelledby="doctor-list-heading"
          >
            {/* Doctor List Container */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              role="region"
              aria-label="Danh sách bác sĩ"
            >
              <DoctorList onChange={handleDoctorClick} itemsPerPage={6} />
            </motion.div>
          </div>
        </motion.main>
      </motion.div>
    </motion.div>
  );
}
