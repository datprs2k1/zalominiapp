import React, { Suspense } from 'react';
import Header from '@/components/header';
import ClinicCard from '@/components/ClinicCard';
import { clinics, getClinicsByType, type Clinic } from '@/data/clinics';
import about1 from '@/static/about1.jpg';
import CallIcon from '@/components/icons/call';

// Content variables for easy editing
const ABOUT_CONTENT = {
  banner: 'Về chúng tôi',
  title: 'HỆ THỐNG Y TẾ',
  brandName: 'TÂM THIỆN ĐỨC',
  slogan: 'Tận tâm – Chu đáo – Chuyên nghiệp',
  paragraphs: [
    'Hệ thống y tế Tâm Thiện Đức tại Phú Thọ là đơn vị tiên phong trong lĩnh vực chăm sóc sức khỏe chất lượng cao, với cơ sở vật chất hiện đại và trang thiết bị tiên tiến đạt chuẩn quốc gia. Chúng tôi tập trung vào chất lượng dịch vụ, được cung cấp bởi đội ngũ bác sĩ giàu kinh nghiệm và chuyên môn cao, trực tiếp tham gia khám, chẩn đoán và điều trị.',
    'Đặc biệt, Tâm Thiện Đức hợp tác với các bác sĩ từ các bệnh viện trung ương để cung cấp dịch vụ khám bệnh vào thứ Bảy và Chủ nhật. Điều này cho phép người dân Phú Thọ và các vùng lân cận tiếp cận với điều trị hiện đại, đạt chuẩn y tế ngay tại địa phương, tiết kiệm thời gian và chi phí di chuyển.',
  ],
  buttonText: 'Tìm hiểu thêm',
  buttonLink: '/services',
  imageSrc: about1,
  imageAlt: 'Đội ngũ y tế Tâm Thiện Đức',
};

const HERO_CONTENT = {
  title: 'HỆ THỐNG Y TẾ',
  brandName: 'TÂM THIỆN ĐỨC',
  description:
    'Hệ thống y tế chất lượng cao với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại, phục vụ cộng đồng với tâm huyết và trách nhiệm.',
};

// Updated stats to match user's change from 247 to '24/7'
const STATS_CONTENT = [
  { value: clinics.length, label: 'Phòng Khám' },
  { value: getClinicsByType('general').length, label: 'Phòng Khám Đa Khoa' },
  { value: getClinicsByType('dental').length, label: 'Phòng Khám Nha Khoa' },
  { value: '24/7', label: 'Dịch Vụ' },
];

const SECTION_TITLES = {
  general: 'Phòng Khám Đa Khoa',
  dental: 'Phòng Khám Nha Khoa',
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 gap-3 md:gap-4 lg:gap-6 px-3 sm:px-4 md:px-8 max-w-6xl mx-auto">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 lg:p-6 animate-pulse">
        <div className="h-5 md:h-6 bg-gray-200 rounded mb-3 md:mb-4"></div>
        <div className="h-3 md:h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 md:h-4 bg-gray-200 rounded mb-3 md:mb-4"></div>
        <div className="flex gap-2 md:gap-3 justify-center md:justify-start">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default function AboutPage() {
  const generalClinics = getClinicsByType('general');
  const dentalClinics = getClinicsByType('dental');

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">
      {/* About Us Section - Enhanced Hero */}
      <section className="relative bg-gradient-to-r from-white to-medical-50 pt-8 pb-16 md:pt-12 md:pb-20 lg:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-3 md:h-4 bg-gradient-to-r from-medical-500 via-orange-400 to-medical-500"></div>
        <div className="absolute -top-10 -right-10 md:-top-20 md:-right-20 w-40 h-40 md:w-80 md:h-80 bg-orange-100 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 md:-bottom-40 md:-left-40 w-48 h-48 md:w-96 md:h-96 bg-medical-100 rounded-full opacity-30 blur-xl"></div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-5 md:space-y-6 lg:space-y-8 lg:pr-8">
              <div className="inline-flex items-center px-3 py-2 md:px-4 bg-gradient-to-r from-medical-600 to-medical-500 text-white rounded-full text-xs md:text-sm font-medium shadow-lg">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse mr-2"></span>
                <span>{ABOUT_CONTENT.banner}</span>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-medical-800 leading-tight">
                  {ABOUT_CONTENT.title}
                </h2>
                <div className="relative my-2 md:my-3">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 leading-tight tracking-tight">
                    {ABOUT_CONTENT.brandName}
                  </h2>
                  <span className="absolute -bottom-1.5 md:-bottom-2 left-0 h-1.5 md:h-2 w-24 sm:w-32 md:w-44 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></span>
                  <span className="absolute -bottom-1.5 md:-bottom-2 -right-2 md:-right-4 h-6 w-6 md:h-8 md:w-8 bg-medical-400 rounded-full opacity-50 blur-sm"></span>
                </div>
              </div>

              <p className="text-red-600 font-bold text-base md:text-lg lg:text-xl tracking-wide border-l-3 md:border-l-4 border-red-500 pl-2 md:pl-3">
                {ABOUT_CONTENT.slogan}
              </p>

              <div className="space-y-3 md:space-y-4 text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg">
                {ABOUT_CONTENT.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="relative pl-4 md:pl-5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 md:before:w-1.5 before:bg-gradient-to-b before:from-medical-300 before:to-medical-500 before:rounded-full"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Action buttons - Enhanced for mobile */}
              <div className="pt-4 md:pt-6 flex flex-col gap-3 md:gap-4 lg:flex-row lg:gap-6">
                <a
                  href={ABOUT_CONTENT.buttonLink}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-medical-600 to-medical-500 text-white px-6 py-4 rounded-lg font-medium hover:from-medical-700 hover:to-medical-600 transition-all shadow-lg hover:shadow-xl text-center min-w-[160px] min-h-[48px] group touch-manipulation"
                >
                  <span>{ABOUT_CONTENT.buttonText}</span>
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <a
                  href="tel:0868115666"
                  className="inline-flex items-center justify-center bg-white border-2 border-medical-500 text-medical-600 px-6 py-3.5 rounded-lg font-medium hover:bg-medical-50 hover:border-medical-600 transition-all text-center shadow-md hover:shadow-lg min-h-[48px] touch-manipulation"
                >
                  <CallIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="text-sm md:text-base">Gọi: 0868.115666</span>
                </a>
              </div>
            </div>

            {/* Image with enhanced styling - Mobile optimized */}
            <div className="relative mt-6 md:mt-8 lg:mt-0">
              <div className="absolute -top-6 -right-6 md:-top-12 md:-right-12 w-32 h-32 md:w-56 md:h-56 bg-orange-100 rounded-full opacity-70 z-0 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 md:-bottom-12 md:-left-12 w-32 h-32 md:w-56 md:h-56 bg-medical-100 rounded-full opacity-70 z-0"></div>

              {/* Main image container */}
              <div className="bg-gradient-to-br from-medical-100 to-medical-200 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-xl md:shadow-2xl relative z-10 rotate-1 transform hover:rotate-0 hover:scale-[1.02] transition-all duration-300">
                <div className="aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden shadow-inner">
                  <img
                    src={ABOUT_CONTENT.imageSrc}
                    alt={ABOUT_CONTENT.imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Badge - Mobile responsive */}
                <div className="absolute -bottom-3 right-4 md:-bottom-5 md:right-10 bg-white px-2 py-1 md:px-4 md:py-2 rounded-md md:rounded-lg shadow-lg border-l-3 md:border-l-4 border-medical-500">
                  <p className="text-medical-700 font-bold text-xs md:text-sm">Đội ngũ chuyên nghiệp</p>
                </div>

                {/* Decorative element */}
                <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 md:w-6 md:h-6 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator - Mobile optimized */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
            <path
              fill="#0369a1"
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section - Enhanced for mobile */}
      <section className="bg-gradient-to-r from-medical-700 to-medical-600 text-white py-12 md:py-16 lg:py-20 relative overflow-hidden">
        {/* Decorative elements - Mobile responsive */}
        <div className="absolute top-0 right-0 opacity-10">
          <svg
            width="200"
            height="200"
            md:width="400"
            md:height="400"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFFFFF"
              d="M38.6,-47.1C50.3,-34.6,60.5,-23.6,62.8,-11C65.2,1.6,59.7,15.9,51.8,28.1C43.9,40.2,33.5,50.3,20.4,57.5C7.3,64.8,-8.4,69.3,-23.6,65.8C-38.7,62.3,-53.2,50.9,-60.1,36.5C-67,22.1,-66.3,4.8,-62.3,-11C-58.2,-26.8,-50.9,-41,-39.5,-53.1C-28.1,-65.2,-14.1,-75.1,-0.5,-74.5C13,-73.9,26,-59.7,38.6,-47.1Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 relative z-10">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-8 md:mb-10 text-white drop-shadow">
            Thành tựu của chúng tôi
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 text-center">
            {STATS_CONTENT.map((stat, index) => (
              <div
                key={index}
                className="bg-white/15 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl min-h-[100px] md:min-h-[120px] flex flex-col justify-center"
              >
                <div className="text-2xl md:text-4xl lg:text-6xl font-extrabold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-50">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm lg:text-base font-medium text-white leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Decorative circles - Mobile responsive */}
          <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-white rounded-full opacity-10"></div>
          <div className="absolute bottom-5 right-5 md:bottom-10 md:right-10 w-16 h-16 md:w-32 md:h-32 bg-white rounded-full opacity-10"></div>
        </div>
      </section>

      {/* Clinics Sections - Enhanced for mobile */}
      <div className="flex-1 py-12 md:py-16 lg:py-24 space-y-16 md:space-y-20 lg:space-y-32 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8">
          <Suspense fallback={<LoadingSkeleton />}>
            <div className="mb-16 md:mb-20">
              {/* Enhanced title - Mobile optimized */}
              <div className="flex flex-col items-center justify-center mb-8 md:mb-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-medical-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-medical-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 md:w-6 md:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-800 text-center mb-2 px-4">
                  {SECTION_TITLES.general}
                </h2>
                <div className="w-16 md:w-20 h-1 md:h-1.5 bg-medical-500 rounded-full mb-4 md:mb-6"></div>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 md:mb-10 text-sm md:text-base lg:text-lg px-4 leading-relaxed">
                  Các phòng khám đa khoa của chúng tôi cung cấp dịch vụ y tế toàn diện với đội ngũ bác sĩ giàu kinh
                  nghiệm.
                </p>
              </div>

              {/* Clinic cards - Mobile optimized */}
              <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8">
                {generalClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="transform transition-all duration-300 hover:scale-[1.01] md:hover:scale-[1.02]"
                  >
                    <ClinicCard clinic={clinic} />
                  </div>
                ))}
              </div>
            </div>
          </Suspense>

          <Suspense fallback={<LoadingSkeleton />}>
            <div>
              {/* Enhanced title - Mobile optimized */}
              <div className="flex flex-col items-center justify-center mb-8 md:mb-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-medical-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-medical-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 md:w-6 md:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-800 text-center mb-2 px-4">
                  {SECTION_TITLES.dental}
                </h2>
                <div className="w-16 md:w-20 h-1 md:h-1.5 bg-medical-500 rounded-full mb-4 md:mb-6"></div>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 md:mb-10 text-sm md:text-base lg:text-lg px-4 leading-relaxed">
                  Phòng khám nha khoa của chúng tôi cung cấp các dịch vụ chăm sóc răng miệng chất lượng cao.
                </p>
              </div>

              {/* Clinic cards - Mobile optimized */}
              <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8">
                {dentalClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="transform transition-all duration-300 hover:scale-[1.01] md:hover:scale-[1.02]"
                  >
                    <ClinicCard clinic={clinic} />
                  </div>
                ))}
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
