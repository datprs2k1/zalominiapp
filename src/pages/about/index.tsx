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

const CTA_CONTENT = {
  title: 'Cần Tư Vấn Y Tế?',
  description: 'Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch khám',
  phoneNumber: '0868.115666',
  phoneText: 'Gọi Ngay: 0868.115666',
  contactText: 'Liên Hệ',
  contactLink: '/contact',
};

const SECTION_TITLES = {
  general: 'Phòng Khám Đa Khoa',
  dental: 'Phòng Khám Nha Khoa',
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 md:gap-6 px-3 md:px-8 max-w-6xl mx-auto">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-3 justify-center md:justify-start">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="w-10 h-10 bg-gray-200 rounded-full"></div>
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
    <div className="flex-1 flex flex-col bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      {/* About Us Section - Enhanced Hero */}
      <section className="relative bg-gradient-to-r from-white to-green-50 pt-12 pb-20 md:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-green-500 via-orange-400 to-green-500"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-100 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full opacity-30 blur-xl"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6 md:space-y-8 lg:pr-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full text-sm font-medium shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
                <span>{ABOUT_CONTENT.banner}</span>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-800 leading-tight">{ABOUT_CONTENT.title}</h2>
                <div className="relative my-2">
                  <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 leading-tight tracking-tight">
                    {ABOUT_CONTENT.brandName}
                  </h2>
                  <span className="absolute -bottom-2 left-0 h-2 w-32 md:w-44 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></span>
                  <span className="absolute -bottom-2 -right-4 h-8 w-8 bg-green-400 rounded-full opacity-50 blur-sm"></span>
                </div>
              </div>

              <p className="text-red-600 font-bold text-lg md:text-xl tracking-wide border-l-4 border-red-500 pl-3">
                {ABOUT_CONTENT.slogan}
              </p>

              <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                {ABOUT_CONTENT.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="relative pl-5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-green-300 before:to-green-500 before:rounded-full"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Action buttons */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4 md:gap-6">
                <a
                  href={ABOUT_CONTENT.buttonLink}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-lg font-medium hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl text-center min-w-[160px] group"
                >
                  <span>{ABOUT_CONTENT.buttonText}</span>
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
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
                  className="inline-flex items-center justify-center bg-white border-2 border-green-500 text-green-600 px-6 py-3.5 rounded-lg font-medium hover:bg-green-50 hover:border-green-600 transition-all text-center shadow-md hover:shadow-lg"
                >
                  <CallIcon className="w-5 h-5 mr-2" />
                  <span>Gọi: 0868.115666</span>
                </a>
              </div>
            </div>

            {/* Image with enhanced styling */}
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -top-12 -right-12 w-56 h-56 bg-orange-100 rounded-full opacity-70 z-0 animate-pulse"></div>
              <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-green-100 rounded-full opacity-70 z-0"></div>

              {/* Main image container */}
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-4 shadow-2xl relative z-10 rotate-1 transform hover:rotate-0 hover:scale-[1.02] transition-all duration-300">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-inner">
                  <img
                    src={ABOUT_CONTENT.imageSrc}
                    alt={ABOUT_CONTENT.imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Badge */}
                <div className="absolute -bottom-5 right-10 bg-white px-4 py-2 rounded-lg shadow-lg border-l-4 border-green-500">
                  <p className="text-green-700 font-bold text-sm">Đội ngũ chuyên nghiệp</p>
                </div>

                {/* Decorative element */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
            <path
              fill="#047857"
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="bg-gradient-to-r from-green-700 to-green-600 text-white py-16 md:py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#FFFFFF"
              d="M38.6,-47.1C50.3,-34.6,60.5,-23.6,62.8,-11C65.2,1.6,59.7,15.9,51.8,28.1C43.9,40.2,33.5,50.3,20.4,57.5C7.3,64.8,-8.4,69.3,-23.6,65.8C-38.7,62.3,-53.2,50.9,-60.1,36.5C-67,22.1,-66.3,4.8,-62.3,-11C-58.2,-26.8,-50.9,-41,-39.5,-53.1C-28.1,-65.2,-14.1,-75.1,-0.5,-74.5C13,-73.9,26,-59.7,38.6,-47.1Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-white drop-shadow">
            Thành tựu của chúng tôi
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {STATS_CONTENT.map((stat, index) => (
              <div
                key={index}
                className="bg-white/15 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/20 hover:bg-white/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="text-3xl md:text-6xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-50">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base font-medium text-white">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Decorative circles */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-10"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full opacity-10"></div>
        </div>
      </section>

      {/* Clinics Sections - Enhanced */}
      <div className="flex-1 py-16 md:py-24 space-y-20 md:space-y-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <Suspense fallback={<LoadingSkeleton />}>
            <div className="mb-20">
              {/* Enhanced title */}
              <div className="flex flex-col items-center justify-center mb-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
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
                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 text-center mb-2">
                  {SECTION_TITLES.general}
                </h2>
                <div className="w-20 h-1.5 bg-green-500 rounded-full mb-6"></div>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
                  Các phòng khám đa khoa của chúng tôi cung cấp dịch vụ y tế toàn diện với đội ngũ bác sĩ giàu kinh
                  nghiệm.
                </p>
              </div>

              {/* Clinic cards */}
              <div className="grid grid-cols-1 gap-6 md:gap-8">
                {generalClinics.map((clinic) => (
                  <div key={clinic.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                    <ClinicCard clinic={clinic} />
                  </div>
                ))}
              </div>
            </div>
          </Suspense>

          <Suspense fallback={<LoadingSkeleton />}>
            <div>
              {/* Enhanced title */}
              <div className="flex flex-col items-center justify-center mb-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
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
                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 text-center mb-2">
                  {SECTION_TITLES.dental}
                </h2>
                <div className="w-20 h-1.5 bg-green-500 rounded-full mb-6"></div>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
                  Phòng khám nha khoa của chúng tôi cung cấp các dịch vụ chăm sóc răng miệng chất lượng cao.
                </p>
              </div>

              {/* Clinic cards */}
              <div className="grid grid-cols-1 gap-6 md:gap-8">
                {dentalClinics.map((clinic) => (
                  <div key={clinic.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                    <ClinicCard clinic={clinic} />
                  </div>
                ))}
              </div>
            </div>
          </Suspense>
        </div>
      </div>

      {/* CTA Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-green-50 to-green-100 py-16 md:py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-orange-400 to-green-500"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full opacity-40 blur-xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-100 rounded-full opacity-40 blur-xl"></div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-t-4 border-orange-500">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{CTA_CONTENT.title}</h3>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">{CTA_CONTENT.description}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-5 justify-center max-w-md mx-auto">
              <a
                href={`tel:${CTA_CONTENT.phoneNumber}`}
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl text-center group"
              >
                <CallIcon className="w-5 h-5 mr-3" />
                <span>{CTA_CONTENT.phoneText}</span>
              </a>
              <a
                href={CTA_CONTENT.contactLink}
                className="inline-flex items-center justify-center bg-white border-2 border-orange-500 text-orange-600 px-6 py-3.5 rounded-lg font-bold hover:bg-orange-50 transition-all text-center shadow-md hover:shadow-lg group"
              >
                <span>{CTA_CONTENT.contactText}</span>
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
