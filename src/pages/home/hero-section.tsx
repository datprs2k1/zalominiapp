import { useState } from 'react';
import TransitionLink from '@/components/transition-link';
import { TYPOGRAPHY } from '@/styles/medical-design-system';

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className }: HeroSectionProps) => {
  // Simplified quick access features - reduced from 4 to 3 for better focus
  const quickFeatures = [
    {
      id: 'appointments',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z M9 11h6 M9 15h6',
      label: 'Đặt lịch',
      bgColor: 'from-[#2563EB] to-[#1E40AF]',
      textColor: 'text-[#2563EB]',
      hoverColor: 'hover:text-[#1E40AF]',
      ariaLabel: 'Đặt lịch khám bệnh',
      route: '/booking',
    },
    {
      id: 'doctors',
      icon: 'M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z M16 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
      label: 'Bác sĩ',
      bgColor: 'from-[#10B981] to-[#059669]',
      textColor: 'text-[#10B981]',
      hoverColor: 'hover:text-[#059669]',
      ariaLabel: 'Tìm bác sĩ chuyên khoa',
      route: '/doctor',
    },
    {
      id: 'services',
      icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
      label: 'Dịch vụ',
      bgColor: 'from-[#0891B2] to-[#0E7490]',
      textColor: 'text-[#0891B2]',
      hoverColor: 'hover:text-[#0E7490]',
      ariaLabel: 'Dịch vụ y tế và khám chữa bệnh',
      route: '/services',
    },
  ];

  // Simplified benefits - reduced from 4 to 2 for better focus
  const serviceBenefits = [
    {
      title: 'Đội ngũ chuyên môn',
      description: 'Bác sĩ giàu kinh nghiệm, tận tâm chăm sóc',
      icon: 'M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z M16 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
      bgColor: 'bg-[#EFF6FF]',
      iconColor: 'text-[#2563EB]',
      ariaLabel: 'Đội ngũ y bác sĩ chuyên nghiệp',
    },
    {
      title: 'Công nghệ hiện đại',
      description: 'Trang thiết bị y tế tiên tiến, chính xác cao',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6z M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z',
      bgColor: 'bg-[#ECFEFF]',
      iconColor: 'text-[#0891B2]',
      ariaLabel: 'Công nghệ y tế hiện đại',
    },
  ];

  // Single banner image - simplified from carousel
  const bannerImage = 'https://benhvienhoabinh.vn/wp-content/uploads/2024/11/HB6.jpg';

  return (
    <section className={`relative pt-0 pb-0 ${className ?? ''}`}>
      <div className="relative w-full overflow-hidden bg-[#FAFBFC] rounded-3xl border border-[#E5E9ED]/30 shadow-[0_8px_24px_rgba(37,99,235,0.06)]">
        {/* Mobile-First Medical Content Area */}
        <div className="pb-4 mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 lg:pb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8 lg:mt-6">
            {/* Mobile-Optimized Medical Banner */}
            <div className="rounded-2xl lg:rounded-3xl overflow-hidden mt-3 mb-4 relative shadow-lg lg:shadow-xl border border-[#E5E9ED]/20 lg:w-3/5 lg:mb-0 lg:mt-4">
              <div className="relative h-[180px] sm:h-[200px] lg:h-[280px]">
                <img
                  src={bannerImage}
                  alt="Bệnh Viện Hòa Bình - Chăm sóc sức khỏe chuyên nghiệp"
                  className="w-full h-full object-cover"
                />
                {/* Simplified overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1E40AF]/85 via-[#2563EB]/70 to-[#0891B2]/30"></div>

                {/* Simplified Medical Cross Pattern */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="text-[#0891B2]">
                    <path d="M40 15v50M15 40h50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                {/* Simplified Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-start p-6 z-10 lg:p-10">
                  <div className="max-w-[280px] lg:max-w-lg">
                    {/* Hospital Badge */}
                    <div className="inline-flex items-center bg-[#FAFBFC]/25 backdrop-blur-md px-3 py-1.5 rounded-full mb-4 border border-[#0891B2]/40 shadow-lg lg:px-4 lg:py-2">
                      <svg
                        className="h-4 w-4 text-[#0891B2] mr-1.5 lg:h-5 lg:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-label="Chất lượng y tế cao cấp"
                        role="img"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-xs font-semibold text-white drop-shadow-sm lg:text-sm">
                        Chất lượng cao cấp
                      </span>
                    </div>

                    {/* Simplified Slogan */}
                    <h2 className="font-bold text-white leading-tight mb-5 lg:mb-6 drop-shadow-lg">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center mb-1">
                          <div className="w-1 h-6 bg-[#0891B2] mr-2 rounded-full lg:h-8 lg:w-1.5 shadow-lg"></div>
                          <span className="text-[#0891B2] font-extrabold text-xl lg:text-3xl drop-shadow-md">
                            Trị bệnh bằng khối óc
                          </span>
                        </div>
                        <span className="text-white text-lg ml-3 lg:text-2xl lg:ml-4 drop-shadow-md">
                          Chăm sóc bằng trái tim
                        </span>
                      </div>
                    </h2>

                    {/* Primary CTA Button */}
                    <TransitionLink to="/booking">
                      <button className="bg-gradient-to-r from-[#0891B2] to-[#2563EB] text-white font-semibold py-3 px-6 rounded-xl shadow-xl hover:shadow-[#0891B2]/40 active:scale-95 transition-all duration-200 flex items-center justify-center w-full lg:text-lg lg:py-4 border border-white/20 backdrop-blur-sm hover:from-[#0E7490] hover:to-[#1E40AF]">
                        <svg
                          className="h-5 w-5 mr-2 lg:h-6 lg:w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-label="Đặt lịch khám bệnh"
                          role="img"
                        >
                          <path
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path d="M9 11h6M9 15h6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="tracking-wide font-bold">ĐẶT LỊCH NGAY</span>
                      </button>
                    </TransitionLink>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Right Column */}
            <div className="lg:w-2/5 lg:pt-2">
              {/* Mobile-Optimized Quick Access */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  <h3 className={`${TYPOGRAPHY.sectionSubtitle} text-base sm:text-lg`}>Truy cập nhanh</h3>
                  <div className="w-1.5 h-1.5 bg-[#0891B2] rounded-full ml-2 animate-pulse lg:w-2 lg:h-2"></div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                  {quickFeatures.map((feature) => (
                    <TransitionLink key={feature.id} to={feature.route}>
                      <button className="flex flex-col items-center group relative focus:outline-none w-full min-h-[80px] sm:min-h-[90px]">
                        <div
                          className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[90px] lg:h-[90px] bg-gradient-to-br ${feature.bgColor} rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg transform transition-all duration-200 group-hover:scale-105 group-active:scale-95 border border-white/20`}
                        >
                          <svg
                            className="h-7 w-7 sm:h-8 sm:w-8 text-white lg:h-10 lg:w-10 drop-shadow-sm"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            aria-label={feature.ariaLabel}
                            role="img"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                          </svg>
                        </div>
                        <span
                          className={`text-xs sm:text-sm font-semibold transition-colors duration-200 ${feature.textColor} ${feature.hoverColor} text-center leading-tight`}
                        >
                          {feature.label}
                        </span>
                      </button>
                    </TransitionLink>
                  ))}
                </div>
              </div>

              {/* Mobile-Optimized Benefits Section */}
              <div>
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-1 h-5 sm:w-1.5 sm:h-6 bg-gradient-to-b from-[#2563EB] to-[#0891B2] rounded-full mr-2 shadow-sm"></div>
                  <h3 className={`${TYPOGRAPHY.sectionSubtitle} text-base sm:text-lg`}>Tại sao chọn chúng tôi</h3>
                </div>

                {/* Mobile-Optimized Benefits Cards */}
                <div className="bg-[#FAFBFC] rounded-xl sm:rounded-2xl shadow-md border border-[#E5E9ED]/30 p-3 sm:p-4 lg:p-5">
                  <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:gap-6">
                    {serviceBenefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex gap-2.5 sm:gap-3 items-start flex-1 p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:bg-white/60 lg:p-4"
                      >
                        {/* Mobile-Optimized Icon */}
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${benefit.bgColor} rounded-full flex items-center justify-center shrink-0 lg:w-12 lg:h-12 shadow-sm`}
                        >
                          <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${benefit.iconColor} lg:w-6 lg:h-6`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            aria-label={benefit.ariaLabel}
                            role="img"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d={benefit.icon} />
                          </svg>
                        </div>

                        {/* Mobile-Optimized Content */}
                        <div className="flex-1">
                          <h4 className={`${TYPOGRAPHY.cardTitleSmall} text-sm sm:text-base`}>{benefit.title}</h4>
                          <p className={`${TYPOGRAPHY.bodySmall} mt-0.5 sm:mt-1 text-xs sm:text-sm`}>
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Simplified animations with better performance */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Accessibility support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Clean hover effects */
        .hover-lift:hover {
          transform: translateY(-2px);
        }

        .hover-scale:hover {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
