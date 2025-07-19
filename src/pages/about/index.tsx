import React, { Suspense } from 'react';
import Header from '@/components/header';
import ClinicCard from '@/components/ClinicCard';
import { clinics, getClinicsByType, type Clinic } from '@/data/clinics';
import about1 from '@/static/about1.jpg';
import CallIcon from '@/components/icons/call';

// Content variables for easy editing
const ABOUT_CONTENT = {
  banner: 'Về chúng tôi',
  title: 'BỆNH VIỆN ĐA KHOA',
  brandName: 'HÒA BÌNH - HẢI PHÒNG',
  slogan: 'Trị bệnh bằng khối óc – Chăm sóc bằng trái tim',
  paragraphs: [
    'Bệnh viện Đa khoa Hòa Bình – Hải Phòng chính thức đi vào hoạt động từ ngày 23 tháng 5 năm 2008 theo Quyết định số 1805/QĐ-BYT và Giấy chứng nhận số 20/GCNĐĐKHN-Y của Bộ Y tế.',
    'Ngoài việc cung cấp dịch vụ khám chữa bệnh cho bệnh nhân, bệnh viện còn hợp tác với nhiều công ty lớn như Sumidenso Việt Nam, Uniden Việt Nam, Ford Việt Nam, Toyodenso Việt Nam, Namyang Delta và Kefico Việt Nam để cung cấp dịch vụ khám sức khỏe tuyển dụng và định kỳ. Bệnh viện cũng hợp tác với hệ thống các ngân hàng trên địa bàn tỉnh Hải Phòng, đảm bảo sức khỏe và an toàn cho đội ngũ nhân viên và cộng đồng.',
  ],
  buttonText: 'Tìm hiểu thêm',
  buttonLink: '/',
  imageSrc: 'https://benhvienhoabinh.vn/wp-content/uploads/2025/01/57.png',
  imageAlt: 'Bệnh viện Đa khoa Hòa Bình - Hải Phòng',
};

// Updated stats to match user's change from 247 to '24/7'
const STATS_CONTENT = [
  { value: '+10', label: 'Năm hình thành & phát triển' },
  { value: '+50', label: 'Tiến sĩ, bác sĩ hàng đầu' },
  { value: '+300', label: 'Đội ngũ cán bộ nhân viên' },
  { value: '+1000', label: 'Bệnh nhân khám & điều trị/ngày' },
];

const CTA_CONTENT = {
  title: 'Cần Tư Vấn Y Tế?',
  description: 'Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch khám',
  phoneNumber: '0976.091.115',
  phoneText: 'Gọi Ngay: 0976.091.115',
  contactText: 'Liên Hệ',
  contactLink: '/contact',
};

const SECTION_TITLES = {
  general: 'Bệnh viện đa khoa Hòa Bình – Hải Phòng',
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

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      {/* About Us Section - Enhanced Hero */}
      <section className="relative bg-gradient-to-r from-white to-blue-50 pt-12 pb-20 md:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-500 via-orange-400 to-blue-500"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-100 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-xl"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6 md:space-y-8 lg:pr-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-sm font-medium shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
                <span>{ABOUT_CONTENT.banner}</span>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-blue-800 leading-tight">{ABOUT_CONTENT.title}</h2>
                <div className="relative my-2">
                  <h2 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 leading-tight tracking-tight">
                    {ABOUT_CONTENT.brandName}
                  </h2>
                  <span className="absolute -bottom-2 left-0 h-2 w-32 md:w-44 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></span>
                  <span className="absolute -bottom-2 -right-4 h-8 w-8 bg-blue-400 rounded-full opacity-50 blur-sm"></span>
                </div>
              </div>

              <p className="text-red-600 font-bold text-lg md:text-xl tracking-wide border-l-4 border-red-500 pl-3">
                {ABOUT_CONTENT.slogan}
              </p>

              <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                {ABOUT_CONTENT.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="relative pl-5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-blue-300 before:to-blue-500 before:rounded-full"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Action buttons */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4 md:gap-6">
                <a
                  href={ABOUT_CONTENT.buttonLink}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl text-center min-w-[160px] group"
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
                  className="inline-flex items-center justify-center bg-white border-2 border-blue-500 text-blue-600 px-6 py-3.5 rounded-lg font-medium hover:bg-blue-50 hover:border-blue-600 transition-all text-center shadow-md hover:shadow-lg"
                >
                  <CallIcon className="w-5 h-5 mr-2" />
                  <span>Gọi: 0868.115666</span>
                </a>
              </div>
            </div>

            {/* Image with enhanced styling */}
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -top-12 -right-12 w-56 h-56 bg-orange-100 rounded-full opacity-70 z-0 animate-pulse"></div>
              <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-blue-100 rounded-full opacity-70 z-0"></div>

              {/* Main image container */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4 shadow-2xl relative z-10 rotate-1 transform hover:rotate-0 hover:scale-[1.02] transition-all duration-300">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-inner">
                  <img
                    src={ABOUT_CONTENT.imageSrc}
                    alt={ABOUT_CONTENT.imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Badge */}
                <div className="absolute -bottom-5 right-10 bg-white px-4 py-2 rounded-lg shadow-lg border-l-4 border-blue-500">
                  <p className="text-blue-700 font-bold text-sm">Đội ngũ chuyên nghiệp</p>
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
      <section className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-16 md:py-20 relative overflow-hidden">
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
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
        </div>
      </div>
    </div>
  );
}
