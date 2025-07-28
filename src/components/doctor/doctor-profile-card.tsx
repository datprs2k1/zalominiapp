import { useState } from 'react';
import { motion } from 'framer-motion';
import { Doctor } from '@/types';
import { SPACING, combineClasses, BORDER_RADIUS, SHADOWS } from '@/styles/medical-design-system';

interface DoctorProfileCardProps {
  doctor: Doctor;
  className?: string;
}

interface CareerTimelineItem {
  year: string;
  position: string;
  description?: string;
}

// Mock career timeline data - in real app this would come from the doctor data
const getCareerTimeline = (doctor: Doctor): CareerTimelineItem[] => {
  // Extract career information from doctor's experience or create mock data
  const mockTimeline: CareerTimelineItem[] = [
    {
      year: '2002',
      position: 'Bác sĩ điều trị tại khoa cấp cứu BVĐK tỉnh Hải Dương',
    },
    {
      year: '2003 - 2017',
      position: 'Bác sĩ điều trị tại khoa ngoại chấn thương',
    },
    {
      year: '2009 - 2017',
      position: 'Phó Trưởng khoa ngoại I',
    },
    {
      year: '2017 - nay',
      position: 'Giám đốc BVĐK Hòa bình',
    },
  ];

  return mockTimeline;
};

export default function DoctorProfileCard({ doctor, className }: DoctorProfileCardProps) {
  const [imgError, setImgError] = useState(false);
  const careerTimeline = getCareerTimeline(doctor);

  // Get doctor image with fallback
  let avatarUrl = '/avatar-doctor-fallback.png';
  if (!imgError && doctor.image) {
    avatarUrl = doctor.image;
  }

  // Parse doctor title and name
  const doctorTitle = doctor.title || '';
  const doctorName = doctor.name || '';

  // Extract degree/title from the title field (e.g., "Bác sĩ CKII")
  const degreeMatch = doctorTitle.match(/(Bác sĩ\s*CK[I]+|Thạc sĩ|Tiến sĩ|Bác sĩ)/i);
  const degree = degreeMatch ? degreeMatch[0] : 'Bác sĩ';

  return (
    <motion.div
      className={combineClasses(
        'bg-white overflow-hidden',
        BORDER_RADIUS.cardLarge,
        SHADOWS.medical,
        'border border-gray-100',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{
        y: -2,
        boxShadow: '0 12px 32px rgba(0,102,204,0.12)',
        transition: { duration: 0.3 },
      }}
    >
      {/* Medical Header Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-green-500" />

      <div className={SPACING.padding.cardLarge}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Doctor Photo Section */}
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <div className="relative group">
              {/* Main Doctor Photo - Larger and More Prominent */}
              <div className="relative w-80 h-96 lg:w-72 lg:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 shadow-lg">
                <img
                  src={avatarUrl}
                  alt={`${doctorName} - ${degree}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />

                {/* Professional Badge Overlay */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-gray-700">Đang hoạt động</span>
                  </div>
                </div>

                {/* Medical Cross Decoration */}
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 2v6H2v4h6v6h4v-6h6V8h-6V2H8z" />
                  </svg>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Doctor Information Section */}
          <div className="flex-1 space-y-6">
            {/* Doctor Title/Degree with Enhanced Styling */}
            <motion.div
              className="flex items-center bg-blue-50 rounded-xl px-4 py-3 border border-blue-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="text-blue-700 font-semibold text-lg">{degree}</span>
                <div className="text-blue-600 text-sm">Chuyên gia y tế</div>
              </div>
            </motion.div>

            {/* Doctor Name with Enhanced Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">{doctorName}</h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full" />
            </motion.div>

            {/* Current Position with Enhanced Design */}
            <motion.div
              className="bg-green-50 rounded-xl p-4 border border-green-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-green-700 font-semibold text-lg">{doctor.unit || 'Giám đốc bệnh viện'}</div>
                  <div className="text-green-600 text-sm">Vị trí hiện tại</div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Career Timeline */}
            <motion.div
              className="bg-gray-50 rounded-xl p-5 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Quá trình công tác</h3>
              </div>

              <div className="space-y-4">
                {careerTimeline.map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative pl-6 pb-4 last:pb-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    {/* Timeline Line */}
                    {index < careerTimeline.length - 1 && (
                      <div className="absolute left-2 top-6 w-0.5 h-full bg-gradient-to-b from-blue-300 to-green-300" />
                    )}

                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" />

                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 ml-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                          {item.year}
                        </span>
                        {index === 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Hiện tại
                          </span>
                        )}
                      </div>
                      <div className="text-gray-800 font-medium leading-relaxed">{item.position}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
