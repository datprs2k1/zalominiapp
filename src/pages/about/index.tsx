import React, { Suspense, useEffect } from 'react';
import Header from '@/components/header';
import ClinicCard from '@/components/ClinicCard';
import { clinics, getClinicsByType, type Clinic } from '@/data/clinics';
import about1 from '@/static/about1.jpg';
import CallIcon from '@/components/icons/call';
import './styles.css'; // CSS animations moved to separate file

// Content variables moved to a dedicated object for better organization
const CONTENT = {
  about: {
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
    phoneNumber: '0868.115666',
  },
  stats: [
    { value: '+10', label: 'Năm hình thành & phát triển' },
    { value: '+50', label: 'Tiến sĩ, bác sĩ hàng đầu' },
    { value: '+300', label: 'Đội ngũ cán bộ nhân viên' },
    { value: '+1000', label: 'Bệnh nhân khám & điều trị/ngày' },
  ],
  cta: {
    title: 'Cần Tư Vấn Y Tế?',
    description: 'Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch khám',
    phoneNumber: '0976.091.115',
    phoneText: 'Gọi Ngay: 0976.091.115',
    contactText: 'Liên Hệ',
    contactLink: '/contact',
  },
  sections: {
    general: 'Bệnh viện đa khoa Hòa Bình – Hải Phòng',
  },
};

// Types for component props
interface AnimatedElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

interface StatItemProps {
  value: string;
  label: string;
  index: number;
}

// Reusable components
const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, delay = 0, className = '' }) => {
  return (
    <div className={`opacity-0 translate-y-4 ${className} animate-element`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 px-4 max-w-6xl mx-auto">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-4 animate-pulse shadow-sm">
        <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-3 bg-gray-200 rounded mb-3 w-5/6"></div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="w-8 h-8 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const StatItem: React.FC<StatItemProps> = ({ value, label, index }) => (
  <div
    className="stats-item bg-white/15 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-102"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="count-animation text-2xl sm:text-3xl font-bold mb-1 text-yellow-200">{value}</div>
    <div className="text-xs sm:text-sm font-medium text-white">{label}</div>
  </div>
);

// Section components
const HeroSection: React.FC = () => (
  <section className="relative bg-white pt-6 pb-12 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-orange-400 to-blue-500"></div>

    <div className="container mx-auto px-4 relative z-10">
      <AnimatedElement delay={100} className="flex justify-center mb-6">
        <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-sm font-medium shadow-md">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1.5"></span>
          <span>{CONTENT.about.banner}</span>
        </div>
      </AnimatedElement>

      <div className="flex flex-col items-center">
        <AnimatedElement delay={200} className="relative w-full mb-8 max-w-md mx-auto">
          <div className="absolute -z-10 w-full h-full bg-gradient-to-r from-blue-100/50 to-orange-100/50 rounded-2xl transform rotate-3"></div>
          <div className="relative bg-white rounded-xl p-2 shadow-lg transform hover:scale-[1.01] transition-all duration-300 float-animation">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={CONTENT.about.imageSrc}
                alt={CONTENT.about.imageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="absolute -bottom-3 right-4 bg-white px-3 py-1.5 rounded-lg shadow-md border-l-3 border-blue-500 text-xs pulse-animation">
              <p className="text-blue-700 font-bold">Đội ngũ chuyên nghiệp</p>
            </div>
          </div>
        </AnimatedElement>

        <div className="text-center sm:text-left space-y-4 w-full">
          <AnimatedElement delay={300}>
            <h1 className="text-xl font-bold text-blue-800">{CONTENT.about.title}</h1>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 tracking-tight">
              {CONTENT.about.brandName}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto sm:mx-0 my-2"></div>
          </AnimatedElement>

          <AnimatedElement delay={400} className="block">
            <p className="text-red-600 font-bold text-base tracking-wide border-l-4 border-red-500 pl-3 py-1 mx-auto sm:mx-0 max-w-max sm:max-w-none">
              {CONTENT.about.slogan}
            </p>
          </AnimatedElement>

          <div className="space-y-3 text-gray-700 leading-relaxed text-sm sm:text-base px-1">
            {CONTENT.about.paragraphs.map((paragraph, index) => (
              <AnimatedElement key={index} delay={500 + index * 100}>
                <p className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-blue-300 before:to-blue-500 before:rounded-full text-left">
                  {paragraph}
                </p>
              </AnimatedElement>
            ))}
          </div>

          <AnimatedElement delay={700} className="pt-4 flex flex-col gap-3">
            <a
              href={CONTENT.about.buttonLink}
              className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-md text-center w-full group"
            >
              <span>{CONTENT.about.buttonText}</span>
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            <a
              href={`tel:${CONTENT.about.phoneNumber}`}
              className="flex items-center justify-center bg-white border-2 border-blue-500 text-blue-600 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-all text-center shadow-sm w-full hover:scale-[1.02] active:scale-[0.98] duration-150"
            >
              <CallIcon className="w-4 h-4 mr-2" />
              <span>Gọi: {CONTENT.about.phoneNumber}</span>
            </a>
          </AnimatedElement>
        </div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 w-full overflow-hidden">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
        <path
          fill="#047857"
          d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"
        ></path>
      </svg>
    </div>
  </section>
);

const StatsSection: React.FC = () => (
  <section className="stats-section bg-gradient-to-r from-blue-700 to-blue-600 text-white py-12 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>

    <div className="container mx-auto px-4 relative z-10">
      <AnimatedElement className="text-center mb-6">
        <h3 className="text-xl font-bold text-white drop-shadow">Thành tựu của chúng tôi</h3>
      </AnimatedElement>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {CONTENT.stats.map((stat, index) => (
          <StatItem key={index} {...stat} index={index} />
        ))}
      </div>
    </div>
  </section>
);

const CTASection: React.FC = () => (
  <section className="py-8 bg-white relative">
    <div className="container mx-auto px-4">
      <AnimatedElement className="transform">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-blue-800">{CONTENT.cta.title}</h3>
            <p className="text-sm text-gray-600">{CONTENT.cta.description}</p>

            <a
              href={`tel:${CONTENT.cta.phoneNumber}`}
              className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md text-base w-full max-w-xs mx-auto transform hover:scale-[1.02] active:scale-[0.98] duration-200"
            >
              <CallIcon className="w-4 h-4 mr-2" />
              <span>{CONTENT.cta.phoneText}</span>
            </a>
          </div>
        </div>
      </AnimatedElement>
    </div>
  </section>
);

const ClinicsSection: React.FC<{ clinics: Clinic[] }> = ({ clinics }) => (
  <div className="py-10 bg-white">
    <div className="container mx-auto px-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <div>
          <AnimatedElement className="flex flex-col items-center justify-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 pulse-animation">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">{CONTENT.sections.general}</h2>
            <div className="h-1 w-16 bg-orange-400 rounded-full my-2"></div>
          </AnimatedElement>

          <div className="space-y-4">
            {clinics.map((clinic, index) => (
              <AnimatedElement key={clinic.id} delay={index * 100 + 200}>
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <ClinicCard clinic={clinic} />
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </Suspense>
    </div>
  </div>
);

export default function AboutPage() {
  const generalClinics = getClinicsByType('general');

  // Setup for animation observers
  useEffect(() => {
    // Observer for stats items animation
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statsItems = document.querySelectorAll('.stats-item');
            statsItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('animate-in');
              }, index * 100);
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    return () => {
      if (statsSection) {
        statsObserver.unobserve(statsSection);
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <HeroSection />
      <StatsSection />
      <CTASection />
      <ClinicsSection clinics={generalClinics} />
    </div>
  );
}
