import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DoctorItem from '@/components/items/doctor';
import { Doctor } from '@/types';
import { MEDICAL_COLORS, BORDER_RADIUS, SHADOWS, combineClasses } from '@/styles/medical-design-system';

// Mock doctor data for demonstration - includes WordPress-style title objects
const mockDoctors: (Doctor & {
  bacsi_chucdanh?: string;
  bacsi_donvi?: string;
  bacsi_kinhnghiem?: string;
  title?: { rendered?: string } | string;
})[] = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    title: { rendered: 'Nguyễn Văn An' }, // WordPress-style title object
    languages: 'Tiếng Việt, English, 中文',
    specialties: 'Tim mạch, Phẫu thuật tim',
    image: '/static/doctors/doctor-1.jpg',
    isAvailable: true,
    bacsi_chucdanh: 'Bác sĩ CKII',
    bacsi_donvi: 'Khoa Tim mạch - Bệnh viện Đa khoa Trung ương',
    bacsi_kinhnghiem:
      '15 năm kinh nghiệm trong lĩnh vực tim mạch\n• Phẫu thuật tim hở\n• Điều trị bệnh mạch vành\n• Can thiệp tim mạch',
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    title: { rendered: 'Trần Thị Bình' }, // WordPress-style title object
    languages: 'Tiếng Việt, English',
    specialties: 'Nhi khoa, Sơ sinh',
    image: '/static/doctors/doctor-2.jpg',
    isAvailable: true,
    bacsi_chucdanh: 'Thạc sĩ, Bác sĩ',
    bacsi_donvi: 'Khoa Nhi - Bệnh viện Nhi Trung ương',
    bacsi_kinhnghiem:
      '12 năm kinh nghiệm chăm sóc trẻ em\n• Điều trị bệnh nhiễm khuẩn\n• Chăm sóc trẻ sơ sinh\n• Tư vấn dinh dưỡng trẻ em',
  },
  {
    id: 3,
    name: 'Lê Minh Cường',
    title: 'Lê Minh Cường', // String title
    languages: 'Tiếng Việt, English, Français',
    specialties: 'Thần kinh, Phẫu thuật não',
    image: '/static/doctors/doctor-3.jpg',
    isAvailable: true,
    bacsi_chucdanh: 'Tiến sĩ, Bác sĩ CKII',
    bacsi_donvi: 'Khoa Thần kinh - Bệnh viện Bạch Mai',
    bacsi_kinhnghiem:
      '20 năm kinh nghiệm phẫu thuật thần kinh\n• Phẫu thuật u não\n• Điều trị đột quỵ\n• Phẫu thuật cột sống',
  },
  {
    id: 4,
    name: 'Phạm Thị Dung',
    title: { rendered: 'Phạm Thị Dung' }, // WordPress-style title object
    languages: 'Tiếng Việt, 한국어',
    specialties: 'Da liễu, Thẩm mỹ da',
    image: '/static/doctors/doctor-4.jpg',
    isAvailable: true,
    bacsi_chucdanh: 'Bác sĩ CKI',
    bacsi_donvi: 'Khoa Da liễu - Bệnh viện Da liễu Trung ương',
    bacsi_kinhnghiem:
      '8 năm kinh nghiệm điều trị bệnh da\n• Điều trị mụn trứng cá\n• Laser thẩm mỹ\n• Điều trị bệnh da dị ứng',
  },
  {
    id: 5,
    name: 'Hoàng Minh Tuấn',
    // No title field to test fallback
    languages: 'Tiếng Việt, English, 日本語',
    specialties: 'Gây mê hồi sức',
    image: '/static/doctors/doctor-5.jpg',
    isAvailable: true,
    bacsi_chucdanh: 'Bác sĩ',
    bacsi_donvi: 'Khoa Gây mê hồi sức - Bệnh viện Việt Đức',
    bacsi_kinhnghiem:
      '10 năm kinh nghiệm gây mê hồi sức\n• Gây mê cho phẫu thuật lớn\n• Hồi sức cấp cứu\n• Điều trị đau sau mổ',
  },
];

export default function DoctorCardsDemo() {
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'link' | 'selectable'>('link');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Optimized Doctor Cards</h1>
            <p className="text-xl text-gray-600 mb-8">
              Larger images with clear display of name, professional title, and department
            </p>
          </motion.div>

          {/* View Mode Toggle */}
          <div className="inline-flex items-center bg-white rounded-2xl p-2 shadow-lg border border-gray-200 mb-8">
            <button
              onClick={() => setViewMode('link')}
              className={combineClasses(
                'px-6 py-3 rounded-xl font-semibold transition-all duration-300',
                viewMode === 'link'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              )}
            >
              Link Cards
            </button>
            <button
              onClick={() => setViewMode('selectable')}
              className={combineClasses(
                'px-6 py-3 rounded-xl font-semibold transition-all duration-300',
                viewMode === 'selectable'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              )}
            >
              Selectable Cards
            </button>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: '🖼️',
              title: 'Larger Images',
              description: 'Optimized 96px doctor photos with rounded corners and shadows',
            },
            {
              icon: '📋',
              title: 'Clear Information',
              description: 'Name, professional title (chức danh), and department (đơn vị) prominently displayed',
            },
            {
              icon: '✨',
              title: 'Enhanced UI',
              description: 'Better spacing, typography, and visual hierarchy for improved readability',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {mockDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {viewMode === 'link' ? (
                <DoctorItem
                  doctor={doctor}
                  withLanguages={true}
                  description={
                    <div className="text-sm text-gray-600">
                      Chuyên gia hàng đầu trong lĩnh vực {doctor.specialties.toLowerCase()}, với nhiều năm kinh nghiệm
                      điều trị và nghiên cứu.
                    </div>
                  }
                />
              ) : (
                <DoctorItem
                  doctor={doctor}
                  withLanguages={true}
                  onClick={() => setSelectedDoctor(doctor.id)}
                  suffix={
                    selectedDoctor === doctor.id ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                    )
                  }
                  description={
                    <div className="text-sm text-gray-600">
                      Chuyên gia hàng đầu trong lĩnh vực {doctor.specialties.toLowerCase()}, với nhiều năm kinh nghiệm
                      điều trị và nghiên cứu.
                    </div>
                  }
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Selected Doctor Info */}
        {viewMode === 'selectable' && selectedDoctor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-8 p-6 bg-green-50 border border-green-200 rounded-2xl"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-800 font-semibold">
                Đã chọn: {mockDoctors.find((d) => d.id === selectedDoctor)?.name}
              </span>
            </div>
          </motion.div>
        )}

        {/* Design System Info */}
        <div className="mt-16 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Optimized Design Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Improvements</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  • <strong>Larger Images:</strong> 80px (mobile) to 96px (desktop) with rounded corners
                </li>
                <li>
                  • <strong>Doctor Name:</strong> Primary display with bold typography (text-xl)
                </li>
                <li>
                  • <strong>Professional Title:</strong> Highlighted badge with blue background
                </li>
                <li>
                  • <strong>Department:</strong> Clear display with department icon
                </li>
                <li>• Enhanced card padding (24px) for better spacing</li>
                <li>• Subtle gradient hover effects</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• WordPress API integration with proper fallbacks</li>
                <li>• Responsive image sizing (w-20 h-20 sm:w-24 sm:h-24)</li>
                <li>• Accessibility-compliant focus states</li>
                <li>• Keyboard navigation support</li>
                <li>• Smooth transitions and hover effects</li>
                <li>• Mobile-optimized layout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
